
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowUpLeft,
  ArrowRight,
  ArrowLeft,
  Play,
  Sparkles,
  BookOpen,
  MoveUpRight,
} from "lucide-react";

import hero from "../../assets/Hero.png";
import "../../styles/hero.css";

const content = {
  en: {
    eyebrow: "A NEW WAY TO LEARN",
    lineOne: "Curiosity",
    lineTwo: "looks good",
    lineThree: "on you.",
    description:
      "Discover courses that move you forward. Learn from inspiring educators, build real skills, and turn every small step into something extraordinary.",
    primary: "Explore courses",
    secondary: "How BEHAR works",
    discover: "EXPLORE YOUR POTENTIAL",
    featured: "FEATURED LEARNING",
    courseType: "DESIGN / CREATIVE",
    courseTitle: "The art of thinking differently.",
    lessons: "24 lessons",
    scroll: "SCROLL TO EXPLORE",
    note: "Your next chapter begins here.",
    imageAlt:
      "Students collaborating around a laptop in a creative learning space",
    marquee: ["LEARN", "CREATE", "GROW"],
    footer: "BEHAR / LEARNING WITHOUT BORDERS",
  },

  ar: {
    eyebrow: "طريقة جديدة للتعلّم",
    lineOne: "فضولك",
    lineTwo: "يصنع",
    lineThree: "مستقبلك.",
    description:
      "اكتشف دورات تدفعك للأمام. تعلّم من مدربين ملهمين، واكتسب مهارات حقيقية، وحوّل كل خطوة صغيرة إلى إنجاز استثنائي.",
    primary: "استكشف الدورات",
    secondary: "كيف تعمل بحار؟",
    discover: "اكتشف إمكانياتك",
    featured: "تعلّم مميز",
    courseType: "التصميم والإبداع",
    courseTitle: "فن التفكير بطريقة مختلفة.",
    lessons: "٢٤ درسًا",
    scroll: "مرّر للاستكشاف",
    note: "فصلك القادم يبدأ من هنا.",
    imageAlt:
      "طلاب يتعاونون حول جهاز حاسوب داخل مساحة تعليمية إبداعية",
    marquee: ["تعلّم", "ابتكر", "تطوّر"],
    footer: "بحار / تعلّم بلا حدود",
  },
};

function readLanguage() {
  if (typeof window === "undefined") {
    return "en";
  }

  try {
    return localStorage.getItem("behar-language") === "ar"
      ? "ar"
      : "en";
  } catch {
    return "en";
  }
}

export default function Hero() {
  const [language, setLanguage] = useState(readLanguage);

  useEffect(() => {
    const syncLanguage = () => {
      const currentLanguage =
        document.documentElement.lang === "ar" ? "ar" : "en";

      setLanguage(currentLanguage);
    };

    syncLanguage();

    const observer = new MutationObserver(syncLanguage);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const isArabic = language === "ar";
  const t = content[language];

  const DiagonalArrow = isArabic ? ArrowUpLeft : ArrowUpRight;
  const ForwardArrow = isArabic ? ArrowLeft : ArrowRight;

  const marqueeItems = Array.from(
    { length: 4 },
    () => t.marquee
  );

  return (
    <section
      className="behar-hero"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-hero-title"
    >
      <div className="behar-hero__container">

        {/* =====================================
            LEFT — EDITORIAL CONTENT
        ===================================== */}

        <div className="behar-hero__content">

          {/* Eyebrow */}

          <div className="behar-hero__eyebrow">
            <span
              className="behar-hero__eyebrow-mark"
              aria-hidden="true"
            >
              <Sparkles size={15} />
            </span>

            <span>{t.eyebrow}</span>

            <span
              className="behar-hero__eyebrow-line"
              aria-hidden="true"
            />

            <span className="behar-hero__eyebrow-index">
              001 / BEHAR
            </span>
          </div>

          {/* Main headline */}

          <h1
            id="behar-hero-title"
            className="behar-hero__title"
          >
            <span>{t.lineOne}</span>

            <span className="behar-hero__title-outline">
              {t.lineTwo}
            </span>

            <span className="behar-hero__title-last">
              {t.lineThree}

              <span
                className="behar-hero__title-star"
                aria-hidden="true"
              >
                ✳
              </span>
            </span>
          </h1>

          {/* Description and CTAs */}

          <div className="behar-hero__bottom">

            <div className="behar-hero__intro">
              <span className="behar-hero__intro-number">
                01 — 03
              </span>

              <p>{t.description}</p>
            </div>

            <div className="behar-hero__actions">

              <Link
                to="/courses"
                className="behar-hero__primary"
              >
                <span>{t.primary}</span>

                <span
                  className="behar-hero__primary-icon"
                  aria-hidden="true"
                >
                  <DiagonalArrow
                    size={22}
                    strokeWidth={1.8}
                  />
                </span>
              </Link>

              <Link
                to="/about"
                className="behar-hero__secondary"
              >
                <span
                  className="behar-hero__play"
                  aria-hidden="true"
                >
                  <Play
                    size={15}
                    fill="currentColor"
                  />
                </span>

                <span>{t.secondary}</span>
              </Link>

            </div>
          </div>

          {/* Scroll indicator */}

          <div className="behar-hero__scroll">
            <span
              className="behar-hero__scroll-line"
              aria-hidden="true"
            />

            <span>{t.scroll}</span>
          </div>
        </div>

        {/* =====================================
            RIGHT — EDITORIAL IMAGE
        ===================================== */}

        <div className="behar-hero__visual">

          {/* Visual header */}

          <div className="behar-hero__visual-top">
            <span>BEHAR © 2026</span>

            <span>
              <MoveUpRight
                size={15}
                aria-hidden="true"
              />

              {t.discover}
            </span>
          </div>

          {/* Hero image */}

          <div className="behar-hero__image-frame">
            <img
              src={hero}
              alt={t.imageAlt}
              className="behar-hero__image"
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />

            {/* Image caption */}

            <div className="behar-hero__image-label">
              <span
                className="behar-hero__image-label-dot"
                aria-hidden="true"
              />

              <span>{t.note}</span>
            </div>

            {/* Editorial image index */}

            <div
              className="behar-hero__image-index"
              aria-hidden="true"
            >
              <span>01</span>
              <span>/</span>
              <span>04</span>
            </div>
          </div>

          {/* Floating course card */}

          <Link
            to="/courses"
            className="behar-hero__feature"
          >
            <div className="behar-hero__feature-top">
              <span>
                <BookOpen
                  size={15}
                  aria-hidden="true"
                />

                {t.featured}
              </span>

              <DiagonalArrow
                size={18}
                aria-hidden="true"
              />
            </div>

            <span className="behar-hero__feature-category">
              {t.courseType}
            </span>

            <h2>{t.courseTitle}</h2>

            <div className="behar-hero__feature-bottom">
              <span>{t.lessons}</span>

              <span
                className="behar-hero__feature-arrow"
                aria-hidden="true"
              >
                <ForwardArrow size={19} />
              </span>
            </div>
          </Link>

          {/* Visual footer */}

          <div className="behar-hero__visual-footer">
            <span>{t.footer}</span>
            <span>EST. 2026</span>
          </div>

        </div>
      </div>

      {/* =====================================
          BOTTOM — ANIMATED MARQUEE
      ===================================== */}

      <div
        className="behar-hero__marquee"
        aria-hidden="true"
      >
        <div className="behar-hero__marquee-track">
          {marqueeItems.map((words, index) => (
            <span key={index}>
              {words.map((word, wordIndex) => (
                <span key={wordIndex}>
                  {word}
                  <span>✳</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

    </section>
  );
}
