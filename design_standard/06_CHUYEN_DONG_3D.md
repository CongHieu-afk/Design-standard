# 06 · Chuyển động, cuộn và 3D

Chuyển động phải có việc để làm. Mức được phép theo [02 §2](02_PHAN_CAP.md#2-mức-biểu-cảm). Dòng có `[kiểm lại: yyyy-mm]` là thông tin hỗ trợ trình duyệt, dễ cũ.

## 1. Chuyển động để làm gì

| Mục đích | Ví dụ | Từ mức |
| --- | --- | --- |
| Phản hồi | Nút nhấn, switch gạt, đã lưu | E0 |
| Vào/ra của lớp phủ | Menu, dialog, sheet | E0 |
| Định hướng, liên tục | Panel trượt từ chỗ nó mở; ảnh thu nhỏ thành trang chi tiết | E1 |
| Nhấn mạnh | Phần tử mới cần chú ý | E1 |
| Kể chuyện | Cảnh theo cuộn, ghim, 3D | E2–E3 |

Không có mục đích nào ở trên thì bỏ.

## 2. Thông số

| Loại | Thời lượng | Easing |
| --- | --- | --- |
| Phản hồi nhỏ (hover, nhấn) | 100–150ms | ease-out |
| Vào (tooltip, menu, dialog, panel) | 150–300ms | ease-out (giảm tốc) hoặc lò xo |
| Ra | ~70% thời lượng vào | ease-in |
| Di chuyển trên màn hình (sắp xếp lại, đổi vị trí) | 200–350ms | ease-in-out |
| Chuyển trang / cảnh (E1+) | 250–400ms | ease-out hoặc lò xo |
| Kể chuyện (E2–E3) | theo cuộn hoặc 400–1200ms | theo kịch bản |

- Lò xo: độ cứng ~300–400, damping ratio 0.8–1. E0 và hạng A: damping ratio ≥ 0.9 (không nảy thấy được). Không dùng easing bounce/elastic ở E0–E1.
- Mặc định chỉ animate `transform`, `opacity` (và `filter` khi cần). Ngoại lệ có giới hạn: chiều cao nội dung đã đo và chiều rộng chỉ mục tab tuyệt đối; phải cô lập bố cục và có kiểm hồi quy. Không `transition: all`.
- Animation ngắt được; người dùng không phải chờ.
- Chuyển động tự chạy > 5 giây, hiển thị cùng nội dung khác → có cách dừng, tắt hoặc ẩn (SC 2.2.2, A).
- Không nhấp nháy quá 3 lần/giây (SC 2.3.1, A) — kể cả video tua theo cuộn, WebGL, đèn cảnh báo.

### 2.1. Ma trận Vi tương tác Nguyên tử (Micro-interactions Matrix)
Mã dùng chung nằm tại `runtime/{motion,lifecycle,primitives}.js`. Chọn lọc từ [Animate UI](https://github.com/imskyleen/animate-ui): lấy token theo vai trò, vòng đời, giảm chuyển động và hành vi primitive; không chép nguyên component React/Motion và không thêm dependency chỉ để có hiệu ứng.

- **Tab thật:** 200–250ms, chỉ mục tuyệt đối dùng `translateX()` + `width`; bắt buộc `role="tablist"` → `role="tab"` → `aria-controls` tới `role="tabpanel"`, roving `tabindex`, Arrow/Home/End. Nút lọc/sắp xếp không phải tab: dùng `role="group"` + `aria-pressed`, không giả làm tab chỉ để có chỉ mục trượt.
- **Chuyển đổi trạng thái nút:** 120–180ms. Cố định `min-width`, bật `aria-busy="true"` và `disabled` khi đang nạp; lần đổi mới phải hủy timer cũ để trạng thái cũ không ghi đè.
- **Dialog:** 150–220ms, scale(0.96 → 1) + opacity; ra ngắn hơn vào. Dựa vào `<dialog>`/primitive nền tảng cho focus, Escape và modal semantics; đóng được cả khi `animationcancel` hoặc thiếu sự kiện kết thúc.
- **Vòng đời:** `createLifecycleCoordinator` là nguồn duy nhất kết hợp IntersectionObserver + Page Visibility; cảnh và ticker dùng coordinator, không viết lại listener riêng.
- **Auto-height/reflow/shared-layout:** chỉ dùng khi thay đổi kích thước/vị trí là thông tin định hướng. Đo kích thước bằng ResizeObserver, giảm chuyển động thành đổi tức thì; không áp đại trà cho thẻ trang trí.
- **Tuyệt đối cấm:** Đặt transition > 300ms trên các thao tác kéo/trượt trực tiếp (thanh trượt range input, kéo thả) để đảm bảo phản hồi 60fps tức thời (Quy tắc GU-25).

### 2.2. Motion token nội bộ

`runtime/motion.js` là nguồn mã duy nhất cho thời lượng/easing của primitive Vanilla: `press`, `feedback`, `enter`, `exit`, `move`. CSS của dự án ánh xạ cùng vai trò sang biến `--motion-*`; không tự viết cubic-bezier khác trong từng component. Spring, morph, stagger hoặc auto-height chỉ thêm khi có consumer thật và kiểm thử tương ứng.

## 3. Giảm chuyển động và tăng cường dần

1. **Nội dung hiện đủ khi không có animation.** Trạng thái mặc định trong CSS là trạng thái cuối. Animation chỉ thêm khi JS chạy và người dùng không chọn giảm chuyển động.
2. **Chữ, nút chính và phần tử LCP của màn hình đầu hiện ở trạng thái cuối ngay lần vẽ đầu** (không opacity 0 → 1): chữ ẩn chưa được vẽ thì LCP bị trễ. Màn mở đầu dàn dựng (E2–E3) chỉ animate phần trang trí không phải LCP, hoặc biến đổi (transform) phần tử đã hiện.
3. **Hiện dần khi cuộn là lựa chọn theo từng khối có lý do**, không phải một class dùng cho mọi khối (dấu hiệu S-04).
4. `prefers-reduced-motion: reduce` = thay chuyển động lớn (trượt, phóng to, parallax, tua video) bằng mờ dần ngắn hoặc đổi tức thì; giữ phản hồi nhỏ. Không có nghĩa là xoá hết.
5. Video tua theo cuộn, cảnh 3D: bản giảm chuyển động là ảnh tĩnh khung quan trọng + chữ đầy đủ.
6. Kiểm: bật giảm chuyển động trong hệ điều hành; tắt JavaScript (trang render phía server).

Ví dụ CSS cho **một** khối có lý do hiện dần (không dùng cho màn hình đầu):

```html
<script>document.documentElement.classList.add('js')</script> <!-- đặt trong <head>, chạy đồng bộ -->
```

```css
.timeline-step { opacity: 1; transform: none; }                     /* mặc định: hiện */
@media (prefers-reduced-motion: no-preference) {
  .js .timeline-step:not(.is-visible) { opacity: 0; transform: translateY(12px); }
  .js .timeline-step { transition: opacity .3s ease-out, transform .3s ease-out; }
}
```

GSAP (theo [gsap-skills](https://github.com/greensock/gsap-skills)):

```js
const mm = gsap.matchMedia();
mm.add({ full: "(prefers-reduced-motion: no-preference)",
         reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
  const { reduce } = ctx.conditions;
  gsap.timeline({ scrollTrigger: { trigger: ".how-it-works", start: "top 70%" } })
      .from(".how-it-works .step", { y: reduce ? 0 : 24, autoAlpha: 0,
                                     duration: reduce ? 0.15 : 0.5, stagger: 0.1 });
});
// React: useGSAP với scope; unmount gọi mm.revert()
```

## 4. Chọn công cụ — nhẹ đến nặng

Dùng bậc thấp nhất làm được việc. Kiểm Baseline/caniuse tại thời điểm dùng; số trong blog thường sai.

| Bậc | Công cụ | Dùng khi | Hỗ trợ / lưu ý |
| --- | --- | --- | --- |
| 0 | HTML/CSS gốc: `<dialog>`, `popover`, `@starting-style`, `transition-behavior: allow-discrete` | Mở/đóng lớp phủ có hiệu ứng, không cần JS | Kiểm Baseline từng tính năng `[kiểm lại: 2027-04]` |
| 1 | CSS transition / animation | Phản hồi, vào/ra | Mặc định E0–E1 |
| 2 | View Transitions API | Chuyển cảnh giữa trạng thái | Cùng tài liệu: Baseline từ 10/2025 ([web.dev](https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available)). Giữa hai trang (`@view-transition`): **chưa** Baseline, cần dự phòng `[kiểm lại: 2027-04]` |
| 3 | CSS scroll-driven (`animation-timeline`) | Hiệu ứng gắn vị trí cuộn, không JS | Chrome/Edge 115+, Safari 26+; Firefox chưa có ở bản ổn định — "Limited availability" ([caniuse](https://caniuse.com/mdn-css_properties_animation-timeline), 10/2026). Bọc `@supports (animation-timeline: scroll())`, có bản tĩnh `[kiểm lại: 2027-04]` |
| 4 | Motion (React), GSAP core + timeline | Chuỗi phối hợp, cử chỉ, layout animation | Timeline thay chuỗi `delay`; dọn dẹp khi unmount |
| 5 | GSAP ScrollTrigger | Ghim cảnh, tua theo cuộn, ảnh toàn khổ phóng theo cuộn, nhóm thẻ hiện dần | `ScrollTrigger.refresh()` sau khi bố cục đổi (ảnh tải xong); huỷ khi rời trang. E2–E3 (2.5): có ít nhất một chuyển cảnh theo cuộn gắn nội dung — trang E3 chỉ có CSS transition là thiếu chuyển cảnh |
| 6 | three.js / React Three Fiber | Sản phẩm 3D, cảnh không làm được bằng 2D | E3, hoặc E2 khi sản phẩm là vật thể 3D |

## 5. Cuộn

- Không chiếm quyền cuộn (đổi tốc độ, chặn cuộn) ở trang có nội dung đọc hoặc tác vụ. Chỉ ở cảnh E3, và vẫn cuộn qua được bằng bàn phím, chuột, cảm ứng.
- Mỗi đoạn ghim có thay đổi nhìn thấy suốt quãng cuộn; không "cuộn chết". Độ dài ghim tương xứng nội dung.
- Không giấu chữ quan trọng ở một vị trí cuộn hẹp.
- Neo `#id` và nút quay lại vẫn đúng.
- Mobile dàn dựng riêng: ít lớp, cảnh ngắn, không phụ thuộc hover.
- Trang E3: chọn một "ngữ pháp trang" và một tương tác đặc trưng; đi qua mọi vị trí cuộn bằng ảnh chụp liên tiếp; đo tương phản ở khung sáng nhất mà chữ đi qua (phương pháp từ scroll-craft, xem [09 §3](09_CONG_CU.md#3-skill-và-tài-liệu-tham-khảo)).

## 6. 3D và WebGL

Chỉ dùng khi 3D giúp hiểu hoặc cảm nhận điều 2D không làm được.

| Hạng mục | Khởi điểm (đo trên Android tầm trung thật) |
| --- | --- |
| Thời điểm tải | Sau LCP; chữ và nút chính không chờ 3D |
| Khung hình | Mục tiêu 60fps; dưới 30fps kéo dài thì hạ chất lượng hoặc chuyển bản tĩnh |
| Tỉ lệ điểm ảnh | `setPixelRatio(Math.min(devicePixelRatio, 2))`; mobile có thể 1.5 |
| Mô hình | glTF nén Draco/meshopt, texture KTX2/WebP (gltf-transform) |
| Khi khuất / Ẩn tab | `createLifecycleCoordinator` kết hợp IntersectionObserver + Page Visibility API (`document.hidden`) để ngắt requestAnimationFrame khi cuộn khuất/chuyển tab |

**Bắt buộc**
- Bản tĩnh (ảnh, hoặc video ngắn có poster) khi: không có WebGL, chọn giảm chuyển động, tiết kiệm dữ liệu, máy yếu.
- Canvas có tên trợ năng mô tả cảnh; xoay/phóng có nút bàn phím tương đương.
- Giải phóng geometry, material, texture khi rời cảnh.
- **Ánh sáng và vật liệu (2.5):** mọi cảnh có ánh sáng môi trường HDRI (`scene.environment`, PMREM) và vật liệu vật lý (`MeshStandardMaterial`/`MeshPhysicalMaterial`); chỉ đèn định hướng + màu trơn cho ra vẻ "nhựa", lần chạy thử 2.4 bị chê thô vì lý do này. Vật thể thật (đá, chai, thiết bị) ưu tiên mô hình quét/glTF có texture (Poly Haven CC0, Sketchfab CC-BY có ghi công) hơn khối ghép từ hình cơ bản; hình cơ bản chỉ cho vật thể trừu tượng.
- **3D phải "sống" ở E3 (2.6):** cảnh 3D đạt ≥ 2 trong {phản hồi con trỏ/cảm ứng, gắn vị trí cuộn, đổi theo lựa chọn, chuyển động liên tục có chủ đích}; cảnh chỉ xoay đều là trang trí tĩnh. Giảm chuyển động → khung tĩnh; dùng `runtime/lifecycle.js` để dừng render khi khuất/ẩn tab và giải phóng khi dispose.
- **Bộ hiệu ứng có sẵn (2.7)** — `landing_3d/src/shared/fx.js`: con trỏ đi theo, tiêu đề hiện theo dòng (GSAP SplitText). **Ảnh tĩnh không có hiệu ứng 3D/biến dạng khi rê** (người dùng 30/10/2026: "bỏ hiệu ứng 3d với các ảnh tĩnh") — 3D chỉ dành cho cảnh có nội dung biến đổi theo người xem (vòng ảnh theo lựa chọn, khối gọt theo cuộn, mô hình đổi trạng thái); ảnh minh hoạ giữ nguyên là ảnh. Luật kỹ thuật dưới đây giữ cho trường hợp dự án vẫn cần hiệu ứng ảnh. Đã bỏ sau phản hồi người dùng: **nền gradient lưới mờ** (đục màu, giống blob AI — sắc màu lấy từ ảnh thật và nền đặc), **tách kênh RGB** (trông như lỗi hiển thị). Luật kỹ thuật rút từ lỗi thật: texture lấy từ bản chép canvas của ảnh đã giải mã (ảnh `srcset` dùng thẳng làm texture → khối đen); chép canvas WebGL cần `preserveDrawingBuffer`; ảnh gốc chỉ ẩn sau khi lớp vẽ có khung đầu, và ẩn bằng `opacity` — **không** `visibility: hidden` (phần tử mất sự kiện chuột → "rời ảnh" → hiệu ứng tắt → ảnh hiện → vòng lặp nháy; người dùng bắt được, máy và phép thử chụp ảnh thì không); ra/vào ảnh xác định bằng vị trí con trỏ trong `pointermove`, không dựa `pointerout`; kiểm hiệu ứng rê bằng phép đếm số lần đổi trạng thái khi rê liên tục (≤ 2), không chỉ chụp ảnh; một phần tử chỉ một nguồn `transform` (không nghiêng CSS + hiện dần + lớp vẽ cùng lúc); thẻ ảnh trong cảnh 3D quay mặt về người xem, không dùng hai mặt (ảnh lật ngược). **Chữ hiện dần chỉ lần đầu** (không lặp khi cuộn lại) và chỉ cho tiêu đề khối, không cho chữ thân. Trang E3 dùng ≥ 2 thứ trong bộ này **ngoài** cảnh 3D chính; tự chế hiệu ứng mới chỉ khi bộ không đáp ứng. Hiện dần theo cuộn dùng IntersectionObserver và chỉ ẩn phần tử đang ở dưới màn hình (`scroll.js`) — lần chạy thử 2.6, `gsap.from` + ScrollTrigger kẹt cả lưới thẻ ở opacity 0.
- **Chọn 3D hay ảnh:** 3D chỉ khi tương tác/biến đổi là nội dung (gọt khối theo bước, mô hình đổi trạng thái). Chỉ để "trông có chiều sâu" thì dùng ảnh thật + chiều sâu CSS (perspective, parallax, lớp nổi `translateZ`) — rẻ hơn, đẹp hơn, nhẹ hơn.
- API đúng phiên bản three.js đang dùng; [threejs-skills](https://github.com/CloudAI-X/threejs-skills) có mục "Common Mistakes" đối chiếu cách viết cũ với r186. Repo đó không bàn trợ năng và giảm chuyển động — phần này theo bộ chuẩn.

## 7. Kiểm tra

Các mục kiểm chuyển động (giảm chuyển động, tắt JS, LCP, nhấp nháy, khung hình dài, đi qua mọi vị trí cuộn) nằm ở [08](08_NGHIEM_THU.md).
