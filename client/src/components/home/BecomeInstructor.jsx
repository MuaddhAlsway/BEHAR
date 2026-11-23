
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowUpLeft,
  ArrowRight,
  ArrowLeft,
  MoveUpRight,
  Sparkles,
  BookOpen,
  Layers3,
  UsersRound,
  UserRoundCog,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../../styles/become-instructor.css";

gsap.registerPlugin(ScrollTrigger);

const translations = {
  en: {
    index: "008 / FOR THE EDUCATORS",
    eyebrow: "A SPACE FOR THOSE WHO SHARE",
    heading: "Knowledge is",
    accent: "meant to move.",
    description:
      "What you've learned could be the beginning of someone else's next chapter. Turn your experience into something extraordinary.",
    imageLabel: "THE NEXT GENERATION OF EDUCATORS",
    imageIndex: "BEHAR / 2026",
    stepsLabel: "YOUR JOURNEY STARTS HERE",
    steps: [
      {
        number: "01",
        title: "Share your expertise.",
        description:
          "Bring your perspective, experience, and ideas to a community eager to learn.",
      },
      {
        number: "02",
        title: "Build your course.",
        description:
          "Shape your knowledge into meaningful lessons and practical experiences.",
      },
      {
        number: "03",
        title: "Inspire what's next.",
        description:
          "Help learners discover new skills, possibilities, and directions.",
      },
    ],
    ctaEyebrow: "YOUR NEXT CHAPTER",
    ctaTitle: "Ready to make an impact?",
    ctaDescription:
      "The world needs more people willing to share what they know.",
    cta: "Become an Instructor",
    ctaHover: "Start Teaching",
    bottom: "BEHAR / LEARNING WITHOUT BORDERS",
    scroll: "EXPLORE THE OPPORTUNITY",
  },
  ar: {
    index: "008 / للمدربين",
    eyebrow: "مساحة لمن يشاركون المعرفة",
    heading: "المعرفة خُلقت",
    accent: "لتنتقل.",
    description:
      "ما تعلّمته قد يكون بداية فصل جديد في حياة شخص آخر. حوّل خبرتك إلى تجربة تعليمية استثنائية.",
    imageLabel: "الجيل القادم من المدربين",
    imageIndex: "بحار / ٢٠٢٦",
    stepsLabel: "رحلتك تبدأ من هنا",
    steps: [
      {
        number: "٠١",
        title: "شارك خبرتك.",
        description:
          "قدّم معرفتك وتجربتك وأفكارك لمجتمع متحمّس للتعلّم.",
      },
      {
        number: "٠٢",
        title: "أنشئ دورتك.",
        description:
          "حوّل معرفتك إلى دروس وتجارب عملية ذات قيمة.",
      },
      {
        number: "٠٣",
        title: "ألهم المستقبل.",
        description:
          "ساعد المتعلمين على اكتشاف مهارات وفرص ومسارات جديدة.",
      },
    ],
    ctaEyebrow: "فصلك القادم",
    ctaTitle: "مستعد تصنع فرقًا؟",
    ctaDescription:
      "العالم يحتاج المزيد ممن يرغبون في مشاركة معرفتهم.",
    cta: "كن مدربًا",
    ctaHover: "ابدأ التدريس",
    bottom: "بحار / تعلّم بلا حدود",
    scroll: "اكتشف الفرصة",
  },
};

const stepIcons = [BookOpen, Layers3, UsersRound];

function getLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar"
    ? "ar"
    : "en";
}

