import { motionTokens, prefersReducedMotion } from './motion.js';

const buttonTimers = new WeakMap();
const dialogOpeners = new WeakMap();

export function initTabs({ container, activeClass = 'is-active', indicatorClass = 'tab-indicator' }) {
  if (container?.getAttribute('role') !== 'tablist') throw new TypeError('Tabs cần container role="tablist"');
  const tabs = [...container.querySelectorAll('[role="tab"]')];
  if (!tabs.length) throw new TypeError('Tablist cần ít nhất một role="tab"');
  for (const tab of tabs) {
    const panel = document.getElementById(tab.getAttribute('aria-controls'));
    if (!panel || panel.getAttribute('role') !== 'tabpanel') throw new TypeError('Mỗi tab cần aria-controls tới role="tabpanel"');
  }

  let indicator = container.querySelector(`.${indicatorClass}`);
  if (!indicator) {
    indicator = document.createElement('span');
    indicator.className = indicatorClass;
    indicator.setAttribute('aria-hidden', 'true');
    container.prepend(indicator);
  }
  Object.assign(indicator.style, { position: 'absolute', pointerEvents: 'none', left: '0', top: '0' });
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';

  const updateIndicator = () => {
    const active = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];
    const outer = container.getBoundingClientRect();
    const inner = active.getBoundingClientRect();
    indicator.style.transform = `translate(${inner.left - outer.left}px, ${inner.top - outer.top}px)`;
    indicator.style.width = `${inner.width}px`;
    indicator.style.height = `${inner.height}px`;
    indicator.style.transition = prefersReducedMotion() ? 'none' : `transform ${motionTokens.duration.move}ms ${motionTokens.ease.move}, width ${motionTokens.duration.move}ms ${motionTokens.ease.move}`;
  };
  const select = (selected, focus = false) => {
    for (const tab of tabs) {
      const active = tab === selected;
      tab.classList.toggle(activeClass, active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    }
    if (focus) selected.focus();
    updateIndicator();
  };
  const onClick = (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab && container.contains(tab)) select(tab);
  };
  const onKeyDown = (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab || !container.contains(tab)) return;
    const enabled = tabs.filter((item) => !item.disabled);
    const current = enabled.indexOf(tab);
    const vertical = container.getAttribute('aria-orientation') === 'vertical';
    const forward = vertical ? 'ArrowDown' : 'ArrowRight';
    const backward = vertical ? 'ArrowUp' : 'ArrowLeft';
    let next;
    if (event.key === forward) next = (current + 1) % enabled.length;
    else if (event.key === backward) next = (current - 1 + enabled.length) % enabled.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = enabled.length - 1;
    else return;
    event.preventDefault();
    select(enabled[next], true);
  };
  container.addEventListener('click', onClick);
  container.addEventListener('keydown', onKeyDown);
  const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateIndicator);
  resize?.observe(container);
  select(tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0]);

  return { updateIndicator, dispose() { container.removeEventListener('click', onClick); container.removeEventListener('keydown', onKeyDown); resize?.disconnect(); } };
}

export function setButtonState(button, state, { text, revertAfter = 0 } = {}) {
  if (!button) throw new TypeError('Thiếu button');
  const previous = buttonTimers.get(button);
  clearTimeout(previous?.paint);
  clearTimeout(previous?.revert);
  if (!Object.hasOwn(button.dataset, 'originalText')) {
    button.dataset.originalText = button.textContent;
    button.dataset.originalDisabled = String(button.disabled);
  }
  if (!button.style.minWidth) button.style.minWidth = `${button.offsetWidth}px`;
  button.dataset.buttonState = state;
  button.toggleAttribute('aria-busy', state === 'loading');
  button.disabled = state === 'loading' || button.dataset.originalDisabled === 'true';
  const paint = setTimeout(() => {
    button.textContent = text ?? (state === 'normal' ? button.dataset.originalText : button.textContent);
  }, prefersReducedMotion() ? 0 : motionTokens.duration.press);
  const revert = revertAfter > 0 && state !== 'normal'
    ? setTimeout(() => setButtonState(button, 'normal'), revertAfter)
    : undefined;
  buttonTimers.set(button, { paint, revert });
}

export function openDialog(dialog) {
  if (!dialog || typeof dialog.showModal !== 'function') throw new TypeError('Cần HTMLDialogElement');
  dialogOpeners.set(dialog, document.activeElement);
  dialog.showModal();
  if (!prefersReducedMotion()) dialog.style.animation = `dialog-enter ${motionTokens.duration.enter}ms ${motionTokens.ease.enter}`;
}

export function closeDialog(dialog) {
  if (!dialog?.open) return;
  let fallback;
  const finish = () => {
    clearTimeout(fallback);
    dialog.removeEventListener('animationend', onEnd);
    dialog.removeEventListener('animationcancel', onEnd);
    if (dialog.open) dialog.close();
    dialog.style.animation = '';
    const opener = dialogOpeners.get(dialog);
    if (opener?.isConnected) opener.focus();
  };
  const onEnd = (event) => { if (event.target === dialog) finish(); };
  if (prefersReducedMotion()) { finish(); return; }
  dialog.addEventListener('animationend', onEnd);
  dialog.addEventListener('animationcancel', onEnd);
  dialog.style.animation = `dialog-exit ${motionTokens.duration.exit}ms ${motionTokens.ease.exit}`;
  fallback = setTimeout(finish, motionTokens.duration.exit + 50);
}
