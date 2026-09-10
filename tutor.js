(() => {
  'use strict';
  const panel = document.getElementById('tutorSubjectPanel');
  const welcome = document.getElementById('tutorWelcome');
  const title = document.getElementById('tutorSubjectTitle');
  const text = document.getElementById('tutorSubjectText');
  const back = document.getElementById('tutorBack');

  const subjects = {
    physics: {
      title: '⚡ الفيزياء',
      text: 'هنا سيشرح المدرّس القانون، معنى الرموز، الوحدات، المثال، ثم يعطي دُرّة مسألة تحلها بنفسها.'
    },
    english: {
      title: '🇬🇧 اللغة الإنكليزية',
      text: 'هنا سيشرح المدرّس الكلمات والقواعد والقطع بطريقة قصيرة، ثم يعمل اختبارًا سريعًا ومراجعة للأخطاء.'
    }
  };

  document.querySelectorAll('[data-subject]').forEach(btn => {
    btn.addEventListener('click', () => {
      const subject = subjects[btn.dataset.subject];
      if (!subject) return;
      title.textContent = subject.title;
      text.textContent = subject.text;
      welcome.classList.add('hidden');
      panel.classList.remove('hidden');
      panel.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  back?.addEventListener('click', () => {
    panel.classList.add('hidden');
    welcome.classList.remove('hidden');
  });
})();
