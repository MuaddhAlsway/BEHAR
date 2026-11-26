
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  initialNotifications,
  NOTIFICATIONS_STORAGE_KEY,
  NOTIFICATIONS_UPDATED_EVENT,
} from "../data/notifications";

const StudentNotificationsContext = createContext(null);

function readStoredNotifications() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(
      NOTIFICATIONS_STORAGE_KEY
    );

    if (!raw) return null;

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function getInitialNotifications() {
  return readStoredNotifications() ?? initialNotifications;
}

export function StudentNotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(
    getInitialNotifications
  );

  const updateNotifications = useCallback((updater) => {
    setNotifications((current) => {
      const next =
        typeof updater === "function"
          ? updater(current)
          : updater;

      try {
        localStorage.setItem(
          NOTIFICATIONS_STORAGE_KEY,
          JSON.stringify(next)
        );

        window.dispatchEvent(
          new Event(NOTIFICATIONS_UPDATED_EVENT)
        );
      } catch {
        // Continue using in-memory state.
      }

      return next;
    });
  }, []);

  useEffect(() => {
    const sync = () => {
      const saved = readStoredNotifications();
      if (saved) setNotifications(saved);
    };

    window.addEventListener("storage", sync);
    window.addEventListener(
      NOTIFICATIONS_UPDATED_EVENT,
      sync
    );

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(
        NOTIFICATIONS_UPDATED_EVENT,
        sync
      );
    };
  }, []);

  const markAsRead = useCallback(
    (id) => {
      updateNotifications((current) =>
        current.map((item) =>
          item.id === id ? { ...item, read: true } : item
        )
      );
    },
    [updateNotifications]
  );

  const markAllAsRead = useCallback(() => {
    updateNotifications((current) =>
      current.map((item) => ({ ...item, read: true }))
    );
  }, [updateNotifications]);

  const deleteNotification = useCallback(
    (id) => {
      updateNotifications((current) =>
        current.filter((item) => item.id !== id)
      );
    },
    [updateNotifications]
  );

  const addNotification = useCallback(
    (notification) => {
      if (!notification?.id) return;

      updateNotifications((current) => {
        if (
          current.some((item) => item.id === notification.id)
        ) {
          return current;
        }

        return [
          {
            ...notification,
            read: false,
            createdAt:
              notification.createdAt ?? new Date().toISOString(),
          },
          ...current,
        ];
      });
    },
    [updateNotifications]
  );

  const sortedNotifications = useMemo(
    () =>
      [...notifications].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      ),
    [notifications]
  );

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const value = useMemo(
    () => ({
      notifications: sortedNotifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      addNotification,
    }),
    [
      sortedNotifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      addNotification,
    ]
  );

  return (
    <StudentNotificationsContext.Provider value={value}>
      {children}
    </StudentNotificationsContext.Provider>
  );
}

export function useStudentNotifications() {
  const context = useContext(StudentNotificationsContext);

  if (!context) {
    throw new Error(
      "useStudentNotifications must be used within StudentNotificationsProvider"
    );
  }

  return context;
}
