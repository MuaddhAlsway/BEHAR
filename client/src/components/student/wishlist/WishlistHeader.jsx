
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookHeart,
  ChevronRight,
  Heart,
} from "lucide-react";

import "../../../styles/student/wishlist/wishlist-header.css";

const content = {
  en: {
    dashboard: "Dashboard",
    breadcrumb: "Wishlist",
    eyebrow: "STUDENT WORKSPACE / COLLECTION",
    title: "My Wishlist",
    description:
      "Keep the courses that inspire you close. Your next learning milestone starts here.",
    saved: "Saved courses",
    explore: "Explore courses",
  },
  ar: {
    dashboard: "لوحة التحكم",
    breadcrumb: "قائمة الرغبات",
    eyebrow: "مساحة الطالب / المجموعة",
    title: "قائمة الرغبات",
    description:
      "احتفظ بالدورات التي تلهمك بالقرب منك. خطوتك التعليمية القادمة تبدأ من هنا.",
    saved: "الدورات المحفوظة",
    explore: "استكشف الدورات",
  },
};

export default function WishlistHeader({
  language = "en",
  count = 0,
}) {
  const lang = language === "ar" ? "ar" : "en";
  const dictionary = content[lang];

  return (
    <header className="wishlist-header">
      <nav
        className="wishlist-header__breadcrumb"
        aria-label={
          lang === "ar" ? "مسار التنقل" : "Breadcrumb"
        }
      >
        <Link to={`/${lang}/student`}>
          {dictionary.dashboard}
        </Link>

        <ChevronRight size={14} aria-hidden="true" />

        <span aria-current="page">
          {dictionary.breadcrumb}
        </span>
      </nav>

      <div className="wishlist-header__layout">
        <div className="wishlist-header__copy">
          <span className="wishlist-header__eyebrow">
            <span className="wishlist-header__eyebrow-line" />
            {dictionary.eyebrow}
          </span>

          <div className="wishlist-header__heading">
            <h1>{dictionary.title}</h1>

            <span
              className="wishlist-header__count"
              aria-label={`${count} ${dictionary.saved}`}
            >
              {count.toLocaleString(
                lang === "ar" ? "ar-SA" : "en-US"
              )}
            </span>
          </div>

          <p>{dictionary.description}</p>

          <div className="wishlist-header__actions">
            <Link
              to={`/${lang}/courses`}
              className="wishlist-header__primary-action"
            >
              {dictionary.explore}
              <ArrowUpRight size={17} />
            </Link>

            <span className="wishlist-header__saved-indicator">
              <Heart
                size={15}
                fill="currentColor"
                aria-hidden="true"
              />
              {count} {dictionary.saved}
            </span>
          </div>
        </div>

        <div
          className="wishlist-header__art"
          aria-hidden="true"
        >
          <span className="wishlist-header__art-ring wishlist-header__art-ring--outer" />
          <span className="wishlist-header__art-ring wishlist-header__art-ring--inner" />

          <div className="wishlist-header__art-card wishlist-header__art-card--back">
            <span />
            <span />
            <span />
          </div>

          <div className="wishlist-header__art-card wishlist-header__art-card--front">
            <BookHeart size={48} strokeWidth={1.25} />
            <span className="wishlist-header__art-card-line" />
            <span className="wishlist-header__art-card-line wishlist-header__art-card-line--short" />
          </div>

          <div className="wishlist-header__art-heart">
            <Heart size={20} fill="currentColor" />
          </div>

          <span className="wishlist-header__art-dot wishlist-header__art-dot--one" />
          <span className="wishlist-header__art-dot wishlist-header__art-dot--two" />
        </div>
      </div>
    </header>
  );
}
