
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 04
 *
 * Versioned localStorage persistence for personal events.
 *
 * Features:
 * - Personal-event-only persistence
 * - Safe JSON parsing
 * - Schema validation and sanitization
 * - Duplicate ID protection
 * - Legacy payload migration
 * - Malformed-data recovery
 * - Storage failure handling
 *
 * Academic events are never stored here.
 */

import {
  CALENDAR_EVENT_PRIORITY,
  CALENDAR_EVENT_STATUS,
  CALENDAR_LIMITS,
  CALENDAR_SOURCES,
  CALENDAR_TIME_ZONE,
  PERSONAL_EVENT_TYPES,
} from "../data/calendar";

// ------------------------------------------------------------
// Constants
// ------------------------------------------------------------

export const CALENDAR_STORAGE_VERSION = 1;

export const CALENDAR_STORAGE_KEY =
  "behar:student-calendar:v1";

export const CALENDAR_LEGACY_STORAGE_KEYS = Object.freeze([
  "behar:student-calendar",
  "behar:calendar:personal-events",
]);

export const CALENDAR_STORAGE_STATUS = Object.freeze({
  OK: "ok",
  EMPTY: "empty",
  RECOVERED: "recovered",
  UNAVAILABLE: "unavailable",
  ERROR: "error",
  UNSUPPORTED_VERSION: "unsupported_version",
});

const MAX_STORAGE_BYTES = 2 * 1024 * 1024;

const VALID_PERSONAL_TYPES = new Set(
  PERSONAL_EVENT_TYPES
);

const VALID_STATUSES = new Set(
  Object.values(CALENDAR_EVENT_STATUS)
);

const VALID_PRIORITIES = new Set(
  Object.values(CALENDAR_EVENT_PRIORITY)
);

const ISO_WITH_TIMEZONE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

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

