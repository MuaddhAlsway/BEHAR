
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAssessmentById,
  getAssessmentQuestions,
  validateAssessmentRelationships,
} from "../utils/assessmentService";

import {
  ATTEMPT_STATUS,
  getAssessmentAttempts,
  getActiveAssessmentAttempt,
  getRemainingAssessmentAttempts,
  startAssessmentAttempt,
  saveAssessmentAnswer,
  submitAssessmentAttempt,
  discardAssessmentDraft,
} from "../utils/assessmentStorage";

function normalizeAnswers(answers) {
  if (!answers || typeof answers !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(answers).map(([id, selected]) => [
      id,
      Array.isArray(selected) ? [...selected] : [],
    ])
  );
}

export default function useAssessment({
  assessmentId,
  studentId,
}) {
  const assessment = useMemo(
    () => getAssessmentById(assessmentId),
    [assessmentId]
  );

  const questions = useMemo(
    () => getAssessmentQuestions(assessmentId),
    [assessmentId]
  );

  const validation = useMemo(
    () => validateAssessmentRelationships(assessmentId),
    [assessmentId]
  );

  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [history, setHistory] = useState([]);
  const [remainingAttempts, setRemainingAttempts] =
    useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    if (!assessment || !studentId) {
      setAttempt(null);
      setAnswers({});
      setHistory([]);
      setRemainingAttempts(0);
      return null;
    }

    const attempts = getAssessmentAttempts(
      assessment.id,
      studentId
    );

    const active = getActiveAssessmentAttempt(
      assessment.id,
      studentId
    );

    const remaining = getRemainingAssessmentAttempts(
      assessment,
      studentId
    );

    setAttempt(active);
    setAnswers(
      active ? normalizeAnswers(active.answers) : {}
    );
    setHistory(
      attempts.filter(
        (item) =>
          item.status === ATTEMPT_STATUS.SUBMITTED
      )
    );
    setRemainingAttempts(remaining);

    return active;
  }, [assessment, studentId]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      if (!validation.valid) {
        throw new Error(
          validation.errors?.join("; ") ||
            "Invalid assessment data."
        );
      }

      refresh();
    } catch (err) {
      setAttempt(null);
      setAnswers({});
      setHistory([]);
      setRemainingAttempts(0);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [refresh, validation]);

  const start = useCallback(() => {
    setError(null);

    try {
      if (!assessment || !studentId) {
        throw new Error("Assessment and student are required.");
      }

      if (!validation.valid) {
        throw new Error("Assessment data is invalid.");
      }

      const next = startAssessmentAttempt(
        assessment,
        studentId
      );

      setAttempt(next);
      setAnswers(normalizeAnswers(next.answers));
      refresh();

      return next;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [assessment, studentId, validation, refresh]);

  const setAnswer = useCallback(
    (questionId, selectedOptionIds) => {
      setError(null);

      if (!attempt) {
        setError("Start an assessment before answering.");
        return false;
      }

      if (attempt.status !== ATTEMPT_STATUS.IN_PROGRESS) {
        setError("This attempt has already been submitted.");
        return false;
      }

      const question = questions.find(
        (item) => item.id === questionId
      );

      if (!question) {
        setError("Question not found.");
        return false;
      }

      setSaving(true);

      try {
        const selected = Array.isArray(selectedOptionIds)
          ? [...selectedOptionIds]
          : [selectedOptionIds];

        const updated = saveAssessmentAnswer({
          attemptId: attempt.id,
          studentId,
          question,
          selectedOptionIds: selected,
        });

        setAttempt(updated);
        setAnswers(normalizeAnswers(updated.answers));

        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [attempt, questions, studentId]
  );

  const toggleAnswer = useCallback(
    (questionId, optionId) => {
      const question = questions.find(
        (item) => item.id === questionId
      );

      if (!question) {
        setError("Question not found.");
        return false;
      }

      const current = answers[questionId] ?? [];

      if (question.type === "multiple_choice") {
        const next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];

        return setAnswer(questionId, next);
      }

      return setAnswer(questionId, [optionId]);
    },
    [answers, questions, setAnswer]
  );

  const submit = useCallback(() => {
    setError(null);

    if (!attempt) {
      setError("No active assessment attempt.");
      return null;
    }

    setSubmitting(true);

    try {
      const completed = submitAssessmentAttempt({
        attemptId: attempt.id,
        studentId,
        assessment,
        questions,
      });

      refresh();

      return completed;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [
    attempt,
    studentId,
    assessment,
    questions,
    refresh,
  ]);

  const discard = useCallback(() => {
    setError(null);

    if (!attempt) {
      return false;
    }

    try {
      discardAssessmentDraft(
        attempt.id,
        studentId
      );

      refresh();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [attempt, studentId, refresh]);

  const answeredCount = useMemo(
    () =>
      questions.filter(
        (question) =>
          Array.isArray(answers[question.id]) &&
          answers[question.id].length > 0
      ).length,
    [questions, answers]
  );

  const totalQuestions = questions.length;

  const progress = totalQuestions
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0;

  const isActive =
    attempt?.status === ATTEMPT_STATUS.IN_PROGRESS;

  const canStart =
    !loading &&
    !error &&
    validation.valid &&
    remainingAttempts > 0;

  return {
    assessment,
    questions,
    validation,

    attempt,
    answers,
    history,
    remainingAttempts,

    loading,
    saving,
    submitting,
    error,

    answeredCount,
    totalQuestions,
    progress,

    isActive,
    canStart,

    start,
    setAnswer,
    toggleAnswer,
    submit,
    discard,
    refresh,
    clearError: () => setError(null),
  };
}
