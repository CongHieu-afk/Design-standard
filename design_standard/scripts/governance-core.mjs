const DAY = 86_400_000;
const normalize = (value) => typeof value === 'string'
  ? value.trim().replaceAll('\\', '/').replace(/^(?:\.\/)+/, '').replace(/\/+$/, '')
  : '';
const isSafeRelativePath = (value) => {
  const normalized = normalize(value);
  if (!normalized || normalized === '.' || normalized.startsWith('/') || /^[A-Za-z]:\//.test(normalized)) return false;
  return normalized.split('/').every((segment) => segment !== '' && segment !== '.' && segment !== '..');
};
const containsPath = (root, file) => root !== '' && (file === root || file.startsWith(`${root}/`));

export function auditVerdict({ findings = [], requiredMissing = [] } = {}) {
  const active = findings.filter((finding) => !finding.waived);
  const blockers = active.filter((finding) => finding.severity === 'blocker').length;
  const majors = active.filter((finding) => finding.severity === 'major').length;
  const reasons = [];
  if (blockers) reasons.push(`${blockers} blocker`);
  if (majors) reasons.push(`${majors} major`);
  reasons.push(...requiredMissing.map((item) => `Chưa chạy kiểm bắt buộc: ${item}`));
  return { ok: reasons.length === 0, reasons };
}

export function canEnterBaseline(finding) {
  return finding?.severity === 'minor';
}

export function validateWaiver(waiver, { now = new Date() } = {}) {
  const problems = [];
  if (!waiver || typeof waiver !== 'object') return ['Ngoại lệ phải là object.'];
  if (waiver.severity !== 'minor') problems.push('Ngoại lệ cục bộ chỉ áp dụng cho minor.');
  if (!waiver.finding) problems.push('Thiếu finding.');
  if (!waiver.reason) problems.push('Thiếu reason.');
  if (!/^@[A-Za-z0-9-]+$/.test(waiver.owner || '')) problems.push('Owner phải là GitHub handle dạng @name.');
  if (!/^https:\/\/github\.com\/[^/]+\/[^/]+\/(issues|pull)\/\d+(?:#.*)?$/.test(waiver.approvalRef || '')) {
    problems.push('approvalRef phải trỏ tới GitHub issue hoặc pull request.');
  }
  const expires = /^\d{4}-\d{2}-\d{2}$/.test(waiver.expires || '') ? new Date(`${waiver.expires}T00:00:00Z`) : null;
  if (!expires || Number.isNaN(expires.valueOf())) problems.push('expires phải có dạng YYYY-MM-DD.');
  else if (expires <= now) problems.push('Ngoại lệ đã hết hạn.');
  else if (expires - now > 365 * DAY) problems.push('Ngoại lệ không được dài hơn 365 ngày.');
  return problems;
}

export function validateManifest(config) {
  const problems = [];
  if (!config || typeof config !== 'object') return ['Config phải là object.'];
  if (!config.language) problems.push('Thiếu language.');
  if (!config.tokens) problems.push('Thiếu tokens.');
  if (!Array.isArray(config.uiRoots) || config.uiRoots.length === 0) problems.push('uiRoots phải có ít nhất một thư mục nguồn UI.');
  if (!config.preview?.url || !config.preview?.command) problems.push('preview cần url và command.');
  if (!Array.isArray(config.verify?.commands) || config.verify.commands.length === 0) problems.push('verify.commands phải có ít nhất một lệnh test/build.');
  if (!Array.isArray(config.screens) || config.screens.length === 0) return [...problems, 'screens phải có ít nhất một màn hình.'];

  const rawUiRoots = Array.isArray(config.uiRoots) ? config.uiRoots : [];
  const uiRoots = rawUiRoots.map(normalize);
  if (rawUiRoots.some((root) => !isSafeRelativePath(root))) problems.push('uiRoots chỉ nhận đường dẫn tương đối chuẩn; không dùng ".", "./", đường dẫn tuyệt đối hoặc "..".');
  const ids = new Set();
  for (const [index, screen] of config.screens.entries()) {
    const at = `screens[${index}]`;
    for (const key of ['id', 'tier', 'type', 'expression']) {
      if (!screen?.[key]) problems.push(`${at} thiếu ${key}.`);
    }
    if ((screen?.platform || 'web') === 'web') {
      if (!screen?.path) problems.push(`${at} thiếu path.`);
      if (!screen?.ready) problems.push(`${at} thiếu ready.`);
    }
    if (!Array.isArray(screen?.source) || screen.source.length === 0) problems.push(`${at} thiếu source.`);
    for (const source of Array.isArray(screen?.source) ? screen.source : []) {
      const normalized = normalize(source);
      if (!isSafeRelativePath(source)) problems.push(`${at}.source phải là đường dẫn tương đối chuẩn; không dùng ".", "./", đường dẫn tuyệt đối hoặc "..".`);
      else if (!uiRoots.some((root) => containsPath(root, normalized))) {
        problems.push(`${at}.source "${source}" không nằm trong uiRoots.`);
      }
    }
    if (!Array.isArray(screen?.states)) problems.push(`${at} phải khai states (dùng [] khi không có trạng thái phụ).`);
    const states = Array.isArray(screen?.states) ? screen.states : [];
    const stateIds = new Set(states.map((state) => state?.id).filter(Boolean));
    const coverage = screen?.stateCoverage;
    const coverageObject = coverage && typeof coverage === 'object' && !Array.isArray(coverage) ? coverage : null;
    if (!coverageObject) problems.push(`${at}.stateCoverage phải là object.`);
    const coverageKeys = new Set(['loading', 'empty', 'error', 'dialog']);
    for (const key of Object.keys(coverageObject || {})) {
      if (!coverageKeys.has(key)) problems.push(`${at}.stateCoverage có khoá lạ "${key}".`);
    }
    for (const kind of ['loading', 'empty', 'error', 'dialog']) {
      const value = coverageObject?.[kind];
      if (typeof value !== 'string') {
        problems.push(`${at}.stateCoverage.${kind} phải là state id hoặc "n/a: <lý do>".`);
      } else if (value.startsWith('n/a:')) {
        if (value.slice(4).trim().length < 8) problems.push(`${at}.stateCoverage.${kind} cần lý do n/a cụ thể.`);
      } else if (!stateIds.has(value)) {
        problems.push(`${at}.stateCoverage.${kind} trỏ state không tồn tại "${value}".`);
      } else if (kind === 'dialog' && !states.find((state) => state?.id === value)?.dialog) {
        problems.push(`${at}.stateCoverage.dialog phải trỏ state có dialog: true.`);
      }
    }
    if (screen?.id && ids.has(screen.id)) problems.push(`${at} trùng id "${screen.id}".`);
    if (screen?.id) ids.add(screen.id);
  }
  if (config.screens.some((screen) => ['E2', 'E3'].includes(String(screen?.expression).toUpperCase())) && !config.gates) {
    problems.push('Màn E2/E3 bắt buộc khai gates.');
  }
  return problems;
}

export function validateChangedCoverage(changedFiles, screens, uiRoots) {
  const prefixes = (Array.isArray(screens) ? screens : []).flatMap((screen) => Array.isArray(screen?.source) ? screen.source : []).filter(isSafeRelativePath).map(normalize);
  const roots = (Array.isArray(uiRoots) ? uiRoots : []).filter(isSafeRelativePath).map(normalize);
  return (Array.isArray(changedFiles) ? changedFiles : [])
    .map(normalize)
    .filter(Boolean)
    .filter((file) => roots.some((root) => containsPath(root, file)))
    .filter((file) => !prefixes.some((prefix) => containsPath(prefix, file)));
}
