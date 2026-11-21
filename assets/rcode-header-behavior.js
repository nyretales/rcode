/* R•CODE V1.7 — compact sticky header state */
(() => {
  const header = document.querySelector('.rcode-site-header');
  if (!header) return;
  let scheduled = false;
  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 48);
    scheduled = false;
  };
  const onScroll = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  };
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
