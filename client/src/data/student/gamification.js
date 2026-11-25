
/**
 * BEHAR LMS — P14.5.0.1
 * Student Gamification Data Model
 *
 * Responsibilities:
 * - Event definitions
 * - XP reward rules
 * - Level thresholds
 * - Badge definitions
 * - Streak configuration
 * - Weekly learning goals
 * - Student progress shape
 * - Bilingual UI metadata
 *
 * No React, browser storage, or network dependencies.
 *
 * IMPORTANT:
 * This module defines configuration and mock data.
 * It does not award XP or unlock achievements.
 */

export const GAMIFICATION_SCHEMA_VERSION = 1;

export const GAMIFICATION_LOCALES = Object.freeze({
  EN: "en",
  AR: "ar",
});

export const GAMIFICATION_EVENT_TYPES = Object.freeze({
  LESSON_COMPLETED: "lesson_completed",
  QUIZ_PASSED: "quiz_passed",
  QUIZ_PERFECT: "quiz_perfect",
  COURSE_COMPLETED: "course_completed",
  DAILY_LEARNING_ACTIVITY: "daily_learning_activity",
});

export const GAMIFICATION_REWARD_FREQUENCY =
  Object.freeze({
    ONCE_PER_LESSON: "once_per_lesson",
    ONCE_PER_ASSESSMENT: "once_per_assessment",
    ONCE_PER_COURSE: "once_per_course",
    ONCE_PER_DAY: "once_per_day",
  });

export const GAMIFICATION_BADGE_CATEGORIES =
  Object.freeze({
    LEARNING: "learning",
    ASSESSMENT: "assessment",
    CONSISTENCY: "consistency",
    MASTERY: "mastery",
  });

export const GAMIFICATION_BADGE_CRITERIA =
  Object.freeze({
    LESSONS_COMPLETED: "lessons_completed",
    COURSES_COMPLETED: "courses_completed",
    QUIZZES_PASSED: "quizzes_passed",
    PERFECT_QUIZZES: "perfect_quizzes",
    STREAK_DAYS: "streak_days",
    TOTAL_XP: "total_xp",
  });

export const GAMIFICATION_BADGE_RARITIES =
  Object.freeze({
    COMMON: "common",
    RARE: "rare",
    EPIC: "epic",
    LEGENDARY: "legendary",
  });

export const GAMIFICATION_GOAL_METRICS =
  Object.freeze({
    LESSONS_COMPLETED: "lessons_completed",
    LEARNING_MINUTES: "learning_minutes",
    QUIZZES_PASSED: "quizzes_passed",
  });

export const GAMIFICATION_WEEK_START_DAY =
  Object.freeze({
    MONDAY: 1,
  });

/* ==========================================
   01 — XP REWARD RULES
========================================== */

export const GAMIFICATION_XP_RULES = Object.freeze({
  [GAMIFICATION_EVENT_TYPES.LESSON_COMPLETED]: {
    xp: 25,
    frequency:
      GAMIFICATION_REWARD_FREQUENCY.ONCE_PER_LESSON,
    requires: ["studentId", "courseId", "lessonId"],
    label: {
      en: "Lesson completed",
      ar: "إكمال درس",
    },
  },

  [GAMIFICATION_EVENT_TYPES.QUIZ_PASSED]: {
    xp: 50,
    frequency:
      GAMIFICATION_REWARD_FREQUENCY.ONCE_PER_ASSESSMENT,
    requires: ["studentId", "assessmentId"],
    label: {
      en: "Quiz passed",
      ar: "اجتياز اختبار",
    },
  },

  [GAMIFICATION_EVENT_TYPES.QUIZ_PERFECT]: {
    xp: 25,
    frequency:
      GAMIFICATION_REWARD_FREQUENCY.ONCE_PER_ASSESSMENT,
    requires: ["studentId", "assessmentId"],
    label: {
      en: "Perfect quiz bonus",
      ar: "مكافأة الدرجة الكاملة",
    },
  },

  [GAMIFICATION_EVENT_TYPES.COURSE_COMPLETED]: {
    xp: 200,
    frequency:
      GAMIFICATION_REWARD_FREQUENCY.ONCE_PER_COURSE,
    requires: ["studentId", "courseId"],
    label: {
      en: "Course completed",
      ar: "إكمال دورة",
    },
  },

  [GAMIFICATION_EVENT_TYPES.DAILY_LEARNING_ACTIVITY]: {
    xp: 10,
    frequency:
      GAMIFICATION_REWARD_FREQUENCY.ONCE_PER_DAY,
    requires: ["studentId", "activityDate"],
    label: {
      en: "Daily learning activity",
      ar: "نشاط التعلم اليومي",
    },
  },
});

/* ==========================================
   02 — LEVEL DEFINITIONS
========================================== */

/**
 * minTotalXP is cumulative lifetime XP.
 *
 * Example:
 * 0 XP    = Level 1
 * 100 XP  = Level 2
 * 250 XP  = Level 3
 */

