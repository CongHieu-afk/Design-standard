# 11 · Đánh giá và cải thiện màn hình có sẵn

> Quy trình này có hiệu lực nhưng chưa có phê duyệt người thật và chưa hoàn tất một vòng thực tế trọn vẹn; mỗi lần dùng phải ghi vướng mắc vào CHANGELOG. Bằng chứng gốc: [báo cáo 2026-10](DANH_GIA_CONG_CU_VA_QUY_TRINH_2026-10.md).

File này chỉ quy định **thứ tự đánh giá/cải thiện**. Nguồn kiểm, severity và điều kiện xong là [08](08_NGHIEM_THU.md); hành vi agent là [AGENTS.md](AGENTS.md); lịch sử nằm trong [CHANGELOG.md](CHANGELOG.md).

## 0. Khi nào dùng

- **Dùng** khi yêu cầu là đánh giá, hoặc đánh giá rồi cải thiện, **cả một màn hình** đã có. Ví dụ: "đánh giá trang danh sách này và làm bản đã sửa".
- **Không dùng** cho sửa một lỗi cụ thể đã biết → làn S. Dựng màn hình mới → làn M/L ([01](01_QUY_TRINH.md)).

Nguyên tắc: đánh giá đủ trước khi sửa; máy chỉ kết luận phần đã đo; PO chọn phạm vi ở §4; người làm không tự đóng phép thử 07 §7 ([01 §4](01_QUY_TRINH.md#4-người-duyệt)).

## 1. Thẻ phân loại

Ghi mẫu dưới đây ở đầu báo cáo; ô "Làn" điền sau §4.

```
Việc: Đánh giá | Cải thiện        Làn: (điền sau §4)
Màn hình: <id> · route · Loại · Hạng · Mức biểu cảm (E0–E3) · Nền tảng · Ngôn ngữ · Con trỏ
Người dùng & tác vụ chính: <dòng brief đã duyệt | "Giả định: …">
Brief đã duyệt: có / không
Token: token dự án | giá trị mặc định (của thư viện hoặc của AI) | lai | không có biến (màu viết cứng)
```

Phân loại token theo **họ màu và quyết định**:
- **Dự án:** brief/thẻ hướng đã duyệt giải thích giá trị; màu trùng G2-01/DF vẫn được nếu có lý do hợp lệ.
- **Mặc định:** có biến nhưng giữ họ màu G2-01/DF mà không có lý do; đổi độ sáng để đạt tương phản không làm nó thành token dự án.
- **Lai:** một phần dùng biến, phần khác viết cứng (W18). **Không có biến:** màu viết cứng toàn bộ.

Không có brief đã duyệt: các luật và phép thử cần brief (07 §3 lý do hợp lệ; 07 §7 T2, T4, phần "chỉ về thẻ hướng" của T1) ghi **"không áp được — thiếu brief"**.

## 2. Chuẩn bị môi trường

Mục tiêu: môi trường chạy lại được, không sửa cấu hình hay dữ liệu dự án. Chi tiết Windows ở [Phụ lục A](#phụ-lục-a--môi-trường-windows).

- [ ] **Bản build phục vụ qua http** ([08 §1](08_NGHIEM_THU.md#1-kiểm-định-tự-động)). Build ra thư mục riêng; không ghi đè `dist/` hay cache. Biến `VITE_*`/`NEXT_PUBLIC_*` được gắn lúc build.
- [ ] **`design.config.json`, file phiên, báo cáo:** đặt ở thư mục kết quả **ngoài** dự án. File phiên chứa token để ở thư mục tạm của hệ điều hành.
- [ ] **Backend:** dùng biến môi trường lúc chạy, chỉ ghi tên biến. Không dựng được thì dùng fixture API; không thể fixture thì kết luận "Đánh giá dở dang".
- [ ] **Dữ liệu cho từng trạng thái** loại trang yêu cầu (03 "Kiểm riêng": 0, 1, nhiều, tên rất dài, lỗi API): khai báo trong `design.config.json` của thư mục kết quả.
  - `route` trả fixture JSON/mã lỗi; `initStorage` chỉ dùng token giả; `states` ghi bước dựng trạng thái và `"dialog": true` khi áp dụng.
  - Không kiểm thao tác ghi/xoá trên dữ liệu thật; fixture không chứa dữ liệu cá nhân hay sức khoẻ thật.
- [ ] **Đăng nhập:** chỉ tài khoản test của chính dự án (README, seed, hoặc dữ liệu mẫu trong code của dự án).
- [ ] **Server:** ghi cổng và PID của mọi server đã bật; xác nhận còn sống trước mỗi lần đo.
- [ ] **Điều kiện sẵn sàng:** khai báo `ready` (selector của nội dung chính, ví dụ tên một bản ghi trong fixture). `audit.mjs` chờ nó hiện; không thấy thì báo blocker `not-ready` và không đo tiếp. Vẫn xem ảnh chụp: không còn khung xương, không bị hộp đăng nhập che.

## 3. Đánh giá bốn lớp (chưa sửa gì)

**Ảnh hiện trạng:**
- Chụp mọi trạng thái/"Kiểm riêng" của loại trang ở [03](03_LOAI_TRANG.md) và mọi dialog trong mã. Trạng thái không dựng được ghi vào "Chưa kiểm".
- Hạng A/B: ma trận [03B §0](03B_NEN_TANG_THIET_BI.md#0-ma-trận-kích-thước-kiểm-định) × theme cho trạng thái đầu; trạng thái khác: hẹp nhất và rộng nhất.
- Hạng C: hẹp nhất và rộng nhất, theme sáng.
- Mỗi trạng thái có một ảnh ghép 320 + 1440 (thêm theme tối khi cần); trạng thái đầu thêm ảnh mờ 8px (T3).

| Lớp | Kiểm gì | Công cụ hiện có | Ai kết luận |
| --- | --- | --- | --- |
| **Lớp 1 · Máy** | [08 §1](08_NGHIEM_THU.md#1-kiểm-định-tự-động) W1–W19 / F1–F6 | `audit.mjs --impeccable`, không `--quick`, với `ready` + `states`. Không có token: rút màu `:root`/`.dark` vào `tokens.json` tạm rồi chạy `check_tokens.mjs`. W18 dùng lệnh ở [12 §5.3](12_BAN_DO_CONG_CU.md#53-tailwind-token-ở-cấu-hình-không-ở-class). Flutter dùng mẫu widget test + `flutter_text_contrast_scan.dart` | Công cụ |
| **Lớp 2 · Loại trang & nền tảng** | Từng mục "Bắt buộc", "Tránh", "Kiểm riêng" của [03](03_LOAI_TRANG.md) và [03B](03B_NEN_TANG_THIET_BI.md) | Tay: code + ảnh | Người làm ghi bằng chứng; người duyệt xác nhận, kể cả các mục "không áp" |
| **Lớp 3 · Theo mức** | Dòng "Kết luận" ở [07 §7](07_CHONG_AI_SLOP.md#7-phép-thử): T3, T6, T7, T9, T10, T12; E0 thêm [04 §11](04_NEN_TANG.md#11-mặc-định-e0) | Liệt kê mọi dấu hiệu §4 có trên màn, kể cả mã máy báo, kèm bậc + liều; ảnh mờ T3; E2–E3 đặt cạnh bản sinh không ràng buộc (T1). W17 chỉ là bằng chứng phụ và không bắt được G2-01/G2-10 | Người làm thử; **người duyệt kết luận** |
| **Lớp 4 · Nội dung** | [05](05_NGON_NGU.md): viết hoa đầu câu, thuật ngữ nghiệp vụ; tìm kiếm và sắp xếp tiếng Việt (05 §1.6); số/tiền/ngày (05 §1.5); không lộ thuật ngữ kỹ thuật (T9); **nhãn đúng với việc code làm** | Tay: đọc mọi chữ, kể cả trong dialog, đối chiếu code | Như lớp 2 |

**Kiểm tay tối thiểu** ([08 §3](08_NGHIEM_THU.md#3-kiểm-định-thủ-công-theo-hạng)): bàn phím đi hết tác vụ và dialog (focus đầu, Escape, trả focus); thử đường lỗi của thao tác ghi/xoá bằng fixture, lỗi hiện tại chỗ người dùng đang nhìn.

Mục không làm được thì ghi "Chưa kiểm" kèm lý do. Không ghi đã kiểm khi công cụ không làm được việc đó.

**Đầu ra:** một bảng phát hiện duy nhất, gộp theo **nguyên nhân**. Mỗi dòng: lớp · mã mục chuẩn · mức nghiêm trọng ([08 §2](08_NGHIEM_THU.md#2-mức-nghiêm-trọng)) · số phần tử bị ảnh hưởng · bằng chứng.

## 4. Chọn phạm vi (cổng — dừng)

### Bốn nhóm

| Nhóm | Gồm | Bắt buộc? |
| --- | --- | --- |
| **a. Sửa lỗi** | Mọi blocker/major ở mọi lớp **sửa được mà không thêm chức năng**. Ví dụ: tương phản, vùng chạm, tên trợ năng, dialog không đóng bằng Escape, lỗi bị nuốt, nhãn sai sự thật, thiếu trạng thái, bố cục màn hẹp | **Có** |
| **b. Phép thử theo mức** | Mục trượt ở lớp 3: cổng cứng của 07 §7 "Kết luận" phải sửa; dấu hiệu tiết chế vượt liều xử lý theo 08 §2. Hai phần: | **Có** cho cổng cứng |
| | **b1** — không đổi hướng thị giác. Mức tối thiểu phải đạt: T3 (một điểm nhấn: nút phá huỷ dạng viền hoặc trong menu, không cột nút đỏ đặc); T6/T9 (ngôn từ, viết hoa đầu câu); 04 §11: ≤ 2 màu chữ mỗi dòng dữ liệu, không `font-bold` trong ô bảng, mép trái thẳng, bỏ card bọc thừa (bỏ khung bọc là b1/làn S; **đổi thứ tự khối** là làn M) | |
| | **b2** — T10, giao diện mặc định: đổi giá trị token (màu nhấn, bề mặt, bo góc, bóng, font). Cần **brief rút gọn** ([10 §1](10_MAU.md#1-brief)) và **một hướng thị giác** có ảnh, PO xác nhận (cổng G2). Hướng b2 phải khác màn hình hiện tại ở **≥ 2** trong {họ màu nhấn, mô hình bề mặt (card / phẳng / kẻ), font, bố cục} — chỉ đổi màu là tô lại, không phải b2. Hướng b2 là bản **đã gọt từ bản mẫu sinh bằng công cụ** (07 §2), kèm bảng gọt. Không áp luật vân tay của 07 §5 (chỉ bắt buộc cho làn L và Khởi tạo); màu nhấn gần dải DF được nếu PO chọn, thẻ hướng ghi rủi ro. Dự án "không có biến": việc này là Khởi tạo ([01 §1](01_QUY_TRINH.md#khởi-tạo-hệ-thống-thiết-kế-chạy-một-lần)) | |
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
- Không lách công cụ hoặc hạ ngưỡng ([policy gốc §3](../AGENTS.md#3-trong-khi-sửa)). Bỏ `aria-label` thừa để tên khớp chữ hiển thị là sửa đúng; thêm `aria-hidden` để giấu lỗi là lách.

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

"Hiện đại" không phải lý do cho thứ vượt liều. Bảng này là thước đo, không mở rộng phạm vi §4.

| Tiêu chí | Áp cho | Nguồn |
| --- | --- | --- |
| Không cuộn ngang; bảng chuyển thành danh sách hoặc giữ cột định danh dính | Mọi trang, theo loại | W3, 03 |
| Đủ trạng thái 03, mỗi trạng thái có lối đi tiếp; trạng thái xem giữ qua tải lại/chia sẻ khi loại trang yêu cầu | Theo loại | 03, 04 §8 |
| Tương phản, vùng chạm, focus, bàn phím, tên trợ năng | Mọi trang | W2, W4, W5 |
| Zoom 200%, text-spacing, reduced motion không mất nội dung | Web | W8, W11 |
| Forced colors | A: bắt buộc; B: khuyến nghị; C: không áp | W11b, 08 §3 |
| Theme tối đủ tương phản | Khi `darkMode: true` | W1, W2 |
| Tìm/sắp xếp tiếng Việt; số, tiền, ngày theo locale; chuỗi vi/en không vỡ | Trang dữ liệu; `vi+en` | 05 §1.5–1.6 |
| Nội dung thật, đúng nghiệp vụ, không lộ thuật ngữ kỹ thuật | Mọi trang | T6, T7, T9 |
| Một điểm nhấn đúng; phân cấp, nhịp, bề mặt có lớp; chi tiết hoàn thiện, không chỉ trắng/xám/viền | E1+; E0 tối thiểu phân cấp + nhịp | T3, T12, 04 §11 |
| Chuyển cảnh ≤ 250ms, tắt khi giảm chuyển động | Màn tác vụ E1+ | 06 |
| LCP/CLS lab; chưa chạy ghi "Chưa kiểm" | Web | W12, Lighthouse |
| INP ≤ 200ms khi lọc/sắp xếp/mở dialog/lưu | Màn tác vụ, nhất là hạng B | W12, trace Playwright; Lighthouse không đo INP |
| Nút có trạng thái xử lý; ưu tiên hoàn tác; giữ dữ liệu cũ khi tải lại | Màn tác vụ | 04 §8, 02 §1 |
| Báo rõ dữ liệu cũ/đang đồng bộ/xung đột | Dữ liệu nhiều người cùng sửa | 04 §8 |

Với màn hình có sẵn:
- Không đổi từ một mặc định sang mặc định khác rồi gọi là đã xử lý slop; T1 phải thấy khác biệt có nguồn.
- Đổi họ font, họ màu nhấn hoặc bố cục tổng thể cần brief và G2; sửa tương phản/vùng chạm thì không.
- Đưa dấu hiệu về liều và thay bằng quyết định có lý do; không xoá sạch, cũng không thêm trang trí vượt liều ([07 §3, §6](07_CHONG_AI_SLOP.md#6-đừng-gọt-quá-tay-đừng-làm-lạ-quá-tay)).

## Phụ lục A — Môi trường Windows

- Thư mục là junction/symlink (ví dụ `Lab02` → `LAB\Lab02`): chạy Vite/webpack từ **đường dẫn thật**. Dùng đường dẫn junction, Vite báo lỗi dependency optimizer và lỗi `fileName … relative paths` khi build.
- Đường dẫn file vượt 260 ký tự thì ghi file thất bại. Để file tạm ở `%TEMP%`, đường dẫn ngắn.
- Tiến trình bật bằng lệnh có thể bị dọn khi lệnh kết thúc (mã thoát 255). Chạy ở chế độ nền của công cụ, rồi kiểm bằng `Get-NetTCPConnection -LocalPort <cổng> -State Listen`.
- `python` có thể chỉ là lối tắt Microsoft Store; dùng `py`.
- SQL Server: `(local)` là instance mặc định. Máy chỉ có `.\SQLEXPRESS` thì ghi đè chuỗi kết nối bằng biến môi trường, không sửa `appsettings.json`.
