
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  RotateCcw,
  Send,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import useAssessment from "../../../hooks/useAssessment";

// P14.5.0.9.1 — Assessment gamification
import { useGamification } from "../../../context/GamificationContext";
import { GAMIFICATION_EVENT_TYPES } from "../../../data/student/gamification";
import {
  getAssessmentByCourseAndLesson,
  getLocalizedText,
} from "../../../utils/assessmentService";

import "../../../styles/student/assessments/lesson-assessment.css";

const copy = {
  en: {
    eyebrow: "LEARNING / ASSESSMENT",
    start: "Start assessment",
    resume: "Resume assessment",
    title: "Ready to test your knowledge?",
    description: "Complete this assessment to check your understanding.",
    questions: "Questions",
    passing: "Passing score",
    attempts: "Attempts left",
    duration: "Time limit",
    question: "Question",
    previous: "Previous",
    next: "Next question",
    submit: "Submit answers",
    confirmation: "Submit your assessment?",
    confirmationText: "Your answers will be scored and saved.",
    cancel: "Keep reviewing",
    confirm: "Confirm submission",
    answered: "Answered",
    completed: "Assessment completed",
    passed: "Assessment passed",
    failed: "Assessment not passed",
    retry: "Try again",
    maxAttempts: "No attempts remaining",
    history: "Previous attempts",
    autosave: "Answers are saved automatically",
    select: "Select the correct answer",
    selectMultiple: "Select all correct answers",
    score: "Your score",
    result: "Latest result",
    unavailable: "Assessment unavailable",
    error: "Something went wrong",
    loading: "Loading assessment...",
    saving: "Saving...",
    back: "Back to results",
  },
  ar: {
    eyebrow: "التعلم / الاختبار",
    start: "بدء الاختبار",
    resume: "استئناف الاختبار",
    title: "جاهز لاختبار معلوماتك؟",
    description: "أكمل الاختبار لتقييم فهمك للمحتوى.",
    questions: "الأسئلة",
    passing: "درجة النجاح",
    attempts: "المحاولات المتبقية",
    duration: "المدة المحددة",
    question: "السؤال",
    previous: "السابق",
    next: "السؤال التالي",
    submit: "إرسال الإجابات",
    confirmation: "هل تريد إرسال الاختبار؟",
    confirmationText: "سيتم تقييم إجاباتك وحفظ النتيجة.",
    cancel: "متابعة المراجعة",
    confirm: "تأكيد الإرسال",
    answered: "تمت الإجابة",
    completed: "اكتمل الاختبار",
    passed: "اجتزت الاختبار",
    failed: "لم تجتز الاختبار",
    retry: "إعادة المحاولة",
    maxAttempts: "لا توجد محاولات متبقية",
    history: "المحاولات السابقة",
    autosave: "يتم حفظ الإجابات تلقائياً",
    select: "اختر الإجابة الصحيحة",
    selectMultiple: "اختر جميع الإجابات الصحيحة",
    score: "درجتك",
    result: "آخر نتيجة",
    unavailable: "الاختبار غير متاح",
    error: "حدث خطأ",
    loading: "جاري تحميل الاختبار...",
    saving: "جاري الحفظ...",
    back: "العودة للنتائج",
  },
};

