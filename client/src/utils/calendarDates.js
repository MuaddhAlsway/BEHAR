
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 02
 *
 * Date utilities for the Student Calendar.
 *
 * Calendar timezone: Asia/Riyadh
 * Week starts: Sunday
 *
 * Conventions:
 * - Date-only values: YYYY-MM-DD (Riyadh calendar dates).
 * - Event timestamps: ISO 8601 instants with offsets or Z.
 * - Date ranges: [start, end) — end is exclusive.
 * - Calendar days: [midnight, next midnight).
 *
 * No external date library required.
 */

import {
  CALENDAR_TIME_ZONE,
  CALENDAR_WEEK_START,
} from "../data/calendar";

// ------------------------------------------------------------
// Constants
// ------------------------------------------------------------

export const CALENDAR_LOCALES = Object.freeze({
  EN: "en-US",
  AR: "ar-SA",
});

export const CALENDAR_DATE_FORMAT = Object.freeze({
  YEAR_MONTH_DAY: "yyyy-MM-dd",
  ISO_DATE: "YYYY-MM-DD",
});

const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const RIYADH_OFFSET_MINUTES = 180;

const WEEKDAY_KEYS = Object.freeze([
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
]);

const EN_WEEKDAYS = Object.freeze([
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]);

const AR_WEEKDAYS = Object.freeze([
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
]);

const EN_MONTHS = Object.freeze([
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]);

const AR_MONTHS = Object.freeze([
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
]);

// ------------------------------------------------------------
// Internal helpers
// ------------------------------------------------------------

function pad2(value) {
  return String(value).padStart(2, "0");
}

function isValidDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

function assertValidDate(value, label = "date") {
  if (!isValidDate(value)) {
    throw new TypeError(`Invalid ${label}`);
  }
  return value;
}

function isDateKey(value) {
  return typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function parseDateKey(value) {
  if (!isDateKey(value)) {
    throw new TypeError("Expected YYYY-MM-DD date key");
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new RangeError("Invalid calendar date");
  }

  return { year, month, day };
}

function toDateKey(year, month, day) {
  return `${String(year).padStart(4, "0")}-${pad2(month)}-${pad2(day)}`;
}

function utcCalendarDate(year, month, day) {
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function dateKeyToUTC(value) {
  const { year, month, day } = parseDateKey(value);
  return utcCalendarDate(year, month, day);
}

function getCalendarParts(date) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: CALENDAR_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)])
  );

  return parts;
}

function getRiyadhOffsetMilliseconds(date) {
  const parts = getCalendarParts(date);

  const representedUTC = utcCalendarDate(
    parts.year,
    parts.month,
    parts.day
  );

  representedUTC.setUTCHours(
    parts.hour,
    parts.minute,
    parts.second,
    0
  );

  return representedUTC.getTime() -
    Math.floor(date.getTime() / 1000) * 1000;
}

function riyadhMidnightFromKey(key) {
  const { year, month, day } = parseDateKey(key);

  // Asia/Riyadh currently uses UTC+03:00.
  // This conversion is intentionally scoped to Riyadh.
  return new Date(
    utcCalendarDate(year, month, day).getTime() -
    RIYADH_OFFSET_MINUTES * MINUTE_MS
  );
}

function normalizeDateInput(value) {
  if (isDateKey(value)) {
    return riyadhMidnightFromKey(value);
  }

  if (value instanceof Date) {
    return assertValidDate(new Date(value.getTime()));
  }

  if (typeof value === "number") {
    return assertValidDate(new Date(value));
  }

  if (typeof value === "string") {
    return assertValidDate(new Date(value));
  }

  throw new TypeError("Unsupported date input");
}

function normalizeLanguage(language) {
  return language === "ar" ? "ar" : "en";
}

function getLocale(language) {
  return normalizeLanguage(language) === "ar"
    ? CALENDAR_LOCALES.AR
    : CALENDAR_LOCALES.EN;
}

function getDateKeyParts(value) {
  return parseDateKey(getCalendarDateKey(value));
}

function shiftDateKey(value, days) {
  const date = dateKeyToUTC(value);
  date.setUTCDate(date.getUTCDate() + days);

  return toDateKey(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate()
  );
}

// ------------------------------------------------------------
// Date parsing and timezone
// ------------------------------------------------------------

/**
 * Return a valid Date instant.
 *
 * Date-only keys are interpreted as midnight in Riyadh.
 */
export function toCalendarDate(value) {
  return normalizeDateInput(value);
}

/**
 * Convert an instant to a YYYY-MM-DD Riyadh calendar key.
 */
export function getCalendarDateKey(value) {
  if (isDateKey(value)) {
    parseDateKey(value);
    return value;
  }

  const date = normalizeDateInput(value);
  const parts = getCalendarParts(date);

  return toDateKey(parts.year, parts.month, parts.day);
}

