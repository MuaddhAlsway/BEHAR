
export const certificateRequirementDefinitions = {
  "course-001": {
    lessons: {
      required: 19,
    },
    quizzes: [
      { id: "react-quiz-01", passingScore: 70 },
      { id: "react-quiz-02", passingScore: 70 },
    ],
    assignments: [
      "assignment-001",
      "assignment-005",
      "assignment-006",
    ],
    finalAssessment: {
      id: "react-final",
      passingScore: 75,
    },
  },

  "course-002": {
    lessons: { required: 12 },
    quizzes: [
      { id: "design-quiz-01", passingScore: 70 },
    ],
    assignments: ["design-assignment-01"],
    finalAssessment: null,
  },

  "course-004": {
    lessons: { required: 10 },
    quizzes: [
      { id: "ai-quiz-01", passingScore: 70 },
    ],
    assignments: [],
    finalAssessment: null,
  },

  "course-005": {
    lessons: { required: 14 },
    quizzes: [
      { id: "marketing-quiz-01", passingScore: 70 },
    ],
    assignments: ["marketing-assignment-01"],
    finalAssessment: null,
  },
};

// Mock learning records.
// These are NOT authoritative student records.
export const demoCertificateLearningRecords = {
  "course-001": {
    lessons: {
      completed: 13,
    },
    quizzes: {
      "react-quiz-01": { score: 84 },
      "react-quiz-02": { score: null },
    },
    assignments: {
      "assignment-001": {
        status: "passed",
        grade: 88,
      },
      "assignment-005": {
        status: "submitted",
        grade: null,
      },
      "assignment-006": {
        status: "not-started",
        grade: null,
      },
    },
    finalAssessments: {
      "react-final": { score: null },
    },
  },

  "course-002": {
    lessons: { completed: 12 },
    quizzes: {
      "design-quiz-01": { score: 91 },
    },
    assignments: {
      "design-assignment-01": {
        status: "passed",
        grade: 94,
      },
    },
    finalAssessments: {},
  },

  "course-004": {
    lessons: { completed: 0 },
    quizzes: {},
    assignments: {},
    finalAssessments: {},
  },

  "course-005": {
    lessons: { completed: 14 },
    quizzes: {
      "marketing-quiz-01": { score: 86 },
    },
    assignments: {
      "marketing-assignment-01": {
        status: "passed",
        grade: 90,
      },
    },
    finalAssessments: {},
  },
};
