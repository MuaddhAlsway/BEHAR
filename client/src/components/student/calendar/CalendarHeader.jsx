
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 10
 *
 * CalendarHeader
 *
 * Features:
 * - Previous / next date navigation
 * - Today shortcut
 * - Dynamic month / week / day heading
 * - Accessible navigation controls
 * - English and Arabic translations
 * - Riyadh timezone-aware date formatting
 * - Responsive layout hooks
 *
 * Dependencies:
 * - CalendarContext
 * - useCalendar
 * - calendarDates
 *
 * Styling:
 * - Pure CSS
 */

import { useMemo } from "react";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
} from "lucide-react";

import useCalendar from "../../../hooks/useCalendar";

import {
  CALENDAR_VIEWS,
  CALENDAR_TIME_ZONE,
} from "../../../data/calendar";

import {
  formatCalendarDate,
  formatCalendarMonthYear,
  getCalendarWeekDays,
  getCalendarDateKey,
  getTodayCalendarKey,
  isSameCalendarDay,
  toCalendarDate,
} from "../../../utils/calendarDates";

import "../../../styles/student/calendar/calendar-header.css";

// ------------------------------------------------------------
// Translations
// ------------------------------------------------------------

const TRANSLATIONS = {
  en: {
    today: "Today",
    previous: "Previous",
    next: "Next",
    calendar: "Calendar",
    monthView: "Monthly calendar",
    weekView: "Weekly calendar",
    dayView: "Daily calendar",
    timezone: "Saudi Arabia Time",
    timezoneShort: "AST",
    current: "Current period",
    selectedDate: "Selected date",
    navigation: "Calendar date navigation",
    jumpToToday: "Jump to today",
  },

  ar: {
    today: "اليوم",
    previous: "السابق",
    next: "التالي",
    calendar: "التقويم",
    monthView: "التقويم الشهري",
    weekView: "التقويم الأسبوعي",
    dayView: "التقويم اليومي",
    timezone: "توقيت السعودية",
    timezoneShort: "AST",
    current: "الفترة الحالية",
    selectedDate: "التاريخ المحدد",
    navigation: "التنقل بين تواريخ التقويم",
    jumpToToday: "الانتقال إلى اليوم",
  },
};

// ------------------------------------------------------------
// Date formatting helpers
// ------------------------------------------------------------

