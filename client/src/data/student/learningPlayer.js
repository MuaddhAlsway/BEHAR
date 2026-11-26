
import { mockEnrolledCourses } from "./myLearning";

const lesson = (id, titleEn, titleAr, durationMinutes) => ({
  id,
  title: {
    en: titleEn,
    ar: titleAr,
  },
 type: "video",
  durationMinutes,

    videoUrl: "/Video.mp4",
});

const createModule = (id, titleEn, titleAr, lessons) => ({
  id,
  title: {
    en: titleEn,
    ar: titleAr,
  },
  lessons,
});

// Temporary curriculum records for UI development.
// Course identity and enrollment information come from myLearning.js.

export const mockLearningCurricula = {
  course_001: [
    createModule(
      "module_001",
      "Getting Started with React",
      "البدء باستخدام React",
      [
        lesson("lesson_001", "Welcome to the Course", "مقدمة الدورة", 8),
        lesson("lesson_002", "React Fundamentals", "أساسيات React", 16),
        lesson("lesson_003", "Components and JSX", "المكونات و JSX", 21),
        lesson("lesson_004", "Props and State", "الخصائص والحالة", 24),
      ]
    ),
    createModule(
      "module_002",
      "Building Interactive Applications",
      "بناء تطبيقات تفاعلية",
      [
        lesson("lesson_005", "Handling Events", "التعامل مع الأحداث", 18),
        lesson("lesson_006", "React Hooks", "خطافات React", 27),
        lesson("lesson_007", "Managing Effects", "إدارة التأثيرات", 22),
        {
          ...lesson("lesson_008", "Build a reusable component", "بناء مكوّن قابل لإعادة الاستخدام", 30),
          type: "assignment",
          assignmentId: "assignment-001",
        },
      ]
    ),
  ],

  course_002: [
    createModule(
      "module_001",
      "Design Foundations",
      "أساسيات التصميم",
      [
        lesson("lesson_001", "Introduction to UX", "مقدمة في تجربة المستخدم", 12),
        lesson("lesson_002", "User Research", "أبحاث المستخدمين", 22),
        lesson("lesson_003", "Information Architecture", "هندسة المعلومات", 19),
        lesson("lesson_004", "Wireframing", "التخطيط الهيكلي", 25),
        lesson("lesson_005", "Visual Hierarchy", "التسلسل البصري", 18),
        lesson("lesson_006", "Design Systems", "أنظمة التصميم", 28),
      ]
    ),
  ],

  course_003: [
    createModule(
      "module_001",
      "Backend Fundamentals",
      "أساسيات تطوير الخوادم",
      [
        lesson("lesson_001", "Backend Architecture", "هندسة الخوادم", 18),
        lesson("lesson_002", "Node.js Runtime", "بيئة تشغيل Node.js", 23),
        lesson("lesson_003", "Express Fundamentals", "أساسيات Express", 26),
        lesson("lesson_004", "REST API Design", "تصميم REST API", 31),
      ]
    ),
  ],

  course_004: [
    createModule(
      "module_001",
      "Marketing Foundations",
      "أساسيات التسويق",
      [
        lesson("lesson_001", "Introduction to Digital Marketing", "مقدمة في التسويق الرقمي", 15),
        lesson("lesson_002", "Understanding Your Audience", "فهم جمهورك", 21),
        lesson("lesson_003", "Marketing Channels", "قنوات التسويق", 24),
      ]
    ),
  ],
};

export function getLearningCourseBySlug(slug) {
  return (
    mockEnrolledCourses.find(
      (course) => course.slug === slug
    ) || null
  );
}

export function getLearningCurriculum(courseId) {
  if (mockLearningCurricula[courseId]) {
    return mockLearningCurricula[courseId];
  }

  const normalizedId = String(courseId || "").replaceAll(
    "-",
    "_"
  );

  return mockLearningCurricula[normalizedId] || [];
}

export function getLearningLesson(modules, lessonId) {
  for (const module of modules) {
    const found = module.lessons.find(
      (lessonItem) => lessonItem.id === lessonId
    );

    if (found) {
      return {
        ...found,
        moduleId: module.id,
      };
    }
  }

  return null;
}

export function getFirstLearningLesson(modules) {
  return modules[0]?.lessons[0] || null;
}

export function getAllLearningLessons(modules) {
  return modules.flatMap((module) => module.lessons);
}
