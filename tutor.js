(() => {
  'use strict';

  const panel = document.getElementById('tutorSubjectPanel');
  const welcome = document.getElementById('tutorWelcome');
  const title = document.getElementById('tutorSubjectTitle');
  const text = document.getElementById('tutorSubjectText');
  const back = document.getElementById('tutorBack');
  const lessonArea = document.getElementById('tutorLessonArea');
  const pointsEl = document.getElementById('tutorPoints');
  const actions = [...document.querySelectorAll('.tutor-action')];

  const KEYS = {
    points: 'durra_tutor_points_v1',
    mistakes: 'durra_physics_mistakes_v1',
    daily: 'durra_physics_daily_v1'
  };

  const state = {
    subject: null,
    quizIndex: 0,
    quizScore: 0,
    quizLocked: false,
    wrongIds: [],
    englishUnit: null
  };

  const subjects = {
    physics: {
      title: '⚡ الفيزياء',
      text: 'نبدأ من الفصل الأول: المتسعات. شرح قصير، قانون، مثال، ثم سؤال تحلينه بنفسك.'
    },
    english: {
      title: '🇬🇧 اللغة الإنكليزية',
      text: 'قسم الإنكليزي جاهز للمرحلة التالية: كلمات، قواعد، قطع واختبارات قصيرة.'
    }
  };

  const quiz = [
    {
      id: 'q1',
      q: 'ما وحدة قياس السعة الكهربائية C؟',
      options: ['الفولت V', 'الفاراد F', 'الكولوم C', 'الأمبير A'],
      answer: 1,
      why: 'السعة الكهربائية تقاس بالفاراد (F).'
    },
    {
      id: 'q2',
      q: 'أي قانون صحيح للسعة الكهربائية؟',
      options: ['C = Q ÷ ΔV', 'C = Q × ΔV', 'Q = ΔV ÷ C', 'C = ΔV ÷ Q'],
      answer: 0,
      why: 'القانون الأساسي: C = Q / ΔV.'
    },
    {
      id: 'q3',
      q: 'متسعة شحنتها 18 μC وفرق جهدها 6 V. كم سعتها؟',
      options: ['3 μF', '12 μF', '24 μF', '108 μF'],
      answer: 0,
      why: 'C = Q/ΔV = 18/6 = 3 μF.'
    },
    {
      id: 'q4',
      q: 'إذا C = 4 μF و ΔV = 5 V، فما الشحنة Q؟',
      options: ['0.8 μC', '9 μC', '20 μC', '25 μC'],
      answer: 2,
      why: 'Q = C × ΔV = 4 × 5 = 20 μC.'
    },
    {
      id: 'q5',
      q: 'في متسعة لوحين متوازيين، إذا زادت المسافة d بين اللوحين وبقيت بقية العوامل ثابتة، ماذا يحدث للسعة؟',
      options: ['تزداد', 'تقل', 'لا تتغير', 'تصبح صفراً دائماً'],
      answer: 1,
      why: 'لأن C = ε₀A/d، فزيادة d تقلل C.'
    }
  ];

  function getPoints() {
    return Number(localStorage.getItem(KEYS.points) || 0);
  }

  function addPoints(n) {
    const next = getPoints() + n;
    localStorage.setItem(KEYS.points, String(next));
    renderPoints();
  }

  function renderPoints() {
    if (pointsEl) pointsEl.textContent = String(getPoints());
  }

  function setLesson(html) {
    if (!lessonArea) return;
    lessonArea.innerHTML = html;
    lessonArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function physicsExplain() {
    setLesson(`
      <article class="lesson-card">
        <div class="lesson-kicker">الفصل الأول • المتسعات</div>
        <h4>📖 الدرس 1: السعة الكهربائية</h4>
        <p><b>الفكرة ببساطة:</b> المتسعة تخزن شحنة كهربائية. مقدار قدرتها على التخزين يسمى <b>السعة الكهربائية</b>.</p>
        <div class="law-box"><span>القانون الأساسي</span><strong>C = Q ÷ ΔV</strong></div>
        <div class="symbol-grid">
          <div><b>C</b><small>السعة • فاراد F</small></div>
          <div><b>Q</b><small>الشحنة • كولوم C</small></div>
          <div><b>ΔV</b><small>فرق الجهد • فولت V</small></div>
        </div>
        <p class="memory-tip">🧠 <b>احفظيها:</b> السعة = الشحنة ÷ فرق الجهد.</p>
        <details class="extra-law"><summary>⭐ إضافة مهمة للوحين المتوازيين</summary><div class="law-box compact"><strong>C = ε₀ A ÷ d</strong></div><p>تزداد السعة بزيادة مساحة اللوحين A، وتقل بزيادة المسافة d.</p></details>
        <button class="mini-cta" id="goExample" type="button">فهمتُ — أعطني مثالًا 🧩</button>
      </article>`);
    document.getElementById('goExample')?.addEventListener('click', physicsExample);
  }

  function physicsExample() {
    setLesson(`
      <article class="lesson-card">
        <div class="lesson-kicker">مثال محلول خطوة بخطوة</div>
        <h4>🧩 احسبي السعة</h4>
        <p>متسعة شحنتها <b>Q = 12 μC</b> وفرق الجهد بين لوحيها <b>ΔV = 6 V</b>. أوجدي السعة.</p>
        <ol class="solve-steps">
          <li><b>نكتب القانون:</b> C = Q ÷ ΔV</li>
          <li><b>نعوض:</b> C = 12 ÷ 6</li>
          <li><b>الناتج:</b> C = 2 μF</li>
        </ol>
        <div class="answer-box">✅ الجواب: <b>2 μF</b></div>
        <p class="small muted">لأن استخدام μC مع V هنا يعطي الناتج مباشرة بوحدة μF.</p>
        <div class="try-box">
          <b>🎯 دور دُرّة:</b>
          <p>إذا كانت Q = 20 μC و ΔV = 4 V، فما C؟</p>
          <div class="try-row"><input id="tryAnswer" inputmode="decimal" placeholder="اكتبي الرقم فقط"><button id="checkTry" type="button">تحقق</button></div>
          <p id="tryFeedback" class="feedback"></p>
        </div>
      </article>`);

    document.getElementById('checkTry')?.addEventListener('click', () => {
      const input = document.getElementById('tryAnswer');
      const fb = document.getElementById('tryFeedback');
      const value = Number(String(input.value).replace('،', '.'));
      if (value === 5) {
        fb.textContent = '🌟 ممتاز! C = 20 ÷ 4 = 5 μF. +10 نقاط';
        fb.className = 'feedback correct';
        if (!input.dataset.rewarded) {
          input.dataset.rewarded = '1';
          addPoints(10);
        }
      } else if (!input.value.trim()) {
        fb.textContent = 'اكتبي الناتج أولًا 😊';
        fb.className = 'feedback';
      } else {
        fb.textContent = 'قريبة! استخدمي C = Q ÷ ΔV، يعني 20 ÷ 4.';
        fb.className = 'feedback wrong';
      }
    });
  }

  function startQuiz() {
    state.quizIndex = 0;
    state.quizScore = 0;
    state.quizLocked = false;
    state.wrongIds = [];
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const item = quiz[state.quizIndex];
    const number = state.quizIndex + 1;
    const optionsHtml = item.options.map((opt, i) => `<button class="quiz-option" type="button" data-choice="${i}">${opt}</button>`).join('');
    setLesson(`
      <article class="lesson-card quiz-card">
        <div class="quiz-top"><span>⚡ تحدي اليوم</span><b>${number} / ${quiz.length}</b></div>
        <div class="quiz-progress"><i style="width:${(number / quiz.length) * 100}%"></i></div>
        <h4>${item.q}</h4>
        <div class="quiz-options">${optionsHtml}</div>
        <p id="quizFeedback" class="feedback"></p>
        <button id="nextQuiz" class="mini-cta hidden" type="button">السؤال التالي ←</button>
      </article>`);

    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => answerQuiz(Number(btn.dataset.choice)));
    });
  }

  function answerQuiz(choice) {
    if (state.quizLocked) return;
    state.quizLocked = true;
    const item = quiz[state.quizIndex];
    const fb = document.getElementById('quizFeedback');
    const optionButtons = [...document.querySelectorAll('.quiz-option')];
    optionButtons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === item.answer) btn.classList.add('is-correct');
      if (i === choice && i !== item.answer) btn.classList.add('is-wrong');
    });

    if (choice === item.answer) {
      state.quizScore += 1;
      addPoints(10);
      fb.textContent = `🌟 صحيح! ${item.why} +10 نقاط`;
      fb.className = 'feedback correct';
    } else {
      state.wrongIds.push(item.id);
      fb.textContent = `💡 مو مشكلة. ${item.why}`;
      fb.className = 'feedback wrong';
    }

    const next = document.getElementById('nextQuiz');
    next.classList.remove('hidden');
    next.textContent = state.quizIndex === quiz.length - 1 ? 'شوفي النتيجة 🏆' : 'السؤال التالي ←';
    next.addEventListener('click', () => {
      state.quizIndex += 1;
      state.quizLocked = false;
      if (state.quizIndex >= quiz.length) finishQuiz();
      else renderQuizQuestion();
    }, { once: true });
  }

  function finishQuiz() {
    const stars = state.quizScore === 5 ? '⭐⭐⭐' : state.quizScore >= 3 ? '⭐⭐' : '⭐';
    localStorage.setItem(KEYS.mistakes, JSON.stringify(state.wrongIds));
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem(KEYS.daily, JSON.stringify({ date: today, score: state.quizScore, total: quiz.length }));
    const message = state.quizScore === 5 ? 'رائعة! أتقنتِ الدرس.' : state.quizScore >= 3 ? 'جيد جدًا! راجعي الخطأ ونكررها.' : 'نرجع للقانون دقيقة ثم نجرب مرة ثانية.';
    setLesson(`
      <article class="lesson-card result-card">
        <div class="big-stars">${stars}</div>
        <h4>نتيجتك ${state.quizScore} من ${quiz.length}</h4>
        <p>${message}</p>
        <div class="answer-box">🏅 مجموع نقاطك الآن: <b>${getPoints()}</b></div>
        <div class="result-actions"><button id="reviewMistakes" type="button">🔁 راجعي أخطاءك</button><button id="retryQuiz" type="button">⚡ أعيدي التحدي</button></div>
      </article>`);
    document.getElementById('reviewMistakes')?.addEventListener('click', physicsReview);
    document.getElementById('retryQuiz')?.addEventListener('click', startQuiz);
  }

  function physicsReview() {
    let mistakes = [];
    try { mistakes = JSON.parse(localStorage.getItem(KEYS.mistakes) || '[]'); } catch (_) {}
    const wrongQuestions = quiz.filter(q => mistakes.includes(q.id));
    const reviewHtml = wrongQuestions.length
      ? `<div class="mistake-list"><h5>أسئلة تحتاج مراجعة:</h5>${wrongQuestions.map(q => `<div class="mistake-item"><b>• ${q.q}</b><span>${q.why}</span></div>`).join('')}</div>`
      : `<p class="success-note">🌟 لا توجد أخطاء محفوظة من آخر اختبار.</p>`;

    setLesson(`
      <article class="lesson-card">
        <div class="lesson-kicker">مراجعة سريعة • 60 ثانية</div>
        <h4>🔁 بطاقة القانون</h4>
        <div class="flashcard">
          <p>قولي القانون من ذاكرتك أولًا 👀</p>
          <button id="revealLaw" type="button">أظهر القانون</button>
          <strong id="hiddenLaw" class="hidden-law">C = Q ÷ ΔV</strong>
        </div>
        ${reviewHtml}
        <button id="reviewQuiz" class="mini-cta" type="button">اختبار سريع الآن ⚡</button>
      </article>`);
    document.getElementById('revealLaw')?.addEventListener('click', () => document.getElementById('hiddenLaw')?.classList.add('show'));
    document.getElementById('reviewQuiz')?.addEventListener('click', startQuiz);
  }

  const englishUnits = [
    'Unit 1 • الوحدة الأولى',
    'Unit 2 • الوحدة الثانية',
    'Unit 3 • الوحدة الثالثة',
    'Unit 4 • الوحدة الرابعة',
    'Unit 5 • الوحدة الخامسة',
    'Unit 6 • الوحدة السادسة',
    'Unit 7 • الوحدة السابعة',
    'Unit 8 • الوحدة الثامنة',
    'Literature • الأدب'
  ];

  function englishHome() {
    state.englishUnit = null;
    const cards = englishUnits.map((name, i) => `
      <button class="tutor-action english-unit" type="button" data-unit="${i}">
        ${i === 0 ? '✅ ' : i === 8 ? '📚 ' : '📘 '}${name}
      </button>`).join('');
    setLesson(`
      <article class="lesson-card">
        <div class="lesson-kicker">اختاري الوحدة</div>
        <h4>🇬🇧 وحدات اللغة الإنكليزية</h4>
        <div class="tutor-actions">${cards}</div>
        <p class="small muted">الوحدة الأولى مفعّلة الآن كنموذج كامل. بقية الوحدات والأدب موجودة بنفس النمط وجاهزة لإضافة محتواها بالتحديثات القادمة.</p>
      </article>`);
    document.querySelectorAll('.english-unit').forEach(btn => {
      btn.addEventListener('click', () => englishUnitHome(Number(btn.dataset.unit)));
    });
  }

  function englishUnitHome(unitIndex) {
    state.englishUnit = unitIndex;
    const name = englishUnits[unitIndex];
    if (unitIndex !== 0) {
      setLesson(`
        <article class="lesson-card">
          <div class="lesson-kicker">${name}</div>
          <h4>${unitIndex === 8 ? '📚 الأدب الإنكليزي' : '🇬🇧 ' + name}</h4>
          <p>هذه الوحدة موجودة الآن داخل النظام بنفس نمط الفيزياء. سنملأها بالتدريج: شرح، كلمات، قواعد، قراءة، أسئلة واختبار.</p>
          <div class="tutor-actions">
            <button class="tutor-action" type="button" disabled>📖 شرح</button>
            <button class="tutor-action" type="button" disabled>🧠 كلمات</button>
            <button class="tutor-action" type="button" disabled>📘 قواعد</button>
            <button class="tutor-action" type="button" disabled>⚡ اختبار</button>
          </div>
          <button id="engBackUnits" class="mini-cta" type="button">رجوع إلى الوحدات</button>
        </article>`);
      document.getElementById('engBackUnits')?.addEventListener('click', englishHome);
      return;
    }

    setLesson(`
      <article class="lesson-card">
        <div class="lesson-kicker">Unit 1 • الوحدة الأولى</div>
        <h4>🇬🇧 اختاري طريقة الدراسة</h4>
        <div class="tutor-actions">
          <button id="engWords" class="tutor-action" type="button">🧠 كلمات</button>
          <button id="engGrammar" class="tutor-action" type="button">📘 قواعد</button>
          <button id="engReading" class="tutor-action" type="button">📖 قراءة وفهم</button>
          <button id="engQuiz" class="tutor-action" type="button">⚡ اختبار سريع</button>
        </div>
        <button id="engBackUnits" class="mini-cta" type="button">رجوع إلى الوحدات</button>
      </article>`);
    document.getElementById('engWords')?.addEventListener('click', englishWords);
    document.getElementById('engGrammar')?.addEventListener('click', englishGrammar);
    document.getElementById('engReading')?.addEventListener('click', englishReading);
    document.getElementById('engQuiz')?.addEventListener('click', englishStartQuiz);
    document.getElementById('engBackUnits')?.addEventListener('click', englishHome);
  }

  function englishWords() {
    setLesson(`
      <article class="lesson-card">
        <div class="lesson-kicker">Vocabulary</div>
        <h4>🧠 كلمات اليوم</h4>
        <div class="mistake-list">
          <div class="mistake-item"><b>important</b><span>مهم</span></div>
          <div class="mistake-item"><b>improve</b><span>يُحسّن / يتطور</span></div>
          <div class="mistake-item"><b>practice</b><span>يتدرّب / تدريب</span></div>
          <div class="mistake-item"><b>success</b><span>نجاح</span></div>
        </div>
        <button id="engBackHome1" class="mini-cta" type="button">رجوع</button>
      </article>`);
    document.getElementById('engBackHome1')?.addEventListener('click', () => englishUnitHome(0));
  }

  function englishGrammar() {
    setLesson(`
      <article class="lesson-card">
        <div class="lesson-kicker">Grammar</div>
        <h4>📘 قاعدة سريعة: Present Simple</h4>
        <p>نستخدم المضارع البسيط للعادات والأشياء المتكررة.</p>
        <div class="law-box"><strong>He / She / It + verb(s)</strong></div>
        <p><b>مثال:</b> She studies English every day.</p>
        <p class="memory-tip">🧠 تذكري: مع He / She / It غالبًا نضيف s أو es للفعل.</p>
        <button id="engBackHome2" class="mini-cta" type="button">رجوع</button>
      </article>`);
    document.getElementById('engBackHome2')?.addEventListener('click', () => englishUnitHome(0));
  }

  function englishReading() {
    setLesson(`
      <article class="lesson-card">
        <div class="lesson-kicker">Reading</div>
        <h4>📖 قراءة قصيرة</h4>
        <p dir="ltr"><b>Durra studies every day. She wants to improve her English. She practices new words and reads a short text every evening.</b></p>
        <p><b>السؤال:</b> Why does Durra practice every day?</p>
        <p class="answer-box">حتى تحسّن لغتها الإنكليزية.</p>
        <button id="engBackHome3" class="mini-cta" type="button">رجوع</button>
      </article>`);
    document.getElementById('engBackHome3')?.addEventListener('click', () => englishUnitHome(0));
  }

  let engQuizIndex = 0;
  let engQuizScore = 0;

  function englishStartQuiz() {
    engQuizIndex = 0;
    engQuizScore = 0;
    renderEnglishQuiz();
  }

  function renderEnglishQuiz() {
    const item = englishQuiz[engQuizIndex];
    setLesson(`
      <article class="lesson-card quiz-card">
        <div class="quiz-top"><span>🇬🇧 English Challenge</span><b>${engQuizIndex + 1} / ${englishQuiz.length}</b></div>
        <h4>${item.q}</h4>
        <div class="quiz-options">${item.options.map((o,i)=>`<button class="quiz-option eng-option" type="button" data-choice="${i}">${o}</button>`).join('')}</div>
        <p id="engFeedback" class="feedback"></p>
      </article>`);
    document.querySelectorAll('.eng-option').forEach(btn => btn.addEventListener('click', () => {
      const choice = Number(btn.dataset.choice);
      const fb = document.getElementById('engFeedback');
      document.querySelectorAll('.eng-option').forEach(b => b.disabled = true);
      if (choice === item.answer) {
        engQuizScore += 1;
        addPoints(10);
        fb.textContent = `🌟 صحيح! ${item.why} +10 نقاط`;
        fb.className = 'feedback correct';
      } else {
        fb.textContent = `💡 ${item.why}`;
        fb.className = 'feedback wrong';
      }
      const next = document.createElement('button');
      next.className = 'mini-cta';
      next.textContent = engQuizIndex === englishQuiz.length - 1 ? 'شوفي النتيجة 🏆' : 'السؤال التالي ←';
      next.addEventListener('click', () => {
        engQuizIndex += 1;
        if (engQuizIndex >= englishQuiz.length) {
          setLesson(`<article class="lesson-card result-card"><div class="big-stars">${engQuizScore === 3 ? '⭐⭐⭐' : engQuizScore === 2 ? '⭐⭐' : '⭐'}</div><h4>نتيجتك ${engQuizScore} من ${englishQuiz.length}</h4><div class="answer-box">🏅 مجموع نقاطك الآن: <b>${getPoints()}</b></div><button id="engQuizAgain" class="mini-cta" type="button">أعيدي الاختبار</button></article>`);
          document.getElementById('engQuizAgain')?.addEventListener('click', englishStartQuiz);
        } else renderEnglishQuiz();
      }, { once:true });
      fb.after(next);
    }));
  }

  document.querySelectorAll('[data-subject]').forEach(btn => {
    btn.addEventListener('click', () => {
      const subject = subjects[btn.dataset.subject];
      if (!subject) return;
      state.subject = btn.dataset.subject;
      title.textContent = subject.title;
      text.textContent = subject.text;
      welcome.classList.add('hidden');
      panel.classList.remove('hidden');
      lessonArea.innerHTML = '';
      state.englishUnit = null;
      actions.forEach(a => a.disabled = false);
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (state.subject === 'physics') physicsHome();
      if (state.subject === 'english') englishHome();
    });
  });

  actions.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      if (state.subject === 'physics') {
        if (index === 0) physicsExplain();
        if (index === 1) physicsExample();
        if (index === 2) startQuiz();
        if (index === 3) physicsReview();
      } else if (state.subject === 'english') {
        if (state.englishUnit !== 0) { englishHome(); return; }
        if (index === 0) englishGrammar();
        if (index === 1) englishWords();
        if (index === 2) englishStartQuiz();
        if (index === 3) englishUnitHome(0);
      }
    });
  });

  back?.addEventListener('click', () => {
    panel.classList.add('hidden');
    welcome.classList.remove('hidden');
    state.subject = null;
    if (lessonArea) lessonArea.innerHTML = '';
  });

  renderPoints();
})();
