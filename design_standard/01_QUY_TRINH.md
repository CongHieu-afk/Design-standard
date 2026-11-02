# 01 · Quy trình

Quy trình có 6 chặng, 3 làn theo **quy mô** công việc và một bước khởi tạo khi dự án chưa có hệ thống thiết kế. Hạng rủi ro ([02](02_PHAN_CAP.md)) không đổi làn; nó tăng mức kiểm định ở [08](08_NGHIEM_THU.md). Mọi ngưỡng kiểm định nằm ở 08; file này chỉ nói làm gì, khi nào, ai duyệt.

## 1. Chọn làn

| Làn | Khi nào | Ví dụ | Bắt buộc |
| --- | --- | --- | --- |
| **S** — sửa nhỏ | Trong hệ thống thiết kế đã có; không thêm màn hình, không đổi luồng | Sửa nhãn, thêm cột bảng, đổi khoảng cách | Chặng 3–4 rút gọn theo [08 §5](08_NGHIEM_THU.md#5-định-nghĩa-hoàn-thành-theo-làn) |
| **M** — tính năng | Màn hình hoặc luồng mới, dùng hệ thống thiết kế đã có | Trang quản lý đơn hàng, form mới, thêm bước vào luồng thanh toán | Brief rút gọn, chặng 1, 3, 4, 5 |
| **L** — sản phẩm | Sản phẩm mới, hệ thống thiết kế mới, đổi nhận diện, hoặc trang E3 | Trang chủ mới, landing ra mắt, app mới | Chặng 0 → 6 |

Xét theo thứ tự L → M → S (dòng đầu tiên đúng). Chưa có hệ thống thiết kế thì làm **Khởi tạo** trước rồi đi tiếp làn đó: Khởi tạo là bước mở đầu, không phải một làn, và không thay chặng 0–1 của làn L.

**Đánh giá hoặc cải thiện cả một màn hình có sẵn** (không phải sửa một lỗi đã biết): theo [11](11_DANH_GIA_VA_CAI_THIEN.md) — đánh giá đủ bốn lớp trước, dừng ở cổng chọn phạm vi, rồi mới vào làn S/M. Công cụ cho từng chặng: [12](12_BAN_DO_CONG_CU.md).

- Không chắc giữa hai làn thì chọn làn lớn hơn.
- Màn hình hạng A ở làn nào cũng áp các dòng kiểm định hạng A của [08 §3](08_NGHIEM_THU.md#3-kiểm-định-thủ-công-theo-hạng).

### Khởi tạo hệ thống thiết kế (chạy một lần)

Dự án **mới** chưa có token và component gốc, hoặc việc M/L đầu tiên của dự án cũ cần dựng hệ thống, thì làm bước này trước. Dự án cũ chưa có token vẫn nhận việc S theo mục "Giao diện cũ" bên dưới, ghi "Chưa có token" vào báo cáo.

Làm **sau** chặng 0–1 của làn (cần brief và nội dung thật để dựng hướng, T7):

1. Thẻ hướng thị giác ([10 §2](10_MAU.md#2-thẻ-hướng-thị-giác)): 1 hướng nếu sản phẩm không có trang E2–E3, 2 hướng nếu có.
2. `tokens.json`: khoảng 15 màu ngữ nghĩa, thang chữ, thang khoảng cách, bo góc, bóng — kiểm bằng `scripts/check_tokens.mjs`.
3. Component gốc đã gắn token: nút, ô nhập, chọn, checkbox, bảng, dialog, toast, trạng thái rỗng/lỗi. Flutter: `ThemeData` + các widget bọc tương ứng.
4. `design.config.json` liệt kê màn hình ([02](02_PHAN_CAP.md#4-khai-báo-cấu-hình)).
5. Ghi vân tay vào [FINGERPRINTS.md](FINGERPRINTS.md).
6. Cổng G2, rồi tiếp chặng 3–6 của làn.

### Giao diện cũ (legacy)

- **Quy tắc hướng đạo sinh:** sửa vi phạm trên các dòng mình chạm vào, và mọi blocker trên màn hình mình chạm vào. Phần còn lại ghi vào baseline.
- Không refactor hàng loạt trong việc làn S/M. Chuyển màu/px cứng sang token là một việc riêng (làn M hoặc L).
- File xung quanh vi phạm chuẩn thì không bắt chước; code mới theo chuẩn, ghi chú chỗ chưa đồng bộ.
- Gán hạng cho màn hình cũ khi lần đầu chạm vào, thêm vào `design.config.json`.

## 2. Sáu chặng

```
0 Phân loại & brief → 1 Cấu trúc & nội dung → 2 Hướng thị giác & token
                                                        ↓
6 Sau phát hành ← 5 Kiểm định người & bàn giao ← 4 Kiểm định tự động ← 3 Xây dựng
                                                   ↺ tối đa 3 vòng sửa
```

### Chặng 0 — Phân loại & brief

Brief theo [mẫu](10_MAU.md#1-brief), tối đa 1 trang: người dùng và bối cảnh, tối đa 3 tác vụ chính có tiêu chí thành công, nền tảng, loại trang, hạng, mức biểu cảm, ngôn ngữ, đầu vào thương hiệu, nguồn nội dung thật, có cần dark mode / in ấn / offline.

**Brief rút gọn** (làn M) = ba mục: Người dùng, Tác vụ chính, Phân loại.

### Chặng 1 — Cấu trúc & nội dung

- Sơ đồ luồng cho từng tác vụ chính, gồm đường lỗi và đường quay lại.
- Kiến trúc thông tin: điều hướng, nhóm nội dung, URL hoặc route.
- Kiểm kê trạng thái từng màn hình theo [04 §8](04_NEN_TANG.md#8-trạng-thái), cộng **trạng thái tương tác bắt buộc** ở [03 "Trạng thái tương tác"](03_LOAI_TRANG.md#trạng-thái-tương-tác-bắt-buộc-mọi-màn-có-thao-tác-ghi-hoặc-điều-hướng) cho mọi màn có thao tác ghi hoặc điều hướng; khai báo vào `states` của `design.config.json` ngay chặng này.
- **Đối chiếu "Bắt buộc" và "Kiểm riêng" của loại trang (03) với luồng và wireframe** — từng mục: đáp ứng ở khối nào. Mục chưa đáp ứng ghi trước khi dựng (2.3: 3/5 major của lần chạy thử là mục 03 bỏ sót lúc dựng).
- Mỗi khối trên wireframe gắn với một tác vụ trong brief; khối không gắn được thì bỏ hoặc hỏi PO.
- Nội dung thật bằng ngôn ngữ đích. Thiếu thì ghi `[CẦN NỘI DUNG: …]`, không lorem, không số bịa.
- Wireframe đơn sắc.

### Chặng 2 — Hướng thị giác & token (sinh trước, gọt sau)

- **Sinh bản mẫu** (bắt buộc khi có công cụ, [07 §2](07_CHONG_AI_SLOP.md#2-quy-trình-sinh--chấm--gọt--dựng)): ≥ 2 bản từ brief bằng công cụ sinh ([12 §2](12_BAN_DO_CONG_CU.md#2-luồng-thiết-kế-mới-01)) — Stitch, block/theme shadcn, gợi ý ngành của ui-ux-pro-max, hoặc agent dựng nhanh. Bản mẫu **cùng loại trang** với màn đang làm; công cụ sinh hỏng thì agent dựng nhanh bản đúng loại, không mượn màn khác loại (2.4). Nội dung thật; dữ liệu công cụ bịa thay bằng thật hoặc `[CẦN NỘI DUNG: …]`.
- **Chấm và gọt** bằng bảng gọt ([10 §2](10_MAU.md#2-thẻ-hướng-thị-giác)): bỏ bậc cấm, đưa bậc tiết chế về liều, giữ bậc tự do và **≥ 3 điểm tốt** của bản mẫu; chỗ bỏ có thứ thay.
- Bảng tham chiếu (tuỳ chọn ở E0–E1, khuyến nghị ở E2–E3): nguồn có link/ảnh, ghi học được gì.
- **2 hướng thị giác** (1 hướng khi Khởi tạo cho sản phẩm không có trang E2–E3), mỗi hướng là bản đã gọt, **dựng bằng mã thật** với token dự án, **ảnh chụp đã render** của cùng một màn hình chính theo ma trận [03B §0](03B_NEN_TANG_THIET_BI.md#0-ma-trận-kích-thước-kiểm-định), kèm thẻ hướng + bảng gọt. Hai hướng khác nhau thấy được ở ≥ 2 trong {màu nhấn, font, bề mặt, bố cục}. PO chọn một hướng — lựa chọn đó là lý do hợp lệ cho màu, font, bề mặt ([07 §3](07_CHONG_AI_SLOP.md#3-lý-do-hợp-lệ)).
- Sản phẩm có trang E2–E3 hoặc làn L: mỗi hướng có một **quyết định đặc trưng** ([07 §5](07_CHONG_AI_SLOP.md#5-quyết-định-đặc-trưng-và-vân-tay)). Chỉ E0–E1: tuỳ chọn.
- Token lấy từ hướng được chọn; được khởi điểm từ theme/preset (shadcn, TweakCN, Stitch design system) **sau khi** đã đổi màu nhấn và một trong {font, bo góc, bề mặt}; tương phản kiểm bằng script.
- Làn L, Khởi tạo: ghi dòng vân tay vào [FINGERPRINTS.md](FINGERPRINTS.md).

### Chặng 3 — Xây dựng

- Thư viện hành vi có sẵn (Radix, React Aria, shadcn/ui, Material, Flutter SDK) cho thành phần phức tạp; **thay token mặc định** bằng token dự án. Lấy cấu trúc, hành vi và chi tiết thân thiện; thay màu, font bằng token; block làm sẵn là bản mẫu ở chặng 2, qua bảng gọt ([12 §5.2](12_BAN_DO_CONG_CU.md#52-shadcn-lấy-hành-vi-và-chi-tiết-thân-thiện-thay-màu-và-font)).
- Tailwind: không giá trị tuỳ ý (`text-[#…]`, `p-[13px]`) và không màu có sẵn (`zinc`, `indigo`…) ngoài token ([12 §5.3](12_BAN_DO_CONG_CU.md#53-tailwind-token-ở-cấu-hình-không-ở-class)).
- Khai báo `ready` và `states` (dialog, rỗng, lỗi) cho màn hình trong `design.config.json` ngay khi dựng, để chặng 4 đo được.
- Trợ năng ngay khi viết; chuyển động thêm sau cùng theo [06 §3](06_CHUYEN_DONG_3D.md#3-giảm-chuyển-động-và-tăng-cường-dần).
- Commit/nhánh trước refactor lớn; không ghi đè phiên bản đã duyệt.

### Chặng 4 — Kiểm định tự động

Chạy theo [08 §1](08_NGHIEM_THU.md#1-kiểm-định-tự-động) trên bản đã build và phục vụ qua http, gồm `--impeccable` (W17). Mỗi vòng ra thư mục báo cáo mới, không ghi đè. Tự sửa tối đa 3 vòng; sau đó dừng và báo cáo từng lỗi còn lại kèm đề xuất. "0 phát hiện" không phải "đạt": đọc mục "Chưa kiểm" của báo cáo.

### Chặng 5 — Kiểm định người & bàn giao

Theo [08 §3–4](08_NGHIEM_THU.md#3-kiểm-định-thủ-công-theo-hạng): kiểm thủ công theo hạng, design review theo loại trang và [07 §7](07_CHONG_AI_SLOP.md#7-phép-thử), gói bàn giao.

### Chặng 6 — Sau phát hành

Áp dụng khi sản phẩm đã có người dùng thật: đo Core Web Vitals thật (RUM), thu phản hồi, xem lại ngoại lệ đến hạn.

## 3. Cổng duyệt

Không có G3: chặng 3 (xây dựng) không có cổng. Agent dừng hay làm tiếp ở mỗi cổng: [AGENTS.md §3](AGENTS.md#3-cổng--khi-nào-dừng).

| Cổng | Người duyệt |
| --- | --- |
| G0 Brief | PO / chủ dự án |
| G1 Cấu trúc | Người dùng hoặc người đại diện đi thử luồng, có ghi lại ([08 §3](08_NGHIEM_THU.md#3-kiểm-định-thủ-công-theo-hạng)) |
| G2 Hướng thị giác | PO chọn hướng; người duyệt (§4) kết luận phép thử 07 §7 trên hướng đó |
| G4 Tự động | Công cụ |
| G5 Nghiệm thu | Người duyệt theo §4 |

## 4. Người duyệt

Người làm không tự duyệt một mình. Chọn một trong ba cách, ghi cách đã dùng vào biên bản:

1. **Người thứ hai** (đồng nghiệp, bạn học) xem 15–30 phút theo checklist. **Bắt buộc** cho bản phát hành có thay đổi luồng hạng A.
2. **Agent duyệt độc lập:** một phiên agent mới, chỉ nhận brief, checklist, link xem thử và ảnh chụp — không nhận lịch sử hội thoại lúc làm. Phải liệt kê điểm trượt. Mẫu lệnh ở [10 §7](10_MAU.md#7-lệnh-cho-agent-duyệt-độc-lập). Kết luận phép thử 07 §7 bằng mắt **trước**, rồi mới nhận báo cáo máy (`audit_report.md`, kết quả impeccable) để đối chiếu.
3. **Tự duyệt sau ≥ 1 ngày**, theo checklist, đính kèm ảnh chụp. Không dùng cho hạng A, và không dùng khi người làm là agent (AGENTS §4 luật 12).

**Vòng duyệt lại (2.3):** sau khi sửa theo biên bản, vòng kiểm lại dùng **cùng người duyệt** (cùng phiên agent, kèm biên bản cũ): xác nhận từng phát hiện đã sửa / chưa, chỉ thêm phát hiện mới khi có bằng chứng trên phần đã đổi. Người duyệt **mới** chỉ dùng ở nghiệm thu cuối (G5) hoặc khi đổi hướng thị giác. Lý do: mỗi vòng một người duyệt mới làm mục tiêu dịch chuyển (hai người kết luận ngược nhau về T3 ở lần dùng thật 2.1).

**Điều kiện dừng vòng sửa:** dừng và trình PO khi (a) 0 blocker và không còn major ở cổng cứng của 07 §7, hoặc (b) đã 3 vòng mà số major không giảm, hoặc (c) phát hiện còn lại cần quyết định của PO (nghĩa dữ liệu, thêm chức năng). Ghi lý do dừng vào biên bản.

**File cổng (2.8):** mỗi cổng có người quyết để lại file trong `design-gates/` của dự án — `tham-chieu.md` (trước khi sinh bản mẫu E2–E3), `huong-da-chon.md` (sau G2, nguyên văn câu chọn), `su-that.md` (sự thật cụ thể trên trang + nguồn). Khai `"gates"` trong `design.config.json`; `audit.mjs` báo `gate-thieu`. Mượn từ huashu-design ("gate file": file không có = bước chưa làm), vì luật chỉ viết thành chữ đã bị agent bỏ qua ba vòng liền ở lần chạy thử 2.4–2.7.

**Chạy lại sau khi sửa (2.4):** mỗi vòng sửa chạy lại máy trên mọi màn đã đổi. Sửa đụng tới **bộ định tuyến, cách trả focus, luồng điều hướng hoặc state dùng chung** (store, guard rời trang) → chạy lại **toàn bộ** `states` của **mọi** màn dùng chung phần đó và mọi script thử luồng đã có, không dùng `--quick`. Lý do: lần chạy thử 2.3, thêm `popstate` để sửa lỗi Back sinh lỗi mới (xoá xong bị kéo ngược về trang vừa xoá) ở luồng đã đạt trước đó.

Kiểm thử với người dùng thật: theo [08 §3](08_NGHIEM_THU.md#3-kiểm-định-thủ-công-theo-hạng) — tính **theo bản phát hành**, không theo từng màn hình.

## 5. Quy tắc cho agent AI

Ở [AGENTS.md §4](AGENTS.md#4-luật-cứng) — nguồn duy nhất, không chép lại ở đây.
