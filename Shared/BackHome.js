(() => {
  const scriptEl = document.currentScript;
  // 传相对路径（相对当前项目页）或绝对路径；默认 '/index.html'
  const homeAttr = scriptEl?.dataset?.home || '/index.html';
  const homeURL = new URL(homeAttr, location.href);

  const btn = document.createElement('button');
  btn.className = 'back-home';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to Home');
  btn.textContent = '← Home';

  btn.addEventListener('click', () => {
    // 如果是从主页打开的新标签，尝试关闭标签；否则跳转回主页
    try {
      const from = document.referrer ? new URL(document.referrer) : null;
      const isFromSameHome = !!from && from.pathname.endsWith(new URL(homeAttr, location.href).pathname);
      if (isFromSameHome && window.opener && !window.opener.closed) {
        // 仅在由脚本 window.open 打开的窗口中有效
        window.close();
        return;
      }
    } catch (_) {}
    location.href = homeURL.href;
  });

  // 插入到 body 末尾
  window.addEventListener('DOMContentLoaded', () => document.body.appendChild(btn));
})();
