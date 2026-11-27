
import WishlistCourseCard from "./WishlistCourseCard";

import "../../../styles/student/wishlist/wishlist-course-grid.css";

export default function WishlistCourseGrid({
  items = [],
  language = "en",
  onRemove,
  disabled = false,
}) {
  if (!items.length) return null;

  return (
    <section
      className="wishlist-course-grid"
      aria-label={
        language === "ar"
          ? "الدورات المحفوظة"
          : "Saved courses"
      }
    >
      {items.map((item) => (
        <WishlistCourseCard
          key={item.courseId}
          item={item}
          language={language}
          onRemove={onRemove}
          disabled={disabled}
        />
      ))}
    </section>
  );
}
