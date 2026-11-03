# CHANGELOG

## Chưa phát hành — 4.0 · Gia cố coverage

- Rút `design_standard/README.md` thành cổng vào ngắn, sửa lệch phiên bản 2.1 → 4.0 và phân loại rõ tài liệu bắt buộc/theo việc/lịch sử.
- `docs/REFERENCE_MAP.md` trở thành nguồn phân loại/điều hướng đầy đủ; kiểm tra tài liệu xác nhận phiên bản, nhãn phân loại và kích thước điểm vào.
- Cô đọng 07/11 về quy tắc đang áp dụng; chuyển 35 phản hồi gu cũ nguyên vẹn sang archive để không bị nạp như policy dự án mới.
- Chắt lọc 35 phản hồi thành hồ sơ gu theo loại trang/component, kèm nguồn, độ tin cậy và điều kiện xử lý các cặp 3D/static, light/dark, motion/stability.
- Nhập GU-36–49 từ thử nghiệm garage vào archive và bổ sung gu có điều kiện về 3D có nghĩa, hero hoàn chỉnh, nhịp section, full-bleed, header/footer, palette dịu và luồng đặt lịch tách trang.
- `uiRoots` thay bộ lọc phần mở rộng: mọi file UI trong phạm vi phải thuộc ít nhất một screen.
- `stateCoverage` buộc inventory loading/empty/error/dialog hoặc lý do không áp dụng.
- W8 phát hiện chuyển động hình học dài/lặp khi reduced motion; W19 chứng minh motion-token và cleanup sau dispose.
- **Không tương thích ngược:** cấu hình 3.x phải thêm `uiRoots`, `stateCoverage` và đổi `standard` thành `design_standard@4.0`.

## 3.0 — 02/11/2026 · Governance fail-closed

- Một nguồn luật ở `AGENTS.md`; adapter Claude/Gemini/skill chỉ trỏ về nguồn này.
- Test có assertion và `npm run verify` bắt buộc sau chỉnh sửa, trước commit/push.
- Blocker/major không được baseline hoặc ngoại lệ cục bộ; thiếu kiểm máy là thất bại.
- Một manifest nối source → screen → state; CI có guard tin cậy chống PR tự hạ checker.
- Motion token, lifecycle/cleanup và primitive trợ năng được hợp nhất trong quy trình 3.0.

### Bổ sung 02/11/2026 — Gia cố sau phản biện đối kháng

- Guard kiểm cấu trúc/lệnh chính xác và có mutation test; PR không thể thay checker bằng echo/no-op rồi tự báo đạt.
- GitHub Actions được pin full commit SHA; `CODEOWNERS` phủ toàn repo.
- Tài liệu tách rõ hai chế độ: nhóm có reviewer độc lập và chủ repo đơn lẻ có rủi ro còn lại.
- Phạm vi cam kết được nói đúng: CI bảo vệ đường merge, không thể ép mọi câu trả lời của mọi agent hoặc khóa quản trị viên GitHub.

### Bổ sung 01/11/2026 — Chọn lọc kiến trúc Animate UI, sửa motion primitive

- `runtime/motion.js`: motion token nội bộ theo vai trò, không thêm dependency.
- `primitives.js`: tab có Arrow/Home/End + roving focus/tabpanel; button hủy timer cũ; dialog đóng được khi animation bị hủy hoặc không kết thúc.
- `stage.js` dùng `createLifecycleCoordinator`, bỏ bản sao Page Visibility/IntersectionObserver.
- `tests/runtime-primitives.test.mjs` dùng assertion thật với Playwright; thêm W19 vào 08/09/12.
- 06/12 ghi rõ phần chọn lọc từ Animate UI và phần không nhập vào dự án Vanilla.

## 2.9 — 30/10/2026 · Xuất DESIGN.md cho Stitch (hiệu lực tạm)

Theo yêu cầu "Làm ưu tiên 2" (`PHAN_TICH_CLAUDE_DESIGN_OPEN_DESIGN_HUASHU.md`). Vòng 2.7 Stitch tự đoán màu nên bản mẫu lệch bảng màu lấy từ ảnh đề tài.

| Thay đổi | Ở đâu |
| --- | --- |
| `scripts/xuat_design_md.mjs`: biến `:root` → `DESIGN.md` (front matter colors/typography/rounded theo định dạng Stitch/open-design; vai trò màu tự ánh xạ từ tên biến hay gặp, `--map` ghi đè; màu khác giữ nguyên tên); mục Do's and Don'ts lấy câu sổ gu phạm vi "Mọi …" | scripts, AGENTS §lệnh |
| `--so-sanh`: so **theo vai trò** màu giữa DESIGN.md của ta và `designMd` Stitch trả về | 12 §5.1 bước 5 |
| Mỗi hướng G2 một DESIGN.md; lệch thì dựng theo token, không theo ảnh Stitch | 12 §5.1, 07 |
| Sửa `audit.mjs` (31/10, m-11 trang Vườn Sớm): ảnh fullPage/zoom200/text-spacing/forced-colors thiếu ảnh `loading="lazy"` ngoài khung nhìn → `loadLazy` ép tải, chờ `decode()` (tối đa 5s) và 500ms vẽ trước khi chụp; không cuộn trang. Chỉ đổi ảnh chụp, không đổi phép đo | scripts |

