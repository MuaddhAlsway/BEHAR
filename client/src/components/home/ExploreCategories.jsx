
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowUpLeft,
  ArrowRight,
  ArrowLeft,
  Asterisk,
  Code2,
  Palette,
  ChartNoAxesCombined,
  Megaphone,
  Camera,
  Sprout,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../../styles/explore-categories.css";

gsap.registerPlugin(ScrollTrigger);

const translations = {
  en: {
    eyebrow: "002 / THE LEARNING ATLAS",
    titleStart: "Find your kind",
    titleEnd: "of brilliant.",
    description:
      "Six different worlds. Endless ways to grow. Pick the one that makes you curious.",
    explore: "Explore the field",
    all: "All courses",
    bottom: "YOUR CURIOSITY HAS NO LIMITS",
    categories: [
      {
        id: "development",
        number: "01",
        name: "Development",
        second: "& Code",
        tagline: "Build what doesn't exist yet.",
        micro: "THE DIGITAL WORLD",
      },
      {
        id: "design",
        number: "02",
        name: "Design",
        second: "& Creativity",
        tagline: "Give your imagination a shape.",
        micro: "CREATIVE THINKING",
      },
      {
        id: "business",
        number: "03",
        name: "Business",
        second: "& Strategy",
        tagline: "Think bigger. Move smarter.",
        micro: "THE BIG PICTURE",
      },
      {
        id: "marketing",
        number: "04",
        name: "Marketing",
        second: "& Growth",
        tagline: "Make ideas impossible to ignore.",
        micro: "MAKE AN IMPACT",
      },
      {
        id: "photography",
        number: "05",
        name: "Photography",
        second: "& Visuals",
        tagline: "Learn to see differently.",
        micro: "SEE DIFFERENTLY",
      },
      {
        id: "personal-development",
        number: "06",
        name: "Personal",
        second: "Development",
        tagline: "Become your next big thing.",
        micro: "GROW BEYOND",
      },
    ],
  },

  ar: {
    eyebrow: "002 / أطلس التعلّم",
    titleStart: "اكتشف المجال",
    titleEnd: "الذي يشبهك.",
    description:
      "ستة عوالم مختلفة، وفرص لا تنتهي للتطوّر. اختر المجال الذي يثير فضولك.",
    explore: "استكشف المجال",
    all: "جميع الدورات",
    bottom: "فضولك بلا حدود",
    categories: [
      {
        id: "development",
        number: "01",
        name: "البرمجة",
        second: "والتطوير",
        tagline: "ابنِ ما لم يوجد بعد.",
        micro: "العالم الرقمي",
      },
      {
        id: "design",
        number: "02",
        name: "التصميم",
        second: "والإبداع",
        tagline: "امنح خيالك شكلًا جديدًا.",
        micro: "التفكير الإبداعي",
      },
      {
        id: "business",
        number: "03",
        name: "الأعمال",
        second: "والاستراتيجية",
        tagline: "فكّر بشكل أكبر وتقدّم بذكاء.",
        micro: "الصورة الأكبر",
      },
      {
        id: "marketing",
        number: "04",
        name: "التسويق",
        second: "والنمو",
        tagline: "اجعل أفكارك محط الأنظار.",
        micro: "اصنع التأثير",
      },
      {
        id: "photography",
        number: "05",
        name: "التصوير",
        second: "والمرئيات",
        tagline: "تعلّم أن ترى العالم بشكل مختلف.",
        micro: "رؤية مختلفة",
      },
      {
        id: "personal-development",
        number: "06",
        name: "التطوير",
        second: "الذاتي",
        tagline: "اصنع النسخة القادمة من نفسك.",
        micro: "تطوّر بلا حدود",
      },
    ],
  },
};

const categoryIconMap = {
  development: Code2,
  design: Palette,
  business: ChartNoAxesCombined,
  marketing: Megaphone,
  photography: Camera,
  "personal-development": Sprout,
};

