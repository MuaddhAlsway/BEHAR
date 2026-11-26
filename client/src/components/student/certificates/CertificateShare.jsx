
import { useState } from "react";
import {
  Share2,
  Copy,
  Check,
  Mail,
  MessageCircle,
} from "lucide-react";

import {
  canShareCertificate,
  getCertificateShareUrl,
  copyCertificateLink,
  shareCertificateNative,
  getCertificateSocialLinks,
} from "../../../utils/certificateSharing";

import "../../../styles/student/certificates/certificate-sharing.css";

const copy = {
  en: {
    heading: "Share your certificate",
    description: "Share your demo achievement with others.",
    native: "Share",
    copy: "Copy link",
    copied: "Link copied",
    linkedin: "LinkedIn",
    whatsapp: "WhatsApp",
    email: "Email",
    cancelled: "",
    error: "Unable to share. Please try copying the link.",
    copyError: "Unable to copy the verification link.",
    demo: "Demo certificate — not an official credential.",
  },
  ar: {
    heading: "مشاركة الشهادة",
    description: "شارك إنجازك التجريبي مع الآخرين.",
    native: "مشاركة",
    copy: "نسخ الرابط",
    copied: "تم نسخ الرابط",
    linkedin: "لينكدإن",
    whatsapp: "واتساب",
    email: "البريد الإلكتروني",
    cancelled: "",
    error: "تعذرت المشاركة. جرّب نسخ الرابط.",
    copyError: "تعذر نسخ رابط التحقق.",
    demo: "شهادة تجريبية وليست اعتمادًا رسميًا.",
  },
};

export default function CertificateShare({
  certificate,
  language = "en",
}) {
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);

  const t = copy[language] ?? copy.en;

  if (!canShareCertificate(certificate)) {
    return null;
  }

  const url = getCertificateShareUrl(certificate);

  const title =
    language === "ar"
      ? "شهادة إتمام دورة من BEHAR — تجريبية"
      : "BEHAR Demo Course Completion Certificate";

  const message =
    language === "ar"
      ? "أشارك شهادة إتمام دورة تجريبية من BEHAR. هذه ليست شهادة رسمية."
      : "Sharing my BEHAR demo course completion certificate. This is not an official credential.";

  const links = getCertificateSocialLinks({
    title,
    url,
  });

  async function handleNativeShare() {
    if (busy) return;

    setBusy(true);
    setFeedback("");

    try {
      const result = await shareCertificateNative({
        title,
        text: message,
        url,
      });

      if (result.status === "error") {
        setFeedback(t.error);
      } else if (result.status === "unsupported") {
        setFeedback(t.copy);
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleCopy() {
    if (busy) return;

    setBusy(true);
    setFeedback("");

    try {
      await copyCertificateLink(url);
      setFeedback(t.copied);
    } catch {
      setFeedback(t.copyError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className="behar-certificate-share"
      dir={language === "ar" ? "rtl" : "ltr"}
      aria-label={t.heading}
    >
      <div className="behar-certificate-share-heading">
        <Share2 size={19} aria-hidden="true" />

        <div>
          <h3>{t.heading}</h3>
          <p>{t.description}</p>
        </div>
      </div>

      <div className="behar-certificate-share-actions">
        {typeof navigator !== "undefined" &&
          typeof navigator.share === "function" && (
            <button
              type="button"
              onClick={handleNativeShare}
              disabled={busy}
            >
              <Share2 size={16} aria-hidden="true" />
              {t.native}
            </button>
          )}

        <button
          type="button"
          onClick={handleCopy}
          disabled={busy}
        >
          {feedback === t.copied ? (
            <Check size={16} aria-hidden="true" />
          ) : (
            <Copy size={16} aria-hidden="true" />
          )}

          {feedback === t.copied ? t.copied : t.copy}
        </button>

        <a
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.linkedin}
        >
          <Share2 size={16} aria-hidden="true" />
          {t.linkedin}
        </a>

        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.whatsapp}
        >
          <MessageCircle size={16} aria-hidden="true" />
          {t.whatsapp}
        </a>

        <a
          href={links.email}
          aria-label={t.email}
        >
          <Mail size={16} aria-hidden="true" />
          {t.email}
        </a>
      </div>

      {feedback && (
        <p
          className="behar-certificate-share-feedback"
          role="status"
          aria-live="polite"
        >
          {feedback}
        </p>
      )}

      <p className="behar-certificate-share-disclaimer">
        {t.demo}
      </p>
    </section>
  );
}
