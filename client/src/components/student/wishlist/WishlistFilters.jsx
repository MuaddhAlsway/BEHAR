
import {
  Check,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";

import "../../../styles/student/wishlist/wishlist-filters.css";

const translations = {
  en: {
    title: "Refine your collection",
    description: "Find exactly what you want to learn.",
    category: "Category",
    level: "Skill level",
    price: "Price",
    allCategories: "All categories",
    allLevels: "All levels",
    allPrices: "All prices",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    free: "Free",
    paid: "Paid",
    clear: "Reset filters",
    close: "Close filters",
    apply: "Show results",
  },
  ar: {
    title: "خصص مجموعتك",
    description: "اعثر على الدورة التي تريد تعلمها.",
    category: "التصنيف",
    level: "مستوى المهارة",
    price: "السعر",
    allCategories: "جميع التصنيفات",
    allLevels: "جميع المستويات",
    allPrices: "جميع الأسعار",
    beginner: "مبتدئ",
    intermediate: "متوسط",
    advanced: "متقدم",
    free: "مجاني",
    paid: "مدفوع",
    clear: "إعادة ضبط الفلاتر",
    close: "إغلاق التصفية",
    apply: "عرض النتائج",
  },
};

export default function WishlistFilters({
  language = "en",
  filters,
  onFiltersChange,
  onClearFilters,
  categories = [],
  onClose,
  disabled = false,
}) {
  const lang = language === "ar" ? "ar" : "en";
  const t = translations[lang];

  const updateFilter = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const levelOptions = [
    { value: "all", label: t.allLevels },
    { value: "beginner", label: t.beginner },
    { value: "intermediate", label: t.intermediate },
    { value: "advanced", label: t.advanced },
  ];

  const priceOptions = [
    { value: "all", label: t.allPrices },
    { value: "free", label: t.free },
    { value: "paid", label: t.paid },
  ];

  return (
    <div
      id="wishlist-filters-panel"
      className="wishlist-filters"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="wishlist-filters__header">
        <div className="wishlist-filters__heading">
          <div className="wishlist-filters__icon">
            <SlidersHorizontal size={18} />
          </div>

          <div>
            <h3>{t.title}</h3>
            <p>{t.description}</p>
          </div>
        </div>

        <button
          type="button"
          className="wishlist-filters__close"
          onClick={onClose}
          aria-label={t.close}
        >
          <X size={18} />
        </button>
      </div>

      <div className="wishlist-filters__body">
        <div className="wishlist-filters__field">
          <label htmlFor="wishlist-category">
            {t.category}
          </label>

          <select
            id="wishlist-category"
            value={filters.category}
            onChange={(event) =>
              updateFilter("category", event.target.value)
            }
            disabled={disabled}
          >
            <option value="all">
              {t.allCategories}
            </option>

            {categories.map((category) => {
              const value =
                typeof category === "string"
                  ? category
                  : category.id;

              const label =
                typeof category === "string"
                  ? category
                  : category.name?.[lang] ??
                    category.name ??
                    category.label ??
                    category.id;

              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        <div className="wishlist-filters__field">
          <label>{t.level}</label>

          <div className="wishlist-filters__chips">
            {levelOptions.map((option) => {
              const selected =
                filters.level === option.value;

              return (
                <button
                  type="button"
                  key={option.value}
                  className={`wishlist-filters__chip ${
                    selected ? "is-selected" : ""
                  }`}
                  onClick={() =>
                    updateFilter("level", option.value)
                  }
                  aria-pressed={selected}
                  disabled={disabled}
                >
                  {selected && <Check size={13} />}
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="wishlist-filters__field">
          <label>{t.price}</label>

          <div className="wishlist-filters__chips">
            {priceOptions.map((option) => {
              const selected =
                filters.price === option.value;

              return (
                <button
                  type="button"
                  key={option.value}
                  className={`wishlist-filters__chip ${
                    selected ? "is-selected" : ""
                  }`}
                  onClick={() =>
                    updateFilter("price", option.value)
                  }
                  aria-pressed={selected}
                  disabled={disabled}
                >
                  {selected && <Check size={13} />}
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="wishlist-filters__footer">
        <button
          type="button"
          className="wishlist-filters__reset"
          onClick={onClearFilters}
          disabled={disabled}
        >
          <RotateCcw size={15} />
          {t.clear}
        </button>

        <button
          type="button"
          className="wishlist-filters__apply"
          onClick={onClose}
        >
          {t.apply}
          <Check size={16} />
        </button>
      </div>
    </div>
  );
}
