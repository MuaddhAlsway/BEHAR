
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  ClipboardList,
  Clock3,
  RotateCcw,
  ShieldCheck,
  ListChecks,
} from "lucide-react";

import {
  getAssessmentById,
  getAssessmentQuestions,
  getLocalizedText,
  validateAssessmentRelationships,
} from "../../../utils/assessmentService";

import "../../../styles/student/assessments/assessment-overview.css";

const translations = {
  en: {
    eyebrow: "BEHAR / ASSESSMENT FOUNDATION",
    heading: "Assessment Overview",
    subtitle: "Explore the assessment structure and verify its data.",
    questions: "QUESTIONS",
    duration: "TIME LIMIT",
    passing: "PASSING SCORE",
    attempts: "MAX ATTEMPTS",
    minutes: "MINUTES",
    questionIndex: "QUESTION INDEX",
    questionTypes: {
      single_choice: "Single choice",
      multiple_choice: "Multiple choice",
      true_false: "True / False",
    },
    points: "PTS",
    validation: "DATA VALIDATION",
    valid: "All assessment data checks passed.",
    invalid: "Assessment validation failed.",
    noAssessment: "Assessment not found.",
    instructions: "INSTRUCTIONS",
    preview: "FOUNDATION PREVIEW",
    unpublished: "DRAFT ASSESSMENT",
    published: "PUBLISHED",
    unlinked: "NOT LINKED TO A LESSON",
    linked: "LINKED ASSESSMENT",
    reset: "Recheck Data",
    readOnly: "Read-only foundation preview",
  },
  ar: {
    eyebrow: "بحار / أساس التقييمات",
    heading: "نظرة عامة على الاختبار",
    subtitle: "استعرض بنية الاختبار وتحقق من صحة بياناته.",
    questions: "الأسئلة",
    duration: "المدة الزمنية",
    passing: "درجة النجاح",
    attempts: "عدد المحاولات",
    minutes: "دقيقة",
    questionIndex: "فهرس الأسئلة",
    questionTypes: {
      single_choice: "اختيار واحد",
      multiple_choice: "اختيارات متعددة",
      true_false: "صح أو خطأ",
    },
    points: "نقطة",
    validation: "التحقق من البيانات",
    valid: "اجتازت بيانات الاختبار جميع الفحوصات.",
    invalid: "فشل التحقق من بيانات الاختبار.",
    noAssessment: "لم يتم العثور على الاختبار.",
    instructions: "التعليمات",
    preview: "معاينة البنية الأساسية",
    unpublished: "اختبار مسودة",
    published: "منشور",
    unlinked: "غير مرتبط بدرس",
    linked: "اختبار مرتبط",
    reset: "إعادة التحقق",
    readOnly: "معاينة للقراءة فقط",
  },
};

function getDocumentLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

