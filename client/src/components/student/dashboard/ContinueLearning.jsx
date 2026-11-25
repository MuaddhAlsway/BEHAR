
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  Clock3,
  Play,
  MoveUpRight,
  GraduationCap,
} from "lucide-react";
import gsap from "gsap";

import "../../../styles/student/continue-learning.css";

const translations = {
  en: {
    eyebrow: "YOUR LEARNING JOURNEY",
    heading: "Continue",
    headingAccent: "learning.",
    description:
      "Small steps, remarkable progress. Your next lesson is ready.",
    inProgress: "IN PROGRESS",
    chapter: "CURRENT CHAPTER",
    nextLesson: "UP NEXT",
    lessonDuration: "min lesson",
    progress: "COURSE PROGRESS",
    completed: "complete",
    lessons: "lessons completed",
    resume: "Resume learning",
    viewCourse: "View course",
    lastActivity: "Last activity",
    emptyHeading: "Your journey starts here.",
    emptyDescription:
      "Explore courses, discover new skills, and begin building something extraordinary.",
    explore: "Explore courses",
    demo: "Lesson player coming soon",
  },
  ar: {
    eyebrow: "رحلتك التعليمية",
    heading: "واصل",
    headingAccent: "التعلّم.",
    description:
      "خطوات صغيرة تصنع تقدمًا كبيرًا. درسك القادم بانتظارك.",
    inProgress: "قيد التعلّم",
    chapter: "الفصل الحالي",
    nextLesson: "الدرس القادم",
    lessonDuration: "دقيقة",
    progress: "تقدم الدورة",
    completed: "مكتمل",
    lessons: "دروس مكتملة",
    resume: "متابعة التعلّم",
    viewCourse: "عرض الدورة",
    lastActivity: "آخر نشاط",
    emptyHeading: "رحلتك تبدأ من هنا.",
    emptyDescription:
      "استكشف الدورات واكتسب مهارات جديدة وابدأ رحلتك التعليمية.",
    explore: "استكشف الدورات",
    demo: "مشغل الدروس قريبًا",
  },
};

function getLocalized(value, language) {
  if (typeof value === "string") return value;

  return value?.[language] || value?.en || "";
}

function formatLastActivity(date, language) {
  if (!date) return "";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  return new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(parsed);
}

