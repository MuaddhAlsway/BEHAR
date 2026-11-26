
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Clock3,
  Layers3,
  Play,
  Plus,
} from "lucide-react";
import gsap from "gsap";

import "../../../styles/student/public/active-courses.css";

const translations = {
  en: {
    eyebrow: "YOUR PERSONAL LIBRARY",
    heading: "Your active",
    headingAccent: "courses.",
    description:
      "Everything you're learning, all in one place. Find your rhythm and keep moving forward.",
    viewAll: "View all courses",
    featured: "CURRENTLY LEARNING",
    inProgress: "In progress",
    notStarted: "Not started",
    completed: "Completed",
    courseProgress: "COURSE PROGRESS",
    lessons: "lessons",
    completedLessons: "lessons completed",
    duration: "Course duration",
    hours: "hrs",
    continue: "Continue course",
    start: "Start learning",
    preview: "View details",
    next: "UP NEXT IN YOUR LIBRARY",
    explore: "Discover more courses",
    emptyTitle: "Your library is waiting.",
    emptyDescription:
      "Explore our courses and start building your next skill.",
    emptyAction: "Explore courses",
    lockedAction: "Learning workspace coming soon",
  },
  ar: {
    eyebrow: "مكتبتك التعليمية",
    heading: "دوراتك",
    headingAccent: "الحالية.",
    description:
      "كل ما تتعلمه في مكان واحد. واصل تقدمك وحقق أهدافك خطوة بخطوة.",
    viewAll: "عرض جميع الدورات",
    featured: "تتعلم حاليًا",
    inProgress: "قيد التعلّم",
    notStarted: "لم تبدأ",
    completed: "مكتملة",
    courseProgress: "تقدم الدورة",
    lessons: "دروس",
    completedLessons: "دروس مكتملة",
    duration: "مدة الدورة",
    hours: "ساعة",
    continue: "متابعة الدورة",
    start: "ابدأ التعلّم",
    preview: "تفاصيل الدورة",
    next: "دورات أخرى في مكتبتك",
    explore: "اكتشف المزيد من الدورات",
    emptyTitle: "مكتبتك بانتظارك.",
    emptyDescription:
      "استكشف دوراتنا وابدأ في اكتساب مهارة جديدة.",
    emptyAction: "استكشف الدورات",
    lockedAction: "مساحة التعلّم قريبًا",
  },
};

function localized(value, language) {
  if (typeof value === "string") return value;
  return value?.[language] || value?.en || "";
}

function safeProgress(value) {
  return Math.min(100, Math.max(0, Number(value) || 0));
}

function useDashboardLanguage() {
  const [language, setLanguage] = useState(() =>
    document.documentElement.lang === "ar" ? "ar" : "en"
  );

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

  return language;
}

