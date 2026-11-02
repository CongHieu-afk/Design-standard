# Phân tích: Claude Design · open-design · huashu-design — khả năng tích hợp vào design_standard

Ngày: 30/10/2026 · Người làm: Claude Code · Yêu cầu người dùng: "tham khảo và phân tích claude-design, open-design, huashu-design, dùng tư duy phản biện phân tích, đánh giá khả năng tích hợp, kết hợp vào các skill, plugin, mcp, tool hiện tại".
Nguồn đã đọc (30/10/2026): thông báo Anthropic "Introducing Claude Design by Anthropic Labs"; README + SKILL.md của `alchaincyf/huashu-design` (bản 3.0); README `nexu-io/open-design`. Số sao/ngày lấy từ trang lúc đọc, có thể đã đổi. **Chưa cài, chưa chạy thử** cả ba — đánh giá dựa trên tài liệu.

## 1. Ba thứ này là gì

| | Claude Design | open-design (nexu-io) | huashu-design (花叔) |
| --- | --- | --- | --- |
| Loại | Sản phẩm của Anthropic Labs (research preview, ra mắt 17/04/2026), chạy trên claude.ai | Ứng dụng mã nguồn mở: web Next.js / Electron + daemon cục bộ gọi CLI agent có sẵn (Claude Code, Codex, Cursor…) | Một skill (SKILL.md + references + scripts), chạy trong bất kỳ agent đọc được skill |
| Đầu ra | Prototype, slide, one-pager; xuất PDF, PPTX, HTML, Canva; "handoff bundle" sang Claude Code | HTML, PDF, PPTX, ZIP, MP4 (HyperFrames); 151 gói design system dạng `DESIGN.md` | HTML prototype, deck 1920×1080, PPTX chỉnh được (`html2pptx.js`), MP4/GIF, infographic |
| Design system | Đọc codebase + file thiết kế khi onboarding → màu, chữ, component, áp tự động | `DESIGN.md` làm "hợp đồng thương hiệu" + `tokens.css` | `brand-spec.md` sau quy trình tài sản thương hiệu 5 bước |
| Chất lượng | Không công bố cơ chế kiểm | "5-dimensional self-critique pre-emit gate", lint API; checklist chống slop ghi nguồn từ huashu | `design_lint.py` (ảnh vỡ, chữ nhỏ, tương phản, lỗi console, mẫu trang trí), `verify.py` (Playwright), critique 5 chiều, "sổ diện mạo" chống lặp |
| Giấy phép | Thương mại, theo gói Pro/Max/Team/Enterprise (Enterprise mặc định tắt) | Apache-2.0 | MIT từ 14/05/2026 (README nói điều khoản cũ "doanh nghiệp cần xin phép" đã huỷ — nên kiểm lại LICENSE trước khi dùng thương mại) |
| Độ chín | Research preview | 0.x, roadmap tới 0.13; comment-mode mới một phần | 3.0, ~28k sao; tác giả tự nhận làm từ đầu không có thương hiệu chỉ ~60–65 điểm, **3D/vật lý/hạt ngoài phạm vi** |

## 2. Phản biện — chúng có giải được đúng các lỗi ta đã gặp không?

Các lỗi thật của 4 landing (vòng 2.4 → 2.7, xem CHANGELOG): (a) agent **bỏ qua luật đã có** (bảng tham chiếu 2.5); (b) hình tự dựng bằng mã **thô**; (c) **màu không theo đề tài**; (d) hiệu ứng **lỗi khi tương tác** (khối đen, nháy) mà máy và phép chụp ảnh không bắt; (e) người dùng phải **nhắc lại cùng một gu** nhiều lần (thô, nền mờ, 3D trên ảnh tĩnh).

