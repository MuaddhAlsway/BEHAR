
/**
 * BEHAR — Student Dashboard Mock Data
 *
 * Frontend-only data for UI development.
 * Replace with backend API responses during integration.
 *
 * Planned endpoint:
 * GET /api/student/dashboard
 */

// ==========================================
// P14.1.1 — STUDENT INFORMATION
// P14.1.3 — LEARNING STATISTICS
// ==========================================

export const mockStudent = {
  id: "student_001",
  firstName: "Alex",
  lastName: "Morgan",
  email: "alex.morgan@example.com",
  role: "student",
  avatar: null,

  learningGoal: {
    en: "Become a confident full-stack developer",
    ar: "أصبح مطور ويب متكاملًا بثقة",
  },

  // Weekly learning activity
  weeklyGoalHours: 10,
  weeklyCompletedHours: 6.5,
  currentStreak: 5,

  // Learning statistics
  enrolledCourses: 4,
  completedCourses: 1,
  completedLessons: 18,
  totalStudyHours: 42,
  certificatesEarned: 1,
};

// ==========================================
// P14.1.2 — CONTINUE LEARNING
// ==========================================

export const mockContinueLearning = {
  courseId: "course-001",
  courseSlug: "modern-react-development",

  title: {
    en: "Modern React Development",
    ar: "تطوير تطبيقات React الحديثة",
  },

  category: {
    en: "Development",
    ar: "البرمجة والتطوير",
  },

  instructor: {
    name: "Omar Khalid",
    avatar: null,
  },

  image: "/images/courses/course-fallback.webp",

  // Course progress
  progress: 62,
  completedLessons: 8,
  totalLessons: 13,

  // Current chapter
  currentChapter: {
    en: "Building Reusable Components",
    ar: "بناء مكونات قابلة لإعادة الاستخدام",
  },

  // Next lesson
  nextLesson: {
    id: "lesson_008",

    title: {
      en: "Component Architecture",
      ar: "هيكلة المكونات",
    },

    durationMinutes: 18,
  },

  lastAccessedAt: "2026-11-23T14:30:00Z",
};

// ==========================================
// DASHBOARD AGGREGATED DATA
// ==========================================

/* ==========================================
   P14.1.4 — ACTIVE COURSES
========================================== */

export const mockActiveCourses = [
  {
    id: "course-001",
    slug: "modern-react-development",
    title: {
      en: "Modern React Development",
      ar: "تطوير تطبيقات React الحديثة",
    },
    category: {
      en: "Development",
      ar: "البرمجة والتطوير",
    },
    instructor: {
      name: "Omar Khalid",
      avatar: null,
    },
    image: "/images/courses/course-fallback.webp",
    progress: 62,
    completedLessons: 8,
    totalLessons: 13,
    durationHours: 24,
    status: "in_progress",
    lastAccessedAt: "2026-11-23T14:30:00Z",
    nextLessonId: "lesson_008",
  },
  {
    id: "course-003",
    slug: "ui-ux-design-foundations",
    title: {
      en: "UI/UX Design Foundations",
      ar: "أساسيات تصميم تجربة المستخدم",
    },
    category: {
      en: "Design",
      ar: "التصميم",
    },
    instructor: {
      name: "Daniel Foster",
      avatar: null,
    },
    image: "/images/courses/ui-ux-design.webp",
    progress: 35,
    completedLessons: 5,
    totalLessons: 14,
    durationHours: 18,
    status: "in_progress",
    lastAccessedAt: "2026-11-21T10:15:00Z",
    nextLessonId: "lesson_006",
  },
  {
    id: "course-002",
    slug: "advanced-nodejs-architecture",
    title: {
      en: "Advanced Node.js Architecture",
      ar: "هندسة Node.js المتقدمة",
    },
    category: {
      en: "Development",
      ar: "البرمجة والتطوير",
    },
    instructor: {
      name: "James Wilson",
      avatar: null,
    },
    image: "/images/courses/nodejs-backend.webp",
    progress: 18,
    completedLessons: 3,
    totalLessons: 17,
    durationHours: 32,
    status: "in_progress",
    lastAccessedAt: "2026-11-19T09:00:00Z",
    nextLessonId: "lesson_004",
  },
  {
    id: "course-008",
    slug: "digital-marketing-essentials",
    title: {
      en: "Digital Marketing Essentials",
      ar: "أساسيات التسويق الرقمي",
    },
    category: {
      en: "Marketing",
      ar: "التسويق",
    },
    instructor: {
      name: "Emma Roberts",
      avatar: null,
    },
    image: "/images/courses/digital-marketing.webp",
    progress: 0,
    completedLessons: 0,
    totalLessons: 12,
    durationHours: 16,
    status: "not_started",
    lastAccessedAt: null,
    nextLessonId: "lesson_001",
  },
];

