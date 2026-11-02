# 09 · Công cụ và CI

## Một đường kiểm duy nhất

```text
test/build dự án → token → gate files → audit đầy đủ → CI → review
```

`design.config.json` phải khai:

- `verify.commands`: lệnh test/build thật của dự án;
- `tokens`, `preview.url`, `preview.command`;
- mọi `screens`, mỗi màn có `source`, `ready`, `states`, type, tier, expression;
- `gates` khi có màn E2/E3.

Chạy:

```bash
node design_standard/scripts/verify-project.mjs \
  --config design.config.json \
  --changed-from origin/main \
  --run
```

Lệnh trên fail khi test/build, token, gate, source coverage hoặc audit thất bại. Preview phải chạy bằng `preview.command` trước khi gọi.

## Script

| Script | Vai trò | Điều kiện xanh |
| --- | --- | --- |
| `verify-project.mjs` | Điều phối toàn bộ kiểm tra dự án | Mọi bước đạt |
| `check_tokens.mjs` | Tương phản token | Không lỗi theo hạng |
| `check_gates.mjs` | Artifact G1/G2/sự thật | File và ảnh tồn tại |
| `audit.mjs` | Browser, axe, states, responsive, motion | 0 blocker, 0 major, không thiếu kiểm máy bắt buộc |
| `verify-repo.mjs` | Tính toàn vẹn của bộ chuẩn | 0 lỗi policy/schema/workflow |
| `install_hooks.mjs` | Phản hồi sớm trước push | Không thay thế required CI |

Baseline và local waiver chỉ nhận minor. Không có cờ làm audit rút gọn. Thiếu Playwright/axe/preview là lỗi, không phải cảnh báo.

## CI và bảo vệ nhánh

Workflow bắt buộc chạy trên PR và push `main`:

1. checkout;
2. `npm ci`;
3. `npm run verify`;
4. với repo tiêu thụ: khởi động preview rồi chạy `verify-project.mjs --run`.

GitHub phải yêu cầu `verify` + `guard`, strict, áp dụng cho admin và cấm force-push/xóa nhánh. Chỉ bật approval/CODEOWNER sau khi đã thêm reviewer độc lập vào `CODEOWNERS`; repo một maintainer không được ghi G5 đã đóng. Sau bootstrap, checker/test/workflow/npm config nằm trong trust manifest và đổi qua hai PR; local hook không phải ranh giới bảo mật.

## Hook

```bash
node design_standard/scripts/install_hooks.mjs --project <thư mục có design.config.json>
```

Hook fail-closed khi thiếu Node, config, preview hoặc checker. Không có biến bỏ qua được hỗ trợ. Nếu hook không phù hợp môi trường, giữ CI làm nguồn phán quyết và sửa môi trường thay vì tắt gate.
