#!/usr/bin/env node
// Kiểm tra tương phản các cặp màu khai báo trong file token theo ngưỡng hạng A/B/C.
//
// Cách dùng:
//   node check_tokens.mjs <tokens.json> --tier A|B|C
//   node check_tokens.mjs <tokens.json> --config design.config.json   (lấy hạng cao nhất trong config)
//
// Mã thoát: 0 = mọi cặp đạt · 1 = có cặp không đạt · 2 = lỗi cấu hình / dữ liệu.
// Không cần thư viện ngoài. Màu: #rgb, #rgba, #rrggbb, #rrggbbaa, rgb()/rgba(), oklch().
// Màu có alpha được trộn lên nền trước khi tính (WCAG 2.x relative luminance).

import fs from 'node:fs';
import { parseArgs } from 'node:util';

const THRESHOLDS = {
  A: { text: 7, 'large-text': 4.5, 'non-text': 3 },
  B: { text: 4.5, 'large-text': 3, 'non-text': 3 },
  C: { text: 4.5, 'large-text': 3, 'non-text': 3 },
};
const TIER_RANK = { C: 0, B: 1, A: 2 };

class ConfigError extends Error {}
const warnings = [];

function num(v, pctScale = 1) {
  if (v === 'none') return 0;
  return v.endsWith('%') ? (parseFloat(v) / 100) * pctScale : parseFloat(v);
}

function hueToRad(v) {
  if (v === 'none') return 0;
  const n = parseFloat(v);
  if (v.endsWith('turn')) return n * 2 * Math.PI;
  if (v.endsWith('grad')) return (n * Math.PI) / 200;
  if (v.endsWith('rad')) return n;
  return (n * Math.PI) / 180; // deg hoặc không đơn vị
}

function checkChannels(c, str) {
  for (const k of ['r', 'g', 'b']) {
    if (!Number.isFinite(c[k]) || c[k] < -0.5 || c[k] > 255.5) throw new ConfigError(`Kênh màu ngoài khoảng 0–255 hoặc không phải số: ${str}`);
  }
  if (!Number.isFinite(c.a) || c.a < 0 || c.a > 1) throw new ConfigError(`Alpha ngoài khoảng 0–1: ${str}`);
  return c;
}

// Giá trị màu DTCG (2025.10): { colorSpace, components, alpha?, hex? }
function fromDtcg(v, raw) {
  const a = v.alpha ?? 1;
  if (typeof v.hex === 'string') return { ...parseColor(v.hex), a };
  const c = v.components || [];
  if (v.colorSpace === 'srgb') return checkChannels({ r: c[0] * 255, g: c[1] * 255, b: c[2] * 255, a }, raw);
  if (v.colorSpace === 'oklch') return { ...oklchToSrgb(c[0], c[1], ((c[2] === 'none' ? 0 : c[2]) * Math.PI) / 180, raw), a };
  throw new ConfigError(`Không hỗ trợ colorSpace "${v.colorSpace}" (dùng srgb, oklch, hoặc kèm hex): ${raw}`);
}

function parseColor(input) {
  if (input && typeof input === 'object') return fromDtcg(input, JSON.stringify(input));
  const str = input;
  const s = String(str).trim().toLowerCase();
  let m;
  if ((m = s.match(/^#([0-9a-f]{3,8})$/))) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
    if (h.length !== 6 && h.length !== 8) throw new ConfigError(`Mã hex không hợp lệ: ${str}`);
    const n = (i) => parseInt(h.slice(i, i + 2), 16);
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
  }
  if ((m = s.match(/^rgba?\(([^)]+)\)$/))) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean);
    if (p.length < 3) throw new ConfigError(`rgb() thiếu kênh: ${str}`);
    return checkChannels({ r: num(p[0], 255), g: num(p[1], 255), b: num(p[2], 255), a: p[3] === undefined ? 1 : num(p[3]) }, str);
  }
  if ((m = s.match(/^oklch\(([^)]+)\)$/))) {
    const p = m[1].split(/[\s/]+/).filter(Boolean);
    if (p.length < 3) throw new ConfigError(`oklch() thiếu thành phần: ${str}`);
    const L = num(p[0]);          // 50% = 0.5
    const C = num(p[1], 0.4);     // 100% = 0.4 theo CSS Color 4
    const H = hueToRad(p[2]);
    if (![L, C, H].every(Number.isFinite)) throw new ConfigError(`oklch() có thành phần không phải số: ${str}`);
    return checkChannels({ ...oklchToSrgb(L, C, H, str), a: p[3] === undefined ? 1 : num(p[3]) }, str);
  }
  throw new ConfigError(`Không đọc được màu: ${str}`);
}