**Chạy thật (trang du lịch, dự án Stitch "Landing du lịch Việt Nam theo mùa", 30/10/2026):** Stitch nhận đủ nền, chữ, viền, `on-primary`, các màu riêng (`sun`, `sea`, `coral`) và font; **dời** màu nhấn sang `primary-container` (`primary` thành `#ffd898`), **tự sinh** `surface-container*` tông nâu, bo góc YAML thành 0.5rem (văn mô tả vẫn ghi 22px), viết lại phần văn và **bỏ** mục Do's and Don'ts (ý "tránh gradient" còn trong văn của Stitch). Bản so theo tập mã màu đầu tiên báo khớp sai → đổi sang so theo vai trò. Sinh màn qua MCP hỏng 4 lần (quá thời gian) — **31/10 đo được nguyên nhân**: gọi thẳng Stitch xong sau 71 giây, máy khách MCP cắt sớm hơn. Màn gọi thẳng **đúng màu token** (nút #f2b84b), vẫn bịa số liệu → qua bảng gọt (12 §5.1 bước 5).

## 2.8 — 30/10/2026 · Mượn cơ chế huashu-design: file cổng, sổ gu, bảng tham chiếu bằng ảnh (hiệu lực tạm)

Theo yêu cầu "Làm ưu tiên 1" sau báo cáo `PHAN_TICH_CLAUDE_DESIGN_OPEN_DESIGN_HUASHU.md`. Giải hai lỗi lặp của các lần chạy thử 2.4–2.7 mà cả Claude Design lẫn open-design không giải: (a) agent bỏ qua luật đã viết; (e) người dùng phải nhắc lại cùng một gu.

| Thay đổi | Ở đâu |
| --- | --- |
| **File cổng** `design-gates/`: `tham-chieu.md` (≥ 3 trang thật + ảnh ghép), `huong-da-chon.md` (nguyên văn câu chọn), `su-that.md` (sự thật + nguồn); "file không có = bước chưa làm" | 01 §4, AGENTS §3 + luật 16, mẫu `examples/design-gates/` |
| Máy kiểm cổng: `scripts/check_gates.mjs`; `audit.mjs` khoá `gates` → `gate-thieu` (major), tự bật cho trang E2–E3 | scripts, schema |
| **Sổ gu** `GU_NGUOI_DUNG.md`: 11 câu nguyên văn của người dùng trong phiên 29–30/10 kèm phạm vi; đọc đầu mỗi việc, người duyệt đối chiếu như brief | AGENTS luật 16 |
| `scripts/ref_board.mjs`: chụp màn đầu trang tham chiếu, ghép một tấm | 07 §2, 12 §5.5 |
| S-06 "→" đuôi nút, S-07 tô màu một cụm trong tiêu đề, S-08 đánh số 01/02/03 không phải trình tự, S-09 nối "A · B · C" — bậc **tiết chế có liều** (huashu cấm hẳn; ta giữ tinh thần 2.2 "gọt, không triệt tiêu") | 07 §4 |
| Kiểm sự thật trước khi viết (huashu "事实验证先于假设") | AGENTS G0, `su-that.md` |

Không làm (theo báo cáo): cài huashu-design dạng tự kích hoạt (trùng quy trình với skill design-standard, trái luật kho), cài open-design.

## 2.7 — 30/10/2026 · Tham chiếu trước, màu từ đề tài, bộ hiệu ứng dùng lại (hiệu lực tạm)

Người dùng (sau 2.6): "hiệu ứng hình ảnh 3d, di chuột vẫn còn đơn điệu, chưa đủ ấn tượng, hiệu ứng còn thô quá, màu sắc các trang vẫn còn đơn điệu, chưa phù hợp với đề tài".

Nguyên nhân gốc:
1. **Agent bỏ qua luật đã có:** 2.5 bắt buộc bảng tham chiếu ≥ 3 trang thật cho E2–E3, nhưng không có cổng nào chặn khi thiếu → agent tự đoán hiệu ứng ba vòng liền.
2. **Màu chọn theo cảm tính**, không lấy từ đề tài: trang du lịch tím đêm trong khi ảnh là xanh rừng, xanh biển, vàng lúa, đỏ đèn lồng.
3. **Hiệu ứng tự chế từng trang**, chất lượng thấp hơn kỹ thuật đã được kiểm chứng (Codrops: ảnh biến dạng theo con trỏ; gradient lưới động; SplitText).
4. **Lỗi mới do hiệu ứng:** `gsap.from` + ScrollTrigger kẹt lưới thẻ trang du lịch ở opacity 0 (nội dung mất) — máy kiểm không bắt vì đo trạng thái đầu.

| Thay đổi | Ở đâu |
| --- | --- |
| Bảng tham chiếu làm trước khi sinh bản mẫu; thiếu = T13 trượt | 07 §2, §7 |
| Màu theo đề tài: `scripts/bang_mau.mjs` rút bảng màu từ ảnh | 04 §3, 12 §5.5, script mới |
| Bộ hiệu ứng dùng lại `landing_3d/src/shared/fx.js` (gradient lưới, ảnh biến dạng, con trỏ, tiêu đề theo dòng); hiện dần bằng IntersectionObserver | 06 §6 |
| AGENTS: tóm tắt 2.7 | AGENTS |

Bảng tham chiếu vòng này: Codrops "Motion hover effects with image distortions" (2019) và "Interactive WebGL hover effects" (2020); Awwwards L'Occitane "Seeds of Dreams", Koba Skincare (bảng màu xanh xô thơm–tím nhạt); bài phân tích trang du lịch immersive (WebGL phục vụ cảm giác nơi chốn, không làm hỏng ảnh gốc). Bảng màu từ ảnh: du lịch #304a3b · #55a8cc · #bd8238 · #71260c; mỹ phẩm sứ #e6ded9 + hồng #c62c53; CareAI caramel #a88462 · xô thơm #929d99 · bạc hà #c6d1d1.

**Sửa sau phản hồi cùng ngày** ("đừng làm kiểu nền mờ… di chuột vào thì ảnh giật giật hoặc mất ảnh… hiệu ứng chữ có nên lặp lại không") và duyệt G5 vòng 3 (ds Đạt; mỹ phẩm Đạt có điều kiện; CareAI khối đen khi rê ảnh `srcset`): bỏ nền gradient lưới mờ và tách kênh RGB; luật kỹ thuật cho ảnh hiệu ứng, cảnh 3D thẻ ảnh, chữ hiện dần một lần — 06 §6.

Còn hở: máy chưa kiểm "nội dung hiện đủ sau khi cuộn" (lỗi opacity 0 chỉ thấy bằng mắt/script riêng) — đề xuất thêm bước cuộn hết trang + đo phần tử opacity 0 vào `audit.mjs` ở bản sau.

## 2.6 — 30/10/2026 · Độ động và độ phong phú màu cho trang E3 (hiệu lực tạm)

Người dùng (sau vòng 2.5): "cần hiệu ứng 3D động hơn nữa, màu sắc vẫn còn hơi đơn điệu, làm thêm 1 trang về chủ đề du lịch, xem xét lại tool và quy trình". Người duyệt G5 độc lập (`audit_out/landing_3d/DUYET_G5.md`): cả 3 trang Không đạt, 0 blocker · 9 major — T13 (cảnh 3D kém bản mẫu), T4 (mất quyết định đặc trưng "kệ xoay theo loại da" khi thay bằng ảnh), G2-09d (nút "Đọc AGENTS.md" chỉ cuộn; SOS gán đếm ngược 30 s), G2-12 (ảnh "COSMETIC MOCKUP"), bàn phím (GSAP `autoAlpha` ẩn nút khỏi Tab).

Nguyên nhân gốc:
1. **Màu đơn điệu do chuẩn thưởng "một màu nhấn"** (04 §3: màu nhấn chỉ cho hành động; 07: gradient, glow, nền kem đều ở bậc tiết chế; impeccable báo "cream-palette") — không có yêu cầu tối thiểu cho trang biểu cảm, nên E3 mang bảng màu của E1.
2. **3D tĩnh do 06 chỉ đặt giới hạn** (hiệu năng, giảm chuyển động, "chỉ khi giúp hiểu") mà không đặt mức tối thiểu về phản hồi.
3. **G2 trình bằng ảnh tĩnh** → người duyệt và người dùng không thấy chuyển động trước khi dựng trọn.
4. **Thay thứ thô bằng ảnh đã làm mất quyết định đặc trưng** (luật "bớt phải thay" chưa áp cho quyết định đặc trưng khi đổi kỹ thuật).
5. **Chưa kiểm từng ảnh lấy về** (chữ mockup in trên ảnh).

| Thay đổi | Ở đâu |
| --- | --- |
| Bảng màu E2–E3: ≥ 1 màu nhấn phụ lệch ≥ 60° + dải màu thương hiệu | 04 §3 |
| Cảnh 3D E3 phản hồi ≥ 2 kiểu; mẫu dùng lại `landing_3d/src/shared/` (gallery3d, stage, scroll, tilt) | 06 §6 |
| T13 chấm thêm độ động và màu | 07 §7 |
| G2 trang E3 trình bản chạy được | AGENTS §3 |
| Kiểm từng ảnh (chữ mockup), CORS cho texture; tham chiếu chuyển động (GSAP showcase, Codrops, Awwwards) | 12 §5.5 |

Áp ngay: sửa 9 major G5 (trừ 2 chờ PO); vòng ảnh 3D `gallery3d.js` cho hero mỹ phẩm (khôi phục quyết định đặc trưng theo loại da) và trang mới **du lịch "Việt Nam theo mùa"** (`landing_3d/dulich.html`: chọn tháng → vòng ảnh quay tới điểm đến đang vào mùa); design_standard thêm hạt sáng, ánh xanh ngọc, nghiêng theo con trỏ; CareAI máy quay theo con trỏ, quầng nắng. Trang du lịch dựng thẳng (không dừng G2) theo yêu cầu "làm thêm 1 trang" — ghi là sai khác quy trình.

## 2.5 — 30/10/2026 · Tài nguyên thật, ánh sáng, chuyển cảnh (hiệu lực tạm)

Người dùng xem 3 landing E3 dựng theo 2.4 (`landing_3d/`) và nhận xét (nguyên văn ý): "UI, UX chưa đủ ấn tượng, màu sắc, hiệu ứng, chuyển cảnh, hình ảnh còn quá thô, nên lấy hình ảnh trên mạng thay vì tự tạo nếu tự tạo quá thô, xem xét lại quy trình, tool".

Nguyên nhân gốc (quy trình, không chỉ tay nghề):
1. **Mọi hình ảnh do agent tự dựng bằng mã** (chai lọ ghép từ hình cơ bản, khối đá nhiễu, SVG) — 04 §6 + G2-13 + D-02 cấm ảnh stock có người và không chỉ ra nguồn tài nguyên thật, nên con đường "an toàn" là tự vẽ — và tay nghề vẽ bằng mã thấp hơn ảnh thật.
2. **Không phép thử nào so độ hoàn thiện với bản mẫu**: ảnh hero của Stitch (đá vỡ thành tinh thể, thiết bị trên bệ) đẹp hơn bản dựng, nhưng T12 chỉ xét phân cấp/điểm nhấn/độ ấm trên ảnh mờ.
3. **3D không có ánh sáng môi trường** → vật liệu như nhựa; chuẩn 06 §6 chỉ nói hiệu năng và trợ năng, không nói chất lượng hình.
4. **Chuyển cảnh**: chuẩn nhấn giới hạn (S-04, giảm chuyển động) mà không nói mức tối thiểu cho E3 → chỉ có CSS transition.
5. **Thước đo "ấn tượng" là bản mẫu AI**, không có trang thật làm tham chiếu.

| Thay đổi | Ở đâu |
| --- | --- |
| T13 "Độ hoàn thiện hình ảnh" — cổng cứng E2–E3: không kém bản mẫu về ảnh, ánh sáng, màu, chuyển cảnh | 07 §7 |
| Tài nguyên thật trước đồ tự dựng; bảng tài nguyên + ghi công; tải về phải hỏi | 04 §6, 10 §2, AGENTS luật 15 |
| Nguồn: Unsplash/Pexels (nhúng CDN), Poly Haven CC0 (HDRI, mô hình quét), Sketchfab CC-BY | 12 §5.5 |
| D-02 nới: ảnh stock có người được dùng làm ảnh minh hoạ có chú thích, cấm khi trình bày như khách thật | 07 §4, 04 §6 |
| 3D: bắt buộc HDRI + vật liệu vật lý; vật thể thật ưu tiên mô hình quét; chỉ "trông có chiều sâu" thì dùng ảnh + CSS perspective | 06 §6 |
| E2–E3: ≥ 1 chuyển cảnh theo cuộn gắn nội dung (GSAP ScrollTrigger) | 06 §4 |
| E2–E3: bảng tham chiếu ≥ 3 trang thật cùng loại | 07 §2 bước 1 |

Áp ngay vào `landing_3d/`: đá quét moon_rock_03 + HDRI studio cho cảnh "gọt"; ảnh Unsplash (tượng lộ ra từ đá, ảnh bao bì, ảnh người cao tuổi có chú thích); thiết bị CareAI phản chiếu HDRI; GSAP ScrollTrigger (thẻ hiện dần, ảnh toàn khổ phóng theo cuộn); chiều sâu CSS theo con trỏ. Kết quả: `audit_out/landing_3d/THIET_KE.md` mục "Vòng 2.5".

## 2.4 — 30/10/2026 · Bài học chạy thử 2.3 (hiệu lực tạm)

Theo yêu cầu người dùng "Làm bản 2.4": 7 bài học từ lần chạy thử 2.3 (trang "Chi tiết sản phẩm").

| Bài học | Đã đưa vào |
| --- | --- |
| 1. Mỗi đường quay về phải có `expectFocus` | 03 bảng trạng thái: dòng "Mỗi đường quay về", `expectFocus` cho Back, mọi state có `steps` (trừ dialog) phải có `expectFocus`; 04 §10 quy tắc focus 1 (mọi đường quay về, kể cả trang con của trang con); `audit.mjs` luật mới `state-thieu-expectFocus` (major, kiểm ở config); schema |
| 2. Bảng vai trò khối đối chiếu ảnh làm mờ sau khi dựng | 07 §2 bước 4, T3; 10 §2 cột "Ở ảnh mờ bản đã dựng"; `audit.mjs` tự xuất `*_T3-blur8.png` (trạng thái đầu, 320 và 1440, sáng) |
| 3. G2-09d phủ nhãn hành động | 07 §4 G2-09d; 05 §1 nhãn nút; 03 `detail` Tránh |
| 4. Mã treo sau khi đổi 07 | 03 `detail`: S-02 → G2-16; `scripts/check_codes.mjs` (mã thoát 1 khi có mã không có trong 07 §4); 07 §8 |
| 5. Bản mẫu cùng loại trang | 07 §2 bước 1, T12; 01 chặng 2; 10 §2 dòng "Bản mẫu nguồn"; AGENTS luật 11 |
| 6. Vùng chạm trong component dùng chung | 04 §10; AGENTS luật 14 |
| 7. Sửa bộ định tuyến → chạy lại toàn bộ | 01 §4 "Chạy lại sau khi sửa"; 03; 11 §6; AGENTS luật 14 |

Khác: phiên bản 2.4 ở AGENTS (thêm luật 14, §5 dòng M, §6 lệnh `check_codes`), README, 02, schema, `audit.mjs`, skill (2 bản), AGENTS/GEMINI gốc kho; 08 §5 dòng M.

**Thử máy 2.4 trên bản Chi tiết (chưa sửa, `audit_out/lab02/v8_chi_tiet/kiem_24`, `kiem_24b`):** config cũ → `state-thieu-expectFocus` ở 2 state (`sua-roi-back`, `xem-danh-muc-roi-back`). Bổ sung `expectFocus` + state "sửa rồi bấm link quay về" (`design.config.24.json`) → máy bắt **major M1 của người duyệt** ở cả Back và link quay về, và thêm một lỗi cùng loại ở "Tổng quan" (Back về focus tiêu đề, không về nút danh mục đã mở). Ảnh `chi-tiet_1440_light_T3-blur8.png` cho thấy đúng M2 (tiêu đề và nút Sửa nổi hơn khối giá). Một `resource-error` (Google Fonts `ERR_NETWORK_CHANGED`) là mạng chập chờn, không thuộc trang.

Máy vẫn không bắt được: M3 (T12 phẳng hơn mẫu) và M4 (nhãn sai thao tác) — người duyệt kết luận.

**Chưa làm:** người thật duyệt 2.2–2.4; sửa 4 major trang Chi tiết + lỗi focus Back của Tổng quan; chạy thử 2.4 trên màn mới.

## 2.3 — 29/10/2026 · Đưa bài học dùng thật vào chuẩn (hiệu lực tạm)

Theo yêu cầu người dùng "Đưa bài học vào 2.3": 5 bài học từ lần chạy thử 2.2 (trang "Tổng quan") + 4 bài học 2.1 còn lại.

| Bài học | Đã đưa vào |
| --- | --- |
| Bảng gọt chấm cả **vai trò khối**, "bớt phải thay" áp cho chức năng và điểm nhấn | 07 §2 bước 2, luật "bớt phải thay"; 10 §2 bảng "Khối của bản mẫu"; AGENTS luật 13 |
| Đối chiếu "Bắt buộc"/"Kiểm riêng" của 03 ngay ở chặng 1; mỗi khối gắn một tác vụ | 01 chặng 1; AGENTS G1, §5 dòng M |
| **Trạng thái tương tác bắt buộc** (đang gửi, lỗi sau gửi, đổi ngữ cảnh khi chưa lưu, thành công, đi rồi quay lại, link trực tiếp, độ rộng giữa 1024/1280) | 03 mục mới "Trạng thái tương tác bắt buộc" (kèm cách khai báo `states`); 01 chặng 1 |
| Bước **Back/Forward** và kiểm URL khớp nội dung | `audit.mjs`: action `back`, `forward`; khoá state `expectUrl` → `url-after-action`; schema. Đã thử trên bản "Tổng quan": lỗi Back của người duyệt được máy bắt (not-ready, blocker) — `audit_out/lab02/v7_tong_quan/thu_back2` |
| **Quy tắc focus** dùng lại (6 điều) | 04 §10 |
| **Vùng chạm theo `input`** + mẫu lớp `h-11 lg:h-9 coarse:h-11` | 04 §10 |
| **Bọc storage/history/hash** cho khung xem trước, chế độ riêng tư | 04 §10 |
| **Thử trong đúng khung người nhận xem** | 08 §4 gói bàn giao |
| **Không suy diễn quá dữ liệu** | 07 §4 bậc cấm G2-09d |
| **Duyệt lại bằng cùng người duyệt** + **điều kiện dừng** vòng sửa | 01 §4; 11 §6 |

Khác: 03 bảng "Mức mặc định" khớp 2.2 (hạng B/C hằng ngày: E1); phiên bản 2.3 ở AGENTS, README, 02, schema, `audit.mjs`, skill (2 bản), AGENTS/GEMINI gốc kho.

Lưu ý dùng `audit.mjs`: `--quick` bỏ toàn bộ `states` — kiểm trạng thái tương tác phải chạy đủ.

**Chạy thử 2.3 trên màn mới "Chi tiết sản phẩm" (`audit_out/lab02/v8_chi_tiet`):** máy lần đầu 3/18/4 → sau sửa 0/0/4 (font trong liều); người duyệt lần đầu **0 blocker · 4 major · 11 minor** (2.2 trên "Tổng quan": 0/5/9). Bảng trạng thái tương tác + bước `back` bắt và phòng được gần hết lỗi điều hướng; còn hở. Bài học cho 2.4 (chưa sửa vào chuẩn):
1. **Mỗi state "quay về" phải có `expectFocus`** (không chỉ `expectUrl`) — 03 bảng trạng thái nên ghi bắt buộc; `audit.mjs` có thể cảnh báo state có bước `back`/link quay lại mà thiếu `expectFocus`.
2. **Bảng vai trò khối phải đối chiếu với ảnh làm mờ** sau khi dựng (T3/T12 trên giao diện, không trên giấy): điểm nhấn đã ghi trong bảng phải là thứ nổi nhất ở ảnh mờ.
3. **G2-09d phủ cả nhãn hành động**: tên nút/tiêu đề phải đúng thao tác thật ("Ngừng bán" ≠ xoá cứng).
4. **Tham chiếu mã đã bỏ:** 03 `detail` "Tránh: S-02" trỏ mã đã gộp vào G2-16 ở 2.2 — rà mọi mã trong 03 khi đổi 07.
5. **Bản mẫu thay thế khác loại trang** làm T12 khó so → khi công cụ sinh hỏng, dựng nhanh một bản mẫu đúng loại trang (agent + thư viện) thay vì mượn màn khác loại.
6. Người làm vẫn **quên áp quy tắc vừa viết** (vùng chạm cho link mới) — cần mẫu component dùng chung (link/nút có sẵn lớp vùng chạm) thay vì nhớ lớp CSS.
7. Sửa lỗi điều hướng tạo lỗi mới (popstate đồng bộ) — mọi thay đổi bộ định tuyến phải chạy lại toàn bộ bộ thử luồng cũ.

**Chưa làm:** người thật duyệt 2.2–2.3; sửa 4 major của trang Chi tiết; đưa 7 bài học trên vào 2.4.

## 2.2 — 29/10/2026 · "Sinh trước, gọt sau" (hiệu lực tạm)

Lý do (người dùng, nguyên văn ý): tool và quy trình "gần như loại bỏ mọi UI, UX gợi nét AI làm UI, UX quá thô… cần định ra quy tắc mới hoặc giảm lỏng quy tắc cũ, ứng dụng nhiều hơn skill, tool, MCP tạo UI để tạo bản thiết kế mẫu rồi lược bớt các nét AI quá lố… chỉ lược bớt chứ không triệt tiêu hoàn toàn". Bằng chứng: dùng thật Lab02 (mục "Dùng thật tiếp" ở 2.1, bài học 3, 4, 7, 10).

**Đổi triết lý (07 viết lại):**
- Dấu hiệu chia **ba bậc**: *cấm* (gian dối, hại đọc, lộ kỹ thuật — luôn bỏ, major), *tiết chế* (gradient, kính mờ, bento, eyebrow, card lồng, font phổ biến, thư viện để nguyên… — giữ được **trong liều**, vượt liều không lý do là minor, ≥ 3 vượt liều là major), *tự do* (bo góc mềm, pill, nhãn màu nhạt, bóng mềm cho khối nổi, toast, chuyển cảnh nhẹ, nền ngả tông nhẹ… — không cần lý do).
- Quy trình **sinh → chấm → gọt → dựng** (07 §2): ≥ 2 bản mẫu bằng công cụ sinh; **bảng gọt** (10 §2) với ≥ 3 "điểm tốt giữ lại"; luật **"bớt phải thay"**; bước **dò mặc định** (so với bản mẫu thô).
- Phép thử mới **T12 "không gọt quá tay"**; T10 đổi thành "liều lượng"; T1 chỉ là cổng cứng ở E2–E3; T8 chỉ áp cho chi tiết vượt liều.
- Lý do hợp lệ thêm: **PO chọn giữa ≥ 2 hướng có ảnh**; hệ thiết kế lớn đang dùng rộng (Material 3, Apple HIG, Fluent 2, mẫu hành vi Radix/shadcn) cho cấu trúc, hành vi, chi tiết thân thiện.
- Vân tay: làn L/Khởi tạo khác **DF gần nhất** ≥ 2/6 **hoặc** có quyết định đặc trưng (trước: khác mọi DF ≥ 3/6); thêm **DF-7** (xô thơm + đất nung + nền ngà + Plus Jakarta Sans, từ lần chạy Stitch). Làn M bỏ "kiểm vân tay M", dùng dò mặc định + T10.
- Mức mặc định: màn tác vụ hạng B/C dùng hằng ngày → **E1** (02 §2, AGENTS §1).

**File khác:** AGENTS (luật 3, 4, 5, 11 viết lại; luật 13 "bớt phải thay"; G1 hỏi người dùng với quyết định kiến trúc thông tin lớn; G2 hai hướng khác ≥ 2 trong {màu nhấn, font, bề mặt, bố cục}), 01 chặng 2, 02 §2, 04 §11, 08 §2 §5, 10 §2 (bảng gọt), 11 §4 b2 §10 (thêm tiêu chí "cảm giác thị giác"), 12 (§0 nguyên tắc 2, kiểm kê Stitch/ui-ux-pro-max, §2, §3, §5.1 Stitch là nguồn bản mẫu + máy dò mặc định, §5.2 shadcn giữ chi tiết thân thiện), FINGERPRINTS, README, schema, `audit.mjs` (phiên bản 2.2; W17: mã bậc cấm → major, còn lại minor "xét liều"), skill `design-standard` (cả `.claude` và `.agents`), AGENTS/GEMINI ở gốc kho. Tham chiếu "07 §n" ở các file đang dùng đã đổi theo số mục mới (§2→§3 lý do, §3→§4 danh mục, §4→§7 phép thử, §7→§8 máy); file lịch sử (CHANGELOG, DANH_GIA…, examples) giữ số cũ.

**Sửa sau phản biện độc lập (cùng ngày, 2 blocker + 17 major + 7 minor):**
- Đồng bộ các file còn giữ luật 2.1: 08 W17 (bỏ "danh sách E0", "T10 = 0" → bậc cấm Major/Blocker hạng A, tiết chế xét liều), 11 lớp 3 và nhóm b (bỏ "trượt bất kỳ → sửa"), 11 §10 T8 (giảm về liều, không bỏ trắng), 03 ("Tránh" = có mặt với mã cấm, vượt liều với mã tiết chế), 04 §11/§7 (badge cho phân loại; card nền sáng ở E1+; nhóm biểu đồ trong card), 12 §3 lớp 3 và §5.4 (`overused-font` ở E0–E1 là trong liều), 01/09 (shadcn giữ chi tiết thân thiện, anchor mới), 10 §7 lệnh duyệt, 02 cấu hình mẫu 2.2.
- Bịt lỗ cho slop quay lại: "PO chọn hướng" chỉ là lý do cho màu, font, bề mặt (thứ vượt liều khác phải nằm trong bảng gọt và ảnh PO đã xem); làn L cần đặc trưng **và** khác DF ≥ 2/6; bậc cấm thêm chấm "trực tiếp" giả, tia lấp lánh giả (G2-07g, G2-08g), dark pattern (D-01), ảnh stock "người dùng" (D-02).
- Chỉnh bậc: G1-03 glow chuyển sang tiết chế (1 thành phần, E2–E3); liều đo được hơn (gradient ≤ 1 nền + ≤ 3 điểm nhấn, lệch tông ≤ 60°; kính mờ ≤ 2 lớp; bento ≤ 6 ô; ≤ 1 kiểu viền; G2-01 bo góc khác ≥ 1 bậc); bỏ S-02 (trùng G2-16); bậc tự do thêm card nền sáng cho nhóm có ý nghĩa.
- T12 trượt = Major (không chờ phàn nàn); "dò mặc định" so với bản sinh **không ràng buộc**, không so với bản mẫu nguồn; E1 không áp checklist 04 §11 (thay bằng tiêu chí cảm giác thị giác).
- Giảm giấy tờ: một bảng gọt cho mỗi hướng; E0–E1 làn M một bản mẫu là đủ; không dùng được Stitch thì dùng shadcn/ui-ux-pro-max/agent, ghi lý do.
- `audit.mjs`: mọi W17 giữ Minor; mã bậc cấm chỉ gắn nhãn "người duyệt xác nhận" (luật impeccable dễ báo nhầm). Chạy thật trên bản Lab02: 0/0/1, `overused-font` hiện là "bậc tiết chế, trong liều thì giữ" (`audit_out/lab02/v6_e1/kiem_22`).

**Chạy thử 2.2 trên màn mới (trang "Tổng quan", `audit_out/lab02/v7_tong_quan`):** máy lần đầu 0/13/1 (vùng chạm), sau 1 vòng 0/0/1; người duyệt lần đầu **0 blocker · 5 major · 9 minor** — cổng chống slop (T7, T9, T10, T12) đạt ngay; **chưa đạt** "đúng trong một lần". Bài học cho 2.3 (chưa sửa vào chuẩn):
1. **Bảng gọt phải chấm cả vai trò của khối, không chỉ dấu hiệu:** bỏ khối cảnh báo của bản mẫu mà không thay → mất điểm nhấn, T3 trượt. Thêm cột "khối này làm gì / điểm nhấn" và luật "bớt phải thay" áp cho **chức năng**, không chỉ trang trí.
2. **Đối chiếu "Bắt buộc" của 03 ngay ở chặng 1** (dashboard: việc cần xử lý trước số tổng hợp, mọi con số bấm được, mỗi khối gắn tác vụ) — 3/5 major là mục 03 bỏ sót lúc dựng.
3. **`audit.mjs` cần bước `back`** (Back trình duyệt) trong `steps`, và config mẫu nên có state "đi rồi quay lại" cho mọi điều hướng.
4. **Vùng chạm theo `input`**: mẫu lớp chung (`h-11 lg:h-9 coarse:h-11`) để không quên lần nữa.
5. **Không suy diễn quá dữ liệu** (T6/G2-09): câu gợi ý hành động phải dẫn từ trường có thật; trường còn chờ PO (PAO) thì nói đúng nghĩa trường.

**Chưa làm (bài học 2.1 còn lại):** danh sách trạng thái tương tác bắt buộc cho form/trang sửa (bài học 1), mẫu + phép thử focus dùng lại (2), cùng người duyệt cho vòng kiểm lại + điều kiện dừng (5), thử trong đúng khung người dùng xem (9). Chưa chạy thử quy trình 2.2 trên màn hình mới.

## 2.1 — 29/10/2026

Đánh giá lại toàn bộ 2.0 theo yêu cầu người dùng: 4 agent phản biện độc lập song song (chạy thử luồng thiết kế mới trên một ví dụ phòng khám nha; chạy thử luồng 11 trên Lab02; rà mã vòng 2; soát nhất quán tài liệu) — 7 blocker, khoảng 40 major; đã kiểm từng điểm rồi sửa. Sau đó một vòng phản biện nữa trên phần đã sửa. Chưa có người thật duyệt: 11, 12 mang nhãn "hiệu lực tạm".

Về số phiên bản: theo README ("Cập nhật bộ chuẩn"), đổi ngưỡng (T10 ở E2–E3, danh sách E0) lẽ ra tăng số chính. 2.0 mới soạn cùng ngày, chưa dự án thật nào áp dụng và chưa được duyệt, nên gộp vào 2.x; config ghi `@2.0` vẫn dùng được. Người duyệt quyết có đổi thành 3.0 không (sổ, D12).

**Quy trình**
- Khởi tạo là **bước mở đầu**, không phải làn: làm sau chặng 0–1, rồi đi tiếp làn L/M; xong khi đủ cả dòng Khởi tạo và dòng của làn (trước đây có thể "xong" ngay ở G2).
- G2 khi sản phẩm có cả màn hình E0 và E2–E3: mỗi hướng gồm một màn E2–E3 + một khối E0; T4 chỉ xét phần E2–E3. Hướng được là trang mẫu ghép; hạng B/C được trình G0 + G1 một lần.
- Hạng: màn hình có dữ liệu sức khoẻ, định danh, tiền → hỏi PO ở G0, không tự giả định. Màn hình khớp hai loại trang → áp hợp các mục bắt buộc.
- 07: định nghĩa "khác" chặt hơn (font = cả cặp; màu nhấn chỉ tính lệch tông > 30°; thêm nhóm cho chiều Đặc trưng; chiều trống không tính; người duyệt được đánh trượt khi nhìn ra "cùng họ" dù đếm đủ). Phạm vi: L/Khởi tạo ≥ 3/6 với mỗi DF; màn hình mới làn M "kiểm vân tay M"; E0 dùng danh sách T10 mở rộng (thêm G2-04, G2-05, G2-08, G2-16, G2-17, S-01, S-03 và mọi mã máy báo), vì màn hình bảng dày luôn "khác" DF khi đếm chiều. T10: E2–E3 = 0 dấu hiệu không lý do. G1-01 mở rộng thành mọi gradient nhiều màu làm nền lớn. Quy ước ngành phải có nguồn có thẩm quyền; qua chuỗi kiểm dấu tiếng Việt chỉ là điều kiện cần.
- 08: lỗi ngôn ngữ (tìm kiếm/sắp xếp tiếng Việt, locale, Title Case) và nhãn sai sự thật là Major; "thiếu chức năng" không chặn xong; W12 ghi rõ Lighthouse không đo INP; ngoại lệ không che được lỗi trang hỏng và blocker hạng A; người làm đối chiếu trạng thái của 03 với `states`.
- 11: ô "Token" xét theo họ màu (indigo-600 của Tailwind là mặc định, không phải "token dự án"); thêm giá trị "lai"; b1 có mức tối thiểu; b2 phải khác hiện trạng ở ≥ 2 trong {họ màu nhấn, mô hình bề mặt, font, bố cục}; ảnh làm mờ T3 trước/sau; trạng thái = toàn bộ danh sách của 03 + mọi dialog trong mã; người duyệt nhận tờ ảnh ghép, hai giai đoạn có file kết luận trước báo cáo máy; §9 lịch sử chuyển sang CHANGELOG; §10 thêm INP, phản hồi thao tác, trạng thái đồng bộ/xung đột.
- 04 §11: 12/13px chỉ cho chú thích; thêm mật độ cho người dùng cả ngày. 10: thẻ hướng thêm dòng Mở đầu, Đặc trưng; brief có cột ngôn ngữ, con trỏ; biên bản ghi đầu vào của người duyệt, giờ commit/duyệt, người nghiệp vụ hạng A.
- README có bảng "Bắt đầu từ đâu"; skill `design-standard`, `AGENTS.md`/`GEMINI.md` gốc trỏ 2.x và tới 11/12.

**Công cụ**
- `audit.mjs`: ngoại lệ không áp cho lỗi trang hỏng/blocker hạng A; lỗi thiết lập (JSON hỏng, thiếu Chromium) → mã 2; thiếu axe → mã 2 (trừ `--allow-no-axe`); kiểm Playwright ≥ 1.51; khoá config gõ sai → mã 2; router hash; impeccable ghim 4.8.0, chạy thử một lần, hỏng thì tắt cả lượt, `--quick` không chạy trừ khi gõ `--impeccable`; Tab qua iframe/shadow DOM không bị báo kẹt; cảnh báo theme tối giống theme sáng; baseline rỗng không được tăng; không tạo baseline khi trang hỏng (mã 1); `*-load` không vào baseline; cùng nguyên nhân ở nhiều trạng thái gộp về trạng thái đầu; URL tài nguyên bỏ query; ghi đè thì xoá ảnh cũ; `statesRun` ghi đúng trạng thái đã chạy; cảnh báo lệch phiên bản config.
- `install_hooks.mjs`: thiếu `prepush.mjs` thì in cảnh báo; thay/gỡ đúng dòng cũ của dự án. CI: sẵn sàng khi HTTP < 500 như prepush, ghi `audit_out/ci`, thêm `--impeccable`. Schema: chặn khoá lạ.
- Mẫu Flutter: ghi chú vòng xoay vô hạn, theme tối cần `darkTheme`; bộ quét ghi chú miễn trừ điều khiển vô hiệu.

**Vòng phản biện 2 (trên phần đã sửa)** tìm thêm và đã sửa: blocker hạng A vẫn vào được baseline qua `--allow-grow` (nay luôn tính là mới, `--update-baseline` từ chối mã 2); web component dùng shadow DOM bị bỏ kiểm focus (nay đi xuống phần tử thật, iframe/media ghi "Chưa kiểm"); bảng DF chưa phân nhóm (nay có bảng phân nhóm + dải tông OKLCH, minh hoạ phẳng/AI/3D cùng một nhóm); tham chiếu tự chọn rơi vào DF không còn là lý do; "kiểm vân tay M" chỉ đếm 4 chiều của màn hình vì font/màu kế thừa từ hệ thiết kế đã qua G2 là có lý do; màn hình tác vụ E1 dùng danh sách E0; màu thương hiệu PO xác nhận được dùng trong b2; W17 ghi Major cho mọi mã danh sách E0 đã xác nhận; G4 theo quy tắc chạy lệnh của kho; khoá lạ trong `route`/`steps` → mã 2; hướng dẫn CI cho màn hình cần đăng nhập và cách tạo baseline.

**Giới hạn còn lại:** gộp cùng nguyên nhân về trạng thái đầu làm ID của trạng thái khác đổi khi lỗi ở trạng thái đầu được sửa (có thể hiện lại thành "mới" một lần).

**Đã chạy thật:** rang-moc 0/0/0 (không hồi quy); Lab02 fixture kết quả như 2.0 (1/13/1); 3 ca sai cố ý: khoá gõ sai → mã 2, ngoại lệ che `not-ready` bị bỏ qua, `--update-baseline` khi trang hỏng → mã 1 và không tạo baseline.

**Lần dùng thật đầu tiên của 11 (29/10, Lab02, `audit_out/lab02/v21/`)** — chạy trọn §1–§4 tới cổng chọn phạm vi, người duyệt độc lập hai giai đoạn (giai đoạn 1 lưu file có giờ trước khi nhận báo cáo máy). Chỗ vướng và cách xử lý:
- Không giả lập được API chậm → thêm `delayMs` cho `route` (schema + script).
- Không giả lập được "tải lại" (phản hồi khác nhau theo lần gọi) → "Chưa kiểm"; cần `route` theo lượt.
- `ready` của state vừa là chờ vừa là khẳng định: tìm không dấu thất bại thành blocker `not-ready` thay vì phát hiện ngôn ngữ → người làm và người duyệt phân loại lại tay (Major). Nên có `expect` riêng.
- Chưa có script rút cặp màu từ biến CSS → viết tạm `rut_token.mjs` (đưa vào bộ chuẩn ở lần sau).
- "Tờ ảnh ghép" chưa có công cụ → người duyệt nhận thư mục ảnh.
- impeccable `icon-tile-stack` gán G2-04 là nhầm khi ô icon nằm trên tiêu đề dialog (người duyệt chỉ ra) → bảng mã sửa thành "gần G2-04, người duyệt xếp mã".
- Kết quả: lần chạy đủ trạng thái báo 7/30/5 (bản 2.0 chỉ trạng thái đầu: 1/13/1); người duyệt độc lập kết luận 4/17/7 "Không đạt", khớp các nguyên nhân chính của người làm và thêm vài điểm người làm bỏ sót (giá điền sẵn, định dạng số, "Xoá"/"Xóa").

**Lần dùng thật trọn vòng (§4 → §8, cùng ngày):** PO chọn a + b1 + b2. Sau 3 vòng sửa: máy 0/0/0 (từ 7/30/5), token 0/26 trượt, nhưng người duyệt độc lập mới vẫn kết luận **Không đạt** (10 major, 8 minor) — máy không bắt được mục nào. Bài học cho bộ chuẩn:
- Trạng thái **sau thao tác** (xoá/lưu/đăng nhập thành công, đăng nhập lỗi mạng, thông báo tự ẩn) chưa có trong danh sách 11 §3; focus mất sau khi phần tử mở dialog bị gỡ là lỗi phổ biến. Nên thêm vào 03 "Kiểm riêng" và `states` mẫu.
- Lỗi xử lý dữ liệu theo locale (giá "1.250,00", NFC) nằm ngoài tầm máy: cần dòng kiểm tay "nhập dữ liệu kiểu Việt Nam" trong 08 §3.
- `internalTerms` không đọc `<head>` (`<title>`, `meta`).
- 3 vòng của 11 §6 là vòng máy; nhận xét của người duyệt đến **sau** vòng 3 nên không còn vòng sửa. Nên cho người duyệt xem trước vòng 3, hoặc tính vòng theo kết luận người duyệt.

**Vòng 4 (PO cho phép vượt 11 §6):** sửa hết 18 mục vòng 3; máy 0/0/0 trên 20 trạng thái, nhưng người duyệt mới vẫn **Không đạt** (9 major) — lần thứ hai máy sạch mà người duyệt trượt. Bài học:
- Thêm `expectFocus` (states) — phải là selector **CSS** (`matches()`), không phải selector Playwright.
- Fixture tĩnh không kiểm được "sau khi xoá thật": GET lần 2 vẫn trả dòng đã xoá nên focus vẫn có chỗ về. Cần route theo lượt gọi (D16).
- Dialog căn giữa dọc (`items-center`) bị cắt phần trên ở 320px mà axe/DOM không báo; cần kiểm lớp phủ cuộn được (D16). Thông báo đẩy bố cục khi tự ẩn: cần đo dịch bố cục sau thời gian chờ.
- Lỗi nghiệp vụ (giá trị mặc định ngầm khi bỏ trống, phân loại lỗi tải dữ liệu theo status, căn số) chỉ người duyệt bắt được → giữ người duyệt độc lập là bắt buộc, không thay bằng máy.

**Dùng thật tiếp (v5 bố cục → v6 E1 → áp vào Lab02, 29/10/2026)** — tổng: 4 vòng v21 + 3 vòng v5 + 4 vòng v6, mỗi lần duyệt độc lập mới đều ra major mới, máy luôn 0/0/0. Bộ chuẩn **chưa** chứng minh được "thiết kế + debug ổn trong một lần". Bài học (chưa sửa vào các file chuẩn — chờ duyệt):
1. **Máy chỉ đo trạng thái đã khai báo.** Major đến từ trạng thái chưa khai báo: đang gửi, lỗi sau khi gửi, đổi ngữ cảnh khi đang gửi, 1024–1279px, `pointer: coarse`, Back trình duyệt. → Cần danh sách trạng thái tương tác **bắt buộc** cho mọi form/ngăn/trang sửa trong 03, và thêm 1024/1280 vào ma trận khi có bố cục đổi theo độ rộng.
2. **Focus là lớp lỗi lặp nhiều nhất** (8 lần qua các vòng: sau xoá, khi `disabled`, sau lỗi, khi đổi trang, trả về phần tử đã bị gỡ). → Mẫu mã + phép thử focus dùng lại được, không viết lại mỗi lần.
3. **Sửa phát hiện chống slop bằng "bớt" làm giao diện khô** (người dùng: "càng sửa càng thô"). 11 §10 chỉ có tiêu chí đo được, không có tiêu chí cảm giác thị giác. → Thêm tiêu chí tích cực (phân cấp, nhịp, độ "ấm", chi tiết hoàn thiện) và luật "mỗi lần bỏ một thứ phải thay bằng quyết định có lý do, không để trống".
4. **E0 bị hiểu quá cứng** cho màn hạng B; E1 cho kết quả được người dùng chấp nhận. → AGENTS §1 nên gợi ý E1 cho màn tác vụ hạng B/C có người dùng hằng ngày, E0 cho hạng A.
5. **Người duyệt mới mỗi vòng = mục tiêu di động**: T3 bị hai người duyệt kết luận ngược nhau (nút lọc "nặng" ↔ ô tìm "không nổi"). → Vòng kiểm lại dùng **cùng** người duyệt + biên bản cũ; người duyệt mới chỉ ở nghiệm thu cuối. Thêm điều kiện dừng: không blocker, major giảm dần, PO chấp nhận.
6. **Quyết định kiến trúc thông tin phải hỏi người dùng ở G1**, không "CHỜ G1, làm tiếp": ngăn sửa cạnh bảng (có nguồn Material 3) bị người dùng bác — họ cần trang sửa riêng. Lý do có nguồn ≠ đúng với người dùng.
7. **Công cụ thiết kế phải dùng từ chặng 2**, không đợi bị nhắc. Stitch có ích theo cách không ngờ: nó tự hội tụ về đúng tổ hợp màu của một hướng (xô thơm + ngà + Plus Jakarta) → dùng Stitch làm **máy dò "mặc định mới"**. Stitch bịa dữ liệu (số giấy phép, tồn kho) → không bao giờ dùng làm hướng. ui-ux-pro-max: gợi ý chung là mặc định DF (xanh dương, lục bảo + tím), chỉ gợi ý theo ngành (pastel làm đẹp, font) là dùng được.
8. **Phép thử của chính agent cũng có lỗi** (lịch sử trình duyệt, selector bắt phần tử ẩn, kiểm trước khi tải xong, config biến đổi tự động gắn nhầm `dialog`). → Khi một bước "trượt", xác định lỗi ở phép thử hay ở ứng dụng trước khi sửa mã; xem diff config sau mỗi lần sinh tự động.
9. **Thử trong đúng môi trường người dùng xem.** File chạy tốt qua `file://` nhưng trắng trong khung xem trước của app (trang `data:` chặn localStorage, không đổi hash). → Mã giao diện bọc truy cập storage/history; trước khi giao, mở trong khung người dùng sẽ dùng.
10. **"Lý do hợp lệ" cho màu khi không có thương hiệu** gần như không thể có ngoài lựa chọn của PO. → Cho phép "PO chọn giữa ≥ 2 hướng có ảnh" là lý do hợp lệ, kèm rủi ro DF ghi trong thẻ.

Kết quả bản áp vào `Lab02\frontend` (hướng B "Hồng gỗ", sao lưu bản gốc ở `Lab02_frontend_goc_truoc_v6B`): máy 0/0/1 (minor `overused-font`), token 26/26 đạt, luồng trang sửa 13/13. **Chưa** có người duyệt độc lập cho bản cuối, chưa trình đọc màn hình thật, chưa Lighthouse/INP, chưa backend thật, chưa người dùng thật.

**Chưa làm:** lệnh `login`, Tab bị giữ trong dialog, so số phần tử trong baseline, script rút token từ biến CSS, trace INP; chạy lại mẫu Flutter; chạy thật trọn một vòng 11; Stitch §5.1; người thật duyệt.

## 2.0 — 29/10/2026

Theo yêu cầu người dùng: sửa công cụ và quy trình theo bản đánh giá [DANH_GIA_CONG_CU_VA_QUY_TRINH_2026-10.md](DANH_GIA_CONG_CU_VA_QUY_TRINH_2026-10.md) (lần chạy thật trên rang-moc, CareAI, Lab02) và tích hợp phần có giá trị của impeccable 4.8.0. Sau một vòng phản biện độc lập (2 blocker, 12 major, 3 minor — đã kiểm và sửa). Số chính tăng vì có blocker mới (`not-ready`, `state-steps`, `empty-page`, dialog ở hạng A) và đổi dạng ID (README "Cập nhật bộ chuẩn"). Chưa có người thật duyệt.

**Không tương thích ngược**
- ID phát hiện đổi từ `màn hình|luật|phần tử` sang `màn hình|trạng thái|luật|nguyên nhân`. Baseline/ngoại lệ dạng cũ: `audit.mjs` dừng (mã 2) kèm hướng dẫn; tạo baseline mới bằng `--update-baseline --allow-grow` sau khi sửa lỗi, ghi lý do vào CHANGELOG dự án.
- `--out` mặc định `audit_out/<ngày-giờ>`, từ chối ghi đè. `prepush.mjs` dùng `audit_out/prepush --overwrite`; audit không chạy được trong khi máy xem trước đang trả lời thì **chặn** push khi dự án đã có baseline.
- `--update-baseline` không dùng cùng `--only`/`--quick`. Lỗi "trang hỏng" (`load`, `http-status`, `redirected`, `not-ready`, `state-steps`, `empty-page`, `js-error`) không bao giờ vào baseline.

**Quy trình**
- [11](11_DANH_GIA_VA_CAI_THIEN.md) có hiệu lực: luồng đánh giá/cải thiện màn hình có sẵn (đánh giá 4 lớp trước, cổng chọn phạm vi, duyệt độc lập, so sánh trước/sau). 08 §5 thêm "Đánh giá", "Cải thiện"; AGENTS §3 thêm cổng chọn phạm vi.
- [12](12_BAN_DO_CONG_CU.md) có hiệu lực: công cụ theo chặng, bảng 08 × công cụ, giới hạn chống slop cho Stitch/shadcn/Tailwind/impeccable, an toàn MCP. 09 §5 dẫn về 12.
- 01: luồng 11 ở §1; hướng thị giác dựng bằng mã thật, Stitch chỉ là mẫu đối chứng; không lấy token từ theme làm sẵn; Tailwind không giá trị tuỳ ý; khai báo `ready`/`states` khi dựng; người duyệt kết luận bằng mắt trước khi xem báo cáo máy.
- AGENTS §4 thêm luật 11 (công cụ sinh giao diện là nguồn mặc định; hỏi trước dịch vụ ngoài) và 12 (người làm không tự kết luận đạt).
- 07: thêm G2-16…G2-20 (card lồng card, viền màu một bên, chữ xám trên nền màu, monospace làm trang trí, dialog thừa); §7 sửa "người làm" → "người duyệt" kết luận, liệt kê dấu hiệu máy không bắt được.
- 08: báo theo **nguyên nhân**, đo các trạng thái khai báo; W5 thêm dialog; W10 thêm `internalTerms`, `localhost`; W17 dùng `audit.mjs --impeccable` (✓*), người duyệt nâng G2-01/14/15, G3-12 ở E0 lên Major.

**Công cụ**
- `audit.mjs`: kiểm config trước khi mở trình duyệt; lỗi không lường trước thoát mã 2 (không bao giờ là mã 1); `ready` của màn hình chờ trước các bước, `ready` của state chờ sau; không khai báo `ready` mà trang gần như trống → blocker `empty-page`; chỉ bỏ qua đúng các URL đã cố ý trả lỗi bằng fixture, `expectConsoleErrors` cho state giả lập lỗi; cổng DevTools lấy ngẫu nhiên trên 127.0.0.1; báo ngoại lệ/baseline không còn khớp; `ready` (không đo trên khung xương/hộp đăng nhập), `states` + `route` + `initStorage` (dialog, rỗng, lỗi API bằng fixture, token giả), kiểm dialog (focus vào, tên, Escape, trả focus), chi tiết axe (tỉ lệ, màu chữ/nền, html), không gắn thuộc tính vào DOM trước axe, gộp theo nguyên nhân + đếm phần tử, tên phần tử không cắt 30 ký tự, mọi cụm thuật ngữ nội bộ, `themeStorage`, cảnh báo file phiên trong thư mục dự án, `--out` mặc định theo ngày-giờ và từ chối ghi đè, mục "Chưa kiểm" theo loại trang/mức/trạng thái, `--impeccable` (W17 qua `impeccable detect --cdp`, telemetry tắt).
- Mẫu Flutter: harness giống `main.dart`, Localizations tuỳ app, nạp font thật, khung đủ cao + `maxScrollExtent == 0`, quét tương phản từng đoạn chữ (`flutter_text_contrast_scan.dart` mới), ai duyệt golden lần đầu.
- `design.config.schema.json`: `ready`, `states`, `route`, `initStorage`, `themeStorage`, `internalTerms`, `impeccable`.
- Kho PRACTICE: `.mcp.json` (Playwright MCP `--isolated`, shadcn-ui, open-computer-use, Stitch qua biến môi trường).

**Giới hạn đã biết:** kiểm dialog là heuristic (Escape, focus vào/ra, tên); Tab bị giữ trong dialog và nền `inert` chưa kiểm bằng máy. Baseline so theo nguyên nhân, không so số phần tử (thêm phần tử cùng cặp màu đã baseline không bị báo mới). W17 không bắt G2-01, G2-10, G2-14, G2-15, G3-12. Mẫu Flutter mới chưa chạy lại; ngưỡng "chữ lớn" của bộ quét theo WCAG (24px / 18.66px đậm), chặt hơn hằng số của Flutter.

**Sự cố khi soạn 2.0:** một lệnh PowerShell đổi số phiên bản đã thay sai từng ký tự trong 6 file (AGENTS.md, 02, 10, schema, 2 config). Đã khôi phục từ bản sao lưu tự động của Claude Code, nhật ký phiên và quy tắc thay thế 1-đổi-1; 10 §1–§2 dựng lại theo quy tắc (không có bản gốc đầy đủ) — nên đối chiếu khi duyệt.

**Đã chạy thật (29/10):** `audit.mjs` mới trên rang-moc (0 lỗi ngoài state thử cố ý) và bản mẫu Lab02 với fixture: bắt dialog không đóng bằng Escape/focus không vào dialog (2 dialog), thuật ngữ nội bộ lộ ra (6 cụm), tương phản khung lỗi 4,38:1, line-height 1,43 ở 3 chỗ, `icon-tile-stack` — bản cũ báo 0/0/0 cho cùng trang. Mẫu Flutter mới **chưa** chạy lại.

## 1.2 — 28/10/2026

**Phạm vi chung cho mọi dự án**
- Bỏ ví dụ gắn với một dự án cụ thể (CareAI chỉ là dự án dùng để thử); ví dụ mới: cửa hàng online, ngân hàng, vận hành, nhân viên kho/kế toán.
- Đồng hồ (Wear OS), Compose và cảnh báo khẩn tới máy khoá/im lặng chuyển sang [phụ lục tuỳ chọn](PHU_LUC_THIET_BI_DEO_VA_CANH_BAO.md) (kiểm định D1–D4). 03B bỏ §4, đánh lại số §6 "Bảng chuyển đổi web → Flutter".

**Kiểm định**
- `audit.mjs`: thêm lượt kiểm bổ sung cho mỗi màn hình — phóng to 200% và text-spacing (W11 thành ✓), ảnh forced-colors, tắt JS cho màn hình `ssr: true` (W14 thành ✓); `--quick` bỏ lượt này. Tìm `playwright`/`@axe-core/playwright` trong `node_modules` của dự án trước (bộ chuẩn thường nằm ngoài thư mục dự án).
- Config thêm `ssr`, `tokens`, `preview`.
- Hook pre-push (`install_hooks.mjs`, `prepush.mjs`: chặn khi token sai hoặc có blocker mới; không chặn khi máy xem trước tắt hoặc chưa có baseline) và mẫu GitHub Actions (`scripts/ci/`).
- W17 dùng `npx impeccable detect` thay nhóm anti-slop của ui_auditor.

**Ví dụ và tích hợp**
- `examples/rang-moc/`: dự án hư cấu đi trọn từ brief, thẻ hướng, vân tay, token tới hai trang đã qua `audit.mjs`; axe-core 4.10.2 chạy trong trình duyệt: 0 vi phạm; chuỗi kiểm font tiếng Việt đã chạy.
- Kho PRACTICE: skill `design-standard`, `gsap-*`, `threejs-*` trong `.claude/skills/` và `.agents/skills/`; `AGENTS.md`/`GEMINI.md` gốc trỏ về bộ chuẩn; hook pre-commit của ui_auditor đã tắt (bản sao lưu `.git/hooks/pre-commit.ui_auditor.bak`).

## 1.1 — 28/10/2026

Sau ba vòng phản biện độc lập (vòng 1: thiết kế, độ chính xác/trợ năng, tính khả thi; vòng 2: thiết kế + khả thi, kiểm chứng sự thật + chạy thử script; vòng 3: phản biện tổng thể cuối).

**Quy trình**
- Làn theo quy mô, xét theo thứ tự khởi tạo → L → M → S; hạng A tăng kiểm định thay vì đổi làn. Bước khởi tạo hệ thống thiết kế; quy tắc cho giao diện cũ.
- `AGENTS.md` là nguồn duy nhất cho hành vi agent: cổng dừng/làm tiếp, luật cứng, định nghĩa hoàn thành. 01 không chép lại.
- Ba cách duyệt (người thứ hai, agent độc lập, tự duyệt sau 1 ngày — không cho hạng A). Kiểm thử người dùng theo mốc phát hành.
- Lý do hợp lệ chỉ dẫn tới dòng brief đã được PO xác nhận, tham chiếu có link, hoặc quy ước ngành có nguồn — giả định của agent không tính.

**Phạm vi**
- Trục nền tảng (03B): ma trận kích thước theo nền tảng; mobile, tablet, Wear OS (chọn Compose hay Flutter, mẫu gửi SOS đếm ngược), desktop; cảnh báo khẩn trên máy khoá/im lặng; bảng web → Flutter.
- 23 loại trang, thêm `pricing`, `alert`, `map`, `workspace`, `onboarding`, `account`, `notifications`, `checkout`, `ai`, `email`.

**Quy tắc thiết kế**
- 04: thang cỡ chữ cụ thể, tracking theo cỡ, mặc định E0 (token dự án ở mọi mức), thang chọn hình ảnh, biểu đồ, CSS hiện đại, CLS đúng định nghĩa 500ms, toast có hành động ≥ 10 giây, cặp token gắn màn hình.
- 05: line-height theo khả năng cắt chữ; `hourCycle: 'h23'`; địa chỉ hai cấp có đặc khu; nguồn văn bản NFD; không mặc định một font.
- 06: easing/lò xo hiện đại; bậc 0 HTML/CSS gốc; hỗ trợ `animation-timeline` và View Transitions giữa trang đã sửa; không animate phần tử LCP; SC 2.3.1.
- 07: danh mục dấu hiệu 3 thế hệ; phép thử T1–T11 có tiêu chí đo được và cổng cứng; vân tay mặc định DF-1…DF-6 (DF-6: mặc định app y tế/công Việt Nam).
- 08: nguồn duy nhất cho kiểm định; bảng web (W1–W17) và Flutter (F1–F6) theo hạng; mức cho phát hiện thủ công; định nghĩa hoàn thành theo làn.
- Sửa sai: SC 2.2.1 áp mọi hạng; vùng chạm con trỏ chính xác hạng A 24px + hành động chính 44px; dark mode mặc định tắt; `MinimumTextContrastGuidelineAAA` cho hạng A Flutter; `SemanticsService.announce` đã lỗi thời.

**Script**
- `check_tokens.mjs`: bắt buộc hạng; đọc config; cặp gắn `screens`; chặn `--tier` thấp hơn config; mã thoát 2 cho lỗi cấu hình; OKLCH %, đơn vị hue, cảnh báo ngoài gam; chặn kênh màu sai; `under` cho nền trong suốt; `$value` và màu DTCG dạng đối tượng.
- `audit.mjs` (mới): thẻ viewport, tràn ngang, vùng chạm theo hạng/kiểu con trỏ/ngoại lệ khoảng cách, Tab theo danh tính phần tử, focus gồm pseudo-element/cha/nhãn, lỗi JS và tài nguyên, chữ không nhìn thấy khi giảm chuyển động, line-height tiếng Việt, nội dung giả, axe-core, baseline không tăng, ngoại lệ có hạn. Đã chạy trên 22 trang thử (cả trang đúng chuẩn và trang cố ý sai), gồm trang cần đăng nhập.
- `flutter_ui_standard_test.dart.tmpl` (mới, chưa chạy thử — không có Flutter SDK), `design.config.schema.json`, mẫu config/ngoại lệ/token, `FINGERPRINTS.md`.

## 1.0 — 28/10/2026

Bản đầu, thay SOP V25.4.

Lý do thay bản cũ (bản thẩm định ngày 28/10/2026): bắt buộc một phong cách (Linear/Vercel/shadcn) chính là slop thế hệ 2; 19/32 tỉ lệ tương phản ghi tay bị lệch khi tính lại; mọi luật đều chặn, không có mức và baseline; chiều cao cố định cho 4 trạng thái mâu thuẫn với quy tắc không cắt chữ; tool kèm theo bắt nhầm 4/4 trang đúng và bỏ sót 4/4 trang sai trong thử nghiệm.
