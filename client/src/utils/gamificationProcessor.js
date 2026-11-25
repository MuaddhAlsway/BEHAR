
import {
  GAMIFICATION_BADGES,
  GAMIFICATION_EVENT_TYPES,
  getGamificationText,
} from "../data/student/gamification";

import { awardXP } from "./xpEngine";
import { getLevelForXP } from "./levelEngine";
import {
  getStudentLocalDate,
  calculateCurrentStreak,
  calculateLongestStreak,
} from "./streakEngine";
import {
  getWeekStart,
  rollWeeklyGoal,
} from "./weeklyGoalEngine";

import {
  createXPCelebration,
  createLevelUpCelebration,
  createBadgeCelebration,
} from "./achievementCelebration";

const EVENT_REWARDS = {
  [GAMIFICATION_EVENT_TYPES.LESSON_COMPLETED]: 25,
  [GAMIFICATION_EVENT_TYPES.QUIZ_PASSED]: 50,
  [GAMIFICATION_EVENT_TYPES.QUIZ_PERFECT]: 25,
  [GAMIFICATION_EVENT_TYPES.COURSE_COMPLETED]: 200,
  [GAMIFICATION_EVENT_TYPES.DAILY_LEARNING_ACTIVITY]: 10,
};

const STAT_FIELDS = {
  [GAMIFICATION_EVENT_TYPES.LESSON_COMPLETED]:
    "lessonsCompleted",
  [GAMIFICATION_EVENT_TYPES.QUIZ_PASSED]:
    "quizzesPassed",
  [GAMIFICATION_EVENT_TYPES.QUIZ_PERFECT]:
    "perfectQuizzes",
  [GAMIFICATION_EVENT_TYPES.COURSE_COMPLETED]:
    "coursesCompleted",
};

function getBadgeArray() {
  return Array.isArray(GAMIFICATION_BADGES)
    ? GAMIFICATION_BADGES
    : Object.values(GAMIFICATION_BADGES ?? {});
}

function getBadgeMetric(progress, metric) {
  switch (metric) {
    case "lessons_completed":
      return progress.stats.lessonsCompleted;
    case "courses_completed":
      return progress.stats.coursesCompleted;
    case "quizzes_passed":
      return progress.stats.quizzesPassed;
    case "perfect_quizzes":
      return progress.stats.perfectQuizzes;
    case "current_streak":
    case "streak_days":
      return progress.streak.currentDays;
    case "longest_streak":
      return progress.streak.longestDays;
    case "total_xp":
      return progress.totalXP;
    default:
      return null;
  }
}

function getNewBadges(progress, language) {
  const unlocked = new Set(
    progress.unlockedBadges.map((item) =>
      typeof item === "string"
        ? item
        : item.badgeId
    )
  );

  const newlyUnlocked = [];

  for (const badge of getBadgeArray()) {
    if (!badge?.id || unlocked.has(badge.id)) {
      continue;
    }

    const criteria = badge.criteria ?? {};
    const metric =
      criteria.metric ??
      criteria.type ??
      criteria.key;

    const target =
      criteria.target ??
      criteria.value ??
      criteria.threshold;

    const current = getBadgeMetric(
      progress,
      metric
    );

    if (
      current === null ||
      !Number.isFinite(Number(target)) ||
      Number(target) <= 0 ||
      current < Number(target)
    ) {
      continue;
    }

    newlyUnlocked.push({
      badgeId: badge.id,
      badgeName: getGamificationText(
        badge.title,
        language
      ),
      description: getGamificationText(
        badge.description,
        language
      ),
    });
  }

  return newlyUnlocked;
}

function getEventKey(event, localDate) {
  if (
    event.type ===
    GAMIFICATION_EVENT_TYPES.DAILY_LEARNING_ACTIVITY
  ) {
    return `daily:${localDate}`;
  }

  if (
    typeof event.eventId !== "string" ||
    !event.eventId.trim()
  ) {
    throw new Error(
      "A stable eventId is required."
    );
  }

  return `${event.type}:${event.eventId}`;
}

/**
 * Process one verified learning event.
 *
 * Important:
 * - XP is only awarded once per stable event key.
 * - Duplicate events do not modify progress.
 * - Celebration events are presentation-only.
 *
 * This processor is synchronous and frontend-only.
 */
