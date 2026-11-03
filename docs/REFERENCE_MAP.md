# Bản đồ tài liệu

Mục tiêu: nạp đủ quy tắc nhưng không bắt agent đọc toàn bộ kho. Thứ tự ưu tiên vẫn do [`../AGENTS.md`](../AGENTS.md) quyết định.

## Bắt buộc cho mọi thay đổi

| Đọc | Dùng để |
| --- | --- |
| [`../AGENTS.md`](../AGENTS.md) | Policy duy nhất, thứ tự ưu tiên, test và Git |
| [`../CONSTRAINTS.md`](../CONSTRAINTS.md) | Ngưỡng chặn và ngoại lệ |

Với **việc UI**, đọc thêm [`PROCESS.md`](PROCESS.md) để lấy trình tự thực hiện và cổng dừng. Thay đổi không liên quan UI không bị tài liệu này thêm nghĩa vụ mới.

## Theo việc

Chỉ mở các dòng khớp phạm vi. Nếu một thay đổi chạm nhiều dòng thì đọc hợp các dòng đó.

| Phạm vi | Đọc |
| --- | --- |
| Làn, cổng, manifest, phân hạng | `01_QUY_TRINH.md`, `02_PHAN_CAP.md` |
| Loại trang, state, thiết bị | `03_LOAI_TRANG.md`, `03B_NEN_TANG_THIET_BI.md` |
| Token, màu, chữ, bố cục, ngôn ngữ | `04_NEN_TANG.md`, `05_NGON_NGU.md` |
| Motion, scroll, GSAP, three.js | `06_CHUYEN_DONG_3D.md` |
| Hướng thị giác, bản mẫu, chống AI slop | `07_CHONG_AI_SLOP.md` |
| Severity, nghiệm thu, định nghĩa hoàn thành | `08_NGHIEM_THU.md` |
| Script, CI, MCP, môi trường | `09_CONG_CU.md`, `12_BAN_DO_CONG_CU.md` |
| Artifact và biểu mẫu | `10_MAU.md` |
| Đánh giá/cải thiện UI có sẵn | `11_DANH_GIA_VA_CAI_THIEN.md` |
| Wear OS hoặc cảnh báo khẩn | `PHU_LUC_THIET_BI_DEO_VA_CANH_BAO.md` |

Mọi đường dẫn trong bảng trên tính từ `design_standard/`.

## Tham khảo và lịch sử

Không nạp mặc định, không dùng làm policy và không dùng số liệu cũ như kết quả kiểm hiện tại:

| Nhóm | File |
| --- | --- |
| Lịch sử phiên bản | `CHANGELOG.md` |
| Báo cáo quyết định cũ | `DANH_GIA_CONG_CU_VA_QUY_TRINH_2026-10.md`, `PHAN_TICH_CLAUDE_DESIGN_OPEN_DESIGN_HUASHU.md` |
| Dữ liệu/ledger | `GU_NGUOI_DUNG.md`, `FINGERPRINTS.md` — chỉ mở khi chương đang dùng dẫn tới |
| Tool đã ngừng dùng | `PHU_LUC_UI_AUDITOR.md` |
| Ví dụ | `examples/` — minh hoạ, không phải bằng chứng dự án hiện tại |

Nếu tài liệu theo việc hoặc lịch sử mâu thuẫn policy gốc, policy gốc thắng. Nếu hai quy tắc cùng cấp mâu thuẫn, dừng và hỏi người dùng.
