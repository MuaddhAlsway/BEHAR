
import { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  RotateCcw,
  Send,
  Trash2,
  AlertCircle,
  BookOpen,
  ShieldCheck,
  History,
} from "lucide-react";

import useAssessment from "../../../hooks/useAssessment";

import {
  getLocalizedText,
} from "../../../utils/assessmentService";

import "../../../styles/student/assessments/assessment-hook-preview.css";

const translations = {
  en: {
    eyebrow: "BEHAR / ASSESSMENT EXPERIENCE",
    title: "Knowledge in motion.",
    subtitle:
      "A connected assessment experience with automatic answer saving.",
    preview: "INTERACTIVE DEVELOPMENT PREVIEW",
    start: "Start assessment",
    resume: "Resume assessment",
    submit: "Submit assessment",
    discard: "Discard draft",
    next: "Next question",
    previous: "Previous question",
    question: "QUESTION",
    progress: "COMPLETION",
    answered: "Answered",
    remaining: "Attempts remaining",
    autosaved: "Answers saved automatically",
    notStarted: "Your assessment is ready.",
    notStartedText:
      "Start an attempt to answer questions and track your progress.",
    allAnswered: "All questions answered.",
    incomplete: "Some questions remain unanswered.",
    history: "Previous attempts",
    noHistory: "No submitted attempts yet.",
    passed: "Passed",
    failed: "Not passed",
    score: "Score",
    attempts: "Attempt",
    error: "Assessment error",
    ready: "Ready to submit?",
    readyText:
      "Your answers will be scored and the attempt will be saved.",
    cancel: "Cancel",
    confirm: "Confirm submission",
    completed: "Assessment submitted",
    completedText: "Your result has been saved locally.",
    retry: "Start another attempt",
    maxReached: "Maximum attempts reached.",
    reset: "Refresh saved data",
    storageNote:
      "Development mode — results are stored in this browser only.",
    select: "Select your answer",
    back: "Back to assessment",
  },
  ar: {
    eyebrow: "بحار / تجربة التقييم",
    title: "المعرفة في التطبيق.",
    subtitle:
      "تجربة تقييم مترابطة مع حفظ الإجابات تلقائياً.",
    preview: "معاينة تطوير تفاعلية",
    start: "بدء الاختبار",
    resume: "استئناف الاختبار",
    submit: "إرسال الاختبار",
    discard: "حذف المسودة",
    next: "السؤال التالي",
    previous: "السؤال السابق",
    question: "السؤال",
    progress: "نسبة الإكمال",
    answered: "تمت الإجابة",
    remaining: "المحاولات المتبقية",
    autosaved: "تم حفظ الإجابات تلقائياً",
    notStarted: "اختبارك جاهز.",
    notStartedText:
      "ابدأ محاولة للإجابة على الأسئلة ومتابعة تقدمك.",
    allAnswered: "تمت الإجابة عن جميع الأسئلة.",
    incomplete: "بعض الأسئلة لم تتم الإجابة عنها.",
    history: "المحاولات السابقة",
    noHistory: "لا توجد محاولات مرسلة بعد.",
    passed: "ناجح",
    failed: "لم ينجح",
    score: "الدرجة",
    attempts: "المحاولة",
    error: "خطأ في الاختبار",
    ready: "هل أنت مستعد للإرسال؟",
    readyText:
      "سيتم تقييم إجاباتك وحفظ المحاولة.",
    cancel: "إلغاء",
    confirm: "تأكيد الإرسال",
    completed: "تم إرسال الاختبار",
    completedText: "تم حفظ نتيجتك محلياً.",
    retry: "بدء محاولة جديدة",
    maxReached: "وصلت إلى الحد الأقصى للمحاولات.",
    reset: "تحديث البيانات المحفوظة",
    storageNote:
      "وضع التطوير — النتائج محفوظة في هذا المتصفح فقط.",
    select: "اختر إجابتك",
    back: "العودة إلى الاختبار",
  },
};

