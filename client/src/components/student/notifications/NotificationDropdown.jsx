
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCheck } from "lucide-react";

import { useStudentNotifications } from "../../../context/StudentNotificationsContext";
import NotificationCard from "./NotificationCard";
import NotificationEmptyState from "./NotificationEmptyState";

export default function NotificationDropdown({
  language = "en",
  onClose,
}) {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAllAsRead } =
    useStudentNotifications();

  const isArabic = language === "ar";

  return (
    <div
      className="behar-notification-dropdown"
      role="region"
      aria-label={isArabic ? "الإشعارات الأخيرة" : "Recent notifications"}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="behar-notification-dropdown-header">
        <div>
          <h3>{isArabic ? "الإشعارات" : "Notifications"}</h3>
          <span>
            {unreadCount}{" "}
            {isArabic ? "غير مقروءة" : "unread"}
          </span>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            aria-label={isArabic ? "قراءة الكل" : "Mark all as read"}
          >
            <CheckCheck size={18} />
          </button>
        )}
      </div>

      <div className="behar-notification-dropdown-list">
        {notifications.length ? (
          notifications.slice(0, 5).map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              language={language}
              compact
              onNavigate={onClose}
            />
          ))
        ) : (
          <NotificationEmptyState language={language} />
        )}
      </div>

      <button
        type="button"
        className="behar-notification-view-all"
        onClick={() => {
          onClose?.();
          navigate("/student/notifications");
        }}
      >
        {isArabic ? "عرض جميع الإشعارات" : "View all notifications"}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
