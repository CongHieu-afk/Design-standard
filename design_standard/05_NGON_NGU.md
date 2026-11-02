# 05 · Quy tắc theo ngôn ngữ giao diện

Brief ghi ngôn ngữ giao diện: `vi`, `en` hoặc cả hai. Áp mục tương ứng; song ngữ áp cả ba mục. Cách làm tương đương trên Flutter ở [03B §6](03B_NEN_TANG_THIET_BI.md#6-bảng-chuyển-đổi-web--flutter).

---

## 1. Giao diện tiếng Việt

### 1.1 Font

Font phải có đủ 134 chữ cái có dấu (67 thường + 67 hoa) và đạt bốn tiêu chí dưới đây, không chỉ "có glyph".

Thủ tục kiểm (5 phút, chặng 2), gõ ở 12px, 16px, 48px, chữ thường và CHỮ HOA:

```
Ếch ộp Ửng Ỗ Ặ Ệ Ỹ ở ữ đ Đ ₫ — Người dùng đã đồng ý điều khoản quyền riêng tư.
```

Đạt khi:
- dấu chồng (ế, ổ, ữ, ặ) không chạm nhau, không chạm dòng trên;
- sắc và huyền đối xứng, không rộng hơn chữ gốc; dấu hỏi nhỏ, phân biệt rõ với dấu ngã;
- gạch của Đ/đ đủ dày ở 12px;
- không chữ nào rơi về font dự phòng (nét khác hẳn).

Tự host thì kiểm file có subset `vietnamese`. Có rất nhiều font miễn phí hỗ trợ tiếng Việt (lọc theo ngôn ngữ "Vietnamese" trên Google Fonts); chọn theo hướng thị giác, đừng mặc định một font quen tay — font quen tay của sản phẩm Việt là một vân tay mặc định (DF-6, [07 §5](07_CHONG_AI_SLOP.md#5-quyết-định-đặc-trưng-và-vân-tay)). Font thương mại đã được đánh giá kỹ về dấu: [Việt Type](https://vietnamesetypography.com/type-recommendations/). "Có hỗ trợ" chưa đủ — vẫn chạy thủ tục trên.

### 1.2 Khoảng dòng và dấu

| Loại chữ | Tối thiểu | Khuyến nghị |
| --- | --- | --- |
| Thân bài, đoạn văn, mục danh sách | 1.5 | 1.5–1.7 |
| Nhãn, ô nhập, nút, ô bảng — khi phần tử có thể cắt chữ (`overflow` khác `visible`, chiều cao cố định) | 1.4 | 1.4–1.5 |
| Nhãn, nút không cắt chữ | 1.2 | 1.3–1.5 |
| Tiêu đề (kể cả khi xuống 2 dòng) | 1.25 | 1.25–1.35 |

- Không `height` cố định + `overflow: hidden` cho phần tử một dòng có chữ (pill, badge, ô bảng): dấu chữ hoa (Ặ, Ễ) bị cắt. Dùng `padding` + `line-height`.
- Tracking tiêu đề không chặt hơn −0.02em và phải qua chuỗi kiểm ở đúng cỡ ([04 §2](04_NEN_TANG.md#2-chữ)).
- CHỮ HOA toàn bộ chỉ cho nhãn ngắn; tăng line-height vì dấu chữ hoa cao hơn.
- Ảnh chụp kiểm định dùng nội dung có chữ hoa có dấu chồng.

### 1.3 Viết hoa

- **Viết hoa đầu câu**, không viết hoa mọi chữ đầu: "Xuất báo cáo ca trực", không "Xuất Báo Cáo Ca Trực". Title Case là quy ước tiếng Anh; trong tiếng Việt là dấu hiệu dịch máy (G2-10).
- Danh từ riêng, tên sản phẩm, tổ chức theo tên chính thức; chữ viết tắt giữ nguyên (CCCD, BHYT, SOS).

### 1.4 Văn phong

- Câu ngắn, chủ động, nói cụ thể việc gì xảy ra.
- Xưng hô: "bạn" hoặc lược chủ ngữ ("Nhập mật khẩu"); nhất quán. Người dùng lớn tuổi: cân nhắc "ông/bà" trong nội dung trực tiếp; ghi vào bảng thuật ngữ. Tránh "Quý khách" trong sản phẩm thân mật.
- Nút: động từ + đối tượng ("Lưu thay đổi", "Gửi yêu cầu"). Động từ là **thao tác thật** — nút, tiêu đề hộp xác nhận và thông báo kết quả của cùng một thao tác dùng cùng động từ; không nói giảm thao tác phá huỷ ("Ngừng bán" cho xoá cứng là G2-09d, 07 §4).
- Lỗi: chuyện gì xảy ra + cách sửa. "Số điện thoại cần 10 chữ số, bắt đầu bằng 0", không "Dữ liệu không hợp lệ".
- Bảng thuật ngữ dự án: một khái niệm, một từ; ghi cả lựa chọn "₫" hay "đ", "bạn" hay lược chủ ngữ, kiểu đặt dấu thanh.
- **Văn sáo rỗng, hay gặp ở văn AI tiếng Việt** (G1-06):
  - Từ: *đột phá, toàn diện, vượt trội, hàng đầu, tối ưu, liền mạch, nâng tầm, khai phá, kỷ nguyên mới, giải pháp thông minh, trải nghiệm tuyệt vời, sức mạnh của…*
  - Mẫu câu: "Chúng tôi tự hào…", "Trải nghiệm ngay", "Bắt đầu hành trình của bạn", "Giải pháp … toàn diện cho doanh nghiệp", "Được thiết kế để…" (cấu trúc câu tiếng Anh).
  - Gạch ngang dài (—) quá 1 lần trên 100 từ.
  Thay bằng điều cụ thể sản phẩm làm được, có số liệu thật nếu có.
- Không đưa thuật ngữ nội bộ vào nội dung người dùng ("Skeleton", "Zero CLS", "WCAG AAA").

### 1.5 Số, ngày, tiền, địa chỉ

Dùng `Intl` với locale `vi-VN` (Flutter: gói `intl`, xem 03B §6); không ghép chuỗi tay.

| Loại | Định dạng | Ví dụ | Cách tạo (JS) |
| --- | --- | --- | --- |
| Số | chấm phân cách nghìn, phẩy thập phân | 1.234.567,89 | `new Intl.NumberFormat('vi-VN')` |
| Tiền | chọn một kiểu, ghi vào bảng thuật ngữ | 1.250.000 ₫ (mặc định của Intl) hoặc 1.250.000đ (phổ biến ở thương mại Việt Nam) | `{style:'currency', currency:'VND'}` |
| Ngày | dd/mm/yyyy | 28/10/2026 | `{day:'2-digit', month:'2-digit', year:'numeric'}` |
| Ngày đầy đủ | | Thứ Tư, 28 tháng 10, 2026 | `{dateStyle:'full'}` |
| Giờ | 24 giờ | 14:05 | `{hour:'2-digit', minute:'2-digit', hourCycle:'h23'}` |
| Điện thoại | hiển thị 4-3-3 | 0912 345 678 | lưu E.164 `+84912345678` |

- Không dùng `dateStyle: 'medium'` của `vi-VN` ("28 thg 10, 2026"): chữ "thg" lạ với nhiều người.
- Tuần bắt đầu từ thứ Hai.
- Họ tên: một trường "Họ và tên" trừ khi nghiệp vụ cần tách.
- Địa chỉ: từ 01/07/2025 Việt Nam dùng chính quyền địa phương hai cấp — tỉnh/thành phố và xã/phường/đặc khu — không còn cấp quận/huyện; 34 tỉnh thành ([nguồn](https://en.wikipedia.org/wiki/2025_Vietnamese_administrative_reforms)). Form địa chỉ mới không hiển thị trường quận/huyện; dữ liệu cũ cần ánh xạ. `[kiểm lại: 2027-04]`

### 1.6 Unicode, tìm kiếm, sắp xếp

- Chuẩn hoá NFC khi nhận dữ liệu và trước khi lưu. Văn bản dạng tổ hợp (NFD) thường đến từ bộ gõ đặt "Unicode tổ hợp" (Unikey, VNI) và tên file trên macOS.
- Hai kiểu đặt dấu thanh cùng tồn tại ("hoà"/"hòa", "thuỷ"/"thủy"); NFC **không** gộp chúng. Tìm kiếm phải coi là một và tìm được khi gõ không dấu: NFD → bỏ ký tự dấu → `đ→d` → so khớp.
- So khớp chuỗi giao diện trong code/test (ví dụ tìm nút "Huỷ") cũng chịu được cả hai kiểu.
- Sắp xếp bằng `new Intl.Collator('vi').compare` (đ sau d; a, ă, â đúng thứ tự).

### 1.7 Độ dài và ngắt dòng

- Không đặt chiều rộng cố định theo nhãn tiếng Anh; thử nhãn tiếng Việt dài nhất.
- Không `hyphens: auto` cho tiếng Việt.
- Khoảng trắng không ngắt giữa số và đơn vị (`10&nbsp;kg`).
- `lang="vi"` trên `<html>`.

---

## 2. Giao diện tiếng Anh

- Line-height thân 1.4–1.6; tiêu đề 1.1–1.3. Tracking theo [04 §2](04_NEN_TANG.md#2-chữ).
- Viết hoa: chọn **một** kiểu cho toàn sản phẩm — sentence case (khuyến nghị cho giao diện) hoặc Title Case cho tiêu đề và nút. Ghi vào bảng thuật ngữ.
- Typography: dấu nháy cong (“ ” ‘ ’), dấu ba chấm một ký tự (…), gạch en cho khoảng (9–5), khoảng trắng không ngắt giữa số và đơn vị; nhãn đang tải kết thúc bằng "…".
- Văn phong: plain English, chủ động, ngôi "you"; nút nói rõ hành động ("Save changes"); lỗi = what happened + how to fix.
- Văn sáo rỗng (G1-06): *seamless, empower, unlock, elevate, revolutionize, cutting-edge, leverage, robust, streamline, supercharge, game-changing, next-gen, harness, effortless, all-in-one*, "Welcome back 👋"; gạch ngang dài quá 1 lần trên 100 từ.
- Ngày: tránh dạng số dễ nhầm (10/11/2026); dùng "Oct 28, 2026" hoặc ISO "2026-10-28" trong bảng kỹ thuật; ghi múi giờ khi người dùng ở nhiều nơi.
- Dùng `Intl` theo locale người dùng (`en-US`, `en-GB`…).

---

## 3. Sản phẩm song ngữ (vi + en)

- Toàn bộ chuỗi trong file ngôn ngữ; không ghép chuỗi bằng code. ICU MessageFormat cho số nhiều (tiếng Anh có số ít/nhiều; tiếng Việt chỉ một dạng).
- Thiết kế theo chuỗi dài nhất của cả hai ngôn ngữ; ảnh chụp kiểm định chạy cả hai.
- Font đạt §1.1 và hợp giọng cả hai ngôn ngữ.
- Quy tắc viết hoa riêng từng ngôn ngữ.
- `lang` đổi theo trang; đoạn chèn ngôn ngữ khác có `lang` riêng.
- Nút đổi ngôn ngữ ghi bằng chính ngôn ngữ đó ("Tiếng Việt", "English"), không dùng cờ.
- URL theo ngôn ngữ (`/vi/…`, `/en/…`) + `hreflang`; nhớ lựa chọn của người dùng.
- Không đặt chữ trong ảnh.
- Định dạng số/ngày theo **locale**, không chỉ theo ngôn ngữ (tiếng Anh ở Việt Nam vẫn có thể cần ₫ và dd/mm/yyyy).
