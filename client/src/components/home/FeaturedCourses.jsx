
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowUpLeft,
  ArrowDownRight,
  Star,
  Clock3,
  BookOpen,
  Play,
  Sparkles,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../../styles/featured-courses.css";
import TheCompleteWebDevelopmentExperience from '../../assets/TheCompleteWebDevelopmentExperience.png'
import VisualIdentityFromIdeatoIconic from '../../assets/VisualIdentityFromIdeatoIconic.png'
import BusinessThinkingforaChangingWorld from '../../assets/BusinessThinkingforaChangingWorld.png'
import TheNewRulesofDigitalMarketing from '../../assets/TheNewRulesofDigitalMarketing.png'
import PhotographyBeyondtheOrdinary from '../../assets/PhotographyBeyondtheOrdinary.png'
import BuildBetterHabits from '../../assets/BuildBetterHabits.png'
gsap.registerPlugin(ScrollTrigger);

const courses = [
  {
    id: "course-001",
    slug: "complete-web-development",
    category: "development",
    title: {
      en: "The Complete Web Development Experience",
      ar: "رحلتك المتكاملة في تطوير الويب",
    },
    instructor: "Alex Morgan",
    role: { en: "Software Engineer", ar: "مهندس برمجيات" },
    price: 79,
    rating: 4.9,
    reviews: 1284,
    lessons: 48,
    duration: "18h 30m",
    level: { en: "Bestseller", ar: "الأكثر مبيعًا" },
    image:
      TheCompleteWebDevelopmentExperience,
    imageAlt: "Laptop displaying a web development workspace",
    accent: "#D9EF74",
  },
  {
    id: "course-002",
    slug: "visual-identity-design",
    category: "design",
    title: {
      en: "Visual Identity: From Idea to Iconic",
      ar: "الهوية البصرية من الفكرة إلى التميّز",
    },
    instructor: "Sofia Laurent",
    role: { en: "Brand Designer", ar: "مصممة هويات" },
    price: 59,
    rating: 4.8,
    reviews: 846,
    lessons: 32,
    duration: "12h 15m",
    level: { en: "Popular", ar: "رائج" },
    image:
      VisualIdentityFromIdeatoIconic,
    imageAlt: "Colorful visual design and creative stationery",
    accent: "#E9D7C5",
  },
  {
    id: "course-003",
    slug: "business-strategy",
    category: "business",
    title: {
      en: "Business Thinking for a Changing World",
      ar: "التفكير التجاري في عالم متغيّر",
    },
    instructor: "Daniel Brooks",
    role: { en: "Business Strategist", ar: "مستشار استراتيجي" },
    price: 69,
    rating: 4.9,
    reviews: 672,
    lessons: 28,
    duration: "10h 45m",
    level: { en: "New", ar: "جديد" },
    image:
      BusinessThinkingforaChangingWorld,
    imageAlt: "Business professionals working together",
    accent: "#C8DAD1",
  },
  {
    id: "course-004",
    slug: "digital-marketing-mastery",
    category: "marketing",
    title: {
      en: "The New Rules of Digital Marketing",
      ar: "القواعد الجديدة للتسويق الرقمي",
    },
    instructor: "Maya Chen",
    role: { en: "Growth Specialist", ar: "متخصصة نمو" },
    price: 49,
    rating: 4.7,
    reviews: 931,
    lessons: 36,
    duration: "14h 20m",
    level: { en: "Trending", ar: "الأكثر رواجًا" },
    image:
      TheNewRulesofDigitalMarketing,
    imageAlt: "Digital marketing analytics displayed on a laptop",
    accent: "#D7E5C5",
  },
  {
    id: "course-005",
    slug: "creative-photography",
    category: "photography",
    title: {
      en: "Photography Beyond the Ordinary",
      ar: "التصوير الفوتوغرافي خارج المألوف",
    },
    instructor: "Noah Williams",
    role: { en: "Visual Artist", ar: "فنان بصري" },
    price: 45,
    rating: 4.8,
    reviews: 513,
    lessons: 24,
    duration: "9h 10m",
    level: { en: "Editor's Pick", ar: "اختيار المحرر" },
    image:
      PhotographyBeyondtheOrdinary,
    imageAlt: "Professional camera used for creative photography",
    accent: "#E4D8C7",
  },
  {
    id: "course-006",
    slug: "personal-growth",
    category: "personal-development",
    title: {
      en: "Build Better Habits, Build a Better You",
      ar: "عادات أفضل لنسخة أفضل منك",
    },
    instructor: "Emma Davis",
    role: { en: "Learning Coach", ar: "مدربة تطوير ذاتي" },
    price: 39,
    rating: 4.9,
    reviews: 1102,
    lessons: 21,
    duration: "7h 40m",
    level: { en: "Top Rated", ar: "الأعلى تقييمًا" },
    image:
      BuildBetterHabits,
    imageAlt: "Notebook and coffee on a calm workspace",
    accent: "#DCE4D0",
  },
];

