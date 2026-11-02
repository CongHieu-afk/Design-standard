export const motionTokens = Object.freeze({
  duration: Object.freeze({ press: 100, feedback: 150, enter: 200, exit: 150, move: 250 }),
  ease: Object.freeze({
    enter: 'cubic-bezier(0.16, 1, 0.3, 1)',
    exit: 'cubic-bezier(0.32, 0, 0.67, 0)',
    move: 'cubic-bezier(0.65, 0, 0.35, 1)',
    feedback: 'ease-out',
  }),
});

export const prefersReducedMotion = () => {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch { return false; }
};
