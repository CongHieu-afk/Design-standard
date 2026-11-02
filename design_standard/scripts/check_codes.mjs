// Rà mã dấu hiệu (G1-01, G2-09d, S-03…) trong các file chuẩn: mọi mã được nhắc phải có trong danh mục 07 §4 (2.4).
// Lần chạy thử 2.3: 03 `detail` còn "Tránh: S-02" — mã đã gộp vào G2-16 từ 2.2.
// Chạy: node scripts/check_codes.mjs   (mã thoát 1 khi có mã treo)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CODE = /\b([GSDC]\d?-\d\d[a-z]?)\b/g;
const src = fs.readFileSync(path.join(root, '07_CHONG_AI_SLOP.md'), 'utf8');
const sec = src.slice(src.indexOf('## 4.'), src.indexOf('## 5.'));
const defined = new Set();
for (const line of sec.split('\n')) {
  if (!line.startsWith('| ')) continue;
  const cell = line.split('|')[1];
  for (const m of cell.matchAll(CODE)) defined.add(m[1]);
  const r = /(G\d)-(\d\d)…G\d-(\d\d)/.exec(cell); // dải "G3-01…G3-04"
  if (r) for (let i = +r[2]; i <= +r[3]; i++) defined.add(`${r[1]}-${String(i).padStart(2, '0')}`);
}
// CHANGELOG và báo cáo đánh giá cũ được phép nhắc mã đã bỏ (lịch sử).
const files = fs.readdirSync(root).filter((f) => f.endsWith('.md') && f !== 'CHANGELOG.md' && !f.startsWith('DANH_GIA'));
let bad = 0;
for (const f of files) {
  fs.readFileSync(path.join(root, f), 'utf8').split('\n').forEach((line, i) => {
    for (const m of line.matchAll(CODE)) {
      if (defined.has(m[1])) continue;
      bad++;
      console.log(`${f}:${i + 1}  ${m[1]} không có trong 07 §4 — ${line.trim().slice(0, 100)}`);
    }
  });
}
console.log(bad ? `${bad} mã treo.` : `OK — ${defined.size} mã trong 07 §4, không có mã treo.`);
process.exit(bad ? 1 : 0);
