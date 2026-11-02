# ADR-0001: Một policy và gate fail-closed

## Trạng thái

Accepted — 2026-11-02

## Bối cảnh

Các client từng có file luật dài riêng, hook chưa cài, audit trả mã xanh khi còn major và config có thể bỏ phạm vi. Vì vậy tài liệu nói “bắt buộc” nhưng máy không cưỡng chế.

## Quyết định

- `AGENTS.md` là policy duy nhất; file client chỉ là adapter.
- Mọi thay đổi phải chạy test; blocker/major hoặc kiểm máy bắt buộc bị bỏ làm gate đỏ.
- Baseline và local waiver chỉ nhận minor.
- `design.config.json` phải khai source coverage và lệnh test/build.
- Required CI và CODEOWNER review là ranh giới merge; hook local chỉ phản hồi sớm.
- Handoff theo file riêng từng phiên, không dùng một trạng thái `ĐANG MỞ` toàn cục.

## Hệ quả

Một số config cũ phải bổ sung trường. Đổi lại, cùng một thay đổi có kết quả thống nhất giữa client và agent không thể dùng local text để tự phê duyệt.
