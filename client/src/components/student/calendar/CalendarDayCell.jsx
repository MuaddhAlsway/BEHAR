
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 14
 *
 * CalendarDayCell
 *
 * Responsibilities:
 * - Render one monthly calendar day
 * - Highlight today and selected dates
 * - Display academic and personal events
 * - Show overflow event counts
 * - Support multi-day event indicators
 * - Navigate to the selected day
 * - Open event details
 * - Create personal events
 * - Support English / Arabic
 * - Provide mobile event indicators
 *
 * Pure CSS — no Tailwind.
 */

import { useMemo } from "react";

import { Plus } from "lucide-react";

import {
  CALENDAR_SOURCES,
  CALENDAR_EVENT_TYPES,
  getCalendarEventTitle,
} from "../../../data/calendar";

import {
  getCalendarDateKey,
  startOfCalendarDay,
  addCalendarDays,
  formatCalendarTime,
} from "../../../utils/calendarDates";

import "../../../styles/student/calendar/calendar-day-cell.css";

// ------------------------------------------------------------
// Configuration
// ------------------------------------------------------------

const DEFAULT_VISIBLE_EVENTS = 3;

const TRANSLATIONS = {
  en: {
    today: "Today",
    selected: "Selected",
    viewDay: "View day",
    addEvent: "Add personal event",
    more: "more",
    event: "event",
    events: "events",
    allDay: "All day",
    academic: "Academic",
    personal: "Personal",
    continues: "Continues",
    starts: "Starts",
    ends: "Ends",
  },

  ar: {
    today: "اليوم",
    selected: "محدد",
    viewDay: "عرض اليوم",
    addEvent: "إضافة فعالية شخصية",
    more: "المزيد",
    event: "فعالية",
    events: "فعاليات",
    allDay: "طوال اليوم",
    academic: "أكاديمي",
    personal: "شخصي",
    continues: "مستمر",
    starts: "يبدأ",
    ends: "ينتهي",
  },
};

// ------------------------------------------------------------
// Event appearance
// ------------------------------------------------------------

const EVENT_APPEARANCE = {
  [CALENDAR_EVENT_TYPES.LIVE_SESSION]: "live",
  [CALENDAR_EVENT_TYPES.LESSON]: "lesson",
  [CALENDAR_EVENT_TYPES.ASSIGNMENT]: "assignment",
  [CALENDAR_EVENT_TYPES.QUIZ]: "assessment",
  [CALENDAR_EVENT_TYPES.EXAM]: "assessment",
  [CALENDAR_EVENT_TYPES.DEADLINE]: "deadline",
  [CALENDAR_EVENT_TYPES.STUDY_SESSION]: "study",
  [CALENDAR_EVENT_TYPES.REMINDER]: "reminder",
  [CALENDAR_EVENT_TYPES.STUDY_GOAL]: "goal",
  [CALENDAR_EVENT_TYPES.PERSONAL_TASK]: "task",
};

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function getDayNumber(dateKey, language) {
  const day = Number(dateKey.slice(8, 10));

  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US",
    { useGrouping: false }
  ).format(day);
}

function getDateLabel(date, language) {
  return new Intl.DateTimeFormat(
    language === "ar"
      ? "ar-SA-u-ca-gregory"
      : "en-US",
    {
      timeZone: "Asia/Riyadh",
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }
  ).format(date);
}

function getEventCountLabel(count, language, t) {
  const formatted = new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US"
  ).format(count);

  if (language === "ar") {
    return `${formatted} ${t.events}`;
  }

  return `${formatted} ${
    count === 1 ? t.event : t.events
  }`;
}

function getEventAppearance(type) {
  return EVENT_APPEARANCE[type] || "default";
}

function getEventTitle(event, language) {
  return (
    getCalendarEventTitle(event, language) ||
    event.title ||
    event.titleAr ||
    ""
  );
}

function getEventSource(event) {
  return event.source === CALENDAR_SOURCES.PERSONAL
    ? "personal"
    : "academic";
}

function getEventPosition(event, dateKey) {
  const start = new Date(event.startAt).getTime();
  const end = new Date(event.endAt).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return "single";
  }

  const dayStart = startOfCalendarDay(dateKey);
  const nextDayStart = startOfCalendarDay(
    addCalendarDays(dateKey, 1)
  );

  const startsBefore =
    start < dayStart.getTime();

  const endsAfter =
    end > nextDayStart.getTime();

  if (startsBefore && endsAfter) {
    return "middle";
  }

  if (startsBefore) {
    return "end";
  }

  if (endsAfter) {
    return "start";
  }

  return "single";
}

function compareEvents(a, b) {
  if (Boolean(a.allDay) !== Boolean(b.allDay)) {
    return a.allDay ? -1 : 1;
  }

  const startDifference =
    new Date(a.startAt).getTime() -
    new Date(b.startAt).getTime();

  if (startDifference !== 0) {
    return startDifference;
  }

  return String(a.id).localeCompare(String(b.id));
}

// ------------------------------------------------------------
// Calendar day event chip
// ------------------------------------------------------------

