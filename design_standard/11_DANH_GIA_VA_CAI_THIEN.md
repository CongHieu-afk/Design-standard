# 11 · Đánh giá và cải thiện màn hình có sẵn

> **Hiệu lực tạm từ design_standard@2.0 (29/10/2026)** theo yêu cầu người dùng, chờ người thật duyệt (sổ, D12). Đã qua 2 vòng phản biện độc lập (đối chiếu mã nguồn; chạy thử trên giấy với Lab02); các dòng ở §9 đã đưa vào 08 và AGENTS. Chưa có người thật duyệt và chưa chạy thật trọn một vòng: lần dùng thật đầu tiên ghi lại chỗ vướng vào CHANGELOG. Bằng chứng và lý do: [DANH_GIA_CONG_CU_VA_QUY_TRINH_2026-10.md](DANH_GIA_CONG_CU_VA_QUY_TRINH_2026-10.md). Công cụ cho từng bước: [12](12_BAN_DO_CONG_CU.md) §3.

File này chỉ nói **làm theo thứ tự nào**. Kiểm gì, mức nghiêm trọng, khi nào xong: [08](08_NGHIEM_THU.md). Hành vi agent: [AGENTS.md](AGENTS.md).

## 0. Khi nào dùng

- **Dùng** khi yêu cầu là đánh giá, hoặc đánh giá rồi cải thiện, **cả một màn hình** đã có. Ví dụ: "đánh giá trang danh sách này và làm bản đã sửa".
- **Không dùng** cho sửa một lỗi cụ thể đã biết → làn S. Dựng màn hình mới → làn M/L ([01](01_QUY_TRINH.md)).

