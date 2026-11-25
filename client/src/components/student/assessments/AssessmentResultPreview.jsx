
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  XCircle,
  CircleHelp,
  RotateCcw,
  Trophy,
  Target,
  ListChecks,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import {
  getAssessmentById,
  getAssessmentQuestions,
  getLocalizedText,
  validateAssessmentRelationships,
} from "../../../utils/assessmentService";

import { scoreAssessment } from "../../../utils/assessmentScoring";

import "../../../styles/student/assessments/assessment-result-preview.css";

const copy = {
  en: {
    eyebrow: "BEHAR / ASSESSMENT RESULTS",
    heading: "Your performance,",
    headingAccent: "in focus.",
    description:
      "A detailed look at your answers, accuracy, and assessment outcome.",
    passed: "Assessment passed",
    failed: "Assessment not passed",
    passedText: "You've reached the required passing score.",
    failedText: "Review the questions and try again.",
    score: "YOUR SCORE",
    earned: "POINTS EARNED",
    correct: "CORRECT ANSWERS",
    answered: "QUESTIONS ANSWERED",
    passing: "REQUIRED TO PASS",
    breakdown: "Question breakdown",
    breakdownSubtitle: "Review your answers question by question.",
    correctLabel: "Correct",
    incorrectLabel: "Incorrect",
    unanswered: "Unanswered",
    yourAnswer: "YOUR ANSWER",
    correctAnswer: "CORRECT ANSWER",
    explanation: "EXPLANATION",
    points: "PTS",
    reset: "Reset preview",
    demo: "DEVELOPMENT PREVIEW",
    demoDescription:
      "This result uses sample answers. No attempt is saved.",
    invalid: "Assessment data is invalid.",
    missing: "Assessment not found.",
    sample: "Try another sample",
  },
  ar: {
    eyebrow: "بحار / نتائج التقييم",
    heading: "أداؤك التعليمي،",
    headingAccent: "بكل وضوح.",
    description:
      "نظرة تفصيلية على إجاباتك ودقتها ونتيجة الاختبار.",
    passed: "اجتزت الاختبار",
    failed: "لم تجتز الاختبار",
    passedText: "حققت درجة النجاح المطلوبة.",
    failedText: "راجع الأسئلة وحاول مرة أخرى.",
    score: "درجتك",
    earned: "النقاط المكتسبة",
    correct: "الإجابات الصحيحة",
    answered: "الأسئلة المجابة",
    passing: "درجة النجاح المطلوبة",
    breakdown: "تفاصيل الأسئلة",
    breakdownSubtitle: "راجع إجاباتك سؤالاً بسؤال.",
    correctLabel: "صحيح",
    incorrectLabel: "غير صحيح",
    unanswered: "لم تتم الإجابة",
    yourAnswer: "إجابتك",
    correctAnswer: "الإجابة الصحيحة",
    explanation: "الشرح",
    points: "نقطة",
    reset: "إعادة المعاينة",
    demo: "معاينة تطويرية",
    demoDescription:
      "هذه النتيجة تستخدم إجابات تجريبية ولا تحفظ أي محاولة.",
    invalid: "بيانات الاختبار غير صالحة.",
    missing: "لم يتم العثور على الاختبار.",
    sample: "تجربة نموذج آخر",
  },
};

function useDocumentLanguage() {
  const [language, setLanguage] = useState(() =>
    typeof document !== "undefined" &&
    document.documentElement.lang === "ar"
      ? "ar"
      : "en"
  );

  // This preview can also be switched independently
  // when the host app does not provide language props.
  return [language, setLanguage];
}

function createSampleAnswers(questions, mode) {
  const answers = {};

  questions.forEach((question, index) => {
    const correct = [...question.correctOptionIds];

    if (mode === "perfect") {
      answers[question.id] = correct;
      return;
    }

    if (mode === "mixed") {
      if (index % 3 === 0) {
        answers[question.id] = correct;
      } else if (index % 3 === 1) {
        const wrong = question.options.find(
          (option) => !correct.includes(option.id)
        );

        answers[question.id] = wrong ? [wrong.id] : [];
      } else {
        answers[question.id] = [];
      }

      return;
    }

    // Failing sample: choose a wrong option where possible.
    const wrong = question.options.find(
      (option) => !correct.includes(option.id)
    );

    answers[question.id] = wrong ? [wrong.id] : [];
  });

  return answers;
}

