
import React from "react";
import { getCertificateText } from "../../../data/certificates";
import "../../../styles/student/certificates/certificate-pdf.css";

const translations = {
  en: {
    eyebrow: "BEHAR LEARNING PLATFORM",
    title: "Certificate of Completion",
    statement: "This certificate is proudly presented to",
    completed: "For successfully completing the course",
    instructor: "Instructor",
    issued: "Date Issued",
    id: "Certificate ID",
    demo: "DEMO CERTIFICATE — NOT AN OFFICIAL CREDENTIAL",
    footer: "Learning without limits.",
  },
  ar: {
    eyebrow: "منصة بحار التعليمية",
    title: "شهادة إتمام دورة",
    statement: "تُمنح هذه الشهادة إلى",
    completed: "وذلك لإتمام الدورة التعليمية بنجاح",
    instructor: "المدرب",
    issued: "تاريخ الإصدار",
    id: "رقم الشهادة",
    demo: "شهادة تجريبية — ليست اعتمادًا رسميًا",
    footer: "تعلّم بلا حدود.",
  },
};

export default function CertificatePDF({
  certificate,
  language = "en",
}) {
  const t = translations[language] || translations.en;
  const isArabic = language === "ar";

  const studentName =
    certificate.studentName || "Student Name";

  const courseTitle = getCertificateText(
    certificate.courseTitle,
    language
  ) || "Course Title";

  const instructorName = getCertificateText(
    certificate.instructorName,
    language
  ) || "Instructor";

  const issueDate = certificate.issueDate
    ? new Intl.DateTimeFormat(
        isArabic ? "ar-SA" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      ).format(new Date(certificate.issueDate))
    : "—";

  return (
    <article
      className="behar-pdf"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
    >
      <div className="behar-pdf-border">
        <header className="behar-pdf-header">
          <div className="behar-pdf-logo">
            <span className="behar-pdf-logo-mark">B</span>
            <span>BEHAR</span>
          </div>

          <p>{t.eyebrow}</p>
        </header>

        <div className="behar-pdf-decoration">
          <span />
          <span />
          <span />
        </div>

        <main className="behar-pdf-content">
          <p className="behar-pdf-kicker">
            {t.eyebrow}
          </p>

          <h1>{t.title}</h1>

          <div className="behar-pdf-rule" />

          <p className="behar-pdf-statement">
            {t.statement}
          </p>

          <h2 className="behar-pdf-student">
            {studentName}
          </h2>

          <p className="behar-pdf-completed">
            {t.completed}
          </p>

          <h3 className="behar-pdf-course">
            {courseTitle}
          </h3>
        </main>

        <section className="behar-pdf-details">
          <div>
            <span>{t.instructor}</span>
            <strong>{instructorName}</strong>
          </div>

          <div>
            <span>{t.issued}</span>
            <strong>{issueDate}</strong>
          </div>

          <div>
            <span>{t.id}</span>
            <strong
              className="behar-pdf-certificate-id"
              dir="ltr"
            >
              {certificate.certificateId}
            </strong>
          </div>
        </section>

        <footer className="behar-pdf-footer">
          <span>{t.footer}</span>
          <strong>{t.demo}</strong>
        </footer>
      </div>
    </article>
  );
}
