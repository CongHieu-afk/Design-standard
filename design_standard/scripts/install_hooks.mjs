#!/usr/bin/env node
// design_standard — cài / gỡ hook git pre-push cho một dự án (09 §4).
//   node design_standard/scripts/install_hooks.mjs [--project <thư mục chứa design.config.json>]
//   node design_standard/scripts/install_hooks.mjs --uninstall [--project <...>]
// Một kho git có thể có nhiều dự án: chạy lại cho từng dự án, hook kiểm lần lượt.
// Hook pre-push có sẵn (không do script này tạo) được đổi tên thành pre-push.before-design-standard và vẫn chạy trước.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

const MARK = '# design-standard managed hook';
const BACKUP = 'pre-push.before-design-standard';
const { values } = parseArgs({ options: { project: { type: 'string', default: '.' }, uninstall: { type: 'boolean', default: false } } });
const posix = (p) => p.split(path.sep).join('/');
const fail = (m) => { console.error(`Lỗi: ${m}`); process.exit(2); };

const proj = path.resolve(values.project);
const git = (...a) => execFileSync('git', a, { cwd: proj, encoding: 'utf8' }).trim();
let root;
try { root = git('rev-parse', '--show-toplevel'); } catch { fail(`${proj} không nằm trong kho git.`); }
// core.hooksPath: chỉ chấp nhận khi đặt ở cấp kho (local). Đặt toàn máy (global/system) thì hook dùng chung
// cho mọi kho — chèn đường dẫn của kho này vào đó sẽ làm hỏng kho khác. Husky tự quản lý thư mục hook.
let scope = '';
try { scope = git('config', '--show-scope', '--get', 'core.hooksPath'); } catch { /* không đặt */ }
if (scope) {
  const [where, ...rest] = scope.split(/\s+/);
  const val = rest.join(' ');
  if (where !== 'local') fail(`core.hooksPath đặt ở cấp ${where} (${val}). Không cài vào thư mục hook dùng chung; thêm tay vào hook của bạn dòng: node <design_standard>/scripts/prepush.mjs --project <dự án>`);
  if (/(^|[\\/])\.husky([\\/]|$)/.test(val)) fail(`Kho dùng husky (${val}). Thêm vào .husky/pre-push dòng: node ${posix(path.relative(root, path.join(path.dirname(fileURLToPath(import.meta.url)), 'prepush.mjs')))} --project "${posix(path.relative(root, proj)) || '.'}"`);
}
const hooksDir = path.resolve(proj, git('rev-parse', '--git-path', 'hooks'));
fs.mkdirSync(hooksDir, { recursive: true });
const hook = path.join(hooksDir, 'pre-push');

const rel = (p) => { const r = path.relative(root, p); return r.startsWith('..') || path.isAbsolute(r) ? posix(p) : `$ROOT/${posix(r) || '.'}`; };
const prepush = rel(path.join(path.dirname(fileURLToPath(import.meta.url)), 'prepush.mjs'));
// Thiếu prepush.mjs (bộ chuẩn bị đổi tên/chuyển chỗ): in cảnh báo, không im lặng cho qua.
const line = `if [ -f "${prepush}" ]; then node "${prepush}" --project "${rel(proj)}" || FAIL=1; else echo "[design_standard] không thấy ${prepush}; push bị chặn" >&2; FAIL=1; fi`;

const existing = fs.existsSync(hook) ? fs.readFileSync(hook, 'utf8') : '';
const managed = existing.includes(MARK);
let lines = managed ? existing.split('\n').filter((l) => l.includes('prepush.mjs') && l.includes('--project')) : [];

if (values.uninstall) {
  if (!managed) { console.log('Không có hook do design-standard cài. Không làm gì.'); process.exit(0); }
  // Khớp theo dự án, không theo nguyên dòng: dòng do bản cài cũ (định dạng khác) cũng được gỡ.
  const mine = (l) => l.includes(`--project "${rel(proj)}"`);
  if (!lines.some(mine)) { console.log(`Hook không kiểm dự án ${rel(proj)}. Không làm gì.`); process.exit(0); }
  lines = lines.filter((l) => !mine(l));
  if (lines.length) {
    console.log(`Đã gỡ dự án ${rel(proj)}; hook vẫn kiểm ${lines.length} dự án khác.`);
  } else {
    fs.rmSync(hook);
    const bak = path.join(hooksDir, BACKUP);
    if (fs.existsSync(bak)) { fs.renameSync(bak, hook); console.log('Đã gỡ hook và trả lại hook pre-push cũ.'); }
    else console.log('Đã gỡ hook pre-push.');
    process.exit(0);
  }
} else {
  if (!fs.existsSync(path.join(proj, 'design.config.json'))) fail(`Không thấy ${path.join(proj, 'design.config.json')}. Tạo config trước (02 §4).`);
  if (existing && !managed) {
    const bak = path.join(hooksDir, BACKUP);
    if (fs.existsSync(bak)) fail(`Đã có ${bak}; xử lý tay trước khi cài.`);
    fs.renameSync(hook, bak);
    console.log(`Hook pre-push cũ → ${bak} (vẫn chạy trước).`);
  }
  // Thay dòng cũ của cùng dự án (kể cả định dạng cũ) bằng dòng mới, không để dự án chạy hai lần.
  lines = lines.filter((l) => !l.includes(`--project "${rel(proj)}"`));
  lines.push(line);
}

const body = `#!/bin/sh
${MARK} — tạo bởi design_standard/scripts/install_hooks.mjs. Gỡ: node <design_standard>/scripts/install_hooks.mjs --uninstall
HOOK_DIR=$(dirname "$0")
if [ -x "$HOOK_DIR/${BACKUP}" ]; then
  "$HOOK_DIR/${BACKUP}" "$@" || exit $?
fi
if ! command -v node >/dev/null 2>&1; then
  echo "[design-standard] Không có node trong PATH; push bị chặn."
  exit 1
fi
ROOT=$(git rev-parse --show-toplevel)
FAIL=0
${lines.join('\n')}
if [ $FAIL -ne 0 ]; then
  echo "[design-standard] Push bị chặn. Sửa lỗi ở trên rồi chạy lại."
fi
exit $FAIL
`;
fs.writeFileSync(hook, body, { mode: 0o755 });
try { fs.chmodSync(hook, 0o755); } catch { /* Windows */ }
console.log(`${values.uninstall ? 'Đã cập nhật' : 'Đã cài'} ${hook} (kiểm ${lines.length} dự án).`);
