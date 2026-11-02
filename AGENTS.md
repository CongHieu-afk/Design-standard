# Luật bắt buộc cho agent

Áp dụng cho toàn repo. Đây là **nguồn policy duy nhất**. `CLAUDE.md`, `GEMINI.md` và các skill adapter chỉ được trỏ về file này, không được thêm luật riêng.

## 1. Thứ tự ưu tiên

1. Yêu cầu trực tiếp của người dùng trong phiên hiện tại.
2. `AGENTS.md` gần file đang sửa nhất.
3. File này và [CONSTRAINTS.md](CONSTRAINTS.md).
4. Tài liệu tham khảo và skill.

Nếu hai luật cùng cấp mâu thuẫn: dừng và hỏi. Không tự chọn luật thuận tiện hơn.

## 2. Trước khi sửa

1. Đọc file này, `CONSTRAINTS.md` và hướng dẫn gần phạm vi sửa.
2. Xác định file, người dùng và luồng bị ảnh hưởng; giữ nguyên thay đổi không liên quan.
3. Việc UI: đọc [quy trình ngắn](docs/PROCESS.md), rồi chỉ mở chương cần thiết trong [bản đồ tài liệu](docs/REFERENCE_MAP.md).
4. Khai mọi màn hình UI và đường dẫn nguồn trong `design.config.json`. File UI đổi mà không thuộc màn hình đã khai báo là lỗi.
5. Tạo nhật ký riêng `handoffs/YYYY-MM-DDTHHMMSSZ-<agent>-<slug>.md`. Không sửa nhật ký của phiên khác.

## 3. Trong khi sửa

- Làm từng lát nhỏ. Không thêm dependency, đổi framework hoặc mở rộng phạm vi nếu người dùng chưa yêu cầu.
- Logic mới hoặc bug fix phải có test assertion. Viết test tái hiện lỗi trước khi sửa khi khả thi.
- Không bịa dữ liệu, số liệu, nguồn, lời chứng thực hoặc phê duyệt.
- Không đưa secret, token, dữ liệu cá nhân/sức khỏe thật vào mã, log, fixture hay commit.
- Agent không được tự phê duyệt G1/G2/G5 hoặc ngoại lệ. File bằng chứng trong repo không thay thế GitHub review của người có quyền.
- Không hạ severity, sửa baseline, nới ngưỡng, xóa assertion, skip test hoặc tắt checker để đạt xanh.

## 4. Kiểm thử là bắt buộc

Mọi thay đổi mã, script, config hoặc tài liệu policy phải được kiểm sau khi sửa. Yêu cầu sửa đổi của người dùng đồng thời là quyền chạy các kiểm tra liên quan.

1. Sau mỗi lát: chạy test sát phạm vi.
2. Trước commit: chạy `npm test`.
3. Trước push: chạy `npm run verify` và build/test của dự án tiêu thụ nếu thay đổi ảnh hưởng runtime của dự án đó.
4. Việc UI có preview: chạy audit đầy đủ; không dùng `--quick` làm bằng chứng hoàn thành.
5. Bất kỳ kiểm tra bắt buộc nào không chạy được đều làm nhiệm vụ **chưa hoàn thành**. Báo nguyên nhân; không ghi “đạt”.

Không chạy lặp lại cùng lệnh nếu mã không đổi.

## 5. Điều kiện hoàn thành

- Không còn blocker hoặc major chưa được sửa.
- Không có kiểm tra máy bắt buộc ở trạng thái “Chưa kiểm”.
- Mọi file UI đổi nằm trong inventory; states bắt buộc đã khai báo.
- Test, build và audit liên quan đã chạy thật và được báo bằng lệnh + kết quả.
- Phê duyệt người dùng/người duyệt có link GitHub issue/PR; local text không phải bằng chứng phê duyệt.
- Nhật ký phiên ghi file đổi, lệnh đã chạy, kết quả và phần chưa kiểm.

## 6. Git

- Làm trên nhánh ngắn `codex/*` hoặc nhánh người dùng chỉ định.
- Chỉ commit file thuộc yêu cầu; xem staged diff và quét secret trước commit.
- Không dùng `--no-verify`, biến bỏ qua gate, force-push hoặc sửa workflow/checker để tự cho PR xanh.
- `main` phải bảo vệ bằng required CI + ít nhất một review; file policy/checker/workflow cần CODEOWNER review.

Chi tiết kỹ thuật nằm trong `design_standard/`; khi tài liệu chi tiết mâu thuẫn file này, file này thắng.
