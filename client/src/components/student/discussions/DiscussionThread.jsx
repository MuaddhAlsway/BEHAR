
import DiscussionReply from "./DiscussionReply";

const copy = {
  en: {
    title: "Community replies",
    empty: "No replies yet. Be the first to contribute.",
  },
  ar: {
    title: "ردود المجتمع",
    empty: "لا توجد ردود حتى الآن. كن أول من يشارك.",
  },
};

export default function DiscussionThread({
  replies,
  language = "en",
  onReply,
}) {
  const t = copy[language] ?? copy.en;

  const replyIds = new Set(replies.map((reply) => reply.id));

  function renderReplies(parentId = null, visited = new Set()) {
    return replies
      .filter((reply) => {
        if (parentId === null) {
          return (
            !reply.parentId ||
            !replyIds.has(reply.parentId)
          );
        }

        return reply.parentId === parentId;
      })
      .filter((reply) => !visited.has(reply.id))
      .map((reply) => {
        const nextVisited = new Set(visited);
        nextVisited.add(reply.id);
        const children = renderReplies(reply.id, nextVisited);

        return (
          <DiscussionReply
            key={reply.id}
            reply={reply}
            language={language}
            onReply={onReply}
          >
            {children.length > 0 && (
              <div className="behar-thread-children">
                {children}
              </div>
            )}
          </DiscussionReply>
        );
      });
  }

  return (
    <section className="behar-discussion-thread">
      <h2>
        {t.title}
        <span>{replies.length}</span>
      </h2>

      {replies.length === 0 ? (
        <div className="behar-thread-empty">
          {t.empty}
        </div>
      ) : (
        <div className="behar-thread-list">
          {renderReplies()}
        </div>
      )}
    </section>
  );
}
