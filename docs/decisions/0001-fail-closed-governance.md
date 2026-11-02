# ADR-0001: Một policy và gate fail-closed

## Trạng thái

Accepted — 2026-11-02

## Bối cảnh

Các client từng có file luật dài riêng, hook chưa cài, audit trả mã xanh khi còn major và config có thể bỏ phạm vi. Vì vậy tài liệu nói “bắt buộc” nhưng máy không cưỡng chế.

## Quyết định

- `AGENTS.md` là policy duy nhất; file client chỉ là adapter.
- Mọi thay đổi phải chạy test; blocker/major hoặc kiểm máy bắt buộc bị bỏ làm gate đỏ.
- Baseline và local waiver chỉ nhận minor.
- `design.config.json` phải khai `uiRoots`, source coverage, inventory loading/empty/error/dialog và lệnh test/build. Inventory làm giả vẫn cần người duyệt phát hiện; repository không thể suy ra mọi state từ mã.
- Required CI và branch protection là ranh giới merge; CODEOWNER review chỉ bật khi có người duyệt độc lập để không khóa repo một maintainer.
- Sau bootstrap được review thủ công, trust root dùng SHA-256 từ base và đổi qua hai PR: duyệt hash trước, đổi nội dung sau.
- Handoff theo file riêng từng phiên, không dùng một trạng thái `ĐANG MỞ` toàn cục.

## Hệ quả

Một số config cũ phải bổ sung trường. Đổi lại, cùng một thay đổi có kết quả thống nhất giữa client. Giới hạn còn lại: admin có thể đổi Settings và repo một maintainer không có review độc lập; tài liệu không được che hai điểm này.
