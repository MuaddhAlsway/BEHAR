
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 21
 *
 * PersonalEventModal
 *
 * React 19 + JSX + Pure CSS
 *
 * Uses CalendarContext for:
 * - Creating personal events
 * - Updating personal events
 * - Validation feedback
 * - localStorage persistence
 * - Modal state management
 */

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  X,
  CalendarDays,
  Clock3,
  FileText,
  Flag,
  Type,
  Check,
  AlertCircle,
  Save,
  Plus,
  CalendarCheck2,
  LockKeyhole,
} from "lucide-react";

import useCalendar from "../../../hooks/useCalendar";

import {
  CALENDAR_EVENT_TYPES,
  CALENDAR_TIME_ZONE,
  PERSONAL_EVENT_TYPES,
  CALENDAR_PERSONAL_TYPE_OPTIONS,
  CALENDAR_PRIORITY_OPTIONS,
  createPersonalEventDraft,
} from "../../../data/calendar";

import {
  getCalendarDateKey,
} from "../../../utils/calendarDates";

import "../../../styles/student/calendar/personal-event-modal.css";

// ------------------------------------------------------------
// Configuration
// ------------------------------------------------------------

const TRANSLATIONS = {
  en: {
    createTitle: "Create personal event",
    editTitle: "Edit personal event",
    createSubtitle: "Plan something important.",
    editSubtitle: "Update your schedule.",
    personalEvent: "Personal event",
    eventType: "Event type",
    title: "Event title",
    titlePlaceholder: "e.g. Review React concepts",
    description: "Description",
    descriptionPlaceholder:
      "Add notes, objectives, or anything you'd like to remember...",
    optional: "Optional",
    date: "Date",
    startDate: "Start date",
    endDate: "End date",
    startTime: "Start time",
    endTime: "End time",
    allDay: "All-day event",
    allDayDescription:
      "This event will appear in the all-day section.",
    priority: "Priority",
    low: "Low",
    medium: "Medium",
    high: "High",
    cancel: "Cancel",
    create: "Create event",
    save: "Save changes",
    saving: "Saving...",
    close: "Close",
    required: "Required",
    timezone: "Saudi Arabia time (UTC+3)",
    requiredTitle: "Enter an event title.",
    titleTooLong: "The title must be 120 characters or less.",
    descriptionTooLong:
      "The description must be 2,000 characters or less.",
    requiredDate: "Select a valid date.",
    invalidDateRange:
      "The end date must not be before the start date.",
    requiredTime: "Enter a valid start and end time.",
    invalidTimeRange:
      "The end must be later than the start.",
    invalidType: "Select a valid personal event type.",
    invalidPriority: "Select a valid priority.",
    saveError:
      "Unable to save your event. Please try again.",
    storageUnavailable:
      "Personal events cannot be saved right now.",
    unsavedTitle: "Discard changes?",
    unsavedMessage:
      "You have unsaved changes. Discard them?",
    keepEditing: "Keep editing",
    discard: "Discard changes",
    characters: "characters",
  },

  ar: {
    createTitle: "إنشاء فعالية شخصية",
    editTitle: "تعديل فعالية شخصية",
    createSubtitle: "نظّم وقتك وخطط لما هو مهم.",
    editSubtitle: "حدّث تفاصيل جدولك.",
    personalEvent: "فعالية شخصية",
    eventType: "نوع الفعالية",
    title: "عنوان الفعالية",
    titlePlaceholder: "مثال: مراجعة مفاهيم React",
    description: "الوصف",
    descriptionPlaceholder:
      "أضف ملاحظات أو أهدافًا أو أي معلومات ترغب في تذكرها...",
    optional: "اختياري",
    date: "التاريخ",
    startDate: "تاريخ البداية",
    endDate: "تاريخ النهاية",
    startTime: "وقت البداية",
    endTime: "وقت النهاية",
    allDay: "فعالية طوال اليوم",
    allDayDescription:
      "ستظهر هذه الفعالية في قسم فعاليات اليوم الكامل.",
    priority: "الأولوية",
    low: "منخفضة",
    medium: "متوسطة",
    high: "عالية",
    cancel: "إلغاء",
    create: "إنشاء الفعالية",
    save: "حفظ التغييرات",
    saving: "جارٍ الحفظ...",
    close: "إغلاق",
    required: "مطلوب",
    timezone: "بتوقيت السعودية (UTC+3)",
    requiredTitle: "يرجى إدخال عنوان الفعالية.",
    titleTooLong: "يجب ألا يتجاوز العنوان 120 حرفًا.",
    descriptionTooLong:
      "يجب ألا يتجاوز الوصف 2000 حرف.",
    requiredDate: "يرجى تحديد تاريخ صحيح.",
    invalidDateRange:
      "يجب ألا يسبق تاريخ النهاية تاريخ البداية.",
    requiredTime: "يرجى إدخال وقت بداية ونهاية صحيح.",
    invalidTimeRange:
      "يجب أن يكون وقت النهاية بعد وقت البداية.",
    invalidType: "اختر نوع فعالية شخصية صحيحًا.",
    invalidPriority: "اختر أولوية صحيحة.",
    saveError:
      "تعذر حفظ الفعالية. يرجى المحاولة مرة أخرى.",
    storageUnavailable:
      "لا يمكن حفظ الفعاليات الشخصية حاليًا.",
    unsavedTitle: "تجاهل التغييرات؟",
    unsavedMessage:
      "لديك تغييرات غير محفوظة. هل ترغب في تجاهلها؟",
    keepEditing: "متابعة التعديل",
    discard: "تجاهل التغييرات",
    characters: "حرفًا",
  },
};

