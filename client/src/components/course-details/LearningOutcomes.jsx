
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowUpLeft,
  Plus,
  Minus,
  Check,
  Asterisk,
  Layers3,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { getCourseLearningOutcomes } from "../../data/courseLearningOutcomes";
import "../../styles/course-details/learning-outcomes.css";

gsap.registerPlugin(ScrollTrigger);

const copy = {
  en: {
    index: "P13.2 / THE SKILL BLUEPRINT",
    eyebrow: "WHAT YOU'LL MASTER",
    heading: ["KNOWLEDGE", "INTO ACTION."],
    section: "YOUR LEARNING OUTCOMES",
    count: "SKILLS TO DEVELOP",
    open: "Explore skill",
    close: "Close skill",
    projectLabel: "THE PRACTICAL CHALLENGE",
    deliverables: "WHAT YOU'LL CREATE",
    prerequisites: "BEFORE YOU BEGIN",
    prerequisitesNote:
      "Everything you need to prepare for the learning journey.",
    outcome: "LEARNING OUTCOME",
    footer: "LEARN IT. BUILD IT. MAKE IT YOURS.",
  },
  ar: {
    index: "P13.2 / مخطط المهارات",
    eyebrow: "ما الذي ستتقنه",
    heading: ["من المعرفة", "إلى التطبيق."],
    section: "مخرجات التعلم",
    count: "مهارات للتطوير",
    open: "استكشف المهارة",
    close: "إغلاق المهارة",
    projectLabel: "التحدي العملي",
    deliverables: "ما الذي ستنجزه",
    prerequisites: "قبل أن تبدأ",
    prerequisitesNote:
      "كل ما تحتاج إليه للاستعداد لرحلتك التعليمية.",
    outcome: "مخرج تعليمي",
    footer: "تعلّم. طبّق. اصنع شيئًا مميزًا.",
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

export default function LearningOutcomes({ course }) {
  const rootRef = useRef(null);

  const [language, setLanguage] = useState(getLanguage);
  const [expandedId, setExpandedId] = useState(null);

  const isArabic = language === "ar";
  const t = copy[language];
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;

  const data = getCourseLearningOutcomes(course.slug);
  const outcomes = data.outcomes || [];

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
    setExpandedId(null);
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
        ".behar-outcomes__heading-line > span",
        { yPercent: 110, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".behar-outcomes__intro",
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".behar-outcomes__skill",
        { y: 45, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-outcomes__skills",
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".behar-outcomes__project",
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-outcomes__project",
            start: "top 90%",
            once: true,
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [course.slug, language]);

  return (
    <section
      ref={rootRef}
      id="course-learning-outcomes"
      className="behar-outcomes"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-outcomes-heading"
    >
      <div className="behar-outcomes__container">
        {/* TOPLINE */}
        <div className="behar-outcomes__topline">
          <span>{t.index}</span>
          <Asterisk size={20} strokeWidth={1.5} />
        </div>

        {/* INTRO */}
        <header className="behar-outcomes__intro">
          <div className="behar-outcomes__eyebrow">
            <span className="behar-outcomes__dot" />
            {t.eyebrow}
          </div>

          <h2
            id="behar-outcomes-heading"
            className="behar-outcomes__heading"
          >
            {t.heading.map((line, index) => (
              <span
                key={index}
                className={`behar-outcomes__heading-line ${
                  index === 1
                    ? "behar-outcomes__heading-line--accent"
                    : ""
                }`}
              >
                <span>{line}</span>
              </span>
            ))}
          </h2>

          <div className="behar-outcomes__intro-bottom">
            <p>{localize(data.introduction, language)}</p>

            <div className="behar-outcomes__intro-symbol">
              <Layers3 size={36} strokeWidth={1} />
            </div>
          </div>
        </header>

        {/* SKILLS HEADER */}
        <div className="behar-outcomes__skills-header">
          <span>{t.section}</span>
          <span>
            {String(outcomes.length).padStart(2, "0")} / {t.count}
          </span>
        </div>

        {/* INTERACTIVE SKILLS */}
        <div className="behar-outcomes__skills">
          {outcomes.map((outcome, index) => {
            const isOpen = expandedId === outcome.id;
            const number = String(index + 1).padStart(2, "0");

            return (
              <article
                key={outcome.id}
                className={`behar-outcomes__skill ${
                  isOpen ? "is-open" : ""
                }`}
              >
                <h3 className="behar-outcomes__skill-heading">
                  <button
                    type="button"
                    className="behar-outcomes__skill-trigger"
                    onClick={() =>
                      setExpandedId(
                        isOpen ? null : outcome.id
                      )
                    }
                    aria-expanded={isOpen}
                    aria-controls={`outcome-panel-${outcome.id}`}
                  >
                    <span className="behar-outcomes__skill-number">
                      {number}
                    </span>

                    <span className="behar-outcomes__skill-title">
                      {localize(outcome.title, language)}
                    </span>

                    <span className="behar-outcomes__skill-tag">
                      {outcome.tag}
                    </span>

                    <span className="behar-outcomes__skill-icon">
                      {isOpen ? (
                        <Minus size={23} strokeWidth={1.4} />
                      ) : (
                        <Plus size={23} strokeWidth={1.4} />
                      )}
                    </span>
                  </button>
                </h3>

                <div
                  id={`outcome-panel-${outcome.id}`}
                  className="behar-outcomes__skill-panel"
                  hidden={!isOpen}
                >
                  <div className="behar-outcomes__skill-panel-inner">
                    <span>{t.outcome} / {number}</span>

                    <p>
                      {localize(
                        outcome.description,
                        language
                      )}
                    </p>

                    <Arrow size={28} strokeWidth={1} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* PRACTICAL PROJECT */}
        {data.project && (
          <div className="behar-outcomes__project">
            <div className="behar-outcomes__project-main">
              <div className="behar-outcomes__project-eyebrow">
                <Sparkles size={19} strokeWidth={1.5} />
                {t.projectLabel}
              </div>

              <span className="behar-outcomes__project-index">
                001 / {localize(data.project.eyebrow, language)}
              </span>

              <h3>
                {localize(data.project.title, language)}
              </h3>

              <p>
                {localize(
                  data.project.description,
                  language
                )}
              </p>

              <span className="behar-outcomes__project-mark">
                <Arrow size={35} strokeWidth={1} />
              </span>
            </div>

            <div className="behar-outcomes__project-side">
              <div className="behar-outcomes__project-side-top">
                <Asterisk size={28} strokeWidth={1.2} />
                <span>BEHAR / PRACTICAL LEARNING</span>
              </div>

              <h4>{t.deliverables}</h4>

              <div className="behar-outcomes__deliverables">
                {data.project.deliverables.map(
                  (deliverable, index) => (
                    <div
                      key={index}
                      className="behar-outcomes__deliverable"
                    >
                      <span>
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <p>
                        {localize(
                          deliverable,
                          language
                        )}
                      </p>

                      <Check size={18} strokeWidth={1.5} />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* PREREQUISITES */}
        <div className="behar-outcomes__prerequisites">
          <div className="behar-outcomes__prerequisites-heading">
            <span>BEFORE / 001</span>

            <h3>{t.prerequisites}</h3>

            <p>{t.prerequisitesNote}</p>
          </div>

          <div className="behar-outcomes__prerequisites-list">
            {data.prerequisites.map((item, index) => (
              <div
                key={index}
                className="behar-outcomes__prerequisite"
              >
                <span>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p>{localize(item, language)}</p>

                <Check size={20} strokeWidth={1.4} />
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOMLINE */}
        <div className="behar-outcomes__bottomline">
          <span>{t.footer}</span>
          <span>02 — 07</span>
        </div>
      </div>
    </section>
  );
}
