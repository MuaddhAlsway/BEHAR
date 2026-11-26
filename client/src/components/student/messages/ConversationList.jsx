
import { useMemo } from "react";
import {
  Search,
  X,
  MessageSquarePlus,
  Inbox,
  Archive,
  MessageCircle,
} from "lucide-react";

import { useMessages } from "../../../hooks/useMessages";
import { MESSAGE_FILTERS } from "../../../utils/messageFilters";
import ConversationItem from "./ConversationItem";

import "../../../styles/student/messages/conversation-list.css";

const translations = {
  en: {
    title: "Conversations",
    search: "Search conversations...",
    newMessage: "New conversation",
    all: "All",
    unread: "Unread",
    instructors: "Instructors",
    support: "Support",
    archived: "Archived",
    clearSearch: "Clear search",
    emptyTitle: "No conversations yet",
    emptyDescription:
      "Start a conversation with an instructor or support.",
    noResults: "No matching conversations",
    noResultsDescription:
      "Try a different search or filter.",
    noArchived: "No archived conversations",
    noArchivedDescription:
      "Archived conversations will appear here.",
    noUnread: "You're all caught up",
    noUnreadDescription:
      "You have no unread conversations.",
    start: "Start a conversation",
    count: "conversations",
  },
  ar: {
    title: "المحادثات",
    search: "ابحث في المحادثات...",
    newMessage: "محادثة جديدة",
    all: "الكل",
    unread: "غير المقروءة",
    instructors: "المدربون",
    support: "الدعم",
    archived: "المؤرشفة",
    clearSearch: "مسح البحث",
    emptyTitle: "لا توجد محادثات بعد",
    emptyDescription:
      "ابدأ محادثة مع أحد المدربين أو فريق الدعم.",
    noResults: "لا توجد محادثات مطابقة",
    noResultsDescription:
      "جرّب البحث بكلمات أخرى أو غيّر التصفية.",
    noArchived: "لا توجد محادثات مؤرشفة",
    noArchivedDescription:
      "ستظهر المحادثات المؤرشفة هنا.",
    noUnread: "أنت على اطلاع بكل الرسائل",
    noUnreadDescription:
      "ليس لديك محادثات غير مقروءة.",
    start: "بدء محادثة",
    count: "محادثات",
  },
};

const FILTER_OPTIONS = [
  { id: MESSAGE_FILTERS.ALL, label: "all" },
  { id: MESSAGE_FILTERS.UNREAD, label: "unread" },
  { id: MESSAGE_FILTERS.INSTRUCTORS, label: "instructors" },
  { id: MESSAGE_FILTERS.SUPPORT, label: "support" },
  { id: MESSAGE_FILTERS.ARCHIVED, label: "archived" },
];

export default function ConversationList({
  language = "en",
  onSelectConversation,
  onNewConversation,
}) {
  const {
    conversations,
    visibleConversations,
    activeConversationId,
    search,
    setSearch,
    filter,
    setFilter,
    unreadConversationCount,
    selectConversation,
    setIsNewConversationOpen,
  } = useMessages();

  const currentLanguage = language === "ar" ? "ar" : "en";
  const t = translations[currentLanguage];

  const unreadCount = Number(unreadConversationCount) || 0;

  const hasConversations = conversations.length > 0;

  const normalizedFilter = String(filter || "").toLowerCase();

  const archivedFilter =
    normalizedFilter === MESSAGE_FILTERS.ARCHIVED;

  const unreadFilter =
    normalizedFilter === MESSAGE_FILTERS.UNREAD;

  const hasSearch = search.trim().length > 0;

  const emptyState = useMemo(() => {
    if (archivedFilter && !hasSearch) {
      return {
        icon: Archive,
        title: t.noArchived,
        description: t.noArchivedDescription,
      };
    }

    if (unreadFilter && !hasSearch) {
      return {
        icon: Inbox,
        title: t.noUnread,
        description: t.noUnreadDescription,
      };
    }

    if (!hasConversations) {
      return {
        icon: MessageCircle,
        title: t.emptyTitle,
        description: t.emptyDescription,
      };
    }

    return {
      icon: Search,
      title: t.noResults,
      description: t.noResultsDescription,
    };
  }, [
    archivedFilter,
    unreadFilter,
    hasSearch,
    hasConversations,
    t,
  ]);

  function handleNewConversation() {
    if (typeof onNewConversation === "function") {
      onNewConversation();
      return;
    }

    setIsNewConversationOpen(true);
  }

  function handleSelectConversation(conversationId) {
    if (typeof onSelectConversation === "function") {
      onSelectConversation(conversationId);
      return;
    }

    selectConversation(conversationId);
  }

  const EmptyIcon = emptyState.icon;

  return (
    <div
      className="conversation-list"
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
    >
      {/* Sidebar header */}

      <header className="conversation-list__header">
        <div className="conversation-list__heading">
          <div className="conversation-list__title-row">
            <h2>{t.title}</h2>

            {unreadCount > 0 && (
              <span
                className="conversation-list__unread-badge"
                aria-label={`${unreadCount} ${t.unread}`}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>

          <span className="conversation-list__count">
            {conversations.length} {t.count}
          </span>
        </div>

        <button
          type="button"
          className="conversation-list__new"
          onClick={handleNewConversation}
          title={t.newMessage}
          aria-label={t.newMessage}
        >
          <MessageSquarePlus
            size={19}
            aria-hidden="true"
          />
        </button>
      </header>

      {/* Search */}

      <div className="conversation-list__search-wrap">
        <div className="conversation-list__search">
          <Search size={17} aria-hidden="true" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.search}
            aria-label={t.search}
          />

          {hasSearch && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label={t.clearSearch}
              title={t.clearSearch}
            >
              <X size={15} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}

      <div
        className="conversation-list__filters"
        role="group"
        aria-label={t.title}
      >
        {FILTER_OPTIONS.map((option) => {
          const isActive =
            normalizedFilter === option.id;

          return (
            <button
              key={option.id}
              type="button"
              className={[
                "conversation-list__filter",
                isActive
                  ? "conversation-list__filter--active"
                  : "",
              ].join(" ")}
              onClick={() => setFilter(option.id)}
              aria-pressed={isActive}
            >
              <span>{t[option.label]}</span>

              {option.id === MESSAGE_FILTERS.UNREAD &&
                unreadCount > 0 && (
                  <span className="conversation-list__filter-count">
                    {unreadCount}
                  </span>
                )}
            </button>
          );
        })}
      </div>

      {/* Conversations */}

      <div className="conversation-list__scroll">
        {visibleConversations.length > 0 ? (
          <div className="conversation-list__items">
            {visibleConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                language={currentLanguage}
                isActive={
                  conversation.id === activeConversationId
                }
                onSelect={handleSelectConversation}
              />
            ))}
          </div>
        ) : (
          <div className="conversation-list__empty">
            <div className="conversation-list__empty-icon">
              <EmptyIcon
                size={25}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>

            <h3>{emptyState.title}</h3>
            <p>{emptyState.description}</p>

            {!hasSearch &&
              !archivedFilter &&
              !unreadFilter && (
                <button
                  type="button"
                  onClick={handleNewConversation}
                >
                  <MessageSquarePlus
                    size={16}
                    aria-hidden="true"
                  />
                  {t.start}
                </button>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
