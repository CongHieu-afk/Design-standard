# 10 · Mẫu

Sao chép vào `docs/design/` của dự án.

## 1. Brief

```markdown
# Brief: <màn hình / sản phẩm>
Ngày: dd/mm/yyyy · Làn: S | M | L (+ Khởi tạo nếu chưa có hệ thống thiết kế) · Người viết: … · PO duyệt: … (hoặc "CHỜ G0")

## Người dùng
- Ai: …
- Bối cảnh: thiết bị …, ánh sáng …, mức căng thẳng …, tần suất …

## Tác vụ chính (tối đa 3)
1. … — thành công khi …

## Phân loại
| id | Nền tảng | Loại trang | Hạng | Mức biểu cảm | Ngôn ngữ | Con trỏ |
| --- | --- | --- | --- | --- | --- | --- |
| canh-bao | web | alert | A | E0 | vi | both |

<!-- Hết phần "brief rút gọn" (làn M) -->

Dark mode: có/không — lý do (ví dụ dùng cả ngày, phòng tối) … · In ấn: … · Offline: …

## Đầu vào
- Thương hiệu: logo …, màu …, font … (hoặc "chưa có")
- Nội dung / dữ liệu thật: …

## Ràng buộc
- Kỹ thuật: … · Pháp lý / ngành: …

## Giả định (agent ghi khi chưa được xác nhận)
- …
```

## 2. Thẻ hướng thị giác

