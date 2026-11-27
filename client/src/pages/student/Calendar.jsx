
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 08
 *
 * Main Student Calendar page.
 *
 * Responsibilities:
 * - Connect calendar UI components
 * - Render month / week / day views
 * - Display academic and personal events
 * - Provide calendar filtering and navigation
 * - Render event management modals
 * - Display storage and action errors
 *
 * CalendarProvider is mounted at the page boundary.
 *
 * Child calendar components are implemented
 * individually in subsequent phases.
 */

import { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { useLocation } from "react-router-dom";

import CalendarProvider from "../../context/CalendarContext";
import useCalendar from "../../hooks/useCalendar";

import { CALENDAR_VIEWS } from "../../data/calendar";

import CalendarLayout from "../../components/student/calendar/CalendarLayout";
import CalendarHeader from "../../components/student/calendar/CalendarHeader";
import CalendarToolbar from "../../components/student/calendar/CalendarToolbar";
import CalendarFilters from "../../components/student/calendar/CalendarFilters";
import CalendarGrid from "../../components/student/calendar/CalendarGrid";
import CalendarWeekView from "../../components/student/calendar/CalendarWeekView";
import CalendarDayView from "../../components/student/calendar/CalendarDayView";
import CalendarSidebar from "../../components/student/calendar/CalendarSidebar";
import EventDetailsModal from "../../components/student/calendar/EventDetailsModal";
import PersonalEventModal from "../../components/student/calendar/PersonalEventModal";
import DeleteEventDialog from "../../components/student/calendar/DeleteEventDialog";

import "../../styles/student/calendar/calendar.css";
// ------------------------------------------------------------
// Page content
// ------------------------------------------------------------

function CalendarPageContent() {
  const {
    language,
    view,
    activeModal,
    actionError,
    storageIssue,
    storageWritable,
    closeModal,
  } = useCalendar();

  const [dismissedError, setDismissedError] =
    useState(false);

  const isArabic = language === "ar";

  const error = actionError || storageIssue;

  const showError = Boolean(error) && !dismissedError;

  const errorMessage = error
    ? (
        isArabic
          ? (
              error.messageAr ||
              "حدث خطأ أثناء تحميل بيانات التقويم."
            )
          : (
              error.message ||
              "An error occurred while loading calendar data."
            )
      )
    : "";

  const renderCalendarView = () => {
    switch (view) {
      case CALENDAR_VIEWS.WEEK:
        return <CalendarWeekView />;

      case CALENDAR_VIEWS.DAY:
        return <CalendarDayView />;

      case CALENDAR_VIEWS.MONTH:
      default:
        return <CalendarGrid />;
    }
  };

  return (
    <div
      className="behar-calendar-page"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
    >
      <div className="behar-calendar-page__inner">

        {/* Page heading */}
        <header className="behar-calendar-page__heading">
          <div className="behar-calendar-page__intro">
            <span className="behar-calendar-page__eyebrow">
              {isArabic
                ? "مساحة الطالب"
                : "STUDENT WORKSPACE"}
            </span>

            <h1 className="behar-calendar-page__title">
              {isArabic ? "التقويم" : "My Calendar"}
            </h1>

            <p className="behar-calendar-page__description">
              {isArabic
                ? "نظّم مواعيد دراستك، وتابع جلساتك التعليمية والواجبات والاختبارات في مكان واحد."
                : "Stay on top of your lessons, live sessions, assignments, and personal study plans."}
            </p>
          </div>
        </header>

        {/* Error notification */}
        {showError && (
          <div
            className="behar-calendar-page__alert"
            role="alert"
          >
            <AlertCircle
              size={19}
              aria-hidden="true"
            />

            <div className="behar-calendar-page__alert-content">
              <strong>
                {isArabic
                  ? "تنبيه التقويم"
                  : "Calendar notice"}
              </strong>

              <p>{errorMessage}</p>

              {!storageWritable && (
                <small>
                  {isArabic
                    ? "التعديل والحفظ غير متاحين حاليًا لحماية بياناتك."
                    : "Editing and saving are temporarily disabled to protect your calendar data."}
                </small>
              )}
            </div>

            <button
              type="button"
              className="behar-calendar-page__alert-close"
              aria-label={
                isArabic
                  ? "إغلاق التنبيه"
                  : "Dismiss notice"
              }
              onClick={() => setDismissedError(true)}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Calendar workspace */}
        <CalendarLayout
          header={<CalendarHeader />}
          toolbar={<CalendarToolbar />}
          filters={<CalendarFilters />}
          sidebar={<CalendarSidebar />}
        >
          {renderCalendarView()}
        </CalendarLayout>

        {/* Event details */}
        {activeModal === "details" && (
          <EventDetailsModal
            onClose={closeModal}
          />
        )}

        {/* Create / edit personal event */}
        {(activeModal === "create" ||
          activeModal === "edit") && (
          <PersonalEventModal
            mode={activeModal}
            onClose={closeModal}
          />
        )}

        {/* Delete confirmation */}
        {activeModal === "delete" && (
          <DeleteEventDialog
            onClose={closeModal}
          />
        )}

      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Page export
// ------------------------------------------------------------

function getCalendarLanguageFromPath(pathname = "") {
  return pathname.split("/")[1]?.toLowerCase() === "ar"
    ? "ar"
    : "en";
}

/**
 * Mount the provider once for the calendar page.
 *
 * If CalendarProvider is already mounted in the
 * student route layout, render CalendarPageContent
 * directly instead of nesting another provider.
 */
export function CalendarPageContentView() {
  return <CalendarPageContent />;
}

export default function Calendar() {
  const { pathname } = useLocation();
  const language = getCalendarLanguageFromPath(pathname);

  return (
    <CalendarProvider
      key={language}
      initialLanguage={language}
    >
      <CalendarPageContent />
    </CalendarProvider>
  );
}
