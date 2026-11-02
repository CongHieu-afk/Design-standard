#!/usr/bin/env node
// Kiểm định tự động tối thiểu cho chặng 4 (màn hình web dựng bằng DOM). Đọc design.config.json, chạy trên trang đã phục vụ qua http.
//
// Cách dùng:
//   node audit.mjs --config design.config.json --base http://localhost:4173 [--out <thư mục>] [--overwrite] [--only <id>]
//                  [--storage-state <file>] [--impeccable] [--update-baseline]
// --out: mặc định audit_out/<ngày-giờ>; thư mục đã có báo cáo thì dừng, trừ khi --overwrite (báo cáo cũ là bằng chứng, 11 §6).
// --impeccable: thêm W17 bằng `npx impeccable detect --cdp` trên chính trang đang mở (mọi trạng thái, kể cả đã đăng nhập),
//               ở 320 và 1440, theme sáng. Lần đầu npx tải gói; telemetry luôn tắt. Cấu hình tương đương: "impeccable": true.
// Màn hình cần đăng nhập: file phiên Playwright (--storage-state hoặc "auth": { "storageState": … }).
//   File phiên chứa token: để ở thư mục tạm của hệ điều hành, xoá sau khi kiểm (11 §2).
//
// Config màn hình (ngoài 02 §4): "ready" (selector phải hiện trước khi đo), "states" (dialog, rỗng, lỗi… — xem
// design.config.schema.json). Config gốc: "themeStorage" (ép theme qua localStorage), "internalTerms" (thuật ngữ nội bộ của dự án).
//
// Cần: playwright ≥ 1.51 và @axe-core/playwright (thiếu axe → dừng mã 2, trừ khi --allow-no-axe: phần axe ghi "Chưa kiểm").
// Mã thoát: 0 = không còn blocker/major và mọi kiểm máy bắt buộc đã chạy · 1 = chưa đạt · 2 = lỗi cấu hình/công cụ.
// Baseline và ngoại lệ cục bộ chỉ nhận minor; không thể làm blocker/major thành xanh.
// Màn hình Flutter (mobile, tablet, desktop Flutter, đồng hồ) KHÔNG kiểm ở đây: dùng scripts/flutter_ui_standard_test.dart.tmpl.
// Script không thay kiểm định thủ công (08 §3) hay phép thử 07 §7; báo cáo luôn có mục "Chưa kiểm".

import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { auditVerdict, canEnterBaseline, validateManifest, validateWaiver } from './governance-core.mjs';

