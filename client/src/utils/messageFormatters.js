
const LOCALES = {
  en: "en-US",
  ar: "ar-SA",
};

function getLocale(language = "en") {
  return LOCALES[language] || LOCALES.en;
}

function toValidDate(value) {
  const date = value instanceof Date
    ? value
    : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Format message time.
 * Example: 10:30 AM / ١٠:٣٠ ص
 */
export function formatMessageTime(
  date,
  language = "en"
) {
  const parsed = toValidDate(date);
  if (!parsed) return "";

  return new Intl.DateTimeFormat(getLocale(language), {
    hour: "numeric",
    minute: "2-digit",
  }).format(parsed);
}

/**
 * Format a complete date.
 */
export function formatMessageDate(
  date,
  language = "en"
) {
  const parsed = toValidDate(date);
  if (!parsed) return "";

  return new Intl.DateTimeFormat(getLocale(language), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

/**
 * Format conversation timestamps.
 * Today, Yesterday, or a short date.
 */
export function formatConversationDate(
  date,
  language = "en",
  now = new Date()
) {
  const parsed = toValidDate(date);
  const current = toValidDate(now);

  if (!parsed || !current) return "";

  const startOfDay = (value) =>
    new Date(
      value.getFullYear(),
      value.getMonth(),
      value.getDate()
    ).getTime();

  const dayDifference = Math.round(
    (startOfDay(current) - startOfDay(parsed)) /
      86400000
  );

  if (dayDifference === 0) {
    return formatMessageTime(parsed, language);
  }

  if (dayDifference === 1) {
    return language === "ar" ? "أمس" : "Yesterday";
  }

  return new Intl.DateTimeFormat(getLocale(language), {
    month: "short",
    day: "numeric",
    year:
      parsed.getFullYear() !== current.getFullYear()
        ? "numeric"
        : undefined,
  }).format(parsed);
}

/**
 * Group messages by calendar day.
 */
export function groupMessagesByDate(messages = []) {
  const groups = new Map();

  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime()
  );

  sortedMessages.forEach((message) => {
    const date = toValidDate(message.createdAt);

    if (!date) return;

    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(message);
  });

  return Array.from(groups, ([date, items]) => ({
    date,
    messages: items,
  }));
}

/**
 * Return participant's localized display name.
 */
export function formatParticipantName(
  participant,
  language = "en"
) {
  if (!participant) return "";

  if (language === "ar") {
    return participant.nameAr || participant.name || "";
  }

  return participant.name || participant.nameAr || "";
}

/**
 * Return localized course title.
 */
export function formatCourseTitle(
  course,
  language = "en"
) {
  if (!course) return "";

  if (language === "ar") {
    return course.titleAr || course.title || "";
  }

  return course.title || course.titleAr || "";
}
