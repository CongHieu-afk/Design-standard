# Hồ sơ gu người dùng

Đây là bản chắt lọc từ 49 phản hồi gốc: [GU-01–35](archive/GU_NGUOI_DUNG_2026-10-29_2026-11-01.md) và [GU-36–49](archive/GU_NGUOI_DUNG_2026-11-02.md). Nó định hướng phương án theo **đúng loại dự án/trang**, đứng sau yêu cầu hiện tại và brief. Policy vẫn là [`AGENTS.md`](AGENTS.md), [`../AGENTS.md`](../AGENTS.md) và [`../CONSTRAINTS.md`](../CONSTRAINTS.md).

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
| **Landing thương mại E2–E3** | Cảm giác cao cấp, mới nhưng đúng ngành; tham khảo website thương hiệu lớn cùng lĩnh vực | **Ưu tiên visual 3D nổi bật, chất lượng cao, liên quan sản phẩm và tương tác có ích** khi asset + hiệu năng đáp ứng; 3D vô nghĩa thì bỏ, ảnh/video tốt hơn 3D thô | Ít chữ, thông điệp đắt, một phễu chính rõ, footer đầy đủ; social proof/logo/ưu đãi chỉ khi có bằng chứng phù hợp | Dark theme rập khuôn, mô hình nhựa, pill trôi nổi, hiệu ứng không liên quan | GU-04–06, 19, 23, 29, 31, 33, 34, 37; [07 G2-09](07_CHONG_AI_SLOP.md) |
| **Landing dịch vụ kỹ thuật/garage** *(mẫu GU-36–49, không mặc định cho ngành khác)* | Hero ảnh nền sắc nét; nhịp section bằng phân tầng, bất đối xứng, đổi sắc độ hoặc full-bleed có chủ đích; palette dịu thay đen/trắng cực đoan | 3D phải giải thích sản phẩm/dịch vụ kỹ thuật; không có giá trị thông tin thì bỏ | Nội dung ngắn, dễ hiểu với khách phổ thông; đặt lịch nhiều bước sang trang riêng; footer tách bạch | Nội dung kỹ thuật/phụ không cần thiết, dải nội dung đều từ trên xuống, ảnh/3D gắn góc vô nghĩa, bọc lớp chỉ để giả tràn viền, vá tiếp hướng bố cục đã sai | GU-36–49 |
| **Home không phải landing thương mại** | Theo brief và gu cốt lõi; không tự kế thừa yêu cầu 3D/marketing của landing | Theo mức biểu cảm của dự án | Có footer đầy đủ | Ép cấu trúc landing thương mại vào home tác vụ/cổng nội bộ | GU-23; giới hạn phạm vi từ GU-29, 31, 33 |
| **Hero landing có ảnh nền** *(mẫu tham khảo theo ngữ cảnh, không mặc định)* | Khi brief phù hợp: ảnh nền sắc nét, tràn khối; chữ/header có thể đè nếu tương phản đạt; scrim cục bộ lấy màu từ đề tài. `0–20%` là ví dụ lịch sử, không phải ngưỡng chung | 3D/visual phải giải thích sản phẩm hoặc dịch vụ. Riêng ảnh sản phẩm tách nền: zoom/lắc nhẹ **2D** | Màn đầu là một khối hoàn chỉnh; giữ thông điệp, visual và CTA trọn vẹn trong viewport khả dụng; không mặc định đặt vật thể góc phải | Ảnh chữ nhật gắn vào góc không có vai trò, quầng/đĩa rập khuôn, overlay làm ảnh đục, hiệu ứng để đủ KPI | GU-09, 13–17, 32, 34, 36–41 |
| **Dashboard/admin/bảng dữ liệu E0–E1** | Ưu tiên quét nhanh, phân cấp, khoảng cách và trạng thái rõ. GU-02 **chắc chắn cho trang admin gốc nhưng chỉ có một mẫu**; dự án khác đánh giá tách trang sửa theo tác vụ, không tự áp | Bảng, lịch trình, thông số đứng yên; hover chỉ báo khả năng thao tác; thẻ ngang hàng có thể nâng nhẹ | Nhãn và biểu đồ đọc ngay; cột thẳng, số/nhãn không đè nhau | 3D trang trí, card tilt, spotlight trên ô dữ liệu, nâng mọi hàng/thẻ | GU-02, 22–24, 27 |
| **Luồng đặt lịch dịch vụ** *(theo ngữ cảnh)* | Landing chỉ giữ CTA nếu form làm loãng thông điệp; tác vụ nhiều bước chuyển sang trang đặt lịch riêng | Không để hiệu ứng cạnh tranh với tác vụ | Một phễu rõ, ngắn; form nếu có không bị viewport/taskbar cắt | Nhồi toàn bộ tác vụ và nội dung phụ vào landing | GU-31, 32, 34, 36 |
| **Biểu đồ/sơ đồ** *(component)* | Chính xác, thẳng hàng, hiểu được không cần giải mã hình thức | Motion chỉ hỗ trợ đọc thay đổi, không bóp méo hình học | Nhãn giá trị và chú giải rõ | Phối cảnh 3D làm lệch cột, sơ đồ đẹp nhưng không hiểu | GU-22, 27 |
| **Ảnh/card nội dung** *(component)* | Đa dạng khung khi phù hợp; phân biệt thẻ tiêu điểm với dãy thẻ ngang hàng | Thẻ tiêu điểm được nổi rõ; dãy ngang hàng chỉ phản hồi nhẹ. **Tránh `rotateX`/`rotateY` card tilt trên mọi trang**; ngoại lệ cần brief hiện tại xác nhận | Chữ/nhãn không dính sát mép ảnh; vai trò mỗi card rõ | Cùng một hover cho mọi ảnh/card; khung vuông/chữ nhật lặp máy móc | GU-20–24 |
| **Header landing** *(component)* | Tinh gọn, menu không rớt dòng; có thể hòa vào hero khi ảnh nền và tương phản cho phép | Motion không làm đổi kích thước hoặc đẩy nav | Chỉ giữ điều hướng và CTA thiết yếu | Badge/thông tin phụ chen giữa nav; tạo bar riêng theo quán tính | GU-17, 36, 39 |
| **Section showcase/footer** *(mẫu garage lịch sử, không mặc định)* | Có thể dùng khối bất đối xứng, full-bleed hoặc đổi sắc độ để tạo nhịp; footer phải nhận diện rõ với nội dung trước | Chuyển màu êm, không giật từ cực tối sang trắng gắt | Nội dung bên trong vẫn có padding đọc được dù nền/khối chạm mép | Bọc nhiều lớp chỉ để giả full-bleed; áp zero-margin cho mọi section | GU-37–48 |

