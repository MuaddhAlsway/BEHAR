
import { initialConversations } from "../data/messages";

const STORAGE_KEY = "behar:student-messages:v1";

function cloneInitialConversations() {
  return structuredClone(initialConversations);
}

/**
 * Validate stored conversation data.
 */
function isValidConversation(conversation) {
  return (
    conversation !== null &&
    typeof conversation === "object" &&
    typeof conversation.id === "string" &&
    (typeof conversation.participantId === "string" || (conversation.participant && typeof conversation.participant === "object")) &&
    Array.isArray(conversation.messages) &&
    conversation.messages.every(
      (message) =>
        message !== null &&
        typeof message === "object" &&
        typeof message.id === "string" &&
        typeof message.senderId === "string" &&
        typeof message.content === "string" &&
        typeof message.createdAt === "string" &&
        typeof message.read === "boolean"
    )
  );
}

/**
 * Load conversations from localStorage.
 * Falls back to initial demo data when storage is empty
 * or invalid.
 */
export function loadMessages() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return cloneInitialConversations();
    }

    const parsed = JSON.parse(stored);

    if (
      !Array.isArray(parsed) ||
      !parsed.every(isValidConversation)
    ) {
      return cloneInitialConversations();
    }

    return parsed;
  } catch (error) {
    console.error("Failed to load messages:", error);
    return cloneInitialConversations();
  }
}

/**
 * Persist the current conversations.
 */
export function saveMessages(conversations) {
  try {
    if (
      !Array.isArray(conversations) ||
      !conversations.every(isValidConversation)
    ) {
      return false;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(conversations)
    );

    return true;
  } catch (error) {
    console.error("Failed to save messages:", error);
    return false;
  }
}

/**
 * Reset conversations to the original demo data.
 */
export function resetMessages() {
  const initialData = cloneInitialConversations();

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to reset messages:", error);
  }

  return initialData;
}

/**
 * Clear persisted conversations without returning demo data.
 */
export function clearMessagesStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Failed to clear messages:", error);
    return false;
  }
}
