# Quy trình bắt buộc

```text
Hiểu việc → Khai phạm vi → Test đỏ → Sửa nhỏ → Test xanh
   → Audit/build liên quan → Review người thật → Commit/PR
```

1. **Hiểu việc:** đọc `AGENTS.md`, `CONSTRAINTS.md`, yêu cầu người dùng và hướng dẫn gần file sửa.
2. **Khai phạm vi:** cập nhật `design.config.json`; mỗi màn hình có `source`, `ready`, `states`, type, tier và expression.
3. **Thiết kế:** với thay đổi hướng thị giác, trình phương án và chờ người dùng chọn. Agent không tự đóng gate.
4. **Thực hiện:** chia lát nhỏ; logic/bug fix có test assertion trước khi sửa.
5. **Kiểm:** chạy test sát phạm vi sau mỗi lát; trước commit chạy `npm test`; trước push chạy `npm run verify` cùng build/audit của dự án tiêu thụ.
6. **Duyệt:** blocker/major phải sửa. Ngoại lệ local chỉ dành cho minor và cần link GitHub phê duyệt.
7. **Bàn giao:** tạo một file handoff riêng, ghi file đổi, lệnh thực chạy, kết quả và phần chưa kiểm.

Sau bootstrap, checker/test/workflow/npm config thuộc trust root: PR 1 thêm hash được duyệt vào manifest, PR 2 mới đổi file. Không gộp hai bước; PR bootstrap cần review thủ công vì base cũ chưa thể tự bảo vệ checker mới.

## Cổng dừng

| Cổng | Ai đóng | Bằng chứng |
| --- | --- | --- |
| G1 — luồng/cấu trúc lớn | Người dùng/PO | GitHub issue/PR comment |
| G2 — hướng thị giác | Người dùng/PO | Link lựa chọn + artifact tồn tại |
| G4 — máy kiểm | CI | Test/build/audit xanh |
| G5 — nghiệm thu độc lập | Người duyệt không phải tác giả | PR approval |

Thiếu bằng chứng nghĩa là cổng chưa đóng. Repo một maintainer có thể merge khi machine gate xanh nhưng không được ghi G5 đã đóng; thêm maintainer độc lập trước khi yêu cầu CODEOWNER approval. Local Markdown chỉ lưu ngữ cảnh, không tạo quyền phê duyệt.

## Khi kiểm tra không chạy được

Dừng ở trạng thái **chưa hoàn thành**. Ghi lệnh, lỗi và điều kiện còn thiếu. Không thay bằng lời khẳng định “đã ổn”, không hạ ngưỡng và không thêm skip.
