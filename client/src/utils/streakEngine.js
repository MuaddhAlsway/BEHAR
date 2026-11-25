
/**
 * BEHAR LMS — P14.5.0.4
 * Learning Streak Engine
 *
 * Tracks calendar-day learning activity.
 * Uses student-local YYYY-MM-DD dates.
 *
 * Date values must be generated in the
 * student's configured timezone.
 */

import {
  GAMIFICATION_STREAK_CONFIG,
} from "../data/student/gamification";

const DAY_MS = 24 * 60 * 60 * 1000;

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const DEFAULT_MILESTONES =
  GAMIFICATION_STREAK_CONFIG.milestones;

function assertDate(date) {
  if (
    typeof date !== "string" ||
    !DATE_PATTERN.test(date)
  ) {
    throw new Error(
      "Activity date must use YYYY-MM-DD."
    );
  }

  const parsed = new Date(`${date}T00:00:00Z`);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  ) {
    throw new Error("Invalid calendar date.");
  }
}

function toDayNumber(date) {
  assertDate(date);

  return (
    Date.parse(`${date}T00:00:00Z`) / DAY_MS
  );
}

function fromDayNumber(dayNumber) {
  return new Date(dayNumber * DAY_MS)
    .toISOString()
    .slice(0, 10);
}

function normalizeDates(activityDates) {
  if (!Array.isArray(activityDates)) {
    throw new Error(
      "Activity dates must be an array."
    );
  }

  const unique = new Set();

  for (const date of activityDates) {
    assertDate(date);
    unique.add(date);
  }

  return [...unique].sort();
}

/**
 * Returns the current calendar date in the
 * student's configured IANA timezone.
 */
export function getStudentLocalDate(
  timezone = "UTC",
  now = new Date()
) {
  const instant =
    now instanceof Date ? now : new Date(now);

  if (Number.isNaN(instant.getTime())) {
    throw new Error("Invalid current timestamp.");
  }

  const parts = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).formatToParts(instant);

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

/**
 * Counts the longest consecutive run of dates.
 */
export function calculateLongestStreak(
  activityDates
) {
  const dates = normalizeDates(activityDates);

  if (dates.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let index = 1; index < dates.length; index++) {
    const difference =
      toDayNumber(dates[index]) -
      toDayNumber(dates[index - 1]);

    if (difference === 1) {
      current += 1;
    } else {
      current = 1;
    }

    longest = Math.max(longest, current);
  }

  return longest;
}

/**
 * Current streak rules:
 *
 * - Activity today: streak is active.
 * - Last activity yesterday: streak remains
 *   active and can continue today.
 * - Last activity before yesterday: streak = 0.
 *
 * Future dates are rejected to prevent
 * accidentally counting unearned activity.
 */
export function calculateCurrentStreak(
  activityDates,
  today
) {
  assertDate(today);

  const dates = normalizeDates(activityDates);

  if (dates.length === 0) return 0;

  const todayNumber = toDayNumber(today);

  if (
    dates.some(
      (date) => toDayNumber(date) > todayNumber
    )
  ) {
    throw new Error(
      "Activity cannot occur in the future."
    );
  }

  const lastDay = toDayNumber(
    dates[dates.length - 1]
  );

  if (todayNumber - lastDay > 1) {
    return 0;
  }

  let streak = 1;

  for (let index = dates.length - 1; index > 0; index--) {
    const current = toDayNumber(dates[index]);
    const previous = toDayNumber(dates[index - 1]);

    if (current - previous !== 1) break;

    streak += 1;
  }

  return streak;
}

/**
 * Records a day only once.
 *
 * Returns a new array and never mutates
 * the original activity history.
 */
export function recordLearningActivity(
  activityDates,
  activityDate,
  today = activityDate
) {
  assertDate(activityDate);
  assertDate(today);

  if (
    toDayNumber(activityDate) > toDayNumber(today)
  ) {
    throw new Error(
      "Cannot record future learning activity."
    );
  }

  return normalizeDates([
    ...normalizeDates(activityDates),
    activityDate,
  ]);
}

/**
 * Returns the latest seven calendar days,
 * including today.
 */
export function getWeeklyStreakActivity(
  activityDates,
  today
) {
  assertDate(today);

  const dates = normalizeDates(activityDates);
  const activeDays = new Set(dates);

  const todayNumber = toDayNumber(today);

  return Array.from({ length: 7 }, (_, index) => {
    const date = fromDayNumber(
      todayNumber - (6 - index)
    );

    return {
      date,
      active: activeDays.has(date),
      isToday: date === today,
    };
  });
}

/**
 * Returns achieved and upcoming streak
 * milestones.
 */
export function getStreakMilestones(
  longestStreak,
  milestones = DEFAULT_MILESTONES
) {
  if (
    !Number.isSafeInteger(longestStreak) ||
    longestStreak < 0
  ) {
    throw new Error(
      "Longest streak must be a non-negative integer."
    );
  }

  if (
    !Array.isArray(milestones) ||
    milestones.some(
      (value) =>
        !Number.isSafeInteger(value) ||
        value <= 0
    )
  ) {
    throw new Error(
      "Invalid streak milestones."
    );
  }

  const sorted = [...new Set(milestones)].sort(
    (a, b) => a - b
  );

  return {
    achieved: sorted.filter(
      (value) => value <= longestStreak
    ),
    next:
      sorted.find(
        (value) => value > longestStreak
      ) ?? null,
  };
}

/**
 * Creates a display-ready streak summary.
 */
export function getLearningStreakSummary({
  activityDates = [],
  timezone = "UTC",
  now = new Date(),
} = {}) {
  const today = getStudentLocalDate(
    timezone,
    now
  );

  const dates = normalizeDates(activityDates);

  const currentDays = calculateCurrentStreak(
    dates,
    today
  );

  const longestDays = calculateLongestStreak(
    dates
  );

  const weeklyActivity = getWeeklyStreakActivity(
    dates,
    today
  );

  const milestones = getStreakMilestones(
    longestDays
  );

  return {
    today,
    timezone,
    currentDays,
    longestDays,
    lastActivityDate:
      dates[dates.length - 1] ?? null,
    learnedToday: dates.includes(today),
    weeklyActivity,
    milestones,
    totalActiveDays: dates.length,
  };
}
