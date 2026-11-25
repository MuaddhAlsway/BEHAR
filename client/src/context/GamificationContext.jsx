
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  mockStudentGamification,
} from "../data/student/gamification";

import {
  processGamificationEvent,
} from "../utils/gamificationProcessor";

const GamificationContext = createContext(null);

const STORAGE_VERSION = 1;
const STORAGE_KEY = `behar:gamification:v${STORAGE_VERSION}:dev-student-001`;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isValidProgress(value) {
  return Boolean(
    value &&
      typeof value === "object" &&
      value.schemaVersion === STORAGE_VERSION &&
      value.studentId === "dev-student-001" &&
      Number.isFinite(value.totalXP) &&
      Array.isArray(value.awardedEventKeys) &&
      Array.isArray(value.xpTransactions) &&
      value.stats &&
      value.streak &&
      value.weeklyGoal &&
      Array.isArray(value.unlockedBadges)
  );
}

function readStoredProgress() {
  if (typeof window === "undefined") {
    return clone(mockStudentGamification);
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;

    return isValidProgress(parsed)
      ? parsed
      : clone(mockStudentGamification);
  } catch {
    return clone(mockStudentGamification);
  }
}

export function GamificationProvider({ children }) {
  const [progress, setProgress] = useState(
    readStoredProgress
  );
  const progressRef = useRef(progress);

  const [celebrations, setCelebrations] = useState([]);

  useEffect(() => {
    progressRef.current = progress;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(progress)
      );
    } catch {
      // Storage may be unavailable or blocked.
    }
  }, [progress]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;

      try {
        const parsed = JSON.parse(event.newValue);
        if (isValidProgress(parsed)) {
          progressRef.current = parsed;
          setProgress(parsed);
        }
      } catch {
        // Ignore malformed cross-tab state.
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const processEvent = useCallback(
    (event, options = {}) => {
      const result = processGamificationEvent(
        progressRef.current,
        event,
        options
      );

      if (!result.duplicate) {
        progressRef.current = result.progress;
        setProgress(result.progress);
        setCelebrations((current) => [
          ...current,
          ...result.celebrations,
        ]);
      }

      return result;
    },
    []
  );

  const applyVerifiedEvent = useCallback(
    (event, options = {}) => {
      const result = processGamificationEvent(
        progressRef.current,
        event,
        options
      );

      if (!result.duplicate) {
        progressRef.current = result.progress;
        setProgress(result.progress);

        setCelebrations((current) => [
          ...current,
          ...result.celebrations,
        ]);
      }

      return result;
    },
    []
  );

  const dismissCelebration = useCallback(() => {
    setCelebrations((current) =>
      current.slice(1)
    );
  }, []);

  const value = useMemo(
    () => ({
      progress,
      celebrations,
      activeCelebration:
        celebrations[0] ?? null,
      applyVerifiedEvent,
      dismissCelebration,
    }),
    [
      progress,
      celebrations,
      applyVerifiedEvent,
      dismissCelebration,
    ]
  );

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);

  if (!context) {
    throw new Error(
      "useGamification must be used inside GamificationProvider."
    );
  }

  return context;
}
