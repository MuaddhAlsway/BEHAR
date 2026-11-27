
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 18
 *
 * CalendarSidebar
 *
 * Features:
 * - Mini monthly calendar
 * - Sunday-first weekdays
 * - Month navigation
 * - Today shortcut
 * - Date selection
 * - Academic / personal categories
 * - Event type indicators
 * - Selected-day information
 * - Upcoming events preview
 * - English / Arabic
 * - Asia/Riyadh timezone
 *
 * Pure CSS — no Tailwind.
 */

import { useMemo, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CalendarCheck2,
  BookOpen,
  Clock3,
  Plus,
  ArrowUpRight,
  Circle,
} from "lucide-react";

import useCalendar from "../../../hooks/useCalendar";

import CalendarEvent from "./CalendarEvent";

import {
  CALENDAR_SOURCES,
  CALENDAR_VIEWS,
  CALENDAR_EVENT_TYPES,
  CALENDAR_TIME_ZONE,
  getCalendarEventTitle,
} from "../../../data/calendar";

import {
  getCalendarDateKey,
  toCalendarDate,
  getCalendarMonthGrid,
  getCalendarWeekdayLabels,
  startOfCalendarDay,
  addCalendarDays,
  addCalendarMonths,
  formatCalendarMonthYear,
} from "../../../utils/calendarDates";

import "../../../styles/student/calendar/calendar-sidebar.css";

// ------------------------------------------------------------
// Configuration
// ------------------------------------------------------------

const MAX_UPCOMING_EVENTS = 3;

const TRANSLATIONS = {
  en: {
    calendar: "Calendar",
    miniCalendar: "Mini calendar",
    today: "Today",
    selectedDay: "Selected day",
    events: "events",
    event: "event",
    noEvents: "No events scheduled",
    upcoming: "Coming up",
    categories: "Event categories",
    academic: "Academic",
    personal: "Personal",
    liveSessions: "Live sessions",
    lessons: "Lessons",
    assignments: "Assignments",
    assessments: "Quizzes & exams",
    deadlines: "Deadlines",
    studySessions: "Study sessions",
    reminders: "Reminders",
    goals: "Study goals",
    personalTasks: "Personal tasks",
    viewDay: "View day",
    viewAll: "View all",
    addEvent: "Add personal event",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    scheduled: "Scheduled",
    timeZone: "Saudi Arabia time",
  },

  ar: {
    calendar: "التقويم",
    miniCalendar: "التقويم المصغر",
    today: "اليوم",
    selectedDay: "اليوم المحدد",
    events: "فعاليات",
    event: "فعالية",
    noEvents: "لا توجد فعاليات مجدولة",
    upcoming: "القادم",
    categories: "تصنيفات الفعاليات",
    academic: "أكاديمي",
    personal: "شخصي",
    liveSessions: "الجلسات المباشرة",
    lessons: "الدروس",
    assignments: "الواجبات",
    assessments: "الاختبارات",
    deadlines: "المواعيد النهائية",
    studySessions: "جلسات الدراسة",
    reminders: "التذكيرات",
    goals: "الأهداف الدراسية",
    personalTasks: "المهام الشخصية",
    viewDay: "عرض اليوم",
    viewAll: "عرض الكل",
    addEvent: "إضافة فعالية شخصية",
    previousMonth: "الشهر السابق",
    nextMonth: "الشهر التالي",
    scheduled: "مجدول",
    timeZone: "بتوقيت السعودية",
  },
};

