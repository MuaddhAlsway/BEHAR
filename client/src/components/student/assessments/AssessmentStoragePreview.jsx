
import { useState } from "react";
import {
  Database,
  Play,
  Save,
  Send,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  AlertCircle,
  History,
  HardDrive,
  CircleDot,
} from "lucide-react";

import {
  getAssessmentById,
  getAssessmentQuestions,
  getLocalizedText,
} from "../../../utils/assessmentService";

import {
  ATTEMPT_STATUS,
  getAssessmentAttempts,
  getActiveAssessmentAttempt,
  getRemainingAssessmentAttempts,
  getAssessmentStorageHealth,
  startAssessmentAttempt,
  saveAssessmentAnswer,
  submitAssessmentAttempt,
  discardAssessmentDraft,
} from "../../../utils/assessmentStorage";

import "../../../styles/student/assessments/assessment-storage-preview.css";

const translations = {
  en: {
    eyebrow: "BEHAR / ASSESSMENT INFRASTRUCTURE",
    title: "Every attempt.",
    accent: "Safely remembered.",
    subtitle:
      "Create, save, resume, and submit assessments using browser storage.",
    dev: "DEVELOPMENT ENVIRONMENT",
    storage: "LOCAL STORAGE",
    status: "Storage status",
    healthy: "Available & valid",
    unavailable: "Unavailable or invalid",
    attempts: "Submitted attempts",
    remaining: "Attempts remaining",
    draft: "Current draft",
    noDraft: "No active draft",
    active: "In progress",
    submitted: "Submitted",
    workspace: "Attempt workspace",
    workspaceSubtitle:
      "Test the complete storage lifecycle.",
    start: "Start / resume attempt",
    save: "Save sample answer",
    submit: "Submit assessment",
    discard: "Discard draft",
    refresh: "Refresh data",
    sample: "Sample answer",
    question: "QUESTION",
    noAttempt: "Start an attempt to begin.",
    history: "Attempt history",
    historySubtitle:
      "Submitted attempts are retained locally.",
    noHistory: "No submitted attempts yet.",
    attempt: "Attempt",
    score: "Score",
    passed: "Passed",
    failed: "Not passed",
    saved: "Sample answer saved successfully.",
    started: "Assessment attempt is ready.",
    submittedMessage: "Assessment submitted successfully.",
    discarded: "Draft discarded.",
    refreshed: "Storage data refreshed.",
    error: "Something went wrong.",
    preview: "LOCAL DEVELOPMENT PREVIEW",
    note:
      "Data is stored only in this browser. It is not synchronized with a backend.",
    id: "ATTEMPT ID",
    time: "LAST UPDATED",
    clearAnswer: "Clear answer",
    selected: "Selected answer",
    answerSaved: "Saved",
    maxReached: "Maximum attempts reached.",
  },
  ar: {
    eyebrow: "بحار / البنية التحتية للتقييم",
    title: "كل محاولة.",
    accent: "محفوظة بأمان محلياً.",
    subtitle:
      "أنشئ المحاولات واحفظها واستأنفها وأرسلها باستخدام تخزين المتصفح.",
    dev: "بيئة التطوير",
    storage: "التخزين المحلي",
    status: "حالة التخزين",
    healthy: "متاح وسليم",
    unavailable: "غير متاح أو غير صالح",
    attempts: "المحاولات المرسلة",
    remaining: "المحاولات المتبقية",
    draft: "المسودة الحالية",
    noDraft: "لا توجد مسودة",
    active: "قيد التنفيذ",
    submitted: "تم الإرسال",
    workspace: "مساحة المحاولة",
    workspaceSubtitle:
      "اختبر دورة حياة المحاولة بالكامل.",
    start: "بدء / استئناف المحاولة",
    save: "حفظ إجابة تجريبية",
    submit: "إرسال الاختبار",
    discard: "حذف المسودة",
    refresh: "تحديث البيانات",
    sample: "إجابة تجريبية",
    question: "السؤال",
    noAttempt: "ابدأ محاولة للمتابعة.",
    history: "سجل المحاولات",
    historySubtitle:
      "يتم الاحتفاظ بالمحاولات المرسلة محلياً.",
    noHistory: "لا توجد محاولات مرسلة بعد.",
    attempt: "المحاولة",
    score: "الدرجة",
    passed: "ناجح",
    failed: "لم ينجح",
    saved: "تم حفظ الإجابة التجريبية.",
    started: "المحاولة جاهزة.",
    submittedMessage: "تم إرسال الاختبار بنجاح.",
    discarded: "تم حذف المسودة.",
    refreshed: "تم تحديث بيانات التخزين.",
    error: "حدث خطأ.",
    preview: "معاينة تطوير محلية",
    note:
      "تُحفظ البيانات في هذا المتصفح فقط ولا تتم مزامنتها مع الخادم.",
    id: "معرّف المحاولة",
    time: "آخر تحديث",
    clearAnswer: "مسح الإجابة",
    selected: "الإجابة المختارة",
    answerSaved: "محفوظة",
    maxReached: "وصلت إلى الحد الأقصى للمحاولات.",
  },
};