export const GAMIFICATION_LEVELS = Object.freeze([
  {
    level: 1,
    minTotalXP: 0,
    title: {
      en: "Explorer",
      ar: "مستكشف",
    },
  },
  {
    level: 2,
    minTotalXP: 100,
    title: {
      en: "Curious Learner",
      ar: "متعلم فضولي",
    },
  },
  {
    level: 3,
    minTotalXP: 250,
    title: {
      en: "Knowledge Seeker",
      ar: "باحث عن المعرفة",
    },
  },
  {
    level: 4,
    minTotalXP: 500,
    title: {
      en: "Skill Builder",
      ar: "مطوّر المهارات",
    },
  },
  {
    level: 5,
    minTotalXP: 900,
    title: {
      en: "Dedicated Learner",
      ar: "متعلم مثابر",
    },
  },
  {
    level: 6,
    minTotalXP: 1500,
    title: {
      en: "Rising Expert",
      ar: "خبير صاعد",
    },
  },
  {
    level: 7,
    minTotalXP: 2500,
    title: {
      en: "Specialist",
      ar: "متخصص",
    },
  },
  {
    level: 8,
    minTotalXP: 4000,
    title: {
      en: "Master Learner",
      ar: "متعلم متمكن",
    },
  },
  {
    level: 9,
    minTotalXP: 6000,
    title: {
      en: "Scholar",
      ar: "باحث متميز",
    },
  },
  {
    level: 10,
    minTotalXP: 9000,
    title: {
      en: "BEHAR Legend",
      ar: "أسطورة بحار",
    },
  },
]);

/* ==========================================
   03 — BADGE DEFINITIONS
========================================== */

export const GAMIFICATION_BADGES = Object.freeze([
  {
    id: "first-step",
    category: GAMIFICATION_BADGE_CATEGORIES.LEARNING,
    rarity: GAMIFICATION_BADGE_RARITIES.COMMON,
    icon: "footprints",
    title: {
      en: "First Step",
      ar: "الخطوة الأولى",
    },
    description: {
      en: "Complete your first lesson.",
      ar: "أكمل درسك الأول.",
    },
    criteria: {
      metric:
        GAMIFICATION_BADGE_CRITERIA.LESSONS_COMPLETED,
      threshold: 1,
    },
  },
  {
    id: "lesson-explorer",
    category: GAMIFICATION_BADGE_CATEGORIES.LEARNING,
    rarity: GAMIFICATION_BADGE_RARITIES.RARE,
    icon: "book-open",
    title: {
      en: "Lesson Explorer",
      ar: "مستكشف الدروس",
    },
    description: {
      en: "Complete 10 lessons.",
      ar: "أكمل 10 دروس.",
    },
    criteria: {
      metric:
        GAMIFICATION_BADGE_CRITERIA.LESSONS_COMPLETED,
      threshold: 10,
    },
  },
  {
    id: "course-finisher",
    category: GAMIFICATION_BADGE_CATEGORIES.LEARNING,
    rarity: GAMIFICATION_BADGE_RARITIES.RARE,
    icon: "graduation-cap",
    title: {
      en: "Course Finisher",
      ar: "منجز الدورات",
    },
    description: {
      en: "Complete your first course.",
      ar: "أكمل دورتك الأولى.",
    },
    criteria: {
      metric:
        GAMIFICATION_BADGE_CRITERIA.COURSES_COMPLETED,
      threshold: 1,
    },
  },
  {
    id: "quiz-starter",
    category: GAMIFICATION_BADGE_CATEGORIES.ASSESSMENT,
    rarity: GAMIFICATION_BADGE_RARITIES.COMMON,
    icon: "clipboard-check",
    title: {
      en: "Quiz Starter",
      ar: "بداية الاختبارات",
    },
    description: {
      en: "Pass your first quiz.",
      ar: "اجتز اختبارك الأول.",
    },
    criteria: {
      metric:
        GAMIFICATION_BADGE_CRITERIA.QUIZZES_PASSED,
      threshold: 1,
    },
  },
  {
    id: "perfect-mind",
    category: GAMIFICATION_BADGE_CATEGORIES.MASTERY,
    rarity: GAMIFICATION_BADGE_RARITIES.EPIC,
    icon: "brain",
    title: {
      en: "Perfect Mind",
      ar: "العقل المتقن",
    },
    description: {
      en: "Earn a perfect score on a quiz.",
      ar: "احصل على الدرجة الكاملة في اختبار.",
    },
    criteria: {
      metric:
        GAMIFICATION_BADGE_CRITERIA.PERFECT_QUIZZES,
      threshold: 1,
    },
  },
  {
    id: "three-day-streak",
    category: GAMIFICATION_BADGE_CATEGORIES.CONSISTENCY,
    rarity: GAMIFICATION_BADGE_RARITIES.COMMON,
    icon: "flame",
    title: {
      en: "Getting Consistent",
      ar: "بداية الاستمرارية",
    },
    description: {
      en: "Reach a three-day learning streak.",
      ar: "حقق سلسلة تعلم لمدة 3 أيام.",
    },
    criteria: {
      metric:
        GAMIFICATION_BADGE_CRITERIA.STREAK_DAYS,
      threshold: 3,
    },
  },
  {
    id: "seven-day-streak",
    category: GAMIFICATION_BADGE_CATEGORIES.CONSISTENCY,
    rarity: GAMIFICATION_BADGE_RARITIES.RARE,
    icon: "calendar-check",
    title: {
      en: "One Week Strong",
      ar: "أسبوع من الإنجاز",
    },
    description: {
      en: "Reach a seven-day learning streak.",
      ar: "حقق سلسلة تعلم لمدة 7 أيام.",
    },
    criteria: {
      metric:
        GAMIFICATION_BADGE_CRITERIA.STREAK_DAYS,
      threshold: 7,
    },
  },
  {
    id: "xp-champion",
    category: GAMIFICATION_BADGE_CATEGORIES.MASTERY,
    rarity: GAMIFICATION_BADGE_RARITIES.LEGENDARY,
    icon: "trophy",
    title: {
      en: "XP Champion",
      ar: "بطل نقاط الخبرة",
    },
    description: {
      en: "Earn 5,000 total XP.",
      ar: "اجمع 5000 نقطة خبرة.",
    },
    criteria: {
      metric:
        GAMIFICATION_BADGE_CRITERIA.TOTAL_XP,
      threshold: 5000,
    },
  },
]);

