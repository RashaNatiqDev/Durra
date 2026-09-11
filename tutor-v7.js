(() => {
  'use strict';

  const panel = document.getElementById('tutorSubjectPanel');
  const welcome = document.getElementById('tutorWelcome');
  const title = document.getElementById('tutorSubjectTitle');
  const text = document.getElementById('tutorSubjectText');
  const back = document.getElementById('tutorBack');
  const lessonArea = document.getElementById('tutorLessonArea');
  const pointsEl = document.getElementById('tutorPoints');
  const topActions = [...document.querySelectorAll('#tutorQuickActions .tutor-action')];
  const quickActions = document.getElementById('tutorQuickActions');
  const contextEl = document.getElementById('tutorContext');
  const aiBadge = document.getElementById('tutorAiBadge');
  const askBox = document.getElementById('tutorAskBox');
  const askInput = document.getElementById('tutorQuestion');
  const askBtn = document.getElementById('tutorAskBtn');
  const askAnswer = document.getElementById('tutorAskAnswer');

  const POINTS_KEY = 'durra_tutor_points_v1';
  const state = { subject: null, topicIndex: null, quizIndex: 0, quizScore: 0, quizLocked: false, wrong: [], quizItems: [], quizSource: 'local' };

  const q = (question, options, answer, why) => ({ q: question, options, answer, why });

  const subjects = {
    physics: { title:'⚡ الفيزياء', text:'اختاري الفصل، ثم شرح وقانون ومثال واختبار ومراجعة.', label:'فصول الفيزياء', kind:'الفصل', topics:[
      {name:'الفصل الأول: المتسعات', summary:'المتسعة أداة تخزن الشحنة والطاقة الكهربائية. السعة تقيس قدرة المتسعة على تخزين الشحنة عند فرق جهد معين.', key:'C = Q ÷ ΔV', example:'إذا كانت Q = 20 μC و ΔV = 4 V فإن C = 5 μF.', quiz:[q('ما وحدة قياس السعة الكهربائية؟',['الفاراد F','الفولت V','الأمبير A','الأوم Ω'],0,'السعة الكهربائية تقاس بالفاراد.'),q('إذا Q = 18 μC و ΔV = 6 V فما C؟',['3 μF','12 μF','24 μF','108 μF'],0,'C = Q/ΔV = 18/6 = 3 μF.')]},
      {name:'الفصل الثاني: الحث الكهرومغناطيسي', summary:'يدرس تولد القوة الدافعة الكهربائية الحثية عند تغير الفيض المغناطيسي، مع قانون فاراداي واتجاه لينز.', key:'ε = -N ΔΦ ÷ Δt', example:'إذا تغير الفيض بسرعة أكبر تتولد قوة دافعة حثية أكبر، وإشارة السالب تعبّر عن قانون لينز.', quiz:[q('على ماذا تعتمد القوة الدافعة الحثية؟',['معدل تغير الفيض','كتلة السلك فقط','لون السلك','درجة الطول فقط'],0,'وفق قانون فاراداي تعتمد على معدل تغير الفيض.'),q('ماذا تعبّر إشارة السالب في قانون فاراداي؟',['قانون لينز','قانون أوم','قانون كولوم','قانون بويل'],0,'السالب يعبّر عن اتجاه يعاكس سبب التغير وفق لينز.')]},
      {name:'الفصل الثالث: التيار المتناوب', summary:'التيار المتناوب يتغير مقداره واتجاهه دوريًا، وتستخدم القيم المؤثرة للمقارنة مع التيار المستمر.', key:'Vᵣₘₛ = Vₘₐₓ ÷ √2', example:'إذا Vmax = 100√2 V فإن Vrms = 100 V.', quiz:[q('التيار المتناوب يتميز بأنه؟',['يتغير دوريًا','ثابت دائمًا','لا يملك ترددًا','لا يمر في الدوائر'],0,'التيار المتناوب يتغير مقدارًا واتجاهًا دوريًا.'),q('العلاقة الصحيحة للقيمة المؤثرة للجهد الجيبي هي؟',['Vmax/√2','Vmax×2','Vmax²','Vmax/4'],0,'Vrms = Vmax/√2.')]},
      {name:'الفصل الرابع: الموجات الكهرومغناطيسية', summary:'الموجات الكهرومغناطيسية تنتشر في الفراغ بسرعة الضوء وتتكون من مجالين كهربائي ومغناطيسي متعامدين.', key:'c = λ f', example:'إذا زاد التردد f عند ثبات سرعة الضوء فإن الطول الموجي λ يقل.', quiz:[q('ما علاقة سرعة الموجة بالطول الموجي والتردد؟',['c = λf','c = λ/f','c = f/λ','c = λ+f'],0,'سرعة الموجة تساوي الطول الموجي في التردد.'),q('هل تحتاج الموجات الكهرومغناطيسية وسطًا ماديًا؟',['لا','نعم دائمًا','في الماء فقط','في الهواء فقط'],0,'يمكنها الانتشار في الفراغ.')]},
      {name:'الفصل الخامس: البصريات الفيزيائية', summary:'يتناول الطبيعة الموجية للضوء وظواهر التداخل والحيود والاستقطاب.', key:'التداخل ينتج من تراكب موجات ضوئية مترابطة.', example:'في مناطق التداخل البنّاء تزداد الشدة، وفي التداخل الهدّام تقل الشدة.', quiz:[q('أي ظاهرة تُظهر الطبيعة الموجية للضوء بوضوح؟',['التداخل','السقوط الحر','التوصيل','التمدد الحراري'],0,'التداخل من أهم دلائل الطبيعة الموجية.'),q('التداخل البنّاء يؤدي إلى؟',['زيادة الشدة','انعدام الكتلة','انخفاض التردد دائمًا','توقف الضوء'],0,'الموجات تتعاضد فتزداد الشدة.')]},
      {name:'الفصل السادس: الفيزياء الحديثة', summary:'يتناول مفاهيم الكم والتأثير الكهروضوئي وطاقة الفوتون.', key:'E = h f', example:'كلما زاد تردد الإشعاع زادت طاقة الفوتون لأن E تتناسب طرديًا مع f.', quiz:[q('طاقة الفوتون تساوي؟',['hf','h/f','f/h','h+f'],0,'العلاقة الأساسية E = hf.'),q('عند زيادة التردد ماذا يحدث لطاقة الفوتون؟',['تزداد','تقل','لا تتغير','تصبح صفرًا'],0,'E تتناسب طرديًا مع f.')]},
      {name:'الفصل السابع: إلكترونيات الحالة الصلبة', summary:'يدرس أشباه الموصلات والثنائيات والترانزستورات وخواص المواد من نوع p و n.', key:'الثنائي يسمح بالتيار أساسًا في اتجاه واحد عند الانحياز الأمامي.', example:'عند توصيل ثنائي بانحياز أمامي مناسب يمر التيار، بينما يعيق الانحياز العكسي التيار غالبًا.', quiz:[q('الثنائي شبه الموصل يستخدم أساسًا من أجل؟',['تمرير التيار باتجاه مناسب','زيادة الكتلة','خفض الجاذبية','قياس الزمن'],0,'الثنائي عنصر إلكتروني اتجاهي.'),q('المادتان p و n هما؟',['نوعان من أشباه الموصلات','نوعان من العوازل فقط','معدنان نقيان','غازان'],0,'تنتجان من تطعيم شبه الموصل.')]},
      {name:'الفصل الثامن: الأطياف الذرية والليزر', summary:'يربط الأطياف بانتقالات الإلكترونات بين مستويات الطاقة، ويشرح مبدأ الانبعاث المحفز في الليزر.', key:'ΔE = h f', example:'عندما ينتقل إلكترون بين مستويين تختلف طاقته بمقدار يساوي طاقة الفوتون الممتص أو المنبعث.', quiz:[q('طاقة الفوتون في الانتقال الذري ترتبط بـ؟',['فرق مستويات الطاقة','كتلة النواة فقط','ضغط الغاز فقط','حجم الجهاز'],0,'ΔE = hf.'),q('الليزر يعتمد على؟',['الانبعاث المحفز','السقوط الحر','التوصيل الأيوني فقط','الاحتكاك'],0,'الانبعاث المحفز أساس عمل الليزر.')]},
      {name:'الفصل التاسع: النظرية النسبية', summary:'تتناول مفاهيم الزمن والطول والطاقة عند السرعات العالية، ومن أشهر علاقاتها تكافؤ الكتلة والطاقة.', key:'E = mc²', example:'توضح العلاقة أن مقدارًا صغيرًا من الكتلة يمكن أن يقابل طاقة كبيرة بسبب عامل c².', quiz:[q('علاقة تكافؤ الكتلة والطاقة هي؟',['E=mc²','E=mv','E=m/c','E=c/m'],0,'هذه أشهر علاقات النسبية.'),q('تظهر تأثيرات النسبية الخاصة بوضوح عند سرعات؟',['قريبة من سرعة الضوء','صفر فقط','بطيئة جدًا فقط','سرعة الصوت فقط'],0,'تزداد أهمية التأثيرات عند السرعات العالية جدًا.')]},
      {name:'الفصل العاشر: الفيزياء النووية', summary:'يدرس تركيب النواة والنشاط الإشعاعي والانحلال وطاقة الربط والتفاعلات النووية.', key:'بعد كل عمر نصف يبقى نصف عدد الأنوية غير المتحللة.', example:'إذا بدأنا بـ 100 نواة مشعة، بعد عمر نصف واحد يبقى 50 تقريبًا، وبعد عمرين نصفين يبقى 25.', quiz:[q('بعد عمر نصف واحد يبقى من الأنوية غير المتحللة؟',['النصف','الربع','الكل','لا شيء دائمًا'],0,'تعريف عمر النصف هو الزمن اللازم لتحلل نصف الأنوية.'),q('النشاط الإشعاعي يرتبط بـ؟',['نواة غير مستقرة','موجة صوتية فقط','احتكاك سطحي','ضغط جوي'],0,'الانحلال الإشعاعي ظاهرة نووية.')]}
    ]},

    english: { title:'🇬🇧 اللغة الإنكليزية', text:'اختاري الوحدة، ثم كلمات وقواعد وقراءة واختبار ومراجعة.', label:'وحدات اللغة الإنكليزية', kind:'الوحدة', topics:[
      ...Array.from({length:8},(_,i)=>({name:`Unit ${i+1} • الوحدة ${['الأولى','الثانية','الثالثة','الرابعة','الخامسة','السادسة','السابعة','الثامنة'][i]}`,summary:'الوحدة مهيأة داخل النظام بنفس النمط: مفردات، قواعد، قراءة وفهم، ثم اختبار سريع.',key:'راجعي الكلمات والقاعدة ثم طبقيهما في جملة قصيرة.',example:'Study → practice → answer. اقرئي المثال ثم حاولي تكوين جملة صحيحة من عندك.',quiz:[q('أفضل طريقة لتثبيت مفردة جديدة هي؟',['استخدامها في جملة','قراءتها مرة واحدة فقط','تركها دون مراجعة','حفظ شكلها فقط'],0,'استخدام الكلمة في سياق يساعد على تثبيتها.'),q('بعد دراسة القاعدة الأفضل هو؟',['حل تطبيق قصير','الانتقال بلا تدريب','حفظ الاسم فقط','تجاهل الأخطاء'],0,'التطبيق المباشر يثبت القاعدة.')]})),
      {name:'Literature • الأدب',summary:'قسم الأدب مهيأ للقراءة والفهم والأسئلة القصيرة والمراجعة.',key:'اقرئي النص، حددي الفكرة، ثم أجيبي من الدليل الموجود في النص.',example:'ابدئي بفهم الفكرة العامة قبل حفظ التفاصيل.',quiz:[q('في سؤال الفهم نبدأ عادةً بـ؟',['فهم الفكرة العامة','حفظ كل كلمة','ترك النص','تخمين الجواب بلا قراءة'],0,'الفكرة العامة توجه بقية الإجابات.'),q('الدليل على الجواب يُفضّل أن يكون؟',['من النص','من التخمين فقط','من عنوان مادة أخرى','من الحفظ العشوائي'],0,'الاستدلال من النص أدق.')]}
    ]},

    chemistry: { title:'🧪 الكيمياء', text:'اختاري الفصل، ثم شرح الفكرة والقانون أو القاعدة ومثال واختبار ومراجعة.', label:'فصول الكيمياء', kind:'الفصل', topics:[
      {name:'الفصل الأول: الثرموداينمك',summary:'يدرس الطاقة والحرارة والتغير في الإنثالبي والتفاعلات الماصة والطاردة للحرارة.',key:'ΔH = H النواتج − H المتفاعلات',example:'إذا كانت إنثالبي النواتج أقل من المتفاعلات تكون ΔH سالبة ويكون التفاعل طاردًا للحرارة.',quiz:[q('إذا كانت ΔH سالبة فالتفاعل غالبًا؟',['طارد للحرارة','ماص للحرارة','لا يحدث','متعادل دائمًا'],0,'الإشارة السالبة تعني تحرر حرارة.'),q('ΔH يحسب من؟',['H النواتج − H المتفاعلات','H المتفاعلات − H النواتج دائمًا','الكتلة فقط','الحجم فقط'],0,'هذا هو تعريف تغير الإنثالبي للتفاعل.')]},
      {name:'الفصل الثاني: الاتزان الكيميائي',summary:'يدرس حالة الاتزان الديناميكي وثابت الاتزان والعوامل المؤثرة في موضع الاتزان.',key:'Kc يكتب من تراكيز النواتج والمتفاعلات مرفوعة لمعاملاتها.',example:'في تفاعل بسيط A ⇌ B يكون Kc = [B]/[A].',quiz:[q('الاتزان الكيميائي يعني أن سرعتي التفاعل الأمامي والعكسي؟',['متساويتان','صفر دائمًا','مختلفتان دائمًا','لا علاقة بينهما'],0,'عند الاتزان تتساوى السرعتان.'),q('ثابت الاتزان Kc يعتمد على؟',['تراكيز مواد الاتزان حسب المعادلة','لون الوعاء','كتلة الجهاز','اسم المختبر'],0,'يكتب من تراكيز المواد الداخلة في تعبير الاتزان.')]},
      {name:'الفصل الثالث: الاتزان الأيوني',summary:'يتناول تأين الأحماض والقواعد وpH والمحاليل المنظمة والذوبانية.',key:'pH = −log[H⁺]',example:'إذا [H⁺] = 10⁻³ M فإن pH = 3.',quiz:[q('العلاقة الصحيحة لـ pH هي؟',['−log[H⁺]','log[H⁺]','[H⁺]²','1/[H⁺] فقط'],0,'تعريف pH هو اللوغاريتم السالب لتركيز H+.'),q('محلول pH له 3 يعد؟',['حامضيًا','قاعديًا','متعادلًا','فلزيًا'],0,'القيم الأقل من 7 حامضية عند الظروف الاعتيادية.')]},
      {name:'الفصل الرابع: الكيمياء الكهربائية',summary:'يدرس الأكسدة والاختزال والخلايا الكلفانية والتحليل الكهربائي وجهد الخلية.',key:'Ecell = Ecathode − Eanode',example:'في الخلية الكلفانية تحدث الأكسدة عند الأنود والاختزال عند الكاثود.',quiz:[q('الأكسدة تعني عادةً؟',['فقد إلكترونات','اكتساب إلكترونات','فقد بروتون دائمًا','عدم تغير'],0,'الأكسدة فقد للإلكترونات.'),q('الاختزال يحدث عند؟',['الكاثود','الأنود دائمًا','الجسر الملحي فقط','الوعاء'],0,'الاختزال عند الكاثود.')]},
      {name:'الفصل الخامس: الكيمياء التناسقية',summary:'يتناول المعقدات التناسقية والفلز المركزي والليكاندات وعدد التناسق.',key:'المعقد يتكون من ذرة/أيون مركزي تحيط به ليكاندات.',example:'الليكاند يمنح زوجًا إلكترونيًا للفلز المركزي لتكوين رابطة تناسقية.',quiz:[q('الليكاند في المعقد التناسقي هو؟',['مانح زوج إلكتروني','نواة ذرة فقط','غاز خامل دائمًا','مذيب فقط'],0,'الليكاند يمنح زوجًا إلكترونيًا للذرة أو الأيون المركزي.'),q('ما الذي يوجد في مركز المعقد عادةً؟',['فلز مركزي','سكر','بروتين','هيدروكربون فقط'],0,'المعقدات التناسقية تحتوي غالبًا ذرة أو أيون فلزي مركزي.')]},
      {name:'الفصل السادس: الكيمياء التحليلية',summary:'تركز على التعرف على مكونات العينة وقياس كمياتها باستخدام طرائق تحليل نوعي وكمي.',key:'التحليل النوعي يحدد ما الموجود، والكمي يحدد كم مقداره.',example:'المعايرة مثال شائع على التحليل الكمي لتحديد تركيز محلول مجهول.',quiz:[q('التحليل الكمي يهدف إلى؟',['تحديد المقدار أو التركيز','تحديد اللون فقط','تحديد الاسم فقط','إلغاء القياس'],0,'الكمي يهتم بالكمية.'),q('المعايرة تستخدم غالبًا من أجل؟',['تحديد تركيز','قياس الطول','قياس الزمن فقط','تغيير لون الورق'],0,'المعايرة أداة كمية لتحديد تركيز مجهول.')]},
      {name:'الفصل السابع: الكيمياء العضوية',summary:'تتناول مركبات الكربون والمجاميع الوظيفية والتفاعلات الأساسية للمركبات العضوية.',key:'المجموعة الوظيفية تحدد كثيرًا من خواص وتفاعلات المركب العضوي.',example:'وجود مجموعة OH يميز الكحولات عن كثير من أنواع المركبات الأخرى.',quiz:[q('ما العنصر الأساس في الكيمياء العضوية؟',['الكربون','الحديد','الهيليوم','الصوديوم فقط'],0,'الكيمياء العضوية تركز على مركبات الكربون.'),q('المجموعة الوظيفية تساعد على تحديد؟',['خواص وتفاعلات المركب','كتلة النواة فقط','سرعة الضوء','الضغط الجوي'],0,'لها دور رئيسي في السلوك الكيميائي للمركب.')]},
      {name:'الفصل الثامن: الكيمياء الحياتية',summary:'تتناول الجزيئات المهمة في الأنظمة الحية مثل الكربوهيدرات والبروتينات والدهون والأحماض النووية.',key:'البروتينات تتكون من وحدات بنائية تسمى الأحماض الأمينية.',example:'الغلوكوز من السكريات البسيطة، والأحماض الأمينية ترتبط لتكوين البروتينات.',quiz:[q('الوحدات البنائية للبروتينات هي؟',['الأحماض الأمينية','الأحماض الدهنية فقط','الأملاح','الفلزات'],0,'البروتينات سلاسل من الأحماض الأمينية.'),q('الغلوكوز يصنف ضمن؟',['الكربوهيدرات','الفلزات','الأملاح فقط','الغازات النبيلة'],0,'الغلوكوز سكر بسيط من الكربوهيدرات.')]}
    ]},

    math: { title:'➗ الرياضيات', text:'اختاري الفصل، ثم القاعدة أو القانون، مثال محلول، سؤال سريع ومراجعة.', label:'فصول الرياضيات', kind:'الفصل', topics:[
      {name:'الفصل الأول: الأعداد المركبة',summary:'يدرس العدد المركب بصورته الجبرية وعملياته وخواص الوحدة التخيلية.',key:'z = a + bi ، و i² = −1',example:'(2+3i)+(1−i)=3+2i.',quiz:[q('قيمة i² تساوي؟',['−1','1','0','2'],0,'حسب تعريف الوحدة التخيلية i² = −1.'),q('ناتج (2+i)+(3+2i) هو؟',['5+3i','5+i','6+2i','1+3i'],0,'نجمع الحقيقي مع الحقيقي والتخيلي مع التخيلي.')]},
      {name:'الفصل الثاني: القطوع المخروطية',summary:'يدرس القطع المكافئ والناقص والزائد وخصائصها ومعادلاتها.',key:'نحدد نوع القطع من شكل المعادلة ومواضع الحدود التربيعية.',example:'المعادلة y² = 4ax تمثل قطعًا مكافئًا محوره على محور x.',quiz:[q('أي مما يلي قطع مخروطي؟',['القطع المكافئ','المكعب فقط','المتجه فقط','المصفوفة فقط'],0,'القطع المكافئ أحد القطوع المخروطية.'),q('المعادلة y²=4ax تمثل؟',['قطعًا مكافئًا','دائرة دائمًا','مستقيمًا','مستوى'],0,'هذه إحدى الصور القياسية للقطع المكافئ.')]},
      {name:'الفصل الثالث: تطبيقات التفاضل',summary:'يستخدم المشتقة في المماس ومعدل التغير والقيم العظمى والصغرى ورسم السلوك.',key:'عند نقطة قصوى داخلية قابلة للاشتقاق غالبًا نبحث عن f′(x)=0.',example:'إذا f(x)=x² فإن f′(x)=2x، والنقطة الحرجة عند x=0.',quiz:[q('في مسائل القيم القصوى نستخدم أساسًا؟',['المشتقة','الجذر التربيعي فقط','المصفوفة','اللوغاريتم فقط'],0,'المشتقة أداة رئيسية لتحليل التزايد والتناقص والقيم القصوى.'),q('إذا f′(x)>0 على فترة فالدالة غالبًا؟',['متزايدة','متناقصة','ثابتة دائمًا','غير معرفة'],0,'إشارة المشتقة الموجبة تدل على التزايد.')]},
      {name:'الفصل الرابع: التكامل',summary:'يدرس التكامل غير المحدد والمحدد وتطبيقاته بوصفه عملية عكسية للتفاضل.',key:'∫ xⁿ dx = xⁿ⁺¹/(n+1) + C ، عندما n ≠ −1',example:'∫ x² dx = x³/3 + C.',quiz:[q('التكامل يعد عملية عكسية لـ؟',['التفاضل','الجمع فقط','الضرب فقط','الترتيب'],0,'التكامل والتفاضل عمليتان مترابطتان عكسيًا.'),q('∫ x² dx يساوي؟',['x³/3 + C','2x + C','x²/2 + C','3x + C'],0,'نزيد الأس واحدًا ثم نقسم على الأس الجديد.')]},
      {name:'الفصل الخامس: المعادلات التفاضلية',summary:'يتناول معادلات تحتوي مشتقات لدالة مجهولة وطرائق إيجاد حلول تحققها.',key:'حل المعادلة التفاضلية هو دالة تحقق المعادلة عند التعويض.',example:'إذا dy/dx = 2x فإن أحد الحلول العامة y = x² + C.',quiz:[q('المعادلة التفاضلية تحتوي على؟',['مشتقات','أرقام فقط بلا متغيرات','مصفوفة فقط','زوايا فقط'],0,'وجود مشتقة لدالة مجهولة هو السمة الأساسية.'),q('إذا dy/dx=2x فإن y يمكن أن تكون؟',['x²+C','2+C','x+C فقط','1/x'],0,'تكامل 2x هو x²+C.')]},
      {name:'الفصل السادس: الهندسة الفضائية',summary:'يدرس النقاط والمتجهات والمستقيمات والمستويات في الفضاء ثلاثي الأبعاد.',key:'المتجه في الفضاء يمكن تمثيله بثلاث مركبات.',example:'المتجه v=(1,2,3) له مركبات على المحاور x وy وz.',quiz:[q('الهندسة الفضائية تتعامل مع؟',['ثلاثة أبعاد','بعد واحد فقط','الأعداد الصحيحة فقط','الزمن فقط'],0,'الفضاء المعتاد ثلاثي الأبعاد.'),q('كم مركبة للمتجه في فضاء ثلاثي الأبعاد؟',['3','1','2','4 دائمًا'],0,'له مركبات على x وy وz.')]}
    ]},

    arabic: { title:'📚 اللغة العربية', text:'اختاري الموضوع بالتسلسل، ثم شرح وقاعدة ومثال واختبار ومراجعة.', label:'موضوعات اللغة العربية', kind:'الموضوع', topics:[
      {name:'1. أسلوب الاستفهام',summary:'يطلب به العلم بشيء مجهول باستعمال أدوات الاستفهام بحسب المطلوب.',key:'من الأدوات: هل، الهمزة، من، ما، متى، أين، كيف، كم، أيّ.',example:'أينَ تسكن؟ — الأداة «أين» للسؤال عن المكان.',quiz:[q('أي كلمة من أدوات الاستفهام؟',['أين','لن','ليت','لكن'],0,'أين أداة استفهام عن المكان.'),q('«متى» تستخدم غالبًا للسؤال عن؟',['الزمان','المكان','العدد','السبب فقط'],0,'متى للسؤال عن الزمان.')]},
      {name:'2. أسلوب النفي',summary:'أسلوب ينفي وقوع حدث أو ثبوت معنى، وله أدوات تختلف باختلاف الزمن والتركيب.',key:'من أدواته: ما، لا، لم، لن، ليس.',example:'لم يذهبْ الطالبُ. — «لم» تنفي الفعل المضارع وتقلب دلالته إلى الماضي.',quiz:[q('أي أداة مما يلي للنفي؟',['لم','هل','يا','ليت'],0,'لم من أدوات النفي.'),q('«لن» تنفي غالبًا فعلًا في؟',['المستقبل','الماضي فقط','الأمر','النداء'],0,'لن تنفي المضارع وتفيد الاستقبال.')]},
      {name:'3. التقديم والتأخير',summary:'تغيير الرتبة الأصلية للكلمات لأغراض نحوية أو بلاغية مع بقاء المعنى منضبطًا بالسياق.',key:'قد يتقدم الخبر على المبتدأ أو المفعول على فعله لأغراض يحددها التركيب.',example:'في الدارِ رجلٌ — تقدم الخبر شبه الجملة «في الدار» على المبتدأ.',quiz:[q('في «في الدار رجلٌ» ما المتقدم؟',['الخبر','المبتدأ','الفاعل','المفعول'],0,'شبه الجملة في الدار خبر مقدم.'),q('التقديم والتأخير يتعلق أساسًا بـ؟',['ترتيب عناصر الجملة','عدد الحروف فقط','الإملاء فقط','الوزن الشعري فقط'],0,'هو تغيير في الرتبة التركيبية.')]},
      {name:'4. التوكيد',summary:'تابع أو أسلوب يرفع الشك ويقوي المعنى، ويكون لفظيًا أو معنويًا.',key:'من ألفاظ التوكيد المعنوي: نفس، عين، كل، جميع بحسب السياق.',example:'حضر المديرُ نفسُهُ. — «نفسه» توكيد معنوي.',quiz:[q('«نفس» قد تأتي في باب؟',['التوكيد','الاستفهام','النداء','النفي'],0,'هي من ألفاظ التوكيد المعنوي.'),q('الغرض من التوكيد هو؟',['تقوية المعنى','نفي المعنى','السؤال','النداء'],0,'التوكيد يثبت المعنى ويزيل الشك.')]},
      {name:'5. النداء',summary:'أسلوب لطلب إقبال المنادى أو تنبيهه باستخدام أداة نداء.',key:'من أشهر أدوات النداء: يا.',example:'يا طالبُ، اجتهد. — «يا» أداة نداء و«طالب» منادى.',quiz:[q('أشهر أداة نداء هي؟',['يا','هل','لم','لن'],0,'يا أشهر أدوات النداء.'),q('في «يا طالبُ» كلمة طالب هي؟',['منادى','خبر','مفعول به','حال'],0,'تقع بعد أداة النداء وتسمى منادى.')]},
      {name:'6. التعجب',summary:'أسلوب يدل على الدهشة أو استعظام صفة، وله صيغ قياسية مشهورة.',key:'من صيغتي التعجب القياسيتين: ما أفعله! وأفعلْ به!',example:'ما أجملَ الصدقَ! — صيغة قياسية للتعجب.',quiz:[q('أي صيغة تعجب قياسية؟',['ما أجملَ الصدقَ!','هل جاء؟','لم يأتِ','يا محمد'],0,'ما أفعله من صيغ التعجب القياسية.'),q('التعجب يدل على؟',['الدهشة أو استعظام الصفة','النفي فقط','النداء فقط','الشرط فقط'],0,'هذا هو المعنى العام للتعجب.')]},
      {name:'7. المدح والذم',summary:'أسلوبان لإنشاء المدح أو الذم بألفاظ وصيغ مخصوصة.',key:'من أفعال المدح والذم: نعمَ وبئسَ.',example:'نِعمَ الخُلُقُ الصدقُ. — أسلوب مدح.',quiz:[q('أي فعل للمدح؟',['نِعمَ','بئسَ','لم','لن'],0,'نعم من أفعال المدح.'),q('«بئس» تستعمل في؟',['الذم','المدح','الاستفهام','النداء'],0,'بئس فعل ذم.')]},
      {name:'8. التمني والترجي',summary:'التمني طلب أمر محبوب قد يكون بعيدًا، والترجي توقع أمر محبوب ممكن الوقوع غالبًا.',key:'من أدوات التمني «ليت»، ومن أدوات الترجي «لعل».',example:'ليتَ الشبابَ يعودُ — تمني. لعلَّ النجاحَ قريبٌ — ترجي.',quiz:[q('أداة التمني المشهورة هي؟',['ليت','لعل','هل','لم'],0,'ليت من أشهر أدوات التمني.'),q('«لعل» تستعمل غالبًا في؟',['الترجي','النفي','الاستفهام','النداء'],0,'لعل من أدوات الترجي.')]},
      {name:'9. العرض والتحضيض',summary:'العرض طلب بلين، والتحضيض طلب بقوة وحث، ولهما أدوات معروفة بحسب السياق.',key:'يفرق بينهما من دلالة الأداة والسياق ودرجة الحث.',example:'ألا تزورنا؟ قد تأتي للعرض بحسب السياق.',quiz:[q('العرض يكون طلبًا؟',['بلين','بإنكار فقط','بنفي فقط','بقسم'],0,'العرض طلب برفق ولين.'),q('التحضيض يدل على؟',['الحث القوي','السكوت','النفي المحض','التعريف'],0,'التحضيض فيه حث وتشجيع قوي على الفعل.')]},
      {name:'10. التحذير والإغراء',summary:'التحذير تنبيه المخاطب إلى مكروه ليتجنبه، والإغراء حثه على أمر محمود ليلتزمه.',key:'التحذير: إياك والكذب. الإغراء: الصدقَ الصدقَ.',example:'إياك والإهمالَ — تحذير. الاجتهادَ الاجتهادَ — إغراء.',quiz:[q('«إياك والكذب» مثال على؟',['التحذير','الإغراء','المدح','التمني'],0,'فيه تنبيه إلى مكروه لتجنبه.'),q('«الصدقَ الصدقَ» مثال على؟',['الإغراء','النفي','الاستفهام','الذم'],0,'فيه حث على أمر محمود.')]},
      {name:'11. الأدب والنصوص',summary:'مراجعة الكاتب أو الشاعر والعصر والفكرة العامة والصور والمعاني والأسئلة الوزارية.',key:'ابدئي بالفكرة العامة ثم ثبتي الشاهد والمعنى والخصائص.',example:'عند قراءة نص: حددي الفكرة، ثم استخرجي دليلًا من النص يدعم الإجابة.',quiz:[q('أول خطوة مفيدة لفهم النص الأدبي هي؟',['تحديد الفكرة العامة','حفظ كل كلمة فورًا','ترك النص','قراءة السؤال فقط'],0,'الفكرة العامة تساعد على فهم التفاصيل.'),q('الشاهد في سؤال الأدب يجب أن يكون؟',['مرتبطًا بالمطلوب','عشوائيًا','من مادة أخرى','بلا معنى'],0,'الشاهد الصحيح يدعم الإجابة المطلوبة.')]},
      {name:'12. الإنشاء',summary:'تدريب على بناء موضوع من مقدمة وأفكار مترابطة وخاتمة مع سلامة اللغة والإملاء.',key:'مقدمة قصيرة + أفكار مرتبة + شواهد مناسبة + خاتمة واضحة.',example:'قبل الكتابة اكتبي ثلاث أفكار رئيسية، ثم اجعلي لكل فكرة فقرة قصيرة.',quiz:[q('الإنشاء الجيد يحتاج إلى؟',['ترتيب الأفكار','تكرار جملة واحدة','إهمال الخاتمة دائمًا','كتابة بلا فقرات'],0,'ترتيب الأفكار يجعل الموضوع واضحًا.'),q('أفضل ما يسبق الكتابة هو؟',['مخطط أفكار قصير','البدء العشوائي','حذف المقدمة دائمًا','ترك الموضوع فارغًا'],0,'التخطيط المختصر يوفر الوقت ويحسن الترابط.')]}
    ]}
  };

  const PROGRESS_KEY = 'durra_tutor_progress_v2';
  const cfg = () => window.DURRA_AI_CONFIG || {apiUrl:'',accessCode:'',timeoutMs:45000,quizCount:8};

  function escapeHtml(value){
    return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function getPoints(){ return Number(localStorage.getItem(POINTS_KEY) || 0); }
  function addPoints(n){ localStorage.setItem(POINTS_KEY, String(getPoints()+n)); renderPoints(); }
  function renderPoints(){ if(pointsEl) pointsEl.textContent=String(getPoints()); }
  function setLesson(html){ if(!lessonArea) return; lessonArea.innerHTML=html; lessonArea.scrollIntoView({behavior:'smooth',block:'nearest'}); }
  function currentSubject(){ return subjects[state.subject]; }
  function currentTopic(){ return currentSubject()?.topics[state.topicIndex]; }
  function topicKey(){ return `${state.subject || 'none'}::${state.topicIndex ?? 'none'}`; }
  function mistakesKey(){ return `durra_tutor_mistakes_v2_${state.subject}_${state.topicIndex}`; }

  function loadProgress(){
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') || {}; } catch(_) { return {}; }
  }
  function topicProgress(){
    const all=loadProgress();
    return all[topicKey()] || {attempts:0,totalAnswered:0,totalCorrect:0,recentQuestions:[],mistakes:[],updatedAt:null};
  }
  function saveTopicProgress(p){
    const all=loadProgress(); all[topicKey()]=p; localStorage.setItem(PROGRESS_KEY,JSON.stringify(all));
  }
  function masteryPercent(){ const p=topicProgress(); return p.totalAnswered ? Math.round((p.totalCorrect/p.totalAnswered)*100) : 0; }
  function recordQuizResult(items, wrongDetails, score){
    const p=topicProgress();
    p.attempts=(p.attempts||0)+1;
    p.totalAnswered=(p.totalAnswered||0)+items.length;
    p.totalCorrect=(p.totalCorrect||0)+score;
    p.recentQuestions=[...(p.recentQuestions||[]),...items.map(x=>x.q)].slice(-24);
    p.mistakes=[...(p.mistakes||[]),...wrongDetails].slice(-18);
    p.updatedAt=new Date().toISOString();
    saveTopicProgress(p);
  }

  function updateContext(){
    const s=currentSubject(), t=currentTopic();
    if(!contextEl) return;
    if(!s){ contextEl.textContent='اختاري المادة ثم الفصل أو الوحدة.'; return; }
    contextEl.textContent=t ? `${s.title} — السادس العلمي العراقي • ${t.name}` : `${s.title} — اختاري ${s.kind}`;
  }
  function showTopicControls(show){
    quickActions?.classList.toggle('hidden',!show);
    askBox?.classList.toggle('hidden',!show);
    if(!show && askAnswer){ askAnswer.classList.add('hidden'); askAnswer.innerHTML=''; }
  }

  function setAiBadge(mode, message){
    if(!aiBadge) return;
    aiBadge.className=`ai-mode-badge ${mode}`;
    aiBadge.textContent=message;
  }
  function configured(){ return Boolean(cfg().apiUrl && cfg().accessCode); }
  async function checkAiHealth(){
    if(!configured()){ setAiBadge('local','🟡 الوضع المحلي الموسّع'); return false; }
    try{
      const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),6500);
      const res=await fetch(cfg().apiUrl,{method:'GET',headers:{'X-Durra-Code':cfg().accessCode},signal:controller.signal,cache:'no-store'});
      clearTimeout(timer);
      if(!res.ok) throw new Error('health');
      const data=await res.json().catch(()=>({}));
      if(data.ok===false) throw new Error('health');
      setAiBadge('online','🟢 الذكاء الاصطناعي متصل'); return true;
    }catch(_){ setAiBadge('offline','🟠 AI غير متاح — الوضع المحلي يعمل'); return false; }
  }

  function aiPayload(action, extra={}){
    const s=currentSubject(), t=currentTopic(), p=topicProgress();
    return {
      action,
      student:{grade:'السادس العلمي العراقي',language:'ar',style:'شرح واضح تدريجي مناسب لطالبة ثانوية'},
      subject:s?.title || '', topic:t?.name || '',
      seed:{summary:t?.summary || '',key:t?.key || '',example:t?.example || ''},
      mastery:masteryPercent(), attempts:p.attempts||0,
      recentQuestions:(p.recentQuestions||[]).slice(-16),
      mistakes:(p.mistakes||[]).slice(-10),
      ...extra
    };
  }
  async function aiCall(action, extra={}){
    if(!configured()) throw new Error('AI_NOT_CONFIGURED');
    const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),cfg().timeoutMs||45000);
    try{
      setAiBadge('working','🔵 المدرّس الذكي يفكر…');
      const res=await fetch(cfg().apiUrl,{method:'POST',headers:{'Content-Type':'application/json','X-Durra-Code':cfg().accessCode},body:JSON.stringify(aiPayload(action,extra)),signal:controller.signal,cache:'no-store'});
      const body=await res.json().catch(()=>null);
      if(!res.ok || !body?.ok || !body?.data) throw new Error(body?.error || `HTTP ${res.status}`);
      setAiBadge('online','🟢 الذكاء الاصطناعي متصل');
      return body.data;
    } finally { clearTimeout(timer); }
  }

  function loadingCard(text='أحضّر لكِ المحتوى الآن…'){
    setLesson(`<article class="lesson-card ai-loading"><div class="ai-spinner">🧠</div><h4>${escapeHtml(text)}</h4><p class="muted">إذا تعذر الاتصال، سيعود DURRA تلقائيًا للوضع المحلي.</p></article>`);
  }
  function localNotice(){ return configured() ? '' : '<p class="ai-fallback-note">🟡 هذا شرح محلي موسّع. بعد تفعيل AI من الإعدادات سيصبح الشرح والأمثلة والأسئلة متجددة.</p>'; }

  function subjectHome(){
    const s=currentSubject(); if(!s) return;
    state.topicIndex=null; showTopicControls(false); updateContext();
    const cards=s.topics.map((t,i)=>`<button class="tutor-action topic-card" type="button" data-topic="${i}">📘 ${escapeHtml(t.name)}</button>`).join('');
    setLesson(`<article class="lesson-card"><div class="lesson-kicker">اختاري ${escapeHtml(s.kind)}</div><h4>${escapeHtml(s.label)}</h4><div class="tutor-actions">${cards}</div><p class="small muted">اختاري جزءًا واحدًا. بعد ذلك يمكنك طلب شرح موسّع، أمثلة، اختبار متجدد، مراجعة ذكية، أو كتابة سؤال للمدرّس.</p></article>`);
    document.querySelectorAll('.topic-card').forEach(btn=>btn.addEventListener('click',()=>topicHome(Number(btn.dataset.topic))));
  }

  function topicHome(i){
    state.topicIndex=i; updateContext(); showTopicControls(true);
    const s=currentSubject(), t=currentTopic(), mastery=masteryPercent();
    setLesson(`<article class="lesson-card"><div class="lesson-kicker">${escapeHtml(t.name)}</div><h4>${escapeHtml(s.title)} • جاهزة نبدأ؟</h4><p>${escapeHtml(t.summary)}</p><div class="study-stats"><span>🎯 الإتقان الحالي <b>${mastery}%</b></span><span>🧪 الاختبار <b>8 أسئلة متجددة</b></span></div><p class="memory-tip">ابدئي بـ «اشرح لي»، ثم مثال، وبعدها الاختبار. عند الخطأ سيحفظ DURRA نقطة الضعف للمراجعة القادمة.</p><button id="topicBack" class="mini-cta soft-local" type="button">رجوع إلى قائمة ${escapeHtml(s.kind)}</button></article>`);
    document.getElementById('topicBack')?.addEventListener('click',subjectHome);
  }

  function fallbackExplainHtml(t){
    return `<article class="lesson-card">${localNotice()}<div class="lesson-kicker">${escapeHtml(t.name)}</div><h4>📖 شرح تدريجي</h4><p><b>1) الفكرة ببساطة:</b> ${escapeHtml(t.summary)}</p><div class="law-box"><span>2) الفكرة / القانون الأساسي</span><strong>${escapeHtml(t.key)}</strong></div><div class="explain-steps"><h5>3) كيف تثبتين الفكرة؟</h5><ol><li>اقرئي الفكرة مرة ببطء وحددي الكلمات المهمة.</li><li>اربطي القانون أو القاعدة بمعنى كل رمز أو جزء.</li><li>قولي الفكرة بصوتك من دون النظر للنص.</li><li>انتقلي إلى مثال، ثم حاولي سؤالًا من ذاكرتك.</li></ol></div><div class="answer-box"><b>4) مثال تمهيدي:</b><br>${escapeHtml(t.example)}</div><p class="memory-tip">🧠 إذا بقي جزء غير واضح اكتبي سؤالك أسفل الصفحة، أو اختاري «شرح أبسط».</p><div class="result-actions"><button id="simplerExplain" type="button">🌱 شرح أبسط</button><button id="deeperExplain" type="button">🔎 شرح أعمق</button></div></article>`;
  }

  function renderAiExplain(data){
    const sections=Array.isArray(data.sections)?data.sections:[];
    const laws=Array.isArray(data.laws)?data.laws:[];
    const tips=Array.isArray(data.tips)?data.tips:[];
    setLesson(`<article class="lesson-card ai-generated"><div class="lesson-kicker">✨ شرح مولّد حسب مستواك</div><h4>📖 ${escapeHtml(data.title || currentTopic()?.name || 'الشرح')}</h4><p class="ai-intro">${escapeHtml(data.intro || '')}</p>${sections.map((x,i)=>`<section class="ai-section"><h5>${i+1}. ${escapeHtml(x.heading||'فكرة')}</h5><p>${escapeHtml(x.text||'')}</p></section>`).join('')}${laws.map(x=>`<div class="law-box"><span>${escapeHtml(x.label||'القانون / القاعدة')}</span><strong>${escapeHtml(x.formula||'')}</strong><small>${escapeHtml(x.meaning||'')}</small></div>`).join('')}${tips.length?`<div class="memory-tip"><b>🧠 مفاتيح للحفظ والفهم</b><ul>${tips.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></div>`:''}${data.check_question?`<div class="try-box"><b>سؤال فهم سريع:</b><p>${escapeHtml(data.check_question)}</p></div>`:''}<div class="result-actions"><button id="simplerExplain" type="button">🌱 شرح أبسط</button><button id="deeperExplain" type="button">🔎 شرح أعمق</button></div></article>`);
    bindExplainDepthButtons();
  }
  function bindExplainDepthButtons(){
    document.getElementById('simplerExplain')?.addEventListener('click',()=>showExplain('simpler'));
    document.getElementById('deeperExplain')?.addEventListener('click',()=>showExplain('deeper'));
  }
  async function showExplain(level='normal'){
    const t=currentTopic(); if(!t){ subjectHome(); return; }
    if(configured()){
      loadingCard(level==='simpler'?'أعيد الشرح بطريقة أبسط…':level==='deeper'?'أوسّع الشرح مع تفاصيل أكثر…':'أجهز شرحًا متدرجًا وموسعًا…');
      try{ const data=await aiCall('explain',{level}); renderAiExplain(data); return; }
      catch(err){ console.warn('AI explain fallback',err); setAiBadge('offline','🟠 تعذر AI — استخدمت الشرح المحلي'); }
    }
    setLesson(fallbackExplainHtml(t)); bindExplainDepthButtons();
  }

  function renderAiExamples(data){
    const examples=Array.isArray(data.examples)?data.examples:[];
    setLesson(`<article class="lesson-card ai-generated"><div class="lesson-kicker">✨ أمثلة جديدة</div><h4>🧩 أمثلة محلولة خطوة بخطوة</h4>${examples.map((ex,i)=>`<section class="worked-example"><h5>مثال ${i+1}</h5><p><b>السؤال:</b> ${escapeHtml(ex.problem||'')}</p><ol class="solve-steps">${(ex.steps||[]).map(s=>`<li>${escapeHtml(s)}</li>`).join('')}</ol><div class="answer-box"><b>الجواب:</b> ${escapeHtml(ex.answer||'')}</div></section>`).join('')}${data.practice?`<div class="try-box"><h5>🎯 الآن دورك</h5><p>${escapeHtml(data.practice.question||'')}</p>${data.practice.hint?`<p class="small muted">تلميح: ${escapeHtml(data.practice.hint)}</p>`:''}<details><summary>أظهر الجواب بعد المحاولة</summary><div class="answer-box">${escapeHtml(data.practice.answer||'')}</div></details></div>`:''}<button id="goQuiz" class="mini-cta" type="button">اختبار متجدد الآن ⚡</button></article>`);
    document.getElementById('goQuiz')?.addEventListener('click',startTopicQuiz);
  }
  async function showExample(){
    const t=currentTopic(); if(!t){ subjectHome(); return; }
    if(configured()){
      loadingCard('أصنع أمثلة جديدة بمستويات مختلفة…');
      try{ const data=await aiCall('example',{count:3}); renderAiExamples(data); return; }
      catch(err){ console.warn('AI example fallback',err); setAiBadge('offline','🟠 تعذر AI — استخدمت المثال المحلي'); }
    }
    setLesson(`<article class="lesson-card">${localNotice()}<div class="lesson-kicker">${escapeHtml(t.name)}</div><h4>🧩 تطبيق خطوة بخطوة</h4><p>ابدئي بتحديد الفكرة أو القانون المطلوب، ثم عوضي أو طبقي القاعدة، وبعدها راجعي الناتج.</p><div class="answer-box">${escapeHtml(t.example)}</div><div class="try-box"><b>جربي بنفسك:</b><p>غيّري رقمًا أو كلمة في المثال، ثم أعيدي الحل بالطريقة نفسها. إذا تعثرتِ اكتبي سؤالك في صندوق المدرّس.</p></div><button id="goQuiz" class="mini-cta" type="button">اختبار متجدد الآن ⚡</button></article>`);
    document.getElementById('goQuiz')?.addEventListener('click',startTopicQuiz);
  }

  function shuffledQuestion(question){
    const entries=question.options.map((text,index)=>({text,index}));
    for(let i=entries.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [entries[i],entries[j]]=[entries[j],entries[i]]; }
    return {...question,options:entries.map(e=>e.text),answer:entries.findIndex(e=>e.index===question.answer)};
  }
  function fallbackQuiz(t){
    const base=(t.quiz||[]).map(x=>({...x}));
    const generic=[
      q('أي عبارة تلخص فكرة هذا الجزء بشكل أدق؟',[t.summary,'هذا الجزء لا يحتوي فكرة محددة.','الموضوع لا يرتبط بالدراسة الحالية.','كل الخيارات السابقة خاطئة.'],0,'الإجابة مأخوذة من الفكرة الأساسية للموضوع.'),
      q('ما الفكرة أو العلاقة التي ينبغي تذكرها أولًا؟',[t.key,'لا توجد قاعدة أو فكرة أساسية.','احفظي المثال من دون فهم.','اتركي القانون وانتقلي لموضوع آخر.'],0,'هذه هي الفكرة أو العلاقة الأساسية في هذا الجزء.'),
      q('أي تطبيق يرتبط مباشرة بهذا الدرس؟',[t.example,'مثال لا علاقة له بالموضوع.','تغيير اسم المادة فقط.','إهمال المعطيات وعدم الحل.'],0,'هذا التطبيق مرتبط مباشرة بفكرة الدرس.'),
      q('ما أفضل خطوة بعد فهم الفكرة الأساسية؟',['حل مثال ثم اختبار الفهم','ترك الدرس فورًا','حفظ عنوان الفصل فقط','تجنب حل الأسئلة'],0,'التطبيق بعد الفهم يثبت المعلومة.'),
      q('إذا أخطأتِ في سؤال من هذا الموضوع، ماذا تفعلين؟',['تراجعين سبب الخطأ ثم تحلين سؤالًا جديدًا','تحفظين الجواب وحده','تتركين الموضوع نهائيًا','تعيدين الخطأ نفسه دون مراجعة'],0,'المراجعة النشطة ثم سؤال جديد أفضل للتعلم.'),
      q('ما الطريقة الأقوى لتثبيت هذا الدرس؟',['شرح الفكرة بكلماتك ثم تطبيقها','قراءة العنوان فقط','تخمين الإجابات','تجنب الأمثلة'],0,'استرجاع الفكرة وتطبيقها يساعدان على التثبيت.')
    ];
    return [...base,...generic].slice(0,8).map(shuffledQuestion);
  }
  function validateQuizQuestions(qs){
    if(!Array.isArray(qs)) return [];
    return qs.filter(x=>x && typeof x.q==='string' && Array.isArray(x.options) && x.options.length===4 && Number.isInteger(Number(x.answer)) && Number(x.answer)>=0 && Number(x.answer)<4).map(x=>({q:String(x.q),options:x.options.map(String),answer:Number(x.answer),why:String(x.why||''),skill:String(x.skill||''),difficulty:String(x.difficulty||'')}));
  }
  async function startTopicQuiz(){
    const t=currentTopic(); if(!t){ subjectHome(); return; }
    state.quizIndex=0; state.quizScore=0; state.quizLocked=false; state.wrong=[]; state.quizItems=[]; state.quizSource='local';
    if(configured()){
      loadingCard('أولّد 8 أسئلة جديدة وأتجنب تكرار الأسئلة السابقة…');
      try{
        const data=await aiCall('quiz',{count:cfg().quizCount||8});
        const items=validateQuizQuestions(data.questions);
        if(items.length>=5){ state.quizItems=items.slice(0,10).map(shuffledQuestion); state.quizSource='ai'; renderTopicQuiz(); return; }
      }catch(err){ console.warn('AI quiz fallback',err); setAiBadge('offline','🟠 تعذر AI — اختبار محلي موسّع'); }
    }
    state.quizItems=fallbackQuiz(t); state.quizSource='local'; renderTopicQuiz();
  }
  function renderTopicQuiz(){
    const t=currentTopic(), item=state.quizItems[state.quizIndex];
    if(!item){ finishTopicQuiz(); return; }
    setLesson(`<article class="lesson-card quiz-card"><div class="quiz-top"><span>⚡ ${escapeHtml(t.name)} ${state.quizSource==='ai'?'• متجدد بالذكاء الاصطناعي':'• محلي'}</span><b>${state.quizIndex+1} / ${state.quizItems.length}</b></div><div class="quiz-progress"><i style="width:${((state.quizIndex+1)/state.quizItems.length)*100}%"></i></div><h4>${escapeHtml(item.q)}</h4><div class="quiz-options">${item.options.map((o,i)=>`<button class="quiz-option" type="button" data-choice="${i}">${escapeHtml(o)}</button>`).join('')}</div><p id="quizFeedback" class="feedback"></p><button id="nextQuiz" class="mini-cta hidden" type="button">السؤال التالي ←</button></article>`);
    document.querySelectorAll('.quiz-option').forEach(btn=>btn.addEventListener('click',()=>answerTopicQuiz(Number(btn.dataset.choice))));
  }
  function answerTopicQuiz(choice){
    if(state.quizLocked) return; state.quizLocked=true;
    const item=state.quizItems[state.quizIndex], fb=document.getElementById('quizFeedback');
    document.querySelectorAll('.quiz-option').forEach((btn,i)=>{ btn.disabled=true; if(i===item.answer) btn.classList.add('is-correct'); if(i===choice && i!==item.answer) btn.classList.add('is-wrong'); });
    if(choice===item.answer){ state.quizScore++; addPoints(10); fb.textContent=`🌟 صحيح! ${item.why} +10 نقاط`; fb.className='feedback correct'; }
    else {
      state.wrong.push({q:item.q,selected:item.options[choice]||'',correct:item.options[item.answer]||'',why:item.why,skill:item.skill||''});
      fb.textContent=`💡 ${item.why}`; fb.className='feedback wrong';
    }
    const next=document.getElementById('nextQuiz'); next.classList.remove('hidden'); next.textContent=state.quizIndex===state.quizItems.length-1?'شوفي النتيجة 🏆':'السؤال التالي ←';
    next.addEventListener('click',()=>{ state.quizIndex++; state.quizLocked=false; if(state.quizIndex>=state.quizItems.length) finishTopicQuiz(); else renderTopicQuiz(); },{once:true});
  }
  function finishTopicQuiz(){
    const total=state.quizItems.length || 1;
    localStorage.setItem(mistakesKey(),JSON.stringify(state.wrong));
    recordQuizResult(state.quizItems,state.wrong,state.quizScore);
    const pct=Math.round((state.quizScore/total)*100);
    const stars=pct>=90?'⭐⭐⭐':pct>=65?'⭐⭐':'⭐';
    setLesson(`<article class="lesson-card result-card"><div class="big-stars">${stars}</div><h4>نتيجتك ${state.quizScore} من ${total} (${pct}%)</h4><p>${pct>=90?'ممتاز! مستوى قوي في هذا الجزء.':pct>=65?'جيد جدًا. راجعي الأخطاء ثم جربي اختبارًا جديدًا.':'نحتاج مراجعة مركزة، وبعدها اختبار جديد بأسئلة مختلفة.'}</p><div class="answer-box">🏅 مجموع نقاطك: <b>${getPoints()}</b> • الإتقان التراكمي: <b>${masteryPercent()}%</b></div><div class="result-actions"><button id="reviewNow" type="button">🔁 مراجعة ذكية</button><button id="retryNow" type="button">⚡ اختبار جديد</button></div></article>`);
    document.getElementById('reviewNow')?.addEventListener('click',showReview); document.getElementById('retryNow')?.addEventListener('click',startTopicQuiz);
  }

  function renderAiReview(data){
    const weak=Array.isArray(data.weak_points)?data.weak_points:[];
    const explanations=Array.isArray(data.explanations)?data.explanations:[];
    const qs=validateQuizQuestions(data.questions);
    setLesson(`<article class="lesson-card ai-generated"><div class="lesson-kicker">🧠 مراجعة تكيفية</div><h4>🔁 مراجعة مبنية على أخطائك</h4><p>${escapeHtml(data.summary||'')}</p>${weak.length?`<div class="mistake-list"><h5>النقاط التي تحتاج تركيزًا:</h5>${weak.map(x=>`<div class="mistake-item">${escapeHtml(x)}</div>`).join('')}</div>`:''}${explanations.map(x=>`<section class="ai-section"><h5>${escapeHtml(x.heading||'توضيح')}</h5><p>${escapeHtml(x.text||'')}</p></section>`).join('')}<button id="reviewNewQuiz" class="mini-cta" type="button">⚡ اختبريني بأسئلة جديدة</button></article>`);
    document.getElementById('reviewNewQuiz')?.addEventListener('click',()=>{ if(qs.length>=3){ state.quizItems=qs.map(shuffledQuestion); state.quizSource='ai'; state.quizIndex=0;state.quizScore=0;state.quizLocked=false;state.wrong=[];renderTopicQuiz(); } else startTopicQuiz(); });
  }
  async function showReview(){
    const t=currentTopic(); if(!t){ subjectHome(); return; }
    let wrong=[]; try{ wrong=JSON.parse(localStorage.getItem(mistakesKey())||'[]'); }catch(_){ }
    if(configured()){
      loadingCard('أراجع أخطاءك وأبني مراجعة خاصة لكِ…');
      try{ const data=await aiCall('review',{lastMistakes:wrong,count:5}); renderAiReview(data); return; }
      catch(err){ console.warn('AI review fallback',err); setAiBadge('offline','🟠 تعذر AI — مراجعة محلية'); }
    }
    const wrongHtml=wrong.length?`<div class="mistake-list"><h5>راجعي هذه الأخطاء:</h5>${wrong.map(x=>`<div class="mistake-item"><b>• ${escapeHtml(x.q||'سؤال سابق')}</b><span>${escapeHtml(x.why||'راجعي الفكرة الأساسية.')}</span></div>`).join('')}</div>`:`<p class="success-note">🌟 لا توجد أخطاء محفوظة في آخر اختبار لهذا الموضوع.</p>`;
    setLesson(`<article class="lesson-card">${localNotice()}<div class="lesson-kicker">${escapeHtml(t.name)}</div><h4>🔁 مراجعة مركزة</h4><div class="flashcard"><p>حاولي تذكر الفكرة أولًا 👀</p><button id="revealKey" type="button">أظهر الفكرة / القانون</button><strong id="hiddenLaw" class="hidden-law">${escapeHtml(t.key)}</strong></div>${wrongHtml}<button id="reviewQuiz" class="mini-cta" type="button">اختبار جديد 8 أسئلة ⚡</button></article>`);
    document.getElementById('revealKey')?.addEventListener('click',()=>document.getElementById('hiddenLaw')?.classList.add('show')); document.getElementById('reviewQuiz')?.addEventListener('click',startTopicQuiz);
  }

  async function askTutor(){
    const question=(askInput?.value||'').trim(); if(!question || !currentTopic()) return;
    if(askAnswer){ askAnswer.classList.remove('hidden'); askAnswer.innerHTML='<div class="ai-spinner small-spin">🧠</div> أرتب الجواب…'; }
    if(configured()){
      try{
        const data=await aiCall('ask',{question});
        if(askAnswer) askAnswer.innerHTML=`<h5>💬 جواب المدرّس</h5><p>${escapeHtml(data.answer||'')}</p>${Array.isArray(data.steps)&&data.steps.length?`<ol>${data.steps.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ol>`:''}${data.tip?`<p class="memory-tip">🧠 ${escapeHtml(data.tip)}</p>`:''}`;
        return;
      }catch(err){ console.warn('AI ask fallback',err); setAiBadge('offline','🟠 تعذر AI — جواب محلي'); }
    }
    const t=currentTopic();
    if(askAnswer) askAnswer.innerHTML=`<h5>💬 جواب محلي</h5><p>${escapeHtml(t.summary)}</p><div class="law-box compact"><strong>${escapeHtml(t.key)}</strong></div><p>مثال يساعدك: ${escapeHtml(t.example)}</p><p class="small muted">لإجابة مخصصة على سؤالك نفسه فعّلي اتصال AI من الإعدادات.</p>`;
  }

  function openSubject(subjectName){
    const s=subjects[subjectName]; if(!s) return;
    state.subject=subjectName; state.topicIndex=null;
    title.textContent=s.title; text.textContent=s.text;
    welcome.classList.add('hidden'); panel.classList.remove('hidden');
    lessonArea.innerHTML=''; showTopicControls(false); updateContext();
    subjectHome(); panel.scrollIntoView({behavior:'smooth',block:'start'});
  }
  document.addEventListener('click',(event)=>{
    const btn=event.target.closest('[data-subject]'); if(!btn) return; event.preventDefault(); openSubject(btn.dataset.subject);
  });
  window.DURRA_TUTOR={version:'7.0',openSubject,checkAiHealth};
  topActions.forEach((btn,index)=>btn.addEventListener('click',()=>{
    if(state.topicIndex===null){ subjectHome(); return; }
    if(index===0) showExplain(); if(index===1) showExample(); if(index===2) startTopicQuiz(); if(index===3) showReview();
  }));
  const aiApiUrlInput=document.getElementById('aiApiUrl');
  const aiAccessCodeInput=document.getElementById('aiAccessCode');
  const saveAiSettingsBtn=document.getElementById('saveAiSettings');
  const clearAiSettingsBtn=document.getElementById('clearAiSettings');
  const aiConnectionStatus=document.getElementById('aiConnectionStatus');
  const aiSettingsBadge=document.getElementById('aiSettingsBadge');

  function refreshAiSettingsForm(message){
    if(aiApiUrlInput) aiApiUrlInput.value=cfg().apiUrl||'';
    if(aiAccessCodeInput) aiAccessCodeInput.value=cfg().accessCode||'';
    const on=configured();
    if(aiSettingsBadge) aiSettingsBadge.textContent=on?'محفوظ':'غير مفعّل';
    if(aiConnectionStatus && message) aiConnectionStatus.textContent=message;
    else if(aiConnectionStatus) aiConnectionStatus.textContent=on?'تم حفظ بيانات الربط. اضغطي «حفظ واختبار الاتصال» للتأكد من الخدمة.':'الوضع المحلي الموسّع يعمل الآن.';
  }
  async function saveAndTestAiSettings(){
    const url=(aiApiUrlInput?.value||'').trim();
    const code=aiAccessCodeInput?.value||'';
    if(!url || !code){
      if(aiConnectionStatus) aiConnectionStatus.textContent='أدخلي رابط الخدمة ورمز الربط الخاص أولًا.';
      return;
    }
    try{ new URL(url); }catch(_){ if(aiConnectionStatus) aiConnectionStatus.textContent='رابط الخدمة غير صحيح.'; return; }
    window.DURRA_AI_CONFIG?.save(url,code);
    if(aiConnectionStatus) aiConnectionStatus.textContent='أختبر الاتصال الآن…';
    const ok=await checkAiHealth();
    refreshAiSettingsForm(ok?'✅ الاتصال ناجح. أصبح الشرح والاختبار والمراجعة بالذكاء الاصطناعي.':'⚠️ تم الحفظ لكن لم ينجح اختبار الاتصال. سيبقى الوضع المحلي يعمل حتى تصبح الخدمة متاحة.');
  }
  function clearAiSettings(){
    window.DURRA_AI_CONFIG?.clear(); refreshAiSettingsForm('تم تعطيل الاتصال السحابي. الوضع المحلي الموسّع يعمل.'); checkAiHealth();
  }

  askBtn?.addEventListener('click',askTutor);
  askInput?.addEventListener('keydown',e=>{ if((e.ctrlKey||e.metaKey)&&e.key==='Enter') askTutor(); });
  back?.addEventListener('click',()=>{ panel.classList.add('hidden'); welcome.classList.remove('hidden'); state.subject=null; state.topicIndex=null; showTopicControls(false); updateContext(); if(lessonArea) lessonArea.innerHTML=''; });
  saveAiSettingsBtn?.addEventListener('click',saveAndTestAiSettings);
  clearAiSettingsBtn?.addEventListener('click',clearAiSettings);
  refreshAiSettingsForm();
  renderPoints(); checkAiHealth();
})();
