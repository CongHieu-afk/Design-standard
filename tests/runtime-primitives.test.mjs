import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runtime = path.join(root, 'design_standard/runtime');

test('motion primitives preserve accessibility and lifecycle invariants', { timeout: 30_000 }, async (t) => {
  const server = http.createServer((request, response) => {
    const file = path.join(runtime, path.basename(request.url));
    if (!request.url.startsWith('/runtime/') || !fs.existsSync(file)) { response.writeHead(404).end(); return; }
    response.writeHead(200, { 'content-type': 'text/javascript' });
    response.end(fs.readFileSync(file));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());
  const page = await browser.newPage();
  const { port } = server.address();
  await page.goto(`http://127.0.0.1:${port}/runtime/primitives.js`);

  const result = await page.evaluate(async () => {
    document.body.innerHTML = `
      <button id="open">Mở</button>
      <div id="tabs" role="tablist">
        <button role="tab" aria-selected="true" aria-controls="one">Một</button>
        <button role="tab" aria-controls="two">Hai</button>
      </div>
      <section id="one" role="tabpanel">Một</section><section id="two" role="tabpanel">Hai</section>
      <button id="save">Lưu</button><dialog id="dialog"><button>Trong hộp thoại</button></dialog>`;
    const primitives = await import('/runtime/primitives.js');
    const { createLifecycleCoordinator } = await import('/runtime/lifecycle.js');
    const { motionTokens } = await import('/runtime/motion.js');

    const tabs = document.querySelector('#tabs');
    const tabApi = primitives.initTabs({ container: tabs });
    const tabButtons = [...tabs.querySelectorAll('[role=tab]')];
    tabButtons[0].focus();
    tabButtons[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    const tabsOk = document.activeElement === tabButtons[1]
      && tabButtons[1].tabIndex === 0
      && tabButtons[0].tabIndex === -1
      && document.querySelector('#one').hidden
      && !document.querySelector('#two').hidden;
    window.matchMedia = () => ({ matches: true });
    tabApi.updateIndicator();
    const reducedMotionOk = tabs.querySelector('.tab-indicator').style.transition === 'none';
    tabApi.dispose();
    tabButtons[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    const tabDisposeOk = document.activeElement === tabButtons[1];

    const save = document.querySelector('#save');
    primitives.setButtonState(save, 'loading', { text: 'Đang lưu', revertAfter: 10 });
    primitives.setButtonState(save, 'success', { text: 'Đã lưu' });
    await new Promise((resolve) => setTimeout(resolve, 150));
    const buttonOk = save.dataset.buttonState === 'success' && save.textContent === 'Đã lưu' && !save.disabled && !save.hasAttribute('aria-busy');

    const opener = document.querySelector('#open');
    const dialog = document.querySelector('#dialog');
    opener.focus();
    primitives.openDialog(dialog);
    primitives.closeDialog(dialog);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const dialogOk = !dialog.open && document.activeElement === opener;

    const NativeObserver = window.IntersectionObserver;
    let disconnects = 0;
    window.IntersectionObserver = class {
      constructor(callback) { this.callback = callback; }
      observe(target) { this.callback([{ target, isIntersecting: true }]); }
      disconnect() { disconnects++; }
    };
    let starts = 0; let stops = 0;
    const lifecycle = createLifecycleCoordinator(document.body, { start: () => starts++, stop: () => stops++ });
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    lifecycle.dispose();
    lifecycle.dispose();
    window.IntersectionObserver = NativeObserver;

    const { duration, ease } = motionTokens;
    const tokenOk = JSON.stringify(Object.keys(duration)) === JSON.stringify(['press', 'feedback', 'enter', 'exit', 'move'])
      && duration.press >= 100 && duration.press <= 150
      && duration.feedback >= 120 && duration.feedback <= 180
      && duration.enter >= 150 && duration.enter <= 300
      && duration.exit >= 100 && duration.exit <= 220 && duration.exit < duration.enter
      && duration.move >= 200 && duration.move <= 350
      && JSON.stringify(Object.keys(ease)) === JSON.stringify(['enter', 'exit', 'move', 'feedback'])
      && Object.values(ease).every((value) => typeof value === 'string' && value.length > 0);
    return { tabsOk, tabDisposeOk, reducedMotionOk, tokenOk, buttonOk, dialogOk, starts, stops, disconnects, running: lifecycle.isRunning() };
  });

  assert.deepEqual(result, {
    tabsOk: true, tabDisposeOk: true, reducedMotionOk: true, tokenOk: true,
    buttonOk: true, dialogOk: true, starts: 2, stops: 2, disconnects: 1, running: false,
  });
});
