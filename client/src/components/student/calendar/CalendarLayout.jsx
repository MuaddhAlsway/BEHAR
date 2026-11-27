
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 09
 *
 * Calendar workspace layout.
 *
 * Responsibilities:
 * - Organize calendar navigation and controls
 * - Provide responsive main/sidebar layout
 * - Support collapsible filters on mobile
 * - Support collapsible upcoming events on mobile
 * - Provide accessible workspace landmarks
 * - Support English LTR and Arabic RTL
 *
 * Pure CSS — no Tailwind.
 */

import {
  useId,
  useState,
} from "react";

import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ListFilter,
} from "lucide-react";

import useCalendar from "../../../hooks/useCalendar";

import "../../../styles/student/calendar/calendar.css";

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------

export default function CalendarLayout({
  header,
  toolbar,
  filters,
  sidebar,
  children,
  className = "",
}) {
  const {
    language,
    view,
    filteredEvents,
    storageWritable,
  } = useCalendar();

  const [filtersOpen, setFiltersOpen] =
    useState(false);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const filtersId = useId();
  const sidebarId = useId();

  const isArabic = language === "ar";

  const labels = {
    workspace: isArabic
      ? "مساحة التقويم"
      : "Calendar workspace",

    filters: isArabic
      ? "تصفية الفعاليات"
      : "Event filters",

    upcoming: isArabic
      ? "الفعاليات القادمة"
      : "Upcoming events",

    calendar: isArabic
      ? "عرض التقويم"
      : "Calendar view",

    events: isArabic
      ? "الفعاليات المعروضة"
      : "Visible events",

    expandFilters: isArabic
      ? "إظهار خيارات التصفية"
      : "Show filters",

    collapseFilters: isArabic
      ? "إخفاء خيارات التصفية"
      : "Hide filters",

    expandSidebar: isArabic
      ? "إظهار الفعاليات القادمة"
      : "Show upcoming events",

    collapseSidebar: isArabic
      ? "إخفاء الفعاليات القادمة"
      : "Hide upcoming events",

    storageWarning: isArabic
      ? "التقويم في وضع القراءة فقط"
      : "Calendar is read-only",
  };

  const eventCount = Array.isArray(filteredEvents)
    ? filteredEvents.length
    : 0;

  const workspaceClassName = [
    "behar-calendar-workspace",
    `behar-calendar-workspace--${view}`,
    isArabic
      ? "behar-calendar-workspace--rtl"
      : "behar-calendar-workspace--ltr",
    !storageWritable
      ? "behar-calendar-workspace--read-only"
      : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={workspaceClassName}
      aria-label={labels.workspace}
      dir={isArabic ? "rtl" : "ltr"}
      data-calendar-view={view}
      data-calendar-language={language}
    >
      {/* ========================================
          WORKSPACE HEADER
      ======================================== */}

      {header && (
        <div className="behar-calendar-workspace__header">
          {header}
        </div>
      )}

      {/* ========================================
          WORKSPACE TOOLBAR
      ======================================== */}

      {toolbar && (
        <div className="behar-calendar-workspace__toolbar">
          {toolbar}
        </div>
      )}

      {/* ========================================
          MOBILE FILTER TOGGLE
      ======================================== */}

      {filters && (
        <div className="behar-calendar-workspace__mobile-filters">
          <button
            type="button"
            className="behar-calendar-workspace__toggle"
            aria-expanded={filtersOpen}
            aria-controls={filtersId}
            onClick={() =>
              setFiltersOpen((current) => !current)
            }
          >
            <span className="behar-calendar-workspace__toggle-label">
              <ListFilter
                size={18}
                aria-hidden="true"
              />

              {labels.filters}
            </span>

            {filtersOpen ? (
              <ChevronUp
                size={18}
                aria-hidden="true"
              />
            ) : (
              <ChevronDown
                size={18}
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      )}

      {/* ========================================
          DESKTOP / MOBILE FILTERS
      ======================================== */}

      {filters && (
        <div
          id={filtersId}
          className={[
            "behar-calendar-workspace__filters",
            filtersOpen
              ? "behar-calendar-workspace__filters--open"
              : "",
          ].join(" ")}
          aria-label={labels.filters}
        >
          {filters}
        </div>
      )}

      {/* ========================================
          MAIN CONTENT + SIDEBAR
      ======================================== */}

      <div className="behar-calendar-workspace__body">
        {/* Calendar main panel */}

        <main
          className="behar-calendar-workspace__main"
          aria-label={labels.calendar}
        >
          <div className="behar-calendar-workspace__main-header">
            <div className="behar-calendar-workspace__main-heading">
              <CalendarDays
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span>
                {labels.calendar}
              </span>
            </div>

            <span
              className="behar-calendar-workspace__event-count"
              aria-live="polite"
            >
              {eventCount.toLocaleString(
                isArabic ? "ar-SA" : "en-US"
              )}

              {" "}

              {labels.events}
            </span>
          </div>

          <div className="behar-calendar-workspace__view">
            {children}
          </div>
        </main>

        {/* Upcoming events sidebar */}

        {sidebar && (
          <aside
            className="behar-calendar-workspace__sidebar"
            aria-label={labels.upcoming}
          >
            <div className="behar-calendar-workspace__sidebar-mobile-toggle">
              <button
                type="button"
                className="behar-calendar-workspace__toggle"
                aria-expanded={sidebarOpen}
                aria-controls={sidebarId}
                onClick={() =>
                  setSidebarOpen((current) => !current)
                }
              >
                <span className="behar-calendar-workspace__toggle-label">
                  <CalendarDays
                    size={18}
                    aria-hidden="true"
                  />

                  {labels.upcoming}
                </span>

                {sidebarOpen ? (
                  <ChevronUp
                    size={18}
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronDown
                    size={18}
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>

            <div
              id={sidebarId}
              className={[
                "behar-calendar-workspace__sidebar-content",
                sidebarOpen
                  ? "behar-calendar-workspace__sidebar-content--open"
                  : "",
              ].join(" ")}
            >
              {sidebar}
            </div>
          </aside>
        )}
      </div>

      {/* ========================================
          READ-ONLY STATUS
      ======================================== */}

      {!storageWritable && (
        <div
          className="behar-calendar-workspace__storage-status"
          role="status"
        >
          {labels.storageWarning}
        </div>
      )}
    </section>
  );
}
