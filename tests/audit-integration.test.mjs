import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const audit = path.join(root, 'design_standard/scripts/audit.mjs');

const run = (args, cwd) => new Promise((resolve) => {
  const child = spawn(process.execPath, [audit, ...args], { cwd });
  let output = '';
  child.stdout.on('data', (chunk) => { output += chunk; });
  child.stderr.on('data', (chunk) => { output += chunk; });
  child.on('close', (code) => resolve({ code, output }));
});

test('full audit refuses to baseline a major finding', { timeout: 120_000 }, async (t) => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-standard-audit-'));
  t.after(() => fs.rmSync(temp, { recursive: true, force: true }));

  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8">
    <style>
      body{font:16px/1.6 Arial;margin:24px}button{min-width:48px;min-height:48px}
      @keyframes shake{to{transform:translateX(40px)}}
      @keyframes drift{to{left:40px}}
      @keyframes logical{to{margin-inline-start:40px}}
      @keyframes grid-shift{to{grid-template-columns:2fr 1fr}}
      @keyframes fade{to{opacity:.8}}
      #action{animation:shake 2s infinite}
      #finite{animation:shake 100ms 4 both}
      #position{position:relative;animation:drift 2s infinite}
      #logical{animation:logical 2s infinite}
      #grid{display:grid;grid-template-columns:1fr 1fr;animation:grid-shift 2s infinite}
      #fade{animation:fade 150ms 1 both}
    </style>
    </head><body><main><h1>Trang kiểm thử</h1><button id="action">Thực hiện</button><button id="finite">Hữu hạn</button><button id="position">Vị trí</button><button id="logical">Logic</button><button id="fade">Mờ ngắn</button><div id="grid"><span>A</span><span>B</span></div></main></body></html>`;
  const server = http.createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(html);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());
  const { port } = server.address();

  const config = {
    standard: 'design_standard@4.0',
    language: ['vi'],
    tokens: 'tokens.json',
    uiRoots: ['src/'],
    preview: { url: `http://127.0.0.1:${port}`, command: 'npm run preview' },
    verify: { commands: ['npm test'] },
    screens: [{
      id: 'home', platform: 'web', path: '/', source: ['src/home/'], type: 'home',
      tier: 'C', expression: 'E0', ready: 'main', ssr: true,
      states: [{ id: 'tuong-tac', viewports: ['320'], steps: [{ action: 'click', selector: '#action' }] }],
      stateCoverage: {
        loading: 'n/a: trang tĩnh', empty: 'n/a: không có danh sách',
        error: 'n/a: không gọi API', dialog: 'n/a: không có hộp thoại',
      },
    }],
  };
  fs.writeFileSync(path.join(temp, 'design.config.json'), JSON.stringify(config));
  fs.writeFileSync(path.join(temp, 'tokens.json'), '{}');

  const result = await run([
    '--config', 'design.config.json', '--base', config.preview.url,
    '--out', 'audit-out', '--update-baseline',
  ], temp);

  assert.equal(result.code, 2, result.output);
  assert.match(result.output, /Baseline chỉ nhận minor/);
  const report = JSON.parse(fs.readFileSync(path.join(temp, 'audit-out/audit_report.json'), 'utf8'));
  assert.ok(report.findings.some((finding) => finding.rule === 'state-thieu-expectFocus' && finding.severity === 'major'));
  assert.ok(report.findings.some((finding) => finding.rule === 'reduced-motion-active' && finding.severity === 'major'));
  assert.ok(report.findings.some((finding) => finding.rule === 'reduced-motion-active' && finding.targets.some((target) => target.includes('#finite'))));
  assert.ok(report.findings.some((finding) => finding.rule === 'reduced-motion-active' && finding.targets.some((target) => target.includes('#position'))));
  assert.ok(report.findings.some((finding) => finding.rule === 'reduced-motion-active' && finding.targets.some((target) => target.includes('#logical'))));
  assert.ok(report.findings.some((finding) => finding.rule === 'reduced-motion-active' && finding.targets.some((target) => target.includes('#grid'))));
  assert.ok(!report.findings.some((finding) => finding.rule === 'reduced-motion-active' && finding.targets.some((target) => target.includes('#fade'))));
});