const CATEGORY_CONFIG = [
  {
    id: "live",
    type: CALENDAR_EVENT_TYPES.LIVE_SESSION,
    labelKey: "liveSessions",
    appearance: "live",
  },
  {
    id: "lesson",
    type: CALENDAR_EVENT_TYPES.LESSON,
    labelKey: "lessons",
    appearance: "lesson",
  },
  {
    id: "assignment",
    type: CALENDAR_EVENT_TYPES.ASSIGNMENT,
    labelKey: "assignments",
    appearance: "assignment",
  },
  {
    id: "quiz",
    type: CALENDAR_EVENT_TYPES.QUIZ,
    labelKey: "assessments",
    appearance: "assessment",
  },
  {
    id: "exam",
    type: CALENDAR_EVENT_TYPES.EXAM,
    labelKey: "assessments",
    appearance: "assessment",
  },
  {
    id: "deadline",
    type: CALENDAR_EVENT_TYPES.DEADLINE,
    labelKey: "deadlines",
    appearance: "deadline",
  },
  {
    id: "study",
    type: CALENDAR_EVENT_TYPES.STUDY_SESSION,
    labelKey: "studySessions",
    appearance: "study",
  },
  {
    id: "reminder",
    type: CALENDAR_EVENT_TYPES.REMINDER,
    labelKey: "reminders",
    appearance: "reminder",
  },
  {
    id: "goal",
    type: CALENDAR_EVENT_TYPES.STUDY_GOAL,
    labelKey: "goals",
    appearance: "goal",
  },
  {
    id: "task",
    type: CALENDAR_EVENT_TYPES.PERSONAL_TASK,
    labelKey: "personalTasks",
    appearance: "task",
  },
];

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

  const rawDate =
    typeof day === "string"
      ? day
      : day?.date ??
        day?.dateKey ??
        day?.key ??
        day?.value;

  if (!rawDate) return null;

  const dateKey = getCalendarDateKey(rawDate);

  return {
    date: startOfCalendarDay(dateKey),
    dateKey,
  };
}

function getDateNumber(dateKey, language) {
  const number = Number(dateKey.slice(8, 10));

  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US",
    { useGrouping: false }
  ).format(number);
}

