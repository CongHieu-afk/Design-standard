# Hồ sơ gu người dùng

Đây là bản chắt lọc được người dùng yêu cầu ngày 02/11/2026 từ [35 phản hồi gốc](archive/GU_NGUOI_DUNG_2026-10-29_2026-11-01.md). Nó định hướng phương án theo **đúng loại dự án/trang**, đứng sau yêu cầu hiện tại và brief. Policy vẫn là [`AGENTS.md`](AGENTS.md), [`../AGENTS.md`](../AGENTS.md) và [`../CONSTRAINTS.md`](../CONSTRAINTS.md).

## 1. Gu cốt lõi — áp cho mọi giao diện

| Ưu tiên | Diễn giải áp dụng | Không được suy diễn thành | Nguồn |
| --- | --- | --- | --- |
| Hiện đại nhưng không thô | Giữ các chi tiết hiện đại/thân thiện đã hoạt động; gọt mặc định AI theo liều, không xoá sạch | Cấm mọi card, bóng, gradient hoặc chi tiết quen thuộc | GU-01, 03 |
| Có chủ đích, đúng đề tài | Màu, ảnh, hình dạng và motion phải phục vụ nội dung/thương hiệu | Thêm hiệu ứng chỉ để “ấn tượng” | GU-04, 06, 32 |
| Chất lượng hơn độ phô diễn | Ưu tiên ảnh/tài nguyên thật đạt chất lượng; dùng ảnh tĩnh tốt thay video/3D tệ | Mọi trang phải có 3D hoặc càng nhiều hiệu ứng càng tốt | GU-12, 19, 34 |
| Rõ và dễ hiểu ngay | Sơ đồ, biểu đồ, nhãn và CTA phải đọc được, không mơ hồ; nội dung không bị cắt | Hy sinh công năng để tạo bố cục lạ | GU-22, 27, 32, 34 |
| Tránh khuôn AI lặp lại | Không lạm dụng pill phát sáng, card tilt, nâng mọi ảnh, nền lưới/gradient mờ, khung chữ nhật đồng loạt | Cấm các kỹ thuật này trong mọi ngữ cảnh | GU-07, 18, 20, 21, 33 |
| Hoàn thiện khi tương tác | Không nháy, lag, lệch control; motion mượt và ổn định trên máy thật | Chỉ cần ảnh chụp đẹp hoặc test tĩnh xanh | GU-10, 25, 26 |

## 2. Ma trận theo loại dự án và trang

