
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  Clock3,
  Heart,
  Play,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import gsap from "gsap";

import ForAll from "../../assets/ForAll.png";
import "../../styles/course-details/course-details-hero.css";

const FALLBACK_IMAGE = ForAll;
const WISHLIST_KEY = "behar-saved-courses";

const copy = {
  en: {
    back: "ALL COURSES",
    eyebrow: "BEHAR / THE KNOWLEDGE EDITION",
    edition: "THE COURSE EDITION",
    instructor: "CREATED BY",
    level: "LEVEL",
    duration: "DURATION",
    language: "LANGUAGE",
    students: "LEARNERS",
    rating: "COURSE RATING",
    hours: "HOURS",
    free: "FREE",
    currency: "SAR",
    enroll: "ENROLL IN THIS COURSE",
    preview: "EXPLORE CURRICULUM",
    save: "SAVE COURSE",
    saved: "SAVED",
    included: "YOUR LEARNING JOURNEY STARTS HERE",
    lifetime: "Lifetime access",
    flexible: "Learn at your own pace",
    note: "A NEW PERSPECTIVE BEGINS HERE.",
    levels: {
      beginner: "BEGINNER",
      intermediate: "INTERMEDIATE",
      advanced: "ADVANCED",
    },
    languages: {
      en: "ENGLISH",
      ar: "ARABIC",
    },
  },
  ar: {
    back: "جميع الدورات",
    eyebrow: "بحار / إصدار المعرفة",
    edition: "إصدار الدورة",
    instructor: "من إعداد",
    level: "المستوى",
    duration: "المدة",
    language: "اللغة",
    students: "المتعلمون",
    rating: "تقييم الدورة",
    hours: "ساعات",
    free: "مجاني",
    currency: "ر.س",
    enroll: "سجّل في هذه الدورة",
    preview: "استكشف المنهج",
    save: "احفظ الدورة",
    saved: "تم الحفظ",
    included: "رحلتك التعليمية تبدأ هنا",
    lifetime: "وصول دائم",
    flexible: "تعلم بالسرعة التي تناسبك",
    note: "من هنا تبدأ رؤية جديدة.",
    levels: {
      beginner: "مبتدئ",
      intermediate: "متوسط",
      advanced: "متقدم",
    },
    languages: {
      en: "الإنجليزية",
      ar: "العربية",
    },
  },
};

function getLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

function readWishlist() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(WISHLIST_KEY) || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function getLocalizedValue(value, language) {
  if (typeof value === "string") return value;
  return value?.[language] || value?.en || "";
}

