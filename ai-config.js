(() => {
  'use strict';
  const URL_KEY = 'durra_ai_api_url_v1';
  const CODE_KEY = 'durra_ai_access_code_v1';
  window.DURRA_AI_CONFIG = {
    get apiUrl(){ return (localStorage.getItem(URL_KEY) || '').trim(); },
    get accessCode(){ return localStorage.getItem(CODE_KEY) || ''; },
    save(url, code){
      const clean = String(url || '').trim().replace(/\/+$/, '');
      if(clean) localStorage.setItem(URL_KEY, clean); else localStorage.removeItem(URL_KEY);
      if(code) localStorage.setItem(CODE_KEY, String(code)); else localStorage.removeItem(CODE_KEY);
      return clean;
    },
    clear(){ localStorage.removeItem(URL_KEY); localStorage.removeItem(CODE_KEY); },
    timeoutMs: 45000,
    quizCount: 8
  };
})();
