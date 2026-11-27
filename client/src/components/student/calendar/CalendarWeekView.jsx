
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Plus,
  ChevronLeft,
  ChevronRight,
  LockKeyhole,
} from "lucide-react";

import useCalendar from "../../../hooks/useCalendar";

import {
  CALENDAR_SOURCES,
  CALENDAR_VIEWS,
  getCalendarEventTitle,
} from "../../../data/calendar";

import {
  getCalendarWeekDays,
  getCalendarDateKey,
  getTodayCalendarKey,
  formatCalendarTime,
  formatCalendarWeekday,
  calendarEventOccursOnDay,
} from "../../../utils/calendarDates";

import CalendarEmptyState from "./CalendarEmptyState";

import "../../../styles/student/calendar/calendar-week-view.css";

const HOUR_HEIGHT = 76;
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const COPY = {
  en: {
    allDay: "All day",
    today: "Today",
    newEvent: "Add event",
    noEvents: "No events",
    timezone: "Saudi Arabia · UTC+3",
    previous: "Previous week",
    next: "Next week",
    openEvent: "Open event",
    addAt: "Add an event",
    academic: "Academic",
    personal: "Personal",
  },
  ar: {
    allDay: "طوال اليوم",
    today: "اليوم",
    newEvent: "إضافة فعالية",
    noEvents: "لا توجد فعاليات",
    timezone: "السعودية · UTC+3",
    previous: "الأسبوع السابق",
    next: "الأسبوع التالي",
    openEvent: "عرض الفعالية",
    addAt: "إضافة فعالية",
    academic: "تعليمي",
    personal: "شخصي",
  },
};

function getRiyadhParts(value) {
  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Riyadh",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  return {
    hour: Number(parts.find((p) => p.type === "hour")?.value ?? 0),
    minute: Number(parts.find((p) => p.type === "minute")?.value ?? 0),
  };
}

function minutesInRiyadh(value) {
  const parts = getRiyadhParts(value);
  return parts ? parts.hour * 60 + parts.minute : 0;
}

function formatHour(hour, language) {
  const date = new Date(Date.UTC(2026, 0, 1, hour, 0));

  return new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-US",
    {
      timeZone: "UTC",
      hour: "numeric",
      hour12: true,
    }
  ).format(date);
}

function getEventDateKey(value) {
  return getCalendarDateKey(new Date(value));
}

function getEventEndKey(event) {
  const end = new Date(event.endAt);

  if (!Number.isFinite(end.getTime())) {
    return getEventDateKey(event.startAt);
  }

  // Calendar event end timestamps are exclusive.
  return getCalendarDateKey(
    new Date(end.getTime() - 1)
  );
}

function getDaySegments(events, dayKey) {
  const segments = [];

  for (const event of events) {
    if (!event?.startAt || !event?.endAt) continue;

    if (!calendarEventOccursOnDay(event, dayKey)) continue;

    const startKey = getEventDateKey(event.startAt);
    const endKey = getEventEndKey(event);

    const start =
      startKey < dayKey
        ? 0
        : minutesInRiyadh(event.startAt);

    const end =
      endKey > dayKey
        ? 1440
        : minutesInRiyadh(event.endAt);

    const effectiveEnd =
      end === 0 && endKey === dayKey
        ? 1440
        : end;

    if (effectiveEnd <= start) continue;

    segments.push({
      event,
      start,
      end: effectiveEnd,
    });
  }

  return segments.sort(
    (a, b) =>
      a.start - b.start ||
      b.end - b.start - (a.end - a.start)
  );
}

function positionOverlappingEvents(segments) {
  const positioned = [];
  let group = [];
  let groupEnd = -1;

  function flushGroup() {
    if (!group.length) return;

    const columns = [];

    for (const segment of group) {
      let column = columns.findIndex(
        (end) => end <= segment.start
      );

      if (column === -1) {
        column = columns.length;
        columns.push(segment.end);
      } else {
        columns[column] = segment.end;
      }

      segment.column = column;
    }

    for (const segment of group) {
      positioned.push({
        ...segment,
        columnCount: columns.length,
      });
    }

    group = [];
    groupEnd = -1;
  }

  for (const original of segments) {
    const segment = { ...original };

    if (group.length && segment.start >= groupEnd) {
      flushGroup();
    }

    group.push(segment);
    groupEnd = Math.max(groupEnd, segment.end);
  }

  flushGroup();

  return positioned;
}