/* ==========================================
   P14.1.5 — WEEKLY LEARNING ACTIVITY
========================================== */

export const mockWeeklyActivity = {
  weekStart: "2026-11-23",
  weekEnd: "2026-11-29",

  goalHours: 10,
  totalHours: 6.5,
  previousWeekHours: 5,

  currentStreak: 5,

  days: [
    {
      date: "2026-11-23",
      hours: 1.5,
      lessonsCompleted: 2,
    },
    {
      date: "2026-11-24",
      hours: 2,
      lessonsCompleted: 3,
    },
    {
      date: "2026-11-25",
      hours: 1,
      lessonsCompleted: 1,
    },
    {
      date: "2026-11-26",
      hours: 1.5,
      lessonsCompleted: 2,
    },
    {
      date: "2026-11-27",
      hours: 0.5,
      lessonsCompleted: 1,
    },
    {
      date: "2026-11-28",
      hours: 0,
      lessonsCompleted: 0,
    },
    {
      date: "2026-11-29",
      hours: 0,
      lessonsCompleted: 0,
    },
  ],
};


export const mockUpcomingDeadlines = [
  {
    id: "deadline_001",
    type: "assignment",
    title: {
      en: "Build a Reusable Component Library",
      ar: "بناء مكتبة مكونات قابلة لإعادة الاستخدام",
    },
    course: {
      id: "course-001",
      title: {
        en: "Modern React Development",
        ar: "تطوير تطبيقات React الحديثة",
      },
    },
    dueAt: "2026-11-26T18:00:00+03:00",
    status: "pending",
    priority: "high",
    destination: "/student/assignments",
  },
  {
    id: "deadline_002",
    type: "quiz",
    title: {
      en: "UX Research Fundamentals Quiz",
      ar: "اختبار أساسيات أبحاث تجربة المستخدم",
    },
    course: {
      id: "course-003",
      title: {
        en: "UI/UX Design Foundations",
        ar: "أساسيات تصميم تجربة المستخدم",
      },
    },
    dueAt: "2026-11-28T20:00:00+03:00",
    status: "pending",
    priority: "medium",
    destination: "/student/quizzes",
  },
  {
    id: "deadline_003",
    type: "live_session",
    title: {
      en: "Backend Architecture Workshop",
      ar: "ورشة عمل هندسة الأنظمة الخلفية",
    },
    course: {
      id: "course-002",
      title: {
        en: "Advanced Node.js Architecture",
        ar: "هندسة Node.js المتقدمة",
      },
    },
    dueAt: "2026-12-01T17:00:00+03:00",
    status: "scheduled",
    priority: "medium",
    destination: "/student/calendar",
  },
  {
    id: "deadline_004",
    type: "exam",
    title: {
      en: "React Development Final Assessment",
      ar: "التقييم النهائي لتطوير React",
    },
    course: {
      id: "course-001",
      title: {
        en: "Modern React Development",
        ar: "تطوير تطبيقات React الحديثة",
      },
    },
    dueAt: "2026-12-05T21:00:00+03:00",
    status: "pending",
    priority: "high",
    destination: "/student/quizzes",
  },
];



/* ==========================================
   P14.1.7 — LEARNING MILESTONES
========================================== */

