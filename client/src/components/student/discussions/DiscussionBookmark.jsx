
import { Bookmark } from "lucide-react";

const copy = {
  en: {
    save: "Save discussion",
    saved: "Remove bookmark",
  },
  ar: {
    save: "حفظ المناقشة",
    saved: "إزالة من المحفوظات",
  },
};

export default function DiscussionBookmark({
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
        "behar-discussion-bookmark",
        active ? "is-active" : "",
        compact ? "is-compact" : "",
      ].filter(Boolean).join(" ")}
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? t.saved : t.save}
      title={active ? t.saved : t.save}
    >
      <Bookmark
        size={compact ? 15 : 17}
        fill={active ? "currentColor" : "none"}
        aria-hidden="true"
      />

      {!compact && (
        <span>{active ? t.saved : t.save}</span>
      )}
    </button>
  );
}