const VIEWPORTS = [
  { name: '320', width: 320, height: 700 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
];
// Ngưỡng vùng chạm theo 02 §1. "fine": con trỏ chính xác; "coarse": cảm ứng.
// Hạng A con trỏ chính xác: 24px cho mọi phần tử; hành động chính/phá huỷ ≥ 44px đánh dấu bằng data-primary-action (kiểm thủ công nếu không đánh dấu).
const TARGET = { A: { coarse: 48, fine: 24, finePrimary: 44 }, B: { coarse: 44, fine: 24 }, C: { coarse: 44, fine: 24 } };
const PLACEHOLDER_TERMS = ['lorem ipsum', 'john doe', 'jane doe', 'test@test.com', 'foo@bar.', 'acme corp', 'todo:', 'zero cls', 'wcag aaa', 'mock data', '[CẦN NỘI DUNG', 'skeleton', 'localhost:', '127.0.0.1'];
const SEV = { blocker: 0, major: 1, minor: 2 };
// Luật impeccable ↔ mã dấu hiệu 07 §4 (để người duyệt tra). 2.2: mọi phát hiện W17 là Minor; mã bậc cấm có nhãn để người duyệt
// xác nhận (đúng → Major), mã bậc tiết chế là thông tin liều lượng — trong liều thì giữ, không sửa.
const IMPECCABLE_07 = {
  'ai-color-palette': 'G1-01', 'gradient-text': 'G1-01', 'dark-glow': 'G1-03', 'radial-halo': 'G1-05', 'radial-spotlight-glow': 'G1-05',
  'hero-eyebrow-chip': 'G2-06', 'kicker-above-heading': 'G2-06', 'icon-tile-stack': 'gần G2-04 — G2-04 chỉ khi là lưới card tính năng; ô icon trên tiêu đề dialog: người duyệt xếp mã', 'pulsing-dot': 'G2-07',
  'em-dash-overuse': 'G2-11', 'marketing-buzzword': 'G1-06', 'cream-palette': 'G3-01', 'italic-serif-display': 'G3-01/G3-03',
  'numbered-section-labels': 'G3-04', 'codex-grid-background': 'G3-08', 'marquee': 'G3-09', 'overused-font': 'G2-02',
  'nested-cards': 'G2-16', 'side-tab': 'G2-17', 'border-accent-on-rounded': 'G2-17', 'gray-on-color': 'G2-18',
};
// Mã bậc cấm (07 §4): gian dối, hại khả năng đọc, lộ trạng thái kỹ thuật
// Máy chỉ gắn nhãn, mức vẫn Minor: luật của impeccable là kinh nghiệm, dễ báo nhầm; người duyệt xác nhận mới nâng Major (08 W17)
const CODES_CAM = new Set(['G1-04', 'G1-06', 'G2-09', 'G2-10', 'G2-12', 'G2-13', 'C-01', 'G3-10', 'G3-13']);

const { values } = parseArgs({
  options: {
    config: { type: 'string', default: 'design.config.json' },
    base: { type: 'string' },
    out: { type: 'string' },
    overwrite: { type: 'boolean', default: false },
    only: { type: 'string' },
    'update-baseline': { type: 'boolean', default: false },
    'storage-state': { type: 'string' },
    impeccable: { type: 'boolean', default: false },
    'allow-no-axe': { type: 'boolean', default: false },
  },
});
// Phiên bản impeccable được ghim: npx không tự lấy bản mới nhất (mã chạy cạnh phiên đăng nhập qua cổng DevTools).
const IMPECCABLE_VERSION = '4.8.0';
const STANDARD = 'design_standard@3.0';

function fail(msg) {
  console.error(`Lỗi: ${msg}`);
  process.exit(2);
}

// Tìm gói trong node_modules của dự án (thư mục config, thư mục đang đứng) trước, rồi tới cạnh script.
// Cần vì bộ chuẩn thường nằm ngoài thư mục dự án (ví dụ PRACTICE/design_standard + PRACTICE/<dự án>).
async function loadPkg(name) {
  const bases = [path.resolve(values.config), path.join(process.cwd(), 'package.json')];
  for (const b of bases) {
    try {
      return await import(pathToFileURL(createRequire(b).resolve(name)).href);
    } catch { /* thử chỗ tiếp theo */ }
  }
  return import(name);
}
let chromium;
try {
  const pw = await loadPkg('playwright');
  chromium = pw.chromium || pw.default?.chromium;
  if (!chromium) throw new Error('no chromium export');
} catch {
  fail('Chưa cài playwright trong dự án: npm i -D playwright @axe-core/playwright && npx playwright install chromium');
}
let AxeBuilder = null;
try {
  const axe = await loadPkg('@axe-core/playwright');
  AxeBuilder = axe.default?.default || axe.default || axe.AxeBuilder;
} catch {
  /* xử lý dưới: thiếu axe là "không chạy được", trừ khi --allow-no-axe */
}
if (!AxeBuilder && !values['allow-no-axe']) fail('Chưa cài @axe-core/playwright: W2 (luật WCAG) sẽ không chạy. Cài: npm i -D @axe-core/playwright — hoặc chạy với --allow-no-axe (báo cáo ghi "Chưa kiểm").');
// filter({ visible: true }) cần Playwright ≥ 1.51; bản cũ bỏ qua im lặng và bấm nhầm phần tử ẩn.
try {
  let pv = '';
  for (const b of [path.resolve(values.config), path.join(process.cwd(), 'package.json'), import.meta.url.startsWith('file:') ? new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1') : '']) {
    try { pv = JSON.parse(fs.readFileSync(createRequire(b).resolve('playwright/package.json'), 'utf8')).version; break; } catch { /* thử chỗ tiếp */ }
  }
  const [ma, mi] = pv.split('.').map(Number);
  if (pv && (ma < 1 || (ma === 1 && mi < 51))) fail(`Playwright ${pv} quá cũ (cần ≥ 1.51).`);
} catch { /* không đọc được phiên bản: bỏ qua */ }
const readJson = (f, what) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { fail(`${what} ${f} không đọc được: ${e.message}`); } };

if (!values.base) fail('Thiếu --base (ví dụ http://localhost:4173). Không chạy trên file://.');
if (!fs.existsSync(values.config)) fail(`Không thấy ${values.config}`);
const cfgDir = path.dirname(path.resolve(values.config));
const cfg = readJson(values.config, 'Config');
const manifestProblems = validateManifest(cfg);
if (manifestProblems.length) fail(`Config chưa đạt:\n- ${manifestProblems.join('\n- ')}`);
const all = (cfg.screens || []).filter((s) => !values.only || s.id === values.only);
if (values.only && !all.length) fail(`Không có màn hình id "${values.only}" trong config.`);
for (const s of all) if ((s.platform || 'web') === 'web' && s.stack !== 'flutter' && !s.path) fail(`Màn hình web ${s.id} thiếu "path"`);
const screens = all.filter((s) => (s.platform || 'web') === 'web' && s.path && s.stack !== 'flutter');
const skipped = all.filter((s) => !screens.includes(s));
const HINT = { flutter: 'flutter test (scripts/flutter_ui_standard_test.dart.tmpl)', compose: 'test Compose + Accessibility Test Framework + ảnh chụp (phụ lục thiết bị đeo, D1–D2)', native: 'công cụ kiểm định của nền tảng (08 §1)' };
const hintFor = (s) => HINT[s.stack || 'flutter'] || HINT.native;
if (!screens.length) {
  fail(`Không có màn hình web (DOM) nào khớp. ${skipped.map((s) => `${s.id} (${s.platform}${s.stack ? `/${s.stack}` : ''}) → ${hintFor(s)}`).join('; ')}`);
}
// Kiểm config TRƯỚC khi mở trình duyệt: lỗi config là mã 2, không bao giờ là "có blocker".
// Khoá gõ sai (ví dụ "redy", "darkmode") bị bỏ qua im lặng thì ready/theme tối/states mất mà không ai biết.
const ROOT_KEYS = new Set(['$schema', 'standard', 'language', 'darkMode', 'themeStorage', 'initStorage', 'internalTerms', 'impeccable', 'print', 'baseline', 'exceptions', 'tokens', 'preview', 'verify', 'screens', 'auth', 'gates']);
const SCREEN_KEYS = new Set(['id', 'platform', 'path', 'source', 'params', 'type', 'tier', 'expression', 'users', 'input', 'stack', 'ssr', 'ready', 'initStorage', 'route', 'states']);
const STATE_KEYS = new Set(['id', 'viewports', 'ready', 'expectConsoleErrors', 'route', 'dialog', 'steps', 'expectFocus', 'expectUrl']);
const ROUTE_KEYS = new Set(['url', 'status', 'contentType', 'body', 'file', 'delayMs']);
const STEP_KEYS = new Set(['action', 'selector', 'value', 'key', 'ms', 'timeout']);
const checkRoutes = (where, rs) => { for (const r of rs || []) for (const k of Object.keys(r)) if (!ROUTE_KEYS.has(k)) fail(`${where}: route có khoá lạ "${k}"`); };
for (const s of all) {
  checkRoutes(`Màn hình ${s.id}`, s.route);
  for (const st of s.states || []) {
    checkRoutes(`Màn hình ${s.id}/${st.id}`, st.route);
    for (const step of st.steps || []) for (const k of Object.keys(step)) if (!STEP_KEYS.has(k)) fail(`Màn hình ${s.id}/${st.id}: bước có khoá lạ "${k}"`);
  }
}
for (const k of Object.keys(cfg)) if (!ROOT_KEYS.has(k)) fail(`Config có khoá lạ "${k}" (gõ sai?) — xem design.config.schema.json`);
for (const s of all) for (const k of Object.keys(s)) if (!SCREEN_KEYS.has(k)) fail(`Màn hình ${s.id}: khoá lạ "${k}" (gõ sai?)`);
for (const s of all) for (const st of s.states || []) for (const k of Object.keys(st)) if (!STATE_KEYS.has(k)) fail(`Màn hình ${s.id}/${st.id}: khoá lạ "${k}" (gõ sai?)`);
for (const s of screens) {
  if (!/^[a-z0-9-]+$/.test(s.id || '')) fail(`id màn hình "${s.id}" phải dạng a-z0-9- (02 §4)`);
  if (!TARGET[String(s.tier || '').toUpperCase()]) fail(`Màn hình ${s.id} thiếu "tier" hợp lệ (A|B|C).`);
  const routesOf = (x) => x.route || [];
  for (const r of routesOf(s)) if (r.file && !fs.existsSync(path.resolve(cfgDir, r.file))) fail(`Màn hình ${s.id}: không thấy fixture ${r.file}`);
  for (const st of s.states || []) {
    if (!st.id || !/^[a-z0-9-]+$/.test(st.id)) fail(`Màn hình ${s.id}: mỗi state cần "id" dạng a-z0-9-`);
    if (st.id === 'dau') fail(`Màn hình ${s.id}: "dau" là tên dành cho trạng thái đầu`);
    for (const v of st.viewports || []) if (!VIEWPORTS.some((x) => x.name === v)) fail(`Màn hình ${s.id}/${st.id}: viewport "${v}" không có (chỉ ${VIEWPORTS.map((x) => x.name).join(', ')})`);
    for (const r of routesOf(st)) if (r.file && !fs.existsSync(path.resolve(cfgDir, r.file))) fail(`Màn hình ${s.id}/${st.id}: không thấy fixture ${r.file}`);
  }
}
const langs = cfg.language || ['vi'];
const themes = cfg.darkMode ? ['light', 'dark'] : ['light'];
const useImpeccable = values.impeccable || cfg.impeccable === true;
const baselineFile = path.resolve(cfgDir, cfg.baseline || 'a11y-baseline.json');
const baselineExists = fs.existsSync(baselineFile);
const baseline = new Set(baselineExists ? readJson(baselineFile, 'Baseline') : []);
// Cảnh báo khi khác số chính (2.0 và 2.1 dùng chung dạng config và ID).
const major = (v) => String(v || '').replace(/^.*@/, '').split('.')[0];
const versionNote = cfg.standard && major(cfg.standard) !== major(STANDARD) ? `Config ghi "${cfg.standard}", script là ${STANDARD}: đọc CHANGELOG trước khi tin kết quả` : '';
// ID 2.0 = màn hình|trạng thái|luật|nguyên nhân (4 phần). Baseline/ngoại lệ dạng cũ (3 phần) không được tự hiểu là "đã biết".
const oldId = (id) => String(id).split('|').length < 4;
if ([...baseline].some(oldId) && !values['update-baseline']) {
  fail(`${baselineFile} dùng ID dạng cũ. Sửa lỗi rồi tạo lại baseline minor bằng --update-baseline.`);
}
const exceptions = new Map();
if (cfg.exceptions) {
  const exFile = path.resolve(cfgDir, cfg.exceptions);
  if (!fs.existsSync(exFile)) fail(`Không thấy file ngoại lệ ${exFile}`);
  for (const ex of readJson(exFile, 'File ngoại lệ')) {
    const problems = validateWaiver(ex);
    if (problems.length) fail(`Ngoại lệ ${ex.id || '?'} chưa đạt: ${problems.join('; ')}`);
    if (oldId(ex.finding)) fail(`Ngoại lệ ${ex.id || ex.finding} dùng ID dạng cũ; lấy ID mới ở audit_report.json`);
    exceptions.set(ex.finding, ex);
  }
}
if (values['update-baseline'] && values.only) fail('--update-baseline không dùng cùng --only (baseline sẽ mất mục của màn hình không chạy).');
// Lỗi "trang hỏng" không bao giờ được coi là đã biết: luôn tính là mới, không ghi vào baseline.
const NEVER_BASELINE_SET = new Set(['load', 'http-status', 'redirected', 'not-ready', 'state-steps', 'empty-page', 'js-error']);
// Kể cả "<kiểm định bổ sung>-load" (zoom200-load…): baseline nó thì lượt kiểm đó biến mất vĩnh viễn.
const NEVER_BASELINE = { has: (rule) => NEVER_BASELINE_SET.has(rule) || /-load$/.test(rule) };

const storageSrc = values['storage-state'] || (cfg.auth && cfg.auth.storageState && path.resolve(cfgDir, cfg.auth.storageState));
if (storageSrc && !fs.existsSync(storageSrc)) fail(`Không thấy file phiên đăng nhập ${storageSrc}`);
const insideOf = (dir, f) => { const rel = path.relative(dir, path.resolve(f)); return rel && !rel.startsWith('..') && !path.isAbsolute(rel); };

const stamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15);
const outDir = values.out || path.join('audit_out', stamp);
if (fs.existsSync(path.join(outDir, 'audit_report.md')) && !values.overwrite) {
  fail(`${outDir} đã có báo cáo. Chọn --out khác (báo cáo cũ là bằng chứng) hoặc thêm --overwrite.`);
}
fs.mkdirSync(outDir, { recursive: true });
// Ghi đè thư mục cũ: xoá ảnh của lần trước để ảnh trong thư mục khớp báo cáo mới.
if (values.overwrite) for (const f of fs.readdirSync(outDir)) if (f.endsWith('.png')) fs.rmSync(path.join(outDir, f));

