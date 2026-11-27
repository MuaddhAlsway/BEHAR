
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 19
 *
 * UpcomingEvents
 *
 * Features:
 * - Upcoming event list
 * - Grouped by date
 * - Academic / personal events
 * - English / Arabic localization
 * - Asia/Riyadh timezone
 * - Today / Tomorrow labels
 * - Event details integration
 * - Empty states
 * - Load more / show less
 * - Personal event creation
 * - Responsive design
 *
 * Pure CSS — no Tailwind.
 */

import { useMemo, useState } from "react";

import {
  CalendarDays,
  Clock3,
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowUpRight,
  CalendarCheck2,
  Sparkles,
} from "lucide-react";

import useCalendar from "../../../hooks/useCalendar";

import CalendarEvent from "./CalendarEvent";

import {
  CALENDAR_SOURCES,
  CALENDAR_TIME_ZONE,
} from "../../../data/calendar";

import {
  getCalendarDateKey,
  startOfCalendarDay,
  addCalendarDays,
} from "../../../utils/calendarDates";

import "../../../styles/student/calendar/upcoming-events.css";

// ------------------------------------------------------------
// Configuration
// ------------------------------------------------------------

const DEFAULT_VISIBLE_COUNT = 6;
const LOAD_MORE_COUNT = 6;

const TRANSLATIONS = {
  en: {
    title: "Coming up",
    subtitle: "Your next learning milestones",
    upcoming: "Upcoming events",
    today: "Today",
    tomorrow: "Tomorrow",
    noEvents: "Nothing coming up",
    noEventsDescription:
      "You're all caught up. Add a study session or personal reminder to stay organized.",
    noFilteredEvents: "No matching upcoming events",
    noFilteredEventsDescription:
      "Try adjusting your calendar filters to see more events.",
    addEvent: "Add personal event",
    viewCalendar: "View calendar",
    showMore: "Show more",
    showLess: "Show less",
    academic: "Academic",
    personal: "Personal",
    event: "event",
    events: "events",
    scheduled: "scheduled",
    timeZone: "Saudi Arabia time",
  },

  ar: {
    title: "القادم",
    subtitle: "أهم محطاتك التعليمية القادمة",
    upcoming: "الفعاليات القادمة",
    today: "اليوم",
    tomorrow: "غدًا",
    noEvents: "لا توجد فعاليات قادمة",
    noEventsDescription:
      "أنت على اطلاع بكل شيء. أضف جلسة دراسة أو تذكيرًا شخصيًا لتنظيم وقتك.",
    noFilteredEvents: "لا توجد فعاليات قادمة مطابقة",
    noFilteredEventsDescription:
      "جرّب تعديل فلاتر التقويم لعرض المزيد من الفعاليات.",
    addEvent: "إضافة فعالية شخصية",
    viewCalendar: "عرض التقويم",
    showMore: "عرض المزيد",
    showLess: "عرض أقل",
    academic: "أكاديمي",
    personal: "شخصي",
    event: "فعالية",
    events: "فعاليات",
    scheduled: "مجدولة",
    timeZone: "بتوقيت السعودية",
  },
};

// ------------------------------------------------------------
// Date helpers
// ------------------------------------------------------------

function getDateLabel(dateKey, language) {
  const date = startOfCalendarDay(dateKey);

  return new Intl.DateTimeFormat(
    language === "ar"
      ? "ar-SA-u-ca-gregory"
      : "en-US",
    {
      timeZone: CALENDAR_TIME_ZONE,
      weekday: "long",
      month: "long",
      day: "numeric",
    }
  ).format(date);
}

function getRelativeDateLabel(
  dateKey,
  todayKey,
  tomorrowKey,
  language,
  t
) {
  if (dateKey === todayKey) {
    return t.today;
  }

  if (dateKey === tomorrowKey) {
    return t.tomorrow;
  }

  return getDateLabel(dateKey, language);
}

function getDateNumber(dateKey, language) {
  const number = Number(
    dateKey.slice(8, 10)
  );

  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US",
    { useGrouping: false }
  ).format(number);
}