/**
 * Get the current calendar day in Riyadh.
 */
export function getTodayCalendarKey(now = new Date()) {
  return getCalendarDateKey(now);
}

/**
 * Return a Date representing the beginning of a Riyadh day.
 */
export function startOfCalendarDay(value) {
  return riyadhMidnightFromKey(getCalendarDateKey(value));
}

/**
 * Return the exclusive end of a Riyadh calendar day.
 */
export function endOfCalendarDay(value) {
  const nextKey = shiftDateKey(getCalendarDateKey(value), 1);
  return riyadhMidnightFromKey(nextKey);
}

/**
 * Convert a calendar date key and clock time to a Date instant.
 *
 * Example:
 * calendarDateTime("2026-12-01", "18:30")
 */
export function calendarDateTime(dateKey, time = "00:00") {
  parseDateKey(dateKey);

  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time);

  if (!match) {
    throw new RangeError("Expected HH:mm time");
  }

  const [hours, minutes] = match.slice(1).map(Number);

  return new Date(
    riyadhMidnightFromKey(dateKey).getTime() +
    hours * 60 * MINUTE_MS +
    minutes * MINUTE_MS
  );
}

/**
 * Convert an instant to local calendar clock time.
 */
export function getCalendarTime(value) {
  const parts = getCalendarParts(normalizeDateInput(value));

  return `${pad2(parts.hour)}:${pad2(parts.minute)}`;
}

/**
 * Get timezone offset in minutes for a given instant.
 */
export function getCalendarTimezoneOffset(value = new Date()) {
  const date = normalizeDateInput(value);
  return getRiyadhOffsetMilliseconds(date) / MINUTE_MS;
}

// ------------------------------------------------------------
// Date-key arithmetic
// ------------------------------------------------------------

export function addCalendarDays(value, amount) {
  if (!Number.isInteger(amount)) {
    throw new TypeError("Day offset must be an integer");
  }

  return shiftDateKey(getCalendarDateKey(value), amount);
}

export function addCalendarWeeks(value, amount) {
  if (!Number.isInteger(amount)) {
    throw new TypeError("Week offset must be an integer");
  }

  return addCalendarDays(value, amount * 7);
}

export function addCalendarMonths(value, amount) {
  if (!Number.isInteger(amount)) {
    throw new TypeError("Month offset must be an integer");
  }

  const { year, month, day } = getDateKeyParts(value);

  const first = utcCalendarDate(year, month + amount, 1);
  const targetYear = first.getUTCFullYear();
  const targetMonth = first.getUTCMonth() + 1;

  const maxDay = getDaysInCalendarMonth(
    targetYear,
    targetMonth
  );

  return toDateKey(
    targetYear,
    targetMonth,
    Math.min(day, maxDay)
  );
}

export function addCalendarYears(value, amount) {
  if (!Number.isInteger(amount)) {
    throw new TypeError("Year offset must be an integer");
  }

  return addCalendarMonths(value, amount * 12);
}

export function getDaysInCalendarMonth(year, month) {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    throw new RangeError("Invalid year or month");
  }

  return utcCalendarDate(year, month + 1, 0).getUTCDate();
}

export function getCalendarWeekday(value) {
  return dateKeyToUTC(
    getCalendarDateKey(value)
  ).getUTCDay();
}

export function getStartOfCalendarWeek(value) {
  const key = getCalendarDateKey(value);
  const weekday = getCalendarWeekday(key);

  const offset = (
    weekday - CALENDAR_WEEK_START + 7
  ) % 7;

  return shiftDateKey(key, -offset);
}

export function getEndOfCalendarWeek(value) {
  return shiftDateKey(
    getStartOfCalendarWeek(value),
    7
  );
}

export function getStartOfCalendarMonth(value) {
  const { year, month } = getDateKeyParts(value);
  return toDateKey(year, month, 1);
}

export function getEndOfCalendarMonth(value) {
  return addCalendarMonths(
    getStartOfCalendarMonth(value),
    1
  );
}

// ------------------------------------------------------------
// Calendar grid generation
// ------------------------------------------------------------

/**
 * Generate a fixed six-week month grid (42 cells).
 *
 * Each cell:
 * {
 *   dateKey,
 *   day,
 *   month,
 *   year,
 *   isCurrentMonth,
 *   isToday,
 *   weekday,
 *   weekIndex
 * }
 */
export function getCalendarMonthGrid(
  value,
  today = new Date()
) {
  const monthStart = getStartOfCalendarMonth(value);
  const gridStart = getStartOfCalendarWeek(monthStart);

  const { year: activeYear, month: activeMonth } =
    getDateKeyParts(monthStart);

  const todayKey = getCalendarDateKey(today);

  return Array.from({ length: 42 }, (_, index) => {
    const dateKey = shiftDateKey(gridStart, index);
    const { year, month, day } = parseDateKey(dateKey);

    return {
      dateKey,
      day,
      month,
      year,
      weekday: getCalendarWeekday(dateKey),
      weekIndex: Math.floor(index / 7),
      isCurrentMonth:
        year === activeYear && month === activeMonth,
      isToday: dateKey === todayKey,
    };
  });
}

