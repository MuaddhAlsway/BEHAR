
import {
  getParticipantById,
  getUnreadCount,
  getLastMessage,
} from "../data/messages";

/**
 * Available conversation filters.
 */
export const MESSAGE_FILTERS = {
  ALL: "all",
  UNREAD: "unread",
  INSTRUCTORS: "instructors",
  SUPPORT: "support",
  ARCHIVED: "archived",
};

/**
 * Normalize search text.
 * Supports English and Arabic.
 */
function normalizeSearch(value) {
  if (typeof value !== "string") return "";

  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .trim();
}

/**
 * Search conversations by:
 * - Participant name (English / Arabic)
 * - Course title (English / Arabic)
 * - Message content
 */
export function searchConversations(
  conversations,
  search = ""
) {
  const query = normalizeSearch(search);

  if (!query) return conversations;

  return conversations.filter((conversation) => {
    const participant = conversation.participant || getParticipantById(conversation.participantId);

    const searchableFields = [
      participant?.name,
      participant?.nameAr,
      conversation.course?.title,
      conversation.course?.titleAr,
      ...conversation.messages.map(
        (message) => message.content
      ),
    ];

    return searchableFields.some((field) =>
      normalizeSearch(field).includes(query)
    );
  });
}

/**
 * Filter conversations by category.
 */
export function filterConversations(
  conversations,
  filter = MESSAGE_FILTERS.ALL
) {
  return conversations.filter((conversation) => {
    const participant = conversation.participant || getParticipantById(conversation.participantId);

    switch (filter) {
      case MESSAGE_FILTERS.UNREAD:
        return (
          !conversation.archived &&
          getUnreadCount(conversation) > 0
        );

      case MESSAGE_FILTERS.INSTRUCTORS:
        return (
          !conversation.archived &&
          participant?.role === "instructor"
        );

      case MESSAGE_FILTERS.SUPPORT:
        return (
          !conversation.archived &&
          participant?.role === "support"
        );

      case MESSAGE_FILTERS.ARCHIVED:
        return conversation.archived === true;

      case MESSAGE_FILTERS.ALL:
      default:
        return !conversation.archived;
    }
  });
}

/**
 * Sort conversations by latest activity.
 * Most recent conversations appear first.
 */
export function sortConversations(conversations) {
  return [...conversations].sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();

    return (
      (Number.isFinite(dateB) ? dateB : 0) -
      (Number.isFinite(dateA) ? dateA : 0)
    );
  });
}

/**
 * Combine searching, filtering, and sorting.
 */
export function getVisibleConversations(
  conversations,
  {
    search = "",
    filter = MESSAGE_FILTERS.ALL,
  } = {}
) {
  const filtered = filterConversations(
    conversations,
    filter
  );

  const searched = searchConversations(
    filtered,
    search
  );

  return sortConversations(searched);
}

/**
 * Calculate total unread messages.
 * Archived conversations are excluded.
 */
export function getTotalUnreadMessages(conversations) {
  return conversations
    .filter((conversation) => !conversation.archived)
    .reduce(
      (total, conversation) =>
        total + getUnreadCount(conversation),
      0
    );
}

/**
 * Calculate total unread conversations.
 */
export function getUnreadConversationCount(conversations) {
  return conversations.filter(
    (conversation) =>
      !conversation.archived &&
      getUnreadCount(conversation) > 0
  ).length;
}

/**
 * Return the latest message preview.
 */
export function getConversationPreview(conversation) {
  const lastMessage = getLastMessage(conversation);

  if (!lastMessage) return "";

  if (lastMessage.type === "attachment") {
    return lastMessage.content || "Attachment";
  }

  return lastMessage.content || "";
}

/**
 * Find a conversation by its ID.
 */
export function findConversationById(
  conversations,
  conversationId
) {
  return (
    conversations.find(
      (conversation) => conversation.id === conversationId
    ) ?? null
  );
}
