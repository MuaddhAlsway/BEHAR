
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 22
 *
 * DeleteEventDialog
 *
 * Features:
 * - Safe personal event deletion
 * - Academic event protection
 * - Confirmation before deletion
 * - English / Arabic
 * - Asia/Riyadh timezone
 * - Loading and error handling
 * - Duplicate submission protection
 * - Accessible dialog
 * - Escape / backdrop cancellation
 * - Focus management
 *
 * React 19 + JSX + Pure CSS
 */

import {
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import {
  AlertTriangle,
  Trash2,
  X,
  CalendarDays,
  Clock3,
  BookOpen,
  Bell,
  Target,
  CheckCircle2,
  ShieldAlert,
  LockKeyhole,
  LoaderCircle,
} from "lucide-react";

import useCalendar from "../../../hooks/useCalendar";

import {
  CALENDAR_SOURCES,
  CALENDAR_EVENT_TYPES,
  getCalendarEventTitle,
  canDeleteCalendarEvent,
} from "../../../data/calendar";

import {
  formatCalendarDate,
  formatCalendarTime,
} from "../../../utils/calendarDates";

import "../../../styles/student/calendar/delete-event-dialog.css";

// ------------------------------------------------------------
// Translations
// ------------------------------------------------------------

const TRANSLATIONS = {
  en: {
    heading: "Delete this event?",
    subtitle:
      "This action cannot be undone.",
    warning:
      "The event will be permanently removed from your personal calendar.",
    eventDetails: "Event to delete",
    personalEvent: "Personal event",
    academicEvent: "Academic event",
    cancel: "Keep event",
    delete: "Delete event",
    deleting: "Deleting...",
    close: "Close dialog",
    allDay: "All day",
    timezone: "Saudi Arabia time (UTC+3)",
    studySession: "Study session",
    reminder: "Reminder",
    studyGoal: "Study goal",
    personalTask: "Personal task",
    event: "Event",
    unavailableTitle: "Event unavailable",
    unavailableDescription:
      "This event may have already been deleted.",
    protectedTitle: "This event cannot be deleted",
    protectedDescription:
      "Academic events are managed by BEHAR and cannot be deleted from your personal calendar.",
    storageTitle: "Storage unavailable",
    storageDescription:
      "Personal events cannot be deleted right now. Please try again later.",
    deleteError:
      "Unable to delete this event. Please try again.",
    dismiss: "Back to calendar",
  },

  ar: {
    heading: "هل تريد حذف هذه الفعالية؟",
    subtitle:
      "لا يمكن التراجع عن هذا الإجراء.",
    warning:
      "سيتم حذف الفعالية نهائيًا من تقويمك الشخصي.",
    eventDetails: "الفعالية المراد حذفها",
    personalEvent: "فعالية شخصية",
    academicEvent: "فعالية تعليمية",
    cancel: "الاحتفاظ بالفعالية",
    delete: "حذف الفعالية",
    deleting: "جارٍ الحذف...",
    close: "إغلاق النافذة",
    allDay: "طوال اليوم",
    timezone: "بتوقيت السعودية (UTC+3)",
    studySession: "جلسة دراسة",
    reminder: "تذكير",
    studyGoal: "هدف دراسي",
    personalTask: "مهمة شخصية",
    event: "فعالية",
    unavailableTitle: "الفعالية غير متوفرة",
    unavailableDescription:
      "ربما تم حذف هذه الفعالية مسبقًا.",
    protectedTitle: "لا يمكن حذف هذه الفعالية",
    protectedDescription:
      "تتم إدارة الفعاليات التعليمية من خلال منصة بحار، ولا يمكن حذفها من التقويم الشخصي.",
    storageTitle: "التخزين غير متاح",
    storageDescription:
      "لا يمكن حذف الفعاليات الشخصية حاليًا. يرجى المحاولة لاحقًا.",
    deleteError:
      "تعذر حذف الفعالية. يرجى المحاولة مرة أخرى.",
    dismiss: "العودة إلى التقويم",
  },
};

// ------------------------------------------------------------
// Event configuration
// ------------------------------------------------------------

const EVENT_CONFIG = {
  [CALENDAR_EVENT_TYPES.STUDY_SESSION]: {
    icon: BookOpen,
    appearance: "study",
    labelKey: "studySession",
  },

  [CALENDAR_EVENT_TYPES.REMINDER]: {
    icon: Bell,
    appearance: "reminder",
    labelKey: "reminder",
  },

  [CALENDAR_EVENT_TYPES.STUDY_GOAL]: {
    icon: Target,
    appearance: "goal",
    labelKey: "studyGoal",
  },

  [CALENDAR_EVENT_TYPES.PERSONAL_TASK]: {
    icon: CheckCircle2,
    appearance: "task",
    labelKey: "personalTask",
  },
};

const DEFAULT_CONFIG = {
  icon: CalendarDays,
  appearance: "default",
  labelKey: "event",
};

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function getEventConfig(type) {
  return EVENT_CONFIG[type] || DEFAULT_CONFIG;
}

function getEventTitle(event, language, t) {
  if (!event) return t.event;

  return (
    getCalendarEventTitle(event, language) ||
    event.title ||
    event.titleAr ||
    t.event
  );
}

function getEventSchedule(event, language, t) {
  if (!event?.startAt) {
    return {
      date: "",
      time: "",
    };
  }

  const date = formatCalendarDate(
    event.startAt,
    language
  );

  if (event.allDay) {
    return {
      date,
      time: t.allDay,
    };
  }

  const start = formatCalendarTime(
    event.startAt,
    language
  );

  const end = event.endAt
    ? formatCalendarTime(
        event.endAt,
        language
      )
    : "";

  return {
    date,
    time: end ? `${start} – ${end}` : start,
  };
}

function isDeletionAllowed(event) {
  if (!event) return false;

  if (
    event.source !== CALENDAR_SOURCES.PERSONAL
  ) {
    return false;
  }

  return canDeleteCalendarEvent(event);
}

// ------------------------------------------------------------
// Event preview
// ------------------------------------------------------------

function EventPreview({
  event,
  language,
  t,
}) {
  const config = getEventConfig(
    event.type
  );

  const Icon = config.icon;

  const title = getEventTitle(
    event,
    language,
    t
  );

  const schedule = getEventSchedule(
    event,
    language,
    t
  );

  return (
    <div className="behar-delete-event__preview">
      <div className="behar-delete-event__preview-label">
        {t.eventDetails}
      </div>

      <div className="behar-delete-event__preview-content">
        <div
          className={[
            "behar-delete-event__event-icon",
            `behar-delete-event__event-icon--${config.appearance}`,
          ].join(" ")}
        >
          <Icon
            size={19}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

        <div className="behar-delete-event__event-content">
          <span className="behar-delete-event__event-type">
            {t[config.labelKey]}
          </span>

          <strong className="behar-delete-event__event-title">
            {title}
          </strong>

          <div className="behar-delete-event__event-schedule">
            {schedule.date && (
              <span>
                <CalendarDays
                  size={12}
                  aria-hidden="true"
                />

                {schedule.date}
              </span>
            )}

            {schedule.time && (
              <span>
                <Clock3
                  size={12}
                  aria-hidden="true"
                />

                {schedule.time}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Main component
// ------------------------------------------------------------

export default function DeleteEventDialog() {
  const {
    language,
    selectedEvent,
    selectedEventId,
    getEventById,
    deletePersonalEvent,
    closeModal,
    actionError,
    storageWritable,
  } = useCalendar();

  const isArabic = language === "ar";
  const t = TRANSLATIONS[isArabic ? "ar" : "en"];

  const titleId = useId();
  const descriptionId = useId();

  const dialogRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const deleteButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  const deletingRef = useRef(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [localError, setLocalError] = useState("");

  // ----------------------------------------------------------
  // Resolve selected event
  // ----------------------------------------------------------

  const event =
    selectedEvent ||
    (selectedEventId
      ? getEventById(selectedEventId)
      : null);

  const eventExists = Boolean(event);

  const allowed =
    eventExists &&
    isDeletionAllowed(event);

  const canDelete =
    allowed &&
    storageWritable &&
    !isDeleting;

  // ----------------------------------------------------------
  // Focus management
  // ----------------------------------------------------------

  useEffect(() => {
    previousFocusRef.current =
      document.activeElement;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    cancelButtonRef.current?.focus();

    const handleKeyDown = (keyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        if (deletingRef.current) {
          return;
        }

        keyboardEvent.preventDefault();
        closeModal();
      }

      if (keyboardEvent.key !== "Tab") {
        return;
      }

      const dialog = dialogRef.current;

      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (element) =>
          element.getClientRects().length > 0
      );

      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        keyboardEvent.shiftKey &&
        document.activeElement === first
      ) {
        keyboardEvent.preventDefault();
        last.focus();
      } else if (
        !keyboardEvent.shiftKey &&
        document.activeElement === last
      ) {
        keyboardEvent.preventDefault();
        first.focus();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;

      previousFocusRef.current?.focus?.();
    };
  }, [closeModal]);

  // ----------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------

  const handleCancel = () => {
    if (deletingRef.current) return;

    closeModal();
  };

  const handleBackdropClick = (clickEvent) => {
    if (
      clickEvent.target ===
      clickEvent.currentTarget
    ) {
      handleCancel();
    }
  };

  const handleDelete = async () => {
    if (
      !event ||
      !canDelete ||
      deletingRef.current
    ) {
      return;
    }

    deletingRef.current = true;
    setIsDeleting(true);
    setLocalError("");

    try {
      const result = await deletePersonalEvent(
        event.id
      );

      if (
        result === false ||
        result?.success === false ||
        result?.ok === false
      ) {
        throw new Error(
          result?.error ||
          result?.message ||
          t.deleteError
        );
      }

      closeModal();
    } catch (error) {
      setLocalError(
        error instanceof Error
          ? error.message
          : t.deleteError
      );
    } finally {
      deletingRef.current = false;
      setIsDeleting(false);
    }
  };

  // ----------------------------------------------------------
  // State
  // ----------------------------------------------------------

  let state = "ready";

  if (!eventExists) {
    state = "unavailable";
  } else if (!allowed) {
    state = "protected";
  } else if (!storageWritable) {
    state = "storage";
  }

  const stateContent = {
    unavailable: {
      title: t.unavailableTitle,
      description: t.unavailableDescription,
      icon: CalendarDays,
    },
    protected: {
      title: t.protectedTitle,
      description: t.protectedDescription,
      icon: ShieldAlert,
    },
    storage: {
      title: t.storageTitle,
      description: t.storageDescription,
      icon: LockKeyhole,
    },
  };

  const isReady = state === "ready";

  const StateIcon =
    isReady
      ? AlertTriangle
      : stateContent[state].icon;

  const heading = isReady
    ? t.heading
    : stateContent[state].title;

  const description = isReady
    ? t.subtitle
    : stateContent[state].description;

  const displayError =
    localError ||
    (typeof actionError === "string"
      ? actionError
      : "");

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------

  return (
    <div
      className="behar-delete-event__overlay"
      dir={isArabic ? "rtl" : "ltr"}
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className={[
          "behar-delete-event__dialog",
          !isReady
            ? "behar-delete-event__dialog--blocked"
            : "",
        ].join(" ")}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-busy={isDeleting}
      >
        {/* Close */}

        <button
          type="button"
          className="behar-delete-event__close"
          onClick={handleCancel}
          disabled={isDeleting}
          aria-label={t.close}
        >
          <X
            size={18}
            aria-hidden="true"
          />
        </button>

        {/* Header */}

        <div className="behar-delete-event__header">
          <div
            className={[
              "behar-delete-event__warning-icon",
              !isReady
                ? "behar-delete-event__warning-icon--blocked"
                : "",
            ].join(" ")}
          >
            <StateIcon
              size={25}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <h2 id={titleId}>
            {heading}
          </h2>

          <p id={descriptionId}>
            {description}
          </p>
        </div>

        {/* Event preview */}

        {eventExists && (
          <EventPreview
            event={event}
            language={language}
            t={t}
          />
        )}

        {/* Warning */}

        {isReady && (
          <div className="behar-delete-event__warning">
            <AlertTriangle
              size={15}
              aria-hidden="true"
            />

            <span>{t.warning}</span>
          </div>
        )}

        {/* Error */}

        {displayError && (
          <div
            className="behar-delete-event__error"
            role="alert"
          >
            <AlertTriangle
              size={16}
              aria-hidden="true"
            />

            <span>{displayError}</span>
          </div>
        )}

        {/* Actions */}

        <footer className="behar-delete-event__footer">
          <button
            ref={cancelButtonRef}
            type="button"
            className="behar-delete-event__cancel"
            onClick={handleCancel}
            disabled={isDeleting}
          >
            {isReady
              ? t.cancel
              : t.dismiss}
          </button>

          {isReady && (
            <button
              ref={deleteButtonRef}
              type="button"
              className="behar-delete-event__confirm"
              onClick={handleDelete}
              disabled={!canDelete}
            >
              {isDeleting ? (
                <>
                  <LoaderCircle
                    className="behar-delete-event__spinner"
                    size={16}
                    aria-hidden="true"
                  />

                  {t.deleting}
                </>
              ) : (
                <>
                  <Trash2
                    size={16}
                    aria-hidden="true"
                  />

                  {t.delete}
                </>
              )}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
