
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowUpLeft,
  Asterisk,
  Star,
  Quote,
  CheckCircle2,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  getCourseReviews,
  getReviewStatistics,
} from "../../data/courseReviews";

import "../../styles/course-details/course-reviews.css";

gsap.registerPlugin(ScrollTrigger);

const PAGE_SIZE = 4;

const copy = {
  en: {
    index: "P13.5 / THE VOICE OF EXPERIENCE",
    eyebrow: "STUDENT PERSPECTIVES",
    heading: ["REAL VOICES.", "REAL GROWTH."],
    intro:
      "Every learning journey is personal. Explore the experiences, perspectives, and reflections shared by learners.",
    average: "AVERAGE RATING",
    basedOn: "BASED ON",
    reviews: "REVIEWS",
    distribution: "RATING DISTRIBUTION",
    all: "ALL REVIEWS",
    stars: "STARS",
    studentVoices: "FROM THE LEARNING COMMUNITY",
    filter: "FILTER BY RATING",
    sort: "SORT REVIEWS",
    newest: "MOST RECENT",
    highest: "HIGHEST RATED",
    lowest: "LOWEST RATED",
    helpful: "HELPFUL",
    verified: "VERIFIED LEARNER",
    showMore: "LOAD MORE REVIEWS",
    showing: "SHOWING",
    of: "OF",
    empty: "No reviews match this rating.",
    noReviews: "No student reviews have been added yet.",
    demo: "DEMONSTRATION REVIEWS — NOT VERIFIED STUDENT FEEDBACK",
    footer: "EVERY PERSPECTIVE ADDS TO THE STORY.",
  },
  ar: {
    index: "P13.5 / أصوات التجربة",
    eyebrow: "آراء الطلاب",
    heading: ["تجارب مختلفة.", "ونمو مستمر."],
    intro:
      "لكل متعلم رحلة مختلفة. استكشف التجارب والآراء والانطباعات التي يشاركها المتعلمون.",
    average: "متوسط التقييم",
    basedOn: "بناءً على",
    reviews: "تقييمات",
    distribution: "توزيع التقييمات",
    all: "جميع التقييمات",
    stars: "نجوم",
    studentVoices: "من مجتمع المتعلمين",
    filter: "تصفية حسب التقييم",
    sort: "ترتيب التقييمات",
    newest: "الأحدث",
    highest: "الأعلى تقييمًا",
    lowest: "الأقل تقييمًا",
    helpful: "مفيد",
    verified: "متعلم موثّق",
    showMore: "عرض المزيد من التقييمات",
    showing: "عرض",
    of: "من",
    empty: "لا توجد تقييمات مطابقة لهذا التصنيف.",
    noReviews: "لم تتم إضافة تقييمات طلاب لهذه الدورة بعد.",
    demo: "تقييمات توضيحية — ليست آراء طلاب موثّقة",
    footer: "كل تجربة تضيف شيئًا إلى الحكاية.",
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

function formatDate(value, language) {
  return new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }
  ).format(new Date(`${value}T00:00:00Z`));
}

