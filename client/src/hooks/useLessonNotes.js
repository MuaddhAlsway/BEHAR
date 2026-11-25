
import { useEffect, useState } from "react";

const STORAGE_KEY = "behar:lesson-notes:v1";

function readNotes() {
  if (typeof window === "undefined") return {};

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) || "{}"
    );

    return parsed && typeof parsed === "object" &&
      !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

export default function useLessonNotes(courseId, lessonId) {
  const [notes, setNotes] = useState(readNotes);

  const key = `${courseId || ""}:${lessonId || ""}`;

  const lessonNotes = Array.isArray(notes[key])
    ? notes[key]
    : [];

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notes)
      );
    } catch {
      // Browser storage may be unavailable.
    }
  }, [notes]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        setNotes(readNotes());
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function addNote(content) {
    const text = content.trim();
    if (!text || !courseId || !lessonId) return false;

    const note = {
      id: crypto.randomUUID(),
      content: text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotes((previous) => ({
      ...previous,
      [key]: [...(previous[key] || []), note],
    }));

    return true;
  }

  function updateNote(noteId, content) {
    const text = content.trim();
    if (!text) return false;

    setNotes((previous) => ({
      ...previous,
      [key]: (previous[key] || []).map((note) =>
        note.id === noteId
          ? {
              ...note,
              content: text,
              updatedAt: new Date().toISOString(),
            }
          : note
      ),
    }));

    return true;
  }

  function deleteNote(noteId) {
    setNotes((previous) => ({
      ...previous,
      [key]: (previous[key] || []).filter(
        (note) => note.id !== noteId
      ),
    }));
  }

  return {
    lessonNotes,
    addNote,
    updateNote,
    deleteNote,
  };
}
