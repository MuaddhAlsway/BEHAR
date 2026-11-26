
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  Copy,
  ShieldCheck,
  X,
} from "lucide-react";

import { getCertificateText } from "../../../data/certificates";
import { getCertificateVerificationUrl } from "../../../utils/certificateVerification";
import CertificateArtwork from "./CertificateArtwork";
import CertificateDownload from "./CertificateDownload";
import CertificateShare from "./CertificateShare";
import "../../../styles/student/certificates/certificate-preview.css";

const copy = {
  en: {
    title: "Certificate preview",
    subtitle: "Your learning milestone",
    close: "Close preview",
    certificateId: "Certificate ID",
    issued: "Issued on",
    instructor: "Instructor",
    course: "Course",
    demo: "Demo certificate — not independently verified",
    copyId: "Copy certificate ID",
    copied: "Certificate ID copied",
    notAvailable: "Certificate details are unavailable.",
    verify: "View demo certificate record",
  },
  ar: {
    title: "معاينة الشهادة",
    subtitle: "إنجازك التعليمي",
    close: "إغلاق المعاينة",
    certificateId: "رقم الشهادة",
    issued: "تاريخ الإصدار",
    instructor: "المدرب",
    course: "الدورة",
    demo: "شهادة تجريبية — غير موثقة رسميًا",
    copyId: "نسخ رقم الشهادة",
    copied: "تم نسخ رقم الشهادة",
    notAvailable: "تفاصيل الشهادة غير متاحة.",
    verify: "عرض سجل الشهادة التجريبي",
  },
};

function formatDate(value, language) {
  if (!value) return "—";

  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-US",
    { day: "numeric", month: "long", year: "numeric" }
  ).format(date);
}

export default function CertificatePreview({
  certificate,
  language = "en",
  studentName = "BEHAR Student",
  onClose,
}) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const previousFocusRef = useRef(null);
  const copyFeedbackTimerRef = useRef(null);
  const [copyFeedback, setCopyFeedback] = useState("");

  const t = copy[language] ?? copy.en;
  const verificationUrl =
    certificate?.status === "earned" && certificate.certificateId
      ? getCertificateVerificationUrl(certificate.certificateId)
      : null;
  const verificationPath = verificationUrl
    ? `${new URL(verificationUrl).pathname}${new URL(verificationUrl).search}`
    : null;

  useEffect(() => () => {
    if (copyFeedbackTimerRef.current) {
      window.clearTimeout(copyFeedbackTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!certificate) return;

    previousFocusRef.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (!focusable?.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [certificate, onClose]);

  if (!certificate || certificate.status !== "earned") {
    return null;
  }

  const handleCopyId = async () => {
    if (!certificate.certificateId) return;

    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(
        certificate.certificateId
      );
      setCopyFeedback(t.copied);
    } catch {
      setCopyFeedback(
        language === "ar"
          ? "تعذر نسخ رقم الشهادة"
          : "Unable to copy certificate ID"
      );
    }

    if (copyFeedbackTimerRef.current) {
      window.clearTimeout(copyFeedbackTimerRef.current);
    }
    copyFeedbackTimerRef.current = window.setTimeout(
      () => setCopyFeedback(""),
      2500
    );
  };

  return createPortal(
    <div
      className="behar-cert-preview-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <section
        ref={dialogRef}
        className="behar-cert-preview-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <header className="behar-cert-preview-header">
          <div className="behar-cert-preview-heading">
            <span className="behar-cert-preview-heading-icon">
              <Award size={20} />
            </span>

            <div>
              <h2 id={titleId}>{t.title}</h2>
              <p>{t.subtitle}</p>
            </div>
          </div>

          <button
            ref={closeRef}
            type="button"
            className="behar-cert-preview-close"
            onClick={onClose}
            aria-label={t.close}
          >
            <X size={20} />
          </button>
        </header>

        <div className="behar-cert-preview-body">
          <CertificateArtwork
            certificate={certificate}
            language={language}
            variant="preview"
          />

          <div className="behar-cert-preview-details">
            <div className="behar-cert-preview-detail">
              <span>{t.course}</span>
              <strong>
                {getCertificateText(certificate.title, language)}
              </strong>
            </div>

            <div className="behar-cert-preview-detail">
              <span>{t.instructor}</span>
              <strong>
                {getCertificateText(certificate.instructor, language)}
              </strong>
            </div>

            <div className="behar-cert-preview-detail">
              <span>
                <CalendarDays size={14} />
                {t.issued}
              </span>
              <strong>
                {formatDate(certificate.issuedAt, language)}
              </strong>
            </div>

            <div className="behar-cert-preview-detail">
              <span>
                <ShieldCheck size={14} />
                {t.certificateId}
              </span>

              <div className="behar-cert-preview-id">
                <code>{certificate.certificateId ?? "—"}</code>

                {certificate.certificateId && (
                  <button
                    type="button"
                    onClick={handleCopyId}
                    aria-label={t.copyId}
                    title={t.copyId}
                  >
                    <Copy size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="behar-cert-preview-notice">
            <CheckCircle2 size={17} />
            <span>{t.demo}</span>
          </div>
          <span className="behar-cert-preview-copy-feedback" role="status" aria-live="polite">
            {copyFeedback}
          </span>

          <div className="behar-cert-preview-download">
            <CertificateDownload
              certificate={certificate}
              studentName={studentName}
              language={language}
            />
          </div>

          <CertificateShare
            certificate={certificate}
            language={language}
          />

          {verificationPath && (
            <Link
              className="behar-cert-preview-verification"
              to={verificationPath}
            >
              {t.verify}
            </Link>
          )}
        </div>
      </section>
    </div>,
    document.body
  );
}
