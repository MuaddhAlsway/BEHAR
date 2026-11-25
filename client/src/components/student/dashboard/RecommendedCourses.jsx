
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Clock3,
  Compass,
  GraduationCap,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import gsap from "gsap";

import "../../../styles/student/recommended-courses.css";

const translations = {
  en: {
    eyebrow: "CURATED FOR YOUR CURIOSITY",
    heading: "Your next",
    headingAccent: "discovery.",
    description:
      "New perspectives, new skills, and new possibilities. Explore courses selected around your learning interests.",
    exploreAll: "Explore all courses",
    featured: "FEATURED FOR YOU",
    recommended: "RECOMMENDED COLLECTION",
    all: "All",
    development: "Development",
    design: "Design",
    marketing: "Marketing",
    business: "Business",
    viewCourse: "Explore course",
    viewDetails: "View details",
    students: "learners",
    hours: "hrs",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    free: "Free",
    from: "From",
    next: "Next courses",
    emptyTitle: "More discoveries are coming.",
    emptyDescription:
      "Explore our full catalog to find something that inspires you.",
    emptyAction: "Browse courses",
    footer: "THE NEXT CHAPTER STARTS WITH CURIOSITY",
    previous: "Previous courses",
    nextButton: "Next courses",
  },
  ar: {
    eyebrow: "مختارة لتلهم فضولك",
    heading: "اكتشافك",
    headingAccent: "القادم.",
    description:
      "آفاق جديدة ومهارات جديدة وفرص لا تنتهي. اكتشف دورات مختارة بناءً على اهتماماتك التعليمية.",
    exploreAll: "استكشف جميع الدورات",
    featured: "دورة مميزة لك",
    recommended: "دورات نرشحها لك",
    all: "الكل",
    development: "البرمجة والتطوير",
    design: "التصميم",
    marketing: "التسويق",
    business: "الأعمال",
    viewCourse: "استكشف الدورة",
    viewDetails: "تفاصيل الدورة",
    students: "متعلم",
    hours: "ساعة",
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advanced: "متقدم",
    free: "مجاني",
    from: "ابتداءً من",
    next: "دورات أخرى",
    emptyTitle: "المزيد من الاكتشافات قريبًا.",
    emptyDescription:
      "استكشف مكتبتنا التعليمية للعثور على ما يلهمك.",
    emptyAction: "تصفح الدورات",
    footer: "الفصل القادم يبدأ بالفضول",
    previous: "الدورات السابقة",
    nextButton: "الدورات التالية",
  },
};

const categoryKeys = [
  "all",
  "development",
  "design",
  "marketing",
  "business",
];

function localized(value, language) {
  if (typeof value === "string") return value;
  return value?.[language] || value?.en || "";
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

function formatNumber(value, language) {
  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US"
  ).format(Number(value) || 0);
}

function formatPrice(course, language, t) {
  const price = Number(course.price) || 0;

  if (price === 0) return t.free;

  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US",
    {
      style: "currency",
      currency: course.currency || "USD",
      maximumFractionDigits: 0,
    }
  ).format(price);
}

function CourseArtwork({
  course,
  className = "",
  children,
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [course.image]);

  return (
    <div
      className={`behar-recommended__artwork ${className}`}
    >
      {course.image && !failed ? (
        <img
          src={course.image}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="behar-recommended__artwork-fallback">
          <span className="behar-recommended__fallback-orbit" />
          <BookOpen size={45} strokeWidth={1} />
          <span>BEHAR / LEARN WITHOUT LIMITS</span>
        </div>
      )}

      {children}
    </div>
  );
}

function CourseMeta({ course, language, t }) {
  return (
    <div className="behar-recommended__meta">
      <span>
        <Star size={14} fill="currentColor" />
        <strong>{course.rating?.toFixed(1) || "—"}</strong>
        <small>
          ({formatNumber(course.reviewCount, language)})
        </small>
      </span>

      <span>
        <Clock3 size={14} />
        {formatNumber(course.durationHours, language)}{" "}
        {t.hours}
      </span>

      <span>
        <GraduationCap size={14} />
        {t[course.level] || course.level}
      </span>
    </div>
  );
}