const findings = new Map();
const statesRun = new Set();
const themeBg = new Map();
const jsTextLen = new Map();
const notChecked = new Set();
const requiredMissing = new Set();
if (!AxeBuilder) requiredMissing.add('W2 axe-core');
if (storageSrc && (insideOf(cfgDir, storageSrc) || insideOf(process.cwd(), storageSrc))) {
  console.warn(`Cảnh báo: file phiên ${storageSrc} nằm trong thư mục dự án/config. File này chứa token — chuyển ra thư mục tạm của hệ điều hành và xoá sau khi kiểm.`);
}
// Mỗi phát hiện là một NGUYÊN NHÂN (screen + state + rule + cause); các phần tử cùng nguyên nhân gộp lại và được đếm.
function add(f) {
  // Chữ lộ ra ở khung chung của trang (header, footer) thấy ở mọi trạng thái: gộp thành một nguyên nhân, ghi trạng thái vào "Ở đâu".
  if (f.pageWide) f = { ...f, where: `${f.state || 'dau'}:${f.where}`, state: '*' };
  const cause0 = f.cause ?? f.target ?? '';
  // Cùng nguyên nhân đã thấy ở trạng thái đầu (khung chung: header, footer, favicon): gộp vào dòng của trạng thái đầu.
  if (f.state && f.state !== 'dau' && f.state !== '*' && findings.has(`${f.screen}|dau|${f.rule}|${cause0}`)) f = { ...f, where: `${f.state}:${f.where}`, state: 'dau' };
  const state = f.state || 'dau';
  const cause = cause0;
  const id = `${f.screen}|${state}|${f.rule}|${cause}`;
  let prev = findings.get(id);
  if (!prev) {
    prev = { screen: f.screen, state, rule: f.rule, cause, severity: f.severity, id, where: new Map(), targets: new Set(), details: [] };
    findings.set(id, prev);
  }
  prev.where.set(f.where, f.msg);
  if (f.target) prev.targets.add(f.target);
  if (f.detail && prev.details.length < 10) prev.details.push(f.detail);
  if (SEV[f.severity] < SEV[prev.severity]) prev.severity = f.severity;
}
// State có thao tác (steps) mà không khai báo focus mong đợi: đường quay về / sau thao tác không được đo (2.4, 03 "Mỗi đường quay về").
// Lần chạy thử 2.3: sửa xong quay về trang chi tiết focus nhầm tiêu đề — máy không bắt vì state thiếu expectFocus.
for (const s of screens) for (const st of s.states || []) {
  if ((st.steps || []).length && !st.dialog && !st.expectFocus) {
    add({ screen: s.id, state: st.id, where: 'config', rule: 'state-thieu-expectFocus', severity: 'major', msg: `State có ${st.steps.length} bước thao tác nhưng không khai báo "expectFocus" — focus sau thao tác/quay về không được đo (03 "Trạng thái tương tác bắt buộc")` });
  }
}
// Cổng thiết kế (2.8, mượn "gate file" của huashu-design): trang E2–E3 hoặc config khai "gates" → thiếu file cổng = major.
// Lý do: luật bảng tham chiếu (2.5) bị bỏ qua ba vòng vì không gì chặn.
if (cfg.gates || screens.some((s) => /^E[23]$/i.test(String(s.expression || '')))) {
  const { checkGates } = await import('./check_gates.mjs');
  for (const p of checkGates(cfg.gates ? path.resolve(cfgDir, cfg.gates) : null)) {
    add({ screen: 'cong-thiet-ke', state: 'dau', where: 'config', rule: 'gate-thieu', severity: 'major', cause: p, msg: p });
  }
}
function urlFor(s) {
  const u = new URL(values.base);
  const [p, q] = s.path.split('?');
  const pathname = p.replace(/(^|\/):(\w+)/g, (_, sl, k) => `${sl}${encodeURIComponent((s.params && s.params[k]) || '1')}`);
  return new URL(pathname + (q ? `?${q}` : ''), u).href;
}
const termsSrc = [...PLACEHOLDER_TERMS, ...(cfg.internalTerms || [])].map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');

// Chặn API theo khai báo "route" của state: trả fixture, không chạm dữ liệu thật (11 §2).
async function applyRoutes(page, routes, mocked) {
  for (const r of routes || []) {
    await page.route(r.url, async (route) => {
      if (mocked && (r.status || 200) >= 400) mocked.add(route.request().url());
      // delayMs: giữ phản hồi lại để chụp trạng thái "đang tải" (khung xương); trang đóng trước khi trả thì bỏ qua.
      if (r.delayMs) await new Promise((res) => setTimeout(res, Math.min(r.delayMs, 60000)));
      const body = r.file ? fs.readFileSync(path.resolve(cfgDir, r.file), 'utf8') : typeof r.body === 'string' ? r.body : r.body !== undefined ? JSON.stringify(r.body) : '';
      return route.fulfill({ status: r.status || 200, contentType: r.contentType || 'application/json', body }).catch(() => {});
    });
  }
}
// localStorage trước khi trang chạy: "initStorage" (gốc + màn hình; ví dụ token giả khi API là fixture) và "themeStorage" theo theme.
async function seedStorage(ctx, s, theme) {
  const kv = { ...(cfg.initStorage || {}), ...(s.initStorage || {}), ...((cfg.themeStorage || {})[theme] || {}) };
  if (Object.keys(kv).length) await ctx.addInitScript((m) => { for (const [k, v] of Object.entries(m)) localStorage.setItem(k, v); }, kv);
}
// Phần tử đầu tiên ĐANG HIỆN khớp selector: giao diện thích ứng thường có hai bản (thẻ ở màn hẹp, bảng ở màn rộng), bản ẩn đứng trước.
const vis = (page, selector) => page.locator(selector).filter({ visible: true }).first();
// Ảnh loading="lazy" ngoài khung nhìn không tải nên ảnh fullPage thiếu ảnh (m-11): ép tải, chờ giải mã (tối đa 5s) rồi chờ vẽ.
// Chỉ chờ "load" chưa đủ: ảnh decoding="async" ngoài khung nhìn vẫn ra ô trống khi chụp (đo trên Vườn Sớm 320px).
// Không cuộn trang: cuộn kích hoạt hiệu ứng theo cuộn và đổi trạng thái trước các phép đo sau.
async function loadLazy(page) {
  await page.evaluate(() => Promise.race([
    Promise.all([...document.querySelectorAll('img[loading="lazy"]')].map((im) => {
      im.loading = 'eager';
      const loaded = im.complete ? Promise.resolve() : new Promise((r) => { im.addEventListener('load', r, { once: true }); im.addEventListener('error', r, { once: true }); });
      return loaded.then(() => im.decode()).catch(() => {});
    })),
    new Promise((r) => setTimeout(r, 5000)),
  ])).catch(() => {});
  await page.waitForTimeout(500);
}
async function runSteps(page, steps) {
  for (const st of steps || []) {
    const t = st.timeout || 10000;
    if (st.action === 'click') await vis(page, st.selector).click({ timeout: t });
    else if (st.action === 'fill') await vis(page, st.selector).fill(st.value ?? '', { timeout: t });
    else if (st.action === 'select') await vis(page, st.selector).selectOption(st.value, { timeout: t });
    else if (st.action === 'hover') await vis(page, st.selector).hover({ timeout: t });
    else if (st.action === 'press') await page.keyboard.press(st.key);
    else if (st.action === 'waitFor') await vis(page, st.selector).waitFor({ state: 'visible', timeout: t });
    else if (st.action === 'wait') await page.waitForTimeout(Math.min(st.ms || 300, 5000));
    // Back/Forward của trình duyệt (2.3): kiểm "đi rồi quay lại" — điều hướng một trang (hash/history) hay lệch URL với nội dung
    else if (st.action === 'back' || st.action === 'forward') {
      await (st.action === 'back' ? page.goBack({ timeout: t }) : page.goForward({ timeout: t })).catch(() => null);
      await page.waitForTimeout(400);
    }
    else throw new Error(`action không hỗ trợ: ${st.action}`);
  }
}

