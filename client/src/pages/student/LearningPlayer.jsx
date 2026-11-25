
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, LockKeyhole } from "lucide-react";

// Learning player data
import {
  getLearningCourseBySlug,
  getLearningCurriculum,
  getLearningLesson,
  getFirstLearningLesson,
  getAllLearningLessons,
} from "../../data/student/learningPlayer";

// P14.3.4 — Lesson content data
import { getLessonContent } from "../../data/student/lessonContent";

// P14.3.6 — Progress tracking
import useLessonProgress from "../../hooks/useLessonProgress";

// P14.5.0.9 — Gamification integration
import { useGamification } from "../../context/GamificationContext";
import {
  GAMIFICATION_EVENT_TYPES,
} from "../../data/student/gamification";

// P14.3.1 — Header
import LearningPlayerHeader from "../../components/student/learning-player/LearningPlayerHeader";

// P14.3.2 — Curriculum Sidebar
import CourseCurriculumSidebar from "../../components/student/learning-player/CourseCurriculumSidebar";

// P14.3.3 — Video Player
import LessonVideoPlayer from "../../components/student/learning-player/LessonVideoPlayer";

// P14.3.5 — Lesson Navigation
import LessonNavigation from "../../components/student/learning-player/LessonNavigation";

// P14.3.6 — Progress Tracker
import LessonProgressTracker from "../../components/student/learning-player/LessonProgressTracker";

// P14.3.7 — Learning Player Tabs
import LearningPlayerTabs from "../../components/student/learning-player/LearningPlayerTabs";

// P14.4.0.7 — Lesson Assessment Integration
import LessonAssessment from "../../components/student/assessments/LessonAssessment";

// Styles
import "../../styles/student/learning-player/learning-player.css";

/* ==========================================
   TRANSLATIONS
========================================== */

const translations = {
  en: {
    notFound: "Learning course not found",
    notFoundDescription:
      "This course is not available in your learning library.",
    unavailable: "Lesson not found",
    unavailableDescription:
      "The requested lesson is not available in this course.",
    locked: "Lesson locked",
    lockedDescription:
      "This lesson is currently locked and cannot be opened.",
    returnToCourse: "Return to course",
    returnToLibrary: "Return to My Learning",
    emptyCurriculum:
      "This course has no lessons available yet.",
  },

  ar: {
    notFound: "الدورة غير موجودة",
    notFoundDescription:
      "هذه الدورة غير متاحة في مكتبتك التعليمية.",
    unavailable: "الدرس غير موجود",
    unavailableDescription:
      "الدرس المطلوب غير متاح في هذه الدورة.",
    locked: "الدرس مقفل",
    lockedDescription:
      "هذا الدرس مقفل حالياً ولا يمكن فتحه.",
    returnToCourse: "العودة إلى الدورة",
    returnToLibrary: "العودة إلى تعلّمي",
    emptyCurriculum:
      "لا توجد دروس متاحة لهذه الدورة بعد.",
  },
};

/* ==========================================
   HELPERS
========================================== */

function getCurrentLanguage() {
  if (typeof document === "undefined") {
    return "en";
  }

  return document.documentElement.lang === "ar"
    ? "ar"
    : "en";
}

function getLocalized(value, language) {
  if (typeof value === "string") {
    return value;
  }

  return value?.[language] || value?.en || "";
}

function getLessonPath(courseSlug, lessonId) {
  return `/student/learn/${encodeURIComponent(
    courseSlug
  )}/lessons/${encodeURIComponent(lessonId)}`;
}

/* ==========================================
   EMPTY / ERROR MESSAGE
========================================== */