function FeaturedRecommendation({
  course,
  language,
  t,
}) {
  return (
    <article className="behar-recommended__featured behar-recommended__reveal">
      <div className="behar-recommended__featured-media">
        <CourseArtwork
          course={course}
          className="behar-recommended__artwork--featured"
        >
          <div className="behar-recommended__featured-badge">
            <Sparkles size={15} />
            {t.featured}
          </div>

          <div className="behar-recommended__featured-media-footer">
            <span>BEHAR EDUCATION</span>
            <span>01 / EDITOR'S PICK</span>
          </div>
        </CourseArtwork>
      </div>

      <div className="behar-recommended__featured-body">
        <div className="behar-recommended__featured-top">
          <span className="behar-recommended__category">
            {localized(course.category, language)}
          </span>

          <span className="behar-recommended__featured-number">
            Nº 01
          </span>
        </div>

        <div className="behar-recommended__featured-content">
          <span className="behar-recommended__reason">
            <Sparkles size={14} />
            {localized(course.reason, language)}
          </span>

          <h3>
            {localized(course.title, language)}
          </h3>

          <p className="behar-recommended__featured-description">
            {localized(course.description, language)}
          </p>

          <div className="behar-recommended__instructor">
            <span className="behar-recommended__instructor-avatar">
              {course.instructor?.name?.charAt(0) || "B"}
            </span>

            <span>{course.instructor?.name}</span>
          </div>

          <CourseMeta
            course={course}
            language={language}
            t={t}
          />
        </div>

        <div className="behar-recommended__featured-bottom">
          <div className="behar-recommended__featured-price">
            <span>{t.from}</span>
            <strong>{formatPrice(course, language, t)}</strong>
          </div>

          <Link
            to={`/courses/${course.slug}`}
            className="behar-recommended__featured-action"
          >
            {t.viewCourse}
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function RecommendationCard({
  course,
  language,
  t,
  index,
}) {
  return (
    <article className="behar-recommended__card">
      <Link
        to={`/courses/${course.slug}`}
        className="behar-recommended__card-media-link"
        aria-label={`${t.viewDetails}: ${localized(
          course.title,
          language
        )}`}
      >
        <CourseArtwork
          course={course}
          className="behar-recommended__artwork--card"
        >
          <span className="behar-recommended__card-index">
            {String(index + 2).padStart(2, "0")}
          </span>
        </CourseArtwork>
      </Link>

      <div className="behar-recommended__card-body">
        <div className="behar-recommended__card-top">
          <span className="behar-recommended__category">
            {localized(course.category, language)}
          </span>

          <span className="behar-recommended__card-rating">
            <Star size={13} fill="currentColor" />
            {course.rating?.toFixed(1) || "—"}
          </span>
        </div>

        <h3>
          <Link to={`/courses/${course.slug}`}>
            {localized(course.title, language)}
          </Link>
        </h3>

        <p className="behar-recommended__card-instructor">
          {course.instructor?.name}
        </p>

        <div className="behar-recommended__card-meta">
          <span>
            <Clock3 size={14} />
            {formatNumber(
              course.durationHours,
              language
            )}{" "}
            {t.hours}
          </span>

          <span>
            <Users size={14} />
            {formatNumber(course.students, language)}
          </span>
        </div>

        <div className="behar-recommended__card-bottom">
          <strong>
            {formatPrice(course, language, t)}
          </strong>

          <Link
            to={`/courses/${course.slug}`}
            aria-label={`${t.viewDetails}: ${localized(
              course.title,
              language
            )}`}
          >
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function RecommendedCourses({ courses = [] }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const language = useDashboardLanguage();

  const [activeCategory, setActiveCategory] =
    useState("all");

  const t = translations[language];

  const featuredCourse =
    courses.find((course) => course.featured) ||
    courses[0];

  const collection = useMemo(
    () =>
      courses.filter(
        (course) => course.id !== featuredCourse?.id
      ),
    [courses, featuredCourse?.id]
  );

  const availableCategories = categoryKeys.filter(
    (key) =>
      key === "all" ||
      collection.some(
        (course) =>
          course.category?.en?.toLowerCase() === key
      )
  );

  const filteredCourses = collection.filter(
    (course) =>
      activeCategory === "all" ||
      course.category?.en?.toLowerCase() ===
        activeCategory
  );

  const scrollCourses = (direction) => {
    const track = trackRef.current;

    if (!track) return;

    const card = track.querySelector(
      ".behar-recommended__card"
    );

    const distance = card
      ? card.getBoundingClientRect().width + 16
      : 300;

    track.scrollBy({
      left:
        distance *
        direction *
        (language === "ar" ? -1 : 1),
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "instant"
        : "smooth",
    });
  };

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.scrollLeft = 0;
    }
  }, [activeCategory, language]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".behar-recommended__reveal",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
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
      className="behar-recommended"
      dir={language === "ar" ? "rtl" : "ltr"}
      aria-labelledby="behar-recommended-heading"
    >
      <header className="behar-recommended__header behar-recommended__reveal">
        <div>
          <span className="behar-recommended__eyebrow">
            <span className="behar-recommended__eyebrow-line" />
            {t.eyebrow}
          </span>

          <h2
            id="behar-recommended-heading"
            className="behar-recommended__heading"
          >
            {t.heading}{" "}
            <span>{t.headingAccent}</span>
          </h2>

          <p className="behar-recommended__description">
            {t.description}
          </p>
        </div>

        <Link
          to="/courses"
          className="behar-recommended__explore-all"
        >
          {t.exploreAll}
          <ArrowUpRight size={18} />
        </Link>
      </header>

      {courses.length === 0 ? (
        <div className="behar-recommended__empty">
          <Compass size={40} strokeWidth={1.2} />
          <h3>{t.emptyTitle}</h3>
          <p>{t.emptyDescription}</p>
          <Link to="/courses">
            {t.emptyAction}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      ) : (
        <>
          {featuredCourse && (
            <FeaturedRecommendation
              course={featuredCourse}
              language={language}
              t={t}
            />
          )}

          {collection.length > 0 && (
            <div className="behar-recommended__collection behar-recommended__reveal">
              <div className="behar-recommended__collection-top">
                <div>
                  <span className="behar-recommended__collection-eyebrow">
                    02 / DISCOVER MORE
                  </span>

                  <h3>{t.recommended}</h3>
                </div>

                <div className="behar-recommended__arrows">
                  <button
                    type="button"
                    onClick={() => scrollCourses(-1)}
                    aria-label={t.previous}
                  >
                    {language === "ar" ? (
                      <ArrowRight size={20} />
                    ) : (
                      <ArrowLeft size={20} />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollCourses(1)}
                    aria-label={t.nextButton}
                  >
                    {language === "ar" ? (
                      <ArrowLeft size={20} />
                    ) : (
                      <ArrowRight size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div
                className="behar-recommended__filters"
                role="group"
                aria-label={t.recommended}
              >
                {availableCategories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={
                      activeCategory === category
                        ? "is-active"
                        : ""
                    }
                    onClick={() =>
                      setActiveCategory(category)
                    }
                    aria-pressed={
                      activeCategory === category
                    }
                  >
                    {t[category]}
                  </button>
                ))}
              </div>

              <div
                ref={trackRef}
                className="behar-recommended__track"
                aria-label={t.recommended}
              >
                {filteredCourses.map((course, index) => (
                  <RecommendationCard
                    key={course.id}
                    course={course}
                    index={index}
                    language={language}
                    t={t}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <footer className="behar-recommended__footer behar-recommended__reveal">
        <span>
          <span className="behar-recommended__footer-dot" />
          {t.footer}
        </span>

        <Link to="/courses">
          {t.exploreAll}
          <ArrowUpRight size={16} />
        </Link>
      </footer>
    </section>
  );
}

export default RecommendedCourses;