Bốn nguyên tắc:
1. **Đánh giá đủ trước, sửa sau.**
2. **Công cụ tự động là sàn, không phải trần.** "0/0/0" chỉ nói các luật máy đo được không vi phạm, ở các trạng thái đã chụp.
3. **Người giao việc (PO/chủ dự án) chọn phạm vi**, sau khi được nói bằng lời thường mỗi lựa chọn làm màn hình khác đi thế nào (§4).
4. **Người làm không tự kết luận đạt.** Phép thử 07 §7 do người duyệt kết luận ([01 §4](01_QUY_TRINH.md#4-người-duyệt)).

## 1. Thẻ phân loại

Ghi ở đầu báo cáo, theo [AGENTS §1](AGENTS.md#1-phân-loại-ghi-ở-đầu-câu-trả-lời). Ô "Làn" điền sau §4.

```
Việc: Đánh giá | Cải thiện        Làn: (điền sau §4)
Màn hình: <id> · route · Loại · Hạng · Mức biểu cảm (E0–E3) · Nền tảng · Ngôn ngữ · Con trỏ
Người dùng & tác vụ chính: <dòng brief đã duyệt | "Giả định: …">
Brief đã duyệt: có / không
Token: token dự án | giá trị mặc định (của thư viện hoặc của AI) | lai | không có biến (màu viết cứng)
```

Cách phân biệt ô "Token" — xét **họ màu và quyết định**, không xét "có khác giá trị gốc của thư viện không":
- **Token dự án:** có thẻ hướng hoặc brief đã duyệt giải thích các giá trị; màu nhấn không thuộc G2-01 hay dải tông của DF nào (bảng phân nhóm DF ở 07 §5, đo bằng tông OKLCH), **hoặc** thuộc nhưng có lý do hợp lệ (ví dụ màu thương hiệu PO xác nhận).
- **Giá trị mặc định:** có biến CSS nhưng màu nhấn thuộc G2-01 (indigo/violet/blue trên zinc/slate) hoặc họ màu của một DF, và không có lý do hợp lệ. Gồm cả biến shadcn nguyên bản (đen/xám) lẫn indigo-600 của Tailwind mà AI hay chọn. Sửa độ sáng để đạt tương phản không đổi được ô này.
- **Lai:** có biến cho một phần, phần khác màu viết cứng (`emerald-`, `amber-`… trong component). Phần viết cứng là phát hiện W18.
- **Không có biến:** màu viết cứng khắp nơi.

Không có brief đã duyệt: các luật và phép thử cần brief (07 §3 lý do hợp lệ; 07 §7 T2, T4, phần "chỉ về thẻ hướng" của T1) ghi **"không áp được — thiếu brief"**.

## 2. Chuẩn bị môi trường

Mục tiêu: có một cách chạy lại được. **Không sửa cấu hình, không ghi dữ liệu của dự án.** Chi tiết theo hệ điều hành ở [Phụ lục A](#phụ-lục-a--môi-trường-windows).

- [ ] **Bản build phục vụ qua http** ([08 §1](08_NGHIEM_THU.md#1-kiểm-định-tự-động)). Build ra thư mục riêng; không ghi đè `dist/` hay cache. Biến `VITE_*`/`NEXT_PUBLIC_*` được gắn lúc build.
- [ ] **`design.config.json`, file phiên, báo cáo:** đặt ở thư mục kết quả **ngoài** dự án. File phiên chứa token để ở thư mục tạm của hệ điều hành.
- [ ] **Backend:** khác biệt môi trường xử lý bằng biến môi trường lúc chạy, ghi tên biến (không ghi giá trị bí mật).
  - Không dựng được backend: chạy một máy chủ fixture trả JSON ở cổng API, hoặc trỏ API sang nó lúc build.
  - Cả hai đều không làm được: kết luận "Đánh giá dở dang".
- [ ] **Dữ liệu cho từng trạng thái** loại trang yêu cầu (03 "Kiểm riêng": 0, 1, nhiều, tên rất dài, lỗi API): khai báo trong `design.config.json` của thư mục kết quả.
  - `route` (màn hình hoặc từng state): trả fixture JSON hoặc mã lỗi thay API. `initStorage`: token **giả** khi API đã là fixture, không cần backend hay tài khoản.
  - `states`: các bước dựng trạng thái (bấm, nhập, chọn); `"dialog": true` để máy kiểm focus, tên, Escape, trả focus.
  - **Không bao giờ tạo, sửa, xoá trên dữ liệu thật** để kiểm.
  - Fixture không chứa dữ liệu cá nhân hay sức khoẻ thật.
- [ ] **Đăng nhập:** chỉ tài khoản test của chính dự án (README, seed, hoặc dữ liệu mẫu trong code của dự án).
- [ ] **Server:** ghi cổng và PID của mọi server đã bật; xác nhận còn sống trước mỗi lần đo.
- [ ] **Điều kiện sẵn sàng:** khai báo `ready` (selector của nội dung chính, ví dụ tên một bản ghi trong fixture). `audit.mjs` chờ nó hiện; không thấy thì báo blocker `not-ready` và không đo tiếp. Vẫn xem ảnh chụp: không còn khung xương, không bị hộp đăng nhập che.

## 3. Đánh giá bốn lớp (chưa sửa gì)

**Ảnh hiện trạng:**
- Trạng thái: **mọi** trạng thái trong mục "Trạng thái" và "Kiểm riêng" của loại trang ở [03](03_LOAI_TRANG.md) (ví dụ `list`: tải lần đầu, tải lại, chưa có dữ liệu, rỗng do lọc, lỗi, 0/1/rất nhiều bản ghi, tên rất dài), và **mọi dialog có trong mã** (tìm `role="dialog"`, `<dialog`, component Dialog/Modal), kể cả dialog đăng nhập. Không dựng được trạng thái nào thì ghi tên nó vào "Chưa kiểm".
- Hạng A/B: ma trận [03B §0](03B_NEN_TANG_THIET_BI.md#0-ma-trận-kích-thước-kiểm-định) × theme cho trạng thái đầu; trạng thái khác: hẹp nhất và rộng nhất.
- Hạng C: hẹp nhất và rộng nhất, theme sáng.
- Người duyệt nhận **một tờ ảnh ghép mỗi trạng thái** (320 + 1440, thêm theme tối khi có phát hiện riêng theme), không nhận từng file rời.
- Thêm ảnh **làm mờ 8px** của trạng thái đầu (T3), trước khi sửa.

| Lớp | Kiểm gì | Công cụ hiện có | Ai kết luận |
| --- | --- | --- | --- |
| **Lớp 1 · Máy** | [08 §1](08_NGHIEM_THU.md#1-kiểm-định-tự-động) W1–W18 / F1–F6 | ✓ `audit.mjs --impeccable` (đủ, không `--quick`) với `ready` + `states` của §2: mọi trạng thái khai báo, chi tiết axe (tỉ lệ, màu), dialog. W1: không có file token thì rút cặp màu từ `:root`/`.dark` ra `tokens.json` tạm rồi chạy `check_tokens.mjs`. W18: lệnh `rg` ở [12 §5.3](12_BAN_DO_CONG_CU.md#53-tailwind-token-ở-cấu-hình-không-ở-class). Flutter: ✓ mẫu widget test + `flutter_text_contrast_scan.dart` | Công cụ |
| **Lớp 2 · Loại trang & nền tảng** | Từng mục "Bắt buộc", "Tránh", "Kiểm riêng" của [03](03_LOAI_TRANG.md) và [03B](03B_NEN_TANG_THIET_BI.md) | Tay: code + ảnh | Người làm ghi bằng chứng; người duyệt xác nhận, kể cả các mục "không áp" |
| **Lớp 3 · Phép thử theo mức** | Theo "Kết luận" của mức ở [07 §7](07_CHONG_AI_SLOP.md#7-phép-thử): T10 (bậc cấm = 0, tiết chế trong liều), T12, T3, T6, T7, T9; E0 thêm checklist [04 §11](04_NEN_TANG.md#11-mặc-định-e0) | Tay + ảnh. Liệt kê dấu hiệu 07 §4 có trên màn (gồm mã máy báo) kèm bậc và liều; ảnh làm mờ T3; E2–E3: đặt cạnh bản sinh không ràng buộc (T1). Kết quả impeccable (W17) là bằng chứng phụ, **không** bắt G2-01/G2-10 | Người làm chạy thử; **người duyệt kết luận** |
| **Lớp 4 · Nội dung** | [05](05_NGON_NGU.md): viết hoa đầu câu, thuật ngữ nghiệp vụ; tìm kiếm và sắp xếp tiếng Việt (05 §1.6); số/tiền/ngày (05 §1.5); không lộ thuật ngữ kỹ thuật (T9); **nhãn đúng với việc code làm** | Tay: đọc mọi chữ, kể cả trong dialog, đối chiếu code | Như lớp 2 |

**Kiểm tay theo hạng** ([08 §3](08_NGHIEM_THU.md#3-kiểm-định-thủ-công-theo-hạng)), tối thiểu:
- Bàn phím đi hết tác vụ chính, **gồm mở và đóng mọi dialog**: vào được bằng phím, focus đầu đúng chỗ, Escape đóng được, đóng xong focus trả về chỗ cũ.
- Mỗi thao tác ghi/xoá thử **đường lỗi** bằng cách ở §2 (không đụng dữ liệu thật): lỗi phải hiện ở chỗ người dùng đang nhìn.

Mục không làm được thì ghi "Chưa kiểm" kèm lý do. Không ghi đã kiểm khi công cụ không làm được việc đó.

**Đầu ra:** một bảng phát hiện duy nhất, gộp theo **nguyên nhân**. Mỗi dòng: lớp · mã mục chuẩn · mức nghiêm trọng ([08 §2](08_NGHIEM_THU.md#2-mức-nghiêm-trọng)) · số phần tử bị ảnh hưởng · bằng chứng.

## 4. Chọn phạm vi (cổng — dừng)

### Bốn nhóm

| Nhóm | Gồm | Bắt buộc? |
| --- | --- | --- |
| **a. Sửa lỗi** | Mọi blocker/major ở mọi lớp **sửa được mà không thêm chức năng**. Ví dụ: tương phản, vùng chạm, tên trợ năng, dialog không đóng bằng Escape, lỗi bị nuốt, nhãn sai sự thật, thiếu trạng thái, bố cục màn hẹp | **Có** |
| **b. Phép thử theo mức** | Mục trượt ở lớp 3: cổng cứng của 07 §7 "Kết luận" phải sửa; dấu hiệu tiết chế vượt liều xử lý theo 08 §2. Hai phần: | **Có** cho cổng cứng |
| | **b1** — không đổi hướng thị giác. Mức tối thiểu phải đạt: T3 (một điểm nhấn: nút phá huỷ dạng viền hoặc trong menu, không cột nút đỏ đặc); T6/T9 (ngôn từ, viết hoa đầu câu); 04 §11: ≤ 2 màu chữ mỗi dòng dữ liệu, không `font-bold` trong ô bảng, mép trái thẳng, bỏ card bọc thừa (bỏ khung bọc là b1/làn S; **đổi thứ tự khối** là làn M) | |
| | **b2** — T10, giao diện mặc định: đổi giá trị token (màu nhấn, bề mặt, bo góc, bóng, font). Cần **brief rút gọn** ([10 §1](10_MAU.md#1-brief)) và **một hướng thị giác** có ảnh, PO xác nhận (cổng G2). Hướng b2 phải khác màn hình hiện tại ở **≥ 2** trong {họ màu nhấn, mô hình bề mặt (card / phẳng / kẻ), font, bố cục} — chỉ đổi màu là tô lại, không phải b2. Hướng b2 là bản **đã gọt từ bản mẫu sinh bằng công cụ** (07 §2), kèm bảng gọt. Không áp luật vân tay (AGENTS §4 luật 5 chỉ cho L và Khởi tạo); màu nhấn gần dải DF được nếu PO chọn, thẻ hướng ghi rủi ro. Dự án "không có biến": việc này là Khởi tạo ([01 §1](01_QUY_TRINH.md#khởi-tạo-hệ-thống-thiết-kế-chạy-một-lần)) | |
| **c. Minor còn lại** | Tay nghề, nhất quán không thuộc a, b | Tuỳ chọn |
| **Thiếu chức năng** | Mục "Bắt buộc" của 03 cần **thêm chức năng** (ví dụ hạng B: chọn nhiều, phím tắt, sửa tại chỗ, hoàn tác xoá) | Không làm trong 11 và **không chặn** "xong" của nhóm a (08 §2). Agent ghi "đề xuất chờ PO": ngoại lệ có hạn ([10 §4](10_MAU.md#4-ngoại-lệ): agent không tự thêm) hoặc việc làn M |

### Agent trình gì ở cổng

Trình bằng lời thường, không chỉ mã mục:
1. Bảng nhóm, mỗi nhóm một câu "**sau khi làm, màn hình khác đi thế nào**". Bắt buộc nói thẳng: "Chỉ làm nhóm a và b1, trang trông gần như cũ. Muốn khác thấy được, cần duyệt hướng b2."
2. **Brief rút gọn nháp** (agent viết từ những gì biết, mọi dòng đánh dấu "Giả định").
3. **Một hướng thị giác nháp cho b2**, gồm thẻ hướng ([10 §2](10_MAU.md#2-thẻ-hướng-thị-giác)), ảnh 320/1440 dựng thử trong bản sao, và ảnh làm mờ 8px (T3) **trước và sau** đặt cạnh nhau.
   - Bản b2 xuất phát từ bản mẫu sinh, gọt theo 07 §4; giữ ≥ 3 điểm tốt của bản mẫu.
   - Không chỉ đổi từ mặc định này sang mặc định khác: phải có bảng gọt và lý do cho thứ vượt liều.
4. Danh sách ngoại lệ đề xuất cho phần "Thiếu chức năng".

PO trả lời "cứ làm theo đề xuất" = xác nhận brief nháp và hướng nháp. Ghi đúng câu trả lời vào biên bản.

**Chạy không tương tác** (không có ai trả lời): làm a và b1, giữ hướng nháp b2 ở dạng đề xuất. Trạng thái là **"Dừng ở G2"**, không phải xong.

**Làn** (điền vào thẻ §1): a, b1 là S (kể cả dự án "không có biến": ghi "Chưa có token"); có đổi bố cục hoặc luồng là M; b2 là M có cổng G2; b2 ở dự án "không có biến" là M + bước Khởi tạo.

## 5. Sửa

- Sửa ở nhánh. Không có git, hoặc PO muốn giữ nguyên bản gốc: sửa ở **bản sao**.
- Sửa ở gốc rễ: token hoặc biến thể component, không vá từng chỗ.
  - Đổi thứ dùng chung thì chạy lại lớp 1 cho **mọi màn hình dùng nó**.
  - Thành chuyển token hàng loạt thì nâng làn M ([01 §1 Giao diện cũ](01_QUY_TRINH.md#giao-diện-cũ-legacy)).
- Mỗi lần một nhóm. Mỗi thay đổi ghi mã mục chuẩn hoặc lý do hợp lệ (07 §3).
- Không lách công cụ ([AGENTS §4 luật 2](AGENTS.md#4-luật-cứng)). Bỏ `aria-label` thừa để tên khớp chữ hiển thị là sửa đúng; thêm `aria-hidden` để giấu lỗi là lách.

## 6. Kiểm lại

- Lớp 1 đủ, không `--quick`. Mỗi vòng ra một thư mục mới (`--out vong2`; mặc định `audit_out/<ngày-giờ>`), **không ghi đè** báo cáo cũ, vì báo cáo cũ là bằng chứng. `audit.mjs` từ chối ghi vào thư mục đã có báo cáo.
- Lớp 2–4 cho phần đã đổi, và cho mọi màn hình chịu ảnh hưởng của thay đổi dùng chung. Sửa đụng bộ định tuyến, trả focus, guard rời trang: chạy lại toàn bộ `states` và script thử luồng của mọi màn dùng chung ([01 §4](01_QUY_TRINH.md#4-người-duyệt) "Chạy lại sau khi sửa", 2.4).
- Tối đa 3 vòng. Còn lỗi thì dừng, báo từng lỗi kèm đề xuất. Điều kiện dừng và **vòng duyệt lại dùng cùng người duyệt**: [01 §4](01_QUY_TRINH.md#4-người-duyệt) (2.3).

## 7. Duyệt

Theo [01 §4](01_QUY_TRINH.md#4-người-duyệt), ghi cách đã dùng. **Agent không dùng cách 3** (tự duyệt sau ≥ 1 ngày).
- **Cải thiện:** bắt buộc.
- **Đánh giá thuần:** không có người duyệt thì mọi phép thử 07 §7 ghi **"Chưa kết luận"**, mọi mục "không áp" ghi "chưa xác nhận".

Người duyệt nhận, theo hai giai đoạn của [10 §7](10_MAU.md#7-lệnh-cho-agent-duyệt-độc-lập):
- giai đoạn 1: thẻ phân loại, code, tờ ảnh ghép mỗi trạng thái (§3), ảnh làm mờ, lệnh chạy lại để tự chụp thêm;
- giai đoạn 2, **sau khi** kết luận giai đoạn 1 đã lưu thành file: `audit_report.md` thô.

Người duyệt là agent: kết luận giai đoạn 1 được ghi ra file (có giờ) **trước** khi `audit_report.md` được đưa vào phiên đó; biên bản ghi danh sách đầu vào đã đưa.

Người duyệt **không** nhận bảng phát hiện hay kết luận của người làm. Không có brief thì ghi "không có brief đã duyệt" vào đầu vào của mẫu [10 §7](10_MAU.md#7-lệnh-cho-agent-duyệt-độc-lập).

Thứ tự (theo cách tách hai agent của impeccable `critique`): người duyệt xem ảnh và kết luận phép thử 07 §7 **trước**; sau đó mới mở `audit_report.md` để đối chiếu. Máy chỉ được thêm phát hiện, không được làm người duyệt rút lại kết luận "trượt" nếu không có bằng chứng mới.

Phát hiện blocker/major **và mọi trượt phép thử của lớp 3** quay lại §4.

## 8. Bàn giao và dọn dẹp

- [ ] **So sánh trước/sau nhìn được:** cùng kích thước, cùng vị trí, cắt đúng vùng đã đổi, phóng to khi khác biệt nhỏ. Kèm bảng số đo cho thay đổi không nhìn thấy (tỉ lệ tương phản, kích thước, tên trợ năng).
- [ ] Bảng phát hiện: đã sửa / chưa sửa (lý do, ngoại lệ đề xuất) / không áp (đã xác nhận?) / chưa kiểm.
- [ ] Phạm vi đã kiểm: màn hình, trạng thái, kích thước, theme, dữ liệu (thật hay fixture).
- [ ] Nhóm không làm và hậu quả nhìn thấy.
- [ ] Cách chạy lại.
- [ ] Dọn: tắt server theo cổng và PID; xoá file phiên/token; ghi sổ bàn giao.

## 9. Định nghĩa "xong"

Ở [08 §5](08_NGHIEM_THU.md#5-định-nghĩa-hoàn-thành-theo-làn), dòng "Đánh giá" và "Cải thiện". Lịch sử thay đổi: CHANGELOG.

## 10. Chất lượng nền — thay cho chữ "hiện đại"

"Hiện đại" đứng một mình không phải lý do cho thứ vượt liều ([AGENTS §4 luật 4](AGENTS.md#4-luật-cứng)). Khi người giao việc muốn giao diện "hiện đại", hiểu là các tiêu chí dưới đây **cộng** các quy ước thân thiện ở bậc tự do (07 §4: bo góc mềm, pill, nhãn màu nhạt, bóng mềm cho khối nổi, chuyển cảnh nhẹ). Gradient, kính mờ, bento được dùng trong liều (07 §4 bậc tiết chế), không cần để "hiện đại".

**Bảng này là thước đo, không phải phạm vi.** Phạm vi vẫn do §4 quyết định.

| Tiêu chí | Áp cho | Nguồn / mã |
| --- | --- | --- |
| Thích ứng ở màn hẹp, không cuộn ngang trang (bảng: chuyển dạng danh sách **hoặc** cột định danh dính) | Mọi trang; cách cụ thể theo loại | W3, 03 theo loại |
| Các trạng thái 03 liệt kê cho loại trang và các trạng thái đã kiểm kê ở chặng 1, mỗi trạng thái có lối đi tiếp | Theo loại | 04 §8, 03 |
| Trạng thái xem giữ được qua tải lại/chia sẻ | Loại có yêu cầu này ở 03 (ví dụ `list`) | 03 |
| Tương phản, vùng chạm, focus nhìn thấy, bàn phím, tên trợ năng khớp chữ hiển thị | Mọi trang | W2, W4, W5 |
| Phóng to 200%, text-spacing, giảm chuyển động không mất nội dung | Web | W8, W11 |
| Forced colors | Theo 08 §3 (C không áp, B khuyến nghị, A bắt buộc) | W11b |
| Theme tối (nếu có) đúng và đủ tương phản | `darkMode: true` | W1, W2 trên theme tối |
| Tìm kiếm, sắp xếp tiếng Việt; số, tiền, ngày theo locale (web: `Intl`, `Intl.Collator('vi')`, bỏ dấu khi tìm; Flutter: gói `intl`) | Trang có dữ liệu | 05 §1.5, §1.6 |
| Độ dài chuỗi vi/en không vỡ bố cục | Trang `vi+en` | 05 |
| Nội dung thật, đúng nghiệp vụ, không lộ thuật ngữ kỹ thuật | Mọi trang | T6, T7, T9 |
| Một điểm nhấn đúng thứ quan trọng; mật độ hợp tác vụ | Mọi mức: T3; E0 thêm 04 §11 | T3, 04 §11 |
| **Cảm giác thị giác**: phân cấp rõ khi nheo mắt; nhịp khoảng cách đều; bề mặt có lớp (nền · khối · khối nổi); chi tiết hoàn thiện (bo góc nhất quán, trạng thái hover/nhấn, nhãn màu nhạt cho phân loại); độ "ấm" — không chỉ trắng, xám, viền mảnh | Mọi trang E1 trở lên; E0 tối thiểu phân cấp + nhịp | T3, T12 (07 §7) |
| Phản hồi tức thì và chuyển cảnh nhẹ (≤ 250ms, tắt khi giảm chuyển động) | Màn tác vụ E1+ | 06, 07 §4 bậc tự do |
| Hiệu năng: LCP, CLS ở lab | Web | W12 (Lighthouse; chưa chạy thì ghi "Chưa kiểm") |
| Phản hồi tương tác ≤ 200ms (INP) khi lọc, sắp xếp, mở dialog, lưu | Màn hình tác vụ, nhất là hạng B dùng cả ngày | W12 (trace Playwright; Lighthouse không đo INP) |
| Phản hồi ngay khi thao tác: nút có trạng thái đang xử lý, thao tác hoàn tác được thay cho hộp xác nhận khi có thể, giữ dữ liệu cũ khi tải lại | Màn hình tác vụ | 04 §8, 02 §1 "Hành động phá huỷ" |
| Dữ liệu cũ / đang đồng bộ / xung đột khi nhiều người cùng sửa được báo rõ | Màn hình nhiều người dùng chung dữ liệu | 04 §8 "Xung đột" |

**Không slop** = không có dấu hiệu bậc cấm, dấu hiệu bậc tiết chế trong liều hoặc có lý do hợp lệ (07 §3, §4). Riêng với màn hình có sẵn:
- Không "sửa slop" bằng cách đổi sang một mặc định khác. Ví dụ: indigo sang blue vẫn là G2-01; sang teal trên trắng là DF-6; sang terracotta + serif là DF-2. Đổi bo góc 8 → 12 không tính là khác (T1).
- Đổi **hướng thị giác** (họ font, họ màu nhấn, bố cục tổng thể) phải qua brief và cổng G2. Chỉnh độ sáng màu để đạt tương phản hay nới kích thước nút thì không cần.
- **Không gọt sạch:** sửa phát hiện chống slop bằng cách đưa về liều và thay bằng quyết định có lý do, không bỏ trắng (07 §3 luật "bớt phải thay", T12).
- Không thêm trang trí **vượt liều** để trông "hiện đại hơn" ([07 §6](07_CHONG_AI_SLOP.md#6-đừng-gọt-quá-tay-đừng-làm-lạ-quá-tay)). Phép thử T8 chỉ áp cho chi tiết **vượt liều**: bỏ thử, không mất gì thì giảm về liều — không bỏ trắng (luật "bớt phải thay").

## Phụ lục A — Môi trường Windows

- Thư mục là junction/symlink (ví dụ `Lab02` → `LAB\Lab02`): chạy Vite/webpack từ **đường dẫn thật**. Dùng đường dẫn junction, Vite báo lỗi dependency optimizer và lỗi `fileName … relative paths` khi build.
- Đường dẫn file vượt 260 ký tự thì ghi file thất bại. Để file tạm ở `%TEMP%`, đường dẫn ngắn.
- Tiến trình bật bằng lệnh có thể bị dọn khi lệnh kết thúc (mã thoát 255). Chạy ở chế độ nền của công cụ, rồi kiểm bằng `Get-NetTCPConnection -LocalPort <cổng> -State Listen`.
- `python` có thể chỉ là lối tắt Microsoft Store; dùng `py`.
- SQL Server: `(local)` là instance mặc định. Máy chỉ có `.\SQLEXPRESS` thì ghi đè chuỗi kết nối bằng biến môi trường, không sửa `appsettings.json`.
