
import {
  AlertCircle,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getCertificateText } from "../../../data/certificates";

const copy = {
  en: {
    demoFound: "Demo certificate found",
    notVerified: "Not officially verified",
    foundDescription:
      "This certificate ID matches an earned record in the BEHAR demo dataset. This result does not confirm an officially issued credential.",
    invalid: "Invalid certificate ID",
    required: "Enter a certificate ID to continue.",
    invalidFormat:
      "The certificate ID format is not recognized.",
    notFound: "Certificate not found",
    notFoundDescription:
      "No earned demo certificate matches this ID.",
    course: "Course",
    instructor: "Instructor",
    issued: "Issue date",
    id: "Certificate ID",
    recipient: "Recipient",
    recipientUnavailable: "Not available in demo record",
    copy: "Copy verification link",
    copied: "Link copied",
    copyFailed: "Unable to copy the link",
    note: "Demo lookup only — backend verification is not connected.",
    backToCourses: "Explore courses",
  },
  ar: {
    demoFound: "تم العثور على شهادة تجريبية",
    notVerified: "غير موثقة رسميًا",
    foundDescription:
      "رقم الشهادة مطابق لسجل مكتمل في بيانات BEHAR التجريبية. هذه النتيجة لا تثبت إصدار شهادة رسمية.",
    invalid: "رقم الشهادة غير صالح",
    required: "أدخل رقم الشهادة للمتابعة.",
    invalidFormat: "صيغة رقم الشهادة غير معروفة.",
    notFound: "لم يتم العثور على الشهادة",
    notFoundDescription:
      "لا توجد شهادة مكتسبة مطابقة في البيانات التجريبية.",
    course: "الدورة",
    instructor: "المدرب",
    issued: "تاريخ الإصدار",
    id: "رقم الشهادة",
    recipient: "صاحب الشهادة",
    recipientUnavailable: "غير متوفر في السجل التجريبي",
    copy: "نسخ رابط التحقق",
    copied: "تم نسخ الرابط",
    copyFailed: "تعذر نسخ الرابط",
    note: "بحث تجريبي فقط — لم يتم ربط التحقق بالخادم.",
    backToCourses: "استكشاف الدورات",
  },
};

function formatDate(value, language) {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-GB",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  ).format(date);
}

function Detail({ icon: Icon, label, value, ltr = false }) {
  return (
    <div className="behar-verify-detail">
      <span className="behar-verify-detail-icon">
        <Icon size={18} aria-hidden="true" />
      </span>

      <div>
        <span className="behar-verify-detail-label">
          {label}
        </span>
        <strong dir={ltr ? "ltr" : undefined}>
          {value || "—"}
        </strong>
      </div>
    </div>
  );
}

export default function VerificationResult({
  result,
  language = "en",
  onCopy,
  copyStatus = "",
}) {
  const t = copy[language] ?? copy.en;

  if (!result) return null;

  if (result.status === "invalid") {
    return (
      <section
        className="behar-verify-result is-error"
        role="status"
      >
        <AlertCircle size={24} aria-hidden="true" />
        <div>
          <h2>{t.invalid}</h2>
          <p>
            {result.reason === "required"
              ? t.required
              : t.invalidFormat}
          </p>
        </div>
      </section>
    );
  }

  if (result.status === "not-found") {
    return (
      <section
        className="behar-verify-result is-error"
        role="status"
      >
        <ShieldAlert size={24} aria-hidden="true" />
        <div>
          <h2>{t.notFound}</h2>
          <p>{t.notFoundDescription}</p>
        </div>
      </section>
    );
  }

  if (result.status !== "demo-found") return null;

  const certificate = result.certificate;

  // Never invent a recipient name when it is not
  // stored on the certificate record.
  const recipient =
    certificate.studentName ||
    certificate.recipientName ||
    t.recipientUnavailable;

  return (
    <section className="behar-verify-credential">
      <div className="behar-verify-result is-found">
        <CheckCircle2 size={25} aria-hidden="true" />

        <div>
          <h2>{t.demoFound}</h2>
          <p>{t.foundDescription}</p>
        </div>
      </div>

      <div className="behar-verify-credential-heading">
        <div className="behar-verify-credential-symbol">
          <Award size={30} aria-hidden="true" />
        </div>

        <div>
          <span>{t.notVerified}</span>
          <h3>
            {getCertificateText(
              certificate.title,
              language
            )}
          </h3>
        </div>
      </div>

      <div className="behar-verify-details">
        <Detail
          icon={UserRound}
          label={t.recipient}
          value={recipient}
        />

        <Detail
          icon={BookOpen}
          label={t.course}
          value={getCertificateText(
            certificate.title,
            language
          )}
        />

        <Detail
          icon={UserRound}
          label={t.instructor}
          value={getCertificateText(
            certificate.instructor,
            language
          )}
        />

        <Detail
          icon={CalendarDays}
          label={t.issued}
          value={formatDate(
            certificate.issuedAt,
            language
          )}
        />

        <Detail
          icon={Award}
          label={t.id}
          value={certificate.certificateId}
          ltr
        />
      </div>

      <div className="behar-verify-actions">
        <button
          type="button"
          onClick={onCopy}
          className="behar-verify-copy"
        >
          <Copy size={17} aria-hidden="true" />
          {t.copy}
        </button>

        <Link to="/courses">
          {t.backToCourses}
          <ExternalLink size={16} aria-hidden="true" />
        </Link>
      </div>

      <p
        className="behar-verify-copy-status"
        role="status"
        aria-live="polite"
      >
        {copyStatus === "copied"
          ? t.copied
          : copyStatus === "error"
            ? t.copyFailed
            : ""}
      </p>

      <div className="behar-verify-disclaimer">
        <ShieldAlert size={17} aria-hidden="true" />
        <span>{t.note}</span>
      </div>
    </section>
  );
}
