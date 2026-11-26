
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getCertificateText } from "../../../data/certificates";
import CertificateProgress from "./CertificateProgress";
import RequirementItem from "./RequirementItem";

import "../../../styles/student/certificates/certificate-requirements.css";

const translations = {
  en: {
    eyebrow: "CERTIFICATE REQUIREMENTS",
    title: "Your path to certification",
    description:
      "Track the learning requirements you need to complete before becoming eligible for a certificate.",
    eligible:
      "All demo requirements are satisfied. Official certificate issuance is not available yet.",
    pending:
      "Complete the remaining requirements to become eligible.",
    unavailable:
      "Requirements are not configured for this course.",
    existing:
      "This course has an existing demo certificate. The eligibility checks below are illustrative and do not verify that credential.",
    continue: "Continue learning",
    demo: "Demo eligibility data — not official verification",
  },
  ar: {
    eyebrow: "متطلبات الشهادة",
    title: "طريقك للحصول على الشهادة",
    description:
      "تابع متطلبات التعلم التي تحتاج إلى إكمالها لتصبح مؤهلًا للحصول على الشهادة.",
    eligible:
      "تم استيفاء المتطلبات التجريبية. إصدار الشهادات الرسمية غير متاح بعد.",
    pending:
      "أكمل المتطلبات المتبقية لتصبح مؤهلًا.",
    unavailable:
      "لم يتم تحديد متطلبات لهذه الدورة.",
    existing:
      "توجد شهادة تجريبية لهذه الدورة. نتائج المتطلبات المعروضة توضيحية ولا تثبت صحة الشهادة.",
    continue: "متابعة التعلم",
    demo: "بيانات أهلية تجريبية — ليست تحققًا رسميًا",
  },
};

export default function CertificateRequirements({
  certificate,
  eligibility,
  language = "en",
}) {
  const t = translations[language] ?? translations.en;

  if (!certificate) return null;

  const earned = certificate.status === "earned";

  return (
    <section
      className="behar-cert-requirements"
      dir={language === "ar" ? "rtl" : "ltr"}
      aria-label={t.title}
    >
      <header className="behar-cert-requirements-header">
        <div>
          <span className="behar-cert-requirements-eyebrow">
            <ClipboardCheck size={15} />
            {t.eyebrow}
          </span>

          <h2>{t.title}</h2>

          <p>{t.description}</p>
        </div>

        <span className="behar-cert-requirements-course">
          {getCertificateText(certificate.title, language)}
        </span>
      </header>

      {!eligibility?.available ? (
        <div className="behar-cert-requirements-alert">
          <AlertCircle size={18} />
          <span>{t.unavailable}</span>
        </div>
      ) : (
        <>
          <CertificateProgress
            eligibility={eligibility}
            language={language}
          />

          <div className="behar-cert-requirements-list">
            {eligibility.requirements.map((requirement) => (
              <RequirementItem
                key={requirement.id}
                requirement={requirement}
                language={language}
              />
            ))}
          </div>

          <div
            className={`behar-cert-requirements-alert ${
              eligibility.eligible ? "is-success" : ""
            }`}
          >
            {eligibility.eligible ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}

            <span>
              {earned
                ? t.existing
                : eligibility.eligible
                  ? t.eligible
                  : t.pending}
            </span>
          </div>
        </>
      )}

      <footer className="behar-cert-requirements-footer">
        <span>{t.demo}</span>

        {certificate.courseSlug && (
          <Link to={`/courses/${certificate.courseSlug}`}>
            {t.continue}
            <ArrowRight size={16} />
          </Link>
        )}
      </footer>
    </section>
  );
}
