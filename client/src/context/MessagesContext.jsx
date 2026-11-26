
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CURRENT_STUDENT_ID,
  initialConversations,
  getUnreadCount,
  messageParticipants,
} from "../data/messages";

import {
  loadMessages,
  saveMessages,
  resetMessages,
} from "../utils/messageStorage";

import {
  MESSAGE_FILTERS,
  getVisibleConversations,
} from "../utils/messageFilters";

export const MessagesContext = createContext(null);

const MAX_MESSAGE_LENGTH = 5000;
const MAX_ATTACHMENTS = 5;
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

function createId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function isValidDate(value) {
  return (
    typeof value === "string" &&
    Number.isFinite(Date.parse(value))
  );
}

function normalizeAttachment(attachment) {
  if (!attachment || typeof attachment !== "object") {
    throw new Error("Invalid attachment.");
  }

  const name =
    typeof attachment.name === "string"
      ? attachment.name.trim()
      : "";

  const size = Number(attachment.size);
  const type =
    typeof attachment.type === "string"
      ? attachment.type
      : "";

  if (!name) {
    throw new Error("Attachment name is required.");
  }

  if (
    !Number.isFinite(size) ||
    size < 0 ||
    size > MAX_ATTACHMENT_SIZE
  ) {
    throw new Error("Attachment size is invalid.");
  }

  return {
    id: createId("attachment"),
    name: name.slice(0, 255),
    size,
    type,
  };
}

function normalizeMessage(message) {
  if (!message || typeof message !== "object") {
    return null;
  }

  if (
    typeof message.id !== "string" ||
    typeof message.senderId !== "string"
  ) {
    return null;
  }

  return {
    id: message.id,
    senderId: message.senderId,
    type:
      typeof message.type === "string"
        ? message.type
        : "text",
    content:
      typeof message.content === "string"
        ? message.content
        : "",
    attachments: Array.isArray(message.attachments)
      ? message.attachments
          .filter(
            (attachment) =>
              attachment &&
              typeof attachment.name === "string"
          )
          .map((attachment) => ({
            id: String(attachment.id || createId("attachment")),
            name: attachment.name,
            size: Number(attachment.size) || 0,
            type: String(attachment.type || ""),
          }))
      : [],
    createdAt: isValidDate(message.createdAt)
      ? message.createdAt
      : new Date().toISOString(),
    read: Boolean(message.read),
  };
}

function normalizeConversation(conversation) {
  if (!conversation || typeof conversation !== "object") {
    return null;
  }

  const participantId = typeof conversation.participantId === "string"
    ? conversation.participantId
    : conversation.participant?.id;

  if (typeof conversation.id !== "string" || typeof participantId !== "string") {
    return null;
  }

  const messages = Array.isArray(conversation.messages)
    ? conversation.messages
        .map(normalizeMessage)
        .filter(Boolean)
        .sort(
          (a, b) =>
            Date.parse(a.createdAt) - Date.parse(b.createdAt)
        )
    : [];

  return {
    id: conversation.id,
    participantId,
    course:
      conversation.course &&
      typeof conversation.course === "object"
        ? {
            id: String(conversation.course.id || ""),
            title: String(conversation.course.title || ""),
            titleAr: String(
              conversation.course.titleAr || ""
            ),
            slug: String(conversation.course.slug || ""),
          }
        : null,
    archived: Boolean(conversation.archived),
    updatedAt: isValidDate(conversation.updatedAt)
      ? conversation.updatedAt
      : messages.at(-1)?.createdAt ||
        new Date().toISOString(),
    messages,
  };
}

function normalizeConversations(data) {
  if (!Array.isArray(data)) {
    return initialConversations
      .map(normalizeConversation)
      .filter(Boolean);
  }

  const seen = new Set();

  return data
    .map(normalizeConversation)
    .filter(Boolean)
    .filter((conversation) => {
      if (seen.has(conversation.id)) return false;

      seen.add(conversation.id);
      return true;
    });
}

function getInitialState() {
  try {
    return normalizeConversations(loadMessages());
  } catch (error) {
    console.error("Unable to load messages:", error);
    return normalizeConversations(initialConversations);
  }
}

