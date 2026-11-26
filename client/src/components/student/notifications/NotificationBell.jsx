
import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";

import { useStudentNotifications } from "../../../context/StudentNotificationsContext";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell({
  language = "en",
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const { unreadCount } = useStudentNotifications();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="behar-notification-bell" ref={wrapperRef}>
      <button
        ref={buttonRef}
        type="button"
        className="behar-notification-bell-button"
        aria-label={
          language === "ar"
            ? `الإشعارات، ${unreadCount} غير مقروءة`
            : `Notifications, ${unreadCount} unread`
        }
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((previous) => !previous)}
      >
        <Bell size={21} strokeWidth={1.8} />

        {unreadCount > 0 && (
          <span className="behar-notification-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          language={language}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
