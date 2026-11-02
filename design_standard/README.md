# design_standard@4.0

Bộ chuẩn UI/UX cho web, Flutter và desktop. Đây là thư mục chi tiết; policy bắt buộc vẫn nằm ở [`../AGENTS.md`](../AGENTS.md) và ngưỡng máy ở [`../CONSTRAINTS.md`](../CONSTRAINTS.md).

## Đường đọc ngắn

1. Với việc UI, đọc [`../docs/PROCESS.md`](../docs/PROCESS.md).
2. Mở **chỉ** chương đúng việc trong [`../docs/REFERENCE_MAP.md`](../docs/REFERENCE_MAP.md).
3. Dùng [`08_NGHIEM_THU.md`](08_NGHIEM_THU.md) để xác định điều kiện xong; không dùng changelog hoặc báo cáo cũ làm policy.

## Tích hợp vào dự án

1. Ghim repo theo commit; khai `"standard": "design_standard@4.0"` trong `design.config.json`.
2. Tạo manifest từ [`scripts/design.config.example.json`](scripts/design.config.example.json), gồm `uiRoots`, source và `stateCoverage` của từng màn hình.
3. Nối test/audit theo [`09_CONG_CU.md`](09_CONG_CU.md); không sao chép checker rời trust root.
4. Trước commit chạy `npm test`; trước push chạy `npm run verify` và kiểm tra liên quan của dự án tiêu thụ.

## Phân biệt tài liệu

- **Bắt buộc:** policy gốc, constraints; với việc UI, thêm quy trình và chương được bản đồ chọn cho công việc hiện tại.
- **Theo việc:** chương kỹ thuật chỉ mở khi phạm vi chạm tới nó.
- **Tham khảo/lịch sử:** `CHANGELOG.md`, báo cáo phân tích, ví dụ và `PHU_LUC_UI_AUDITOR.md` đã ngừng dùng; không tạo luật mới và không được dùng để ghi đè policy.

Lịch sử phiên bản nằm ở [`CHANGELOG.md`](CHANGELOG.md).
