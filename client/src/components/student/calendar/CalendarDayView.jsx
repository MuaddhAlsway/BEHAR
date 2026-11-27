
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 16
 *
 * CalendarDayView
 *
 * Features:
 * - Detailed single-day schedule
 * - 24-hour timeline
 * - Asia/Riyadh timezone
 * - English / Arabic
 * - Academic and personal events
 * - Overlapping event positioning
 * - Multi-day event support
 * - All-day event section
 * - Current-time indicator
 * - Event details integration
 * - Personal event creation
 * - Responsive layout
 *
 * Pure CSS — no Tailwind.
 */

import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  Clock3,
  Plus,
  BookOpen,
  CalendarCheck2,
} from "lucide-react";

import useCalendar from "../../../hooks/useCalendar";

import {
  CALENDAR_SOURCES,
  CALENDAR_EVENT_TYPES,
  CALENDAR_TIME_ZONE,
  getCalendarEventTitle,
} from "../../../data/calendar";

import {
  getCalendarDateKey,
  startOfCalendarDay,
  addCalendarDays,
  formatCalendarTime,
} from "../../../utils/calendarDates";

import "../../../styles/student/calendar/calendar-day-view.css";

// ------------------------------------------------------------
// Configuration
// ------------------------------------------------------------

const START_HOUR = 0;
const END_HOUR = 24;
const HOUR_HEIGHT = 76;