function isNonEmptyString(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

function safeString(value, maxLength = 2000) {
  if (typeof value !== "string") return "";

  return value.trim().slice(0, maxLength);
}

function optionalString(value, maxLength = 500) {
  const result = safeString(value, maxLength);
  return result || null;
}

function parseISOInstant(value) {
  if (
    typeof value !== "string" ||
    !ISO_WITH_TIMEZONE.test(value)
  ) {
    return null;
  }

  const timestamp = Date.parse(value);

  return Number.isFinite(timestamp)
    ? timestamp
    : null;
}

function normalizeISO(value) {
  const timestamp = parseISOInstant(value);

  return timestamp === null
    ? null
    : new Date(timestamp).toISOString();
}

function normalizeUrl(value) {
  if (!isNonEmptyString(value)) return null;

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

function isValidReminder(value) {
  return (
    value === null ||
    (
      Number.isInteger(value) &&
      value >= 0 &&
      value <= 10080
    )
  );
}

function getStorage(storageOverride) {
  if (storageOverride !== undefined) {
    return storageOverride;
  }

  try {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage;
  } catch {
    return null;
  }
}

function makeResult(status, events = [], extra = {}) {
  return {
    status,
    events,
    ...extra,
  };
}

function makePayload(events) {
  return {
    version: CALENDAR_STORAGE_VERSION,
    updatedAt: new Date().toISOString(),
    events,
  };
}

function estimateBytes(value) {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(value).length;
  }

  return value.length * 2;
}

function readRaw(storage, key) {
  try {
    return {
      ok: true,
      value: storage.getItem(key),
    };
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
}

function writeRaw(storage, key, value) {
  try {
    storage.setItem(key, value);

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
}

function removeRaw(storage, key) {
  try {
    storage.removeItem(key);

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
}

// ------------------------------------------------------------
// Event sanitization
// ------------------------------------------------------------

/**
 * Sanitize one personal calendar event.
 *
 * Returns null when the event cannot be accepted.
 *
 * This is a persistence integrity check,
 * not an authorization boundary.
 */
export function sanitizeStoredCalendarEvent(event) {
  if (!isRecord(event)) return null;

  if (event.source !== CALENDAR_SOURCES.PERSONAL) {
    return null;
  }

  if (!VALID_PERSONAL_TYPES.has(event.type)) {
    return null;
  }

  const id = safeString(event.id, 120);

  const title = safeString(
    event.title,
    CALENDAR_LIMITS.TITLE_MAX_LENGTH
  );

  const titleAr = safeString(
    event.titleAr,
    CALENDAR_LIMITS.TITLE_MAX_LENGTH
  );

  if (!id || (!title && !titleAr)) {
    return null;
  }

  const start = parseISOInstant(event.startAt);
  const end = parseISOInstant(event.endAt);

  if (
    start === null ||
    end === null ||
    end <= start
  ) {
    return null;
  }

  const maxDuration =
    CALENDAR_LIMITS.MAX_EVENT_DURATION_DAYS *
    24 * 60 * 60 * 1000;

  if (end - start > maxDuration) {
    return null;
  }

  const status = VALID_STATUSES.has(event.status)
    ? event.status
    : CALENDAR_EVENT_STATUS.SCHEDULED;

  const priority = VALID_PRIORITIES.has(event.priority)
    ? event.priority
    : CALENDAR_EVENT_PRIORITY.MEDIUM;

  const reminderMinutes = isValidReminder(
    event.reminderMinutes ?? null
  )
    ? event.reminderMinutes ?? null
    : null;

  return {
    id,
    source: CALENDAR_SOURCES.PERSONAL,
    type: event.type,
    title,
    titleAr,
    description: safeString(
      event.description,
      CALENDAR_LIMITS.DESCRIPTION_MAX_LENGTH
    ),
    descriptionAr: safeString(
      event.descriptionAr,
      CALENDAR_LIMITS.DESCRIPTION_MAX_LENGTH
    ),
    startAt: new Date(start).toISOString(),
    endAt: new Date(end).toISOString(),
    allDay: event.allDay === true,
    timeZone: CALENDAR_TIME_ZONE,
    status,
    priority,
    courseId: optionalString(event.courseId, 120),
    instructorId: null,
    location: optionalString(
      event.location,
      CALENDAR_LIMITS.LOCATION_MAX_LENGTH
    ),
    meetingUrl: normalizeUrl(event.meetingUrl),
    relatedUrl: null,
    reminderMinutes,
    editable: true,
    createdAt: normalizeISO(event.createdAt),
    updatedAt: normalizeISO(event.updatedAt),
  };
}

/**
 * Sanitize an event array.
 *
 * Invalid records and academic records are dropped.
 * Duplicate IDs keep the first valid occurrence.
 */
export function sanitizeStoredCalendarEvents(events) {
  if (!Array.isArray(events)) {
    return {
      events: [],
      rejected: 0,
    };
  }

  const sanitized = [];
  const seenIds = new Set();

  let rejected = 0;

  for (const event of events) {
    const clean = sanitizeStoredCalendarEvent(event);

    if (!clean || seenIds.has(clean.id)) {
      rejected += 1;
      continue;
    }

    if (
      sanitized.length >=
      CALENDAR_LIMITS.MAX_PERSONAL_EVENTS
    ) {
      rejected += 1;
      continue;
    }

    seenIds.add(clean.id);
    sanitized.push(clean);
  }

  return {
    events: sanitized,
    rejected,
  };
}

// ------------------------------------------------------------
// Safe payload parsing
// ------------------------------------------------------------

function parsePayload(raw) {
  if (typeof raw !== "string") {
    return {
      ok: false,
      reason: "not_string",
    };
  }

  if (estimateBytes(raw) > MAX_STORAGE_BYTES) {
    return {
      ok: false,
      reason: "payload_too_large",
    };
  }

  try {
    return {
      ok: true,
      value: JSON.parse(raw),
    };
  } catch {
    return {
      ok: false,
      reason: "invalid_json",
    };
  }
}

/**
 * Supported legacy formats:
 *
 * 1. Plain event array
 * 2. { events: [...] }
 * 3. { version: 0, events: [...] }
 *
 * Future versions are never downgraded.
 */
export function migrateCalendarStoragePayload(value) {
  if (Array.isArray(value)) {
    return {
      ok: true,
      migrated: true,
      events: value,
    };
  }

  if (!isRecord(value)) {
    return {
      ok: false,
      reason: "invalid_payload",
    };
  }

  if (
    typeof value.version === "number" &&
    value.version > CALENDAR_STORAGE_VERSION
  ) {
    return {
      ok: false,
      reason: "unsupported_version",
    };
  }

  if (
    value.version === CALENDAR_STORAGE_VERSION &&
    Array.isArray(value.events)
  ) {
    return {
      ok: true,
      migrated: false,
      events: value.events,
    };
  }

  if (
    (value.version === undefined ||
      value.version === 0) &&
    Array.isArray(value.events)
  ) {
    return {
      ok: true,
      migrated: true,
      events: value.events,
    };
  }

  return {
    ok: false,
    reason: "invalid_payload",
  };
}

// ------------------------------------------------------------
// Load personal calendar events
// ------------------------------------------------------------

export function loadPersonalCalendarEvents(
  storageOverride
) {
  const storage = getStorage(storageOverride);

  if (!storage) {
    return makeResult(
      CALENDAR_STORAGE_STATUS.UNAVAILABLE
    );
  }

  const currentRead = readRaw(
    storage,
    CALENDAR_STORAGE_KEY
  );

  if (!currentRead.ok) {
    return makeResult(
      CALENDAR_STORAGE_STATUS.ERROR,
      [],
      {
        reason: "read_failed",
        error: currentRead.error,
      }
    );
  }

  let raw = currentRead.value;
  let sourceKey = CALENDAR_STORAGE_KEY;

  if (raw === null) {
    for (const legacyKey of CALENDAR_LEGACY_STORAGE_KEYS) {
      const legacyRead = readRaw(storage, legacyKey);

      if (!legacyRead.ok) {
        return makeResult(
          CALENDAR_STORAGE_STATUS.ERROR,
          [],
          {
            reason: "legacy_read_failed",
            error: legacyRead.error,
          }
        );
      }

      if (legacyRead.value !== null) {
        raw = legacyRead.value;
        sourceKey = legacyKey;
        break;
      }
    }
  }

  if (raw === null) {
    return makeResult(
      CALENDAR_STORAGE_STATUS.EMPTY
    );
  }

  const parsed = parsePayload(raw);

  if (!parsed.ok) {
    return makeResult(
      CALENDAR_STORAGE_STATUS.RECOVERED,
      [],
      {
        reason: parsed.reason,
        rejected: 0,
      }
    );
  }

  const migration = migrateCalendarStoragePayload(
    parsed.value
  );

  if (!migration.ok) {
    const status =
      migration.reason === "unsupported_version"
        ? CALENDAR_STORAGE_STATUS.UNSUPPORTED_VERSION
        : CALENDAR_STORAGE_STATUS.RECOVERED;

    return makeResult(status, [], {
      reason: migration.reason,
      rejected: 0,
    });
  }

  const sanitized = sanitizeStoredCalendarEvents(
    migration.events
  );

  const needsRewrite =
    migration.migrated ||
    sourceKey !== CALENDAR_STORAGE_KEY ||
    sanitized.rejected > 0;

  if (needsRewrite) {
    const saved = savePersonalCalendarEvents(
      sanitized.events,
      storage
    );

    if (saved.status !== CALENDAR_STORAGE_STATUS.OK) {
      return makeResult(
        CALENDAR_STORAGE_STATUS.ERROR,
        sanitized.events,
        {
          reason: "migration_write_failed",
          error: saved.error,
          rejected: sanitized.rejected,
          migrated: migration.migrated,
        }
      );
    }

    if (sourceKey !== CALENDAR_STORAGE_KEY) {
      removeRaw(storage, sourceKey);
    }
  }

  return makeResult(
    needsRewrite
      ? CALENDAR_STORAGE_STATUS.RECOVERED
      : CALENDAR_STORAGE_STATUS.OK,
    sanitized.events,
    {
      rejected: sanitized.rejected,
      migrated: migration.migrated,
    }
  );
}

// ------------------------------------------------------------
// Save personal calendar events
// ------------------------------------------------------------

/**
 * Save personal events as one versioned payload.
 *
 * Invalid input is rejected rather than silently
 * replacing existing storage with incomplete data.
 */
export function savePersonalCalendarEvents(
  events,
  storageOverride
) {
  const storage = getStorage(storageOverride);

  if (!storage) {
    return {
      status: CALENDAR_STORAGE_STATUS.UNAVAILABLE,
      saved: 0,
    };
  }

  if (!Array.isArray(events)) {
    return {
      status: CALENDAR_STORAGE_STATUS.ERROR,
      saved: 0,
      reason: "invalid_input",
    };
  }

  const sanitized = sanitizeStoredCalendarEvents(
    events
  );

  if (sanitized.rejected > 0) {
    return {
      status: CALENDAR_STORAGE_STATUS.ERROR,
      saved: 0,
      rejected: sanitized.rejected,
      reason: "invalid_events",
    };
  }

  const payload = makePayload(sanitized.events);
  const serialized = JSON.stringify(payload);

  if (estimateBytes(serialized) > MAX_STORAGE_BYTES) {
    return {
      status: CALENDAR_STORAGE_STATUS.ERROR,
      saved: 0,
      reason: "storage_limit_exceeded",
    };
  }

  const result = writeRaw(
    storage,
    CALENDAR_STORAGE_KEY,
    serialized
  );

  if (!result.ok) {
    return {
      status: CALENDAR_STORAGE_STATUS.ERROR,
      saved: 0,
      reason: "write_failed",
      error: result.error,
    };
  }

  return {
    status: CALENDAR_STORAGE_STATUS.OK,
    saved: sanitized.events.length,
    rejected: 0,
  };
}

// ------------------------------------------------------------
// Clear personal calendar events
// ------------------------------------------------------------

export function clearPersonalCalendarEvents(
  storageOverride
) {
  const storage = getStorage(storageOverride);

  if (!storage) {
    return {
      status: CALENDAR_STORAGE_STATUS.UNAVAILABLE,
    };
  }

  const keys = [
    CALENDAR_STORAGE_KEY,
    ...CALENDAR_LEGACY_STORAGE_KEYS,
  ];

  for (const key of keys) {
    const result = removeRaw(storage, key);

    if (!result.ok) {
      return {
        status: CALENDAR_STORAGE_STATUS.ERROR,
        reason: "clear_failed",
        error: result.error,
      };
    }
  }

  return {
    status: CALENDAR_STORAGE_STATUS.OK,
  };
}

// ------------------------------------------------------------
// Storage information
// ------------------------------------------------------------

export function getCalendarStorageInfo(
  storageOverride
) {
  const storage = getStorage(storageOverride);

  if (!storage) {
    return {
      available: false,
      version: CALENDAR_STORAGE_VERSION,
      key: CALENDAR_STORAGE_KEY,
    };
  }

  const result = readRaw(
    storage,
    CALENDAR_STORAGE_KEY
  );

  return {
    available: result.ok,
    version: CALENDAR_STORAGE_VERSION,
    key: CALENDAR_STORAGE_KEY,
    hasData: result.ok && result.value !== null,
    bytes:
      result.ok && result.value
        ? estimateBytes(result.value)
        : 0,
  };
}