## 3. Thứ tự chọn tài nguyên và hiệu ứng

Với **visual sản phẩm E2–E3**: ưu tiên ảnh/tài nguyên thật đạt chất lượng; không có thì cân nhắc ảnh tạo sinh chân thực. Không dùng mô hình 3D thô để lấp chỗ trống. *(GU-12, 19, 34)*

- Không tự nặn vật thể phức tạp bằng hình khối 3D cơ bản để giả tài nguyên thật. *(GU-19, 34)*
- Không biến đổi 3D ảnh tĩnh. Ảnh sản phẩm tách nền chỉ dùng phản hồi 2D nhẹ khi phù hợp. *(GU-09, 15)*
- 3D chỉ thắng ảnh tĩnh khi **đẹp hơn, liên quan hơn và tương tác mượt hơn**; E3 thương mại ưu tiên 3D tốt, nhưng thiếu điều kiện thì dùng ảnh tĩnh tốt. *(GU-05–06, 19, 29, 31, 33–34)*
- Với landing dịch vụ kỹ thuật, 3D phải truyền đạt cấu tạo, tính năng, quy trình hoặc giá trị dịch vụ; nếu không mang thêm thông tin thì bỏ. *(GU-37)*
- Text reveal chạy một lần; hover không được nháy. *(GU-08, 10)*
- Slider phải phản hồi tức thì và thumb đúng tâm; profile không áp đặt kỹ thuật triển khai cụ thể. *(GU-25, 26)*

## 4. Điều kiện, không phải lệnh tuyệt đối

