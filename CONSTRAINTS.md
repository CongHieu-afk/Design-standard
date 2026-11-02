# Quality constraints

Cập nhật: 2026-11-02

## Luôn chặn

- Không secret trong source hoặc diff.
- Không test bị skip/xóa, assertion bị giảm, checker bị tắt hoặc ngưỡng bị nới để đạt xanh.
- Không stub chưa hoàn tất, empty catch che lỗi hoặc suppress comment mới không có phê duyệt.
- Không blocker/major trong baseline hay ngoại lệ cục bộ.
- Không màn hình/source UI thay đổi nằm ngoài `design.config.json`.
- Không commit khi `npm test` đỏ; không push khi `npm run verify` đỏ.

## Ngưỡng máy thực thi

| Hạng mục | Ngưỡng | Lệnh |
| --- | --- | --- |
| Governance tests | 100% test đạt, không skip | `npm test` |
| Policy integrity | 0 lỗi | `npm run check:policy` |
| UI audit | 0 blocker, 0 major, 0 kiểm máy bắt buộc bị bỏ | `audit.mjs` |
| Baseline | Chỉ chứa minor | `audit.mjs --update-baseline` |
| Gate files | Đủ file và artifact tồn tại | `check_gates.mjs` |

## Ngoại lệ

Chỉ minor được ngoại lệ. Mỗi ngoại lệ cần lý do, owner dạng GitHub handle, ngày hết hạn tối đa 365 ngày và link GitHub issue/PR có phê duyệt. Agent không được tự tạo phê duyệt cho thay đổi của mình.

Không sửa file này trong cùng thay đổi chỉ để làm kiểm tra đang đỏ chuyển xanh.