function getMonthLabel(dateKey, language) {
  return new Intl.DateTimeFormat(
    language === "ar"
      ? "ar-SA-u-ca-gregory"
      : "en-US",
    {
      timeZone: CALENDAR_TIME_ZONE,
      month: "short",
    }
  ).format(startOfCalendarDay(dateKey));
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

// ------------------------------------------------------------
// Event helpers
// ------------------------------------------------------------

function getEventStart(event) {
  const value = new Date(
    event?.startAt
  ).getTime();

  return Number.isFinite(value)
    ? value
    : null;
}

function getEventEnd(event) {
  const value = new Date(
    event?.endAt
  ).getTime();

  return Number.isFinite(value)
    ? value
    : null;
}

function isUpcomingEvent(event, now) {
  const start = getEventStart(event);
  const end = getEventEnd(event);

  if (start === null || end === null) {
    return false;
  }

  if (end <= start) {
    return false;
  }

  if (end <= now) {
    return false;
  }

  const status = String(
    event.status || ""
  ).toLowerCase();

  return (
    status !== "cancelled" &&
    status !== "canceled" &&
    status !== "completed"
  );
}

function sortUpcomingEvents(a, b) {
  return (
    getEventStart(a) -
      getEventStart(b) ||
    String(a.id).localeCompare(String(b.id))
  );
}

// ------------------------------------------------------------
// Group upcoming events by date
// ------------------------------------------------------------

function groupEventsByDate(events, now) {
  const groups = new Map();

  for (const event of events) {
    const start = getEventStart(event);

    if (start === null) continue;

    const dateKey = getCalendarDateKey(
      new Date(Math.max(start, now))
    );

    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }

    groups.get(dateKey).push(event);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, dayEvents]) => ({
      dateKey,
      events: dayEvents.sort(
        sortUpcomingEvents
      ),
    }));
}

// ------------------------------------------------------------
// Date group
// ------------------------------------------------------------