// Kiểm DOM + axe trên trang đang mở. Không gắn thuộc tính nào vào DOM (để selector của axe ổn định giữa các lần chạy).
async function checkPage(page, ctxInfo) {
  const { s, state, where, tier, expr, coarse } = ctxInfo;
  const minTarget = coarse ? TARGET[tier].coarse : TARGET[tier].fine;
  // axe chạy TRƯỚC mọi thao tác bàn phím của script.
  if (AxeBuilder) {
    const runs = [['wcag', await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()]];
    if (tier === 'A') runs.push(['aaa', await new AxeBuilder({ page }).withRules(['color-contrast-enhanced']).analyze()]);
    for (const [kind, res] of runs) {
      for (const v of res.violations) {
        const severity = kind === 'aaa' || ['critical', 'serious'].includes(v.impact) ? 'blocker' : 'major';
        for (const n of v.nodes) {
          const d = (n.any || []).concat(n.all || [], n.none || []).map((c) => c.data).find((x) => x && x.contrastRatio !== undefined);
          // Tương phản: một nguyên nhân = một cặp màu (sửa ở token); luật khác: một nguyên nhân = một phần tử.
          const cause = d ? `${d.fgColor} trên ${d.bgColor}` : n.target.join(' ');
          const detail = d
            ? `${d.contrastRatio}:1 (cần ${d.expectedContrastRatio}) chữ ${d.fgColor} nền ${d.bgColor}, ${d.fontSize} ${d.fontWeight}`
            : (n.failureSummary || '').replace(/\s+/g, ' ').slice(0, 300);
          add({ screen: s.id, state, where, rule: `axe:${v.id}`, severity, cause, target: `${n.target.join(' ')} — ${(n.html || '').replace(/\s+/g, ' ').slice(0, 120)}`, msg: `${v.help}${kind === 'aaa' ? ' (hạng A)' : ''}`, detail });
        }
      }
    }
  } else notChecked.add('Luật WCAG của axe-core (cài: npm i -D @axe-core/playwright)');

  const dom = await page.evaluate(({ checkVi, minTarget, finePrimary, coarse, termsSrc }) => {
    const out = [];
    const shown = (el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (cs.display === 'none' || cs.visibility !== 'visible' || r.width <= 1 || r.height <= 1) return false;
      if (cs.clip && cs.clip !== 'auto' && /rect\(0(px)?,? 0(px)?,? 0(px)?,? 0(px)?\)/.test(cs.clip)) return false;
      return true;
    };
    // Danh tính phần tử: tag + id hoặc tên đầy đủ (không cắt: tên khác nhau phải là phần tử khác nhau).
    const sel = (el) => {
      if (el.id) return `${el.tagName.toLowerCase()}#${el.id}`;
      const t = (el.getAttribute('aria-label') || el.innerText || el.getAttribute('title') || el.getAttribute('placeholder') || '').replace(/\s+/g, ' ').trim().slice(0, 120);
      return `${el.tagName.toLowerCase()}${t ? ` "${t}"` : ''}`;
    };
    if (!document.querySelector('meta[name="viewport"]')) out.push({ rule: 'meta-viewport', severity: 'blocker', msg: 'Thiếu <meta name="viewport"> — trang không co theo màn hình di động' });
    const sw = document.documentElement.scrollWidth;
    const cw = Math.min(document.documentElement.clientWidth, window.innerWidth);
    if (sw > cw + 1) out.push({ rule: 'overflow-x', severity: 'blocker', msg: `Trang tràn ngang ${sw - cw}px` });
    // Vùng chạm (bỏ link trong câu chữ; bỏ phần tử ẩn trực quan như skip link chưa focus)
    const targets = [...document.querySelectorAll('button, a[href], input:not([type=hidden]), select, textarea, [role=button], [role=link], [role=tab], [role=checkbox], [role=switch], [role=menuitem]')].filter(shown);
    const rects = targets.map((el) => (el.closest('label') || el).getBoundingClientRect());
    targets.forEach((el, i) => {
      const p = el.parentElement;
      const inText = el.tagName === 'A' && getComputedStyle(el).display === 'inline' && p &&
        [...p.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
      if (inText) return;
      const r = rects[i];
      const need = !coarse && finePrimary && el.matches('[data-primary-action]') ? finePrimary : minTarget;
      if (r.width + 0.5 >= need && r.height + 0.5 >= need) return;
      if (need === 24) {
        // Ngoại lệ khoảng cách SC 2.5.8: vòng tròn đường kính 24px quanh tâm không giao mục tiêu khác
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const clear = rects.every((o, j) => {
          if (j === i) return true;
          const nx = Math.max(o.left, Math.min(cx, o.right)), ny = Math.max(o.top, Math.min(cy, o.bottom));
          const ocx = o.left + o.width / 2, ocy = o.top + o.height / 2;
          const small = o.width < 24 || o.height < 24;
          return Math.hypot(cx - nx, cy - ny) >= 12 && (!small || Math.hypot(cx - ocx, cy - ocy) >= 24);
        });
        if (clear) return;
      }
      out.push({ rule: 'target-size', severity: 'tier', target: sel(el), msg: `Vùng chạm ${Math.round(r.width)}×${Math.round(r.height)}px < ${need}px` });
    });
    // Chữ kẹt ẩn khi giảm chuyển động
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const flagged = new Set();
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      if (n.textContent.trim().length < 3) continue;
      const el = n.parentElement;
      if (!el || flagged.has(el) || el.closest('[hidden],[inert],[aria-hidden=true],dialog:not([open]),script,style,noscript,template,[role=tooltip]')) continue;
      let op = 1, hiddenVis = false, clipped = false;
      for (let a = el; a && a !== document.documentElement; a = a.parentElement) {
        const cs = getComputedStyle(a);
        op *= parseFloat(cs.opacity);
        if (cs.display === 'none') { hiddenVis = true; break; }
        if (/inset\((100%|[^)]*100%)/.test(cs.clipPath)) clipped = true;
      }
      const cs = getComputedStyle(el);
      if (hiddenVis || cs.visibility !== 'visible') continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (op < 0.1 || clipped) {
        flagged.add(el);
        out.push({ rule: 'hidden-content-reduced-motion', severity: 'motion', target: sel(el), msg: 'Chữ không nhìn thấy (opacity ≈ 0 hoặc bị clip-path) khi bật giảm chuyển động' });
      }
    }
    // Line-height tiếng Việt
    if (checkVi) {
      document.querySelectorAll('p, li, td, th, dd, label, button, h1, h2, h3, h4, h5, h6').forEach((el) => {
        if (!shown(el)) return;
        const txt = (el.innerText || '').trim();
        const isH = /^H\d$/.test(el.tagName);
        const isShort = isH || ['LABEL', 'BUTTON'].includes(el.tagName);
        if (!txt || (!isShort && txt.length < 20)) return;
        const cs = getComputedStyle(el);
        const fs = parseFloat(cs.fontSize);
        const lh = cs.lineHeight === 'normal' ? fs * 1.2 : parseFloat(cs.lineHeight);
        const clips = cs.overflow !== 'visible' || cs.overflowY !== 'visible' || (cs.height !== 'auto' && el.style.height);
        const min = isH ? 1.25 : ['P', 'LI', 'DD'].includes(el.tagName) ? 1.5 : clips ? 1.4 : 1.2;
        const ratio = (lh / fs).toFixed(2);
        if (lh / fs + 0.01 < min) out.push({ rule: 'vi-line-height', severity: 'major', cause: `${el.tagName.toLowerCase()} ${ratio} < ${min}`, target: sel(el), msg: `line-height ${ratio} < ${min} (tiếng Việt)` });
      });
    }
    // Nội dung giả / thuật ngữ nội bộ lộ ra: mọi cụm khác nhau, không chỉ cụm đầu
    const re = new RegExp(termsSrc, 'gi');
    const seen = new Set();
    for (const m of (document.body.innerText || '').matchAll(re)) {
      const k = m[0].toLowerCase();
      if (seen.has(k) || seen.size >= 20) continue;
      seen.add(k);
      out.push({ rule: 'placeholder-content', severity: 'major', pageWide: true, cause: k, target: m[0], msg: `Nội dung giả hoặc thuật ngữ nội bộ lộ ra: "${m[0]}"` });
    }
    return out;
  }, { checkVi: langs.includes('vi'), minTarget, finePrimary: tier === 'A' ? TARGET.A.finePrimary : 0, coarse, termsSrc });

  for (const f of dom) {
    let severity = f.severity;
    if (severity === 'tier') severity = tier === 'A' ? 'blocker' : 'major';
    if (severity === 'motion') severity = ['E2', 'E3'].includes(expr) ? 'blocker' : 'major';
    add({ screen: s.id, state, where, ...f, severity });
  }
}

