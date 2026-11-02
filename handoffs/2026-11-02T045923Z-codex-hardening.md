# Handoff — governance hardening
- Trạng thái: ĐANG LÀM
- Agent: Codex
- Phạm vi: state coverage, UI inventory, motion/reduced-motion assertions, policy docs
- Bắt đầu: 2026-11-02

## Việc đang mở
- [x] Viết test tái hiện các đường fail-open.
- [x] Sửa checker/runtime audit và tài liệu tối thiểu; nâng schema phá vỡ tương thích lên 4.0.
- [x] Chạy test sát phạm vi, mutation checks, tự review và Codex CLI; Gemini CLI đã thử nhiều lần nhưng Google trả 503/fetch failed.
- [x] Chạy `npm test`, `npm run verify` sau khi hash mới được pre-authorize.
- [ ] Đi qua trust-root hai PR, kiểm tra CI và merge.

## Nhật ký
- 2026-11-02 — PR trust-root #8 đã merge (`d04b453`); triển khai 4.0 đạt `npm test` 23/23 và `npm run verify`. Đang chờ PR triển khai/CI.
- 2026-11-02 — Test mới bắt root `.`/`..`, mọi phần mở rộng trong `uiRoots`, state inventory, animation hình học/layout hữu hạn và vô hạn, opacity ngắn, token theo vai trò và cleanup. Codex CLI tìm 5 lỗi thực tế; đã sửa. `npm test`: 22/23 đạt, chỉ test trust-root dự kiến đỏ trước PR pre-authorization.
- 2026-11-02 — Bắt đầu từ `origin/main` sau PR #7; không có thay đổi người dùng chưa commit.
