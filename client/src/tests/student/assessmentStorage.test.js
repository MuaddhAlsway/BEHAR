
/**
 * BEHAR LMS — P14.4.0.8
 * Step 03: Assessment Storage & Persistence QA
 */

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

import {
  assessments,
  assessmentQuestions,
} from "../../data/student/assessments";

import {
  ASSESSMENT_STORAGE_KEY,
  ATTEMPT_STATUS,
  getAssessmentAttempts,
  getActiveAssessmentAttempt,
  getSubmittedAssessmentAttempts,
  getRemainingAssessmentAttempts,
  startAssessmentAttempt,
  saveAssessmentAnswer,
  submitAssessmentAttempt,
  discardAssessmentDraft,
  getAssessmentStorageHealth,
} from "../../utils/assessmentStorage";

const assessment = assessments.find(
  (item) => item.id === "react-basics-quiz"
);

const questions = assessmentQuestions.filter(
  (item) => item.assessmentId === assessment.id
);

const studentId = "qa-student-001";

const question = (id) =>
  questions.find((item) => item.id === id);

function createMemoryStorage() {
  const data = new Map();

  return {
    getItem: vi.fn((key) =>
      data.has(key) ? data.get(key) : null
    ),
    setItem: vi.fn((key, value) => {
      data.set(key, String(value));
    }),
    removeItem: vi.fn((key) => {
      data.delete(key);
    }),
    clear: vi.fn(() => {
      data.clear();
    }),
    get length() {
      return data.size;
    },
    key: vi.fn((index) =>
      [...data.keys()][index] ?? null
    ),
  };
}

let storage;

