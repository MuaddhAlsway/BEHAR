
export const NOTIFICATIONS_STORAGE_KEY =
  "behar:student-notifications:v1";

export const NOTIFICATIONS_UPDATED_EVENT =
  "behar:notifications-updated";

export const localized = (en, ar) => ({ en, ar });

export const notificationTypes = [
  "assignment",
  "course",
  "achievement",
  "community",
  "system",
];

const hoursAgo = (hours) =>
  new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

export const initialNotifications = [
  {
    id: "notification-001",
    type: "assignment",
    title: localized(
      "Assignment deadline approaching",
      "اقترب موعد تسليم الواجب"
    ),
    message: localized(
      "Build a reusable component is due soon.",
      "اقترب موعد تسليم واجب بناء مكوّن قابل لإعادة الاستخدام."
    ),
    createdAt: hoursAgo(2),
    read: false,
    actionUrl: "/student/assignments",
    relatedEntityId: "assignment-001",
    relatedEntityType: "assignment",
  },
  {
    id: "notification-002",
    type: "assignment",
    title: localized(
      "Assignment graded",
      "تم تقييم الواجب"
    ),
    message: localized(
      "Your Marketing campaign brief received 92/100.",
      "حصل واجب موجز الحملة التسويقية على 92 من 100."
    ),
    createdAt: hoursAgo(8),
    read: false,
    actionUrl: "/student/assignments",
    relatedEntityId: "assignment-003",
    relatedEntityType: "assignment",
  },
  {
    id: "notification-003",
    type: "course",
    title: localized(
      "Continue your React journey",
      "واصل رحلتك مع React"
    ),
    message: localized(
      "Return to Modern React Development and continue learning.",
      "عُد إلى دورة React الحديثة وواصل التعلم."
    ),
    createdAt: hoursAgo(25),
    read: false,
    actionUrl: "/courses/modern-react-development",
    relatedEntityId: "course-001",
    relatedEntityType: "course",
  },
  {
    id: "notification-004",
    type: "achievement",
    title: localized(
      "Learning milestone",
      "إنجاز تعليمي"
    ),
    message: localized(
      "Keep building your learning streak.",
      "استمر في تطوير سلسلة أيام التعلم."
    ),
    createdAt: hoursAgo(32),
    read: true,
    actionUrl: "/student/progress",
    relatedEntityId: null,
    relatedEntityType: "progress",
  },
  {
    id: "notification-005",
    type: "system",
    title: localized(
      "Welcome to BEHAR",
      "مرحبًا بك في بحار"
    ),
    message: localized(
      "Your learning dashboard is ready to explore.",
      "لوحة التعلم الخاصة بك جاهزة للاستكشاف."
    ),
    createdAt: hoursAgo(72),
    read: true,
    actionUrl: "/student",
    relatedEntityId: null,
    relatedEntityType: "dashboard",
  },
];

export function getNotificationText(value, language = "en") {
  if (typeof value === "string") return value;
  return value?.[language] ?? value?.en ?? "";
}

export function getNotificationDestination(notification) {
  const url = notification?.actionUrl;

  if (
    typeof url !== "string" ||
    !url.startsWith("/") ||
    url.startsWith("//")
  ) {
    return null;
  }

  return url;
}

export function formatNotificationTime(date, language = "en") {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "";

  return new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-US",
    {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(value);
}
