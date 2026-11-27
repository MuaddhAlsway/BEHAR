
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 17
 *
 * CalendarEvent
 *
 * Reusable event presentation component.
 *
 * Variants:
 * - month
 * - week
 * - day
 * - upcoming
 *
 * Supports:
 * - Academic / personal events
 * - English / Arabic
 * - Event type colors
 * - Time and date labels
 * - All-day events
 * - Multi-day events
 * - Event status
 * - Event priority
 * - Overlapping event positioning
 * - Accessible event selection
 *
 * Pure CSS — no Tailwind.
 */

import {
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
  ExternalLink,
} from "lucide-react";

import {
  CALENDAR_SOURCES,
  CALENDAR_EVENT_TYPES,
  getCalendarEventTitle,
  getCalendarEventDescription,
} from "../../../data/calendar";

import {
  formatCalendarTime,
  formatCalendarDate,
  formatCalendarTimeRange,
} from "../../../utils/calendarDates";

import "../../../styles/student/calendar/calendar-event.css";

// ------------------------------------------------------------
// Constants
// ------------------------------------------------------------

export const CALENDAR_EVENT_VARIANTS = Object.freeze({
  MONTH: "month",
  WEEK: "week",
  DAY: "day",
  UPCOMING: "upcoming",
});

const EVENT_CONFIG = {
  [CALENDAR_EVENT_TYPES.LIVE_SESSION]: {
    appearance: "live",
    icon: Video,
    label: {
      en: "Live session",
      ar: "جلسة مباشرة",
    },
  },

  [CALENDAR_EVENT_TYPES.LESSON]: {
    appearance: "lesson",
    icon: BookOpen,
    label: {
      en: "Lesson",
      ar: "درس",
    },
  },

  [CALENDAR_EVENT_TYPES.ASSIGNMENT]: {
    appearance: "assignment",
    icon: FileText,
    label: {
      en: "Assignment",
      ar: "واجب",
    },
  },

  [CALENDAR_EVENT_TYPES.QUIZ]: {
    appearance: "assessment",
    icon: ClipboardCheck,
    label: {
      en: "Quiz",
      ar: "اختبار قصير",
    },
  },

  [CALENDAR_EVENT_TYPES.EXAM]: {
    appearance: "assessment",
    icon: ClipboardCheck,
    label: {
      en: "Exam",
      ar: "اختبار",
    },
  },

  [CALENDAR_EVENT_TYPES.DEADLINE]: {
    appearance: "deadline",
    icon: AlertCircle,
    label: {
      en: "Deadline",
      ar: "موعد نهائي",
    },
  },

  [CALENDAR_EVENT_TYPES.STUDY_SESSION]: {
    appearance: "study",
    icon: BookOpen,
    label: {
      en: "Study session",
      ar: "جلسة دراسة",
    },
  },

  [CALENDAR_EVENT_TYPES.REMINDER]: {
    appearance: "reminder",
    icon: Bell,
    label: {
      en: "Reminder",
      ar: "تذكير",
    },
  },

  [CALENDAR_EVENT_TYPES.STUDY_GOAL]: {
    appearance: "goal",
    icon: Target,
    label: {
      en: "Study goal",
      ar: "هدف دراسي",
    },
  },

  [CALENDAR_EVENT_TYPES.PERSONAL_TASK]: {
    appearance: "task",
    icon: CheckCircle2,
    label: {
      en: "Personal task",
      ar: "مهمة شخصية",
    },
  },
};

const DEFAULT_EVENT_CONFIG = {
  appearance: "default",
  icon: CalendarDays,
  label: {
    en: "Event",
    ar: "فعالية",
  },
};

const TRANSLATIONS = {
  en: {
    academic: "Academic",
    personal: "Personal",
    allDay: "All day",
    completed: "Completed",
    cancelled: "Cancelled",
    overdue: "Overdue",
    highPriority: "High priority",
    ongoing: "Ongoing",
    continues: "Continues",
    starts: "Starts",
    ends: "Ends",
    openDetails: "Open event details",
    noTitle: "Untitled event",
  },

  ar: {
    academic: "أكاديمي",
    personal: "شخصي",
    allDay: "طوال اليوم",
    completed: "مكتمل",
    cancelled: "ملغي",
    overdue: "متأخر",
    highPriority: "أولوية عالية",
    ongoing: "جارٍ",
    continues: "مستمر",
    starts: "يبدأ",
    ends: "ينتهي",
    openDetails: "عرض تفاصيل الفعالية",
    noTitle: "فعالية بدون عنوان",
  },
};

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function getEventConfig(type) {
  return EVENT_CONFIG[type] || DEFAULT_EVENT_CONFIG;
}

