# 02 · Phân cấp: nền tảng, hạng rủi ro, mức biểu cảm

Mỗi màn hình có bốn nhãn độc lập:

| Nhãn | Giá trị | Quyết định |
| --- | --- | --- |
| Nền tảng | `web`, `mobile`, `tablet`, `desktop` (`wear`: phụ lục) | Quy ước nền tảng ([03B](03B_NEN_TANG_THIET_BI.md)) |
| Loại trang | xem [03](03_LOAI_TRANG.md) | Trang phải trả lời được gì |
| Hạng rủi ro | `A`, `B`, `C` | Ngưỡng trợ năng, mức kiểm thử |
| Mức biểu cảm | `E0`–`E3` | Trang trí, chuyển động, 3D được phép |

Hạng gắn theo **luồng và người dùng**, không theo cả sản phẩm. Ví dụ một cửa hàng online: trang chủ và danh mục là C; bước thanh toán và màn hình hoàn tiền trong trang quản trị là A; danh sách đơn hàng cho nhân viên kho là B. Ví dụ app ngân hàng: chuyển tiền là A, trang khuyến mãi là C.

## 1. Hạng rủi ro

| | **A — Thiết yếu** | **B — Chuyên nghiệp** | **C — Đại chúng** |
| --- | --- | --- | --- |
| Định nghĩa | Sai có thể hại sức khoẻ, mất tiền, mất dữ liệu không hoàn tác, vi phạm pháp lý | Người dùng thành thạo, dùng hằng ngày, dữ liệu dày | Người dùng bất kỳ, dùng không thường xuyên |
| Ví dụ | Cảnh báo y tế, chuyển tiền, ký hợp đồng, điều khiển thiết bị | Admin, CRM, công cụ dev, báo cáo | Trang chủ, landing, blog, thương mại, app tiện ích |
| Mục tiêu | WCAG 2.2 AA + các mục nâng trong bảng | WCAG 2.2 AA | WCAG 2.2 AA |
| Tương phản chữ thường | ≥ 7:1 | ≥ 4.5:1 | ≥ 4.5:1 |
| Tương phản chữ lớn (≥ 24px, hoặc ≥ 18.66px đậm) | ≥ 4.5:1 | ≥ 3:1 | ≥ 3:1 |
| Tương phản phi văn bản | ≥ 3:1 | ≥ 3:1 | ≥ 3:1 |
| Vùng chạm, con trỏ chính xác (chuột, bút) | ≥ 24px hoặc đủ khoảng cách (SC 2.5.8); hành động chính và phá huỷ của tác vụ ≥ 44px | ≥ 24px hoặc đủ khoảng cách (SC 2.5.8) | như B |
| Vùng chạm, cảm ứng | ≥ 48px | ≥ 44px | ≥ 44px |
| Cỡ chữ thân tối thiểu | 16px; người dùng lớn tuổi hoặc thị lực kém ≥ 18px; nhân viên chuyên môn trên desktop: bảng 14px được phép | 16px nội dung đọc; 14px bảng dày | 16px |
| Giới hạn thời gian (SC 2.2.1, mức A) | Như B + giữ dữ liệu đã nhập khi đăng nhập lại | Cho tắt/chỉnh, hoặc cảnh báo trước ≥ 20 giây và cho gia hạn (ít nhất 10 lần) | như B |
| Hành động phá huỷ | Xác nhận nêu rõ hậu quả + hoàn tác hoặc thời gian chờ huỷ | Hoàn tác hoặc xác nhận | Hoàn tác khi có thể |
| AI tự động | Kết quả AI không tự áp dụng khi chưa có người xem | Cho xem trước khi áp dụng | — |

Ghi chú:

