
import { Award, LockKeyhole } from "lucide-react";

const translations = {
  en: {
    progress: "Certificate eligibility progress",
    eligible: "All requirements satisfied",
    pending: "Requirements remaining",
    complete: "Completed checks",
    of: "of",
  },
  ar: {
    progress: "التقدم نحو استحقاق الشهادة",
    eligible: "تم استيفاء جميع المتطلبات",
    pending: "متطلبات متبقية",
    complete: "المتطلبات المكتملة",
    of: "من",
  },
};

export default function CertificateProgress({
  eligibility,
  language = "en",
}) {
  const t = translations[language] ?? translations.en;
  const progress = eligibility?.progress ?? 0;
  const eligible = Boolean(eligibility?.eligible);

  return (
    <div className="behar-cert-eligibility-progress">
      <div className="behar-cert-eligibility-progress-top">
        <div>
          <span className="behar-cert-eligibility-eyebrow">
            {t.progress}
          </span>

          <strong>{progress}%</strong>
        </div>

        <span
          className={`behar-cert-eligibility-indicator ${
            eligible ? "is-eligible" : ""
          }`}
        >
          {eligible ? (
            <Award size={18} />
          ) : (
            <LockKeyhole size={18} />
          )}

          {eligible ? t.eligible : t.pending}
        </span>
      </div>

      <div
        className="behar-cert-eligibility-track"
        role="progressbar"
        aria-label={t.progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <span style={{ width: `${progress}%` }} />
      </div>

      <p>
        {t.complete}: {eligibility?.completed ?? 0}{" "}
        {t.of} {eligibility?.required ?? 0}
      </p>
    </div>
  );
}
