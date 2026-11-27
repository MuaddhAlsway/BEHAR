
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Heart,
  RotateCcw,
  SearchX,
} from "lucide-react";

const translations = {
  en: {
    emptyTitle: "Your collection starts here.",
    emptyDescription:
      "Explore the course catalog and save the courses you want to learn.",
    noResultsTitle: "No matching courses.",
    noResultsDescription:
      "Try a different search or reset your filters.",
    explore: "Explore courses",
    reset: "Clear filters",
  },
  ar: {
    emptyTitle: "مجموعتك تبدأ من هنا.",
    emptyDescription:
      "استكشف الدورات واحفظ الدورات التي ترغب في تعلمها.",
    noResultsTitle: "لا توجد دورات مطابقة.",
    noResultsDescription:
      "جرّب بحثًا آخر أو أعد ضبط خيارات التصفية.",
    explore: "استكشف الدورات",
    reset: "مسح الفلاتر",
  },
};

export default function WishlistCourseEmpty({
  language = "en",
  variant = "empty",
  onClearFilters,
}) {
  const lang = language === "ar" ? "ar" : "en";
  const t = translations[lang];

  const isFiltered = variant === "filtered";

  return (
    <section className="wishlist-empty">
      <div className="wishlist-empty__art" aria-hidden="true">
        <div className="wishlist-empty__orbit wishlist-empty__orbit--one" />
        <div className="wishlist-empty__orbit wishlist-empty__orbit--two" />

        <div className="wishlist-empty__symbol">
          {isFiltered ? (
            <SearchX size={40} strokeWidth={1.4} />
          ) : (
            <Heart size={40} strokeWidth={1.4} />
          )}
        </div>

        <span className="wishlist-empty__spark wishlist-empty__spark--one" />
        <span className="wishlist-empty__spark wishlist-empty__spark--two" />
      </div>

      <h2>
        {isFiltered ? t.noResultsTitle : t.emptyTitle}
      </h2>

      <p>
        {isFiltered
          ? t.noResultsDescription
          : t.emptyDescription}
      </p>

      {isFiltered ? (
        <button
          type="button"
          className="wishlist-empty__button"
          onClick={onClearFilters}
        >
          <RotateCcw size={17} />
          {t.reset}
        </button>
      ) : (
        <Link
          to={`/${lang}/courses`}
          className="wishlist-empty__button"
        >
          {t.explore}
          <ArrowUpRight size={18} />
        </Link>
      )}
    </section>
  );
}
