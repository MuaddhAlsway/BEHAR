
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
} from "lucide-react";

import "../../../styles/student/learning-player/learning-player-header.css";

const translations = {
  en: {
    back: "Back to My Learning",
    eyebrow: "BEHAR / LEARNING EXPERIENCE",
    courseProgress: "Course progress",
    completed: "Completed",
    lessons: "lessons",
    totalLessons: "Total lessons",
    estimatedDuration: "Course duration",
    hours: "hours",
    instructor: "Your instructor",
    learningWorkspace: "LEARNING WORKSPACE",
    inProgress: "In progress",
    notStarted: "Not started",
    finished: "Completed",
  },

  ar: {
    back: "العودة إلى تعلّمي",
    eyebrow: "بحار / تجربة التعلّم",
    courseProgress: "تقدم الدورة",
    completed: "مكتمل",
    lessons: "دروس",
    totalLessons: "إجمالي الدروس",
    estimatedDuration: "مدة الدورة",
    hours: "ساعة",
    instructor: "مدرب الدورة",
    learningWorkspace: "مساحة التعلّم",
    inProgress: "قيد التعلّم",
    notStarted: "لم تبدأ بعد",
    finished: "مكتملة",
  },
};

function formatNumber(value, language) {
  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US"
  ).format(value);
}

function getLocalized(value, language) {
  if (typeof value === "string") return value;

  return value?.[language] || value?.en || "";
}

export default function LearningPlayerHeader({
  course,
  language = "en",
}) {
  if (!course) return null;

  const locale = language === "ar" ? "ar" : "en";
  const t = translations[locale];

  const progress = Math.max(
    0,
    Math.min(100, Number(course.progress) || 0)
  );

  const completedLessons = Number(course.completedLessons) || 0;
  const totalLessons = Number(course.totalLessons) || 0;
  const durationHours = Number(course.durationHours) || 0;

  const status =
    course.status === "completed"
      ? t.finished
      : course.status === "not_started"
        ? t.notStarted
        : t.inProgress;

  return (
    <header
      className="behar-player-header"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* TOP NAVIGATION */}
      <div className="behar-player-header__top">
        <Link
          to="/student/my-learning"
          className="behar-player-header__back"
        >
          {locale === "ar" ? (
            <ArrowRight size={17} strokeWidth={1.7} />
          ) : (
            <ArrowLeft size={17} strokeWidth={1.7} />
          )}

          <span>{t.back}</span>
        </Link>

        <span className="behar-player-header__workspace">
          <span className="behar-player-header__workspace-dot" />
          {t.learningWorkspace}
        </span>
      </div>

      {/* COURSE INFORMATION */}
      <div className="behar-player-header__body">
        <div className="behar-player-header__identity">
          <span className="behar-player-header__eyebrow">
            <span />
            {t.eyebrow}
          </span>

          <div className="behar-player-header__title-row">
            <h1>{getLocalized(course.title, locale)}</h1>

            <span className="behar-player-header__status">
              {status}
            </span>
          </div>

          <div className="behar-player-header__meta">
            <span>
              <GraduationCap
                size={16}
                strokeWidth={1.6}
                aria-hidden="true"
              />
              {t.instructor}: {course.instructor?.name || "BEHAR"}
            </span>

            <span>
              <BookOpen
                size={16}
                strokeWidth={1.6}
                aria-hidden="true"
              />
              {formatNumber(totalLessons, locale)} {t.lessons}
            </span>

            <span>
              <Clock3
                size={16}
                strokeWidth={1.6}
                aria-hidden="true"
              />
              {formatNumber(durationHours, locale)} {t.hours}
            </span>
          </div>
        </div>

        {/* PROGRESS PANEL */}
        <div className="behar-player-header__progress">
          <div className="behar-player-header__progress-top">
            <span>{t.courseProgress}</span>

            <span className="behar-player-header__progress-number">
              {formatNumber(progress, locale)}
              <small>%</small>
            </span>
          </div>

          <div
            className="behar-player-header__progress-track"
            role="progressbar"
            aria-label={t.courseProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="behar-player-header__progress-footer">
            <span>
              <CheckCircle2
                size={14}
                strokeWidth={1.7}
                aria-hidden="true"
              />
              {formatNumber(completedLessons, locale)} {t.completed}
            </span>

            <span>
              {formatNumber(totalLessons, locale)} {t.totalLessons}
            </span>
          </div>
        </div>
      </div>

      {/* EDITORIAL FOOTER */}
      <div
        className="behar-player-header__footer"
        aria-hidden="true"
      >
        <span>BEHAR EDUCATION</span>
        <span>LEARN / PRACTICE / GROW</span>
      </div>
    </header>
  );
}
