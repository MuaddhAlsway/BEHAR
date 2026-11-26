
import { useEffect, useMemo, useRef } from "react";
import {
  X,
  BookOpen,
  UserRound,
  Headphones,
  Archive,
  ArchiveRestore,
  Paperclip,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  File,
  CalendarDays,
  ExternalLink,
  LockKeyhole,
} from "lucide-react";

import { useMessages } from "../../../hooks/useMessages";
import { getParticipantById } from "../../../data/messages";

import {
  formatParticipantName,
  formatCourseTitle,
} from "../../../utils/messageFormatters";

import "../../../styles/student/messages/conversation-info.css";

const translations = {
  en: {
    title: "Conversation details",
    close: "Close conversation details",
    participant: "Participant",
    instructor: "Instructor",
    support: "Support team",
    online: "Online",
    offline: "Offline",
    course: "Related course",
    noCourse: "General conversation",
    sharedFiles: "Shared attachments",
    noFiles: "No attachments shared yet.",
    filesCount: "files",
    archive: "Archive conversation",
    restore: "Restore conversation",
    archiveDescription:
      "Move this conversation to your archived messages.",
    restoreDescription:
      "Move this conversation back to your inbox.",
    started: "Conversation started",
    privacy: "Conversation privacy",
    privacyDescription:
      "Messages are stored locally in this demo.",
    fileUnavailable:
      "This attachment is not available for download.",
    openFile: "Open attachment",
    unknown: "Unknown",
  },

  ar: {
    title: "تفاصيل المحادثة",
    close: "إغلاق تفاصيل المحادثة",
    participant: "المشارك",
    instructor: "مدرب",
    support: "فريق الدعم",
    online: "متصل",
    offline: "غير متصل",
    course: "الدورة المرتبطة",
    noCourse: "محادثة عامة",
    sharedFiles: "الملفات المشتركة",
    noFiles: "لم تتم مشاركة أي ملفات بعد.",
    filesCount: "ملفات",
    archive: "أرشفة المحادثة",
    restore: "استعادة المحادثة",
    archiveDescription:
      "نقل هذه المحادثة إلى الرسائل المؤرشفة.",
    restoreDescription:
      "إعادة هذه المحادثة إلى صندوق الوارد.",
    started: "تاريخ بدء المحادثة",
    privacy: "خصوصية المحادثة",
    privacyDescription:
      "يتم تخزين الرسائل محليًا في هذه النسخة التجريبية.",
    fileUnavailable:
      "هذا المرفق غير متاح للتنزيل.",
    openFile: "فتح المرفق",
    unknown: "غير معروف",
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

function formatFileSize(size) {
  if (!Number.isFinite(size) || size < 0) {
    return "—";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(attachment) {
  const type = attachment.type || "";
  const name = (attachment.name || "").toLowerCase();

  if (
    type.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp)$/i.test(name)
  ) {
    return ImageIcon;
  }

  if (
    type.includes("spreadsheet") ||
    type.includes("excel") ||
    /\.(xls|xlsx)$/i.test(name)
  ) {
    return FileSpreadsheet;
  }

  if (
    type.includes("pdf") ||
    type.includes("word") ||
    type.startsWith("text/") ||
    /\.(pdf|doc|docx|txt)$/i.test(name)
  ) {
    return FileText;
  }

  return File;
}

function getSafeAttachmentUrl(attachment) {
  const url = attachment.url;

  if (typeof url !== "string") {
    return null;
  }

  try {
    const parsed = new URL(url);

    if (
      parsed.protocol === "https:" ||
      parsed.protocol === "http:"
    ) {
      return parsed.href;
    }
  } catch {
    return null;
  }

  return null;
}

function getSharedAttachments(messages) {
  if (!Array.isArray(messages)) return [];

  return messages
    .flatMap((message) => {
      if (!Array.isArray(message.attachments)) {
        return [];
      }

      return message.attachments.map(
        (attachment, index) => ({
          ...attachment,
          key: `${message.id}-${attachment.id || index}`,
          messageDate: message.createdAt,
        })
      );
    })
    .sort((a, b) => {
      const first = Date.parse(a.messageDate) || 0;
      const second = Date.parse(b.messageDate) || 0;

      return second - first;
    });
}

function formatDate(value, language) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  ).format(date);
}

export default function ConversationInfo({
  language = "en",
}) {
  const {
    activeConversation,
    isConversationInfoOpen,
    setIsConversationInfoOpen,
    archiveConversation,
    restoreConversation,
  } = useMessages();

  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  const currentLanguage =
    language === "ar" ? "ar" : "en";

  const t = translations[currentLanguage];

  const participant = activeConversation
    ? getParticipantById(activeConversation.participantId)
    : null;

  const participantName = formatParticipantName(
    participant,
    currentLanguage
  );

  const courseName = formatCourseTitle(
    activeConversation?.course,
    currentLanguage
  );

  const isSupport = participant?.role === "support";
  const isArchived = activeConversation?.archived === true;

  const messages = activeConversation?.messages;

  const attachments = useMemo(
    () => getSharedAttachments(messages),
    [messages]
  );

  const conversationStart = useMemo(() => {
    if (!Array.isArray(messages) || !messages.length) {
      return activeConversation?.updatedAt || null;
    }

    const timestamps = messages
      .map((message) => Date.parse(message.createdAt))
      .filter(Number.isFinite);

    if (!timestamps.length) {
      return activeConversation?.updatedAt || null;
    }

    return new Date(Math.min(...timestamps)).toISOString();
  }, [messages, activeConversation?.updatedAt]);

  const isOpen =
    Boolean(isConversationInfoOpen) &&
    Boolean(activeConversation);

  function closePanel() {
    setIsConversationInfoOpen(false);
  }

  function handleArchiveToggle() {
    if (!activeConversation) return;

    if (isArchived) {
      restoreConversation(activeConversation.id);
    } else {
      archiveConversation(activeConversation.id);
    }

    closePanel();
  }

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement;

    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsConversationInfoOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll(
          'a[href], button:not([disabled]), ' +
          'input:not([disabled]), ' +
          '[tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (element) => element.getClientRects().length > 0
      );

      if (!focusable.length) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, setIsConversationInfoOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="conversation-info__overlay"
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
    >
      <button
        type="button"
        className="conversation-info__backdrop"
        onClick={closePanel}
        aria-label={t.close}
        tabIndex={-1}
      />

      <aside
        ref={panelRef}
        className="conversation-info"
        role="dialog"
        aria-modal="true"
        aria-labelledby="conversation-info-title"
        tabIndex={-1}
      >
        {/* Header */}

        <div className="conversation-info__header">
          <h2 id="conversation-info-title">
            {t.title}
          </h2>

          <button
            ref={closeButtonRef}
            type="button"
            className="conversation-info__close"
            onClick={closePanel}
            aria-label={t.close}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="conversation-info__scroll">
          {/* Participant profile */}

          <section className="conversation-info__profile">
            <div className="conversation-info__avatar-wrap">
              {participant?.avatar ? (
                <img
                  src={participant.avatar}
                  alt=""
                  className="conversation-info__avatar-image"
                />
              ) : (
                <div className="conversation-info__avatar">
                  {isSupport ? (
                    <Headphones
                      size={28}
                      aria-hidden="true"
                    />
                  ) : (
                    getInitials(participantName)
                  )}
                </div>
              )}

              {participant?.online && (
                <span
                  className="conversation-info__online-dot"
                  aria-hidden="true"
                />
              )}
            </div>

            <h3 className="conversation-info__participant-name">
              {participantName ||
                activeConversation.participantId}
            </h3>

            <div className="conversation-info__role">
              {isSupport ? (
                <Headphones
                  size={14}
                  aria-hidden="true"
                />
              ) : (
                <UserRound
                  size={14}
                  aria-hidden="true"
                />
              )}

              <span>
                {isSupport ? t.support : t.instructor}
              </span>
            </div>

            <span
              className={[
                "conversation-info__presence",
                participant?.online
                  ? "conversation-info__presence--online"
                  : "",
              ].join(" ")}
            >
              <span
                className="conversation-info__presence-dot"
                aria-hidden="true"
              />

              {participant?.online ? t.online : t.offline}
            </span>
          </section>

          {/* Related course */}

          <section className="conversation-info__section">
            <h3 className="conversation-info__section-title">
              <BookOpen size={17} aria-hidden="true" />
              {t.course}
            </h3>

            <div className="conversation-info__course-card">
              <div className="conversation-info__course-icon">
                <BookOpen
                  size={20}
                  aria-hidden="true"
                />
              </div>

              <div className="conversation-info__course-content">
                <span className="conversation-info__course-label">
                  {t.course}
                </span>

                <p>
                  {courseName || t.noCourse}
                </p>
              </div>
            </div>
          </section>

          {/* Conversation date */}

          <section className="conversation-info__section">
            <h3 className="conversation-info__section-title">
              <CalendarDays
                size={17}
                aria-hidden="true"
              />
              {t.started}
            </h3>

            <p className="conversation-info__date">
              {formatDate(
                conversationStart,
                currentLanguage
              )}
            </p>
          </section>

          {/* Shared attachments */}

          <section className="conversation-info__section">
            <div className="conversation-info__section-heading">
              <h3 className="conversation-info__section-title">
                <Paperclip
                  size={17}
                  aria-hidden="true"
                />
                {t.sharedFiles}
              </h3>

              <span className="conversation-info__count">
                {attachments.length}
              </span>
            </div>

            {attachments.length === 0 ? (
              <div className="conversation-info__files-empty">
                <Paperclip
                  size={22}
                  aria-hidden="true"
                />
                <p>{t.noFiles}</p>
              </div>
            ) : (
              <ul className="conversation-info__file-list">
                {attachments.map((attachment) => {
                  const FileIcon = getFileIcon(attachment);
                  const fileUrl =
                    getSafeAttachmentUrl(attachment);

                  return (
                    <li
                      key={attachment.key}
                      className="conversation-info__file"
                    >
                      <div className="conversation-info__file-icon">
                        <FileIcon
                          size={19}
                          aria-hidden="true"
                        />
                      </div>

                      <div className="conversation-info__file-details">
                        <span
                          className="conversation-info__file-name"
                          title={attachment.name}
                        >
                          {attachment.name || t.unknown}
                        </span>

                        <span className="conversation-info__file-meta">
                          {formatFileSize(attachment.size)}
                          {" · "}
                          {formatDate(
                            attachment.messageDate,
                            currentLanguage
                          )}
                        </span>
                      </div>

                      {fileUrl ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="conversation-info__file-action"
                          aria-label={`${t.openFile}: ${attachment.name}`}
                          title={t.openFile}
                        >
                          <ExternalLink
                            size={16}
                            aria-hidden="true"
                          />
                        </a>
                      ) : (
                        <span
                          className="conversation-info__file-unavailable"
                          title={t.fileUnavailable}
                          aria-label={t.fileUnavailable}
                        >
                          <LockKeyhole
                            size={15}
                            aria-hidden="true"
                          />
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Privacy information */}

          <section className="conversation-info__section">
            <div className="conversation-info__privacy">
              <LockKeyhole
                size={18}
                aria-hidden="true"
              />

              <div>
                <h3>{t.privacy}</h3>
                <p>{t.privacyDescription}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer action */}

        <div className="conversation-info__footer">
          <button
            type="button"
            className="conversation-info__archive-button"
            onClick={handleArchiveToggle}
          >
            {isArchived ? (
              <ArchiveRestore
                size={18}
                aria-hidden="true"
              />
            ) : (
              <Archive
                size={18}
                aria-hidden="true"
              />
            )}

            <span>
              {isArchived ? t.restore : t.archive}
            </span>
          </button>

          <p className="conversation-info__archive-description">
            {isArchived
              ? t.restoreDescription
              : t.archiveDescription}
          </p>
        </div>
      </aside>
    </div>
  );
}