| Loại | Hướng ưu tiên | Motion/3D | Nội dung và chuyển đổi | Tránh | Nguồn |
| --- | --- | --- | --- | --- | --- |
| **Landing thương mại E2–E3** | Cảm giác cao cấp, mới nhưng đúng ngành; tham khảo website thương hiệu lớn cùng lĩnh vực. Landing cao cấp ưu tiên nền sáng khi thương hiệu/nội dung không biện minh nền tối | **Ưu tiên visual 3D nổi bật, chất lượng cao, liên quan sản phẩm và tương tác có ích** khi asset + hiệu năng đáp ứng; nếu không, dùng ảnh/video tốt thay vì 3D thô | Ít chữ, thông điệp đắt, phễu chính rõ, footer đầy đủ; social proof/logo/ưu đãi chỉ khi có dữ liệu và quyền thật | Dark theme rập khuôn, mô hình nhựa/hình khối giả vật thật, pill trôi nổi, hiệu ứng không liên quan đề tài | GU-04–06, 19, 23, 29, 31, 33, 34 |
| **Home không phải landing thương mại** | Theo brief và gu cốt lõi; không tự kế thừa yêu cầu 3D/marketing của landing | Theo mức biểu cảm của dự án | Có footer đầy đủ | Ép cấu trúc landing thương mại vào home tác vụ/cổng nội bộ | GU-23; giới hạn phạm vi từ GU-29, 31, 33 |
| **Hero sản phẩm có ảnh nền** *(mẫu tham khảo theo ngữ cảnh, không mặc định)* | Khi brief phù hợp: ảnh tràn khối, chữ/header có thể đè nếu tương phản đạt; lớp phủ lấy màu từ đề tài. `0–20%` là ví dụ lịch sử, không phải ngưỡng chung | Riêng ảnh sản phẩm tách nền: zoom/lắc nhẹ **2D** nếu khung không nhảy. Không tilt/biến đổi 3D ảnh tĩnh thường. Autoplay có dừng và tắt khi reduced motion; con trỏ không phóng to trên vật thể/cảnh | Giữ visual và CTA chính trọn vẹn ở viewport laptop; không mặc định đặt vật thể góc phải | Tách ảnh thành khung vô cớ, quầng/đĩa rập khuôn, overlay cố định cho mọi đề tài | GU-09, 13–17, 32, 34 |
| **Dashboard/admin/bảng dữ liệu E0–E1** | Ưu tiên quét nhanh, phân cấp, khoảng cách và trạng thái rõ. GU-02 **chắc chắn cho trang admin gốc nhưng chỉ có một mẫu**; dự án khác đánh giá tách trang sửa theo tác vụ, không tự áp | Bảng, lịch trình, thông số đứng yên; hover chỉ báo khả năng thao tác; thẻ ngang hàng có thể nâng nhẹ | Nhãn và biểu đồ đọc ngay; cột thẳng, số/nhãn không đè nhau | 3D trang trí, card tilt, spotlight trên ô dữ liệu, nâng mọi hàng/thẻ | GU-02, 22–24, 27 |
| **Form đặt lịch trên landing** *(component theo ngữ cảnh)* | Gọn, không bị viewport/taskbar cắt | Không để hiệu ứng nền cạnh tranh với form | Tập trung phễu đặt lịch; bỏ chữ/chức năng phụ không cần thiết | Nhồi chữ, phần phụ rườm rà, form bị cắt | GU-31, 32, 34 |
| **Biểu đồ/sơ đồ** *(component)* | Chính xác, thẳng hàng, hiểu được không cần giải mã hình thức | Motion chỉ hỗ trợ đọc thay đổi, không bóp méo hình học | Nhãn giá trị và chú giải rõ | Phối cảnh 3D làm lệch cột, sơ đồ đẹp nhưng không hiểu | GU-22, 27 |
| **Ảnh/card nội dung** *(component)* | Đa dạng khung khi phù hợp; phân biệt thẻ tiêu điểm với dãy thẻ ngang hàng | Thẻ tiêu điểm được nổi rõ; dãy ngang hàng chỉ phản hồi nhẹ. **Tránh `rotateX`/`rotateY` card tilt trên mọi trang**; ngoại lệ cần brief hiện tại xác nhận | Chữ/nhãn không dính sát mép ảnh; vai trò mỗi card rõ | Cùng một hover cho mọi ảnh/card; khung vuông/chữ nhật lặp máy móc | GU-20–24 |

## 3. Thứ tự chọn tài nguyên và hiệu ứng

Với **visual sản phẩm E2–E3**: ưu tiên ảnh/tài nguyên thật đạt chất lượng; không có thì dùng ảnh có quyền sử dụng hoặc ảnh tạo sinh chân thực đã kiểm lỗi. Không dùng mô hình 3D thô để lấp chỗ trống. *(GU-12, 19, 34)*

- Không tự nặn vật thể phức tạp bằng box/cylinder/SVG cơ bản để giả ảnh thật. *(GU-19, 34)*
- 3D chỉ thắng ảnh tĩnh khi **đẹp hơn, liên quan hơn và tương tác mượt hơn**; E3 thương mại ưu tiên 3D tốt, nhưng thiếu điều kiện thì dùng ảnh tĩnh tốt. *(GU-05–06, 19, 29, 31, 33–34)*
- Text reveal chạy một lần; hover không được nháy. Carousel autoplay vẫn theo điều kiện dừng/reduced-motion ở §2. *(GU-08, 10)*
- Slider phải phản hồi tức thì và thumb đúng tâm; profile không áp đặt kỹ thuật triển khai cụ thể. *(GU-25, 26)*

