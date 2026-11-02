export function createLifecycleCoordinator(host, { start, stop, rootMargin = '80px' }) {
  if (!host || typeof start !== 'function' || typeof stop !== 'function') {
    throw new TypeError('Lifecycle cần host, start và stop');
  }
  let inView = typeof IntersectionObserver === 'undefined';
  let pageVisible = !document.hidden;
  let running = false;
  let disposed = false;

  const evaluate = () => {
    if (disposed) return;
    const shouldRun = inView && pageVisible;
    if (shouldRun === running) return;
    running = shouldRun;
    (running ? start : stop)();
  };
  const onVisibility = () => { pageVisible = !document.hidden; evaluate(); };
  document.addEventListener('visibilitychange', onVisibility);

  const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
    inView = Boolean(entry?.isIntersecting);
    evaluate();
  }, { rootMargin });
  observer?.observe(host);
  evaluate();

  return {
    isRunning: () => running,
    dispose() {
      if (disposed) return;
      disposed = true;
      document.removeEventListener('visibilitychange', onVisibility);
      observer?.disconnect();
      if (running) { running = false; stop(); }
    },
  };
}
