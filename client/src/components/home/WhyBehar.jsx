
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowUpLeft,
  ArrowRight,
  ArrowLeft,
  BookOpenCheck,
  Layers3,
  Clock3,
  TrendingUp,
  Asterisk,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import whybehas from '../../assets/whybehas.png'
import "../../styles/why-behar.css";

gsap.registerPlugin(ScrollTrigger);

const copy = {
  en: {
    eyebrow: "005 / THE BEHAR DIFFERENCE",
    heading: "Learning should",
    accent: "take you somewhere.",
    intro:
      "Not just another course platform. A place where curiosity becomes confidence, knowledge becomes action, and every lesson moves you forward.",
    imageLabel: "A DIFFERENT WAY TO GROW",
    imageCaption: "Made for minds that never stop exploring.",
    discover: "Discover your next step",
    footer: "BEYOND THE CLASSROOM / INTO THE REAL WORLD",
    principles: [
      {
        number: "01",
        title: "Learn from people who do.",
        description:
          "Go beyond theory with educators who bring practical knowledge and meaningful experience.",
      },
      {
        number: "02",
        title: "Make something real.",
        description:
          "Turn ideas into action through exercises, projects, and practical learning experiences.",
      },
      {
        number: "03",
        title: "Your pace. Your path.",
        description:
          "Make progress on your schedule, revisit lessons, and learn in a way that works for you.",
      },
      {
        number: "04",
        title: "See how far you've come.",
        description:
          "Track your learning journey, celebrate milestones, and recognize the skills you've built.",
      },
    ],
  },
  ar: {
    eyebrow: "005 / ما يميز بحار",
    heading: "التعلّم بداية",
    accent: "لشيء أكبر.",
    intro:
      "بحار ليست مجرد منصة دورات، بل مساحة يتحول فيها الفضول إلى ثقة، والمعرفة إلى تطبيق، وكل درس إلى خطوة نحو الأمام.",
    imageLabel: "طريقة مختلفة للتطوّر",
    imageCaption: "صُممت للعقول التي لا تتوقف عن الاستكشاف.",
    discover: "اكتشف خطوتك القادمة",
    footer: "من التعلّم إلى التطبيق في العالم الحقيقي",
    principles: [
      {
        number: "01",
        title: "تعلّم من أصحاب الخبرة.",
        description:
          "تجاوز الجانب النظري وتعلّم من مدربين يمتلكون معرفة عملية وتجارب حقيقية.",
      },
      {
        number: "02",
        title: "حوّل المعرفة إلى إنجاز.",
        description:
          "طبّق ما تتعلّمه من خلال التمارين والمشاريع والتجارب التعليمية العملية.",
      },
      {
        number: "03",
        title: "تعلّم بطريقتك.",
        description:
          "تقدّم وفق جدولك الخاص، وأعد مشاهدة الدروس، واختر أسلوب التعلّم المناسب لك.",
      },
      {
        number: "04",
        title: "شاهد تطوّرك.",
        description:
          "تابع رحلتك التعليمية، واحتفل بإنجازاتك، واكتشف المهارات التي اكتسبتها.",
      },
    ],
  },
};

const icons = [BookOpenCheck, Layers3, Clock3, TrendingUp];

function readLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

export default function WhyBehar() {
  const sectionRef = useRef(null);
  const [language, setLanguage] = useState(readLanguage);
  const [active, setActive] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isArabic = language === "ar";
  const t = copy[language];
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;
  const Forward = isArabic ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const sync = () => {
      setLanguage(document.documentElement.lang === "ar" ? "ar" : "en");
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
    if (!section) return;

    const ctx = gsap.context(() => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduced) return;

      gsap.fromTo(
        ".behar-why__intro > *",
        { y: 35, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.12,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-why__intro",
            start: "top 85%",
            once: false,
            toggleActions: "restart none restart none",
          },
        }
      );

      gsap.fromTo(
        ".behar-why__photo",
        { clipPath: "inset(12% 0 12% 0)", scale: 1.06 },
        {
          clipPath: "inset(0% 0 0% 0)",
          scale: 1,
          duration: 1.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-why__composition",
            start: "top 80%",
            once: false,
            toggleActions: "restart none restart none",
          },
        }
      );

      gsap.fromTo(
        ".behar-why__principle",
        { y: 25, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.12,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-why__principles",
            start: "top 85%",
            once: false,
            toggleActions: "restart none restart none",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="behar-why"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-why-title"
    >
      <div className="behar-why__container">
        <header className="behar-why__intro">
          <div className="behar-why__eyebrow">
            <Asterisk size={18} />
            <span>{t.eyebrow}</span>
            <span className="behar-why__eyebrow-rule" />
          </div>

          <div className="behar-why__heading-grid">
            <h2 id="behar-why-title">
              <span>{t.heading}</span>
              <em>{t.accent}</em>
            </h2>

            <div className="behar-why__intro-aside">
              <span className="behar-why__aside-mark">✳</span>
              <p>{t.intro}</p>
            </div>
          </div>
        </header>

        <div className="behar-why__composition">
          <div className="behar-why__visual">
            <div
              className={`behar-why__photo ${
                imageLoaded ? "is-loaded" : "is-loading"
              }`}
            >
              <img
                src={whybehas}
                alt={
                  isArabic
                    ? "مساحة عمل إبداعية مضاءة بضوء طبيعي"
                    : "Creative workspace filled with natural daylight"
                }
                loading="lazy"
                decoding="async"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            </div>

            <div className="behar-why__photo-shade" />

            <div className="behar-why__photo-top">
              <span>BEHAR / 005</span>
              <Arrow size={22} strokeWidth={1.4} />
            </div>

            <div className="behar-why__photo-bottom">
              <span>{t.imageLabel}</span>
              <p>{t.imageCaption}</p>
            </div>

            <div className="behar-why__orbit-badge" aria-hidden="true">
              <span className="behar-why__orbit-text">
                LEARN · CREATE · GROW ·
              </span>
              <span className="behar-why__orbit-center">
                <Asterisk size={36} strokeWidth={1.3} />
              </span>
            </div>
          </div>

          <div className="behar-why__principles">
            <div className="behar-why__principles-heading">
              <span>{isArabic ? "مبادئ التعلّم" : "OUR LEARNING PRINCIPLES"}</span>
              <span>01 — 04</span>
            </div>

            {t.principles.map((principle, index) => {
              const Icon = icons[index];

              return (
                <button
                  key={principle.number}
                  type="button"
                  className={`behar-why__principle ${
                    active === index ? "is-active" : ""
                  }`}
                  onClick={() => setActive(index)}
                  aria-expanded={active === index}
                  aria-label={principle.title}
                >
                  <span className="behar-why__principle-number">
                    {principle.number}
                  </span>

                  <span className="behar-why__principle-main">
                    <span className="behar-why__principle-title">
                      {principle.title}
                    </span>

                    <span className="behar-why__principle-description">
                      {principle.description}
                    </span>
                  </span>

                  <span className="behar-why__principle-icon">
                    <Icon size={23} strokeWidth={1.5} />
                  </span>
                </button>
              );
            })}

            <Link to="/courses" className="behar-why__cta">
              <span>{t.discover}</span>
              <span className="behar-why__cta-arrow">
                <Forward size={22} strokeWidth={1.7} />
              </span>
            </Link>
          </div>
        </div>

        <footer className="behar-why__footer">
          <span>✳</span>
          <span>{t.footer}</span>
          <span className="behar-why__footer-rule" />
          <span>BEHAR / 2026</span>
        </footer>
      </div>
    </section>
  );
}
