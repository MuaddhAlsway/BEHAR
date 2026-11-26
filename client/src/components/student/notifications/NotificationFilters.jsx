
import { notificationTypes } from "../../../data/notifications";

const categoryLabels = {
  assignment: { en: "Assignments", ar: "الواجبات" },
  course: { en: "Courses", ar: "الدورات" },
  achievement: { en: "Achievements", ar: "الإنجازات" },
  community: { en: "Community", ar: "المجتمع" },
  system: { en: "System", ar: "النظام" },
};

export default function NotificationFilters({
  status,
  category,
  onStatusChange,
  onCategoryChange,
  language = "en",
}) {
  const isArabic = language === "ar";

  const statuses = [
    { value: "all", en: "All", ar: "الكل" },
    { value: "unread", en: "Unread", ar: "غير المقروءة" },
    { value: "read", en: "Read", ar: "المقروءة" },
  ];

  return (
    <div className="behar-notification-filters">
      <div
        className="behar-notification-tabs"
        role="group"
        aria-label={isArabic ? "حالة الإشعارات" : "Notification status"}
      >
        {statuses.map((item) => (
          <button
            key={item.value}
            type="button"
            className={status === item.value ? "active" : ""}
            aria-pressed={status === item.value}
            onClick={() => onStatusChange(item.value)}
          >
            {isArabic ? item.ar : item.en}
          </button>
        ))}
      </div>

      <select
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        aria-label={isArabic ? "نوع الإشعار" : "Notification category"}
      >
        <option value="all">
          {isArabic ? "جميع التصنيفات" : "All categories"}
        </option>
        {notificationTypes.map((type) => (
          <option key={type} value={type}>
            {categoryLabels[type][language] ??
              categoryLabels[type].en}
          </option>
        ))}
      </select>
    </div>
  );
}
