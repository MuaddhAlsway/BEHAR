
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowUpLeft,
  Search,
  Asterisk,
  MoveDown,
  Compass,
  Lightbulb,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../../styles/course-discovery-hero.css";

gsap.registerPlugin(ScrollTrigger);

const content = {
  en: {
    index: "BEHAR / THE KNOWLEDGE ATLAS",
    eyebrow: "YOUR NEXT DISCOVERY STARTS HERE",
    title: ["CURIOSITY", "HAS NO", "LIMITS."],
    description:
      "Explore new perspectives, develop valuable skills, and discover what you're capable of becoming.",
    searchPlaceholder: "What will you learn next?",
    searchLabel: "Search courses",
    searchButton: "Discover",
    trending: "POPULAR EXPLORATIONS",
    topics: [
      "Web Development",
      "Design",
      "Business",
      "Artificial Intelligence",
    ],
    imageLabels: ["EXPLORE", "CREATE"],
    stamp: "KEEP LEARNING",
    scroll: "SCROLL TO EXPLORE",
    courseCount: "COURSES TO DISCOVER",
    imageAlt: [
      "Creative learner exploring new ideas",
      "Creative workspace and learning materials",
    ],
  },
  ar: {
    index: "بحار / أطلس المعرفة",
    eyebrow: "اكتشافك القادم يبدأ هنا",
    title: ["الفضول", "ليس له", "حدود."],
    description:
      "اكتشف آفاقًا جديدة، وطوّر مهاراتك، وتعرّف على الإمكانيات التي يمكنك الوصول إليها.",
    searchPlaceholder: "ماذا تريد أن تتعلم اليوم؟",
    searchLabel: "البحث عن الدورات",
    searchButton: "اكتشف",
    trending: "مواضيع شائعة",
    topics: [
      "تطوير الويب",
      "التصميم",
      "الأعمال",
      "الذكاء الاصطناعي",
    ],
    imageLabels: ["اكتشف", "أبدع"],
    stamp: "واصل التعلم",
    scroll: "مرر للاستكشاف",
    courseCount: "دورة لاستكشافها",
    imageAlt: [
      "متعلم مبدع يستكشف أفكارًا جديدة",
      "مساحة عمل إبداعية وأدوات تعليمية",
    ],
  },
};

function getLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar"
    ? "ar"
    : "en";
}

