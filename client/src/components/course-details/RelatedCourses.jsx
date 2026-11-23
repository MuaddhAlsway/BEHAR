
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowUpLeft,
  ArrowRight,
  ArrowLeft,
  Asterisk,
  Clock3,
  Star,
  Users,
  BookOpen,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { courses } from "../../data/courses";
import "../../styles/course-details/related-courses.css";

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_IMAGE = "/images/courses/course-fallback.webp";

const copy = {
  en: {
    index: "P13.7 / THE NEXT DISCOVERY",
    eyebrow: "KEEP YOUR CURIOSITY ALIVE",
    heading: ["ONE COURSE.", "ENDLESS POSSIBILITIES."],
    intro:
      "Every new skill opens another door. Explore carefully selected courses that complement your learning journey.",
    collection: "CURATED FOR YOUR NEXT STEP",
    course: "COURSE",
    explore: "EXPLORE COURSE",
    viewAll: "EXPLORE ALL COURSES",
    hours: "HOURS",
    students: "STUDENTS",
    free: "FREE",
    currency: "SAR",
    previous: "Previous courses",
    next: "Next courses",
    noCourses: "More learning experiences are coming soon.",
    footer: "THE JOURNEY NEVER REALLY ENDS.",
  },
  ar: {
    index: "P13.7 / الاكتشاف القادم",
    eyebrow: "خلّ فضولك مستمر",
    heading: ["دورة واحدة.", "وآفاق بلا حدود."],
    intro:
      "كل مهارة جديدة تفتح لك بابًا آخر. اكتشف دورات مختارة بعناية لتكمل رحلتك التعليمية.",
    collection: "مختارة لخطوتك القادمة",
    course: "دورة",
    explore: "استكشف الدورة",
    viewAll: "استكشف جميع الدورات",
    hours: "ساعة",
    students: "طالب",
    free: "مجانًا",
    currency: "ر.س",
    previous: "الدورات السابقة",
    next: "الدورات التالية",
    noCourses: "المزيد من التجارب التعليمية قادم قريبًا.",
    footer: "رحلة التعلم لا تنتهي.",
  },
};

function getLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

function localize(value, language) {
  if (typeof value === "string") return value;
  return value?.[language] || value?.en || "";
}

function getComparableValue(value) {
  if (typeof value === "string") {
    return value.trim().toLowerCase();
  }

  if (value && typeof value === "object") {
    return String(value.en || value.ar || "")
      .trim()
      .toLowerCase();
  }

  return String(value ?? "").toLowerCase();
}

function getRecommendations(currentCourse, allCourses) {
  const currentCategory = getComparableValue(
    currentCourse.category
  );
  const currentLevel = getComparableValue(currentCourse.level);

  return allCourses
    .filter(
      (item) =>
        item.slug &&
        item.slug !== currentCourse.slug
    )
    .map((item) => {
      const sameCategory =
        getComparableValue(item.category) === currentCategory;

      const sameLevel =
        getComparableValue(item.level) === currentLevel;

      const score =
        (sameCategory ? 2 : 0) +
        (sameLevel ? 1 : 0);

      return { ...item, recommendationScore: score };
    })
    .sort((a, b) => {
      return (
        b.recommendationScore - a.recommendationScore ||
        Number(b.rating || 0) - Number(a.rating || 0)
      );
    })
    .slice(0, 6);
}

function CourseImage({ course, title }) {
  const initialSource =
    course.image ||
    course.thumbnail ||
    FALLBACK_IMAGE;

  const [source, setSource] = useState(initialSource);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSource(initialSource);
    setFailed(false);
  }, [initialSource]);

  return (
    <div className="behar-related__image">
      {!failed ? (
        <img
          src={source}
          alt={title}
          loading="lazy"
          decoding="async"
          onError={() => {
            if (source !== FALLBACK_IMAGE) {
              setSource(FALLBACK_IMAGE);
            } else {
              setFailed(true);
            }
          }}
        />
      ) : (
        <div
          className="behar-related__image-fallback"
          aria-hidden="true"
        >
          <BookOpen size={52} strokeWidth={1} />
          <span>BEHAR®</span>
        </div>
      )}

      <div className="behar-related__image-overlay" />
    </div>
  );
}

