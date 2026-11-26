
import DiscussionUpvote from "./DiscussionUpvote";
import DiscussionBookmark from "./DiscussionBookmark";
import DiscussionSolvedControl from "./DiscussionSolvedControl";

import {
  useDiscussions,
} from "../../../context/DiscussionsContext";

import "../../../styles/student/discussions/discussion-actions.css";

export default function DiscussionActions({
  discussion,
  language = "en",
  compact = false,
}) {
  const {
    toggleDiscussionUpvote,
    toggleDiscussionBookmark,
    toggleDiscussionSolved,
  } = useDiscussions();

  if (!discussion) return null;

  return (
    <div
      className={[
        "behar-discussion-actions",
        compact ? "is-compact" : "",
      ].filter(Boolean).join(" ")}
      role="group"
      aria-label={
        language === "ar"
          ? "إجراءات المناقشة"
          : "Discussion actions"
      }
    >
      <DiscussionUpvote
        count={discussion.upvotes ?? 0}
        active={Boolean(discussion.isUpvoted)}
        onToggle={() =>
          toggleDiscussionUpvote(discussion.id)
        }
        language={language}
        compact={compact}
      />

      <DiscussionBookmark
        active={Boolean(discussion.isBookmarked)}
        onToggle={() =>
          toggleDiscussionBookmark(discussion.id)
        }
        language={language}
        compact={compact}
      />

      <DiscussionSolvedControl
        solved={discussion.status === "solved"}
        isOwner={Boolean(discussion.isMine)}
        onToggle={() =>
          toggleDiscussionSolved(discussion.id)
        }
        language={language}
      />
    </div>
  );
}
