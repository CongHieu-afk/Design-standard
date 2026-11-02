// Rút bảng màu từ ảnh thật của đề tài (2.7, 04 §3): k-means 8 cụm trên các ảnh, in mã hex, độ bão hoà, tỉ lệ.
// Dùng: node design_standard/scripts/bang_mau.mjs <url-ảnh-1> <url-ảnh-2> ...   (ảnh phải cho phép CORS, ví dụ images.unsplash.com)
// Màu bão hoà cao, tỉ lệ đáng kể → ứng viên màu nhấn/màu phụ; màu tỉ lệ lớn, bão hoà thấp → nền/bề mặt.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const urls = process.argv.slice(2);
if (!urls.length) { console.error('Cần ít nhất một URL ảnh.'); process.exit(2); }
const b = await chromium.launch();
const p = await b.newPage();
const res = await p.evaluate(async (urls) => {
  const px = [];
  for (const u of urls) {
    const img = new Image(); img.crossOrigin = 'anonymous'; img.src = u;
    await img.decode();
    const c = document.createElement('canvas'); c.width = 60; c.height = Math.max(1, Math.round(60 * img.height / img.width));
    const x = c.getContext('2d'); x.drawImage(img, 0, 0, c.width, c.height);
    const d = x.getImageData(0, 0, c.width, c.height).data;
    for (let i = 0; i < d.length; i += 4) px.push([d[i], d[i + 1], d[i + 2]]);
  }
  let cs = Array.from({ length: 8 }, (_, i) => px[Math.floor(i * px.length / 8)].slice());
  for (let it = 0; it < 12; it++) {
    const acc = cs.map(() => [0, 0, 0, 0]);
    for (const q of px) { let bi = 0, bd = 1e9; cs.forEach((c, j) => { const dd = (c[0] - q[0]) ** 2 + (c[1] - q[1]) ** 2 + (c[2] - q[2]) ** 2; if (dd < bd) { bd = dd; bi = j; } }); const a = acc[bi]; a[0] += q[0]; a[1] += q[1]; a[2] += q[2]; a[3]++; }
    cs = acc.map((a, j) => (a[3] ? [a[0] / a[3], a[1] / a[3], a[2] / a[3], a[3]] : cs[j]));
  }
  const hex = (c) => '#' + c.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  const total = px.length;
  return cs.map((c) => { const mx = Math.max(...c.slice(0, 3)), mn = Math.min(...c.slice(0, 3)); return { hex: hex(c), bao_hoa: +((mx - mn) / (mx || 1)).toFixed(2), ti_le: +(c[3] / total).toFixed(2) }; }).sort((a, b) => b.ti_le - a.ti_le);
}, urls);
console.table(res);
await b.close();
