import { createContext, useCallback, useContext, useMemo } from "react";

import usePersistentState from "../hooks/usePersistentState";
import { discussionRecords } from "../data/discussions";
import { discussionReplies } from "../data/discussionReplies";
import { clearDiscussionState, loadDiscussionState, saveDiscussionState } from "../utils/discussionStorage";

const DiscussionsContext = createContext(null);

function cloneDemoState() {
  return structuredClone({ discussions: discussionRecords, replies: discussionReplies });
}

function createId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function DiscussionsProvider({ children }) {
  const [discussionState, setDiscussionState] = usePersistentState({
    initialState: cloneDemoState(),
    load: loadDiscussionState,
    save: saveDiscussionState,
  });
  const { discussions, replies } = discussionState;

  const createDiscussion = useCallback((values) => {
    const discussion = {
      id: createId("discussion"), courseId: values.courseId, author: "BEHAR Student", authorRole: "student",
      title: { en: values.title, ar: values.title }, excerpt: { en: values.body, ar: values.body }, tags: values.tags ?? [],
      status: "open", replies: 0, upvotes: 0, createdAt: new Date().toISOString(), hasInstructorReply: false, isMine: true,
    };
    setDiscussionState((current) => ({ ...current, discussions: [discussion, ...current.discussions] }));
    return discussion;
  }, [setDiscussionState]);

  const getDiscussionById = useCallback((discussionId) => discussions.find((discussion) => discussion.id === discussionId), [discussions]);
  const getRepliesByDiscussionId = useCallback((discussionId) => replies.filter((reply) => reply.discussionId === discussionId), [replies]);

  const addReply = useCallback((discussionId, content, parentId = null) => {
    const reply = {
      id: createId("reply"), discussionId, parentId, author: "BEHAR Student", authorRole: "student",
      content: { en: content, ar: content }, createdAt: new Date().toISOString(), upvotes: 0, isAccepted: false,
    };
    setDiscussionState((current) => ({
      discussions: current.discussions.map((discussion) => discussion.id === discussionId ? { ...discussion, replies: (discussion.replies ?? 0) + 1 } : discussion),
      replies: [...current.replies, reply],
    }));
    return reply;
  }, [setDiscussionState]);

  const toggleDiscussionUpvote = useCallback((discussionId) => {
    setDiscussionState((current) => ({ ...current, discussions: current.discussions.map((discussion) => {
      if (discussion.id !== discussionId) return discussion;
      const isUpvoted = !discussion.isUpvoted;
      return { ...discussion, isUpvoted, upvotes: Math.max(0, (discussion.upvotes ?? 0) + (isUpvoted ? 1 : -1)) };
    }) }));
  }, [setDiscussionState]);

  const toggleDiscussionBookmark = useCallback((discussionId) => {
    setDiscussionState((current) => ({ ...current, discussions: current.discussions.map((discussion) => discussion.id === discussionId ? { ...discussion, isBookmarked: !discussion.isBookmarked } : discussion) }));
  }, [setDiscussionState]);

  const toggleDiscussionSolved = useCallback((discussionId) => {
    setDiscussionState((current) => ({ ...current, discussions: current.discussions.map((discussion) => discussion.id === discussionId && discussion.isMine ? { ...discussion, status: discussion.status === "solved" ? "open" : "solved" } : discussion) }));
  }, [setDiscussionState]);

  const toggleReplyUpvote = useCallback((replyId) => {
    setDiscussionState((current) => ({ ...current, replies: current.replies.map((reply) => {
      if (reply.id !== replyId) return reply;
      const isUpvoted = !reply.isUpvoted;
      return { ...reply, isUpvoted, upvotes: Math.max(0, (reply.upvotes ?? 0) + (isUpvoted ? 1 : -1)) };
    }) }));
  }, [setDiscussionState]);

  const resetDiscussions = useCallback(() => {
    clearDiscussionState();
    setDiscussionState(cloneDemoState());
  }, [setDiscussionState]);

  const value = useMemo(() => ({ discussions, replies, createDiscussion, getDiscussionById, getRepliesByDiscussionId, addReply, toggleDiscussionUpvote, toggleDiscussionBookmark, toggleDiscussionSolved, toggleReplyUpvote, resetDiscussions }), [discussions, replies, createDiscussion, getDiscussionById, getRepliesByDiscussionId, addReply, toggleDiscussionUpvote, toggleDiscussionBookmark, toggleDiscussionSolved, toggleReplyUpvote, resetDiscussions]);

  return <DiscussionsContext.Provider value={value}>{children}</DiscussionsContext.Provider>;
}

export function useDiscussions() {
  const context = useContext(DiscussionsContext);
  if (!context) throw new Error("useDiscussions must be used within DiscussionsProvider");
  return context;
}