export function processGamificationEvent(
  previousProgress,
  event,
  { language = "en", now = new Date() } = {}
) {
  if (!previousProgress?.studentId) {
    throw new Error(
      "A valid student progress record is required."
    );
  }

  if (!EVENT_REWARDS[event?.type]) {
    throw new Error(
      "Unsupported gamification event type."
    );
  }

  const timezone =
    previousProgress.timezone ?? "Asia/Riyadh";

  const today = getStudentLocalDate(
    timezone,
    now
  );

  const eventKey = getEventKey(event, today);

  if (
    previousProgress.awardedEventKeys.includes(
      eventKey
    )
  ) {
    return {
      progress: previousProgress,
      celebrations: [],
      duplicate: true,
    };
  }

  const xpAmount = EVENT_REWARDS[event.type];

  const previousLevel = getLevelForXP(
    previousProgress.totalXP
  );

  const nextTotalXP =
    previousProgress.totalXP + xpAmount;

  const nextLevel = getLevelForXP(
    nextTotalXP
  );

  const stats = {
    ...previousProgress.stats,
  };

  const statField = STAT_FIELDS[event.type];

  if (statField) {
    stats[statField] =
      (stats[statField] ?? 0) + 1;
  }

  if (
    Number.isFinite(event.learningMinutes) &&
    event.learningMinutes > 0
  ) {
    stats.learningMinutes +=
      Math.floor(event.learningMinutes);
  }

  const activityDates = [
    ...new Set([
      ...previousProgress.streak.activityDates,
      today,
    ]),
  ].sort();

  const streak = {
    ...previousProgress.streak,
    activityDates,
    currentDays: calculateCurrentStreak(
      activityDates,
      today
    ),
    longestDays: calculateLongestStreak(
      activityDates
    ),
    lastActivityDate: today,
  };

  const weeklyGoal = rollWeeklyGoal(
    previousProgress.weeklyGoal,
    today
  );

  let weeklyIncrement = 0;

  if (
    weeklyGoal.metric === "lessons_completed" &&
    event.type ===
      GAMIFICATION_EVENT_TYPES.LESSON_COMPLETED
  ) {
    weeklyIncrement = 1;
  }

  if (
    weeklyGoal.metric === "quizzes_passed" &&
    event.type ===
      GAMIFICATION_EVENT_TYPES.QUIZ_PASSED
  ) {
    weeklyIncrement = 1;
  }

  if (
    weeklyGoal.metric === "learning_minutes"
  ) {
    weeklyIncrement = Math.max(
      0,
      Math.floor(event.learningMinutes ?? 0)
    );
  }

  const nextProgress = {
    ...previousProgress,
    totalXP: nextTotalXP,
    level: nextLevel.level,
    stats,
    streak,
    weeklyGoal: {
      ...weeklyGoal,
      progress:
        (weeklyGoal.progress ?? 0) +
        weeklyIncrement,
    },
    awardedEventKeys: [
      ...previousProgress.awardedEventKeys,
      eventKey,
    ],
    xpTransactions: [
      ...previousProgress.xpTransactions,
      {
        id: eventKey,
        eventKey,
        eventType: event.type,
        xp: xpAmount,
        awardedAt: now.toISOString(),
      },
    ],
    updatedAt: now.toISOString(),
  };

  const newBadges = getNewBadges(
    nextProgress,
    language
  );

  nextProgress.unlockedBadges = [
    ...previousProgress.unlockedBadges,
    ...newBadges.map((badge) => ({
      badgeId: badge.badgeId,
      unlockedAt: now.toISOString(),
    })),
  ];

  const celebrations = [
    createXPCelebration({
      xp: xpAmount,
      reason: event.type.replaceAll("_", " "),
    }),
  ];

  if (nextLevel.level > previousLevel.level) {
    celebrations.push(
      createLevelUpCelebration({
        level: nextLevel.level,
        levelName: getGamificationText(
          nextLevel.name,
          language
        ),
      })
    );
  }

  for (const badge of newBadges) {
    celebrations.push(
      createBadgeCelebration(badge)
    );
  }

  return {
    progress: nextProgress,
    celebrations,
    duplicate: false,
  };
}