function getCalendarHeading(date, view, language) {
  let safeDate;

  try {
    safeDate = toCalendarDate(date);
  } catch {
    safeDate = new Date();
  }

  if (!(safeDate instanceof Date) || !Number.isFinite(safeDate.getTime())) {
    safeDate = new Date();
  }

  if (view === CALENDAR_VIEWS.MONTH) {
    return formatCalendarMonthYear(safeDate, language);
  }

  if (view === CALENDAR_VIEWS.DAY) {
    return formatCalendarDate(safeDate, language, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (view === CALENDAR_VIEWS.WEEK) {
    const days = getCalendarWeekDays(safeDate);

    if (!Array.isArray(days) || days.length === 0) {
      return formatCalendarMonthYear(safeDate, language);
    }

    const firstDay = days[0].dateKey;
    const lastDay = days[days.length - 1].dateKey;

    const firstMonth = formatCalendarDate(
      firstDay,
      language,
      {
        month: "short",
      }
    );

    const lastMonth = formatCalendarDate(
      lastDay,
      language,
      {
        month: "short",
      }
    );

    const firstDayNumber = formatCalendarDate(
      firstDay,
      language,
      {
        day: "numeric",
      }
    );

    const lastDayNumber = formatCalendarDate(
      lastDay,
      language,
      {
        day: "numeric",
      }
    );

    const lastYear = formatCalendarDate(
      lastDay,
      language,
      {
        year: "numeric",
      }
    );

    const sameMonth =
      getCalendarDateKey(firstDay).slice(0, 7) ===
      getCalendarDateKey(lastDay).slice(0, 7);

    if (sameMonth) {
      return language === "ar"
        ? `${firstDayNumber} – ${lastDayNumber} ${lastMonth} ${lastYear}`
        : `${firstMonth} ${firstDayNumber}–${lastDayNumber}, ${lastYear}`;
    }

    return language === "ar"
      ? `${firstDayNumber} ${firstMonth} – ${lastDayNumber} ${lastMonth} ${lastYear}`
      : `${firstMonth} ${firstDayNumber} – ${lastMonth} ${lastDayNumber}, ${lastYear}`;
  }

  return formatCalendarMonthYear(date, language);
}

function getCalendarViewLabel(view, translations) {
  switch (view) {
    case CALENDAR_VIEWS.WEEK:
      return translations.weekView;

    case CALENDAR_VIEWS.DAY:
      return translations.dayView;

    case CALENDAR_VIEWS.MONTH:
    default:
      return translations.monthView;
  }
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------

export default function CalendarHeader({
  className = "",
}) {
  const {
    language,
    view,
    selectedDate,
    goToToday,
    goToPrevious,
    goToNext,
  } = useCalendar();

  const isArabic = language === "ar";

  const t = TRANSLATIONS[isArabic ? "ar" : "en"];

  const heading = useMemo(
    () =>
      getCalendarHeading(
        selectedDate,
        view,
        language
      ),
    [selectedDate, view, language]
  );

  const viewLabel = getCalendarViewLabel(view, t);

  const todayKey = getTodayCalendarKey();

  const isTodaySelected = isSameCalendarDay(
    selectedDate,
    todayKey
  );

  const rootClassName = [
    "behar-calendar-header",
    isArabic
      ? "behar-calendar-header--rtl"
      : "behar-calendar-header--ltr",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={rootClassName}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* ======================================
          CURRENT PERIOD
      ====================================== */}

      <div className="behar-calendar-header__identity">
        <div
          className="behar-calendar-header__icon"
          aria-hidden="true"
        >
          <CalendarDays
            size={22}
            strokeWidth={1.7}
          />
        </div>

        <div className="behar-calendar-header__identity-content">
          <span className="behar-calendar-header__eyebrow">
            {viewLabel}
          </span>

          <h2
            className="behar-calendar-header__title"
            aria-live="polite"
            aria-atomic="true"
          >
            {heading}
          </h2>

          <div className="behar-calendar-header__meta">
            <span className="behar-calendar-header__meta-item">
              <MapPin
                size={13}
                aria-hidden="true"
              />

              {t.timezone}
            </span>

            <span
              className="behar-calendar-header__meta-separator"
              aria-hidden="true"
            >
              •
            </span>

            <span
              className="behar-calendar-header__meta-item"
              title={CALENDAR_TIME_ZONE}
            >
              <Clock3
                size={13}
                aria-hidden="true"
              />

              {t.timezoneShort}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================
          DATE NAVIGATION
      ====================================== */}

      <nav
        className="behar-calendar-header__navigation"
        aria-label={t.navigation}
      >
        {/* Today */}

        <button
          type="button"
          className={[
            "behar-calendar-header__today",
            isTodaySelected
              ? "behar-calendar-header__today--active"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={goToToday}
          aria-label={t.jumpToToday}
          title={t.jumpToToday}
        >
          <CalendarDays
            size={16}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <span>{t.today}</span>
        </button>

        {/* Previous / Next */}

        <div
          className="behar-calendar-header__arrows"
          role="group"
          aria-label={t.navigation}
        >
          <button
            type="button"
            className="behar-calendar-header__arrow"
            onClick={goToPrevious}
            aria-label={t.previous}
            title={t.previous}
          >
            {isArabic ? (
              <ChevronRight
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            ) : (
              <ChevronLeft
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            )}
          </button>

          <span
            className="behar-calendar-header__arrow-divider"
            aria-hidden="true"
          />

          <button
            type="button"
            className="behar-calendar-header__arrow"
            onClick={goToNext}
            aria-label={t.next}
            title={t.next}
          >
            {isArabic ? (
              <ChevronLeft
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            ) : (
              <ChevronRight
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </nav>
    </div>
  );
}
