
import { useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  CornerDownRight,
} from "lucide-react";
import { useDiscussions } from "../../../context/DiscussionsContext";
import DiscussionUpvote from "./DiscussionUpvote";

import { getDiscussionText } from "../../../data/discussions";
import ReplyComposer from "./ReplyComposer";

const copy = {
  en: {
    instructor: "Instructor",
    accepted: "Accepted answer",
    reply: "Reply",
  },
  ar: {
    instructor: "مدرب",
    accepted: "إجابة معتمدة",
    reply: "رد",
  },
};

export default function DiscussionReply({
  reply,
  language = "en",
  onReply,
  children,
}) {
  const [showComposer, setShowComposer] = useState(false);
  const { toggleReplyUpvote } = useDiscussions();
  const t = copy[language] ?? copy.en;

  const date = new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(reply.createdAt));

  function handleNestedReply(content) {
    onReply(content, reply.id);
    setShowComposer(false);
  }

  return (
    <article className="behar-thread-reply">
      <div className="behar-thread-reply-main">
        <div className="behar-thread-avatar">
          {reply.author.charAt(0)}
        </div>

        <div className="behar-thread-reply-content">
          <div className="behar-thread-reply-header">
            <strong>{reply.author}</strong>

            {reply.authorRole === "instructor" && (
              <span className="behar-thread-instructor">
                <BadgeCheck size={14} />
                {t.instructor}
              </span>
            )}

            <time dateTime={reply.createdAt}>
              {date}
            </time>
          </div>

          {reply.isAccepted && (
            <span className="behar-thread-accepted">
              <CheckCircle2 size={14} />
              {t.accepted}
            </span>
          )}

          <p className="behar-thread-reply-text">
            {getDiscussionText(reply.content, language)}
          </p>

          <div className="behar-thread-reply-actions">
            <DiscussionUpvote
              count={reply.upvotes ?? 0}
              active={Boolean(reply.isUpvoted)}
              onToggle={() => toggleReplyUpvote(reply.id)}
              language={language}
              compact
            />

            <button
              type="button"
              onClick={() => setShowComposer((value) => !value)}
            >
              <CornerDownRight size={15} />
              {t.reply}
            </button>
          </div>

          {showComposer && (
            <ReplyComposer
              compact
              language={language}
              onSubmit={handleNestedReply}
              onCancel={() => setShowComposer(false)}
            />
          )}

          {children}
        </div>
      </div>
    </article>
  );
}
