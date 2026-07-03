/* =====================================================================
   SARA KABOLI — universities.js
   Reusable data layer for the universities feature.
   Exposes window.SK_UNI = { list, bySlug, faculties/facilities pools }.
   Real logos/photos can later replace `logo`/`cover`/`gallery`.
   ===================================================================== */
(function () {
  'use strict';

  // shared pools (kept DRY; per-uni arrays below pick/override as needed)
  const FAC = { // facilities
    lib: 'کتابخانه‌ی مجهز', labs: 'آزمایشگاه‌های پیشرفته', research: 'مراکز تحقیقاتی',
    dorm: 'خوابگاه دانشجویی', sport: 'مجموعه‌ی ورزشی', cafe: 'سلف و کافه‌تریا',
    smart: 'کلاس‌های هوشمند', clubs: 'کلوب‌های دانشجویی', erasmus: 'برنامه‌ی تبادل اراسموس',
    career: 'مرکز مشاوره‌ی شغلی', campus: 'پردیس مدرن در شهر', hospital: 'بیمارستان آموزشی'
  };
  const baseFacilities = [FAC.lib, FAC.labs, FAC.research, FAC.smart, FAC.sport, FAC.cafe, FAC.clubs, FAC.erasmus, FAC.career];
  const medFacilities = [FAC.lib, FAC.labs, FAC.hospital, FAC.research, FAC.smart, FAC.dorm, FAC.cafe, FAC.erasmus, FAC.career];

  const DOCS = ['اصل مدرک دیپلم/کارشناسی (ترجمه‌ی رسمی)', 'ریزنمرات تحصیلی', 'پاسپورت معتبر', 'عکس پرسنلی', 'مدرک زبان (در صورت نیاز)'];
  const NOTE = 'پذیرش برای ترم پیش‌ِرو باز است؛ ظرفیت محدود است و بر اساس اولویت ثبت‌نام تکمیل می‌شود.';

  // accent palette (premium, deep) for monogram badges & covers
  const AC = {
    royal: '#0E2F76', teal: '#0F6F6A', plum: '#5B2A6B', burgundy: '#7A1F3D',
    navy: '#1E3A8A', indigo: '#312E81', teal2: '#0E7490', bronze: '#7C4A1E',
    forest: '#14532D', slate: '#334155'
  };

  const def = o => Object.assign({
    country: 'ترکیه', type: 'خصوصی', language: 'ترکی و انگلیسی', city: 'استانبول',
    facilities: baseFacilities, admissionOpen: true, documents: DOCS, notes: NOTE,
    logo: '', cover: '', gallery: [],
    ministryHealth: 'بر اساس رشته', ministryScience: 'بر اساس رشته'
  }, o);

  const list = [
    def({ slug: 'medipol-istanbul', logo: 'Images/logos/medipol-istanbul.png', name: 'دانشگاه مدیپول استانبول', nameEn: 'İstanbul Medipol University', mark: 'MED', accent: AC.royal, founded: 2009, programs: 140, ranking: 'جزو برترین دانشگاه‌های خصوصی حوزه‌ی سلامت ترکیه', website: 'medipol.edu.tr',
      description: 'دانشگاه مدیپول یکی از پیشروترین دانشگاه‌های خصوصی ترکیه در حوزه‌ی علوم پزشکی و سلامت است و با داشتن بیمارستان‌های آموزشی اختصاصی، مقصدی محبوب برای دانشجویان بین‌المللی به‌شمار می‌رود.',
      faculties: ['پزشکی', 'دندان‌پزشکی', 'داروسازی', 'علوم سلامت', 'مهندسی و علوم طبیعی', 'حقوق', 'ارتباطات', 'علوم انسانی و اجتماعی', 'مدیریت و کسب‌وکار'], facilities: medFacilities, ministryHealth: 'مورد تأیید (برخی رشته‌ها)',
      gallery: ['Images/gallery/medipol-istanbul/medipol-istanbul-1.jpg', 'Images/gallery/medipol-istanbul/medipol-istanbul-2.jpg', 'Images/gallery/medipol-istanbul/medipol-istanbul-3.jpg'] }),
    def({ slug: 'biruni-istanbul', logo: 'Images/logos/biruni-istanbul.png', name: 'دانشگاه بیرونی', nameEn: 'Biruni University', mark: 'BIR', accent: AC.teal, founded: 2014, programs: 75, website: 'biruni.edu.tr',
      description: 'دانشگاه بیرونی استانبول با تمرکز ویژه بر رشته‌های علوم سلامت، یکی از معتبرترین دانشگاه‌های خصوصی ترکیه در حوزه‌ی پزشکی و پیراپزشکی است.',
      faculties: ['پزشکی', 'دندان‌پزشکی', 'داروسازی', 'پرستاری', 'فیزیوتراپی و توان‌بخشی', 'علوم سلامت', 'مهندسی و علوم طبیعی'], facilities: medFacilities,
      gallery: ['Images/gallery/biruni-istanbul/biruni-istanbul-1.jpg', 'Images/gallery/biruni-istanbul/biruni-istanbul-2.jpg', 'Images/gallery/biruni-istanbul/biruni-istanbul-3.jpg', 'Images/gallery/biruni-istanbul/biruni-istanbul-4.jpg'] }),
    def({ slug: 'istinye-istanbul', logo: 'Images/logos/istinye-istanbul.png', name: 'دانشگاه ایستینیه', nameEn: 'İstinye University', mark: 'IST', accent: AC.plum, founded: 2015, programs: 135, website: 'istinye.edu.tr',
      description: 'دانشگاه ایستینیه در سال ۲۰۱۵ توسط بنیاد «۲۱ آنکولوژی» تأسیس شد و امروز یکی از دانشگاه‌های نوظهور و باکیفیت استانبول در حوزه‌ی سلامت و علوم است.',
      faculties: ['پزشکی', 'دندان‌پزشکی', 'داروسازی', 'علوم سلامت', 'مهندسی و علوم طبیعی', 'علوم اقتصادی و اداری', 'هنر و طراحی'], facilities: medFacilities,
      gallery: ['Images/gallery/istinye-istanbul/istinye-istanbul-1.jpg', 'Images/gallery/istinye-istanbul/istinye-istanbul-2.jpg', 'Images/gallery/istinye-istanbul/istinye-istanbul-3.webp'] }),
    def({ slug: 'acibadem-istanbul', logo: 'Images/logos/acibadem-istanbul.png', name: 'دانشگاه آجی‌بادم', nameEn: 'Acıbadem University', mark: 'ACB', accent: AC.burgundy, founded: 2007, programs: 33, website: 'acibadem.edu.tr',
      description: 'دانشگاه آجی‌بادم با تمرکز تخصصی بر علوم سلامت، یکی از معتبرترین دانشگاه‌های خصوصی ترکیه در حوزه‌ی پزشکی و پژوهش‌های بالینی است.',
      faculties: ['پزشکی', 'دندان‌پزشکی', 'داروسازی', 'پرستاری', 'علوم سلامت', 'مهندسی'], facilities: medFacilities,
      gallery: ['Images/gallery/acibadem-istanbul/acibadem-istanbul-1.jpg', 'Images/gallery/acibadem-istanbul/acibadem-istanbul-2.jpg', 'Images/gallery/acibadem-istanbul/acibadem-istanbul-3.jpg', 'Images/gallery/acibadem-istanbul/acibadem-istanbul-4.jpg'] }),
    def({ slug: 'yeditepe-istanbul', logo: 'Images/logos/yeditepe-istanbul.png', name: 'دانشگاه یدی‌تپه', nameEn: 'Yeditepe University', mark: 'YED', accent: AC.navy, founded: 1996, programs: 41, website: 'yeditepe.edu.tr',
      description: 'دانشگاه یدی‌تپه که در سال ۱۹۹۶ تأسیس شد، یکی از قدیمی‌ترین و معتبرترین دانشگاه‌های خصوصی استانبول با پردیسی وسیع و امکانات کامل است.',
      faculties: ['پزشکی', 'دندان‌پزشکی', 'داروسازی', 'حقوق', 'مهندسی', 'معماری و طراحی', 'علوم اقتصادی و اداری', 'ارتباطات'],
      gallery: ['Images/gallery/yeditepe-istanbul/yeditepe-istanbul-1.jpg', 'Images/gallery/yeditepe-istanbul/yeditepe-istanbul-2.png', 'Images/gallery/yeditepe-istanbul/yeditepe-istanbul-3.jpg'] }),
    def({ slug: 'bahcesehir-istanbul', logo: 'Images/logos/bahcesehir-istanbul.png', name: 'دانشگاه باهچه‌شهیر', nameEn: 'Bahçeşehir University (BAU)', mark: 'BAU', accent: AC.indigo, founded: 1998, programs: 175, website: 'bau.edu.tr',
      description: 'دانشگاه باهچه‌شهیر یکی از شناخته‌شده‌ترین دانشگاه‌های خصوصی استانبول است که با تمرکز بر آموزش بین‌المللی و ارتباط با صنعت شناخته می‌شود.',
      faculties: ['پزشکی', 'مهندسی و علوم طبیعی', 'معماری و طراحی', 'حقوق', 'علوم اقتصادی و اداری', 'ارتباطات', 'آموزش', 'علوم سلامت'],
      gallery: ['Images/gallery/bahcesehir-istanbul/bahcesehir-istanbul-1.jpg', 'Images/gallery/bahcesehir-istanbul/bahcesehir-istanbul-2.jpg', 'Images/gallery/bahcesehir-istanbul/bahcesehir-istanbul-3.png', 'Images/gallery/bahcesehir-istanbul/bahcesehir-istanbul-4.jpg', 'Images/gallery/bahcesehir-istanbul/bahcesehir-istanbul-5.jpg'] }),
    def({ slug: 'gelisim-istanbul', logo: 'Images/logos/gelisim-istanbul.png', name: 'دانشگاه گلیشیم استانبول', nameEn: 'İstanbul Gelişim University', mark: 'IGU', accent: AC.teal2, founded: 2008, programs: 155, website: 'gelisim.edu.tr',
      description: 'دانشگاه گلیشیم استانبول یکی از دانشگاه‌های خصوصی معتبر است که در سال ۲۰۰۸ تأسیس شد و طیف بسیار گسترده‌ای از رشته‌ها را ارائه می‌دهد.',
      faculties: ['علوم سلامت', 'مهندسی و معماری', 'علوم اقتصادی و اداری و اجتماعی', 'هنرهای زیبا', 'علوم ورزشی', 'گردشگری', 'هوانوردی'],
      gallery: ['Images/gallery/gelisim-istanbul/gelisim-istanbul-1.jpg', 'Images/gallery/gelisim-istanbul/gelisim-istanbul-2.jpg', 'Images/gallery/gelisim-istanbul/gelisim-istanbul-3.jpg', 'Images/gallery/gelisim-istanbul/gelisim-istanbul-4.jpg'] }),
    def({ slug: 'aydin-istanbul', logo: 'Images/logos/aydin-istanbul.png', name: 'دانشگاه آیدین استانبول', nameEn: 'İstanbul Aydın University', mark: 'IAU', accent: AC.bronze, founded: 2007, programs: 354, website: 'aydin.edu.tr',
      description: 'دانشگاه آیدین استانبول یکی از شناخته‌شده‌ترین دانشگاه‌های خصوصی ترکیه است که با تنوع بسیار بالای رشته‌ها و جمعیت زیاد دانشجویان بین‌المللی شناخته می‌شود.',
      faculties: ['پزشکی', 'دندان‌پزشکی', 'داروسازی', 'مهندسی', 'حقوق', 'ارتباطات', 'علوم اقتصادی و اداری', 'هنرهای زیبا', 'آموزش'],
      gallery: ['Images/gallery/aydin-istanbul/aydin-istanbul-1.jpg', 'Images/gallery/aydin-istanbul/aydin-istanbul-2.jpg', 'Images/gallery/aydin-istanbul/aydin-istanbul-3.jpg'] }),
    def({ slug: 'fenerbahce-istanbul', logo: 'Images/logos/fenerbahce-istanbul.png', name: 'دانشگاه فنرباغچه', nameEn: 'Fenerbahçe University', mark: 'FBU', accent: AC.forest, founded: 2016, programs: 69, city: 'استانبول', website: 'fbu.edu.tr', featured: true,
      description: 'دانشگاه فنرباغچه در سال ۲۰۱۶ توسط باشگاه ورزشی معروف فنرباغچه تأسیس شد و در منطقه‌ی آتاشهیر استانبول قرار دارد.',
      faculties: ['مهندسی و معماری', 'علوم اقتصادی و اداری', 'علوم سلامت', 'علوم ورزشی', 'ارتباطات', 'حقوق'],
      gallery: ['Images/gallery/fenerbahce-istanbul/fenerbahce-istanbul-1.webp', 'Images/gallery/fenerbahce-istanbul/fenerbahce-istanbul-2.webp', 'Images/gallery/fenerbahce-istanbul/fenerbahce-istanbul-3.webp', 'Images/gallery/fenerbahce-istanbul/fenerbahce-istanbul-4.webp'] }),
    def({ slug: 'atlas-istanbul', logo: 'Images/logos/atlas-istanbul.png', name: 'دانشگاه اطلس استانبول', nameEn: 'İstanbul Atlas University', mark: 'ATL', accent: AC.royal, founded: 2018, programs: 93, website: 'atlas.edu.tr', featured: true,
      description: 'دانشگاه اطلس استانبول، یکی از دانشگاه‌های نوآور و روبه‌رشد ترکیه است که در سال ۲۰۱۸ تأسیس شد و بر رشته‌های سلامت و مهندسی تمرکز دارد.',
      faculties: ['پزشکی', 'دندان‌پزشکی', 'داروسازی', 'علوم سلامت', 'مهندسی و علوم طبیعی', 'علوم اقتصادی و اداری'], facilities: medFacilities,
      gallery: ['Images/gallery/atlas-istanbul/atlas-istanbul-1.webp', 'Images/gallery/atlas-istanbul/atlas-istanbul-2.jpg', 'Images/gallery/atlas-istanbul/atlas-istanbul-3.jpg', 'Images/gallery/atlas-istanbul/atlas-istanbul-4.jpg'] }),
    def({ slug: 'okan-istanbul', logo: 'Images/logos/okan-istanbul.png', name: 'دانشگاه اوکان استانبول', nameEn: 'İstanbul Okan University', mark: 'OKN', accent: AC.slate, founded: 1999, programs: 203, website: 'okan.edu.tr', featured: true,
      description: 'دانشگاه اوکان استانبول یکی از دانشگاه‌های خصوصی معتبر ترکیه است که در سال ۱۹۹۹ تأسیس شد و طیف گسترده‌ای از رشته‌ها را در مقاطع مختلف ارائه می‌دهد.',
      faculties: ['دندان‌پزشکی', 'مهندسی و علوم طبیعی', 'حقوق', 'علوم اقتصادی و اداری', 'علوم سلامت', 'هنرهای زیبا', 'آموزش'],
      gallery: ['Images/gallery/okan-istanbul/okan-istanbul-1.jpg', 'Images/gallery/okan-istanbul/okan-istanbul-2.jpg', 'Images/gallery/okan-istanbul/okan-istanbul-3.jpg', 'Images/gallery/okan-istanbul/okan-istanbul-4.jpg'] }),
    def({ slug: 'ticaret-istanbul', logo: 'Images/logos/ticaret-istanbul.png', name: 'دانشگاه تجارت استانبول', nameEn: 'İstanbul Ticaret University', mark: 'ITU', accent: AC.plum, founded: 2001, programs: 160, website: 'ticaret.edu.tr',
      description: 'دانشگاه تجارت استانبول توسط اتاق بازرگانی استانبول تأسیس شد و یکی از دانشگاه‌های پیشرو ترکیه در زمینه‌ی اقتصاد، تجارت و مهندسی است.',
      faculties: ['مهندسی', 'علوم اقتصادی', 'مدیریت و کسب‌وکار', 'حقوق', 'ارتباطات', 'علوم انسانی و اجتماعی'],
      gallery: ['Images/gallery/ticaret-istanbul/ticaret-istanbul-1.jpg', 'Images/gallery/ticaret-istanbul/ticaret-istanbul-2.jpg', 'Images/gallery/ticaret-istanbul/ticaret-istanbul-3.jpg', 'Images/gallery/ticaret-istanbul/ticaret-istanbul-4.jpg'] }),
    def({ slug: 'uskudar-istanbul', logo: 'Images/logos/uskudar-istanbul.png', name: 'دانشگاه اسکودار', nameEn: 'Üsküdar University', mark: 'USK', accent: AC.teal, founded: 2011, programs: 180, website: 'uskudar.edu.tr',
      description: 'دانشگاه اسکودار نخستین دانشگاه ترکیه با تمرکز تخصصی بر علوم رفتاری و سلامت روان است و در حوزه‌ی روان‌شناسی و علوم اعصاب شهرت دارد.',
      faculties: ['علوم سلامت', 'پزشکی', 'مهندسی و علوم طبیعی', 'ارتباطات', 'علوم انسانی و اجتماعی', 'روان‌شناسی'], facilities: medFacilities,
      gallery: ['Images/gallery/uskudar-istanbul/uskudar-istanbul-1.jpg', 'Images/gallery/uskudar-istanbul/uskudar-istanbul-2.jpg', 'Images/gallery/uskudar-istanbul/uskudar-istanbul-3.jpg', 'Images/gallery/uskudar-istanbul/uskudar-istanbul-4.jpg'] }),
    def({ slug: 'nisantasi-istanbul', logo: 'Images/logos/nisantasi-istanbul.png', name: 'دانشگاه نیشانتاشی استانبول', nameEn: 'Nişantaşı University', mark: 'NIS', accent: AC.burgundy, founded: 2009, programs: 164, website: 'nisantasi.edu.tr',
      description: 'دانشگاه نیشانتاشی یکی از دانشگاه‌های خصوصی و مدرن ترکیه است که با رویکردی نوآورانه در آموزش، بر پیوند دانشگاه و صنعت تمرکز دارد.',
      faculties: ['مهندسی و معماری', 'علوم اقتصادی و اداری', 'هنرهای زیبا و طراحی', 'علوم سلامت', 'ارتباطات', 'علوم ورزشی'],
      gallery: ['Images/gallery/nisantasi-istanbul/nisantasi-istanbul-1.jpg', 'Images/gallery/nisantasi-istanbul/nisantasi-istanbul-2.jpg', 'Images/gallery/nisantasi-istanbul/nisantasi-istanbul-3.jpg', 'Images/gallery/nisantasi-istanbul/nisantasi-istanbul-4.jpg', 'Images/gallery/nisantasi-istanbul/nisantasi-istanbul-5.jpg'] }),
    def({ slug: 'ozyegin-istanbul', logo: 'Images/logos/ozyegin-istanbul.png', name: 'دانشگاه اوزیِگین', nameEn: 'Özyeğin University', mark: 'OZU', accent: AC.navy, founded: 2007, programs: 23, website: 'ozyegin.edu.tr',
      description: 'دانشگاه اوزیِگین یکی از دانشگاه‌های خصوصی پیشرو در ترکیه است که در سال ۲۰۰۷ تأسیس شد و در حوزه‌ی مهندسی، معماری و کسب‌وکار جایگاه ویژه‌ای دارد.',
      faculties: ['مهندسی', 'معماری و طراحی', 'مدیریت و کسب‌وکار', 'علوم اجتماعی', 'حقوق', 'هوانوردی'],
      gallery: ['Images/gallery/ozyegin-istanbul/ozyegin-istanbul-1.jpg', 'Images/gallery/ozyegin-istanbul/ozyegin-istanbul-2.jpg', 'Images/gallery/ozyegin-istanbul/ozyegin-istanbul-3.jpg', 'Images/gallery/ozyegin-istanbul/ozyegin-istanbul-4.jpg'] }),
    def({ slug: 'istun-istanbul', logo: 'Images/logos/istun-istanbul.png', name: 'دانشگاه سلامت و فناوری استانبول', nameEn: 'İstanbul Health & Technology University (ISTUN)', mark: 'STU', accent: AC.teal2, founded: 2021, programs: 28, website: 'istun.edu.tr',
      description: 'دانشگاه سلامت و فناوری استانبول (ISTUN) یک دانشگاه تخصصی و نوین در حوزه‌ی علوم پزشکی و فناوری‌های سلامت است.',
      faculties: ['پزشکی', 'دندان‌پزشکی', 'داروسازی', 'علوم سلامت', 'مهندسی و علوم طبیعی'], facilities: medFacilities,
      gallery: ['Images/gallery/istun-istanbul/istun-istanbul-1.jpg', 'Images/gallery/istun-istanbul/istun-istanbul-2.jpg', 'Images/gallery/istun-istanbul/istun-istanbul-3.webp', 'Images/gallery/istun-istanbul/istun-istanbul-4.webp'] }),
    def({ slug: 'antalya-bilim', logo: 'Images/logos/antalya-bilim.png', name: 'دانشگاه آنتالیا بیلیم', nameEn: 'Antalya Bilim University', mark: 'ABU', accent: AC.forest, founded: 2010, programs: 55, city: 'آنتالیا', website: 'antalya.edu.tr',
      description: 'دانشگاه علوم آنتالیا (آنتالیا بیلیم) یکی از دانشگاه‌های خصوصی معتبر ترکیه است که در سال ۲۰۱۰ در شهر آنتالیا تأسیس شد.',
      faculties: ['مهندسی', 'معماری و طراحی', 'حقوق', 'علوم اقتصادی و اداری', 'گردشگری', 'علوم اجتماعی'],
      gallery: ['Images/gallery/antalya-bilim/antalya-bilim-1.webp', 'Images/gallery/antalya-bilim/antalya-bilim-2.jpg', 'Images/gallery/antalya-bilim/antalya-bilim-3.jpg', 'Images/gallery/antalya-bilim/antalya-bilim-4.jpg', 'Images/gallery/antalya-bilim/antalya-bilim-5.webp'] }),
    def({ slug: 'beykent-istanbul', logo: 'Images/logos/beykent-istanbul.png', name: 'دانشگاه بی‌کنت استانبول', nameEn: 'Beykent University', mark: 'BEY', accent: AC.indigo, founded: 1997, programs: 198, website: 'beykent.edu.tr',
      description: 'دانشگاه بی‌کنت استانبول یک دانشگاه خصوصی معتبر در ترکیه است که با بیش از دو دهه تجربه‌ی آموزشی، رشته‌های متنوعی را ارائه می‌دهد.',
      faculties: ['مهندسی و معماری', 'حقوق', 'علوم اقتصادی و اداری', 'ارتباطات', 'هنرهای زیبا', 'علوم سلامت', 'آموزش'],
      gallery: ['Images/gallery/beykent-istanbul/beykent-istanbul-1.jpg', 'Images/gallery/beykent-istanbul/beykent-istanbul-2.jpg', 'Images/gallery/beykent-istanbul/beykent-istanbul-3.jpg', 'Images/gallery/beykent-istanbul/beykent-istanbul-4.jpg'] }),
    def({ slug: 'arel-istanbul', logo: 'Images/logos/arel-istanbul.png', name: 'دانشگاه آرل استانبول', nameEn: 'İstanbul Arel University', mark: 'ARL', accent: AC.bronze, founded: 2007, programs: 127, website: 'arel.edu.tr',
      description: 'دانشگاه آرل استانبول یک دانشگاه خصوصی پویا و پیشرو در غرب استانبول است که برنامه‌های آموزشی متنوعی ارائه می‌کند.',
      faculties: ['مهندسی', 'معماری و طراحی', 'علوم اقتصادی و اداری', 'ارتباطات', 'علوم سلامت', 'علوم انسانی و اجتماعی'],
      gallery: ['Images/gallery/arel-istanbul/arel-istanbul-1.jpg', 'Images/gallery/arel-istanbul/arel-istanbul-2.jpg', 'Images/gallery/arel-istanbul/arel-istanbul-3.jpg', 'Images/gallery/arel-istanbul/arel-istanbul-4.jpg'] }),
    def({ slug: 'topkapi-istanbul', logo: 'Images/logos/topkapi-istanbul.png', name: 'دانشگاه توپکاپی استانبول', nameEn: 'İstanbul Topkapı University', mark: 'TOP', accent: AC.slate, founded: 2013, programs: 114, website: 'topkapi.edu.tr',
      description: 'دانشگاه توپکاپی استانبول یک مؤسسه‌ی آموزش عالی خصوصی در قلب استانبول است که برنامه‌های کاربردی و مهارت‌محور ارائه می‌دهد.',
      faculties: ['مهندسی', 'علوم اقتصادی و اداری', 'حقوق', 'علوم سلامت', 'هنرهای زیبا', 'علوم ورزشی'],
      gallery: ['Images/gallery/topkapi-istanbul/topkapi-istanbul-1.jpg', 'Images/gallery/topkapi-istanbul/topkapi-istanbul-2.jpg', 'Images/gallery/topkapi-istanbul/topkapi-istanbul-3.jpg', 'Images/gallery/topkapi-istanbul/topkapi-istanbul-4.jpg'] }),
    def({ slug: 'beykoz-istanbul', logo: 'Images/logos/beykoz-istanbul.png', name: 'دانشگاه بیکوز', nameEn: 'Beykoz University', mark: 'BYK', accent: AC.plum, founded: 2008, programs: 56, website: 'beykoz.edu.tr',
      description: 'دانشگاه بیکوز که در سال ۲۰۰۸ تأسیس شد، یکی از دانشگاه‌های خصوصی استانبول با تمرکز بر لجستیک، کسب‌وکار و علوم کاربردی است.',
      faculties: ['مدیریت و کسب‌وکار', 'مهندسی', 'علوم اجتماعی', 'حقوق', 'هنر و طراحی'],
      gallery: ['Images/gallery/beykoz-istanbul/beykoz-istanbul-1.jpg', 'Images/gallery/beykoz-istanbul/beykoz-istanbul-2.jpg', 'Images/gallery/beykoz-istanbul/beykoz-istanbul-3.jpg', 'Images/gallery/beykoz-istanbul/beykoz-istanbul-4.jpg'] }),
    def({ slug: 'kadir-has-istanbul', logo: 'Images/logos/kadir-has-istanbul.png', name: 'دانشگاه کادیر هاس', nameEn: 'Kadir Has University', mark: 'KHU', accent: AC.royal, founded: 1997, programs: 21, website: 'khas.edu.tr',
      description: 'دانشگاه کادیر هاس، واقع در قلب استانبول، یکی از دانشگاه‌های خصوصی پیشرو ترکیه است که در سال ۱۹۹۷ تأسیس شد.',
      faculties: ['مهندسی و علوم طبیعی', 'حقوق', 'علوم اقتصادی و اداری', 'ارتباطات', 'هنر و طراحی'],
      gallery: ['Images/gallery/kadir-has-istanbul/kadir-has-istanbul-1.jpg', 'Images/gallery/kadir-has-istanbul/kadir-has-istanbul-2.jpg', 'Images/gallery/kadir-has-istanbul/kadir-has-istanbul-3.jpg', 'Images/gallery/kadir-has-istanbul/kadir-has-istanbul-4.jpg'] }),
    def({ slug: 'kent-istanbul', logo: 'Images/logos/kent-istanbul.png', name: 'دانشگاه کنت استانبول', nameEn: 'İstanbul Kent University', mark: 'KNT', accent: AC.teal, founded: 2016, programs: 67, website: 'kent.edu.tr',
      description: 'دانشگاه کنت استانبول یکی از دانشگاه‌های خصوصی مدرن ترکیه است که با رویکردی نوین به آموزش، در قلب استانبول فعالیت می‌کند.',
      faculties: ['علوم سلامت', 'علوم اقتصادی و اداری', 'مهندسی و معماری', 'هنرهای زیبا', 'حقوق'],
      gallery: ['Images/gallery/kent-istanbul/kent-istanbul-1.webp', 'Images/gallery/kent-istanbul/kent-istanbul-2.jpg', 'Images/gallery/kent-istanbul/kent-istanbul-3.jpg'] })
  ];

  const bySlug = {};
  list.forEach(u => { bySlug[u.slug] = u; });

  window.SK_UNI = {
    list: list,
    bySlug: bySlug,
    get: slug => bySlug[slug] || null,
    featured: () => list.filter(u => u.featured).length ? list.filter(u => u.featured) : list
  };
})();
