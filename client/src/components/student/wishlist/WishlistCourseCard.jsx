
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowUpRight,
  BookOpen,
  Heart,
  Star,
  Clock3,
  GraduationCap,
  ImageOff,
  Check,
} from "lucide-react";

import "../../../styles/student/wishlist/wishlist-course-card.css";

// ==========================================
// TRANSLATIONS
// ==========================================

const copy = {
  en: {
    saved: "Saved",
    savedOn: "Saved",
    view: "View course",
    remove: "Remove from wishlist",
    unavailable: "Course details unavailable",
    unavailableText:
      "This course is saved, but its catalog details are not currently available.",
    instructor: "Instructor",
    free: "Free",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    rating: "Rating",
  },

  ar: {
    saved: "محفوظة",
    savedOn: "تم الحفظ",
    view: "عرض الدورة",
    remove: "إزالة من قائمة الرغبات",
    unavailable: "تفاصيل الدورة غير متاحة",
    unavailableText:
      "هذه الدورة محفوظة، لكن تفاصيلها غير متوفرة حاليًا.",
    instructor: "المدرب",
    free: "مجاني",
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advanced: "متقدم",
    rating: "التقييم",
  },
};

// ==========================================
// HELPERS
// ==========================================

function localized(value, language) {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    const result =
      value[language] ?? value.en ?? value.ar;

    return typeof result === "string" ? result : "";
  }

  return "";
}

