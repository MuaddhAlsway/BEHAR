
export const DISCUSSIONS_STORAGE_KEY =
  "behar:discussions:v1";

export const DISCUSSIONS_STORAGE_VERSION = 1;

function isRecord(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function isValidDiscussion(item) {
  return (
    isRecord(item) &&
    typeof item.id === "string" &&
    item.id.length > 0 &&
    typeof item.courseId === "string" &&
    typeof item.author === "string" &&
    isRecord(item.title) &&
    isRecord(item.excerpt) &&
    Array.isArray(item.tags) &&
    item.tags.every(tag => typeof tag === "string") &&
    ["open", "solved"].includes(item.status) &&
    Number.isSafeInteger(item.upvotes) &&
    item.upvotes >= 0 &&
    typeof item.createdAt === "string" &&
    !Number.isNaN(Date.parse(item.createdAt))
  );
}

function isValidReply(item) {
  return (
    isRecord(item) &&
    typeof item.id === "string" &&
    item.id.length > 0 &&
    typeof item.discussionId === "string" &&
    (item.parentId === null ||
      typeof item.parentId === "string") &&
    typeof item.author === "string" &&
    isRecord(item.content) &&
    Number.isSafeInteger(item.upvotes) &&
    item.upvotes >= 0 &&
    typeof item.createdAt === "string" &&
    !Number.isNaN(Date.parse(item.createdAt))
  );
}

function hasUniqueIds(items) {
  return new Set(items.map(item => item.id)).size === items.length;
}

function hasValidRelationships(discussions, replies) {
  const discussionIds = new Set(discussions.map((item) => item.id));
  const replyIds = new Set(replies.map((item) => item.id));
  return replies.every((reply) => discussionIds.has(reply.discussionId) && (reply.parentId === null || replyIds.has(reply.parentId)));
}

export function loadDiscussionState(fallback) {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(
      DISCUSSIONS_STORAGE_KEY
    );

    if (!raw) return fallback;

    const stored = JSON.parse(raw);

    if (
      !isRecord(stored) ||
      stored.version !== DISCUSSIONS_STORAGE_VERSION ||
      !Array.isArray(stored.discussions) ||
      !Array.isArray(stored.replies) ||
      !stored.discussions.every(isValidDiscussion) ||
      !stored.replies.every(isValidReply) ||
      !hasUniqueIds(stored.discussions) ||
      !hasUniqueIds(stored.replies) ||
      !hasValidRelationships(stored.discussions, stored.replies)
    ) {
      return fallback;
    }

    return {
      discussions: stored.discussions,
      replies: stored.replies,
    };
  } catch {
    return fallback;
  }
}

export function saveDiscussionState(state) {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(
      DISCUSSIONS_STORAGE_KEY,
      JSON.stringify({
        version: DISCUSSIONS_STORAGE_VERSION,
        discussions: state.discussions,
        replies: state.replies,
      })
    );

    return true;
  } catch {
    return false;
  }
}

export function clearDiscussionState() {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.removeItem(
      DISCUSSIONS_STORAGE_KEY
    );
    return true;
  } catch {
    return false;
  }
}
