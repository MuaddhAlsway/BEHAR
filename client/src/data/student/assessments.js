
/**
 * BEHAR LMS
 * P14.4.0.1 — Assessment Data Models
 * P14.4.0.7 — Learning Player Integration
 *
 * Frontend-only assessment fixtures.
 *
 * Responsibilities:
 * - Define assessment types
 * - Define question types
 * - Store bilingual questions
 * - Store assessment metadata
 * - Define course/lesson relationships
 *
 * No scoring, persistence, or UI logic.
 */

/* ==========================================
   QUESTION TYPES
========================================== */

export const QUESTION_TYPES = Object.freeze({
  SINGLE_CHOICE: "single_choice",
  MULTIPLE_CHOICE: "multiple_choice",
  TRUE_FALSE: "true_false",
});

/* ==========================================
   ASSESSMENT TYPES
========================================== */

export const ASSESSMENT_TYPES = Object.freeze({
  QUIZ: "quiz",
});

/* ==========================================
   ASSESSMENT QUESTIONS
========================================== */

export const assessmentQuestions = [
  /* ------------------------------------------
     QUESTION 01 — SINGLE CHOICE
  ------------------------------------------ */

  {
    id: "react-q001",
    assessmentId: "react-basics-quiz",

    type: QUESTION_TYPES.SINGLE_CHOICE,
    order: 1,
    points: 10,

    question: {
      en: "What is React primarily used for?",
      ar: "ما الاستخدام الأساسي لمكتبة React؟",
    },

    options: [
      {
        id: "a",
        text: {
          en: "Building user interfaces",
          ar: "بناء واجهات المستخدم",
        },
      },
      {
        id: "b",
        text: {
          en: "Managing databases",
          ar: "إدارة قواعد البيانات",
        },
      },
      {
        id: "c",
        text: {
          en: "Hosting servers",
          ar: "استضافة الخوادم",
        },
      },
    ],

    correctOptionIds: ["a"],

    explanation: {
      en: "React is a JavaScript library for building user interfaces.",
      ar: "React مكتبة JavaScript تُستخدم لبناء واجهات المستخدم.",
    },
  },

  /* ------------------------------------------
     QUESTION 02 — MULTIPLE CHOICE
  ------------------------------------------ */

  {
    id: "react-q002",
    assessmentId: "react-basics-quiz",

    type: QUESTION_TYPES.MULTIPLE_CHOICE,
    order: 2,
    points: 10,

    question: {
      en: "Which are common React concepts?",
      ar: "ما المفاهيم الشائعة في React؟",
    },

    options: [
      {
        id: "a",
        text: {
          en: "Components",
          ar: "المكونات",
        },
      },
      {
        id: "b",
        text: {
          en: "Props",
          ar: "الخصائص",
        },
      },
      {
        id: "c",
        text: {
          en: "SQL tables",
          ar: "جداول SQL",
        },
      },
    ],

    correctOptionIds: ["a", "b"],

    explanation: {
      en: "Components and props are fundamental React concepts.",
      ar: "المكونات والخصائص من المفاهيم الأساسية في React.",
    },
  },

  /* ------------------------------------------
     QUESTION 03 — TRUE / FALSE
  ------------------------------------------ */

  {
    id: "react-q003",
    assessmentId: "react-basics-quiz",

    type: QUESTION_TYPES.TRUE_FALSE,
    order: 3,
    points: 10,

    question: {
      en: "React components can manage state.",
      ar: "يمكن لمكونات React إدارة الحالة.",
    },

    options: [
      {
        id: "true",
        text: {
          en: "True",
          ar: "صحيح",
        },
      },
      {
        id: "false",
        text: {
          en: "False",
          ar: "خطأ",
        },
      },
    ],

    correctOptionIds: ["true"],

    explanation: {
      en: "React components can manage state using hooks such as useState.",
      ar: "يمكن لمكونات React إدارة الحالة باستخدام Hooks مثل useState.",
    },
  },
];

/* ==========================================
   ASSESSMENT DATA
========================================== */


/* ==========================================
   P14.4.0.7 — LINKED ASSESSMENT DATA
========================================== */

export const assessments = [
  {
    id: "react-basics-quiz",

    /* ======================================
       VERIFIED COURSE / LESSON RELATIONSHIP
    ====================================== */

    courseId: "course_001",
    moduleId: "module_001",
    lessonId: "lesson_002",

    linked: true,

    /* ======================================
       ASSESSMENT METADATA
    ====================================== */

    type: ASSESSMENT_TYPES.QUIZ,

    title: {
      en: "React Fundamentals Quiz",
      ar: "اختبار أساسيات React",
    },

    description: {
      en: "Test your understanding of React fundamentals.",
      ar: "اختبر فهمك لأساسيات React.",
    },

    instructions: {
      en: "Read each question carefully and select your answers.",
      ar: "اقرأ كل سؤال بعناية واختر إجاباتك.",
    },

    /* ======================================
       QUESTION REFERENCES
    ====================================== */

    questionIds: [
      "react-q001",
      "react-q002",
      "react-q003",
    ],

    /* ======================================
       ASSESSMENT SETTINGS
    ====================================== */

    settings: {
      passingScore: 70,
      timeLimitMinutes: 15,
      maxAttempts: 3,

      shuffleQuestions: false,
      shuffleOptions: false,

      showCorrectAnswers: true,
      showExplanations: true,
    },

    /* ======================================
       PUBLICATION STATUS
    ====================================== */

    published: true,
  },
];

