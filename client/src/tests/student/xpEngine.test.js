
/**
 * BEHAR LMS — P14.5.0.2
 * XP Engine Tests
 */

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  GAMIFICATION_EVENT_TYPES,
  createEmptyGamificationProgress,
} from "../../data/student/gamification";

import {
  validateXPEvent,
  createXPRewardKey,
  validateXPProgress,
  hasXPReward,
  awardXP,
  awardXPBatch,
} from "../../utils/xpEngine";

/* ==========================================
   TEST FIXTURES
========================================== */

const STUDENT_ID = "dev-student-001";

const TIMESTAMP = "2026-11-25T07:00:00.000Z";

const createProgress = () =>
  createEmptyGamificationProgress({
    studentId: STUDENT_ID,
    timezone: "Asia/Riyadh",
  });

const lessonEvent = {
  type: GAMIFICATION_EVENT_TYPES.LESSON_COMPLETED,
  studentId: STUDENT_ID,
  courseId: "course_001",
  lessonId: "lesson_002",
};

const quizPassedEvent = {
  type: GAMIFICATION_EVENT_TYPES.QUIZ_PASSED,
  studentId: STUDENT_ID,
  assessmentId: "react-basics-quiz",
};

const quizPerfectEvent = {
  type: GAMIFICATION_EVENT_TYPES.QUIZ_PERFECT,
  studentId: STUDENT_ID,
  assessmentId: "react-basics-quiz",
};

const courseEvent = {
  type: GAMIFICATION_EVENT_TYPES.COURSE_COMPLETED,
  studentId: STUDENT_ID,
  courseId: "course_001",
};

const dailyEvent = {
  type:
    GAMIFICATION_EVENT_TYPES.DAILY_LEARNING_ACTIVITY,
  studentId: STUDENT_ID,
  activityDate: "2026-11-25",
};

const options = {
  awardedAt: TIMESTAMP,
};

/* ==========================================
   01 — EVENT VALIDATION
========================================== */

describe("XP event validation", () => {
  it("accepts a valid lesson event", () => {
    expect(validateXPEvent(lessonEvent)).toEqual(
      lessonEvent
    );
  });

  it("accepts a valid quiz event", () => {
    expect(
      validateXPEvent(quizPassedEvent).type
    ).toBe(GAMIFICATION_EVENT_TYPES.QUIZ_PASSED);
  });

  it("rejects missing events", () => {
    expect(() =>
      validateXPEvent(null)
    ).toThrow(/valid XP event/i);
  });

  it("rejects unsupported event types", () => {
    expect(() =>
      validateXPEvent({
        type: "unknown_event",
        studentId: STUDENT_ID,
      })
    ).toThrow(/unsupported XP event type/i);
  });

  it("rejects missing required identifiers", () => {
    expect(() =>
      validateXPEvent({
        type:
          GAMIFICATION_EVENT_TYPES.LESSON_COMPLETED,
        studentId: STUDENT_ID,
        courseId: "course_001",
      })
    ).toThrow(/lessonId/i);
  });

  it("trims required identifiers", () => {
    const normalized = validateXPEvent({
      ...lessonEvent,
      courseId: "  course_001  ",
    });

    expect(normalized.courseId).toBe("course_001");
  });

  it("rejects invalid calendar dates", () => {
    expect(() =>
      validateXPEvent({
        ...dailyEvent,
        activityDate: "2026-02-30",
      })
    ).toThrow(/valid activityDate/i);
  });

  it("accepts leap-year dates", () => {
    const event = validateXPEvent({
      ...dailyEvent,
      activityDate: "2028-02-29",
    });

    expect(event.activityDate).toBe("2028-02-29");
  });
});

/* ==========================================
   02 — REWARD KEYS
========================================== */

