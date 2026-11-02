# Phụ lục · Thiết bị đeo và cảnh báo khẩn trên thiết bị

**Tuỳ chọn.** Chỉ đọc khi dự án có màn hình `platform: "wear"`, hoặc có màn hình `alert` hạng A phải tới được người dùng khi máy khoá/im lặng. Dự án thông thường bỏ qua phụ lục này.

Dòng có `[kiểm lại: yyyy-mm]` dễ thay đổi theo phiên bản hệ điều hành.

## 1. Đồng hồ (Wear OS)

**Chọn công nghệ (ghi trong brief)** `[kiểm lại: 2027-04]`
- **Compose for Wear OS** (khuyến nghị khi app đồng hồ có thao tác khẩn hoặc cần tile/complication): tile, complication, chế độ ambient, núm xoay, danh sách cong (`TransformingLazyColumn` của Material 3 for Wear OS) có sẵn.
- **Flutter**: được, nhưng không làm được tile/complication (phải viết native), danh sách cong tự dựng, núm xoay cần plugin. Ghi các giới hạn này vào brief.

**Bắt buộc**
- Mỗi màn hình một việc: tối đa 1 câu ≤ 8 từ + 1 hành động chính ở màn đầu.
- Màn tròn: nội dung tránh góc bị cắt; danh sách thu nhỏ ở mép.
- Vùng chạm ≥ 48dp. Hỗ trợ núm/viền xoay cho danh sách.
- **Gửi SOS:** một chạm → đếm ngược 5–10 giây toàn màn hình, nút **Huỷ** lớn, rung mỗi giây → hết giờ tự gửi; sau khi gửi hiện **Tôi ổn** để báo nhầm tới người chăm sóc. Không dùng giữ-để-xác-nhận hay vuốt-để-xác-nhận (chậm, khó với người run tay, khó phát hiện). Không trùng cử chỉ với SOS khẩn cấp của hệ thống (bấm nút cạnh nhiều lần).
- Chế độ ambient: nền đen, ít điểm sáng, không animation; thông tin khẩn vẫn đọc được.
- Cảnh báo khẩn: rung theo mẫu riêng + âm + hiển thị.
- Pin: hạn chế animation và cập nhật liên tục.
- Cỡ chữ: kiểm cỡ lớn nhất của hệ thống trên cả hai cỡ màn (golden test); quy tắc 200% của điện thoại **không** áp.

## 2. Cảnh báo khẩn trên thiết bị

Áp cho màn hình `alert` hạng A cần tới được người dùng khi máy khoá hoặc im lặng (vận hành, an ninh, y tế, nhắc lịch quan trọng). `[kiểm lại: 2027-04]`

| Nền tảng | Yêu cầu |
| --- | --- |
| Android | Kênh thông báo riêng mức ưu tiên cao cho từng loại cảnh báo; người dùng tự chỉnh được. Thông báo toàn màn hình (`USE_FULL_SCREEN_INTENT`) bị giới hạn từ Android 14 cho app gọi điện/báo thức — nêu rõ phương án thay thế nếu không được cấp. Vượt "Không làm phiền" cần người dùng cho phép; hướng dẫn trong onboarding. Nhắc thuốc đúng giờ: `SCHEDULE_EXACT_ALARM`/`USE_EXACT_ALARM` theo chính sách hiện hành |
| iOS | Thông báo Time Sensitive; Critical Alerts (vượt im lặng) cần entitlement Apple cấp — không có thì ghi giới hạn vào brief |
| Wear OS | Thông báo bắc cầu từ điện thoại hay app đồng hồ độc lập — chọn và ghi vào brief; khi sự cố đang diễn ra dùng Ongoing Activity |
| Mọi nền tảng | Có kênh dự phòng (SMS/cuộc gọi tới người phụ trách) khi thông báo đẩy thất bại; kiểm thử trên máy khoá, chế độ im lặng, tiết kiệm pin |

## 3. Kiểm định riêng

| # | Kiểm tra | Công cụ | Mức |
| --- | --- | --- | --- |
| D1 | Cỡ chữ lớn nhất của hệ thống trên màn tròn 192dp và 227dp | Flutter: golden test; Compose: screenshot test (Roborazzi/Paparazzi) | Blocker nếu chữ bị cắt |
| D2 | Vùng chạm, nhãn, tương phản | Flutter: F2–F4 ở 08 §1; Compose: Accessibility Test Framework trong test Compose `[kiểm lại: 2027-04]` | Hạng A: Blocker |
| D3 | TalkBack trên đồng hồ | Tay | theo 08 §2 |
| D4 | Diễn tập cảnh báo: máy khoá, im lặng, tiết kiệm pin, mất mạng | Tay, thiết bị thật (emulator chấp nhận tạm, ghi ngoại lệ) | Hạng A: Blocker |

Lệnh Compose tham khảo: `./gradlew connectedDebugAndroidTest`.
