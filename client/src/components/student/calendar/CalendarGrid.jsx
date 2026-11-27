
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 13
 *
 * CalendarGrid — Monthly calendar view.
 *
 * Features:
 * - Sunday-first, 42-cell month grid
 * - English / Arabic localization
 * - Asia/Riyadh date handling
 * - Academic and personal events
 * - Multi-day event support
 * - Today and selected-day highlights
 * - Previous/next month overflow days
 * - Event details modal integration
 * - Personal event creation
 * - Responsive mobile layout
 *
 * Uses CalendarDayCell for individual days.
 *
 * Pure CSS — no Tailwind.
 */

import { useMemo } from "react";

import {
  CalendarDays,
  Clock3,
} from "lucide-react";

import useCalendar from "../../../hooks/useCalendar";

import CalendarDayCell from "./CalendarDayCell";

import {
  CALENDAR_VIEWS,
  CALENDAR_SOURCES,
  CALENDAR_EVENT_TYPES,
  getCalendarEventTitle,
} from "../../../data/calendar";

import {
  getCalendarDateKey,
  getTodayCalendarKey,
  getCalendarMonthGrid,
  getCalendarWeekdayLabels,
  startOfCalendarDay,
  addCalendarDays,
  formatCalendarTime,
} from "../../../utils/calendarDates";

import "../../../styles/student/calendar/calendar-grid.css";
// ------------------------------------------------------------
// Translations
// ------------------------------------------------------------

