# Đánh giá công cụ và quy trình design_standard@1.2 — 28/10/2026

Nguồn bằng chứng: các lần chạy thật trong phiên Claude Code 28/10/2026 (ghi ở `handoffs/design_standard.md`):
- `audit.mjs` trên `examples/rang-moc` (D2);
- mẫu Flutter trên `CareAI/companion_app` `RoleSelectionScreen` (D4);
- `audit.mjs` + sửa trên trang danh sách Lab02 (`D:\IT\FA26\PRN232\LAB\Lab02\frontend`, bản mẫu `Lab02_frontend_mau_da_sua`).

Mỗi nhận định ghi bằng chứng. Mục nào là suy luận chưa kiểm thì ghi "Rủi ro (chưa quan sát)". Mục chỉ có bằng chứng là quan sát trong phiên (không có file lưu lại) thì ghi "(quan sát phiên)".

Cột "Ưu tiên" ở §2–4 là thứ tự nên sửa **công cụ/quy trình**, không phải mức nghiêm trọng blocker/major/minor của 08 §2 (thang đó dành cho lỗi giao diện).

Bản này đã sửa theo phản biện độc lập vòng 1 (kiểm chứng từng dòng với mã nguồn): A3, A6, A7, A11, F-b, §1 ý 3 được chỉnh; A12 được thêm. Vòng 2: xem §5b.

## 1. Kết luận ngắn

1. **Công cụ tự động đúng ở phần nó đo, nhưng phạm vi hẹp hơn cách báo cáo trình bày.** "0 blocker / 0 major / 0 minor" chỉ nói các luật máy đo được không vi phạm, ở một trạng thái, trên một URL. Trên Lab02, bản "đã sửa theo tool" đạt 0/0/0 mà người dùng nhìn không thấy khác bản gốc. Các mục bắt buộc của loại trang `list` thì chưa làm mục nào.
2. **Quy trình 01 mô tả việc *xây* (làn S/M/L), không có luồng *đánh giá và cải thiện màn hình có sẵn*.** Thiếu luồng này, agent (chính phiên này) đã đi theo thứ tự sai: sửa theo tool trước, xét yêu cầu loại trang sau, chưa chạy phép thử chống slop.
3. **Chống slop chỉ nằm trên giấy ở các lần chạy này.** Không lần nào chạy 07 §4. Bản mẫu Lab02 giữ giao diện shadcn mặc định (G2-01: nhấn indigo trên nền slate, card `rounded-xl` + viền + `shadow-sm`; Lucide mặc định). Theo 07 §4, kết luận E0 (T10 giới hạn ở G2-01, G2-14, G2-15, G3-12; trượt bất kỳ → sửa trước bàn giao), bản này **chưa đạt**. (So sánh vân tay DF ≥ 3/6 chiều chỉ bắt buộc cho làn L và Khởi tạo, nên không dùng làm căn cứ ở đây.)
4. **Phần lớn công sức đổ vào dựng môi trường, không vào kiểm định.** Bộ chuẩn không có bước chuẩn bị môi trường.

## 2. Công cụ `audit.mjs`

