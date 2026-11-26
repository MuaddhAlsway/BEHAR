import { describe, expect, it } from "vitest";
import {
  DISCUSSION_LIMITS,
  validateDiscussion,
} from "./discussionValidation";

const valid = {
  courseId: "course-001",
  title: "A useful discussion title",
  body: "This is a sufficiently detailed discussion description for testing.",
  tags: "React, Hooks",
};

describe("validateDiscussion", () => {
  it("accepts valid values and normalizes tags", () => {
    const result = validateDiscussion(valid);
    expect(result.valid).toBe(true);
    expect(result.normalized.tags).toEqual(["React", "Hooks"]);
  });

  it("rejects missing course and boundary-short text", () => {
    const result = validateDiscussion({ ...valid, courseId: "", title: "short", body: "tiny" });
    expect(result.valid).toBe(false);
    expect(result.errors.courseId).toBeTruthy();
    expect(result.errors.title).toBeTruthy();
    expect(result.errors.body).toBeTruthy();
  });

  it("rejects excessive title, body, tag count, and tag length", () => {
    const result = validateDiscussion({
      ...valid,
      title: "x".repeat(DISCUSSION_LIMITS.titleMax + 1),
      body: "x".repeat(DISCUSSION_LIMITS.bodyMax + 1),
      tags: [...Array(DISCUSSION_LIMITS.maxTags + 1)].map((_, index) => `tag-${index}`).join(","),
    });
    expect(result.valid).toBe(false);
    expect(result.errors.title).toBeTruthy();
    expect(result.errors.body).toBeTruthy();
    expect(result.errors.tags).toBeTruthy();
  });
});
