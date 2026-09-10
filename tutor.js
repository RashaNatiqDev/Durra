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
    wrongIds: []
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

  function englishPlaceholder() {
    setLesson(`
      <article class="lesson-card">
        <div class="lesson-kicker">المرحلة القادمة</div>
        <h4>🇬🇧 مدرس الإنكليزي</h4>
        <p>بعد تثبيت نموذج الفيزياء، نضيف هنا: الكلمات، القواعد، القطع، أسئلة الاختيار، ومراجعة الكلمات التي تخطئين بها.</p>
      </article>`);
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
      actions.forEach(a => a.disabled = false);
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  actions.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      if (state.subject === 'physics') {
        if (index === 0) physicsExplain();
        if (index === 1) physicsExample();
        if (index === 2) startQuiz();
        if (index === 3) physicsReview();
      } else {
        englishPlaceholder();
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
