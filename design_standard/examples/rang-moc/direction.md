# Hướng thị giác: "Phiếu rang"

Ý tưởng một câu: giao diện đọc như phiếu ghi mẻ rang của thợ rang — số liệu thật, bảng giờ, đường nhiệt — chứ không như một trang quảng cáo cà phê.

Ảnh: [home 1440](screenshots/home_1440.png), [home 360](screenshots/home_360.png), [quản trị 1440](screenshots/admin-orders_1440.png), [quản trị 360](screenshots/admin-orders_360.png)

> Mẫu này chỉ trình **một** hướng để làm ví dụ. Ở dự án thật, G2 cần 2 hướng khác nhau ≥ 3/6 chiều vân tay (AGENTS.md §3).

## Tham chiếu

| Tham chiếu | Ngoài phần mềm? | Học gì |
| --- | --- | --- |
| Phiếu log mẻ rang của phần mềm [Artisan](https://artisan-roasterscope.blogspot.com/) | Có | Đường nhiệt độ hạt theo thời gian, mốc nổ lần một, số liệu đơn vị rõ |
| Bảng giờ tàu in — xem [Eye Magazine: info design before designers](https://eyemagazine.com/blog/post/info-design-before-designers) | Có | Lịch rang và giao trình bày như bảng giờ, chữ số thẳng cột, kẻ ngang chỉ ở bảng |
| Tem nhãn túi cà phê đặc sản (số lô, ngày rang) — `[CẦN ẢNH: chụp 2–3 nhãn thật]` | Có | Số mẻ là bằng chứng độ tươi (lý do chính dựa vào brief, không dựa vào dòng này) |

## Lựa chọn và lý do

| Thành phần | Lựa chọn | Lý do hợp lệ (07 §2) |
| --- | --- | --- |
| Font tiêu đề | Archivo, trục độ rộng (wdth 80–125) | Tham chiếu bảng giờ tàu: chữ hẹp cho tiêu đề dài tiếng Việt, chữ rộng cho tên thương hiệu. Chuỗi kiểm tiếng Việt 05 §1.1: đã chạy 28/10/2026 ở 12/16/48px, thường và HOA, wdth 80 và 100: đủ 134 chữ có dấu + ₫; dấu chồng không chạm nhau, không chạm dòng trên ở line-height 1.5. Agent chấm, người duyệt cần xem lại |
| Font số liệu | IBM Plex Mono | Số liệu đo (nhiệt độ, giờ, giá) — monospace dùng cho dữ liệu đo, không làm "trang phục kỹ thuật". Chuỗi kiểm 05 §1.1: đã chạy 28/10/2026, đủ glyph, dấu rõ (agent chấm, người duyệt xem lại) |
| Màu nhấn | Xanh rêu đậm `#11553f` | Brief: khách quan tâm độ tươi; màu lá cà phê thay cho nâu/đỏ đất quen thuộc (tránh DF-2) |
| Màu tín hiệu | Đỏ `#b42318` chỉ cho mốc nổ lần một và lỗi | Tham chiếu phiếu log: mốc quan trọng đánh dấu đỏ |
| Trung tính | Xám lạnh `#f3f4f1` / mực `#15181a`, không pha nâu | Tránh nền giấy kem của DF-2 |
| Bề mặt | Phẳng. Kẻ ngang chỉ ở bảng giờ và danh sách cà phê; các khối tách nhau bằng khoảng trắng và nền trắng/xám xen kẽ | Tham chiếu bảng giờ (kẻ ở bảng, không kẻ khắp nơi — tránh G3-06) |
| Bo góc | 4px | Đồ in, không bo tròn kiểu app |
| Bố cục | Trang chủ: tiêu đề trái + dữ liệu phải; hai khối danh sách/bảng "tiêu đề trái, nội dung phải"; khối gói định kỳ xếp dọc, hai lựa chọn cạnh nhau. Quản trị: thanh bên + bảng | Tác vụ 1 cần thấy bằng chứng độ tươi ngay màn đầu; khối giá cần so sánh ngang |
| Chuyển động | E2 nhưng gần như không dùng: chỉ đổi màu nút khi hover | Không có thông tin nào cần chuyển động để hiểu |
| Hình ảnh | Bậc 3 (biểu đồ dữ liệu thật) + bậc 4 (chữ) | Brief: chưa có ảnh chụp |

## Quyết định đặc trưng

**Đường nhiệt mẻ rang** — dữ liệu thật của từng mẻ.

- Thấy ở màn đầu: biểu đồ mẻ 42 cạnh tiêu đề trang chủ. ✓
- Áp có hệ thống ở ≥ 3 chỗ: (1) biểu đồ lớn ở hero, (2) đường mini cạnh từng loại cà phê, (3) đường mini của mẻ đang đóng gói ở đầu trang quản trị. Cột "Mẻ rang" ở quản trị chỉ hiện cảnh báo "Hạt N ngày" khi đơn chưa giao dùng hạt ≥ 7 ngày (không lặp hình trang trí trên mọi dòng — T8). ✓
- Xuất phát từ nội dung: điểm khác biệt có thật trong brief (mỗi túi ghi số mẻ). ✓

Ở màn hình quản trị (E0), hướng chỉ góp chữ, màu, mật độ và đúng một chi tiết đặc trưng; điều khiển giữ chuẩn (bảng, select, checkbox, nút).

## Vân tay

| Chiều | Giá trị |
| --- | --- |
| Cặp font | Archivo (biến độ rộng) + IBM Plex Mono |
| Màu nhấn | Xanh rêu đậm trên xám lạnh |
| Bố cục | Một tiêu điểm + cột nhãn trái / nội dung phải |
| Mở đầu | Tiêu đề trái + dữ liệu sản phẩm phải |
| Đặc trưng | Đường nhiệt mẻ rang |
| Hình ảnh | Sơ đồ/dữ liệu + chữ |

Khác vân tay mặc định (07 §5):

| DF | Số chiều khác | Ghi chú |
| --- | --- | --- |
| DF-1 (Inter + indigo/zinc) | 6/6 | |
| DF-2 (serif + terracotta/giấy kem) | 4/6 | Khác font, màu, đặc trưng, hình ảnh. Bố cục (có kẻ mảnh) và mở đầu (tiêu đề lớn bên trái) gần DF-2 — cà phê dễ trượt về DF-2, cần người duyệt để ý |
| DF-3 (Geist/mono + neon/đen) | 5/6 | Cùng có monospace, nhưng chỉ cho số liệu |
| DF-4 (Flutter mặc định) | 6/6 | |
| DF-5 (gradient tím–hồng) | 6/6 | |
| DF-6 (app dịch vụ Việt Nam) | 6/6 | |

## Phép thử (07 §4) — agent tự chấm, chờ người duyệt

| # | Kết quả | Ghi chú |
| --- | --- | --- |
| T1 | Đạt (tự chấm) | Ở ảnh 360: (1) chữ hẹp Archivo thay sans mặc định, (2) xanh rêu trên xám lạnh thay màu thư viện, (3) biểu đồ đường nhiệt ngay sau tiêu đề. Chưa dựng bản "mặc định thư viện" để so cạnh nhau |
| T2 | Đạt | Tiêu đề nói về lịch rang thứ Ba và số mẻ của lò này |
| T3 | Chưa làm | Cần ảnh làm mờ 8px và người khoanh |
| T4 | Đạt | Xem "Quyết định đặc trưng" |
| T5 | Đạt | Hero → "lò khác gì?"; cà phê → "mua loại nào?"; lịch → "bao giờ nhận?"; gói → "mua định kỳ thế nào?" |
| T6 | Đạt (tự chấm) | Thuật ngữ rang: nổ lần một, điểm đáy, phát triển, ra lò |
| T7 | Đạt có điều kiện | Mọi số đều hư cấu và ghi rõ ở chân trang; dự án thật phải lấy từ log máy rang. Ngày và thứ đã đối chiếu lịch 2026 |
| T8 | Đạt | Không bóng, không gradient, không icon trang trí; biểu đồ mini mang dữ liệu |
| T9 | Đạt | |
| T10 | Đạt (tự chấm) | Dấu hiệu không lý do: S-03 (hai khối cùng bố cục trái/phải) — 1 ≤ 2 |
| T11 | Chưa làm | Tuỳ chọn |

## Rủi ro

- Archivo + Plex Mono khoảng 2 file font; Google Fonts tự tách subset tiếng Việt. Cần đo dung lượng tải trên 4G.
- Biểu đồ phải lấy từ log máy rang thật; nếu không có dữ liệu thì bỏ khối, không vẽ đường giả.
- Đường nhiệt nhỏ ở danh sách có thể khó hiểu với khách mới — đã có câu giải thích ở đầu khối.
