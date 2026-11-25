
/**
 * BEHAR LMS
 * P14.4.0.8 — Step 01
 *
 * Assessment Data Integrity Tests
 *
 * Tests:
 * - Assessment publication
 * - Course/module/lesson relationships
 * - Question relationships
 * - Question correctness
 * - Assessment configuration
 * - Unique identifiers
 */

import { describe, expect, it } from "vitest";

import {
  assessments,
  assessmentQuestions,
  QUESTION_TYPES,
  ASSESSMENT_TYPES,
} from "../../data/student/assessments";

import {
  mockLearningCurricula,
} from "../../data/student/learningPlayer";

/* ==========================================
   HELPERS
========================================== */

const getAssessment = (id) =>
  assessments.find(
    (assessment) => assessment.id === id
  );

const getQuestion = (id) =>
  assessmentQuestions.find(
    (question) => question.id === id
  );

const hasUniqueIds = (items) => {
  const ids = items.map((item) => item.id);

  return new Set(ids).size === ids.length;
};

const isLocalized = (value) =>
  typeof value?.en === "string" &&
  value.en.trim().length > 0 &&
  typeof value?.ar === "string" &&
  value.ar.trim().length > 0;

/* ==========================================
   TEST DATA
========================================== */

const ASSESSMENT_ID = "react-basics-quiz";
const COURSE_ID = "course_001";
const MODULE_ID = "module_001";
const LESSON_ID = "lesson_002";

/* ==========================================
   01 — ASSESSMENT EXISTENCE
========================================== */

describe("Assessment existence", () => {
  it("contains the React Fundamentals quiz", () => {
    const assessment = getAssessment(ASSESSMENT_ID);

    expect(assessment).toBeDefined();
  });

  it("uses a supported assessment type", () => {
    const assessment = getAssessment(ASSESSMENT_ID);

    expect(assessment?.type).toBe(
      ASSESSMENT_TYPES.QUIZ
    );
  });

  it("has a unique assessment ID", () => {
    expect(hasUniqueIds(assessments)).toBe(true);
  });
});

/* ==========================================
   02 — PUBLICATION STATUS
========================================== */

describe("Assessment publication", () => {
  it("is linked to a lesson", () => {
    const assessment = getAssessment(ASSESSMENT_ID);

    expect(assessment?.linked).toBe(true);
  });

  it("is published", () => {
    const assessment = getAssessment(ASSESSMENT_ID);

    expect(assessment?.published).toBe(true);
  });
});

/* ==========================================
   03 — CURRICULUM RELATIONSHIP
========================================== */

describe("Assessment curriculum relationship", () => {
  it("references the correct course", () => {
    const assessment = getAssessment(ASSESSMENT_ID);

    expect(assessment?.courseId).toBe(COURSE_ID);

    expect(
      mockLearningCurricula[COURSE_ID]
    ).toBeDefined();
  });

  it("references an existing module", () => {
    const assessment = getAssessment(ASSESSMENT_ID);

    const modules =
      mockLearningCurricula[assessment?.courseId] ?? [];

    const module = modules.find(
      (item) => item.id === assessment?.moduleId
    );

    expect(assessment?.moduleId).toBe(MODULE_ID);
    expect(module).toBeDefined();
  });

  it("references an existing lesson in its module", () => {
    const assessment = getAssessment(ASSESSMENT_ID);

    const modules =
      mockLearningCurricula[assessment?.courseId] ?? [];

    const module = modules.find(
      (item) => item.id === assessment?.moduleId
    );

    const lesson = module?.lessons.find(
      (item) => item.id === assessment?.lessonId
    );

    expect(assessment?.lessonId).toBe(LESSON_ID);
    expect(lesson).toBeDefined();
  });

  it("connects to the React Fundamentals lesson", () => {
    const modules =
      mockLearningCurricula[COURSE_ID];

    const module = modules.find(
      (item) => item.id === MODULE_ID
    );

    const lesson = module.lessons.find(
      (item) => item.id === LESSON_ID
    );

    expect(lesson.title.en).toBe(
      "React Fundamentals"
    );
  });
});

/* ==========================================
   04 — QUESTION RELATIONSHIPS
========================================== */

describe("Assessment questions", () => {
  it("contains exactly three questions", () => {
    const assessment = getAssessment(ASSESSMENT_ID);

    expect(assessment?.questionIds).toHaveLength(3);
  });

  it("references existing questions", () => {
    const assessment = getAssessment(ASSESSMENT_ID);

    for (const questionId of assessment.questionIds) {
      expect(getQuestion(questionId)).toBeDefined();
    }
  });

  it("uses unique question IDs", () => {
    expect(
      hasUniqueIds(assessmentQuestions)
    ).toBe(true);
  });

  it("assigns every question to its assessment", () => {
    const assessment = getAssessment(ASSESSMENT_ID);

    for (const questionId of assessment.questionIds) {
      const question = getQuestion(questionId);

      expect(question.assessmentId).toBe(
        assessment.id
      );
    }
  });

  it("uses unique question references", () => {
    const assessment = getAssessment(ASSESSMENT_ID);

    expect(
      new Set(assessment.questionIds).size
    ).toBe(assessment.questionIds.length);
  });
});

