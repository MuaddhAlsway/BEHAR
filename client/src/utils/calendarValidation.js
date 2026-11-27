
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 05
 *
 * Personal event validation and sanitization.
 *
 * Compatible with:
 * - data/calendar.js
 * - utils/calendarDates.js
 * - utils/calendarStorage.js
 *
 * Features:
 * - Create and update validation
 * - Bilingual errors (English / Arabic)
 * - Riyadh timezone-aware date handling
 * - Strict source/type restrictions
 * - Duration and reminder validation
 * - Event ownership checks
 * - Storage-compatible output
 *
 * No React dependencies.
 * No localStorage access.
 */

import {
  CALENDAR_DEMO_COURSES,
  CALENDAR_EVENT_PRIORITY,
  CALENDAR_EVENT_STATUS,
  CALENDAR_EVENT_TYPES,
  CALENDAR_LIMITS,
  CALENDAR_SOURCES,
  CALENDAR_TIME_ZONE,
  PERSONAL_EVENT_TYPES,
  canEditCalendarEvent,
  canDeleteCalendarEvent,
} from "../data/calendar";

import {
  calendarDateTime,
  getCalendarDateKey,
} from "./calendarDates";

import {
  sanitizeStoredCalendarEvent,
} from "./calendarStorage";

// ------------------------------------------------------------
// Constants
// ------------------------------------------------------------

export const CALENDAR_VALIDATION_MODE = Object.freeze({
  CREATE: "create",
  UPDATE: "update",
});

export const CALENDAR_VALIDATION_CODES = Object.freeze({
  REQUIRED: "required",
  INVALID: "invalid",
  TOO_LONG: "too_long",
  INVALID_DATE: "invalid_date",
  INVALID_RANGE: "invalid_range",
  DURATION_EXCEEDED: "duration_exceeded",
  INVALID_TYPE: "invalid_type",
  INVALID_SOURCE: "invalid_source",
  INVALID_PRIORITY: "invalid_priority",
  INVALID_STATUS: "invalid_status",
  INVALID_REMINDER: "invalid_reminder",
  INVALID_COURSE: "invalid_course",
  INVALID_URL: "invalid_url",
  NOT_EDITABLE: "not_editable",
  NOT_DELETABLE: "not_deletable",
  ID_REQUIRED: "id_required",
  INVALID_MODE: "invalid_mode",
});

export const CALENDAR_VALIDATION_MESSAGES = Object.freeze({
  required: {
    en: "This field is required.",
    ar: "هذا الحقل مطلوب.",
  },
  invalid: {
    en: "Please enter a valid value.",
    ar: "يرجى إدخال قيمة صحيحة.",
  },
  too_long: {
    en: "This field exceeds the allowed length.",
    ar: "هذا الحقل يتجاوز الحد المسموح من الأحرف.",
  },
  invalid_date: {
    en: "Please enter a valid date and time.",
    ar: "يرجى إدخال تاريخ ووقت صحيحين.",
  },
  invalid_range: {
    en: "The end date must be after the start date.",
    ar: "يجب أن يكون تاريخ الانتهاء بعد تاريخ البداية.",
  },
  duration_exceeded: {
    en: "The event cannot exceed 30 days.",
    ar: "لا يمكن أن تتجاوز مدة الفعالية 30 يومًا.",
  },
  invalid_type: {
    en: "Select a supported personal event type.",
    ar: "اختر نوع فعالية شخصية مدعومًا.",
  },
  invalid_source: {
    en: "Only personal events can be managed here.",
    ar: "يمكن إدارة الفعاليات الشخصية فقط من هنا.",
  },
  invalid_priority: {
    en: "Select a valid priority.",
    ar: "اختر أولوية صحيحة.",
  },
  invalid_status: {
    en: "Select a valid event status.",
    ar: "اختر حالة فعالية صحيحة.",
  },
  invalid_reminder: {
    en: "Reminder must be between 0 and 10,080 minutes.",
    ar: "يجب أن يكون التذكير بين 0 و10,080 دقيقة.",
  },
  invalid_course: {
    en: "Select a valid course.",
    ar: "اختر دورة صحيحة.",
  },
  invalid_url: {
    en: "Enter a valid HTTP or HTTPS URL.",
    ar: "أدخل رابطًا صحيحًا يبدأ بـ HTTP أو HTTPS.",
  },
  not_editable: {
    en: "You cannot edit this event.",
    ar: "لا يمكنك تعديل هذه الفعالية.",
  },
  not_deletable: {
    en: "You cannot delete this event.",
    ar: "لا يمكنك حذف هذه الفعالية.",
  },
  id_required: {
    en: "An event ID is required.",
    ar: "معرّف الفعالية مطلوب.",
  },
  invalid_mode: {
    en: "Invalid validation mode.",
    ar: "وضع التحقق غير صحيح.",
  },
});

