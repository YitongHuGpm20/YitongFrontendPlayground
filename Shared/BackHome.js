(() => {
  const scriptEl = document.currentScript;
  // Get home URL from data attribute or default to /index.html
  const homeAttr = scriptEl?.dataset?.home || '/index.html';
  const homeURL = new URL(homeAttr, location.href);

  const btn = document.createElement('button');
  btn.className = 'back-home';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to Home');
  btn.textContent = '← Home';

  btn.addEventListener('click', () => {
    // If opened from home page in a new tab, try to close the tab; otherwise, go back to home page
    try {
      const from = document.referrer ? new URL(document.referrer) : null;
      const isFromSameHome = !!from && from.pathname.endsWith(new URL(homeAttr, location.href).pathname);
      if (isFromSameHome && window.opener && !window.opener.closed) {
        // Only works for windows opened by script window.open
        window.close();
        return;
      }
    } catch (_) {}
    location.href = homeURL.href;
  });

  // Insert button at the end of the body
  window.addEventListener('DOMContentLoaded', () => document.body.appendChild(btn));
})();
