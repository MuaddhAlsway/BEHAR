
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "behar:learning-progress:v1";

function readStoredProgress() {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};

    return parsed && typeof parsed === "object" &&
      !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

export default function useLessonProgress(courseId, lessons = []) {
  const [storedProgress, setStoredProgress] = useState(
    readStoredProgress
  );
  const lastSerializedRef = useRef(null);

  const validLessonIds = useMemo(
    () => new Set(lessons.map((lesson) => lesson.id)),
    [lessons]
  );

  const completedLessonIds = useMemo(() => {
    const saved = storedProgress[courseId];

    if (!Array.isArray(saved)) return [];

    return [...new Set(saved)].filter((id) =>
      validLessonIds.has(id)
    );
  }, [storedProgress, courseId, validLessonIds]);

  const completedSet = useMemo(
    () => new Set(completedLessonIds),
    [completedLessonIds]
  );

  const totalLessons = lessons.length;
  const completedCount = completedLessonIds.length;

  const progressPercentage =
    totalLessons > 0
      ? Math.round((completedCount / totalLessons) * 100)
      : 0;

  const isCourseCompleted =
    totalLessons > 0 && completedCount === totalLessons;

  const isLessonCompleted = useCallback(
    (lessonId) => completedSet.has(lessonId),
    [completedSet]
  );

  const updateCompletion = useCallback(
    (lessonId, shouldComplete) => {
      const lesson = lessons.find((item) => item.id === lessonId);

      if (!courseId || !lesson || lesson.isLocked === true) {
        return;
      }

      setStoredProgress((previous) => {
        const existing = Array.isArray(previous[courseId])
          ? previous[courseId]
          : [];

        const next = new Set(
          existing.filter((id) => validLessonIds.has(id))
        );

        if (shouldComplete) {
          next.add(lessonId);
        } else {
          next.delete(lessonId);
        }

        return {
          ...previous,
          [courseId]: [...next],
        };
      });
    },
    [courseId, lessons, validLessonIds]
  );

  const markLessonCompleted = useCallback(
    (lessonId) => updateCompletion(lessonId, true),
    [updateCompletion]
  );

  const markLessonIncomplete = useCallback(
    (lessonId) => updateCompletion(lessonId, false),
    [updateCompletion]
  );

  const toggleLessonCompletion = useCallback(
    (lessonId) => {
      updateCompletion(lessonId, !completedSet.has(lessonId));
    },
    [updateCompletion, completedSet]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const serialized = JSON.stringify(storedProgress);
      window.localStorage.setItem(
        STORAGE_KEY,
        serialized
      );

      if (lastSerializedRef.current !== serialized) {
        lastSerializedRef.current = serialized;
        window.dispatchEvent(
          new CustomEvent("behar:learning-progress-change", {
            detail: storedProgress,
          })
        );
      }
    } catch {
      // Storage may be unavailable or full.
    }
  }, [storedProgress]);

  useEffect(() => {
    function handleStorage(event) {
      if (event.key === STORAGE_KEY) {
        setStoredProgress(readStoredProgress());
      }
    }

    window.addEventListener("storage", handleStorage);

    const handleProgressChange = () => {
      setStoredProgress(readStoredProgress());
    };

    window.addEventListener(
      "behar:learning-progress-change",
      handleProgressChange
    );

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(
        "behar:learning-progress-change",
        handleProgressChange
      );
    };
  }, []);

  return {
    completedLessonIds,
    completedCount,
    totalLessons,
    progressPercentage,
    isCourseCompleted,
    isLessonCompleted,
    markLessonCompleted,
    markLessonIncomplete,
    toggleLessonCompletion,
  };
}