/* ==========================================
   04 — STREAK CONFIGURATION
========================================== */

export const GAMIFICATION_STREAK_CONFIG = Object.freeze({
  minimumActivityPerDay: 1,
  timezonePolicy: "student_timezone",
  activityDateFormat: "YYYY-MM-DD",
  freezeEnabled: false,
  milestones: [3, 7, 14, 30, 60, 100],
});

/* ==========================================
   05 — WEEKLY GOAL CONFIGURATION
========================================== */

export const GAMIFICATION_WEEKLY_GOAL_CONFIG =
  Object.freeze({
    weekStartsOn:
      GAMIFICATION_WEEK_START_DAY.MONDAY,

    defaultGoal: {
      metric:
        GAMIFICATION_GOAL_METRICS.LESSONS_COMPLETED,
      target: 5,
    },

    availableGoals: [
      {
        metric:
          GAMIFICATION_GOAL_METRICS.LESSONS_COMPLETED,
        targets: [3, 5, 7, 10],
        label: {
          en: "Lessons completed",
          ar: "الدروس المكتملة",
        },
      },
      {
        metric:
          GAMIFICATION_GOAL_METRICS.LEARNING_MINUTES,
        targets: [60, 120, 180, 300],
        label: {
          en: "Learning minutes",
          ar: "دقائق التعلم",
        },
      },
      {
        metric:
          GAMIFICATION_GOAL_METRICS.QUIZZES_PASSED,
        targets: [1, 2, 3, 5],
        label: {
          en: "Quizzes passed",
          ar: "الاختبارات المجتازة",
        },
      },
    ],
  });

/* ==========================================
   06 — STUDENT PROGRESS SHAPE
========================================== */

/**
 * This is an empty-state factory.
 *
 * Always creates fresh arrays and objects to
 * prevent shared mutable state between students.
 *
 * The future storage layer will persist this shape.
 */

export function createEmptyGamificationProgress({
  studentId,
  timezone = "UTC",
} = {}) {
  if (
    typeof studentId !== "string" ||
    !studentId.trim()
  ) {
    throw new Error("A valid student ID is required.");
  }

  if (
    typeof timezone !== "string" ||
    !timezone.trim()
  ) {
    throw new Error("A valid timezone is required.");
  }

  return {
    schemaVersion: GAMIFICATION_SCHEMA_VERSION,
    studentId,
    timezone,

    totalXP: 0,
    level: 1,

    // Unique reward keys prevent duplicate XP grants.
    awardedEventKeys: [],

    // Future audit-friendly reward history.
    xpTransactions: [],

    stats: {
      lessonsCompleted: 0,
      coursesCompleted: 0,
      quizzesPassed: 0,
      perfectQuizzes: 0,
      learningMinutes: 0,
    },

    streak: {
      currentDays: 0,
      longestDays: 0,
      lastActivityDate: null,
      activityDates: [],
    },

    weeklyGoal: {
      metric:
        GAMIFICATION_WEEKLY_GOAL_CONFIG
          .defaultGoal.metric,
      target:
        GAMIFICATION_WEEKLY_GOAL_CONFIG
          .defaultGoal.target,
      weekStartDate: null,
      progress: 0,
    },

    unlockedBadges: [],

    createdAt: null,
    updatedAt: null,
  };
}

/* ==========================================
   07 — MOCK STUDENT PROGRESS
========================================== */

/**
 * Development-only fixture.
 * Does not represent real student achievements.
 */

export const mockStudentGamification =
  createEmptyGamificationProgress({
    studentId: "dev-student-001",
    timezone: "Asia/Riyadh",
  });

/* ==========================================
   08 — LOCALIZATION HELPER
========================================== */

export function getGamificationText(
  value,
  language = GAMIFICATION_LOCALES.EN
) {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  const locale =
    language === GAMIFICATION_LOCALES.AR
      ? GAMIFICATION_LOCALES.AR
      : GAMIFICATION_LOCALES.EN;

  return value[locale] ?? value.en ?? "";
}
