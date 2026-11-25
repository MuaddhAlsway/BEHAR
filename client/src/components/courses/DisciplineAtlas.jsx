
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowUpLeft, Asterisk, RotateCcw } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { courseCategories } from "../../data/courseCategories";
import "../../styles/discipline-atlas.css";
import LazyImage from "../home/LazyImage";

gsap.registerPlugin(ScrollTrigger);

const copy = {
  en: {
    index: "P12.2 / THE DISCIPLINE ATLAS",
    eyebrow: "A WORLD OF POSSIBILITIES",
    heading: ["FIND YOUR", "FASCINATION."],
    description:
      "Every discipline opens a different door. Find the one that makes you curious.",
    directory: "THE DISCIPLINE DIRECTORY",
    all: "All Courses",
    reset: "Reset selection",
    count: "COURSES",
    empty: "COMING SOON",
    explore: "EXPLORE DISCIPLINE",
    footer: "BEHAR® / KNOWLEDGE HAS NO BOUNDARIES",
    hint: "SELECT A DISCIPLINE TO EXPLORE",
  },
  ar: {
    index: "P12.2 / أطلس التخصصات",
    eyebrow: "عالم من الإمكانيات",
    heading: ["اكتشف", "شغفك."],
    description:
      "كل تخصص يفتح لك آفاقًا مختلفة. اكتشف المجال الذي يثير فضولك.",
    directory: "دليل التخصصات",
    all: "جميع الدورات",
    reset: "إعادة التحديد",
    count: "دورات",
    empty: "قريبًا",
    explore: "استكشف التخصص",
    footer: "بحار / المعرفة بلا حدود",
    hint: "اختر تخصصًا للاستكشاف",
  },
};

function getLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

