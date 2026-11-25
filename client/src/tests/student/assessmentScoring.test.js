
/**
 * BEHAR LMS
 * P14.4.0.8 — Step 02
 *
 * Assessment Scoring & Answer Validation Tests
 */

import { describe, expect, it } from "vitest";

import {
  assessments,
  assessmentQuestions,
} from "../../data/student/assessments";

import {
  evaluateQuestion,
  scoreAssessment,
} from "../../utils/assessmentScoring";

/* ==========================================
   TEST FIXTURES
========================================== */

const assessment = assessments.find(
  (item) => item.id === "react-basics-quiz"
);

const questions = assessmentQuestions.filter(
  (item) => item.assessmentId === assessment.id
);

const getQuestion = (id) =>
  questions.find((question) => question.id === id);

const correctAnswers = {
  "react-q001": ["a"],
  "react-q002": ["a", "b"],
  "react-q003": ["true"],
};

const partiallyCorrectAnswers = {
  "react-q001": ["a"],
  "react-q002": ["a"],
  "react-q003": ["true"],
};

const incorrectAnswers = {
  "react-q001": ["b"],
  "react-q002": ["c"],
  "react-q003": ["false"],
};

/* ==========================================
   01 — SINGLE CHOICE
========================================== */

describe("Single-choice scoring", () => {
  const question = getQuestion("react-q001");

  it("awards points for the correct answer", () => {
    const result = evaluateQuestion(question, ["a"]);

    expect(result.isCorrect).toBe(true);
    expect(result.earnedPoints).toBe(10);
  });

  it("accepts a string answer", () => {
    const result = evaluateQuestion(question, "a");

    expect(result.isCorrect).toBe(true);
    expect(result.selectedOptionIds).toEqual(["a"]);
  });

  it("rejects an incorrect answer", () => {
    const result = evaluateQuestion(question, ["b"]);

    expect(result.isCorrect).toBe(false);
    expect(result.earnedPoints).toBe(0);
  });

  it("rejects multiple selected answers", () => {
    const result = evaluateQuestion(question, ["a", "b"]);

    expect(result.isCorrect).toBe(false);
  });

  it("rejects duplicate selected answers", () => {
    const result = evaluateQuestion(question, ["a", "a"]);

    expect(result.isCorrect).toBe(false);
  });

  it("marks an unanswered question correctly", () => {
    const result = evaluateQuestion(question, undefined);

    expect(result.isAnswered).toBe(false);
    expect(result.isCorrect).toBe(false);
    expect(result.earnedPoints).toBe(0);
  });
});

/* ==========================================
   02 — MULTIPLE CHOICE
========================================== */

describe("Multiple-choice scoring", () => {
  const question = getQuestion("react-q002");

  it("awards full points for exact answers", () => {
    const result = evaluateQuestion(
      question,
      ["a", "b"]
    );

    expect(result.isCorrect).toBe(true);
    expect(result.earnedPoints).toBe(10);
  });

  it("accepts correct answers in any order", () => {
    const result = evaluateQuestion(
      question,
      ["b", "a"]
    );

    expect(result.isCorrect).toBe(true);
  });

  it("does not award partial credit", () => {
    const result = evaluateQuestion(
      question,
      ["a"]
    );

    expect(result.isCorrect).toBe(false);
    expect(result.earnedPoints).toBe(0);
  });

  it("rejects extra incorrect options", () => {
    const result = evaluateQuestion(
      question,
      ["a", "b", "c"]
    );

    expect(result.isCorrect).toBe(false);
  });

  it("rejects duplicate answers", () => {
    const result = evaluateQuestion(
      question,
      ["a", "a", "b"]
    );

    expect(result.isCorrect).toBe(false);
  });

  it("rejects incorrect selections", () => {
    const result = evaluateQuestion(
      question,
      ["c"]
    );

    expect(result.isCorrect).toBe(false);
  });
});

/* ==========================================
   03 — TRUE / FALSE
========================================== */

describe("True/false scoring", () => {
  const question = getQuestion("react-q003");

  it("accepts the correct answer", () => {
    const result = evaluateQuestion(
      question,
      ["true"]
    );

    expect(result.isCorrect).toBe(true);
    expect(result.earnedPoints).toBe(10);
  });

  it("rejects the incorrect answer", () => {
    const result = evaluateQuestion(
      question,
      ["false"]
    );

    expect(result.isCorrect).toBe(false);
    expect(result.earnedPoints).toBe(0);
  });

  it("rejects multiple selections", () => {
    const result = evaluateQuestion(
      question,
      ["true", "false"]
    );

    expect(result.isCorrect).toBe(false);
  });
});

/* ==========================================
   04 — COMPLETE ASSESSMENT SCORING
========================================== */

