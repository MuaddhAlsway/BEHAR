
export const discussionCourses = [
  {
    id: "course-001",
    title: {
      en: "Modern React Development",
      ar: "تطوير React الحديث",
    },
  },
  {
    id: "course-002",
    title: {
      en: "UI/UX Design Foundations",
      ar: "أساسيات تصميم واجهات وتجربة المستخدم",
    },
  },
  {
    id: "course-004",
    title: {
      en: "AI for Creative Professionals",
      ar: "الذكاء الاصطناعي للمبدعين",
    },
  },
  {
    id: "course-005",
    title: {
      en: "Digital Marketing Strategy",
      ar: "استراتيجيات التسويق الرقمي",
    },
  },
];

export const discussionRecords = [
  {
    id: "discussion-001",
    courseId: "course-001",
    author: "Ahmed Hassan",
    authorRole: "student",
    title: {
      en: "How should I structure a large React application?",
      ar: "كيف أنظم مشروع React كبير؟",
    },
    excerpt: {
      en: "I'm working with reusable components, routes, and shared state. What architecture would you recommend?",
      ar: "أعمل على مكونات قابلة لإعادة الاستخدام ومسارات وحالة مشتركة. ما البنية المناسبة؟",
    },
    tags: ["React", "Architecture"],
    status: "solved",
    replies: 12,
    upvotes: 28,
    createdAt: "2026-11-23T09:30:00Z",
    hasInstructorReply: true,
    isMine: false,
  },
  {
    id: "discussion-002",
    courseId: "course-001",
    author: "Sara Mohammed",
    authorRole: "student",
    title: {
      en: "When should I use useMemo versus useCallback?",
      ar: "متى أستخدم useMemo بدلًا من useCallback؟",
    },
    excerpt: {
      en: "I'm trying to understand when memoization actually improves performance and when it adds complexity.",
      ar: "أحاول فهم متى يحسن حفظ النتائج الأداء ومتى يزيد تعقيد الكود.",
    },
    tags: ["Hooks", "Performance"],
    status: "open",
    replies: 8,
    upvotes: 19,
    createdAt: "2026-11-24T14:20:00Z",
    hasInstructorReply: false,
    isMine: false,
  },
  {
    id: "discussion-003",
    courseId: "course-002",
    author: "BEHAR Student",
    authorRole: "student",
    title: {
      en: "How do I create an accessible navigation system?",
      ar: "كيف أصمم نظام تنقل قابلًا للوصول؟",
    },
    excerpt: {
      en: "I'm looking for best practices for keyboard navigation, focus states, and accessible menus.",
      ar: "أبحث عن أفضل الممارسات للتنقل بلوحة المفاتيح وحالات التركيز والقوائم.",
    },
    tags: ["Accessibility", "Navigation"],
    status: "open",
    replies: 5,
    upvotes: 11,
    createdAt: "2026-11-22T11:15:00Z",
    hasInstructorReply: true,
    isMine: true,
  },
  {
    id: "discussion-004",
    courseId: "course-002",
    author: "Omar Saleh",
    authorRole: "student",
    title: {
      en: "What makes a design system scalable?",
      ar: "ما الذي يجعل نظام التصميم قابلًا للتوسع؟",
    },
    excerpt: {
      en: "Should design tokens, component variants, and documentation be defined before building the UI?",
      ar: "هل يجب تحديد متغيرات التصميم وحالات المكونات والتوثيق قبل بناء الواجهة؟",
    },
    tags: ["Design Systems", "Components"],
    status: "solved",
    replies: 15,
    upvotes: 36,
    createdAt: "2026-11-20T08:40:00Z",
    hasInstructorReply: true,
    isMine: false,
  },
  {
    id: "discussion-005",
    courseId: "course-004",
    author: "Lina Khalid",
    authorRole: "student",
    title: {
      en: "How can AI improve a creative workflow?",
      ar: "كيف يمكن للذكاء الاصطناعي تحسين سير العمل الإبداعي؟",
    },
    excerpt: {
      en: "I'd like to explore practical ways to combine AI tools with human creative direction.",
      ar: "أرغب في استكشاف طرق عملية للجمع بين أدوات الذكاء الاصطناعي والتوجيه الإبداعي البشري.",
    },
    tags: ["AI", "Workflow"],
    status: "open",
    replies: 4,
    upvotes: 9,
    createdAt: "2026-11-25T10:10:00Z",
    hasInstructorReply: false,
    isMine: false,
  },
  {
    id: "discussion-006",
    courseId: "course-005",
    author: "BEHAR Student",
    authorRole: "student",
    title: {
      en: "Which metrics matter most for a campaign?",
      ar: "ما أهم المقاييس لتقييم حملة تسويقية؟",
    },
    excerpt: {
      en: "I'm comparing conversion rate, acquisition cost, and retention when measuring campaign success.",
      ar: "أقارن بين معدل التحويل وتكلفة اكتساب العملاء والاحتفاظ بهم عند قياس نجاح الحملات.",
    },
    tags: ["Analytics", "Marketing"],
    status: "solved",
    replies: 7,
    upvotes: 17,
    createdAt: "2026-11-19T16:00:00Z",
    hasInstructorReply: true,
    isMine: true,
  },
  {
    id: "discussion-007",
    courseId: "course-001",
    author: "Yousef Ali",
    authorRole: "student",
    title: {
      en: "How do I handle loading and error states?",
      ar: "كيف أتعامل مع حالات التحميل والأخطاء؟",
    },
    excerpt: {
      en: "I'm designing reusable patterns for asynchronous data fetching in React.",
      ar: "أصمم أنماطًا قابلة لإعادة الاستخدام لجلب البيانات غير المتزامن في React.",
    },
    tags: ["React", "Data Fetching"],
    status: "open",
    replies: 3,
    upvotes: 6,
    createdAt: "2026-11-25T17:45:00Z",
    hasInstructorReply: false,
    isMine: false,
  },
  {
    id: "discussion-008",
    courseId: "course-002",
    author: "Nora Ahmed",
    authorRole: "student",
    title: {
      en: "How should I organize a usability test?",
      ar: "كيف أنظم اختبار قابلية الاستخدام؟",
    },
    excerpt: {
      en: "What tasks and success criteria should I prepare for testing a new student dashboard?",
      ar: "ما المهام ومعايير النجاح التي أحتاجها لاختبار لوحة تحكم طلابية جديدة؟",
    },
    tags: ["Research", "Usability"],
    status: "open",
    replies: 6,
    upvotes: 14,
    createdAt: "2026-11-21T13:00:00Z",
    hasInstructorReply: true,
    isMine: false,
  },
];

export function getDiscussionText(value, language = "en") {
  if (typeof value === "string") return value;

  return value?.[language] ?? value?.en ?? "";
}

export function getDiscussionCourse(courseId) {
  return discussionCourses.find(
    (course) => course.id === courseId
  );
}

export function getDiscussionStats(records) {
  return {
    total: records.length,
    mine: records.filter((item) => item.isMine).length,
    solved: records.filter(
      (item) => item.status === "solved"
    ).length,
    instructorAnswered: records.filter(
      (item) => item.hasInstructorReply
    ).length,
  };
}