export default function BecomeInstructor() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const buttonRef = useRef(null);
  const fillRef = useRef(null);
  const defaultLabelRef = useRef(null);
  const hoverLabelRef = useRef(null);
  const arrowRef = useRef(null);
  const timelineRef = useRef(null);

  const [language, setLanguage] = useState(getLanguage);

  const isArabic = language === "ar";
  const t = translations[language];

  const DiagonalArrow = isArabic ? ArrowUpLeft : ArrowUpRight;
  const ForwardArrow = isArabic ? ArrowLeft : ArrowRight;

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

  // Section reveal animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".behar-teach__eyebrow, .behar-teach__title > span, .behar-teach__intro",
        {
          y: 55,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: 0.13,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-teach__header",
            start: "top 82%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".behar-teach__image-frame",
        {
          clipPath: "inset(12% 0% 12% 0% round 22px)",
          autoAlpha: 0,
        },
        {
          clipPath: "inset(0% 0% 0% 0% round 22px)",
          autoAlpha: 1,
          duration: 1.3,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: ".behar-teach__visual",
            start: "top 80%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".behar-teach__step",
        {
          y: 45,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.16,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-teach__steps",
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".behar-teach__cta-panel",
        {
          y: 50,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-teach__cta-panel",
            start: "top 88%",
            once: true,
          },
        }
      );

      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { yPercent: -7, scale: 1.12 },
          {
            yPercent: 7,
            scale: 1.12,
            ease: "none",
            scrollTrigger: {
              trigger: ".behar-teach__visual",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  // One reversible CTA timeline
  useEffect(() => {
    const button = buttonRef.current;
    const fill = fillRef.current;
    const defaultLabel = defaultLabelRef.current;
    const hoverLabel = hoverLabelRef.current;
    const arrow = arrowRef.current;

    if (
      !button ||
      !fill ||
      !defaultLabel ||
      !hoverLabel ||
      !arrow
    ) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      gsap.set(fill, {
        scaleX: 0,
        transformOrigin: isArabic ? "left center" : "right center",
      });

      gsap.set(defaultLabel, { autoAlpha: 1 });
      gsap.set(hoverLabel, { autoAlpha: 0 });
      gsap.set(arrow, { color: "#102c2b" });

      const timeline = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power3.inOut",
          duration: reducedMotion ? 0.01 : 0.5,
        },
      });

      timeline
        .to(fill, { scaleX: 1 }, 0)
        .to(
          defaultLabel,
          { autoAlpha: 0, duration: reducedMotion ? 0.01 : 0.17 },
          0
        )
        .to(
          hoverLabel,
          { autoAlpha: 1, duration: reducedMotion ? 0.01 : 0.25 },
          reducedMotion ? 0 : 0.22
        );

      timelineRef.current = timeline;
    }, button);

    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, [isArabic]);

  const activateButton = () => {
    timelineRef.current?.play();
  };

  const deactivateButton = () => {
    timelineRef.current?.reverse();
  };

  return (
    <section
      ref={sectionRef}
      className="behar-teach"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-teach-title"
    >
      <div className="behar-teach__container">
        {/* SECTION INTRO */}
        <div className="behar-teach__topline">
          <span>{t.index}</span>
          <Sparkles size={18} strokeWidth={1.6} />
        </div>

        <header className="behar-teach__header">
          <div className="behar-teach__eyebrow">
            <span className="behar-teach__eyebrow-dot" />
            {t.eyebrow}
          </div>

          <h2
            id="behar-teach-title"
            className="behar-teach__title"
          >
            <span>{t.heading}</span>
            <span className="behar-teach__title-accent">
              {t.accent}
            </span>
          </h2>

          <p className="behar-teach__intro">
            {t.description}
          </p>
        </header>

        {/* CINEMATIC VISUAL */}
        <div className="behar-teach__visual">
          <div className="behar-teach__image-frame">
            <span
              ref={imageRef}
              className="behar-teach__image"
              aria-hidden="true"
            >
              <UserRoundCog size={148} strokeWidth={1.05} />
            </span>

            <div className="behar-teach__image-overlay" />

            <div className="behar-teach__image-corner">
              <span className="behar-teach__image-star">
                ✳
              </span>
              <span>{t.imageLabel}</span>
            </div>

            <span className="behar-teach__image-index">
              {t.imageIndex}
            </span>
          </div>

          <div className="behar-teach__floating-stamp" aria-hidden="true">
            <span>BEHAR</span>
            <MoveUpRight size={26} strokeWidth={1.4} />
            <span>ACADEMY</span>
          </div>
        </div>

        {/* TEACHING JOURNEY */}
        <div className="behar-teach__journey">
          <div className="behar-teach__journey-top">
            <span>{t.stepsLabel}</span>
            <span>01 — 03</span>
          </div>

          <div className="behar-teach__steps">
            {t.steps.map((step, index) => {
              const Icon = stepIcons[index];

              return (
                <article
                  key={step.number}
                  className="behar-teach__step"
                >
                  <div className="behar-teach__step-top">
                    <span>{step.number}</span>
                    <Icon
                      size={25}
                      strokeWidth={1.4}
                      aria-hidden="true"
                    />
                  </div>

                  <h3>{step.title}</h3>
                  <p>{step.description}</p>

                  <div className="behar-teach__step-bottom">
                    <span />
                    <ForwardArrow
                      size={19}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="behar-teach__cta-panel">
          <div className="behar-teach__cta-copy">
            <span className="behar-teach__cta-eyebrow">
              {t.ctaEyebrow}
            </span>

            <h3>{t.ctaTitle}</h3>
            <p>{t.ctaDescription}</p>
          </div>

          <Link
            ref={buttonRef}
            to="/become-an-instructor"
            className="behar-teach__button"
            onPointerEnter={activateButton}
            onPointerLeave={deactivateButton}
            onFocus={activateButton}
            onBlur={deactivateButton}
          >
            <span
              ref={fillRef}
              className="behar-teach__button-fill"
              aria-hidden="true"
            />

            <span
              ref={defaultLabelRef}
              className="behar-teach__button-label"
            >
              {t.cta}
            </span>

            <span
              ref={hoverLabelRef}
              className="behar-teach__button-hover-label"
              aria-hidden="true"
            >
              {t.ctaHover}
            </span>

            <span
              ref={arrowRef}
              className="behar-teach__button-icon"
              aria-hidden="true"
            >
              <DiagonalArrow
                size={22}
                strokeWidth={1.8}
              />
            </span>
          </Link>
        </div>

        <footer className="behar-teach__footer">
          <span>{t.bottom}</span>
          <span>{t.scroll}</span>
        </footer>
      </div>
    </section>
  );
}
