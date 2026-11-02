// Xuất token dự án → DESIGN.md (2.9, ưu tiên 2 của PHAN_TICH_CLAUDE_DESIGN_OPEN_DESIGN_HUASHU.md).
// Lý do: vòng 2.7 Stitch tự đoán màu/chữ → bản mẫu lệch bảng màu đã lấy từ ảnh đề tài. DESIGN.md (định dạng open-design,
// cũng là đầu vào `upload_design_md` + `create_design_system_from_design_md` của Stitch) cho Stitch sinh ĐÚNG token của ta.
// Dùng:
//   node xuat_design_md.mjs <file.css> --name "<tên>" [--mo-ta <file.md>] [--map vai=--bien ...] [--out DESIGN.md]
//   node xuat_design_md.mjs --so-sanh <DESIGN.md của ta> <designMd Stitch trả về (.md)>   # màu Stitch có khớp token không
// Đọc khối `:root { … }` đầu tiên. Sổ gu (GU_NGUOI_DUNG.md, phạm vi "Mọi …") đi kèm thành mục Do/Don't.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

// Vai trò Stitch ← tên biến CSS hay gặp trong kho (lấy biến đầu tiên có mặt). --map ghi đè.
const ROLES = {
  background: ['--bg', '--c-canvas', '--canvas', '--background'],
  surface: ['--surface', '--card', '--c-surface'],
  'on-surface': ['--text', '--c-brown', '--foreground', '--ink'],
  'on-surface-variant': ['--muted', '--c-secondary', '--muted-foreground'],
  outline: ['--line', '--border', '--c-line'],
  primary: ['--accent', '--primary', '--c-primary'],
  'on-primary': ['--accent-ink', '--primary-foreground', '--on-accent'],
  error: ['--danger', '--c-danger', '--destructive'],
};

export function readRootVars(css) {
  const m = /:root\s*\{([^}]*)\}/.exec(css);
  if (!m) return {};
  const vars = {};
  for (const d of m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) vars[d[1]] = d[2].trim();
  return vars;
}

