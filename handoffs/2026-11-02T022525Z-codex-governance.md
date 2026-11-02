# Handoff — governance 3.0

- Agent: Codex
- Phạm vi: hợp nhất policy, verifier, CI, motion runtime và test assertion
- Bootstrap: PR #3 đã merge; G5 được kiểm chứng trên nhánh `codex/verify-g5`

## Đã làm

- Một nguồn luật `AGENTS.md` + ngưỡng máy ở `CONSTRAINTS.md`; adapter chỉ trỏ về nguồn luật.
- Manifest nối source → screen → state; blocker/major không thể baseline hoặc waiver cục bộ.
- Trusted PR guard, required CI template và hook fail-closed.
- Motion token, lifecycle coordinator, tab/button/dialog primitive trợ năng trong `design_standard/runtime/`.
- Test đơn vị, guard, audit tích hợp và Playwright runtime có assertion thật.

## Kiểm chứng

- `npm test`: 13/13 đạt.
- `npm run check:policy`: đạt.
- `npm run check:syntax`: đạt.
- Mutation baseline minor→major: test đỏ đúng dự kiến; mã đã hoàn nguyên.
- `npm audit`: 0 lỗ hổng.

## Sửa CI sau khi mở PR #1

- GitHub `ubuntu-latest` chuyển sang Ubuntu 26.04, không được Playwright 1.59.1 hỗ trợ.
- Ghim CI chính, policy guard và workflow mẫu về `ubuntu-24.04`.
- Thêm assertion cấm `ubuntu-latest` tái xuất hiện; `npm run verify` đạt sau sửa.

## Gia cố sau phản biện đối kháng

- Codex CLI tìm được bypass marker/no-op, rewire checkout, tăng quyền, sửa checker/test/audit, xóa CI mẫu và chiếm `script-shell`; tất cả đã có mutation test và bị guard chặn.
- Trust root dùng SHA-256 từ base; sau bootstrap, đổi file bảo vệ phải qua hai PR. GitHub Actions pin full commit SHA, checkout không lưu credential, npm lifecycle script bị tắt.
- Policy/docs tách đúng chế độ solo và có reviewer độc lập; `CongHieu-abc` đã được thêm vào `CODEOWNERS` qua PR #4.
- `npm run verify`: 20/20 test đạt; policy và syntax đạt. `git diff --check`: đạt.
- Codex CLI vòng cuối: không còn finding chặn merge. Gemini CLI 0.66.0 không chạy review được vì Google trả `UNSUPPORTED_CLIENT` và yêu cầu chuyển sang Antigravity; không tính là review thành công.
- PR #3: `guard`, `verify`, GitGuardian đều đạt. Required `verify`/`guard` đã pin vào GitHub Actions app ID 15368.
- G5 đã bật: 1 approval, CODEOWNER review, dismiss stale approval và approval cho push mới nhất; PR cập nhật dòng này là phép kiểm độc lập đầu tiên.

## Còn ngoài repo

- Chờ `CongHieu-abc` review và approve PR kiểm chứng G5.
- Admin vẫn có thể đổi GitHub Settings; đây là rủi ro quản trị ngoài phạm vi CI.
