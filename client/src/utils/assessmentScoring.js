
/**
 * BEHAR LMS — P14.4.0.3
 * Assessment Scoring Engine
 *
 * Pure functions. No React, storage, or network calls.
 */

import { QUESTION_TYPES } from "../data/student/assessments";

function normalizeAnswer(answer) {
  if (typeof answer === "string") {
    return [answer];
  }

  if (!Array.isArray(answer)) {
    return [];
  }

  return answer.filter(
    (value) => typeof value === "string"
  );
}

function sameAnswers(actual, expected) {
  const actualSet = new Set(actual);
  const expectedSet = new Set(expected);

  return (
    actualSet.size === actual.length &&
    expectedSet.size === expected.length &&
    actualSet.size === expectedSet.size &&
    [...actualSet].every((id) => expectedSet.has(id))
  );
}

/**
 * Evaluate a single question.
 *
 * @param {object} question
 * @param {string|string[]|undefined} answer
 */
export function evaluateQuestion(question, answer) {
  if (!question || typeof question !== "object") {
    throw new Error("A valid question is required.");
  }

  const correctOptionIds = question.correctOptionIds;

  if (
    !Array.isArray(correctOptionIds) ||
    correctOptionIds.length === 0
  ) {
    throw new Error(
      `Question "${question.id}" has no correct answers.`
    );
  }

  if (
    !Number.isFinite(question.points) ||
    question.points <= 0
  ) {
    throw new Error(
      `Question "${question.id}" has invalid points.`
    );
  }

  const selectedOptionIds = normalizeAnswer(answer);
  const isAnswered = selectedOptionIds.length > 0;

  let isCorrect = false;

  switch (question.type) {
    case QUESTION_TYPES.SINGLE_CHOICE:
    case QUESTION_TYPES.TRUE_FALSE:
      isCorrect =
        selectedOptionIds.length === 1 &&
        selectedOptionIds[0] === correctOptionIds[0];
      break;

    case QUESTION_TYPES.MULTIPLE_CHOICE:
      isCorrect = sameAnswers(
        selectedOptionIds,
        correctOptionIds
      );
      break;

    default:
      throw new Error(
        `Unsupported question type: ${question.type}`
      );
  }

  return {
    questionId: question.id,
    type: question.type,
    selectedOptionIds,
    correctOptionIds: [...correctOptionIds],
    isAnswered,
    isCorrect,
    earnedPoints: isCorrect ? question.points : 0,
    maxPoints: question.points,
  };
}

/**
 * Calculate the result of a complete assessment.
 *
 * Answers format:
 * {
 *   "react-q001": ["a"],
 *   "react-q002": ["a", "b"],
 *   "react-q003": ["true"]
 * }
 *
 * @param {object} assessment
 * @param {object[]} questions
 * @param {Record<string, string|string[]>} answers
 */
export function scoreAssessment(
  assessment,
  questions,
  answers = {}
) {
  if (!assessment || typeof assessment !== "object") {
    throw new Error("Assessment is required.");
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error(
      "Assessment requires at least one question."
    );
  }

  if (
    !answers ||
    typeof answers !== "object" ||
    Array.isArray(answers)
  ) {
    throw new Error("Answers must be an object.");
  }

  const passingScore = assessment.settings?.passingScore;

  if (
    !Number.isFinite(passingScore) ||
    passingScore < 0 ||
    passingScore > 100
  ) {
    throw new Error("Invalid assessment passing score.");
  }

  const expectedIds = assessment.questionIds;

  if (
    !Array.isArray(expectedIds) ||
    expectedIds.length !== questions.length
  ) {
    throw new Error("Assessment question list is incomplete.");
  }

  const questionMap = new Map();

  for (const question of questions) {
    if (
      question.assessmentId !== assessment.id ||
      questionMap.has(question.id)
    ) {
      throw new Error("Invalid assessment question relationship.");
    }

    questionMap.set(question.id, question);
  }

  if (
    new Set(expectedIds).size !== expectedIds.length ||
    expectedIds.some((id) => !questionMap.has(id))
  ) {
    throw new Error("Assessment question IDs do not match.");
  }

  const results = expectedIds.map((id) =>
    evaluateQuestion(questionMap.get(id), answers[id])
  );

  const earnedPoints = results.reduce(
    (total, result) => total + result.earnedPoints,
    0
  );

  const maxPoints = results.reduce(
    (total, result) => total + result.maxPoints,
    0
  );

  const percentage = Number(
    ((earnedPoints / maxPoints) * 100).toFixed(2)
  );

  const answeredCount = results.filter(
    (result) => result.isAnswered
  ).length;

  const correctCount = results.filter(
    (result) => result.isCorrect
  ).length;

  return {
    assessmentId: assessment.id,
    totalQuestions: results.length,
    answeredCount,
    unansweredCount: results.length - answeredCount,
    correctCount,
    incorrectCount: answeredCount - correctCount,
    earnedPoints,
    maxPoints,
    percentage,
    passingScore,
    passed: percentage >= passingScore,
    results,
  };
}