function AssessmentExperience({
  assessmentId,
  studentId,
  language,
}) {
  const t = copy[language];
  const { applyVerifiedEvent } = useGamification();

  const {
    assessment,
    questions,
    attempt,
    answers,
    history,
    remainingAttempts,
    answeredCount,
    totalQuestions,
    progress,
    loading,
    saving,
    submitting,
    error,
    isActive,
    canStart,
    start,
    toggleAnswer,
    submit,
  } = useAssessment({ assessmentId, studentId });

  const [questionIndex, setQuestionIndex] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [view, setView] = useState("assessment");
  const [submittedResult, setSubmittedResult] = useState(null);

  const question = questions[questionIndex];
  const selected = question
    ? answers[question.id] ?? []
    : [];

  const latest = [...history].sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() -
      new Date(a.submittedAt).getTime()
  )[0];

  const result = submittedResult ?? latest?.result ?? null;

  const PreviousIcon =
    language === "ar" ? ArrowRight : ArrowLeft;
  const NextIcon =
    language === "ar" ? ArrowLeft : ArrowRight;

  function handleStart() {
    const next = start();

    if (next) {
      setQuestionIndex(0);
      setSubmittedResult(null);
      setView("assessment");
    }
  }

  function handleSubmit() {
    // The assessment hook returns a completed attempt.
    // Only award XP after the result has been finalized.
    const completed = submit();
    setConfirmOpen(false);

    if (!completed?.result) return;

    setSubmittedResult(completed.result);
    setView("result");

    if (!completed.result.passed) return;

    // Require a stable attempt ID for reward deduplication.
    const attemptId =
      completed.id ??
      completed.attemptId ??
      attempt?.id;

    if (
      attemptId == null ||
      String(attemptId).trim() === ""
    ) {
      console.warn(
        "Quiz XP skipped: completed attempt has no stable ID."
      );
      return;
    }

    const eventId = `${studentId}:${assessmentId}:${attemptId}`;

    applyVerifiedEvent(
      {
        type: GAMIFICATION_EVENT_TYPES.QUIZ_PASSED,
        eventId,
      },
      { language }
    );

    // A perfect score receives a separate bonus.
    if (
      Number(completed.result.maxPoints) > 0 &&
      Number(completed.result.earnedPoints) ===
        Number(completed.result.maxPoints)
    ) {
      applyVerifiedEvent(
        {
          type: GAMIFICATION_EVENT_TYPES.QUIZ_PERFECT,
          eventId,
        },
        { language }
      );
    }
  }

  if (loading) {
    return (
      <div className="behar-lesson-assessment__message">
        {t.loading}
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="behar-lesson-assessment__message">
        {t.unavailable}
      </div>
    );
  }

  return (
    <section
      className="behar-lesson-assessment"
      lang={language}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="behar-lesson-assessment__heading">
        <span className="behar-lesson-assessment__eyebrow">
          <BookOpenCheck size={16} />
          {t.eyebrow}
        </span>

        <h2>
          {getLocalizedText(
            assessment.title,
            language
          )}
        </h2>

        <p>
          {getLocalizedText(
            assessment.description,
            language
          )}
        </p>
      </div>

      {error && (
        <div
          className="behar-lesson-assessment__error"
          role="alert"
        >
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {view === "result" && result && !isActive ? (
        <div className="behar-lesson-assessment__result">
          <div className="behar-lesson-assessment__result-icon">
            {result.passed ? (
              <CheckCircle2 size={35} />
            ) : (
              <AlertCircle size={35} />
            )}
          </div>

          <span className="behar-lesson-assessment__eyebrow">
            {t.completed}
          </span>

          <strong className="behar-lesson-assessment__score">
            {result.percentage}%
          </strong>

          <h3>
            {result.passed ? t.passed : t.failed}
          </h3>

          <p>
            {result.earnedPoints} /{" "}
            {result.maxPoints} points
          </p>

          <div className="behar-lesson-assessment__result-actions">
            {remainingAttempts > 0 && (
              <button
                type="button"
                className="behar-lesson-assessment__primary"
                onClick={handleStart}
                disabled={!canStart}
              >
                <RotateCcw size={17} />
                {t.retry}
              </button>
            )}

            <button
              type="button"
              className="behar-lesson-assessment__secondary"
              onClick={() =>
                setView("assessment")
              }
            >
              {t.back}
            </button>
          </div>
        </div>
      ) : !isActive ? (
        <div className="behar-lesson-assessment__intro">
          <div className="behar-lesson-assessment__intro-icon">
            <ShieldCheck size={34} />
          </div>

          <h3>{t.title}</h3>
          <p>{t.description}</p>

          <div className="behar-lesson-assessment__stats">
            <div>
              <BookOpenCheck size={18} />
              <strong>{totalQuestions}</strong>
              <span>{t.questions}</span>
            </div>

            <div>
              <CheckCircle2 size={18} />
              <strong>
                {assessment.settings.passingScore}%
              </strong>
              <span>{t.passing}</span>
            </div>

            <div>
              <RotateCcw size={18} />
              <strong>{remainingAttempts}</strong>
              <span>{t.attempts}</span>
            </div>

            <div>
              <Clock3 size={18} />
              <strong>
                {assessment.settings.timeLimitMinutes} min
              </strong>
              <span>{t.duration}</span>
            </div>
          </div>

          <button
            type="button"
            className="behar-lesson-assessment__primary"
            onClick={handleStart}
            disabled={!canStart}
          >
            {remainingAttempts > 0
              ? t.start
              : t.maxAttempts}
            <NextIcon size={18} />
          </button>

          {result && (
            <button
              type="button"
              className="behar-lesson-assessment__secondary"
              onClick={() =>
                setView("result")
              }
            >
              {t.result}: {result.percentage}%
            </button>
          )}
        </div>
      ) : (
        <div className="behar-lesson-assessment__workspace">
          <div className="behar-lesson-assessment__progress">
            <div>
              <span>
                {t.answered}: {answeredCount}/
                {totalQuestions}
              </span>
              <strong>{progress}%</strong>
            </div>

            <div
              className="behar-lesson-assessment__track"
              role="progressbar"
              aria-label={t.answered}
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          <div className="behar-lesson-assessment__question-nav">
            {questions.map((item, index) => {
              const answered =
                (answers[item.id] ?? []).length > 0;

              return (
                <button
                  type="button"
                  key={item.id}
                  className={[
                    questionIndex === index
                      ? "is-current"
                      : "",
                    answered
                      ? "is-answered"
                      : "",
                  ].join(" ")}
                  onClick={() =>
                    setQuestionIndex(index)
                  }
                  aria-label={`${t.question} ${index + 1}`}
                  aria-current={
                    questionIndex === index
                      ? "step"
                      : undefined
                  }
                >
                  {answered ? (
                    <Check size={16} />
                  ) : (
                    index + 1
                  )}
                </button>
              );
            })}
          </div>

          {question && (
            <div className="behar-lesson-assessment__question">
              <div className="behar-lesson-assessment__question-meta">
                <span>
                  {t.question} {questionIndex + 1} /{" "}
                  {totalQuestions}
                </span>
                <span>
                  {question.points} PTS
                </span>
              </div>

              <h3>
                {getLocalizedText(
                  question.question,
                  language
                )}
              </h3>

              <p>
                {question.type === "multiple_choice"
                  ? t.selectMultiple
                  : t.select}
              </p>

              <div className="behar-lesson-assessment__options">
                {question.options.map(
                  (option, index) => {
                    const checked =
                      selected.includes(option.id);

                    return (
                      <label
                        key={option.id}
                        className={
                          checked
                            ? "is-selected"
                            : ""
                        }
                      >
                        <input
                          type={
                            question.type ===
                            "multiple_choice"
                              ? "checkbox"
                              : "radio"
                          }
                          name={`assessment-${question.id}`}
                          checked={checked}
                          onChange={() =>
                            toggleAnswer(
                              question.id,
                              option.id
                            )
                          }
                        />

                        <span className="behar-lesson-assessment__letter">
                          {String.fromCharCode(
                            65 + index
                          )}
                        </span>

                        <span className="behar-lesson-assessment__option-text">
                          {getLocalizedText(
                            option.text,
                            language
                          )}
                        </span>

                        {checked ? (
                          <CheckCircle2
                            size={19}
                          />
                        ) : (
                          <Circle size={19} />
                        )}
                      </label>
                    );
                  }
                )}
              </div>

              <div className="behar-lesson-assessment__navigation">
                <button
                  type="button"
                  className="behar-lesson-assessment__secondary"
                  disabled={
                    questionIndex === 0
                  }
                  onClick={() =>
                    setQuestionIndex(
                      (i) => i - 1
                    )
                  }
                >
                  <PreviousIcon size={16} />
                  {t.previous}
                </button>

                {questionIndex <
                totalQuestions - 1 ? (
                  <button
                    type="button"
                    className="behar-lesson-assessment__primary"
                    onClick={() =>
                      setQuestionIndex(
                        (i) => i + 1
                      )
                    }
                  >
                    {t.next}
                    <NextIcon size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="behar-lesson-assessment__primary"
                    onClick={() =>
                      setConfirmOpen(true)
                    }
                    disabled={
                      saving || submitting
                    }
                  >
                    {t.submit}
                    <Send size={16} />
                  </button>
                )}
              </div>

              <div className="behar-lesson-assessment__autosave">
                <CheckCircle2 size={15} />
                {saving
                  ? t.saving
                  : t.autosave}
              </div>
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="behar-lesson-assessment__history">
          <h3>{t.history}</h3>

          {history.map((item) => (
            <div key={item.id}>
              <span>
                #{item.attemptNumber}
              </span>
              <strong>
                {item.result?.percentage ?? 0}%
              </strong>
              <span>
                {item.result?.passed
                  ? t.passed
                  : t.failed}
              </span>
            </div>
          ))}
        </div>
      )}

      {confirmOpen && (
        <div className="behar-lesson-assessment__overlay">
          <div
            className="behar-lesson-assessment__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="assessment-confirm-title"
          >
            <Send size={25} />

            <h3 id="assessment-confirm-title">
              {t.confirmation}
            </h3>

            <p>
              {t.confirmationText}
            </p>

            <strong>
              {answeredCount}/
              {totalQuestions} {t.answered}
            </strong>

            <div>
              <button
                type="button"
                className="behar-lesson-assessment__secondary"
                onClick={() =>
                  setConfirmOpen(false)
                }
              >
                {t.cancel}
              </button>

              <button
                type="button"
                className="behar-lesson-assessment__primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default function LessonAssessment({
  courseId,
  lessonId,
  studentId = "dev-student-001",
  language = "en",
}) {
  const assessment =
    getAssessmentByCourseAndLesson(
      courseId,
      lessonId
    );

  if (!assessment || !assessment.published) {
    return null;
  }

  return (
    <AssessmentExperience
      key={`${assessment.id}:${studentId}`}
      assessmentId={assessment.id}
      studentId={studentId}
      language={
        language === "ar" ? "ar" : "en"
      }
    />
  );
}
