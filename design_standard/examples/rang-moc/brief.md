# Brief: Rang Mộc — trang chủ và quản trị đơn hàng

Ngày: 28/10/2026 · Làn: L (sản phẩm mới) · Người viết: agent · PO duyệt: *(ví dụ — coi như đã duyệt)*

## Người dùng

- **Khách mua** (trang chủ): người uống cà phê pha phin/pha máy ở nhà, 25–45 tuổi, mua online 2–4 lần/tháng; quan tâm độ tươi của hạt và hương vị; xem chủ yếu trên điện thoại.
- **Nhân viên đóng gói** (quản trị): 2 người, làm trên máy tính ở xưởng, mỗi thứ Tư đóng 100–150 đơn trong một buổi; cần biết đơn nào phải xong trước giờ giao.

## Tác vụ chính

1. Khách hiểu lò rang khác gì nơi khác và chọn được một loại cà phê — thành công khi tới nút "Thêm vào giỏ" trong ≤ 60 giây.
2. Khách biết khi nào nhận hàng — thành công khi trả lời được "đặt hôm nay thì bao giờ nhận" sau khi xem trang.
3. Nhân viên lọc ra đơn cần đóng trước 17:00 và đánh dấu đã đóng gói hàng loạt — thành công khi làm được không cần hướng dẫn.

## Phân loại

| id | Nền tảng | Loại trang | Hạng | Mức biểu cảm |
| --- | --- | --- | --- | --- |
| home | web | home | C | E2 |
| admin-orders | web (chuột) | list | B | E0 |

Ngôn ngữ: vi · Dark mode: không (không có nhu cầu từ người dùng) · In ấn: không · Offline: không

## Đầu vào

- Thương hiệu: chưa có; tên "Rang Mộc".
- Nội dung thật: **điểm khác biệt có thật của lò** — mỗi túi ghi số mẻ, mỗi mẻ có log nhiệt độ từ máy rang (thời điểm nổ lần một, ra lò). Lịch rang cố định thứ Ba.
- Không có ảnh chụp sản phẩm → theo thang chọn hình ảnh 04 §6, dùng bậc 3 (biểu đồ từ dữ liệu thật) và bậc 4 (chữ).

## Ràng buộc

- Trang chủ phải nhẹ trên 4G; không video, không 3D.
- Quản trị dùng component chuẩn (bảng, select, checkbox).

## Giả định

- Giá, số mẻ, số đơn, địa chỉ trong trang là hư cấu.
