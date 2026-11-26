
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import CertificateLookup from "../../components/student/certificates/CertificateLookup";
import VerificationResult from "../../components/student/certificates/VerificationResult";

import {
  getCertificateVerificationUrl,
  lookupDemoCertificate,
} from "../../utils/certificateVerification";

import "../../styles/student/public/verify-certificate.css";

const copy = {
  en: {
    back: "Back to BEHAR",
    eyebrow: "BEHAR CREDENTIALS",
    title: "Certificate verification",
    description:
      "Search for a BEHAR certificate using its unique ID. This frontend demo checks sample records only.",
    transparency:
      "Verification preview — official credential authentication is not yet available.",
    footer: "BEHAR Learning Platform",
  },
  ar: {
    back: "العودة إلى BEHAR",
    eyebrow: "شهادات BEHAR",
    title: "التحقق من الشهادات",
    description:
      "ابحث عن شهادة BEHAR باستخدام رقمها الفريد. هذه النسخة التجريبية تبحث في بيانات توضيحية فقط.",
    transparency:
      "معاينة التحقق — توثيق الشهادات الرسمي غير متاح حاليًا.",
    footer: "منصة BEHAR التعليمية",
  },
};

function getDocumentLanguage() {
  if (typeof document === "undefined") return "en";

  return document.documentElement.lang
    ?.toLowerCase()
    .startsWith("ar")
    ? "ar"
    : "en";
}

export default function VerifyCertificate() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const queryId = searchParams.get("id") ?? "";

  const [language, setLanguage] = useState(
    getDocumentLanguage
  );

  const [input, setInput] = useState(queryId);
  const [result, setResult] = useState(null);
  const [copyStatus, setCopyStatus] = useState("");

  const previousQueryRef = useRef(queryId);

  const t = copy[language] ?? copy.en;

  // Follow the existing document language, including
  // language changes made elsewhere in the app.
  useEffect(() => {
    const root = document.documentElement;

    const updateLanguage = () => {
      setLanguage(getDocumentLanguage());
    };

    updateLanguage();

    const observer = new MutationObserver(updateLanguage);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  // Support browser back/forward navigation and
  // direct links with ?id=...
  useEffect(() => {
    if (previousQueryRef.current === queryId) return;

    previousQueryRef.current = queryId;
    setInput(queryId);
    setResult(
      queryId ? lookupDemoCertificate(queryId) : null
    );
    setCopyStatus("");
  }, [queryId]);

  // Initial URL lookup.
  useEffect(() => {
    if (queryId) {
      setResult(lookupDemoCertificate(queryId));
    }
    // Run on initial mount; subsequent URL changes
    // are handled by the effect above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleInputChange(value) {
    setInput(value);
    setCopyStatus("");
  }

  function handleSearch() {
    const nextResult = lookupDemoCertificate(input);

    setResult(nextResult);
    setCopyStatus("");

    if (nextResult.status === "invalid") {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("id", nextResult.id);

    setSearchParams(nextParams);
    previousQueryRef.current = nextResult.id;
  }

  async function handleCopy() {
    if (!result || result.status !== "demo-found") {
      return;
    }

    const url = getCertificateVerificationUrl(
      result.id
    );

    if (!url) {
      setCopyStatus("error");
      return;
    }

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }

      await navigator.clipboard.writeText(url);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  const ArrowIcon =
    language === "ar" ? ArrowRight : ArrowLeft;

  return (
    <main
      className="behar-verify-page"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <div className="behar-verify-shell">
        <header className="behar-verify-navigation">
          <Link to="/" className="behar-verify-brand">
            <span className="behar-verify-brand-mark">
              B
            </span>
            <strong>BEHAR</strong>
          </Link>

          <Link to="/" className="behar-verify-back">
            <ArrowIcon size={17} aria-hidden="true" />
            {t.back}
          </Link>
        </header>

        <div className="behar-verify-hero">
          <div className="behar-verify-hero-icon">
            <ShieldCheck
              size={29}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>

          <span className="behar-verify-eyebrow">
            {t.eyebrow}
          </span>

          <h1>{t.title}</h1>

          <p>{t.description}</p>
        </div>

        <div className="behar-verify-panel">
          <CertificateLookup
            value={input}
            onChange={handleInputChange}
            onSubmit={handleSearch}
            language={language}
          />

          <VerificationResult
            result={result}
            language={language}
            onCopy={handleCopy}
            copyStatus={copyStatus}
          />
        </div>

        <div className="behar-verify-transparency">
          <ShieldCheck size={17} aria-hidden="true" />
          <p>{t.transparency}</p>
        </div>

        <footer className="behar-verify-footer">
          <span>© BEHAR</span>
          <span>{t.footer}</span>
        </footer>
      </div>
    </main>
  );
}
