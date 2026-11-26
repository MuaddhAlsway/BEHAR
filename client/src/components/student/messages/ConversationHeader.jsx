
import {
  ArrowLeft,
  ArrowRight,
  Info,
  MoreHorizontal,
  Archive,
  ArchiveRestore,
  BookOpen,
  Headphones,
} from "lucide-react";

import { useState, useRef, useEffect } from "react";

import { useMessages } from "../../../hooks/useMessages";

import { getParticipantById } from "../../../data/messages";

import {
  formatParticipantName,
  formatCourseTitle,
} from "../../../utils/messageFormatters";

const translations = {
  en: {
    back: "Back to conversations",
    details: "Conversation details",
    more: "More options",
    archive: "Archive conversation",
    restore: "Restore conversation",
    online: "Online",
    offline: "Offline",
    instructor: "Instructor",
    support: "Support",
    course: "Course",
  },
  ar: {
    back: "العودة للمحادثات",
    details: "تفاصيل المحادثة",
    more: "المزيد من الخيارات",
    archive: "أرشفة المحادثة",
    restore: "استعادة المحادثة",
    online: "متصل",
    offline: "غير متصل",
    instructor: "مدرب",
    support: "الدعم الفني",
    course: "الدورة",
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

export default function ConversationHeader({
  language = "en",
  onBack,
}) {
  const {
    activeConversation,
    archiveConversation,
    restoreConversation,
    setIsConversationInfoOpen,
  } = useMessages();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  const BackIcon =
    currentLanguage === "ar" ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleOutsideClick(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener(
      "pointerdown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [isMenuOpen]);

  if (!activeConversation) return null;

  function handleArchiveToggle() {
    if (isArchived) {
      restoreConversation(activeConversation.id);
    } else {
      archiveConversation(activeConversation.id);
    }

    setIsMenuOpen(false);
  }

  function handleOpenInfo() {
    setIsConversationInfoOpen(true);
    setIsMenuOpen(false);
  }

  return (
    <header
      className="conversation-header"
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
    >
      <div className="conversation-header__main">
        {/* Mobile back navigation */}
        {typeof onBack === "function" && (
          <button
            type="button"
            className="conversation-header__back"
            onClick={onBack}
            aria-label={t.back}
            title={t.back}
          >
            <BackIcon
              size={20}
              aria-hidden="true"
            />
          </button>
        )}

        {/* Participant avatar */}
        <div className="conversation-header__avatar-wrap">
          {participant?.avatar ? (
            <img
              src={participant.avatar}
              alt=""
              className="conversation-header__avatar-image"
            />
          ) : (
            <div className="conversation-header__avatar">
              {isSupport ? (
                <Headphones
                  size={21}
                  aria-hidden="true"
                />
              ) : (
                getInitials(participantName)
              )}
            </div>
          )}

          {participant?.online && (
            <span
              className="conversation-header__online-dot"
              aria-label={t.online}
              title={t.online}
            />
          )}
        </div>

        {/* Participant information */}
        <div className="conversation-header__identity">
          <h2 className="conversation-header__name">
            {participantName || activeConversation.participantId}
          </h2>

          <div className="conversation-header__subtitle">
            <span>
              {isSupport ? t.support : t.instructor}
            </span>

            <span
              className="conversation-header__separator"
              aria-hidden="true"
            >
              ·
            </span>

            <span
              className={
                participant?.online
                  ? "conversation-header__presence conversation-header__presence--online"
                  : "conversation-header__presence"
              }
            >
              {participant?.online ? t.online : t.offline}
            </span>
          </div>

          {courseName && (
            <div className="conversation-header__course">
              <BookOpen
                size={12}
                aria-hidden="true"
              />
              <span title={courseName}>
                {courseName}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Header actions */}
      <div className="conversation-header__actions">
        <button
          type="button"
          className="conversation-header__action"
          onClick={handleOpenInfo}
          aria-label={t.details}
          title={t.details}
        >
          <Info size={19} aria-hidden="true" />
        </button>

        <div
          className="conversation-header__menu-wrap"
          ref={menuRef}
        >
          <button
            type="button"
            className="conversation-header__action"
            onClick={() =>
              setIsMenuOpen((previous) => !previous)
            }
            aria-label={t.more}
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            title={t.more}
          >
            <MoreHorizontal
              size={20}
              aria-hidden="true"
            />
          </button>

          {isMenuOpen && (
            <div
              className="conversation-header__dropdown"
              role="menu"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleOpenInfo}
              >
                <Info size={16} aria-hidden="true" />
                <span>{t.details}</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={handleArchiveToggle}
              >
                {isArchived ? (
                  <ArchiveRestore
                    size={16}
                    aria-hidden="true"
                  />
                ) : (
                  <Archive
                    size={16}
                    aria-hidden="true"
                  />
                )}

                <span>
                  {isArchived ? t.restore : t.archive}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