function displayTitle(id) {
  return String(id ?? "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatDate(value, language) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

// ==========================================
// COURSE IMAGE
// ==========================================

function getImage(course) {
  const candidates = [
    course?.thumbnail,
    course?.image,
    course?.coverImage,
    course?.cover,
  ];

  for (const candidate of candidates) {
    const value =
      typeof candidate === "string"
        ? candidate
        : candidate?.url ?? candidate?.src;

    if (
      typeof value === "string" &&
      /^(https?:\/\/|\/(?!\/))/i.test(value)
    ) {
      return value;
    }
  }

  return null;
}

// ==========================================
// INSTRUCTOR
// ==========================================

function getInstructor(course, language) {
  const instructor = course?.instructor;

  if (typeof instructor === "string") {
    return instructor;
  }

  return localized(
    instructor?.name ?? instructor?.fullName,
    language
  );
}

// ==========================================
// RATING
// ==========================================

function getRating(course) {
  const raw =
    course?.rating?.average ??
    course?.rating?.value ??
    course?.rating;

  if (raw == null || raw === "") {
    return null;
  }

  const value = Number(raw);

  return Number.isFinite(value) &&
    value >= 0 &&
    value <= 5
    ? value
    : null;
}

// ==========================================
// PRICE
// ==========================================

function getPrice(course) {
  const raw =
    course?.price?.amount ?? course?.price;

  if (raw == null || raw === "") {
    return null;
  }

  const value = Number(raw);

  return Number.isFinite(value) && value >= 0
    ? value
    : null;
}

// ==========================================
// COURSE LEVEL
// ==========================================

function getLevel(course, language) {
  const raw = localized(
    course?.level,
    language
  );

  const key = raw.toLowerCase();

  return copy[language][key] ?? raw;
}

// ==========================================
// COURSE URL
// ==========================================

function getCourseUrl(course, courseId, language) {
  const slug =
    typeof course?.slug === "string" &&
    course.slug.trim()
      ? course.slug.trim()
      : courseId;

  return `/${language}/courses/${encodeURIComponent(
    slug
  )}`;
}

// ==========================================
// COURSE PRICE FORMAT
// ==========================================

function formatPrice(price, currency, language) {
  if (price === null) {
    return "";
  }

  if (price === 0) {
    return copy[language].free;
  }

  if (!currency) {
    return String(price);
  }

  try {
    return new Intl.NumberFormat(
      language === "ar" ? "ar-SA" : "en-US",
      {
        style: "currency",
        currency,
      }
    ).format(price);
  } catch {
    return `${price} ${currency}`;
  }
}

// ==========================================
// WISHLIST COURSE CARD
// ==========================================

export default function WishlistCourseCard({
  item,
  language = "en",
  onRemove,
  disabled = false,
}) {
  const lang = language === "ar" ? "ar" : "en";
  const t = copy[lang];

  // ========================================
  // COURSE DATA
  // ========================================

  const course = item.course;
  const available = Boolean(course);

  const title = available
    ? localized(course.title, lang) ||
      displayTitle(item.courseId)
    : displayTitle(item.courseId);

  // ========================================
  // COURSE IMAGE
  // ========================================

  const image = getImage(course);

  const [failedImage, setFailedImage] =
    useState(null);

  const showImage =
    Boolean(image) &&
    failedImage !== image;

  // ========================================
  // COURSE METADATA
  // ========================================

  const instructor = getInstructor(
    course,
    lang
  );

  const rating = getRating(course);
  const price = getPrice(course);
  const level = getLevel(course, lang);

  const savedDate = formatDate(
    item.savedAt,
    lang
  );

  const currency =
    typeof course?.currency === "string"
      ? course.currency
      : typeof course?.price?.currency === "string"
        ? course.price.currency
        : null;

  const priceLabel = formatPrice(
    price,
    currency,
    lang
  );

  // ========================================
  // REMOVE HANDLER
  // ========================================

  const handleRemoveClick = () => {
    if (disabled) return;

    // P14.15.05:
    // The parent Wishlist.jsx opens the
    // RemoveWishlistDialog confirmation.
    //
    // Do not remove the course directly here.

    onRemove?.(item.courseId, title);
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <article
      className={`wishlist-course-card ${
        !available
          ? "wishlist-course-card--unresolved"
          : ""
      }`}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* ====================================
          COURSE IMAGE
      ==================================== */}

      <div className="wishlist-course-card__media">
        {showImage ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            onError={() =>
              setFailedImage(image)
            }
          />
        ) : (
          <div className="wishlist-course-card__placeholder">
            {available ? (
              <BookOpen
                size={42}
                strokeWidth={1.2}
                aria-hidden="true"
              />
            ) : (
              <ImageOff
                size={38}
                strokeWidth={1.2}
                aria-hidden="true"
              />
            )}
          </div>
        )}

        {/* SAVED BADGE */}

        <span className="wishlist-course-card__saved">
          <Heart
            size={13}
            fill="currentColor"
            aria-hidden="true"
          />
          {t.saved}
        </span>

        {/* COURSE LEVEL */}

        {level && (
          <span className="wishlist-course-card__level">
            <GraduationCap
              size={13}
              aria-hidden="true"
            />
            {level}
          </span>
        )}
      </div>

      {/* ====================================
          COURSE CONTENT
      ==================================== */}

      <div className="wishlist-course-card__content">
        {/* SAVED DATE */}

        {savedDate && (
          <span className="wishlist-course-card__date">
            <Clock3
              size={13}
              aria-hidden="true"
            />

            {t.savedOn} {savedDate}
          </span>
        )}

        {/* COURSE TITLE */}

        <h3 className="wishlist-course-card__title">
          {title}
        </h3>

        {/* INSTRUCTOR */}

        {instructor && (
          <p className="wishlist-course-card__instructor">
            {t.instructor}:{" "}
            <strong>{instructor}</strong>
          </p>
        )}

        {/* UNAVAILABLE COURSE */}

        {!available && (
          <p className="wishlist-course-card__unavailable">
            {t.unavailableText}
          </p>
        )}

        {/* ==================================
            RATING & PRICE
        ================================== */}

        {(rating !== null || priceLabel) && (
          <div className="wishlist-course-card__metadata">
            {rating !== null && (
              <span
                className="wishlist-course-card__rating"
                aria-label={`${t.rating}: ${rating}`}
              >
                <Star
                  size={15}
                  fill="currentColor"
                  aria-hidden="true"
                />

                {rating.toFixed(1)}
              </span>
            )}

            {priceLabel && (
              <span className="wishlist-course-card__price">
                {priceLabel}
              </span>
            )}
          </div>
        )}

        {/* ==================================
            COURSE ACTIONS
        ================================== */}

        <div className="wishlist-course-card__footer">
          {/* VIEW COURSE */}

          {available ? (
            <Link
              to={getCourseUrl(
                course,
                item.courseId,
                lang
              )}
              className="wishlist-course-card__view"
            >
              {t.view}

              <ArrowUpRight
                size={17}
                aria-hidden="true"
              />
            </Link>
          ) : (
            <span className="wishlist-course-card__disabled-link">
              {t.unavailable}
            </span>
          )}

          {/* REMOVE COURSE */}

          <button
            type="button"
            className="wishlist-course-card__remove"
            onClick={handleRemoveClick}
            disabled={disabled}
            aria-label={`${t.remove}: ${title}`}
            title={t.remove}
            aria-haspopup="dialog"
          >
            <Heart
              size={18}
              fill="currentColor"
              aria-hidden="true"
            />

            <Check
              className="wishlist-course-card__remove-check"
              size={11}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </article>
  );
}
