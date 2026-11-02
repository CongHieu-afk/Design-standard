# 04 · Nền tảng thiết kế

Quy tắc áp cho mọi loại trang. Chúng mô tả cách quyết định và giá trị khởi điểm; giá trị cuối cùng đến từ hướng thị giác của dự án (chặng 2). Ngưỡng theo hạng ở [02](02_PHAN_CAP.md).

## 1. Token

| Tầng | Ví dụ | Ai dùng |
| --- | --- | --- |
| Nguyên thuỷ | `blue-700`, `space-4`, `radius-2` | Chỉ tầng ngữ nghĩa |
| Ngữ nghĩa | `color.text.primary`, `color.border.control`, `color.action.primary`, `space.stack.md` | Component, màn hình |
| Component | `button.primary.bg`, `table.row.height.compact` | Component đó |

- Code giao diện chỉ dùng token ngữ nghĩa/component; không viết mã màu, px rời (trừ căn chỉnh quang học có chú thích). Web: chặn bằng stylelint + `stylelint-declaration-strict-value`.
- Mọi cặp chữ/nền dùng thật khai báo trong `pairs` của file token; kiểm bằng `node scripts/check_tokens.mjs tokens.json --config design.config.json`. Không ghi tay tỉ lệ tương phản.
- Cặp không gắn `screens` được kiểm ở hạng cao nhất của dự án; cặp chỉ dùng ở một số màn hình gắn `"screens": [id…]` để kiểm theo hạng các màn hình đó (ví dụ màu nhấn của trang chủ hạng C không bị ép 7:1 chỉ vì sản phẩm có màn hình thanh toán hạng A).
- Định dạng: cú pháp alias `{nhóm.tên}` và `$value` của W3C Design Tokens; giá trị màu là chuỗi CSS (hex, `rgb()`, `oklch()`) hoặc đối tượng DTCG `{colorSpace: srgb|oklch, components, alpha?, hex?}`. Script chấp nhận cả `value`.
- Flutter: ánh xạ vào `ThemeData`/`ColorScheme`/`TextTheme`, token riêng dùng `ThemeExtension`.

## 2. Chữ