| # | Vấn đề | Bằng chứng | Hệ quả | Ưu tiên |
| --- | --- | --- | --- | --- |
| A1 | Báo cáo axe chỉ lưu `target` + `help`, bỏ `failureSummary`, `html`, số đo tương phản | `audit.mjs:314`. Phải viết thêm `audit_out/lab02/axe_detail.mjs` mới biết 3,76:1 / 2,39:1 / 3,72:1 | Không sửa được nếu không chạy lại công cụ khác | Cao |
| A2 | `audit.mjs` tự gắn `data-audit-idx` khi duyệt Tab, **trước** khi chạy axe → selector của axe chứa thuộc tính do chính tool thêm vào | `audit.mjs:283, 309`. Báo cáo Lab02 gốc có `button[data-audit-idx="6"]` | ID phát hiện phụ thuộc thứ tự Tab, baseline dễ lệch giữa các lần chạy | Cao |
| A3 | Đếm theo nút DOM, không theo nguyên nhân; cắt 5 nút đầu mỗi luật axe | `audit.mjs:314` (`slice(0, 5)`). Lab02 gốc: "8 blocker" = 2 `label-content-name-mismatch` + 6 `color-contrast` (badge, "Đăng xuất" tối, 4 ô mã SP) = 4 nguyên nhân. Mã SP có 9 ô lỗi, báo cáo ghi 4 vì "Đăng xuất" chiếm một suất trong 5 | Con số vừa phóng đại (8 thay vì 4 nguyên nhân) vừa giấu bớt (4/9 ô) | Trung bình |
| A12 | Tên phần tử cắt ở 30 ký tự rồi dùng làm ID phát hiện → các phần tử khác nhau bị gộp | `audit.mjs:188` (`slice(0, 30)`). "Sửa thông tin sản phẩm PL00960" dài đúng 30 ký tự → 9 nút Sửa (PL009601…09) thành **1** dòng trong báo cáo gốc | Số vùng chạm lỗi bị giấu (báo 11 dòng, thực tế khoảng 19 phần tử); baseline có thể bỏ sót lỗi mới cùng tiền tố | Cao |
| A4 | Chỉ kiểm **trạng thái đầu** của **một URL**: không mở dialog, không kiểm trạng thái rỗng/lỗi/đang tải, không hover | Hộp đăng nhập Lab02 có "Staff" `text-amber-500`, "Member" `text-blue-500` trên nền trắng, chưa từng được quét | Lỗi nằm ở dialog/trạng thái phụ lọt hoàn toàn | Cao |
| A5 | Không có "điều kiện sẵn sàng" | Chỉ chờ `load` + `networkidle` 5s (`audit.mjs:159–160`). Rủi ro (chưa quan sát): API chậm thì kiểm trên khung xương, trang trống vẫn "đạt" | 0/0/0 giả | Cao |
| A6 | Không kiểm yêu cầu loại trang (03), mặc định E0 (04 §11), slop (07) | 03 `list` có 8 gạch đầu dòng "Bắt buộc" (đếm 03_LOAI_TRANG.md dòng 96–103); tool không chạm mục nào; báo cáo không liệt kê chúng ở "Chưa kiểm". Duyệt độc lập (§5) tìm 12 major ngoài tầm tool | Đọc "0/0/0" như "đạt chuẩn" | Cao |
| A7 | Theme tối chỉ giả lập `prefers-color-scheme` | `audit.mjs:142`. Rủi ro (chưa quan sát): app nào **ép** theme bằng `localStorage` sẽ bị kiểm sai theme mà tool không báo. Với Lab02 (`App.jsx:39`: `theme==='dark' \|\| matchMedia(...)`), chỉ khoá `theme=dark` trong file phiên mới làm lệch; file phiên tự dựng chỉ có 3 khoá `cosmetics_*` (quan sát phiên, file đã xoá) | Kiểm nhầm theme mà không báo | Trung bình |
| A8 | `W10` (thuật ngữ nội bộ) chỉ là regex cố định, lấy kết quả khớp đầu tiên | `audit.mjs:30, 263`. Lab02 hiện "OData & RBAC API", "(OData Sort)", "Mặc định từ CSDL", "Kết nối: http://localhost:5253", footer "ASP.NET Core 9 LTS & React Tailwind" → tool không báo | T9 "không lộ trạng thái kỹ thuật" bị coi là đạt | Trung bình |
| A9 | Phiên đăng nhập: tài liệu chỉ gợi ý `codegen`, không nói file chứa token đặt ở đâu, xoá khi nào | Phiên này phải tự dựng `storageState` từ API login và xoá tay 3 lần | Token rơi vãi; dễ commit nhầm | Trung bình |
| A10 | Không có dữ liệu kiểm thử theo trạng thái | Lab02 chỉ có 9 bản ghi → phân trang chưa thử; 03 yêu cầu thử 0, 1, 10.000 bản ghi, tên rất dài | Mục "Kiểm riêng" của 03 không làm được bằng tool | Trung bình |
| A11 | Những gì đã đúng | Bản gốc: phát hiện thật 3 lỗi tương phản, 2 tên trợ năng sai, 11 dòng `target-size`, 1 line-height (`goc/audit_report.md`). Vòng bố cục: bắt đúng tràn ngang 5px ở 320 và line-height 1,43 do chính bản sửa gây ra (quan sát phiên — báo cáo bị lần chạy sau ghi đè trong cùng thư mục `sua_bocuc/`; đây cũng là lỗi quy trình, xem 11 §6) | Vòng "sửa → chạy lại" có giá trị thật | — |

## 3. Mẫu Flutter (`flutter_ui_standard_test.dart.tmpl`)

