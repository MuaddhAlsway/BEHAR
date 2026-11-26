
/**
 * BEHAR LMS
 * P14.8.8 — Shared Assignment Data
 *
 * Used by:
 * - Student Assignments Page
 * - Learning Player
 * - Assignment Details
 * - Submission History
 * - Instructor Feedback
 *
 * Frontend-only implementation.
 * Backend integration will replace localStorage later.
 */

const localized = (en, ar) => ({ en, ar });

export const ASSIGNMENT_STORAGE_KEY =
  "behar:student-assignments:v1";

export const ASSIGNMENTS_UPDATED_EVENT =
  "behar:assignments-updated";

/* ==========================================
   01 — ASSIGNMENT DATA
========================================== */

export const baseAssignments = [
  {
    id: "assignment-001",
    courseId: "course-001",
    lessonId: "react-lesson-08",

    title: localized(
      "Build a reusable component",
      "بناء مكوّن قابل لإعادة الاستخدام"
    ),

    instructor: "Omar Khalid",

    dueDate: "2026-12-02",
    status: "pending",
    points: 100,

    description: localized(
      "Create a reusable React component with clear props and accessible states.",
      "أنشئ مكوّناً قابلاً لإعادة الاستخدام مع خصائص واضحة وحالات سهلة الوصول."
    ),
  },

  {
    id: "assignment-002",
    courseId: "course-002",

    title: localized(
      "Visual identity moodboard",
      "لوحة إلهام للهوية البصرية"
    ),

    instructor: "Nora Alharbi",

    dueDate: "2026-11-28",
    status: "submitted",
    points: 80,

    description: localized(
      "Translate a brand direction into a focused visual moodboard.",
      "حوّل توجه العلامة التجارية إلى لوحة إلهام بصرية مركزة."
    ),
  },

  {
    id: "assignment-003",
    courseId: "course-005",

    title: localized(
      "Marketing campaign brief",
      "موجز حملة تسويقية"
    ),

    instructor: "Layla Haddad",

    dueDate: "2026-11-20",
    status: "graded",
    points: 100,
    grade: "92 / 100",

    description: localized(
      "Write a concise campaign brief with audience, message, and channels.",
      "اكتب موجزاً لحملة يتضمن الجمهور والرسالة والقنوات."
    ),
  },

  {
    id: "assignment-004",
    courseId: "course-004",

    title: localized(
      "AI creative workflow",
      "سير عمل إبداعي بالذكاء الاصطناعي"
    ),

    instructor: "Youssef Salem",

    dueDate: "2026-12-10",
    status: "pending",
    points: 120,

    description: localized(
      "Map a responsible AI workflow for a creative project.",
      "صمّم سير عمل مسؤولاً للذكاء الاصطناعي في مشروع إبداعي."
    ),
  },

  {
    id: "assignment-005",
    courseId: "course-001",
    lessonId: "react-lesson-12",

    title: localized(
      "Interactive UI Challenge",
      "تحدي الواجهات التفاعلية"
    ),

    instructor: "Omar Khalid",

    dueDate: "2026-12-15",
    status: "pending",
    points: 100,

    description: localized(
      "Build an interactive React interface using state, event handlers, and reusable components.",
      "ابنِ واجهة React تفاعلية باستخدام الحالة ومعالجات الأحداث والمكونات القابلة لإعادة الاستخدام."
    ),
  },

  {
    id: "assignment-006",
    courseId: "course-001",
    lessonId: "react-lesson-19",

    title: localized(
      "Final React Project",
      "مشروع React النهائي"
    ),

    instructor: "Omar Khalid",

    dueDate: "2026-12-30",
    status: "pending",
    points: 200,

    description: localized(
      "Build and submit a complete React application demonstrating component architecture, routing, state management, and API integration.",
      "ابنِ وسلّم تطبيق React متكاملاً يوضح بنية المكونات وإدارة الحالة والمسارات وربط واجهات API."
    ),
  },
];

/* ==========================================
   02 — LOCALIZATION
========================================== */

export function getLocalizedText(
  value,
  language = "en"
) {
  if (typeof value === "string") {
    return value;
  }

  return value?.[language] ?? value?.en ?? "";
}

/* ==========================================
   03 — DEADLINE UTILITIES
========================================== */

export function getAssignmentDeadline(dueDate) {
  if (!dueDate) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    const [year, month, day] = dueDate
      .split("-")
      .map(Number);

    const date = new Date(
      year,
      month - 1,
      day,
      23,
      59,
      59,
      999
    );

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }

  const date = new Date(dueDate);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

export function isAssignmentOverdue(
  assignment,
  now = new Date()
) {
  if (!assignment) return false;

  const deadline = getAssignmentDeadline(
    assignment.dueDate
  );

  if (!deadline) return false;

  return now.getTime() > deadline.getTime();
}

/* ==========================================
   04 — LOCAL STORAGE
========================================== */

export function readAssignmentSubmissions() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(
      ASSIGNMENT_STORAGE_KEY
    );

    if (!raw) return {};

    const parsed = JSON.parse(raw);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
}

/* ==========================================
   05 — SUBMISSION HISTORY
========================================== */

export function normalizeSubmissionHistory(
  saved,
  assignmentId
) {
  if (Array.isArray(saved?.submissions)) {
    return saved.submissions;
  }

  if (!saved?.submittedAt) {
    return [];
  }

  return [
    {
      id: `${assignmentId}-legacy`,
      text: saved.note ?? "",
      link: saved.projectUrl ?? "",
      submittedAt: saved.submittedAt,
      status: "submitted",
    },
  ];
}

