
const localized = (en, ar) => ({ en, ar });

export const courseLearningOutcomes = {
  "modern-react-development": {
    introduction: localized(
      "Go beyond building interfaces. Learn to think in components, manage application state, and engineer modern React experiences.",
      "تجاوز بناء الواجهات التقليدية. تعلم التفكير بالمكونات وإدارة حالة التطبيق وتطوير تجارب حديثة باستخدام React."
    ),
    outcomes: [
      {
        id: "react-01",
        title: localized(
          "Think in Components",
          "التفكير بالمكونات"
        ),
        description: localized(
          "Break complex interfaces into reusable, maintainable components with clear responsibilities.",
          "قسّم الواجهات المعقدة إلى مكونات قابلة لإعادة الاستخدام والصيانة مع تحديد مسؤوليات كل مكون."
        ),
        tag: "ARCHITECTURE",
      },
      {
        id: "react-02",
        title: localized(
          "Master State & Data Flow",
          "إتقان الحالة وتدفق البيانات"
        ),
        description: localized(
          "Work confidently with props, state, effects, custom hooks, and predictable data flow.",
          "تعامل بثقة مع الخصائص والحالة والتأثيرات والخطافات المخصصة وتدفق البيانات."
        ),
        tag: "REACT CORE",
      },
      {
        id: "react-03",
        title: localized(
          "Build Responsive Experiences",
          "بناء تجارب متجاوبة"
        ),
        description: localized(
          "Create accessible, responsive interfaces that feel polished across screen sizes.",
          "أنشئ واجهات متجاوبة وسهلة الوصول تعمل بسلاسة على مختلف أحجام الشاشات."
        ),
        tag: "INTERFACE",
      },
      {
        id: "react-04",
        title: localized(
          "Connect Real APIs",
          "ربط واجهات API"
        ),
        description: localized(
          "Fetch remote data and handle loading, empty, success, and error states correctly.",
          "اجلب البيانات من الخدمات الخارجية وتعامل مع حالات التحميل والنجاح والأخطاء والنتائج الفارغة."
        ),
        tag: "INTEGRATION",
      },
      {
        id: "react-05",
        title: localized(
          "Structure Production Apps",
          "هيكلة تطبيقات الإنتاج"
        ),
        description: localized(
          "Organize routes, shared components, application logic, and reusable styling for maintainable projects.",
          "نظّم المسارات والمكونات المشتركة ومنطق التطبيق والتنسيقات لبناء مشاريع قابلة للصيانة."
        ),
        tag: "ENGINEERING",
      },
    ],
    project: {
      eyebrow: localized(
        "YOUR FINAL CREATION",
        "مشروعك النهائي"
      ),
      title: localized(
        "Build a Complete React Application",
        "ابنِ تطبيق React متكاملًا"
      ),
      description: localized(
        "Apply your skills to a multi-page application with reusable components, dynamic data, responsive layouts, and refined interactions.",
        "طبّق مهاراتك في تطبيق متعدد الصفحات يحتوي على مكونات قابلة لإعادة الاستخدام وبيانات ديناميكية وواجهات متجاوبة."
      ),
      deliverables: [
        localized("Reusable component system", "نظام مكونات قابل لإعادة الاستخدام"),
        localized("API-powered interfaces", "واجهات مرتبطة بواجهات API"),
        localized("Responsive application", "تطبيق متجاوب"),
      ],
    },
    prerequisites: [
      localized(
        "Basic HTML and CSS knowledge",
        "معرفة أساسية بـ HTML وCSS"
      ),
      localized(
        "JavaScript fundamentals",
        "أساسيات JavaScript"
      ),
      localized(
        "A computer with a code editor",
        "جهاز كمبيوتر ومحرر أكواد"
      ),
    ],
  },

  "ui-ux-design-foundations": {
    introduction: localized(
      "Understand how exceptional digital experiences are researched, structured, designed, and refined.",
      "افهم كيف تُبحث التجارب الرقمية المتميزة وتُنظّم وتُصمّم وتُطوّر."
    ),
    outcomes: [
      {
        id: "design-01",
        title: localized(
          "Understand Your Users",
          "فهم المستخدمين"
        ),
        description: localized(
          "Explore user needs, research methods, personas, and the problems behind design decisions.",
          "تعرّف على احتياجات المستخدمين وطرق البحث والشخصيات الافتراضية والمشكلات وراء قرارات التصميم."
        ),
        tag: "RESEARCH",
      },
      {
        id: "design-02",
        title: localized(
          "Map User Journeys",
          "رسم رحلات المستخدم"
        ),
        description: localized(
          "Organize information, user flows, and navigation into intuitive experiences.",
          "نظّم المعلومات وتدفقات المستخدم والتنقل لبناء تجارب سهلة الفهم."
        ),
        tag: "STRATEGY",
      },
      {
        id: "design-03",
        title: localized(
          "Design Better Interfaces",
          "تصميم واجهات أفضل"
        ),
        description: localized(
          "Apply hierarchy, typography, color, spacing, and layout principles.",
          "طبّق مبادئ التسلسل البصري والخطوط والألوان والمسافات والتخطيط."
        ),
        tag: "VISUAL DESIGN",
      },
      {
        id: "design-04",
        title: localized(
          "Prototype Your Ideas",
          "إنشاء نماذج أولية"
        ),
        description: localized(
          "Turn early sketches and wireframes into interactive prototypes.",
          "حوّل الرسومات الأولية والمخططات إلى نماذج تفاعلية."
        ),
        tag: "PROTOTYPING",
      },
      {
        id: "design-05",
        title: localized(
          "Test and Improve",
          "الاختبار والتحسين"
        ),
        description: localized(
          "Evaluate usability, identify friction, and refine designs using feedback.",
          "قيّم سهولة الاستخدام واكتشف المشكلات وحسّن التصميم باستخدام الملاحظات."
        ),
        tag: "VALIDATION",
      },
    ],
    project: {
      eyebrow: localized(
        "YOUR FINAL CREATION",
        "مشروعك النهائي"
      ),
      title: localized(
        "Design a Digital Product Experience",
        "صمّم تجربة منتج رقمي"
      ),
      description: localized(
        "Take a product concept from initial research through wireframes, visual design, and an interactive prototype.",
        "حوّل فكرة منتج من البحث الأولي إلى المخططات والواجهات البصرية والنموذج التفاعلي."
      ),
      deliverables: [
        localized("User journey map", "خريطة رحلة المستخدم"),
        localized("Interface design system", "نظام تصميم الواجهات"),
        localized("Interactive prototype", "نموذج أولي تفاعلي"),
      ],
    },
    prerequisites: [
      localized(
        "No previous design experience required",
        "لا تحتاج إلى خبرة سابقة في التصميم"
      ),
      localized(
        "Basic computer skills",
        "مهارات استخدام الكمبيوتر الأساسية"
      ),
      localized(
        "Curiosity and creative thinking",
        "الفضول والتفكير الإبداعي"
      ),
    ],
  },

  "ai-for-creative-professionals": {
    introduction: localized(
      "Discover how artificial intelligence can support ideation, visual exploration, and creative workflows.",
      "اكتشف كيف يدعم الذكاء الاصطناعي توليد الأفكار والاستكشاف البصري وسير العمل الإبداعي."
    ),
    outcomes: [
      {
        id: "ai-01",
        title: localized(
          "Understand Creative AI",
          "فهم الذكاء الاصطناعي الإبداعي"
        ),
        description: localized(
          "Understand generative AI capabilities, limitations, and practical creative use cases.",
          "افهم قدرات الذكاء الاصطناعي التوليدي وحدوده واستخداماته الإبداعية."
        ),
        tag: "FOUNDATIONS",
      },
      {
        id: "ai-02",
        title: localized(
          "Craft Better Prompts",
          "صياغة أوامر أفضل"
        ),
        description: localized(
          "Structure prompts for more consistent, useful, and controllable creative outputs.",
          "صمّم أوامر تحقق نتائج إبداعية أكثر اتساقًا وقابلية للتحكم."
        ),
        tag: "PROMPTING",
      },
      {
        id: "ai-03",
        title: localized(
          "Explore Visual Concepts",
          "استكشاف المفاهيم البصرية"
        ),
        description: localized(
          "Use AI-assisted exploration to develop visual directions and creative concepts.",
          "استخدم أدوات الذكاء الاصطناعي لاستكشاف الاتجاهات البصرية والمفاهيم الإبداعية."
        ),
        tag: "CREATION",
      },
      {
        id: "ai-04",
        title: localized(
          "Build Creative Workflows",
          "بناء سير عمل إبداعي"
        ),
        description: localized(
          "Combine AI outputs with human judgment, editing, and iteration.",
          "ادمج مخرجات الذكاء الاصطناعي مع التقييم البشري والتحرير والتحسين."
        ),
        tag: "WORKFLOW",
      },
    ],
    project: {
      eyebrow: localized(
        "YOUR FINAL CREATION",
        "مشروعك النهائي"
      ),
      title: localized(
        "Create an AI-Assisted Campaign",
        "أنشئ حملة إبداعية بمساعدة الذكاء الاصطناعي"
      ),
      description: localized(
        "Develop a cohesive visual concept with moodboards, image directions, and refined creative assets.",
        "طوّر مفهومًا بصريًا متكاملًا باستخدام لوحات الإلهام والاتجاهات البصرية والأصول الإبداعية."
      ),
      deliverables: [
        localized("Creative concept board", "لوحة مفاهيم إبداعية"),
        localized("Visual asset collection", "مجموعة أصول بصرية"),
        localized("Documented AI workflow", "سير عمل موثق"),
      ],
    },
    prerequisites: [
      localized(
        "No AI experience required",
        "لا تحتاج إلى خبرة سابقة بالذكاء الاصطناعي"
      ),
      localized(
        "Basic digital creativity skills",
        "مهارات إبداعية رقمية أساسية"
      ),
    ],
  },

  "typescript-for-developers": {
    introduction: localized(
      "Write safer JavaScript, model complex data, and create scalable applications with TypeScript.",
      "اكتب JavaScript أكثر أمانًا ونمذج البيانات المعقدة وأنشئ تطبيقات قابلة للتوسع باستخدام TypeScript."
    ),
    outcomes: [
      {
        id: "ts-01",
        title: localized(
          "Understand the Type System",
          "فهم نظام الأنواع"
        ),
        description: localized(
          "Learn primitive types, unions, narrowing, and type inference.",
          "تعلم الأنواع الأساسية والاتحادات وتضييق الأنواع والاستدلال عليها."
        ),
        tag: "TYPES",
      },
      {
        id: "ts-02",
        title: localized(
          "Model Data with Interfaces",
          "نمذجة البيانات بالواجهات"
        ),
        description: localized(
          "Describe object structures with interfaces, aliases, and reusable type definitions.",
          "صف هياكل البيانات باستخدام الواجهات والأسماء المستعارة وتعريفات الأنواع."
        ),
        tag: "MODELING",
      },
      {
        id: "ts-03",
        title: localized(
          "Create Reusable Generics",
          "إنشاء أنواع عامة قابلة لإعادة الاستخدام"
        ),
        description: localized(
          "Build flexible functions and components with type parameters.",
          "أنشئ دوال ومكونات مرنة باستخدام معاملات الأنواع."
        ),
        tag: "GENERICS",
      },
      {
        id: "ts-04",
        title: localized(
          "Engineer Reliable Applications",
          "هندسة تطبيقات موثوقة"
        ),
        description: localized(
          "Apply TypeScript to application architecture, API data, and error prevention.",
          "طبّق TypeScript على بنية التطبيقات وبيانات API وتقليل الأخطاء."
        ),
        tag: "ENGINEERING",
      },
    ],
    project: {
      eyebrow: localized(
        "YOUR FINAL CREATION",
        "مشروعك النهائي"
      ),
      title: localized(
        "Build a Type-Safe Application",
        "ابنِ تطبيقًا آمن الأنواع"
      ),
      description: localized(
        "Develop a practical application with typed data models, reusable utilities, and safer interfaces.",
        "طوّر تطبيقًا عمليًا بنماذج بيانات محددة الأنواع وأدوات قابلة لإعادة الاستخدام وواجهات أكثر أمانًا."
      ),
      deliverables: [
        localized("Typed application models", "نماذج بيانات محددة الأنواع"),
        localized("Reusable generic utilities", "أدوات عامة قابلة لإعادة الاستخدام"),
        localized("Type-safe API integration", "ربط API آمن الأنواع"),
      ],
    },
    prerequisites: [
      localized(
        "Working knowledge of JavaScript",
        "معرفة عملية بلغة JavaScript"
      ),
      localized(
        "Basic functions and objects",
        "فهم أساسي للدوال والكائنات"
      ),
    ],
  },
};