function RatingStars({ rating, size = 16 }) {
  return (
    <span
      className="behar-reviews__stars"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={size}
          strokeWidth={1.4}
          fill={index < Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

export default function CourseReviews({ course }) {
  const rootRef = useRef(null);
  const [language, setLanguage] = useState(getLanguage);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sort, setSort] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const reviews = useMemo(
    () => getCourseReviews(course.slug),
    [course.slug]
  );

  const stats = useMemo(
    () => getReviewStatistics(reviews),
    [reviews]
  );

  const filteredReviews = useMemo(() => {
    const result = reviews.filter(
      (review) =>
        ratingFilter === 0 || review.rating === ratingFilter
    );

    return [...result].sort((a, b) => {
      if (sort === "highest") {
        return b.rating - a.rating ||
          b.date.localeCompare(a.date);
      }

      if (sort === "lowest") {
        return a.rating - b.rating ||
          b.date.localeCompare(a.date);
      }

      return b.date.localeCompare(a.date);
    });
  }, [reviews, ratingFilter, sort]);

  const visibleReviews = filteredReviews.slice(
    0,
    visibleCount
  );

  const t = copy[language];
  const isArabic = language === "ar";
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;

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
    setRatingFilter(0);
    setSort("newest");
    setVisibleCount(PAGE_SIZE);
  }, [course.slug]);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".behar-reviews__heading-line > span",
        { yPercent: 110, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".behar-reviews__intro",
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".behar-reviews__summary",
        { y: 45, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-reviews__summary",
            start: "top 85%",
            once: true,
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [course.slug, language]);

  const handleFilter = (value) => {
    setRatingFilter(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSort = (event) => {
    setSort(event.target.value);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section
      ref={rootRef}
      id="course-reviews"
      className="behar-reviews"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-reviews-heading"
    >
      <div className="behar-reviews__container">
        {/* TOPLINE */}
        <div className="behar-reviews__topline">
          <span>{t.index}</span>
          <Asterisk size={20} strokeWidth={1.4} />
        </div>

        {/* INTRO */}
        <header className="behar-reviews__intro">
          <div className="behar-reviews__eyebrow">
            <span className="behar-reviews__dot" />
            {t.eyebrow}
          </div>

          <h2
            id="behar-reviews-heading"
            className="behar-reviews__heading"
          >
            {t.heading.map((line, index) => (
              <span
                key={index}
                className={`behar-reviews__heading-line ${
                  index === 1
                    ? "behar-reviews__heading-line--accent"
                    : ""
                }`}
              >
                <span>{line}</span>
              </span>
            ))}
          </h2>

          <div className="behar-reviews__intro-bottom">
            <p>{t.intro}</p>

            <div className="behar-reviews__intro-mark">
              <Quote size={35} strokeWidth={1} />
            </div>
          </div>
        </header>

        {/* RATING SUMMARY */}
        {stats.total > 0 && (
          <div className="behar-reviews__summary">
            <div className="behar-reviews__score">
              <span className="behar-reviews__score-label">
                {t.average}
              </span>

              <strong>{stats.average.toFixed(1)}</strong>

              <RatingStars rating={stats.average} size={23} />

              <p>
                {t.basedOn} {stats.total} {t.reviews}
              </p>
            </div>

            <div className="behar-reviews__distribution">
              <div className="behar-reviews__distribution-top">
                <span>{t.distribution}</span>
                <span>01 — 05</span>
              </div>

              {stats.distribution.map((item) => (
                <button
                  key={item.stars}
                  type="button"
                  className={`behar-reviews__distribution-row ${
                    ratingFilter === item.stars
                      ? "is-active"
                      : ""
                  }`}
                  onClick={() => handleFilter(
                    ratingFilter === item.stars
                      ? 0
                      : item.stars
                  )}
                  aria-pressed={ratingFilter === item.stars}
                >
                  <span className="behar-reviews__distribution-stars">
                    {item.stars}
                    <Star size={14} fill="currentColor" />
                  </span>

                  <span className="behar-reviews__distribution-track">
                    <span
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </span>

                  <span className="behar-reviews__distribution-count">
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DEMO LABEL */}
        {stats.total > 0 && (
          <p className="behar-reviews__demo">
            {t.demo}
          </p>
        )}

        {/* REVIEWS TOOLBAR */}
        <div className="behar-reviews__toolbar">
          <div className="behar-reviews__toolbar-heading">
            <span>{t.studentVoices}</span>
            <h3>{t.all}</h3>
          </div>

          {stats.total > 0 && (
            <div className="behar-reviews__controls">
              <div
                className="behar-reviews__filter"
                aria-label={t.filter}
              >
                {[0, 5, 4, 3, 2, 1].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={
                      ratingFilter === value
                        ? "is-active"
                        : ""
                    }
                    onClick={() => handleFilter(value)}
                    aria-pressed={ratingFilter === value}
                    aria-label={
                      value === 0
                        ? t.all
                        : `${value} ${t.stars}`
                    }
                  >
                    {value === 0 ? t.all : value}
                  </button>
                ))}
              </div>

              <div className="behar-reviews__sort">
                <label htmlFor="behar-reviews-sort">
                  {t.sort}
                </label>

                <div className="behar-reviews__select-wrap">
                  <select
                    id="behar-reviews-sort"
                    value={sort}
                    onChange={handleSort}
                  >
                    <option value="newest">{t.newest}</option>
                    <option value="highest">{t.highest}</option>
                    <option value="lowest">{t.lowest}</option>
                  </select>

                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* REVIEW LIST */}
        {stats.total === 0 ? (
          <div className="behar-reviews__empty">
            <MessageCircle size={35} strokeWidth={1.2} />
            <p>{t.noReviews}</p>
          </div>
        ) : visibleReviews.length === 0 ? (
          <div className="behar-reviews__empty">
            <MessageCircle size={35} strokeWidth={1.2} />
            <p>{t.empty}</p>
          </div>
        ) : (
          <div className="behar-reviews__list">
            {visibleReviews.map((review, index) => (
              <article
                key={review.id}
                className="behar-reviews__review"
              >
                <div className="behar-reviews__review-identity">
                  <span className="behar-reviews__review-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="behar-reviews__avatar">
                    {review.initials}
                  </div>

                  <div className="behar-reviews__student">
                    <strong>{review.student}</strong>

                    <span>
                      {formatDate(review.date, language)}
                    </span>
                  </div>
                </div>

                <div className="behar-reviews__review-content">
                  <div className="behar-reviews__review-rating">
                    <RatingStars rating={review.rating} />

                    <span>{review.rating}.0 / 5.0</span>
                  </div>

                  <h4>
                    {localize(review.title, language)}
                  </h4>

                  <p>
                    {localize(review.content, language)}
                  </p>

                  <div className="behar-reviews__review-footer">
                    {review.verified && (
                      <span className="behar-reviews__verified">
                        <CheckCircle2 size={15} />
                        {t.verified}
                      </span>
                    )}

                    <span className="behar-reviews__helpful">
                      {review.helpful} {t.helpful}
                    </span>
                  </div>
                </div>

                <span className="behar-reviews__review-quote">
                  <Quote size={26} strokeWidth={1} />
                </span>
              </article>
            ))}
          </div>
        )}

        {/* LOAD MORE */}
        {visibleCount < filteredReviews.length && (
          <div className="behar-reviews__load-more">
            <p>
              {t.showing} {visibleReviews.length} {t.of}{" "}
              {filteredReviews.length}
            </p>

            <button
              type="button"
              onClick={() =>
                setVisibleCount((count) => count + PAGE_SIZE)
              }
            >
              {t.showMore}
              <Arrow size={19} />
            </button>
          </div>
        )}

        {/* BOTTOMLINE */}
        <div className="behar-reviews__bottomline">
          <span>{t.footer}</span>
          <span>05 — 07</span>
        </div>
      </div>
    </section>
  );
}