| # | Vấn đề | Bằng chứng | Ưu tiên |
| --- | --- | --- | --- |
| F-a | `textContrastGuideline` **bỏ qua im lặng** chữ có ngữ nghĩa bị gộp | "Chăm sóc gia đình" (4,43:1) trong `CareAiBrand` gộp nhãn `"CareAI\nChăm sóc gia đình"` → `find.text` không khớp → không đo (`flutter_test/lib/src/accessibility.dart:369–372`). Đặt riêng thì bị bắt | Cao |
| F-b | Mẫu đặt khung 360×800 cho test vùng chạm/textScaler; test tương phản không đặt khung nên dùng mặc định 800×600 của `flutter_test`. Cả hai không chứa hết màn hình cuộn; phần ngoài khung không được vẽ nên không bị kiểm | D4: dòng chú thích cuối màn hình không được đo | Cao |
| F-c | Mẫu import `flutter_localizations` vô điều kiện | `companion_app` không có gói này | Thấp |
| F-d | Không nạp font thật → test đo bằng font Ahem | Phải chép bước nạp font từ `facare_ui_test.dart` | Trung bình |
| F-e | Golden lần đầu cần `--update-goldens` nhưng không nói ai duyệt ảnh gốc | D4: 2 golden lỗi "không có file" | Thấp |

Bản chạy được đã sửa F-a, F-b: `CareAI/companion_app/test/ui_standard/text_contrast_scan.dart` và `role_selection_test.dart`.

## 4. Quy trình (01, 08) và cách phiên này đã làm

Bằng chứng P1–P7 là quan sát trong phiên, ghi ở `handoffs/design_standard.md`.

| # | Vấn đề | Bằng chứng | Ưu tiên |
| --- | --- | --- | --- |
| P1 | Không có luồng "đánh giá + cải thiện màn hình có sẵn". Làn S/M/L giả định đang xây | Yêu cầu "đánh giá trang danh sách và tạo bản mẫu đã sửa" không khớp làn nào; agent tự chọn S | Cao |
| P2 | Thứ tự sai: sửa theo tool (vòng 1) trước, yêu cầu loại trang (vòng 2) sau, slop không làm | Người dùng: "bản sửa không khác bản gốc" | Cao |
| P3 | Người làm tự đánh giá kết quả của mình | 01 §4 cấm; vòng 1–2 Lab02 do cùng một agent làm và tự kết luận "0/0/0" | Cao |
| P4 | Không có bước chuẩn bị môi trường | Lab02: junction `Lab02 → LAB\Lab02` làm Vite lỗi; `appsettings` trỏ `(local)` không tồn tại; tiến trình nền bị dọn khi lệnh kết thúc; đường dẫn > 260 ký tự | Trung bình |
| P5 | Không có quy tắc so sánh trước/sau cho người xem | Phải dựng `so_sanh.html` sau khi người dùng phàn nàn | Trung bình |
| P6 | "Hiện đại" không được định nghĩa thành tiêu chí kiểm được | 07 nói cái gì là slop; không nói "hiện đại" đo bằng gì → dễ trượt về "thêm trang trí" hoặc "giữ mặc định" | Trung bình |
| P7 | Thiếu brief → phép thử dựa vào brief (T1, T2, T4, lý do hợp lệ) không áp được, nhưng không ai ghi điều đó | Lab02, CareAI đều không có brief đã duyệt | Trung bình |

## 5. Phát hiện của người duyệt độc lập (bản mẫu Lab02)

