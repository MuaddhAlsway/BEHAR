
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 01
 *
 * Frontend-only calendar data and configuration.
 *
 * Academic events:
 *   - Read-only for students.
 *   - Eventually provided by the backend.
 *
 * Personal events:
 *   - Created and managed by students.
 *   - Persisted through localStorage in this phase.
 *
 * All event timestamps are ISO 8601 strings with offsets.
 * The demo event factory generates dates relative to today.
 */

export const CALENDAR_TIME_ZONE = "Asia/Riyadh";

export const CALENDAR_SOURCES = Object.freeze({
  ACADEMIC: "academic",
  PERSONAL: "personal",
});

export const CALENDAR_EVENT_TYPES = Object.freeze({
  LIVE_SESSION: "live_session",
  LESSON: "lesson",
  ASSIGNMENT: "assignment",
  QUIZ: "quiz",
  EXAM: "exam",
  DEADLINE: "deadline",
  STUDY_SESSION: "study_session",
  REMINDER: "reminder",
  STUDY_GOAL: "study_goal",
  PERSONAL_TASK: "personal_task",
});

export const CALENDAR_EVENT_STATUS = Object.freeze({
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

export const CALENDAR_EVENT_PRIORITY = Object.freeze({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
});

export const CALENDAR_VIEWS = Object.freeze({
  MONTH: "month",
  WEEK: "week",
  DAY: "day",
});

export const CALENDAR_FILTERS = Object.freeze({
  ALL: "all",
  ACADEMIC: "academic",
  PERSONAL: "personal",
  LIVE_SESSIONS: "live_sessions",
  ASSIGNMENTS: "assignments",
  ASSESSMENTS: "assessments",
});

export const CALENDAR_WEEK_START = 0; // Sunday

export const CALENDAR_LIMITS = Object.freeze({
  TITLE_MAX_LENGTH: 120,
  DESCRIPTION_MAX_LENGTH: 2000,
  LOCATION_MAX_LENGTH: 250,
  MAX_PERSONAL_EVENTS: 500,
  MAX_EVENT_DURATION_DAYS: 30,
});

export const CALENDAR_EVENT_META = Object.freeze({
  [CALENDAR_EVENT_TYPES.LIVE_SESSION]: {
    label: "Live Session",
    labelAr: "جلسة مباشرة",
    color: "#397A5A",
    icon: "video",
    source: CALENDAR_SOURCES.ACADEMIC,
  },
  [CALENDAR_EVENT_TYPES.LESSON]: {
    label: "Lesson",
    labelAr: "درس",
    color: "#527F89",
    icon: "book-open",
    source: CALENDAR_SOURCES.ACADEMIC,
  },
  [CALENDAR_EVENT_TYPES.ASSIGNMENT]: {
    label: "Assignment",
    labelAr: "واجب",
    color: "#B97845",
    icon: "clipboard-list",
    source: CALENDAR_SOURCES.ACADEMIC,
  },
  [CALENDAR_EVENT_TYPES.QUIZ]: {
    label: "Quiz",
    labelAr: "اختبار قصير",
    color: "#8A69B1",
    icon: "list-checks",
    source: CALENDAR_SOURCES.ACADEMIC,
  },
  [CALENDAR_EVENT_TYPES.EXAM]: {
    label: "Exam",
    labelAr: "اختبار",
    color: "#AD565A",
    icon: "graduation-cap",
    source: CALENDAR_SOURCES.ACADEMIC,
  },
  [CALENDAR_EVENT_TYPES.DEADLINE]: {
    label: "Deadline",
    labelAr: "موعد نهائي",
    color: "#C18A35",
    icon: "clock-alert",
    source: CALENDAR_SOURCES.ACADEMIC,
  },
  [CALENDAR_EVENT_TYPES.STUDY_SESSION]: {
    label: "Study Session",
    labelAr: "جلسة مذاكرة",
    color: "#6D8950",
    icon: "book-open-check",
    source: CALENDAR_SOURCES.PERSONAL,
  },
  [CALENDAR_EVENT_TYPES.REMINDER]: {
    label: "Reminder",
    labelAr: "تذكير",
    color: "#5882B6",
    icon: "bell",
    source: CALENDAR_SOURCES.PERSONAL,
  },
  [CALENDAR_EVENT_TYPES.STUDY_GOAL]: {
    label: "Study Goal",
    labelAr: "هدف دراسي",
    color: "#9B77A6",
    icon: "target",
    source: CALENDAR_SOURCES.PERSONAL,
  },
  [CALENDAR_EVENT_TYPES.PERSONAL_TASK]: {
    label: "Personal Task",
    labelAr: "مهمة شخصية",
    color: "#817E74",
    icon: "check-square",
    source: CALENDAR_SOURCES.PERSONAL,
  },
});

export const CALENDAR_SOURCE_META = Object.freeze({
  [CALENDAR_SOURCES.ACADEMIC]: {
    label: "Academic",
    labelAr: "أكاديمي",
    description: "Events scheduled by your courses and instructors.",
    descriptionAr: "فعاليات مجدولة من دوراتك ومدربيك.",
  },
  [CALENDAR_SOURCES.PERSONAL]: {
    label: "Personal",
    labelAr: "شخصي",
    description: "Your own study sessions, goals, and reminders.",
    descriptionAr: "جلسات المذاكرة والأهداف والتذكيرات الخاصة بك.",
  },
});

export const CALENDAR_FILTER_OPTIONS = Object.freeze([
  {
    value: CALENDAR_FILTERS.ALL,
    label: "All Events",
    labelAr: "جميع الفعاليات",
  },
  {
    value: CALENDAR_FILTERS.ACADEMIC,
    label: "Academic",
    labelAr: "أكاديمي",
  },
  {
    value: CALENDAR_FILTERS.PERSONAL,
    label: "Personal",
    labelAr: "شخصي",
  },
  {
    value: CALENDAR_FILTERS.LIVE_SESSIONS,
    label: "Live Sessions",
    labelAr: "الجلسات المباشرة",
  },
  {
    value: CALENDAR_FILTERS.ASSIGNMENTS,
    label: "Assignments",
    labelAr: "الواجبات",
  },
  {
    value: CALENDAR_FILTERS.ASSESSMENTS,
    label: "Quizzes & Exams",
    labelAr: "الاختبارات",
  },
]);

export const PERSONAL_EVENT_TYPES = Object.freeze([
  CALENDAR_EVENT_TYPES.STUDY_SESSION,
  CALENDAR_EVENT_TYPES.REMINDER,
  CALENDAR_EVENT_TYPES.STUDY_GOAL,
  CALENDAR_EVENT_TYPES.PERSONAL_TASK,
]);

export const ACADEMIC_EVENT_TYPES = Object.freeze([
  CALENDAR_EVENT_TYPES.LIVE_SESSION,
  CALENDAR_EVENT_TYPES.LESSON,
  CALENDAR_EVENT_TYPES.ASSIGNMENT,
  CALENDAR_EVENT_TYPES.QUIZ,
  CALENDAR_EVENT_TYPES.EXAM,
  CALENDAR_EVENT_TYPES.DEADLINE,
]);

export const CALENDAR_PERSONAL_TYPE_OPTIONS = Object.freeze(
  PERSONAL_EVENT_TYPES.map((type) => ({
    value: type,
    label: CALENDAR_EVENT_META[type].label,
    labelAr: CALENDAR_EVENT_META[type].labelAr,
  }))
);

export const CALENDAR_PRIORITY_OPTIONS = Object.freeze([
  {
    value: CALENDAR_EVENT_PRIORITY.LOW,
    label: "Low",
    labelAr: "منخفضة",
  },
  {
    value: CALENDAR_EVENT_PRIORITY.MEDIUM,
    label: "Medium",
    labelAr: "متوسطة",
  },
  {
    value: CALENDAR_EVENT_PRIORITY.HIGH,
    label: "High",
    labelAr: "مرتفعة",
  },
]);

export const CALENDAR_VIEW_OPTIONS = Object.freeze([
  {
    value: CALENDAR_VIEWS.MONTH,
    label: "Month",
    labelAr: "شهر",
  },
  {
    value: CALENDAR_VIEWS.WEEK,
    label: "Week",
    labelAr: "أسبوع",
  },
  {
    value: CALENDAR_VIEWS.DAY,
    label: "Day",
    labelAr: "يوم",
  },
]);

/**
 * Demo course references.
 *
 * These are display references, not authoritative enrollment
 * records. Backend course IDs can replace them later.
 */
export const CALENDAR_DEMO_COURSES = Object.freeze([
  {
    id: "course-modern-react",
    slug: "modern-react-development",
    title: "Modern React Development",
    titleAr: "تطوير React الحديث",
    instructorId: "instructor-001",
    instructorName: "Nora Alharbi",
    instructorNameAr: "نورة الحربي",
  },
  {
    id: "course-ui-ux",
    slug: "ui-ux-design-fundamentals",
    title: "UI/UX Design Fundamentals",
    titleAr: "أساسيات تصميم واجهات وتجربة المستخدم",
    instructorId: "instructor-002",
    instructorName: "Omar Khalid",
    instructorNameAr: "عمر خالد",
  },
  {
    id: "course-javascript",
    slug: "javascript-mastery",
    title: "JavaScript Mastery",
    titleAr: "إتقان JavaScript",
    instructorId: "instructor-003",
    instructorName: "Youssef Salem",
    instructorNameAr: "يوسف سالم",
  },
]);

/**
 * Calendar event schema:
 *
 * {
 *   id: string,
 *   source: "academic" | "personal",
 *   type: CALENDAR_EVENT_TYPES value,
 *   title: string,
 *   titleAr: string,
 *   description: string,
 *   descriptionAr: string,
 *   startAt: ISO 8601 string,
 *   endAt: ISO 8601 string,
 *   allDay: boolean,
 *   timeZone: IANA time zone string,
 *   status: CALENDAR_EVENT_STATUS value,
 *   priority: CALENDAR_EVENT_PRIORITY value,
 *   courseId: string | null,
 *   instructorId: string | null,
 *   location: string | null,
 *   meetingUrl: string | null,
 *   relatedUrl: string | null,
 *   reminderMinutes: number | null,
 *   editable: boolean,
 *   createdAt: ISO 8601 string | null,
 *   updatedAt: ISO 8601 string | null
 * }
 *
 * Academic events must never be editable by students.
 */

/**
 * Generate a calendar date relative to a supplied reference date.
 *
 * This helper intentionally uses the viewer's local calendar.
 * Later, calendarDates.js will centralize timezone-aware
 * calendar calculations.
 */
function relativeDate(
  referenceDate,
  dayOffset,
  hour = 10,
  minute = 0
) {
  const date = new Date(referenceDate);

  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);

  return date.toISOString();
}

/**
 * Create read-only academic demo events.
 *
 * Pass a fixed referenceDate in tests for deterministic output.
 * In the application, call without arguments to generate
 * events around the current date.
 *
 * Note: toISOString() produces UTC timestamps representing
 * the chosen local time. Event display must use the selected
 * calendar timezone consistently.
 */
export function createAcademicDemoEvents(
  referenceDate = new Date()
) {
  const now = new Date(referenceDate);

  if (Number.isNaN(now.getTime())) {
    throw new TypeError("Invalid calendar reference date");
  }

  const events = [
    {
      id: "academic-live-react",
      type: CALENDAR_EVENT_TYPES.LIVE_SESSION,
      title: "Building Scalable React Applications",
      titleAr: "بناء تطبيقات React قابلة للتوسع",
      description:
        "Join a live session covering React architecture, reusable components, and application state.",
      descriptionAr:
        "انضم إلى جلسة مباشرة حول بنية React والمكونات القابلة لإعادة الاستخدام وإدارة حالة التطبيق.",
      startAt: relativeDate(now, 1, 18, 0),
      endAt: relativeDate(now, 1, 19, 30),
      courseId: "course-modern-react",
      instructorId: "instructor-001",
      location: "Online",
      meetingUrl: null,
      relatedUrl: "/courses/modern-react-development",
    },
    {
      id: "academic-assignment-react",
      type: CALENDAR_EVENT_TYPES.ASSIGNMENT,
      title: "React Component Architecture Assignment",
      titleAr: "واجب بنية مكونات React",
      description:
        "Submit your component architecture assignment before the deadline.",
      descriptionAr:
        "سلّم واجب بنية المكونات قبل الموعد النهائي.",
      startAt: relativeDate(now, 3, 23, 0),
      endAt: relativeDate(now, 3, 23, 59),
      courseId: "course-modern-react",
      instructorId: "instructor-001",
      location: null,
      meetingUrl: null,
      relatedUrl: "/student/assignments",
    },
    {
      id: "academic-quiz-js",
      type: CALENDAR_EVENT_TYPES.QUIZ,
      title: "JavaScript Fundamentals Quiz",
      titleAr: "اختبار أساسيات JavaScript",
      description:
        "Review closures, scope, asynchronous JavaScript, and promises.",
      descriptionAr:
        "راجع الإغلاقات والنطاق والبرمجة غير المتزامنة والوعود في JavaScript.",
      startAt: relativeDate(now, 5, 15, 0),
      endAt: relativeDate(now, 5, 15, 45),
      courseId: "course-javascript",
      instructorId: "instructor-003",
      location: "Online",
      meetingUrl: null,
      relatedUrl: "/courses/javascript-mastery",
    },
    {
      id: "academic-lesson-uiux",
      type: CALENDAR_EVENT_TYPES.LESSON,
      title: "Design Systems and Visual Hierarchy",
      titleAr: "أنظمة التصميم والتسلسل الهرمي البصري",
      description:
        "Explore design tokens, component consistency, typography, and visual hierarchy.",
      descriptionAr:
        "تعرّف على رموز التصميم واتساق المكونات والخطوط والتسلسل الهرمي البصري.",
      startAt: relativeDate(now, 7, 17, 0),
      endAt: relativeDate(now, 7, 18, 0),
      courseId: "course-ui-ux",
      instructorId: "instructor-002",
      location: "Online",
      meetingUrl: null,
      relatedUrl: "/courses/ui-ux-design-fundamentals",
    },
    {
      id: "academic-exam-js",
      type: CALENDAR_EVENT_TYPES.EXAM,
      title: "JavaScript Module Examination",
      titleAr: "الاختبار النهائي لوحدة JavaScript",
      description:
        "Complete the module assessment within the scheduled examination window.",
      descriptionAr:
        "أكمل تقييم الوحدة خلال الفترة المحددة للاختبار.",
      startAt: relativeDate(now, 10, 14, 0),
      endAt: relativeDate(now, 10, 15, 30),
      courseId: "course-javascript",
      instructorId: "instructor-003",
      location: "Online",
      meetingUrl: null,
      relatedUrl: "/courses/javascript-mastery",
    },
    {
      id: "academic-live-uiux",
      type: CALENDAR_EVENT_TYPES.LIVE_SESSION,
      title: "UI/UX Portfolio Review",
      titleAr: "مراجعة معرض أعمال UI/UX",
      description:
        "Join an instructor-led portfolio review and feedback session.",
      descriptionAr:
        "انضم إلى جلسة مراجعة معرض الأعمال والحصول على ملاحظات المدرب.",
      startAt: relativeDate(now, 12, 19, 0),
      endAt: relativeDate(now, 12, 20, 0),
      courseId: "course-ui-ux",
      instructorId: "instructor-002",
      location: "Online",
      meetingUrl: null,
      relatedUrl: "/courses/ui-ux-design-fundamentals",
    },
    {
      id: "academic-deadline-uiux",
      type: CALENDAR_EVENT_TYPES.DEADLINE,
      title: "UI/UX Case Study Submission",
      titleAr: "الموعد النهائي لتسليم دراسة حالة UI/UX",
      description:
        "Submit your completed UI/UX case study.",
      descriptionAr:
        "سلّم دراسة الحالة المكتملة في تصميم واجهات وتجربة المستخدم.",
      startAt: relativeDate(now, 14, 23, 0),
      endAt: relativeDate(now, 14, 23, 59),
      courseId: "course-ui-ux",
      instructorId: "instructor-002",
      location: null,
      meetingUrl: null,
      relatedUrl: "/student/assignments",
    },
    {
      id: "academic-past-lesson",
      type: CALENDAR_EVENT_TYPES.LESSON,
      title: "Introduction to React Hooks",
      titleAr: "مقدمة إلى React Hooks",
      description:
        "Previously scheduled lesson covering useState and useEffect.",
      descriptionAr:
        "درس سابق حول useState وuseEffect.",
      startAt: relativeDate(now, -3, 16, 0),
      endAt: relativeDate(now, -3, 17, 0),
      courseId: "course-modern-react",
      instructorId: "instructor-001",
      location: "Online",
      meetingUrl: null,
      relatedUrl: "/courses/modern-react-development",
      status: CALENDAR_EVENT_STATUS.COMPLETED,
    },
  ];

  return events.map((event) => ({
    id: event.id,
    source: CALENDAR_SOURCES.ACADEMIC,
    type: event.type,
    title: event.title,
    titleAr: event.titleAr,
    description: event.description,
    descriptionAr: event.descriptionAr,
    startAt: event.startAt,
    endAt: event.endAt,
    allDay: false,
    timeZone: CALENDAR_TIME_ZONE,
    status:
      event.status ?? CALENDAR_EVENT_STATUS.SCHEDULED,
    priority: CALENDAR_EVENT_PRIORITY.MEDIUM,
    courseId: event.courseId,
    instructorId: event.instructorId,
    location: event.location,
    meetingUrl: event.meetingUrl,
    relatedUrl: event.relatedUrl,
    reminderMinutes: null,
    editable: false,
    createdAt: null,
    updatedAt: null,
  }));
}

/**
 * Create a blank personal event.
 *
 * The form will populate title, dates, type, and optional
 * properties. IDs and timestamps are assigned when saving
 * through CalendarContext.
 */
export function createPersonalEventDraft() {
  return {
    source: CALENDAR_SOURCES.PERSONAL,
    type: CALENDAR_EVENT_TYPES.STUDY_SESSION,
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: "",
    startAt: "",
    endAt: "",
    allDay: false,
    timeZone: CALENDAR_TIME_ZONE,
    status: CALENDAR_EVENT_STATUS.SCHEDULED,
    priority: CALENDAR_EVENT_PRIORITY.MEDIUM,
    courseId: null,
    instructorId: null,
    location: null,
    meetingUrl: null,
    relatedUrl: null,
    reminderMinutes: null,
    editable: true,
  };
}

/**
 * Resolve an event's localized title.
 */
export function getCalendarEventTitle(
  event,
  language = "en"
) {
  if (!event) return "";

  return language === "ar"
    ? event.titleAr || event.title || ""
    : event.title || event.titleAr || "";
}

/**
 * Resolve an event's localized description.
 */
export function getCalendarEventDescription(
  event,
  language = "en"
) {
  if (!event) return "";

  return language === "ar"
    ? event.descriptionAr || event.description || ""
    : event.description || event.descriptionAr || "";
}

/**
 * Find demo course metadata by ID.
 */
export function getCalendarCourseById(courseId) {
  if (!courseId) return null;

  return (
    CALENDAR_DEMO_COURSES.find(
      (course) => course.id === courseId
    ) ?? null
  );
}

/**
 * Student edit permissions.
 *
 * Academic events are never editable.
 * Do not trust the editable field alone.
 */
export function canEditCalendarEvent(event) {
  return Boolean(
    event &&
      event.source === CALENDAR_SOURCES.PERSONAL &&
      PERSONAL_EVENT_TYPES.includes(event.type) &&
      event.editable === true
  );
}

export function canDeleteCalendarEvent(event) {
  return canEditCalendarEvent(event);
}

/**
 * Get event type presentation metadata.
 */
export function getCalendarEventMeta(type) {
  return CALENDAR_EVENT_META[type] ?? null;
}

/**
 * Generate initial academic demo events once per app session.
 *
 * Prefer calling createAcademicDemoEvents() from the
 * CalendarProvider initializer rather than importing
 * a constantly regenerated event array.
 */
