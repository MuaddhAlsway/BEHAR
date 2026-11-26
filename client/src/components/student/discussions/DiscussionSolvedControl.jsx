
import { CheckCircle2, RotateCcw } from "lucide-react";

const copy = {
  en: {
    solve: "Mark as solved",
    reopen: "Reopen discussion",
  },
  ar: {
    solve: "تحديد كمحلولة",
    reopen: "إعادة فتح المناقشة",
  },
};

export default function DiscussionSolvedControl({
  solved = false,
  isOwner = false,
  onToggle,
  language = "en",
}) {
  const t = copy[language] ?? copy.en;

  if (!isOwner) return null;

  return (
    <button
      type="button"
      className={[
        "behar-discussion-action",
        "behar-discussion-solved-control",
        solved ? "is-solved" : "",
      ].filter(Boolean).join(" ")}
      onClick={onToggle}
      aria-label={solved ? t.reopen : t.solve}
    >
      {solved ? (
        <RotateCcw size={16} aria-hidden="true" />
      ) : (
        <CheckCircle2 size={16} aria-hidden="true" />
      )}

      <span>
        {solved ? t.reopen : t.solve}
      </span>
    </button>
  );
}
