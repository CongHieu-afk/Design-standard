# Handoff — tổng hợp gu mới từ lịch sử

- Agent: Codex
- Phạm vi: GU-36–GU-49 và hồ sơ gu người dùng
- Trạng thái: hoàn thành

## Việc cần làm

- [x] Xác định 14 phản hồi lịch sử mới và lưu nguyên văn, không nâng diễn giải cũ thành policy.
- [x] Tổng hợp mẫu gu mới theo đúng loại trang/component và điều kiện áp dụng.
- [x] Phản biện chéo, kiểm tài liệu, chạy test/verify và cập nhật PR.

## Kết quả kiểm

- GU-36–49: 14/14 dòng khớp chính xác nguồn lịch sử; tổng archive 49 dòng.
- Hồ sơ hoạt động không chứa dòng dữ liệu thô; parser `readGu()` trả 0 mục.
- Review fresh-context: hai vòng đầu phát hiện rò phạm vi garage, trộn policy với gu và diễn giải thiếu nguồn; đã sửa. Vòng ba: ACCEPT.
- Review thủ công: giữ full-bleed/palette/tỷ lệ ở phạm vi garage; chỉ tổng quát hóa 3D có nghĩa, nội dung gọn và tránh vá chắp.
- `npm test`: 23/23 đạt.
- `npm run verify`: đạt test, policy và syntax.