function getDayEvents(events, dayKey) {
  const matching = events.filter(
    (event) =>
      event?.startAt &&
      event?.endAt &&
      calendarEventOccursOnDay(event, dayKey)
  );

  return {
    allDay: matching.filter((event) => event.allDay),
    timed: positionOverlappingEvents(
      getDaySegments(
        matching.filter((event) => !event.allDay),
        dayKey
      )
    ),
  };
}

function EventCard({
  segment,
  language,
  onOpen,
}) {
  const { event, start, end, column, columnCount } = segment;

  const isPersonal =
    event.source === CALENDAR_SOURCES.PERSONAL;

  const top = (start / 60) * HOUR_HEIGHT;
  const height = Math.max(
    ((end - start) / 60) * HOUR_HEIGHT,
    24
  );

  const width = 100 / columnCount;
  const offset = column * width;

  const title = getCalendarEventTitle(event, language);
  const startLabel = formatCalendarTime(
    event.startAt,
    language
  );
  const endLabel = formatCalendarTime(
    event.endAt,
    language
  );

  return (
    <button
      type="button"
      className={[
        "behar-week__event",
        isPersonal
          ? "behar-week__event--personal"
          : "behar-week__event--academic",
        event.priority === "high"
          ? "behar-week__event--high"
          : "",
      ].filter(Boolean).join(" ")}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        insetInlineStart: `calc(${offset}% + 2px)`,
        width: `calc(${width}% - 4px)`,
        zIndex: column + 2,
      }}
      onClick={(clickEvent) => {
        clickEvent.stopPropagation();
        onOpen(event.id);
      }}
      title={`${title} · ${startLabel} – ${endLabel}`}
      aria-label={`${title}, ${startLabel} – ${endLabel}`}
    >
      <span className="behar-week__event-title">
        {title}
      </span>

      {height >= 48 && (
        <span className="behar-week__event-time">
          {startLabel} – {endLabel}
        </span>
      )}
    </button>
  );
}

function AllDayEvent({ event, language, onOpen }) {
  const isPersonal =
    event.source === CALENDAR_SOURCES.PERSONAL;

  return (
    <button
      type="button"
      className={[
        "behar-week__all-day-event",
        isPersonal
          ? "behar-week__all-day-event--personal"
          : "behar-week__all-day-event--academic",
      ].join(" ")}
      onClick={() => onOpen(event.id)}
    >
      <span className="behar-week__all-day-dot" />
      <span className="behar-week__all-day-title">
        {getCalendarEventTitle(event, language)}
      </span>
    </button>
  );
}

