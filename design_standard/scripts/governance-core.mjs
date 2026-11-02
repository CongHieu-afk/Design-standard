import path from 'node:path';

const DAY = 86_400_000;

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
  if (!config.preview?.url || !config.preview?.command) problems.push('preview cần url và command.');
  if (!Array.isArray(config.verify?.commands) || config.verify.commands.length === 0) problems.push('verify.commands phải có ít nhất một lệnh test/build.');
  if (!Array.isArray(config.screens) || config.screens.length === 0) return [...problems, 'screens phải có ít nhất một màn hình.'];

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
    if (!Array.isArray(screen?.states)) problems.push(`${at} phải khai states (dùng [] khi không có trạng thái phụ).`);
    if (screen?.id && ids.has(screen.id)) problems.push(`${at} trùng id "${screen.id}".`);
    if (screen?.id) ids.add(screen.id);
  }
  if (config.screens.some((screen) => ['E2', 'E3'].includes(String(screen.expression).toUpperCase())) && !config.gates) {
    problems.push('Màn E2/E3 bắt buộc khai gates.');
  }
  return problems;
}

const normalize = (value) => value.replaceAll('\\', '/').replace(/^\.\//, '');

export function validateChangedCoverage(changedFiles, screens) {
  const prefixes = (screens || []).flatMap((screen) => screen.source || []).map(normalize);
  return changedFiles
    .map(normalize)
    .filter((file) => /\.(?:css|html?|jsx?|tsx?|vue|svelte|dart)$/.test(path.extname(file) ? file : ''))
    .filter((file) => !prefixes.some((prefix) => prefix.endsWith('/') ? file.startsWith(prefix) : file === prefix));
}