export default function CourseDetailsHero({
  course,
  onEnroll,
}) {
  const rootRef = useRef(null);

  const [language, setLanguage] = useState(getLanguage);
  const [isSaved, setIsSaved] = useState(() =>
    readWishlist().includes(course.id)
  );
  const [imageSrc, setImageSrc] = useState(
    course.image || FALLBACK_IMAGE
  );

  const isArabic = language === "ar";
  const t = copy[language];

  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;
  const BackArrow = isArabic ? ArrowRight : ArrowLeft;

  const title = getLocalizedValue(course.title, language);
  const category = String(course.category || "course").replaceAll(
    "-",
    " "
  );
  const rating = Number(course.rating) || 0;
  const students = Number(course.students) || 0;
  const durationHours = Number(course.durationHours) || 0;
  const priceValue = Number(course.price) || 0;
  const description =
    getLocalizedValue(course.description, language) ||
    (isArabic
      ? "اكتشف تجربة تعليمية مصممة لتطوير مهاراتك وتحويل المعرفة إلى تطبيق عملي."
      : "Discover a learning experience designed to develop your skills and turn knowledge into practical work.");

  const price =
    priceValue === 0
      ? t.free
      : `${priceValue.toLocaleString()} ${t.currency}`;

  useEffect(() => {
    const syncLanguage = () => setLanguage(getLanguage());

    syncLanguage();

    const observer = new MutationObserver(syncLanguage);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setImageSrc(course.image || FALLBACK_IMAGE);
    setIsSaved(readWishlist().includes(course.id));
  }, [course.id, course.image]);

  useEffect(() => {
    const syncSaved = (event) => {
      if (event.key === WISHLIST_KEY) {
        setIsSaved(readWishlist().includes(course.id));
      }
    };

    window.addEventListener("storage", syncSaved);

    return () =>
      window.removeEventListener("storage", syncSaved);
  }, [course.id]);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".behar-detail-hero__reveal",
        { y: 35, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: 0.11,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".behar-detail-hero__cover img",
        { scale: 1.12 },
        {
          scale: 1,
          duration: 1.7,
          ease: "power3.out",
          delay: 0.15,
        }
      );

      gsap.fromTo(
        ".behar-detail-hero__ticket",
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.5,
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [course.id, language]);

  const handleWishlist = () => {
    const saved = readWishlist();

    const next = saved.includes(course.id)
      ? saved.filter((id) => id !== course.id)
      : [...saved, course.id];

    try {
      localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(next)
      );
    } catch {
      // Continue with local component state.
    }

    setIsSaved(next.includes(course.id));
  };

  const scrollToCurriculum = () => {
    document
      .getElementById("course-curriculum")
      ?.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth",
        block: "start",
      });
  };

  return (
    <section
      ref={rootRef}
      className="behar-detail-hero"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-detail-hero-title"
    >
      <div className="behar-detail-hero__container">
        {/* TOP NAVIGATION */}
        <div className="behar-detail-hero__topline">
          <Link
            to="/courses"
            className="behar-detail-hero__back"
          >
            <BackArrow size={16} strokeWidth={1.6} />
            {t.back}
          </Link>

          <span className="behar-detail-hero__edition">
            {t.eyebrow}
          </span>
        </div>

        {/* INTRO */}
        <div className="behar-detail-hero__intro">
          <div className="behar-detail-hero__intro-main">
            <div className="behar-detail-hero__eyebrow behar-detail-hero__reveal">
              <span className="behar-detail-hero__eyebrow-dot" />
              <span>{t.edition}</span>
              <span className="behar-detail-hero__eyebrow-divider" />
              <span>{category}</span>
            </div>

            <h1
              id="behar-detail-hero-title"
              className="behar-detail-hero__title behar-detail-hero__reveal"
            >
              {title}
              <span className="behar-detail-hero__title-period">
                .
              </span>
            </h1>
          </div>

          <div className="behar-detail-hero__intro-aside behar-detail-hero__reveal">
            <span className="behar-detail-hero__aside-index">
              BEHAR® / COURSE {course.id.replace(/\D/g, "") || "01"}
            </span>

            <p>{description}</p>

            <span className="behar-detail-hero__aside-mark">
              <Arrow size={30} strokeWidth={1} />
            </span>
          </div>
        </div>

        {/* METADATA STRIP */}
        <div className="behar-detail-hero__metadata behar-detail-hero__reveal">
          <div className="behar-detail-hero__meta-item">
            <span className="behar-detail-hero__meta-label">
              {t.level}
            </span>
            <strong>{t.levels[course.level] || course.level}</strong>
          </div>

          <div className="behar-detail-hero__meta-item">
            <span className="behar-detail-hero__meta-label">
              {t.duration}
            </span>
            <strong>
              <Clock3 size={16} strokeWidth={1.5} />
              {durationHours} {t.hours}
            </strong>
          </div>

          <div className="behar-detail-hero__meta-item">
            <span className="behar-detail-hero__meta-label">
              {t.language}
            </span>
            <strong>
              {t.languages[course.language] || course.language}
            </strong>
          </div>

          <div className="behar-detail-hero__meta-item">
            <span className="behar-detail-hero__meta-label">
              {t.rating}
            </span>
            <strong>
              <Star size={16} fill="currentColor" />
              {rating.toFixed(1)}
            </strong>
          </div>

          <div className="behar-detail-hero__meta-item">
            <span className="behar-detail-hero__meta-label">
              {t.students}
            </span>
            <strong>
              <Users size={16} strokeWidth={1.5} />
              {students.toLocaleString()}
            </strong>
          </div>
        </div>

        {/* COVER + ENROLLMENT TICKET */}
        <div className="behar-detail-hero__visual">
          <div className="behar-detail-hero__cover">
            <img
              src={imageSrc}
              alt=""
              fetchPriority="high"
              decoding="async"
              onError={() => {
                if (imageSrc !== FALLBACK_IMAGE) {
                  setImageSrc(FALLBACK_IMAGE);
                }
              }}
            />

            <div className="behar-detail-hero__cover-overlay" />

            <div className="behar-detail-hero__cover-top">
              <span>BEHAR / KNOWLEDGE SERIES</span>
              <span>EST. 2026</span>
            </div>

            <div className="behar-detail-hero__cover-bottom">
              <span>{t.note}</span>

              <button
                type="button"
                className="behar-detail-hero__preview"
                onClick={scrollToCurriculum}
              >
                <span>
                  <Play size={18} fill="currentColor" />
                </span>
                {t.preview}
              </button>
            </div>
          </div>

          {/* ENROLLMENT TICKET */}
          <aside className="behar-detail-hero__ticket">
            <div className="behar-detail-hero__ticket-top">
              <span>BEHAR / ENROLLMENT</span>
              <BookOpen size={21} strokeWidth={1.3} />
            </div>

            <div className="behar-detail-hero__ticket-price">
              <span>{t.edition}</span>
              <strong>{price}</strong>
            </div>

            <div className="behar-detail-hero__ticket-rule" />

            <div className="behar-detail-hero__ticket-instructor">
              <span>{t.instructor}</span>
              <strong>{course.instructor}</strong>
            </div>

            <div className="behar-detail-hero__ticket-features">
              <p>{t.included}</p>

              <span>
                <Check size={16} />
                {t.lifetime}
              </span>

              <span>
                <Check size={16} />
                {t.flexible}
              </span>
            </div>

            <button
              type="button"
              className="behar-detail-hero__enroll"
              onClick={() => onEnroll?.(course)}
            >
              <span>{t.enroll}</span>
              <Arrow size={21} strokeWidth={1.6} />
            </button>

            <button
              type="button"
              className={`behar-detail-hero__save ${
                isSaved ? "is-saved" : ""
              }`}
              onClick={handleWishlist}
              aria-pressed={isSaved}
            >
              <Heart
                size={17}
                fill={isSaved ? "currentColor" : "none"}
              />
              {isSaved ? t.saved : t.save}
            </button>

            <div className="behar-detail-hero__ticket-bottom">
              <ShieldCheck size={17} strokeWidth={1.4} />
              <span>BEHAR® / LEARN WITHOUT LIMITS</span>
            </div>
          </aside>
        </div>

        {/* BOTTOM EDITORIAL STRIP */}
        <div className="behar-detail-hero__bottomline">
          <span>BEHAR® / EDUCATION WITHOUT BOUNDARIES</span>
          <span>01 — 07</span>
        </div>
      </div>
    </section>
  );
}
