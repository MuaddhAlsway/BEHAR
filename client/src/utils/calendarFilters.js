
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 03
 *
 * Pure filtering, searching, and sorting utilities.
 *
 * Compatible with:
 * - data/calendar.js
 * - utils/calendarDates.js
 *
 * All date ranges use [start, end) semantics.
 * All timestamps represent real instants.
 *
 * No React dependencies.
 * No localStorage access.
 * No mutations of input arrays or events.
 */

import {
  CALENDAR_DEMO_COURSES,
  CALENDAR_EVENT_STATUS,
  CALENDAR_EVENT_TYPES,
  CALENDAR_FILTERS,
  CALENDAR_SOURCES,
  getCalendarCourseById,
} from "../data/calendar";

import {
  calendarEventOverlapsRange,
  endOfCalendarDay,
  getCalendarDateKey,
  startOfCalendarDay,
} from "./calendarDates";

// ------------------------------------------------------------
// Constants
// ------------------------------------------------------------

export const CALENDAR_SORT = Object.freeze({
  START_ASC: "start_asc",
  START_DESC: "start_desc",
  TITLE_ASC: "title_asc",
  TITLE_DESC: "title_desc",
  TYPE_ASC: "type_asc",
  PRIORITY_DESC: "priority_desc",
});

export const CALENDAR_SEARCH_LIMIT = 200;

const VALID_SOURCES = new Set(
  Object.values(CALENDAR_SOURCES)
);

const VALID_TYPES = new Set(
  Object.values(CALENDAR_EVENT_TYPES)
);

const VALID_STATUSES = new Set(
  Object.values(CALENDAR_EVENT_STATUS)
);

const VALID_FILTERS = new Set(
  Object.values(CALENDAR_FILTERS)
);

const VALID_SORTS = new Set(
  Object.values(CALENDAR_SORT)
);

const PRIORITY_WEIGHT = Object.freeze({
  high: 3,
  medium: 2,
  low: 1,
});

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

function normalizeText(value) {
  if (typeof value !== "string") return "";

  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/\u0640/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSearch(value) {
  return normalizeText(value)
    .slice(0, CALENDAR_SEARCH_LIMIT);
}

function normalizeStringArray(value) {
  if (value == null) return null;

  const input = Array.isArray(value)
    ? value
    : [value];

  const items = input
    .filter(isNonEmptyString)
    .map((item) => item.trim());

  return items.length > 0
    ? new Set(items)
    : null;
}

function parseTimestamp(value) {
  if (
    typeof value !== "string" &&
    !(value instanceof Date)
  ) {
    return null;
  }

  const date = new Date(value);
  const timestamp = date.getTime();

  return Number.isFinite(timestamp)
    ? timestamp
    : null;
}

function normalizeFilter(value) {
  return VALID_FILTERS.has(value)
    ? value
    : CALENDAR_FILTERS.ALL;
}

function normalizeSort(value) {
  return VALID_SORTS.has(value)
    ? value
    : CALENDAR_SORT.START_ASC;
}

function normalizeRangeBoundary(value, boundary) {
  if (value == null || value === "") return null;

  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return boundary === "end"
      ? endOfCalendarDay(value)
      : startOfCalendarDay(value);
  }

  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    throw new RangeError(
      `Invalid calendar ${boundary} range`
    );
  }

  return date;
}

function getCourseSearchText(courseId) {
  if (!isNonEmptyString(courseId)) return "";

  const course = getCalendarCourseById(courseId);

  if (!course) return "";

  return [
    course.title,
    course.titleAr,
    course.instructorName,
    course.instructorNameAr,
    course.slug,
  ]
    .filter(isNonEmptyString)
    .join(" ");
}

function getEventSearchText(event) {
  return normalizeText(
    [
      event.title,
      event.titleAr,
      event.description,
      event.descriptionAr,
      event.location,
      event.courseId,
      event.instructorId,
      getCourseSearchText(event.courseId),
    ]
      .filter(isNonEmptyString)
      .join(" ")
  );
}

function getLocalizedTitle(event, language) {
  if (language === "ar") {
    return event.titleAr || event.title || "";
  }

  return event.title || event.titleAr || "";
}

function compareText(a, b, language) {
  const locale = language === "ar" ? "ar" : "en";

  return String(a).localeCompare(
    String(b),
    locale,
    { sensitivity: "base", numeric: true }
  );
}

function getEventPriorityWeight(event) {
  return PRIORITY_WEIGHT[event.priority] ?? 0;
}

function matchesPresetFilter(event, filter) {
  switch (filter) {
    case CALENDAR_FILTERS.ACADEMIC:
      return event.source === CALENDAR_SOURCES.ACADEMIC;

    case CALENDAR_FILTERS.PERSONAL:
      return event.source === CALENDAR_SOURCES.PERSONAL;

    case CALENDAR_FILTERS.LIVE_SESSIONS:
      return event.type ===
        CALENDAR_EVENT_TYPES.LIVE_SESSION;

    case CALENDAR_FILTERS.ASSIGNMENTS:
      return event.type ===
        CALENDAR_EVENT_TYPES.ASSIGNMENT;

    case CALENDAR_FILTERS.ASSESSMENTS:
      return (
        event.type === CALENDAR_EVENT_TYPES.QUIZ ||
        event.type === CALENDAR_EVENT_TYPES.EXAM
      );

    case CALENDAR_FILTERS.ALL:
    default:
      return true;
  }
}