/* ==========================================
   05 — QUESTION VALIDATION
========================================== */

describe("Question validation", () => {
  it("uses supported question types", () => {
    const supportedTypes =
      Object.values(QUESTION_TYPES);

    for (const question of assessmentQuestions) {
      expect(supportedTypes).toContain(
        question.type
      );
    }
  });

  it("has bilingual question text", () => {
    for (const question of assessmentQuestions) {
      expect(
        isLocalized(question.question)
      ).toBe(true);
    }
  });

  it("has bilingual options", () => {
    for (const question of assessmentQuestions) {
      for (const option of question.options) {
        expect(
          isLocalized(option.text)
        ).toBe(true);
      }
    }
  });

  it("has bilingual explanations", () => {
    for (const question of assessmentQuestions) {
      expect(
        isLocalized(question.explanation)
      ).toBe(true);
    }
  });

  it("has valid correct answers", () => {
    for (const question of assessmentQuestions) {
      const optionIds = question.options.map(
        (option) => option.id
      );

      expect(
        question.correctOptionIds.length
      ).toBeGreaterThan(0);

      for (const correctId of question.correctOptionIds) {
        expect(optionIds).toContain(correctId);
      }
    }
  });

  it("has unique option IDs per question", () => {
    for (const question of assessmentQuestions) {
      expect(
        hasUniqueIds(question.options)
      ).toBe(true);
    }
  });

  it("has the correct answer count for single-choice and true/false questions", () => {
    for (const question of assessmentQuestions) {
      if (
        question.type === QUESTION_TYPES.SINGLE_CHOICE ||
        question.type === QUESTION_TYPES.TRUE_FALSE
      ) {
        expect(
          question.correctOptionIds
        ).toHaveLength(1);
      }
    }
  });

  it("assigns positive points to every question", () => {
    for (const question of assessmentQuestions) {
      expect(question.points).toBeGreaterThan(0);
      expect(
        Number.isFinite(question.points)
      ).toBe(true);
    }
  });
});

/* ==========================================
   06 — ASSESSMENT SETTINGS
========================================== */

describe("Assessment settings", () => {
  it("has a valid passing score", () => {
    const assessment = getAssessment(ASSESSMENT_ID);

    expect(
      assessment.settings.passingScore
    ).toBeGreaterThanOrEqual(0);

    expect(
      assessment.settings.passingScore
    ).toBeLessThanOrEqual(100);
  });

  it("has a positive time limit", () => {
    const assessment = getAssessment(ASSESSMENT_ID);

    expect(
      assessment.settings.timeLimitMinutes
    ).toBeGreaterThan(0);
  });

  it("allows a positive number of attempts", () => {
    const assessment = getAssessment(ASSESSMENT_ID);

    expect(
      Number.isInteger(
        assessment.settings.maxAttempts
      )
    ).toBe(true);

    expect(
      assessment.settings.maxAttempts
    ).toBeGreaterThan(0);
  });

  it("has bilingual metadata", () => {
    const assessment = getAssessment(ASSESSMENT_ID);

    expect(isLocalized(assessment.title)).toBe(true);
    expect(isLocalized(assessment.description)).toBe(true);
    expect(isLocalized(assessment.instructions)).toBe(true);
  });
});

/* ==========================================
   07 — EXPECTED SCORING CONFIGURATION
========================================== */

describe("Assessment scoring configuration", () => {
  it("has 30 available points", () => {
    const assessment = getAssessment(ASSESSMENT_ID);

    const totalPoints = assessment.questionIds.reduce(
      (total, questionId) => {
        const question = getQuestion(questionId);

        return total + question.points;
      },
      0
    );

    expect(totalPoints).toBe(30);
  });

  it("requires all three questions correct to pass", () => {
    const assessment = getAssessment(ASSESSMENT_ID);

    const pointsPerQuestion = assessment.questionIds.map(
      (id) => getQuestion(id).points
    );

    const maxPoints = pointsPerQuestion.reduce(
      (total, points) => total + points,
      0
    );

    const highestScoreWithOneWrong =
      maxPoints - Math.min(...pointsPerQuestion);

    const percentage =
      (highestScoreWithOneWrong / maxPoints) * 100;

    expect(percentage).toBeLessThan(
      assessment.settings.passingScore
    );
  });
});
