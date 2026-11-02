// Kiểm file cổng (2.8, mượn cơ chế "gate file" của huashu-design): file không có / thiếu nội dung tối thiểu = bước chưa làm.
// Lý do: lần chạy thử 2.4–2.7, luật "bảng tham chiếu trước khi dựng" có trong chuẩn nhưng agent bỏ qua ba vòng — không gì chặn.
// Dùng: node design_standard/scripts/check_gates.mjs <thư mục design-gates> [--khong-g2]
//   mặc định có cổng G2 (bắt buộc huong-da-chon.md); --khong-g2: việc không đổi hướng thị giác
// audit.mjs gọi checkGates() khi design.config.json có "gates".
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const read = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch { return null; } };

/** Trả danh sách vấn đề (chuỗi). Rỗng = đủ. */
export function checkGates(dir, { coG2 = true } = {}) {
  const out = [];
  if (!dir || !fs.existsSync(dir)) return [`Không có thư mục cổng ${dir || '(chưa khai báo)'} — tạo theo mẫu design_standard/examples/design-gates/`];

  // 1. Bảng tham chiếu: ≥ 3 trang thật (link http), mỗi dòng có "học được"; nên có ảnh ghép (ref_board.mjs)
  const tc = read(path.join(dir, 'tham-chieu.md'));
  if (tc === null) out.push('Thiếu tham-chieu.md (07 §2 bước 1: ≥ 3 trang thật, làm TRƯỚC khi sinh bản mẫu)');
  else {
    const rows = tc.split('\n').filter((l) => /^\|/.test(l) && /https?:\/\//.test(l));
    if (rows.length < 3) out.push(`tham-chieu.md: ${rows.length} dòng có link trang thật (cần ≥ 3)`);
    const empty = rows.filter((l) => { const c = l.split('|').map((x) => x.trim()).filter(Boolean); return c.length < 2 || c[c.length - 1].length < 8; });
    if (empty.length) out.push(`tham-chieu.md: ${empty.length} dòng chưa ghi "học được gì" (cột cuối)`);
    const img = /\(([^)\s]+\.(?:png|jpe?g|webp))\)|`([^`\s]+\.(?:png|jpe?g|webp))`/i.exec(tc);
    const p = img && (img[1] || img[2]);
    if (!p) out.push('tham-chieu.md: chưa có ảnh ghép trang tham chiếu (chạy scripts/ref_board.mjs, dán đường dẫn ảnh)');
    else if (!fs.existsSync(path.resolve(dir, p))) out.push(`tham-chieu.md: ảnh ghép ${p} không tồn tại`);
  }

  // 2. Hướng đã chọn: ảnh các hướng đã trình + NGUYÊN VĂN câu người dùng/PO chọn
  if (coG2) {
    const hd = read(path.join(dir, 'huong-da-chon.md'));
    if (hd === null) out.push('Thiếu huong-da-chon.md (G2: hướng đã trình + nguyên văn lựa chọn của người dùng)');
    else {
      if (!/Nguyên văn\s*:\s*["“].{2,}["”]/.test(hd)) out.push('huong-da-chon.md: thiếu dòng `Nguyên văn: "…"` (câu người dùng/PO chọn, chép nguyên)');
      if (!/Ảnh\s*:/.test(hd)) out.push('huong-da-chon.md: thiếu dòng `Ảnh:` trỏ tới ảnh các hướng đã trình');
    }
  }

  // 3. Sự thật đã kiểm: mỗi sự thật cụ thể trên trang (năm, số, ngưỡng, phiên bản) có nguồn
  const st = read(path.join(dir, 'su-that.md'));
  if (st === null) out.push('Thiếu su-that.md (sự thật cụ thể trên trang + nguồn đã kiểm; không có thì ghi "Không có sự thật cụ thể")');
  else if (!/Không có sự thật cụ thể/i.test(st)) {
    const rows = st.split('\n').filter((l) => /^\|/.test(l) && !/^\|\s*-/.test(l)).slice(1);
    const noSrc = rows.filter((l) => !/https?:\/\/|`[^`]+\.(md|json|dart|cs|js|ts)`|\.(md|json|dart|cs)\b/i.test(l));
    if (!rows.length) out.push('su-that.md: bảng trống');
    if (noSrc.length) out.push(`su-that.md: ${noSrc.length} sự thật chưa có nguồn (link hoặc file trong kho)`);
  }
  return out;
}

// Chạy trực tiếp
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  const probs = checkGates(dir && path.resolve(dir), { coG2: !process.argv.includes('--khong-g2') });
  if (probs.length) { console.log(`Cổng CHƯA đủ (${probs.length}):`); for (const p of probs) console.log(' - ' + p); process.exit(1); }
  console.log('Cổng đủ: tham chiếu, hướng đã chọn, sự thật.');
}