function oklchToSrgb(L, C, h, original) {
  const A = C * Math.cos(h);
  const B = C * Math.sin(h);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  if (lin.some((x) => x < -0.001 || x > 1.001)) {
    warnings.push(`${original} nằm ngoài gam sRGB, đã cắt về sRGB; màn hình P3 có thể hiển thị khác — kiểm lại bằng mắt.`);
  }
  const enc = (x) => {
    const v = Math.min(1, Math.max(0, x));
    return 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
  };
  return { r: enc(lin[0]), g: enc(lin[1]), b: enc(lin[2]) };
}

function blend(fg, bg) {
  const a = fg.a ?? 1;
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
}

function luminance({ r, g, b }) {
  const f = (v) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(c1, c2) {
  const [hi, lo] = [luminance(c1), luminance(c2)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const toHex = ({ r, g, b }) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

// Tham chiếu {a.b.c}: tìm từ gốc file trước, sau đó trong nhánh "color". Chấp nhận "value" và "$value".
function resolve(tokens, ref, seen = new Set()) {
  if (ref && typeof ref === 'object' && 'colorSpace' in ref) return ref; // màu DTCG dạng đối tượng
  if (typeof ref !== 'string') throw new ConfigError(`Giá trị token không hợp lệ: ${JSON.stringify(ref)}`);
  if (!ref.startsWith('{')) return ref;
  const key = ref.slice(1, -1);
  if (seen.has(key)) throw new ConfigError(`Tham chiếu vòng: ${key}`);
  seen.add(key);
  const walk = (root) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), root);
  let val = walk(tokens);
  if (val === undefined) val = walk(tokens.color);
  if (val === undefined) throw new ConfigError(`Không tìm thấy token: ${key}`);
  if (val && typeof val === 'object' && !('colorSpace' in val)) val = val.$value ?? val.value;
  return resolve(tokens, val, seen);
}

function readScreenTiers(file) {
  const cfg = JSON.parse(fs.readFileSync(file, 'utf8'));
  const screens = cfg.screens || [];
  if (!screens.length) throw new ConfigError(`${file} không có "screens"`);
  const map = new Map();
  for (const s of screens) {
    const t = String(s.tier || '').toUpperCase();
    if (!(t in TIER_RANK)) throw new ConfigError(`Màn hình ${s.id || s.path} có hạng không hợp lệ: ${s.tier}`);
    map.set(s.id, t);
  }
  return map;
}
const maxTier = (tiers) => tiers.reduce((best, t) => (best === null || TIER_RANK[t] > TIER_RANK[best] ? t : best), null);

function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { tier: { type: 'string' }, config: { type: 'string' } },
  });
  const file = positionals[0];
  if (!file) throw new ConfigError('Cách dùng: node check_tokens.mjs <tokens.json> --tier A|B|C  (hoặc --config design.config.json)');

  const cliTier = values.tier?.toUpperCase();
  if (cliTier && !THRESHOLDS[cliTier]) throw new ConfigError(`Hạng không hợp lệ: ${cliTier}`);
  const screenTiers = values.config ? readScreenTiers(values.config) : null;
  const cfgTier = screenTiers ? maxTier([...screenTiers.values()]) : null;
  if (cliTier && cfgTier && TIER_RANK[cliTier] < TIER_RANK[cfgTier]) {
    throw new ConfigError(`--tier ${cliTier} thấp hơn hạng cao nhất trong config (${cfgTier}). Bỏ --tier, hoặc gắn "screens" cho từng cặp.`);
  }
  const tier = cliTier || cfgTier;
  if (!tier) throw new ConfigError('Thiếu hạng: truyền --tier A|B|C hoặc --config design.config.json. Không có hạng mặc định.');

  const tokens = JSON.parse(fs.readFileSync(file, 'utf8'));
  const themes = tokens.pairs;
  if (!themes || !Object.values(themes).some((p) => Array.isArray(p) && p.length)) {
    throw new ConfigError(`${file} không có cặp nào trong "pairs" — không có gì để kiểm.`);
  }

  let fails = 0;
  let total = 0;
  for (const [theme, pairs] of Object.entries(themes)) {
    console.log(`\n## ${theme} (hạng chung ${tier}; cặp có "screens" dùng hạng của màn hình đó)`);
    console.log('| Chữ / phần tử | Nền | Loại | Màu thực | Tỉ lệ | Ngưỡng | Kết quả |');
    console.log('| --- | --- | --- | --- | --- | --- | --- |');
    for (const p of pairs) {
      total++;
      const kind = p.kind || 'text';
      if (!THRESHOLDS.A[kind]) throw new ConfigError(`Loại không hợp lệ: ${kind} (text | large-text | non-text)`);
      // Cặp gắn "screens": ngưỡng theo hạng cao nhất trong các màn hình đó (cần --config); không gắn: hạng chung
      let pairTier = tier;
      if (p.screens) {
        if (!screenTiers) throw new ConfigError(`Cặp ${p.fg} / ${p.bg} có "screens" nhưng không truyền --config.`);
        const ts = p.screens.map((id) => {
          if (!screenTiers.has(id)) throw new ConfigError(`Cặp ${p.fg} / ${p.bg}: không có màn hình "${id}" trong config.`);
          return screenTiers.get(id);
        });
        pairTier = maxTier(ts);
        if (cliTier && TIER_RANK[cliTier] > TIER_RANK[pairTier]) pairTier = cliTier;
      }
      let need = THRESHOLDS[pairTier][kind];
      if (p.tier) {
        const pt = String(p.tier).toUpperCase();
        if (!THRESHOLDS[pt]) throw new ConfigError(`Hạng của cặp không hợp lệ: ${p.tier}`);
        need = Math.max(need, THRESHOLDS[pt][kind]); // chỉ được nâng ngưỡng, không hạ
      }
      let bg = parseColor(resolve(tokens, p.bg));
      if (bg.a < 1) {
        if (!p.under) throw new ConfigError(`Nền ${p.bg} trong suốt một phần: cần khai báo "under" (màu nền bên dưới, ví dụ token canvas của theme).`);
        const under = parseColor(resolve(tokens, p.under));
        if (under.a < 1) throw new ConfigError(`"under" ${p.under} phải là màu đặc.`);
        bg = blend(bg, under);
      }
      const fg = blend(parseColor(resolve(tokens, p.fg)), bg);
      const ratio = contrast(fg, bg);
      const ok = ratio >= need;
      if (!ok) fails++;
      const show = (v) => (typeof v === 'string' ? v : JSON.stringify(v));
      console.log(`| ${show(p.fg)} | ${show(p.bg)} | ${kind} | ${toHex(fg)} / ${toHex(bg)} | ${ratio.toFixed(3)}:1 | ${need}:1 | ${ok ? 'đạt' : 'KHÔNG ĐẠT'} |`);
    }
  }
  for (const w of new Set(warnings)) console.log(`\nCảnh báo: ${w}`);
  console.log(`\nTổng: ${total} cặp, ${fails} cặp không đạt.`);
  return fails ? 1 : 0;
}

try {
  process.exitCode = main();
} catch (err) {
  const known = err instanceof ConfigError || err instanceof SyntaxError || err.code === 'ENOENT';
  console.error(`Lỗi: ${known ? err.message : err.stack}`);
  process.exitCode = 2;
}
