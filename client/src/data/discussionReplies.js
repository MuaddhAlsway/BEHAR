
export const discussionReplies = [
  {
    id: "reply-001",
    discussionId: "discussion-001",
    parentId: null,
    author: "Omar Khalid",
    authorRole: "instructor",
    content: {
      en: "Start with a feature-based structure. Keep components close to the features they belong to, and move shared components into a common directory only when they are genuinely reusable.",
      ar: "ابدأ بتنظيم المشروع حسب الميزات. احتفظ بالمكونات بالقرب من الميزات التي تنتمي إليها، وانقل المكونات المشتركة إلى مجلد عام فقط عندما تكون قابلة لإعادة الاستخدام فعليًا.",
    },
    createdAt: "2026-11-23T11:30:00Z",
    upvotes: 18,
    isAccepted: true,
  },
  {
    id: "reply-002",
    discussionId: "discussion-001",
    parentId: "reply-001",
    author: "Ahmed Hassan",
    authorRole: "student",
    content: {
      en: "That makes sense. Would you recommend keeping API hooks inside each feature as well?",
      ar: "هذا منطقي. هل تنصح أيضًا بوضع Hooks الخاصة بالـ API داخل كل ميزة؟",
    },
    createdAt: "2026-11-23T12:00:00Z",
    upvotes: 4,
    isAccepted: false,
  },
  {
    id: "reply-003",
    discussionId: "discussion-001",
    parentId: "reply-002",
    author: "Omar Khalid",
    authorRole: "instructor",
    content: {
      en: "Yes. Feature-specific hooks can live within that feature. Shared networking utilities should remain in a common API layer.",
      ar: "نعم. يمكن وضع Hooks الخاصة بكل ميزة داخل مجلدها، مع إبقاء أدوات الاتصال المشتركة في طبقة API عامة.",
    },
    createdAt: "2026-11-23T12:30:00Z",
    upvotes: 7,
    isAccepted: false,
  },
  {
    id: "reply-004",
    discussionId: "discussion-002",
    parentId: null,
    author: "Youssef Salem",
    authorRole: "instructor",
    content: {
      en: "Use useMemo when you need to cache an expensive computed value. Use useCallback when preserving a function reference has a measurable benefit.",
      ar: "استخدم useMemo لتخزين نتيجة عملية حسابية مكلفة، واستخدم useCallback عندما يكون الحفاظ على مرجع الدالة مفيدًا بشكل قابل للقياس.",
    },
    createdAt: "2026-11-24T15:00:00Z",
    upvotes: 12,
    isAccepted: false,
  },
  {
    id: "reply-005",
    discussionId: "discussion-003",
    parentId: null,
    author: "Nora Alharbi",
    authorRole: "instructor",
    content: {
      en: "Start by testing keyboard navigation, visible focus indicators, semantic landmarks, and screen-reader announcements.",
      ar: "ابدأ باختبار التنقل باستخدام لوحة المفاتيح، ومؤشرات التركيز الواضحة، والعناصر الدلالية، وإعلانات قارئ الشاشة.",
    },
    createdAt: "2026-11-22T16:00:00Z",
    upvotes: 9,
    isAccepted: false,
  },
  {
    id: "reply-006",
    discussionId: "discussion-004",
    parentId: null,
    author: "Nora Alharbi",
    authorRole: "instructor",
    content: {
      en: "Define your design tokens first: typography, spacing, colors, radii, and interaction states. Then build components around those tokens.",
      ar: "حدد رموز التصميم أولًا: الخطوط، والمسافات، والألوان، والزوايا، وحالات التفاعل. ثم ابنِ المكونات اعتمادًا عليها.",
    },
    createdAt: "2026-11-20T13:00:00Z",
    upvotes: 21,
    isAccepted: true,
  },
];

export function getDiscussionReplies(discussionId, records = discussionReplies) {
  return records.filter(
    (reply) => reply.discussionId === discussionId
  );
}
