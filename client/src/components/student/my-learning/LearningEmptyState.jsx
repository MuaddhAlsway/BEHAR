
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  RefreshCcw,
  SearchX,
  SlidersHorizontal,
  WifiOff,
} from "lucide-react";

import "../../../styles/student/my-learning/learning-empty-state.css";

const translations = {
  en: {
    empty: {
      eyebrow: "YOUR LEARNING JOURNEY",
      title: "Every journey starts somewhere.",
      description:
        "Your learning library is ready. Explore courses, discover new skills, and begin your first chapter.",
      action: "Explore courses",
    },

    search: {
      eyebrow: "NO SEARCH RESULTS",
      title: "Nothing matched your search.",
      description:
        "Try a different keyword or clear your search to see your enrolled courses.",
      action: "Clear search",
    },

    filter: {
      eyebrow: "NO MATCHING COURSES",
      title: "Nothing here just yet.",
      description:
        "You don't have any courses in this category. Try another filter to explore your library.",
      action: "Reset filters",
    },

    error: {
      eyebrow: "SOMETHING WENT WRONG",
      title: "We couldn't load your courses.",
      description:
        "Something interrupted your learning library. Please try again.",
      action: "Try again",
    },

    loading: {
      eyebrow: "PREPARING YOUR LIBRARY",
      title: "Getting everything ready.",
      description:
        "Your enrolled courses are loading.",
    },
  },

  ar: {
    empty: {
      eyebrow: "رحلتك التعليمية",
      title: "كل رحلة تبدأ بخطوة.",
      description:
        "مكتبتك التعليمية جاهزة. استكشف الدورات، واكتسب مهارات جديدة، وابدأ أولى خطواتك.",
      action: "استكشف الدورات",
    },

    search: {
      eyebrow: "لا توجد نتائج بحث",
      title: "لم نجد نتائج مطابقة لبحثك.",
      description:
        "جرّب كلمة مختلفة أو امسح البحث لعرض دوراتك المسجلة.",
      action: "مسح البحث",
    },

    filter: {
      eyebrow: "لا توجد دورات مطابقة",
      title: "لا توجد دورات هنا حتى الآن.",
      description:
        "ليس لديك دورات في هذا التصنيف. جرّب تصفية مختلفة لاستكشاف مكتبتك.",
      action: "إعادة ضبط التصفية",
    },

    error: {
      eyebrow: "حدث خطأ",
      title: "تعذّر تحميل دوراتك.",
      description:
        "حدثت مشكلة أثناء تحميل مكتبتك التعليمية. يرجى المحاولة مجددًا.",
      action: "حاول مجددًا",
    },

    loading: {
      eyebrow: "تجهيز مكتبتك",
      title: "نجهّز كل شيء لك.",
      description:
        "جارٍ تحميل دوراتك المسجلة.",
    },
  },
};

const icons = {
  empty: BookOpen,
  search: SearchX,
  filter: SlidersHorizontal,
  error: WifiOff,
  loading: BookOpen,
};

export default function LearningEmptyState({
  type = "empty",
  language = "en",
  onReset,
  onRetry,
}) {
  const locale = language === "ar" ? "ar" : "en";
  const variant = translations[locale][type]
    ? type
    : "empty";

  const t = translations[locale][variant];
  const Icon = icons[variant];

  const isLoading = variant === "loading";
  const isEmpty = variant === "empty";
  const isError = variant === "error";

  const handleAction = () => {
    if (isError) {
      onRetry?.();
    } else {
      onReset?.();
    }
  };

  return (
    <div
      className={`behar-learning-empty behar-learning-empty--${variant}`}
      dir={locale === "ar" ? "rtl" : "ltr"}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      aria-busy={isLoading}
    >
      <div className="behar-learning-empty__visual">
        <span className="behar-learning-empty__orbit behar-learning-empty__orbit--one" />
        <span className="behar-learning-empty__orbit behar-learning-empty__orbit--two" />

        <div className="behar-learning-empty__icon">
          <Icon
            size={37}
            strokeWidth={1.3}
            aria-hidden="true"
          />
        </div>

        <span className="behar-learning-empty__visual-label">
          BEHAR / LEARNING
        </span>
      </div>

      <div className="behar-learning-empty__content">
        <span className="behar-learning-empty__eyebrow">
          <span />
          {t.eyebrow}
        </span>

        <h3>{t.title}</h3>
        <p>{t.description}</p>

        {!isLoading &&
          (isEmpty ? (
            <Link
              to="/courses"
              className="behar-learning-empty__action"
            >
              {t.action}
              <ArrowUpRight
                size={18}
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </Link>
          ) : (
            <button
              type="button"
              className="behar-learning-empty__action"
              onClick={handleAction}
              disabled={
                isError
                  ? typeof onRetry !== "function"
                  : typeof onReset !== "function"
              }
            >
              <RefreshCcw
                size={17}
                strokeWidth={1.7}
                aria-hidden="true"
              />
              {t.action}
            </button>
          ))}
      </div>

      <div
        className="behar-learning-empty__footer"
        aria-hidden="true"
      >
        <span>BEHAR EDUCATION</span>
        <span>LEARNING EXPERIENCE / 2026</span>
      </div>
    </div>
  );
}