| Lỗi | Claude Design | open-design | huashu-design | Kết luận |
| --- | --- | --- | --- | --- |
| (a) bỏ qua luật | Không áp được luật của ta | Có "pre-emit gate" nhưng là tự chấm của agent | **Gate file**: "file không có = bước chưa làm" (`direction-approved.md` ghi nguyên văn lựa chọn của người dùng, `brand-spec.md`, `product-facts.md`) + hook chặn | **huashu giải đúng chỗ** — cơ chế đáng mượn nhất |
| (b) hình thô | Mạnh ở bố cục + design system; ảnh vẫn do người cung cấp | Như Claude Design | "Tư liệu đi trước" (mỗi hướng có tư liệu chủ đạo: ảnh thật, data, chữ lớn…) — trùng luật 2.5 của ta; **không làm 3D** | Không ai giải phần 3D; phần ảnh ta đã có (2.5) |
| (c) màu | Lấy từ codebase/design system | Từ `DESIGN.md` | "Giao thức suy màu", lấy màu từ ảnh sản phẩm khi có thương hiệu | Ta đã có `bang_mau.mjs` (2.7) — tương đương |
| (d) lỗi tương tác | Không nói | Không nói | `verify.py` click thử prototype, nhưng **không** đếm nháy/hover | Không ai giải — phép đếm đổi trạng thái của ta (06 §6) đi trước |
| (e) nhắc lại gu | Không có trí nhớ gu ngoài design system | Không thấy | **`learn.py`**: ghi nguyên văn câu nói về gu ("太素了") kèm phạm vi áp dụng, đọc lại ở đầu mỗi việc; "sổ diện mạo" chống lặp kiểu giữa các dự án | **huashu giải đúng chỗ** — ta đang lặp lại lỗi vì không có cơ chế này |

Điểm phản biện ngược lại (không nên tin mù):
- **huashu**: "cổng ba hướng 100%, kể cả khi đã chỉ định phong cách" sẽ **làm chậm** việc nhỏ và mâu thuẫn với làn S/M của ta (G2 chỉ cho đổi hướng thị giác). Danh sách chống slop của huashu cấm "tô màu một từ trong tiêu đề", "→ cuối nút", "chấm giữa A · B · C" — một số ta đang dùng (trang du lịch: chữ gradient một cụm trong h1; gợi ý tháng nối bằng "·") → cần xét từng mục, không chép nguyên. Tài liệu viết tiếng Trung, ví dụ thiên về thị trường Trung Quốc.
- **open-design**: là **cả một ứng dụng** (Next.js, Electron, SQLite, Node 24) — nặng, còn 0.x. 151 design system mang tên **Stripe, Apple, Linear…** → dễ dẫn tới **giả mạo thương hiệu**, trái luật kho và bộ chuẩn (D-01, không mạo danh). Con số sao giữa các nguồn lệch nhau (16k ↔ 105k) — chưa kiểm được.
- **Claude Design**: dữ liệu rời máy, theo hạn mức gói; Enterprise mặc định tắt. Không dùng cho dữ liệu sức khoẻ thật (CareAI) — chỉ dữ liệu mẫu. Không có máy kiểm trợ năng như `audit.mjs`; nguồn ngoài cũng nhận xét không có design system thì ra "functional but generic".
- Cả ba đều mạnh ở **slide/prototype/video** — thứ ta đã có đường khác (skill pptx, loại Artifact Slides). Trùng chức năng nhiều hơn bổ sung.

## 3. Khả năng tích hợp — từng thứ với từng công cụ hiện có

Hiện có: bộ chuẩn `design_standard` 2.7 (+ `audit.mjs`, `check_tokens.mjs`, `check_codes.mjs`, `bang_mau.mjs`), skill `design-standard`, `gsap-*`, `threejs-*`, `ui-ux-pro-max`, `agent-skills`, `ponytail`; MCP Stitch, shadcn, Playwright; impeccable detect; mẫu `landing_3d/src/shared/`. Luật kho: không cài gói quy trình chồng chéo khi đã có `agent-skills`; skill đứng sau bộ chuẩn.