function readSnapshot(assessment, studentId) {
  if (!assessment) {
    return {
      attempts: [],
      active: null,
      remaining: 0,
      health: getAssessmentStorageHealth(),
    };
  }

  const health = getAssessmentStorageHealth();

  if (!health.valid) {
    return {
      attempts: [],
      active: null,
      remaining: 0,
      health,
    };
  }

  return {
    attempts: getAssessmentAttempts(
      assessment.id,
      studentId
    ),
    active: getActiveAssessmentAttempt(
      assessment.id,
      studentId
    ),
    remaining: getRemainingAssessmentAttempts(
      assessment,
      studentId
    ),
    health,
  };
}

function formatDate(value, language) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
}

export default function AssessmentStoragePreview({
  assessmentId = "react-basics-quiz",
  studentId = "dev-student-001",
  language = "en",
}) {
  const lang = language === "ar" ? "ar" : "en";
  const t = translations[lang];

  const assessment = getAssessmentById(assessmentId);
  const questions = getAssessmentQuestions(assessmentId);
  const firstQuestion = questions[0] ?? null;

  const [snapshot, setSnapshot] = useState(() =>
    readSnapshot(assessment, studentId)
  );

  const [selectedOptions, setSelectedOptions] = useState(
    []
  );

  const [notice, setNotice] = useState(null);

  function refresh() {
    const next = readSnapshot(assessment, studentId);
    setSnapshot(next);
    return next;
  }

  function runAction(callback, successMessage) {
    try {
      callback();
      refresh();
      setNotice({
        type: "success",
        message: successMessage,
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message || t.error,
      });
    }
  }

  function handleStart() {
    if (!assessment) return;

    runAction(
      () => {
        startAssessmentAttempt(assessment, studentId);
      },
      t.started
    );
  }

  function handleSave() {
    if (!snapshot.active || !firstQuestion) return;

    runAction(
      () => {
        saveAssessmentAnswer({
          attemptId: snapshot.active.id,
          studentId,
          question: firstQuestion,
          selectedOptionIds: selectedOptions,
        });
      },
      t.saved
    );
  }

  function handleSubmit() {
    if (!snapshot.active || !assessment) return;

    runAction(
      () => {
        submitAssessmentAttempt({
          attemptId: snapshot.active.id,
          studentId,
          assessment,
          questions,
        });

        setSelectedOptions([]);
      },
      t.submittedMessage
    );
  }

  function handleDiscard() {
    if (!snapshot.active) return;

    runAction(
      () => {
        discardAssessmentDraft(
          snapshot.active.id,
          studentId
        );

        setSelectedOptions([]);
      },
      t.discarded
    );
  }

  function handleRefresh() {
    try {
      refresh();
      setNotice({
        type: "success",
        message: t.refreshed,
      });
    } catch (error) {
      setNotice({
        type: "error",
        message: error.message,
      });
    }
  }

  function handleOptionChange(optionId) {
    if (!firstQuestion) return;

    if (firstQuestion.type === "multiple_choice") {
      setSelectedOptions((previous) =>
        previous.includes(optionId)
          ? previous.filter((id) => id !== optionId)
          : [...previous, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  }

  const submittedAttempts = snapshot.attempts.filter(
    (attempt) =>
      attempt.status === ATTEMPT_STATUS.SUBMITTED
  );

  const activeAttempt = snapshot.active;
  const canStart =
    snapshot.health.valid &&
    snapshot.remaining > 0 &&
    Boolean(assessment);

  const canEdit =
    snapshot.health.valid &&
    Boolean(activeAttempt);

  return (
    <section
      className="behar-storage"
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="behar-storage__container">
        {/* HEADER */}
        <header className="behar-storage__header">
          <div className="behar-storage__eyebrow">
            <span className="behar-storage__eyebrow-dot" />
            {t.eyebrow}
          </div>

          <div className="behar-storage__header-content">
            <div>
              <h2>
                {t.title}
                <span>{t.accent}</span>
              </h2>
              <p>{t.subtitle}</p>
            </div>

            <div className="behar-storage__environment">
              <HardDrive size={16} />
              <span>{t.dev}</span>
            </div>
          </div>
        </header>

        {/* METRICS */}
        <div className="behar-storage__metrics">
          <div className="behar-storage__metric">
            <div className="behar-storage__metric-top">
              <span>{t.status}</span>
              <Database size={18} />
            </div>

            <strong>
              {snapshot.health.valid
                ? t.healthy
                : t.unavailable}
            </strong>

            <span className="behar-storage__metric-note">
              {t.storage}
            </span>
          </div>

          <div className="behar-storage__metric">
            <div className="behar-storage__metric-top">
              <span>{t.attempts}</span>
              <History size={18} />
            </div>

            <strong>{submittedAttempts.length}</strong>

            <span className="behar-storage__metric-note">
              {assessment?.settings.maxAttempts ?? 0} MAX
            </span>
          </div>

          <div className="behar-storage__metric">
            <div className="behar-storage__metric-top">
              <span>{t.remaining}</span>
              <ShieldCheck size={18} />
            </div>

            <strong>{snapshot.remaining}</strong>

            <span className="behar-storage__metric-note">
              {t.attempts}
            </span>
          </div>

          <div className="behar-storage__metric">
            <div className="behar-storage__metric-top">
              <span>{t.draft}</span>
              <Clock3 size={18} />
            </div>

            <strong className="behar-storage__metric-draft">
              {activeAttempt ? t.active : t.noDraft}
            </strong>

            <span className="behar-storage__metric-note">
              {activeAttempt
                ? `#${activeAttempt.attemptNumber}`
                : "—"}
            </span>
          </div>
        </div>

        {notice && (
          <div
            className={`behar-storage__notice behar-storage__notice--${notice.type}`}
            role="status"
            aria-live="polite"
          >
            {notice.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{notice.message}</span>
          </div>
        )}

        {!snapshot.health.valid && (
          <div
            className="behar-storage__notice behar-storage__notice--error"
            role="alert"
          >
            <AlertCircle size={18} />
            <span>{snapshot.health.error}</span>
          </div>
        )}

        {/* WORKSPACE */}
        <div className="behar-storage__workspace">
          <div className="behar-storage__workspace-heading">
            <div>
              <span className="behar-storage__section-label">
                01 / STORAGE WORKSPACE
              </span>
              <h3>{t.workspace}</h3>
              <p>{t.workspaceSubtitle}</p>
            </div>

            <button
              type="button"
              className="behar-storage__refresh"
              onClick={handleRefresh}
            >
              <RotateCcw size={16} />
              {t.refresh}
            </button>
          </div>

          <div className="behar-storage__workspace-grid">
            <div className="behar-storage__control-panel">
              <div className="behar-storage__panel-heading">
                <CircleDot size={18} />
                <span>
                  {getLocalizedText(
                    assessment?.title,
                    lang
                  ) || t.workspace}
                </span>
              </div>

              {activeAttempt ? (
                <div className="behar-storage__attempt-details">
                  <div>
                    <span>{t.id}</span>
                    <code>{activeAttempt.id}</code>
                  </div>

                  <div>
                    <span>{t.time}</span>
                    <strong>
                      {formatDate(
                        activeAttempt.updatedAt,
                        lang
                      )}
                    </strong>
                  </div>
                </div>
              ) : (
                <div className="behar-storage__empty-draft">
                  <Database size={28} strokeWidth={1.4} />
                  <p>{t.noAttempt}</p>
                </div>
              )}

              <div className="behar-storage__actions">
                <button
                  type="button"
                  className="behar-storage__button behar-storage__button--primary"
                  onClick={handleStart}
                  disabled={!canStart}
                >
                  <Play size={16} />
                  {t.start}
                </button>

                <button
                  type="button"
                  className="behar-storage__button behar-storage__button--secondary"
                  onClick={handleSubmit}
                  disabled={!canEdit}
                >
                  <Send size={16} />
                  {t.submit}
                </button>

                <button
                  type="button"
                  className="behar-storage__button behar-storage__button--danger"
                  onClick={handleDiscard}
                  disabled={!canEdit}
                >
                  <Trash2 size={16} />
                  {t.discard}
                </button>
              </div>

              {!canStart && snapshot.remaining === 0 && (
                <p className="behar-storage__limit">
                  {t.maxReached}
                </p>
              )}
            </div>

            {/* ANSWER TEST */}
            <div className="behar-storage__answer-panel">
              <div className="behar-storage__answer-heading">
                <span className="behar-storage__section-label">
                  02 / ANSWER PERSISTENCE
                </span>
                <h4>{t.sample}</h4>
              </div>

              {firstQuestion ? (
                <>
                  <div className="behar-storage__question">
                    <span>{t.question} 01</span>
                    <h5>
                      {getLocalizedText(
                        firstQuestion.question,
                        lang
                      )}
                    </h5>
                  </div>

                  <div className="behar-storage__options">
                    {firstQuestion.options.map((option) => {
                      const checked =
                        selectedOptions.includes(option.id);

                      return (
                        <label
                          key={option.id}
                          className={`behar-storage__option ${
                            checked ? "is-selected" : ""
                          }`}
                        >
                          <input
                            type={
                              firstQuestion.type ===
                              "multiple_choice"
                                ? "checkbox"
                                : "radio"
                            }
                            name={`assessment-${firstQuestion.id}`}
                            checked={checked}
                            disabled={!canEdit}
                            onChange={() =>
                              handleOptionChange(option.id)
                            }
                          />

                          <span className="behar-storage__option-indicator">
                            {checked && <CheckCircle2 size={14} />}
                          </span>

                          <span>
                            {getLocalizedText(
                              option.text,
                              lang
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="behar-storage__answer-actions">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={!canEdit}
                    >
                      <Save size={16} />
                      {t.save}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedOptions([])}
                      disabled={!canEdit}
                    >
                      {t.clearAnswer}
                    </button>
                  </div>

                  {activeAttempt?.answers?.[
                    firstQuestion.id
                  ] && (
                    <div className="behar-storage__saved-answer">
                      <CheckCircle2 size={15} />
                      <span>
                        {t.answerSaved}:{" "}
                        {activeAttempt.answers[
                          firstQuestion.id
                        ].join(", ") || "—"}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p>{t.noAttempt}</p>
              )}
            </div>
          </div>
        </div>

        {/* HISTORY */}
        <div className="behar-storage__history">
          <div className="behar-storage__workspace-heading">
            <div>
              <span className="behar-storage__section-label">
                03 / ATTEMPT RECORDS
              </span>
              <h3>{t.history}</h3>
              <p>{t.historySubtitle}</p>
            </div>

            <span className="behar-storage__history-count">
              {String(submittedAttempts.length).padStart(
                2,
                "0"
              )}
            </span>
          </div>

          {submittedAttempts.length === 0 ? (
            <div className="behar-storage__empty-history">
              <History size={30} strokeWidth={1.4} />
              <p>{t.noHistory}</p>
            </div>
          ) : (
            <div className="behar-storage__history-list">
              {submittedAttempts.map((attempt) => (
                <article
                  key={attempt.id}
                  className="behar-storage__history-item"
                >
                  <div className="behar-storage__history-number">
                    {String(attempt.attemptNumber).padStart(
                      2,
                      "0"
                    )}
                  </div>

                  <div className="behar-storage__history-info">
                    <h4>
                      {t.attempt} #{attempt.attemptNumber}
                    </h4>
                    <span>
                      {formatDate(
                        attempt.submittedAt,
                        lang
                      )}
                    </span>
                  </div>

                  <div className="behar-storage__history-score">
                    <strong>
                      {attempt.result.percentage}%
                    </strong>
                    <span>{t.score}</span>
                  </div>

                  <div
                    className={`behar-storage__history-status ${
                      attempt.result.passed
                        ? "is-passed"
                        : "is-failed"
                    }`}
                  >
                    {attempt.result.passed ? (
                      <CheckCircle2 size={15} />
                    ) : (
                      <AlertCircle size={15} />
                    )}
                    {attempt.result.passed
                      ? t.passed
                      : t.failed}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <footer className="behar-storage__footer">
          <span>{t.preview}</span>
          <p>{t.note}</p>
          <span>P14.4.0.4</span>
        </footer>
      </div>
    </section>
  );
}
