
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowUpLeft,
  Heart,
  Star,
  Clock3,
  Users,
} from "lucide-react";

import "../../styles/course-card.css";

const copy = {
  en: {
    free: "FREE",
    currency: "SAR",
    hours: "HRS",
    learners: "LEARNERS",
    explore: "EXPLORE COURSE",
    save: "Save course",
    unsave: "Remove saved course",
    levels: {
      beginner: "BEGINNER",
      intermediate: "INTERMEDIATE",
      advanced: "ADVANCED",
    },
  },
  ar: {
    free: "مجاني",
    currency: "ر.س",
    hours: "ساعة",
    learners: "متعلم",
    explore: "استكشف الدورة",
    save: "حفظ الدورة",
    unsave: "إزالة الدورة من المحفوظات",
    levels: {
      beginner: "مبتدئ",
      intermediate: "متوسط",
      advanced: "متقدم",
    },
  },
};

export default function CourseCard({
  course,
  index,
  language = "en",
  view = "grid",
  isSaved = false,
  onToggleSave,
  fallbackImage,
}) {
  const t = copy[language];
  const isArabic = language === "ar";
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;

  const title =
    typeof course.title === "string"
      ? course.title
      : course.title?.[language] || course.title?.en || "";

  const image = course.image || fallbackImage;

  const price =
    course.price === 0
      ? t.free
      : `${course.price} ${t.currency}`;

  return (
    <article
      className={`behar-course-card behar-course-card--${view}`}
    >
      <div className="behar-course-card__media">
        <Link
          to={`/courses/${course.slug}`}
          className="behar-course-card__image-link"
          aria-label={`${t.explore}: ${title}`}
        >
          <img
            src={image}
            alt=""
            loading="lazy"
            decoding="async"
            onError={(event) => {
              if (
                fallbackImage &&
                event.currentTarget.src !==
                  new URL(fallbackImage, window.location.href).href
              ) {
                event.currentTarget.src = fallbackImage;
              }
            }}
          />

          <span className="behar-course-card__number">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="behar-course-card__image-arrow">
            <Arrow size={24} strokeWidth={1.5} />
          </span>
        </Link>

        <button
          type="button"
          className={`behar-course-card__wishlist ${
            isSaved ? "is-saved" : ""
          }`}
          onClick={() => onToggleSave?.(course.id)}
          aria-label={isSaved ? t.unsave : t.save}
          aria-pressed={isSaved}
        >
          <Heart
            size={19}
            strokeWidth={1.8}
            fill={isSaved ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="behar-course-card__content">
        <div className="behar-course-card__eyebrow">
          <span>{course.category.replaceAll("-", " ")}</span>
          <span className="behar-course-card__eyebrow-dot" />
          <span>{t.levels[course.level] || course.level}</span>
        </div>

        <Link
          to={`/courses/${course.slug}`}
          className="behar-course-card__title-link"
        >
          <h3>{title}</h3>
        </Link>

        <p className="behar-course-card__instructor">
          {course.instructor}
        </p>

        <div className="behar-course-card__stats">
          <span>
            <Star size={14} fill="currentColor" />
            {course.rating.toFixed(1)}
          </span>

          <span>
            <Clock3 size={14} />
            {course.durationHours} {t.hours}
          </span>

          <span>
            <Users size={14} />
            {course.students.toLocaleString()}
          </span>
        </div>

        <div className="behar-course-card__bottom">
          <strong>{price}</strong>

          <Link
            to={`/courses/${course.slug}`}
            className="behar-course-card__explore"
            aria-label={`${t.explore}: ${title}`}
          >
            <span>{t.explore}</span>
            <Arrow size={17} strokeWidth={1.6} />
          </Link>
        </div>
      </div>
    </article>
  );
}
