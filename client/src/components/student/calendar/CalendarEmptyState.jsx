
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 23
 *
 * CalendarEmptyState
 *
 * Reusable empty-state component for:
 * - Month view
 * - Week view
 * - Day view
 * - Upcoming events
 * - Filtered results
 *
 * React 19 + JSX + Pure CSS
 */

import {
  CalendarDays,
  CalendarRange,
  CalendarCheck2,
  CalendarX2,
  SearchX,
  Plus,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  LockKeyhole,
} from "lucide-react";

import useCalendar from "../../../hooks/useCalendar";

import {
  CALENDAR_VIEWS,
} from "../../../data/calendar";

import "../../../styles/student/calendar/calendar-empty-state.css";

// ------------------------------------------------------------
// Variants
// ------------------------------------------------------------

export const CALENDAR_EMPTY_VARIANTS = Object.freeze({
  MONTH: "month",
  WEEK: "week",
  DAY: "day",
  UPCOMING: "upcoming",
  FILTERED: "filtered",
});

// ------------------------------------------------------------
// Translations
// ------------------------------------------------------------

const TRANSLATIONS = {
  en: {
    month: {
      eyebrow: "A fresh start",
      title: "Your month is wide open",
      description:
        "Nothing is scheduled for this month yet. Add a personal event to start organizing your learning journey.",
    },

    week: {
      eyebrow: "Room to focus",
      title: "A clear week ahead",
      description:
        "There are no events scheduled for this week. Plan a study session, set a goal, or add a reminder.",
    },

    day: {
      eyebrow: "Make today count",
      title: "Nothing on your schedule",
      description:
        "You have no events planned for this day. Create a study session or reminder to make the most of your time.",
    },

    upcoming: {
      eyebrow: "You're all caught up",
      title: "No upcoming events",
      description:
        "There are no upcoming events on your calendar. Add a personal event or explore your schedule.",
    },

    filtered: {
      eyebrow: "No matching results",
      title: "No events found",
      description:
        "No calendar events match your current filters. Try changing your search or clearing the filters.",
    },

    addEvent: "Add personal event",
    clearFilters: "Clear filters",
    goToday: "Go to today",
    viewCalendar: "View calendar",
    createDisabled:
      "Personal event creation is currently unavailable.",
  },

  ar: {
    month: {
      eyebrow: "بداية جديدة",
      title: "شهرك جاهز للتخطيط",
      description:
        "لا توجد فعاليات مجدولة لهذا الشهر حتى الآن. أضف فعالية شخصية وابدأ بتنظيم رحلتك التعليمية.",
    },

    week: {
      eyebrow: "وقت للتركيز",
      title: "أسبوعك متاح للتخطيط",
      description:
        "لا توجد فعاليات مجدولة لهذا الأسبوع. خطط لجلسة دراسة أو حدد هدفًا أو أضف تذكيرًا.",
    },

    day: {
      eyebrow: "استثمر يومك",
      title: "لا توجد فعاليات لهذا اليوم",
      description:
        "ليس لديك أي فعاليات مخططة لهذا اليوم. أنشئ جلسة دراسة أو تذكيرًا لتنظيم وقتك.",
    },

    upcoming: {
      eyebrow: "كل شيء تحت السيطرة",
      title: "لا توجد فعاليات قادمة",
      description:
        "لا توجد فعاليات قادمة في تقويمك حاليًا. أضف فعالية شخصية أو استعرض جدولك.",
    },

    filtered: {
      eyebrow: "لا توجد نتائج مطابقة",
      title: "لم يتم العثور على فعاليات",
      description:
        "لا توجد فعاليات تطابق عوامل التصفية الحالية. جرّب تغيير البحث أو إزالة عوامل التصفية.",
    },

    addEvent: "إضافة فعالية شخصية",
    clearFilters: "إزالة عوامل التصفية",
    goToday: "الانتقال إلى اليوم",
    viewCalendar: "عرض التقويم",
    createDisabled:
      "إضافة الفعاليات الشخصية غير متاحة حاليًا.",
  },
};

// ------------------------------------------------------------
// Variant configuration
// ------------------------------------------------------------

const VARIANT_CONFIG = {
  month: {
    icon: CalendarDays,
    accent: "month",
  },

  week: {
    icon: CalendarRange,
    accent: "week",
  },

  day: {
    icon: CalendarCheck2,
    accent: "day",
  },

  upcoming: {
    icon: CalendarX2,
    accent: "upcoming",
  },

  filtered: {
    icon: SearchX,
    accent: "filtered",
  },
};

// ------------------------------------------------------------
// Main component
// ------------------------------------------------------------

