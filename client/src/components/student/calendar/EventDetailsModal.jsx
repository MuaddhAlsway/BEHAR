
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 20
 *
 * EventDetailsModal
 *
 * Features:
 * - Academic and personal event details
 * - English / Arabic localization
 * - Asia/Riyadh timezone
 * - Course information
 * - Date and time details
 * - Event status and priority
 * - Location and meeting links
 * - Edit / delete personal events
 * - Navigate to event day
 * - Accessible dialog
 * - Escape key and backdrop close
 * - Focus management
 *
 * Pure CSS — no Tailwind.
 */

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  X,
  CalendarDays,
  Clock3,
  BookOpen,
  Video,
  FileText,
  ClipboardCheck,
  Bell,
  Target,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Link2,
  ExternalLink,
  Pencil,
  Trash2,
  ArrowUpRight,
  GraduationCap,
  Flag,
  Info,
  CalendarCheck2,
} from "lucide-react";

import useCalendar from "../../../hooks/useCalendar";

import {
  CALENDAR_SOURCES,
  CALENDAR_EVENT_TYPES,
  CALENDAR_VIEWS,
  CALENDAR_TIME_ZONE,
  getCalendarEventTitle,
  getCalendarEventDescription,
  getCalendarCourseById,
  canEditCalendarEvent,
  canDeleteCalendarEvent,
} from "../../../data/calendar";

import {
  getCalendarDateKey,
  formatCalendarDate,
  formatCalendarTime,
} from "../../../utils/calendarDates";

import "../../../styles/student/calendar/event-details-modal.css";

// ------------------------------------------------------------
// Configuration
// ------------------------------------------------------------

const TRANSLATIONS = {
  en: {
    eventDetails: "Event details",
    academicEvent: "Academic event",
    personalEvent: "Personal event",
    close: "Close",
    date: "Date",
    time: "Time",
    schedule: "Schedule",
    allDay: "All day",
    course: "Course",
    description: "Description",
    location: "Location",
    meetingLink: "Meeting link",
    openMeeting: "Join session",
    openResource: "Open resource",
    openCourse: "Open course",
    viewDay: "View in calendar",
    edit: "Edit event",
    delete: "Delete event",
    status: "Status",
    priority: "Priority",
    scheduled: "Scheduled",
    completed: "Completed",
    cancelled: "Cancelled",
    overdue: "Overdue",
    ongoing: "Ongoing",
    low: "Low",
    medium: "Medium",
    high: "High",
    normal: "Normal",
    noDescription: "No description provided.",
    noCourse: "Course information unavailable",
    timeZone: "Saudi Arabia time (UTC+3)",
    starts: "Starts",
    ends: "Ends",
    duration: "Duration",
    minutes: "min",
    hours: "hr",
    unavailable: "Event unavailable",
    unavailableDescription:
      "This event may have been removed or is no longer available.",
    backToCalendar: "Back to calendar",
    liveSession: "Live session",
    lesson: "Lesson",
    assignment: "Assignment",
    quiz: "Quiz",
    exam: "Exam",
    deadline: "Deadline",
    studySession: "Study session",
    reminder: "Reminder",
    studyGoal: "Study goal",
    personalTask: "Personal task",
    event: "Event",
    linkUnavailable: "No resource link available",
  },

  ar: {
    eventDetails: "تفاصيل الفعالية",
    academicEvent: "فعالية تعليمية",
    personalEvent: "فعالية شخصية",
    close: "إغلاق",
    date: "التاريخ",
    time: "الوقت",
    schedule: "الموعد",
    allDay: "طوال اليوم",
    course: "الدورة",
    description: "الوصف",
    location: "الموقع",
    meetingLink: "رابط الاجتماع",
    openMeeting: "الانضمام للجلسة",
    openResource: "فتح المورد",
    openCourse: "عرض الدورة",
    viewDay: "عرض في التقويم",
    edit: "تعديل الفعالية",
    delete: "حذف الفعالية",
    status: "الحالة",
    priority: "الأولوية",
    scheduled: "مجدول",
    completed: "مكتمل",
    cancelled: "ملغي",
    overdue: "متأخر",
    ongoing: "جارٍ",
    low: "منخفضة",
    medium: "متوسطة",
    high: "عالية",
    normal: "عادية",
    noDescription: "لم يتم إضافة وصف.",
    noCourse: "معلومات الدورة غير متوفرة",
    timeZone: "بتوقيت السعودية (UTC+3)",
    starts: "يبدأ",
    ends: "ينتهي",
    duration: "المدة",
    minutes: "دقيقة",
    hours: "ساعة",
    unavailable: "الفعالية غير متوفرة",
    unavailableDescription:
      "ربما تم حذف هذه الفعالية أو لم تعد متاحة.",
    backToCalendar: "العودة للتقويم",
    liveSession: "جلسة مباشرة",
    lesson: "درس",
    assignment: "واجب",
    quiz: "اختبار قصير",
    exam: "اختبار",
    deadline: "موعد نهائي",
    studySession: "جلسة دراسة",
    reminder: "تذكير",
    studyGoal: "هدف دراسي",
    personalTask: "مهمة شخصية",
    event: "فعالية",
    linkUnavailable: "لا يوجد رابط متاح",
  },
};