const content = {
  en: {
    eyebrow: "003 / HANDPICKED FOR YOU",
    titleOne: "Good courses.",
    titleTwo: "Great beginnings.",
    description:
      "Not just another collection of lessons. Thoughtfully selected experiences for people who want to make something of their curiosity.",
    filters: [
      { id: "all", label: "All courses" },
      { id: "development", label: "Development" },
      { id: "design", label: "Design" },
      { id: "business", label: "Business" },
      { id: "marketing", label: "Marketing" },
      { id: "photography", label: "Photography" },
      { id: "personal-development", label: "Personal Growth" },
    ],
    spotlight: "THE SPOTLIGHT",
    featured: "FEATURED COURSE",
    explore: "Discover course",
    lessons: "lessons",
    reviews: "reviews",
    viewAll: "Explore all courses",
    curated: "CURATED TO INSPIRE",
    empty: "No courses found in this category.",
    categories: {
      development: "DEVELOPMENT",
      design: "DESIGN",
      business: "BUSINESS",
      marketing: "MARKETING",
      photography: "PHOTOGRAPHY",
      "personal-development": "PERSONAL GROWTH",
    },
  },
  ar: {
    eyebrow: "003 / مختارة خصيصًا لك",
    titleOne: "دورات مميزة.",
    titleTwo: "بدايات استثنائية.",
    description:
      "ليست مجرد مجموعة من الدروس، بل تجارب تعليمية مختارة بعناية لكل شخص يريد تحويل فضوله إلى مهارة حقيقية.",
    filters: [
      { id: "all", label: "جميع الدورات" },
      { id: "development", label: "البرمجة" },
      { id: "design", label: "التصميم" },
      { id: "business", label: "الأعمال" },
      { id: "marketing", label: "التسويق" },
      { id: "photography", label: "التصوير" },
      { id: "personal-development", label: "التطوير الذاتي" },
    ],
    spotlight: "تحت الأضواء",
    featured: "دورة مميزة",
    explore: "اكتشف الدورة",
    lessons: "درسًا",
    reviews: "تقييم",
    viewAll: "استكشف جميع الدورات",
    curated: "اختيرت لتلهمك",
    empty: "لا توجد دورات في هذا التصنيف.",
    categories: {
      development: "البرمجة والتطوير",
      design: "التصميم",
      business: "الأعمال",
      marketing: "التسويق",
      photography: "التصوير",
      "personal-development": "التطوير الذاتي",
    },
  },
};

function readLanguage() {
  if (typeof window === "undefined") return "en";

  return document.documentElement.lang === "ar" ||
    localStorage.getItem("behar-language") === "ar"
    ? "ar"
    : "en";
}

function CourseMeta({ course, t }) {
  return (
    <div className="behar-course-meta">
      <span>
        <Star size={13} fill="currentColor" />
        <strong>{course.rating.toFixed(1)}</strong>
        <span>({course.reviews.toLocaleString()})</span>
      </span>

      <span>
        <Clock3 size={13} />
        {course.duration}
      </span>

      <span>
        <BookOpen size={13} />
        {course.lessons} {t.lessons}
      </span>
    </div>
  );
}

