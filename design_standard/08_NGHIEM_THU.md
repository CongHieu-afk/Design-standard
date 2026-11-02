# 08 · Kiểm định và nghiệm thu

File này là **nguồn duy nhất** cho việc kiểm gì, ở hạng nào, mức nghiêm trọng nào, khi nào là xong. Các file khác dẫn về đây.

## 1. Kiểm định tự động

Kích thước theo ma trận [03B §0](03B_NEN_TANG_THIET_BI.md#0-ma-trận-kích-thước-kiểm-định); thêm theme tối khi `darkMode: true`. Web: chạy trên bản đã build, phục vụ qua http (`vite preview`, `next start`, `npx serve dist`), không `file://`. Một **nguyên nhân** chỉ báo một lần (ví dụ một cặp màu thiếu tương phản), kèm số phần tử bị ảnh hưởng và danh sách kích thước/theme gặp lỗi.

**Trạng thái:** đo trạng thái đầu và các trạng thái loại trang yêu cầu (dialog, rỗng, lỗi API…), khai trong `states`, dữ liệu bằng fixture. `stateCoverage` phải ánh xạ loading/empty/error/dialog tới state id; mục không áp dụng ghi `n/a:` kèm lý do để reviewer thấy rõ giả định. Máy xác nhận khai báo nhất quán; người duyệt vẫn phải đối chiếu với mã vì agent có thể khai sai sự thật.

Cột "Có sẵn": ✓ = script trong bộ chuẩn đã làm; ○ = cần công cụ ngoài hoặc kiểm tay — chưa làm thì ghi vào "Chưa kiểm" của báo cáo.

### Web (DOM)

| # | Kiểm tra | Công cụ | Có sẵn | Mức |
| --- | --- | --- | --- | --- |
| W1 | Tương phản token theo hạng | `check_tokens.mjs --config` | ✓ | Blocker |
| W2 | Luật WCAG 2.2 A/AA tự động (tên trợ năng, ARIA, nhãn form, `lang`, tương phản trên trang); hạng A thêm luật `color-contrast-enhanced` (7:1) | `audit.mjs` + `@axe-core/playwright`, tag `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa` | ✓* | `critical`/`serious` và tương phản hạng A → Blocker; còn lại → Major |
| W3 | Thẻ viewport, tràn ngang | `audit.mjs` | ✓ | Blocker |
| W4 | Vùng chạm theo hạng và kiểu con trỏ (gồm ngoại lệ khoảng cách SC 2.5.8 ở mức 24px) | `audit.mjs` | ✓ | A: Blocker; B/C: Major |
| W5 | Bàn phím: Tab qua trang, focus nhìn thấy, không kẹt. Dialog: focus vào trong, có tên, Escape đóng, focus về nút mở | `audit.mjs` (dialog: state có `"dialog": true`) + xem lại bằng mắt | ✓ | Kẹt: Blocker; focus không thấy: A Blocker, B/C Major; dialog: A Blocker, B/C Major |
| W6 | Lỗi JS, trang trả mã lỗi | `audit.mjs` | ✓ | Blocker |
| W7 | Tài nguyên lỗi (404, mất kết nối) | `audit.mjs` | ✓ | Major |
| W8 | Giảm chuyển động: chữ không bị ẩn; chuyển động hình học > 300ms hoặc lặp vô hạn được triệt giảm | `audit.mjs` | ✓ | E2–E3: Blocker; E0–E1: Major |
| W9 | Line-height tiếng Việt | `audit.mjs` | ✓ | Major |
| W10 | Lorem, dữ liệu mẫu, thuật ngữ nội bộ, địa chỉ dev (`localhost`) lộ ra | `audit.mjs`; thuật ngữ riêng của dự án khai báo ở `internalTerms` | ✓ | Major |
| W11 | Phóng to 200% (SC 1.4.4: khung nhìn 640×400, mật độ 2) và text-spacing (SC 1.4.12): chữ bị cắt trong khung `overflow: hidden/clip`, tràn ngang | `audit.mjs`; ảnh `*_zoom200.png`, `*_text-spacing.png` | ✓ | Máy báo Major; người kiểm xác nhận mất nội dung → Blocker |
| W11b | Chế độ tương phản cao (forced colors): viền điều khiển, icon, focus còn thấy | `audit.mjs` chụp `*_forced-colors.png`, người xem | ○ | Major |
| W12 | Core Web Vitals (lab); phần tử LCP không có hiệu ứng xuất hiện | Lighthouse CI (mobile) cho LCP, CLS. Lighthouse lab **không đo INP**: màn hình tác vụ (B, dùng cả ngày) đo độ trễ tương tác bằng trace Playwright/`PerformanceObserver` khi lọc, sắp xếp, mở dialog; không làm thì ghi "Chưa kiểm INP" | ○ | Major; LCP > 4s: Blocker |
| W13 | Hồi quy hình ảnh | Ảnh chụp của `audit.mjs`, người so với bản đã duyệt | ○ | Major |
| W14 | Màn hình khai báo `ssr: true`: tắt JS vẫn có `<h1>` và ≥ 50% lượng chữ | `audit.mjs` | ✓ | E1–E3: Major; E0: Minor |
| W15 | Không nhấp nháy > 3 lần/giây (SC 2.3.1) | Tay | ○ | Blocker |
| W16 | E2–E3: không khung hình > 50ms lặp lại khi cuộn; độ trễ tương tác ≤ 200ms khi animation chạy; E3: đi qua mọi vị trí cuộn bằng ảnh liên tiếp, không cuộn chết | DevTools Performance trên mobile tầm trung | ○ | Major |
| W18 | Giá trị ngoài token trong mã: màu/px viết cứng, Tailwind giá trị tuỳ ý (`text-[#…]`, `p-[13px]`), màu có sẵn của Tailwind (`zinc-`, `indigo-`…) dùng thẳng | stylelint + `stylelint-declaration-strict-value` (CSS); Tailwind: `rg -n "\b[a-z-]+-\[[^\]]+\]" src` rồi lọc tay, hoặc luật `no-arbitrary-value` của `eslint-plugin-tailwindcss` (12 §5.3) | ○ | Major ở mã mới; mã cũ theo 01 "Giao diện cũ" |
| W17 | Dấu hiệu slop bề mặt (07 §4) | `audit.mjs --impeccable` (gọi `impeccable detect` qua cổng DevTools; [12 §5.4](12_BAN_DO_CONG_CU.md#54-impeccable-dùng-detect-không-cài-skill-tự-kích-hoạt)) + người xem theo phép thử 07 §7 — máy **không** bắt G2-01, G2-10, G2-14, G2-15, G3-12 | ✓* | Máy báo Minor. Người duyệt xác nhận từng mã: **bậc cấm** (07 §4) đúng → **Major** (luồng chính hạng A: Blocker); **bậc tiết chế** → ghi "trong liều" (không sửa) hoặc "vượt liều" (Minor; ≥ 3 vượt liều không lý do trên một màn → Major). Máy báo nhầm ghi lý do, không tính |
| W19 | Primitive dùng chung: tab/roving focus, reduced motion, timer nút, dialog/trả focus, motion-token và cleanup listener/observer | `node --test tests/runtime-primitives.test.mjs` (assertion + Playwright) | ✓ | Lỗi W5/W6 giữ mức tương ứng; còn lại Major |

\* Thiếu `@axe-core/playwright` thì `audit.mjs` dừng (mã 2); chỉ khi chạy với `--allow-no-axe` mới ghi W2 "Chưa kiểm" và đi tiếp — không coi là đạt. Web dựng bằng Flutter (`stack: "flutter"`): W2–W10 không áp dụng; chạy bảng Flutter F1–F6 ở kích thước logic 320/768/1440 và kiểm tay theo §3.

**Màn hình cần đăng nhập:** tạo file phiên (`npx playwright codegen --save-storage=auth.json <base>`), truyền `--storage-state` hoặc khai báo `auth.storageState` trong config. `audit.mjs` báo blocker `redirected` khi trang bị chuyển hướng (ví dụ về /login) — không bao giờ kiểm nhầm trang đăng nhập.

### Flutter (mobile, tablet, desktop Flutter)

Widget test trên **màn hình thật của app**, mẫu: [scripts/flutter_ui_standard_test.dart.tmpl](scripts/flutter_ui_standard_test.dart.tmpl).

| # | Kiểm tra | Công cụ | Mức |
| --- | --- | --- | --- |
| F1 | Tương phản token | `check_tokens.mjs --config` | Blocker |
| F2 | Tương phản chữ trên màn hình | A: `MinimumTextContrastGuidelineAAA()`; B/C: `textContrastGuideline` | A: Blocker; B/C: Major |
| F3 | Vùng chạm | A: `androidTapTargetGuideline` (48dp); B/C: `iOSTapTargetGuideline` (44pt) | A: Blocker; B/C: Major |
| F4 | Nhãn trợ năng | `labeledTapTargetGuideline` | Blocker |
| F5 | Cỡ chữ | `textScaler` 2.0 không lỗi bố cục (`tester.takeException()`) | Blocker |
| F6 | Hồi quy hình ảnh | Golden test ở `textScaler` 1.0 và 2.0. Lần đầu tạo bằng `--update-goldens`; sau đó chỉ cập nhật khi đổi hình có chủ ý, kèm ảnh trước/sau | Major |

### Thiết bị đeo, Compose, cảnh báo khẩn trên thiết bị

Xem [phụ lục](PHU_LUC_THIET_BI_DEO_VA_CANH_BAO.md#3-kiểm-định-riêng) (D1–D4).

## 2. Mức nghiêm trọng

| Mức | Ý nghĩa | Xử lý |
| --- | --- | --- |
| Blocker | Không làm được tác vụ, hoặc vi phạm rõ WCAG A/AA | Không merge/phát hành. Hạng A không nhận ngoại lệ cho blocker trên luồng chính |
| Major | Làm khó, sai chuẩn nhưng có đường vòng | Sửa trước merge; local waiver không áp dụng |
| Minor | Tay nghề, nhất quán | Ghi lại |

- Phát hiện thủ công: trượt một mục "Bắt buộc" của loại trang (03) hoặc nền tảng (03B), hoặc lỗi bàn phím/trình đọc màn hình trên tác vụ chính → **Blocker** với hạng A, **Major** với B/C.
- Ngôn ngữ (05, AGENTS §4 luật 7): tìm kiếm/sắp xếp tiếng Việt sai (05 §1.6), số/tiền/ngày không theo locale (05 §1.5), Title Case tiếng Việt, line-height dưới ngưỡng → **Major**. Mọi dấu hiệu bậc cấm của 07 §4 (gồm Title Case, văn sáo, dữ liệu bịa) trên luồng chính hạng A → **Blocker**. Nhãn sai sự thật (nói làm X, code làm Y) → **Major**; ở hạng A → Blocker.
- Mục "Bắt buộc" của 03 cần **thêm chức năng** (11 §4 "Thiếu chức năng"): ghi là "đề xuất chờ PO", không chặn "xong" của việc sửa lỗi; PO quyết làm (làn M) hay ghi ngoại lệ.
- Phép thử 07 §7 trượt (người duyệt kết luận) → **Major**; cổng cứng theo mức ở 07 §7 "Kết luận" (mọi mức: T7, T9, T10 bậc cấm; E2–E3 thêm T1, T4) → phải sửa trước bàn giao. Dấu hiệu bậc tiết chế vượt liều không lý do → **Minor** (≥ 3 trên một màn: Major).
- **Baseline:** chỉ lưu Minor đã biết. Còn Blocker hoặc Major thì `--update-baseline` bị từ chối.
- **Ngoại lệ:** chỉ áp dụng Minor, có owner, hạn tối đa 365 ngày và link GitHub issue/PR phê duyệt. Blocker/Major luôn làm gate đỏ.

## 3. Kiểm định thủ công theo hạng

Chỉ kiểm trên **nền tảng có màn hình đó** trong config.

| Việc | C | B | A |
| --- | --- | --- | --- |
| Đi hết tác vụ chính chỉ bằng bàn phím (web, desktop, tablet có bàn phím) | Trang chính | Mọi tác vụ chính | Mọi tác vụ chính |
| Trình đọc màn hình: web NVDA (hoặc VoiceOver nếu có Mac); Android TalkBack; iOS VoiceOver | Trang chính | Tác vụ chính | Mọi tác vụ chính, mỗi nền tảng đang phát hành |
| Ma trận kích thước 03B §0 | ✓ | ✓ | ✓ |
| Thiết bị thật | Trang E2–E3: một điện thoại Android tầm trung | Khuyến nghị | Điện thoại Android tầm trung |
| Chế độ tương phản cao (web forced colors) | — | Khuyến nghị | ✓ |
| Design review theo 03 và 03B | ✓ | ✓ | ✓ |
| Phép thử chống slop 07 §7 theo mức | ✓ | ✓ | ✓ |
| Nội dung: chính tả, thuật ngữ, viết hoa | ✓ | ✓ | ✓ + người nghiệp vụ duyệt |
| Walkthrough G1 | Người đại diện (bạn học, người nhà), có ghi lại | Như C | Người dùng đúng đối tượng hoặc chuyên gia nghiệp vụ |
| Kiểm thử người dùng thật | Mỗi mốc phát hành làn L, khi có người để hỏi | Như C | **Mỗi mốc phát hành có thay đổi luồng hạng A**: ≥ 2 người dùng đúng đối tượng (ví dụ cả người mua và nhân viên xử lý đơn). Chưa có thì người đại diện, ghi ngoại lệ có hạn |

## 4. Gói bàn giao

- [ ] Cách xem: URL đang chạy, **hoặc** lệnh chạy local + ảnh chụp; Flutter: APK/bản ghi emulator.
- [ ] Báo cáo kiểm định tự động: công cụ, phiên bản, ngày chạy, số blocker/major/minor, mục "Chưa kiểm".
- [ ] Ảnh chụp theo ma trận 03B §0 (và theme tối nếu có), các trạng thái chính.
- [ ] **Đã mở trong đúng khung người nhận sẽ xem** (2.3): trình duyệt của họ, khung xem trước của app, file mở trực tiếp (`file://`), điện thoại — mỗi cách giao là một lần mở thử; ghi cách đã thử. Chạy được ở máy kiểm không có nghĩa chạy được ở khung khác.
- [ ] Biên bản duyệt ([10 §3](10_MAU.md#3-biên-bản-duyệt)) ghi cách duyệt ([01 §4](01_QUY_TRINH.md#4-người-duyệt)).
- [ ] Danh sách ngoại lệ còn mở.
- [ ] Không viết "đạt 100%" khi còn mục chưa kiểm.

## 5. Định nghĩa hoàn thành theo làn

| Làn | Xong khi |
| --- | --- |
| S | Build qua · kiểm định tự động màn hình đã chạm không có blocker mới (web DOM: `audit.mjs --only <id>`; Flutter kể cả Flutter web: `flutter test test/ui_standard/<id>_test.dart`; thiết bị đeo/Compose: phụ lục D1–D2) · sửa `runtime/{motion,primitives,lifecycle}.js` thì chạy thêm W19 · ảnh trước/sau trong commit/PR |
| M | Như S cho mọi màn hình mới/đổi · brief rút gọn · kiểm kê trạng thái, khai báo trong `states` · G1 đã đóng (walkthrough có ghi lại) · §3 theo hạng · biên bản duyệt (10 §3): phép thử 07 §7 kết luận trước khi mở báo cáo máy, mỗi phát hiện W17 có xử lý (sửa / lý do hợp lệ / sai) · đổi hướng thị giác: bảng gọt cho mỗi hướng (10 §2) · mọi màn qua T10 (bậc cấm = 0, tiết chế trong liều) và T12 "không gọt quá tay" (07 §7) · bảng vai trò khối có cột "ở ảnh mờ bản đã dựng" khớp điểm nhấn (10 §2) · mỗi đường quay về một state có `expectFocus`, báo cáo máy không có `state-thieu-expectFocus` (03) |
| L | Như M · G0–G2 có người duyệt · vân tay: có quyết định đặc trưng và khác DF gần nhất ≥ 2/6 (07 §5) · phép thử 07 §7 theo mức của từng màn hình · kiểm thử người dùng theo §3 |
| Khởi tạo (bước mở đầu, cộng thêm vào dòng của làn) | Token qua `check_tokens.mjs` · component gốc qua `audit.mjs` (hoặc widget test) trên trang mẫu · vân tay · G2. **Không** thay dòng M/L: việc chỉ xong khi đủ cả hai dòng |
| Đánh giá ([11](11_DANH_GIA_VA_CAI_THIEN.md)) | Thẻ phân loại · cách chạy lại · đủ 4 lớp, có ảnh · bảng phát hiện theo nguyên nhân · kiểm tay §3 theo hạng đã làm. Có **> 3 mục "Bắt buộc" của 03/03B "Chưa kiểm"**, hoặc không dựng được dữ liệu (11 §2): "Đánh giá dở dang" |
| Cải thiện ([11](11_DANH_GIA_VA_CAI_THIEN.md)) | Như Đánh giá, và:<br>• kiểm tay §3 theo hạng **không được "Chưa kiểm"**;<br>• nhóm a: 0 blocker trên màn hình, **không trừ baseline**; major còn lại có ngoại lệ PO đã duyệt ("thiếu chức năng" là đề xuất, không tính vào đây);<br>• nhóm b: người duyệt kết luận đạt;<br>• "không áp" đã được người duyệt xác nhận; gói 11 §8; đã dọn môi trường.<br>Thiếu một mục → "Dừng ở G2", không phải xong, trừ khi PO ghi chấp nhận bằng văn bản |
