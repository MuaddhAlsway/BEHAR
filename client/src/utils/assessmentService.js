
/**
 * BEHAR LMS
 * P14.4.0.2 — Assessment Data Service
 *
 * Frontend-only assessment retrieval and validation.
 *
 * Responsibilities:
 * - Retrieve assessments by ID, course, or lesson
 * - Retrieve questions belonging to an assessment
 * - Validate assessment configuration
 * - Validate question structure
 * - Validate assessment/question relationships
 * - Support bilingual content
 *
 * Excludes:
 * - Scoring
 * - Attempts
 * - localStorage
 * - React state
 * - UI components
 */

import {
  assessments,
  assessmentQuestions,
  QUESTION_TYPES,
  ASSESSMENT_TYPES,
} from "../data/student/assessments";

/* ==========================================
   CONSTANTS
========================================== */

export const SUPPORTED_LANGUAGES = Object.freeze([
  "en",
  "ar",
]);

const VALID_QUESTION_TYPES = new Set(
  Object.values(QUESTION_TYPES)
);

const VALID_ASSESSMENT_TYPES = new Set(
  Object.values(ASSESSMENT_TYPES)
);

/* ==========================================
   INTERNAL HELPERS
========================================== */

function isNonEmptyString(value) {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

function isLocalizedText(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    SUPPORTED_LANGUAGES.every(
      (language) => isNonEmptyString(value[language])
    )
  );
}

function hasUniqueIds(items) {
  const ids = items.map((item) => item?.id);

  return (
    ids.every(isNonEmptyString) &&
    new Set(ids).size === ids.length
  );
}

function hasUniqueValues(values) {
  return new Set(values).size === values.length;
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function isValidPercentage(value) {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 100
  );
}

/* ==========================================
   LOCALIZATION
========================================== */

/**
 * Resolve bilingual text.
 *
 * @param {object|string} value
 * @param {"en"|"ar"} language
 * @returns {string}
 */
export function getLocalizedText(
  value,
  language = "en"
) {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  const selectedLanguage =
    SUPPORTED_LANGUAGES.includes(language)
      ? language
      : "en";

  return (
    value[selectedLanguage] ||
    value.en ||
    value.ar ||
    ""
  );
}

/* ==========================================
   ASSESSMENT RETRIEVAL
========================================== */

/**
 * Retrieve an assessment by ID.
 *
 * @param {string} assessmentId
 * @returns {object|null}
 */
export function getAssessmentById(assessmentId) {
  if (!isNonEmptyString(assessmentId)) {
    return null;
  }

  return (
    assessments.find(
      (assessment) => assessment.id === assessmentId
    ) || null
  );
}

/**
 * Retrieve all assessments associated with a course.
 *
 * Unlinked assessments are excluded automatically.
 *
 * @param {string} courseId
 * @returns {Array}
 */
export function getAssessmentsByCourse(courseId) {
  if (!isNonEmptyString(courseId)) {
    return [];
  }

  return assessments.filter(
    (assessment) =>
      assessment.linked === true &&
      assessment.courseId === courseId
  );
}

/**
 * Retrieve assessments associated with a lesson.
 *
 * @param {string} lessonId
 * @returns {Array}
 */
export function getAssessmentsByLesson(lessonId) {
  if (!isNonEmptyString(lessonId)) {
    return [];
  }

  return assessments.filter(
    (assessment) =>
      assessment.linked === true &&
      assessment.lessonId === lessonId
  );
}

/**
 * Retrieve one assessment for a specific
 * course and lesson.
 *
 * @param {string} courseId
 * @param {string} lessonId
 * @returns {object|null}
 */
export function getAssessmentByCourseAndLesson(
  courseId,
  lessonId
) {
  if (
    !isNonEmptyString(courseId) ||
    !isNonEmptyString(lessonId)
  ) {
    return null;
  }

  return (
    assessments.find(
      (assessment) =>
        assessment.linked === true &&
        assessment.courseId === courseId &&
        assessment.lessonId === lessonId
    ) || null
  );
}

/**
 * Retrieve published and linked assessments.
 *
 * @returns {Array}
 */
export function getPublishedAssessments() {
  return assessments.filter(
    (assessment) =>
      assessment.published === true &&
      assessment.linked === true
  );
}

/* ==========================================
   QUESTION RETRIEVAL
========================================== */

/**
 * Retrieve one question by ID.
 *
 * @param {string} questionId
 * @returns {object|null}
 */
export function getQuestionById(questionId) {
  if (!isNonEmptyString(questionId)) {
    return null;
  }

  return (
    assessmentQuestions.find(
      (question) => question.id === questionId
    ) || null
  );
}