// ------------------------------------------------------------
// Event integrity
// ------------------------------------------------------------

/**
 * Validate the minimum event shape required by the
 * calendar UI.
 *
 * Invalid events are excluded from filtering and sorting.
 *
 * Note:
 * This is display validation, not a security boundary.
 * CalendarContext must separately enforce ownership
 * and edit permissions.
 */
export function isValidCalendarEvent(event) {
  if (!isRecord(event)) return false;

  if (!isNonEmptyString(event.id)) return false;
  if (!VALID_SOURCES.has(event.source)) return false;
  if (!VALID_TYPES.has(event.type)) return false;
  if (!VALID_STATUSES.has(event.status)) return false;

  if (
    !isNonEmptyString(event.title) &&
    !isNonEmptyString(event.titleAr)
  ) {
    return false;
  }

  const start = parseTimestamp(event.startAt);
  const end = parseTimestamp(event.endAt);

  if (start === null || end === null) return false;

  if (end <= start) return false;

  return true;
}

/**
 * Remove invalid calendar events without mutating input.
 */
export function getValidCalendarEvents(events) {
  if (!Array.isArray(events)) return [];

  return events.filter(isValidCalendarEvent);
}

// ------------------------------------------------------------
// Search
// ------------------------------------------------------------

export function calendarEventMatchesSearch(
  event,
  search
) {
  if (!isValidCalendarEvent(event)) return false;

  const query = normalizeSearch(search);

  if (!query) return true;

  return getEventSearchText(event).includes(query);
}

// ------------------------------------------------------------
// Date-range filtering
// ------------------------------------------------------------

/**
 * Filter events overlapping a date/time range.
 *
 * Date-only start: beginning of that Riyadh day.
 * Date-only end: exclusive end of that Riyadh day.
 *
 * Example:
 * getCalendarEventsByDateRange(
 *   events,
 *   "2026-12-01",
 *   "2026-12-07"
 * )
 *
 * Includes all events through December 7.
 */
export function getCalendarEventsByDateRange(
  events,
  start,
  end
) {
  const rangeStart = normalizeRangeBoundary(
    start,
    "start"
  );

  const rangeEnd = normalizeRangeBoundary(
    end,
    "end"
  );

  if (
    rangeStart &&
    rangeEnd &&
    rangeEnd.getTime() <= rangeStart.getTime()
  ) {
    return [];
  }

  return getValidCalendarEvents(events).filter(
    (event) => {
      if (!rangeStart && !rangeEnd) return true;

      const eventStart = parseTimestamp(event.startAt);
      const eventEnd = parseTimestamp(event.endAt);

      if (rangeStart && eventEnd <= rangeStart.getTime()) {
        return false;
      }

      if (rangeEnd && eventStart >= rangeEnd.getTime()) {
        return false;
      }

      return true;
    }
  );
}

/**
 * Return events occurring on a selected Riyadh date.
 */
export function getCalendarEventsForDay(
  events,
  date
) {
  const dateKey = getCalendarDateKey(date);

  return getValidCalendarEvents(events)
    .filter((event) =>
      calendarEventOverlapsRange(
        event,
        startOfCalendarDay(dateKey),
        endOfCalendarDay(dateKey)
      )
    )
    .sort(compareCalendarEventsByStart);
}

// ------------------------------------------------------------
// Sorting
// ------------------------------------------------------------

export function compareCalendarEventsByStart(a, b) {
  const aStart = parseTimestamp(a?.startAt);
  const bStart = parseTimestamp(b?.startAt);

  if (aStart === null && bStart === null) return 0;
  if (aStart === null) return 1;
  if (bStart === null) return -1;

  const startDifference = aStart - bStart;

  if (startDifference !== 0) return startDifference;

  return compareText(a?.id ?? "", b?.id ?? "", "en");
}

/**
 * Sort valid events using a supported sort mode.
 */
export function sortCalendarEvents(
  events,
  {
    sort = CALENDAR_SORT.START_ASC,
    language = "en",
  } = {}
) {
  const mode = normalizeSort(sort);

  const result = getValidCalendarEvents(events);

  result.sort((a, b) => {
    let comparison = 0;

    switch (mode) {
      case CALENDAR_SORT.START_DESC:
        comparison =
          parseTimestamp(b.startAt) -
          parseTimestamp(a.startAt);
        break;

      case CALENDAR_SORT.TITLE_ASC:
        comparison = compareText(
          getLocalizedTitle(a, language),
          getLocalizedTitle(b, language),
          language
        );
        break;

      case CALENDAR_SORT.TITLE_DESC:
        comparison = compareText(
          getLocalizedTitle(b, language),
          getLocalizedTitle(a, language),
          language
        );
        break;

      case CALENDAR_SORT.TYPE_ASC:
        comparison = compareText(
          a.type,
          b.type,
          language
        );
        break;

      case CALENDAR_SORT.PRIORITY_DESC:
        comparison =
          getEventPriorityWeight(b) -
          getEventPriorityWeight(a);
        break;

      case CALENDAR_SORT.START_ASC:
      default:
        comparison =
          parseTimestamp(a.startAt) -
          parseTimestamp(b.startAt);
    }

    return comparison ||
      compareCalendarEventsByStart(a, b);
  });

  return result;
}