export default function CalendarWeekView({
  className = "",
}) {
  const {
    language,
    selectedDate,
    filteredEvents,
    todayKey,
    storageWritable,
    goToDate,
    goToPrevious,
    goToNext,
    openEventDetails,
    openCreateEvent,
    changeView,
  } = useCalendar();

  const isArabic = language === "ar";
  const t = COPY[isArabic ? "ar" : "en"];

  const scrollRef = useRef(null);
  const [now, setNow] = useState(() => new Date());

  const days = useMemo(
    () => getCalendarWeekDays(selectedDate),
    [selectedDate]
  );

  const dayData = useMemo(
    () =>
      days.map((date) => {
        const key =
          date?.dateKey ??
          (typeof date === "string"
            ? date
            : getTodayCalendarKey());

        return {
          date,
          key,
          ...getDayEvents(filteredEvents, key),
        };
      }),
    [days, filteredEvents]
  );

  const hasEvents = dayData.some(
    (day) => day.allDay.length || day.timed.length
  );

  const currentDayKey = getCalendarDateKey(now);
  const nowMinutes = minutesInRiyadh(now);
  const currentLineTop =
    (nowMinutes / 60) * HOUR_HEIGHT;

  useEffect(() => {
    const timer = window.setInterval(
      () => setNow(new Date()),
      60_000
    );

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;

    const target = Math.max(
      0,
      8 * HOUR_HEIGHT - 80
    );

    scrollRef.current.scrollTop = target;
  }, []);

  const handleSlotClick = (dayKey, hour) => {
    if (!storageWritable) return;

    openCreateEvent(dayKey);
  };

  const handleDayClick = (date) => {
    goToDate(date);
    changeView(CALENDAR_VIEWS.DAY);
  };

  return (
    <section
      className={[
        "behar-week",
        className,
      ].filter(Boolean).join(" ")}
      dir={isArabic ? "rtl" : "ltr"}
      aria-label={
        isArabic ? "التقويم الأسبوعي" : "Weekly calendar"
      }
    >
      {/* Week navigation */}

      <div className="behar-week__topbar">
        <div className="behar-week__topbar-title">
          <CalendarDays size={17} aria-hidden="true" />
          <span>
            {isArabic ? "عرض الأسبوع" : "Week view"}
          </span>
        </div>

        <div className="behar-week__navigation">
          <button
            type="button"
            onClick={goToPrevious}
            aria-label={t.previous}
          >
            {isArabic
              ? <ChevronRight size={16} />
              : <ChevronLeft size={16} />}
          </button>

          <button
            type="button"
            onClick={goToNext}
            aria-label={t.next}
          >
            {isArabic
              ? <ChevronLeft size={16} />
              : <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      {/* Header */}

      <div className="behar-week__header">
        <div className="behar-week__header-gutter">
          <Clock3 size={15} aria-hidden="true" />
        </div>

        {dayData.map((day) => {
          const isToday =
            day.key === (todayKey || getTodayCalendarKey());

          return (
            <button
              key={day.key}
              type="button"
              className={[
                "behar-week__day-heading",
                isToday
                  ? "behar-week__day-heading--today"
                  : "",
              ].join(" ")}
              onClick={() => handleDayClick(day.key)}
            >
              <span className="behar-week__weekday">
                {formatCalendarWeekday(
                  day.key,
                  language,
                  "short"
                )}
              </span>

              <span className="behar-week__day-number">
                {new Intl.DateTimeFormat(
                  isArabic ? "ar-SA" : "en-US",
                  {
                    timeZone: "UTC",
                    day: "numeric",
                  }
                ).format(
                  new Date(`${day.key}T12:00:00Z`)
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* All-day section */}

      <div className="behar-week__all-day-row">
        <div className="behar-week__all-day-label">
          {t.allDay}
        </div>

        {dayData.map((day) => (
          <div
            key={day.key}
            className="behar-week__all-day-cell"
          >
            {day.allDay.map((event) => (
              <AllDayEvent
                key={event.id}
                event={event}
                language={language}
                onOpen={openEventDetails}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Timezone */}

      <div className="behar-week__timezone">
        <Clock3 size={12} aria-hidden="true" />
        {t.timezone}
      </div>

      {/* Timeline */}

      <div
        ref={scrollRef}
        className="behar-week__scroll"
      >
        <div
          className="behar-week__timeline"
          style={{
            "--behar-hour-height": `${HOUR_HEIGHT}px`,
          }}
        >
          {/* Time labels */}

          <div className="behar-week__time-column">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="behar-week__time-label"
                style={{
                  top: `${hour * HOUR_HEIGHT}px`,
                }}
              >
                {formatHour(hour, language)}
              </div>
            ))}
          </div>

          {/* Seven days */}

          {dayData.map((day) => (
            <div
              key={day.key}
              className={[
                "behar-week__day-column",
                day.key === currentDayKey
                  ? "behar-week__day-column--today"
                  : "",
              ].join(" ")}
            >
              {/* Clickable hour slots */}

              {HOURS.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  className="behar-week__hour-slot"
                  style={{
                    top: `${hour * HOUR_HEIGHT}px`,
                    height: `${HOUR_HEIGHT}px`,
                  }}
                  onClick={() =>
                    handleSlotClick(day.key, hour)
                  }
                  disabled={!storageWritable}
                  aria-label={`${t.addAt}: ${day.key}, ${formatHour(hour, language)}`}
                >
                  <Plus size={14} aria-hidden="true" />
                </button>
              ))}

              {/* Events */}

              {day.timed.map((segment) => (
                <EventCard
                  key={`${segment.event.id}-${day.key}`}
                  segment={segment}
                  language={language}
                  onOpen={openEventDetails}
                />
              ))}

              {/* Current time line */}

              {day.key === currentDayKey && (
                <div
                  className="behar-week__now-line"
                  style={{
                    top: `${currentLineTop}px`,
                  }}
                  aria-hidden="true"
                >
                  <span />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Empty state */}

      {!hasEvents && (
        <div className="behar-week__empty">
          <CalendarEmptyState
            variant="week"
            compact
            embedded
          />
        </div>
      )}

      {!storageWritable && (
        <div className="behar-week__storage-note">
          <LockKeyhole size={13} aria-hidden="true" />
          {isArabic
            ? "إضافة الفعاليات الشخصية غير متاحة حاليًا."
            : "Personal event creation is currently unavailable."}
        </div>
      )}
    </section>
  );
}
