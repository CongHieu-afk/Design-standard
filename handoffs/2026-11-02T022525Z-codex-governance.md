# Handoff — governance 3.0

- Agent: Codex
- Phạm vi: hợp nhất policy, verifier, CI, motion runtime và test assertion
- Nhánh: `codex/enforce-governance`

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

## Còn ngoài repo

- Chủ repo phải bật branch protection cho `main`: required checks, CODEOWNER approval, cấm force-push/bypass.