function LearningMessage({
  title,
  description,
  action,
  to,
}) {
  return (
    <div className="behar-player__message">
      <div className="behar-player__message-icon">
        <LockKeyhole
          size={30}
          strokeWidth={1.4}
          aria-hidden="true"
        />
      </div>

      <h1>{title}</h1>
      <p>{description}</p>

      <Link
        to={to}
        className="behar-player__message-link"
      >
        {action}

        <ArrowRight
          size={17}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}

/* ==========================================
   MAIN LEARNING PLAYER
========================================== */

export default function LearningPlayer() {
  const { courseSlug, lessonId } = useParams();

  /* ======================================
     P14.5.0.9 — GAMIFICATION CONTEXT
  ====================================== */

  const {
    applyVerifiedEvent,
  } = useGamification();

  /* ======================================
     LANGUAGE
  ====================================== */

  const [language, setLanguage] = useState(
    getCurrentLanguage
  );

  useEffect(() => {
    if (typeof document === "undefined") return;

    const observer = new MutationObserver(() => {
      setLanguage(getCurrentLanguage());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  const t = translations[language];
  const direction = language === "ar" ? "rtl" : "ltr";

  /* ======================================
     COURSE RESOLUTION
  ====================================== */

  const course = useMemo(
    () => getLearningCourseBySlug(courseSlug),
    [courseSlug]
  );

  const modules = useMemo(
    () =>
      course
        ? getLearningCurriculum(course.courseId)
        : [],
    [course]
  );

  const lessons = useMemo(
    () => getAllLearningLessons(modules),
    [modules]
  );

  const firstLesson = getFirstLearningLesson(modules);

  const currentLesson = lessonId
    ? getLearningLesson(modules, lessonId)
    : null;

  /* ======================================
     P14.3.4 — LESSON CONTENT DATA
  ====================================== */

  const lessonContent =
    course && currentLesson
      ? getLessonContent(
          course.courseId,
          currentLesson.id
        )
      : null;

  /* ======================================
     P14.3.6 — LESSON PROGRESS
     Hooks must run before conditional returns.
  ====================================== */

  const {
    completedLessonIds,
    completedCount,
    totalLessons,
    progressPercentage,
    isCourseCompleted,
    isLessonCompleted,
    toggleLessonCompletion,
  } = useLessonProgress(course?.courseId, lessons);

  const completedCourseIdsRef = useRef(new Set());

  useEffect(() => {
    if (
      !course ||
      totalLessons === 0 ||
      !isCourseCompleted ||
      completedCourseIdsRef.current.has(course.courseId)
    ) {
      return;
    }

    completedCourseIdsRef.current.add(course.courseId);

    applyVerifiedEvent(
      {
        type: GAMIFICATION_EVENT_TYPES.COURSE_COMPLETED,
        eventId: `${course.courseId}:course-completed`,
      },
      { language }
    );
  }, [
    applyVerifiedEvent,
    course,
    isCourseCompleted,
    language,
    totalLessons,
  ]);

  /* ======================================
     P14.5.0.9 — LESSON COMPLETION REWARD
  ====================================== */

  const handleLessonCompletion = () => {
    if (!course || !currentLesson) {
      return;
    }

    if (currentLesson.isLocked === true) {
      return;
    }

    const alreadyCompleted = isLessonCompleted(
      currentLesson.id
    );

    // Preserve existing lesson completion behavior.
    toggleLessonCompletion(currentLesson.id);

    // Unmarking a lesson must never award XP.
    if (alreadyCompleted) {
      return;
    }

    // Use a stable event ID to prevent repeated rewards.
    const eventId = `${course.courseId}:${currentLesson.id}`;

    applyVerifiedEvent(
      {
        type: GAMIFICATION_EVENT_TYPES.LESSON_COMPLETED,
        eventId,
      },
      {
        language,
      }
    );
  };

  /* ======================================
     SIDEBAR PROGRESS SYNCHRONIZATION
  ====================================== */

  const modulesWithProgress = useMemo(() => {
    const completedSet = new Set(completedLessonIds);

    return modules.map((module) => ({
      ...module,

      lessons: module.lessons.map((lesson) => ({
        ...lesson,
        isCompleted: completedSet.has(lesson.id),
      })),
    }));
  }, [modules, completedLessonIds]);

  /* ======================================
     COURSE NOT FOUND
  ====================================== */

  if (!course) {
    return (
      <main
        className="behar-player"
        dir={direction}
      >
        <LearningMessage
          title={t.notFound}
          description={t.notFoundDescription}
          action={t.returnToLibrary}
          to="/student/my-learning"
        />
      </main>
    );
  }

  /* ======================================
     DEFAULT LESSON REDIRECT
  ====================================== */

  if (!lessonId) {
    const preferredLesson =
      getLearningLesson(
        modules,
        course.nextLessonId
      ) || firstLesson;

    if (!preferredLesson) {
      return (
        <main
          className="behar-player"
          dir={direction}
        >
          <LearningMessage
            title={getLocalized(
              course.title,
              language
            )}
            description={t.emptyCurriculum}
            action={t.returnToLibrary}
            to="/student/my-learning"
          />
        </main>
      );
    }

    const targetLesson =
      preferredLesson.isLocked === true
        ? lessons.find(
            (lesson) => lesson.isLocked !== true
          )
        : preferredLesson;

    if (!targetLesson) {
      return (
        <main
          className="behar-player"
          dir={direction}
        >
          <LearningMessage
            title={t.locked}
            description={t.lockedDescription}
            action={t.returnToLibrary}
            to="/student/my-learning"
          />
        </main>
      );
    }

    return (
      <Navigate
        replace
        to={getLessonPath(
          course.slug,
          targetLesson.id
        )}
      />
    );
  }

  /* ======================================
     LESSON NOT FOUND
  ====================================== */

  if (!currentLesson) {
    return (
      <main
        className="behar-player"
        dir={direction}
      >
        <LearningMessage
          title={t.unavailable}
          description={t.unavailableDescription}
          action={t.returnToCourse}
          to={`/student/learn/${encodeURIComponent(
            course.slug
          )}`}
        />
      </main>
    );
  }

  /* ======================================
     LOCKED LESSON
  ====================================== */

  if (currentLesson.isLocked === true) {
    return (
      <main
        className="behar-player"
        dir={direction}
      >
        <LearningMessage
          title={t.locked}
          description={t.lockedDescription}
          action={t.returnToCourse}
          to={`/student/learn/${encodeURIComponent(
            course.slug
          )}`}
        />
      </main>
    );
  }

  /* ======================================
     PLAYER WORKSPACE
  ====================================== */

  return (
    <main
      className="behar-player"
      dir={direction}
    >
      {/* P14.3.1 — HEADER */}
      <LearningPlayerHeader
        course={course}
        language={language}
      />

      <div className="behar-player__layout">
        {/* MAIN LEARNING CONTENT */}
        <div className="behar-player__main">

          {/* P14.3.3 — VIDEO PLAYER */}
          <LessonVideoPlayer
            key={`${course.courseId}-${currentLesson.id}`}
            lesson={currentLesson}
            language={language}
          />

          {/* P14.3.7 — TABBED LESSON WORKSPACE */}
          <LearningPlayerTabs
            key={`${course.courseId}-${currentLesson.id}`}
            course={course}
            lesson={currentLesson}
            content={lessonContent}
            language={language}
          />

          {/* P14.4.0.7 — LESSON ASSESSMENT */}
          <LessonAssessment
            key={`assessment-${course.courseId}-${currentLesson.id}`}
            courseId={course.courseId}
            lessonId={currentLesson.id}
            studentId="dev-student-001"
            language={language}
          />

          {/* P14.3.6 — PROGRESS TRACKER */}
          <LessonProgressTracker
            lesson={currentLesson}
            completedCount={completedCount}
            totalLessons={totalLessons}
            progressPercentage={progressPercentage}
            isCompleted={isLessonCompleted(
              currentLesson.id
            )}
            isCourseCompleted={isCourseCompleted}
            onToggleCompletion={handleLessonCompletion}
            language={language}
          />

          {/* P14.3.5 — LESSON NAVIGATION */}
          <LessonNavigation
            course={course}
            lessons={lessons}
            currentLessonId={currentLesson.id}
            language={language}
          />

        </div>

        {/* P14.3.2 — CURRICULUM SIDEBAR */}
        <CourseCurriculumSidebar
          course={course}
          modules={modulesWithProgress}
          currentLessonId={currentLesson.id}
          language={language}
        />
      </div>
    </main>
  );
}