export const mockLearningMilestones = {
  featuredMilestoneId: "milestone_004",

  milestones: [
    {
      id: "milestone_001",
      icon: "sparkles",
      title: {
        en: "The First Step",
        ar: "الخطوة الأولى",
      },
      description: {
        en: "Enroll in your first course and begin your learning journey.",
        ar: "سجّل في دورتك الأولى وابدأ رحلتك التعليمية.",
      },
      metric: "enrolledCourses",
      target: 1,
      completedAt: "2026-11-02T10:00:00Z",
    },
    {
      id: "milestone_002",
      icon: "book",
      title: {
        en: "Knowledge Seeker",
        ar: "باحث عن المعرفة",
      },
      description: {
        en: "Complete your first 10 lessons.",
        ar: "أكمل أول 10 دروس في رحلتك.",
      },
      metric: "completedLessons",
      target: 10,
      completedAt: "2026-11-14T15:30:00Z",
    },
    {
      id: "milestone_003",
      icon: "graduation",
      title: {
        en: "First Finish Line",
        ar: "أول إنجاز مكتمل",
      },
      description: {
        en: "Successfully complete your first course.",
        ar: "أكمل دورتك التعليمية الأولى بنجاح.",
      },
      metric: "completedCourses",
      target: 1,
      completedAt: "2026-11-20T12:00:00Z",
    },
    {
      id: "milestone_004",
      icon: "flame",
      title: {
        en: "A Week of Momentum",
        ar: "أسبوع من الاستمرارية",
      },
      description: {
        en: "Build a seven-day learning streak.",
        ar: "حافظ على سلسلة تعلّم لمدة سبعة أيام متتالية.",
      },
      metric: "currentStreak",
      target: 7,
      completedAt: null,
    },
    {
      id: "milestone_005",
      icon: "clock",
      title: {
        en: "The 50-Hour Club",
        ar: "نادي الخمسين ساعة",
      },
      description: {
        en: "Invest 50 hours in your learning journey.",
        ar: "استثمر 50 ساعة في رحلتك التعليمية.",
      },
      metric: "totalStudyHours",
      target: 50,
      completedAt: null,
    },
    {
      id: "milestone_006",
      icon: "award",
      title: {
        en: "Certificate Collector",
        ar: "جامع الشهادات",
      },
      description: {
        en: "Earn three course certificates.",
        ar: "احصل على ثلاث شهادات تعليمية.",
      },
      metric: "certificatesEarned",
      target: 3,
      completedAt: null,
    },
    {
      id: "milestone_007",
      icon: "trophy",
      title: {
        en: "Dedicated Learner",
        ar: "متعلّم مثابر",
      },
      description: {
        en: "Complete 50 lessons across your courses.",
        ar: "أكمل 50 درسًا عبر دوراتك التعليمية.",
      },
      metric: "completedLessons",
      target: 50,
      completedAt: null,
    },
  ],
};

/* ==========================================
   P14.1.8 — RECOMMENDED COURSES
========================================== */

