
import { Check, CheckCheck } from "lucide-react";

import { CURRENT_STUDENT_ID } from "../../../data/messages";

import {
  formatMessageTime,
} from "../../../utils/messageFormatters";

import AttachmentPreview from "./AttachmentPreview";

const translations = {
  en: {
    sent: "Sent",
    read: "Read",
    received: "Received message",
    attachment: "Attachment",
    you: "You",
  },
  ar: {
    sent: "تم الإرسال",
    read: "تمت القراءة",
    received: "رسالة واردة",
    attachment: "مرفق",
    you: "أنت",
  },
};

/**
 * BEHAR LMS — MessageBubble
 *
 * Props:
 * message: {
 *   id: string,
 *   senderId: string,
 *   type: "text" | "attachment",
 *   content: string,
 *   attachments?: Array,
 *   createdAt: string,
 *   read: boolean
 * }
 *
 * language: "en" | "ar"
 *
 * Features:
 * - Sender/receiver alignment
 * - Text content
 * - Attachments
 * - Localized timestamps
 * - Read indicators
 * - RTL/LTR support
 */
export default function MessageBubble({
  message,
  language = "en",
}) {
  if (!message) return null;

  const currentLanguage =
    language === "ar" ? "ar" : "en";

  const t = translations[currentLanguage];

  const isOwnMessage =
    message.senderId === CURRENT_STUDENT_ID;

  const hasText =
    typeof message.content === "string" &&
    message.content.trim().length > 0;

  const attachments = Array.isArray(message.attachments)
    ? message.attachments
    : [];

  const hasAttachments = attachments.length > 0;

  const time = formatMessageTime(
    message.createdAt,
    currentLanguage
  );

  const statusLabel = message.read
    ? t.read
    : t.sent;

  return (
    <article
      className={[
        "message-bubble",
        isOwnMessage
          ? "message-bubble--own"
          : "message-bubble--received",
        hasAttachments
          ? "message-bubble--with-attachments"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
      aria-label={
        isOwnMessage
          ? `${t.you}: ${hasText ? message.content : t.attachment}`
          : t.received
      }
    >
      <div className="message-bubble__body">
        {hasText && (
          <p
            className="message-bubble__text"
            dir="auto"
          >
            {message.content}
          </p>
        )}

        {hasAttachments && (
          <div className="message-bubble__attachments">
            <AttachmentPreview
              attachments={attachments}
              language={currentLanguage}
              variant="message"
            />
          </div>
        )}

        <div className="message-bubble__footer">
          <time
            className="message-bubble__time"
            dateTime={message.createdAt}
          >
            {time}
          </time>

          {isOwnMessage && (
            <span
              className={[
                "message-bubble__status",
                message.read
                  ? "message-bubble__status--read"
                  : "message-bubble__status--sent",
              ].join(" ")}
              title={statusLabel}
              aria-label={statusLabel}
            >
              {message.read ? (
                <CheckCheck
                  size={14}
                  aria-hidden="true"
                />
              ) : (
                <Check
                  size={14}
                  aria-hidden="true"
                />
              )}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
