
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowUpLeft,
  ArrowRight,
  ArrowLeft,
  Search,
  BookOpen,
  Award,
  Sparkles,
  MoveUpRight,
  Orbit,
  Play,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../../styles/how-behar-works.css";

gsap.registerPlugin(ScrollTrigger);

const copy = {
  en: {
    eyebrow: "004 / THE LEARNING ORBIT",
    heading: "Your curiosity",
    headingAccent: "has a direction.",
    description:
      "Every extraordinary journey begins somewhere. Discover what moves you, build skills that matter, and become who you want to be.",
    journey: "THE BEHAR JOURNEY",
    stages: [
      {
        number: "01",
        label: "DISCOVER",
        title: "Find what",
        accent: "moves you.",
        description:
          "Explore a universe of ideas. Discover courses that connect with your ambitions, interests, and the future you imagine.",
        detail: "Your journey starts with curiosity.",
        action: "Explore courses",
      },
      {
        number: "02",
        label: "LEARN",
        title: "Make knowledge",
        accent: "your own.",
        description:
          "Learn from inspiring educators, practice at your pace, and turn every lesson into something you can actually use.",
        detail: "Small steps. Real progress.",
        action: "Start learning",
      },
      {
        number: "03",
        label: "BECOME",
        title: "Turn potential",
        accent: "into progress.",
        description:
          "Build projects, complete challenges, track your growth, and celebrate the skills you've earned along the way.",
        detail: "Your next chapter begins here.",
        action: "Discover your future",
      },
    ],
    scroll: "SCROLL TO EXPLORE",
    bottom: "LEARNING IS NOT A DESTINATION. IT'S A DIRECTION.",
    all: "Begin your journey",
  },
  ar: {
    eyebrow: "004 / مدار التعلّم",
    heading: "فضولك",
    headingAccent: "يقودك للأمام.",
    description:
      "كل رحلة استثنائية تبدأ بخطوة. اكتشف ما يلهمك، وطوّر مهارات تصنع الفرق، واصنع مستقبلك بطريقتك.",
    journey: "رحلتك مع بحار",
    stages: [
      {
        number: "01",
        label: "اكتشف",
        title: "اكتشف ما",
        accent: "يلهمك.",
        description:
          "استكشف عالمًا من الأفكار والدورات التي تناسب طموحاتك واهتماماتك والمستقبل الذي تتطلع إليه.",
        detail: "رحلتك تبدأ بالفضول.",
        action: "استكشف الدورات",
      },
      {
        number: "02",
        label: "تعلّم",
        title: "حوّل المعرفة",
        accent: "إلى مهارة.",
        description:
          "تعلّم من مدربين ملهمين، وتدرّب بالسرعة التي تناسبك، وحوّل كل درس إلى تجربة عملية.",
        detail: "خطوات صغيرة، وتقدّم حقيقي.",
        action: "ابدأ التعلّم",
      },
      {
        number: "03",
        label: "تطوّر",
        title: "حوّل إمكانياتك",
        accent: "إلى إنجاز.",
        description:
          "أنجز المشاريع، وأكمل التحديات، وتابع تطورك، واحتفل بكل مهارة جديدة تكتسبها.",
        detail: "فصلك القادم يبدأ هنا.",
        action: "اكتشف مستقبلك",
      },
    ],
    scroll: "مرّر للاستكشاف",
    bottom: "التعلّم ليس وجهة، بل رحلة مستمرة.",
    all: "ابدأ رحلتك",
  },
};

const stageIcons = [Search, BookOpen, Award];

function getLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

