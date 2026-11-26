
import { Award, GraduationCap, LockKeyhole } from "lucide-react";
import { getCertificateText } from "../../../data/certificates";
import "../../../styles/student/certificates/certificate-artwork.css";

export default function CertificateArtwork({
  certificate,
  language = "en",
  variant = "card",
}) {
  const earned = certificate.status === "earned";
  const locked = certificate.status === "locked";
  const isArabic = language === "ar";

  return (
    <div
      className={[
        "behar-cert-artwork",
        earned ? "is-earned" : "",
        locked ? "is-locked" : "",
        variant === "preview" ? "is-preview" : "",
      ].filter(Boolean).join(" ")}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="behar-cert-artwork-top">
        <span>BEHAR</span>
        <GraduationCap size={20} strokeWidth={1.5} />
      </div>

      <div className="behar-cert-artwork-center">
        <div className="behar-cert-artwork-seal">
          {locked ? (
            <LockKeyhole size={26} strokeWidth={1.5} />
          ) : (
            <Award size={30} strokeWidth={1.4} />
          )}
        </div>

        <span className="behar-cert-artwork-kicker">
          {earned
            ? isArabic
              ? "شهادة إتمام الدورة"
              : "CERTIFICATE OF COMPLETION"
            : isArabic
              ? "إنجاز تعليمي"
              : "LEARNING MILESTONE"}
        </span>

        <h3>{getCertificateText(certificate.title, language)}</h3>

        <div className="behar-cert-artwork-rule" />
      </div>

      <div className="behar-cert-artwork-bottom">
        <span>
          {getCertificateText(certificate.category, language)}
        </span>
        <span>BEHAR ACADEMY</span>
      </div>
    </div>
  );
}
