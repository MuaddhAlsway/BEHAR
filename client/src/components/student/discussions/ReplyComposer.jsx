
import { useState } from "react";
import { Send, X } from "lucide-react";

const translations = {
  en: {
    title: "Write a reply",
    placeholder: "Share your thoughts or help answer this question...",
    publish: "Post reply",
    cancel: "Cancel",
    required: "Please write a reply before submitting.",
    min: "Your reply must contain at least 3 characters.",
    max: "Your reply cannot exceed 2000 characters.",
  },
  ar: {
    title: "كتابة رد",
    placeholder: "شارك أفكارك أو ساعد في الإجابة عن هذا السؤال...",
    publish: "نشر الرد",
    cancel: "إلغاء",
    required: "يرجى كتابة رد قبل النشر.",
    min: "يجب أن يحتوي الرد على 3 أحرف على الأقل.",
    max: "لا يمكن أن يتجاوز الرد 2000 حرف.",
  },
};

export default function ReplyComposer({
  onSubmit,
  onCancel,
  language = "en",
  compact = false,
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const t = translations[language] ?? translations.en;

  function handleSubmit(event) {
    event.preventDefault();

    const content = value.trim();

    if (!content) {
      setError(t.required);
      return;
    }

    if (content.length < 3) {
      setError(t.min);
      return;
    }

    if (content.length > 2000) {
      setError(t.max);
      return;
    }

    onSubmit(content);
    setValue("");
    setError("");
  }

  return (
    <form
      className={`behar-reply-composer ${
        compact ? "is-compact" : ""
      }`}
      onSubmit={handleSubmit}
    >
      <div className="behar-reply-composer-heading">
        <h3>{t.title}</h3>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label={t.cancel}
          >
            <X size={17} />
          </button>
        )}
      </div>

      <textarea
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          setError("");
        }}
        placeholder={t.placeholder}
        rows={compact ? 3 : 5}
        maxLength={2001}
        aria-invalid={Boolean(error)}
      />

      {error && (
        <p className="behar-reply-error" role="alert">
          {error}
        </p>
      )}

      <div className="behar-reply-composer-footer">
        <span>{value.length}/2000</span>

        <button type="submit">
          <Send size={16} />
          {t.publish}
        </button>
      </div>
    </form>
  );
}