function getLanguage() {
  if (typeof document === "undefined") return "en";

  return document.documentElement.lang === "ar" ||
    localStorage.getItem("behar-language") === "ar"
    ? "ar"
    : "en";
}

function CategoryArtwork({ Icon }) {
  return (
    <div className="behar-category-art" aria-hidden="true">
      <span className="behar-category-art__halo" />
      <span className="behar-category-art__ring" />
      <span className="behar-category-art__icon">
        <Icon size={48} strokeWidth={1.15} />
      </span>
      <span className="behar-category-art__spark">✳</span>
    </div>
  );
}

export default function ExploreCategories() {
  const sectionRef = useRef(null);
  const [language, setLanguage] = useState(getLanguage);

  useEffect(() => {
    const syncLanguage = () => {
      setLanguage(
        document.documentElement.lang === "ar" ? "ar" : "en"
      );
    };

    const observer = new MutationObserver(syncLanguage);

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
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduceMotion) return;

      gsap.fromTo(
        ".behar-categories__heading > *",
        { y: 36, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-categories__heading",
            start: "top 85%",
            once: false,
            toggleActions: "restart none restart none",
          },
        }
      );

      gsap.fromTo(
        ".behar-category-card",
        { y: 65, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-categories__grid",
            start: "top 85%",
            once: false,
            toggleActions: "restart none restart none",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [language]);

  const isArabic = language === "ar";
  const t = translations[language];

  const DiagonalArrow = isArabic ? ArrowUpLeft : ArrowUpRight;
  const ForwardArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <section
      ref={sectionRef}
      className="behar-categories"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-categories-title"
    >
      <div className="behar-categories__container">
        <div className="behar-categories__heading">
          <div className="behar-categories__eyebrow">
            <span className="behar-categories__eyebrow-icon">
              <Asterisk size={17} strokeWidth={1.8} />
            </span>
            <span>{t.eyebrow}</span>
            <span className="behar-categories__eyebrow-line" />
          </div>

          <div className="behar-categories__heading-main">
            <div className="behar-categories__title-wrap">
              <h2 id="behar-categories-title">
                <span>{t.titleStart}</span>
                <em>{t.titleEnd}</em>
              </h2>
            </div>

            <div className="behar-categories__heading-aside">
              <p>{t.description}</p>

              <Link
                to="/courses"
                className="behar-categories__all-link"
              >
                <span>{t.all}</span>
                <DiagonalArrow size={19} strokeWidth={1.7} />
              </Link>
            </div>
          </div>
        </div>

        <div className="behar-categories__grid">
          {t.categories.map((category, index) => {
            const Icon =
              categoryIconMap[category.icon || category.id] || Asterisk;

            return (
              <Link
                key={category.id}
                to={`/courses?category=${encodeURIComponent(category.id)}`}
                className={`behar-category-card behar-category-card--${index + 1}`}
                aria-label={`${category.name} ${category.second}`}
              >
                <div className="behar-category-card__top">
                  <span className="behar-category-card__number">
                    {category.number} / 06
                  </span>

                  <span className="behar-category-card__arrow">
                    <DiagonalArrow
                      size={20}
                      strokeWidth={1.6}
                    />
                  </span>
                </div>

                <CategoryArtwork Icon={Icon} />

                <div className="behar-category-card__content">
                  <div className="behar-category-card__micro">
                    <Icon size={14} strokeWidth={1.6} />
                    <span>{category.micro}</span>
                  </div>

                  <h3>
                    <span>{category.name}</span>
                    <span>{category.second}</span>
                  </h3>

                  <p>{category.tagline}</p>
                </div>

                <div className="behar-category-card__bottom">
                  <span>{t.explore}</span>
                  <ForwardArrow size={17} strokeWidth={1.6} />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="behar-categories__footer">
          <span className="behar-categories__footer-star">✳</span>
          <span>{t.bottom}</span>
          <span className="behar-categories__footer-line" />
          <span>BEHAR / 002</span>
        </div>
      </div>
    </section>
  );
}