| Phương án | Lợi | Rủi ro / chi phí | Đề xuất |
| --- | --- | --- | --- |
| Cài huashu-design làm skill tự kích hoạt | Có ngay quy trình, script xuất PPTX/MP4 | **Hai skill cùng bắt "thiết kế UI"** → agent theo hai quy trình mâu thuẫn (ba hướng 100% ↔ G2 theo làn); trái luật "không chồng gói quy trình" | **Không** |
| Cài huashu-design dạng tham khảo (`disable-model-invocation`), chỉ gọi khi gõ tên | Đọc được references (typography, styles), dùng `html2pptx.js`/`ref_board.py` khi cần | Cần cài (hỏi trước); Python + Node + ffmpeg | Tuỳ chọn, sau khi có nhu cầu deck/video |
| **Mượn cơ chế huashu vào design_standard** (gate file, sổ gu, ref board, xác minh sự thật, mẫu trang trí) | Giải đúng lỗi (a), (e); không thêm phụ thuộc | Công viết + giữ đồng bộ | **Có — ưu tiên 1** |
| Cài open-design (app) | Giao diện chọn hướng, 151 design system | Nặng, 0.x, rủi ro mạo danh thương hiệu, trùng Stitch | **Không** (xem lại khi ≥ 1.0) |
| MCP open-design (stdio, chỉ đọc, 127.0.0.1) | Tra design system/skill từ agent | Phải chạy daemon; nội dung chủ yếu là thương hiệu người khác | Không cần |
| **Định dạng `DESIGN.md`** (open-design, cũng là đầu vào của Stitch `create_design_system_from_design_md`) | Xuất token dự án → Stitch sinh bản mẫu **đúng màu/chữ của ta** (vòng 2.7 Stitch tự đoán màu) | Một script nhỏ | **Có — ưu tiên 2** |
| Claude Design ở chặng 2 (G2) thay/kèm Stitch | Ổn định hơn Stitch (Stitch nhiều lần quá thời gian, `list_screens` rỗng), có design system từ codebase, handoff sang Claude Code | Dữ liệu rời máy, hạn mức gói; không dùng cho dữ liệu thật nhạy cảm | **Thử** trên một dự án không nhạy cảm; ghi vào 12 §2 như một nguồn bản mẫu |

## 4. Kế hoạch tích hợp đề xuất (chưa làm — chờ người dùng đồng ý)

**Ưu tiên 1 — mượn cơ chế huashu vào bộ chuẩn (2.8):**
1. **Gate file** cho E2–E3 và mọi việc có G2: `design-gates/tham-chieu.md` (bảng tham chiếu + ảnh chụp), `design-gates/huong-da-chon.md` (hướng nào, ảnh nào, **nguyên văn** câu người dùng chọn), `design-gates/su-that.md` (sự thật đã kiểm bằng tìm kiếm: năm UNESCO, ngưỡng nhịp tim…). Script `check_gates.mjs` báo thiếu → `audit.mjs` ghi `gate-thieu` (major). Giải lỗi (a): luật có nhưng bị bỏ qua.
2. **Sổ gu người dùng** `design_standard/GU_NGUOI_DUNG.md` — ghi nguyên văn câu phản hồi + phạm vi, đọc ở đầu mỗi việc giao diện. Hạt giống có sẵn từ phiên này: "càng sửa càng thô", "đừng bóp hết mọi thứ", "trang sửa phải tách riêng", "hình ảnh còn quá thô, nên lấy hình ảnh trên mạng", "màu sắc… chưa phù hợp với đề tài", "đừng làm kiểu nền mờ", "bỏ hiệu ứng 3d với các ảnh tĩnh". Giải lỗi (e).
3. **`ref_board.mjs`** (Playwright, đã có): chụp các trang tham chiếu thành một tấm ghép trước khi phân tích — bảng tham chiếu có ảnh thật, không chỉ link.
4. **Mẫu trang trí khuôn sáo** bổ sung vào 07 §4 (xét từng mục, không chép nguyên): nhãn chữ hoa trên mọi tiêu đề (đã có G2-06), "→" đuôi nút, tô màu một từ trong tiêu đề, "01/02/03" cho nội dung không phải trình tự, nối "A · B · C" — đưa vào bậc **tiết chế** có liều, không cấm (theo tinh thần 2.2).
5. **Sàn đọc được** của huashu trùng phần lớn 04; chỉ thêm ngưỡng cho deck/ảnh dài nếu sau này làm slide.

**Ưu tiên 2 — `DESIGN.md`:** script `xuat_design_md.mjs` từ `tokens.json`/CSS biến → `DESIGN.md`; dùng `mcp__stitch__create_design_system_from_design_md` trước khi sinh bản mẫu. Kiểm: màu Stitch trả về khớp token.

**Ưu tiên 3 — thử Claude Design** cho G2 của một trang không nhạy cảm (ví dụ landing design_standard), so với Stitch về: thời gian, số lần lỗi, độ khớp design system, chất lượng handoff sang mã.

**Không làm:** cài open-design; cài huashu-design dạng tự kích hoạt; dùng design system mang thương hiệu người khác.

## 5. Chưa kiểm được
- Chưa cài/chạy thử bất kỳ thứ nào; chưa đọc mã `design_lint.py`, `verify.py`, `html2pptx.js`.
- Chưa có quyền truy cập Claude Design để thử; không biết hạn mức cụ thể của tài khoản.
- Số sao, giấy phép có thể đổi sau ngày đọc.
