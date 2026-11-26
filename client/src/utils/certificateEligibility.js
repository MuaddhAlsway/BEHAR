
import {
  certificateRequirementDefinitions,
  demoCertificateLearningRecords,
} from "../data/certificateRequirements";

const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, value));

function validScore(value) {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 100;
}

function evaluateLessons(definition, records) {
  const required = Math.max(
    0,
    Number(definition?.required) || 0
  );

  const completed = clamp(
    Number(records?.completed) || 0,
    0,
    required
  );

  return {
    id: "lessons",
    type: "lessons",
    completed,
    required,
    done: required === 0 || completed === required,
    progress:
      required === 0
        ? 100
        : Math.round((completed / required) * 100),
  };
}

function evaluateQuizzes(definitions = [], records = {}) {
  const items = definitions.map((quiz) => {
    const score = records[quiz.id]?.score;

    return {
      id: quiz.id,
      passingScore: quiz.passingScore,
      score: validScore(score) ? score : null,
      passed:
        validScore(score) &&
        score >= quiz.passingScore,
    };
  });

  const completed = items.filter(
    (item) => item.passed
  ).length;

  return {
    id: "quizzes",
    type: "quizzes",
    completed,
    required: items.length,
    done: completed === items.length,
    progress: items.length
      ? Math.round((completed / items.length) * 100)
      : 100,
    items,
  };
}

function evaluateAssignments(ids = [], records = {}) {
  const items = ids.map((id) => {
    const record = records[id];

    return {
      id,
      status: record?.status ?? "not-started",
      grade: validScore(record?.grade)
        ? record.grade
        : null,
      passed:
        record?.status === "passed" &&
        validScore(record?.grade),
    };
  });

  const completed = items.filter(
    (item) => item.passed
  ).length;

  return {
    id: "assignments",
    type: "assignments",
    completed,
    required: items.length,
    done: completed === items.length,
    progress: items.length
      ? Math.round((completed / items.length) * 100)
      : 100,
    items,
  };
}

function evaluateFinalAssessment(definition, records = {}) {
  if (!definition) {
    return {
      id: "finalAssessment",
      type: "finalAssessment",
      required: 0,
      completed: 0,
      done: true,
      progress: 100,
      notRequired: true,
    };
  }

  const score = records[definition.id]?.score;

  const passed =
    validScore(score) &&
    score >= definition.passingScore;

  return {
    id: "finalAssessment",
    type: "finalAssessment",
    required: 1,
    completed: passed ? 1 : 0,
    done: passed,
    progress: passed ? 100 : 0,
    score: validScore(score) ? score : null,
    passingScore: definition.passingScore,
    notRequired: false,
  };
}

export function evaluateCertificateEligibility(
  courseId,
  definitions = certificateRequirementDefinitions,
  learningRecords = demoCertificateLearningRecords
) {
  const definition = definitions[courseId];
  const records = learningRecords[courseId];

  if (!definition) {
    return {
      courseId,
      available: false,
      eligible: false,
      progress: 0,
      completed: 0,
      required: 0,
      requirements: [],
    };
  }

  const requirements = [
    evaluateLessons(definition.lessons, records?.lessons),
    evaluateQuizzes(
      definition.quizzes,
      records?.quizzes
    ),
    evaluateAssignments(
      definition.assignments,
      records?.assignments
    ),
    evaluateFinalAssessment(
      definition.finalAssessment,
      records?.finalAssessments
    ),
  ];

  const applicable = requirements.filter(
    (requirement) => requirement.required > 0
  );

  const required = applicable.reduce(
    (sum, item) => sum + item.required,
    0
  );

  const completed = applicable.reduce(
    (sum, item) => sum + item.completed,
    0
  );

  // No required learning items is not enough to issue
  // a certificate. This prevents empty configurations
  // from automatically qualifying students.
  const eligible =
    required > 0 &&
    applicable.every((item) => item.done);

  return {
    courseId,
    available: true,
    eligible,
    progress:
      required > 0
        ? Math.round((completed / required) * 100)
        : 0,
    completed,
    required,
    requirements,
  };
}
