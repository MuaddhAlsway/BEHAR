
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Circle,
  LockKeyhole,
  Trophy,
} from "lucide-react";

import "../../../styles/student/learning-player/lesson-progress-tracker.css";

const translations = {
  en: {
    eyebrow: "YOUR LEARNING PROGRESS",
    title: "Make every lesson count.",
    completed: "Completed",
    total: "Total lessons",
    progress: "Course progress",
    markComplete: "Mark lesson as completed",
    markIncomplete: "Mark as incomplete",
    lessonCompleted: "You've completed this lesson",
    lessonPending: "Ready to move forward?",
    completedDescription:
      "This lesson is saved as completed. You can revisit it anytime.",
    pendingDescription:
      "Once you've finished studying, mark this lesson as completed to update your course progress.",
    courseCompleted: "Course lessons completed!",
    courseCompletedDescription:
      "All lessons are marked as completed. You're ready for the next stage of your learning journey.",
    locked: "This lesson is locked",
    percentage: "completion",
  },

  ar: {
    eyebrow: "تقدمك التعليمي",
    title: "كل درس يقربك من هدفك.",
    completed: "المكتملة",
    total: "إجمالي الدروس",
    progress: "تقدم الدورة",
    markComplete: "تحديد الدرس كمكتمل",
    markIncomplete: "تحديد الدرس كغير مكتمل",
    lessonCompleted: "أكملت هذا الدرس",
    lessonPending: "هل أنت مستعد للمتابعة؟",
    completedDescription:
      "تم حفظ هذا الدرس كمكتمل، ويمكنك العودة إليه في أي وقت.",
    pendingDescription:
      "بعد الانتهاء من دراسة المحتوى، حدد الدرس كمكتمل لتحديث تقدمك في الدورة.",
    courseCompleted: "أكملت جميع دروس الدورة!",
    courseCompletedDescription:
      "تم تحديد جميع الدروس كمكتملة. أنت الآن مستعد للمرحلة التالية من رحلتك التعليمية.",
    locked: "هذا الدرس مقفل",
    percentage: "نسبة الإكمال",
  },
};

function formatNumber(value, language) {
  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US"
  ).format(value);
}

export default function LessonProgressTracker({
  lesson,
  completedCount = 0,
  totalLessons = 0,
  progressPercentage = 0,
  isCompleted = false,
  isCourseCompleted = false,
  onToggleCompletion,
  language = "en",
}) {
  const locale = language === "ar" ? "ar" : "en";
  const t = translations[locale];

  if (!lesson) return null;

  const isLocked = lesson.isLocked === true;

  return (
    <section
      className="behar-progress-tracker"
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-label={t.progress}
    >
      <div className="behar-progress-tracker__top">
        <div>
          <span className="behar-progress-tracker__eyebrow">
            <span />
            {t.eyebrow}
          </span>

          <h2>{t.title}</h2>
        </div>

        <div className="behar-progress-tracker__percentage">
          <strong>
            {formatNumber(progressPercentage, locale)}
            <span>%</span>
          </strong>

          <small>{t.percentage}</small>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="behar-progress-tracker__bar-area">
        <div className="behar-progress-tracker__bar-labels">
          <span>{t.progress}</span>

          <span>
            {formatNumber(completedCount, locale)} /{" "}
            {formatNumber(totalLessons, locale)}
          </span>
        </div>

        <div
          className="behar-progress-tracker__bar"
          role="progressbar"
          aria-label={t.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercentage}
        >
          <span
            style={{
              width: `${Math.max(
                0,
                Math.min(100, progressPercentage)
              )}%`,
            }}
          />
        </div>
      </div>

      {/* CURRENT LESSON STATUS */}
      <div
        className={`behar-progress-tracker__lesson ${
          isCompleted
            ? "behar-progress-tracker__lesson--completed"
            : ""
        }`}
      >
        <div className="behar-progress-tracker__lesson-icon">
          {isCompleted ? (
            <CheckCircle2 size={25} strokeWidth={1.6} />
          ) : (
            <Circle size={25} strokeWidth={1.6} />
          )}
        </div>

        <div className="behar-progress-tracker__lesson-copy">
          <h3>
            {isCompleted ? t.lessonCompleted : t.lessonPending}
          </h3>

          <p>
            {isCompleted
              ? t.completedDescription
              : t.pendingDescription}
          </p>
        </div>

        <button
          type="button"
          className={`behar-progress-tracker__action ${
            isCompleted
              ? "behar-progress-tracker__action--completed"
              : ""
          }`}
          disabled={
            isLocked ||
            typeof onToggleCompletion !== "function"
          }
          aria-pressed={isCompleted}
          onClick={onToggleCompletion}
        >
          {isLocked ? (
            <LockKeyhole size={17} />
          ) : isCompleted ? (
            <Check size={17} />
          ) : (
            <ArrowUpRight size={17} />
          )}

          <span>
            {isLocked
              ? t.locked
              : isCompleted
                ? t.markIncomplete
                : t.markComplete}
          </span>
        </button>
      </div>

      {/* COURSE COMPLETION */}
      {isCourseCompleted && (
        <div
          className="behar-progress-tracker__achievement"
          role="status"
        >
          <div className="behar-progress-tracker__achievement-icon">
            <Trophy size={25} strokeWidth={1.5} />
          </div>

          <div>
            <strong>{t.courseCompleted}</strong>
            <p>{t.courseCompletedDescription}</p>
          </div>
        </div>
      )}
    </section>
  );
}
