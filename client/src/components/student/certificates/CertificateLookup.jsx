
import { Search, ShieldCheck } from "lucide-react";

const copy = {
  en: {
    label: "Certificate ID",
    placeholder: "BEHAR-CERT-2026-XXXX",
    search: "Search certificate",
    searching: "Checking demo records...",
    hint: "Enter the certificate ID shown on your BEHAR certificate.",
  },
  ar: {
    label: "رقم الشهادة",
    placeholder: "BEHAR-CERT-2026-XXXX",
    search: "البحث عن الشهادة",
    searching: "جاري البحث في السجلات التجريبية...",
    hint: "أدخل رقم الشهادة الموجود على شهادة BEHAR.",
  },
};

export default function CertificateLookup({
  value,
  onChange,
  onSubmit,
  loading = false,
  language = "en",
}) {
  const t = copy[language] ?? copy.en;

  function handleSubmit(event) {
    event.preventDefault();
    if (!loading) onSubmit?.();
  }

  return (
    <form
      className="behar-verify-lookup"
      onSubmit={handleSubmit}
      noValidate
    >
      <label
        htmlFor="behar-certificate-id"
        className="behar-verify-label"
      >
        <ShieldCheck size={17} aria-hidden="true" />
        {t.label}
      </label>

      <div className="behar-verify-input-row">
        <input
          id="behar-certificate-id"
          type="text"
          name="certificateId"
          value={value}
          onChange={(event) =>
            onChange?.(event.target.value)
          }
          placeholder={t.placeholder}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={64}
          disabled={loading}
          aria-describedby="behar-verify-hint"
        />

        <button type="submit" disabled={loading}>
          <Search size={18} aria-hidden="true" />
          <span>{loading ? t.searching : t.search}</span>
        </button>
      </div>

      <p id="behar-verify-hint" className="behar-verify-hint">
        {t.hint}
      </p>
    </form>
  );
}
