
import {
  Headphones,
  Paperclip,
  Archive,
  CheckCheck,
} from "lucide-react";

import {
  CURRENT_STUDENT_ID,
  getParticipantById,
  getLastMessage,
  getUnreadCount,
} from "../../../data/messages";

import {
  formatParticipantName,
  formatCourseTitle,
  formatConversationDate,
} from "../../../utils/messageFormatters";

const translations = {
  en: {
    instructor: "Instructor",
    support: "Support",
    noMessages: "No messages yet",
    attachment: "Attachment",
    you: "You",
    archived: "Archived",
    unread: "unread messages",
  },
  ar: {
    instructor: "مدرب",
    support: "الدعم",
    noMessages: "لا توجد رسائل بعد",
    attachment: "مرفق",
    you: "أنت",
    archived: "مؤرشفة",
    unread: "رسائل غير مقروءة",
  },
};

function getInitials(name) {
  if (!name) return "?";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function getPreview(message, language) {
  const t = translations[language];

  if (!message) return t.noMessages;

  const content =
    typeof message.content === "string"
      ? message.content.trim()
      : "";

  if (content) return content;

  if (message.attachments?.length > 0) {
    return t.attachment;
  }

  return t.noMessages;
}

export default function ConversationItem({
  conversation,
  language = "en",
  isActive = false,
  onSelect,
}) {
  if (!conversation) return null;

  const currentLanguage = language === "ar" ? "ar" : "en";
  const t = translations[currentLanguage];

  const participant = getParticipantById(
    conversation.participantId
  );

  const participantName = formatParticipantName(
    participant,
    currentLanguage
  );

  const courseName = formatCourseTitle(
    conversation.course,
    currentLanguage
  );

  const lastMessage = getLastMessage(conversation);

  const unreadCount = getUnreadCount(conversation);

  const isUnread = unreadCount > 0;

  const isSupport = participant?.role === "support";

  const isOwnLastMessage =
    lastMessage?.senderId === CURRENT_STUDENT_ID;

  const preview = getPreview(lastMessage, currentLanguage);

  const date = formatConversationDate(
    lastMessage?.createdAt || conversation.updatedAt,
    currentLanguage
  );

  function handleClick() {
    if (typeof onSelect === "function") {
      onSelect(conversation.id);
    }
  }

  return (
    <button
      type="button"
      className={[
        "conversation-item",
        isActive ? "conversation-item--active" : "",
        isUnread ? "conversation-item--unread" : "",
        conversation.archived
          ? "conversation-item--archived"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleClick}
      aria-current={isActive ? "true" : undefined}
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
    >
      {/* Avatar */}

      <div className="conversation-item__avatar-wrap">
        {participant?.avatar ? (
          <img
            src={participant.avatar}
            alt=""
            className="conversation-item__avatar-image"
          />
        ) : (
          <span className="conversation-item__avatar">
            {isSupport ? (
              <Headphones size={19} aria-hidden="true" />
            ) : (
              getInitials(participantName)
            )}
          </span>
        )}

        {participant?.online && (
          <span
            className="conversation-item__online-dot"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Content */}

      <span className="conversation-item__content">
        <span className="conversation-item__top">
          <span className="conversation-item__name">
            {participantName || conversation.participantId}
          </span>

          <time
            className="conversation-item__date"
            dateTime={
              lastMessage?.createdAt ||
              conversation.updatedAt
            }
          >
            {date}
          </time>
        </span>

        <span className="conversation-item__role-row">
          <span className="conversation-item__role">
            {isSupport ? t.support : t.instructor}
          </span>

          {courseName && (
            <>
              <span
                className="conversation-item__separator"
                aria-hidden="true"
              >
                ·
              </span>

              <span
                className="conversation-item__course"
                title={courseName}
              >
                {courseName}
              </span>
            </>
          )}
        </span>

        <span className="conversation-item__bottom">
          <span className="conversation-item__preview">
            {isOwnLastMessage && (
              <span className="conversation-item__you">
                {t.you}:{" "}
              </span>
            )}

            {lastMessage?.attachments?.length > 0 &&
              !lastMessage?.content?.trim() && (
                <Paperclip
                  size={13}
                  aria-hidden="true"
                />
              )}

            <span dir="auto">{preview}</span>
          </span>

          {isUnread ? (
            <span
              className="conversation-item__unread-count"
              aria-label={`${unreadCount} ${t.unread}`}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : conversation.archived ? (
            <Archive
              className="conversation-item__archived-icon"
              size={15}
              aria-label={t.archived}
            />
          ) : isOwnLastMessage && lastMessage?.read ? (
            <CheckCheck
              className="conversation-item__read-icon"
              size={15}
              aria-hidden="true"
            />
          ) : null}
        </span>
      </span>
    </button>
  );
}