export default function AssessmentOverview({
  assessmentId = "react-basics-quiz",
}) {
  const [language, setLanguage] = useState(getDocumentLanguage);
  const [validation, setValidation] = useState(null);

  const t = translations[language];
  const assessment = getAssessmentById(assessmentId);
  const questions = getAssessmentQuestions(assessmentId);

  useEffect(() => {
    const sync = () => setLanguage(getDocumentLanguage());
    const observer = new MutationObserver(sync);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setValidation(validateAssessmentRelationships(assessmentId));
  }, [assessmentId]);

  const recheck = () => {
    setValidation(validateAssessmentRelationships(assessmentId));
  };

  if (!assessment) {
    return (
      <section
        className="behar-assessment"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="behar-assessment__empty">
          <CircleAlert size={30} />
          <p>{t.noAssessment}</p>
        </div>
      </section>
    );
  }

  const title = getLocalizedText(assessment.title, language);
  const description = getLocalizedText(
    assessment.description,
    language
  );

  const stats = [
    {
      id: "questions",
      label: t.questions,
      value: String(questions.length).padStart(2, "0"),
      icon: ListChecks,
    },
    {
      id: "duration",
      label: t.duration,
      value: `${assessment.settings.timeLimitMinutes}`,
      suffix: t.minutes,
      icon: Clock3,
    },
    {
      id: "passing",
      label: t.passing,
      value: `${assessment.settings.passingScore}%`,
      icon: ShieldCheck,
    },
    {
      id: "attempts",
      label: t.attempts,
      value: String(assessment.settings.maxAttempts).padStart(2, "0"),
      icon: RotateCcw,
    },
  ];

  return (
    <section
      className="behar-assessment"
      dir={language === "ar" ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-assessment-title"
    >
      <div className="behar-assessment__container">

        {/* HEADER */}
        <header className="behar-assessment__header">
          <div className="behar-assessment__eyebrow">
            <span className="behar-assessment__eyebrow-dot" />
            {t.eyebrow}
          </div>

          <div className="behar-assessment__header-row">
            <div className="behar-assessment__heading-group">
              <h2 id="behar-assessment-title">
                {t.heading}
              </h2>
              <p>{t.subtitle}</p>
            </div>

            <div className="behar-assessment__header-icon">
              <ClipboardList size={32} strokeWidth={1.3} />
            </div>
          </div>
        </header>

        {/* ASSESSMENT INTRO */}
        <div className="behar-assessment__intro">
          <div className="behar-assessment__intro-content">
            <div className="behar-assessment__badges">
              <span className="behar-assessment__badge">
                <BookOpen size={13} />
                {t.preview}
              </span>

              <span className="behar-assessment__badge behar-assessment__badge--muted">
                {assessment.published
                  ? t.published
                  : t.unpublished}
              </span>

              <span className="behar-assessment__badge behar-assessment__badge--muted">
                {assessment.linked
                  ? t.linked
                  : t.unlinked}
              </span>
            </div>

            <h3>{title}</h3>
            <p>{description}</p>
          </div>

          <ArrowUpRight
            className="behar-assessment__intro-arrow"
            size={28}
            strokeWidth={1.3}
          />
        </div>

        {/* STATS */}
        <div className="behar-assessment__stats">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                className="behar-assessment__stat"
                key={stat.id}
              >
                <div className="behar-assessment__stat-top">
                  <span>{stat.label}</span>
                  <Icon size={18} strokeWidth={1.5} />
                </div>

                <div className="behar-assessment__stat-value">
                  <strong>{stat.value}</strong>
                  {stat.suffix && <small>{stat.suffix}</small>}
                </div>
              </div>
            );
          })}
        </div>

        {/* CONTENT GRID */}
        <div className="behar-assessment__content">

          {/* QUESTIONS */}
          <div className="behar-assessment__questions">
            <div className="behar-assessment__section-heading">
              <div>
                <span className="behar-assessment__section-index">
                  01 / {t.questionIndex}
                </span>
                <h3>{t.questions}</h3>
              </div>

              <span className="behar-assessment__count">
                {String(questions.length).padStart(2, "0")}
              </span>
            </div>

            <div className="behar-assessment__question-list">
              {questions.map((question, index) => (
                <article
                  key={question.id}
                  className="behar-assessment__question"
                >
                  <span className="behar-assessment__question-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="behar-assessment__question-main">
                    <span className="behar-assessment__question-type">
                      {t.questionTypes[question.type] || question.type}
                    </span>

                    <h4>
                      {getLocalizedText(question.question, language)}
                    </h4>
                  </div>

                  <span className="behar-assessment__question-points">
                    {question.points} {t.points}
                  </span>
                </article>
              ))}
            </div>
          </div>

          {/* SIDEBAR */}
          <aside className="behar-assessment__sidebar">

            <div className="behar-assessment__instructions">
              <span className="behar-assessment__section-index">
                02 / {t.instructions}
              </span>

              <p>
                {getLocalizedText(
                  assessment.instructions,
                  language
                )}
              </p>
            </div>

            <div className="behar-assessment__validation">
              <div className="behar-assessment__validation-header">
                <span className="behar-assessment__section-index">
                  03 / {t.validation}
                </span>

                {validation?.valid ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <CircleAlert size={20} />
                )}
              </div>

              <strong>
                {validation?.valid ? t.valid : t.invalid}
              </strong>

              {validation?.errors?.length > 0 && (
                <ul>
                  {validation.errors.map((error, index) => (
                    <li key={`${index}-${error}`}>{error}</li>
                  ))}
                </ul>
              )}

              <button type="button" onClick={recheck}>
                <RotateCcw size={15} />
                {t.reset}
              </button>
            </div>
          </aside>
        </div>

        {/* FOOTER */}
        <footer className="behar-assessment__footer">
          <span>{t.readOnly}</span>
          <span>P14.4.0.2 / BEHAR LMS</span>
        </footer>
      </div>
    </section>
  );
}