function SaudiRiyalMark() {
  return (
    <svg
      className="behar-riyal-mark"
      viewBox="0 0 34 24"
      role="img"
      aria-label="Saudi Riyal"
    >
      <text x="17" y="17" textAnchor="middle">
        ر.س
      </text>
    </svg>
  );
}

function CoursePrice({ price, className = "" }) {
  return (
    <span className={`behar-course-price ${className}`}>
      <SaudiRiyalMark />
      <span className="behar-course-price__amount">{price}</span>
      <small>SAR</small>
    </span>
  );
}

function CourseCard({ course, language, t, index }) {
  const isArabic = language === "ar";
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="behar-course-card"
      style={{ "--course-accent": course.accent }}
    >
      <div className="behar-course-card__image-wrap">
        <img
          src={course.image}
          alt={course.imageAlt}
          loading="lazy"
          decoding="async"
          className="behar-course-card__image"
        />

        <div className="behar-course-card__image-overlay" />

        <span className="behar-course-card__index">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="behar-course-card__badge">
          {course.level[language]}
        </span>

        <span className="behar-course-card__image-arrow">
          <Arrow size={22} strokeWidth={1.6} />
        </span>
      </div>

      <div className="behar-course-card__body">
        <div className="behar-course-card__category">
          <span className="behar-course-card__category-dot" />
          {t.categories[course.category]}
        </div>

        <h3>{course.title[language]}</h3>

        <div className="behar-course-card__instructor">
          <span className="behar-course-card__avatar">
            <UserRound size={17} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span>
            <strong>{course.instructor}</strong>
            <small>{course.role[language]}</small>
          </span>
        </div>

        <CourseMeta course={course} t={t} />

        <div className="behar-course-card__footer">
          <span className="behar-course-card__price">
            <CoursePrice price={course.price} />
          </span>

          <span className="behar-course-card__discover">
            {t.explore}
            <Arrow size={17} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function SpotlightCourse({ course, language, t }) {
  const isArabic = language === "ar";
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="behar-spotlight"
    >
      <div className="behar-spotlight__image">
        <img
          src={course.image}
          alt={course.imageAlt}
          loading="lazy"
          decoding="async"
        />

        <span className="behar-spotlight__image-index">
          BEHAR / 001
        </span>

        <span className="behar-spotlight__play">
          <Play size={21} fill="currentColor" />
        </span>
      </div>

      <div className="behar-spotlight__content">
        <div className="behar-spotlight__top">
          <span>
            <Sparkles size={15} />
            {t.featured}
          </span>

          <span>01 / 06</span>
        </div>

        <div className="behar-spotlight__main">
          <span className="behar-spotlight__category">
            {t.categories[course.category]}
          </span>

          <h3>{course.title[language]}</h3>

          <p>
            {course.instructor}
            <span> — {course.role[language]}</span>
          </p>
        </div>

        <CourseMeta course={course} t={t} />

        <div className="behar-spotlight__bottom">
          <span className="behar-spotlight__price">
            <CoursePrice price={course.price} />
          </span>

          <span className="behar-spotlight__action">
            <span>{t.explore}</span>
            <span className="behar-spotlight__action-icon">
              <Arrow size={21} strokeWidth={1.7} />
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedCourses() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  const [language, setLanguage] = useState(readLanguage);
  const [activeCategory, setActiveCategory] = useState("all");

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
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)")
          .matches
      ) {
        return;
      }

      gsap.fromTo(
        ".behar-featured__heading > *",
        { y: 35, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-featured__heading",
            start: "top 85%",
            once: false,
            toggleActions: "restart none restart none",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const gallery = gridRef.current;
    if (!gallery) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const context = gsap.context(() => {
      const spotlight = gallery.querySelector(".behar-spotlight");
      const spotlightImage = gallery.querySelector(".behar-spotlight__image img");
      const cards = gallery.querySelectorAll(".behar-course-card");
      const timeline = gsap.timeline({
        paused: true,
        scrollTrigger: {
          trigger: gallery,
          start: "top 82%",
          end: "bottom 18%",
          toggleActions: "restart none restart none",
        },
      });

      if (spotlight) {
        timeline.fromTo(
          spotlight,
          { clipPath: "inset(0 0 100% 0 round 0px)" },
          {
            clipPath: "inset(0 0 0% 0 round 0px)",
            duration: 0.9,
            ease: "power4.out",
          },
          0
        );
      }

      if (spotlightImage) {
        timeline.fromTo(
          spotlightImage,
          { scale: 1.16, filter: "saturate(0.65)" },
          { scale: 1, filter: "saturate(1)", duration: 1.25, ease: "power3.out" },
          0
        );
      }

      timeline.fromTo(
        cards,
        { y: 46, autoAlpha: 0, rotate: 1.5 },
        { y: 0, autoAlpha: 1, rotate: 0, duration: 0.72, stagger: 0.1, ease: "power3.out" },
        0.2
      );
    }, gallery);

    return () => context.revert();
  }, [activeCategory]);

  const t = content[language];
  const isArabic = language === "ar";
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;
  const filteredCourses =
    activeCategory === "all"
      ? courses
      : courses.filter(
          (course) => course.category === activeCategory
        );

  const [spotlight, ...remaining] = filteredCourses;

  return (
    <section
      ref={sectionRef}
      className="behar-featured"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-featured-title"
    >
      <div className="behar-featured__container">
        <header className="behar-featured__heading">
          <div className="behar-featured__eyebrow">
            <span className="behar-featured__eyebrow-symbol">
              <Sparkles size={15} />
            </span>

            <span>{t.eyebrow}</span>

            <span className="behar-featured__eyebrow-line" />
          </div>

          <div className="behar-featured__heading-row">
            <div className="behar-featured__heading-title">
              <h2 id="behar-featured-title">
                <span>{t.titleOne}</span>
                <em>{t.titleTwo}</em>
              </h2>
            </div>

            <div className="behar-featured__heading-aside">
              <span className="behar-featured__aside-number">
                03 / 10
              </span>

              <p>{t.description}</p>
            </div>
          </div>
        </header>

        <div className="behar-featured__toolbar">
          <div className="behar-featured__filter-icon">
            <SlidersHorizontal size={17} />
          </div>

          <div
            className="behar-featured__filters"
            role="group"
            aria-label={
              isArabic ? "تصفية الدورات" : "Filter courses"
            }
          >
            {t.filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={`behar-featured__filter ${
                  activeCategory === filter.id ? "is-active" : ""
                }`}
                onClick={() => setActiveCategory(filter.id)}
                aria-pressed={activeCategory === filter.id}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <span className="behar-featured__result-count">
            {String(filteredCourses.length).padStart(2, "0")} / 06
          </span>
        </div>

        <div ref={gridRef} className="behar-featured__gallery">
          {spotlight ? (
            <>
              <div className="behar-featured__spotlight-wrap">
                <div className="behar-featured__section-label">
                  <span>{t.spotlight}</span>
                  <span className="behar-featured__section-line" />
                  <ArrowDownRight size={17} />
                </div>

                <SpotlightCourse
                  course={spotlight}
                  language={language}
                  t={t}
                />
              </div>

              {remaining.length > 0 && (
                <div className="behar-featured__cards">
                  {remaining.map((course, index) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      language={language}
                      t={t}
                      index={index + 1}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="behar-featured__empty">{t.empty}</p>
          )}
        </div>

        <footer className="behar-featured__footer">
          <div className="behar-featured__footer-note">
            <span className="behar-featured__footer-asterisk">
              ✳
            </span>
            <span>{t.curated}</span>
          </div>

          <Link
            to="/courses"
            className="behar-featured__view-all"
          >
            <span>{t.viewAll}</span>

            <span className="behar-featured__view-all-icon">
              <Arrow size={22} strokeWidth={1.7} />
            </span>
          </Link>
        </footer>
      </div>
    </section>
  );
}
