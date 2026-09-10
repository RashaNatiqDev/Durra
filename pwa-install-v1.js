(() => {
  let deferredPrompt = null;
  const buttons = () => [document.getElementById('installBtn'), document.getElementById('installBtn2')].filter(Boolean);
  const status = () => document.getElementById('pwaStatus');

  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  function updateUI() {
    const st = status();
    if (isStandalone()) {
      buttons().forEach(b => b.classList.add('hidden'));
      if (st) st.textContent = '✅ DURRA مثبت كتطبيق على هذا الجهاز، والتحديثات تصل من الموقع.';
      return;
    }
    if (deferredPrompt) {
      buttons().forEach(b => b.classList.remove('hidden'));
      if (st) st.textContent = '📱 DURRA جاهز للتثبيت كتطبيق مستقل.';
    } else if (st) {
      st.textContent = '📱 إذا لم يظهر زر التثبيت بعد، حدّثي الصفحة مرة واحدة ثم افتحي قائمة كروم.';
    }
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    updateUI();
  });

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    try { await deferredPrompt.userChoice; } catch (_) {}
    deferredPrompt = null;
    updateUI();
  }

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    updateUI();
  });

  window.addEventListener('DOMContentLoaded', () => {
    buttons().forEach(b => b.addEventListener('click', install));
    updateUI();
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const reg = await navigator.serviceWorker.register('./service-worker.js', { updateViaCache: 'none' });
        await reg.update();
      } catch (_) {}
    });
  }
})();
