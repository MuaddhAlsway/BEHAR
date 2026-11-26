
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  LoaderCircle,
} from "lucide-react";

import CertificatePDF from "./CertificatePDF";
import { exportCertificatePDF } from "../../../utils/exportCertificatePDF";
import "../../../styles/student/certificates/certificate-download.css";

const translations = {
  en: {
    download: "Download PDF",
    generating: "Generating PDF...",
    success: "Your PDF download has started.",
    error: "Unable to generate the certificate.",
    demo: "Download demo certificate",
  },
  ar: {
    download: "تحميل PDF",
    generating: "جاري إنشاء الشهادة...",
    success: "بدأ تحميل ملف الشهادة.",
    error: "تعذر إنشاء ملف الشهادة.",
    demo: "تحميل شهادة تجريبية",
  },
};

export default function CertificateDownload({
  certificate,
  studentName = "BEHAR Student",
  language = "en",
}) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const mountedRef = useRef(true);
  const downloadGuardRef = useRef(false);
  const exportRef = useRef(null);

  const t = translations[language] ?? translations.en;

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    setStatus("idle");
    setError("");
  }, [certificate?.id, studentName]);

  const isEarned = Boolean(
    certificate?.status === "earned" && certificate?.certificateId
  );
  const isLoading = status === "loading";

  async function handleDownload() {
    if (!isEarned || isLoading || downloadGuardRef.current) return;

    downloadGuardRef.current = true;
    setStatus("loading");
    setError("");

    try {
      await exportCertificatePDF(exportRef.current, {
        ...certificate,
        studentName,
        courseTitle: certificate.title,
        instructorName: certificate.instructor,
        issueDate: certificate.issuedAt,
      });

      if (mountedRef.current) {
        setStatus("success");
      }
    } catch (err) {
      if (mountedRef.current) {
        setStatus("error");
        setError(err?.message || t.error);
      }
    } finally {
      downloadGuardRef.current = false;
    }
  }

  return (
    <>
      <div className="behar-cert-download">
      <button
        type="button"
        className="behar-cert-download-button"
        onClick={handleDownload}
        disabled={!isEarned || isLoading}
        aria-busy={isLoading}
        aria-label={t.demo}
      >
        {isLoading ? (
          <LoaderCircle
            size={18}
            className="behar-cert-download-spinner"
          />
        ) : (
          <Download size={18} />
        )}

        <span>
          {isLoading ? t.generating : t.download}
        </span>
      </button>

      <div
        className="behar-cert-download-feedback"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {status === "success" && (
          <p className="behar-cert-download-success">
            <CheckCircle2 size={15} />
            {t.success}
          </p>
        )}

        {status === "error" && (
          <p className="behar-cert-download-error">
            <AlertCircle size={15} />
            {error}
          </p>
        )}
      </div>
      </div>

      {isEarned && typeof document !== "undefined" && createPortal(
        <div className="behar-cert-download-export" aria-hidden="true" inert="">
          <div ref={exportRef}>
            <CertificatePDF
              certificate={{
                ...certificate,
                studentName,
                courseTitle: certificate.title,
                instructorName: certificate.instructor,
                issueDate: certificate.issuedAt,
              }}
              language={language}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