export default function AssessmentHookPreview({
  assessmentId = "react-basics-quiz",
  studentId = "dev-student-001",
  language = "en",
}) {
  const lang = language === "ar" ? "ar" : "en";
  const t = translations[lang];

  const {
    assessment,
    questions,
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
    toggleAnswer,
    submit,
    discard,
    refresh,
  } = useAssessment({ assessmentId, studentId });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const question = questions[currentIndex] ?? null;
  const selected = question
    ? answers[question.id] ?? []
    : [];

  function handleStart() {
    const next = start();

    if (next) {
      setCurrentIndex(0);
      setLastResult(null);
    }
  }

  function handleSubmit() {
    const completed = submit();
    setShowConfirm(false);

    if (completed) {
      setLastResult(completed.result);
    }
  }

  function handleDiscard() {
    if (discard()) {
      setCurrentIndex(0);
      setLastResult(null);
    }
  }

  function handleOption(optionId) {
    if (!question || !isActive) return;

    toggleAnswer(question.id, optionId);
  }

  const previousIcon =
    lang === "ar" ? ArrowRight : ArrowLeft;

  const nextIcon =
    lang === "ar" ? ArrowLeft : ArrowRight;

  const PreviousIcon = previousIcon;
  const NextIcon = nextIcon;

  return (
    <section
      className="behar-hook"
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="behar-hook__container">
        <header className="behar-hook__header">
          <div className="behar-hook__eyebrow">
            <span />
            {t.eyebrow}
          </div>

          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </header>

        <div className="behar-hook__topbar">
          <div className="behar-hook__topbar-title">
            <BookOpen size={18} />
            <span>
              {getLocalizedText(
                assessment?.title,
                lang
              ) || "Assessment"}
            </span>
          </div>

          <div className="behar-hook__topbar-meta">
            <span>
              <ShieldCheck size={15} />
              {t.remaining}: {remainingAttempts}
            </span>
            <span>
              <Clock3 size={15} />
              {assessment?.settings.timeLimitMinutes ?? 0} min
            </span>
          </div>
        </div>

        {error && (
          <div className="behar-hook__error" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="behar-hook__empty">
            <p>Loading assessment...</p>
          </div>
        ) : lastResult ? (
          <div className="behar-hook__result">
            <div className="behar-hook__result-icon">
              {lastResult.passed ? (
                <CheckCircle2 size={38} />
              ) : (
                <AlertCircle size={38} />
              )}
            </div>

            <span className="behar-hook__section-label">
              {t.completed}
            </span>

            <strong>{lastResult.percentage}%</strong>

            <h3>
              {lastResult.passed ? t.passed : t.failed}
            </h3>

            <p>{t.completedText}</p>

            <button
              type="button"
              onClick={handleStart}
              disabled={!canStart}
            >
              <RotateCcw size={16} />
              {t.retry}
            </button>
          </div>
        ) : !isActive ? (
          <div className="behar-hook__empty">
            <div className="behar-hook__empty-icon">
              <BookOpen size={34} strokeWidth={1.4} />
            </div>

            <span className="behar-hook__section-label">
              {t.preview}
            </span>

            <h3>{t.notStarted}</h3>
            <p>{t.notStartedText}</p>

            <button
              type="button"
              onClick={handleStart}
              disabled={!canStart}
            >
              {t.start}
              <NextIcon size={17} />
            </button>

            {!canStart && remainingAttempts === 0 && (
              <p className="behar-hook__limit">
                {t.maxReached}
              </p>
            )}
          </div>
        ) : (
          <div className="behar-hook__workspace">
            <aside className="behar-hook__sidebar">
              <span className="behar-hook__section-label">
                {t.progress}
              </span>

              <div className="behar-hook__progress-value">
                <strong>{progress}%</strong>
                <span>
                  {answeredCount}/{totalQuestions}
                </span>
              </div>

              <div
                className="behar-hook__progress-track"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={t.progress}
              >
                <div style={{ width: `${progress}%` }} />
              </div>

              <div className="behar-hook__question-nav">
                {questions.map((item, index) => {
                  const isAnswered =
                    (answers[item.id] ?? []).length > 0;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={[
                        "behar-hook__question-dot",
                        currentIndex === index
                          ? "is-current"
                          : "",
                        isAnswered ? "is-answered" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => setCurrentIndex(index)}
                      aria-label={`${t.question} ${index + 1}`}
                      aria-current={
                        currentIndex === index
                          ? "step"
                          : undefined
                      }
                    >
                      {isAnswered ? (
                        <Check size={15} />
                      ) : (
                        String(index + 1).padStart(2, "0")
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="behar-hook__autosave">
                <CheckCircle2 size={16} />
                <span>{t.autosaved}</span>
              </div>

              <button
                type="button"
                className="behar-hook__discard"
                onClick={handleDiscard}
              >
                <Trash2 size={15} />
                {t.discard}
              </button>
            </aside>

            <div className="behar-hook__main">
              {question && (
                <>
                  <div className="behar-hook__question-meta">
                    <span>
                      {t.question}{" "}
                      {String(currentIndex + 1).padStart(
                        2,
                        "0"
                      )}
                      {" / "}
                      {String(totalQuestions).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <span>
                      {question.points} PTS
                    </span>
                  </div>

                  <h3 className="behar-hook__question-title">
                    {getLocalizedText(
                      question.question,
                      lang
                    )}
                  </h3>

                  <p className="behar-hook__question-hint">
                    {t.select}
                  </p>

                  <div className="behar-hook__options">
                    {question.options.map((option, index) => {
                      const checked = selected.includes(
                        option.id
                      );

                      return (
                        <label
                          key={option.id}
                          className={`behar-hook__option ${
                            checked ? "is-selected" : ""
                          }`}
                        >
                          <input
                            type={
                              question.type ===
                              "multiple_choice"
                                ? "checkbox"
                                : "radio"
                            }
                            name={`question-${question.id}`}
                            checked={checked}
                            onChange={() =>
                              handleOption(option.id)
                            }
                          />

                          <span className="behar-hook__option-letter">
                            {String.fromCharCode(65 + index)}
                          </span>

                          <span className="behar-hook__option-text">
                            {getLocalizedText(
                              option.text,
                              lang
                            )}
                          </span>

                          <span className="behar-hook__option-check">
                            {checked ? (
                              <CheckCircle2 size={20} />
                            ) : (
                              <Circle size={20} />
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="behar-hook__navigation">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentIndex((index) =>
                          Math.max(0, index - 1)
                        )
                      }
                      disabled={currentIndex === 0}
                    >
                      <PreviousIcon size={17} />
                      {t.previous}
                    </button>

                    {currentIndex < totalQuestions - 1 ? (
                      <button
                        type="button"
                        className="is-primary"
                        onClick={() =>
                          setCurrentIndex((index) =>
                            Math.min(
                              totalQuestions - 1,
                              index + 1
                            )
                          )
                        }
                      >
                        {t.next}
                        <NextIcon size={17} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="is-primary"
                        onClick={() => setShowConfirm(true)}
                        disabled={saving || submitting}
                      >
                        {t.submit}
                        <Send size={16} />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* HISTORY */}
        <div className="behar-hook__history">
          <div className="behar-hook__history-heading">
            <div>
              <span className="behar-hook__section-label">
                02 / HISTORY
              </span>
              <h3>{t.history}</h3>
            </div>

            <History size={21} />
          </div>

          {history.length === 0 ? (
            <p className="behar-hook__history-empty">
              {t.noHistory}
            </p>
          ) : (
            <div className="behar-hook__history-list">
              {history.map((item) => (
                <div
                  className="behar-hook__history-item"
                  key={item.id}
                >
                  <span>
                    {t.attempt} #{item.attemptNumber}
                  </span>

                  <strong>
                    {item.result?.percentage ?? 0}%
                  </strong>

                  <span
                    className={
                      item.result?.passed
                        ? "is-passed"
                        : "is-failed"
                    }
                  >
                    {item.result?.passed
                      ? t.passed
                      : t.failed}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="behar-hook__footer">
          <span>{t.storageNote}</span>
          <span>P14.4.0.5</span>
        </footer>
      </div>

      {/* SUBMISSION CONFIRMATION */}
      {showConfirm && (
        <div
          className="behar-hook__modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowConfirm(false);
            }
          }}
        >
          <div
            className="behar-hook__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="behar-submit-title"
          >
            <div className="behar-hook__modal-icon">
              <Send size={23} />
            </div>

            <h3 id="behar-submit-title">{t.ready}</h3>
            <p>{t.readyText}</p>

            <div className="behar-hook__modal-progress">
              {answeredCount}/{totalQuestions} {t.answered}
            </div>

            <div className="behar-hook__modal-actions">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
              >
                {t.cancel}
              </button>

              <button
                type="button"
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
