
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  LockKeyhole,
  Eye,
} from "lucide-react";

import { getCertificateText } from "../../../data/certificates";
import CertificateArtwork from "./CertificateArtwork";
import "../../../styles/student/certificates/certificate-card.css";

const labels = {
  en: {
    earned: "Earned",
    inProgress: "In progress",
    locked: "Locked",
    by: "By",
    issued: "Issued",
    view: "Preview certificate",
    continue: "Continue learning",
    unavailable: "Course unavailable",
    lockedMessage: "Complete the course to unlock",
    progress: "Course progress",
    demo: "Demo credential",
  },
  ar: {
    earned: "مكتسبة",
    inProgress: "قيد التقدم",
    locked: "مقفلة",
    by: "بواسطة",
    issued: "تاريخ الإصدار",
    view: "معاينة الشهادة",
    continue: "متابعة التعلم",
    unavailable: "الدورة غير متاحة",
    lockedMessage: "أكمل الدورة للحصول على الشهادة",
    progress: "تقدم الدورة",
    demo: "شهادة تجريبية",
  },
};

export default function CertificateCard({
  certificate,
  language = "en",
  onPreview,
}) {
  const t = labels[language] ?? labels.en;
  const earned = certificate.status === "earned";
  const inProgress = certificate.status === "in-progress";
  const locked = certificate.status === "locked";

  const statusLabel = earned
    ? t.earned
    : inProgress
      ? t.inProgress
      : t.locked;

  const date =
    certificate.issuedAt &&
    new Intl.DateTimeFormat(
      language === "ar" ? "ar-SA" : "en-US",
      { year: "numeric", month: "short", day: "numeric" }
    ).format(new Date(`${certificate.issuedAt}T12:00:00`));

  const progress = Math.max(
    0,
    Math.min(100, Number(certificate.progress) || 0)
  );

  return (
    <article className="behar-cert-card">
      <CertificateArtwork
        certificate={certificate}
        language={language}
      />

      <div className="behar-cert-card-body">
        <div className="behar-cert-card-meta">
          <span>
            {getCertificateText(certificate.category, language)}
          </span>

          <span
            className={`behar-cert-status status-${certificate.status}`}
          >
            {earned ? (
              <CheckCircle2 size={13} />
            ) : locked ? (
              <LockKeyhole size={13} />
            ) : (
              <Clock3 size={13} />
            )}
            {statusLabel}
          </span>
        </div>

        <h3>
          {getCertificateText(certificate.title, language)}
        </h3>

        <p className="behar-cert-instructor">
          {t.by}{" "}
          {getCertificateText(certificate.instructor, language)}
        </p>

        {inProgress && (
          <div className="behar-cert-progress">
            <div className="behar-cert-progress-label">
              <span>{t.progress}</span>
              <strong>{progress}%</strong>
            </div>

            <div
              className="behar-cert-progress-track"
              role="progressbar"
              aria-label={t.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {earned && date && (
          <p className="behar-cert-issued">
            <CheckCircle2 size={14} />
            {t.issued}: {date}
            <span className="behar-cert-demo">{t.demo}</span>
          </p>
        )}

        {locked && (
          <p className="behar-cert-locked-message">
            <LockKeyhole size={14} />
            {t.lockedMessage}
          </p>
        )}

        <div className="behar-cert-card-footer">
          {earned ? (
            <button
              type="button"
              className="behar-cert-card-action"
              onClick={() => onPreview?.(certificate)}
            >
              <span>{t.view}</span>
              <Eye size={17} />
            </button>
          ) : certificate.courseSlug ? (
            <Link
              to={`/courses/${certificate.courseSlug}`}
              className="behar-cert-card-action"
            >
              <span>{t.continue}</span>
              <ChevronRight size={17} />
            </Link>
          ) : (
            <span className="behar-cert-action-disabled">
              {t.unavailable}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
