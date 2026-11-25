
/**
 * BEHAR LMS — P14.5.0.7
 * Achievement Celebration Event Utilities
 *
 * These functions create presentation events only.
 * They never award XP or unlock badges.
 */

export const CELEBRATION_TYPES = Object.freeze({
  LEVEL_UP: "level_up",
  BADGE_UNLOCKED: "badge_unlocked",
  XP_EARNED: "xp_earned",
});

const VALID_TYPES = new Set(
  Object.values(CELEBRATION_TYPES)
);

let eventCounter = 0;

function createEventId() {
  eventCounter += 1;
  return `celebration-${Date.now()}-${eventCounter}`;
}

function assertPositiveInteger(value, name) {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new Error(
      `${name} must be a positive integer.`
    );
  }
}

export function createLevelUpCelebration({
  level,
  levelName = "",
  xp = 0,
}) {
  assertPositiveInteger(level, "Level");

  if (
    !Number.isSafeInteger(xp) ||
    xp < 0
  ) {
    throw new Error("XP cannot be negative.");
  }

  return {
    id: createEventId(),
    type: CELEBRATION_TYPES.LEVEL_UP,
    level,
    levelName,
    xp,
  };
}

export function createBadgeCelebration({
  badgeId,
  badgeName = "",
  description = "",
}) {
  if (
    typeof badgeId !== "string" ||
    !badgeId.trim()
  ) {
    throw new Error("A badge ID is required.");
  }

  return {
    id: createEventId(),
    type: CELEBRATION_TYPES.BADGE_UNLOCKED,
    badgeId,
    badgeName,
    description,
  };
}

export function createXPCelebration({
  xp,
  reason = "",
}) {
  assertPositiveInteger(xp, "XP");

  return {
    id: createEventId(),
    type: CELEBRATION_TYPES.XP_EARNED,
    xp,
    reason,
  };
}

export function isCelebrationEvent(event) {
  return Boolean(
    event &&
    typeof event === "object" &&
    typeof event.id === "string" &&
    event.id.length > 0 &&
    VALID_TYPES.has(event.type)
  );
}

export function enqueueCelebration(queue, event) {
  if (!isCelebrationEvent(event)) {
    throw new Error("Invalid celebration event.");
  }

  const current = Array.isArray(queue)
    ? queue
    : [];

  if (current.some((item) => item.id === event.id)) {
    return current;
  }

  return [...current, event];
}

export function dequeueCelebration(queue) {
  if (!Array.isArray(queue) || queue.length === 0) {
    return {
      event: null,
      remaining: [],
    };
  }

  return {
    event: queue[0],
    remaining: queue.slice(1),
  };
}
