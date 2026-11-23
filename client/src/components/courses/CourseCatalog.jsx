
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  LayoutGrid,
  List,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Asterisk,
  SearchX,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import CourseCard from "./CourseCard";
import ForAll from "../../assets/ForAll.png";
import "../../styles/course-catalog.css";

gsap.registerPlugin(ScrollTrigger);

const PAGE_SIZE = 9;
const WISHLIST_KEY = "behar-saved-courses";
const VIEW_KEY = "behar-course-view";

const FALLBACK_IMAGE = ForAll;

const copy = {
  en: {
    index: "P12.5 / THE LEARNING ARCHIVE",
    eyebrow: "THE COMPLETE COLLECTION",
    heading: ["EXPLORE THE", "UNEXPLORED."],
    description:
      "Every great journey starts with curiosity. Find the knowledge that moves you forward.",
    available: "COURSES TO DISCOVER",
    grid: "Grid view",
    list: "List view",
    showing: "SHOWING",
    of: "OF",
    page: "PAGE",
    previous: "PREVIOUS",
    next: "NEXT",
    emptyTitle: "NOTHING HERE. YET.",
    emptyDescription:
      "Try another search or adjust your filters. Your next discovery might be one click away.",
    reset: "RESET FILTERS",
    footer: "BEHAR® / THE LEARNING ARCHIVE",
  },
  ar: {
    index: "P12.5 / أرشيف التعلم",
    eyebrow: "المجموعة الكاملة",
    heading: ["اكتشف", "ما لم تكتشفه."],
    description:
      "كل رحلة عظيمة تبدأ بالفضول. اكتشف المعرفة التي تدفعك نحو أهدافك.",
    available: "دورة متاحة للاستكشاف",
    grid: "عرض الشبكة",
    list: "عرض القائمة",
    showing: "عرض",
    of: "من",
    page: "صفحة",
    previous: "السابق",
    next: "التالي",
    emptyTitle: "لا توجد نتائج حاليًا.",
    emptyDescription:
      "جرب البحث عن موضوع آخر أو تعديل خيارات التصفية.",
    reset: "إعادة ضبط الفلاتر",
    footer: "بحار / أرشيف التعلم",
  },
};

function getLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

