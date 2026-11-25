
/**
 * BEHAR LMS — P14.4.0.4
 * Assessment Attempt Storage
 *
 * Frontend-only development implementation.
 * localStorage is NOT trusted or authoritative.
 */

import { scoreAssessment } from "./assessmentScoring";

export const ASSESSMENT_STORAGE_KEY =
  "behar:assessment-attempts:v1";

export const ATTEMPT_STATUS = Object.freeze({
  IN_PROGRESS: "in_progress",
  SUBMITTED: "submitted",
});

const STORAGE_VERSION = 1;

function storageAvailable() {
  try {
    return typeof window !== "undefined" &&
      typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

function requireStorage() {
  if (!storageAvailable()) {
    throw new Error("Local storage is unavailable.");
  }

  return window.localStorage;
}

function createId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `attempt-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function createEmptyStore() {
  return {
    version: STORAGE_VERSION,
    attempts: [],
  };
}

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function isValidAnswerMap(answers) {
  if (!isPlainObject(answers)) return false;

  return Object.values(answers).every(
    (answer) =>
      Array.isArray(answer) &&
      answer.every((id) => typeof id === "string")
  );
}

function isValidAttempt(attempt) {
  if (!isPlainObject(attempt)) return false;

  const validStatus =
    attempt.status === ATTEMPT_STATUS.IN_PROGRESS ||
    attempt.status === ATTEMPT_STATUS.SUBMITTED;

  return (
    typeof attempt.id === "string" &&
    attempt.id.length > 0 &&
    typeof attempt.assessmentId === "string" &&
    attempt.assessmentId.length > 0 &&
    typeof attempt.studentId === "string" &&
    attempt.studentId.length > 0 &&
    validStatus &&
    Number.isInteger(attempt.attemptNumber) &&
    attempt.attemptNumber >= 1 &&
    typeof attempt.startedAt === "string" &&
    typeof attempt.updatedAt === "string" &&
    isValidAnswerMap(attempt.answers) &&
    (
      attempt.status !== ATTEMPT_STATUS.SUBMITTED ||
      (
        typeof attempt.submittedAt === "string" &&
        isPlainObject(attempt.result) &&
        attempt.result.assessmentId === attempt.assessmentId
      )
    )
  );
}

function readStore() {
  const storage = requireStorage();
  const raw = storage.getItem(ASSESSMENT_STORAGE_KEY);

  if (raw === null) {
    return createEmptyStore();
  }

  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Assessment storage contains invalid JSON.");
  }

  if (
    !isPlainObject(parsed) ||
    parsed.version !== STORAGE_VERSION ||
    !Array.isArray(parsed.attempts) ||
    !parsed.attempts.every(isValidAttempt)
  ) {
    throw new Error(
      "Assessment storage is corrupted or uses an unsupported version."
    );
  }

  const ids = parsed.attempts.map((attempt) => attempt.id);

  if (new Set(ids).size !== ids.length) {
    throw new Error("Assessment storage contains duplicate IDs.");
  }

  return parsed;
}

function writeStore(store) {
  const storage = requireStorage();

  try {
    storage.setItem(
      ASSESSMENT_STORAGE_KEY,
      JSON.stringify(store)
    );
  } catch {
    throw new Error("Unable to save assessment data.");
  }
}

function validateIdentity(assessmentId, studentId) {
  if (
    typeof assessmentId !== "string" ||
    !assessmentId.trim() ||
    typeof studentId !== "string" ||
    !studentId.trim()
  ) {
    throw new Error(
      "Assessment ID and student ID are required."
    );
  }
}

function validateAssessment(assessment) {
  if (
    !isPlainObject(assessment) ||
    typeof assessment.id !== "string" ||
    !assessment.id
  ) {
    throw new Error("A valid assessment is required.");
  }

  const maxAttempts = assessment.settings?.maxAttempts;

  if (
    !Number.isInteger(maxAttempts) ||
    maxAttempts < 1
  ) {
    throw new Error("Invalid maximum attempt setting.");
  }
}

function validateAnswer(question, selectedOptionIds) {
  if (!question || !Array.isArray(question.options)) {
    throw new Error("Invalid question.");
  }

  if (
    !Array.isArray(selectedOptionIds) ||
    !selectedOptionIds.every(
      (id) => typeof id === "string"
    )
  ) {
    throw new Error("Answers must be an array of option IDs.");
  }

  const selected = new Set(selectedOptionIds);
  const validOptions = new Set(
    question.options.map((option) => option.id)
  );

  if (selected.size !== selectedOptionIds.length) {
    throw new Error("Duplicate option IDs are not allowed.");
  }

  if (
    selectedOptionIds.some((id) => !validOptions.has(id))
  ) {
    throw new Error("Answer contains an unknown option ID.");
  }

  if (
    question.type !== "multiple_choice" &&
    selectedOptionIds.length > 1
  ) {
    throw new Error(
      "This question accepts only one answer."
    );
  }
}

function findAttempt(store, attemptId) {
  return store.attempts.find(
    (attempt) => attempt.id === attemptId
  );
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Return all attempts for one student and assessment.
 */
export function getAssessmentAttempts(
  assessmentId,
  studentId
) {
  validateIdentity(assessmentId, studentId);

  const store = readStore();

  return clone(
    store.attempts
      .filter(
        (attempt) =>
          attempt.assessmentId === assessmentId &&
          attempt.studentId === studentId
      )
      .sort(
        (a, b) => b.attemptNumber - a.attemptNumber
      )
  );
}

/**
 * Return the active draft, if one exists.
 */
export function getActiveAssessmentAttempt(
  assessmentId,
  studentId
) {
  return (
    getAssessmentAttempts(assessmentId, studentId).find(
      (attempt) =>
        attempt.status === ATTEMPT_STATUS.IN_PROGRESS
    ) ?? null
  );
}

/**
 * Return only submitted attempts.
 */
export function getSubmittedAssessmentAttempts(
  assessmentId,
  studentId
) {
  return getAssessmentAttempts(
    assessmentId,
    studentId
  ).filter(
    (attempt) =>
      attempt.status === ATTEMPT_STATUS.SUBMITTED
  );
}

/**
 * Return the number of remaining submissions.
 */
export function getRemainingAssessmentAttempts(
  assessment,
  studentId
) {
  validateAssessment(assessment);

  const submitted = getSubmittedAssessmentAttempts(
    assessment.id,
    studentId
  );

  return Math.max(
    0,
    assessment.settings.maxAttempts - submitted.length
  );
}

/**
 * Create or resume an unfinished attempt.
 */
export function startAssessmentAttempt(
  assessment,
  studentId
) {
  validateAssessment(assessment);
  validateIdentity(assessment.id, studentId);

  const store = readStore();

  const related = store.attempts.filter(
    (attempt) =>
      attempt.assessmentId === assessment.id &&
      attempt.studentId === studentId
  );

  const submitted = related.filter(
    (attempt) =>
      attempt.status === ATTEMPT_STATUS.SUBMITTED
  );

  if (
    submitted.length >= assessment.settings.maxAttempts
  ) {
    throw new Error("Maximum assessment attempts reached.");
  }

  const active = related.find(
    (attempt) =>
      attempt.status === ATTEMPT_STATUS.IN_PROGRESS
  );

  if (active) {
    return clone(active);
  }

  const now = new Date().toISOString();

  const attempt = {
    id: createId(),
    assessmentId: assessment.id,
    studentId,
    attemptNumber:
      Math.max(0, ...related.map((a) => a.attemptNumber)) + 1,
    status: ATTEMPT_STATUS.IN_PROGRESS,
    answers: {},
    startedAt: now,
    updatedAt: now,
    submittedAt: null,
    result: null,
  };

  store.attempts.push(attempt);
  writeStore(store);

  return clone(attempt);
}

/**
 * Save one answer into an unfinished attempt.
 */
export function saveAssessmentAnswer({
  attemptId,
  studentId,
  question,
  selectedOptionIds,
}) {
  if (
    typeof attemptId !== "string" ||
    !attemptId ||
    typeof studentId !== "string" ||
    !studentId
  ) {
    throw new Error("Attempt ID and student ID are required.");
  }

  validateAnswer(question, selectedOptionIds);

  const store = readStore();
  const attempt = findAttempt(store, attemptId);

  if (!attempt || attempt.studentId !== studentId) {
    throw new Error("Assessment attempt not found.");
  }

  if (attempt.status !== ATTEMPT_STATUS.IN_PROGRESS) {
    throw new Error("Submitted attempts cannot be edited.");
  }

  if (question.assessmentId !== attempt.assessmentId) {
    throw new Error(
      "Question does not belong to this assessment."
    );
  }

  attempt.answers[question.id] = [...selectedOptionIds];
  attempt.updatedAt = new Date().toISOString();

  writeStore(store);

  return clone(attempt);
}

/**
 * Submit an attempt once.
 *
 * A repeated submission returns the saved result
 * rather than calculating or storing another one.
 */
export function submitAssessmentAttempt({
  attemptId,
  studentId,
  assessment,
  questions,
}) {
  validateAssessment(assessment);

  if (
    typeof attemptId !== "string" ||
    !attemptId ||
    typeof studentId !== "string" ||
    !studentId
  ) {
    throw new Error("Attempt ID and student ID are required.");
  }

  const store = readStore();
  const attempt = findAttempt(store, attemptId);

  if (
    !attempt ||
    attempt.studentId !== studentId ||
    attempt.assessmentId !== assessment.id
  ) {
    throw new Error("Assessment attempt not found.");
  }

  // Idempotent submission.
  if (attempt.status === ATTEMPT_STATUS.SUBMITTED) {
    return clone(attempt);
  }

  const submittedCount = store.attempts.filter(
    (entry) =>
      entry.studentId === studentId &&
      entry.assessmentId === assessment.id &&
      entry.status === ATTEMPT_STATUS.SUBMITTED
  ).length;

  if (submittedCount >= assessment.settings.maxAttempts) {
    throw new Error("Maximum assessment attempts reached.");
  }

  const result = scoreAssessment(
    assessment,
    questions,
    attempt.answers
  );

  const now = new Date().toISOString();

  attempt.status = ATTEMPT_STATUS.SUBMITTED;
  attempt.result = result;
  attempt.submittedAt = now;
  attempt.updatedAt = now;

  writeStore(store);

  return clone(attempt);
}

/**
 * Discard an unfinished draft.
 * Submitted attempts are never deleted by this function.
 */
export function discardAssessmentDraft(
  attemptId,
  studentId
) {
  const store = readStore();

  const attempt = findAttempt(store, attemptId);

  if (!attempt || attempt.studentId !== studentId) {
    throw new Error("Assessment attempt not found.");
  }

  if (attempt.status === ATTEMPT_STATUS.SUBMITTED) {
    throw new Error("Submitted attempts cannot be discarded.");
  }

  store.attempts = store.attempts.filter(
    (entry) => entry.id !== attemptId
  );

  writeStore(store);

  return true;
}

/**
 * Check storage health without modifying saved data.
 */
export function getAssessmentStorageHealth() {
  try {
    const store = readStore();

    return {
      available: true,
      valid: true,
      totalAttempts: store.attempts.length,
      version: store.version,
      error: null,
    };
  } catch (error) {
    return {
      available: storageAvailable(),
      valid: false,
      totalAttempts: 0,
      version: STORAGE_VERSION,
      error: error.message,
    };
  }
}
