
const bilingual = (en, ar) => ({ en, ar });

export const mockLessonDiscussions = {
  course_001: {
    lesson_001: [
      {
        id: "discussion_001",
        author: "Sarah Ahmed",
        role: "student",
        createdAt: "2026-11-20T10:00:00Z",
        message: bilingual(
          "Should I understand JavaScript fundamentals before starting React?",
          "هل يجب أن أفهم أساسيات JavaScript قبل البدء في React؟"
        ),
        replies: [
          {
            id: "reply_001",
            author: "Omar Khalid",
            role: "instructor",
            createdAt: "2026-11-20T12:00:00Z",
            message: bilingual(
              "Yes. Focus on functions, arrays, objects, modules, and asynchronous JavaScript.",
              "نعم، ركزي على الدوال والمصفوفات والكائنات والوحدات والبرمجة غير المتزامنة."
            ),
          },
        ],
      },
    ],
  },
};

export function getLessonDiscussions(courseId, lessonId) {
  return mockLessonDiscussions[courseId]?.[lessonId] || [];
}
