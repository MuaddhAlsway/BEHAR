
export const faqCategories = [
  { id: "all", en: "All Questions", ar: "جميع الأسئلة" },
  { id: "courses", en: "Courses", ar: "الدورات" },
  { id: "payments", en: "Payments", ar: "المدفوعات" },
  { id: "certificates", en: "Certificates", ar: "الشهادات" },
  { id: "instructors", en: "Instructors", ar: "المدربون" },
];

export const faqItems = [
  {
    id: "faq-01",
    category: "courses",
    question: {
      en: "How do I enroll in a course?",
      ar: "كيف أسجّل في دورة تعليمية؟",
    },
    answer: {
      en: "Explore the course catalog, select a course, and follow the enrollment steps shown on its page. Any payment requirements will be displayed before you confirm.",
      ar: "تصفّح قائمة الدورات، واختر الدورة المناسبة، ثم اتبع خطوات التسجيل الموضحة في صفحتها. ستظهر أي متطلبات للدفع قبل تأكيد التسجيل.",
    },
  },
  {
    id: "faq-02",
    category: "courses",
    question: {
      en: "Can I learn at my own pace?",
      ar: "هل يمكنني التعلّم بالوتيرة التي تناسبني؟",
    },
    answer: {
      en: "Learning schedules depend on the course format. Check the course details to see whether lessons are self-paced, scheduled, or include deadlines.",
      ar: "يعتمد جدول التعلّم على نوع الدورة. راجع تفاصيل الدورة لمعرفة ما إذا كانت الدروس مرنة أو مجدولة أو تتضمن مواعيد نهائية.",
    },
  },
  {
    id: "faq-03",
    category: "payments",
    question: {
      en: "What payment methods are available?",
      ar: "ما وسائل الدفع المتاحة؟",
    },
    answer: {
      en: "Available payment methods will appear during checkout. Supported options may vary depending on your location and the payment services enabled on BEHAR.",
      ar: "ستظهر وسائل الدفع المتاحة أثناء إتمام الشراء. وقد تختلف الخيارات حسب موقعك وخدمات الدفع المفعّلة في بحار.",
    },
  },
  {
    id: "faq-04",
    category: "payments",
    question: {
      en: "Can I request a refund?",
      ar: "هل يمكنني طلب استرداد المبلغ؟",
    },
    answer: {
      en: "Refund eligibility depends on the applicable refund policy and the circumstances of your purchase. Review the published policy before enrolling in a paid course.",
      ar: "تعتمد أهلية استرداد المبلغ على سياسة الاسترداد المعتمدة وظروف عملية الشراء. يُرجى مراجعة السياسة المنشورة قبل التسجيل في دورة مدفوعة.",
    },
  },
  {
    id: "faq-05",
    category: "certificates",
    question: {
      en: "Will I receive a certificate?",
      ar: "هل سأحصل على شهادة بعد إكمال الدورة؟",
    },
    answer: {
      en: "Certificate availability and completion requirements are determined by each course. Look for certificate information on the course details page.",
      ar: "يعتمد توفر الشهادة ومتطلبات الحصول عليها على كل دورة. يمكنك مراجعة معلومات الشهادة في صفحة تفاصيل الدورة.",
    },
  },
  {
    id: "faq-06",
    category: "instructors",
    question: {
      en: "How can I become an instructor?",
      ar: "كيف يمكنني أن أصبح مدربًا؟",
    },
    answer: {
      en: "Visit the Become an Instructor page to learn about the application process and the information required to submit your teaching proposal.",
      ar: "انتقل إلى صفحة كن مدربًا للتعرّف على إجراءات التقديم والمعلومات المطلوبة لإرسال مقترحك التعليمي.",
    },
  },
  {
    id: "faq-07",
    category: "instructors",
    question: {
      en: "Can instructors create their own courses?",
      ar: "هل يستطيع المدربون إنشاء دوراتهم الخاصة؟",
    },
    answer: {
      en: "BEHAR is designed to support instructor-created courses. Course publishing may be subject to platform review and approval.",
      ar: "صُممت بحار لدعم الدورات التي ينشئها المدربون. وقد يخضع نشر الدورات للمراجعة والموافقة من إدارة المنصة.",
    },
  },
  {
    id: "faq-08",
    category: "courses",
    question: {
      en: "How can I track my learning progress?",
      ar: "كيف أتابع تقدمي في التعلّم؟",
    },
    answer: {
      en: "The planned student dashboard will provide a place to view enrolled courses and follow lesson progress as the relevant features become available.",
      ar: "ستوفر لوحة الطالب المخطط لها مساحة لعرض الدورات المسجّل فيها ومتابعة تقدم الدروس عند إتاحة الميزات ذات الصلة.",
    },
  },
];

export const faqCopy = {
  en: {
    eyebrow: "009 / THE QUESTIONS",
    titleFirst: "Good questions.",
    titleSecond: "Clear answers.",
    description:
      "A little curiosity goes a long way. Here's what you might want to know before beginning.",
    index: "THE KNOWLEDGE DESK",
    questionLabel: "FREQUENTLY ASKED QUESTIONS",
    showing: "QUESTIONS",
    contactEyebrow: "STILL CURIOUS?",
    contactTitle: "Let's talk about it.",
    contactDescription:
      "Didn't find what you were looking for? We're here to help you find your way.",
    contactButton: "Get in touch",
    empty: "No questions found in this category.",
    footer: "BEHAR / LEARNING WITHOUT BORDERS",
    open: "Expand answer",
    close: "Collapse answer",
  },
  ar: {
    eyebrow: "009 / الأسئلة",
    titleFirst: "أسئلة مهمة.",
    titleSecond: "إجابات واضحة.",
    description:
      "الفضول بداية كل رحلة تعليمية. إليك ما قد ترغب بمعرفته قبل أن تبدأ.",
    index: "مكتب المعرفة",
    questionLabel: "الأسئلة الشائعة",
    showing: "أسئلة",
    contactEyebrow: "لديك المزيد من الأسئلة؟",
    contactTitle: "خلّنا نتحدث.",
    contactDescription:
      "ما لقيت الإجابة اللي تبحث عنها؟ نحن هنا لمساعدتك.",
    contactButton: "تواصل معنا",
    empty: "لا توجد أسئلة في هذا التصنيف.",
    footer: "بحار / تعلّم بلا حدود",
    open: "عرض الإجابة",
    close: "إخفاء الإجابة",
  },
};