/**
 * Generate seven Sunday-first days for the selected week.
 */
export function getCalendarWeekDays(value) {
  const start = getStartOfCalendarWeek(value);

  return Array.from({ length: 7 }, (_, index) => {
    const dateKey = shiftDateKey(start, index);
    const { year, month, day } = parseDateKey(dateKey);

    return {
      dateKey,
      year,
      month,
      day,
      weekday: index,
    };
  });
}

/**
 * Generate time slots for day/week views.
 *
 * Example:
 * getCalendarTimeSlots({ startHour: 8, endHour: 22, stepMinutes: 30 })
 */
export function getCalendarTimeSlots({
  startHour = 0,
  endHour = 24,
  stepMinutes = 60,
} = {}) {
  if (
    !Number.isInteger(startHour) ||
    !Number.isInteger(endHour) ||
    !Number.isInteger(stepMinutes) ||
    startHour < 0 ||
    endHour > 24 ||
    startHour >= endHour ||
    stepMinutes <= 0 ||
    60 % stepMinutes !== 0
  ) {
    throw new RangeError("Invalid calendar time slot options");
  }

  const slots = [];

  for (
    let minute = startHour * 60;
    minute < endHour * 60;
    minute += stepMinutes
  ) {
    const hours = Math.floor(minute / 60);
    const minutes = minute % 60;

    slots.push({
      hour: hours,
      minute: minutes,
      time: `${pad2(hours)}:${pad2(minutes)}`,
      totalMinutes: minute,
    });
  }

  return slots;
}

// ------------------------------------------------------------
// Navigation
// ------------------------------------------------------------

export function navigateCalendarDate(
  value,
  view,
  direction
) {
  if (!Number.isInteger(direction)) {
    throw new TypeError("Direction must be an integer");
  }

  switch (view) {
    case "month":
      return addCalendarMonths(value, direction);

    case "week":
      return addCalendarWeeks(value, direction);

    case "day":
      return addCalendarDays(value, direction);

    default:
      throw new RangeError("Unknown calendar view");
  }
}

// ------------------------------------------------------------
// Date ranges and event overlap
// ------------------------------------------------------------

/**
 * Check if two half-open time ranges overlap.
 *
 * Range A: [startA, endA)
 * Range B: [startB, endB)
 *
 * Touching boundaries are not overlapping.
 */
export function doCalendarRangesOverlap(
  startA,
  endA,
  startB,
  endB
) {
  const aStart = normalizeDateInput(startA).getTime();
  const aEnd = normalizeDateInput(endA).getTime();
  const bStart = normalizeDateInput(startB).getTime();
  const bEnd = normalizeDateInput(endB).getTime();

  if (aEnd < aStart || bEnd < bStart) {
    throw new RangeError("Invalid calendar range");
  }

  return aStart < bEnd && bStart < aEnd;
}

/**
 * Check whether an event overlaps a range.
 *
 * Event schema:
 * { startAt, endAt }
 */
export function calendarEventOverlapsRange(
  event,
  rangeStart,
  rangeEnd
) {
  if (!event?.startAt || !event?.endAt) {
    return false;
  }

  return doCalendarRangesOverlap(
    event.startAt,
    event.endAt,
    rangeStart,
    rangeEnd
  );
}

/**
 * Check if an event occurs on a Riyadh calendar day.
 */
export function calendarEventOccursOnDay(
  event,
  dateKey
) {
  return calendarEventOverlapsRange(
    event,
    startOfCalendarDay(dateKey),
    endOfCalendarDay(dateKey)
  );
}

/**
 * Return the events overlapping a date range.
 */
export function getCalendarEventsInRange(
  events,
  rangeStart,
  rangeEnd
) {
  if (!Array.isArray(events)) return [];

  return events
    .filter((event) =>
      calendarEventOverlapsRange(
        event,
        rangeStart,
        rangeEnd
      )
    )
    .sort(
      (a, b) =>
        new Date(a.startAt).getTime() -
        new Date(b.startAt).getTime()
    );
}

/**
 * Return chronological upcoming events.
 */
