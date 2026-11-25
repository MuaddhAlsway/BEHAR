
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowUpLeft,
  ArrowRight,
  ArrowLeft,
  Asterisk,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactDeveloper from '../../assets/ReactDeveloper.png'
import UIUX from '../../assets/UIUX.png'
import AICREATIVE from '../../assets/AICREATIVE.png'
import ForAll from '../../assets/ForAll.png'
import { courses } from "../../data/courses";
import LazyImage from "../home/LazyImage";
import "../../styles/featured-collection.css";

gsap.registerPlugin(ScrollTrigger);

const featuredSlugs = [
  "modern-react-development",
  "ui-ux-design-foundations",
  "ai-for-creative-professionals",
];

const editorialImages = {
  "modern-react-development":
   ReactDeveloper,
  "ui-ux-design-foundations":
    UIUX,
  "ai-for-creative-professionals":
    AICREATIVE,
};

const copy = {
  en: {
    index: "P12.4 / THE EDITOR'S PICKS",
    eyebrow: "HANDPICKED FOR THE CURIOUS",
    heading: ["NOT JUST", "COURSES.", "NEW WORLDS."],
    description:
      "Some courses teach you a skill. Others change the way you see the world. These are the ones worth discovering.",
    collection: "THE CURATED COLLECTION",
    selected: "SELECTED LEARNING EXPERIENCES",
    explore: "EXPLORE COURSE",
    viewAll: "DISCOVER ALL COURSES",
    students: "LEARNERS",
    free: "FREE",
    currency: "SAR",
    hours: "HRS",
    footer: "BEHAR® / LEARN BEYOND THE EXPECTED",
    label: "EDITOR'S SELECTION",
  },
  ar: {
    index: "P12.4 / اختيارات المحرر",
    eyebrow: "مختارة لأصحاب الفضول",
    heading: ["ليست مجرد", "دورات.", "بل عوالم جديدة."],
    description:
      "بعض الدورات تعلمك مهارة، وأخرى تغير نظرتك للعالم. اكتشف تجارب تعليمية تستحق اهتمامك.",
    collection: "المجموعة المختارة",
    selected: "تجارب تعليمية منتقاة",
    explore: "استكشف الدورة",
    viewAll: "اكتشف جميع الدورات",
    students: "متعلم",
    free: "مجاني",
    currency: "ر.س",
    hours: "ساعة",
    footer: "بحار / تعلم خارج حدود المألوف",
    label: "اختيارات المحرر",
  },
};

function getLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

function getTitle(course, language) {
  if (typeof course.title === "string") return course.title;
  return course.title?.[language] || course.title?.en || "";
}

function formatPrice(course, t) {
  return course.price === 0
    ? t.free
    : `${course.price} ${t.currency}`;
}