function getFullDateLabel(date, language) {
  let safeDate;

  try {
    safeDate = toCalendarDate(date);
  } catch {
    safeDate = new Date();
  }

  if (!(safeDate instanceof Date) || !Number.isFinite(safeDate.getTime())) {
    safeDate = new Date();
  }

  return new Intl.DateTimeFormat(
    language === "ar"
      ? "ar-SA-u-ca-gregory"
      : "en-US",
    {
      timeZone: CALENDAR_TIME_ZONE,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  ).format(safeDate);
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

function overlapsDay(event, dateKey) {
  if (!event?.startAt || !event?.endAt) {
    return false;
  }

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
// Mini calendar
// ------------------------------------------------------------

function MiniCalendar({
  language,
  selectedDateKey,
  todayKey,
  events,
  onSelect,
  t,
}) {
  const [displayMonth, setDisplayMonth] = useState(
    () => startOfCalendarDay(selectedDateKey)
  );

  const days = useMemo(() => {
    const result = getCalendarMonthGrid(
      displayMonth
    );

    return Array.isArray(result)
      ? result.map(normalizeDay).filter(Boolean)
      : [];
  }, [displayMonth]);

  const weekdayLabels = useMemo(
    () => getCalendarWeekdayLabels(language, "short"),
    [language]
  );

  const currentMonthKey = getCalendarDateKey(
    displayMonth
  ).slice(0, 7);

  const eventDates = useMemo(() => {
    const dates = new Set();

    for (const day of days) {
      if (
        events.some((event) =>
          overlapsDay(event, day.dateKey)
        )
      ) {
        dates.add(day.dateKey);
      }
    }

    return dates;
  }, [days, events]);

  const handlePreviousMonth = () => {
    setDisplayMonth((current) =>
      addCalendarMonths(current, -1)
    );
  };

  const handleNextMonth = () => {
    setDisplayMonth((current) =>
      addCalendarMonths(current, 1)
    );
  };

  const handleToday = () => {
    const today = startOfCalendarDay(todayKey);

    setDisplayMonth(today);
    onSelect(todayKey);
  };

  const handleSelect = (dateKey) => {
    setDisplayMonth(startOfCalendarDay(dateKey));
    onSelect(dateKey);
  };

  return (
    <div className="behar-calendar-sidebar__mini">
      <div className="behar-calendar-sidebar__mini-header">
        <h3>
          {formatCalendarMonthYear(
            displayMonth,
            language
          )}
        </h3>

        <div className="behar-calendar-sidebar__mini-actions">
          <button
            type="button"
            onClick={handleToday}
            className="behar-calendar-sidebar__today"
          >
            {t.today}
          </button>

          <button
            type="button"
            onClick={handlePreviousMonth}
            aria-label={t.previousMonth}
            title={t.previousMonth}
          >
            <ChevronLeft
              size={16}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={handleNextMonth}
            aria-label={t.nextMonth}
            title={t.nextMonth}
          >
            <ChevronRight
              size={16}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <div
        className="behar-calendar-sidebar__mini-grid"
        aria-label={t.miniCalendar}
      >
        {weekdayLabels.map((label, index) => (
          <span
            key={index}
            className="behar-calendar-sidebar__weekday"
          >
            {label}
          </span>
        ))}

        {days.map((day) => {
          const dateKey = day.dateKey;

          const isToday = dateKey === todayKey;
          const isSelected =
            dateKey === selectedDateKey;

          const isOutside =
            dateKey.slice(0, 7) !==
            currentMonthKey;

          const hasEvents =
            eventDates.has(dateKey);

          return (
            <button
              key={dateKey}
              type="button"
              className={[
                "behar-calendar-sidebar__date",
                isToday
                  ? "behar-calendar-sidebar__date--today"
                  : "",
                isSelected
                  ? "behar-calendar-sidebar__date--selected"
                  : "",
                isOutside
                  ? "behar-calendar-sidebar__date--outside"
                  : "",
                hasEvents
                  ? "behar-calendar-sidebar__date--events"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() =>
                handleSelect(dateKey)
              }
              aria-label={getFullDateLabel(
                day.date,
                language
              )}
              aria-pressed={isSelected}
              aria-current={
                isToday ? "date" : undefined
              }
            >
              <span>
                {getDateNumber(
                  dateKey,
                  language
                )}
              </span>

              {hasEvents && (
                <span
                  className="behar-calendar-sidebar__date-dot"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Event categories
// ------------------------------------------------------------

function EventCategories({
  events,
  language,
  t,
}) {
  const academicCount = events.filter(
    (event) =>
      event.source === CALENDAR_SOURCES.ACADEMIC
  ).length;

  const personalCount = events.filter(
    (event) =>
      event.source === CALENDAR_SOURCES.PERSONAL
  ).length;

  const activeCategories = CATEGORY_CONFIG
    .map((category) => ({
      ...category,
      count: events.filter(
        (event) => event.type === category.type
      ).length,
    }))
    .filter((category) => category.count > 0);

  return (
    <div className="behar-calendar-sidebar__categories">
      <div className="behar-calendar-sidebar__section-heading">
        <h3>{t.categories}</h3>
      </div>

      <div className="behar-calendar-sidebar__source-list">
        <div className="behar-calendar-sidebar__source">
          <span className="behar-calendar-sidebar__source-label">
            <BookOpen
              size={15}
              aria-hidden="true"
            />

            {t.academic}
          </span>

          <span>{academicCount}</span>
        </div>

        <div className="behar-calendar-sidebar__source">
          <span className="behar-calendar-sidebar__source-label">
            <CalendarCheck2
              size={15}
              aria-hidden="true"
            />

            {t.personal}
          </span>

          <span>{personalCount}</span>
        </div>
      </div>

      {activeCategories.length > 0 && (
        <div className="behar-calendar-sidebar__category-list">
          {activeCategories.map((category) => (
            <div
              key={category.id}
              className="behar-calendar-sidebar__category"
            >
              <span className="behar-calendar-sidebar__category-label">
                <span
                  className={[
                    "behar-calendar-sidebar__category-dot",
                    `behar-calendar-sidebar__category-dot--${category.appearance}`,
                  ].join(" ")}
                />

                {t[category.labelKey]}
              </span>

              <span>{category.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// Selected day
// ------------------------------------------------------------

function SelectedDayPanel({
  selectedDate,
  selectedDateKey,
  events,
  language,
  storageWritable,
  onViewDay,
  onCreateEvent,
  onOpenEvent,
  t,
}) {
  const selectedEvents = useMemo(
    () =>
      events
        .filter((event) =>
          overlapsDay(event, selectedDateKey)
        )
        .sort(sortEvents),
    [events, selectedDateKey]
  );

  return (
    <div className="behar-calendar-sidebar__selected">
      <div className="behar-calendar-sidebar__section-heading">
        <h3>{t.selectedDay}</h3>

        <span className="behar-calendar-sidebar__count">
          {selectedEvents.length}
        </span>
      </div>

      <div className="behar-calendar-sidebar__selected-date">
        <CalendarDays
          size={17}
          aria-hidden="true"
        />

        <span>
          {getFullDateLabel(
            selectedDate,
            language
          )}
        </span>
      </div>

      <div className="behar-calendar-sidebar__selected-summary">
        {getEventCountLabel(
          selectedEvents.length,
          language,
          t
        )}
      </div>

      {selectedEvents.length > 0 ? (
        <div className="behar-calendar-sidebar__selected-events">
          {selectedEvents.slice(0, 3).map((event) => (
            <CalendarEvent
              key={event.id}
              event={event}
              variant="upcoming"
              language={language}
              onClick={onOpenEvent}
              compact
            />
          ))}
        </div>
      ) : (
        <p className="behar-calendar-sidebar__no-events">
          {t.noEvents}
        </p>
      )}

      <div className="behar-calendar-sidebar__selected-actions">
        <button
          type="button"
          className="behar-calendar-sidebar__view-day"
          onClick={() =>
            onViewDay(selectedDateKey)
          }
        >
          {t.viewDay}

          <ArrowUpRight
            size={14}
            aria-hidden="true"
          />
        </button>

        {storageWritable && (
          <button
            type="button"
            className="behar-calendar-sidebar__add-event"
            onClick={() =>
              onCreateEvent(selectedDateKey)
            }
            aria-label={t.addEvent}
            title={t.addEvent}
          >
            <Plus
              size={16}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Upcoming events preview
// ------------------------------------------------------------

function UpcomingPreview({
  events,
  language,
  onOpenEvent,
  onViewAll,
  t,
}) {
  const upcoming = useMemo(() => {
    const now = Date.now();

    return events
      .filter(
        (event) =>
          new Date(event.endAt).getTime() > now
      )
      .sort(sortEvents)
      .slice(0, MAX_UPCOMING_EVENTS);
  }, [events]);

  return (
    <div className="behar-calendar-sidebar__upcoming">
      <div className="behar-calendar-sidebar__section-heading">
        <h3>{t.upcoming}</h3>

        <button
          type="button"
          className="behar-calendar-sidebar__view-all"
          onClick={onViewAll}
        >
          {t.viewAll}
        </button>
      </div>

      {upcoming.length > 0 ? (
        <div className="behar-calendar-sidebar__upcoming-list">
          {upcoming.map((event) => (
            <CalendarEvent
              key={event.id}
              event={event}
              variant="upcoming"
              language={language}
              onClick={onOpenEvent}
              compact
            />
          ))}
        </div>
      ) : (
        <p className="behar-calendar-sidebar__no-events">
          {t.noEvents}
        </p>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// Main component
// ------------------------------------------------------------

export default function CalendarSidebar({
  className = "",
}) {
  const {
    language,
    selectedDate,
    selectedDateKey,
    filteredEvents,
    goToDate,
    goToToday,
    changeView,
    openEventDetails,
    openCreateEvent,
    storageWritable,
  } = useCalendar();

  const isArabic = language === "ar";
  const t = TRANSLATIONS[isArabic ? "ar" : "en"];

  const todayKey = getCalendarDateKey(new Date());

  const events = Array.isArray(filteredEvents)
    ? filteredEvents
    : [];

  // ----------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------

  const handleSelectDate = (dateKey) => {
    goToDate(dateKey);
  };

  const handleViewDay = (dateKey) => {
    goToDate(dateKey);
    changeView(CALENDAR_VIEWS.DAY);
  };

  const handleCreateEvent = (dateKey) => {
    if (!storageWritable) return;

    openCreateEvent(dateKey);
  };

  const handleOpenEvent = (eventId) => {
    openEventDetails(eventId);
  };

  const handleViewAll = () => {
    changeView(CALENDAR_VIEWS.MONTH);
  };

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------

  return (
    <aside
      className={[
        "behar-calendar-sidebar",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      dir={isArabic ? "rtl" : "ltr"}
      aria-label={t.calendar}
    >
      <MiniCalendar
        language={language}
        selectedDateKey={selectedDateKey}
        todayKey={todayKey}
        events={events}
        onSelect={handleSelectDate}
        t={t}
      />

      <SelectedDayPanel
        selectedDate={selectedDate}
        selectedDateKey={selectedDateKey}
        events={events}
        language={language}
        storageWritable={storageWritable}
        onViewDay={handleViewDay}
        onCreateEvent={handleCreateEvent}
        onOpenEvent={handleOpenEvent}
        t={t}
      />

      <EventCategories
        events={events}
        language={language}
        t={t}
      />

      <UpcomingPreview
        events={events}
        language={language}
        onOpenEvent={handleOpenEvent}
        onViewAll={handleViewAll}
        t={t}
      />
    </aside>
  );
}
