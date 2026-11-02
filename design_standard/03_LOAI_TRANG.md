# 03 · Quy tắc theo loại trang

Mỗi mục gồm: **Mục tiêu** → **Bắt buộc** → **Tránh** (mã dấu hiệu ở [07 §4](07_CHONG_AI_SLOP.md#4-danh-mục-dấu-hiệu-theo-bậc); 2.2: "Tránh" = **có mặt** với mã bậc cấm, **vượt liều** với mã bậc tiết chế — dùng trong liều thì được) → **Kiểm riêng**. Mục này không phải template; nó nói trang phải trả lời được gì. Quy ước theo nền tảng (mobile, đồng hồ, desktop) ở [03B](03B_NEN_TANG_THIET_BI.md).

Một mục "Bắt buộc" bị trượt: blocker với hạng A, major với hạng B/C ([08 §2](08_NGHIEM_THU.md#2-mức-nghiêm-trọng)).

| Nhóm | `type` | Hạng thường gặp | Mức mặc định |
| --- | --- | --- | --- |
| Tiếp thị | `home`, `landing`, `pricing` | C | E2 (`pricing`: E1) |
| Vận hành | `dashboard`, `alert`, `list`, `detail`, `map`, `workspace` | A/B | Hạng A: E0; hạng B/C dùng hằng ngày: E1 (02 §2) |
| Nhập liệu | `form`, `auth`, `onboarding`, `settings`, `account` | A/B/C | Hạng A, form hiếm dùng: E0; còn lại E1 |
| Nội dung | `article`, `search`, `notifications` | B/C | E0–E1 |
| Thương mại | `commerce`, `checkout` | C / A | E1 / E0 |
| Khác | `ai`, `status`, `immersive`, `email` | theo luồng | E0–E1 (`immersive`: E3) |

Màn hình trạng thái (`status`) lấy hạng của luồng chứa nó; không rõ thì C.

### Trạng thái tương tác bắt buộc (mọi màn có thao tác ghi hoặc điều hướng)

Kiểm kê ở chặng 1, khai báo vào `states` (máy chỉ đo trạng thái đã khai báo). Mọi state có `steps` (trừ state `dialog`) phải có `expectFocus` (2.4). Đổi bộ định tuyến, cách trả focus hoặc luồng điều hướng → chạy lại **toàn bộ** state của mọi màn bị ảnh hưởng, không `--quick` (01 §4). Lần dùng thật 2.1–2.2: mọi vòng duyệt đều tìm ra major ở các trạng thái dưới đây khi chúng chưa được khai báo.

| Trạng thái | Kiểm gì | Khai báo mẫu (`states`) |
| --- | --- | --- |
| Đang gửi | Nút gửi không `disabled` khi đang giữ focus (dùng `aria-disabled` + chặn gửi hai lần); focus không rơi về `<body>` | bước `click` gửi + `route` có `delayMs` + `expectFocus` |
| Lỗi sau khi gửi | Lỗi theo nguyên nhân (401/403/404/mạng/5xx), focus vào khung lỗi, dữ liệu đã nhập còn | `route` lỗi + `expectFocus: "#…-error"` |
| Đổi ngữ cảnh khi đang gửi / khi chưa lưu | Không đổi dòng, đăng xuất, rời trang mà không hỏi | bước rời + `dialog: true` |
| Thành công | Về đúng chỗ, focus vào phần tử khai báo (dòng vừa sửa, dòng kế tiếp sau xoá, nút mở) | `expectFocus` |
| Điều hướng đi rồi quay lại | Back/Forward của trình duyệt: URL khớp nội dung; bộ lọc còn; hỏi nếu còn thay đổi chưa lưu; focus về nút/link đã mở | bước `back` + `expectUrl` + `ready` của trang đích + **`expectFocus`** |
| **Mỗi đường quay về** (2.4) | Liệt kê mọi cặp (trang mở → trang con → đường về: link quay lại, Huỷ, Lưu xong, Xoá xong, Back) — kể cả trang con của trang con. Mỗi cặp một state, focus về đúng phần tử đã mở trang con | một state mỗi đường, **bắt buộc `expectFocus`** (thiếu: `audit.mjs` báo `state-thieu-expectFocus`) |
| Link trực tiếp / tải lại | Mở thẳng trang con; mã không tồn tại; không có quyền | `path` riêng hoặc state có `route` |
| Độ rộng giữa | Bố cục đổi theo độ rộng (ngăn bên, bảng → danh sách): kiểm ở 1024 và 1280 ngoài ma trận | kiểm tay hoặc script đo riêng (ma trận `viewports` chỉ 320/768/1440) |

---

## Tiếp thị

### `home` — Trang chủ

**Mục tiêu:** khách lạ hiểu trong 5 giây: sản phẩm là gì, cho ai, khác gì, bước tiếp theo.

**Bắt buộc**
- Phương pháp dựng: liệt kê 5 câu hỏi/băn khoăn hàng đầu của khách theo thứ tự ưu tiên. Mỗi khối trả lời đúng một câu; **hình thức theo câu trả lời** (thế nào → demo; so với ai → bảng; bao nhiêu → giá; tin được không → bằng chứng thật).
- Màn hình đầu tiên cho thấy **sản phẩm thật** (giao diện, vật thể hoặc kết quả), không phải hình trừu tượng.
- Câu đầu trang nói cụ thể; thay tên mình bằng tên đối thủ mà câu vẫn đúng thì viết lại.
- Bằng chứng thật có nguồn; chưa có thì bỏ khối, không bịa.
- Một hành động chính, tối đa một hành động phụ; điều hướng cấp 1 tối đa 7 mục.

**Tránh:** G2-03, G2-04, G2-09, G3-09, G3-10, S-05.

**Kiểm riêng:** phép thử 5 giây với 3 người không biết sản phẩm (khi có người để hỏi); LCP mobile.

### `landing` — Landing chiến dịch

**Bắt buộc**
- Một mục tiêu chuyển đổi; nút chính lặp lại sau mỗi đoạn thuyết phục dài.
- Thông điệp khớp kênh dẫn vào (quảng cáo, email).
- Form ngắn nhất có thể; nói dữ liệu dùng làm gì.
- E3: theo [06](06_CHUYEN_DONG_3D.md); nút chính bấm được ngay khi tải.

**Tránh:** điều hướng đầy đủ kéo người dùng đi; đếm ngược giả; popup chặn nội dung ngay khi vào.

### `pricing` — Bảng giá

**Bắt buộc**
- Giá thật, ghi rõ đã gồm VAT chưa; đơn vị tiền theo [05 §1.5](05_NGON_NGU.md#15-số-ngày-tiền-địa-chỉ).
- Bảng so sánh các gói cùng thứ tự hàng; dấu ✓/✗ có chữ thay thế cho trình đọc màn hình.
- Nút chuyển năm/tháng hiển thị **tổng tiền thực trả**, không chỉ "tiết kiệm 20%".
- Câu hỏi về thanh toán, huỷ, hoàn tiền trả lời ngay trên trang.

**Tránh:** G3-13 (nhãn "Phổ biến nhất" không có số liệu); gói rẻ nhất cố tình làm xấu.

---

## Vận hành

### `dashboard` — Tổng quan

**Mục tiêu:** trả lời "tôi cần chú ý gì, làm gì bây giờ?"

**Bắt buộc**
- Ghi 3–5 câu hỏi người dùng mở dashboard để trả lời; mỗi khối trả lời một câu; khối không trả lời câu nào thì bỏ.
- Việc cần xử lý (cảnh báo, quá hạn) đứng trước số liệu tổng hợp.
- Mỗi con số có ngữ cảnh: so với gì, kỳ nào, tốt hay xấu. Bấm vào số mở danh sách đã lọc tương ứng.
- Biểu đồ theo [04 §7](04_NEN_TANG.md#7-biểu-đồ-và-dữ-liệu).
- Hạng A: cảnh báo đang mở dẫn tới màn hình `alert`; dashboard không thay cho luồng xử lý cảnh báo.

**Tránh:** G2-05, G2-06, G2-07, G2-12, G2-14; lời chào "Chào mừng trở lại 👋" ở vị trí đầu.

**Kiểm riêng:** hỏi người dùng "việc đầu tiên bạn làm khi mở trang?" và đo thời gian họ tìm thấy.

### `alert` — Cảnh báo, sự cố, xử lý khẩn (hạng A, E0)

**Mục tiêu:** đúng người biết đúng lúc, xử lý được và có dấu vết.

**Bắt buộc**
- Mức ưu tiên rõ (khẩn / cao / thường) bằng chữ + icon + màu + âm/rung; mức khẩn không bao giờ tự ẩn.
- Mỗi cảnh báo có: ai/cái gì, ở đâu, khi nào (giờ tuyệt đối + "x phút trước"), nguồn (thiết bị, cảm biến).
- Hành động: **Tiếp nhận** → **Chuyển tiếp/Gọi** → **Đã xử lý**, ghi người thực hiện và thời gian; dòng thời gian của sự cố.
- Cảnh báo không ai tiếp nhận sau N phút (N trong brief) tự leo thang tới người tiếp theo.
- Phân biệt "báo nhầm" với "đã xử lý"; báo nhầm vẫn lưu lịch sử.
- Trên thiết bị: cách cảnh báo tới được máy khoá/im lặng theo [phụ lục](PHU_LUC_THIET_BI_DEO_VA_CANH_BAO.md#2-cảnh-báo-khẩn-trên-thiết-bị).
- Ví dụ: cảnh báo vận hành (server sập, kho hết hàng), an ninh (đăng nhập lạ), tài chính (giao dịch bất thường), y tế/chăm sóc. Luồng người dùng tự gửi cảnh báo khẩn: [phụ lục](PHU_LUC_THIET_BI_DEO_VA_CANH_BAO.md#1-đồng-hồ-wear-os).

**Tránh:** G2-07 (chấm nhấp nháy là tín hiệu khẩn duy nhất); toast tự ẩn cho cảnh báo; nút "Bỏ qua" cùng cỡ và sát nút "Tiếp nhận".

**Kiểm riêng:** diễn tập với người dùng thật: từ lúc cảnh báo xuất hiện tới lúc tiếp nhận mất bao lâu, ở máy khoá và máy đang dùng app khác.

### `list` — Quản lý danh sách / bảng

**Bắt buộc**
- `<table>` thật cho dữ liệu dạng bảng, có `<caption>` hoặc nhãn, `<th scope>`.
- Lọc, sắp xếp, trang hiện tại, cột hiển thị lưu trong URL; hạng B có "chế độ xem đã lưu".
- Phân trang mặc định 25/50/100. Chỉ ảo hoá khi trên ~500 dòng hoặc đo thấy giật; khi ảo hoá, công bố tổng số dòng và vị trí.
- Cột số căn phải, `tabular-nums`; ngày theo [05](05_NGON_NGU.md).
- Tiêu đề cột dính khi cuộn; trên màn hẹp, cột định danh dính hoặc chuyển sang dạng danh sách (trường chính + trường phụ).
- Chọn nhiều có đếm số đã chọn; thao tác hàng loạt có hoàn tác.
- Hạng B: phím tắt cho 3 thao tác dòng phổ biến nhất; sửa nhanh tại chỗ cho trường đơn; cập nhật lạc quan có hoàn nguyên khi lỗi; menu chuột phải lặp lại thao tác dòng (desktop).
- Trạng thái: tải lần đầu, tải lại (giữ dữ liệu cũ), rỗng do lọc (nút xoá lọc), chưa có dữ liệu (hành động tạo), lỗi.

**Tránh:** mỗi dòng là một card trên desktop; cắt ellipsis cột định danh ở hạng A; icon thao tác không nhãn.

**Kiểm riêng:** 0, 1, 10.000 bản ghi; tên rất dài; thao tác toàn bộ bằng bàn phím.

### `detail` — Xem chi tiết

**Bắt buộc**
- Khối đầu: định danh (tên, mã), trạng thái, 1–2 hành động chính.
- Thuộc tính quan trọng trước, nhóm theo ý nghĩa nghiệp vụ; cặp nhãn–giá trị dùng `<dl>` hoặc bảng.
- Lịch sử hoạt động mới nhất trước.
- Quay lại danh sách giữ nguyên bộ lọc.
- Trạng thái: không tìm thấy, không có quyền, đã xoá, tải từng phần.

**Tránh:** G2-16 vượt liều; tab cho nội dung vài dòng; nút xoá cùng kiểu và sát nút lưu; nhãn xoá nói giảm ("Ngừng bán", "Lưu trữ") khi thao tác là xoá cứng (G2-09d).

### `map` — Bản đồ, theo dõi vị trí, vùng an toàn

**Bắt buộc**
- Có dạng danh sách/chữ tương đương bản đồ (địa chỉ, khoảng cách, trạng thái) cho trình đọc màn hình và khi bản đồ lỗi.
- Hiển thị thời điểm cập nhật vị trí cuối và bán kính sai số; vị trí cũ quá ngưỡng hiển thị khác hẳn vị trí trực tiếp.
- Điều khiển bản đồ (phóng, di chuyển, chọn điểm) dùng được bằng bàn phím và nút, không chỉ cử chỉ.
- Xin quyền vị trí "luôn cho phép" chỉ khi cần, giải thích lý do và mức tốn pin trước hộp thoại hệ thống.
- Vùng an toàn (geofence): vẽ được bằng thao tác thay thế (nhập bán kính quanh địa chỉ), có tên vùng.

**Tránh:** bản đồ toàn màn hình che mất thông tin cần làm; màu ghim là cách phân biệt trạng thái duy nhất.

### `workspace` — Bảng kanban, lịch, trình soạn thảo

**Bắt buộc**
- Mọi thao tác kéo–thả có cách làm bằng bàn phím hoặc menu (WCAG 2.5.7).
- Phím tắt có bảng tra (`?`); bảng lệnh (⌘/Ctrl + K) khi có trên ~10 đích hoặc lệnh.
- Tự lưu có trạng thái "Đã lưu / Đang lưu / Lỗi"; hoàn tác/làm lại.
- Lịch: múi giờ rõ; tuần bắt đầu thứ Hai với `vi`.

---

## Nhập liệu

### `form` — Biểu mẫu, wizard

**Bắt buộc**
- Nhãn luôn hiển thị phía trên trường. Flutter: `labelText` với `floatingLabelBehavior: FloatingLabelBehavior.always`, hoặc `Text` nhãn riêng phía trên.
- Một cột trên màn hẹp; ghép cột chỉ khi trường liên quan.
- Đánh dấu trường bắt buộc **hoặc** tuỳ chọn — cách nào ít dấu hơn, nhất quán.
- `type`, `inputmode`, `autocomplete` đúng; mã số (OTP, CCCD, số thẻ) dùng `inputmode="numeric"`, không `type="number"`.
- Lỗi ở tại trường, nói cách sửa; khi gửi, focus lỗi đầu tiên; form dài có tóm tắt lỗi.
- Nút gửi luôn bấm được (nói thiếu gì khi bấm); chống gửi hai lần.
- Wizard: bước hiện tại / tổng; quay lại không mất dữ liệu; lưu nháp form dài.
- Hạng A: bước xem lại trước khi gửi.

**Tránh:** nhãn trôi biến mất khi nhập ở form dài hoặc cho người dùng lớn tuổi; chặn dán.

### `auth` — Đăng nhập, đăng ký, khôi phục

**Bắt buộc**
- `autocomplete`: `username`, `current-password`, `new-password`, `one-time-code`; nút hiện/ẩn mật khẩu có nhãn.
- Đăng nhập và khôi phục: thông báo lỗi không tiết lộ email/số điện thoại có tồn tại hay không. Đăng ký: chống dò bằng giới hạn tần suất.
- Không đòi giải đố nhận thức (SC 3.3.8): cho dán mã, hỗ trợ trình quản lý mật khẩu, passkey hoặc liên kết email.
- Mã OTP: thời hạn đủ dài và có gửi lại (SC 2.2.1); Việt Nam: OTP qua SMS/Zalo, tự điền bằng `one-time-code`.

**Tránh:** G3-15; minh hoạ đẩy form xuống dưới màn hình trên mobile.

### `onboarding` — Lần đầu sử dụng

**Bắt buộc**
- Cho người dùng làm được việc thật sớm nhất; hướng dẫn gắn vào việc đó, không là chuỗi slide.
- Bỏ qua được; xem lại được từ menu trợ giúp.
- Xin quyền (vị trí, thông báo, cảm biến) đúng lúc cần, giải thích lý do trước hộp thoại hệ thống.

### `settings` — Cài đặt

**Bắt buộc**
- Nhóm theo việc người dùng muốn làm.
- Một cơ chế lưu mỗi trang: tự lưu (báo "Đã lưu") hoặc nút lưu (cảnh báo khi rời trang chưa lưu).
- Switch chỉ cho thay đổi có hiệu lực ngay; cần bấm lưu thì dùng checkbox.
- Vùng nguy hiểm tách riêng; xoá tài khoản xác nhận bằng cách gõ tên.

### `account` — Tài khoản, hồ sơ

**Bắt buộc:** đổi email/số điện thoại có xác minh; xuất dữ liệu cá nhân và xoá tài khoản tìm được; ảnh đại diện có chữ cái thay thế.

---

## Nội dung

### `article` — Bài viết, tài liệu

**Bắt buộc**
- Khối chữ khoảng 60–75 ký tự/dòng (`max-width: 65ch` để bắt đầu); cỡ thân 16–20px; line-height theo [05](05_NGON_NGU.md).
- Heading có neo; mục lục cho bài dài; `scroll-margin-top` khi có thanh dính.
- Code block cuộn ngang, có nút sao chép; bảng rộng cuộn trong khung riêng.
- Ngày đăng và ngày cập nhật.

**Tránh:** căn đều hai bên; chữ xám nhạt cho thân bài.

### `search` — Tìm kiếm

**Bắt buộc**
- Giữ từ khoá trong ô; số kết quả; gợi ý khi không có kết quả.
- Tiếng Việt: tìm được khi gõ không dấu và khi khác kiểu đặt dấu ([05 §1.6](05_NGON_NGU.md#16-unicode-tìm-kiếm-sắp-xếp)).
- Bộ lọc trong URL; số kết quả mới báo qua `aria-live="polite"`.

### `notifications` — Thông báo, hộp thư

**Bắt buộc**
- Phân biệt đã đọc/chưa đọc bằng hơn một tín hiệu (đậm + chấm + nhãn cho trình đọc màn hình).
- Mỗi thông báo dẫn tới đúng đối tượng; đánh dấu đã đọc hàng loạt.
- Cài đặt kênh nhận (app, email, SMS) theo loại thông báo.
- Hạng A: thông báo khẩn không bị gộp hoặc ẩn trong luồng thường.

---

## Thương mại

### `commerce` — Danh mục, sản phẩm, giỏ hàng

**Bắt buộc**
- Danh mục: ảnh cùng tỉ lệ, giá gốc/giá giảm rõ, tình trạng hàng.
- Sản phẩm: ảnh thật nhiều góc, thông số dạng bảng, phí vận chuyển và chính sách đổi trả trước khi vào giỏ.
- Giỏ: sửa số lượng tại chỗ, tổng cập nhật ngay.

### `checkout` — Thanh toán (hạng A, E0)

**Bắt buộc**
- Ít bước nhất; không điều hướng gây rời trang; tổng cuối cùng (gồm phí, thuế) hiện trước nút trả tiền.
- Việt Nam: số điện thoại trước email; phương thức phổ biến là lựa chọn hạng nhất — chuyển khoản QR (VietQR), ví (MoMo, ZaloPay, VNPay), thẻ, COD; ghi rõ VAT.
- Mua không cần tài khoản khi nghiệp vụ cho phép.

**Tránh:** phí ẩn ở bước cuối; ô đã tích sẵn đăng ký quảng cáo.

---

## Khác

### `ai` — Trợ lý AI, chat, tính năng sinh nội dung

**Bắt buộc**
- Hiển thị dần khi trả lời (streaming) có nút **Dừng**; tạo lại; sửa câu hỏi đã gửi.
- Trích dẫn liên kết tới nguồn khi trả lời dựa trên tài liệu.
- Cảnh báo "có thể sai" đặt ngay chỗ kết quả quan trọng, không chỉ ở chân trang.
- Kết quả sao chép, sửa được; vùng trả lời là `aria-live="polite"` với cách đọc lại cả câu trả lời.
- Hạng A: kết quả AI không tự áp dụng khi chưa có người xem lại.

**Tránh:** G2-08 (tia lấp lánh là tín hiệu duy nhất); hiệu ứng gõ chữ giả khi nội dung đã có sẵn.

### `status` — 404, lỗi, bảo trì, rỗng

**Bắt buộc:** nói chuyện gì xảy ra, có phải do người dùng không, làm gì tiếp; trả đúng mã HTTP (404, 500, 503).

**Tránh:** minh hoạ dễ thương thay cho thông tin; giọng đùa ở lỗi mất dữ liệu.

### `immersive` — Kể chuyện, 3D (E3)

**Bắt buộc**
- Kịch bản theo cảnh, mỗi cảnh một ý, một cao trào; không "cuộn chết".
- Mọi chữ đọc được khi không có chuyển động; có bản tĩnh.
- Mobile dàn dựng riêng.
- Kỹ thuật và ngân sách theo [06](06_CHUYEN_DONG_3D.md).

### `email` — Email giao dịch

**Bắt buộc**
- Dòng tiêu đề nói việc cụ thể ("Đơn #1234 đã giao"); nội dung chính đọc được khi ảnh bị chặn.
- Bố cục một cột, rộng ~600px, chữ ≥ 14px; nút là liên kết có chữ, không phải ảnh.
- Có phiên bản văn bản thuần; `lang` đúng; dark mode của trình đọc mail không làm mất logo/chữ.