// Bàn phím: Tab qua trang. Danh tính phần tử giữ trong WeakMap của trang, không ghi vào DOM.
async function checkTab(page, { s, state, where, tier }) {
  await page.evaluate(() => { window.__auditIds = new WeakMap(); window.__auditN = 0; });
  let first = null, last = null, repeat = 0;
  for (let i = 0; i < 200; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      let el = document.activeElement;
      if (!el || el === document.body || el === document.documentElement) return null;
      // Web component: đi xuống phần tử đang focus thật trong shadow DOM rồi kiểm như thường.
      while (el.shadowRoot && el.shadowRoot.activeElement) el = el.shadowRoot.activeElement;
      // Focus nằm trong iframe (bản đồ, video) hoặc trình phát media / shadow DOM đóng: activeElement đứng yên ở phần tử chủ
      // qua nhiều lần Tab mà không phải kẹt thật → không đếm lặp, nhưng báo "Chưa kiểm".
      const opaque = el.tagName === 'IFRAME' || el.tagName === 'VIDEO' || el.tagName === 'AUDIO' || !!el.shadowRoot;
      if (!window.__auditIds.has(el)) window.__auditIds.set(el, window.__auditN++);
      const name = (el.getAttribute('aria-label') || el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 120);
      const label = el.id ? `${el.tagName.toLowerCase()}#${el.id}` : `${el.tagName.toLowerCase()}${name ? ` "${name}"` : ''}`;
      const snap = () => {
        const parts = [el, el.parentElement, ...(el.labels ? [...el.labels] : [])].filter(Boolean).flatMap((e) =>
          [getComputedStyle(e), getComputedStyle(e, '::before'), getComputedStyle(e, '::after')]);
        return parts.map((c) => [c.outlineStyle, c.outlineWidth, c.outlineColor, c.boxShadow, c.backgroundColor, c.borderColor, c.color, c.textDecorationLine, c.opacity, c.content].join('|')).join('§');
      };
      const focused = snap();
      el.blur();
      const plain = snap();
      el.focus({ preventScroll: true });
      return { idx: window.__auditIds.get(el), label, visible: focused !== plain, opaque };
    });
    if (!info) break;
    if (first === null) first = info.idx;
    else if (info.idx === first) break; // đã quay vòng
    if (info.opaque) {
      notChecked.add(`${s.id}: focus đi vào ${info.label} (iframe/media/shadow DOM đóng) — focus nhìn thấy và kẹt focus bên trong chưa kiểm bằng máy, kiểm tay`);
      if (info.idx === last && ++repeat >= 20) break;
      last = info.idx;
      continue;
    }
    if (info.idx === last) {
      if (++repeat >= 3) {
        add({ screen: s.id, state, where, rule: 'focus-trap', severity: 'blocker', target: info.label, msg: 'Focus kẹt tại một phần tử khi bấm Tab' });
        break;
      }
    } else repeat = 0;
    last = info.idx;
    if (!info.visible) add({ screen: s.id, state, where, rule: 'focus-visible', severity: tier === 'A' ? 'blocker' : 'major', target: info.label, msg: 'Focus không tạo thay đổi nhìn thấy (đã xét outline, viền, nền, màu, ::before/::after, phần tử cha, nhãn) — xem lại bằng mắt' });
  }
}

// Dialog (state có "dialog": true): focus vào trong, Escape đóng, focus trả về nút mở (04 §10, W5).
// Heuristic: chỉ kiểm dialog mà bước click cuối mở ra; Tab bị giữ trong dialog và nền `inert` vẫn kiểm tay (11 §3).
async function checkDialog(page, { s, state, where, tier, steps }) {
  const sev = tier === 'A' ? 'blocker' : 'major';
  // Theo dõi đúng phần tử dialog vừa mở (dialog hiện, ưu tiên cái chứa focus, rồi cái sau cùng), không phải "dialog bất kỳ" như banner cookie.
  const handle = await page.evaluateHandle(() => {
    const dlgs = [...document.querySelectorAll('[role=dialog],[role=alertdialog],dialog[open]')].filter((d) => {
      const r = d.getBoundingClientRect(); const cs = getComputedStyle(d);
      return r.width > 1 && r.height > 1 && cs.visibility === 'visible' && cs.display !== 'none';
    });
    return dlgs.find((d) => d.contains(document.activeElement)) || dlgs[dlgs.length - 1] || null;
  });
  const dlg = handle.asElement();
  if (!dlg) {
    add({ screen: s.id, state, where, rule: 'dialog-missing', severity: sev, msg: 'State khai báo "dialog" nhưng không thấy phần tử role=dialog/alertdialog hay <dialog open> đang hiện' });
    return;
  }
  const info = await dlg.evaluate((d) => {
    const name = d.getAttribute('aria-label') || (d.getAttribute('aria-labelledby') && document.getElementById(d.getAttribute('aria-labelledby'))?.innerText) || '';
    return { focusInside: d.contains(document.activeElement), named: !!name.trim(), modal: d.getAttribute('aria-modal') === 'true' || d.tagName === 'DIALOG' };
  });
  if (!info.focusInside) add({ screen: s.id, state, where, rule: 'dialog-focus-in', severity: sev, msg: 'Mở dialog nhưng focus không nằm trong dialog' });
  if (!info.named) add({ screen: s.id, state, where, rule: 'dialog-name', severity: sev, msg: 'Dialog không có tên trợ năng (aria-label / aria-labelledby)' });
  if (!info.modal) add({ screen: s.id, state, where, rule: 'dialog-modal', severity: 'minor', msg: 'Dialog thiếu aria-modal="true" (hoặc không dùng <dialog>) — trình đọc màn hình có thể đọc cả nền' });
  // Nút mở = phần tử ĐANG HIỆN mà bước click cuối đã bấm. Đánh dấu SAU axe/impeccable để không lẫn vào selector của chúng.
  const opener = [...(steps || [])].reverse().find((x) => x.action === 'click');
  let openerMarked = false;
  if (opener) openerMarked = await vis(page, opener.selector).evaluate((el) => { el.setAttribute('data-audit-opener', ''); return true; }).catch(() => false);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const stillOpen = await dlg.evaluate((d) => {
    if (!d.isConnected) return false;
    const r = d.getBoundingClientRect(); const cs = getComputedStyle(d);
    return r.width > 1 && r.height > 1 && cs.visibility === 'visible' && cs.display !== 'none' && (d.tagName !== 'DIALOG' || d.open);
  }).catch(() => false);
  const after = await page.evaluate(() => ({
    marked: !!document.activeElement?.closest('[data-audit-opener]'),
    onBody: document.activeElement === document.body || !document.activeElement,
  }));
  if (stillOpen) add({ screen: s.id, state, where, rule: 'dialog-escape', severity: sev, msg: 'Nhấn Escape không đóng dialog' });
  else if (after.onBody) add({ screen: s.id, state, where, rule: 'dialog-focus-return', severity: sev, msg: 'Đóng dialog xong focus rơi về <body>, không trả về nút đã mở' });
  else if (openerMarked && !after.marked) add({ screen: s.id, state, where, rule: 'dialog-focus-return', severity: sev, msg: 'Đóng dialog xong focus không về nút đã mở — xem lại bằng bàn phím' });
}

// W17 qua impeccable: quét chính trang đang mở qua cổng DevTools.
// Chạy thử một lần trước (tải gói lần đầu, timeout dài); hỏng thì tắt W17 cho cả lượt chạy thay vì chờ timeout ở mọi trạng thái.
const IMP_ENV = { ...process.env, IMPECCABLE_NO_TELEMETRY: '1', DO_NOT_TRACK: '1', npm_config_yes: 'true' };
let impeccableOk = null;
function impeccablePreflight() {
  if (impeccableOk !== null) return impeccableOk;
  const r = spawnSync(`npx --yes impeccable@${IMPECCABLE_VERSION} --version`, { encoding: 'utf8', shell: true, timeout: 300000, env: IMP_ENV });
  impeccableOk = r.status === 0;
  if (!impeccableOk) {
    const detail = (r.stderr || r.error?.message || 'không rõ lỗi').split('\n').find((l) => l.trim()) || 'timeout';
    notChecked.add(`W17: không chạy được impeccable@${IMPECCABLE_VERSION} (${detail})`);
    requiredMissing.add('W17 impeccable');
  }
  return impeccableOk;
}
function runImpeccable(page, ctxInfo) {
  const { s, state, where } = ctxInfo;
  if (!impeccablePreflight()) return Promise.resolve();
  const marker = `audit-${s.id}-${state}-${Date.now()}`;
  return page.evaluate((m) => { document.title = `${document.title} ${m}`; }, marker).then(() => {
    // marker chỉ gồm a-z0-9- (id màn hình/state đã kiểm), nên ghép chuỗi lệnh cho shell Windows là an toàn.
    const cmd = `npx --yes impeccable@${IMPECCABLE_VERSION} detect --json --no-config --no-advisory --cdp ${cdpPort} --target ${marker}`;
    const r = spawnSync(cmd, { encoding: 'utf8', shell: true, timeout: 120000, env: IMP_ENV });
    if (r.status !== 0 && r.status !== 2) {
      notChecked.add(`W17 impeccable không quét được ${s.id}/${state} (${where}): ${(r.stderr || r.error?.message || '').split('\n').find((l) => l.trim()) || 'không rõ lỗi'}`);
      requiredMissing.add(`W17 impeccable ${s.id}/${state}`);
      if (r.error && /ETIMEDOUT/.test(String(r.error.code || r.error.message))) impeccableOk = false; // timeout: không thử tiếp
      return;
    }
    let list = [];
    try { list = JSON.parse(r.stdout || '[]'); } catch { list = null; }
    if (!Array.isArray(list)) {
      notChecked.add(`W17 impeccable trả kết quả không đọc được ở ${s.id}/${state} (${where})`);
      requiredMissing.add(`W17 impeccable ${s.id}/${state}`);
      return;
    }
    for (const f of list) {
      const code = IMPECCABLE_07[f.antipattern];
      // gradient-text: chữ gradient là bậc cấm (C-01) chỉ khi không đạt tương phản — để Minor, người duyệt xét cùng W2
      const cam = code && CODES_CAM.has(code);
      add({ screen: s.id, state, where, rule: `impeccable:${f.antipattern}`, severity: 'minor', cause: f.snippet || f.selector || '', target: f.selector || '',
        msg: `${f.name}${code ? ` (07: ${code})` : ''} — ${f.category === 'slop' ? (cam ? 'nghi bậc cấm (07 §4) — người duyệt xác nhận; đúng thì Major' : 'nét AI bậc tiết chế: người duyệt xét liều theo 07 §4, trong liều thì giữ') : 'chất lượng; đối chiếu với axe/đo tay'}`, detail: f.snippet || '' });
    }
  }).finally(() => page.evaluate((m) => { document.title = document.title.replace(` ${m}`, ''); }, marker).catch(() => {}));
}

