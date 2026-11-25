
/**
 * BEHAR LMS — P14.5.0.1
 * Gamification Data Model Tests
 */

import {
  describe,
  expect,
  it,
} from "vitest";

import {
  GAMIFICATION_SCHEMA_VERSION,
  GAMIFICATION_EVENT_TYPES,
  GAMIFICATION_REWARD_FREQUENCY,
  GAMIFICATION_XP_RULES,
  GAMIFICATION_LEVELS,
  GAMIFICATION_BADGES,
  GAMIFICATION_BADGE_CATEGORIES,
  GAMIFICATION_BADGE_CRITERIA,
  GAMIFICATION_BADGE_RARITIES,
  GAMIFICATION_STREAK_CONFIG,
  GAMIFICATION_WEEKLY_GOAL_CONFIG,
  GAMIFICATION_GOAL_METRICS,
  createEmptyGamificationProgress,
  mockStudentGamification,
  getGamificationText,
} from "../../data/student/gamification";

const isBilingual = (value) =>
  typeof value?.en === "string" &&
  value.en.trim().length > 0 &&
  typeof value?.ar === "string" &&
  value.ar.trim().length > 0;

/* ==========================================
   01 — SCHEMA
========================================== */

describe("Gamification schema", () => {
  it("uses schema version 1", () => {
    expect(GAMIFICATION_SCHEMA_VERSION).toBe(1);
  });

  it("creates an empty student record", () => {
    const progress = createEmptyGamificationProgress({
      studentId: "student-001",
    });

    expect(progress.studentId).toBe("student-001");
    expect(progress.totalXP).toBe(0);
    expect(progress.level).toBe(1);
    expect(progress.unlockedBadges).toEqual([]);
  });

  it("rejects missing student IDs", () => {
    expect(() =>
      createEmptyGamificationProgress()
    ).toThrow(/student ID/i);
  });

  it("creates independent student records", () => {
    const first = createEmptyGamificationProgress({
      studentId: "student-a",
    });

    const second = createEmptyGamificationProgress({
      studentId: "student-b",
    });

    first.unlockedBadges.push("first-step");
    first.streak.activityDates.push("2026-11-25");
    first.stats.lessonsCompleted = 5;

    expect(second.unlockedBadges).toEqual([]);
    expect(second.streak.activityDates).toEqual([]);
    expect(second.stats.lessonsCompleted).toBe(0);
  });

  it("creates the expected mock student", () => {
    expect(mockStudentGamification.studentId).toBe(
      "dev-student-001"
    );

    expect(mockStudentGamification.timezone).toBe(
      "Asia/Riyadh"
    );
  });
});

/* ==========================================
   02 — XP RULES
========================================== */

describe("XP reward rules", () => {
  it("defines a rule for every event type", () => {
    const eventTypes = Object.values(
      GAMIFICATION_EVENT_TYPES
    );

    expect(Object.keys(GAMIFICATION_XP_RULES).sort())
      .toEqual([...eventTypes].sort());
  });

  it("assigns positive integer XP rewards", () => {
    for (const rule of Object.values(
      GAMIFICATION_XP_RULES
    )) {
      expect(Number.isInteger(rule.xp)).toBe(true);
      expect(rule.xp).toBeGreaterThan(0);
    }
  });

  it("uses supported reward frequencies", () => {
    const frequencies = Object.values(
      GAMIFICATION_REWARD_FREQUENCY
    );

    for (const rule of Object.values(
      GAMIFICATION_XP_RULES
    )) {
      expect(frequencies).toContain(rule.frequency);
    }
  });

  it("requires a student ID for every event", () => {
    for (const rule of Object.values(
      GAMIFICATION_XP_RULES
    )) {
      expect(rule.requires).toContain("studentId");
    }
  });

  it("provides bilingual reward labels", () => {
    for (const rule of Object.values(
      GAMIFICATION_XP_RULES
    )) {
      expect(isBilingual(rule.label)).toBe(true);
    }
  });

  it("uses the approved XP values", () => {
    expect(
      GAMIFICATION_XP_RULES.lesson_completed.xp
    ).toBe(25);

    expect(
      GAMIFICATION_XP_RULES.quiz_passed.xp
    ).toBe(50);

    expect(
      GAMIFICATION_XP_RULES.quiz_perfect.xp
    ).toBe(25);

    expect(
      GAMIFICATION_XP_RULES.course_completed.xp
    ).toBe(200);

    expect(
      GAMIFICATION_XP_RULES.daily_learning_activity.xp
    ).toBe(10);
  });
});