beforeEach(() => {
  storage = createMemoryStorage();

  vi.stubGlobal("window", {
    localStorage: storage,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function start(student = studentId) {
  return startAssessmentAttempt(
    assessment,
    student
  );
}

function save(
  attempt,
  questionId,
  selectedOptionIds,
  student = studentId
) {
  return saveAssessmentAnswer({
    attemptId: attempt.id,
    studentId: student,
    question: question(questionId),
    selectedOptionIds,
  });
}

function submit(
  attempt,
  student = studentId
) {
  return submitAssessmentAttempt({
    attemptId: attempt.id,
    studentId: student,
    assessment,
    questions,
  });
}

function answerAll(attempt) {
  save(attempt, "react-q001", ["a"]);
  save(attempt, "react-q002", ["a", "b"]);
  save(attempt, "react-q003", ["true"]);
}

function submitPerfectAttempt() {
  const attempt = start();
  answerAll(attempt);
  return submit(attempt);
}

/* ==========================================
   01 — STORAGE INITIALIZATION
========================================== */

describe("Storage initialization", () => {
  it("starts with a valid empty store", () => {
    const health = getAssessmentStorageHealth();

    expect(health.available).toBe(true);
    expect(health.valid).toBe(true);
    expect(health.totalAttempts).toBe(0);
    expect(health.version).toBe(1);
  });

  it("uses the expected storage key", () => {
    expect(ASSESSMENT_STORAGE_KEY).toBe(
      "behar:assessment-attempts:v1"
    );
  });

  it("creates a versioned storage document", () => {
    start();

    const stored = JSON.parse(
      storage.getItem(ASSESSMENT_STORAGE_KEY)
    );

    expect(stored.version).toBe(1);
    expect(stored.attempts).toHaveLength(1);
  });
});

/* ==========================================
   02 — ATTEMPT CREATION
========================================== */

describe("Attempt creation", () => {
  it("creates an in-progress attempt", () => {
    const attempt = start();

    expect(attempt.id).toBeTruthy();
    expect(attempt.status).toBe(
      ATTEMPT_STATUS.IN_PROGRESS
    );
    expect(attempt.attemptNumber).toBe(1);
    expect(attempt.answers).toEqual({});
  });

  it("assigns the correct identity", () => {
    const attempt = start();

    expect(attempt.assessmentId).toBe(
      assessment.id
    );
    expect(attempt.studentId).toBe(studentId);
  });

  it("creates valid timestamps", () => {
    const attempt = start();

    expect(
      Number.isNaN(Date.parse(attempt.startedAt))
    ).toBe(false);

    expect(
      Number.isNaN(Date.parse(attempt.updatedAt))
    ).toBe(false);
  });

  it("resumes an existing draft", () => {
    const first = start();
    const second = start();

    expect(second.id).toBe(first.id);

    expect(
      getAssessmentAttempts(
        assessment.id,
        studentId
      )
    ).toHaveLength(1);
  });

  it("returns independent copies of attempts", () => {
    const attempt = start();

    attempt.answers.fake = ["modified"];

    const saved = getActiveAssessmentAttempt(
      assessment.id,
      studentId
    );

    expect(saved.answers.fake).toBeUndefined();
  });
});

/* ==========================================
   03 — ANSWER PERSISTENCE
========================================== */

describe("Answer persistence", () => {
  it("saves a single-choice answer", () => {
    const attempt = start();

    save(attempt, "react-q001", ["a"]);

    const saved = getActiveAssessmentAttempt(
      assessment.id,
      studentId
    );

    expect(saved.answers["react-q001"]).toEqual(
      ["a"]
    );
  });

  it("saves multiple-choice answers", () => {
    const attempt = start();

    save(attempt, "react-q002", ["a", "b"]);

    const saved = getActiveAssessmentAttempt(
      assessment.id,
      studentId
    );

    expect(saved.answers["react-q002"]).toEqual(
      ["a", "b"]
    );
  });

  it("allows an answer to be changed", () => {
    const attempt = start();

    save(attempt, "react-q001", ["b"]);
    save(attempt, "react-q001", ["a"]);

    const saved = getActiveAssessmentAttempt(
      assessment.id,
      studentId
    );

    expect(saved.answers["react-q001"]).toEqual(
      ["a"]
    );
  });

  it("allows clearing an answer", () => {
    const attempt = start();

    save(attempt, "react-q001", ["a"]);
    save(attempt, "react-q001", []);

    const saved = getActiveAssessmentAttempt(
      assessment.id,
      studentId
    );

    expect(saved.answers["react-q001"]).toEqual(
      []
    );
  });

  it("recovers answers from stored JSON", () => {
    const attempt = start();

    save(attempt, "react-q001", ["a"]);

    const raw = storage.getItem(
      ASSESSMENT_STORAGE_KEY
    );

    const restoredStorage = createMemoryStorage();

    restoredStorage.setItem(
      ASSESSMENT_STORAGE_KEY,
      raw
    );

    vi.stubGlobal("window", {
      localStorage: restoredStorage,
    });

    const recovered = getActiveAssessmentAttempt(
      assessment.id,
      studentId
    );

    expect(recovered.id).toBe(attempt.id);
    expect(recovered.answers["react-q001"]).toEqual(
      ["a"]
    );
  });
});

/* ==========================================
   04 — ANSWER VALIDATION
========================================== */

describe("Answer validation", () => {
  it("rejects unknown option IDs", () => {
    const attempt = start();

    expect(() =>
      save(
        attempt,
        "react-q001",
        ["unknown-option"]
      )
    ).toThrow(/unknown option/i);
  });

  it("rejects duplicate options", () => {
    const attempt = start();

    expect(() =>
      save(attempt, "react-q002", ["a", "a"])
    ).toThrow(/duplicate option/i);
  });

  it("rejects multiple single-choice answers", () => {
    const attempt = start();

    expect(() =>
      save(attempt, "react-q001", ["a", "b"])
    ).toThrow(/only one answer/i);
  });

  it("rejects non-array answers", () => {
    const attempt = start();

    expect(() =>
      save(attempt, "react-q001", "a")
    ).toThrow(/array of option IDs/i);
  });

  it("rejects another student's update", () => {
    const attempt = start();

    expect(() =>
      save(
        attempt,
        "react-q001",
        ["a"],
        "another-student"
      )
    ).toThrow(/attempt not found/i);
  });

  it("rejects questions from another assessment", () => {
    const attempt = start();

    expect(() =>
      saveAssessmentAnswer({
        attemptId: attempt.id,
        studentId,
        question: {
          ...question("react-q001"),
          assessmentId: "other-assessment",
        },
        selectedOptionIds: ["a"],
      })
    ).toThrow(/does not belong/i);
  });
});

/* ==========================================
   05 — SUBMISSION
========================================== */

describe("Assessment submission", () => {
  it("submits an attempt successfully", () => {
    const submitted = submitPerfectAttempt();

    expect(submitted.status).toBe(
      ATTEMPT_STATUS.SUBMITTED
    );
    expect(submitted.submittedAt).toBeTruthy();
  });

  it("stores the calculated result", () => {
    const submitted = submitPerfectAttempt();

    expect(submitted.result.percentage).toBe(100);
    expect(submitted.result.passed).toBe(true);
    expect(submitted.result.earnedPoints).toBe(30);
  });

  it("supports submitting unanswered questions", () => {
    const attempt = start();
    const submitted = submit(attempt);

    expect(submitted.result.percentage).toBe(0);
    expect(submitted.result.unansweredCount).toBe(3);
  });

  it("prevents editing submitted attempts", () => {
    const submitted = submitPerfectAttempt();

    expect(() =>
      save(submitted, "react-q001", ["b"])
    ).toThrow(/cannot be edited/i);
  });

  it("prevents discarding submitted attempts", () => {
    const submitted = submitPerfectAttempt();

    expect(() =>
      discardAssessmentDraft(
        submitted.id,
        studentId
      )
    ).toThrow(/cannot be discarded/i);
  });

  it("returns the saved result on repeated submission", () => {
    const submitted = submitPerfectAttempt();

    const repeated = submit(submitted);

    expect(repeated.id).toBe(submitted.id);
    expect(repeated.result).toEqual(
      submitted.result
    );

    expect(
      getSubmittedAssessmentAttempts(
        assessment.id,
        studentId
      )
    ).toHaveLength(1);
  });
});

/* ==========================================
   06 — MAXIMUM ATTEMPTS
========================================== */

describe("Maximum attempt enforcement", () => {
  it("starts with three remaining attempts", () => {
    expect(
      getRemainingAssessmentAttempts(
        assessment,
        studentId
      )
    ).toBe(3);
  });

  it("reduces remaining attempts after submission", () => {
    submit(start());

    expect(
      getRemainingAssessmentAttempts(
        assessment,
        studentId
      )
    ).toBe(2);
  });

  it("allows three submitted attempts", () => {
    for (let index = 0; index < 3; index++) {
      submit(start());
    }

    expect(
      getSubmittedAssessmentAttempts(
        assessment.id,
        studentId
      )
    ).toHaveLength(3);

    expect(
      getRemainingAssessmentAttempts(
        assessment,
        studentId
      )
    ).toBe(0);
  });

  it("blocks a fourth attempt", () => {
    for (let index = 0; index < 3; index++) {
      submit(start());
    }

    expect(() => start()).toThrow(
      /maximum assessment attempts reached/i
    );
  });

  it("does not consume an attempt for an unfinished draft", () => {
    start();

    expect(
      getRemainingAssessmentAttempts(
        assessment,
        studentId
      )
    ).toBe(3);
  });
});

/* ==========================================
   07 — STUDENT ISOLATION
========================================== */

describe("Student isolation", () => {
  it("separates attempts by student", () => {
    start("student-a");
    start("student-b");

    expect(
      getAssessmentAttempts(
        assessment.id,
        "student-a"
      )
    ).toHaveLength(1);

    expect(
      getAssessmentAttempts(
        assessment.id,
        "student-b"
      )
    ).toHaveLength(1);
  });

  it("does not expose another student's attempts", () => {
    start("student-a");

    expect(
      getAssessmentAttempts(
        assessment.id,
        "student-b"
      )
    ).toEqual([]);
  });

  it("blocks another student from submitting", () => {
    const attempt = start("student-a");

    expect(() =>
      submit(attempt, "student-b")
    ).toThrow(/attempt not found/i);
  });
});

/* ==========================================
   08 — DRAFT MANAGEMENT
========================================== */

describe("Draft management", () => {
  it("discards an unfinished draft", () => {
    const attempt = start();

    expect(
      discardAssessmentDraft(
        attempt.id,
        studentId
      )
    ).toBe(true);

    expect(
      getActiveAssessmentAttempt(
        assessment.id,
        studentId
      )
    ).toBeNull();
  });

  it("allows starting again after discarding", () => {
    const first = start();

    discardAssessmentDraft(
      first.id,
      studentId
    );

    const second = start();

    expect(second.id).not.toBe(first.id);
    expect(second.attemptNumber).toBe(1);
  });

  it("returns submitted history newest first", () => {
    submit(start());
    submit(start());

    const history = getSubmittedAssessmentAttempts(
      assessment.id,
      studentId
    );

    expect(
      history.map((attempt) => attempt.attemptNumber)
    ).toEqual([2, 1]);
  });
});

/* ==========================================
   09 — CORRUPTION & STORAGE ERRORS
========================================== */

describe("Storage corruption and errors", () => {
  it("detects invalid JSON", () => {
    storage.setItem(
      ASSESSMENT_STORAGE_KEY,
      "{invalid-json"
    );

    const health = getAssessmentStorageHealth();

    expect(health.valid).toBe(false);
    expect(health.error).toMatch(/invalid JSON/i);
  });

  it("rejects unsupported storage versions", () => {
    storage.setItem(
      ASSESSMENT_STORAGE_KEY,
      JSON.stringify({
        version: 999,
        attempts: [],
      })
    );

    expect(() =>
      getAssessmentAttempts(
        assessment.id,
        studentId
      )
    ).toThrow(/unsupported version/i);
  });

  it("rejects duplicate attempt IDs", () => {
    const attempt = start();

    storage.setItem(
      ASSESSMENT_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        attempts: [attempt, attempt],
      })
    );

    expect(() =>
      getAssessmentAttempts(
        assessment.id,
        studentId
      )
    ).toThrow(/duplicate IDs/i);
  });

  it("reports unavailable localStorage", () => {
    vi.stubGlobal("window", undefined);

    const health = getAssessmentStorageHealth();

    expect(health.available).toBe(false);
    expect(health.valid).toBe(false);
  });

  it("handles storage write failures", () => {
    storage.setItem.mockImplementation(() => {
      throw new Error("Quota exceeded");
    });

    expect(() => start()).toThrow(
      "Unable to save assessment data."
    );
  });

  it("does not overwrite corrupted storage", () => {
    const corrupted = "{broken";

    storage.setItem(
      ASSESSMENT_STORAGE_KEY,
      corrupted
    );

    expect(() => start()).toThrow(/invalid JSON/i);

    expect(
      storage.getItem(ASSESSMENT_STORAGE_KEY)
    ).toBe(corrupted);
  });
});