function ContinueLearning({
  course = null,
  resumeEnabled = false,
}) {
  const sectionRef = useRef(null);

  const [language, setLanguage] = useState(() =>
    document.documentElement.lang === "ar" ? "ar" : "en"
  );

  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLanguage(
        document.documentElement.lang === "ar" ? "ar" : "en"
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setImageFailed(false);
  }, [course?.image]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".behar-continue__reveal",
        {
          opacity: 0,
          y: 25,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "all",
        }
      );
    }, sectionRef);

    return () => context.revert();
  }, [language, course?.courseId]);

  const t = translations[language];
  const isArabic = language === "ar";

  const progress = Math.min(
    100,
    Math.max(0, Number(course?.progress) || 0)
  );

  const completedLessons = Math.max(
    0,
    Number(course?.completedLessons) || 0
  );

  const totalLessons = Math.max(
    0,
    Number(course?.totalLessons) || 0
  );

  const courseTitle = getLocalized(course?.title, language);
  const courseCategory = getLocalized(course?.category, language);
  const chapterTitle = getLocalized(
    course?.currentChapter,
    language
  );
  const lessonTitle = getLocalized(
    course?.nextLesson?.title,
    language
  );

  const lessonPath =
    course?.courseId && course?.nextLesson?.id
      ? `/student/learn/${encodeURIComponent(
          course.courseId
        )}/lesson/${encodeURIComponent(course.nextLesson.id)}`
      : null;

  const canResume = Boolean(resumeEnabled && lessonPath);

  return (
    <section
      ref={sectionRef}
      className="behar-continue"
      dir={isArabic ? "rtl" : "ltr"}
      aria-labelledby="behar-continue-heading"
    >
      <div className="behar-continue__section-header behar-continue__reveal">
        <div>
          <span className="behar-continue__eyebrow">
            <span className="behar-continue__eyebrow-line" />
            {t.eyebrow}
          </span>

          <h2
            id="behar-continue-heading"
            className="behar-continue__heading"
          >
            {t.heading}{" "}
            <span>{t.headingAccent}</span>
          </h2>

          <p className="behar-continue__description">
            {t.description}
          </p>
        </div>

        <span className="behar-continue__section-index">
          02 / BEHAR
        </span>
      </div>

      {!course ? (
        <div className="behar-continue__empty behar-continue__reveal">
          <div className="behar-continue__empty-icon">
            <GraduationCap size={38} strokeWidth={1.2} />
          </div>

          <div className="behar-continue__empty-copy">
            <h3>{t.emptyHeading}</h3>
            <p>{t.emptyDescription}</p>
          </div>

          <Link to="/courses" className="behar-continue__empty-link">
            {t.explore}
            <ArrowUpRight size={19} />
          </Link>
        </div>
      ) : (
        <article className="behar-continue__card behar-continue__reveal">
          <div className="behar-continue__media">
            {course.image && !imageFailed ? (
              <img
                src={course.image}
                alt=""
                className="behar-continue__image"
                loading="lazy"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="behar-continue__image-fallback">
                <BookOpen size={70} strokeWidth={0.7} />
                <span>BEHAR / LEARNING</span>
              </div>
            )}

            <span className="behar-continue__media-tag">
              <span />
              {t.inProgress}
            </span>

            <div className="behar-continue__media-overlay">
              <span>BEHAR EDUCATION</span>
              <span>01 — 04</span>
            </div>
          </div>

          <div className="behar-continue__content">
            <div className="behar-continue__content-top">
              <span className="behar-continue__category">
                {courseCategory}
              </span>

              <span className="behar-continue__course-id">
                {course.courseId}
              </span>
            </div>

            <h3 className="behar-continue__course-title">
              {courseTitle}
            </h3>

            <div className="behar-continue__instructor">
              <div className="behar-continue__instructor-avatar">
                {course.instructor?.avatar ? (
                  <img
                    src={course.instructor.avatar}
                    alt=""
                  />
                ) : (
                  <span>
                    {course.instructor?.name?.charAt(0) || "B"}
                  </span>
                )}
              </div>

              <span>{course.instructor?.name}</span>
            </div>

            <div className="behar-continue__lesson">
              <span className="behar-continue__field-label">
                {t.chapter}
              </span>

              <p className="behar-continue__chapter">
                {chapterTitle}
              </p>

              <div className="behar-continue__lesson-next">
                <span className="behar-continue__lesson-icon">
                  <Play size={14} fill="currentColor" />
                </span>

                <div>
                  <span className="behar-continue__field-label">
                    {t.nextLesson}
                  </span>

                  <strong>{lessonTitle}</strong>
                </div>

                <span className="behar-continue__lesson-time">
                  <Clock3 size={14} />
                  {course.nextLesson?.durationMinutes || 0}{" "}
                  {t.lessonDuration}
                </span>
              </div>
            </div>

            <div className="behar-continue__progress-block">
              <div className="behar-continue__progress-top">
                <span>{t.progress}</span>

                <strong>
                  {Math.round(progress)}% {t.completed}
                </strong>
              </div>

              <div
                className="behar-continue__progress-track"
                role="progressbar"
                aria-label={t.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
              >
                <span style={{ width: `${progress}%` }} />
              </div>

              <div className="behar-continue__progress-bottom">
                <span>
                  {completedLessons} / {totalLessons} {t.lessons}
                </span>

                <span>
                  {t.lastActivity}:{" "}
                  {formatLastActivity(
                    course.lastAccessedAt,
                    language
                  )}
                </span>
              </div>
            </div>

            <div className="behar-continue__actions">
              {canResume ? (
                <Link
                  to={lessonPath}
                  className="behar-continue__resume"
                >
                  <span className="behar-continue__resume-play">
                    <Play size={15} fill="currentColor" />
                  </span>

                  {t.resume}

                  <ArrowUpRight size={19} />
                </Link>
              ) : (
                <button
                  type="button"
                  className="behar-continue__resume"
                  disabled
                  title={t.demo}
                >
                  <span className="behar-continue__resume-play">
                    <Play size={15} fill="currentColor" />
                  </span>

                  {t.demo}
                </button>
              )}

              <Link
                to={`/courses/${course.courseSlug}`}
                className="behar-continue__view"
              >
                {t.viewCourse}
                <MoveUpRight size={18} />
              </Link>
            </div>
          </div>
        </article>
      )}
    </section>
  );
}

export default ContinueLearning;