const EVENT_CONFIG = {
  [CALENDAR_EVENT_TYPES.LIVE_SESSION]: {
    appearance: "live",
    icon: Video,
    labelKey: "liveSession",
  },
  [CALENDAR_EVENT_TYPES.LESSON]: {
    appearance: "lesson",
    icon: BookOpen,
    labelKey: "lesson",
  },
  [CALENDAR_EVENT_TYPES.ASSIGNMENT]: {
    appearance: "assignment",
    icon: FileText,
    labelKey: "assignment",
  },
  [CALENDAR_EVENT_TYPES.QUIZ]: {
    appearance: "assessment",
    icon: ClipboardCheck,
    labelKey: "quiz",
  },
  [CALENDAR_EVENT_TYPES.EXAM]: {
    appearance: "assessment",
    icon: ClipboardCheck,
    labelKey: "exam",
  },
  [CALENDAR_EVENT_TYPES.DEADLINE]: {
    appearance: "deadline",
    icon: AlertCircle,
    labelKey: "deadline",
  },
  [CALENDAR_EVENT_TYPES.STUDY_SESSION]: {
    appearance: "study",
    icon: BookOpen,
    labelKey: "studySession",
  },
  [CALENDAR_EVENT_TYPES.REMINDER]: {
    appearance: "reminder",
    icon: Bell,
    labelKey: "reminder",
  },
  [CALENDAR_EVENT_TYPES.STUDY_GOAL]: {
    appearance: "goal",
    icon: Target,
    labelKey: "studyGoal",
  },
  [CALENDAR_EVENT_TYPES.PERSONAL_TASK]: {
    appearance: "task",
    icon: CheckCircle2,
    labelKey: "personalTask",
  },
};

const DEFAULT_CONFIG = {
  appearance: "default",
  icon: CalendarDays,
  labelKey: "event",
};

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function getEventConfig(type) {
  return EVENT_CONFIG[type] || DEFAULT_CONFIG;
}

function getEventSource(event) {
  return event.source === CALENDAR_SOURCES.PERSONAL
    ? "personal"
    : "academic";
}

function getEventStatus(event) {
  const status = String(
    event.status || "scheduled"
  ).toLowerCase();

  if (
    status === "cancelled" ||
    status === "canceled"
  ) {
    return "cancelled";
  }

  if (status === "completed") {
    return "completed";
  }

  const now = Date.now();

  const start = new Date(
    event.startAt
  ).getTime();

  const end = new Date(
    event.endAt
  ).getTime();

  if (
    Number.isFinite(start) &&
    Number.isFinite(end)
  ) {
    if (start <= now && end > now) {
      return "ongoing";
    }

    if (end < now) {
      return "overdue";
    }
  }

  return "scheduled";
}

function getEventPriority(event) {
  const priority = String(
    event.priority || "medium"
  ).toLowerCase();

  if (priority === "high") return "high";
  if (priority === "low") return "low";

  return "medium";
}

