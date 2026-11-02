# 03B · Quy ước theo nền tảng

Loại trang ([03](03_LOAI_TRANG.md)) nói trang làm gì; nền tảng nói nó cư xử thế nào trên thiết bị đó. Dòng có `[kiểm lại: yyyy-mm]` dễ thay đổi theo phiên bản hệ điều hành; tra lại nguồn khi quá hạn.

## 0. Ma trận kích thước kiểm định

Dùng cho ảnh chụp hướng thị giác (G2), kiểm định tự động và kiểm tay.

| Nền tảng | Kích thước | Cỡ chữ / phóng to |
| --- | --- | --- |
| web | 320, 768, 1440px (G2: 320 + 1440) | Phóng to trình duyệt 200% |
| mobile | 360×800 và 412×915dp (G2: 360×800) | `textScaler` 1.0 và 2.0; cỡ trợ năng lớn nhất của hệ điều hành |
| tablet | rộng 600dp và 840dp | `textScaler` 1.0 và 2.0 |
| wear (phụ lục) | màn tròn 192dp và 227dp | Cỡ chữ lớn nhất của hệ thống đồng hồ |
| desktop | cửa sổ nhỏ nhất được hỗ trợ và 1920px | Tỉ lệ màn hình 100% và 200% |

## 1. Web

- Mobile-first; breakpoint theo chỗ nội dung vỡ.
- `100dvh`/`100svh` thay `100vh` trên mobile.
- Phân biệt con trỏ bằng `@media (pointer: coarse)` / `(hover: hover)`, không bằng chiều rộng.
- `env(safe-area-inset-*)` khi bố cục tràn viền.
- **Web hạng A/B nên dựng bằng framework DOM** (React, Vue, Svelte…). Nếu dùng Flutter web: bật semantics (`SemanticsBinding.instance.ensureSemantics()`), ghi `"stack": "flutter"` trong config; các kiểm định DOM (axe, line-height, vùng chạm, Tab) không áp dụng — ghi "Chưa kiểm" và kiểm tay kỹ hơn. Bảng dữ liệu phải có semantics bảng.

## 2. Mobile (Flutter, Android, iOS)

**Bắt buộc**
- Theo quy ước nền tảng: nút quay lại, cử chỉ, vị trí điều hướng. Flutter: Material cho Android; cân nhắc Cupertino cho luồng chính trên iOS.
- Tràn viền với `SafeArea`/padding đúng; Android 15 bắt buộc tràn viền khi target SDK 35 `[kiểm lại: 2027-04]`.
- Quay lại: dùng `PopScope` (không `WillPopScope`); hỗ trợ predictive back; chặn quay lại vô tình khi đang thực hiện thao tác hạng A (thanh toán, gửi cảnh báo) hoặc đang nhập dở form dài `[kiểm lại: 2027-04]`.
- Hành động chính nằm ở 40% dưới của màn hình 360×800 (tầm ngón cái); hành động phá huỷ không đặt cạnh hành động chính.
- Cỡ chữ: `textScaler` 2.0 không tràn/cắt (blocker); cỡ trợ năng lớn nhất được phép xuống dòng hoặc cuộn nhưng không mất nội dung (major).
- Semantics: nhãn cho icon, gộp cụm nhãn–giá trị, ẩn phần trang trí (bảng §7); thứ tự đọc kiểm bằng TalkBack/VoiceOver.

**Xu hướng nền tảng 2025–2026** `[kiểm lại: 2027-04]`
- iOS 26 dùng Liquid Glass: thanh, sheet trong mờ do **hệ thống** vẽ là đúng quy ước. Không giả lập hiệu ứng kính trên web hay Android.
- Material 3 Expressive dùng lò xo nảy nhẹ. Ở E0/hạng A chỉ dùng lò xo gần tới hạn (damping ratio ≥ 0.9).

**Tránh:** G2-15 (theme M3 mặc định, FAB mọi màn hình, nút pill/AppBar mặc định ở E1+).

## 3. Máy tính bảng

- Lớp kích thước cửa sổ Material 3: gọn < 600dp, vừa 600–839dp, rộng ≥ 840dp. Từ "rộng": bố cục hai khung (danh sách–chi tiết).
- Hỗ trợ xoay, chia đôi màn hình, bàn phím rời (phím tắt như desktop).

## 4. Đồng hồ và cảnh báo khẩn trên thiết bị

Hiếm gặp nên tách ra [PHU_LUC_THIET_BI_DEO_VA_CANH_BAO.md](PHU_LUC_THIET_BI_DEO_VA_CANH_BAO.md). Chỉ đọc khi dự án có màn hình `wear` hoặc cảnh báo hạng A phải tới máy khoá/im lặng.

## 5. Desktop (Flutter desktop, Electron, Tauri, WPF)

- Khai báo kích thước cửa sổ nhỏ nhất (ví dụ 1024×640); hẹp hơn thì gộp một khung.
- Thao tác chính có phím tắt, hiện trong menu và tooltip; `Ctrl` (Windows/Linux), `⌘` (macOS).
- Menu chuột phải lặp lại thao tác của đối tượng; kéo–thả có cách thay thế.
- Thanh cuộn luôn hiện ở vùng dữ liệu dày; hover có phản hồi.
- Thanh tiêu đề gốc trừ khi brief có lý do; thứ tự nút hộp thoại theo nền tảng (Windows: hành động chính trước "Huỷ"; macOS: "Huỷ" trước, hành động chính ngoài cùng bên phải).
- Đúng ở tỉ lệ màn hình 100–200%.
- Flutter desktop: `VisualDensity.compact` cho công cụ dày; `Shortcuts`/`Actions`/`FocusTraversalGroup`.

## 6. Bảng chuyển đổi web → Flutter

| Quy tắc (web) | Flutter |
| --- | --- |
| `aria-label`, tên trợ năng | `Semantics(label:)`, `tooltip` của `IconButton` |
| Ẩn trang trí khỏi trình đọc | `ExcludeSemantics` |
| Nhóm nhãn–giá trị | `MergeSemantics` |
| `aria-live` | `Semantics(liveRegion: true)` (ưu tiên); thông báo chủ động: `SemanticsService.sendAnnouncement` (`announce` đã lỗi thời) `[kiểm lại: 2027-04]` |
| Heading | `Semantics(header: true)` |
| `prefers-reduced-motion` | `MediaQuery.disableAnimationsOf(context)` |
| Cỡ chữ người dùng | `MediaQuery.textScalerOf(context)`; không khoá `textScaler` |
| Token | `ThemeData`, `ColorScheme`, `TextTheme`, `ThemeExtension` |
| `Intl.NumberFormat('vi-VN')` | `NumberFormat.decimalPattern('vi')`, `NumberFormat.currency(locale: 'vi', symbol: '₫')` (gói `intl`) |
| Ngày dd/mm/yyyy | `DateFormat('dd/MM/yyyy', 'vi')` sau `initializeDateFormatting('vi')` |
| Chuỗi đa ngôn ngữ | ARB + `gen_l10n` |
| `normalize('NFC')` | Gói `unorm_dart`, hoặc chuẩn hoá ở backend |
| axe-core, tương phản theo hạng | `meetsGuideline`: hạng A `MinimumTextContrastGuidelineAAA()` + `androidTapTargetGuideline`; B/C `textContrastGuideline` + `iOSTapTargetGuideline`; mọi hạng `labeledTapTargetGuideline` |
| Ảnh chụp hồi quy | Golden test (`matchesGoldenFile`) |
| Mẫu test | [scripts/flutter_ui_standard_test.dart.tmpl](scripts/flutter_ui_standard_test.dart.tmpl) |