## 4. Điều kiện, không phải lệnh tuyệt đối

| Phản hồi gốc dễ bị cực đoan hóa | Kết luận sau phản biện | Nguồn |
| --- | --- | --- |
| “Landing phải có nhiều 3D” | E3 thương mại ưu tiên 3D tốt khi đủ asset/hiệu năng; 3D không phải KPI và ảnh tĩnh tốt hơn 3D thô. | GU-05–06, 19, 29, 31, 33–34 |
| “Đừng dùng nền tối” | Tránh **lạm dụng** dark theme. Dark vẫn hợp khi thương hiệu/nội dung/độ tương phản biện minh được. | GU-33 |
| “Ảnh nền hero, overlay 0–20%, vật thể nghiêng” | Mẫu ưu tiên cho hero sản phẩm phù hợp, không áp cho dashboard, form hoặc mọi ngành. Overlay do tương phản quyết định, không phải con số trang trí. | GU-16–17 |
| “Bảng không có hiệu ứng” | Không gắn motion/hover trang trí vào ô dữ liệu tĩnh; vẫn phải có focus, selected và hover **chỉ trên target thật sự tương tác**. | GU-23–24 |
| “Social proof/logo/ưu đãi để tăng marketing” | Chỉ dùng bằng chứng thật và logo có quyền; thiếu dữ liệu thì bỏ, không bịa để đủ cấu trúc. | GU-29, 34; [07, G2-09](07_CHONG_AI_SLOP.md) |
| “Phản biện trước rồi mới sửa” | Lời chê/ảnh lỗi không phải lệnh sửa. Chỉ phân tích và xin xác nhận, trừ khi người dùng **ra lệnh sửa cụ thể**; khi đó chỉ làm đúng phạm vi được nêu. | GU-11, 35 |

## 5. Cách agent áp dụng

1. Nếu khớp, chọn **một loại trang nền** (landing/home hoặc dashboard/admin), rồi cộng các dòng component thực sự có mặt. Loại khác dùng gu cốt lõi + component + brief, không ép vào hai loại trên.
2. Ghi 3–5 ưu tiên phù hợp vào brief; không nạp toàn bộ profile vào mọi task.
3. Nếu hai dòng xung đột, ưu tiên: yêu cầu an toàn/pháp lý → công năng, accessibility và performance → brief/yêu cầu hiện tại → loại trang → gu cốt lõi → ví dụ lịch sử.
4. Thay đổi hướng thị giác hoặc kiến trúc lớn phải trình phương án; chi tiết triển khai trong phạm vi đã duyệt không cần xin lại.
5. Review bằng câu hỏi: đúng đề tài chưa, visual có thô không, nội dung có quá dày không, điểm nhấn có đúng không, tương tác có mượt và cần thiết không?

**Kỷ luật kiểm định, không phải gu thị giác:** khi công việc UI có preview, chạy audit đầy đủ, không `--quick`; chỉ báo kết quả đã chạy thật ([policy gốc §4](../AGENTS.md#4-kiểm-thử-là-bắt-buộc), GU-28, 30).

## 6. Ghi nhận gu mới

Chỉ thêm câu nguyên văn đã được xác nhận cho dự án/phạm vi hiện tại. `scripts/xuat_design_md.mjs` đọc các dòng có phạm vi bắt đầu bằng `Mọi`.

| # | Ngày | Nguyên văn | Phạm vi | Đã thành luật ở |
| --- | --- | --- | --- | --- |

Archive là bằng chứng truy vết, không phải danh sách lệnh đang áp dụng.
