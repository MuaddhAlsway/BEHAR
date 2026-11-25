
/**
 * BEHAR LMS — P14.5.0.5
 * Weekly Learning Goal Engine
 *
 * Pure JavaScript.
 * Monday-start weeks.
 * Student-local calendar dates.
 */

import {
  GAMIFICATION_GOAL_METRICS,
  GAMIFICATION_WEEKLY_GOAL_CONFIG,
} from "../data/student/gamification";

import {
  getStudentLocalDate,
} from "./streakEngine";

export const WEEKLY_GOAL_METRICS =
  GAMIFICATION_GOAL_METRICS;

const METRICS = Object.values(
  GAMIFICATION_GOAL_METRICS
);

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function assertDate(date) {
  if (
    typeof date !== "string" ||
    !DATE_PATTERN.test(date)
  ) {
    throw new Error("Expected YYYY-MM-DD date.");
  }

  const parsed = new Date(`${date}T00:00:00Z`);

  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  ) {
    throw new Error("Invalid calendar date.");
  }
}

function dateToDay(date) {
  assertDate(date);

  return Date.parse(`${date}T00:00:00Z`) / 86400000;
}

function dayToDate(day) {
  return new Date(day * 86400000)
    .toISOString()
    .slice(0, 10);
}

function assertMetric(metric) {
  if (!METRICS.includes(metric)) {
    throw new Error("Unsupported weekly goal metric.");
  }
}

function assertCount(value, name) {
  if (
    !Number.isSafeInteger(value) ||
    value < 0
  ) {
    throw new Error(
      `${name} must be a non-negative integer.`
    );
  }
}

/**
 * Monday is the first day of the week.
 */
export function getWeekStart(date) {
  const dayNumber = dateToDay(date);

  const weekday = new Date(dayNumber * 86400000)
    .getUTCDay();

  const daysSinceMonday = (weekday + 6) % 7;

  return dayToDate(
    dayNumber - daysSinceMonday
  );
}

export function getWeekEnd(date) {
  const start = getWeekStart(date);

  return dayToDate(dateToDay(start) + 6);
}

/**
 * Returns a normalized weekly goal.
 */
export function createWeeklyGoal({
  metric =
    GAMIFICATION_GOAL_METRICS.LESSONS_COMPLETED,
  target =
    GAMIFICATION_WEEKLY_GOAL_CONFIG.defaultTarget,
  weekStartDate,
  progress = 0,
} = {}) {
  assertMetric(metric);
  assertCount(target, "Target");
  assertCount(progress, "Progress");

  if (target === 0) {
    throw new Error(
      "Weekly goal target must be greater than zero."
    );
  }

  if (!weekStartDate) {
    throw new Error("Week start date is required.");
  }

  const start = getWeekStart(weekStartDate);

  return {
    metric,
    target,
    weekStartDate: start,
    progress,
  };
}

/**
 * Update a goal using an absolute total.
 *
 * Absolute totals prevent accidentally adding
 * the same lesson twice when UI rerenders.
 *
 * Verified learning events will provide the
 * authoritative totals in a later phase.
 */
export function updateWeeklyGoalProgress(
  goal,
  nextProgress
) {
  assertCount(nextProgress, "Progress");

  const current = createWeeklyGoal(goal);

  return {
    ...current,
    progress: nextProgress,
  };
}

/**
 * A new week resets progress.
 *
 * The selected metric and target remain.
 */
export function rollWeeklyGoal(
  goal,
  currentDate
) {
  const current = createWeeklyGoal(goal);
  const newWeekStart = getWeekStart(currentDate);

  if (current.weekStartDate === newWeekStart) {
    return { ...current };
  }

  return {
    ...current,
    weekStartDate: newWeekStart,
    progress: 0,
  };
}

/**
 * Calculate the current goal state.
 */
export function getWeeklyGoalSummary(
  goal,
  {
    timezone = "UTC",
    now = new Date(),
  } = {}
) {
  const today = getStudentLocalDate(
    timezone,
    now
  );

  const current = rollWeeklyGoal(goal, today);

  const remaining = Math.max(
    0,
    current.target - current.progress
  );

  const percentage = Math.min(
    100,
    (current.progress / current.target) * 100
  );

  const weekEndDate = getWeekEnd(today);

  return {
    ...current,
    today,
    weekEndDate,
    remaining,
    percentage,
    completed: current.progress >= current.target,
    daysRemaining:
      dateToDay(weekEndDate) - dateToDay(today),
  };
}