function CalendarDayEvent({
  event,
  dateKey,
  language,
  onOpenEvent,
  t,
}) {
  const title = getEventTitle(event, language);

  const appearance = getEventAppearance(
    event.type
  );

  const source = getEventSource(event);

  const position = getEventPosition(
    event,
    dateKey
  );

  const timeLabel = event.allDay
    ? t.allDay
    : formatCalendarTime(
        event.startAt,
        language
      );

  const positionLabel =
    position === "start"
      ? t.starts
      : position === "middle"
        ? t.continues
        : position === "end"
          ? t.ends
          : "";

  return (
    <button
      type="button"
      className={[
        "behar-calendar-day-cell__event",
        `behar-calendar-day-cell__event--${appearance}`,
        `behar-calendar-day-cell__event--${source}`,
        `behar-calendar-day-cell__event--${position}`,
      ].join(" ")}
      title={`${title} — ${timeLabel}`}
      aria-label={[
        title,
        timeLabel,
        positionLabel,
      ]
        .filter(Boolean)
        .join(", ")}
      onClick={() => onOpenEvent(event.id)}
    >
      <span
        className="behar-calendar-day-cell__event-dot"
        aria-hidden="true"
      />

      {!event.allDay && position !== "middle" && (
        <span className="behar-calendar-day-cell__event-time">
          {timeLabel}
        </span>
      )}

      <span className="behar-calendar-day-cell__event-title">
        {title}
      </span>
    </button>
  );
}

// ------------------------------------------------------------
// Main component
// ------------------------------------------------------------

export default function CalendarDayCell({
  day,
  events = [],
  language = "en",
  selected = false,
  today = false,
  inCurrentMonth = true,
  storageWritable = true,
  onSelect = () => {},
  onOpenEvent = () => {},
  onCreateEvent = () => {},
  maxVisibleEvents = DEFAULT_VISIBLE_EVENTS,
  className = "",
}) {
  const isArabic = language === "ar";
  const t = TRANSLATIONS[isArabic ? "ar" : "en"];

  // ----------------------------------------------------------
  // Normalize date
  // ----------------------------------------------------------

  const dateKey =
    typeof day === "string"
      ? day
      : day?.dateKey ||
        day?.key ||
        getCalendarDateKey(
          day?.date || day
        );

  const date = useMemo(
    () => startOfCalendarDay(dateKey),
    [dateKey]
  );

  // ----------------------------------------------------------
  // Event data
  // ----------------------------------------------------------

  const sortedEvents = useMemo(
    () => [...events].sort(compareEvents),
    [events]
  );

  const visibleEvents = sortedEvents.slice(
    0,
    maxVisibleEvents
  );

  const remainingCount = Math.max(
    0,
    sortedEvents.length - maxVisibleEvents
  );

  const dateLabel = getDateLabel(
    date,
    language
  );

  const eventCountLabel = getEventCountLabel(
    sortedEvents.length,
    language,
    t
  );

  // ----------------------------------------------------------
  // Class names
  // ----------------------------------------------------------

  const rootClassName = [
    "behar-calendar-day-cell",
    !inCurrentMonth
      ? "behar-calendar-day-cell--outside"
      : "",
    today
      ? "behar-calendar-day-cell--today"
      : "",
    selected
      ? "behar-calendar-day-cell--selected"
      : "",
    sortedEvents.length > 0
      ? "behar-calendar-day-cell--has-events"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------

  return (
    <div
      className={rootClassName}
      role="gridcell"
      aria-selected={selected}
      aria-label={`${dateLabel}, ${eventCountLabel}`}
      data-date={dateKey}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* ======================================
          DAY HEADING
      ====================================== */}

      <div className="behar-calendar-day-cell__heading">
        <button
          type="button"
          className="behar-calendar-day-cell__number"
          onClick={() => onSelect(dateKey)}
          aria-label={`${t.viewDay}: ${dateLabel}`}
          aria-current={today ? "date" : undefined}
          title={dateLabel}
        >
          {getDayNumber(dateKey, language)}
        </button>

        {storageWritable && (
          <button
            type="button"
            className="behar-calendar-day-cell__add"
            onClick={() => onCreateEvent(dateKey)}
            aria-label={`${t.addEvent}: ${dateLabel}`}
            title={t.addEvent}
          >
            <Plus
              size={14}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
        )}
      </div>

      {/* ======================================
          DESKTOP EVENTS
      ====================================== */}

      <div className="behar-calendar-day-cell__events">
        {visibleEvents.map((event) => (
          <CalendarDayEvent
            key={event.id}
            event={event}
            dateKey={dateKey}
            language={language}
            onOpenEvent={onOpenEvent}
            t={t}
          />
        ))}

        {remainingCount > 0 && (
          <button
            type="button"
            className="behar-calendar-day-cell__more"
            onClick={() => onSelect(dateKey)}
            aria-label={`${remainingCount} ${t.more}, ${dateLabel}`}
          >
            +{remainingCount} {t.more}
          </button>
        )}
      </div>

      {/* ======================================
          MOBILE EVENT INDICATORS
      ====================================== */}

      {sortedEvents.length > 0 && (
        <div
          className="behar-calendar-day-cell__dots"
          aria-hidden="true"
        >
          {sortedEvents.slice(0, 3).map((event) => (
            <span
              key={event.id}
              className={[
                "behar-calendar-day-cell__dot",
                `behar-calendar-day-cell__dot--${getEventAppearance(
                  event.type
                )}`,
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