export default function DisciplineAtlas({
  selectedCategory = "all",
  onCategoryChange,
  courseCounts = {},
}) {
  const sectionRef = useRef(null);
  const previewRef = useRef(null);
  const previewImageRef = useRef(null);
  const moveXRef = useRef(null);
  const moveYRef = useRef(null);

  const [language, setLanguage] = useState(getLanguage);
  const [hoveredId, setHoveredId] = useState(null);
  const [previewEnabled, setPreviewEnabled] = useState(false);

  const isArabic = language === "ar";
  const t = copy[language];
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;

  const hoveredCategory = courseCategories.find(
    (category) => category.id === hoveredId
  );

  const totalCount = Object.values(courseCounts).reduce(
    (sum, value) => sum + (Number(value) || 0),
    0
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
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    const sync = () => setPreviewEnabled(media.matches);
    sync();

    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
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
        ".behar-atlas__heading-line > span",
        { yPercent: 110, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.14,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".behar-atlas__intro",
            start: "top 82%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".behar-atlas__row",
        { y: 35, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-atlas__directory",
            start: "top 83%",
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [language]);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview || !previewEnabled) return;

    const xTo = gsap.quickTo(preview, "x", {
      duration: 0.45,
      ease: "power3.out",
    });

    const yTo = gsap.quickTo(preview, "y", {
      duration: 0.45,
      ease: "power3.out",
    });

    moveXRef.current = xTo;
    moveYRef.current = yTo;

    return () => {
      moveXRef.current = null;
      moveYRef.current = null;
    };
  }, [previewEnabled]);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;

    if (hoveredId && previewEnabled) {
      gsap.to(preview, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.35,
        ease: "power3.out",
        overwrite: true,
      });
    } else {
      gsap.to(preview, {
        autoAlpha: 0,
        scale: 0.92,
        duration: 0.25,
        ease: "power2.out",
        overwrite: true,
      });
    }
  }, [hoveredId, previewEnabled]);

  const movePreview = (event) => {
    if (!previewEnabled) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    moveXRef.current?.(x);
    moveYRef.current?.(y);
  };

  const selectCategory = (id) => {
    if (typeof onCategoryChange === "function") {
      onCategoryChange(id);
    }
  };

  const handleRowEnter = (id, event) => {
    if (!previewEnabled) return;

    const rect = sectionRef.current.getBoundingClientRect();

    gsap.set(previewRef.current, {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });

    setHoveredId(id);
  };

  return (
    <section
      ref={sectionRef}
      className="behar-atlas"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-atlas-heading"
    >
      <div className="behar-atlas__container">
        <div className="behar-atlas__topline">
          <span>{t.index}</span>
          <Asterisk size={20} strokeWidth={1.5} />
        </div>

        {/* EDITORIAL INTRO */}
        <header className="behar-atlas__intro">
          <div className="behar-atlas__eyebrow">
            <span className="behar-atlas__dot" />
            {t.eyebrow}
          </div>

          <h2 id="behar-atlas-heading" className="behar-atlas__heading">
            {t.heading.map((line, index) => (
              <span
                key={index}
                className={`behar-atlas__heading-line ${
                  index === 1
                    ? "behar-atlas__heading-line--accent"
                    : ""
                }`}
              >
                <span>{line}</span>
              </span>
            ))}
          </h2>

          <div className="behar-atlas__intro-bottom">
            <p>{t.description}</p>
            <span>{t.hint}</span>
          </div>
        </header>

        {/* DIRECTORY HEADER */}
        <div className="behar-atlas__directory-header">
          <span>{t.directory}</span>

          <button
            type="button"
            className={`behar-atlas__reset ${
              selectedCategory === "all"
                ? "behar-atlas__reset--active"
                : ""
            }`}
            onClick={() => selectCategory("all")}
            aria-pressed={selectedCategory === "all"}
          >
            <RotateCcw size={14} strokeWidth={1.6} />
            {t.all}
            <span>{String(totalCount).padStart(2, "0")}</span>
          </button>
        </div>

        {/* CATEGORY LIST */}
        <div
          className="behar-atlas__directory"
          onPointerMove={movePreview}
          onPointerLeave={() => setHoveredId(null)}
        >
          {courseCategories.map((category) => {
            const isActive = selectedCategory === category.id;
            const count = Number(courseCounts[category.id]) || 0;

            return (
              <button
                key={category.id}
                type="button"
                className={`behar-atlas__row ${
                  isActive ? "behar-atlas__row--active" : ""
                }`}
                onPointerEnter={(event) =>
                  handleRowEnter(category.id, event)
                }
                onFocus={() => setHoveredId(null)}
                onClick={() => selectCategory(category.id)}
                aria-pressed={isActive}
                style={{ "--atlas-accent": category.accent }}
              >
                <span className="behar-atlas__row-number">
                  {category.number}
                </span>

                <span className="behar-atlas__row-content">
                  <span className="behar-atlas__row-title">
                    {category.title[language]}
                  </span>

                  <span className="behar-atlas__row-description">
                    {category.description[language]}
                  </span>
                </span>

                <span className="behar-atlas__row-count">
                  {count > 0
                    ? `${String(count).padStart(2, "0")} ${t.count}`
                    : t.empty}
                </span>

                <span className="behar-atlas__row-arrow">
                  <Arrow size={30} strokeWidth={1.5} />
                </span>
              </button>
            );
          })}
        </div>

        <div className="behar-atlas__bottomline">
          <span>{t.footer}</span>
          <span>06 / ∞</span>
        </div>
      </div>

      {/* FLOATING HOVER PREVIEW */}
      <div
        ref={previewRef}
        className="behar-atlas__preview"
        aria-hidden="true"
      >
        {hoveredCategory && (
          <>
            <div
              className="behar-atlas__preview-image"
              style={{
                backgroundColor: hoveredCategory.accent,
              }}
            >
              <LazyImage
                ref={previewImageRef}
                src={hoveredCategory.image}
                alt=""
                loading="lazy"
              />
            </div>

            <div className="behar-atlas__preview-caption">
              <span>{hoveredCategory.number}</span>
              <span>{hoveredCategory.title[language]}</span>
              <Arrow size={17} strokeWidth={1.5} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
