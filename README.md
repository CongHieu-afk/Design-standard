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
required CI + CODEOWNERS + branch protection
```

Local hook chỉ phản hồi sớm; GitHub required checks mới là ranh giới merge. Không có cấu hình nào bảo đảm agent tuân thủ mọi câu trả lời, nhưng thay đổi không qua gate thì không được merge.

## Lệnh

| Lệnh | Mục đích |
| --- | --- |
| `npm test` | Test assertion cho policy và tool |
| `npm run check:policy` | Kiểm nguồn policy, adapter, schema, workflow |
| `npm run verify` | Gate bắt buộc trước commit/push |
| `node design_standard/scripts/audit.mjs ...` | Audit UI đầy đủ, fail khi còn blocker/major |
| `node design_standard/scripts/verify-project.mjs ...` | Kiểm manifest và coverage của source thay đổi |

## Thiết lập GitHub bắt buộc

Sau lần push đầu, bảo vệ `main`: yêu cầu check `verify`, ít nhất một approval, CODEOWNER approval; cấm force-push, xóa nhánh và bypass nếu tài khoản cho phép.

Repo không thể tự bật branch protection chỉ bằng file; chủ repo phải bật trong Settings hoặc API GitHub.