2 hướng cho G2 (bước khởi tạo không có trang E2–E3: 1 hướng; nhóm b2 của 11: 1 hướng). Mỗi hướng là bản **đã gọt từ bản mẫu sinh** (07 §2), dựng bằng mã, kèm **ảnh chụp đã render** cùng một màn hình chính theo cột G2 của [03B §0](03B_NEN_TANG_THIET_BI.md#0-ma-trận-kích-thước-kiểm-định), nội dung thật, và **bảng gọt**; sản phẩm có cả E0 và E2–E3: một màn E2–E3 + một khối E0 (07 §7). Hai hướng khác nhau thấy được ở ≥ 2 trong {màu nhấn, font, bề mặt, bố cục}.

```markdown
# Hướng <A|B>: <tên ngắn>

Ý tưởng một câu: …
Ảnh: direction-<a|b>-<kích thước>.png (theo 03B §0)
Bản mẫu nguồn: <công cụ, prompt/model, ngày> → ảnh: mau-<n>.png
Tham chiếu (tuỳ chọn ở E0–E1): … — học gì từ mỗi cái

| Thành phần | Lựa chọn | Lý do (chỉ bắt buộc khi vượt liều hoặc là quyết định đặc trưng — 07 §3; "PO chọn ở G2" là lý do hợp lệ) |
| --- | --- | --- |
| Font tiêu đề | … | … (chuỗi kiểm tiếng Việt: đạt/không) |
| Font thân | … | … |
| Màu nhấn | … | … |
| Trung tính | trung tính thuần / ngả màu … | … |
| Bề mặt | phẳng / viền / nổi | … |
| Bo góc | thang … | … |
| Bố cục | … (nhóm theo 07 §5) | … |
| Mở đầu | … (nhóm theo 07 §5) | … |
| Đặc trưng | … (nhóm theo 07 §5, hoặc "không có") | … |
| Chuyển động | E…, mô tả | … |
| Hình ảnh | bậc … của thang 04 §6 (nhóm theo 07 §5) | … |

Quyết định đặc trưng: … — thấy ở màn đầu: có/không · áp ở 3 chỗ: …, …, … · từ nội dung/thương hiệu: …
DF gần nhất: DF-… — khác ở các chiều … (làn L, Khởi tạo: ≥ 2/6 hoặc có quyết định đặc trưng)
Rủi ro mặc định (07 §2 bước 5): giống bản mẫu thô ở … / không
Rủi ro khác: … (ví dụ font tiêu đề nặng 120 KB)

## Bảng gọt (07 §2)

| Dấu hiệu (mã 07 §4) | Bậc | Trong bản mẫu | Quyết định | Thay bằng / lý do |
| --- | --- | --- | --- | --- |
| G2-09 số liệu bịa | cấm | "124 sản phẩm", số giấy phép | bỏ | số thật từ API / [CẦN NỘI DUNG] |
| S-01 thanh bên 5 mục | tiết chế | có, 4 mục không có trang | giảm | chỉ giữ mục có trang thật |
| G2-06 tiêu đề cột chữ hoa | tiết chế | mọi cột | bỏ | chữ thường đậm vừa, nền tiêu đề nhạt |
| … | | | | |

| Khối của bản mẫu (2.3) | Làm gì cho tác vụ nào | Điểm nhấn? | Quyết định | Khối nào nhận vai trò nếu bỏ | Ở ảnh mờ bản đã dựng (2.4) |
| --- | --- | --- | --- | --- | --- |
| Khối cảnh báo hạn dùng | tác vụ 2: thấy việc cần xử lý | có | đổi: đưa lên đầu, giữ màu cảnh báo nhạt | — | nổi nhất ✓ |
| Thanh bên điều hướng | chuyển trang | không | bỏ | tab 2 mục ở đầu trang | — |
| … | | | | | |

Bản mẫu nguồn: … (công cụ, **cùng loại trang** `type` = …; công cụ hỏng thì "agent dựng nhanh" + lý do).

Bảng tài nguyên (2.5, khi dùng ảnh/mô hình/HDRI ngoài — 04 §6, 12 §5.5):

| Tài nguyên | Dùng ở | Nguồn (link) | Giấy phép | Tác giả | Nhúng/tải |
| --- | --- | --- | --- | --- | --- |
| … | hero | … | Unsplash License / CC0 / CC-BY | … | CDN / tải (người dùng đồng ý ngày …) |
Cột cuối điền **sau khi dựng**, nhìn `*_T3-blur8.png` (320 và 1440): khối "điểm nhấn = có" phải "nổi nhất ✓"; khối khác nổi hơn thì ghi tên khối đó và sửa giao diện trước khi trình (07 §2 bước 4).

Điểm tốt giữ lại (≥ 3): …; …; …
```

## 3. Biên bản duyệt

```markdown
# Biên bản duyệt: <màn hình> · Cổng G2 | G5
Ngày: … · Người làm: … · Người duyệt: …
Cách duyệt (01 §4): người thứ hai | agent độc lập | tự duyệt sau ≥ 1 ngày (không cho hạng A, không cho người làm là agent; ghi giờ commit bản dựng và giờ duyệt)
Đầu vào đã đưa cho người duyệt (agent độc lập): …
Hạng A — người nghiệp vụ duyệt nội dung (08 §3): tên … · ngày …

## Phép thử 07 §7 (kết luận bằng mắt, TRƯỚC khi mở báo cáo máy)
Thời điểm kết luận: yyyy-mm-dd hh:mm
| Mã | Đạt | Ghi chú |
| --- | --- | --- |
| T… | | |
Vân tay màn hình mới (làn M/L): 6 chiều …; trùng DF gần nhất (DF-…) ở …/6 chiều
Kết luận chống slop: đạt / làm lại

## Tự động (mở sau khi đã ghi phép thử)
Công cụ + phiên bản: … · Thư mục báo cáo: … · Blocker: … · Major: … · Minor: … · Chưa kiểm: …
Phát hiện W17 (impeccable): mỗi dòng → đã sửa | lý do hợp lệ (07 §3) | sai (giải thích)

## Thủ công (08 §3)
- [ ] Bàn phím — …
- [ ] Trình đọc màn hình (công cụ …) — …
- [ ] Ma trận kích thước 03B §0 cho nền tảng của màn hình — …
- [ ] Mục "Bắt buộc" của loại trang (03) và nền tảng (03B) — …
- [ ] Người dùng thật (số người …, đối tượng …) — …

## Phát hiện
| Mức | Mô tả | Xử lý |
| --- | --- | --- |

## Kết luận
Đạt / Đạt có điều kiện (ngoại lệ: …) / Không đạt
```

## 4. Ngoại lệ

File JSON khai báo ở trường `exceptions` của config; `audit.mjs` đọc file này. Mẫu: [scripts/design-exceptions.example.json](scripts/design-exceptions.example.json).

```json
[
  {
    "id": "EX-001",
    "finding": "report-detail|dau|target-size|button \"Sắp xếp\"",
    "severity": "minor",
    "reason": "Thư viện bảng giới hạn tiêu đề 36px; menu Sắp xếp 44px ở thanh công cụ làm cùng việc",
    "owner": "@product-owner",
    "expires": "2027-01-31",
    "approvalRef": "https://github.com/example/project/issues/123"
  }
]
```

- `finding` = ID nguyên dạng trong `audit_report.json` (dạng `màn hình|trạng thái|luật|nguyên nhân`; bảng trong `audit_report.md` đã thoát ký tự `|`). ID dạng cũ 3 phần (trước 2.0) bị script từ chối.
- Ngoại lệ chỉ áp dụng `minor`; Blocker/Major luôn phải sửa trước merge.
- `owner` là GitHub handle, `expires` tối đa 365 ngày, `approvalRef` trỏ GitHub issue/PR. Agent không tự phê duyệt ngoại lệ của mình.

## 5. Sổ vân tay

Ghi vào [FINGERPRINTS.md](FINGERPRINTS.md) trong thư mục bộ chuẩn.

## 6. design.config.json

Xem [02 §4](02_PHAN_CAP.md#4-khai-báo-cấu-hình) và [design.config.schema.json](design.config.schema.json).

## 7. Lệnh cho agent duyệt độc lập

Mở **phiên agent mới**, không kèm lịch sử lúc làm. Hai giai đoạn: kết luận bằng mắt trước, nhận báo cáo máy sau ([01 §4](01_QUY_TRINH.md#4-người-duyệt)).

**Giai đoạn 1** — chưa đưa `audit_report.md`:

```text
Bạn là người duyệt độc lập theo bộ chuẩn design_standard (đọc AGENTS.md, 03, 03B, 07 §7, 08).
Nhiệm vụ: tìm điểm trượt, không khen.
Đầu vào: brief (đính kèm, hoặc "không có brief đã duyệt"), design.config.json, link xem thử hoặc ảnh chụp theo ma trận × trạng thái.
Làm:
1. Với mỗi màn hình: đối chiếu từng mục "Bắt buộc" của loại trang và nền tảng → đạt/trượt + bằng chứng (ảnh, phần tử).
2. Chạy các phép thử 07 §7 theo dòng "Kết luận" của mức màn hình (E0, E1, E2–E3); liệt kê dấu hiệu 07 §4 kèm bậc và liều; T12 đặt ảnh làm mờ bản mẫu thô cạnh bản đã gọt; T1 là cổng ở E2–E3, ghi nhận ở E0–E1.
3. Kiểm lý do trong thẻ hướng theo 07 §3; lý do chung chung = trượt.
4. Ghi các mục không kiểm được (ví dụ cần trình đọc màn hình thật).
Đầu ra giai đoạn 1: phần "Phép thử 07 §7" của biên bản 10 §3, có thời điểm kết luận.
```

**Giai đoạn 2** — đưa thêm `audit_report.md`:

```text
Đối chiếu báo cáo máy với kết luận giai đoạn 1. Thêm phát hiện máy tìm ra; với mỗi dòng W17 ghi: đã sửa | lý do hợp lệ | sai.
Không rút lại kết luận "trượt" của giai đoạn 1 nếu không có bằng chứng mới.
Đầu ra: biên bản đầy đủ theo 10 §3, mức blocker/major/minor theo 08 §2.
```

## 8. Mô tả việc giao cho agent làm

```text
Làm <màn hình> theo design_standard@2.1 (đọc AGENTS.md trước).
Làn: M · id: orders · Nền tảng: web · Loại: list · Hạng: B · Mức: E0 · Ngôn ngữ: vi · Con trỏ: both
Người dùng: … · Tác vụ chính: …
Hệ thống thiết kế: token ở src/styles/tokens.json, component ở src/ui; không thêm màu mới.
Nội dung: lấy từ …; thiếu thì [CẦN NỘI DUNG: …].
Xong khi: 08 §5 dòng M. Không tự ký nghiệm thu.
```
