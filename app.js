(() => {
  'use strict';

  const STORAGE = {
    tasks: 'durra_tasks',
    goals: 'durra_goals',
    homework: 'durra_homework',
    exams: 'durra_exams',
    schedule: 'durra_schedule',
    notes: 'durra_notes',
    archive: 'durra_message_archive'
  };
  const BACKUP_MAGIC = 'DURRA_BACKUP';
  const BACKUP_VERSION = 1;
  const daysAr = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  const monthsAr = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const $ = (id) => document.getElementById(id);
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const pad = n => String(n).padStart(2,'0');
  const dateKey = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const parseLocalDate = s => { const [y,m,d] = s.split('-').map(Number); return new Date(y,m-1,d); };
  const startToday = () => { const d=new Date(); d.setHours(0,0,0,0); return d; };
  const esc = s => String(s ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const load = (key, fallback) => { try { const v=JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; } };
  const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const normalizeArray = v => Array.isArray(v) ? v : [];
  const normalizeObject = v => v && typeof v === 'object' && !Array.isArray(v) ? v : {};

  let data = {
    tasks: normalizeObject(load(STORAGE.tasks, {})),
    goals: normalizeObject(load(STORAGE.goals, {})),
    homework: normalizeArray(load(STORAGE.homework, [])),
    exams: normalizeArray(load(STORAGE.exams, [])),
    schedule: normalizeObject(load(STORAGE.schedule, {})),
    notes: normalizeArray(load(STORAGE.notes, [])),
    archive: normalizeArray(load(STORAGE.archive, []))
  };

  // Compatibility migration for early DURRA builds that stored tasks as one flat array.
  if (Array.isArray(load(STORAGE.tasks, null))) {
    const old = load(STORAGE.tasks, []);
    const migrated = {};
    old.forEach(t => {
      const k = t.date || t.dateKey || dateKey(startToday());
      (migrated[k] ||= []).push({id:t.id || uid(), text:t.text || t.title || 'مهمة', done:!!t.done});
    });
    data.tasks = migrated; save(STORAGE.tasks, migrated);
  }

  let selectedDate = startToday();
  let calendarCursor = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  let deferredPrompt = null;
  let editContext = null;

  function toast(msg){ const t=$('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toast._t); toast._t=setTimeout(()=>t.classList.remove('show'),2200); }
  function fmtDate(d){ return `${daysAr[d.getDay()]}، ${d.getDate()} ${monthsAr[d.getMonth()]} ${d.getFullYear()}`; }
  function emptyHtml(text){ return `<div class="empty">${esc(text)}</div>`; }
  function persistAll(){ Object.entries(STORAGE).forEach(([name,key])=>save(key,data[name])); }

  function setView(name){
    document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${name}`));
    document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
    window.scrollTo({top:0,behavior:'smooth'});
    if(name==='calendar') renderCalendar();
    if(name==='school') renderSchool();
    if(name==='life') renderLife();
    if(name==='settings') renderPwaStatus();
  }

  function renderHome(){
    const k=dateKey(selectedDate), tasks=normalizeArray(data.tasks[k]);
    $('selectedDateTitle').textContent=fmtDate(selectedDate);
    $('taskProgress').textContent=`${tasks.filter(t=>t.done).length}/${tasks.length}`;
    $('taskList').innerHTML=tasks.length ? tasks.map(t=>`
      <div class="list-item ${t.done?'done':''}" data-id="${t.id}">
        <input class="check task-check" type="checkbox" ${t.done?'checked':''} aria-label="إنجاز المهمة">
        <div class="item-main"><div class="item-title">${esc(t.text)}</div></div>
        <div class="item-actions"><button class="mini-btn task-edit" title="تعديل">✏️</button><button class="mini-btn delete task-delete" title="حذف">🗑️</button></div>
      </div>`).join('') : emptyHtml('لا توجد مهام لهذا اليوم بعد.');
    $('goalInput').value=data.goals[k] || '';
    $('goalStatus').textContent=data.goals[k] ? 'محفوظ لهذا اليوم ✓' : '';
    renderDailyMessage();
    renderSummary();
  }

  function renderDailyMessage(){
    const msgs=window.DURRA_MESSAGES || ['يوم جميل يبدأ بخطوة صغيرة.'];
    const base=new Date(2026,0,1); const idx=Math.abs(Math.floor((selectedDate-base)/86400000))%msgs.length;
    $('dailyMessage').textContent=msgs[idx];
  }

  function renderSummary(){
    const now=startToday(), month=now.getMonth(), year=now.getFullYear();
    const keys=new Set();
    Object.keys(data.tasks).forEach(k=>{const d=parseLocalDate(k); if(d.getMonth()===month&&d.getFullYear()===year&&data.tasks[k]?.length) keys.add(k)});
    Object.keys(data.goals).forEach(k=>{const d=parseLocalDate(k); if(d.getMonth()===month&&d.getFullYear()===year&&data.goals[k]) keys.add(k)});
    data.homework.forEach(x=>{const d=parseLocalDate(x.date); if(d.getMonth()===month&&d.getFullYear()===year) keys.add(x.date)});
    data.exams.forEach(x=>{const d=parseLocalDate(x.date); if(d.getMonth()===month&&d.getFullYear()===year) keys.add(x.date)});
    $('summaryEvents').textContent=keys.size;
    $('summaryHomework').textContent=data.homework.filter(x=>!x.done).length;
    $('summaryExams').textContent=data.exams.filter(x=>parseLocalDate(x.date)>=now).length;
  }

  function renderCalendar(){
    $('monthTitle').textContent=`${monthsAr[calendarCursor.getMonth()]} ${calendarCursor.getFullYear()}`;
    const y=calendarCursor.getFullYear(), m=calendarCursor.getMonth();
    const first=new Date(y,m,1); const gridStart=new Date(y,m,1-first.getDay());
    const todayK=dateKey(startToday()), selectedK=dateKey(selectedDate);
    let html='';
    for(let i=0;i<42;i++){
      const d=new Date(gridStart); d.setDate(gridStart.getDate()+i); const k=dateKey(d);
      const hasTask=(data.tasks[k]?.length>0)||!!data.goals[k];
      const hasHw=data.homework.some(x=>x.date===k); const hasExam=data.exams.some(x=>x.date===k);
      html+=`<button class="day ${d.getMonth()!==m?'other':''} ${k===todayK?'today':''} ${k===selectedK?'selected':''}" data-date="${k}"><span class="day-num">${d.getDate()}</span><span class="day-dots">${hasTask?'<i class="dot task-dot"></i>':''}${hasHw?'<i class="dot hw-dot"></i>':''}${hasExam?'<i class="dot exam-dot"></i>':''}</span></button>`;
    }
    $('calendarGrid').innerHTML=html;
  }

  function daysUntil(s){ const diff=Math.ceil((parseLocalDate(s)-startToday())/86400000); return diff; }
  function dueText(s){ const n=daysUntil(s); if(n<0)return `<span class="badge-late">متأخر ${Math.abs(n)} يوم</span>`; if(n===0)return '<span class="badge-soon">اليوم</span>'; if(n===1)return '<span class="badge-soon">غدًا</span>'; return `بعد ${n} يوم` }

  function renderSchool(){
    data.homework.sort((a,b)=>a.date.localeCompare(b.date)); data.exams.sort((a,b)=>a.date.localeCompare(b.date));
    $('hwCount').textContent=`${data.homework.filter(x=>!x.done).length} متبقي`;
    $('homeworkList').innerHTML=data.homework.length?data.homework.map(x=>`
      <div class="list-item ${x.done?'done':''}" data-id="${x.id}">
        <input class="check hw-check" type="checkbox" ${x.done?'checked':''}>
        <div class="item-main"><div class="item-title">${esc(x.subject)} — ${esc(x.title)}</div><div class="item-meta">${esc(x.date)} • ${dueText(x.date)}</div></div>
        <div class="item-actions"><button class="mini-btn hw-edit">✏️</button><button class="mini-btn delete hw-delete">🗑️</button></div>
      </div>`).join(''):emptyHtml('لا توجد واجبات.');
    $('examCount').textContent=`${data.exams.filter(x=>daysUntil(x.date)>=0).length} قادم`;
    $('examList').innerHTML=data.exams.length?data.exams.map(x=>`
      <div class="list-item" data-id="${x.id}">
        <div class="item-main"><div class="item-title">${esc(x.subject)} — ${esc(x.title)}</div><div class="item-meta">${esc(x.date)} • ${dueText(x.date)}</div></div>
        <div class="item-actions"><button class="mini-btn exam-edit">✏️</button><button class="mini-btn delete exam-delete">🗑️</button></div>
      </div>`).join(''):emptyHtml('لا توجد امتحانات.');
    renderSchedule(); renderSummary();
  }

  function renderSchedule(){
    const order=[6,0,1,2,3,4,5];
    $('scheduleGrid').innerHTML=order.map(i=>`<div class="schedule-day"><h4>${daysAr[i]}</h4><textarea data-day="${i}" placeholder="مثال: 4:00 رياضيات\n5:30 أحياء">${esc(data.schedule[i]||'')}</textarea></div>`).join('');
  }

  function renderLife(){
    $('noteList').innerHTML=data.notes.length?data.notes.map(n=>`<div class="list-item" data-id="${n.id}"><div class="item-main"><div class="item-title">${esc(n.text)}</div><div class="item-meta">${esc(n.created||'')}</div></div><div class="item-actions"><button class="mini-btn note-edit">✏️</button><button class="mini-btn delete note-delete">🗑️</button></div></div>`).join(''):emptyHtml('لا توجد ملاحظات بعد.');
    $('archiveCount').textContent=data.archive.length;
    $('messageArchive').innerHTML=data.archive.length?data.archive.slice().reverse().map(n=>`<div class="list-item" data-id="${n.id}"><div class="item-main"><div class="item-title">${esc(n.text)}</div><div class="item-meta">${esc(n.date)}</div></div><button class="mini-btn delete archive-delete">🗑️</button></div>`).join(''):emptyHtml('لم تحفظي رسائل في الأرشيف بعد.');
  }

  function renderPwaStatus(){
    const standalone=window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const secure=location.protocol==='https:' || location.hostname==='localhost';
    const sw='serviceWorker' in navigator;
    $('pwaStatus').innerHTML=`${standalone?'✅ التطبيق يعمل الآن بوضع مستقل.':'📱 يمكن تثبيت DURRA بعد فتحه من رابط HTTPS.'}<br>${secure?'✅ اتصال مناسب للتثبيت.':'⚠️ افتحي النسخة من GitHub Pages/HTTPS للتثبيت.'}<br>${sw?'✅ المتصفح يدعم العمل دون اتصال.':'⚠️ هذا المتصفح لا يدعم Service Worker.'}`;
  }

  function openEdit(type,id,current){ editContext={type,id}; $('editTitle').textContent='تعديل'; $('editText').value=current; $('editDialog').showModal(); setTimeout(()=>$('editText').focus(),50); }
  function applyEdit(){ if(!editContext)return; const value=$('editText').value.trim(); if(!value)return; const {type,id}=editContext;
    if(type==='task'){ const arr=data.tasks[dateKey(selectedDate)]||[]; const x=arr.find(v=>v.id===id); if(x)x.text=value; save(STORAGE.tasks,data.tasks); renderHome(); }
    if(type==='note'){ const x=data.notes.find(v=>v.id===id); if(x)x.text=value; save(STORAGE.notes,data.notes); renderLife(); }
    if(type==='homework'){ const x=data.homework.find(v=>v.id===id); if(x)x.title=value; save(STORAGE.homework,data.homework); renderSchool(); }
    if(type==='exam'){ const x=data.exams.find(v=>v.id===id); if(x)x.title=value; save(STORAGE.exams,data.exams); renderSchool(); }
    editContext=null; toast('تم الحفظ');
  }

  document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.view)));
  document.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>setView(b.dataset.jump)));
  $('todayLabel').textContent=fmtDate(startToday());
  $('todayBtn').onclick=()=>{selectedDate=startToday(); calendarCursor=new Date(selectedDate.getFullYear(),selectedDate.getMonth(),1); renderHome();};
  $('prevDay').onclick=()=>{selectedDate.setDate(selectedDate.getDate()-1); selectedDate=new Date(selectedDate); renderHome();};
  $('nextDay').onclick=()=>{selectedDate.setDate(selectedDate.getDate()+1); selectedDate=new Date(selectedDate); renderHome();};

  $('taskForm').addEventListener('submit',e=>{e.preventDefault();const text=$('taskInput').value.trim();if(!text)return;const k=dateKey(selectedDate);(data.tasks[k] ||= []).push({id:uid(),text,done:false});save(STORAGE.tasks,data.tasks);$('taskInput').value='';renderHome();toast('أضيفت المهمة');});
  $('taskList').addEventListener('click',e=>{const row=e.target.closest('.list-item');if(!row)return;const id=row.dataset.id,k=dateKey(selectedDate),arr=data.tasks[k]||[],x=arr.find(v=>v.id===id);if(e.target.classList.contains('task-delete')){data.tasks[k]=arr.filter(v=>v.id!==id);if(!data.tasks[k].length)delete data.tasks[k];save(STORAGE.tasks,data.tasks);renderHome();renderCalendar();}if(e.target.classList.contains('task-edit')&&x)openEdit('task',id,x.text);});
  $('taskList').addEventListener('change',e=>{if(!e.target.classList.contains('task-check'))return;const row=e.target.closest('.list-item'),arr=data.tasks[dateKey(selectedDate)]||[],x=arr.find(v=>v.id===row.dataset.id);if(x)x.done=e.target.checked;save(STORAGE.tasks,data.tasks);renderHome();});
  $('saveGoal').onclick=()=>{const k=dateKey(selectedDate),v=$('goalInput').value.trim();if(v)data.goals[k]=v;else delete data.goals[k];save(STORAGE.goals,data.goals);renderHome();renderCalendar();toast(v?'تم حفظ هدف اليوم':'تم حذف هدف اليوم');};

  $('archiveMessage').onclick=()=>{const text=$('dailyMessage').textContent;if(!data.archive.some(x=>x.text===text&&x.date===dateKey(selectedDate))){data.archive.push({id:uid(),text,date:dateKey(selectedDate)});save(STORAGE.archive,data.archive);toast('حُفظت الرسالة في الأرشيف');}else toast('هذه الرسالة محفوظة بالفعل');};

  $('prevMonth').onclick=()=>{calendarCursor.setMonth(calendarCursor.getMonth()-1);calendarCursor=new Date(calendarCursor);renderCalendar();};
  $('nextMonth').onclick=()=>{calendarCursor.setMonth(calendarCursor.getMonth()+1);calendarCursor=new Date(calendarCursor);renderCalendar();};
  $('calendarGrid').addEventListener('click',e=>{const b=e.target.closest('.day');if(!b)return;selectedDate=parseLocalDate(b.dataset.date);calendarCursor=new Date(selectedDate.getFullYear(),selectedDate.getMonth(),1);renderHome();setView('home');});

  $('homeworkForm').addEventListener('submit',e=>{e.preventDefault();data.homework.push({id:uid(),subject:$('hwSubject').value.trim(),title:$('hwTitle').value.trim(),date:$('hwDate').value,done:false});save(STORAGE.homework,data.homework);e.target.reset();renderSchool();renderCalendar();toast('أضيف الواجب');});
  $('homeworkList').addEventListener('change',e=>{if(!e.target.classList.contains('hw-check'))return;const x=data.homework.find(v=>v.id===e.target.closest('.list-item').dataset.id);if(x)x.done=e.target.checked;save(STORAGE.homework,data.homework);renderSchool();});
  $('homeworkList').addEventListener('click',e=>{const row=e.target.closest('.list-item');if(!row)return;const x=data.homework.find(v=>v.id===row.dataset.id);if(e.target.classList.contains('hw-delete')){data.homework=data.homework.filter(v=>v.id!==row.dataset.id);save(STORAGE.homework,data.homework);renderSchool();renderCalendar();}if(e.target.classList.contains('hw-edit')&&x)openEdit('homework',x.id,x.title);});

  $('examForm').addEventListener('submit',e=>{e.preventDefault();data.exams.push({id:uid(),subject:$('examSubject').value.trim(),title:$('examTitle').value.trim(),date:$('examDate').value});save(STORAGE.exams,data.exams);e.target.reset();renderSchool();renderCalendar();toast('أضيف الامتحان');});
  $('examList').addEventListener('click',e=>{const row=e.target.closest('.list-item');if(!row)return;const x=data.exams.find(v=>v.id===row.dataset.id);if(e.target.classList.contains('exam-delete')){data.exams=data.exams.filter(v=>v.id!==row.dataset.id);save(STORAGE.exams,data.exams);renderSchool();renderCalendar();}if(e.target.classList.contains('exam-edit')&&x)openEdit('exam',x.id,x.title);});

  $('scheduleGrid').addEventListener('input',e=>{if(e.target.matches('textarea[data-day]')){data.schedule[e.target.dataset.day]=e.target.value;save(STORAGE.schedule,data.schedule);}});
  $('noteForm').addEventListener('submit',e=>{e.preventDefault();const text=$('noteInput').value.trim();if(!text)return;data.notes.push({id:uid(),text,created:dateKey(startToday())});save(STORAGE.notes,data.notes);$('noteInput').value='';renderLife();toast('أضيفت الملاحظة');});
  $('noteList').addEventListener('click',e=>{const row=e.target.closest('.list-item');if(!row)return;const x=data.notes.find(v=>v.id===row.dataset.id);if(e.target.classList.contains('note-delete')){data.notes=data.notes.filter(v=>v.id!==row.dataset.id);save(STORAGE.notes,data.notes);renderLife();}if(e.target.classList.contains('note-edit')&&x)openEdit('note',x.id,x.text);});
  $('messageArchive').addEventListener('click',e=>{if(!e.target.classList.contains('archive-delete'))return;const id=e.target.closest('.list-item').dataset.id;data.archive=data.archive.filter(v=>v.id!==id);save(STORAGE.archive,data.archive);renderLife();});

  $('editForm').addEventListener('submit',e=>{if(e.submitter?.value==='cancel')return; e.preventDefault();applyEdit();$('editDialog').close();});

  $('exportBtn').onclick=()=>{const backup={magic:BACKUP_MAGIC,version:BACKUP_VERSION,exportedAt:new Date().toISOString(),data};const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`DURRA_Backup_${dateKey(startToday())}.json`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},0);toast('تم إنشاء النسخة الاحتياطية');};
  $('importInput').addEventListener('change',async e=>{const file=e.target.files?.[0];e.target.value='';if(!file)return;try{const parsed=JSON.parse(await file.text());if(parsed?.magic!==BACKUP_MAGIC||!parsed.data||typeof parsed.data!=='object')throw new Error('invalid');if(!confirm('سيتم استبدال جميع بيانات DURRA الحالية بهذه النسخة. هل تريدين المتابعة؟'))return;
      const safety={magic:BACKUP_MAGIC,version:BACKUP_VERSION,exportedAt:new Date().toISOString(),data:structuredClone(data)};localStorage.setItem('durra_pre_restore_backup',JSON.stringify(safety));
      data={tasks:normalizeObject(parsed.data.tasks),goals:normalizeObject(parsed.data.goals),homework:normalizeArray(parsed.data.homework),exams:normalizeArray(parsed.data.exams),schedule:normalizeObject(parsed.data.schedule),notes:normalizeArray(parsed.data.notes),archive:normalizeArray(parsed.data.archive)};persistAll();renderHome();renderCalendar();renderSchool();renderLife();toast('تمت الاستعادة بنجاح');
    }catch(err){toast('ملف النسخة الاحتياطية غير صالح — لم تتغير البيانات');}});
  $('resetBtn').onclick=()=>{if(!confirm('هل أنتِ متأكدة؟ سيتم حذف كل بيانات DURRA من هذا الجهاز.'))return;if(!confirm('تأكيد أخير: لا يمكن التراجع إلا إذا كان لديكِ نسخة احتياطية.'))return;Object.values(STORAGE).forEach(k=>localStorage.removeItem(k));data={tasks:{},goals:{},homework:[],exams:[],schedule:{},notes:[],archive:[]};renderHome();renderCalendar();renderSchool();renderLife();toast('تم حذف البيانات');};

  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('installBtn').classList.remove('hidden');$('installBtn2').classList.remove('hidden');});
  async function installApp(){if(!deferredPrompt){toast('من قائمة المتصفح اختاري: تثبيت التطبيق أو إضافة إلى الشاشة الرئيسية');return;}deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('installBtn').classList.add('hidden');$('installBtn2').classList.add('hidden');}
  $('installBtn').onclick=installApp;$('installBtn2').onclick=installApp;
  window.addEventListener('appinstalled',()=>toast('تم تثبيت DURRA على الهاتف 💜'));

  if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));}

  $('hwDate').value=dateKey(selectedDate);$('examDate').value=dateKey(selectedDate);
  renderHome();renderCalendar();renderSchool();renderLife();renderPwaStatus();
})();
