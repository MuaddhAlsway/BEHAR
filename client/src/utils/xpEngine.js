
/**
 * BEHAR LMS — P14.5.0.2
 * XP Engine
 *
 * Pure JavaScript functions.
 *
 * Responsibilities:
 * - Validate learning events
 * - Generate deterministic reward keys
 * - Award XP using configured rules
 * - Prevent duplicate rewards
 * - Maintain XP transaction history
 * - Preserve student isolation
 * - Return immutable progress updates
 *
 * No React, localStorage, or network dependencies.
 *
 * Security:
 * Client-side XP is provisional.
 * The future backend must verify learning events
 * and enforce reward uniqueness authoritatively.
 */

import {
  GAMIFICATION_SCHEMA_VERSION,
  GAMIFICATION_EVENT_TYPES,
  GAMIFICATION_REWARD_FREQUENCY,
  GAMIFICATION_XP_RULES,
} from "../data/student/gamification";

/* ==========================================
   01 — INTERNAL HELPERS
========================================== */

function isPlainObject(value) {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return (
    prototype === Object.prototype ||
    prototype === null
  );
}

function isNonEmptyString(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

function isValidCalendarDate(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function isValidTimestamp(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    Number.isFinite(Date.parse(value))
  );
}

function cloneProgress(progress) {
  return {
    ...progress,
    awardedEventKeys: [...progress.awardedEventKeys],
    xpTransactions: progress.xpTransactions.map(
      (transaction) => ({ ...transaction })
    ),
  };
}

/* ==========================================
   02 — EVENT VALIDATION
========================================== */

/**
 * Expected event shape:
 *
 * {
 *   type: "lesson_completed",
 *   studentId: "dev-student-001",
 *   courseId: "course_001",
 *   lessonId: "lesson_002"
 * }
 *
 * Returns the normalized event.
 *
 * Throws when event data is invalid.
 */
export function validateXPEvent(event) {
  if (!isPlainObject(event)) {
    throw new Error("A valid XP event is required.");
  }

  if (!isNonEmptyString(event.type)) {
    throw new Error("XP event type is required.");
  }

  const rule = GAMIFICATION_XP_RULES[event.type];

  if (
    !Object.values(GAMIFICATION_EVENT_TYPES).includes(
      event.type
    ) ||
    !rule
  ) {
    throw new Error(
      `Unsupported XP event type: ${event.type}`
    );
  }

  const normalized = {
    type: event.type,
  };

  for (const field of rule.requires) {
    if (!isNonEmptyString(event[field])) {
      throw new Error(
        `XP event requires a valid "${field}".`
      );
    }

    normalized[field] = event[field].trim();
  }

  if (
    rule.frequency ===
    GAMIFICATION_REWARD_FREQUENCY.ONCE_PER_DAY &&
    !isValidCalendarDate(normalized.activityDate)
  ) {
    throw new Error(
      "XP event requires a valid activityDate in YYYY-MM-DD format."
    );
  }

  return normalized;
}

/* ==========================================
   03 — DETERMINISTIC REWARD KEYS
========================================== */

/**
 * A reward key identifies one eligible reward.
 *
 * Keys are derived from:
 * - Event type
 * - Student identity
 * - Relevant course, lesson, assessment, or date
 *
 * JSON encoding avoids delimiter collisions
 * between user-supplied identifier values.
 */
export function createXPRewardKey(event) {
  const normalized = validateXPEvent(event);
  const rule = GAMIFICATION_XP_RULES[normalized.type];

  return JSON.stringify([
    normalized.type,
    ...rule.requires.map(
      (field) => normalized[field]
    ),
  ]);
}

/* ==========================================
   04 — PROGRESS VALIDATION
========================================== */

export function validateXPProgress(progress) {
  if (!isPlainObject(progress)) {
    throw new Error(
      "A valid gamification progress record is required."
    );
  }

  if (
    progress.schemaVersion !==
    GAMIFICATION_SCHEMA_VERSION
  ) {
    throw new Error(
      "Unsupported gamification schema version."
    );
  }

  if (!isNonEmptyString(progress.studentId)) {
    throw new Error(
      "Gamification progress requires a student ID."
    );
  }

  if (
    !Number.isSafeInteger(progress.totalXP) ||
    progress.totalXP < 0
  ) {
    throw new Error(
      "Gamification progress contains invalid total XP."
    );
  }

  if (
    !Array.isArray(progress.awardedEventKeys) ||
    !progress.awardedEventKeys.every(isNonEmptyString)
  ) {
    throw new Error(
      "Gamification progress contains invalid reward keys."
    );
  }

  if (
    new Set(progress.awardedEventKeys).size !==
    progress.awardedEventKeys.length
  ) {
    throw new Error(
      "Gamification progress contains duplicate reward keys."
    );
  }

  if (
    !Array.isArray(progress.xpTransactions) ||
    !progress.xpTransactions.every(isPlainObject)
  ) {
    throw new Error(
      "Gamification progress contains invalid XP transactions."
    );
  }

  const transactionKeys = new Set();

  let transactionTotal = 0;

  for (const transaction of progress.xpTransactions) {
    if (
      !isNonEmptyString(transaction.rewardKey) ||
      !isNonEmptyString(transaction.eventType) ||
      !isValidTimestamp(transaction.awardedAt) ||
      !Number.isSafeInteger(transaction.xp) ||
      transaction.xp <= 0
    ) {
      throw new Error(
        "Gamification progress contains an invalid XP transaction."
      );
    }

    if (transactionKeys.has(transaction.rewardKey)) {
      throw new Error(
        "Gamification progress contains duplicate XP transactions."
      );
    }

    transactionKeys.add(transaction.rewardKey);

    if (
      !progress.awardedEventKeys.includes(
        transaction.rewardKey
      )
    ) {
      throw new Error(
        "XP transaction has no matching reward key."
      );
    }

    transactionTotal += transaction.xp;

    if (!Number.isSafeInteger(transactionTotal)) {
      throw new Error(
        "Gamification XP transaction total exceeds safe integer limits."
      );
    }
  }

  if (
    transactionKeys.size !==
    progress.awardedEventKeys.length
  ) {
    throw new Error(
      "Reward keys and XP transactions do not match."
    );
  }

  if (transactionTotal !== progress.totalXP) {
    throw new Error(
      "Gamification XP total does not match transaction history."
    );
  }

  return true;
}

/* ==========================================
   05 — DUPLICATE DETECTION
========================================== */

export function hasXPReward(progress, event) {
  validateXPProgress(progress);

  const normalized = validateXPEvent(event);

  if (normalized.studentId !== progress.studentId) {
    throw new Error(
      "XP event does not belong to this student."
    );
  }

  const rewardKey = createXPRewardKey(normalized);

  return progress.awardedEventKeys.includes(
    rewardKey
  );
}

/* ==========================================
   06 — AWARD XP
========================================== */

/**
 * Returns:
 *
 * {
 *   awarded: boolean,
 *   duplicate: boolean,
 *   xpAwarded: number,
 *   rewardKey: string,
 *   transaction: object | null,
 *   progress: object
 * }
 *
 * Duplicate events return zero XP.
 *
 * The original progress record is never mutated.
 */
export function awardXP(
  progress,
  event,
  { awardedAt = new Date().toISOString() } = {}
) {
  validateXPProgress(progress);

  const normalized = validateXPEvent(event);

  if (normalized.studentId !== progress.studentId) {
    throw new Error(
      "XP event does not belong to this student."
    );
  }

  const rewardKey = createXPRewardKey(normalized);

  if (progress.awardedEventKeys.includes(rewardKey)) {
    return {
      awarded: false,
      duplicate: true,
      xpAwarded: 0,
      rewardKey,
      transaction: null,
      progress: cloneProgress(progress),
    };
  }

  if (!isValidTimestamp(awardedAt)) {
    throw new Error(
      "A valid XP award timestamp is required."
    );
  }

  const rule = GAMIFICATION_XP_RULES[normalized.type];

  const nextTotalXP = progress.totalXP + rule.xp;

  if (!Number.isSafeInteger(nextTotalXP)) {
    throw new Error(
      "XP total exceeds safe integer limits."
    );
  }

  const transaction = {
    rewardKey,
    eventType: normalized.type,
    xp: rule.xp,
    awardedAt,
  };

  // Preserve the event identifiers for future
  // audit, reconciliation, and backend migration.
  for (const field of rule.requires) {
    transaction[field] = normalized[field];
  }

  const nextProgress = cloneProgress(progress);

  nextProgress.totalXP = nextTotalXP;
  nextProgress.awardedEventKeys.push(rewardKey);
  nextProgress.xpTransactions.push(transaction);
  nextProgress.updatedAt = awardedAt;

  return {
    awarded: true,
    duplicate: false,
    xpAwarded: rule.xp,
    rewardKey,
    transaction: { ...transaction },
    progress: nextProgress,
  };
}

/* ==========================================
   07 — BATCH PROCESSING
========================================== */

/**
 * Process events in sequence.
 *
 * Atomicity here is in-memory only:
 * if an event throws, the caller receives no
 * partially returned batch result.
 *
 * Persistence is handled in P14.5.0.7.
 */
export function awardXPBatch(
  progress,
  events,
  options = {}
) {
  validateXPProgress(progress);

  if (!Array.isArray(events)) {
    throw new Error(
      "XP events must be an array."
    );
  }

  let currentProgress = progress;

  const results = [];

  for (const event of events) {
    const result = awardXP(
      currentProgress,
      event,
      options
    );

    currentProgress = result.progress;

    results.push({
      awarded: result.awarded,
      duplicate: result.duplicate,
      xpAwarded: result.xpAwarded,
      rewardKey: result.rewardKey,
      transaction: result.transaction,
    });
  }

  return {
    progress: cloneProgress(currentProgress),
    results,
    totalAwardedXP: results.reduce(
      (total, result) => total + result.xpAwarded,
      0
    ),
    awardedCount: results.filter(
      (result) => result.awarded
    ).length,
    duplicateCount: results.filter(
      (result) => result.duplicate
    ).length,
  };
}