const TRANSLATIONS = {
  en: {
    calendar: "Monthly calendar",
    weekdayHeader: "Days of the week",
    more: "more",
    events: "events",
    event: "event",
    noEvents: "No events",
    allDay: "All day",
  },

  ar: {
    calendar: "التقويم الشهري",
    weekdayHeader: "أيام الأسبوع",
    more: "المزيد",
    events: "فعاليات",
    event: "فعالية",
    noEvents: "لا توجد فعاليات",
    allDay: "طوال اليوم",
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

function normalizeDay(day) {
  if (day instanceof Date) {
    return {
      date: day,
      dateKey: getCalendarDateKey(day),
    };
  }

  if (typeof day === "string") {
    const dateKey = getCalendarDateKey(day);

    return {
      date: startOfCalendarDay(dateKey),
      dateKey,
    };
  }

  if (day && typeof day === "object") {
    const rawDate =
      day.date ??
      day.value ??
      day.dateKey ??
      day.key;

    if (rawDate) {
      const dateKey = getCalendarDateKey(rawDate);

      return {
        date: startOfCalendarDay(dateKey),
        dateKey,
      };
    }
  }

  return null;
}

function getEventAppearance(event) {
  return EVENT_APPEARANCE[event.type] || "default";
}

function getEventTitle(event, language) {
  return (
    getCalendarEventTitle(event, language) ||
    event.title ||
    event.titleAr ||
    ""
  );
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

function isEventOnDate(event, dateKey) {
  if (!event?.startAt || !event?.endAt) {
    return false;
  }

  const dayStart = startOfCalendarDay(dateKey);

  const nextDayStart = startOfCalendarDay(
    addCalendarDays(dateKey, 1)
  );

  const start = new Date(event.startAt).getTime();
  const end = new Date(event.endAt).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return false;
  }

  return (
    start < nextDayStart.getTime() &&
    end > dayStart.getTime()
  );
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
// Mobile summary event
// ------------------------------------------------------------

function MobileSummaryEvent({
  event,
  language,
  onOpen,
  t,
}) {
  const title = getEventTitle(event, language);

  const appearance = getEventAppearance(event);

  const source =
    event.source === CALENDAR_SOURCES.PERSONAL
      ? "personal"
      : "academic";

  const time = event.allDay
    ? t.allDay
    : formatCalendarTime(event.startAt, language);

  return (
    <button
      type="button"
      className={[
        "behar-calendar-grid__event",
        `behar-calendar-grid__event--${appearance}`,
        `behar-calendar-grid__event--${source}`,
      ].join(" ")}
      onClick={() => onOpen(event.id)}
      title={`${time} — ${title}`}
      aria-label={`${time}, ${title}`}
    >
      <span
        className="behar-calendar-grid__event-dot"
        aria-hidden="true"
      />

      {!event.allDay && (
        <span className="behar-calendar-grid__event-time">
          {time}
        </span>
      )}

      <span className="behar-calendar-grid__event-title">
        {title}
      </span>
    </button>
  );
}

// ------------------------------------------------------------
// Main component
// ------------------------------------------------------------

export default function CalendarGrid({
  className = "",
}) {
  const {
    language,
    selectedDate,
    selectedDateKey,
    filteredEvents,
    goToDate,
    changeView,
    openEventDetails,
    openCreateEvent,
    storageWritable,
  } = useCalendar();

  const isArabic = language === "ar";

  const t = TRANSLATIONS[isArabic ? "ar" : "en"];

  const todayKey = getTodayCalendarKey();

  // ----------------------------------------------------------
  // Month days
  // ----------------------------------------------------------

  const days = useMemo(() => {
    const result = getCalendarMonthGrid(
      selectedDate
    );

    if (!Array.isArray(result)) {
      return [];
    }

    return result
      .map(normalizeDay)
      .filter(Boolean);
  }, [selectedDate]);

  // ----------------------------------------------------------
  // Weekday labels
  // ----------------------------------------------------------

  const weekdayLabels = useMemo(() => {
    return getCalendarWeekdayLabels(
      language,
      "short"
    );
  }, [language]);

  // ----------------------------------------------------------
  // Current month
  // ----------------------------------------------------------

  const currentMonthKey = selectedDateKey.slice(
    0,
    7
  );

  // ----------------------------------------------------------
  // Group events by date
  // ----------------------------------------------------------

  const eventsByDay = useMemo(() => {
    const map = new Map();

    if (days.length === 0) {
      return map;
    }

    for (const day of days) {
      map.set(day.dateKey, []);
    }

    const firstDay = days[0].dateKey;
    const lastDay = days[days.length - 1].dateKey;

    const rangeStart = startOfCalendarDay(
      firstDay
    );

    const rangeEnd = startOfCalendarDay(
      addCalendarDays(lastDay, 1)
    );

    const rangeStartTime = rangeStart.getTime();
    const rangeEndTime = rangeEnd.getTime();

    const visibleEvents = Array.isArray(filteredEvents)
      ? filteredEvents.filter((event) => {
          const start = new Date(
            event.startAt
          ).getTime();

          const end = new Date(
            event.endAt
          ).getTime();

          return (
            Number.isFinite(start) &&
            Number.isFinite(end) &&
            start < rangeEndTime &&
            end > rangeStartTime
          );
        })
      : [];

    for (const event of visibleEvents) {
      for (const day of days) {
        if (isEventOnDate(event, day.dateKey)) {
          map.get(day.dateKey)?.push(event);
        }
      }
    }

    for (const dayEvents of map.values()) {
      dayEvents.sort(compareEvents);
    }

    return map;
  }, [days, filteredEvents]);

  // ----------------------------------------------------------
  // Navigation handlers
  // ----------------------------------------------------------

  const handleSelectDay = (dateKey) => {
    goToDate(dateKey);
    changeView(CALENDAR_VIEWS.DAY);
  };

  const handleOpenEvent = (eventId) => {
    openEventDetails(eventId);
  };

  const handleCreateEvent = (dateKey) => {
    if (!storageWritable) return;

    openCreateEvent(dateKey);
  };

  // ----------------------------------------------------------
  // Root classes
  // ----------------------------------------------------------

  const rootClassName = [
    "behar-calendar-grid",
    isArabic
      ? "behar-calendar-grid--rtl"
      : "behar-calendar-grid--ltr",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // ----------------------------------------------------------
  // Empty state
  // ----------------------------------------------------------

  if (days.length === 0) {
    return (
      <div className="behar-calendar-grid__empty">
        <CalendarDays
          size={28}
          aria-hidden="true"
        />

        <p>{t.noEvents}</p>
      </div>
    );
  }

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------

  const selectedDayEvents =
    eventsByDay.get(selectedDateKey) || [];

  return (
    <section
      className={rootClassName}
      aria-label={t.calendar}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* ======================================
          WEEKDAY HEADINGS
      ====================================== */}

      <div
        className="behar-calendar-grid__weekdays"
        role="row"
        aria-label={t.weekdayHeader}
      >
        {weekdayLabels.map((label, index) => (
          <div
            key={index}
            className="behar-calendar-grid__weekday"
            role="columnheader"
          >
            {label}
          </div>
        ))}
      </div>

      {/* ======================================
          MONTHLY GRID
      ====================================== */}

      <div
        className="behar-calendar-grid__days"
        role="grid"
        aria-label={t.calendar}
      >
        {days.map((day) => {
          const dateKey = day.dateKey;

          const dayEvents =
            eventsByDay.get(dateKey) || [];

          return (
            <CalendarDayCell
              key={dateKey}
              day={day}
              events={dayEvents}
              language={language}
              selected={
                dateKey === selectedDateKey
              }
              today={dateKey === todayKey}
              inCurrentMonth={
                dateKey.slice(0, 7) ===
                currentMonthKey
              }
              storageWritable={storageWritable}
              onSelect={handleSelectDay}
              onOpenEvent={handleOpenEvent}
              onCreateEvent={handleCreateEvent}
            />
          );
        })}
      </div>

      {/* ======================================
          MOBILE SELECTED-DAY SUMMARY
      ====================================== */}

      <div className="behar-calendar-grid__mobile-summary">
        <div className="behar-calendar-grid__mobile-summary-heading">
          <Clock3
            size={16}
            aria-hidden="true"
          />

          <span>
            {getEventCountLabel(
              selectedDayEvents.length,
              language,
              t
            )}
          </span>
        </div>

        <div className="behar-calendar-grid__mobile-summary-events">
          {selectedDayEvents.map((event) => (
            <MobileSummaryEvent
              key={event.id}
              event={event}
              language={language}
              onOpen={handleOpenEvent}
              t={t}
            />
          ))}

          {selectedDayEvents.length === 0 && (
            <p className="behar-calendar-grid__mobile-summary-empty">
              {t.noEvents}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
