
import { useMemo, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";

import { useStudentNotifications } from "../../context/StudentNotificationsContext";
import NotificationCard from "../../components/student/notifications/NotificationCard";
import NotificationFilters from "../../components/student/notifications/NotificationFilters";
import NotificationEmptyState from "../../components/student/notifications/NotificationEmptyState";

import "../../styles/student/notifications.css";

function getLanguage() {
  if (typeof document === "undefined") return "en";

  return document.documentElement.lang
    ?.toLowerCase()
    .startsWith("ar")
    ? "ar"
    : "en";
}

function getDayGroup(date) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "earlier";

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (value >= today) return "today";
  if (value >= yesterday) return "yesterday";

  return "earlier";
}

const groupLabels = {
  today: { en: "Today", ar: "اليوم" },
  yesterday: { en: "Yesterday", ar: "أمس" },
  earlier: { en: "Earlier", ar: "سابقًا" },
};

export default function Notifications() {
  const [language, setLanguage] = useState(getLanguage);
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");

  const {
    notifications,
    unreadCount,
    markAllAsRead,
  } = useStudentNotifications();

  // Keep the page synchronized with the existing app language.
  useMemo(() => language, [language]);

  const filtered = useMemo(
    () =>
      notifications.filter((item) => {
        if (status === "read" && !item.read) return false;
        if (status === "unread" && item.read) return false;
        if (category !== "all" && item.type !== category) {
          return false;
        }
        return true;
      }),
    [notifications, status, category]
  );

  const groups = useMemo(
    () =>
      ["today", "yesterday", "earlier"]
        .map((key) => ({
          key,
          items: filtered.filter(
            (item) => getDayGroup(item.createdAt) === key
          ),
        }))
        .filter((group) => group.items.length > 0),
    [filtered]
  );

  return (
    <section
      className="behar-notifications-page"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <header className="behar-notifications-page-header">
        <div>
          <span className="behar-notifications-eyebrow">
            <Bell size={15} />
            {language === "ar"
              ? "مركز الإشعارات"
              : "YOUR LEARNING UPDATES"}
          </span>

          <h1>
            {language === "ar"
              ? "الإشعارات"
              : "Notifications"}
          </h1>

          <p>
            {language === "ar"
              ? "تابع آخر التحديثات المتعلقة بدوراتك وواجباتك وإنجازاتك."
              : "Stay up to date with your courses, assignments, and learning milestones."}
          </p>
        </div>

        <div className="behar-notifications-header-actions">
          <span className="behar-notifications-unread-count">
            {unreadCount}{" "}
            {language === "ar" ? "غير مقروءة" : "unread"}
          </span>

          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck size={17} />
            {language === "ar"
              ? "تحديد الكل كمقروء"
              : "Mark all as read"}
          </button>
        </div>
      </header>

      <div className="behar-notifications-panel">
        <NotificationFilters
          status={status}
          category={category}
          onStatusChange={setStatus}
          onCategoryChange={setCategory}
          language={language}
        />

        {groups.length ? (
          <div className="behar-notification-groups">
            {groups.map((group) => (
              <section
                key={group.key}
                className="behar-notification-group"
              >
                <div className="behar-notification-group-heading">
                  <h2>
                    {groupLabels[group.key][language]}
                  </h2>
                  <span>{group.items.length}</span>
                </div>

                <div className="behar-notification-list">
                  {group.items.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      language={language}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <NotificationEmptyState language={language} />
        )}
      </div>
    </section>
  );
}