export const mockRecommendedCourses = [
  {
    id: "recommended_001",
    courseId: "course-010",
    slug: "typescript-for-developers",
    title: {
      en: "TypeScript for Developers",
      ar: "تعلم TypeScript للمطورين",
    },
    category: {
      en: "Development",
      ar: "البرمجة والتطوير",
    },
    description: {
      en: "Move beyond the fundamentals and build safer, more scalable applications with advanced TypeScript.",
      ar: "تجاوز الأساسيات وابنِ تطبيقات أكثر أمانًا وقابلية للتوسع باستخدام TypeScript المتقدمة.",
    },
    instructor: {
      name: "Michael Chen",
      avatar: null,
    },
    image: "/images/courses/advanced-typescript.webp",
    level: "advanced",
    durationHours: 18,
    rating: 4.9,
    reviewCount: 128,
    students: 1840,
    price: 79,
    currency: "USD",
    featured: true,
    reason: {
      en: "Because you're learning React",
      ar: "لأنك تتعلم React",
    },
  },
  {
    id: "recommended_002",
    courseId: "course-012",
    slug: "product-design-systems",
    title: {
      en: "Product Design Systems",
      ar: "أنظمة تصميم المنتجات الرقمية",
    },
    category: {
      en: "Design",
      ar: "التصميم",
    },
    description: {
      en: "Create consistent and scalable digital experiences.",
      ar: "أنشئ تجارب رقمية متسقة وقابلة للتوسع.",
    },
    instructor: {
      name: "Olivia Bennett",
      avatar: null,
    },
    image: "/images/courses/design-systems.webp",
    level: "intermediate",
    durationHours: 14,
    rating: 4.8,
    reviewCount: 96,
    students: 1250,
    price: 59,
    currency: "USD",
    featured: false,
    reason: {
      en: "Explore design",
      ar: "اكتشف التصميم",
    },
  },
  {
    id: "recommended_003",
    courseId: "course-002",
    slug: "advanced-nodejs-architecture",
    title: {
      en: "Advanced Node.js Architecture",
      ar: "هندسة Node.js المتقدمة",
    },
    category: {
      en: "Development",
      ar: "البرمجة والتطوير",
    },
    description: {
      en: "Design efficient data models and production-ready database systems.",
      ar: "صمّم نماذج بيانات فعالة وأنظمة قواعد بيانات جاهزة للإنتاج.",
    },
    instructor: {
      name: "David Park",
      avatar: null,
    },
    image: "/images/courses/mongodb-architecture.webp",
    level: "intermediate",
    durationHours: 22,
    rating: 4.9,
    reviewCount: 211,
    students: 2780,
    price: 69,
    currency: "USD",
    featured: false,
    reason: {
      en: "Expand your backend skills",
      ar: "طوّر مهاراتك الخلفية",
    },
  },
  {
    id: "recommended_004",
    courseId: "course-003",
    slug: "ui-ux-design-foundations",
    title: {
      en: "UI/UX Design Foundations",
      ar: "أساسيات تصميم تجربة المستخدم",
    },
    category: {
      en: "Design",
      ar: "التصميم",
    },
    description: {
      en: "Solve complex problems through human-centered design.",
      ar: "حل المشكلات المعقدة من خلال التصميم المتمحور حول الإنسان.",
    },
    instructor: {
      name: "Sophia Adams",
      avatar: null,
    },
    image: "/images/courses/product-design.webp",
    level: "beginner",
    durationHours: 12,
    rating: 4.7,
    reviewCount: 83,
    students: 940,
    price: 49,
    currency: "USD",
    featured: false,
    reason: {
      en: "Broaden your perspective",
      ar: "وسّع آفاقك",
    },
  },
  {
    id: "recommended_005",
    courseId: "course-011",
    slug: "brand-storytelling",
    title: {
      en: "Brand Storytelling",
      ar: "فن سرد قصص العلامات التجارية",
    },
    category: {
      en: "Marketing",
      ar: "التسويق",
    },
    description: {
      en: "Build memorable brands through strategy, positioning, and storytelling.",
      ar: "ابنِ علامات تجارية مميزة عبر الاستراتيجية والتموضع وسرد القصص.",
    },
    instructor: {
      name: "Emma Roberts",
      avatar: null,
    },
    image: "/images/courses/brand-strategy.webp",
    level: "intermediate",
    durationHours: 16,
    rating: 4.8,
    reviewCount: 142,
    students: 1690,
    price: 55,
    currency: "USD",
    featured: false,
    reason: {
      en: "Discover something new",
      ar: "اكتشف مجالًا جديدًا",
    },
  },
];

export const mockDashboard = {
  student: mockStudent,
  continueLearning: mockContinueLearning,
  activeCourses: mockActiveCourses,
  weeklyActivity: mockWeeklyActivity,
  upcomingDeadlines: mockUpcomingDeadlines,
  lastUpdated: "2026-11-24T14:30:00Z",
};

export default mockDashboard;