const DEFAULT_TYPES = [
  {
    value: CALENDAR_EVENT_TYPES.STUDY_SESSION,
    en: "Study session",
    ar: "جلسة دراسة",
  },
  {
    value: CALENDAR_EVENT_TYPES.REMINDER,
    en: "Reminder",
    ar: "تذكير",
  },
  {
    value: CALENDAR_EVENT_TYPES.STUDY_GOAL,
    en: "Study goal",
    ar: "هدف دراسي",
  },
  {
    value: CALENDAR_EVENT_TYPES.PERSONAL_TASK,
    en: "Personal task",
    ar: "مهمة شخصية",
  },
];

const DEFAULT_PRIORITIES = [
  { value: "low", en: "Low", ar: "منخفضة" },
  { value: "medium", en: "Medium", ar: "متوسطة" },
  { value: "high", en: "High", ar: "عالية" },
];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function isValidDateKey(value) {
  if (!DATE_PATTERN.test(String(value || ""))) {
    return false;
  }

  const [year, month, day] = value
    .split("-")
    .map(Number);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function normalizeTime(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }

  const match = value.match(/^(\d{2}):(\d{2})/);

  if (!match) return fallback;

  const time = `${match[1]}:${match[2]}`;

  return TIME_PATTERN.test(time)
    ? time
    : fallback;
}

function formatInputTime(value, fallback) {
  if (!value) return fallback;

  if (
    typeof value === "string" &&
    TIME_PATTERN.test(value)
  ) {
    return value;
  }

  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return fallback;
  }

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: CALENDAR_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const hour = parts.find(
    (part) => part.type === "hour"
  )?.value;

  const minute = parts.find(
    (part) => part.type === "minute"
  )?.value;

  return normalizeTime(
    `${hour}:${minute}`,
    fallback
  );
}

function getInputDate(value, fallback) {
  if (
    typeof value === "string" &&
    isValidDateKey(value)
  ) {
    return value;
  }

  if (value) {
    const date = new Date(value);

    if (Number.isFinite(date.getTime())) {
      return getCalendarDateKey(date);
    }
  }

  return fallback;
}

function addOneHour(time) {
  const [hour, minute] = time.split(":").map(Number);

  const next = Math.min(hour + 1, 23);

  return `${String(next).padStart(2, "0")}:${String(
    minute
  ).padStart(2, "0")}`;
}

function getOptions(options, fallback, language) {
  const source =
    Array.isArray(options) && options.length
      ? options
      : fallback;

  return source
    .map((option) => {
      const value =
        typeof option === "string"
          ? option
          : option.value ?? option.id;

      if (!value) return null;

      const fallbackOption = fallback.find(
        (item) => item.value === value
      );

      const label =
        language === "ar"
          ? option.labelAr ??
            option.ar ??
            fallbackOption?.ar ??
            option.label ??
            value
          : option.labelEn ??
            option.en ??
            fallbackOption?.en ??
            option.label ??
            value;

      return {
        value: String(value),
        label: String(label),
      };
    })
    .filter(Boolean);
}

