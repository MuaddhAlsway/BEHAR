
import { useEffect, useRef, useState } from "react";
import {
  SlidersHorizontal,
  ArrowUpRight,
  ArrowUpLeft,
  X,
  RotateCcw,
  Asterisk,
  ChevronDown,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  courseFilterOptions,
  defaultCourseFilters,
} from "../../data/courseFilterOptions";

import "../../styles/course-filters.css";

gsap.registerPlugin(ScrollTrigger);

const copy = {
  en: {
    index: "P12.3 / THE FILTER STUDIO",
    eyebrow: "CURATE YOUR DISCOVERY",
    title: ["FIND YOUR", "PERFECT FIT."],
    description:
      "A little more specific. A lot more relevant. Shape your learning journey around what matters to you.",
    fields: {
      level: "SKILL LEVEL",
      price: "PRICE",
      language: "LANGUAGE",
      duration: "DURATION",
      rating: "MINIMUM RATING",
      sort: "SORT BY",
    },
    active: "ACTIVE FILTERS",
    clear: "Clear all filters",
    reset: "Reset filters",
    results: "MATCHING COURSES",
    noFilters: "No active filters",
    explore: "EXPLORE RESULTS",
    footer: "BEHAR® / A MORE PERSONAL WAY TO LEARN",
  },
  ar: {
    index: "P12.3 / استوديو التصفية",
    eyebrow: "خصّص رحلة اكتشافك",
    title: ["اعثر على", "ما يناسبك."],
    description:
      "خيارات أكثر دقة، ونتائج أكثر ملاءمة. اكتشف الدورات التي تناسب أهدافك واهتماماتك.",
    fields: {
      level: "المستوى",
      price: "السعر",
      language: "اللغة",
      duration: "المدة",
      rating: "الحد الأدنى للتقييم",
      sort: "الترتيب حسب",
    },
    active: "الفلاتر النشطة",
    clear: "مسح جميع الفلاتر",
    reset: "إعادة ضبط الفلاتر",
    results: "الدورات المطابقة",
    noFilters: "لا توجد فلاتر نشطة",
    explore: "استكشف النتائج",
    footer: "بحار / تجربة تعلم تناسبك",
  },
};

const filterKeys = [
  "level",
  "price",
  "language",
  "duration",
  "rating",
  "sort",
];

function getLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

export default function CourseFilters({
  filters = defaultCourseFilters,
  onFilterChange,
  onReset,
  resultCount = 0,
}) {
  const sectionRef = useRef(null);
  const [language, setLanguage] = useState(getLanguage);

  const isArabic = language === "ar";
  const t = copy[language];
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;

  const activeFilters = filterKeys
    .filter((key) => key !== "sort")
    .filter(
      (key) =>
        (filters[key] ?? defaultCourseFilters[key]) !==
        defaultCourseFilters[key]
    )
    .map((key) => {
      const value = filters[key];

      const option = courseFilterOptions[key].find(
        (item) => item.value === value
      );

      return {
        key,
        value,
        label: option?.[language] ?? value,
      };
    });

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
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".behar-filters__title-line > span",
        { yPercent: 110, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.14,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".behar-filters__intro",
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".behar-filters__field",
        { y: 35, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-filters__controls",
            start: "top 85%",
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [language]);

  const updateFilter = (key, value) => {
    onFilterChange?.(key, value);
  };

  const removeFilter = (key) => {
    onFilterChange?.(key, defaultCourseFilters[key]);
  };

  const scrollToResults = () => {
    document.getElementById("catalog")?.scrollIntoView({
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="behar-filters"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-filters-heading"
    >
      <div className="behar-filters__container">
        <div className="behar-filters__topline">
          <span>{t.index}</span>
          <Asterisk size={20} strokeWidth={1.5} />
        </div>

        {/* EDITORIAL INTRO */}
        <header className="behar-filters__intro">
          <div className="behar-filters__eyebrow">
            <span className="behar-filters__dot" />
            {t.eyebrow}
          </div>

          <h2
            id="behar-filters-heading"
            className="behar-filters__title"
          >
            {t.title.map((line, index) => (
              <span
                key={index}
                className={`behar-filters__title-line ${
                  index === 1
                    ? "behar-filters__title-line--accent"
                    : ""
                }`}
              >
                <span>{line}</span>
              </span>
            ))}
          </h2>

          <div className="behar-filters__intro-bottom">
            <p>{t.description}</p>

            <div className="behar-filters__result-count">
              <strong>{resultCount.toLocaleString()}</strong>
              <span>{t.results}</span>
            </div>
          </div>
        </header>

        {/* FILTER CONTROLS */}
        <div className="behar-filters__panel">
          <div className="behar-filters__panel-header">
            <div>
              <SlidersHorizontal
                size={19}
                strokeWidth={1.7}
                aria-hidden="true"
              />
              <span>{t.eyebrow}</span>
            </div>

            <button
              type="button"
              className="behar-filters__reset"
              onClick={() => onReset?.()}
            >
              <RotateCcw
                size={15}
                strokeWidth={1.7}
                aria-hidden="true"
              />
              {t.reset}
            </button>
          </div>

          <div className="behar-filters__controls">
            {filterKeys.map((key) => (
              <div
                key={key}
                className={`behar-filters__field ${
                  key === "sort"
                    ? "behar-filters__field--sort"
                    : ""
                }`}
              >
                <label htmlFor={`behar-filter-${key}`}>
                  <span>{t.fields[key]}</span>
                  <span className="behar-filters__field-index">
                    {String(filterKeys.indexOf(key) + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>
                </label>

                <div className="behar-filters__select-wrap">
                  <select
                    id={`behar-filter-${key}`}
                    value={
                      filters[key] ?? defaultCourseFilters[key]
                    }
                    onChange={(event) =>
                      updateFilter(key, event.target.value)
                    }
                  >
                    {courseFilterOptions[key].map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option[language]}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={18}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE FILTERS */}
        <div className="behar-filters__active">
          <div className="behar-filters__active-heading">
            <span>{t.active}</span>
            <span className="behar-filters__active-number">
              {String(activeFilters.length).padStart(2, "0")}
            </span>
          </div>

          <div className="behar-filters__chips">
            {activeFilters.length > 0 ? (
              activeFilters.map((filter) => (
                <button
                  type="button"
                  key={filter.key}
                  className="behar-filters__chip"
                  onClick={() => removeFilter(filter.key)}
                  aria-label={`${t.clear}: ${filter.label}`}
                >
                  <span>{filter.label}</span>
                  <X
                    size={14}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>
              ))
            ) : (
              <span className="behar-filters__empty">
                {t.noFilters}
              </span>
            )}
          </div>
        </div>

        {/* RESULTS ACTION */}
        <div className="behar-filters__action">
          <div className="behar-filters__action-count">
            <strong>{resultCount.toLocaleString()}</strong>
            <span>{t.results}</span>
          </div>

          <button
            type="button"
            className="behar-filters__explore"
            onClick={scrollToResults}
          >
            <span>{t.explore}</span>
            <span className="behar-filters__explore-icon">
              <Arrow
                size={22}
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </span>
          </button>
        </div>

        <div className="behar-filters__bottomline">
          <span>{t.footer}</span>
          <span>03 / 05</span>
        </div>
      </div>
    </section>
  );
}