export default function CalendarEmptyState({
  variant = CALENDAR_EMPTY_VARIANTS.DAY,
  compact = false,
  embedded = false,
  showActions = true,
  showSecondaryAction = true,
  title,
  description,
  eyebrow,
  className = "",
  onCreate,
  onClearFilters,
  onGoToday,
  onViewCalendar,
}) {
  const {
    language,
    selectedDateKey,
    storageWritable,
    openCreateEvent,
    clearFilters,
    goToToday,
    changeView,
  } = useCalendar();

  const isArabic = language === "ar";
  const t = TRANSLATIONS[isArabic ? "ar" : "en"];

  const safeVariant = Object.hasOwn(
    VARIANT_CONFIG,
    variant
  )
    ? variant
    : CALENDAR_EMPTY_VARIANTS.DAY;

  const config = VARIANT_CONFIG[safeVariant];
  const content = t[safeVariant];

  const Icon = config.icon;
  const DirectionIcon = isArabic
    ? ArrowLeft
    : ArrowRight;

  const displayTitle = title ?? content.title;
  const displayDescription =
    description ?? content.description;
  const displayEyebrow = eyebrow ?? content.eyebrow;

  // ----------------------------------------------------------
  // Actions
  // ----------------------------------------------------------

  const handleCreate = () => {
    if (!storageWritable) return;

    if (typeof onCreate === "function") {
      onCreate();
      return;
    }

    openCreateEvent(selectedDateKey);
  };

  const handleClearFilters = () => {
    if (typeof onClearFilters === "function") {
      onClearFilters();
      return;
    }

    clearFilters();
  };

  const handleGoToday = () => {
    if (typeof onGoToday === "function") {
      onGoToday();
      return;
    }

    goToToday();
  };

  const handleViewCalendar = () => {
    if (typeof onViewCalendar === "function") {
      onViewCalendar();
      return;
    }

    changeView(CALENDAR_VIEWS.MONTH);
  };

  // ----------------------------------------------------------
  // Action configuration
  // ----------------------------------------------------------

  const isFiltered =
    safeVariant === CALENDAR_EMPTY_VARIANTS.FILTERED;

  const isUpcoming =
    safeVariant === CALENDAR_EMPTY_VARIANTS.UPCOMING;

  const primaryAction = isFiltered
    ? {
        label: t.clearFilters,
        icon: RotateCcw,
        onClick: handleClearFilters,
        disabled: false,
      }
    : {
        label: t.addEvent,
        icon: Plus,
        onClick: handleCreate,
        disabled: !storageWritable,
      };

  let secondaryAction = null;

  if (isFiltered) {
    secondaryAction = {
      label: t.goToday,
      icon: DirectionIcon,
      onClick: handleGoToday,
    };
  } else if (isUpcoming) {
    secondaryAction = {
      label: t.viewCalendar,
      icon: DirectionIcon,
      onClick: handleViewCalendar,
    };
  } else {
    secondaryAction = {
      label: t.goToday,
      icon: DirectionIcon,
      onClick: handleGoToday,
    };
  }

  const PrimaryIcon = primaryAction.icon;
  const SecondaryIcon = secondaryAction?.icon;

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------

  return (
    <section
      className={[
        "behar-calendar-empty",
        `behar-calendar-empty--${config.accent}`,
        compact
          ? "behar-calendar-empty--compact"
          : "",
        embedded
          ? "behar-calendar-empty--embedded"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      dir={isArabic ? "rtl" : "ltr"}
      aria-label={displayTitle}
    >
      {/* Decorative illustration */}

      <div
        className="behar-calendar-empty__visual"
        aria-hidden="true"
      >
        <span className="behar-calendar-empty__visual-orbit behar-calendar-empty__visual-orbit--outer" />

        <span className="behar-calendar-empty__visual-orbit behar-calendar-empty__visual-orbit--inner" />

        <div className="behar-calendar-empty__icon-wrap">
          <Icon
            size={compact ? 25 : 34}
            strokeWidth={1.6}
          />
        </div>

        <span className="behar-calendar-empty__spark behar-calendar-empty__spark--one">
          <Sparkles size={15} />
        </span>

        <span className="behar-calendar-empty__spark behar-calendar-empty__spark--two">
          <span />
        </span>

        <span className="behar-calendar-empty__spark behar-calendar-empty__spark--three">
          <span />
        </span>
      </div>

      {/* Content */}

      <div className="behar-calendar-empty__content">
        <span className="behar-calendar-empty__eyebrow">
          {displayEyebrow}
        </span>

        <h3 className="behar-calendar-empty__title">
          {displayTitle}
        </h3>

        <p className="behar-calendar-empty__description">
          {displayDescription}
        </p>
      </div>

      {/* Actions */}

      {showActions && (
        <div className="behar-calendar-empty__actions">
          <button
            type="button"
            className="behar-calendar-empty__primary"
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled}
            title={
              primaryAction.disabled
                ? t.createDisabled
                : undefined
            }
          >
            <PrimaryIcon
              size={16}
              aria-hidden="true"
            />

            <span>{primaryAction.label}</span>
          </button>

          {showSecondaryAction &&
            secondaryAction && (
              <button
                type="button"
                className="behar-calendar-empty__secondary"
                onClick={secondaryAction.onClick}
              >
                <span>{secondaryAction.label}</span>

                <SecondaryIcon
                  size={15}
                  aria-hidden="true"
                />
              </button>
            )}
        </div>
      )}

      {/* Storage status */}

      {showActions &&
        !isFiltered &&
        !storageWritable && (
          <p className="behar-calendar-empty__notice">
            <LockKeyhole
              size={13}
              aria-hidden="true"
            />

            {t.createDisabled}
          </p>
        )}
    </section>
  );
}