export function getUpcomingCalendarEvents(
  events,
  {
    now = new Date(),
    limit = 5,
    includeInProgress = true,
  } = {}
) {
  if (!Array.isArray(events)) return [];

  const nowMs = normalizeDateInput(now).getTime();

  return events
    .filter((event) => {
      if (!event?.startAt || !event?.endAt) {
        return false;
      }

      if (event.status === "cancelled") {
        return false;
      }

      const start = new Date(event.startAt).getTime();
      const end = new Date(event.endAt).getTime();

      if (!Number.isFinite(start) || !Number.isFinite(end)) {
        return false;
      }

      return includeInProgress
        ? end > nowMs
        : start >= nowMs;
    })
    .sort(
      (a, b) =>
        new Date(a.startAt).getTime() -
        new Date(b.startAt).getTime()
    )
    .slice(0, Math.max(0, limit));
}

// ------------------------------------------------------------
// Localized formatting
// ------------------------------------------------------------

export function formatCalendarDate(
  value,
  language = "en",
  options = {}
) {
  const date = normalizeDateInput(value);

  return new Intl.DateTimeFormat(getLocale(language), {
    timeZone: CALENDAR_TIME_ZONE,
    calendar: "gregory",
    numberingSystem: "latn",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(date);
}

export function formatCalendarMonthYear(
  value,
  language = "en"
) {
  return formatCalendarDate(value, language, {
    year: "numeric",
    month: "long",
    day: undefined,
  });
}

export function formatCalendarWeekday(
  value,
  language = "en",
  format = "long"
) {
  const weekday = getCalendarWeekday(value);

  if (format === "long") {
    return normalizeLanguage(language) === "ar"
      ? AR_WEEKDAYS[weekday]
      : EN_WEEKDAYS[weekday];
  }

  const date = normalizeDateInput(value);

  return new Intl.DateTimeFormat(getLocale(language), {
    timeZone: CALENDAR_TIME_ZONE,
    calendar: "gregory",
    weekday: format,
  }).format(date);
}

export function formatCalendarTime(
  value,
  language = "en",
  {
    hour12 = true,
  } = {}
) {
  return new Intl.DateTimeFormat(getLocale(language), {
    timeZone: CALENDAR_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12,
  }).format(normalizeDateInput(value));
}

export function formatCalendarDateTime(
  value,
  language = "en"
) {
  return new Intl.DateTimeFormat(getLocale(language), {
    timeZone: CALENDAR_TIME_ZONE,
    calendar: "gregory",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(normalizeDateInput(value));
}

export function formatCalendarDateRange(
  start,
  end,
  language = "en"
) {
  const startDate = normalizeDateInput(start);
  const endDate = normalizeDateInput(end);

  if (startDate.getTime() > endDate.getTime()) {
    throw new RangeError("Invalid calendar date range");
  }

  const formatter = new Intl.DateTimeFormat(
    getLocale(language),
    {
      timeZone: CALENDAR_TIME_ZONE,
      calendar: "gregory",
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return formatter.formatRange(startDate, endDate);
}

export function formatCalendarTimeRange(
  start,
  end,
  language = "en"
) {
  const startDate = normalizeDateInput(start);
  const endDate = normalizeDateInput(end);

  if (startDate.getTime() > endDate.getTime()) {
    throw new RangeError("Invalid calendar time range");
  }

  const formatter = new Intl.DateTimeFormat(
    getLocale(language),
    {
      timeZone: CALENDAR_TIME_ZONE,
      hour: "numeric",
      minute: "2-digit",
    }
  );

  return formatter.formatRange(startDate, endDate);
}

// ------------------------------------------------------------
// Calendar labels
// ------------------------------------------------------------

export function getCalendarWeekdayLabels(
  language = "en",
  format = "short"
) {
  return WEEKDAY_KEYS.map((_, index) => {
    if (format === "long") {
      return normalizeLanguage(language) === "ar"
        ? AR_WEEKDAYS[index]
        : EN_WEEKDAYS[index];
    }

    const dateKey = shiftDateKey(
      "2026-11-22", // Known Sunday
      index
    );

    return formatCalendarWeekday(
      dateKey,
      language,
      format
    );
  });
}

export function getCalendarMonthLabels(
  language = "en"
) {
  return normalizeLanguage(language) === "ar"
    ? [...AR_MONTHS]
    : [...EN_MONTHS];
}

// ------------------------------------------------------------
// Comparisons
// ------------------------------------------------------------

export function isSameCalendarDay(a, b) {
  return getCalendarDateKey(a) === getCalendarDateKey(b);
}

export function isSameCalendarMonth(a, b) {
  const left = getDateKeyParts(a);
  const right = getDateKeyParts(b);

  return left.year === right.year &&
    left.month === right.month;
}

export function isCalendarToday(
  value,
  now = new Date()
) {
  return isSameCalendarDay(value, now);
}

export function isCalendarPast(value, now = new Date()) {
  return normalizeDateInput(value).getTime() <
    normalizeDateInput(now).getTime();
}

export function isCalendarFuture(value, now = new Date()) {
  return normalizeDateInput(value).getTime() >
    normalizeDateInput(now).getTime();
}