// ------------------------------------------------------------
// Combined filtering
// ------------------------------------------------------------

/**
 * Main filtering API.
 *
 * Options:
 * {
 *   filter: "all",
 *   sources: null | string | string[],
 *   types: null | string | string[],
 *   courseIds: null | string | string[],
 *   statuses: null | string | string[],
 *   search: "",
 *   rangeStart: null | Date | ISO | YYYY-MM-DD,
 *   rangeEnd: null | Date | ISO | YYYY-MM-DD,
 *   sort: "start_asc",
 *   language: "en"
 * }
 *
 * All supplied filters are combined using AND.
 */
export function getVisibleCalendarEvents(
  events,
  {
    filter = CALENDAR_FILTERS.ALL,
    sources = null,
    types = null,
    courseIds = null,
    statuses = null,
    search = "",
    rangeStart = null,
    rangeEnd = null,
    sort = CALENDAR_SORT.START_ASC,
    language = "en",
  } = {}
) {
  const selectedFilter = normalizeFilter(filter);

  const sourceSet = normalizeStringArray(sources);
  const typeSet = normalizeStringArray(types);
  const courseSet = normalizeStringArray(courseIds);
  const statusSet = normalizeStringArray(statuses);

  const query = normalizeSearch(search);

  const start = normalizeRangeBoundary(
    rangeStart,
    "start"
  );

  const end = normalizeRangeBoundary(
    rangeEnd,
    "end"
  );

  if (
    start &&
    end &&
    end.getTime() <= start.getTime()
  ) {
    return [];
  }

  const filtered = getValidCalendarEvents(events)
    .filter((event) => {
      if (!matchesPresetFilter(event, selectedFilter)) {
        return false;
      }

      if (sourceSet && !sourceSet.has(event.source)) {
        return false;
      }

      if (typeSet && !typeSet.has(event.type)) {
        return false;
      }

      if (
        courseSet &&
        !courseSet.has(event.courseId)
      ) {
        return false;
      }

      if (
        statusSet &&
        !statusSet.has(event.status)
      ) {
        return false;
      }

      if (
        query &&
        !getEventSearchText(event).includes(query)
      ) {
        return false;
      }

      const eventStart = parseTimestamp(event.startAt);
      const eventEnd = parseTimestamp(event.endAt);

      if (start && eventEnd <= start.getTime()) {
        return false;
      }

      if (end && eventStart >= end.getTime()) {
        return false;
      }

      return true;
    });

  return sortCalendarEvents(filtered, {
    sort,
    language,
  });
}

// ------------------------------------------------------------
// Filter summaries
// ------------------------------------------------------------

/**
 * Return counts for the preset filter tabs.
 *
 * Counts are calculated from valid events.
 * Additional course/search/date filters are not applied.
 */
export function getCalendarFilterCounts(events) {
  const validEvents = getValidCalendarEvents(events);

  return Object.fromEntries(
    Object.values(CALENDAR_FILTERS).map(
      (filter) => [
        filter,
        validEvents.filter((event) =>
          matchesPresetFilter(event, filter)
        ).length,
      ]
    )
  );
}

/**
 * Return the distinct courses represented by events.
 *
 * Academic and course-linked personal events are supported.
 */
export function getCalendarAvailableCourses(events) {
  const courseIds = new Set(
    getValidCalendarEvents(events)
      .map((event) => event.courseId)
      .filter(isNonEmptyString)
  );

  return CALENDAR_DEMO_COURSES.filter(
    (course) => courseIds.has(course.id)
  );
}

/**
 * Return all distinct valid event types in the data.
 */
export function getCalendarAvailableTypes(events) {
  return [
    ...new Set(
      getValidCalendarEvents(events)
        .map((event) => event.type)
    ),
  ];
}

/**
 * Return true when at least one user-facing
 * filter is currently active.
 */
export function hasActiveCalendarFilters({
  filter = CALENDAR_FILTERS.ALL,
  sources = null,
  types = null,
  courseIds = null,
  statuses = null,
  search = "",
  rangeStart = null,
  rangeEnd = null,
} = {}) {
  return (
    normalizeFilter(filter) !== CALENDAR_FILTERS.ALL ||
    normalizeStringArray(sources) !== null ||
    normalizeStringArray(types) !== null ||
    normalizeStringArray(courseIds) !== null ||
    normalizeStringArray(statuses) !== null ||
    normalizeSearch(search).length > 0 ||
    rangeStart != null ||
    rangeEnd != null
  );
}
