
import { useState } from "react";
import {
  ArrowDownWideNarrow,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import WishlistFilters from "./WishlistFilters";

import "../../../styles/student/wishlist/wishlist-toolbar.css";

const translations = {
  en: {
    search: "Search saved courses...",
    searchLabel: "Search saved courses",
    filters: "Filters",
    sort: "Sort by",
    clear: "Clear all",
    results: "courses found",
    oneResult: "course found",
    sortOptions: [
      { value: "recent", label: "Recently saved" },
      { value: "oldest", label: "Oldest saved" },
      { value: "rating", label: "Highest rated" },
      { value: "price-low", label: "Price: Low to high" },
      { value: "price-high", label: "Price: High to low" },
    ],
  },
  ar: {
    search: "ابحث في الدورات المحفوظة...",
    searchLabel: "البحث في الدورات المحفوظة",
    filters: "التصفية",
    sort: "ترتيب حسب",
    clear: "مسح الكل",
    results: "دورات",
    oneResult: "دورة",
    sortOptions: [
      { value: "recent", label: "المحفوظة حديثًا" },
      { value: "oldest", label: "الأقدم حفظًا" },
      { value: "rating", label: "الأعلى تقييمًا" },
      { value: "price-low", label: "السعر: من الأقل للأعلى" },
      { value: "price-high", label: "السعر: من الأعلى للأقل" },
    ],
  },
};

export default function WishlistToolbar({
  language = "en",
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount = 0,
  categories = [],
  disabled = false,
}) {
  const lang = language === "ar" ? "ar" : "en";
  const t = translations[lang];

  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount = [
    filters.category !== "all",
    filters.level !== "all",
    filters.price !== "all",
  ].filter(Boolean).length;

  const hasActiveFilters =
    Boolean(filters.search?.trim()) ||
    activeFilterCount > 0 ||
    filters.sort !== "recent";

  const updateFilter = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <section
      className="wishlist-toolbar"
      aria-label={
        lang === "ar"
          ? "أدوات قائمة الرغبات"
          : "Wishlist controls"
      }
    >
      <div className="wishlist-toolbar__main">
        <div className="wishlist-toolbar__search">
          <Search
            size={19}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <input
            type="search"
            value={filters.search}
            onChange={(event) =>
              updateFilter("search", event.target.value)
            }
            placeholder={t.search}
            aria-label={t.searchLabel}
            disabled={disabled}
          />

          {filters.search && (
            <button
              type="button"
              className="wishlist-toolbar__search-clear"
              onClick={() => updateFilter("search", "")}
              aria-label={t.clear}
              disabled={disabled}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="wishlist-toolbar__actions">
          <button
            type="button"
            className={`wishlist-toolbar__filter-button ${
              filtersOpen || activeFilterCount
                ? "is-active"
                : ""
            }`}
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            aria-controls="wishlist-filters-panel"
            disabled={disabled}
          >
            <SlidersHorizontal size={17} />
            <span>{t.filters}</span>

            {activeFilterCount > 0 && (
              <span className="wishlist-toolbar__filter-count">
                {activeFilterCount}
              </span>
            )}
          </button>

          <div className="wishlist-toolbar__sort">
            <ArrowDownWideNarrow
              size={17}
              aria-hidden="true"
            />

            <label
              htmlFor="wishlist-sort"
              className="wishlist-toolbar__sort-label"
            >
              {t.sort}
            </label>

            <select
              id="wishlist-sort"
              value={filters.sort}
              onChange={(event) =>
                updateFilter("sort", event.target.value)
              }
              disabled={disabled}
            >
              {t.sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="wishlist-toolbar__meta">
        <p
          className="wishlist-toolbar__results"
          role="status"
          aria-live="polite"
        >
          <strong>
            {resultCount.toLocaleString(
              lang === "ar" ? "ar-SA" : "en-US"
            )}
          </strong>{" "}
          {resultCount === 1 ? t.oneResult : t.results}
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            className="wishlist-toolbar__reset"
            onClick={onClearFilters}
            disabled={disabled}
          >
            <RotateCcw size={14} />
            {t.clear}
          </button>
        )}
      </div>

      {filtersOpen && (
        <WishlistFilters
          language={lang}
          filters={filters}
          onFiltersChange={onFiltersChange}
          onClearFilters={onClearFilters}
          categories={categories}
          onClose={() => setFiltersOpen(false)}
          disabled={disabled}
        />
      )}
    </section>
  );
}
