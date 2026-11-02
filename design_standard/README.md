# Bộ chuẩn thiết kế UI/UX — design_standard

Phiên bản 2.1 · 29/10/2026 · Thay cho [QUY_TRINH_THIET_KE_UI_UX_CHUAN_HOA_VA_CHONG_NET_AI.md](../QUY_TRINH_THIET_KE_UI_UX_CHUAN_HOA_VA_CHONG_NET_AI.md) (bản cũ giữ để đối chiếu). Lịch sử: [CHANGELOG.md](CHANGELOG.md).

Dùng cho người và agent AI khi làm giao diện web, mobile (Flutter), desktop (đồng hồ: phụ lục tuỳ chọn). Agent AI: đọc [AGENTS.md](AGENTS.md) trước.

## Bắt đầu từ đâu

| Việc | Đọc | Xong khi |
| --- | --- | --- |
| **Làm mới** màn hình, tính năng, sản phẩm | [01](01_QUY_TRINH.md) — làn S / M / L (chưa có hệ thống thiết kế: Khởi tạo trước) | [08 §5](08_NGHIEM_THU.md#5-định-nghĩa-hoàn-thành-theo-làn) dòng của làn |
| **Đánh giá / cải thiện** màn hình có sẵn | [11](11_DANH_GIA_VA_CAI_THIEN.md) — đánh giá đủ trước, dừng ở cổng chọn phạm vi | 08 §5 dòng "Đánh giá" / "Cải thiện" |
| Chọn công cụ, MCP, impeccable | [12](12_BAN_DO_CONG_CU.md) | — |

PO chỉ cần quyết ở các cổng: G0 brief, G1 cấu trúc (làn L), G2 hướng thị giác, "Chọn phạm vi" (11), G5 nghiệm thu.

## Trả lời bốn câu hỏi theo thứ tự

1. Việc lớn cỡ nào? → **làn** S / M / L ([01](01_QUY_TRINH.md)).
2. Màn hình gì, trên thiết bị nào, rủi ro ra sao, được "biểu cảm" đến đâu? → **loại trang**, **nền tảng**, **hạng** A/B/C, **mức** E0–E3 ([02](02_PHAN_CAP.md), [03](03_LOAI_TRANG.md), [03B](03B_NEN_TANG_THIET_BI.md)).
3. Tiếng Việt, tiếng Anh hay cả hai? → **quy tắc ngôn ngữ** ([05](05_NGON_NGU.md)).
4. Máy kiểm gì, người duyệt gì, khi nào là xong? → [08](08_NGHIEM_THU.md).

## Danh mục

| File | Nội dung |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Bản rút gọn cho agent: phân loại, cổng, luật cứng, định nghĩa hoàn thành |
| [01_QUY_TRINH.md](01_QUY_TRINH.md) | Làn, khởi tạo, giao diện cũ, 6 chặng, cổng, người duyệt |
| [02_PHAN_CAP.md](02_PHAN_CAP.md) | Hạng A/B/C, mức E0–E3, luật kết hợp, `design.config.json` |
| [03_LOAI_TRANG.md](03_LOAI_TRANG.md) | 23 loại trang (gồm `alert` cảnh báo khẩn và `map` bản đồ) |
| [03B_NEN_TANG_THIET_BI.md](03B_NEN_TANG_THIET_BI.md) | Ma trận kích thước; web, mobile, tablet, desktop; bảng web → Flutter |
| [PHU_LUC_THIET_BI_DEO_VA_CANH_BAO.md](PHU_LUC_THIET_BI_DEO_VA_CANH_BAO.md) | Tuỳ chọn: đồng hồ (Wear OS), cảnh báo khẩn tới máy khoá/im lặng |
| [04_NEN_TANG.md](04_NEN_TANG.md) | Token, chữ, màu, bề mặt, bố cục, hình ảnh, biểu đồ, trạng thái, tương tác, mặc định E0 |
| [05_NGON_NGU.md](05_NGON_NGU.md) | Tiếng Việt, tiếng Anh, song ngữ |
| [06_CHUYEN_DONG_3D.md](06_CHUYEN_DONG_3D.md) | Chuyển động, cuộn, GSAP, three.js |
| [07_CHONG_AI_SLOP.md](07_CHONG_AI_SLOP.md) | Lý do hợp lệ, danh mục dấu hiệu 3 thế hệ, phép thử, vân tay mặc định |
| [08_NGHIEM_THU.md](08_NGHIEM_THU.md) | Nguồn duy nhất cho kiểm định, mức nghiêm trọng, định nghĩa hoàn thành |
| [09_CONG_CU.md](09_CONG_CU.md) | Công cụ, script, skill tham khảo |
| [10_MAU.md](10_MAU.md) | Brief, thẻ hướng, biên bản, ngoại lệ, lệnh cho agent |
| [11_DANH_GIA_VA_CAI_THIEN.md](11_DANH_GIA_VA_CAI_THIEN.md) | Đánh giá và cải thiện màn hình có sẵn |
| [12_BAN_DO_CONG_CU.md](12_BAN_DO_CONG_CU.md) | Công cụ theo chặng; MCP (Playwright, shadcn, Stitch, computer-use), impeccable; giới hạn chống slop, an toàn |
| [FINGERPRINTS.md](FINGERPRINTS.md) | Sổ vân tay dùng chung các dự án |
| [design.config.schema.json](design.config.schema.json) | Lược đồ file cấu hình dự án |
| [scripts/](scripts/) | `check_tokens.mjs`, `audit.mjs`, `check_codes.mjs` (mã treo, 2.4), `bang_mau.mjs` (2.7), `check_gates.mjs`, `ref_board.mjs` (2.8), `xuat_design_md.mjs` (2.9), hook (`install_hooks.mjs`), mẫu CI, mẫu Flutter test, mẫu config/ngoại lệ/token |
| [examples/rang-moc/](examples/rang-moc/) | Dự án mẫu hư cấu từ brief tới trang đã kiểm định: một trang chủ E2, một màn hình quản trị E0 |
| [PHU_LUC_UI_AUDITOR.md](PHU_LUC_UI_AUDITOR.md) | Tool cũ (đã ngừng dùng): việc cần sửa nếu muốn dùng lại |

## Năm nguyên tắc

1. **Quyết định, không mặc định.** Lựa chọn hình ảnh dễ thấy phải có lý do dẫn tới brief, tham chiếu hoặc quy ước ngành.
2. **Quen thuộc ở chỗ làm việc, riêng biệt ở chỗ gây ấn tượng.** E0 theo quy ước và làm kỹ; cá tính dành cho E2–E3.
3. **Nội dung trước, khung sau.** Không lorem, không số bịa.
4. **Máy đo cái đo được, người duyệt cái còn lại.** Người làm không tự duyệt một mình; dự án một người có cách duyệt riêng ([01 §4](01_QUY_TRINH.md#4-người-duyệt)).
5. **Tương xứng.** Sửa một nút không cần 6 chặng.

## Dùng trong một dự án

1. Ghim repo này theo commit cạnh dự án (ghi trong `design.config.json`: `"standard": "design_standard@4.0"`). Không sao chép rời checker khỏi policy.
2. Tạo `design.config.json` từ [scripts/design.config.example.json](scripts/design.config.example.json) ([02 §4](02_PHAN_CAP.md#4-khai-báo-cấu-hình)).
3. Thêm hai script `ui:tokens`, `ui:audit` ([09 §2](09_CONG_CU.md#2-script-trong-bộ-chuẩn)); dự án Flutter thêm `test/ui_standard/` từ mẫu.
4. Thêm vào `CLAUDE.md`/`AGENTS.md` của dự án: `Làm giao diện theo design_standard/AGENTS.md`. Trong kho PRACTICE đã có skill `design-standard` (`.claude/skills/`, `.agents/skills/`).
5. Khi đã có baseline: bật hook pre-push hoặc CI ([09 §4](09_CONG_CU.md#4-hook-và-ci)).

## Cập nhật bộ chuẩn

- Chủ sở hữu: người duy trì kho PRACTICE. Ai cũng đề xuất được; thay đổi ghi vào CHANGELOG.
- Phiên bản: tăng số chính khi thêm blocker mới hoặc đổi ngưỡng; số phụ cho quy tắc mới không chặn; vá cho sửa chữ, link.
- Xem lại mỗi 6 tháng: cập nhật dòng `[kiểm lại: …]`, danh mục dấu hiệu 07 §4 và vân tay mặc định 07 §5.
