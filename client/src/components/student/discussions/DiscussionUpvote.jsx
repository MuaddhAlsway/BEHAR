
import { ThumbsUp } from "lucide-react";

const copy = {
  en: {
    upvote: "Upvote",
    remove: "Remove upvote",
  },
  ar: {
    upvote: "تصويت إيجابي",
    remove: "إلغاء التصويت",
  },
};

export default function DiscussionUpvote({
  count = 0,
  active = false,
  onToggle,
  language = "en",
  compact = false,
}) {
  const t = copy[language] ?? copy.en;

  return (
    <button
      type="button"
      className={[
        "behar-discussion-action",
        "behar-discussion-upvote",
        active ? "is-active" : "",
        compact ? "is-compact" : "",
      ].filter(Boolean).join(" ")}
      onClick={onToggle}
      aria-pressed={active}
      aria-label={`${active ? t.remove : t.upvote}: ${count}`}
      title={active ? t.remove : t.upvote}
    >
      <ThumbsUp
        size={compact ? 15 : 17}
        fill={active ? "currentColor" : "none"}
        aria-hidden="true"
      />

      {!compact && <span>{t.upvote}</span>}

      <span className="behar-discussion-action-count">
        {count}
      </span>
    </button>
  );
}