/**
 * Retrieve questions in the order specified
 * by the assessment's questionIds.
 *
 * Invalid or missing question references are
 * omitted from the result.
 *
 * @param {string} assessmentId
 * @returns {Array}
 */
export function getAssessmentQuestions(assessmentId) {
  const assessment = getAssessmentById(assessmentId);

  if (!assessment) {
    return [];
  }

  if (!Array.isArray(assessment.questionIds)) {
    return [];
  }

  return assessment.questionIds
    .map((questionId) => getQuestionById(questionId))
    .filter(
      (question) =>
        question !== null &&
        question.assessmentId === assessment.id
    );
}

/* ==========================================
   QUESTION VALIDATION
========================================== */

/**
 * Validate one assessment question.
 *
 * @param {object} question
 * @returns {{valid:boolean,errors:string[]}}
 */
export function validateQuestion(question) {
  const errors = [];

  if (!question || typeof question !== "object") {
    return {
      valid: false,
      errors: ["Question must be an object."],
    };
  }

  if (!isNonEmptyString(question.id)) {
    errors.push("Question ID is required.");
  }

  if (!isNonEmptyString(question.assessmentId)) {
    errors.push("Assessment ID is required.");
  }

  if (!VALID_QUESTION_TYPES.has(question.type)) {
    errors.push("Unsupported question type.");
  }

  if (!isPositiveInteger(question.order)) {
    errors.push("Question order must be a positive integer.");
  }

  if (
    typeof question.points !== "number" ||
    !Number.isFinite(question.points) ||
    question.points <= 0
  ) {
    errors.push("Question points must be greater than zero.");
  }

  if (!isLocalizedText(question.question)) {
    errors.push(
      "Question text must contain English and Arabic."
    );
  }

  if (!isLocalizedText(question.explanation)) {
    errors.push(
      "Question explanation must contain English and Arabic."
    );
  }

  if (
    !Array.isArray(question.options) ||
    question.options.length < 2
  ) {
    errors.push(
      "Question must contain at least two options."
    );
  } else {
    if (!hasUniqueIds(question.options)) {
      errors.push("Question option IDs must be unique.");
    }

    question.options.forEach((option, index) => {
      if (!isLocalizedText(option?.text)) {
        errors.push(
          `Option ${index + 1} requires English and Arabic text.`
        );
      }
    });
  }

  if (
    !Array.isArray(question.correctOptionIds) ||
    question.correctOptionIds.length === 0
  ) {
    errors.push(
      "Question must have at least one correct option."
    );
  } else {
    if (!hasUniqueValues(question.correctOptionIds)) {
      errors.push("Correct option IDs must be unique.");
    }

    const optionIds = new Set(
      Array.isArray(question.options)
        ? question.options.map((option) => option?.id)
        : []
    );

    question.correctOptionIds.forEach((optionId) => {
      if (!optionIds.has(optionId)) {
        errors.push(
          `Correct option "${optionId}" does not exist.`
        );
      }
    });
  }

  if (
    question.type === QUESTION_TYPES.SINGLE_CHOICE ||
    question.type === QUESTION_TYPES.TRUE_FALSE
  ) {
    if (question.correctOptionIds?.length !== 1) {
      errors.push(
        "Single-choice and true/false questions require exactly one correct answer."
      );
    }
  }

  if (question.type === QUESTION_TYPES.TRUE_FALSE) {
    const ids = Array.isArray(question.options)
      ? question.options.map((option) => option.id)
      : [];

    if (
      ids.length !== 2 ||
      !ids.includes("true") ||
      !ids.includes("false")
    ) {
      errors.push(
        "True/false questions require true and false options."
      );
    }
  }

  if (question.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
    if (question.correctOptionIds?.length < 2) {
      errors.push(
        "Multiple-choice questions require at least two correct answers."
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/* ==========================================
   ASSESSMENT VALIDATION
========================================== */

/**
 * Validate assessment metadata and settings.
 *
 * @param {object} assessment
 * @returns {{valid:boolean,errors:string[]}}
 */
export function validateAssessment(assessment) {
  const errors = [];

  if (!assessment || typeof assessment !== "object") {
    return {
      valid: false,
      errors: ["Assessment must be an object."],
    };
  }

  if (!isNonEmptyString(assessment.id)) {
    errors.push("Assessment ID is required.");
  }

  if (!VALID_ASSESSMENT_TYPES.has(assessment.type)) {
    errors.push("Unsupported assessment type.");
  }

  if (!isLocalizedText(assessment.title)) {
    errors.push(
      "Assessment title requires English and Arabic."
    );
  }

  if (!isLocalizedText(assessment.description)) {
    errors.push(
      "Assessment description requires English and Arabic."
    );
  }

  if (!isLocalizedText(assessment.instructions)) {
    errors.push(
      "Assessment instructions require English and Arabic."
    );
  }

  if (
    !Array.isArray(assessment.questionIds) ||
    assessment.questionIds.length === 0
  ) {
    errors.push(
      "Assessment must reference at least one question."
    );
  } else if (!hasUniqueValues(assessment.questionIds)) {
    errors.push("Assessment question IDs must be unique.");
  }

  if (typeof assessment.linked !== "boolean") {
    errors.push("Assessment linked must be a boolean.");
  }

  if (typeof assessment.published !== "boolean") {
    errors.push("Assessment published must be a boolean.");
  }

  if (assessment.linked === true) {
    if (!isNonEmptyString(assessment.courseId)) {
      errors.push("Linked assessment requires a course ID.");
    }

    if (!isNonEmptyString(assessment.moduleId)) {
      errors.push("Linked assessment requires a module ID.");
    }

    if (!isNonEmptyString(assessment.lessonId)) {
      errors.push("Linked assessment requires a lesson ID.");
    }
  }

  if (
    assessment.published === true &&
    assessment.linked !== true
  ) {
    errors.push(
      "Unlinked assessments cannot be published."
    );
  }

  const settings = assessment.settings;

  if (!settings || typeof settings !== "object") {
    errors.push("Assessment settings are required.");
  } else {
    if (!isValidPercentage(settings.passingScore)) {
      errors.push(
        "Passing score must be between 0 and 100."
      );
    }

    if (!isPositiveInteger(settings.timeLimitMinutes)) {
      errors.push(
        "Time limit must be a positive integer."
      );
    }

    if (!isPositiveInteger(settings.maxAttempts)) {
      errors.push(
        "Maximum attempts must be a positive integer."
      );
    }

    [
      "shuffleQuestions",
      "shuffleOptions",
      "showCorrectAnswers",
      "showExplanations",
    ].forEach((key) => {
      if (typeof settings[key] !== "boolean") {
        errors.push(
          `Assessment setting "${key}" must be a boolean.`
        );
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/* ==========================================
   RELATIONSHIP VALIDATION
========================================== */

/**
 * Validate an assessment and all its questions.
 *
 * Note: This checks relationships within the
 * assessment fixture. It does not verify IDs
 * against external course/module/lesson datasets.
 *
 * @param {string} assessmentId
 * @returns {{valid:boolean,errors:string[]}}
 */
export function validateAssessmentRelationships(
  assessmentId
) {
  const assessment = getAssessmentById(assessmentId);

  if (!assessment) {
    return {
      valid: false,
      errors: ["Assessment not found."],
    };
  }

  const errors = [
    ...validateAssessment(assessment).errors,
  ];

  if (!Array.isArray(assessment.questionIds)) {
    return {
      valid: false,
      errors,
    };
  }

  const questionOrders = [];

  assessment.questionIds.forEach((questionId) => {
    const question = getQuestionById(questionId);

    if (!question) {
      errors.push(
        `Missing question reference: ${questionId}`
      );
      return;
    }

    if (question.assessmentId !== assessment.id) {
      errors.push(
        `Question "${questionId}" belongs to another assessment.`
      );
    }

    const result = validateQuestion(question);

    result.errors.forEach((error) => {
      errors.push(`${questionId}: ${error}`);
    });

    questionOrders.push(question.order);
  });

  if (!hasUniqueValues(questionOrders)) {
    errors.push(
      "Question order values must be unique."
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/* ==========================================
   DATASET VALIDATION
========================================== */

/**
 * Validate the complete assessment dataset.
 *
 * Useful during development and automated tests.
 *
 * @returns {{valid:boolean,errors:string[]}}
 */
export function validateAssessmentDataset() {
  const errors = [];

  if (!hasUniqueIds(assessments)) {
    errors.push(
      "Assessment IDs must be unique and non-empty."
    );
  }

  if (!hasUniqueIds(assessmentQuestions)) {
    errors.push(
      "Question IDs must be unique and non-empty."
    );
  }

  assessments.forEach((assessment) => {
    const result = validateAssessmentRelationships(
      assessment.id
    );

    result.errors.forEach((error) => {
      errors.push(`${assessment.id}: ${error}`);
    });
  });

  assessmentQuestions.forEach((question) => {
    if (!getAssessmentById(question.assessmentId)) {
      errors.push(
        `Orphan question: ${question.id}`
      );
    }

    const owner = getAssessmentById(
      question.assessmentId
    );

    if (
      owner &&
      !owner.questionIds?.includes(question.id)
    ) {
      errors.push(
        `Question "${question.id}" is not referenced by its assessment.`
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