export default function CourseDiscoveryHero({
  courseCount = 0,
  onSearch,
  onCategoryChange,
}) {
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  const [language, setLanguage] = useState(getLanguage);
  const [query, setQuery] = useState("");

  const isArabic = language === "ar";
  const t = content[language];
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;

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

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".behar-discovery__title-line > span",
        { yPercent: 110, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.13,
          ease: "power4.out",
        }
      );

      gsap.fromTo(
        ".behar-discovery__intro-copy",
        { y: 35, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          delay: 0.4,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".behar-discovery__visual",
        { clipPath: "inset(15% 0% 15% 0%)", autoAlpha: 0 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          autoAlpha: 1,
          duration: 1.25,
          delay: 0.3,
          ease: "power3.inOut",
        }
      );

      gsap.fromTo(
        ".behar-discovery__image--main .behar-discovery__icon",
        { scale: 1.16 },
        {
          scale: 1,
          duration: 1.6,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".behar-discovery__image--secondary",
        { y: 100, rotate: 12, autoAlpha: 0 },
        {
          y: 0,
          rotate: -8,
          autoAlpha: 1,
          duration: 1.3,
          delay: 0.65,
          ease: "power3.out",
        }
      );

      gsap.to(".behar-discovery__visual-inner", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [language]);

  const submitSearch = (event) => {
    event.preventDefault();
    const value = query.trim();

    if (typeof onSearch === "function") {
      onSearch(value);
      return;
    }

    const params = new URLSearchParams();
    if (value) params.set("search", value);

    navigate(
      `/courses${params.toString() ? `?${params}` : ""}#catalog`
    );
  };

  const selectTopic = (index) => {
    const categoryIds = [
      "development",
      "design",
      "business",
      "artificial-intelligence",
    ];
    const category = categoryIds[index];

    setQuery(t.topics[index]);

    if (typeof onCategoryChange === "function") {
      setQuery("");
      onCategoryChange(category);
      return;
    }

    if (typeof onSearch === "function") {
      onSearch("");
    } else {
      navigate(
        `/courses?category=${encodeURIComponent(category)}#catalog`
      );
    }
  };

  return (
    <section
      ref={sectionRef}
      className="behar-discovery"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-discovery-title"
    >
      <div className="behar-discovery__container">
        <div className="behar-discovery__topline">
          <span>{t.index}</span>
          <Asterisk size={20} strokeWidth={1.5} />
        </div>

        <div className="behar-discovery__intro">
          <div className="behar-discovery__eyebrow">
            <span className="behar-discovery__dot" />
            {t.eyebrow}
          </div>

          <h1
            id="behar-discovery-title"
            className="behar-discovery__title"
          >
            {t.title.map((line, index) => (
              <span
                className={`behar-discovery__title-line ${
                  index === 2
                    ? "behar-discovery__title-line--accent"
                    : ""
                }`}
                key={index}
              >
                <span>{line}</span>
              </span>
            ))}
          </h1>

          <div className="behar-discovery__intro-bottom">
            <p className="behar-discovery__intro-copy">
              {t.description}
            </p>

            <div className="behar-discovery__counter">
              <strong>{courseCount.toLocaleString()}</strong>
              <span>{t.courseCount}</span>
            </div>
          </div>
        </div>

        {/* EDITORIAL VISUAL */}
        <div className="behar-discovery__visual">
          <div className="behar-discovery__visual-inner">
            <div className="behar-discovery__image behar-discovery__image--main">
              <span className="behar-discovery__icon" aria-hidden="true">
                <Compass size={188} strokeWidth={1.05} />
              </span>
            </div>

            <div className="behar-discovery__image behar-discovery__image--secondary">
              <span className="behar-discovery__icon" aria-hidden="true">
                <Lightbulb size={76} strokeWidth={1.05} />
              </span>
              <span className="behar-discovery__image-label">{t.imageLabels[1]}</span>
            </div>

            <span className="behar-discovery__visual-outline" aria-hidden="true">
              B
            </span>

            <div className="behar-discovery__stamp">
              <Asterisk size={30} strokeWidth={1.4} />
              <span>{t.stamp}</span>
            </div>

            <span className="behar-discovery__visual-index">
              001 / {t.imageLabels[0]}
            </span>
          </div>
        </div>

        {/* SEARCH OVERLAPS THE VISUAL */}
        <div className="behar-discovery__search-area">
          <form
            className="behar-discovery__search"
            role="search"
            onSubmit={submitSearch}
          >
            <Search size={25} strokeWidth={1.6} aria-hidden="true" />

            <label
              htmlFor="behar-course-search"
              className="behar-discovery__sr-only"
            >
              {t.searchLabel}
            </label>

            <input
              id="behar-course-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.searchPlaceholder}
              autoComplete="off"
            />

            <button type="submit">
              <span>{t.searchButton}</span>
              <Arrow size={21} strokeWidth={1.7} />
            </button>
          </form>

          <div className="behar-discovery__trending">
            <span className="behar-discovery__trending-label">
              {t.trending}
            </span>

            <div className="behar-discovery__topics">
              {t.topics.map((topic, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectTopic(index)}
                  className="behar-discovery__topic"
                >
                  {topic}
                  <Arrow size={13} strokeWidth={1.5} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="behar-discovery__bottomline">
          <span>BEHAR® / DISCOVER YOUR NEXT CHAPTER</span>

          <a href="#catalog">
            {t.scroll}
            <MoveDown size={17} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </section>
  );
}