function CourseArtwork({ course, featured = false }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [course.image]);

  return (
    <div
      className={[
        "behar-active__artwork",
        featured ? "behar-active__artwork--featured" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {course.image && !failed ? (
        <img
          src={course.image}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="behar-active__artwork-fallback">
          <span className="behar-active__artwork-circle" />
          <BookOpen size={featured ? 58 : 34} strokeWidth={1} />
          <span className="behar-active__artwork-brand">
            BEHAR / ACADEMY
          </span>
        </div>
      )}
    </div>
  );
}

function CourseStatus({ status, t }) {
  const label =
    status === "completed"
      ? t.completed
      : status === "not_started"
        ? t.notStarted
        : t.inProgress;

  return (
    <span
      className={`behar-active__status behar-active__status--${status}`}
    >
      <span className="behar-active__status-dot" />
      {label}
    </span>
  );
}

function CourseProgress({ course, t, featured = false }) {
  const progress = safeProgress(course.progress);
  const completed = Math.max(
    0,
    Number(course.completedLessons) || 0
  );
  const total = Math.max(0, Number(course.totalLessons) || 0);

  return (
    <div
      className={[
        "behar-active__progress",
        featured ? "behar-active__progress--featured" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="behar-active__progress-top">
        <span>{t.courseProgress}</span>
        <strong>{Math.round(progress)}%</strong>
      </div>

      <div
        className="behar-active__progress-track"
        role="progressbar"
        aria-label={`${localized(course.title, t.language)} — ${t.courseProgress}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <span className="behar-active__progress-caption">
        {completed} / {total} {t.completedLessons}
      </span>
    </div>
  );
}

function CourseAction({
  course,
  t,
  featured = false,
  learningRoutesEnabled,
}) {
  const isNew = course.status === "not_started";
  const label = isNew ? t.start : t.continue;

  const coursePath = `/student/learn/${encodeURIComponent(
    course.slug
  )}`;

  const className = featured
    ? "behar-active__primary-action"
    : "behar-active__course-action";

  if (!learningRoutesEnabled) {
    return (
      <button
        type="button"
        className={className}
        disabled
        title={t.lockedAction}
      >
        <Play size={15} fill="currentColor" />
        <span>{t.lockedAction}</span>
      </button>
    );
  }

  return (
    <Link to={coursePath} className={className}>
      <Play size={15} fill="currentColor" />
      <span>{label}</span>
      <ArrowUpRight size={18} />
    </Link>
  );
}

function FeaturedCourse({
  course,
  t,
  language,
  learningRoutesEnabled,
}) {
  return (
    <article className="behar-active__featured behar-active__reveal">
      <div className="behar-active__featured-media">
        <CourseArtwork course={course} featured />

        <div className="behar-active__featured-media-top">
          <span className="behar-active__featured-label">
            <span />
            {t.featured}
          </span>
        </div>

        <div className="behar-active__featured-media-bottom">
          <span>BEHAR EDUCATION</span>
          <span>01 / 04</span>
        </div>
      </div>

      <div className="behar-active__featured-body">
        <div className="behar-active__featured-top">
          <span className="behar-active__category">
            {localized(course.category, language)}
          </span>

          <CourseStatus status={course.status} t={t} />
        </div>

        <h3 className="behar-active__featured-title">
          {localized(course.title, language)}
        </h3>

        <p className="behar-active__instructor">
          {course.instructor?.name}
        </p>

        <div className="behar-active__featured-meta">
          <span>
            <Layers3 size={15} />
            {course.totalLessons} {t.lessons}
          </span>

          <span>
            <Clock3 size={15} />
            {course.durationHours} {t.hours}
          </span>
        </div>

        <CourseProgress course={course} t={t} featured />

        <div className="behar-active__featured-actions">
          <CourseAction
            course={course}
            t={t}
            featured
            learningRoutesEnabled={learningRoutesEnabled}
          />

          <Link
            to={`/courses/${course.slug}`}
            className="behar-active__secondary-action"
          >
            {t.preview}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function CompactCourse({
  course,
  t,
  language,
  learningRoutesEnabled,
}) {
  return (
    <article className="behar-active__compact behar-active__reveal">
      <CourseArtwork course={course} />

      <div className="behar-active__compact-body">
        <div className="behar-active__compact-top">
          <span className="behar-active__category">
            {localized(course.category, language)}
          </span>

          <CourseStatus status={course.status} t={t} />
        </div>

        <h3 className="behar-active__compact-title">
          {localized(course.title, language)}
        </h3>

        <p className="behar-active__instructor">
          {course.instructor?.name}
        </p>

        <CourseProgress course={course} t={t} />

        <div className="behar-active__compact-actions">
          <CourseAction
            course={course}
            t={t}
            learningRoutesEnabled={learningRoutesEnabled}
          />

          <Link
            to={`/courses/${course.slug}`}
            className="behar-active__compact-details"
            aria-label={`${t.preview}: ${localized(
              course.title,
              language
            )}`}
          >
            {language === "ar" ? (
              <ArrowLeft size={19} />
            ) : (
              <ArrowRight size={19} />
            )}
          </Link>
        </div>
      </div>
    </article>
  );
}

function ActiveCourses({
  courses = [],
  learningRoutesEnabled = false,
}) {
  const sectionRef = useRef(null);
  const language = useDashboardLanguage();

  const t = {
    ...translations[language],
    language,
  };

  const isArabic = language === "ar";

  const activeCourses = courses.filter(
    (course) => course.status !== "completed"
  );

  const featuredCourse = activeCourses[0];
  const remainingCourses = activeCourses.slice(1);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".behar-active__reveal",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "all",
        }
      );
    }, sectionRef);

    return () => context.revert();
  }, [language, courses]);

  return (
    <section
      ref={sectionRef}
      className="behar-active"
      dir={isArabic ? "rtl" : "ltr"}
      aria-labelledby="behar-active-heading"
    >
      <header className="behar-active__header behar-active__reveal">
        <div>
          <span className="behar-active__eyebrow">
            <span className="behar-active__eyebrow-line" />
            {t.eyebrow}
          </span>

          <h2
            id="behar-active-heading"
            className="behar-active__heading"
          >
            {t.heading} <span>{t.headingAccent}</span>
          </h2>

          <p className="behar-active__description">
            {t.description}
          </p>
        </div>

        <Link
          to="/student/my-learning"
          className="behar-active__view-all"
        >
          {t.viewAll}
          <ArrowUpRight size={18} />
        </Link>
      </header>

      {activeCourses.length === 0 ? (
        <div className="behar-active__empty behar-active__reveal">
          <div className="behar-active__empty-icon">
            <BookOpen size={40} strokeWidth={1.2} />
          </div>

          <h3>{t.emptyTitle}</h3>
          <p>{t.emptyDescription}</p>

          <Link to="/courses">
            {t.emptyAction}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      ) : (
        <>
          <FeaturedCourse
            course={featuredCourse}
            t={t}
            language={language}
            learningRoutesEnabled={learningRoutesEnabled}
          />

          {remainingCourses.length > 0 && (
            <div className="behar-active__collection">
              <div className="behar-active__collection-heading behar-active__reveal">
                <span>{t.next}</span>
                <span>
                  {String(remainingCourses.length).padStart(
                    2,
                    "0"
                  )}
                </span>
              </div>

              <div className="behar-active__compact-grid">
                {remainingCourses.map((course) => (
                  <CompactCourse
                    key={course.id}
                    course={course}
                    t={t}
                    language={language}
                    learningRoutesEnabled={learningRoutesEnabled}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="behar-active__footer behar-active__reveal">
        <span>BEHAR / DISCOVER MORE</span>

        <Link to="/courses">
          <Plus size={16} />
          {t.explore}
          <ArrowUpRight size={17} />
        </Link>
      </div>
    </section>
  );
}

export default ActiveCourses;