export default function RelatedCourses({ course }) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);

  const [language, setLanguage] = useState(getLanguage);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const isArabic = language === "ar";
  const t = copy[language];

  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;
  const PreviousArrow = isArabic ? ArrowRight : ArrowLeft;
  const NextArrow = isArabic ? ArrowLeft : ArrowRight;

  const recommendations = useMemo(
    () => getRecommendations(course, courses),
    [course]
  );

  const updateNavigation = () => {
    const track = trackRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const position = Math.abs(track.scrollLeft);

    setCanPrevious(position > 5);
    setCanNext(position < maxScroll - 5);
  };

  useEffect(() => {
    const sync = () => setLanguage(getLanguage());
    sync();

    const observer = new MutationObserver(sync);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const frame = requestAnimationFrame(updateNavigation);

    const resizeObserver = new ResizeObserver(updateNavigation);
    resizeObserver.observe(track);

    track.addEventListener("scroll", updateNavigation, {
      passive: true,
    });

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      track.removeEventListener("scroll", updateNavigation);
    };
  }, [language, recommendations]);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".behar-related__heading-line > span",
        { yPercent: 110, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".behar-related__intro",
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".behar-related__collection",
        { y: 45, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-related__collection",
            start: "top 85%",
            once: true,
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [course.slug, language]);

  const scrollCourses = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector(".behar-related__card");

    if (!card) return;

    const gap =
      parseFloat(getComputedStyle(track).columnGap) || 0;

    const distance = card.getBoundingClientRect().width + gap;

    track.scrollBy({
      left: distance * direction * (isArabic ? -1 : 1),
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "instant"
        : "smooth",
    });
  };

  const formatPrice = (price) => {
    const amount = Number(price);

    if (!Number.isFinite(amount)) return "—";
    if (amount === 0) return t.free;

    return `${new Intl.NumberFormat(
      isArabic ? "ar-SA" : "en-US"
    ).format(amount)} ${t.currency}`;
  };

  return (
    <section
      ref={rootRef}
      id="related-courses"
      className="behar-related"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-related-heading"
    >
      <div className="behar-related__container">
        {/* TOPLINE */}
        <div className="behar-related__topline">
          <span>{t.index}</span>
          <Asterisk size={20} strokeWidth={1.4} />
        </div>

        {/* INTRO */}
        <header className="behar-related__intro">
          <div className="behar-related__eyebrow">
            <span className="behar-related__dot" />
            {t.eyebrow}
          </div>

          <h2
            id="behar-related-heading"
            className="behar-related__heading"
          >
            {t.heading.map((line, index) => (
              <span
                key={index}
                className={`behar-related__heading-line ${
                  index === 1
                    ? "behar-related__heading-line--accent"
                    : ""
                }`}
              >
                <span>{line}</span>
              </span>
            ))}
          </h2>

          <div className="behar-related__intro-bottom">
            <p>{t.intro}</p>

            <Link
              to="/courses"
              className="behar-related__view-all"
            >
              <span>{t.viewAll}</span>
              <Arrow size={23} strokeWidth={1.5} />
            </Link>
          </div>
        </header>

        {/* COLLECTION HEADER */}
        <div className="behar-related__collection">
          <div className="behar-related__collection-info">
            <span>BEHAR / RECOMMENDED LEARNING</span>
            <h3>{t.collection}</h3>
          </div>

          <div className="behar-related__navigation">
            <span className="behar-related__count">
              {String(recommendations.length).padStart(2, "0")}
              {" / "}
              {t.course}
            </span>

            <button
              type="button"
              onClick={() => scrollCourses(-1)}
              disabled={!canPrevious}
              aria-label={t.previous}
            >
              <PreviousArrow size={23} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => scrollCourses(1)}
              disabled={!canNext}
              aria-label={t.next}
            >
              <NextArrow size={23} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* COURSE CAROUSEL */}
        {recommendations.length > 0 ? (
          <div
            ref={trackRef}
            className="behar-related__track"
            aria-label={t.collection}
          >
            {recommendations.map((item, index) => {
              const title = localize(item.title, language);
              const category = localize(
                item.category,
                language
              );
              const level = localize(item.level, language);

              return (
                <article
                  key={item.id || item.slug}
                  className="behar-related__card"
                >
                  <Link
                    to={`/courses/${item.slug}`}
                    className="behar-related__card-link"
                    aria-label={`${t.explore}: ${title}`}
                  >
                    <div className="behar-related__card-media">
                      <CourseImage
                        course={item}
                        title={title}
                      />

                      <div className="behar-related__card-top">
                        <span>
                          {String(index + 1).padStart(2, "0")}
                          {" / "}
                          {String(recommendations.length).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <span className="behar-related__card-level">
                          {level}
                        </span>
                      </div>

                      <span className="behar-related__card-arrow">
                        <ArrowUpRight
                          size={25}
                          strokeWidth={1.4}
                        />
                      </span>

                      <span className="behar-related__card-category">
                        {category}
                      </span>
                    </div>

                    <div className="behar-related__card-body">
                      <div className="behar-related__card-meta">
                        <span>
                          <Clock3 size={15} />
                          {item.durationHours ?? "—"} {t.hours}
                        </span>

                        <span>
                          <Star
                            size={15}
                            fill="currentColor"
                          />
                          {item.rating ?? "—"}
                        </span>
                      </div>

                      <h4>{title}</h4>

                      <div className="behar-related__card-footer">
                        <div className="behar-related__card-price">
                          {formatPrice(item.price)}
                        </div>

                        <span className="behar-related__card-explore">
                          {t.explore}
                          <Arrow size={18} strokeWidth={1.5} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="behar-related__empty">
            <BookOpen size={42} strokeWidth={1.2} />
            <p>{t.noCourses}</p>
          </div>
        )}

        {/* PROGRESS INDICATOR */}
        <div className="behar-related__progress">
          <span>BEHAR / DISCOVER MORE</span>
          <div className="behar-related__progress-line" />
          <span>07 — 07</span>
        </div>

        {/* BOTTOM CTA */}
        <div className="behar-related__bottom-cta">
          <span>{t.footer}</span>

          <Link to="/courses">
            {t.viewAll}
            <Arrow size={20} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
