# 07 · Sinh trước, gọt sau — kiểm soát "nét AI"

Lịch sử và lý do thay đổi nằm trong [CHANGELOG.md](CHANGELOG.md); file này chỉ giữ quy tắc đang áp dụng.

## 1. Định nghĩa

**AI slop** là mặc định bị dùng quá liều, nội dung gian dối, hoặc màn cần nhận diện nhưng giống nguyên template. Bo góc, khoảng trắng, phân cấp, nhãn màu nhạt và phản hồi thao tác không tự động là slop.

Gọt là giảm liều và thay bằng quyết định có lý do, không phải xoá sạch. Bỏ một chức năng hoặc điểm nhấn mà không chuyển vai trò cho chỗ khác là sửa quá tay (§3, §6).

## 2. Quy trình: sinh → chấm → gọt → dựng

Áp ở chặng 2 của [01](01_QUY_TRINH.md) (thiết kế mới) và nhóm b2 của [11](11_DANH_GIA_VA_CAI_THIEN.md) (cải thiện màn có sẵn).

1. **Sinh:** từ brief đã bỏ dữ liệu nhạy cảm, tạo ≥ 2 bản; E0–E1 làn M được 1 bản. Dùng công cụ ở [12 §2](12_BAN_DO_CONG_CU.md#2-luồng-thiết-kế-mới-01); không dùng được Stitch thì dùng shadcn/ui-ux-pro-max hoặc dựng nhanh bằng component và ghi lý do. Bản mẫu phải cùng `type` (03), dùng nội dung thật; chỗ thiếu ghi `[CẦN NỘI DUNG: …]`. E2–E3 phải **trước khi sinh**: tạo `design-gates/tham-chieu.md`, dùng `scripts/ref_board.mjs` chụp/nhìn thật ≥ 3 trang cùng loại, nêu bài học về ảnh, ánh sáng, chuyển cảnh và nộp cùng thẻ hướng; không tham chiếu theo trí nhớ. Stitch nhận `DESIGN.md` xuất từ token của hướng, không tự đoán màu. Thiếu các bằng chứng này thì T13 trượt; G2 của E3 phải có link chạy được hoặc video ngắn.
2. **Chấm** bằng **bảng gọt** — **một bảng cho mỗi hướng**, ghi bản mẫu nguồn ([10 §2](10_MAU.md#2-thẻ-hướng-thị-giác)):
   - mỗi dấu hiệu §4 có trong bản: bậc (cấm / tiết chế / tự do), liều hiện tại, quyết định (giữ · giảm liều · bỏ và thay bằng …);
   - **mỗi khối của bản mẫu** (2.3): khối đó làm gì cho tác vụ nào, có phải **điểm nhấn** không, quyết định (giữ · đổi · bỏ). Bỏ một khối là điểm nhấn hoặc là việc cần xử lý (cảnh báo, việc chờ) thì phải chuyển vai trò đó cho khối khác — ghi khối nào nhận;
   - **≥ 3 điểm tốt cần giữ** (thân thiện, hiện đại, thuận mắt) — bắt buộc, để không gọt sạch.
3. **Gọt:** bỏ mọi dấu hiệu bậc **cấm**; đưa dấu hiệu bậc **tiết chế** về trong liều; giữ bậc **tự do**. Chỗ bỏ đi thay bằng thứ có chức năng hoặc gắn với nội dung (màu nhấn theo ngành, nhãn trạng thái, ảnh sản phẩm thật…).
4. **Dựng:** dùng mã thật và token dự án; chụp theo [03B §0](03B_NEN_TANG_THIET_BI.md#0-ma-trận-kích-thước-kiểm-định). Ở ảnh `*_T3-blur8.png`, khối ghi là điểm nhấn phải nổi nhất; nếu không, sửa cỡ/đậm/màu/vị trí trước khi trình. G2 chỉ nhận bản đã gọt và dựng lại, không nhận bản sinh thô.
5. **Dò mặc định:** đặt bản đã gọt cạnh một bản sinh **không ràng buộc** (prompt chỉ có loại trang + ngành, không màu, không thương hiệu — không phải bản mẫu nguồn đã chỉnh prompt). Giống bản đó ở cả màu nhấn, font và bố cục → ghi "rủi ro mặc định" trong thẻ hướng. E0–E1: chỉ ghi, PO quyết. E2–E3 và sản phẩm làn L: thêm ít nhất một quyết định đặc trưng (§5).

## 3. Lý do hợp lệ

Chỉ cần lý do cho: dấu hiệu bậc tiết chế **vượt liều**, quyết định đặc trưng (E2–E3), và đổi hướng thị giác. Bậc tự do và tiết chế trong liều không cần lý do.

**Lý do hợp lệ** phải trỏ tới một nguồn: brief PO đã xác nhận; hướng có ảnh PO chọn ở G2 (chỉ biện minh màu/font/bề mặt khi chưa có thương hiệu); bảng tham chiếu có link/ảnh và bài học cụ thể; hệ thiết kế đã qua G2; hoặc tiêu chuẩn/hướng dẫn có thẩm quyền (ISO, WCAG, TCVN, Material, Apple HIG, Fluent, Radix/shadcn) **cho cấu trúc, hành vi và chi tiết thân thiện**, không phải giấy phép cho trang trí vượt liều.

Dấu hiệu vượt liều khác vẫn phải xuất hiện trong bảng gọt và trong ảnh PO đã xem; thẻ hướng ghi rủi ro DF.

"Hiện đại", "đẹp", "AI đề xuất" đứng một mình vẫn không phải lý do cho thứ **vượt liều**. Lý do dẫn tới dòng "Giả định" = không có lý do.

**Luật "bớt phải thay":** mỗi dấu hiệu hoặc khối bị bỏ phải ghi thứ thay vào, hoặc "không cần thay" kèm lý do. Luật áp cho chức năng và điểm nhấn, không chỉ trang trí. Vòng sửa chỉ bỏ và làm ảnh mờ phẳng hơn bản mẫu là "gọt quá tay" (§6).

## 4. Danh mục dấu hiệu theo bậc

### Bậc cấm — luôn bỏ (major; hạng A trên luồng chính: blocker)

Lý do chung: gian dối, hại khả năng đọc hoặc lộ trạng thái kỹ thuật. Mức: **Major**; trên luồng chính hạng A: **Blocker** (08 §2). Máy chỉ báo nghi vấn (Minor, nhãn "bậc cấm"), người duyệt xác nhận mới tính.

| Mã | Dấu hiệu |
| --- | --- |
| G2-09 | Số liệu tròn không nguồn, lời chứng thực/người dùng/logo khách hàng/giấy phép **bịa** (kể cả do công cụ sinh tự điền) |
| G2-09d | **Suy diễn quá dữ liệu:** câu gợi ý hành động, nhãn hay kết luận mà dữ liệu không đỡ (ví dụ "nên kiểm hàng sớm" khi trường chỉ có số tháng, không có ngày); trường còn chờ PO giải nghĩa thì gọi đúng tên trường, không gán nghĩa. **Cả nhãn hành động** (2.4): tên nút, tiêu đề hộp xác nhận, thông báo kết quả phải nói đúng thao tác thật — "Ngừng bán", "Lưu trữ", "Ẩn" cho thao tác xoá cứng là sai |
| G2-12 | Trạng thái kỹ thuật lộ ra UI ("Skeleton", "Mock", lorem, localhost, tên API) |
| G2-13 | Ảnh AI mô tả "người dùng"/"sản phẩm đang dùng"; người có bàn tay lỗi |
| G1-06 | Văn sáo rỗng ([05 §1.4](05_NGON_NGU.md#14-văn-phong), [05 §2](05_NGON_NGU.md#2-giao-diện-tiếng-anh)) |
| G2-10 | Title Case trong tiếng Việt; câu dịch máy |
| G1-04 | Emoji thay icon trong nút, nhãn, tiêu đề của giao diện chức năng |
| G2-07g, G2-08g | Chấm "đang hoạt động/trực tiếp" khi không có trạng thái trực tiếp thật; icon tia lấp lánh cho tính năng không dùng AI |
| D-01 | Mẫu gây hiểu lầm (dark pattern): đếm ngược giả, ô đồng ý/đăng ký tích sẵn, nút từ chối giấu hoặc lời lẽ gây xấu hổ, số "đang xem" giả |
| D-02 | Ảnh stock **trình bày như** người dùng hoặc khách hàng thật của sản phẩm (gắn tên, lời trích, số liệu, "khách hàng của chúng tôi"). Ảnh minh hoạ không khí có chú thích "Ảnh minh hoạ" + nguồn thì được (2.5) |
| C-01 | Chữ gradient hoặc chữ trên nền gradient/kính/ảnh mà không đạt tương phản ([08](08_NGHIEM_THU.md) W2) |
| G3-10 | Số đếm tăng dần khi số đó không có nguồn |
| G3-13 | Gói giá "Phổ biến nhất" không có số liệu |

### Bậc tiết chế — giữ được trong liều

Trong liều: không cần lý do. Vượt liều: cần lý do hợp lệ (§3), không có → **minor**; ≥ 3 dấu hiệu vượt liều trên một màn hình → **major** ("quá lố").

| Mã | Dấu hiệu | Liều cho phép (mỗi màn hình) |
| --- | --- | --- |
| G1-01 | Gradient | ≤ 1 vùng nền lớn và ≤ 3 điểm nhấn nhỏ (nút, viền, biểu đồ); 2 màu lệch tông ≤ 60° OKLCH; không sau chữ thân |
| G1-02 | Kính mờ | ≤ 2 lớp trên màn hình, chỉ lớp phủ trên ảnh/video, thanh dính, menu nổi; không làm bề mặt card |
| G1-03 | Bóng phát sáng màu (glow) | 1 thành phần, E2–E3, không sau chữ thân, tắt ở theme sáng nếu làm giảm tương phản |
| G1-05 | Blob, hình mờ trôi nổi | 1 chỗ, E2–E3, không sau nội dung đọc |
| G2-01 | Giao diện thư viện để nguyên | Phải đổi ít nhất **màu nhấn** và một trong {font, bo góc khác ≥ 1 bậc thang (≥ 4px), mô hình bề mặt} theo token dự án; giữ được khoảng cách, focus ring, cấu trúc của thư viện |
| G2-02 | Inter/Geist/Roboto/Plus Jakarta… (font "quá phổ biến") | E0–E1: thoải mái nếu qua chuỗi kiểm tiếng Việt (05 §1.1). E2–E3: thêm font tiêu đề có giọng riêng |
| G2-03 | Hero căn giữa: pill → tiêu đề → mô tả → 2 nút | 1 lần/trang, nội dung thật; không kèm dải logo bịa |
| G2-04 | Lưới card tính năng, icon trong ô bo góc; bento | 1 lưới/trang; ô to hơn chỉ cho nội dung quan trọng hơn; ≤ 6 ô |
| G2-05 | Hàng card KPI, chip "↑ 12%" | Chỉ với số liệu thật; ≤ 4 thẻ; chip có màu theo nghĩa (tăng xấu thì không xanh) |
| G2-06 | Nhãn CHỮ HOA giãn chữ (eyebrow) | ≤ 2/trang, ≤ 3 từ |
| G2-07 | Chấm nhấp nháy | Trạng thái trực tiếp thật, 1 chỗ (giả = bậc cấm G2-07g) |
| G2-08 | Icon tia lấp lánh | Tính năng AI thật, 1 kiểu icon (không phải AI = bậc cấm G2-08g) |
| G2-11 | Gạch ngang dài | ≤ 1 lần/100 từ văn marketing |
| G2-14 | Theme biểu đồ mặc định | Màu chuỗi lấy từ token; giữ được kiểu lưới, tooltip của thư viện |
| G2-15 | Flutter `ColorScheme.fromSeed` | Seed là màu nhấn dự án, không seed mặc định; FAB chỉ ở màn có hành động tạo chính |
| G2-16 | Card lồng card | ≤ 2 cấp, cấp trong là đối tượng độc lập |
| G2-17 | Viền màu dày một bên | Chỉ cho thông báo/trạng thái (alert, dòng lỗi), không trang trí |
| G2-18 | Chữ xám trung tính trên nền màu | Chữ ngả theo tông nền (sửa là đổi tông, không bỏ nền) |
| G2-19 | Monospace làm "trang phục kỹ thuật" | Mã, số đo, dữ liệu: thoải mái; chữ thường: ≤ 1 chỗ trang trí |
| G2-20 | Dialog cho việc không cần ngắt luồng | Xem nhanh/xác nhận nhẹ ưu tiên ngăn bên, trang riêng hoặc toast có hoàn tác |
| G3-01…G3-04 | Giấy kem + serif hiển thị; terracotta/ô liu; serif nghiêng chen; số mục mono | Tối đa 2 trong 4 cùng lúc |
| G3-05, G3-08 | Grain toàn trang; nền chấm/lưới toả tròn | 1 trong 2, độ đậm thấp, không sau chữ thân |
| G3-06 | Đường kẻ mảnh mọi nơi | Kẻ có chức năng (chia nhóm, bảng); ≤ 1 kiểu viền cho các khối ngang hàng |
| G3-07 | Tiêu đề khổng lồ tracking chặt, dòng 2 xám | 1 lần, E2–E3; tiếng Việt không chặt hơn −0,02em |
| G3-09 | Dải logo chạy | Chỉ logo thật có quyền dùng |
| G3-11 | Viền chạy sáng, đèn theo chuột | 1 thành phần, E2–E3, tắt khi giảm chuyển động |
| G3-12 | Icon Lucide mặc định 24px nét 2 khắp nơi | Chỉnh cỡ 16/20 và nét theo chữ (04 §6); icon đi kèm nhãn ở điều hướng |
| G3-14 | FAQ accordion + footer 4 cột + ô bản tin | Chỉ khi có nội dung thật cho từng phần |
| G3-15 | Đăng nhập chia đôi nửa minh hoạ | Nửa kia là nội dung thật (ảnh sản phẩm, thông tin hữu ích), không minh hoạ AI |
| S-01 | Mọi trang cùng khung sidebar + header + lưới card | Khung chung được; nội dung từng trang theo tác vụ (03) |
| S-03 | Mọi khối cùng trọng lượng | Có một điểm nhấn (T3) |
| S-04 | Cùng hiệu ứng "fade-up" mọi khối | ≤ 1 kiểu hiện dần, chỉ khối có lý do (06 §3) |
| S-05 | Mũi tên/chữ "Cuộn xuống" | 1 chỗ, chỉ khi màn đầu không cho thấy còn nội dung |
| S-06 | Mũi tên "→" ở đuôi nút/link (2.8, theo huashu-design) | 1 kiểu nút (ví dụ link "xem thêm"); không gắn vào mọi nút |
| S-07 | Tô màu/gradient một cụm trong tiêu đề (2.8) | ≤ 1 tiêu đề mỗi trang (thường hero); cụm mang nghĩa, không phải từ ngẫu nhiên; tương phản đạt ở mọi điểm |
| S-08 | Đánh số 01/02/03 cho nội dung không phải trình tự (2.8) | Chỉ khi là trình tự thật (bước, thứ hạng, mốc thời gian) |
| S-09 | Nối "A · B · C" bằng chấm giữa (2.8) | ≤ 2 chỗ mỗi trang, chỉ cho danh sách ngắn ngang hàng (kicker, siêu dữ liệu) |

### Bậc tự do — quy ước hiện đại, thân thiện (giữ, không cần lý do)

Bo góc mềm 6–16px theo thang; bóng mềm một hướng cho khối nổi (ngăn, menu, hộp thoại); **card nền sáng trên nền ngả tông, viền hoặc bóng nhẹ, cho nhóm có ý nghĩa** (khối làm việc, nhóm thống kê, biểu đồ — không lồng quá 2 cấp); nút và nhãn dạng pill; nhãn/badge màu nhạt với chữ cùng tông; khoảng trắng rộng, nhịp đều; skeleton gần bố cục thật; toast có hoàn tác; phản hồi hover/nhấn ≤ 200ms; chuyển cảnh nhẹ (ngăn trượt, hiện dần ≤ 250ms, tắt khi giảm chuyển động); icon nét đi kèm nhãn; nền trắng ngà/ngả tông rất nhẹ (C < 0,01); avatar chữ cái; trạng thái rỗng có minh hoạ đơn giản không phải người AI; theme tối; ô tìm bo tròn có nền nhạt; nút chính đặc màu nhấn; tiêu đề đậm cỡ lớn ở màn tác vụ.

Bậc tự do vẫn chịu luật nền: tương phản, vùng chạm, focus, token (không viết mã màu rời).

## 5. Quyết định đặc trưng và vân tay

**Quyết định đặc trưng** — bắt buộc cho trang E2–E3 và sản phẩm làn L; tuỳ chọn cho E0–E1:
1. Thấy được ngay ở màn hình đầu;
2. Áp **có hệ thống** ở ≥ 3 chỗ hoặc component;
3. Xuất phát từ nội dung hoặc thương hiệu sản phẩm.

**Vân tay mặc định** — tổ hợp công cụ AI tự hội tụ về. Danh sách thêm DF-7 từ lần chạy Stitch 29/10/2026.

| Mã | Font | Màu nhấn | Bố cục | Mở đầu | Đặc trưng | Hình ảnh |
| --- | --- | --- | --- | --- | --- | --- |
| DF-1 | Inter/Geist | Indigo/violet trên zinc | Sidebar + lưới card | Tiêu đề căn giữa + 2 nút | Pill badge chấm nhấp nháy | Icon Lucide, ảnh chụp giao diện tối |
| DF-2 | Fraunces/Instrument Serif + sans | Terracotta trên giấy kem | Biên tập, kẻ mảnh | Tiêu đề khổng lồ trái | Số mục monospace | Ảnh ánh sáng tự nhiên, grain |
| DF-3 | Geist/Space Grotesk/mono | Xanh neon/lime trên đen | Lưới bento | Tiêu đề + nền lưới chấm | Card viền chạy sáng | Ảnh 3D bóng bẩy |
| DF-4 | Roboto (Flutter mặc định) | Seed tím M3 | Danh sách + FAB | AppBar mặc định | — | Icon Material mặc định |
| DF-5 | Bất kỳ | Gradient tím–hồng | Hero + 3 card | Hero gradient căn giữa | Kính mờ | Blob, minh hoạ AI |
| DF-6 | Be Vietnam Pro/Inter/Roboto | Xanh y tế (teal/blue) trên trắng | Lưới card bo 16 + `shadow-sm` | Banner minh hoạ phẳng | Icon nét đơn trong ô tròn màu nhạt | Minh hoạ phẳng người cao tuổi/bác sĩ |
| DF-7 | Plus Jakarta Sans | Xanh xô thơm + đất nung trên nền ngà ấm | Thanh bên + bảng + ngăn sửa | Vào thẳng công cụ | Pill danh mục, vùng nguy hiểm tô màu | Ảnh sản phẩm nhỏ trong ô |

**Áp cho ai:**
- Làn L: có quyết định đặc trưng **và** khác DF gần nhất ở ≥ 2/6 chiều. Khởi tạo cho sản phẩm không có trang E2–E3: khác DF gần nhất ≥ 2/6 **hoặc** có quyết định đặc trưng. Ghi vào [FINGERPRINTS.md](FINGERPRINTS.md).
- Làn M, màn E0–E2: không đếm chiều; dùng bước "dò mặc định" (§2 bước 5) và T10.
- Trùng DF ở 6/6 chiều mà không có lý do hợp lệ → làm lại (mọi làn).

**Hai giá trị được coi là "khác" khi** (dùng khi đếm):
- **Font:** họ font tiêu đề **hoặc** họ font thân khác.
- **Màu nhấn:** lệch tông > 30° OKLCH; nhấn trung tính (C < 0,03) là một họ riêng.
- **Bố cục, mở đầu, đặc trưng, hình ảnh:** khác nhóm trong danh sách: bố cục (ứng dụng · biên tập · danh mục/lưới · bảng dày · kể chuyện · một tiêu điểm · tài liệu); mở đầu (căn giữa · trái + sản phẩm phải · ảnh/video toàn màn · vào thẳng công cụ · chữ lớn không ảnh); hình ảnh (ảnh giao diện thật · ảnh chụp thật · sơ đồ/dữ liệu · chỉ chữ · minh hoạ · minh hoạ đặt vẽ); đặc trưng (chữ · hình học/đường nét · màu/chất liệu · chuyển động/tương tác · dữ liệu/nội dung · không có).

## 6. Đừng gọt quá tay, đừng làm lạ quá tay

- **Gọt quá tay:** bỏ mọi nền màu, bóng, bo góc, nhãn màu chỉ để "không giống AI" → màn hình khô, khó quét. Dấu hiệu: ảnh làm mờ 8px của bản sau gọt **phẳng hơn** bản mẫu mà không có điểm nhấn mới; người dùng hoặc PO nói "thô", "lạnh". Phát hiện mức **major** khi PO/người dùng xác nhận.
- Font "lạ" chỉ để khác, đọc kém hoặc thiếu dấu tiếng Việt.
- Bất đối xứng, chồng lớp, phá lưới ở màn hình tác vụ.
- Brutalism, tương phản gắt, con trỏ tuỳ biến ở sản phẩm hạng A/B.
- Bỏ quy ước nền tảng để "khác biệt".
- Hiệu ứng vượt mức biểu cảm của trang.

## 7. Phép thử

Người duyệt (01 §4) làm ở G2 và G5, kết luận **bằng mắt trước**, rồi mới xem kết quả máy.

| # | Phép thử | Cách làm | Ở cổng |
| --- | --- | --- | --- |
| T1 | So với mặc định | Đặt cạnh bản mẫu thô của công cụ (hoặc thư viện để nguyên). Liệt kê ≥ 3 khác biệt thấy được ở ảnh 320/360px, mỗi khác biệt chỉ về một dòng trong bảng gọt hoặc thẻ hướng | G2, G5 |
| T2 | Đổi đối thủ | Thay tên sản phẩm bằng tên đối thủ, câu tiêu đề còn đúng không? (phải là không) — chỉ trang tiếp thị | G5 |
| T3 | Một điểm nhấn | Ảnh làm mờ 8px **của bản đã dựng**: khoanh được một điểm nổi nhất, là thứ quan trọng nhất theo brief **và** là khối ghi "điểm nhấn" trong bảng vai trò khối (10 §2) | G2, G5 |
| T4 | Quyết định đặc trưng | Đạt 3 điều kiện §5 (E2–E3, làn L) | G2, G5 |
| T5 | Bố cục từ tác vụ | Mỗi khối gắn với một câu hỏi của người dùng (03) | G5 |
| T6 | Chữ của người trong nghề | Đúng thuật ngữ, chính tả, viết hoa; không văn sáo | G5 |
| T7 | Dữ liệu thật | Không lorem, tên giả, số bịa, lời chứng thực giả | G2, G5 |
| T8 | Trang trí có nghĩa | Bỏ thử từng chi tiết **vượt liều**: mất gì không? Không mất thì giảm. Chi tiết bậc tự do không cần qua phép này | G5 |
| T9 | Không lộ trạng thái kỹ thuật | | G5 |
| T10 | Liều lượng | Bậc cấm = 0 (mọi mức). Bậc tiết chế: mỗi dấu hiệu trong liều hoặc có lý do; ≥ 3 vượt liều không lý do = major | G2, G5 |
| T12 | **Không gọt quá tay** | Đặt ảnh làm mờ bản mẫu thô (**cùng loại trang**, §2 bước 1) cạnh bản đã gọt: bản gọt vẫn có phân cấp, điểm nhấn, độ ấm; bảng gọt có ≥ 3 "điểm tốt giữ lại" và mỗi chỗ bỏ có thứ thay | G2, G5 |
| T13 | **Độ hoàn thiện hình ảnh** (2.5, E2–E3) | Đặt ảnh 1440 của bản dựng cạnh bản mẫu nguồn (ảnh Stitch, block) **không làm mờ**: bản dựng không được kém hơn về hình ảnh (ảnh thật/tài nguyên vs hình tự vẽ thô), ánh sáng vật liệu 3D, màu sắc và chuyển cảnh. 2.7: thiếu bảng tham chiếu (§2 bước 1) hoặc bảng màu không lấy từ đề tài mà không có lý do → trượt. 2.6: thêm **độ động** — mở bản chạy được, rê chuột, cuộn, bấm lựa chọn: cảnh 3D phản hồi ≥ 2 kiểu (06 §6); **màu** — có màu nhấn phụ và dải màu thương hiệu (04 §3). Kém ở mục nào → thay bằng tài nguyên thật (04 §6) hoặc nâng cảnh (06 §6), không chỉ ghi chú | G2, G5 |
| T11 | Xếp hàng mù (tuỳ chọn, làn L, E2–E3) | 2 công cụ AI tạo 3 trang từ cùng mô tả; trộn với trang mình; 2 người ngoài chọn trang "thiết kế cho sản phẩm cụ thể" | G5 |

**Kết luận**
- Mọi mức: T7, T9, T10 (bậc cấm) là cổng cứng. T12 trượt (người duyệt kết luận) → **Major**; PO/người dùng đã nói "thô", "lạnh" → cổng cứng, làm lại phần thị giác.
- E2–E3: thêm T1, T4, **T13** cổng cứng; các phép còn lại trượt quá 2 → làm lại.
- E0: T3, T6, T7, T9, T10, T12 và checklist [04 §11](04_NEN_TANG.md#11-mặc-định-e0). E1: như E0 trừ checklist 04 §11 (thay bằng tiêu chí "cảm giác thị giác" ở 11 §10). T1 chỉ ghi nhận (không cổng).
- G2: 2 hướng khác nhau thấy được ở ≥ 2 trong {màu nhấn, font, bề mặt, bố cục}; mỗi hướng kèm bảng gọt. Một hướng là đủ cho Khởi tạo không có trang E2–E3 và cho nhóm b2 của 11. Sản phẩm có cả màn E0–E1 và E2–E3: mỗi hướng gồm một màn E2–E3 và một khối chính của màn E0–E1, cùng token; T4 xét trên phần E2–E3.

## 8. Máy phát hiện được gì

Máy chỉ bắt dấu hiệu bề mặt. `audit.mjs --impeccable` ghi mã 07 cho luật trùng §4 ([12 §5.4](12_BAN_DO_CONG_CU.md#54-impeccable-dùng-detect-không-cài-skill-tự-kích-hoạt)):
- Phát hiện thuộc **bậc tiết chế** là **thông tin liều lượng (minor)**: người duyệt xem có vượt liều không; trong liều thì ghi "trong liều", không sửa. Ví dụ `overused-font` ở màn E0–E1 là trong liều.
- Phát hiện thuộc **bậc cấm** (văn sáo, emoji trong nhãn…) máy vẫn báo **Minor** kèm nhãn "bậc cấm — người duyệt xác nhận" (luật kinh nghiệm, dễ báo nhầm); người duyệt xác nhận đúng thì tính **Major**. Lorem, trạng thái kỹ thuật lộ ra do luật DOM riêng của `audit.mjs` báo (W10, Major).
- Máy không biết brief, không đo được T3, T12, liều theo ngữ cảnh → người duyệt kết luận. Máy chỉ chuẩn bị bằng chứng: ảnh làm mờ 8px (`*_T3-blur8.png`, trạng thái đầu, 320 và 1440, theme sáng).
- Mã trong các file chuẩn phải có trong §4: `node scripts/check_codes.mjs` (2.4) báo mã treo — chạy mỗi khi đổi danh mục §4.
