
/**
 * BEHAR LMS — Student Calendar
 * P14.14 / Component 06
 *
 * Calendar state management.
 *
 * Features:
 * - Academic read-only events
 * - Personal event CRUD
 * - localStorage persistence
 * - Validation and permissions
 * - Month / week / day navigation
 * - Search, filters and sorting
 * - Event selection and modal state
 * - Bilingual calendar support
 *
 * Frontend-only implementation.
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  CALENDAR_FILTERS,
  CALENDAR_SOURCES,
  CALENDAR_VIEWS,
  createAcademicDemoEvents,
  createPersonalEventDraft,
} from "../data/calendar";

import {
  getCalendarDateKey,
  getTodayCalendarKey,
  navigateCalendarDate,
  getCalendarMonthGrid,
  getCalendarWeekDays,
  getCalendarEventsInRange,
  getUpcomingCalendarEvents,
  startOfCalendarDay,
  endOfCalendarDay,
} from "../utils/calendarDates";

import {
  CALENDAR_SORT,
  getVisibleCalendarEvents,
  getCalendarFilterCounts,
  getCalendarAvailableCourses,
  getCalendarAvailableTypes,
  hasActiveCalendarFilters,
} from "../utils/calendarFilters";

import {
  CALENDAR_STORAGE_STATUS,
  loadPersonalCalendarEvents,
  savePersonalCalendarEvents,
} from "../utils/calendarStorage";

import {
  validatePersonalCalendarEventCreate,
  validatePersonalCalendarEventUpdate,
  validateCalendarDeletePermission,
} from "../utils/calendarValidation";

// ------------------------------------------------------------
// Context
// ------------------------------------------------------------

export const CalendarContext = createContext(null);

// ------------------------------------------------------------
// Constants
// ------------------------------------------------------------

export const CALENDAR_MODAL = Object.freeze({
  NONE: null,
  DETAILS: "details",
  CREATE: "create",
  EDIT: "edit",
  DELETE: "delete",
});

const DEFAULT_FILTERS = Object.freeze({
  filter: CALENDAR_FILTERS.ALL,
  sources: null,
  types: null,
  courseIds: null,
  statuses: null,
  search: "",
  sort: CALENDAR_SORT.START_ASC,
});

const VALID_VIEWS = new Set(
  Object.values(CALENDAR_VIEWS)
);

const VALID_MODALS = new Set(
  Object.values(CALENDAR_MODAL)
);

const VALID_SORTS = new Set(
  Object.values(CALENDAR_SORT)
);

const VALID_PRESET_FILTERS = new Set(
  Object.values(CALENDAR_FILTERS)
);

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function isValidDate(value) {
  return (
    value instanceof Date &&
    Number.isFinite(value.getTime())
  );
}

function normalizeDate(value) {
  if (isValidDate(value)) {
    return new Date(value.getTime());
  }

  if (typeof value === "string") {
    try {
      return startOfCalendarDay(
        getCalendarDateKey(value)
      );
    } catch {
      return new Date();
    }
  }

  return new Date();
}

function normalizeLanguage(value) {
  return value === "ar" ? "ar" : "en";
}

function normalizeView(value) {
  return VALID_VIEWS.has(value)
    ? value
    : CALENDAR_VIEWS.MONTH;
}

function normalizeArrayFilter(value) {
  if (value == null) return null;

  const values = Array.isArray(value)
    ? value
    : [value];

  const unique = [
    ...new Set(
      values.filter(
        (item) =>
          typeof item === "string" &&
          item.trim().length > 0
      )
    ),
  ];

  return unique.length > 0 ? unique : null;
}

function makeActionResult(
  success,
  extra = {}
) {
  return {
    success,
    ...extra,
  };
}

function makeStorageError(result) {
  return {
    code: result.reason || result.status,
    status: result.status,
    message:
      "Unable to save calendar changes. Please try again.",
    messageAr:
      "تعذر حفظ تغييرات التقويم. يرجى المحاولة مرة أخرى.",
  };
}

function makeNotFoundError() {
  return {
    code: "event_not_found",
    message: "Calendar event not found.",
    messageAr: "لم يتم العثور على الفعالية.",
  };
}

function makeLimitError() {
  return {
    code: "event_limit_exceeded",
    message: "The personal calendar event limit has been reached.",
    messageAr:
      "تم الوصول إلى الحد الأقصى للفعاليات الشخصية.",
  };
}

function makeReadOnlyError() {
  return {
    code: "calendar_read_only",
    message:
      "Calendar storage is unavailable or requires recovery.",
    messageAr:
      "تخزين التقويم غير متاح أو يحتاج إلى استعادة.",
  };
}

function isStorageWritable(status) {
  return (
    status === CALENDAR_STORAGE_STATUS.OK ||
    status === CALENDAR_STORAGE_STATUS.EMPTY
  );
}

/**
 * Load initial state once.
 *
 * Avoid writing to localStorage during rendering.
 */