function FeaturedCourse({
  course,
  index,
  language,
  t,
  isArabic,
}) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;

  const title = getTitle(course, language);
  const image =
    course.featuredImage ||
    course.image ||
    editorialImages[course.slug] ||
    ForAll;

  useEffect(() => {
    const card = cardRef.current;
    const imageElement = imageRef.current;

    if (!card || !imageElement) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageElement,
        { scale: 1.18 },
        {
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        card.querySelector(".behar-featured__card-info"),
        { y: 35, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, card);

    return () => ctx.revert();
  }, []);

  const number = String(index + 1).padStart(2, "0");

  return (
    <article
      ref={cardRef}
      className={`behar-featured__card behar-featured__card--${
        index + 1
      }`}
    >
      <Link
        to={`/courses/${course.slug}`}
        className="behar-featured__card-link"
        aria-label={`${t.explore}: ${title}`}
      >
        <div className="behar-featured__image-wrap">
          <LazyImage
            ref={imageRef}
            src={image}
            alt=""
            loading="lazy"
            decoding="async"
            onError={(event) => {
              if (event.currentTarget.src.endsWith(ForAll)) return;
              event.currentTarget.src = ForAll;
            }}
          />

          <div className="behar-featured__image-overlay" />

          <div className="behar-featured__image-top">
            <span className="behar-featured__image-number">
              {number} / 03
            </span>

            <span className="behar-featured__image-label">
              {t.label}
            </span>
          </div>

          <span className="behar-featured__image-arrow">
            <Arrow size={27} strokeWidth={1.5} />
          </span>

          {index === 0 && (
            <div className="behar-featured__image-stamp">
              <Asterisk size={25} strokeWidth={1.2} />
              <span>BEHAR</span>
              <span>SELECTED</span>
            </div>
          )}

          <span className="behar-featured__image-bottom">
            {course.category.replaceAll("-", " ").toUpperCase()}
          </span>
        </div>

        <div className="behar-featured__card-info">
          <div className="behar-featured__meta">
            <span>
              {course.durationHours} {t.hours}
            </span>
            <span className="behar-featured__meta-divider" />
            <span>{formatPrice(course, t)}</span>
          </div>

          <h3>{title}</h3>

          <div className="behar-featured__card-footer">
            <span>{course.instructor}</span>

            <span className="behar-featured__card-cta">
              {t.explore}
              <Arrow size={16} strokeWidth={1.6} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function FeaturedCollection({ courses: catalogCourses }) {
  const sectionRef = useRef(null);
  const [language, setLanguage] = useState(getLanguage);

  const isArabic = language === "ar";
  const t = copy[language];
  const DirectionArrow = isArabic ? ArrowLeft : ArrowRight;

  const featuredCourses = useMemo(() => {
    if (Array.isArray(catalogCourses)) {
      return catalogCourses;
    }

    return featuredSlugs
      .map((slug) => courses.find((course) => course.slug === slug))
      .filter(Boolean);
  }, [catalogCourses]);

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

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".behar-featured__heading-line > span",
        { yPercent: 110, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.14,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".behar-featured__intro",
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".behar-featured__description",
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-featured__intro",
            start: "top 80%",
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [language]);

  if (!featuredCourses.length) return null;

  return (
    <section
      ref={sectionRef}
      className="behar-featured"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-featured-heading"
    >
      <div className="behar-featured__container">
        {/* TOPLINE */}
        <div className="behar-featured__topline">
          <span>{t.index}</span>
          <Asterisk size={20} strokeWidth={1.5} />
        </div>

        {/* EDITORIAL INTRO */}
        <header className="behar-featured__intro">
          <div className="behar-featured__eyebrow">
            <span className="behar-featured__dot" />
            {t.eyebrow}
          </div>

          <h2
            id="behar-featured-heading"
            className="behar-featured__heading"
          >
            {t.heading.map((line, index) => (
              <span
                key={index}
                className={`behar-featured__heading-line ${
                  index === 2
                    ? "behar-featured__heading-line--accent"
                    : ""
                }`}
              >
                <span>{line}</span>
              </span>
            ))}
          </h2>

          <div className="behar-featured__intro-bottom">
            <p className="behar-featured__description">
              {t.description}
            </p>

            <div className="behar-featured__intro-symbol">
              <Sparkles size={36} strokeWidth={1} />
            </div>
          </div>
        </header>

        {/* COLLECTION HEADER */}
        <div className="behar-featured__collection-header">
          <span>{t.collection}</span>
          <span>{t.selected} / 003</span>
        </div>

        {/* ASYMMETRIC COURSE EXHIBITION */}
        <div className="behar-featured__gallery">
          {featuredCourses.map((course, index) => (
            <FeaturedCourse
              key={course.id}
              course={course}
              index={index}
              language={language}
              t={t}
              isArabic={isArabic}
            />
          ))}

          <div
            className="behar-featured__gallery-note"
            aria-hidden="true"
          >
            <span>BEHAR</span>
            <Asterisk size={35} strokeWidth={1} />
            <span>BEYOND</span>
            <span>ORDINARY</span>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="behar-featured__bottom">
          <div className="behar-featured__bottom-copy">
            <span>BEHAR / 2026</span>
            <p>{t.footer}</p>
          </div>

          <a
            href="#catalog"
            className="behar-featured__view-all"
          >
            <span>{t.viewAll}</span>

            <span className="behar-featured__view-all-icon">
              <DirectionArrow size={25} strokeWidth={1.5} />
            </span>
          </a>
        </div>
      </div>

      <div className="behar-featured__background-word" aria-hidden="true">
        DISCOVER
      </div>
    </section>
  );
}
