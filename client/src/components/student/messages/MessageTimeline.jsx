
import { useEffect, useRef, useState } from "react";
import { MessageCircle, ArrowDown } from "lucide-react";

import { useMessages } from "../../../hooks/useMessages";

import {
  groupMessagesByDate,
  formatMessageDate,
} from "../../../utils/messageFormatters";

import MessageBubble from "./MessageBubble";

const translations = {
  en: {
    noConversation: "No conversation selected",
    selectConversation:
      "Select a conversation to view your messages.",
    emptyTitle: "No messages yet",
    emptyDescription:
      "Start the conversation by sending your first message.",
    today: "Today",
    yesterday: "Yesterday",
    scrollBottom: "Scroll to latest messages",
    timeline: "Conversation messages",
  },
  ar: {
    noConversation: "لم يتم تحديد محادثة",
    selectConversation:
      "اختر محادثة لعرض الرسائل.",
    emptyTitle: "لا توجد رسائل بعد",
    emptyDescription:
      "ابدأ المحادثة بإرسال رسالتك الأولى.",
    today: "اليوم",
    yesterday: "أمس",
    scrollBottom: "الانتقال إلى أحدث الرسائل",
    timeline: "رسائل المحادثة",
  },
};

function getDateKey(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function getDayLabel(dateKey, language) {
  const now = new Date();

  const today = getDateKey(now);

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayKey = getDateKey(yesterday);

  const t = translations[language];

  if (dateKey === today) return t.today;

  if (dateKey === yesterdayKey) return t.yesterday;

  // The formatter expects a date. Use local noon to
  // avoid date changes caused by UTC midnight.
  const [year, month, day] = dateKey
    .split("-")
    .map(Number);

  const date = new Date(year, month - 1, day, 12);

  return formatMessageDate(date, language);
}

export default function MessageTimeline({
  language = "en",
}) {
  const { activeConversation } = useMessages();

  const currentLanguage =
    language === "ar" ? "ar" : "en";

  const t = translations[currentLanguage];

  const scrollContainerRef = useRef(null);
  const bottomRef = useRef(null);

  const [showScrollButton, setShowScrollButton] =
    useState(false);

  const messages = activeConversation?.messages || [];

  const conversationId = activeConversation?.id;

  const lastMessageId =
    messages.length > 0
      ? messages[messages.length - 1].id
      : null;

  const groupedMessages = groupMessagesByDate(messages);

  function scrollToBottom(behavior = "smooth") {
    const container = scrollContainerRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  }

  function handleScroll() {
    const container = scrollContainerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setShowScrollButton(distanceFromBottom > 160);
  }

  // Scroll to the bottom when opening a conversation.
  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    container.scrollTop = container.scrollHeight;
    setShowScrollButton(false);
  }, [conversationId]);

  // Scroll when a new message arrives, but only if
  // the student is already close to the bottom.
  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container || !lastMessageId) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    if (distanceFromBottom < 200) {
      scrollToBottom("smooth");
    }
  }, [lastMessageId]);

  if (!activeConversation) {
    return (
      <section
        className="message-timeline message-timeline--empty"
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
      >
        <div className="message-timeline__empty-state">
          <div className="message-timeline__empty-icon">
            <MessageCircle
              size={28}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>

          <h3>{t.noConversation}</h3>
          <p>{t.selectConversation}</p>
        </div>
      </section>
    );
  }

  if (messages.length === 0) {
    return (
      <section
        className="message-timeline message-timeline--empty"
        dir={currentLanguage === "ar" ? "rtl" : "ltr"}
      >
        <div className="message-timeline__empty-state">
          <div className="message-timeline__empty-icon">
            <MessageCircle
              size={28}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>

          <h3>{t.emptyTitle}</h3>
          <p>{t.emptyDescription}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="message-timeline"
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
      aria-label={t.timeline}
    >
      <div
        ref={scrollContainerRef}
        className="message-timeline__scroll"
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label={t.timeline}
      >
        <div className="message-timeline__content">
          {groupedMessages.map((group) => (
            <div
              key={group.date}
              className="message-timeline__group"
            >
              <div className="message-timeline__date">
                <span>
                  {getDayLabel(
                    group.date,
                    currentLanguage
                  )}
                </span>
              </div>

              <div className="message-timeline__messages">
                {group.messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    language={currentLanguage}
                  />
                ))}
              </div>
            </div>
          ))}

          <div
            ref={bottomRef}
            className="message-timeline__bottom"
            aria-hidden="true"
          />
        </div>
      </div>

      {showScrollButton && (
        <button
          type="button"
          className="message-timeline__scroll-button"
          onClick={() => scrollToBottom()}
          aria-label={t.scrollBottom}
          title={t.scrollBottom}
        >
          <ArrowDown
            size={18}
            aria-hidden="true"
          />
        </button>
      )}
    </section>
  );
}