const TRANSLATIONS = {
  en: {
    dailySchedule: "Daily schedule",
    timeline: "Daily timeline",
    allDay: "All-day events",
    today: "Today",
    noEvents: "Nothing scheduled for this day",
    noEventsDescription:
      "Your schedule is clear. Add a study session or personal reminder.",
    addEvent: "Add event",
    addPersonalEvent: "Add personal event",
    academic: "Academic",
    personal: "Personal",
    scheduled: "Scheduled events",
    timeZone: "Saudi Arabia time",
    currentTime: "Current time",
    event: "event",
    events: "events",
    starts: "Starts",
    ends: "Ends",
  },

  ar: {
    dailySchedule: "الجدول اليومي",
    timeline: "الجدول الزمني اليومي",
    allDay: "فعاليات طوال اليوم",
    today: "اليوم",
    noEvents: "لا توجد فعاليات مجدولة لهذا اليوم",
    noEventsDescription:
      "جدولك متاح. يمكنك إضافة جلسة دراسة أو تذكير شخصي.",
    addEvent: "إضافة فعالية",
    addPersonalEvent: "إضافة فعالية شخصية",
    academic: "أكاديمي",
    personal: "شخصي",
    scheduled: "الفعاليات المجدولة",
    timeZone: "بتوقيت السعودية",
    currentTime: "الوقت الحالي",
    event: "فعالية",
    events: "فعاليات",
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
// Date helpers
// ------------------------------------------------------------

function getDateLabel(date, language) {
  const normalizedDate = date instanceof Date
    ? new Date(date.getTime())
    : new Date(date)

  // Calendar state can briefly contain an empty or stale date while the
  // view changes. Keep the header renderable instead of passing an invalid
  // Date to Intl.DateTimeFormat.
  const safeDate = Number.isFinite(normalizedDate.getTime())
    ? normalizedDate
    : new Date()

  return new Intl.DateTimeFormat(
    language === "ar"
      ? "ar-SA-u-ca-gregory"
      : "en-US",
    {
      timeZone: CALENDAR_TIME_ZONE,
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  ).format(safeDate);
}

function getTimeParts(value) {
  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return null;
  }

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: CALENDAR_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const hour = Number(
    parts.find((part) => part.type === "hour")?.value
  );

  const minute = Number(
    parts.find((part) => part.type === "minute")?.value
  );

  return {
    hour,
    minute,
    totalMinutes: hour * 60 + minute,
  };
}

function getTimeLabel(hour, language) {
  const hour12 = hour % 12 || 12;

  if (language === "ar") {
    const formatted = new Intl.NumberFormat(
      "ar-SA",
      { useGrouping: false }
    ).format(hour12);

    return `${formatted}:٠٠ ${hour < 12 ? "ص" : "م"}`;
  }

  return `${hour12}:00 ${hour < 12 ? "AM" : "PM"}`;
}

function getEventTitle(event, language) {
  return (
    getCalendarEventTitle(event, language) ||
    event.title ||
    event.titleAr ||
    ""
  );
}

function getAppearance(type) {
  return EVENT_APPEARANCE[type] || "default";
}

function getSource(event) {
  return event.source === CALENDAR_SOURCES.PERSONAL
    ? "personal"
    : "academic";
}

function overlapsDay(event, dateKey) {
  const start = new Date(event.startAt).getTime();
  const end = new Date(event.endAt).getTime();

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    end <= start
  ) {
    return false;
  }

  const dayStart = startOfCalendarDay(dateKey);
  const nextDay = startOfCalendarDay(
    addCalendarDays(dateKey, 1)
  );

  return (
    start < nextDay.getTime() &&
    end > dayStart.getTime()
  );
}

function sortEvents(a, b) {
  return (
    new Date(a.startAt).getTime() -
      new Date(b.startAt).getTime() ||
    String(a.id).localeCompare(String(b.id))
  );
}

// ------------------------------------------------------------
// Event layout algorithm
// ------------------------------------------------------------

function buildEventLayout(events, dateKey) {
  const dayStart = startOfCalendarDay(dateKey);
  const nextDay = startOfCalendarDay(
    addCalendarDays(dateKey, 1)
  );

  const dayStartTime = dayStart.getTime();
  const nextDayTime = nextDay.getTime();

  const positioned = events
    .filter((event) => !event.allDay)
    .map((event) => {
      const start = new Date(event.startAt).getTime();
      const end = new Date(event.endAt).getTime();

      if (
        !Number.isFinite(start) ||
        !Number.isFinite(end) ||
        end <= start
      ) {
        return null;
      }

      const clippedStart = Math.max(
        start,
        dayStartTime
      );

      const clippedEnd = Math.min(
        end,
        nextDayTime
      );

      if (clippedEnd <= clippedStart) {
        return null;
      }

      const startParts = getTimeParts(clippedStart);
      const endParts = getTimeParts(clippedEnd);

      if (!startParts || !endParts) {
        return null;
      }

      const startMinutes =
        start < dayStartTime
          ? 0
          : startParts.totalMinutes;

      const endMinutes =
        end >= nextDayTime
          ? 1440
          : endParts.totalMinutes;

      if (endMinutes <= startMinutes) {
        return null;
      }

      return {
        event,
        startMinutes,
        endMinutes,
        column: 0,
        columns: 1,
      };
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        a.startMinutes - b.startMinutes ||
        b.endMinutes - a.endMinutes
    );

  // Build connected overlap groups.

  const clusters = [];
  let current = [];
  let currentEnd = -1;

  for (const item of positioned) {
    if (
      current.length > 0 &&
      item.startMinutes >= currentEnd
    ) {
      clusters.push(current);
      current = [];
      currentEnd = -1;
    }

    current.push(item);
    currentEnd = Math.max(
      currentEnd,
      item.endMinutes
    );
  }

  if (current.length > 0) {
    clusters.push(current);
  }

  // Allocate event columns within each group.

  for (const cluster of clusters) {
    const columnEnds = [];

    for (const item of cluster) {
      let column = columnEnds.findIndex(
        (end) => end <= item.startMinutes
      );

      if (column === -1) {
        column = columnEnds.length;
        columnEnds.push(item.endMinutes);
      } else {
        columnEnds[column] = item.endMinutes;
      }

      item.column = column;
    }

    const totalColumns = Math.max(
      1,
      columnEnds.length
    );

    for (const item of cluster) {
      item.columns = totalColumns;
    }
  }

  return positioned;
}

// ------------------------------------------------------------
// All-day event
// ------------------------------------------------------------

function AllDayEvent({
  event,
  language,
  onOpen,
}) {
  const title = getEventTitle(event, language);

  const appearance = getAppearance(event.type);

  const source = getSource(event);

  return (
    <button
      type="button"
      className={[
        "behar-calendar-day-view__all-day-event",
        `behar-calendar-day-view__event--${appearance}`,
        `behar-calendar-day-view__event--${source}`,
      ].join(" ")}
      onClick={() => onOpen(event.id)}
      title={title}
    >
      <span
        className="behar-calendar-day-view__event-dot"
        aria-hidden="true"
      />

      <span>{title}</span>
    </button>
  );
}

// ------------------------------------------------------------
// Timed event
// ------------------------------------------------------------

function TimedEvent({
  item,
  language,
  onOpen,
}) {
  const { event } = item;

  const title = getEventTitle(event, language);
  const appearance = getAppearance(event.type);
  const source = getSource(event);

  const top =
    (item.startMinutes / 60) * HOUR_HEIGHT;

  const height = Math.max(
    22,
    ((item.endMinutes - item.startMinutes) / 60) *
      HOUR_HEIGHT
  );

  const width = 100 / item.columns;
  const offset = item.column * width;

  const timeLabel = [
    formatCalendarTime(event.startAt, language),
    formatCalendarTime(event.endAt, language),
  ].join(" – ");

  return (
    <button
      type="button"
      className={[
        "behar-calendar-day-view__timed-event",
        `behar-calendar-day-view__event--${appearance}`,
        `behar-calendar-day-view__event--${source}`,
      ].join(" ")}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        insetInlineStart: `calc(${offset}% + 3px)`,
        width: `calc(${width}% - 6px)`,
      }}
      onClick={(clickEvent) => {
        clickEvent.stopPropagation();
        onOpen(event.id);
      }}
      title={`${title} — ${timeLabel}`}
      aria-label={`${title}, ${timeLabel}`}
    >
      <span className="behar-calendar-day-view__timed-title">
        {title}
      </span>

      {height >= 46 && (
        <span className="behar-calendar-day-view__timed-time">
          <Clock3
            size={12}
            aria-hidden="true"
          />

          {timeLabel}
        </span>
      )}
    </button>
  );
}

