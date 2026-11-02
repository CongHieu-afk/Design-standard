# Sổ gu người dùng

File này là **điểm vào**, không phải policy và không chứa mặc định áp cho dự án mới. Đọc adapter bắt buộc [`AGENTS.md`](AGENTS.md), policy gốc [`../AGENTS.md`](../AGENTS.md) và [`../CONSTRAINTS.md`](../CONSTRAINTS.md).

## Cách dùng

1. Gu đang áp dụng phải nằm trong brief hoặc handoff của **đúng dự án**, kèm phạm vi và xác nhận của người dùng.
2. Phản hồi cũ chỉ là bằng chứng để hỏi lại, không tự chuyển thành yêu cầu hiện tại.
3. Khi người dùng xác nhận gu mới: ghi nguyên văn, ngày, phạm vi và nơi đã chuyển thành quy tắc; không ghi secret hay dữ liệu cá nhân.
4. Khi bị rút lại hoặc mâu thuẫn yêu cầu hiện tại: đánh dấu hết hiệu lực; yêu cầu hiện tại thắng.

## Gu đã xác nhận cho phạm vi hiện tại

Chỉ thêm dòng khi có xác nhận mới. `scripts/xuat_design_md.mjs` chỉ đọc các dòng có phạm vi bắt đầu bằng `Mọi`.

| # | Ngày | Nguyên văn | Phạm vi | Đã thành luật ở |
| --- | --- | --- | --- | --- |

## Lưu trữ

- [Phản hồi nguyên văn 29/10–01/11/2026](archive/GU_NGUOI_DUNG_2026-10-29_2026-11-01.md): 35 mục của các thử nghiệm cũ, giữ nguyên để truy vết; **không nạp mặc định**.

Không sao chép toàn bộ archive vào prompt. Chỉ mở mục liên quan sau khi người dùng xác nhận dự án và phạm vi phù hợp.
