import { afterEach, describe, expect, it } from "vitest";
import {
  DISCUSSIONS_STORAGE_KEY,
  loadDiscussionState,
  saveDiscussionState,
} from "./discussionStorage";

const state = {
  discussions: [{
    id: "discussion-test",
    courseId: "course-001",
    author: "Test",
    title: { en: "A title" },
    excerpt: { en: "An excerpt" },
    tags: [],
    status: "open",
    upvotes: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
  }],
  replies: [],
};

function createStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

afterEach(() => {
  delete global.window;
});

describe("discussionStorage", () => {
  it("round-trips valid state", () => {
    global.window = { localStorage: createStorage() };
    expect(saveDiscussionState(state)).toBe(true);
    expect(loadDiscussionState({ discussions: [], replies: [] })).toEqual(state);
  });

  it("falls back for malformed JSON, versions, IDs, and relationships", () => {
    const storage = createStorage();
    global.window = { localStorage: storage };
    const fallback = { discussions: [], replies: [] };
    storage.setItem(DISCUSSIONS_STORAGE_KEY, "not-json");
    expect(loadDiscussionState(fallback)).toBe(fallback);
    storage.setItem(DISCUSSIONS_STORAGE_KEY, JSON.stringify({ version: 99 }));
    expect(loadDiscussionState(fallback)).toBe(fallback);
  });

  it("handles storage access failures without throwing", () => {
    global.window = {
      localStorage: {
        getItem: () => { throw new Error("blocked"); },
        setItem: () => { throw new Error("blocked"); },
      },
    };
    const fallback = { discussions: [], replies: [] };
    expect(loadDiscussionState(fallback)).toBe(fallback);
    expect(saveDiscussionState(fallback)).toBe(false);
  });
});
