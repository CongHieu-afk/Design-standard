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
    <style>body{font:16px/1.6 Arial;margin:24px}button{min-width:48px;min-height:48px}</style>
    </head><body><main><h1>Trang kiểm thử</h1><button id="action">Thực hiện</button></main></body></html>`;
  const server = http.createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    response.end(html);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());
  const { port } = server.address();

  const config = {
    standard: 'design_standard@3.0',
    language: ['vi'],
    tokens: 'tokens.json',
    preview: { url: `http://127.0.0.1:${port}`, command: 'npm run preview' },
    verify: { commands: ['npm test'] },
    screens: [{
      id: 'home', platform: 'web', path: '/', source: ['src/home/'], type: 'home',
      tier: 'C', expression: 'E0', ready: 'main', ssr: true,
      states: [{ id: 'tuong-tac', viewports: ['320'], steps: [{ action: 'click', selector: '#action' }] }],
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
});
