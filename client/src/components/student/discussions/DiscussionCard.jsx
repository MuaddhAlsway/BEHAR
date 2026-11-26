
import {
  ArrowUp,
  CheckCircle2,
  GraduationCap,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import DiscussionActions from "./DiscussionActions";

import {
  getDiscussionCourse,
  getDiscussionText,
} from "../../../data/discussions";

const copy = {
  en: {
    solved: "Solved",
    open: "Open",
    replies: "Replies",
    votes: "Upvotes",
    instructor: "Instructor replied",
    by: "By",
    mine: "My question",
  },
  ar: {
    solved: "تم الحل",
    open: "مفتوح",
    replies: "الردود",
    votes: "التصويتات",
    instructor: "رد المدرب",
    by: "بواسطة",
    mine: "سؤالي",
  },
};

export default function DiscussionCard({
  discussion,
  language = "en",
}) {
  const t = copy[language] ?? copy.en;
  const course = getDiscussionCourse(discussion.courseId);
  const solved = discussion.status === "solved";

  const date = new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }
  ).format(new Date(discussion.createdAt));

  return (
    <article className="behar-discussion-card">
      <div className="behar-discussion-card-top">
        <span className="behar-discussion-course-label">
          {getDiscussionText(course?.title, language)}
        </span>

        <span
          className={`behar-discussion-status ${
            solved ? "is-solved" : "is-open"
          }`}
        >
          {solved && (
            <CheckCircle2 size={13} aria-hidden="true" />
          )}
          {solved ? t.solved : t.open}
        </span>
      </div>

      <h3>
        <Link
          to={`/student/discussions/${discussion.id}`}
          className="behar-discussion-card-link"
        >
          {getDiscussionText(discussion.title, language)}
        </Link>
      </h3>

      <p className="behar-discussion-excerpt">
        {getDiscussionText(discussion.excerpt, language)}
      </p>

      <div className="behar-discussion-tags">
        {discussion.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="behar-discussion-card-footer">
        <div className="behar-discussion-author">
          <span className="behar-discussion-avatar">
            {discussion.author.charAt(0)}
          </span>

          <div>
            <strong>
              {t.by} {discussion.author}
            </strong>
            <span>{date}</span>
          </div>
        </div>

        <div className="behar-discussion-card-metrics">
          {discussion.isMine && (
            <span className="behar-discussion-mine">
              {t.mine}
            </span>
          )}

          {discussion.hasInstructorReply && (
            <span
              className="behar-discussion-instructor"
              title={t.instructor}
              aria-label={t.instructor}
            >
              <GraduationCap size={16} />
            </span>
          )}

          <span aria-label={`${discussion.upvotes} ${t.votes}`}>
            <ArrowUp size={15} aria-hidden="true" />
            {discussion.upvotes}
          </span>

          <span aria-label={`${discussion.replies} ${t.replies}`}>
            <MessageCircle size={15} aria-hidden="true" />
            {discussion.replies}
          </span>
        </div>
      </div>

      <DiscussionActions
        discussion={discussion}
        language={language}
        compact
      />
    </article>
  );
}