// ------------------------------------------------------------
// Main component
// ------------------------------------------------------------

export default function CalendarDayView({
  className = "",
}) {
  const {
    language,
    selectedDate,
    selectedDateKey,
    filteredEvents,
    openEventDetails,
    openCreateEvent,
    storageWritable,
  } = useCalendar();

  const isArabic = language === "ar";
  const t = TRANSLATIONS[isArabic ? "ar" : "en"];

  const [now, setNow] = useState(() => new Date());

  // Update the current-time marker every minute.
  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => window.clearInterval(interval);
  }, []);

  const todayKey = getCalendarDateKey(now);

  const isToday = selectedDateKey === todayKey;

  // ----------------------------------------------------------
  // Selected-day events
  // ----------------------------------------------------------

  const dayEvents = useMemo(() => {
    const events = Array.isArray(filteredEvents)
      ? filteredEvents
      : [];

    return events
      .filter((event) =>
        overlapsDay(event, selectedDateKey)
      )
      .sort(sortEvents);
  }, [filteredEvents, selectedDateKey]);

  const allDayEvents = useMemo(
    () => dayEvents.filter((event) => event.allDay),
    [dayEvents]
  );

  const timedEvents = useMemo(
    () => buildEventLayout(dayEvents, selectedDateKey),
    [dayEvents, selectedDateKey]
  );

  // ----------------------------------------------------------
  // Current-time marker
  // ----------------------------------------------------------

  const currentTimePosition = useMemo(() => {
    if (!isToday) return null;

    const parts = getTimeParts(now);

    if (!parts) return null;

    return (
      (parts.totalMinutes / 60) * HOUR_HEIGHT
    );
  }, [now, isToday]);

  // ----------------------------------------------------------
  // Statistics
  // ----------------------------------------------------------

  const academicCount = dayEvents.filter(
    (event) =>
      event.source === CALENDAR_SOURCES.ACADEMIC
  ).length;

  const personalCount = dayEvents.filter(
    (event) =>
      event.source === CALENDAR_SOURCES.PERSONAL
  ).length;

  const totalCount = dayEvents.length;

  // ----------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------

  const handleOpenEvent = (eventId) => {
    openEventDetails(eventId);
  };

  const handleCreateEvent = () => {
    if (!storageWritable) return;

    openCreateEvent(selectedDateKey);
  };

  // ----------------------------------------------------------
  // Root classes
  // ----------------------------------------------------------

  const rootClassName = [
    "behar-calendar-day-view",
    isArabic
      ? "behar-calendar-day-view--rtl"
      : "behar-calendar-day-view--ltr",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------

  return (
    <section
      className={rootClassName}
      dir={isArabic ? "rtl" : "ltr"}
      aria-label={t.dailySchedule}
    >
      {/* ======================================
          HEADER
      ====================================== */}

      <header className="behar-calendar-day-view__header">
        <div className="behar-calendar-day-view__heading">
          <div className="behar-calendar-day-view__heading-icon">
            <CalendarDays
              size={20}
              aria-hidden="true"
            />
          </div>

          <div>
            <span className="behar-calendar-day-view__eyebrow">
              {t.dailySchedule}
            </span>

            <h2>
              {getDateLabel(
                selectedDate,
                language
              )}
            </h2>
          </div>
        </div>

        {storageWritable && (
          <button
            type="button"
            className="behar-calendar-day-view__create"
            onClick={handleCreateEvent}
          >
            <Plus
              size={17}
              aria-hidden="true"
            />

            <span>{t.addEvent}</span>
          </button>
        )}
      </header>

      {/* ======================================
          DAILY STATISTICS
      ====================================== */}

      <div className="behar-calendar-day-view__stats">
        <div className="behar-calendar-day-view__stat">
          <CalendarCheck2
            size={17}
            aria-hidden="true"
          />

          <span className="behar-calendar-day-view__stat-number">
            {totalCount}
          </span>

          <span>{t.scheduled}</span>
        </div>

        <div className="behar-calendar-day-view__stat">
          <BookOpen
            size={17}
            aria-hidden="true"
          />

          <span className="behar-calendar-day-view__stat-number">
            {academicCount}
          </span>

          <span>{t.academic}</span>
        </div>

        <div className="behar-calendar-day-view__stat">
          <Clock3
            size={17}
            aria-hidden="true"
          />

          <span className="behar-calendar-day-view__stat-number">
            {personalCount}
          </span>

          <span>{t.personal}</span>
        </div>
      </div>

      {/* ======================================
          EMPTY STATE
      ====================================== */}

      {totalCount === 0 && (
        <div className="behar-calendar-day-view__empty">
          <div className="behar-calendar-day-view__empty-icon">
            <CalendarDays
              size={26}
              aria-hidden="true"
            />
          </div>

          <h3>{t.noEvents}</h3>

          <p>{t.noEventsDescription}</p>

          {storageWritable && (
            <button
              type="button"
              onClick={handleCreateEvent}
            >
              <Plus
                size={16}
                aria-hidden="true"
              />

              {t.addPersonalEvent}
            </button>
          )}
        </div>
      )}

      {/* ======================================
          ALL-DAY EVENTS
      ====================================== */}

      {allDayEvents.length > 0 && (
        <div className="behar-calendar-day-view__all-day">
          <div className="behar-calendar-day-view__section-heading">
            <span>{t.allDay}</span>

            <span className="behar-calendar-day-view__section-count">
              {allDayEvents.length}
            </span>
          </div>

          <div className="behar-calendar-day-view__all-day-list">
            {allDayEvents.map((event) => (
              <AllDayEvent
                key={event.id}
                event={event}
                language={language}
                onOpen={handleOpenEvent}
              />
            ))}
          </div>
        </div>
      )}

      {/* ======================================
          TIMELINE
      ====================================== */}

      <div className="behar-calendar-day-view__timeline-section">
        <div className="behar-calendar-day-view__timeline-heading">
          <h3>{t.timeline}</h3>

          <span>{t.timeZone}</span>
        </div>

        <div className="behar-calendar-day-view__timeline-scroll">
          <div className="behar-calendar-day-view__timeline">
            {/* Time labels */}

            <div className="behar-calendar-day-view__time-column">
              {Array.from(
                { length: END_HOUR - START_HOUR },
                (_, index) => index + START_HOUR
              ).map((hour) => (
                <div
                  key={hour}
                  className="behar-calendar-day-view__time-slot"
                  style={{
                    height: `${HOUR_HEIGHT}px`,
                  }}
                >
                  <span>
                    {getTimeLabel(
                      hour,
                      language
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Schedule */}

            <div
              className="behar-calendar-day-view__schedule"
              style={{
                height: `${
                  (END_HOUR - START_HOUR) *
                  HOUR_HEIGHT
                }px`,
              }}
            >
              {/* Hour lines */}

              {Array.from(
                { length: END_HOUR - START_HOUR },
                (_, index) => index + START_HOUR
              ).map((hour) => (
                <div
                  key={hour}
                  className="behar-calendar-day-view__hour"
                  style={{
                    height: `${HOUR_HEIGHT}px`,
                  }}
                />
              ))}

              {/* Current time */}

              {currentTimePosition !== null && (
                <div
                  className="behar-calendar-day-view__now"
                  style={{
                    top: `${currentTimePosition}px`,
                  }}
                  aria-label={t.currentTime}
                >
                  <span className="behar-calendar-day-view__now-dot" />
                  <span className="behar-calendar-day-view__now-line" />
                </div>
              )}

              {/* Timed events */}

              {timedEvents.map((item) => (
                <TimedEvent
                  key={item.event.id}
                  item={item}
                  language={language}
                  onOpen={handleOpenEvent}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