function getDuration(startAt, endAt, language, t) {
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    end <= start
  ) {
    return null;
  }

  const minutes = Math.round(
    (end - start) / 60000
  );

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const number = (value) =>
    new Intl.NumberFormat(
      language === "ar" ? "ar-SA" : "en-US"
    ).format(value);

  if (hours === 0) {
    return `${number(minutes)} ${t.minutes}`;
  }

  if (remainingMinutes === 0) {
    return `${number(hours)} ${t.hours}`;
  }

  return `${number(hours)} ${t.hours} ${number(
    remainingMinutes
  )} ${t.minutes}`;
}

function getCourseTitle(course, language) {
  if (!course) return "";

  if (language === "ar") {
    return (
      course.titleAr ||
      course.nameAr ||
      course.title ||
      course.name ||
      ""
    );
  }

  return (
    course.title ||
    course.name ||
    course.titleAr ||
    course.nameAr ||
    ""
  );
}

function getCoursePath(course, event) {
  if (typeof event.courseUrl === "string") {
    return event.courseUrl;
  }

  if (course?.slug) {
    return `/courses/${encodeURIComponent(course.slug)}`;
  }

  return null;
}

function getSafeExternalUrl(value) {
  if (typeof value !== "string") return null;

  try {
    const url = new URL(value);

    if (
      url.protocol !== "https:" &&
      url.protocol !== "http:"
    ) {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}

function getEventResource(event) {
  return getSafeExternalUrl(
    event.meetingUrl ||
    event.resourceUrl ||
    event.url ||
    event.link
  );
}

function getEventLocation(event) {
  return (
    event.location ||
    event.venue ||
    event.address ||
    ""
  );
}

// ------------------------------------------------------------
// Detail row
// ------------------------------------------------------------

function DetailRow({
  icon: Icon,
  label,
  children,
  className = "",
}) {
  return (
    <div
      className={[
        "behar-event-details__row",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="behar-event-details__row-icon">
        <Icon size={17} aria-hidden="true" />
      </span>

      <div className="behar-event-details__row-content">
        <span className="behar-event-details__row-label">
          {label}
        </span>

        <div className="behar-event-details__row-value">
          {children}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Event schedule
// ------------------------------------------------------------

function EventSchedule({
  event,
  language,
  t,
}) {
  const startDate = formatCalendarDate(
    event.startAt,
    language
  );

  const endDate = formatCalendarDate(
    event.endAt,
    language
  );

  const startTime = formatCalendarTime(
    event.startAt,
    language
  );

  const endTime = formatCalendarTime(
    event.endAt,
    language
  );

  const startKey = getCalendarDateKey(
    event.startAt
  );

  const endKey = getCalendarDateKey(
    event.endAt
  );

  const isMultiDay = startKey !== endKey;

  const duration = getDuration(
    event.startAt,
    event.endAt,
    language,
    t
  );

  return (
    <div className="behar-event-details__schedule">
      <DetailRow
        icon={CalendarDays}
        label={t.date}
      >
        <span>{startDate}</span>

        {isMultiDay && (
          <span className="behar-event-details__date-range">
            — {endDate}
          </span>
        )}
      </DetailRow>

      <DetailRow
        icon={Clock3}
        label={t.time}
      >
        {event.allDay ? (
          <span>{t.allDay}</span>
        ) : (
          <span>
            {startTime} – {endTime}
          </span>
        )}

        <span className="behar-event-details__timezone">
          {t.timeZone}
        </span>

        {!event.allDay && duration && (
          <span className="behar-event-details__duration">
            {t.duration}: {duration}
          </span>
        )}
      </DetailRow>
    </div>
  );
}

// ------------------------------------------------------------
// Event information
// ------------------------------------------------------------

function EventInformation({
  event,
  language,
  t,
}) {
  const description =
    getCalendarEventDescription(
      event,
      language
    ) ||
    event.description ||
    event.descriptionAr ||
    "";

  const location = getEventLocation(event);
  const resource = getEventResource(event);

  return (
    <div className="behar-event-details__information">
      <div className="behar-event-details__section-heading">
        <Info size={16} aria-hidden="true" />
        <h3>{t.description}</h3>
      </div>

      <p className="behar-event-details__description">
        {description || t.noDescription}
      </p>

      {location && (
        <DetailRow
          icon={MapPin}
          label={t.location}
        >
          {location}
        </DetailRow>
      )}

      {resource && (
        <DetailRow
          icon={Link2}
          label={t.meetingLink}
        >
          <a
            href={resource}
            target="_blank"
            rel="noopener noreferrer"
            className="behar-event-details__external-link"
          >
            {event.type ===
            CALENDAR_EVENT_TYPES.LIVE_SESSION
              ? t.openMeeting
              : t.openResource}

            <ExternalLink
              size={13}
              aria-hidden="true"
            />
          </a>
        </DetailRow>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// Course information
// ------------------------------------------------------------

function CourseInformation({
  event,
  language,
  onNavigate,
  t,
}) {
  if (
    event.source !== CALENDAR_SOURCES.ACADEMIC ||
    !event.courseId
  ) {
    return null;
  }

  const course = getCalendarCourseById(
    event.courseId
  );

  const courseTitle =
    getCourseTitle(course, language) ||
    t.noCourse;

  const coursePath = getCoursePath(
    course,
    event
  );

  return (
    <div className="behar-event-details__course">
      <div className="behar-event-details__section-heading">
        <GraduationCap
          size={17}
          aria-hidden="true"
        />

        <h3>{t.course}</h3>
      </div>

      <div className="behar-event-details__course-card">
        <div className="behar-event-details__course-icon">
          <BookOpen
            size={19}
            aria-hidden="true"
          />
        </div>

        <div className="behar-event-details__course-content">
          <strong>{courseTitle}</strong>
        </div>

        {coursePath && (
          <button
            type="button"
            onClick={() =>
              onNavigate(coursePath)
            }
            className="behar-event-details__course-link"
            aria-label={`${t.openCourse}: ${courseTitle}`}
          >
            <ArrowUpRight
              size={17}
              aria-hidden="true"
            />
          </button>
        )}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Status and priority
// ------------------------------------------------------------

function EventMetadata({
  event,
  language,
  t,
}) {
  const status = getEventStatus(event);
  const priority = getEventPriority(event);

  return (
    <div className="behar-event-details__metadata">
      <div className="behar-event-details__metadata-item">
        <span>{t.status}</span>

        <span
          className={[
            "behar-event-details__status",
            `behar-event-details__status--${status}`,
          ].join(" ")}
        >
          <span
            className="behar-event-details__status-dot"
            aria-hidden="true"
          />

          {t[status] || t.scheduled}
        </span>
      </div>

      {event.source === CALENDAR_SOURCES.PERSONAL && (
        <div className="behar-event-details__metadata-item">
          <span>{t.priority}</span>

          <span
            className={[
              "behar-event-details__priority",
              `behar-event-details__priority--${priority}`,
            ].join(" ")}
          >
            <Flag
              size={12}
              aria-hidden="true"
            />

            {t[priority] || t.normal}
          </span>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// Main modal
// ------------------------------------------------------------

export default function EventDetailsModal() {
  const navigate = useNavigate();

  const {
    language,
    selectedEvent,
    selectedEventId,
    getEventById,
    closeModal,
    openEditEvent,
    openDeleteEvent,
    goToDate,
    changeView,
    storageWritable,
  } = useCalendar();

  const isArabic = language === "ar";
  const t = TRANSLATIONS[isArabic ? "ar" : "en"];

  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  const [isVisible, setIsVisible] = useState(true);

  const event =
    selectedEvent ||
    (selectedEventId
      ? getEventById(selectedEventId)
      : null);

  // ----------------------------------------------------------
  // Dialog lifecycle and focus management
  // ----------------------------------------------------------

  useEffect(() => {
    previousFocusRef.current =
      document.activeElement;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    const handleKeyDown = (keyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
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

      if (focusable.length === 0) return;

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

  const handleClose = () => {
    closeModal();
  };

  const handleBackdropClick = (clickEvent) => {
    if (
      clickEvent.target ===
      clickEvent.currentTarget
    ) {
      handleClose();
    }
  };

  const handleEdit = () => {
    if (!event || !storageWritable) return;

    openEditEvent(event.id);
  };

  const handleDelete = () => {
    if (!event || !storageWritable) return;

    openDeleteEvent(event.id);
  };

  const handleViewDay = () => {
    if (!event) return;

    const dateKey = getCalendarDateKey(
      event.startAt
    );

    goToDate(dateKey);
    changeView(CALENDAR_VIEWS.DAY);
    closeModal();
  };

  const handleNavigate = (path) => {
    if (!path || !path.startsWith("/")) {
      return;
    }

    closeModal();
    navigate(path);
  };

  // ----------------------------------------------------------
  // Event unavailable
  // ----------------------------------------------------------

  if (!event) {
    return (
      <div
        className="behar-event-details__overlay"
        onMouseDown={handleBackdropClick}
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div
          ref={dialogRef}
          className="behar-event-details__dialog behar-event-details__dialog--empty"
          role="dialog"
          aria-modal="true"
          aria-labelledby="behar-event-details-title"
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="behar-event-details__close"
            onClick={handleClose}
            aria-label={t.close}
          >
            <X size={19} />
          </button>

          <CalendarDays
            size={35}
            aria-hidden="true"
          />

          <h2 id="behar-event-details-title">
            {t.unavailable}
          </h2>

          <p>{t.unavailableDescription}</p>

          <button
            type="button"
            className="behar-event-details__primary-action"
            onClick={handleClose}
          >
            {t.backToCalendar}
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // Event data
  // ----------------------------------------------------------

  const config = getEventConfig(
    event.type
  );

  const EventIcon = config.icon;

  const source = getEventSource(event);

  const title =
    getCalendarEventTitle(
      event,
      language
    ) ||
    event.title ||
    event.titleAr ||
    t.event;

  const canEdit =
    storageWritable &&
    canEditCalendarEvent(event);

  const canDelete =
    storageWritable &&
    canDeleteCalendarEvent(event);

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------

  return (
    <div
      className="behar-event-details__overlay"
      onMouseDown={handleBackdropClick}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div
        ref={dialogRef}
        className={[
          "behar-event-details__dialog",
          `behar-event-details__dialog--${config.appearance}`,
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="behar-event-details-title"
        aria-describedby="behar-event-details-description"
      >
        {/* ==================================
            HEADER
        ================================== */}

        <header className="behar-event-details__header">
          <div className="behar-event-details__header-top">
            <span
              className={[
                "behar-event-details__source",
                `behar-event-details__source--${source}`,
              ].join(" ")}
            >
              {source === "academic"
                ? t.academicEvent
                : t.personalEvent}
            </span>

            <button
              ref={closeButtonRef}
              type="button"
              className="behar-event-details__close"
              onClick={handleClose}
              aria-label={t.close}
            >
              <X
                size={19}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="behar-event-details__identity">
            <span className="behar-event-details__event-icon">
              <EventIcon
                size={24}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <div className="behar-event-details__identity-content">
              <span className="behar-event-details__type">
                {t[config.labelKey]}
              </span>

              <h2 id="behar-event-details-title">
                {title}
              </h2>
            </div>
          </div>
        </header>

        {/* ==================================
            BODY
        ================================== */}

        <div className="behar-event-details__body">
          <EventMetadata
            event={event}
            language={language}
            t={t}
          />

          <EventSchedule
            event={event}
            language={language}
            t={t}
          />

          <CourseInformation
            event={event}
            language={language}
            onNavigate={handleNavigate}
            t={t}
          />

          <div id="behar-event-details-description">
            <EventInformation
              event={event}
              language={language}
              t={t}
            />
          </div>
        </div>

        {/* ==================================
            FOOTER
        ================================== */}

        <footer className="behar-event-details__footer">
          <button
            type="button"
            className="behar-event-details__view-day"
            onClick={handleViewDay}
          >
            <CalendarDays
              size={16}
              aria-hidden="true"
            />

            {t.viewDay}
          </button>

          <div className="behar-event-details__footer-actions">
            {canEdit && (
              <button
                type="button"
                className="behar-event-details__edit"
                onClick={handleEdit}
              >
                <Pencil
                  size={15}
                  aria-hidden="true"
                />

                {t.edit}
              </button>
            )}

            {canDelete && (
              <button
                type="button"
                className="behar-event-details__delete"
                onClick={handleDelete}
              >
                <Trash2
                  size={15}
                  aria-hidden="true"
                />

                {t.delete}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