describe("Deterministic reward keys", () => {
  it("generates the same key for the same event", () => {
    expect(
      createXPRewardKey(lessonEvent)
    ).toBe(createXPRewardKey(lessonEvent));
  });

  it("generates different keys for different lessons", () => {
    const secondLesson = {
      ...lessonEvent,
      lessonId: "lesson_003",
    };

    expect(
      createXPRewardKey(lessonEvent)
    ).not.toBe(createXPRewardKey(secondLesson));
  });

  it("separates identical lesson IDs across courses", () => {
    const anotherCourse = {
      ...lessonEvent,
      courseId: "course_002",
    };

    expect(
      createXPRewardKey(lessonEvent)
    ).not.toBe(createXPRewardKey(anotherCourse));
  });

  it("separates rewards by student", () => {
    const anotherStudent = {
      ...lessonEvent,
      studentId: "student-002",
    };

    expect(
      createXPRewardKey(lessonEvent)
    ).not.toBe(createXPRewardKey(anotherStudent));
  });

  it("separates quiz passed and perfect bonuses", () => {
    expect(
      createXPRewardKey(quizPassedEvent)
    ).not.toBe(createXPRewardKey(quizPerfectEvent));
  });

  it("separates daily rewards by date", () => {
    const tomorrow = {
      ...dailyEvent,
      activityDate: "2026-11-26",
    };

    expect(
      createXPRewardKey(dailyEvent)
    ).not.toBe(createXPRewardKey(tomorrow));
  });

  it("avoids delimiter collisions", () => {
    const first = {
      ...lessonEvent,
      courseId: "course:a",
      lessonId: "lesson:b",
    };

    const second = {
      ...lessonEvent,
      courseId: "course",
      lessonId: "a:lesson:b",
    };

    expect(
      createXPRewardKey(first)
    ).not.toBe(createXPRewardKey(second));
  });
});

/* ==========================================
   03 — PROGRESS VALIDATION
========================================== */

describe("XP progress validation", () => {
  it("accepts empty progress", () => {
    expect(
      validateXPProgress(createProgress())
    ).toBe(true);
  });

  it("rejects unsupported schema versions", () => {
    const progress = {
      ...createProgress(),
      schemaVersion: 99,
    };

    expect(() =>
      validateXPProgress(progress)
    ).toThrow(/schema version/i);
  });

  it("rejects negative XP", () => {
    const progress = {
      ...createProgress(),
      totalXP: -10,
    };

    expect(() =>
      validateXPProgress(progress)
    ).toThrow(/invalid total XP/i);
  });

  it("rejects mismatched transaction totals", () => {
    const progress = {
      ...createProgress(),
      totalXP: 100,
    };

    expect(() =>
      validateXPProgress(progress)
    ).toThrow(/does not match transaction history/i);
  });

  it("rejects duplicate reward keys", () => {
    const progress = {
      ...createProgress(),
      awardedEventKeys: ["same", "same"],
    };

    expect(() =>
      validateXPProgress(progress)
    ).toThrow(/duplicate reward keys/i);
  });

  it("accepts progress after an award", () => {
    const result = awardXP(
      createProgress(),
      lessonEvent,
      options
    );

    expect(
      validateXPProgress(result.progress)
    ).toBe(true);
  });
});

/* ==========================================
   04 — XP AWARDS
========================================== */

describe("XP awards", () => {
  it("awards 25 XP for a lesson", () => {
    const result = awardXP(
      createProgress(),
      lessonEvent,
      options
    );

    expect(result.awarded).toBe(true);
    expect(result.xpAwarded).toBe(25);
    expect(result.progress.totalXP).toBe(25);
  });

  it("awards 50 XP for a passed quiz", () => {
    const result = awardXP(
      createProgress(),
      quizPassedEvent,
      options
    );

    expect(result.xpAwarded).toBe(50);
  });

  it("awards 25 XP for a perfect quiz", () => {
    const result = awardXP(
      createProgress(),
      quizPerfectEvent,
      options
    );

    expect(result.xpAwarded).toBe(25);
  });

  it("awards 200 XP for a completed course", () => {
    const result = awardXP(
      createProgress(),
      courseEvent,
      options
    );

    expect(result.xpAwarded).toBe(200);
  });

  it("awards 10 XP for daily learning activity", () => {
    const result = awardXP(
      createProgress(),
      dailyEvent,
      options
    );

    expect(result.xpAwarded).toBe(10);
  });

  it("stores an audit-friendly transaction", () => {
    const result = awardXP(
      createProgress(),
      lessonEvent,
      options
    );

    expect(result.transaction).toMatchObject({
      eventType:
        GAMIFICATION_EVENT_TYPES.LESSON_COMPLETED,
      studentId: STUDENT_ID,
      courseId: "course_001",
      lessonId: "lesson_002",
      xp: 25,
      awardedAt: TIMESTAMP,
    });
  });

  it("updates the progress timestamp", () => {
    const result = awardXP(
      createProgress(),
      lessonEvent,
      options
    );

    expect(result.progress.updatedAt).toBe(
      TIMESTAMP
    );
  });

  it("does not mutate the original progress", () => {
    const original = createProgress();

    const result = awardXP(
      original,
      lessonEvent,
      options
    );

    expect(original.totalXP).toBe(0);
    expect(original.awardedEventKeys).toEqual([]);
    expect(original.xpTransactions).toEqual([]);

    expect(result.progress).not.toBe(original);
  });
});

