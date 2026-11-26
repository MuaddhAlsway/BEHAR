
import { BellOff } from "lucide-react";

export default function NotificationEmptyState({
  language = "en",
}) {
  const isArabic = language === "ar";

  return (
    <div className="behar-notification-empty">
      <div className="behar-notification-empty-icon">
        <BellOff size={27} strokeWidth={1.5} />
      </div>

      <h3>
        {isArabic
          ? "لا توجد إشعارات هنا"
          : "You're all caught up"}
      </h3>

      <p>
        {isArabic
          ? "لا توجد إشعارات تطابق التصنيف المحدد."
          : "No notifications match your current filters."}
      </p>
    </div>
  );
}