function getEventSource(event) {
  return event.source === CALENDAR_SOURCES.PERSONAL
    ? "personal"
    : "academic";
}

function getEventTitle(event, language, t) {
  return (
    getCalendarEventTitle(event, language) ||
    event.title ||
    event.titleAr ||
    t.noTitle
  );
}

function getEventDescription(event, language) {
  return (
    getCalendarEventDescription(event, language) ||
    event.description ||
    event.descriptionAr ||
    ""
  );
}

function getEventStatus(event) {
  const status = String(event.status || "").toLowerCase();

  if (status === "completed") return "completed";
  if (status === "cancelled" || status === "canceled") {
    return "cancelled";
  }

  if (
    event.endAt &&
    new Date(event.endAt).getTime() < Date.now() &&
    status !== "completed"
  ) {
    return "past";
  }

  return status || "scheduled";
}

function getEventPriority(event) {
  return String(event.priority || "").toLowerCase();
}

function getEventTime(event, language, t) {
  if (event.allDay) {
    return t.allDay;
  }

  if (!event.startAt) {
    return "";
  }

  if (event.endAt) {
    return formatCalendarTimeRange(
      event.startAt,
      event.endAt,
      language
    );
  }

  return formatCalendarTime(
    event.startAt,
    language
  );
}

function getEventDate(event, language) {
  if (!event.startAt) return "";

  return formatCalendarDate(
    event.startAt,
    language
  );
}

function getPositionStyle(position) {
  if (!position) return undefined;

  const {
    top,
    height,
    width,
    offset,
    zIndex,
  } = position;

  const style = {};

  if (Number.isFinite(top)) {
    style.top = `${top}px`;
  }

  if (Number.isFinite(height)) {
    style.height = `${height}px`;
  }

  if (Number.isFinite(width)) {
    style.width = `calc(${width}% - 6px)`;
  }

  if (Number.isFinite(offset)) {
    style.insetInlineStart = `calc(${offset}% + 3px)`;
  }

  if (Number.isFinite(zIndex)) {
    style.zIndex = zIndex;
  }

  return style;
}

function getPositionLabel(position, t) {
  if (!position) return "";

  if (position === "start") return t.starts;
  if (position === "middle") return t.continues;
  if (position === "end") return t.ends;

  return "";
}

// ------------------------------------------------------------
// Month variant
// ------------------------------------------------------------

