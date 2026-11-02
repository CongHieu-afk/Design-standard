// Bảng tham chiếu bằng ảnh (2.8, mượn ý `ref_board.py` của huashu-design): chụp màn đầu của các trang thật rồi ghép một tấm
// để nhìn tận mắt TRƯỚC khi phân tích — bảng tham chiếu chỉ có link thì dễ "tham chiếu" theo trí nhớ.
// Dùng: node design_standard/scripts/ref_board.mjs --out <ảnh.png> <url-1> <url-2> <url-3> [...]
// Ảnh chụp chỉ để tham khảo nội bộ (ghi vào design-gates/tham-chieu.md), không đưa vào sản phẩm.
import { createRequire } from 'node:module';
import { parseArgs } from 'node:util';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const { values, positionals } = parseArgs({ allowPositionals: true, options: { out: { type: 'string', default: 'ref-board.png' }, width: { type: 'string', default: '1440' } } });
if (positionals.length < 1) { console.error('Cần ít nhất một URL (07 §2: bảng tham chiếu ≥ 3 trang thật).'); process.exit(2); }
const W = Number(values.width), H = Math.round(W * 0.625);

const b = await chromium.launch();
const shots = [];
for (const url of positionals) {
  const p = await b.newPage({ viewport: { width: W, height: H } });
  try {
    await p.goto(url, { waitUntil: 'load', timeout: 30000 });
    await p.waitForTimeout(2500); // để hiệu ứng mở đầu chạy xong
    // Trang chặn bot (Cloudflare…): ghi là bị chặn, KHÔNG tìm cách vượt — người làm mở bằng trình duyệt thật và chụp tay
    const txt = (await p.evaluate(() => document.body?.innerText || '')).slice(0, 2000);
    // Trang gần như không chữ (< 40 ký tự) = trắng hoặc chưa tải: coi như không dùng được (lần 31/10 bỏ sót trang trắng)
    const blocked = /Checking your connection|Verify you are human|Just a moment|Failed to verify your browser|Security Checkpoint|Access Denied|xác minh bạn là người/i.test(txt) || txt.trim().length < 40;
    shots.push({ url, img: (await p.screenshot()).toString('base64'), blocked });
  } catch (e) {
    shots.push({ url, err: e.message.split('\n')[0] });
  }
  await p.close();
}
const cell = (s) => `<figure>${s.img && !s.blocked ? `<img src="data:image/png;base64,${s.img}">` : `<div class=err>${s.blocked ? 'Trang chặn bot — mở bằng trình duyệt thật, chụp tay' : `Không chụp được: ${s.err}`}</div>`}<figcaption>${s.url}</figcaption></figure>`;
const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
await p.setContent(`<body style="margin:0;padding:16px;background:#e5e5e5;font:600 14px system-ui"><div style="display:grid;grid-template-columns:repeat(${shots.length > 4 ? 3 : 2},1fr);gap:14px">${shots.map(cell).join('')}</div><style>figure{margin:0}img{width:100%;display:block;border:1px solid #999}figcaption{padding:6px 0;word-break:break-all}.err{aspect-ratio:16/10;display:grid;place-items:center;background:#fff;color:#a00;padding:12px}</style></body>`);
await p.screenshot({ path: values.out, fullPage: true });
await b.close();
const fail = shots.filter((s) => s.err || s.blocked);
console.log(`Đã ghép ${shots.length - fail.length}/${shots.length} trang → ${values.out}`);
for (const f of fail) console.log(` - ${f.blocked ? 'bị chặn bot' : 'lỗi'} ${f.url}${f.err ? ': ' + f.err : ''}`);
process.exit(fail.length === shots.length ? 1 : 0);