/* ==========================================
   06 — MERGE ASSIGNMENT DATA
========================================== */

export function mergeAssignmentSubmissions(
  assignments = baseAssignments,
  submissions = readAssignmentSubmissions()
) {
  return assignments.map((assignment) => {
    const saved = submissions[assignment.id];

    if (
      assignment.status === "graded" ||
      !saved ||
      typeof saved !== "object" ||
      saved.status !== "submitted" ||
      typeof saved.note !== "string" ||
      !saved.note.trim()
    ) {
      return assignment;
    }

    return {
      ...assignment,

      status: "submitted",

      note: saved.note,

      projectUrl:
        typeof saved.projectUrl === "string"
          ? saved.projectUrl
          : "",

      submittedAt:
        typeof saved.submittedAt === "string"
          ? saved.submittedAt
          : null,

      submissions: normalizeSubmissionHistory(
        saved,
        assignment.id
      ),
    };
  });
}

/* ==========================================
   07 — GET ASSIGNMENTS
========================================== */

export function getAssignments() {
  return mergeAssignmentSubmissions();
}

export function getAssignmentById(
  assignmentId,
  assignments = getAssignments()
) {
  return (
    assignments.find(
      (assignment) =>
        assignment.id === assignmentId
    ) ?? null
  );
}

export function getAssignmentsByCourse(
  courseId,
  assignments = getAssignments()
) {
  return assignments.filter(
    (assignment) =>
      String(assignment.courseId) ===
      String(courseId)
  );
}

/* ==========================================
   08 — LEARNING PLAYER INTEGRATION
========================================== */

export function findLessonAssignment({
  assignmentId,
  courseId,
  lessonId,
  assignments = getAssignments(),
}) {
  if (!courseId) return null;

  if (!assignmentId && !lessonId) {
    return null;
  }

  return (
    assignments.find((assignment) => {
      if (
        String(assignment.courseId) !==
        String(courseId)
      ) {
        return false;
      }

      if (assignmentId) {
        return (
          assignment.id === assignmentId
        );
      }

      return (
        assignment.lessonId === lessonId
      );
    }) ?? null
  );
}

/* ==========================================
   09 — VALIDATION
========================================== */

export function validateAssignmentSubmission(
  assignment,
  submission
) {
  if (!assignment) {
    return {
      ok: false,
      reason: "not_found",
    };
  }

  if (assignment.status !== "pending") {
    return {
      ok: false,
      reason: "not_available",
    };
  }

  if (isAssignmentOverdue(assignment)) {
    return {
      ok: false,
      reason: "overdue",
    };
  }

  const note =
    typeof submission?.text === "string"
      ? submission.text.trim()
      : "";

  if (!note) {
    return {
      ok: false,
      reason: "note_required",
    };
  }

  const projectUrl =
    typeof submission?.link === "string"
      ? submission.link.trim()
      : "";

  if (projectUrl) {
    try {
      const url = new URL(projectUrl);

      if (
        url.protocol !== "https:" ||
        !url.hostname
      ) {
        return {
          ok: false,
          reason: "invalid_url",
        };
      }
    } catch {
      return {
        ok: false,
        reason: "invalid_url",
      };
    }
  }

  return {
    ok: true,
    note,
    projectUrl,
  };
}

/* ==========================================
   10 — SAVE SUBMISSION
========================================== */

export function saveAssignmentSubmission(
  assignmentId,
  submission
) {
  if (typeof window === "undefined") {
    return {
      ok: false,
      reason: "browser_required",
    };
  }

  const assignment = baseAssignments.find(
    (item) => item.id === assignmentId
  );

  const validation =
    validateAssignmentSubmission(
      assignment,
      submission
    );

  if (!validation.ok) {
    return validation;
  }

  const previous = readAssignmentSubmissions();

  if (
    previous[assignmentId]?.status ===
    "submitted"
  ) {
    return {
      ok: false,
      reason: "already_submitted",
    };
  }

  const submittedAt = new Date().toISOString();

  const submissionId =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${assignmentId}-${Date.now()}`;

  const record = {
    id: submissionId,
    text: validation.note,
    link: validation.projectUrl,
    submittedAt,
    status: "submitted",
  };

  const existingHistory =
    normalizeSubmissionHistory(
      previous[assignmentId],
      assignmentId
    );

  const next = {
    ...previous,

    [assignmentId]: {
      status: "submitted",
      note: validation.note,
      projectUrl: validation.projectUrl,
      submittedAt,

      submissions: [
        ...existingHistory,
        record,
      ],
    },
  };

  try {
    window.localStorage.setItem(
      ASSIGNMENT_STORAGE_KEY,
      JSON.stringify(next)
    );
  } catch {
    return {
      ok: false,
      reason: "storage_failed",
    };
  }

  window.dispatchEvent(
    new CustomEvent(
      ASSIGNMENTS_UPDATED_EVENT,
      {
        detail: {
          assignmentId,
          status: "submitted",
        },
      }
    )
  );

  return {
    ok: true,
    assignmentId,
    submission: record,
  };
}

/* ==========================================
   11 — ASSIGNMENT STATISTICS
========================================== */

export function getAssignmentStats(
  assignments = getAssignments()
) {
  return {
    total: assignments.length,

    pending: assignments.filter(
      (assignment) =>
        assignment.status === "pending"
    ).length,

    submitted: assignments.filter(
      (assignment) =>
        assignment.status === "submitted"
    ).length,

    underReview: assignments.filter(
      (assignment) =>
        assignment.status === "under_review"
    ).length,

    graded: assignments.filter(
      (assignment) =>
        assignment.status === "graded"
    ).length,
  };
}