| Phản hồi gốc dễ bị cực đoan hóa | Kết luận sau phản biện | Nguồn |
| --- | --- | --- |
| “Landing phải có nhiều 3D” | E3 thương mại ưu tiên 3D tốt khi đủ asset/hiệu năng; 3D không phải KPI và ảnh tĩnh tốt hơn 3D thô. | GU-05–06, 19, 29, 31, 33–34 |
| “Đừng dùng nền tối” | Tránh **lạm dụng** dark theme. Dark vẫn hợp khi thương hiệu/nội dung/độ tương phản biện minh được. | GU-33 |
| “Chuyển sang nền sáng” | Trong mẫu garage, nền sáng không đồng nghĩa trắng tinh: dải sáng có sắc độ/chiều sâu và dark section có chủ đích đã được ưu tiên. Dự án khác phải chọn lại theo thương hiệu và nội dung. | GU-36, 38, 40–43, 48 |
| “Ảnh nền hero, overlay 0–20%, vật thể nghiêng” | Mẫu ưu tiên cho hero sản phẩm phù hợp, không áp cho dashboard, form hoặc mọi ngành. Overlay do tương phản quyết định, không phải con số trang trí. | GU-16–17 |
| “Full-bleed, chạm mép, chia 60/40” | Đây là hướng đã chọn cho landing garage lịch sử. Dự án khác chỉ lấy nguyên tắc **tận dụng chiều rộng + có trọng tâm**; tỷ lệ, lề và section áp dụng phải được brief xác nhận. | GU-42–47 |
| “Dùng màu `#131c33`, platinum/cashmere” | Là tham chiếu palette garage, không phải token toàn repo. Dự án mới phải rút màu từ thương hiệu/ảnh đề tài và kiểm tương phản lại. | GU-48–49 |
| “Bảng không có hiệu ứng” | Không gắn motion/hover trang trí vào ô dữ liệu tĩnh; vẫn phải có focus, selected và hover **chỉ trên target thật sự tương tác**. | GU-23–24 |
| “Social proof/logo/ưu đãi để tăng marketing” | Chỉ dùng bằng chứng thật và logo có quyền; thiếu dữ liệu thì bỏ, không bịa để đủ cấu trúc. | GU-29, 34; [07, G2-09](07_CHONG_AI_SLOP.md) |
| “Phản biện trước rồi mới sửa” | Lời chê/ảnh lỗi không phải lệnh sửa. Chỉ phân tích và xin xác nhận, trừ khi người dùng **ra lệnh sửa cụ thể**; khi đó chỉ làm đúng phạm vi được nêu. | GU-11, 35 |

## 5. Cách agent áp dụng

1. Nếu khớp, chọn **một loại trang nền** (landing/home hoặc dashboard/admin), rồi cộng các dòng component thực sự có mặt. Loại khác dùng gu cốt lõi + component + brief, không ép vào hai loại trên.
2. Ghi 3–5 ưu tiên phù hợp vào brief; không nạp toàn bộ profile vào mọi task.
3. Nếu hai dòng xung đột, ưu tiên: yêu cầu an toàn/pháp lý → công năng, accessibility và performance → brief/yêu cầu hiện tại → loại trang → gu cốt lõi → ví dụ lịch sử.
4. Thay đổi hướng thị giác hoặc kiến trúc lớn phải trình phương án; chi tiết triển khai trong phạm vi đã duyệt không cần xin lại.
5. Nếu cấu trúc nền tảng đã sai, sinh lại các hướng tham khảo để chọn; không mặc định vá tiếp khung cũ. *(GU-37)*
6. Review bằng câu hỏi: đúng đề tài chưa, visual/3D có mang nghĩa không, nội dung có quá dày không, nhịp section và điểm nhấn có đúng không, tương tác có mượt và cần thiết không?

**Kỷ luật kiểm định, không phải gu thị giác:** khi công việc UI có preview, chạy audit đầy đủ, không `--quick`; chỉ báo kết quả đã chạy thật ([policy gốc §4](../AGENTS.md#4-kiểm-thử-là-bắt-buộc), GU-28, 30).

## 6. Ghi nhận gu mới

Ghi câu nguyên văn, ngày và phạm vi vào file archive theo ngày; không đặt dòng dữ liệu thô trong hồ sơ đang hoạt động. Chỉ cập nhật hồ sơ này sau khi đã đối chiếu nhiều phản hồi, giới hạn phạm vi và xử lý mâu thuẫn. Archive là bằng chứng truy vết, không phải danh sách lệnh đang áp dụng.