describe("Complete assessment scoring", () => {
  it("returns a perfect score", () => {
    const result = scoreAssessment(
      assessment,
      questions,
      correctAnswers
    );

    expect(result.earnedPoints).toBe(30);
    expect(result.maxPoints).toBe(30);
    expect(result.percentage).toBe(100);
    expect(result.passed).toBe(true);
  });

  it("calculates partial correctness", () => {
    const result = scoreAssessment(
      assessment,
      questions,
      partiallyCorrectAnswers
    );

    expect(result.correctCount).toBe(2);
    expect(result.earnedPoints).toBe(20);
    expect(result.percentage).toBe(66.67);
    expect(result.passed).toBe(false);
  });

  it("returns zero for all incorrect answers", () => {
    const result = scoreAssessment(
      assessment,
      questions,
      incorrectAnswers
    );

    expect(result.earnedPoints).toBe(0);
    expect(result.percentage).toBe(0);
    expect(result.passed).toBe(false);
  });

  it("tracks answered and unanswered questions", () => {
    const result = scoreAssessment(
      assessment,
      questions,
      {
        "react-q001": ["a"],
      }
    );

    expect(result.answeredCount).toBe(1);
    expect(result.unansweredCount).toBe(2);
    expect(result.correctCount).toBe(1);
    expect(result.incorrectCount).toBe(0);
  });

  it("tracks incorrect answered questions", () => {
    const result = scoreAssessment(
      assessment,
      questions,
      incorrectAnswers
    );

    expect(result.answeredCount).toBe(3);
    expect(result.incorrectCount).toBe(3);
    expect(result.correctCount).toBe(0);
  });

  it("returns one result per question", () => {
    const result = scoreAssessment(
      assessment,
      questions,
      correctAnswers
    );

    expect(result.results).toHaveLength(3);
    expect(result.totalQuestions).toBe(3);
    expect(result.assessmentId).toBe(
      "react-basics-quiz"
    );
  });

  it("works regardless of question array order", () => {
    const reversedQuestions = [...questions].reverse();

    const result = scoreAssessment(
      assessment,
      reversedQuestions,
      correctAnswers
    );

    expect(result.percentage).toBe(100);

    expect(
      result.results.map((item) => item.questionId)
    ).toEqual(assessment.questionIds);
  });
});

/* ==========================================
   05 — VALIDATION & ERROR HANDLING
========================================== */

describe("Scoring validation", () => {
  it("rejects an invalid question", () => {
    expect(() =>
      evaluateQuestion(null, ["a"])
    ).toThrow("A valid question is required.");
  });

  it("rejects questions without correct answers", () => {
    const invalid = {
      ...getQuestion("react-q001"),
      correctOptionIds: [],
    };

    expect(() =>
      evaluateQuestion(invalid, ["a"])
    ).toThrow(/no correct answers/i);
  });

  it("rejects invalid question points", () => {
    const invalid = {
      ...getQuestion("react-q001"),
      points: 0,
    };

    expect(() =>
      evaluateQuestion(invalid, ["a"])
    ).toThrow(/invalid points/i);
  });

  it("rejects unsupported question types", () => {
    const invalid = {
      ...getQuestion("react-q001"),
      type: "unsupported",
    };

    expect(() =>
      evaluateQuestion(invalid, ["a"])
    ).toThrow(/unsupported question type/i);
  });

  it("rejects an invalid assessment", () => {
    expect(() =>
      scoreAssessment(null, questions, {})
    ).toThrow("Assessment is required.");
  });

  it("rejects empty question arrays", () => {
    expect(() =>
      scoreAssessment(assessment, [], {})
    ).toThrow(/at least one question/i);
  });

  it("rejects invalid answer containers", () => {
    expect(() =>
      scoreAssessment(assessment, questions, [])
    ).toThrow("Answers must be an object.");
  });

  it("rejects invalid passing scores", () => {
    const invalid = {
      ...assessment,
      settings: {
        ...assessment.settings,
        passingScore: 120,
      },
    };

    expect(() =>
      scoreAssessment(invalid, questions, {})
    ).toThrow(/invalid assessment passing score/i);
  });

  it("rejects missing questions", () => {
    expect(() =>
      scoreAssessment(
        assessment,
        questions.slice(0, 2),
        {}
      )
    ).toThrow(/question list is incomplete/i);
  });

  it("rejects duplicate question records", () => {
    const duplicate = [
      questions[0],
      questions[0],
      questions[2],
    ];

    expect(() =>
      scoreAssessment(
        assessment,
        duplicate,
        {}
      )
    ).toThrow(/invalid assessment question relationship/i);
  });

  it("rejects questions from another assessment", () => {
    const invalid = [
      {
        ...questions[0],
        assessmentId: "another-assessment",
      },
      questions[1],
      questions[2],
    ];

    expect(() =>
      scoreAssessment(
        assessment,
        invalid,
        {}
      )
    ).toThrow(/invalid assessment question relationship/i);
  });

  it("rejects mismatched question IDs", () => {
    const invalid = [
      {
        ...questions[0],
        id: "unknown-question",
      },
      questions[1],
      questions[2],
    ];

    expect(() =>
      scoreAssessment(
        assessment,
        invalid,
        {}
      )
    ).toThrow(/assessment question IDs do not match/i);
  });
});