/* ==========================================
   05 — DUPLICATE PREVENTION
========================================== */

describe("Duplicate reward prevention", () => {
  it("detects an existing reward", () => {
    const first = awardXP(
      createProgress(),
      lessonEvent,
      options
    );

    expect(
      hasXPReward(first.progress, lessonEvent)
    ).toBe(true);
  });

  it("does not award the same lesson twice", () => {
    const first = awardXP(
      createProgress(),
      lessonEvent,
      options
    );

    const second = awardXP(
      first.progress,
      lessonEvent,
      options
    );

    expect(second.awarded).toBe(false);
    expect(second.duplicate).toBe(true);
    expect(second.xpAwarded).toBe(0);
    expect(second.progress.totalXP).toBe(25);
    expect(
      second.progress.xpTransactions
    ).toHaveLength(1);
  });

  it("does not award a passed quiz twice", () => {
    const first = awardXP(
      createProgress(),
      quizPassedEvent,
      options
    );

    const second = awardXP(
      first.progress,
      quizPassedEvent,
      options
    );

    expect(second.xpAwarded).toBe(0);
  });

  it("allows separate quiz and perfect bonuses", () => {
    const result = awardXPBatch(
      createProgress(),
      [
        quizPassedEvent,
        quizPerfectEvent,
      ],
      options
    );

    expect(result.totalAwardedXP).toBe(75);
    expect(result.awardedCount).toBe(2);
  });

  it("rejects events belonging to another student", () => {
    expect(() =>
      awardXP(
        createProgress(),
        {
          ...lessonEvent,
          studentId: "another-student",
        },
        options
      )
    ).toThrow(/does not belong/i);
  });
});

/* ==========================================
   06 — BATCH PROCESSING
========================================== */

describe("XP batch processing", () => {
  it("awards multiple distinct events", () => {
    const result = awardXPBatch(
      createProgress(),
      [
        lessonEvent,
        quizPassedEvent,
        courseEvent,
      ],
      options
    );

    expect(result.totalAwardedXP).toBe(275);
    expect(result.awardedCount).toBe(3);
    expect(result.progress.totalXP).toBe(275);
  });

  it("deduplicates events within one batch", () => {
    const result = awardXPBatch(
      createProgress(),
      [
        lessonEvent,
        lessonEvent,
      ],
      options
    );

    expect(result.totalAwardedXP).toBe(25);
    expect(result.awardedCount).toBe(1);
    expect(result.duplicateCount).toBe(1);
  });

  it("supports empty batches", () => {
    const result = awardXPBatch(
      createProgress(),
      [],
      options
    );

    expect(result.totalAwardedXP).toBe(0);
    expect(result.results).toEqual([]);
  });

  it("rejects non-array batches", () => {
    expect(() =>
      awardXPBatch(
        createProgress(),
        null,
        options
      )
    ).toThrow(/must be an array/i);
  });

  it("does not mutate input on batch failure", () => {
    const original = createProgress();

    expect(() =>
      awardXPBatch(
        original,
        [
          lessonEvent,
          { type: "invalid_event" },
        ],
        options
      )
    ).toThrow(/unsupported XP event type/i);

    expect(original.totalXP).toBe(0);
    expect(original.xpTransactions).toEqual([]);
  });

  it("maintains valid totals after a batch", () => {
    const result = awardXPBatch(
      createProgress(),
      [
        lessonEvent,
        quizPassedEvent,
        quizPerfectEvent,
        dailyEvent,
      ],
      options
    );

    expect(result.progress.totalXP).toBe(110);

    expect(
      validateXPProgress(result.progress)
    ).toBe(true);
  });
});