function initializePersonalCalendar() {
  const result = loadPersonalCalendarEvents();

  return {
    events: result.events ?? [],
    storageStatus: result.status,
    storageIssue:
      result.status === CALENDAR_STORAGE_STATUS.OK ||
      result.status === CALENDAR_STORAGE_STATUS.EMPTY
        ? null
        : {
            code: result.reason || result.status,
            status: result.status,
          },
  };
}

// ------------------------------------------------------------
// Provider
// ------------------------------------------------------------

export function CalendarProvider({
  children,
  initialLanguage = "en",
  initialView = CALENDAR_VIEWS.MONTH,
  initialDate = null,
  academicEvents: suppliedAcademicEvents,
}) {
  // ----------------------------------------------------------
  // Calendar navigation
  // ----------------------------------------------------------

  const [selectedDate, setSelectedDate] = useState(
    () => normalizeDate(initialDate)
  );

  const [view, setView] = useState(
    () => normalizeView(initialView)
  );

  const [language, setLanguage] = useState(
    () => normalizeLanguage(initialLanguage)
  );

  // ----------------------------------------------------------
  // Academic events
  // ----------------------------------------------------------

  const [academicEvents, setAcademicEvents] = useState(
    () =>
      Array.isArray(suppliedAcademicEvents)
        ? suppliedAcademicEvents.filter(
            (event) =>
              event?.source ===
              CALENDAR_SOURCES.ACADEMIC
          )
        : createAcademicDemoEvents()
  );

  // ----------------------------------------------------------
  // Personal events and storage
  // ----------------------------------------------------------

  const [initialPersonalState] = useState(
    initializePersonalCalendar
  );

  const [personalEvents, setPersonalEvents] = useState(
    initialPersonalState.events
  );

  const [storageStatus, setStorageStatus] = useState(
    initialPersonalState.storageStatus
  );

  const [storageIssue, setStorageIssue] = useState(
    initialPersonalState.storageIssue
  );

  // ----------------------------------------------------------
  // Filters
  // ----------------------------------------------------------

  const [filters, setFilters] = useState(
    () => ({ ...DEFAULT_FILTERS })
  );

  // ----------------------------------------------------------
  // Modals
  // ----------------------------------------------------------

  const [activeModal, setActiveModal] = useState(
    CALENDAR_MODAL.NONE
  );

  const [selectedEventId, setSelectedEventId] =
    useState(null);

  const [eventDraft, setEventDraft] = useState(null);

  // ----------------------------------------------------------
  // Operation feedback
  // ----------------------------------------------------------

  const [actionError, setActionError] = useState(null);
  const [validationErrors, setValidationErrors] =
    useState({});

  // ----------------------------------------------------------
  // Derived event data
  // ----------------------------------------------------------

  const events = useMemo(
    () => [...academicEvents, ...personalEvents],
    [academicEvents, personalEvents]
  );

  const selectedEvent = useMemo(
    () =>
      events.find(
        (event) => event.id === selectedEventId
      ) ?? null,
    [events, selectedEventId]
  );

  const selectedDateKey = useMemo(
    () => getCalendarDateKey(selectedDate),
    [selectedDate]
  );

  const todayKey = getTodayCalendarKey();

  const monthDays = useMemo(
    () => getCalendarMonthGrid(selectedDate),
    [selectedDate]
  );

  const weekDays = useMemo(
    () => getCalendarWeekDays(selectedDate),
    [selectedDate]
  );

  const filteredEvents = useMemo(
    () =>
      getVisibleCalendarEvents(events, {
        ...filters,
        language,
      }),
    [events, filters, language]
  );

  const filterCounts = useMemo(
    () => getCalendarFilterCounts(events),
    [events]
  );

  const availableCourses = useMemo(
    () => getCalendarAvailableCourses(events),
    [events]
  );

  const availableTypes = useMemo(
    () => getCalendarAvailableTypes(events),
    [events]
  );

  const filtersActive = useMemo(
    () => hasActiveCalendarFilters(filters),
    [filters]
  );

  const selectedDayEvents = useMemo(
    () => {
      const start = startOfCalendarDay(
        selectedDateKey
      );

      const end = endOfCalendarDay(
        selectedDateKey
      );

      return getCalendarEventsInRange(
        filteredEvents,
        start,
        end
      );
    },
    [filteredEvents, selectedDateKey]
  );

  const upcomingEvents = useMemo(
    () =>
      getUpcomingCalendarEvents(filteredEvents, {
        now: new Date(),
        limit: 8,
        includeInProgress: true,
      }),
    [filteredEvents]
  );

  // ----------------------------------------------------------
  // Navigation actions
  // ----------------------------------------------------------

  const changeView = useCallback((nextView) => {
    if (!VALID_VIEWS.has(nextView)) return false;

    setView(nextView);
    return true;
  }, []);

  const goToDate = useCallback((date) => {
    setSelectedDate(normalizeDate(date));
  }, []);

  const goToToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  const goToPrevious = useCallback(() => {
    setSelectedDate((current) =>
      navigateCalendarDate(current, view, -1)
    );
  }, [view]);

  const goToNext = useCallback(() => {
    setSelectedDate((current) =>
      navigateCalendarDate(current, view, 1)
    );
  }, [view]);

  const setCalendarLanguage = useCallback(
    (nextLanguage) => {
      setLanguage(normalizeLanguage(nextLanguage));
    },
    []
  );

  // ----------------------------------------------------------
  // Filter actions
  // ----------------------------------------------------------

  const updateFilters = useCallback((updates) => {
    if (
      !updates ||
      typeof updates !== "object" ||
      Array.isArray(updates)
    ) {
      return;
    }

    setFilters((current) => {
      const next = { ...current };

      if ("filter" in updates) {
        next.filter = VALID_PRESET_FILTERS.has(
          updates.filter
        )
          ? updates.filter
          : CALENDAR_FILTERS.ALL;
      }

      if ("sources" in updates) {
        next.sources = normalizeArrayFilter(
          updates.sources
        );
      }

      if ("types" in updates) {
        next.types = normalizeArrayFilter(
          updates.types
        );
      }

      if ("courseIds" in updates) {
        next.courseIds = normalizeArrayFilter(
          updates.courseIds
        );
      }

      if ("statuses" in updates) {
        next.statuses = normalizeArrayFilter(
          updates.statuses
        );
      }

      if ("search" in updates) {
        next.search =
          typeof updates.search === "string"
            ? updates.search.slice(0, 200)
            : "";
      }

      if ("sort" in updates) {
        next.sort = VALID_SORTS.has(updates.sort)
          ? updates.sort
          : CALENDAR_SORT.START_ASC;
      }

      return next;
    });
  }, []);

  const setCalendarSearch = useCallback(
    (search) => {
      updateFilters({ search });
    },
    [updateFilters]
  );

  const clearFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
  }, []);

  // ----------------------------------------------------------
  // Modal actions
  // ----------------------------------------------------------

  const closeModal = useCallback(() => {
    setActiveModal(CALENDAR_MODAL.NONE);
    setSelectedEventId(null);
    setEventDraft(null);
    setActionError(null);
    setValidationErrors({});
  }, []);

  const openEventDetails = useCallback(
    (eventOrId) => {
      const id =
        typeof eventOrId === "string"
          ? eventOrId
          : eventOrId?.id;

      const event = events.find(
        (item) => item.id === id
      );

      if (!event) {
        setActionError(makeNotFoundError());
        return false;
      }

      setSelectedEventId(event.id);
      setEventDraft(null);
      setValidationErrors({});
      setActionError(null);
      setActiveModal(CALENDAR_MODAL.DETAILS);

      return true;
    },
    [events]
  );

  const openCreateEvent = useCallback(
    (date = null) => {
      const draft = createPersonalEventDraft();

      if (date) {
        const dateKey = getCalendarDateKey(date);

        setSelectedDate(normalizeDate(date));

        setEventDraft({
          ...draft,
          startDate: dateKey,
          endDate: dateKey,
        });
      } else {
        setEventDraft(draft);
      }

      setSelectedEventId(null);
      setValidationErrors({});
      setActionError(null);
      setActiveModal(CALENDAR_MODAL.CREATE);

      return true;
    },
    []
  );

  const openEditEvent = useCallback(
    (eventOrId) => {
      const id =
        typeof eventOrId === "string"
          ? eventOrId
          : eventOrId?.id;

      const event = personalEvents.find(
        (item) => item.id === id
      );

      if (!event) {
        setActionError(makeNotFoundError());
        return false;
      }

      setSelectedEventId(event.id);
      setEventDraft({ ...event });
      setValidationErrors({});
      setActionError(null);
      setActiveModal(CALENDAR_MODAL.EDIT);

      return true;
    },
    [personalEvents]
  );

  const openDeleteEvent = useCallback(
    (eventOrId) => {
      const id =
        typeof eventOrId === "string"
          ? eventOrId
          : eventOrId?.id;

      const event = personalEvents.find(
        (item) => item.id === id
      );

      if (!event) {
        setActionError(makeNotFoundError());
        return false;
      }

      const permission =
        validateCalendarDeletePermission(event);

      if (!permission.valid) {
        setActionError(permission.error);
        return false;
      }

      setSelectedEventId(event.id);
      setEventDraft(null);
      setValidationErrors({});
      setActionError(null);
      setActiveModal(CALENDAR_MODAL.DELETE);

      return true;
    },
    [personalEvents]
  );

  // ----------------------------------------------------------
  // Personal event persistence
  // ----------------------------------------------------------

  const persistPersonalEvents = useCallback(
    (nextEvents) => {
      if (!isStorageWritable(storageStatus)) {
        const error = makeReadOnlyError();
        setActionError(error);

        return makeActionResult(false, {
          error,
        });
      }

      const result = savePersonalCalendarEvents(
        nextEvents
      );

      if (
        result.status !== CALENDAR_STORAGE_STATUS.OK
      ) {
        const error = makeStorageError(result);

        setActionError(error);
        setStorageIssue({
          code: result.reason || result.status,
          status: result.status,
        });

        return makeActionResult(false, {
          error,
        });
      }

      setPersonalEvents(nextEvents);
      setStorageStatus(result.status);
      setStorageIssue(null);
      setActionError(null);

      return makeActionResult(true);
    },
    [storageStatus]
  );

  // ----------------------------------------------------------
  // Create event
  // ----------------------------------------------------------

  const createPersonalEvent = useCallback(
    (form) => {
      setValidationErrors({});
      setActionError(null);

      const validation =
        validatePersonalCalendarEventCreate(form);

      if (!validation.valid) {
        setValidationErrors(validation.errors);

        return makeActionResult(false, {
          errors: validation.errors,
        });
      }

      const exists = events.some(
        (event) => event.id === validation.data.id
      );

      if (exists) {
        const error = {
          code: "duplicate_event_id",
          message: "This event ID already exists.",
          messageAr: "معرّف الفعالية موجود مسبقًا.",
        };

        setActionError(error);

        return makeActionResult(false, {
          error,
        });
      }

      const nextEvents = [
        ...personalEvents,
        validation.data,
      ];

      const result = persistPersonalEvents(nextEvents);

      if (!result.success) return result;

      closeModal();

      return makeActionResult(true, {
        event: validation.data,
      });
    },
    [
      events,
      personalEvents,
      persistPersonalEvents,
      closeModal,
    ]
  );

  // ----------------------------------------------------------
  // Update event
  // ----------------------------------------------------------

  const updatePersonalEvent = useCallback(
    (eventId, form) => {
      setValidationErrors({});
      setActionError(null);

      const existingEvent = personalEvents.find(
        (event) => event.id === eventId
      );

      if (!existingEvent) {
        const error = makeNotFoundError();
        setActionError(error);

        return makeActionResult(false, {
          error,
        });
      }

      const validation =
        validatePersonalCalendarEventUpdate(
          form,
          existingEvent
        );

      if (!validation.valid) {
        setValidationErrors(validation.errors);

        return makeActionResult(false, {
          errors: validation.errors,
        });
      }

      const nextEvents = personalEvents.map(
        (event) =>
          event.id === eventId
            ? validation.data
            : event
      );

      const result = persistPersonalEvents(nextEvents);

      if (!result.success) return result;

      closeModal();

      return makeActionResult(true, {
        event: validation.data,
      });
    },
    [
      personalEvents,
      persistPersonalEvents,
      closeModal,
    ]
  );

  // ----------------------------------------------------------
  // Delete event
  // ----------------------------------------------------------

  const deletePersonalEvent = useCallback(
    (eventId) => {
      setActionError(null);

      const existingEvent = personalEvents.find(
        (event) => event.id === eventId
      );

      if (!existingEvent) {
        const error = makeNotFoundError();
        setActionError(error);

        return makeActionResult(false, {
          error,
        });
      }

      const permission =
        validateCalendarDeletePermission(
          existingEvent
        );

      if (!permission.valid) {
        setActionError(permission.error);

        return makeActionResult(false, {
          error: permission.error,
        });
      }

      const nextEvents = personalEvents.filter(
        (event) => event.id !== eventId
      );

      const result = persistPersonalEvents(nextEvents);

      if (!result.success) return result;

      closeModal();

      return makeActionResult(true, {
        deletedId: eventId,
      });
    },
    [
      personalEvents,
      persistPersonalEvents,
      closeModal,
    ]
  );

  // ----------------------------------------------------------
  // Academic event replacement
  // ----------------------------------------------------------

  /**
   * Used later when academic events come from REST APIs.
   *
   * Only academic-source events are accepted.
   */
  const replaceAcademicEvents = useCallback(
    (nextEvents) => {
      if (!Array.isArray(nextEvents)) return false;

      setAcademicEvents(
        nextEvents.filter(
          (event) =>
            event?.source ===
            CALENDAR_SOURCES.ACADEMIC
        )
      );

      return true;
    },
    []
  );

  // ----------------------------------------------------------
  // Query helpers
  // ----------------------------------------------------------

  const getEventById = useCallback(
    (eventId) =>
      events.find(
        (event) => event.id === eventId
      ) ?? null,
    [events]
  );

  const getEventsForDate = useCallback(
    (date) => {
      const key = getCalendarDateKey(date);

      return getCalendarEventsInRange(
        filteredEvents,
        startOfCalendarDay(key),
        endOfCalendarDay(key)
      );
    },
    [filteredEvents]
  );

  // ----------------------------------------------------------
  // Context value
  // ----------------------------------------------------------

  const value = useMemo(
    () => ({
      // Language
      language,
      setCalendarLanguage,

      // Calendar navigation
      selectedDate,
      selectedDateKey,
      todayKey,
      view,
      changeView,
      goToDate,
      goToToday,
      goToPrevious,
      goToNext,

      // Calendar structure
      monthDays,
      weekDays,

      // Events
      events,
      academicEvents,
      personalEvents,
      filteredEvents,
      selectedDayEvents,
      upcomingEvents,
      selectedEvent,

      // Filters
      filters,
      filterCounts,
      availableCourses,
      availableTypes,
      filtersActive,
      updateFilters,
      setCalendarSearch,
      clearFilters,

      // CRUD
      createPersonalEvent,
      updatePersonalEvent,
      deletePersonalEvent,
      replaceAcademicEvents,

      // Queries
      getEventById,
      getEventsForDate,

      // Modal state
      activeModal,
      selectedEventId,
      eventDraft,
      openEventDetails,
      openCreateEvent,
      openEditEvent,
      openDeleteEvent,
      closeModal,

      // Errors
      actionError,
      validationErrors,
      storageStatus,
      storageIssue,
      storageWritable:
        isStorageWritable(storageStatus),
    }),
    [
      language,
      setCalendarLanguage,
      selectedDate,
      selectedDateKey,
      todayKey,
      view,
      changeView,
      goToDate,
      goToToday,
      goToPrevious,
      goToNext,
      monthDays,
      weekDays,
      events,
      academicEvents,
      personalEvents,
      filteredEvents,
      selectedDayEvents,
      upcomingEvents,
      selectedEvent,
      filters,
      filterCounts,
      availableCourses,
      availableTypes,
      filtersActive,
      updateFilters,
      setCalendarSearch,
      clearFilters,
      createPersonalEvent,
      updatePersonalEvent,
      deletePersonalEvent,
      replaceAcademicEvents,
      getEventById,
      getEventsForDate,
      activeModal,
      selectedEventId,
      eventDraft,
      openEventDetails,
      openCreateEvent,
      openEditEvent,
      openDeleteEvent,
      closeModal,
      actionError,
      validationErrors,
      storageStatus,
      storageIssue,
    ]
  );

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

// ------------------------------------------------------------
// Hook
// ------------------------------------------------------------

/**
 * Temporary hook export.
 *
 * Component 07 will provide the dedicated
 * hooks/useCalendar.js module.
 */
export function useCalendarContext() {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error(
      "useCalendarContext must be used inside CalendarProvider."
    );
  }

  return context;
}

export default CalendarProvider;
