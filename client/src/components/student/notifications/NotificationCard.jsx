
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ClipboardList,
  Award,
  MessageCircle,
  Bell,
  Check,
  Trash2,
  ArrowUpRight,
} from "lucide-react";

import { useStudentNotifications } from "../../../context/StudentNotificationsContext";
import {
  getNotificationText,
  getNotificationDestination,
  formatNotificationTime,
} from "../../../data/notifications";

const icons = {
  assignment: ClipboardList,
  course: BookOpen,
  achievement: Award,
  community: MessageCircle,
  system: Bell,
};

export default function NotificationCard({
  notification,
  language = "en",
  compact = false,
  onNavigate,
}) {
  const navigate = useNavigate();
  const { markAsRead, deleteNotification } =
    useStudentNotifications();

  const Icon = icons[notification.type] ?? Bell;
  const isArabic = language === "ar";
  const destination = getNotificationDestination(notification);

  const openNotification = () => {
    markAsRead(notification.id);

    if (destination) {
      onNavigate?.();
      navigate(destination);
    }
  };

  return (
    <article
      className={`behar-notification-card ${
        notification.read ? "is-read" : "is-unread"
      } ${compact ? "is-compact" : ""}`}
    >
      <div
        className={`behar-notification-icon type-${notification.type}`}
      >
        <Icon size={19} strokeWidth={1.8} />
      </div>

      <div className="behar-notification-content">
        <div className="behar-notification-title-row">
          <h3>
            {getNotificationText(notification.title, language)}
          </h3>
          {!notification.read && (
            <span
              className="behar-notification-dot"
              aria-label={isArabic ? "غير مقروء" : "Unread"}
            />
          )}
        </div>

        <p>
          {getNotificationText(notification.message, language)}
        </p>

        <time dateTime={notification.createdAt}>
          {formatNotificationTime(notification.createdAt, language)}
        </time>

        <div className="behar-notification-actions">
          {destination && (
            <button type="button" onClick={openNotification}>
              {isArabic ? "عرض التفاصيل" : "View details"}
              <ArrowUpRight size={14} />
            </button>
          )}

          {!notification.read && (
            <button
              type="button"
              onClick={() => markAsRead(notification.id)}
              aria-label={isArabic ? "تحديد كمقروء" : "Mark as read"}
            >
              <Check size={14} />
              {!compact && (isArabic ? "تمت القراءة" : "Mark read")}
            </button>
          )}

          <button
            type="button"
            className="behar-notification-delete"
            onClick={() => deleteNotification(notification.id)}
            aria-label={isArabic ? "حذف الإشعار" : "Delete notification"}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