function getUnreadMessageCount(conversation) {
  return (conversation.messages || []).filter(
    (message) =>
      message.senderId !== CURRENT_STUDENT_ID &&
      !message.read
  ).length;
}

function getCourseKey(course) {
  if (!course?.id) return null;

  return String(course.id);
}

function findMatchingConversation(
  conversations,
  participantId,
  course
) {
  const courseKey = getCourseKey(course);

  return conversations.find((conversation) => {
    return (
      conversation.participantId === participantId &&
      getCourseKey(conversation.course) === courseKey
    );
  });
}

export function MessagesProvider({ children }) {
  const [conversations, setConversations] =
    useState(getInitialState);

  const [activeConversationId, setActiveConversationId] =
    useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(MESSAGE_FILTERS.ALL);

  const [
    isNewConversationOpen,
    setIsNewConversationOpen,
  ] = useState(false);

  const [
    isConversationInfoOpen,
    setIsConversationInfoOpen,
  ] = useState(false);

  // Persist every conversation update.
  useEffect(() => {
    try {
      saveMessages(conversations);
    } catch (error) {
      console.error(
        "Unable to persist messages:",
        error
      );
    }
  }, [conversations]);

  const activeConversation = useMemo(() => {
    if (!activeConversationId) return null;

    return (
      conversations.find(
        (conversation) =>
          conversation.id === activeConversationId
      ) || null
    );
  }, [conversations, activeConversationId]);

  const visibleConversations = useMemo(
    () =>
      getVisibleConversations(conversations, { search, filter }),
    [conversations, search, filter]
  );

  const totalUnreadMessages = useMemo(
    () =>
      conversations
        .filter((conversation) => !conversation.archived)
        .reduce(
          (total, conversation) =>
            total + getUnreadMessageCount(conversation),
          0
        ),
    [conversations]
  );

  const unreadConversationCount = useMemo(
    () =>
      conversations.filter(
        (conversation) =>
          !conversation.archived &&
          getUnreadMessageCount(conversation) > 0
      ).length,
    [conversations]
  );

  const markConversationAsRead = useCallback(
    (conversationId) => {
      if (!conversationId) return;

      setConversations((previous) =>
        previous.map((conversation) => {
          if (conversation.id !== conversationId) {
            return conversation;
          }

          let changed = false;

          const messages = conversation.messages.map(
            (message) => {
              if (
                message.senderId === CURRENT_STUDENT_ID ||
                message.read
              ) {
                return message;
              }

              changed = true;

              return {
                ...message,
                read: true,
              };
            }
          );

          return changed
            ? { ...conversation, messages }
            : conversation;
        })
      );
    },
    []
  );

  const selectConversation = useCallback(
    (conversationId) => {
      if (!conversationId) {
        setActiveConversationId(null);
        setIsConversationInfoOpen(false);
        return;
      }

      const exists = conversations.some(
        (conversation) =>
          conversation.id === conversationId
      );

      if (!exists) return;

      setActiveConversationId(conversationId);
      setIsConversationInfoOpen(false);
      markConversationAsRead(conversationId);
    },
    [conversations, markConversationAsRead]
  );

  const sendMessage = useCallback(
    (content, attachments = []) => {
      if (!activeConversationId) {
        throw new Error("No active conversation selected.");
      }

      const text =
        typeof content === "string"
          ? content.trim()
          : "";

      if (text.length > MAX_MESSAGE_LENGTH) {
        throw new Error("Message exceeds the length limit.");
      }

      if (!Array.isArray(attachments)) {
        throw new Error("Invalid attachments.");
      }

      if (attachments.length > MAX_ATTACHMENTS) {
        throw new Error("Too many attachments.");
      }

      const normalizedAttachments =
        attachments.map(normalizeAttachment);

      if (!text && normalizedAttachments.length === 0) {
        return null;
      }

      const now = new Date().toISOString();

      const newMessage = {
        id: createId("message"),
        senderId: CURRENT_STUDENT_ID,
        type: normalizedAttachments.length
          ? "attachment"
          : "text",
        content: text,
        attachments: normalizedAttachments,
        createdAt: now,
        read: false,
      };

      const conversationExists = conversations.some(
        (conversation) =>
          conversation.id === activeConversationId
      );

      if (!conversationExists) {
        throw new Error("Conversation no longer exists.");
      }

      setConversations((previous) =>
        previous.map((conversation) => {
          if (conversation.id !== activeConversationId) {
            return conversation;
          }

          return {
            ...conversation,
            updatedAt: now,
            archived: false,
            messages: [
              ...conversation.messages,
              newMessage,
            ],
          };
        })
      );

      return newMessage;
    },
    [activeConversationId, conversations]
  );

  const createConversation = useCallback(
    (participantId, course = null) => {
      if (
        typeof participantId !== "string" ||
        !participantId.trim() ||
        participantId === CURRENT_STUDENT_ID
      ) {
        throw new Error("Invalid participant.");
      }

      const existing = findMatchingConversation(
        conversations,
        participantId,
        course
      );

      if (existing) {
        if (existing.archived) {
          setConversations((previous) =>
            previous.map((conversation) =>
              conversation.id === existing.id
                ? { ...conversation, archived: false }
                : conversation
            )
          );
        }

        setFilter(MESSAGE_FILTERS.ALL);
        setSearch("");
        setActiveConversationId(existing.id);
        setIsNewConversationOpen(false);
        setIsConversationInfoOpen(false);

        markConversationAsRead(existing.id);

        return existing;
      }

      const now = new Date().toISOString();

      const newConversation = {
        id: createId("conversation"),
        participantId,
        participant: messageParticipants.find((item) => item.id === participantId) || null,
        course: course
          ? {
              id: String(course.id || ""),
              title: String(course.title || ""),
              titleAr: String(course.titleAr || ""),
              slug: String(course.slug || ""),
            }
          : null,
        archived: false,
        updatedAt: now,
        messages: [],
      };

      setConversations((previous) => [
        newConversation,
        ...previous,
      ]);

      setFilter(MESSAGE_FILTERS.ALL);
      setSearch("");
      setActiveConversationId(newConversation.id);
      setIsNewConversationOpen(false);
      setIsConversationInfoOpen(false);

      return newConversation;
    },
    [conversations, markConversationAsRead]
  );

  const archiveConversation = useCallback(
    (conversationId) => {
      if (!conversationId) return;

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === conversationId
            ? { ...conversation, archived: true }
            : conversation
        )
      );

      if (activeConversationId === conversationId) {
        setActiveConversationId(null);
        setIsConversationInfoOpen(false);
      }
    },
    [activeConversationId]
  );

  const restoreConversation = useCallback(
    (conversationId) => {
      if (!conversationId) return;

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === conversationId
            ? { ...conversation, archived: false }
            : conversation
        )
      );
    },
    []
  );

  const resetDemoMessages = useCallback(() => {
    let restored;

    try {
      restored = resetMessages();
    } catch (error) {
      console.error("Unable to reset messages:", error);
    }

    const next = normalizeConversations(
      Array.isArray(restored)
        ? restored
        : initialConversations
    );

    setConversations(next);
    setActiveConversationId(null);
    setSearch("");
    setFilter(MESSAGE_FILTERS.ALL);
    setIsNewConversationOpen(false);
    setIsConversationInfoOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      conversations,
      activeConversationId,
      activeConversation,
      visibleConversations,

      search,
      setSearch,
      filter,
      setFilter,

      totalUnreadMessages,
      unreadConversationCount,

      isNewConversationOpen,
      setIsNewConversationOpen,

      isConversationInfoOpen,
      setIsConversationInfoOpen,

      selectConversation,
      markConversationAsRead,
      sendMessage,
      createConversation,
      archiveConversation,
      restoreConversation,
      resetDemoMessages,
    }),
    [
      conversations,
      activeConversationId,
      activeConversation,
      visibleConversations,
      search,
      filter,
      totalUnreadMessages,
      unreadConversationCount,
      isNewConversationOpen,
      isConversationInfoOpen,
      selectConversation,
      markConversationAsRead,
      sendMessage,
      createConversation,
      archiveConversation,
      restoreConversation,
      resetDemoMessages,
    ]
  );

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
}
