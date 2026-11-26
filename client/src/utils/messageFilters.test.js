import { describe, expect, it } from "vitest";
import {
  MESSAGE_FILTERS,
  getVisibleConversations,
} from "./messageFilters";

const conversations = [
  {
    id: "active-1",
    participantId: "instructor-001",
    participant: { id: "instructor-001", name: "Nora Alharbi", nameAr: "نورة الحربي", role: "instructor" },
    archived: false,
    updatedAt: "2026-11-26T10:00:00Z",
    messages: [{ id: "m1", senderId: "instructor-001", content: "Hello", read: false, createdAt: "2026-11-26T10:00:00Z" }],
  },
  {
    id: "archived-1",
    participantId: "support-001",
    participant: { id: "support-001", name: "BEHAR Support", nameAr: "دعم BEHAR", role: "support" },
    archived: true,
    updatedAt: "2026-11-25T10:00:00Z",
    messages: [{ id: "m2", senderId: "student", content: "Sent", read: false, createdAt: "2026-11-25T10:00:00Z" }],
  },
];

describe("message conversation filters", () => {
  it("shows archived conversations only in the archived filter", () => {
    expect(getVisibleConversations(conversations, { filter: MESSAGE_FILTERS.ALL }).map((item) => item.id)).toEqual(["active-1"]);
    expect(getVisibleConversations(conversations, { filter: MESSAGE_FILTERS.ARCHIVED }).map((item) => item.id)).toEqual(["archived-1"]);
  });

  it("supports search and role filters together", () => {
    expect(getVisibleConversations(conversations, { search: "نورة", filter: MESSAGE_FILTERS.INSTRUCTORS })).toHaveLength(1);
    expect(getVisibleConversations(conversations, { search: "support", filter: MESSAGE_FILTERS.ARCHIVED })).toHaveLength(1);
  });

  it("does not count outgoing unread messages", () => {
    expect(getVisibleConversations(conversations, { filter: MESSAGE_FILTERS.UNREAD }).map((item) => item.id)).toEqual(["active-1"]);
  });
});
