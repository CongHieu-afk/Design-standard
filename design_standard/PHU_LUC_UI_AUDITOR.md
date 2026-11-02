# Phụ lục · Việc cần sửa ở tools/ui_auditor

Theo bản thẩm định ngày 28/10/2026 (chạy tool trên 8 trang thử: 4 trang đúng chuẩn bị báo FAIL, 4 trang sai vẫn PASS). Đây là danh sách việc của tool, không phải một phần của chuẩn. Phần lớn việc ở mục P0–P1 đã có trong `scripts/audit.mjs`; có thể chọn bỏ ui_auditor và chỉ giữ luật riêng của nó.

**Trạng thái (1.2):** đã ngừng dùng làm chuẩn; hook pre-commit của tool trong kho PRACTICE đã tắt, bản sao lưu ở `.git/hooks/pre-commit.ui_auditor.bak`. Việc kiểm tự động do `scripts/audit.mjs` làm; phát hiện slop do `impeccable detect` (09 §3).

| Ưu tiên | Việc | Lý do |
| --- | --- | --- |
| P0 | Bỏ dòng "PASS" tự động cho 4 guideline trong báo cáo Flutter | Báo cáo không phản ánh việc test có gọi `meetsGuideline` hay không |
| P0 | Đọc `design.config.json`; rule ID + mức; baseline; ngoại lệ | Ngưỡng theo hạng; áp dụng được cho dự án cũ |
| P0 | Sửa lỗi đã chứng minh: dialog Escape (mở bằng `showModal()`, focus vào dialog); thêm role `meter`, `paragraph`, `code`, `application`…; bỏ miễn trừ mọi `a` trong `li`; bỏ ép tabpanel cao bằng nhau; nhận focus bằng nền/viền/màu chữ; regex "Hủy" nhận cả "Huỷ" | Bắt nhầm và bỏ sót |
| P0 | Không bắt buộc dark mode và `@media print` khi config không yêu cầu | Đúng chuẩn 02 §4 |
| P0 | Hook không ghi đè hook có sẵn; bắt `.tsx/.jsx/.vue/.svelte/.css` bằng build + serve | Hiện bỏ qua dự án React/Vue |
| P1 | Giao luật WCAG cho axe-core | Bớt ~150 luật tự viết |
| P1 | Báo lỗi cấu trúc một lần, không nhân 6 | Báo cáo đọc được |
| P1 | Ghim Chromium của Playwright, đóng gói font | Kết quả giống nhau giữa máy dev và CI |
| P1 | Self-test theo từng luật (1 mẫu đúng + 1 mẫu sai) | Hiện chỉ kiểm "≥ 150 vi phạm" |
| P2 | Nhóm anti-slop thành cảnh báo | 07 §8 |
| P2 | Tách `page.evaluate` ~2.800 dòng thành module | Bảo trì |