function formatOptionLabels(ids, question, language) {
  if (!ids.length) return "—";

  return ids
    .map((id) => {
      const option = question.options.find(
        (item) => item.id === id
      );

      return option
        ? getLocalizedText(option.text, language)
        : id;
    })
    .join(", ");
}

export default function AssessmentResultPreview({
  assessmentId = "react-basics-quiz",
  language: languageProp,
}) {
  const [localLanguage, setLocalLanguage] =
    useDocumentLanguage();

  const [sampleMode, setSampleMode] = useState("mixed");

  const language =
    languageProp === "ar" || languageProp === "en"
      ? languageProp
      : localLanguage;

  const t = copy[language];
  const assessment = getAssessmentById(assessmentId);
  const questions = getAssessmentQuestions(assessmentId);

  const validation = validateAssessmentRelationships(
    assessmentId
  );

  const result = useMemo(() => {
    if (!assessment || !validation.valid) {
      return null;
    }

    const answers = createSampleAnswers(
      questions,
      sampleMode
    );

    return scoreAssessment(assessment, questions, answers);
  }, [assessment, questions, sampleMode, validation.valid]);

  if (!assessment || !validation.valid || !result) {
    return (
      <section className="behar-result" dir={language === "ar" ? "rtl" : "ltr"}>
        <div className="behar-result__error">
          <AlertCircle size={26} />
          <p>{assessment ? t.invalid : t.missing}</p>
          {validation.errors?.length > 0 && (
            <ul>
              {validation.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      </section>
    );
  }

  const scoreValue = Math.min(100, Math.max(0, result.percentage));

  const resultItems = [
    {
      id: "earned",
      icon: Trophy,
      label: t.earned,
      value: `${result.earnedPoints} / ${result.maxPoints}`,
    },
    {
      id: "correct",
      icon: CheckCircle2,
      label: t.correct,
      value: `${result.correctCount} / ${result.totalQuestions}`,
    },
    {
      id: "answered",
      icon: ListChecks,
      label: t.answered,
      value: `${result.answeredCount} / ${result.totalQuestions}`,
    },
    {
      id: "passing",
      icon: Target,
      label: t.passing,
      value: `${result.passingScore}%`,
    },
  ];

  return (
    <section
      className="behar-result"
      dir={language === "ar" ? "rtl" : "ltr"}
      lang={language}
    >
      <div className="behar-result__container">
        <header className="behar-result__header">
          <div className="behar-result__eyebrow">
            <span />
            {t.eyebrow}
          </div>

          <div className="behar-result__header-main">
            <div>
              <h2>
                {t.heading}
                <span>{t.headingAccent}</span>
              </h2>
              <p>{t.description}</p>
            </div>

            {!languageProp && (
              <div className="behar-result__languages">
                <button
                  type="button"
                  className={language === "en" ? "is-active" : ""}
                  onClick={() => setLocalLanguage("en")}
                  aria-pressed={language === "en"}
                >
                  EN
                </button>
                <button
                  type="button"
                  className={language === "ar" ? "is-active" : ""}
                  onClick={() => setLocalLanguage("ar")}
                  aria-pressed={language === "ar"}
                >
                  AR
                </button>
              </div>
            )}
          </div>
        </header>

        {/* RESULT HERO */}
        <div className="behar-result__hero">
          <div className="behar-result__hero-info">
            <div className="behar-result__hero-tag">
              <ShieldCheck size={15} />
              {getLocalizedText(assessment.title, language)}
            </div>

            <div className="behar-result__outcome">
              {result.passed ? (
                <CheckCircle2 size={26} />
              ) : (
                <XCircle size={26} />
              )}
              <h3>{result.passed ? t.passed : t.failed}</h3>
            </div>

            <p>
              {result.passed ? t.passedText : t.failedText}
            </p>

            <div className="behar-result__hero-bottom">
              <span>{t.demo}</span>
              <span>P14.4.0.3</span>
            </div>
          </div>

          <div className="behar-result__score-panel">
            <span className="behar-result__score-label">
              {t.score}
            </span>

            <div
              className="behar-result__score-ring"
              style={{ "--score": `${scoreValue}%` }}
              role="img"
              aria-label={`${t.score}: ${result.percentage}%`}
            >
              <div className="behar-result__score-ring-inner">
                <strong>{result.percentage}%</strong>
                <small>{result.passed ? t.passed : t.failed}</small>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="behar-result__stats">
          {resultItems.map((item) => {
            const Icon = item.icon;

            return (
              <div className="behar-result__stat" key={item.id}>
                <div className="behar-result__stat-top">
                  <span>{item.label}</span>
                  <Icon size={18} strokeWidth={1.5} />
                </div>
                <strong>{item.value}</strong>
              </div>
            );
          })}
        </div>

        {/* SAMPLE CONTROLS */}
        <div className="behar-result__sample">
          <div>
            <span className="behar-result__mini-label">
              {t.demo}
            </span>
            <p>{t.demoDescription}</p>
          </div>

          <div className="behar-result__sample-actions">
            <button
              type="button"
              onClick={() =>
                setSampleMode((previous) =>
                  previous === "mixed"
                    ? "perfect"
                    : previous === "perfect"
                    ? "failed"
                    : "mixed"
                )
              }
            >
              <RotateCcw size={15} />
              {t.sample}
            </button>
          </div>
        </div>

        {/* QUESTION BREAKDOWN */}
        <div className="behar-result__breakdown">
          <div className="behar-result__section-heading">
            <div>
              <span className="behar-result__mini-label">
                01 / REVIEW
              </span>
              <h3>{t.breakdown}</h3>
              <p>{t.breakdownSubtitle}</p>
            </div>
            <span className="behar-result__section-count">
              {String(result.totalQuestions).padStart(2, "0")}
            </span>
          </div>

          <div className="behar-result__question-list">
            {result.results.map((item, index) => {
              const question = questions.find(
                (entry) => entry.id === item.questionId
              );

              if (!question) return null;

              const status = !item.isAnswered
                ? "unanswered"
                : item.isCorrect
                ? "correct"
                : "incorrect";

              return (
                <article
                  key={item.questionId}
                  className={`behar-result__question behar-result__question--${status}`}
                >
                  <div className="behar-result__question-top">
                    <span className="behar-result__question-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="behar-result__question-content">
                      <h4>
                        {getLocalizedText(
                          question.question,
                          language
                        )}
                      </h4>

                      <span className={`behar-result__status behar-result__status--${status}`}>
                        {status === "correct" ? (
                          <Check size={13} />
                        ) : status === "incorrect" ? (
                          <XCircle size={13} />
                        ) : (
                          <CircleHelp size={13} />
                        )}
                        {status === "correct"
                          ? t.correctLabel
                          : status === "incorrect"
                          ? t.incorrectLabel
                          : t.unanswered}
                      </span>
                    </div>

                    <strong className="behar-result__question-points">
                      {item.earnedPoints}/{item.maxPoints} {t.points}
                    </strong>
                  </div>

                  <div className="behar-result__answers">
                    <div>
                      <span>{t.yourAnswer}</span>
                      <p>
                        {formatOptionLabels(
                          item.selectedOptionIds,
                          question,
                          language
                        )}
                      </p>
                    </div>

                    <div>
                      <span>{t.correctAnswer}</span>
                      <p>
                        {formatOptionLabels(
                          item.correctOptionIds,
                          question,
                          language
                        )}
                      </p>
                    </div>
                  </div>

                  {assessment.settings.showExplanations && (
                    <div className="behar-result__explanation">
                      <span>{t.explanation}</span>
                      <p>
                        {getLocalizedText(
                          question.explanation,
                          language
                        )}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        <footer className="behar-result__footer">
          <span>BEHAR LMS / ASSESSMENT FOUNDATION</span>
          <span>P14.4.0.3</span>
        </footer>
      </div>
    </section>
  );
}