function getInitialForm(event, draft, dateKey) {
  const source = event || draft || {};

  const startDate = getInputDate(
    source.startDate ?? source.startAt,
    dateKey
  );

  const endDate = getInputDate(
    source.endDate ?? source.endAt,
    startDate
  );

  const startTime = formatInputTime(
    source.startTime ?? source.startAt,
    "09:00"
  );

  const endTime = formatInputTime(
    source.endTime ?? source.endAt,
    addOneHour(startTime)
  );

  return {
    type:
      source.type ||
      CALENDAR_EVENT_TYPES.STUDY_SESSION,
    title:
      source.title ??
      source.titleEn ??
      "",
    description:
      source.description ??
      source.descriptionEn ??
      "",
    startDate,
    endDate,
    startTime,
    endTime,
    allDay: Boolean(source.allDay),
    priority: source.priority || "medium",
  };
}

/**
 * Convert Saudi-local date/time to an ISO UTC timestamp.
 * Saudi Arabia observes UTC+03:00 year-round.
 */
function toRiyadhISOString(dateKey, time) {
  const date = new Date(
    `${dateKey}T${time}:00+03:00`
  );

  return Number.isFinite(date.getTime())
    ? date.toISOString()
    : null;
}

function getNextDateKey(dateKey) {
  const [year, month, day] = dateKey
    .split("-")
    .map(Number);

  const next = new Date(
    Date.UTC(year, month - 1, day + 1)
  );

  return [
    next.getUTCFullYear(),
    String(next.getUTCMonth() + 1).padStart(2, "0"),
    String(next.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function validateForm(form, allowedTypes, allowedPriorities, t) {
  const errors = {};

  const title = form.title.trim();

  if (!title) {
    errors.title = t.requiredTitle;
  } else if (title.length > 120) {
    errors.title = t.titleTooLong;
  }

  if (form.description.length > 2000) {
    errors.description = t.descriptionTooLong;
  }

  if (!allowedTypes.includes(form.type)) {
    errors.type = t.invalidType;
  }

  if (!allowedPriorities.includes(form.priority)) {
    errors.priority = t.invalidPriority;
  }

  if (
    !isValidDateKey(form.startDate) ||
    !isValidDateKey(form.endDate)
  ) {
    errors.startDate = t.requiredDate;
  } else if (form.endDate < form.startDate) {
    errors.endDate = t.invalidDateRange;
  }

  if (!form.allDay) {
    if (
      !TIME_PATTERN.test(form.startTime) ||
      !TIME_PATTERN.test(form.endTime)
    ) {
      errors.startTime = t.requiredTime;
    } else {
      const start = toRiyadhISOString(
        form.startDate,
        form.startTime
      );

      const end = toRiyadhISOString(
        form.endDate,
        form.endTime
      );

      if (
        !start ||
        !end ||
        new Date(end).getTime() <=
          new Date(start).getTime()
      ) {
        errors.endTime = t.invalidTimeRange;
      }
    }
  }

  return errors;
}

function buildEventPayload(form) {
  const startAt = form.allDay
    ? toRiyadhISOString(form.startDate, "00:00")
    : toRiyadhISOString(
        form.startDate,
        form.startTime
      );

  const endAt = form.allDay
    ? toRiyadhISOString(
        getNextDateKey(form.endDate),
        "00:00"
      )
    : toRiyadhISOString(
        form.endDate,
        form.endTime
      );

  return {
    type: form.type,
    title: form.title.trim(),
    description: form.description.trim(),
    startAt,
    endAt,
    allDay: form.allDay,
    priority: form.priority,
  };
}

// ------------------------------------------------------------
// Form field
// ------------------------------------------------------------

function FormField({
  id,
  label,
  required = false,
  optionalLabel,
  error,
  children,
}) {
  return (
    <div
      className={[
        "behar-personal-event__field",
        error
          ? "behar-personal-event__field--error"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <label
        htmlFor={id}
        className="behar-personal-event__label"
      >
        {label}

        {required && (
          <span
            className="behar-personal-event__required"
            aria-hidden="true"
          >
            *
          </span>
        )}

        {!required && optionalLabel && (
          <span className="behar-personal-event__optional">
            {optionalLabel}
          </span>
        )}
      </label>

      {children}

      {error && (
        <span
          id={`${id}-error`}
          className="behar-personal-event__error"
          role="alert"
        >
          <AlertCircle size={13} aria-hidden="true" />
          {error}
        </span>
      )}
    </div>
  );
}

// ------------------------------------------------------------
// Main component
// ------------------------------------------------------------

export default function PersonalEventModal({
  mode: modeProp,
}) {
  const {
    language,
    selectedDateKey,
    selectedEvent,
    eventDraft,
    activeModal,
    createPersonalEvent,
    updatePersonalEvent,
    closeModal,
    actionError,
    validationErrors,
    storageWritable,
  } = useCalendar();

  const isArabic = language === "ar";
  const t = TRANSLATIONS[isArabic ? "ar" : "en"];

  const isEdit =
    modeProp === "edit" ||
    (!modeProp && activeModal === "edit");

  const event = isEdit ? selectedEvent : null;

  const formId = useId();

  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const titleRef = useRef(null);
  const previousFocusRef = useRef(null);

  const initialForm = useMemo(() => {
    const defaultDraft = createPersonalEventDraft(
      selectedDateKey
    );

    return getInitialForm(
      event,
      isEdit ? null : eventDraft || defaultDraft,
      selectedDateKey
    );
  }, [
    event,
    eventDraft,
    isEdit,
    selectedDateKey,
  ]);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);

  const initialSnapshot = useMemo(
    () => JSON.stringify(initialForm),
    [initialForm]
  );

  const isDirty =
    JSON.stringify(form) !== initialSnapshot;

  const typeOptions = useMemo(
    () =>
      getOptions(
        CALENDAR_PERSONAL_TYPE_OPTIONS,
        DEFAULT_TYPES,
        isArabic ? "ar" : "en"
      ),
    [isArabic]
  );

  const priorityOptions = useMemo(
    () =>
      getOptions(
        CALENDAR_PRIORITY_OPTIONS,
        DEFAULT_PRIORITIES,
        isArabic ? "ar" : "en"
      ),
    [isArabic]
  );

  const allowedTypes = typeOptions.map(
    (option) => option.value
  );

  const allowedPriorities = priorityOptions.map(
    (option) => option.value
  );

  // ----------------------------------------------------------
  // Focus and modal lifecycle
  // ----------------------------------------------------------

  useEffect(() => {
    previousFocusRef.current = document.activeElement;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    titleRef.current?.focus();

    const handleKeyDown = (keyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        keyboardEvent.preventDefault();

        if (showDiscard) {
          setShowDiscard(false);
        } else if (isDirty) {
          setShowDiscard(true);
        } else {
          closeModal();
        }
      }

      if (keyboardEvent.key !== "Tab") {
        return;
      }

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [closeModal, isDirty, showDiscard]);

  // ----------------------------------------------------------
  // Form handlers
  // ----------------------------------------------------------

  const updateField = (field, value) => {
    setForm((current) => {
      const next = {
        ...current,
        [field]: value,
      };

      if (
        field === "startDate" &&
        next.endDate < value
      ) {
        next.endDate = value;
      }

      return next;
    });

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setSubmitError("");
  };

  const handleRequestClose = () => {
    if (isSubmitting) return;

    if (isDirty) {
      setShowDiscard(true);
      return;
    }

    closeModal();
  };

  const handleBackdropClick = (clickEvent) => {
    if (
      clickEvent.target === clickEvent.currentTarget
    ) {
      handleRequestClose();
    }
  };

  const handleDiscard = () => {
    setShowDiscard(false);
    closeModal();
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();

    if (isSubmitting || !storageWritable) return;

    const nextErrors = validateForm(
      form,
      allowedTypes,
      allowedPriorities,
      t
    );

    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];

      document
        .getElementById(`${formId}-${firstField}`)
        ?.focus();

      return;
    }

    const payload = buildEventPayload(form);

    if (!payload.startAt || !payload.endAt) {
      setSubmitError(t.saveError);
      return;
    }

    setIsSubmitting(true);

    try {
      let result;

      if (isEdit) {
        if (!event?.id) {
          throw new Error(t.saveError);
        }

        result = await updatePersonalEvent(
          event.id,
          payload
        );
      } else {
        result = await createPersonalEvent(payload);
      }

      if (
        result === false ||
        result?.success === false ||
        result?.ok === false
      ) {
        throw new Error(
          result?.error ||
          result?.message ||
          t.saveError
        );
      }

      closeModal();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : t.saveError
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------

  return (
    <div
      className="behar-personal-event__overlay"
      dir={isArabic ? "rtl" : "ltr"}
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className="behar-personal-event__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-heading`}
      >
        {/* Header */}

        <header className="behar-personal-event__header">
          <div className="behar-personal-event__header-content">
            <div className="behar-personal-event__header-icon">
              {isEdit ? (
                <Save size={21} aria-hidden="true" />
              ) : (
                <CalendarCheck2
                  size={21}
                  aria-hidden="true"
                />
              )}
            </div>

            <div>
              <span className="behar-personal-event__eyebrow">
                {t.personalEvent}
              </span>

              <h2 id={`${formId}-heading`}>
                {isEdit ? t.editTitle : t.createTitle}
              </h2>

              <p>
                {isEdit
                  ? t.editSubtitle
                  : t.createSubtitle}
              </p>
            </div>
          </div>

          <button
            ref={closeRef}
            type="button"
            className="behar-personal-event__close"
            onClick={handleRequestClose}
            aria-label={t.close}
          >
            <X size={19} aria-hidden="true" />
          </button>
        </header>

        {/* Form */}

        <form
          className="behar-personal-event__form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="behar-personal-event__body">
            {!storageWritable && (
              <div
                className="behar-personal-event__alert"
                role="alert"
              >
                <LockKeyhole
                  size={17}
                  aria-hidden="true"
                />
                {t.storageUnavailable}
              </div>
            )}

            {(submitError || actionError) && (
              <div
                className="behar-personal-event__alert"
                role="alert"
              >
                <AlertCircle
                  size={17}
                  aria-hidden="true"
                />

                {submitError ||
                  (typeof actionError === "string"
                    ? actionError
                    : t.saveError)}
              </div>
            )}

            {/* Event type */}

            <FormField
              id={`${formId}-type`}
              label={t.eventType}
              required
              error={errors.type}
            >
              <select
                id={`${formId}-type`}
                value={form.type}
                onChange={(event) =>
                  updateField("type", event.target.value)
                }
                aria-invalid={Boolean(errors.type)}
                className="behar-personal-event__input"
                disabled={isSubmitting}
              >
                {typeOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Title */}

            <FormField
              id={`${formId}-title`}
              label={t.title}
              required
              error={errors.title}
            >
              <div className="behar-personal-event__input-wrap">
                <Type
                  size={16}
                  aria-hidden="true"
                />

                <input
                  ref={titleRef}
                  id={`${formId}-title`}
                  type="text"
                  value={form.title}
                  maxLength={121}
                  placeholder={t.titlePlaceholder}
                  onChange={(event) =>
                    updateField(
                      "title",
                      event.target.value
                    )
                  }
                  aria-invalid={Boolean(errors.title)}
                  aria-describedby={
                    errors.title
                      ? `${formId}-title-error`
                      : undefined
                  }
                  disabled={isSubmitting}
                />
              </div>
            </FormField>

            {/* Description */}

            <FormField
              id={`${formId}-description`}
              label={t.description}
              optionalLabel={t.optional}
              error={errors.description}
            >
              <textarea
                id={`${formId}-description`}
                className="behar-personal-event__textarea"
                value={form.description}
                maxLength={2001}
                rows={4}
                placeholder={t.descriptionPlaceholder}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                aria-invalid={Boolean(
                  errors.description
                )}
                disabled={isSubmitting}
              />

              <span className="behar-personal-event__character-count">
                {form.description.length}/2000
              </span>
            </FormField>

            {/* Schedule */}

            <div className="behar-personal-event__section">
              <div className="behar-personal-event__section-heading">
                <CalendarDays
                  size={17}
                  aria-hidden="true"
                />

                <h3>{t.date}</h3>
              </div>

              <div className="behar-personal-event__field-grid">
                <FormField
                  id={`${formId}-startDate`}
                  label={t.startDate}
                  required
                  error={errors.startDate}
                >
                  <input
                    id={`${formId}-startDate`}
                    type="date"
                    className="behar-personal-event__input"
                    value={form.startDate}
                    onChange={(event) =>
                      updateField(
                        "startDate",
                        event.target.value
                      )
                    }
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField
                  id={`${formId}-endDate`}
                  label={t.endDate}
                  required
                  error={errors.endDate}
                >
                  <input
                    id={`${formId}-endDate`}
                    type="date"
                    className="behar-personal-event__input"
                    min={form.startDate}
                    value={form.endDate}
                    onChange={(event) =>
                      updateField(
                        "endDate",
                        event.target.value
                      )
                    }
                    disabled={isSubmitting}
                  />
                </FormField>
              </div>

              {/* All-day toggle */}

              <label className="behar-personal-event__all-day">
                <span className="behar-personal-event__all-day-content">
                  <strong>{t.allDay}</strong>
                  <small>{t.allDayDescription}</small>
                </span>

                <input
                  type="checkbox"
                  checked={form.allDay}
                  onChange={(event) =>
                    updateField(
                      "allDay",
                      event.target.checked
                    )
                  }
                  disabled={isSubmitting}
                />

                <span
                  className="behar-personal-event__switch"
                  aria-hidden="true"
                />
              </label>

              {/* Time */}

              {!form.allDay && (
                <div className="behar-personal-event__field-grid">
                  <FormField
                    id={`${formId}-startTime`}
                    label={t.startTime}
                    required
                    error={errors.startTime}
                  >
                    <input
                      id={`${formId}-startTime`}
                      type="time"
                      className="behar-personal-event__input"
                      value={form.startTime}
                      onChange={(event) =>
                        updateField(
                          "startTime",
                          event.target.value
                        )
                      }
                      disabled={isSubmitting}
                    />
                  </FormField>

                  <FormField
                    id={`${formId}-endTime`}
                    label={t.endTime}
                    required
                    error={errors.endTime}
                  >
                    <input
                      id={`${formId}-endTime`}
                      type="time"
                      className="behar-personal-event__input"
                      value={form.endTime}
                      onChange={(event) =>
                        updateField(
                          "endTime",
                          event.target.value
                        )
                      }
                      disabled={isSubmitting}
                    />
                  </FormField>
                </div>
              )}

              <div className="behar-personal-event__timezone">
                <Clock3
                  size={13}
                  aria-hidden="true"
                />

                {t.timezone}
              </div>
            </div>

            {/* Priority */}

            <div className="behar-personal-event__section">
              <div className="behar-personal-event__section-heading">
                <Flag
                  size={17}
                  aria-hidden="true"
                />

                <h3>{t.priority}</h3>
              </div>

              <div
                className="behar-personal-event__priority-options"
                role="group"
                aria-label={t.priority}
              >
                {priorityOptions.map((option) => (
                  <label
                    key={option.value}
                    className={[
                      "behar-personal-event__priority",
                      `behar-personal-event__priority--${option.value}`,
                      form.priority === option.value
                        ? "behar-personal-event__priority--selected"
                        : "",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name={`${formId}-priority`}
                      value={option.value}
                      checked={
                        form.priority === option.value
                      }
                      onChange={() =>
                        updateField(
                          "priority",
                          option.value
                        )
                      }
                      disabled={isSubmitting}
                    />

                    <span className="behar-personal-event__priority-dot" />

                    <span>{option.label}</span>

                    {form.priority === option.value && (
                      <Check
                        size={14}
                        aria-hidden="true"
                      />
                    )}
                  </label>
                ))}
              </div>

              {errors.priority && (
                <span
                  className="behar-personal-event__error"
                  role="alert"
                >
                  {errors.priority}
                </span>
              )}
            </div>
          </div>

          {/* Footer */}

          <footer className="behar-personal-event__footer">
            <button
              type="button"
              className="behar-personal-event__cancel"
              onClick={handleRequestClose}
              disabled={isSubmitting}
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              className="behar-personal-event__submit"
              disabled={
                isSubmitting ||
                !storageWritable
              }
            >
              {isSubmitting ? (
                <>
                  <span className="behar-personal-event__spinner" />
                  {t.saving}
                </>
              ) : (
                <>
                  {isEdit ? (
                    <Save
                      size={16}
                      aria-hidden="true"
                    />
                  ) : (
                    <Plus
                      size={16}
                      aria-hidden="true"
                    />
                  )}

                  {isEdit ? t.save : t.create}
                </>
              )}
            </button>
          </footer>
        </form>

        {/* Unsaved changes confirmation */}

        {showDiscard && (
          <div className="behar-personal-event__discard-overlay">
            <div
              className="behar-personal-event__discard-dialog"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby={`${formId}-discard-title`}
              aria-describedby={`${formId}-discard-description`}
            >
              <AlertCircle
                size={27}
                aria-hidden="true"
              />

              <h3 id={`${formId}-discard-title`}>
                {t.unsavedTitle}
              </h3>

              <p id={`${formId}-discard-description`}>
                {t.unsavedMessage}
              </p>

              <div className="behar-personal-event__discard-actions">
                <button
                  type="button"
                  onClick={() =>
                    setShowDiscard(false)
                  }
                >
                  {t.keepEditing}
                </button>

                <button
                  type="button"
                  onClick={handleDiscard}
                >
                  {t.discard}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