- "Cảm ứng" = nền tảng `mobile`, `tablet`, `wear`; với web theo trường `input` của màn hình (`fine` | `coarse` | `both`, mặc định `both` = cảm ứng ở viewport < 1024px). CSS dùng `@media (pointer: coarse)`, không dùng chiều rộng màn hình.
- Hạng A với con trỏ chính xác: đánh dấu nút hành động chính/phá huỷ bằng `data-primary-action` để `audit.mjs` kiểm mức 44px.
- 24px là SC 2.5.8 (AA). 44px là SC 2.5.5 (AAA) và khuyến nghị Apple; 48dp là khuyến nghị Material.
- Hạng A dùng 7:1 cho chữ thân và dữ liệu. Nhãn nút đủ cỡ chữ lớn (≥ 18.66px đậm hoặc ≥ 24px) chỉ cần 4.5:1 — tránh việc mọi màu nhấn hạng A phải gần đen.
- Cặp màu trong file token mặc định được kiểm ở **hạng cao nhất** của dự án. Cặp chỉ dùng ở một số màn hình thì gắn `"screens": [id…]` để kiểm theo hạng của các màn hình đó ([04 §1](04_NEN_TANG.md#1-token)).
- Chữ trên điều khiển đang vô hiệu (disabled) được miễn tương phản (SC 1.4.3).

## 2. Mức biểu cảm

| | **E0 — Tiện dụng** | **E1 — Chau chuốt** | **E2 — Biểu cảm** | **E3 — Trải nghiệm sâu** |
| --- | --- | --- | --- | --- |
| Dùng cho | Luồng hạng A, form/cài đặt hiếm dùng | **Mặc định cho màn tác vụ hạng B/C dùng hằng ngày** (admin, bảng, quản lý), app sản phẩm, tài liệu, chi tiết, thương mại | Trang chủ, landing, trang sản phẩm nổi bật | Ra mắt, kể chuyện, portfolio, chiến dịch |
| Font | 1 họ chữ, có thể là font hệ thống | 1–2 họ | 2 họ, có font tiêu đề mang giọng riêng | 2 họ, chữ biến thể, chữ động |
| Màu | Trung tính + 1 nhấn + màu trạng thái | + màu phụ cho minh hoạ | Bảng thương hiệu đầy đủ, nền có chất liệu | Tự do, màu đổi theo cảnh |
| Chuyển động | Phản hồi trạng thái; vào/ra của menu, dialog | + chuyển cảnh, liên tục | + một màn mở đầu dàn dựng (theo [06 §3](06_CHUYEN_DONG_3D.md#3-giảm-chuyển-động-và-tăng-cường-dần)), hiện dần có chủ đích, một tương tác đặc trưng | + cuộn điều khiển, ghim cảnh, video tua, WebGL |
| 3D | Không | Không | Khi sản phẩm là vật thể 3D | Được, có bản tĩnh |

Thông số thời lượng và easing theo loại chuyển động: [06 §2](06_CHUYEN_DONG_3D.md#2-thông-số).

Ngân sách hiệu năng mọi mức: Core Web Vitals "tốt" ở phân vị 75 — LCP ≤ 2.5 giây, INP ≤ 200ms, CLS ≤ 0.1. E2–E3 đo trên mobile tầm trung; khối 3D/video tải sau LCP.

## 3. Luật kết hợp

1. **Hạng A không vượt E1** trên màn hình tác vụ (mọi `type` trừ `home`, `landing`, `pricing`, `article`, `immersive`, `email`). Trang giới thiệu của sản phẩm hạng A có thể E2.
2. **E3 chỉ ở làn L**, có bản tĩnh đầy đủ nội dung.
3. **E2–E3 không làm chậm tác vụ:** nút chính bấm được ngay, không chờ animation.
4. **Một trang một mức chính.** Ngoại lệ duy nhất: trang E2 chứa một khối E3 là trọng tâm, có bản tĩnh.
5. **Mức biểu cảm không phải mức chất lượng.** E0 chỉ có nghĩa là ít trang trí; chất lượng E0 theo [04 §11](04_NEN_TANG.md#11-mặc-định-e0).

## 4. Khai báo cấu hình

`design.config.json` ở gốc dự án; lược đồ: [design.config.schema.json](design.config.schema.json). `scripts/audit.mjs` và `scripts/check_tokens.mjs --config` đọc file này.

```json
{
  "standard": "design_standard@4.0",
  "language": ["vi"],
  "tokens": "tokens.json",
  "uiRoots": ["src/"],
  "preview": {
    "url": "http://localhost:4173",
    "command": "npm run build && npx vite preview --port 4173 --strictPort"
  },
  "verify": {
    "commands": ["npm test", "npm run build"]
  },
  "screens": [
    {
      "id": "home",
      "platform": "web",
      "path": "/",
      "source": ["src/pages/home/"],
      "type": "home",
      "tier": "C",
      "expression": "E0",
      "ready": "main",
      "states": [],
      "stateCoverage": {
        "loading": "n/a: trang tĩnh không gọi API",
        "empty": "n/a: trang không có danh sách",
        "error": "n/a: trang tĩnh không gọi API",
        "dialog": "n/a: trang không có hộp thoại"
      }
    }
  ]
}
```

File đầy đủ: [scripts/design.config.example.json](scripts/design.config.example.json). Trường `input` (web): `fine` | `coarse` | `both`. Trường `stack: "flutter"` cho web dựng bằng Flutter (canvas) — xem [03B §1](03B_NEN_TANG_THIET_BI.md#1-web). Trường `ssr: true` cho màn hình phải đọc được khi tắt JavaScript (trang công khai cần SEO); `audit.mjs` so lượng chữ khi tắt/bật JS. `tokens` và `preview` dùng cho hook và CI ([09 §4](09_CONG_CU.md#4-hook-và-ci)).

**Dark mode:** mặc định **không**, trừ khi brief yêu cầu. Khi bật, cần bộ token tối riêng đã qua `check_tokens.mjs` ở đúng hạng; app chỉ theo cài đặt hệ thống sau khi có bộ đó.
