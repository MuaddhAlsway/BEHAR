// @vitest-environment jsdom

import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import AttachmentPreview from "./AttachmentPreview";

afterEach(() => cleanup());

describe("AttachmentPreview", () => {
  it("renders safely when attachment metadata is missing or malformed", () => {
    expect(() => {
      render(
        React.createElement(AttachmentPreview, {
          variant: "message",
          attachments: [null, { id: "invalid", size: "unknown" }],
        })
      );
    }).not.toThrow();

    expect(screen.getAllByText("Attachment")).toHaveLength(2);
    expect(screen.getAllByLabelText("File unavailable")).toHaveLength(2);
  });

  it("does not expose download actions when only metadata is persisted", () => {
    render(
      React.createElement(AttachmentPreview, {
        variant: "message",
        attachments: [{
          id: "attachment-1",
          name: "lesson-notes.pdf",
          size: 2048,
          type: "application/pdf",
        }],
      })
    );

    expect(screen.getByText("lesson-notes.pdf")).toBeInTheDocument();
    expect(screen.getAllByLabelText("File unavailable")).toHaveLength(1);
    expect(screen.queryByLabelText("Download attachment")).toBeNull();
  });
});