const defaultLearningOutcomes = {
  introduction: localized(
    "Discover the essential concepts, develop practical skills, and apply your knowledge through guided learning.",
    "اكتشف المفاهيم الأساسية وطوّر مهاراتك العملية وطبّق معرفتك من خلال تجربة تعليمية موجهة."
  ),
  outcomes: [
    {
      id: "general-01",
      title: localized(
        "Understand the Fundamentals",
        "فهم الأساسيات"
      ),
      description: localized(
        "Explore the key principles and concepts behind the subject.",
        "استكشف المبادئ والمفاهيم الرئيسية للموضوع."
      ),
      tag: "FOUNDATIONS",
    },
    {
      id: "general-02",
      title: localized(
        "Develop Practical Skills",
        "تطوير المهارات العملية"
      ),
      description: localized(
        "Practice essential techniques through guided exercises.",
        "تدرّب على التقنيات الأساسية من خلال تمارين موجهة."
      ),
      tag: "PRACTICE",
    },
    {
      id: "general-03",
      title: localized(
        "Apply Your Knowledge",
        "تطبيق المعرفة"
      ),
      description: localized(
        "Use what you learn to solve realistic challenges.",
        "استخدم ما تعلمته لحل تحديات واقعية."
      ),
      tag: "APPLICATION",
    },
  ],
  project: null,
  prerequisites: [
    localized(
      "A willingness to learn and practice",
      "الرغبة في التعلم والممارسة"
    ),
  ],
};

export function getCourseLearningOutcomes(slug) {
  return (
    courseLearningOutcomes[slug] ||
    defaultLearningOutcomes
  );
}
