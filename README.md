# Design Standard

Bộ chuẩn UI/UX và quality gate dành cho agent. Mục tiêu là biến quy tắc thành kiểm tra lặp lại được, không dựa vào việc agent “nhớ làm”.

## Bắt đầu trong 2 phút

```bash
npm ci
npm test
npm run verify
```

Agent bắt đầu từ [AGENTS.md](AGENTS.md). Ngưỡng chặn nằm ở [CONSTRAINTS.md](CONSTRAINTS.md). Quy trình ngắn nằm ở [docs/PROCESS.md](docs/PROCESS.md); tài liệu chi tiết chỉ mở theo [docs/REFERENCE_MAP.md](docs/REFERENCE_MAP.md).

## Ba lớp cưỡng chế

```text
AGENTS.md + CONSTRAINTS.md
          ↓
test + verifier + audit fail-closed
          ↓
required CI + branch protection
```

Local hook chỉ phản hồi sớm; GitHub required checks mới là ranh giới merge. Policy không kiểm soát mọi câu trả lời hay admin thay đổi Settings; nó chỉ cưỡng chế thay đổi đi qua đường merge đã bảo vệ.

## Lệnh

| Lệnh | Mục đích |
| --- | --- |
| `npm test` | Test assertion cho policy và tool |
| `npm run check:policy` | Kiểm nguồn policy, adapter, schema, workflow |
| `npm run verify` | Gate bắt buộc trước commit/push |
| `node design_standard/scripts/audit.mjs ...` | Audit UI đầy đủ, fail khi còn blocker/major |
| `node design_standard/scripts/verify-project.mjs ...` | Kiểm manifest và coverage của source thay đổi |

## Thiết lập GitHub

| Chế độ | Bắt buộc |
| --- | --- |
| Mọi repo | PR, `verify` + `guard`, strict, áp dụng cho admin, resolve conversation; cấm force-push/xóa nhánh |
| Có reviewer độc lập | Thêm reviewer vào `CODEOWNERS`, rồi bật 1 approval không phải tác giả, CODEOWNER, dismiss stale và approval sau push cuối |
| 1 maintainer | Không bật review gây deadlock; ghi rõ chưa có review độc lập và không tuyên bố G5 đã đóng |

`CODEOWNERS` chỉ chọn người duyệt; nó không cưỡng chế khi branch protection chưa bật. Chủ repo vẫn có thể đổi Settings/API, nên không tồn tại bảo đảm “100% mọi agent, mọi lúc”.

Sau PR bootstrap được người thật review và merge, trust root (checker, test, workflow, npm config) đổi theo hai PR: PR 1 chỉ thêm SHA-256 mới vào `.github/trusted-policy.json`; PR 2 mới đổi file. Guard dùng manifest từ base, nên từ thời điểm đó một PR không thể vừa tự cấp hash vừa thay checker. PR bootstrap là trust-on-first-use, không được mô tả là đã có bảo vệ này.
