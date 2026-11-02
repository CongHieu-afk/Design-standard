# Dự án mẫu: Rang Mộc

Ví dụ áp bộ chuẩn từ đầu đến cuối cho một sản phẩm **hư cấu**: lò rang cà phê nhỏ bán hàng online. Mục đích: cho người và agent thấy một trang E2 và một màn hình E0 "không giống AI" trông ra sao, kèm các tài liệu đi cùng. **Không sao chép phong cách** sang dự án khác — sao chép cách ra quyết định.

| File | Nội dung |
| --- | --- |
| [brief.md](brief.md) | Brief (chặng 0) |
| [direction.md](direction.md) | Thẻ hướng thị giác, lý do, vân tay, phép thử T1–T11 tự chấm (chặng 2, G2); vân tay đã ghi vào [FINGERPRINTS.md](../../FINGERPRINTS.md) |
| [tokens.json](tokens.json) | Token; `node ../../scripts/check_tokens.mjs tokens.json --config design.config.json` → 12/12 cặp đạt |
| [design.config.json](design.config.json) | Khai báo 2 màn hình |
| [home.html](home.html) | Trang chủ — `home`, hạng C, E2 |
| [admin-orders.html](admin-orders.html) | Danh sách đơn hàng cho nhân viên — `list`, hạng B, E0 |
| [screenshots/](screenshots/) | Ảnh chụp 1440 và 360px |

Chạy thử:

```bash
cd design_standard/examples/rang-moc
npx serve -l 8770 .          # hoặc: python -m http.server 8770
node ../../scripts/audit.mjs --config design.config.json --base http://localhost:8770
```

Cần `playwright` và `@axe-core/playwright` (cài trong thư mục này hoặc thư mục cha: `npm i -D playwright @axe-core/playwright && npx playwright install chromium`).

Kết quả khi soạn (28/10/2026, môi trường không có axe-core, không tải được Google Fonts): 0 blocker; 2 major là lỗi tải font do mạng bị chặn; phóng to 200%, text-spacing, tắt JS đều đạt. axe-core không cài được trong môi trường soạn.

Kiểm axe-core thật (28/10/2026): axe-core 4.10.2 chạy trong trình duyệt Chromium trên máy người dùng, tag `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`, font Google tải đủ:

| Trang | Bề rộng | Vi phạm | Luật đạt | Cần xem tay |
| --- | --- | --- | --- | --- |
| home | 1280 | 0 | 29 | `color-contrast` × 13: nhãn chữ trong SVG biểu đồ (axe không đo được nền trong SVG) |
| home | 375 | 0 | 29 | `color-contrast` × 11: như trên |
| admin-orders | 1280 | 0 | 30 | `color-contrast` × 1: mũi tên sắp xếp `aria-hidden` |
| admin-orders | 375 | 0 | 29 | 0 |

Nhãn trong SVG dùng `--ink` (#15181a) hoặc `--ink-2` (#4a5157) trên nền trắng: 17,8:1 và 8,1:1, đạt 4,5:1 (đã đo bằng `check_tokens.mjs`). Lần chạy này nhúng trang vào khung để chạy axe, không qua `audit.mjs`; trên máy có `@axe-core/playwright` hãy chạy lại lệnh ở trên. Ảnh trong `screenshots/` vì vậy dùng font dự phòng; trên máy có mạng sẽ hiện Archivo và IBM Plex Mono.

Các trang đích như `lo-rang.html`, `don-hang.html` không có trong mẫu.