const VALID_PERSONAL_TYPES = new Set(
  PERSONAL_EVENT_TYPES
);

const VALID_PRIORITIES = new Set(
  Object.values(CALENDAR_EVENT_PRIORITY)
);

const VALID_STATUSES = new Set(
  Object.values(CALENDAR_EVENT_STATUS)
);

const VALID_COURSE_IDS = new Set(
  CALENDAR_DEMO_COURSES.map((course) => course.id)
);

const ISO_WITH_TIMEZONE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const CLOCK_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

const MAX_REMINDER_MINUTES = 10080;
const MAX_ID_LENGTH = 120;

// ------------------------------------------------------------
// Internal helpers
// ------------------------------------------------------------

function isRecord(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function isString(value) {
  return typeof value === "string";
}

function isNonEmptyString(value) {
  return isString(value) && value.trim().length > 0;
}

function cleanString(value) {
  return isString(value) ? value.trim() : "";
}

function cleanOptionalString(value) {
  const result = cleanString(value);
  return result || null;
}

function isBlank(value) {
  return (
    value === null ||
    value === undefined ||
    value === ""
  );
}

function isValidISO(value) {
  if (!isString(value) || !ISO_WITH_TIMEZONE.test(value)) {
    return false;
  }

  return Number.isFinite(Date.parse(value));
}

function normalizeISO(value) {
  return isValidISO(value)
    ? new Date(value).toISOString()
    : null;
}

function normalizeURL(value) {
  if (isBlank(value)) return null;

  if (!isString(value)) return null;

  try {
    const url = new URL(value.trim());

    if (
      url.protocol !== "https:" &&
      url.protocol !== "http:"
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function normalizeReminder(value) {
  if (isBlank(value)) return null;

  if (
    typeof value === "number" &&
    Number.isInteger(value)
  ) {
    return value;
  }

  if (
    isString(value) &&
    /^\d+$/.test(value.trim())
  ) {
    return Number(value.trim());
  }

  return NaN;
}

function makeError(code, field) {
  return {
    code,
    field,
  };
}

function addError(errors, field, code) {
  if (!errors[field]) {
    errors[field] = makeError(code, field);
  }
}

function getLocalizedMessage(code, language) {
  const entry = CALENDAR_VALIDATION_MESSAGES[code];

  return entry?.[language === "ar" ? "ar" : "en"] ??
    CALENDAR_VALIDATION_MESSAGES.invalid.en;
}

function getFormValue(form, key, fallback = undefined) {
  return Object.prototype.hasOwnProperty.call(form, key)
    ? form[key]
    : fallback;
}

function normalizeEventDate(value) {
  if (!isString(value)) return null;

  const input = value.trim();

  if (isValidISO(input)) {
    return new Date(input).toISOString();
  }

  return null;
}

function parseLocalDateTime(dateKey, clockTime) {
  if (
    !isString(dateKey) ||
    !DATE_KEY_PATTERN.test(dateKey) ||
    !isString(clockTime) ||
    !CLOCK_PATTERN.test(clockTime)
  ) {
    return null;
  }

  try {
    // calendarDateTime interprets the date and time
    // in the BEHAR calendar timezone (Asia/Riyadh).
    const result = calendarDateTime(
      dateKey,
      clockTime
    );

    if (Number.isNaN(result.getTime())) return null;

    // Confirm the resulting Riyadh calendar date.
    if (getCalendarDateKey(result) !== dateKey) {
      return null;
    }

    return result.toISOString();
  } catch {
    return null;
  }
}

function normalizeFormDateTime(
  form,
  timestampKey,
  dateKey,
  timeKey,
  allDay,
  isEnd
) {
  const directValue = getFormValue(form, timestampKey);

  if (!isBlank(directValue)) {
    return normalizeEventDate(directValue);
  }

  const dateValue = getFormValue(form, dateKey);
  const timeValue = getFormValue(form, timeKey);

  if (!isString(dateValue)) return null;

  const clock = allDay
    ? "00:00"
    : timeValue;

  const normalized = parseLocalDateTime(
    dateValue,
    clock
  );

  if (!normalized) return null;

  if (allDay && isEnd) {
    // All-day end date is inclusive in the form,
    // but exclusive in the stored event.
    const date = new Date(normalized);
    date.setUTCDate(date.getUTCDate() + 1);

    return date.toISOString();
  }

  return normalized;
}

function normalizePersonalForm(form) {
  const allDay = form.allDay === true;

  return {
    source: getFormValue(
      form,
      "source",
      CALENDAR_SOURCES.PERSONAL
    ),
    type: getFormValue(
      form,
      "type",
      CALENDAR_EVENT_TYPES.STUDY_SESSION
    ),
    title: cleanString(form.title),
    titleAr: cleanString(form.titleAr),
    description: cleanString(form.description),
    descriptionAr: cleanString(form.descriptionAr),
    startAt: normalizeFormDateTime(
      form,
      "startAt",
      "startDate",
      "startTime",
      allDay,
      false
    ),
    endAt: normalizeFormDateTime(
      form,
      "endAt",
      "endDate",
      "endTime",
      allDay,
      true
    ),
    allDay,
    timeZone: CALENDAR_TIME_ZONE,
    status: getFormValue(
      form,
      "status",
      CALENDAR_EVENT_STATUS.SCHEDULED
    ),
    priority: getFormValue(
      form,
      "priority",
      CALENDAR_EVENT_PRIORITY.MEDIUM
    ),
    courseId: cleanOptionalString(form.courseId),
    instructorId: null,
    location: cleanOptionalString(form.location),
    meetingUrl: normalizeURL(form.meetingUrl),
    relatedUrl: null,
    reminderMinutes: normalizeReminder(
      form.reminderMinutes
    ),
    editable: true,
  };
}

// ------------------------------------------------------------
// Error localization
// ------------------------------------------------------------

/**
 * Localize one validation error.
 */
export function getCalendarValidationMessage(
  error,
  language = "en"
) {
  if (!error) return "";

  const code = typeof error === "string"
    ? error
    : error.code;

  return getLocalizedMessage(code, language);
}

/**
 * Convert the error map into localized field messages.
 */
export function localizeCalendarValidationErrors(
  errors,
  language = "en"
) {
  if (!isRecord(errors)) return {};

  return Object.fromEntries(
    Object.entries(errors).map(([field, error]) => [
      field,
      getCalendarValidationMessage(error, language),
    ])
  );
}

// ------------------------------------------------------------
// Permission validation
// ------------------------------------------------------------

/**
 * Validate whether a student may edit an event.
 */
export function validateCalendarEditPermission(event) {
  if (!canEditCalendarEvent(event)) {
    return {
      valid: false,
      error: makeError(
        CALENDAR_VALIDATION_CODES.NOT_EDITABLE,
        "event"
      ),
    };
  }

  return {
    valid: true,
    error: null,
  };
}

/**
 * Validate whether a student may delete an event.
 */
export function validateCalendarDeletePermission(event) {
  if (!canDeleteCalendarEvent(event)) {
    return {
      valid: false,
      error: makeError(
        CALENDAR_VALIDATION_CODES.NOT_DELETABLE,
        "event"
      ),
    };
  }

  return {
    valid: true,
    error: null,
  };
}

// ------------------------------------------------------------
// Main validation
// ------------------------------------------------------------

/**
 * Validate and sanitize a personal event form.
 *
 * Options:
 * {
 *   mode: "create" | "update",
 *   existingEvent: null | calendar event
 * }
 *
 * Returns:
 * {
 *   valid: boolean,
 *   data: object | null,
 *   errors: Record<string, { code, field }>
 * }
 *
 * On create:
 * - ID and timestamps are assigned by CalendarContext.
 *
 * On update:
 * - Existing event ID and createdAt are preserved.
 */
export function validatePersonalCalendarEvent(
  form,
  {
    mode = CALENDAR_VALIDATION_MODE.CREATE,
    existingEvent = null,
  } = {}
) {
  const errors = {};

  if (!isRecord(form)) {
    addError(
      errors,
      "form",
      CALENDAR_VALIDATION_CODES.INVALID
    );

    return {
      valid: false,
      data: null,
      errors,
    };
  }

  if (
    mode !== CALENDAR_VALIDATION_MODE.CREATE &&
    mode !== CALENDAR_VALIDATION_MODE.UPDATE
  ) {
    addError(
      errors,
      "mode",
      CALENDAR_VALIDATION_CODES.INVALID_MODE
    );
  }

  if (mode === CALENDAR_VALIDATION_MODE.UPDATE) {
    const permission = validateCalendarEditPermission(
      existingEvent
    );

    if (!permission.valid) {
      addError(
        errors,
        "event",
        CALENDAR_VALIDATION_CODES.NOT_EDITABLE
      );
    }

    if (
      !isNonEmptyString(existingEvent?.id) ||
      existingEvent.id.length > MAX_ID_LENGTH
    ) {
      addError(
        errors,
        "id",
        CALENDAR_VALIDATION_CODES.ID_REQUIRED
      );
    }
  }

  const data = normalizePersonalForm(form);

  // Source and type
  if (data.source !== CALENDAR_SOURCES.PERSONAL) {
    addError(
      errors,
      "source",
      CALENDAR_VALIDATION_CODES.INVALID_SOURCE
    );
  }

  if (!VALID_PERSONAL_TYPES.has(data.type)) {
    addError(
      errors,
      "type",
      CALENDAR_VALIDATION_CODES.INVALID_TYPE
    );
  }

  // Title
  if (!data.title && !data.titleAr) {
    addError(
      errors,
      "title",
      CALENDAR_VALIDATION_CODES.REQUIRED
    );
  }

  if (
    data.title.length >
    CALENDAR_LIMITS.TITLE_MAX_LENGTH
  ) {
    addError(
      errors,
      "title",
      CALENDAR_VALIDATION_CODES.TOO_LONG
    );
  }

  if (
    data.titleAr.length >
    CALENDAR_LIMITS.TITLE_MAX_LENGTH
  ) {
    addError(
      errors,
      "titleAr",
      CALENDAR_VALIDATION_CODES.TOO_LONG
    );
  }

  // Description
  if (
    data.description.length >
    CALENDAR_LIMITS.DESCRIPTION_MAX_LENGTH
  ) {
    addError(
      errors,
      "description",
      CALENDAR_VALIDATION_CODES.TOO_LONG
    );
  }

  if (
    data.descriptionAr.length >
    CALENDAR_LIMITS.DESCRIPTION_MAX_LENGTH
  ) {
    addError(
      errors,
      "descriptionAr",
      CALENDAR_VALIDATION_CODES.TOO_LONG
    );
  }

  // Dates
  if (!data.startAt) {
    addError(
      errors,
      "startAt",
      CALENDAR_VALIDATION_CODES.INVALID_DATE
    );
  }

  if (!data.endAt) {
    addError(
      errors,
      "endAt",
      CALENDAR_VALIDATION_CODES.INVALID_DATE
    );
  }

  if (data.startAt && data.endAt) {
    const start = Date.parse(data.startAt);
    const end = Date.parse(data.endAt);

    if (end <= start) {
      addError(
        errors,
        "endAt",
        CALENDAR_VALIDATION_CODES.INVALID_RANGE
      );
    } else {
      const maxDuration =
        CALENDAR_LIMITS.MAX_EVENT_DURATION_DAYS *
        24 * 60 * 60 * 1000;

      if (end - start > maxDuration) {
        addError(
          errors,
          "endAt",
          CALENDAR_VALIDATION_CODES.DURATION_EXCEEDED
        );
      }
    }
  }

  // All-day flag
  if (
    form.allDay !== undefined &&
    typeof form.allDay !== "boolean"
  ) {
    addError(
      errors,
      "allDay",
      CALENDAR_VALIDATION_CODES.INVALID
    );
  }

  // Priority and status
  if (!VALID_PRIORITIES.has(data.priority)) {
    addError(
      errors,
      "priority",
      CALENDAR_VALIDATION_CODES.INVALID_PRIORITY
    );
  }

  if (!VALID_STATUSES.has(data.status)) {
    addError(
      errors,
      "status",
      CALENDAR_VALIDATION_CODES.INVALID_STATUS
    );
  }

  // Reminder
  if (
    data.reminderMinutes !== null &&
    (
      !Number.isInteger(data.reminderMinutes) ||
      data.reminderMinutes < 0 ||
      data.reminderMinutes > MAX_REMINDER_MINUTES
    )
  ) {
    addError(
      errors,
      "reminderMinutes",
      CALENDAR_VALIDATION_CODES.INVALID_REMINDER
    );
  }

  // Course
  if (
    data.courseId &&
    !VALID_COURSE_IDS.has(data.courseId)
  ) {
    addError(
      errors,
      "courseId",
      CALENDAR_VALIDATION_CODES.INVALID_COURSE
    );
  }

  // Location
  if (
    data.location &&
    data.location.length >
      CALENDAR_LIMITS.LOCATION_MAX_LENGTH
  ) {
    addError(
      errors,
      "location",
      CALENDAR_VALIDATION_CODES.TOO_LONG
    );
  }

  // URL
  if (
    !isBlank(form.meetingUrl) &&
    !data.meetingUrl
  ) {
    addError(
      errors,
      "meetingUrl",
      CALENDAR_VALIDATION_CODES.INVALID_URL
    );
  }

  if (Object.keys(errors).length > 0) {
    return {
      valid: false,
      data: null,
      errors,
    };
  }

  const now = new Date().toISOString();

  const completeEvent = {
    ...data,
    id:
      mode === CALENDAR_VALIDATION_MODE.UPDATE
        ? existingEvent.id
        : (
            isNonEmptyString(form.id)
              ? form.id.trim()
              : generateCalendarEventId()
          ),
    createdAt:
      mode === CALENDAR_VALIDATION_MODE.UPDATE
        ? existingEvent.createdAt ?? now
        : now,
    updatedAt: now,
  };

  // Final persistence-shape verification.
  const sanitized = sanitizeStoredCalendarEvent(
    completeEvent
  );

  if (!sanitized) {
    return {
      valid: false,
      data: null,
      errors: {
        form: makeError(
          CALENDAR_VALIDATION_CODES.INVALID,
          "form"
        ),
      },
    };
  }

  return {
    valid: true,
    data: sanitized,
    errors: {},
  };
}

// ------------------------------------------------------------
// ID generation
// ------------------------------------------------------------

/**
 * Generate a unique personal event ID.
 *
 * Uses crypto.randomUUID when available.
 * Falls back to a timestamp/random combination.
 */
export function generateCalendarEventId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `personal-${crypto.randomUUID()}`;
  }

  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 12);

  return `personal-${timestamp}-${random}`;
}

// ------------------------------------------------------------
// Convenience APIs
// ------------------------------------------------------------

export function validatePersonalCalendarEventCreate(
  form
) {
  return validatePersonalCalendarEvent(form, {
    mode: CALENDAR_VALIDATION_MODE.CREATE,
  });
}

export function validatePersonalCalendarEventUpdate(
  form,
  existingEvent
) {
  return validatePersonalCalendarEvent(form, {
    mode: CALENDAR_VALIDATION_MODE.UPDATE,
    existingEvent,
  });
}

export function getCalendarFormErrors(
  result,
  language = "en"
) {
  if (!result || result.valid) return {};

  return localizeCalendarValidationErrors(
    result.errors,
    language
  );
}