function UpcomingDateGroup({
  group,
  language,
  todayKey,
  tomorrowKey,
  onOpenEvent,
  t,
}) {
  const { dateKey, events } = group;

  const isToday = dateKey === todayKey;

  const dateLabel = getRelativeDateLabel(
    dateKey,
    todayKey,
    tomorrowKey,
    language,
    t
  );

  return (
    <div className="behar-upcoming-events__group">
      <div className="behar-upcoming-events__date-heading">
        <div
          className={[
            "behar-upcoming-events__date-badge",
            isToday
              ? "behar-upcoming-events__date-badge--today"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className="behar-upcoming-events__date-month">
            {getMonthLabel(
              dateKey,
              language
            )}
          </span>

          <span className="behar-upcoming-events__date-number">
            {getDateNumber(
              dateKey,
              language
            )}
          </span>
        </div>

        <div className="behar-upcoming-events__date-info">
          <h3>{dateLabel}</h3>

          <span>
            {getEventCountLabel(
              events.length,
              language,
              t
            )}
          </span>
        </div>
      </div>

      <div className="behar-upcoming-events__group-list">
        {events.map((event) => (
          <CalendarEvent
            key={event.id}
            event={event}
            variant="upcoming"
            language={language}
            onClick={onOpenEvent}
          />
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Empty state
// ------------------------------------------------------------

function UpcomingEmptyState({
  language,
  isFiltered,
  storageWritable,
  onCreateEvent,
  onViewCalendar,
  t,
}) {
  return (
    <div
      className="behar-upcoming-events__empty"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="behar-upcoming-events__empty-illustration">
        <div className="behar-upcoming-events__empty-icon">
          <CalendarCheck2
            size={28}
            strokeWidth={1.6}
            aria-hidden="true"
          />
        </div>

        <Sparkles
          className="behar-upcoming-events__empty-sparkle"
          size={18}
          aria-hidden="true"
        />
      </div>

      <h3>
        {isFiltered
          ? t.noFilteredEvents
          : t.noEvents}
      </h3>

      <p>
        {isFiltered
          ? t.noFilteredEventsDescription
          : t.noEventsDescription}
      </p>

      <div className="behar-upcoming-events__empty-actions">
        {storageWritable && (
          <button
            type="button"
            className="behar-upcoming-events__primary-button"
            onClick={onCreateEvent}
          >
            <Plus
              size={16}
              aria-hidden="true"
            />

            {t.addEvent}
          </button>
        )}

        <button
          type="button"
          className="behar-upcoming-events__secondary-button"
          onClick={onViewCalendar}
        >
          {t.viewCalendar}

          <ArrowUpRight
            size={15}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Main component
// ------------------------------------------------------------

export default function UpcomingEvents({
  className = "",
  initialVisibleCount = DEFAULT_VISIBLE_COUNT,
  showHeader = true,
}) {
  const {
    language,
    filteredEvents,
    filtersActive,
    selectedDateKey,
    changeView,
    openEventDetails,
    openCreateEvent,
    storageWritable,
  } = useCalendar();

  const isArabic = language === "ar";
  const t = TRANSLATIONS[isArabic ? "ar" : "en"];

  const [visibleCount, setVisibleCount] = useState(
    Math.max(1, initialVisibleCount)
  );

  const [now] = useState(() => Date.now());

  const todayKey = getCalendarDateKey(
    new Date(now)
  );

  const tomorrowKey = getCalendarDateKey(
    addCalendarDays(todayKey, 1)
  );

  // ----------------------------------------------------------
  // Upcoming events
  // ----------------------------------------------------------

  const upcomingEvents = useMemo(() => {
    const events = Array.isArray(filteredEvents)
      ? filteredEvents
      : [];

    return events
      .filter((event) =>
        isUpcomingEvent(event, now)
      )
      .sort(sortUpcomingEvents);
  }, [filteredEvents, now]);

  // ----------------------------------------------------------
  // Visible events
  // ----------------------------------------------------------

  const visibleEvents = useMemo(() => {
    return upcomingEvents.slice(
      0,
      visibleCount
    );
  }, [upcomingEvents, visibleCount]);

  // ----------------------------------------------------------
  // Date groups
  // ----------------------------------------------------------

  const groupedEvents = useMemo(() => {
    return groupEventsByDate(
      visibleEvents,
      now
    );
  }, [visibleEvents, now]);

  // ----------------------------------------------------------
  // Statistics
  // ----------------------------------------------------------

  const academicCount = upcomingEvents.filter(
    (event) =>
      event.source === CALENDAR_SOURCES.ACADEMIC
  ).length;

  const personalCount = upcomingEvents.filter(
    (event) =>
      event.source === CALENDAR_SOURCES.PERSONAL
  ).length;

  const hasMore =
    visibleCount < upcomingEvents.length;

  const canShowLess =
    visibleCount > initialVisibleCount;

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

  const handleViewCalendar = () => {
    changeView("month");
  };

  const handleShowMore = () => {
    setVisibleCount(
      (current) => current + LOAD_MORE_COUNT
    );
  };

  const handleShowLess = () => {
    setVisibleCount(
      Math.max(1, initialVisibleCount)
    );
  };

  // ----------------------------------------------------------
  // Root classes
  // ----------------------------------------------------------

  const rootClassName = [
    "behar-upcoming-events",
    isArabic
      ? "behar-upcoming-events--rtl"
      : "behar-upcoming-events--ltr",
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
      aria-label={t.upcoming}
    >
      {/* ======================================
          HEADER
      ====================================== */}

      {showHeader && (
        <header className="behar-upcoming-events__header">
          <div className="behar-upcoming-events__heading">
            <div className="behar-upcoming-events__heading-icon">
              <CalendarDays
                size={19}
                aria-hidden="true"
              />
            </div>

            <div>
              <h2>{t.title}</h2>
              <p>{t.subtitle}</p>
            </div>
          </div>

          {storageWritable && (
            <button
              type="button"
              className="behar-upcoming-events__create"
              onClick={handleCreateEvent}
            >
              <Plus
                size={16}
                aria-hidden="true"
              />

              <span>{t.addEvent}</span>
            </button>
          )}
        </header>
      )}

      {/* ======================================
          SUMMARY
      ====================================== */}

      <div className="behar-upcoming-events__summary">
        <div className="behar-upcoming-events__summary-item">
          <Clock3
            size={16}
            aria-hidden="true"
          />

          <strong>
            {upcomingEvents.length}
          </strong>

          <span>{t.scheduled}</span>
        </div>

        <div className="behar-upcoming-events__summary-item">
          <span className="behar-upcoming-events__summary-dot behar-upcoming-events__summary-dot--academic" />

          <strong>{academicCount}</strong>

          <span>{t.academic}</span>
        </div>

        <div className="behar-upcoming-events__summary-item">
          <span className="behar-upcoming-events__summary-dot behar-upcoming-events__summary-dot--personal" />

          <strong>{personalCount}</strong>

          <span>{t.personal}</span>
        </div>
      </div>

      {/* ======================================
          EVENTS / EMPTY STATE
      ====================================== */}

      {groupedEvents.length > 0 ? (
        <div className="behar-upcoming-events__body">
          {groupedEvents.map((group) => (
            <UpcomingDateGroup
              key={group.dateKey}
              group={group}
              language={language}
              todayKey={todayKey}
              tomorrowKey={tomorrowKey}
              onOpenEvent={handleOpenEvent}
              t={t}
            />
          ))}

          {/* Pagination */}

          {(hasMore || canShowLess) && (
            <div className="behar-upcoming-events__pagination">
              {hasMore && (
                <button
                  type="button"
                  onClick={handleShowMore}
                >
                  {t.showMore}

                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                  />
                </button>
              )}

              {canShowLess && (
                <button
                  type="button"
                  onClick={handleShowLess}
                >
                  {t.showLess}

                  <ChevronUp
                    size={16}
                    aria-hidden="true"
                  />
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <UpcomingEmptyState
          language={language}
          isFiltered={Boolean(filtersActive)}
          storageWritable={storageWritable}
          onCreateEvent={handleCreateEvent}
          onViewCalendar={handleViewCalendar}
          t={t}
        />
      )}

      {/* ======================================
          FOOTER
      ====================================== */}

      <footer className="behar-upcoming-events__footer">
        <span>{t.timeZone}</span>

        <span>
          {getEventCountLabel(
            upcomingEvents.length,
            language,
            t
          )}
        </span>
      </footer>
    </section>
  );
}
