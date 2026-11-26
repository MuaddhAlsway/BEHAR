
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";

import { getDiscussionCourse, getDiscussionText } from "../../data/discussions";
import { useDiscussions } from "../../context/DiscussionsContext";

import DiscussionThread from "../../components/student/discussions/DiscussionThread";
import DiscussionActions from "../../components/student/discussions/DiscussionActions";
import ReplyComposer from "../../components/student/discussions/ReplyComposer";

import "../../styles/student/discussions/discussion-details.css";

const copy = {
  en: {
    back: "Back to discussions",
    community: "STUDENT COMMUNITY",
    replies: "Replies",
    solved: "Solved",
    open: "Open",
    instructor: "Instructor answered",
    notFound: "Discussion not found",
    notFoundDescription:
      "This discussion does not exist or is no longer available.",
    contribute: "Join the conversation",
  },
  ar: {
    back: "العودة للمناقشات",
    community: "مجتمع الطلاب",
    replies: "الردود",
    solved: "تم الحل",
    open: "مفتوح",
    instructor: "رد المدرب",
    notFound: "المناقشة غير موجودة",
    notFoundDescription:
      "هذه المناقشة غير موجودة أو لم تعد متاحة.",
    contribute: "شارك في المناقشة",
  },
};

function getLanguage() {
  return document.documentElement.lang
    ?.toLowerCase()
    .startsWith("ar")
    ? "ar"
    : "en";
}

export default function DiscussionDetails() {
  const { discussionId } = useParams();

  const [language, setLanguage] = useState(getLanguage);

  const {
    getDiscussionById,
    getRepliesByDiscussionId,
    addReply: addDiscussionReply,
  } = useDiscussions();

  const t = copy[language] ?? copy.en;

  const discussion = getDiscussionById(discussionId);
  const replies = getRepliesByDiscussionId(discussionId);

  const course = discussion
    ? getDiscussionCourse(discussion.courseId)
    : null;

  function addReply(content, parentId = null) {
    addDiscussionReply(discussionId, content, parentId);
  }

  if (!discussion) {
    return (
      <div className="behar-discussion-details-empty">
        <h1>{t.notFound}</h1>
        <p>{t.notFoundDescription}</p>
        <Link to="/student/discussions">
          {t.back}
        </Link>
      </div>
    );
  }

  const BackIcon =
    language === "ar" ? ArrowRight : ArrowLeft;

  return (
    <div
      className="behar-discussion-details"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Link
        to="/student/discussions"
        className="behar-discussion-back"
      >
        <BackIcon size={17} />
        {t.back}
      </Link>

      <article className="behar-discussion-question">
        <div className="behar-discussion-question-top">
          <span>{t.community}</span>

          <span
            className={`behar-discussion-status ${
              discussion.status === "solved"
                ? "is-solved"
                : "is-open"
            }`}
          >
            {discussion.status === "solved" ? (
              <CheckCircle2 size={13} />
            ) : null}

            {discussion.status === "solved"
              ? t.solved
              : t.open}
          </span>
        </div>

        <span className="behar-discussion-question-course">
          {getDiscussionText(course?.title, language)}
        </span>

        <h1>
          {getDiscussionText(
            discussion.title,
            language
          )}
        </h1>

        <div className="behar-discussion-question-author">
          <div className="behar-thread-avatar">
            {discussion.author.charAt(0)}
          </div>

          <div>
            <strong>{discussion.author}</strong>
            <time dateTime={discussion.createdAt}>
              {new Intl.DateTimeFormat(
                language === "ar" ? "ar-SA" : "en-GB",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              ).format(new Date(discussion.createdAt))}
            </time>
          </div>
        </div>

        <p className="behar-discussion-question-body">
          {getDiscussionText(
            discussion.body ?? discussion.excerpt,
            language
          )}
        </p>

        <div className="behar-discussion-tags">
          {discussion.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="behar-discussion-question-footer">
          <span>
            <MessageCircle size={16} />
            {replies.length} {t.replies}
          </span>

          <span>
            <ThumbsUp size={16} />
            {discussion.upvotes}
          </span>

          {discussion.hasInstructorReply && (
            <span>
              <BadgeCheck size={16} />
              {t.instructor}
            </span>
          )}
        </div>

        <DiscussionActions
          discussion={discussion}
          language={language}
        />
      </article>

      <DiscussionThread
        replies={replies}
        language={language}
        onReply={addReply}
      />

      <section className="behar-discussion-contribute">
        <h2>{t.contribute}</h2>

        <ReplyComposer
          language={language}
          onSubmit={(content) =>
            addReply(content, null)
          }
        />
      </section>
    </div>
  );
}
