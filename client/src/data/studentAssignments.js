
export const ASSIGNMENT_STORAGE_KEY =
  "behar:student-assignments:v1";

export const baseAssignments = [
  {
    id: "assignment-001",
    title: {
      en: "Build a reusable component",
      ar: "بناء مكوّن قابل لإعادة الاستخدام",
    },
    courseId: "course-001",
    instructor: "Omar Khalid",
    dueDate: "2026-12-02",
    status: "pending",
    points: 100,
    description: {
      en: "Create a reusable React component with clear props and accessible states.",
      ar: "أنشئ مكوّناً قابلاً لإعادة الاستخدام مع خصائص واضحة وحالات سهلة الوصول.",
    },
  },
  {
    id: "assignment-002",
    title: {
      en: "Visual identity moodboard",
      ar: "لوحة إلهام للهوية البصرية",
    },
    courseId: "course-002",
    instructor: "Nora Alharbi",
    dueDate: "2026-11-28",
    status: "submitted",
    points: 80,
    description: {
      en: "Translate a brand direction into a focused visual moodboard.",
      ar: "حوّل توجه العلامة التجارية إلى لوحة إلهام بصرية مركزة.",
    },
  },
  {
    id: "assignment-003",
    title: {
      en: "Marketing campaign brief",
      ar: "موجز حملة تسويقية",
    },
    courseId: "course-005",
    instructor: "Layla Haddad",
    dueDate: "2026-11-20",
    status: "graded",
    points: 100,
    grade: "92 / 100",
    description: {
      en: "Write a concise campaign brief with audience, message, and channels.",
      ar: "اكتب موجزاً لحملة يتضمن الجمهور والرسالة والقنوات.",
    },
  },
  {
    id: "assignment-004",
    title: {
      en: "AI creative workflow",
      ar: "سير عمل إبداعي بالذكاء الاصطناعي",
    },
    courseId: "course-004",
    instructor: "Youssef Salem",
    dueDate: "2026-12-10",
    status: "pending",
    points: 120,
    description: {
      en: "Map a responsible AI workflow for a creative project.",
      ar: "صمّم سير عمل مسؤولاً للذكاء الاصطناعي في مشروع إبداعي.",
    },
  },
];

export function readAssignmentSubmissions() {
  if (typeof window === "undefined") return {};

  try {
    const value = JSON.parse(
      window.localStorage.getItem(
        ASSIGNMENT_STORAGE_KEY
      ) || "{}"
    );

    return value &&
      typeof value === "object" &&
      !Array.isArray(value)
      ? value
      : {};
  } catch {
    return {};
  }
}

export function mergeAssignmentSubmissions(
  assignments = baseAssignments,
  submissions = readAssignmentSubmissions()
) {
  return assignments.map((assignment) => {
    const saved = submissions[assignment.id];

    if (
      assignment.status === "graded" ||
      !saved ||
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
      projectUrl: saved.projectUrl ?? "",
      submittedAt: saved.submittedAt ?? null,
      submissions: Array.isArray(saved.submissions)
        ? saved.submissions
        : saved.submittedAt
          ? [{
              id: `${assignment.id}-legacy`,
              text: saved.note,
              link: saved.projectUrl ?? "",
              submittedAt: saved.submittedAt,
              status: "submitted",
            }]
          : [],
    };
  });
}

export function saveAssignmentSubmission(
  assignmentId,
  submission
) {
  const assignment = baseAssignments.find(
    (item) => item.id === assignmentId
  );

  if (!assignment || assignment.status !== "pending") {
    return { ok: false, reason: "not_available" };
  }

  const note = submission?.text?.trim();

  if (!note) {
    return { ok: false, reason: "note_required" };
  }

  const projectUrl = submission?.link?.trim() ?? "";

  if (projectUrl) {
    try {
      if (new URL(projectUrl).protocol !== "https:") {
        return { ok: false, reason: "invalid_url" };
      }
    } catch {
      return { ok: false, reason: "invalid_url" };
    }
  }

  if (assignment.dueDate) {
    const deadline = new Date(
      `${assignment.dueDate}T23:59:59.999`
    );

    if (Date.now() > deadline.getTime()) {
      return { ok: false, reason: "overdue" };
    }
  }

  const previous = readAssignmentSubmissions();

  if (previous[assignmentId]?.status === "submitted") {
    return { ok: false, reason: "already_submitted" };
  }

  const submittedAt = new Date().toISOString();

  const record = {
    id: crypto.randomUUID(),
    text: note,
    link: projectUrl,
    submittedAt,
    status: "submitted",
  };

  const next = {
    ...previous,
    [assignmentId]: {
      status: "submitted",
      note,
      projectUrl,
      submittedAt,
      submissions: [record],
    },
  };

  try {
    window.localStorage.setItem(
      ASSIGNMENT_STORAGE_KEY,
      JSON.stringify(next)
    );

    window.dispatchEvent(
      new CustomEvent("behar:assignments-updated")
    );

    return { ok: true, assignmentId };
  } catch {
    return { ok: false, reason: "storage_failed" };
  }
}

export function findLessonAssignment({
  assignmentId,
  courseId,
  lessonId,
  assignments = baseAssignments,
}) {
  if (!assignmentId && !lessonId) return null;

  return assignments.find((assignment) => {
    if (String(assignment.courseId) !== String(courseId)) {
      return false;
    }

    if (assignmentId) {
      return assignment.id === assignmentId;
    }

    return assignment.lessonId === lessonId;
  }) ?? null;
}