function readSavedCourses() {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(WISHLIST_KEY) || "[]"
    );

    return Array.isArray(parsed)
      ? parsed.filter((id) => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export default function CourseCatalog({
  courses = [],
  onResetFilters,
}) {
  const sectionRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [language, setLanguage] = useState(getLanguage);
  const [view, setView] = useState(() => {
    try {
      return localStorage.getItem(VIEW_KEY) === "list"
        ? "list"
        : "grid";
    } catch {
      return "grid";
    }
  });

  const [savedCourses, setSavedCourses] = useState(
    readSavedCourses
  );

  const isArabic = language === "ar";
  const t = copy[language];

  const totalPages = Math.max(
    1,
    Math.ceil(courses.length / PAGE_SIZE)
  );

  const rawPage = Number(searchParams.get("page"));
  const requestedPage =
    Number.isSafeInteger(rawPage) && rawPage > 0
      ? rawPage
      : 1;

  const page = Math.min(requestedPage, totalPages);

  const visibleCourses = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return courses.slice(start, start + PAGE_SIZE);
  }, [courses, page]);

  const startResult =
    courses.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;

  const endResult = Math.min(
    page * PAGE_SIZE,
    courses.length
  );

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
    const handleStorage = (event) => {
      if (event.key === WISHLIST_KEY) {
        setSavedCourses(readSavedCourses());
      }
    };

    window.addEventListener("storage", handleStorage);

    return () =>
      window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".behar-catalog__heading-line > span",
        { yPercent: 110, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".behar-catalog__intro",
            start: "top 85%",
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [language]);

  const handleViewChange = (nextView) => {
    setView(nextView);

    try {
      localStorage.setItem(VIEW_KEY, nextView);
    } catch {
      // Continue without persistence.
    }
  };

  const handleToggleSave = (courseId) => {
    setSavedCourses((previous) => {
      const next = previous.includes(courseId)
        ? previous.filter((id) => id !== courseId)
        : [...previous, courseId];

      try {
        localStorage.setItem(
          WISHLIST_KEY,
          JSON.stringify(next)
        );
      } catch {
        // Wishlist still works in memory.
      }

      return next;
    });
  };

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;

    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);

        if (nextPage === 1) {
          next.delete("page");
        } else {
          next.set("page", String(nextPage));
        }

        return next;
      },
      { preventScrollReset: true }
    );

    sectionRef.current?.scrollIntoView({
      behavior: window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  ).filter(
    (number) =>
      number === 1 ||
      number === totalPages ||
      Math.abs(number - page) <= 1
  );

  return (
    <section
      id="catalog"
      ref={sectionRef}
      className="behar-catalog"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-catalog-heading"
    >
      <div className="behar-catalog__container">
        <div className="behar-catalog__topline">
          <span>{t.index}</span>
          <Asterisk size={20} strokeWidth={1.5} />
        </div>

        {/* EDITORIAL INTRO */}
        <header className="behar-catalog__intro">
          <div className="behar-catalog__eyebrow">
            <span className="behar-catalog__dot" />
            {t.eyebrow}
          </div>

          <h2
            id="behar-catalog-heading"
            className="behar-catalog__heading"
          >
            {t.heading.map((line, index) => (
              <span
                key={index}
                className={`behar-catalog__heading-line ${
                  index === 1
                    ? "behar-catalog__heading-line--accent"
                    : ""
                }`}
              >
                <span>{line}</span>
              </span>
            ))}
          </h2>

          <div className="behar-catalog__intro-bottom">
            <p>{t.description}</p>

            <div className="behar-catalog__total">
              <strong>{courses.length.toLocaleString()}</strong>
              <span>{t.available}</span>
            </div>
          </div>
        </header>

        {/* RESULTS TOOLBAR */}
        <div className="behar-catalog__toolbar">
          <div className="behar-catalog__results-label">
            <span className="behar-catalog__live-dot" />

            <span>
              {t.showing} {startResult}–{endResult} {t.of}{" "}
              {courses.length}
            </span>
          </div>

          <div
            className="behar-catalog__view-switch"
            role="group"
            aria-label={isArabic ? "طريقة العرض" : "View mode"}
          >
            <button
              type="button"
              className={view === "grid" ? "is-active" : ""}
              onClick={() => handleViewChange("grid")}
              aria-label={t.grid}
              aria-pressed={view === "grid"}
            >
              <LayoutGrid size={19} strokeWidth={1.6} />
            </button>

            <button
              type="button"
              className={view === "list" ? "is-active" : ""}
              onClick={() => handleViewChange("list")}
              aria-label={t.list}
              aria-pressed={view === "list"}
            >
              <List size={20} strokeWidth={1.6} />
            </button>
          </div>
        </div>

        {/* COURSE RESULTS */}
        {visibleCourses.length > 0 ? (
          <div
            className={`behar-catalog__courses behar-catalog__courses--${view}`}
          >
            {visibleCourses.map((course, index) => (
              <CourseCard
                key={course.id}
                course={course}
                index={(page - 1) * PAGE_SIZE + index}
                language={language}
                view={view}
                isSaved={savedCourses.includes(course.id)}
                onToggleSave={handleToggleSave}
                fallbackImage={FALLBACK_IMAGE}
              />
            ))}
          </div>
        ) : (
          <div className="behar-catalog__empty" role="status">
            <div className="behar-catalog__empty-icon">
              <SearchX size={43} strokeWidth={1.1} />
            </div>

            <h3>{t.emptyTitle}</h3>
            <p>{t.emptyDescription}</p>

            <button
              type="button"
              onClick={() => onResetFilters?.()}
            >
              <RotateCcw size={17} />
              {t.reset}
            </button>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <nav
            className="behar-catalog__pagination"
            aria-label={
              isArabic ? "صفحات الدورات" : "Course pages"
            }
          >
            <button
              type="button"
              className="behar-catalog__page-arrow"
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
              aria-label={t.previous}
            >
              {isArabic ? (
                <ArrowRight size={22} />
              ) : (
                <ArrowLeft size={22} />
              )}
            </button>

            <div className="behar-catalog__page-numbers">
              {pageNumbers.map((number, index) => (
                <span key={number} className="behar-catalog__page-slot">
                  {index > 0 &&
                    number - pageNumbers[index - 1] > 1 && (
                      <span className="behar-catalog__ellipsis">
                        …
                      </span>
                    )}

                  <button
                    type="button"
                    className={
                      page === number ? "is-active" : ""
                    }
                    onClick={() => changePage(number)}
                    aria-label={`${t.page} ${number}`}
                    aria-current={
                      page === number ? "page" : undefined
                    }
                  >
                    {number}
                  </button>
                </span>
              ))}
            </div>

            <button
              type="button"
              className="behar-catalog__page-arrow"
              onClick={() => changePage(page + 1)}
              disabled={page === totalPages}
              aria-label={t.next}
            >
              {isArabic ? (
                <ArrowLeft size={22} />
              ) : (
                <ArrowRight size={22} />
              )}
            </button>
          </nav>
        )}

        <div className="behar-catalog__bottomline">
          <span>{t.footer}</span>
          <span>05 / 05</span>
        </div>
      </div>
    </section>
  );
}