export default function HowBeharWorks() {
  const sectionRef = useRef(null);
  const orbitRef = useRef(null);
  const contentRef = useRef(null);
  const progressRef = useRef(null);
  const activeRef = useRef(0);
  const changeStageRef = useRef(null);

  const [language, setLanguage] = useState(getLanguage);
  const [activeStage, setActiveStage] = useState(0);

  const isArabic = language === "ar";
  const t = copy[language];

  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;
  const Forward = isArabic ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const sync = () => {
      setLanguage(
        document.documentElement.lang === "ar" ? "ar" : "en"
      );
    };

    const observer = new MutationObserver(sync);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const orbit = orbitRef.current;
    const content = contentRef.current;

    if (!section || !orbit || !content) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const stageElements = gsap.utils.toArray(
        ".behar-works__orbit-node"
      );

      const animateStage = (index) => {
        const next = Math.max(0, Math.min(2, index));

        if (next === activeRef.current) return;

        activeRef.current = next;
        setActiveStage(next);

        if (reduceMotion) return;

        gsap.to(orbit, {
          rotation: -next * 120 * (isArabic ? -1 : 1),
          duration: 1.05,
          ease: "power3.inOut",
          overwrite: "auto",
        });

        // Counter-rotate node contents so they stay upright.
        stageElements.forEach((node) => {
          const inner = node.querySelector(
            ".behar-works__orbit-node-inner"
          );

          if (!inner) return;

          gsap.to(inner, {
            rotation: next * 120 * (isArabic ? -1 : 1),
            duration: 1.05,
            ease: "power3.inOut",
            overwrite: "auto",
          });
        });
      };

      changeStageRef.current = animateStage;

      if (!reduceMotion) {
        gsap.fromTo(
          ".behar-works__heading > *",
          { y: 35, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            stagger: 0.12,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".behar-works__heading",
              start: "top 85%",
            once: false,
            toggleActions: "restart none restart none",
            },
          }
        );

        gsap.fromTo(
          ".behar-works__experience",
          { y: 60, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".behar-works__experience",
              start: "top 85%",
            once: false,
            toggleActions: "restart none restart none",
            },
          }
        );
      }
    }, section);

    return () => {
      changeStageRef.current = null;
      ctx.revert();
    };
  }, [isArabic]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    const elements = content.querySelectorAll(
      ".behar-works__stage-animate"
    );

    const tween = gsap.fromTo(
      elements,
      { y: 20, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        stagger: 0.07,
        duration: 0.55,
        ease: "power3.out",
        overwrite: "auto",
      }
    );

    return () => {
      tween.kill();
      gsap.set(elements, {
        clearProps: "transform,opacity,visibility",
      });
    };
  }, [activeStage, language]);

  const selectStage = (index) => {
    if (index === activeRef.current) return;

    if (changeStageRef.current) {
      changeStageRef.current(index);
    } else {
      activeRef.current = index;
      setActiveStage(index);
    }
  };

  const current = t.stages[activeStage];
  const CurrentIcon = stageIcons[activeStage];

  return (
    <section
      ref={sectionRef}
      className="behar-works"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-works-title"
    >
      <div className="behar-works__ambient behar-works__ambient--one" />
      <div className="behar-works__ambient behar-works__ambient--two" />

      <div className="behar-works__container">
        <header className="behar-works__heading">
          <div className="behar-works__eyebrow">
            <span className="behar-works__eyebrow-icon">
              <Orbit size={17} />
            </span>
            <span>{t.eyebrow}</span>
            <span className="behar-works__eyebrow-line" />
          </div>

          <div className="behar-works__heading-row">
            <h2 id="behar-works-title">
              <span>{t.heading}</span>
              <em>{t.headingAccent}</em>
            </h2>

            <p>{t.description}</p>
          </div>
        </header>

        <div className="behar-works__experience">
          <div className="behar-works__visual">
            <div className="behar-works__visual-top">
              <span>{t.journey}</span>
              <span>BEHAR — 004</span>
            </div>

            <div className="behar-works__orbit-space">
              <div className="behar-works__orbit-decoration behar-works__orbit-decoration--one" />
              <div className="behar-works__orbit-decoration behar-works__orbit-decoration--two" />

              <div
                className="behar-works__orbit"
                ref={orbitRef}
              >
                {t.stages.map((stage, index) => {
                  const Icon = stageIcons[index];

                  return (
                    <button
                      key={stage.number}
                      type="button"
                      className={`behar-works__orbit-node ${
                        activeStage === index ? "is-active" : ""
                      }`}
                      style={{
                        "--node-angle": `${index * 120}deg`,
                      }}
                      onClick={() => selectStage(index)}
                      aria-label={`${stage.number} — ${stage.label}`}
                      aria-pressed={activeStage === index}
                    >
                      <span className="behar-works__orbit-node-inner">
                        <Icon size={22} strokeWidth={1.5} />
                        <small>{stage.number}</small>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="behar-works__core">
                <span className="behar-works__core-top">
                  BEHAR
                </span>

                <strong>
                  {String(activeStage + 1).padStart(2, "0")}
                  <span>/03</span>
                </strong>

                <span className="behar-works__core-bottom">
                  {current.label}
                </span>
              </div>

              <span className="behar-works__orbit-star behar-works__orbit-star--one">
                ✳
              </span>
              <span className="behar-works__orbit-star behar-works__orbit-star--two">
                +
              </span>
            </div>

            <div className="behar-works__visual-bottom">
              <div className="behar-works__progress">
                {t.stages.map((stage, index) => (
                  <button
                    key={stage.number}
                    type="button"
                    className={`behar-works__progress-item ${
                      activeStage === index ? "is-active" : ""
                    }`}
                    onClick={() => selectStage(index)}
                    aria-label={stage.label}
                    aria-pressed={activeStage === index}
                  >
                    <span>{stage.number}</span>
                    <span className="behar-works__progress-track">
                      <span />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="behar-works__panel">
            <div className="behar-works__panel-top">
              <span>0{activeStage + 1} / 03</span>
              <span className="behar-works__panel-symbol">
                <Sparkles size={19} />
              </span>
            </div>

            <div
              className="behar-works__panel-content"
              ref={contentRef}
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="behar-works__stage-animate behar-works__stage-icon">
                <CurrentIcon size={31} strokeWidth={1.2} />
              </div>

              <span className="behar-works__stage-animate behar-works__stage-label">
                THE JOURNEY / {current.label}
              </span>

              <h3 className="behar-works__stage-animate">
                <span>{current.title}</span>
                <em>{current.accent}</em>
              </h3>

              <p className="behar-works__stage-animate behar-works__stage-description">
                {current.description}
              </p>

              <div className="behar-works__stage-animate behar-works__stage-detail">
                <span className="behar-works__detail-mark">
                  ✳
                </span>
                <span>{current.detail}</span>
              </div>
            </div>

            <div className="behar-works__panel-bottom">
              <Link
                to="/courses"
                className="behar-works__stage-link"
              >
                <span>{current.action}</span>
                <span className="behar-works__stage-link-icon">
                  <Arrow size={20} strokeWidth={1.7} />
                </span>
              </Link>

              <div className="behar-works__panel-navigation">
                <button
                  type="button"
                  onClick={() =>
                    selectStage((activeStage + 2) % 3)
                  }
                  aria-label={
                    isArabic
                      ? "المرحلة السابقة"
                      : "Previous stage"
                  }
                >
                  {isArabic ? (
                    <ArrowRight size={19} />
                  ) : (
                    <ArrowLeft size={19} />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    selectStage((activeStage + 1) % 3)
                  }
                  aria-label={
                    isArabic
                      ? "المرحلة التالية"
                      : "Next stage"
                  }
                >
                  {isArabic ? (
                    <ArrowLeft size={19} />
                  ) : (
                    <ArrowRight size={19} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="behar-works__footer">
          <div className="behar-works__footer-note">
            <span>✳</span>
            <span>{t.bottom}</span>
          </div>

          <Link
            to="/courses"
            className="behar-works__footer-link"
          >
            {t.all}
            <Arrow size={19} />
          </Link>
        </footer>
      </div>
    </section>
  );
}
