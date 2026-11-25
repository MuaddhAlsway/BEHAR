
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  LockKeyhole,
} from "lucide-react";

import "../../../styles/student/learning-player/lesson-navigation.css";

const translations = {
  en: {
    eyebrow: "CONTINUE YOUR JOURNEY",
    title: "Keep learning.",
    subtitle: "One lesson at a time.",
    previous: "Previous lesson",
    next: "Next lesson",
    firstLesson: "You're at the beginning",
    finalLesson: "You've reached the final lesson",
    finalDescription:
      "You've reached the end of the course curriculum. Lesson completion tracking will be available soon.",
    lesson: "Lesson",
    of: "of",
    minutes: "min",
    locked: "Locked lesson",
    current: "CURRENT POSITION",
    noPrevious: "No previous lesson",
    noNext: "No next lesson",
  },

  ar: {
    eyebrow: "واصل رحلتك التعليمية",
    title: "استمر في التعلم.",
    subtitle: "درساً بعد درس.",
    previous: "الدرس السابق",
    next: "الدرس التالي",
    firstLesson: "أنت في بداية الدورة",
    finalLesson: "وصلت إلى الدرس الأخير",
    finalDescription:
      "وصلت إلى نهاية محتوى الدورة. سيتم إضافة نظام متابعة إكمال الدروس قريباً.",
    lesson: "الدرس",
    of: "من",
    minutes: "دقيقة",
    locked: "درس مقفل",
    current: "موقعك الحالي",
    noPrevious: "لا يوجد درس سابق",
    noNext: "لا يوجد درس تالٍ",
  },
};

function localized(value, language) {
  if (typeof value === "string") return value;
  return value?.[language] || value?.en || "";
}

function formatNumber(value, language) {
  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US"
  ).format(value);
}

function lessonPath(courseSlug, lessonId) {
  return `/student/learn/${encodeURIComponent(
    courseSlug
  )}/lessons/${encodeURIComponent(lessonId)}`;
}

function NavigationCard({
  lesson,
  courseSlug,
  direction: _direction,
  language,
  label,
  number,
  isNext,
}) {
  const t = translations[language];
  const isRTL = language === "ar";
  const isLocked = lesson?.isLocked === true;

  const Icon = isNext
    ? isRTL
      ? ArrowLeft
      : ArrowRight
    : isRTL
      ? ArrowRight
      : ArrowLeft;

  if (!lesson) {
    return (
      <div
        className={`behar-lesson-nav__card behar-lesson-nav__card--disabled ${
          isNext ? "behar-lesson-nav__card--next" : ""
        }`}
        aria-disabled="true"
      >
        <div className="behar-lesson-nav__card-heading">
          <span>{label}</span>
          <Icon size={20} />
        </div>

        <p>
          {isNext ? t.noNext : t.noPrevious}
        </p>
      </div>
    );
  }

  const content = (
    <>
      <div className="behar-lesson-nav__card-heading">
        <span>{label}</span>
        {isLocked ? (
          <LockKeyhole size={19} />
        ) : (
          <Icon size={20} />
        )}
      </div>

      <div className="behar-lesson-nav__card-body">
        <span className="behar-lesson-nav__lesson-number">
          {t.lesson} {formatNumber(number, language)}
        </span>

        <h3>{localized(lesson.title, language)}</h3>

        <div className="behar-lesson-nav__lesson-meta">
          <Clock3 size={14} />
          <span>
            {formatNumber(
              lesson.durationMinutes || 0,
              language
            )}{" "}
            {t.minutes}
          </span>
        </div>
      </div>
    </>
  );

  const className = `behar-lesson-nav__card ${
    isNext ? "behar-lesson-nav__card--next" : ""
  } ${
    isLocked ? "behar-lesson-nav__card--locked" : ""
  }`;

  if (isLocked) {
    return (
      <div
        className={className}
        aria-disabled="true"
        aria-label={`${localized(
          lesson.title,
          language
        )} — ${t.locked}`}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      to={lessonPath(courseSlug, lesson.id)}
      className={className}
      aria-label={`${label}: ${localized(
        lesson.title,
        language
      )}`}
    >
      {content}
    </Link>
  );
}

export default function LessonNavigation({
  course,
  lessons = [],
  currentLessonId,
  language = "en",
}) {
  const locale = language === "ar" ? "ar" : "en";
  const t = translations[locale];

  const currentIndex = lessons.findIndex(
    (lesson) => lesson.id === currentLessonId
  );

  if (!course || currentIndex < 0) return null;

  const previousLesson =
    currentIndex > 0 ? lessons[currentIndex - 1] : null;

  const nextLesson =
    currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === lessons.length - 1;

  const currentPosition = currentIndex + 1;

  const progress =
    lessons.length > 0
      ? (currentPosition / lessons.length) * 100
      : 0;

  return (
    <section
      className="behar-lesson-nav"
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-label={t.eyebrow}
    >
      <div className="behar-lesson-nav__intro">
        <div>
          <span className="behar-lesson-nav__eyebrow">
            <span />
            {t.eyebrow}
          </span>

          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>

        <div className="behar-lesson-nav__position">
          <span>{t.current}</span>

          <strong>
            {formatNumber(currentPosition, locale)}
            <small>
              {" / "}
              {formatNumber(lessons.length, locale)}
            </small>
          </strong>
        </div>
      </div>

      {/* POSITION INDICATOR */}
      <div
        className="behar-lesson-nav__progress"
        role="progressbar"
        aria-label={t.current}
        aria-valuenow={currentPosition}
        aria-valuemin={0}
        aria-valuemax={lessons.length}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      {/* PREVIOUS / NEXT */}
      <nav
        className="behar-lesson-nav__grid"
        aria-label={t.eyebrow}
      >
        <NavigationCard
          lesson={previousLesson}
          courseSlug={course.slug}
          language={locale}
          label={t.previous}
          number={currentIndex}
          isNext={false}
        />

        <NavigationCard
          lesson={nextLesson}
          courseSlug={course.slug}
          language={locale}
          label={t.next}
          number={currentIndex + 2}
          isNext
        />
      </nav>

      {/* FIRST / LAST LESSON MESSAGE */}
      {(isFirst || isLast) && (
        <div className="behar-lesson-nav__boundary">
          {isLast ? (
            <>
              <CheckCircle2 size={19} />
              <div>
                <strong>{t.finalLesson}</strong>
                <p>{t.finalDescription}</p>
              </div>
            </>
          ) : (
            <>
              <BookOpen size={19} />
              <strong>{t.firstLesson}</strong>
            </>
          )}
        </div>
      )}
    </section>
  );
}