const isColor = (v) => /^(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|oklch\()/i.test(v);
const firstFont = (v) => v && v.split(',')[0].replace(/['"]/g, '').trim();

export function buildDesignMd(vars, { name, moTa = '', map = {}, gu = [] }) {
  const colors = {}, used = new Set(), missing = [];
  for (const [role, cands] of Object.entries(ROLES)) {
    const v = map[role] || cands.find((c) => vars[c] && isColor(vars[c]));
    if (v && vars[v]) { colors[role] = vars[v]; used.add(v); } else missing.push(role);
  }
  if (colors['on-surface']) colors['on-background'] = colors['on-surface'];
  const extra = Object.entries(vars).filter(([k, v]) => isColor(v) && !used.has(k));
  const key = (k) => k.replace(/^--(c-)?/, '');
  for (const [k, v] of extra) colors[key(k)] ??= v;

  const display = firstFont(vars['--font-display']), body = firstFont(vars['--font-body']) || display;
  const weight = vars['--display-weight'] || '600';
  const radius = vars['--radius'];
  const q = (s) => `'${String(s).replace(/'/g, "''")}'`;

  const y = ['---', `name: ${q(name)}`, 'colors:'];
  for (const [k, v] of Object.entries(colors)) y.push(`  ${k}: ${q(v)}`);
  if (display || body) {
    y.push('typography:');
    if (display) y.push('  headline-lg:', `    fontFamily: ${display}`, `    fontWeight: ${q(weight)}`);
    if (body) y.push('  body-md:', `    fontFamily: ${body}`, "    fontWeight: '400'", '    lineHeight: 1.6');
  }
  if (radius) y.push('rounded:', `  DEFAULT: ${radius}`);
  y.push('---', '');

  const b = [`## Brand & Style`, moTa.trim() || `(Chưa có mô tả — truyền --mo-ta <file.md>, ví dụ đoạn hướng trong design-gates/huong-da-chon.md.)`, ''];
  b.push('## Colors', 'Dùng đúng các mã màu trong front matter; không tự sinh bảng màu khác. Màu lấy từ ảnh đề tài (design_standard 04 §3).');
  for (const [k, v] of extra) b.push(`- \`${key(k)}\` (CSS \`${k}\`): \`${v}\``);
  b.push('', "## Do's and Don'ts", '- Chữ thường đạt WCAG AA (4.5:1); tiếng Việt đủ dấu, font hỗ trợ tiếng Việt.');
  for (const g of gu) b.push(`- Người dùng: ${g}`);
  b.push('');
  return { md: y.join('\n') + '\n' + b.join('\n'), missing };
}

// Sổ gu: các dòng phạm vi "Mọi …" (áp cho mọi trang) — cả ô nguyên văn (giữ phần "→ đã thống nhất"), bỏ câu bị gạch.
export function readGu(file = path.join(HERE, '..', 'GU_NGUOI_DUNG.md')) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8').split('\n')
    .filter((l) => /^\| GU-\d+/.test(l) && !/~~/.test(l))
    .map((l) => l.split('|').map((c) => c.trim()))
    .filter((c) => /^Mọi/.test(c[4] || ''))
    .map((c) => c[3]).filter(Boolean);
}

// So theo VAI TRÒ, không theo tập mã màu: Stitch hay giữ mã của ta nhưng dời sang vai khác (primary → primary-container).
const roleMap = (md) => {
  const fm = /^---\n([\s\S]*?)\n---/.exec(md);
  return Object.fromEntries([...(fm ? fm[1] : '').matchAll(/^\s+([\w-]+):\s*'?(#[0-9a-f]{6})\b/gim)].map((m) => [m[1], m[2].toLowerCase()]));
};
/** Vai trò màu của ta mà Stitch đổi giá trị hoặc bỏ: [{vai, ta, stitch}]. Rỗng = khớp. */
export function compareColors(ours, theirs) {
  const t = roleMap(theirs);
  return Object.entries(roleMap(ours)).filter(([k, v]) => t[k] !== v).map(([k, v]) => ({ vai: k, ta: v, stitch: t[k] || '(bỏ)' }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: {
    name: { type: 'string' }, 'mo-ta': { type: 'string' }, out: { type: 'string', default: 'DESIGN.md' },
    map: { type: 'string', multiple: true, default: [] }, 'so-sanh': { type: 'boolean', default: false } } });

  if (values['so-sanh']) {
    const [a, b] = positionals;
    if (!a || !b) { console.error('Cần 2 file: <DESIGN.md của ta> <designMd Stitch>'); process.exit(2); }
    const lech = compareColors(fs.readFileSync(a, 'utf8'), fs.readFileSync(b, 'utf8'));
    if (lech.length) { console.log(`Stitch LỆCH ${lech.length} vai trò màu:`); for (const l of lech) console.log(` - ${l.vai}: ta ${l.ta} → Stitch ${l.stitch}`); process.exit(1); }
    console.log('Màu Stitch khớp token.'); process.exit(0);
  }

  const css = positionals[0];
  if (!css || !values.name) { console.error('Dùng: node xuat_design_md.mjs <file.css> --name "<tên>" [--mo-ta f.md] [--map vai=--bien] [--out DESIGN.md]'); process.exit(2); }
  const map = Object.fromEntries(values.map.map((s) => s.split('=')));
  const vars = readRootVars(fs.readFileSync(css, 'utf8'));
  if (!Object.keys(vars).length) { console.error(`Không thấy khối :root trong ${css}`); process.exit(1); }
  const moTa = values['mo-ta'] ? fs.readFileSync(values['mo-ta'], 'utf8') : '';
  const { md, missing } = buildDesignMd(vars, { name: values.name, moTa, map, gu: readGu() });
  fs.writeFileSync(values.out, md);
  console.log(`Đã ghi ${values.out}`);
  if (missing.length) console.log(`Thiếu vai trò màu (thêm --map vai=--bien nếu dự án có): ${missing.join(', ')}`);
}
