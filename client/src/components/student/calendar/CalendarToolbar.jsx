
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 11
 *
 * CalendarToolbar
 *
 * Responsibilities:
 * - Switch between month, week and day views
 * - Open the personal event creation modal
 * - Respect calendar storage availability
 * - Support English and Arabic
 * - Provide accessible keyboard navigation
 * - Adapt to mobile screen sizes
 *
 * Pure CSS — no Tailwind.
 */

import { useCallback, useRef } from "react";

import {
  CalendarDays,
  CalendarRange,
  CalendarCheck2,
  Plus,
  LockKeyhole,
} from "lucide-react";

import useCalendar from "../../../hooks/useCalendar";

import {
  CALENDAR_VIEWS,
} from "../../../data/calendar";

import "../../../styles/student/calendar/calendar-toolbar.css";
// ------------------------------------------------------------
// Translations
// ------------------------------------------------------------

const TRANSLATIONS = {
  en: {
    month: "Month",
    week: "Week",
    day: "Day",
    addEvent: "Add event",
    addEventFull: "Create personal event",
    viewSwitcher: "Calendar view",
    selectedView: "Selected calendar view",
    unavailable:
      "Personal event creation is unavailable while calendar storage is read-only.",
  },

  ar: {
    month: "الشهر",
    week: "الأسبوع",
    day: "اليوم",
    addEvent: "إضافة فعالية",
    addEventFull: "إنشاء فعالية شخصية",
    viewSwitcher: "طريقة عرض التقويم",
    selectedView: "طريقة العرض المحددة",
    unavailable:
      "إضافة الفعاليات الشخصية غير متاحة أثناء وضع القراءة فقط.",
  },
};

// ------------------------------------------------------------
// View configuration
// ------------------------------------------------------------

const VIEW_OPTIONS = [
  {
    value: CALENDAR_VIEWS.MONTH,
    labelKey: "month",
    Icon: CalendarDays,
  },
  {
    value: CALENDAR_VIEWS.WEEK,
    labelKey: "week",
    Icon: CalendarRange,
  },
  {
    value: CALENDAR_VIEWS.DAY,
    labelKey: "day",
    Icon: CalendarCheck2,
  },
];

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------

export default function CalendarToolbar({
  className = "",
}) {
  const {
    language,
    view,
    selectedDate,
    changeView,
    openCreateEvent,
    storageWritable,
  } = useCalendar();

  const isArabic = language === "ar";
  const t = TRANSLATIONS[isArabic ? "ar" : "en"];

  const viewButtonRefs = useRef([]);

  // ----------------------------------------------------------
  // View switching
  // ----------------------------------------------------------

  const handleViewChange = useCallback(
    (nextView) => {
      if (nextView === view) return;

      changeView(nextView);
    },
    [changeView, view]
  );

  /**
   * Arrow keys move between the three view buttons.
   *
   * Home selects Month.
   * End selects Day.
   *
   * Uses native buttons and a radiogroup-like
   * interaction pattern with roving tabIndex.
   */
  const handleViewKeyDown = useCallback(
    (event, index) => {
      let nextIndex = null;

      switch (event.key) {
        case "ArrowRight":
          nextIndex = isArabic
            ? (index - 1 + VIEW_OPTIONS.length) %
              VIEW_OPTIONS.length
            : (index + 1) % VIEW_OPTIONS.length;
          break;

        case "ArrowLeft":
          nextIndex = isArabic
            ? (index + 1) % VIEW_OPTIONS.length
            : (index - 1 + VIEW_OPTIONS.length) %
              VIEW_OPTIONS.length;
          break;

        case "Home":
          nextIndex = 0;
          break;

        case "End":
          nextIndex = VIEW_OPTIONS.length - 1;
          break;

        default:
          return;
      }

      event.preventDefault();

      const nextOption = VIEW_OPTIONS[nextIndex];

      changeView(nextOption.value);

      viewButtonRefs.current[nextIndex]?.focus();
    },
    [changeView, isArabic]
  );

  // ----------------------------------------------------------
  // Create event
  // ----------------------------------------------------------

  const handleCreateEvent = useCallback(() => {
    if (!storageWritable) return;

    openCreateEvent(selectedDate);
  }, [
    storageWritable,
    openCreateEvent,
    selectedDate,
  ]);

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------

  const rootClassName = [
    "behar-calendar-toolbar",
    isArabic
      ? "behar-calendar-toolbar--rtl"
      : "behar-calendar-toolbar--ltr",
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
          VIEW SWITCHER
      ====================================== */}

      <div
        className="behar-calendar-toolbar__views"
        role="group"
        aria-label={t.viewSwitcher}
      >
        {VIEW_OPTIONS.map(
          ({ value, labelKey, Icon }, index) => {
            const active = view === value;

            return (
              <button
                key={value}
                ref={(element) => {
                  viewButtonRefs.current[index] =
                    element;
                }}
                type="button"
                className={[
                  "behar-calendar-toolbar__view",
                  active
                    ? "behar-calendar-toolbar__view--active"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() =>
                  handleViewChange(value)
                }
                onKeyDown={(event) =>
                  handleViewKeyDown(event, index)
                }
                aria-pressed={active}
                tabIndex={active ? 0 : -1}
                title={t[labelKey]}
              >
                <Icon
                  size={16}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <span>{t[labelKey]}</span>
              </button>
            );
          }
        )}
      </div>

      {/* ======================================
          CREATE PERSONAL EVENT
      ====================================== */}

      <div className="behar-calendar-toolbar__actions">
        <button
          type="button"
          className="behar-calendar-toolbar__create"
          onClick={handleCreateEvent}
          disabled={!storageWritable}
          aria-label={t.addEventFull}
          title={
            storageWritable
              ? t.addEventFull
              : t.unavailable
          }
        >
          {storageWritable ? (
            <Plus
              size={18}
              strokeWidth={2}
              aria-hidden="true"
            />
          ) : (
            <LockKeyhole
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          )}

          <span>{t.addEvent}</span>
        </button>
      </div>
    </div>
  );
}