function MonthEvent({
  event,
  title,
  appearance,
  source,
  timeLabel,
  status,
  position,
  onClick,
  compact,
  className,
  t,
}) {
  return (
    <button
      type="button"
      className={[
        "behar-calendar-event",
        "behar-calendar-event--month",
        `behar-calendar-event--${appearance}`,
        `behar-calendar-event--${source}`,
        `behar-calendar-event--${status}`,
        position
          ? `behar-calendar-event--position-${position}`
          : "",
        compact
          ? "behar-calendar-event--compact"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      title={`${title} — ${timeLabel}`}
      aria-label={[
        title,
        timeLabel,
        getPositionLabel(position, t),
      ]
        .filter(Boolean)
        .join(", ")}
    >
      <span
        className="behar-calendar-event__dot"
        aria-hidden="true"
      />

      {!event.allDay && !compact && (
        <span className="behar-calendar-event__month-time">
          {formatCalendarTime(
            event.startAt,
            event.language || "en"
          )}
        </span>
      )}

      <span className="behar-calendar-event__title">
        {title}
      </span>
    </button>
  );
}

// ------------------------------------------------------------
// Week / day timeline variant
// ------------------------------------------------------------

function TimelineEvent({
  variant,
  title,
  appearance,
  source,
  timeLabel,
  status,
  priority,
  position,
  onClick,
  compact,
  className,
  config,
  t,
}) {
  const Icon = config.icon;

  const style = getPositionStyle(position);

  const showDetails =
    !compact &&
    (!position ||
      !Number.isFinite(position.height) ||
      position.height >= 45);

  return (
    <button
      type="button"
      className={[
        "behar-calendar-event",
        "behar-calendar-event--timeline",
        `behar-calendar-event--${variant}`,
        `behar-calendar-event--${appearance}`,
        `behar-calendar-event--${source}`,
        `behar-calendar-event--${status}`,
        priority === "high"
          ? "behar-calendar-event--high-priority"
          : "",
        compact
          ? "behar-calendar-event--compact"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      onClick={onClick}
      title={`${title} — ${timeLabel}`}
      aria-label={`${title}, ${timeLabel}`}
    >
      <span className="behar-calendar-event__timeline-heading">
        <Icon
          size={13}
          strokeWidth={2}
          aria-hidden="true"
        />

        <span className="behar-calendar-event__title">
          {title}
        </span>
      </span>

      {showDetails && (
        <span className="behar-calendar-event__time">
          <Clock3
            size={11}
            aria-hidden="true"
          />

          {timeLabel}
        </span>
      )}
    </button>
  );
}

// ------------------------------------------------------------
// Upcoming event variant
// ------------------------------------------------------------

function UpcomingEvent({
  title,
  description,
  appearance,
  source,
  timeLabel,
  dateLabel,
  status,
  priority,
  onClick,
  className,
  config,
  language,
  t,
}) {
  const Icon = config.icon;

  return (
    <button
      type="button"
      className={[
        "behar-calendar-event",
        "behar-calendar-event--upcoming",
        `behar-calendar-event--${appearance}`,
        `behar-calendar-event--${source}`,
        `behar-calendar-event--${status}`,
        priority === "high"
          ? "behar-calendar-event--high-priority"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      title={title}
      aria-label={`${t.openDetails}: ${title}`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <span className="behar-calendar-event__upcoming-icon">
        <Icon
          size={18}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </span>

      <span className="behar-calendar-event__upcoming-content">
        <span className="behar-calendar-event__upcoming-meta">
          <span className="behar-calendar-event__type">
            {config.label[language]}
          </span>

          <span className="behar-calendar-event__source">
            {source === "academic"
              ? t.academic
              : t.personal}
          </span>
        </span>

        <span className="behar-calendar-event__title">
          {title}
        </span>

        {description && (
          <span className="behar-calendar-event__description">
            {description}
          </span>
        )}

        <span className="behar-calendar-event__upcoming-date">
          <CalendarDays
            size={12}
            aria-hidden="true"
          />

          {dateLabel}

          <span className="behar-calendar-event__separator">
            •
          </span>

          <Clock3
            size={12}
            aria-hidden="true"
          />

          {timeLabel}
        </span>
      </span>

      <ExternalLink
        className="behar-calendar-event__upcoming-arrow"
        size={15}
        aria-hidden="true"
      />
    </button>
  );
}

// ------------------------------------------------------------
// Main component
// ------------------------------------------------------------

export default function CalendarEvent({
  event,
  variant = CALENDAR_EVENT_VARIANTS.MONTH,
  language = "en",
  position = null,
  compact = false,
  onClick,
  className = "",
}) {
  if (!event) {
    return null;
  }

  const isArabic = language === "ar";
  const t = TRANSLATIONS[isArabic ? "ar" : "en"];

  const config = getEventConfig(event.type);

  const appearance = config.appearance;
  const source = getEventSource(event);

  const title = getEventTitle(
    event,
    language,
    t
  );

  const description = getEventDescription(
    event,
    language
  );

  const status = getEventStatus(event);
  const priority = getEventPriority(event);

  const timeLabel = getEventTime(
    event,
    language,
    t
  );

  const dateLabel = getEventDate(
    event,
    language
  );

  const handleClick = (clickEvent) => {
    clickEvent.stopPropagation();

    if (typeof onClick === "function") {
      onClick(event.id, event);
    }
  };

  const sharedProps = {
    event,
    title,
    appearance,
    source,
    timeLabel,
    dateLabel,
    status,
    priority,
    description,
    onClick: handleClick,
    compact,
    className,
    config,
    language,
    t,
  };

  switch (variant) {
    case CALENDAR_EVENT_VARIANTS.WEEK:
    case CALENDAR_EVENT_VARIANTS.DAY:
      return (
        <TimelineEvent
          {...sharedProps}
          variant={variant}
          position={position}
        />
      );

    case CALENDAR_EVENT_VARIANTS.UPCOMING:
      return <UpcomingEvent {...sharedProps} />;

    case CALENDAR_EVENT_VARIANTS.MONTH:
    default:
      return (
        <MonthEvent
          {...sharedProps}
          position={position}
        />
      );
  }
}

export {
  getEventConfig,
  getEventSource,
  getEventTitle,
  getEventDescription,
};
