
export const courseFilterOptions = {
  level: [
    { value: "all", en: "All Levels", ar: "جميع المستويات" },
    { value: "beginner", en: "Beginner", ar: "مبتدئ" },
    { value: "intermediate", en: "Intermediate", ar: "متوسط" },
    { value: "advanced", en: "Advanced", ar: "متقدم" },
  ],

  price: [
    { value: "all", en: "All Prices", ar: "جميع الأسعار" },
    { value: "free", en: "Free", ar: "مجاني" },
    { value: "paid", en: "Paid", ar: "مدفوع" },
  ],

  language: [
    { value: "all", en: "All Languages", ar: "جميع اللغات" },
    { value: "en", en: "English", ar: "الإنجليزية" },
    { value: "ar", en: "Arabic", ar: "العربية" },
  ],

  duration: [
    { value: "all", en: "Any Duration", ar: "أي مدة" },
    { value: "under-2", en: "Under 2 Hours", ar: "أقل من ساعتين" },
    { value: "2-5", en: "2–5 Hours", ar: "من ساعتين إلى 5 ساعات" },
    { value: "5-10", en: "5–10 Hours", ar: "من 5 إلى 10 ساعات" },
    { value: "10-plus", en: "10+ Hours", ar: "أكثر من 10 ساعات" },
  ],

  rating: [
    { value: "all", en: "Any Rating", ar: "أي تقييم" },
    { value: "4", en: "4.0+ Stars", ar: "4 نجوم فأكثر" },
    { value: "4.5", en: "4.5+ Stars", ar: "4.5 نجوم فأكثر" },
  ],

  sort: [
    { value: "newest", en: "Newest First", ar: "الأحدث أولًا" },
    { value: "popular", en: "Most Popular", ar: "الأكثر شعبية" },
    { value: "rating", en: "Highest Rated", ar: "الأعلى تقييمًا" },
    { value: "price-low", en: "Price: Low to High", ar: "السعر: الأقل أولًا" },
    { value: "price-high", en: "Price: High to Low", ar: "السعر: الأعلى أولًا" },
  ],
};

export const defaultCourseFilters = {
  level: "all",
  price: "all",
  language: "all",
  duration: "all",
  rating: "all",
  sort: "newest",
};

export function normalizeCourseFilters(filters = {}) {
  return Object.fromEntries(
    Object.entries(defaultCourseFilters).map(([key, fallback]) => {
      const validValues = courseFilterOptions[key].map(
        (option) => option.value
      );

      const value = filters[key];

      return [
        key,
        validValues.includes(value) ? value : fallback,
      ];
    })
  );
}