**Chọn font**
- Theo giọng sản phẩm và yêu cầu ngôn ngữ, ghi lý do hợp lệ ([07 §3](07_CHONG_AI_SLOP.md#3-lý-do-hợp-lệ)).
- E0–E1: font hệ thống hoặc font phổ biến hợp lệ khi chọn có chủ ý. E2–E3: ít nhất một font mang giọng riêng (thường là font tiêu đề).
- Tối đa 2 họ chữ (+ monospace cho mã nguồn). Ưu tiên variable font có trục `opsz`; kiểm subset tiếng Việt có đủ mọi trục.
- Giao diện tiếng Việt: chạy thủ tục kiểm font [05 §1.1](05_NGON_NGU.md#11-font).

**Thang cỡ (token khởi điểm, px):** 12, 13, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72. Dự án chọn tập con; không dùng tỉ lệ nhân ra số lẻ.

- Chữ thân web 16px (bảng dày 14px theo [02](02_PHAN_CAP.md)). Không dưới 12px cho chữ cần đọc.
- Đơn vị `rem` để tôn trọng cỡ chữ trình duyệt. Ô nhập trên mobile ≥ 16px (iOS Safari tự phóng to dưới 16px).
- Chữ co giãn: `clamp(<rem>, <rem> + <vw>, <rem>)`, giá trị lớn nhất ≤ 2.5 × nhỏ nhất, để phóng to 200% vẫn có tác dụng (SC 1.4.4).

**Khoảng chữ (tracking)** — Latin: 0 ở ≤ 20px; khoảng −0.01em ở 32px; tới −0.04em ở ≥ 64px. Tiếng Việt: tiêu đề không chặt hơn −0.02em và phải qua chuỗi kiểm dấu ở đúng cỡ đó. CHỮ HOA: nhãn ≤ 3 từ, +0.04–0.08em.

**Khác**
- Line-height theo ngôn ngữ ([05](05_NGON_NGU.md)).
- `tabular-nums` cho số trong bảng, số cập nhật trực tiếp, giá thẳng cột.
- `text-wrap: balance` cho tiêu đề ngắn; `pretty` cho đoạn văn.
- `text-box-trim` (căn giữa quang học) chỉ dùng sau khi thử chữ hoa có dấu chồng (Ặ, Ễ): cắt theo chiều cao chữ hoa sẽ đẩy dấu tiếng Việt chạm viền.

**Tải font:** WOFF2, `font-display: swap`, preload ≤ 2 file; font dự phòng có `size-adjust`/`ascent-override` để giảm nhảy bố cục; tự host thì gồm subset `vietnamese`.

## 3. Màu

- Dựng thang trong OKLCH (bậc sáng đều), xuất hex/sRGB dự phòng; cảnh báo khi màu vượt gam sRGB.
- **Vai trò trước, màu sau:** nền, bề mặt, chữ chính, chữ phụ (một bậc xám, không ba), viền điều khiển, viền trang trí, hành động chính, liên kết, focus, trạng thái.
- Màu nhấn dành cho hành động chính, mục đang chọn, liên kết — không dùng làm trang trí. Không trùng màu nhấn với màu "thành công".
- **Bảng màu trang biểu cảm (2.6, E2–E3):** ngoài màu nhấn hành động, có **≥ 1 màu nhấn phụ lệch tông ≥ 60° OKLCH** và **một dải chuyển màu thương hiệu** (nền hero, quầng sau cảnh 3D, chữ nhấn lớn) — một màu nhấn trên nền trung tính là E0–E1, không phải E3 (lần chạy thử 2.5: người dùng chê "màu sắc vẫn còn hơi đơn điệu"). **Màu theo đề tài (2.7):** rút bảng màu từ ảnh thật của đề tài (`node design_standard/scripts/bang_mau.mjs <url ảnh>…`), ghi mã hex vào thẻ hướng; nền, màu nhấn, màu phụ lấy từ đó hoặc lý do lệch — lần chạy thử 2.6: trang du lịch dùng tím đêm trong khi ảnh đề tài là xanh rừng, xanh biển, vàng lúa, đỏ đèn lồng → người dùng: "màu sắc… chưa phù hợp với đề tài". Màu phụ vẫn chịu luật tương phản; dải chuyển màu tính vào liều G1-01 (≤ 1 vùng nền lớn + ≤ 3 điểm nhấn).
- Trạng thái luôn kèm icon hoặc chữ (SC 1.4.1).
- Chữ trên nền màu: dùng sắc độ của chính màu đó, không dùng xám trung tính.
- Trung tính thuần hay pha sắc độ thương hiệu là một quyết định, ghi lại.
- Màu cảnh báo y tế/an toàn theo quy ước ngành (ví dụ mức ưu tiên cảnh báo của IEC 60601-1-8 cho thiết bị y tế; sản phẩm chưa được chứng nhận thì chỉ tham khảo ý tưởng, không tuyên bố tuân thủ).

**Dark mode** (khi có — mặc định ở [02 §4](02_PHAN_CAP.md#4-khai-báo-cấu-hình)): bộ token riêng, không đảo màu tự động; bề mặt cao hơn sáng hơn; giảm bão hoà màu nhấn; khai báo `color-scheme: dark` và `<meta name="theme-color">`; kiểm tương phản riêng, thêm APCA làm tham khảo (Lc ≥ 75 chữ thân, ≥ 60 chữ lớn) vì công thức WCAG 2 đánh giá chưa tốt chữ sáng trên nền tối.

## 4. Bề mặt, viền, bóng, bo góc

Mỗi sản phẩm chọn một chiến lược ở chặng 2:

| Chiến lược | Phân nhóm bằng | Hợp với |
| --- | --- | --- |
| Phẳng | Khoảng trắng, đường kẻ, tiêu đề | Nội dung đọc, bảng dày |
| Viền | Viền mảnh quanh nhóm | Công cụ, admin |
| Nổi | Bóng nhẹ, bề mặt sáng hơn nền | App tiêu dùng, đối tượng kéo/thả |

- Card chỉ khi nhóm đó là một đối tượng độc lập (bấm, kéo, chia sẻ, xoá được).
- Tối đa 2 cấp khung có viền/nền lồng nhau.
- Bo góc theo thang (ví dụ 4/8/16); bo trong = bo ngoài − padding.
- Bóng một hướng sáng, độ mờ thấp, ba cấp rõ (nổi, menu, hộp thoại); không bóng phát sáng màu.
- Ranh giới nhận diện điều khiển form (viền **hoặc** nền) ≥ 3:1 với xung quanh (SC 1.4.11). Viền trang trí không cần.

## 5. Khoảng cách, bố cục, viewport

- Bước 4px; thang 4, 8, 12, 16, 24, 32, 48, 64, 96 — dự án chọn tập con. Lệch 1–2px để căn quang học được phép, có chú thích.
- Gần nhau = liên quan.
- **Viewport chuẩn cho web:** **320, 768, 1440px**; xem thêm bằng mắt ở 1024 và ≥ 1920px khi trang có nhiều cột. Nền tảng khác: ma trận [03B §0](03B_NEN_TANG_THIET_BI.md#0-ma-trận-kích-thước-kiểm-định).
- Không tràn ngang ở 320px (SC 1.4.10), trừ bảng dữ liệu, bản đồ, code cuộn trong khung riêng.
- `grid`/`flex`, container queries cho component dùng ở nhiều độ rộng; con flex chứa chữ dài cần `min-width: 0`.
- Khung cuộn có `scrollbar-gutter: stable` để không nhảy bố cục khi thanh cuộn xuất hiện.

## 6. Icon và hình ảnh

- Một bộ icon; cỡ 16/20/24 cố định; độ dày nét chỉnh theo cỡ và độ đậm của chữ đi kèm, không để mặc định.
- Icon đứng một mình có tên trợ năng; điều hướng chính có chữ.
- Không dùng emoji thay icon trong giao diện chức năng.
- **Thang chọn hình ảnh khi thiếu tư liệu** (dừng ở bậc đầu tiên làm được):
  1. Ảnh chụp/quay giao diện sản phẩm thật với dữ liệu thật.
  2. Ảnh chụp thật (sản phẩm, con người, bối cảnh) có quyền dùng.
  3. Sơ đồ, biểu đồ dựng từ dữ liệu thật.
  4. Bố cục dựa vào chữ, không ảnh.
  5. Minh hoạ đặt vẽ, một phong cách nhất quán.
  Không dùng ảnh AI mô tả "người dùng" hay "sản phẩm đang dùng". Ảnh stock có người (2.5): được dùng làm **ảnh minh hoạ không khí** khi có chú thích "Ảnh minh hoạ" kèm nguồn, không gắn tên, lời trích hay số liệu, không ngụ ý là khách hàng thật (07 D-02). Không có ảnh thì chọn bậc 4, không lấp bằng gradient.
- **Tài nguyên thật hơn đồ tự dựng (2.5):** trang E2–E3, hình ảnh tự dựng bằng mã (khối 3D ghép từ hình cơ bản, SVG minh hoạ) **kém hơn bản mẫu** (07 T13) thì thay bằng tài nguyên có giấy phép: ảnh (Unsplash, Pexels), mô hình quét/HDRI/texture (Poly Haven, CC0). Mỗi tài nguyên ghi một dòng trong bảng tài nguyên (10 §2): nguồn, giấy phép, tác giả, link. Nhúng ảnh từ CDN của nguồn khi giấy phép cho phép; tải tệp về dự án phải hỏi người dùng trước (12 §6).
- Mọi `<img>` có `width`/`height` hoặc `aspect-ratio`; AVIF/WebP + `srcset`; ảnh dưới màn đầu tải lười; ảnh LCP không tải lười, có `fetchpriority="high"`.
- `alt` mô tả nội dung/chức năng; ảnh trang trí `alt=""`.

## 7. Biểu đồ và dữ liệu

- Chọn theo câu hỏi: xu hướng → đường; so sánh → cột (trục từ 0); cơ cấu → cột chồng hoặc bảng; ít số → bảng hoặc câu chữ.
- Bảng màu phân loại riêng, ≤ 6 màu, kiểm cho người mù màu; tách biệt với màu trạng thái.
- Ghi nhãn trực tiếp lên đường/cột thay cho chú giải khi được; lưới mờ hoặc không lưới; nhóm biểu đồ được đặt trong card nền sáng, không lồng card trong card.
- Giá trị không chỉ nằm trong tooltip; có bảng dữ liệu hoặc mô tả cho trình đọc màn hình.
- Định dạng số như bảng ([05 §1.5](05_NGON_NGU.md#15-số-ngày-tiền-địa-chỉ)).
- Theme mặc định của thư viện biểu đồ không chỉnh là dấu hiệu G2-14.

## 8. Trạng thái

Ở chặng 1, mỗi màn hình chọn trạng thái thật sự xảy ra:

| Trạng thái | Ghi chú |
| --- | --- |
| Tải lần đầu | Skeleton gần bố cục thật, chỉ hiện nếu tải > ~300ms; đã hiện thì giữ ≥ ~500ms để không chớp |
| Tải lại | Giữ dữ liệu cũ, báo đang cập nhật |
| Rỗng lần đầu | Giải thích + hành động tạo |
| Rỗng do lọc/tìm | Nói rõ do bộ lọc + nút xoá lọc |
| Một phần | Khối lỗi không làm hỏng khối khác |
| Lỗi thử lại được / không thử lại được | Thông điệp + thử lại / hướng liên hệ |
| Không có quyền | Cần quyền gì, xin ở đâu |
| Offline | Báo mất kết nối, việc gì vẫn làm được |
| Đang lưu / đã lưu / lưu lỗi | Cho thao tác ghi |
| Xung đột | Người khác sửa cùng lúc |

- Giữ chỗ cho nội dung tải sau bằng `min-height`/`aspect-ratio`, **không** chiều cao cố định + `overflow: hidden`.
- CLS: dịch chuyển trong vòng 500ms sau thao tác click/chạm/phím không tính; nội dung tải về sau mốc đó vẫn tính — phải giữ chỗ trước.
- Trạng thái chỉ dùng khi phát triển (mock, skeleton giả) không lộ ra giao diện.

## 9. Tương tác và phản hồi

- Mọi phần tử tương tác có trạng thái thường, hover (thiết bị có chuột), nhấn, focus, vô hiệu, đang xử lý.
- Focus: `:focus-visible`; không bị thanh dính che hoàn toàn (SC 2.4.11, AA). Quy ước nhà: chỉ báo ≥ 2px, tương phản ≥ 3:1 (theo SC 2.4.13, AAA). Bỏ `outline` thì giữ `outline` trong suốt để chế độ tương phản cao vẫn hiện.
- `<button>` cho hành động, `<a href>` cho điều hướng; không `div` bấm được.
- Phản hồi ≤ 100ms; thao tác > 1 giây có chỉ báo tiến trình.
- Phá huỷ: hoàn tác ưu tiên hơn hộp xác nhận; hạng A dùng cả hai khi không hoàn tác được.
- Toast: thông tin không cần hành động tự ẩn sau ≥ 5 giây; toast có nút (Hoàn tác) giữ ≥ 10 giây, dừng khi hover/focus, tới được bằng bàn phím; hạng A/B: hoàn tác xoá vẫn làm được sau khi toast đóng (thùng rác, lịch sử). Lỗi cần xử lý hiển thị tại chỗ, không tự ẩn.
- Thông báo động: `aria-live="polite"`; `assertive` chỉ cho khẩn.

## 10. Trợ năng nền tảng

- HTML ngữ nghĩa trước, ARIA sau; component phức tạp theo WAI-ARIA Authoring Practices hoặc thư viện đã làm đúng.
- `lang` trên `<html>` và đoạn khác ngôn ngữ; một `<h1>`; heading theo cấp; landmark; skip link khi điều hướng dài.
- Toàn bộ chức năng dùng được bằng bàn phím; dialog giữ focus bên trong, trả focus khi đóng, đóng bằng Escape.
- **Quy tắc focus dùng lại (2.3)** — lớp lỗi lặp nhiều nhất ở lần dùng thật (8 lần):
  1. Đổi trang/route trong ứng dụng một trang: focus `h1` của trang mới (`tabIndex=-1`, không vẽ khung vì không phải điều khiển); quay lại trang trước: focus nút đã mở — **mọi đường quay về** đều vậy (link quay lại, Huỷ, Lưu xong, Back của trình duyệt), kể cả trang con mở từ trang con (danh sách → chi tiết → sửa → về chi tiết: focus nút "Sửa"). Mỗi đường quay về khai báo một state có `expectFocus` (03 "Trạng thái tương tác bắt buộc").
  2. Trả focus bằng **selector theo khoá dữ liệu** (`[data-row-id="…"]`), không giữ tham chiếu phần tử — danh sách dựng lại thì phần tử cũ đã mất.
  3. Phần tử mở bị gỡ (xoá dòng): đợi dữ liệu tải lại rồi focus dòng kế tiếp cùng vị trí, hết dòng thì `h1`.
  4. Không `disabled` nút đang giữ focus khi gửi: `aria-disabled` + chặn gửi hai lần trong hàm xử lý.
  5. Lỗi sau thao tác: focus khung lỗi (`role="alert"`, `tabIndex=-1`).
  6. Focus đặt trong effect **sau** khi trang mới đã vẽ (không đặt trong `requestAnimationFrame` trước khi trạng thái đổi xong).
- **Vùng chạm theo kiểu nhập** (config `input`): `both` → < 1024px coi là cảm ứng; mọi điều khiển ≥ 44px ở dưới 1024px **và** khi `(pointer: coarse)` ở mọi độ rộng. Mẫu lớp Tailwind: `h-11 lg:h-9 coarse:h-11` (biến thể `coarse` = `screens: { coarse: { raw: '(pointer: coarse)' } }`). **Đặt vùng chạm trong component dùng chung** (2.4): nút, link điều hướng trong danh sách/bảng (`TextLink`, `RowLink`…), nút icon mang sẵn lớp vùng chạm; màn hình dùng component, không tự viết lớp vùng chạm cho từng chỗ — lần chạy thử 2.3, link mới chỉ cao 21px vì người làm quên lớp vừa viết vào chuẩn. Phần tử tương tác viết tay (không qua component) phải có lý do trong bảng gọt hoặc mô tả thay đổi.
- **Bọc truy cập `localStorage`/`sessionStorage`/`history.replaceState`/`location.hash`** trong try/catch: khung xem trước (trang `data:`), chế độ riêng tư, iframe sandbox chặn chúng; trang phải vẫn chạy (lần dùng thật: trang trắng trong khung xem của app).
- Phóng to 200% (1.4.4), reflow 320px (1.4.10), tăng khoảng chữ (1.4.12) không mất nội dung.
- Kéo–thả có cách thay thế (2.5.7). Không chặn phóng to.

## 11. Mặc định E0

Giá trị khởi điểm cho màn hình tiện dụng (admin, bảng, form). Dự án ghi đè được trong token. E0 vẫn dùng màu, font, bo góc, bóng từ token dự án; được giữ chi tiết thân thiện của thư viện (bo góc, khoảng cách, focus ring), phải đổi ít nhất màu nhấn và một trong {font, bo góc, bề mặt} (07 §4, G2-01 trong liều). Màn tác vụ hạng B/C dùng hằng ngày mặc định là E1 (02 §2).

| Hạng mục | Mặc định |
| --- | --- |
| Cỡ chữ | 12 / 13 / 14 / 16 / 20 / 24px — 12 và 13 chỉ cho chú thích, nhãn phụ, siêu dữ liệu; chữ thân và ô bảng theo 02 §1 (16px; bảng dày 14px) |
| Mật độ | Người dùng dùng cả ngày, dữ liệu dày (hạng B): dòng bảng 32–40px, cho chọn mật độ nếu có cả người dùng thỉnh thoảng; giữ lựa chọn theo người dùng |
| Độ đậm | 400 / 500 / 600; không dùng 700 trong bảng |
| Chiều cao dòng bảng | 32 (gọn) / 40 / 48px — gọn chỉ cho con trỏ chính xác và hạng B/C; hạng A ≥ 40px |
| Chiều cao điều khiển | 32 / 36 / 40px (chuột); 44–48px (cảm ứng) |
| Lề trang | 24px desktop, 16px mobile |
| Độ rộng nội dung tối đa | 1440px; form 640px |
| Màu chữ | Tối đa 2 màu chữ mỗi khối (chính + phụ) |
| Màu nhấn | Chỉ hành động chính, mục đang chọn, liên kết |
| Icon | 16/20px, đi cùng chữ ở điều hướng |
| Badge | Trạng thái hoặc phân loại; màu nhạt, chữ cùng tông (07 §4 bậc tự do) |

Checklist tay nghề E0:
- [ ] Mọi khối căn theo một mép trái chung; số căn phải.
- [ ] Mật độ hợp tác vụ: không có vùng trống lớn hơn 25% chiều cao viewport trong màn hình làm việc.
- [ ] Không card nếu nhóm không phải đối tượng độc lập (E0; E1 trở lên: card nền sáng cho nhóm có ý nghĩa là bậc tự do, 07 §4).
- [ ] Phân cấp nhìn ra được khi nheo mắt: tiêu đề → hành động chính → nội dung.
- [ ] Nhãn ngắn, đúng thuật ngữ; không icon trên mọi nhãn.

## 12. Hiệu năng và in ấn

- Ngân sách: Core Web Vitals theo [02 §2](02_PHAN_CAP.md#2-mức-biểu-cảm).
- Không animate `width`/`height`/`top`/`left` khi `transform` làm được.
- Script bên thứ ba có ngân sách và được đo.
- In ấn chỉ cho màn hình liệt kê trong `print` của config: nền trắng chữ đen, ẩn điều hướng/nút, không ngắt trang giữa hàng bảng, in URL liên kết quan trọng.
