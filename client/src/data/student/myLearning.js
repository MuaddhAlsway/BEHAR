/**
 * BEHAR — Student My Learning Mock Data
 *
 * Catalog metadata comes from the public course dataset. Enrollment records
 * contain only student-specific state so titles, slugs, and instructors cannot
 * drift away from the public course details route.
 */

import { courses as catalogCourses } from "../courses";

export const mockMyLearningStudent = {
  id: "student_001",
  firstName: "Alex",
  enrolledCourses: 4,
  completedCourses: 1,
  totalStudyHours: 42,
};

const categoryLabels = {
  development: { en: "Development", ar: "البرمجة والتطوير" },
  design: { en: "Design", ar: "التصميم" },
  business: { en: "Business", ar: "الأعمال" },
  "artificial-intelligence": {
    en: "Artificial Intelligence",
    ar: "الذكاء الاصطناعي",
  },
  marketing: { en: "Marketing", ar: "التسويق" },
  photography: { en: "Photography", ar: "التصوير" },
};

const enrollmentRecords = [
  {
    id: "enrollment_001",
    courseId: "course-001",
    progress: 62,
    completedLessons: 8,
    totalLessons: 13,
    durationHours: 24,
    status: "in_progress",
    enrolledAt: "2026-11-02T10:00:00Z",
    lastAccessedAt: "2026-11-23T14:30:00Z",
    completedAt: null,
    nextLessonId: "lesson_008",
  },
  {
    id: "enrollment_002",
    courseId: "course-003",
    progress: 35,
    completedLessons: 5,
    totalLessons: 14,
    durationHours: 18,
    status: "in_progress",
    enrolledAt: "2026-11-05T12:00:00Z",
    lastAccessedAt: "2026-11-21T10:15:00Z",
    completedAt: null,
    nextLessonId: "lesson_006",
  },
  {
    id: "enrollment_003",
    courseId: "course-002",
    progress: 18,
    completedLessons: 3,
    totalLessons: 17,
    durationHours: 32,
    status: "in_progress",
    enrolledAt: "2026-11-10T09:00:00Z",
    lastAccessedAt: "2026-11-19T09:00:00Z",
    completedAt: null,
    nextLessonId: "lesson_004",
  },
  {
    id: "enrollment_004",
    courseId: "course-008",
    progress: 0,
    completedLessons: 0,
    totalLessons: 12,
    durationHours: 16,
    status: "not_started",
    enrolledAt: "2026-11-15T11:00:00Z",
    lastAccessedAt: null,
    completedAt: null,
    nextLessonId: "lesson_001",
  },
];

function toEnrolledCourse(enrollment) {
  const catalogCourse = catalogCourses.find(
    (course) => course.id === enrollment.courseId
  );

  if (!catalogCourse) return null;

  return {
    ...enrollment,
    courseId: catalogCourse.id,
    slug: catalogCourse.slug,
    title: catalogCourse.title,
    category: categoryLabels[catalogCourse.category] || {
      en: catalogCourse.category,
      ar: catalogCourse.category,
    },
    instructor: {
      name: catalogCourse.instructor,
      avatar: null,
    },
  };
}

export const mockEnrolledCourses = enrollmentRecords
  .map(toEnrolledCourse)
  .filter(Boolean);

export const mockMyLearning = {
  student: mockMyLearningStudent,
  courses: mockEnrolledCourses,
};

export default mockMyLearning;