// Cổng DevTools: lấy một cổng trống trên 127.0.0.1 (hai lần chạy song song không đụng nhau). Cổng chỉ mở trong lúc chạy.
async function freePort() {
  const net = await import('node:net');
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.once('error', reject);
    srv.listen(0, '127.0.0.1', () => { const p = srv.address().port; srv.close(() => resolve(p)); });
  });
}
const cdpPort = useImpeccable ? await freePort().catch((e) => fail(`Không lấy được cổng trống cho DevTools: ${e.message}`)) : 0;
const launchArgs = useImpeccable ? [`--remote-debugging-port=${cdpPort}`, '--remote-debugging-address=127.0.0.1'] : [];
let browser;
try {
  browser = await chromium.launch({ args: launchArgs });
} catch (e) {
  fail(`Không mở được Chromium (${e.message.split('\n')[0]}). Chạy: npx playwright install chromium`);
}
const shots = [];
try {
  for (const s of screens) {
    const tier = String(s.tier || '').toUpperCase();
    const expr = String(s.expression || 'E0').toUpperCase();
    const input = s.input || 'both';
    const url = urlFor(s);
    const states = [{ id: 'dau' }, ...(s.states || [])];

    for (const st of states) {
      const vps = VIEWPORTS.filter((v) => !st.viewports || st.viewports.includes(v.name));
      for (const theme of themes) {
        for (const vp of vps) {
          const coarse = input === 'coarse' || (input === 'both' && vp.width < 1024);
          const where = `${vp.name}/${theme}`;
          const ctx = await browser.newContext({
            viewport: { width: vp.width, height: vp.height },
            colorScheme: theme,
            reducedMotion: 'reduce',
            hasTouch: coarse,
            isMobile: coarse && vp.width < 500,
            ...(storageSrc ? { storageState: storageSrc } : {}),
          });
          await seedStorage(ctx, s, theme);
          const page = await ctx.newPage();
          const errors = [];
          const resources = [];
          page.on('pageerror', (e) => errors.push(e.message));
          // State giả lập lỗi có thể khai báo "expectConsoleErrors": app ghi console.error khi API lỗi là đúng ý, không phải lỗi JS.
          page.on('console', (m) => {
            if (m.type() === 'error' && !st.expectConsoleErrors && !/Failed to load resource/i.test(m.text())) errors.push(m.text());
          });
          const routes = [...(s.route || []), ...(st.route || [])];
          const mocked = new Set(); // chỉ bỏ qua đúng các URL đã cố ý trả lỗi bằng fixture
          // URL tài nguyên bỏ query (?v=hash) để ID ổn định giữa các lần build.
          const bare = (u) => u.split(/[?#]/)[0];
          page.on('response', (r) => { if (r.status() >= 400 && !mocked.has(r.url())) resources.push(`${r.status()} ${bare(r.url())}`); });
          page.on('requestfailed', (r) => resources.push(`${r.failure()?.errorText || 'failed'} ${bare(r.url())}`));
          const info = { s, state: st.id, where, tier, expr, coarse, steps: st.steps };
          let resp;
          try {
            // Route của state khai báo sau nên được ưu tiên (Playwright chạy handler đăng ký sau cùng trước).
            await applyRoutes(page, routes, mocked);
            resp = await page.goto(url, { waitUntil: 'load', timeout: 20000 });
            await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
          } catch (e) {
            add({ screen: s.id, state: st.id, rule: 'load', severity: 'blocker', where, msg: `Không tải được ${url}: ${e.message.split('\n')[0]}` });
            await ctx.close();
            continue;
          }
          if (resp && resp.status() >= 400) add({ screen: s.id, state: st.id, rule: 'http-status', severity: 'blocker', where, msg: `${url} trả ${resp.status()}` });
          // Router dạng hash (/#/admin): so cả phần hash, không thì bị chuyển sang /#/login vẫn "đúng trang".
          const routeOf = (u) => { const x = new URL(u); return (x.pathname.replace(/\/$/, '') + (new URL(url).hash ? x.hash.split('?')[0] : '')); };
          const wantPath = routeOf(url);
          const gotPath = routeOf(page.url());
          if (wantPath !== gotPath) {
            add({ screen: s.id, state: st.id, rule: 'redirected', severity: 'blocker', where, msg: `Yêu cầu ${wantPath || '/'} nhưng bị chuyển tới ${gotPath || '/'} (cần đăng nhập? dùng --storage-state). Không kiểm tiếp.` });
            await ctx.close();
            continue;
          }
          // Điều kiện sẵn sàng: không đo trên khung xương / hộp đăng nhập che trang.
          // "ready" của màn hình chờ TRƯỚC các bước; "ready" của state chờ SAU các bước (dấu hiệu trạng thái đã dựng xong).
          const waitReady = async (sel, phase) => {
            try {
              await vis(page, sel).waitFor({ state: 'visible', timeout: 15000 });
              return true;
            } catch {
              add({ screen: s.id, state: st.id, rule: 'not-ready', severity: 'blocker', where, msg: `Không thấy "${sel}" sau 15s (${phase}) — chưa sẵn sàng, kết quả đo không có giá trị. Không kiểm tiếp.` });
              await page.screenshot({ path: path.join(outDir, `${s.id}~${st.id}_${vp.name}_${theme}_NOT-READY.png`), fullPage: true });
              await ctx.close();
              return false;
            }
          };
          // State có route riêng (ví dụ API lỗi) có thể không bao giờ hiện nội dung của màn hình: khi đó chỉ chờ ready của state.
          if (s.ready && !(st.route && st.ready && !st.steps) && !(await waitReady(s.ready, 'màn hình'))) continue;
          if (st.steps) {
            try {
              await runSteps(page, st.steps);
              await page.waitForTimeout(300);
            } catch (e) {
              add({ screen: s.id, state: st.id, rule: 'state-steps', severity: 'blocker', where, msg: `Không dựng được trạng thái "${st.id}": ${e.message.split('\n')[0]}` });
              await ctx.close();
              continue;
            }
          }
          if (st.ready && !(await waitReady(st.ready, 'trạng thái'))) continue;
          if (!s.ready && !st.ready) {
            // Không khai báo ready: chặn trường hợp trang trắng/SPA chưa render mà vẫn "0 phát hiện".
            const len = await page.evaluate(() => (document.body?.innerText || '').trim().length);
            if (len < 40) add({ screen: s.id, state: st.id, rule: 'empty-page', severity: 'blocker', where, msg: `Trang gần như trống (${len} ký tự) — chưa render hoặc bị chặn; khai báo "ready" và kiểm lại` });
          }
          const shot = `${s.id}${st.id === 'dau' ? '' : `~${st.id}`}_${vp.name}_${theme}.png`;
          await loadLazy(page);
          await page.screenshot({ path: path.join(outDir, shot), fullPage: true });
          shots.push(shot);
          statesRun.add(`${s.id}/${st.id}`);
          // Theme tối có thật sự đổi không (app đổi theme bằng class/localStorage mà thiếu themeStorage thì "dark" đo lại bản sáng).
          if (st.id === 'dau' && vp.name === '1440') themeBg.set(`${s.id}|${theme}`, await page.evaluate(() => {
            const bg = (e) => e && getComputedStyle(e).backgroundColor;
            const b = bg(document.body), h = bg(document.documentElement);
            return b && b !== 'rgba(0, 0, 0, 0)' ? b : h;
          }));

          await checkPage(page, info);
          if (useImpeccable && theme === 'light' && ['320', '1440'].includes(vp.name)) await runImpeccable(page, info);
          // Trạng thái sau thao tác (xoá/lưu xong…): focus phải ở chỗ đã khai báo, không rơi về <body> (04 §10, W5).
          if (st.expectFocus) {
            await page.waitForTimeout(200);
            const f = await page.evaluate((sel) => {
              const a = document.activeElement;
              return { ok: !!a && a !== document.body && a.matches(sel), now: !a || a === document.body ? '<body>' : `${a.tagName.toLowerCase()}${a.id ? `#${a.id}` : ''} "${(a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 40)}"` };
            }, st.expectFocus).catch(() => ({ ok: false, now: 'selector lỗi' }));
            if (!f.ok) add({ screen: s.id, state: st.id, where, rule: 'focus-after-action', severity: tier === 'A' ? 'blocker' : 'major', msg: `Sau thao tác, focus đang ở ${f.now}, không ở "${st.expectFocus}"` });
          }
          // Sau thao tác, URL phải khớp nội dung đang hiện (ví dụ Back về "#/tong-quan" thì trang Tổng quan phải hiện — ready kiểm phần nội dung)
          if (st.expectUrl && !page.url().includes(st.expectUrl)) {
            add({ screen: s.id, state: st.id, where, rule: 'url-after-action', severity: tier === 'A' ? 'blocker' : 'major', msg: `Sau thao tác, URL là "${page.url().replace(values.base, '')}", không chứa "${st.expectUrl}"` });
          }
          if (st.dialog) await checkDialog(page, info);
          else if (st.id === 'dau') await checkTab(page, info);

          for (const e of errors) add({ screen: s.id, state: st.id, rule: 'js-error', severity: 'blocker', where, target: e.slice(0, 80), msg: `Lỗi JS: ${e.slice(0, 200)}` });
          for (const r of resources) add({ screen: s.id, state: st.id, rule: 'resource-error', severity: 'major', where, target: r.slice(0, 120), msg: `Tài nguyên lỗi: ${r.slice(0, 200)}` });
          if (st.id === 'dau' && vp.name === '1440' && theme === 'light') jsTextLen.set(s.id, await page.evaluate(() => (document.body.innerText || '').trim().length));
          await ctx.close();
        }
      }
    }

    // Kiểm định bổ sung (một lần cho mỗi màn hình, trạng thái đầu, theme sáng): phóng to 200%, text-spacing, forced-colors, tắt JS
    const loadFailed = [...findings.values()].some((f) => f.screen === s.id && f.state === 'dau' && ['load', 'redirected', 'http-status', 'not-ready', 'empty-page'].includes(f.rule));
    if (!loadFailed) {
      const extra = async (opts, prepare, label) => {
        const c = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce', ...(storageSrc ? { storageState: storageSrc } : {}), ...opts });
        if (opts.javaScriptEnabled !== false) await seedStorage(c, s, 'light');
        const pg = await c.newPage();
        try {
          if (opts.javaScriptEnabled !== false) await applyRoutes(pg, s.route, null);
          await pg.goto(url, { waitUntil: 'load', timeout: 20000 });
          await pg.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
          if (s.ready && opts.javaScriptEnabled !== false) await vis(pg, s.ready).waitFor({ state: 'visible', timeout: 15000 });
          if (prepare) await prepare(pg);
          return { c, pg };
        } catch (e) {
          add({ screen: s.id, rule: `${label}-load`, severity: 'major', where: label, msg: `Không chạy được kiểm định ${label}: ${e.message.split('\n')[0]}` });
          await c.close();
          return null;
        }
      };
      const clippedText = (pg) => pg.evaluate(() => {
        const out = [];
        const seen = new Set();
        const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n = tw.nextNode(); n; n = tw.nextNode()) {
          if (n.textContent.trim().length < 2) continue;
          for (let el = n.parentElement; el && el !== document.body; el = el.parentElement) {
            if (seen.has(el)) break;
            const cs = getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility !== 'visible') break;
            const clipX = ['hidden', 'clip'].includes(cs.overflowX), clipY = ['hidden', 'clip'].includes(cs.overflowY);
            if (!clipX && !clipY) continue;
            // Bỏ qua phần tử ẩn trực quan có chủ ý (sr-only: 1×1px hoặc clip rect 0)
            if (el.clientWidth <= 2 || el.clientHeight <= 2 || /rect\(0(px)?,? 0(px)?,? 0(px)?,? 0(px)?\)/.test(cs.clip)) break;
            const lostY = clipY && el.scrollHeight > el.clientHeight + 2;
            const lostX = clipX && el.scrollWidth > el.clientWidth + 2 && cs.textOverflow !== 'ellipsis';
            if ((lostY || lostX) && el.clientHeight > 0) {
              seen.add(el);
              const t = (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 120);
              out.push(el.id ? `${el.tagName.toLowerCase()}#${el.id}` : `${el.tagName.toLowerCase()}${t ? ` "${t}"` : ''}`);
            }
            break;
          }
        }
        return out;
      });
      // W11a: phóng to 200% của cửa sổ 1280×800 = khung nhìn CSS 640×400 ở mật độ điểm ảnh 2 (media query đổi như khi người dùng bấm Ctrl +)
      let r = await extra({ viewport: { width: 640, height: 400 }, deviceScaleFactor: 2 }, null, 'zoom200');
      if (r) {
        for (const t of await clippedText(r.pg)) add({ screen: s.id, rule: 'zoom-200-clipped', severity: 'major', target: t, where: 'zoom200', msg: 'Chữ bị cắt khi phóng to 200% (SC 1.4.4)' });
        const ov = await r.pg.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        if (ov > 1) add({ screen: s.id, rule: 'zoom-200-overflow', severity: 'major', where: 'zoom200', msg: `Tràn ngang ${ov}px khi phóng to 200% (SC 1.4.4/1.4.10)` });
        await loadLazy(r.pg);
        await r.pg.screenshot({ path: path.join(outDir, `${s.id}_zoom200.png`), fullPage: true });
        await r.c.close();
      }
      // W11: text-spacing theo SC 1.4.12
      r = await extra({}, (pg) => pg.addStyleTag({ content: '*{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important}p{margin-bottom:2em!important}' }), 'text-spacing');
      if (r) {
        for (const t of await clippedText(r.pg)) add({ screen: s.id, rule: 'text-spacing-clipped', severity: 'major', target: t, where: 'text-spacing', msg: 'Chữ bị cắt khi tăng khoảng cách chữ/dòng (SC 1.4.12)' });
        await loadLazy(r.pg);
        await r.pg.screenshot({ path: path.join(outDir, `${s.id}_text-spacing.png`), fullPage: true });
        await r.c.close();
      }
      // W11b forced-colors: chỉ chụp ảnh để người xem (focus, viền, icon còn thấy không)
      r = await extra({ forcedColors: 'active' }, null, 'forced-colors');
      if (r) {
        await loadLazy(r.pg);
        await r.pg.screenshot({ path: path.join(outDir, `${s.id}_forced-colors.png`), fullPage: true });
        await r.c.close();
        notChecked.add('Chế độ tương phản cao: xem ảnh *_forced-colors.png (viền điều khiển, icon, focus còn thấy không); trạng thái khác trạng thái đầu chưa chụp');
      }
      // W14: tắt JavaScript — chỉ cho trang render phía server (ssr: true)
      if (s.ssr) {
        r = await extra({ javaScriptEnabled: false }, null, 'no-js');
        if (r) {
          const info = await r.pg.evaluate(() => ({ len: (document.body.innerText || '').trim().length, h1: !!document.querySelector('h1') }));
          const full = jsTextLen.get(s.id) || 0;
          if (!info.h1 || (full > 0 && info.len < full * 0.5)) {
            add({ screen: s.id, rule: 'no-js-content', severity: ['E1', 'E2', 'E3'].includes(expr) ? 'major' : 'minor', where: 'no-js', msg: `Tắt JavaScript chỉ còn ${info.len}/${full} ký tự${info.h1 ? '' : ', không có <h1>'} (W14)` });
          }
          await r.c.close();
        }
      }
    }

    // Những gì máy không kiểm cho màn hình này (A6): luôn in, để "0 phát hiện" không bị đọc thành "đạt chuẩn".
    notChecked.add(`${s.id}: yêu cầu loại trang "${s.type}" (03 — Bắt buộc, Tránh, Kiểm riêng) và nền tảng (03B) — kiểm tay, ghi bằng chứng (11 §3 lớp 2)`);
    notChecked.add(`${s.id}: phép thử 07 §7 mức ${expr}${expr === 'E0' ? ' (T3, T6, T7, T9, 04 §11, T10 bậc cấm/liều, T12 không gọt quá tay)' : ''} — người duyệt kết luận (01 §4); máy không kết luận được`);
    notChecked.add(`${s.id}: trạng thái trong 03 "Trạng thái"/"Kiểm riêng" và dialog có trong mã mà chưa khai báo ở "states" — người làm đối chiếu và ghi tên (script không tự biết)`);
    if (!s.ready) notChecked.add(`${s.id}: không khai báo "ready" — không biết đã đo trên trang có dữ liệu hay khung xương/hộp đăng nhập; xem ảnh chụp`);
    if (!(s.states || []).length) notChecked.add(`${s.id}: chỉ kiểm trạng thái đầu — dialog, rỗng, lỗi, đang tải chưa khai báo trong "states"`);
    if (!(s.states || []).some((x) => x.dialog)) notChecked.add(`${s.id}: dialog (focus vào trong, Escape, trả focus) chưa kiểm bằng máy — thêm state "dialog": true hoặc kiểm tay`);
    if (!useImpeccable) notChecked.add(`${s.id}: W17 dấu hiệu slop bề mặt — chạy lại với --impeccable hoặc người xem theo 07 §4`);
  }
  // Bằng chứng T3 (2.4): ảnh làm mờ 8px của trạng thái đầu, 320 và 1440, theme sáng — người duyệt đối chiếu với bảng vai trò khối (10 §2).
  const blurPage = await browser.newPage();
  for (const f of shots.filter((x) => /^[a-z0-9-]+_(320|1440)_light.png$/.test(x))) {
    const data = fs.readFileSync(path.join(outDir, f)).toString('base64');
    await blurPage.setContent(`<body style="margin:0"><img id=i src="data:image/png;base64,${data}" style="filter:blur(8px);display:block"></body>`);
    const box = await blurPage.locator('#i').boundingBox();
    await blurPage.setViewportSize({ width: Math.ceil(box.width), height: Math.min(Math.ceil(box.height), 4000) });
    const out = f.replace('.png', '_T3-blur8.png');
    await blurPage.locator('#i').screenshot({ path: path.join(outDir, out) });
    shots.push(out);
  }
  await blurPage.close();
} catch (e) {
  // Lỗi không lường trước của script: mã 2 (không chạy được), không bao giờ là mã 1 "có blocker".
  console.error(`Lỗi: audit.mjs dừng giữa chừng — ${e.stack || e.message}`);
  await browser.close().catch(() => {});
  process.exit(2);
} finally {
  await browser.close().catch(() => {});
}

for (const s of skipped) notChecked.add(`Màn hình ${s.id} (${s.platform}${s.stack ? `/${s.stack}` : ''}): kiểm bằng ${hintFor(s)}`);
notChecked.add('Trình đọc màn hình, hồi quy hình ảnh, tương phản trên ảnh/gradient, Core Web Vitals và chất lượng UX — kiểm thủ công theo 08 §3');
if (screens.some((s) => String(s.tier).toUpperCase() === 'A')) notChecked.add('Hạng A, con trỏ chính xác: hành động chính/phá huỷ ≥ 44px chỉ kiểm được khi gắn data-primary-action');
if (useImpeccable) notChecked.add('W17 impeccable: không có luật cho G2-01 (giao diện thư viện để nguyên) và G2-10 (Title Case tiếng Việt) — người xem');
if (storageSrc) notChecked.add(`Đã dùng file phiên ${storageSrc}: xoá sau khi kiểm`);
if (versionNote) notChecked.add(versionNote);
for (const s of screens) {
  if (!cfg.darkMode) continue;
  const l = themeBg.get(`${s.id}|light`), d = themeBg.get(`${s.id}|dark`);
  if (l && d && l === d) notChecked.add(`${s.id}: theme tối có cùng màu nền với theme sáng (${l}) — app có thể đổi theme bằng class/localStorage; khai báo "themeStorage", kết quả "dark" lần này chưa đáng tin`);
}

const list = [...findings.values()].map((f) => {
  const exRaw = exceptions.get(f.id);
  const ex = exRaw && f.severity === 'minor' ? exRaw : null;
  if (exRaw && !ex) notChecked.add(`Ngoại lệ ${exRaw.id || f.id} bị bỏ qua: local waiver chỉ áp dụng cho minor`);
  const msgs = [...new Set(f.where.values())];
  const targets = [...f.targets];
  const ws = [...f.where.keys()];
  return { ...f, where: ws.join(', '), whereShort: ws.length > 4 ? `${ws.slice(0, 3).join(', ')} … (+${ws.length - 3})` : ws.join(', '), msg: msgs.join(' / '), targets, elements: Math.max(targets.length, 1), isNew: !baseline.has(f.id), exception: ex ? `${ex.id || ''} (hạn ${ex.expires}; ${ex.approvalRef})` : '', waived: Boolean(ex) };
});
list.sort((a, b) => SEV[a.severity] - SEV[b.severity] || a.screen.localeCompare(b.screen) || a.state.localeCompare(b.state));
// Ngoại lệ không khớp phát hiện nào (đã sửa xong, hoặc ID đổi) — báo để dọn, không im lặng.
const ran = new Set(screens.map((s) => s.id));
for (const [fid, ex] of exceptions) if (ran.has(fid.split('|')[0]) && !findings.has(fid)) notChecked.add(`Ngoại lệ ${ex.id || fid} không khớp phát hiện nào lần này — đã sửa thì xoá ngoại lệ; ID đổi thì cập nhật`);
const staleBase = [...baseline].filter((id) => ran.has(id.split('|')[0]) && !findings.has(id)).length;
if (staleBase && !values.only) notChecked.add(`${staleBase} mục baseline không còn xuất hiện — chạy --update-baseline để thu nhỏ baseline`);
const count = (sev, onlyNew = false) => list.filter((f) => f.severity === sev && !f.waived && (!onlyNew || f.isNew)).length;
const countEl = (sev) => list.filter((f) => f.severity === sev && !f.waived).reduce((n, f) => n + f.elements, 0);
const esc = (x) => String(x || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const short = (arr, n = 3) => arr.slice(0, n).map((t) => (t.length > 70 ? `${t.slice(0, 70)}…` : t)).join('; ') + (arr.length > n ? `; … (+${arr.length - n})` : '');

const md = [
  `# Báo cáo kiểm định tự động`,
  ``,
  `Bộ chuẩn: ${STANDARD} · Thời điểm: ${new Date().toISOString()} · Base: ${values.base} · Màn hình: ${screens.map((s) => `${s.id} (${['dau', ...(s.states || []).map((x) => x.id)].join(', ')})`).join('; ')} · Theme: ${themes.join(', ')} · Viewport: ${VIEWPORTS.map((v) => v.name).join(', ')} · axe-core: ${AxeBuilder ? 'có' : 'KHÔNG'} · impeccable: ${useImpeccable ? (impeccableOk === false ? `${IMPECCABLE_VERSION} — LỖI, W17 chưa kiểm` : IMPECCABLE_VERSION) : 'không'}`,
  ``,
  `Mỗi dòng là **một nguyên nhân** (cùng luật, cùng cặp màu hoặc cùng phần tử); cột "Phần tử" đếm số phần tử bị ảnh hưởng. "0 phát hiện" chỉ nghĩa là các luật máy đo được không vi phạm ở các trạng thái đã chụp — xem mục "Chưa kiểm".`,
  ``,
  `| Mức | Nguyên nhân (trừ ngoại lệ còn hạn) | Phần tử | Mới (ngoài baseline) |`,
  `| --- | --- | --- | --- |`,
  ...['blocker', 'major', 'minor'].map((s) => `| ${s} | ${count(s)} | ${countEl(s)} | ${count(s, true)} |`),
  ``,
  `## Phát hiện`,
  ``,
  `| Mức | Mới | Ngoại lệ | Màn hình / trạng thái | Luật | Phần tử | Ở đâu | Mô tả | Chi tiết | ID |`,
  `| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |`,
  ...list.map((f) => `| ${f.severity} | ${f.isNew ? 'mới' : ''} | ${esc(f.exception)} | ${f.screen} / ${f.state} | ${f.rule} | ${f.targets.length ? `${f.elements}: ${esc(short(f.targets))}` : '—'} | ${f.whereShort} | ${esc(f.msg)} | ${esc(short([...new Set(f.details)], 2))} | \`${esc(f.id)}\` |`),
  ``,
  `ID trong bảng đã thoát ký tự \`|\` cho markdown; khi ghi ngoại lệ, lấy ID nguyên dạng ở \`audit_report.json\`.`,
  ``,
  `## Chưa kiểm`,
  ``,
  ...[...notChecked].map((n) => `- ${n}`),
  ``,
  `## Ảnh chụp`,
  ``,
  ...shots.map((x) => `- ${x}`),
].join('\n');
fs.writeFileSync(path.join(outDir, 'audit_report.md'), md);
fs.writeFileSync(path.join(outDir, 'audit_report.json'), JSON.stringify({ standard: STANDARD, base: values.base, impeccable: useImpeccable ? `${IMPECCABLE_VERSION}${impeccableOk === false ? ' (lỗi)' : ''}` : false, statesRun: [...statesRun], findings: list, notChecked: [...notChecked], requiredMissing: [...requiredMissing], screenshots: shots }, null, 2));
console.log(md);
console.log(`\nBáo cáo: ${path.resolve(outDir)}`);

if (values['update-baseline']) {
  const forbidden = list.filter((finding) => !canEnterBaseline(finding));
  if (forbidden.length) fail(`Baseline chỉ nhận minor; còn ${forbidden.length} blocker/major.`);
  const ids = list.filter(canEnterBaseline).map((finding) => finding.id);
  fs.writeFileSync(baselineFile, JSON.stringify(ids, null, 2));
  console.log(`\nĐã ghi baseline ${baselineFile} (${ids.length} mục).`);
  process.exit(0);
}
const verdict = auditVerdict({ findings: list, requiredMissing: [...requiredMissing] });
if (!verdict.ok) console.error(`\nCHƯA ĐẠT: ${verdict.reasons.join('; ')}`);
process.exitCode = verdict.ok ? 0 : 1;