Một phiên agent mới duyệt theo [10 §7](10_MAU.md#7-lệnh-cho-agent-duyệt-độc-lập). Agent này chỉ nhận phân loại, code và ảnh, không nhận lịch sử sửa. Bản mẫu sau 2 vòng sửa được `audit.mjs` báo **0/0/0**; người duyệt tìm ra **0 blocker, 12 major, khoảng 15 minor**. Người làm đã tự kiểm lại các mục đánh dấu ✔ bằng code.

Các major tiêu biểu, đều nằm ngoài tầm của công cụ:
- ✔ 3 dialog tự dựng `div role="dialog"`: không Escape, không giữ/trả focus. Rủi ro thành blocker khi thử bàn phím thật (04 §10).
- ✔ Xoá lỗi bị nuốt: `formError` chỉ hiện trong dialog thêm/sửa, dialog xoá không hiện.
- ✔ Nhãn sai sự thật: "OData Sort", "đồng bộ qua OData 9.2". Code gọi REST không query và sắp xếp phía client. ".NET 9 LTS" cũng sai: .NET 9 là STS.
- Lộ thông tin kỹ thuật/dev: "Kết nối: http://localhost:5253" là chuỗi tĩnh tô xanh như trạng thái thật; form đăng nhập điền sẵn tài khoản admin (T9, G2-12).
- Giữ nguyên giao diện shadcn (G2-01), trùng DF-1 ở 4/6 chiều. Màu viết cứng ngoài token: emerald, amber, blue.
- T3 trượt: điểm nổi nhất khi nheo mắt là cột 9 nút "Xóa" đỏ đặc, không phải dữ liệu.
- Tìm kiếm không bỏ dấu (05).
- Hạng B thiếu: chọn nhiều, phím tắt, xem đã lưu, hoàn tác xoá. Đây là tính năng, không phải "sửa".
- Minor: Title Case tiếng Việt (G2-10); `font-bold` 700 trong bảng; ≥ 4 màu chữ mỗi dòng; dòng bảng ≈ 77px; mép trái lệch; ✔ Inter được tải nhưng không khai `fontFamily` nên không dùng; forced-colors làm mất viền nút đặc.

Kết luận của người duyệt: làn S và M đều **chưa xong**. Điều này xác nhận P2, P3, A6: **"0/0/0" của công cụ không phải bằng chứng đạt.** Nó cũng cho thấy duyệt độc lập (01 §4) có giá trị thật, không phải thủ tục.

## 5b. Các vòng phản biện quy trình 11

| Vòng | Cách làm | Sửa chính |
| --- | --- | --- |
| 1 | Agent mới đối chiếu từng nhận định của file này với mã nguồn; đối chiếu 11 với 01/07/08/AGENTS | Sửa số sai (A3, A6, A11), thêm A12. Ở 11: nhóm bắt buộc gồm blocker/major ở **mọi lớp**; không tự định nghĩa lại "xong" (chuyển thành đề xuất cho 08 §5); bịt 4 cách gian lận (baseline, chỉ làm nhóm vô hình, "chưa kiểm" vô hạn, major bỏ mặc); đổi "hiện đại" thành "chất lượng nền" có phạm vi và mã |
| 2 | Agent mới khác chạy thử 11 trên giấy với Lab02 | §4 bản trước **dẫn lại đúng lỗi P2**: chạy không tương tác thì chỉ sửa phần vô hình và dán nhãn "Chưa đạt". Sửa:<br>• tách "thiếu chức năng" ra khỏi nhóm bắt buộc, vì agent chỉ được đề xuất ngoại lệ;<br>• kết luận E0 của 07 §4 (T3, T6, T9, 04 §11, T10) thành nhóm bắt buộc b;<br>• b2 (đổi giao diện mặc định) đi kèm brief nháp và hướng nháp có ảnh để PO duyệt một lần, kèm câu nói thẳng "chỉ làm a + b1 thì trông gần như cũ";<br>• trạng thái "Dừng ở G2" không còn được tính là xong;<br>• cấm thử đường lỗi trên dữ liệu thật;<br>• lối thoát khi không dựng được backend;<br>• đề xuất nâng W17 ở E0 lên Major để khớp 07 §4 |

**Giới hạn còn lại (không che):**
- Quy trình 11 mới được **chạy thử trên giấy**, chưa chạy thật trọn một vòng. Lần dùng thật đầu tiên phải ghi lại chỗ vướng.
- (Cập nhật 29/10) Các việc công cụ ở §6 đã làm ở 2.0 (§7).
- Mọi vòng phản biện đều do agent (cùng họ mô hình với người làm), chưa có người thật duyệt. Vì vậy 11 và 12 mang nhãn "hiệu lực tạm", chờ người thật duyệt (sổ, D12).
- Bản mẫu Lab02 hiện **chưa đạt** theo chính 11 (nhóm a còn dialog/Escape, lỗi xoá bị nuốt, nhãn OData sai; nhóm b chưa làm).

## 6. Việc đề xuất cho công cụ (đề xuất ngày 28/10; đã làm ở 2.0, xem §7)

| Ưu tiên | Việc | Sửa vấn đề |
| --- | --- | --- |
| 1 | `audit.mjs`: lưu `html`, `failureSummary`, `any[].data` (tỉ lệ, màu chữ/nền) của axe vào JSON và một cột "Chi tiết" trong md | A1 |
| 1 | Chạy axe **trước** vòng Tab, hoặc xoá `data-audit-idx` trước khi chạy axe; ID phát hiện dựa trên luật + vai trò + tên trợ năng, không dựa selector | A2 |
| 1 | Config màn hình thêm `ready` (selector phải xuất hiện, ví dụ `table tbody tr`) và `states` (danh sách bước Playwright: bấm mở dialog, nhập lọc rỗng, chặn API trả lỗi/0 bản ghi qua `page.route` với fixture) | A4, A5, A10 |
| 1 | Báo cáo luôn in mục "Yêu cầu loại trang `<type>` chưa kiểm" (lấy từ 03) và "Phép thử 07 §4 cho mức `<Ex>` chưa làm" | A6 |
| 2 | Đếm theo nguyên nhân (luật + giá trị màu/kích thước), kèm "N phần tử"; bỏ `slice(0,5)` ở số đếm | A3 |
| 2 | Config thêm `theme.setup` (ví dụ `localStorage.theme=dark`) | A7 |
| 2 | Cho phép danh sách thuật ngữ nội bộ của dự án trong config (`internalTerms`) | A8 |
| 2 | Lệnh `audit.mjs login --url … --email-env … --password-env …` ghi phiên vào thư mục tạm của hệ điều hành và in đường dẫn; báo cáo nhắc xoá | A9 |
| 1 | ID phát hiện không dùng tên cắt 30 ký tự; dùng tên đầy đủ (hoặc băm) + vai trò | A12 |
| 2 | Mẫu Flutter: chép `text_contrast_scan.dart` vào `design_standard/scripts/`, khung đủ cao + kiểm `maxScrollExtent == 0`, nạp font, bỏ import bắt buộc; ghi ai duyệt golden lần đầu (người duyệt theo 01 §4, kèm ảnh) | F-a…F-e |
| 2 | `--out` mặc định thêm dấu thời gian, không ghi đè báo cáo cũ | A11, 11 §6 |

## 7. Đã sửa ở 2.0 (29/10/2026)

| Mục | Cách sửa | Kiểm |
| --- | --- | --- |
| A1 | Lưu tỉ lệ, màu chữ/nền, cỡ chữ, html, `failureSummary` vào cột "Chi tiết" và JSON | Lab02: "4.38:1 (cần 4.5:1) chữ #d31212 nền #f4e3e5" |
| A2 | axe chạy trước Tab; Tab dùng `WeakMap`, không ghi `data-audit-idx` | Chạy lại: selector không còn thuộc tính của tool |
| A3 | Gộp theo nguyên nhân (tương phản: cặp màu; luật khác: phần tử), cột "Phần tử", bỏ `slice(0,5)` | Bảng tổng có cột nguyên nhân + phần tử |
| A4, A5, A10 | `ready`, `states`, `route`, `initStorage`, `"dialog": true` | Lab02 bằng fixture, không backend: 5 trạng thái, bắt lỗi dialog |
| A6 | Mục "Chưa kiểm" luôn in yêu cầu loại trang, phép thử 07 §4 theo mức, trạng thái/dialog chưa khai báo | Có trong cả hai báo cáo thử |
| A7 | `themeStorage` | Lab02 dùng `theme` trong localStorage |
| A8 | `internalTerms`; mọi cụm, không chỉ cụm đầu | Lab02: OData, RBAC, CSDL, ASP.NET, LTS, `localhost:` |
| A9 | Cảnh báo khi file phiên nằm trong thư mục dự án; `initStorage` cho token giả thay file phiên khi API là fixture | — (chưa có lệnh `login`) |
| A11 | `--out` mặc định `audit_out/<ngày-giờ>`, từ chối ghi đè trừ `--overwrite` | — |
| A12 | Tên phần tử đầy đủ (≤ 120 ký tự) | — |
| F-a…F-e | Mẫu Flutter + `flutter_text_contrast_scan.dart` | Mẫu mới **chưa** chạy lại |
| P1–P7 | 11 có hiệu lực; 08 §5, AGENTS §3 đã thêm | Chưa chạy thật trọn một vòng 11 |

Còn lại: lệnh `login` (A9), kiểm Tab bị giữ trong dialog, rút cặp màu từ biến CSS cho `check_tokens.mjs`, chạy lại mẫu Flutter.

**Quy trình (P1–P7):** giải quyết bằng [11_DANH_GIA_VA_CAI_THIEN.md](11_DANH_GIA_VA_CAI_THIEN.md) (hiệu lực từ 2.0), cùng các dòng bổ sung vào 08 §5 và AGENTS §3 ở 11 §9. Cụ thể:
- P1, P2: thêm 11 §0, §3, §4.
- P3: thêm 11 §7.
- P4: thêm 11 §2 và Phụ lục A.
- P5: thêm 11 §8.
- P6: thêm 11 §10.
- P7: thêm 11 §1.
01/08/AGENTS đã sửa ở 2.0 (CHANGELOG).