/* ==========================================
   03 — LEVELS
========================================== */

describe("Level definitions", () => {
  it("starts at level 1 with zero XP", () => {
    expect(GAMIFICATION_LEVELS[0].level).toBe(1);
    expect(GAMIFICATION_LEVELS[0].minTotalXP).toBe(0);
  });

  it("uses sequential level numbers", () => {
    GAMIFICATION_LEVELS.forEach((entry, index) => {
      expect(entry.level).toBe(index + 1);
    });
  });

  it("uses increasing XP thresholds", () => {
    for (
      let index = 1;
      index < GAMIFICATION_LEVELS.length;
      index++
    ) {
      expect(
        GAMIFICATION_LEVELS[index].minTotalXP
      ).toBeGreaterThan(
        GAMIFICATION_LEVELS[index - 1].minTotalXP
      );
    }
  });

  it("provides bilingual level titles", () => {
    for (const level of GAMIFICATION_LEVELS) {
      expect(isBilingual(level.title)).toBe(true);
    }
  });
});

/* ==========================================
   04 — BADGES
========================================== */

describe("Badge definitions", () => {
  it("uses unique badge IDs", () => {
    const ids = GAMIFICATION_BADGES.map(
      (badge) => badge.id
    );

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses supported badge categories", () => {
    const categories = Object.values(
      GAMIFICATION_BADGE_CATEGORIES
    );

    for (const badge of GAMIFICATION_BADGES) {
      expect(categories).toContain(badge.category);
    }
  });

  it("uses supported badge rarities", () => {
    const rarities = Object.values(
      GAMIFICATION_BADGE_RARITIES
    );

    for (const badge of GAMIFICATION_BADGES) {
      expect(rarities).toContain(badge.rarity);
    }
  });

  it("uses supported badge criteria", () => {
    const criteria = Object.values(
      GAMIFICATION_BADGE_CRITERIA
    );

    for (const badge of GAMIFICATION_BADGES) {
      expect(criteria).toContain(
        badge.criteria.metric
      );

      expect(
        badge.criteria.threshold
      ).toBeGreaterThan(0);
    }
  });

  it("provides bilingual badge metadata", () => {
    for (const badge of GAMIFICATION_BADGES) {
      expect(isBilingual(badge.title)).toBe(true);
      expect(isBilingual(badge.description)).toBe(true);
    }
  });
});

/* ==========================================
   05 — STREAKS & GOALS
========================================== */

describe("Streak and goal configuration", () => {
  it("uses student timezone policy", () => {
    expect(
      GAMIFICATION_STREAK_CONFIG.timezonePolicy
    ).toBe("student_timezone");
  });

  it("defines unique streak milestones", () => {
    const milestones =
      GAMIFICATION_STREAK_CONFIG.milestones;

    expect(new Set(milestones).size).toBe(
      milestones.length
    );
  });

  it("starts weekly goals on Monday", () => {
    expect(
      GAMIFICATION_WEEKLY_GOAL_CONFIG.weekStartsOn
    ).toBe(1);
  });

  it("uses supported weekly goal metrics", () => {
    const metrics = Object.values(
      GAMIFICATION_GOAL_METRICS
    );

    for (const goal of
      GAMIFICATION_WEEKLY_GOAL_CONFIG.availableGoals) {
      expect(metrics).toContain(goal.metric);
      expect(isBilingual(goal.label)).toBe(true);

      for (const target of goal.targets) {
        expect(Number.isInteger(target)).toBe(true);
        expect(target).toBeGreaterThan(0);
      }
    }
  });
});

/* ==========================================
   06 — LOCALIZATION
========================================== */

describe("Gamification localization", () => {
  it("returns English text", () => {
    expect(
      getGamificationText(
        { en: "Explorer", ar: "مستكشف" },
        "en"
      )
    ).toBe("Explorer");
  });

  it("returns Arabic text", () => {
    expect(
      getGamificationText(
        { en: "Explorer", ar: "مستكشف" },
        "ar"
      )
    ).toBe("مستكشف");
  });

  it("falls back to English", () => {
    expect(
      getGamificationText(
        { en: "Explorer" },
        "fr"
      )
    ).toBe("Explorer");
  });

  it("handles missing values", () => {
    expect(getGamificationText(null)).toBe("");
  });
});
