
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  ListVideo,
  LockKeyhole,
  Menu,
  Play,
  X,
} from "lucide-react";

import useFocusTrap from "../../../hooks/useFocusTrap";
import "../../../styles/student/learning-player/course-curriculum-sidebar.css";

const MOBILE_BREAKPOINT = "(max-width: 1024px)";

const translations = {
  en: {
    eyebrow: "YOUR LEARNING ROADMAP",
    title: "Course curriculum",
    lessons: "lessons",
    lesson: "Lesson",
    modules: "Modules",
    module: "Module",
    minutes: "min",
    openCurriculum: "Course content",
    closeCurriculum: "Close curriculum",
    expandModule: "Expand module",
    collapseModule: "Collapse module",
    completed: "Completed",
    current: "Current lesson",
    locked: "Locked lesson",
    noLessons: "No lessons available yet.",
    allModules: "Expand all",
    collapseAll: "Collapse all",
  },
  ar: {
    eyebrow: "خارطة رحلتك التعليمية",
    title: "محتوى الدورة",
    lessons: "دروس",
    lesson: "درس",
    modules: "الوحدات",
    module: "الوحدة",
    minutes: "دقيقة",
    openCurriculum: "محتوى الدورة",
    closeCurriculum: "إغلاق المحتوى",
    expandModule: "توسيع الوحدة",
    collapseModule: "طي الوحدة",
    completed: "مكتمل",
    current: "الدرس الحالي",
    locked: "درس مقفل",
    noLessons: "لا توجد دروس متاحة بعد.",
    allModules: "توسيع الكل",
    collapseAll: "طي الكل",
  },
};

function localized(value, language) {
  if (typeof value === "string") return value;
  return value?.[language] || value?.en || "";
}

function formatNumber(value, language) {
  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US"
  ).format(value);
}

function lessonPath(courseSlug, lessonId) {
  return `/student/learn/${encodeURIComponent(
    courseSlug
  )}/lessons/${encodeURIComponent(lessonId)}`;
}

function LessonTypeIcon({ type }) {
  switch (type) {
    case "quiz":
      return <HelpCircle size={15} strokeWidth={1.7} />;
    case "article":
    case "reading":
      return <FileText size={15} strokeWidth={1.7} />;
    case "resource":
      return <BookOpen size={15} strokeWidth={1.7} />;
    default:
      return <Play size={15} strokeWidth={1.7} />;
  }
}

function getIsMobileViewport() {
  if (typeof window === "undefined") return false;

  return window.matchMedia(MOBILE_BREAKPOINT).matches;
}

export default function CourseCurriculumSidebar({
  course,
  modules = [],
  currentLessonId,
  language = "en",
}) {
  const locale = language === "ar" ? "ar" : "en";
  const t = translations[locale];
  const isRTL = locale === "ar";

  const drawerId = useId();
  const drawerRef = useRef(null);
  const openButtonRef = useRef(null);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(
    getIsMobileViewport
  );

  const closeDrawer = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const activeModuleId = useMemo(
    () =>
      modules.find((module) =>
        module.lessons.some(
          (lesson) => lesson.id === currentLessonId
        )
      )?.id,
    [modules, currentLessonId]
  );

  const [expandedModules, setExpandedModules] = useState(
    () => new Set(activeModuleId ? [activeModuleId] : [])
  );

  const totalLessons = useMemo(
    () =>
      modules.reduce(
        (total, module) => total + module.lessons.length,
        0
      ),
    [modules]
  );

  const allExpanded =
    modules.length > 0 &&
    modules.every((module) => expandedModules.has(module.id));

  const isDialogOpen = isMobileViewport && isMobileOpen;

  // Keep the current lesson's module expanded.
  useEffect(() => {
    if (!activeModuleId) return;

    setExpandedModules((previous) => {
      if (previous.has(activeModuleId)) return previous;

      const next = new Set(previous);
      next.add(activeModuleId);
      return next;
    });
  }, [activeModuleId]);

  // Detect mobile and tablet viewport changes.
  useEffect(() => {
    const media = window.matchMedia(MOBILE_BREAKPOINT);

    const updateViewport = () => {
      setIsMobileViewport(media.matches);
    };

    updateViewport();

    media.addEventListener("change", updateViewport);

    return () => {
      media.removeEventListener("change", updateViewport);
    };
  }, []);

  // Close the drawer when switching courses.
  useEffect(() => {
    setIsMobileOpen(false);
  }, [course?.slug]);

  // Close the mobile drawer when switching to desktop.
  useEffect(() => {
    if (!isMobileViewport) {
      setIsMobileOpen(false);
    }
  }, [isMobileViewport]);

  // Lock background scrolling while the drawer is open.
  useEffect(() => {
    if (!isDialogOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isDialogOpen]);

  // Trap focus and restore it after closing.
  useFocusTrap({
    active: isDialogOpen,
    containerRef: drawerRef,
    onEscape: closeDrawer,
    returnFocusRef: openButtonRef,
  });

  const toggleModule = (moduleId) => {
    setExpandedModules((previous) => {
      const next = new Set(previous);

      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }

      return next;
    });
  };

  const toggleAllModules = () => {
    if (allExpanded) {
      setExpandedModules(new Set());
      return;
    }

    setExpandedModules(
      new Set(modules.map((module) => module.id))
    );
  };

  const handleLessonClick = () => {
    closeDrawer();
  };

  if (!course) return null;

  return (
    <div
      className="behar-curriculum"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* MOBILE TRIGGER */}
      <button
        ref={openButtonRef}
        type="button"
        className="behar-curriculum__mobile-trigger"
        onClick={() => setIsMobileOpen(true)}
        aria-label={t.openCurriculum}
        aria-expanded={isDialogOpen}
        aria-controls={drawerId}
      >
        <span>
          <ListVideo
            size={19}
            strokeWidth={1.7}
            aria-hidden="true"
          />
          {t.openCurriculum}
        </span>

        <Menu
          size={19}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </button>

      {/* MOBILE BACKDROP */}
      {isDialogOpen && (
        <div
          className="behar-curriculum__backdrop"
          aria-hidden="true"
          onClick={closeDrawer}
        />
      )}

      {/* SIDEBAR / MOBILE DRAWER */}
      <aside
        id={drawerId}
        ref={drawerRef}
        className={`behar-curriculum__panel ${
          isDialogOpen
            ? "behar-curriculum__panel--open"
            : ""
        }`}
        role={isMobileViewport ? "dialog" : "complementary"}
        aria-modal={isDialogOpen ? "true" : undefined}
        aria-label={t.title}
        tabIndex={isDialogOpen ? -1 : undefined}
        inert={isMobileViewport && !isDialogOpen}
      >
        {/* HEADER */}
        <div className="behar-curriculum__header">
          <div className="behar-curriculum__header-top">
            <span className="behar-curriculum__eyebrow">
              <span />
              {t.eyebrow}
            </span>

            <button
              type="button"
              className="behar-curriculum__close"
              aria-label={t.closeCurriculum}
              onClick={closeDrawer}
            >
              <X
                size={19}
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </button>
          </div>

          <h2>{t.title}</h2>

          <div className="behar-curriculum__summary">
            <span>
              <BookOpen size={14} aria-hidden="true" />
              {formatNumber(modules.length, locale)}{" "}
              {t.modules}
            </span>

            <span>
              <ListVideo size={14} aria-hidden="true" />
              {formatNumber(totalLessons, locale)}{" "}
              {t.lessons}
            </span>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="behar-curriculum__toolbar">
          <span>BEHAR / CONTENT</span>

          <button
            type="button"
            onClick={toggleAllModules}
            disabled={modules.length === 0}
          >
            {allExpanded ? t.collapseAll : t.allModules}

            {allExpanded ? (
              <ChevronUp size={14} aria-hidden="true" />
            ) : (
              <ChevronDown size={14} aria-hidden="true" />
            )}
          </button>
        </div>

        {/* MODULES */}
        <div className="behar-curriculum__modules">
          {modules.length === 0 ? (
            <div className="behar-curriculum__empty">
              <BookOpen
                size={25}
                strokeWidth={1.3}
                aria-hidden="true"
              />
              <p>{t.noLessons}</p>
            </div>
          ) : (
            modules.map((module, moduleIndex) => {
              const isExpanded = expandedModules.has(module.id);
              const isActiveModule =
                activeModuleId === module.id;

              const modulePanelId = `${drawerId}-module-${moduleIndex}`;

              return (
                <section
                  key={module.id}
                  className={`behar-curriculum__module ${
                    isActiveModule
                      ? "behar-curriculum__module--active"
                      : ""
                  }`}
                >
                  {/* MODULE TOGGLE */}
                  <button
                    type="button"
                    className="behar-curriculum__module-toggle"
                    onClick={() => toggleModule(module.id)}
                    aria-expanded={isExpanded}
                    aria-controls={modulePanelId}
                    aria-label={`${
                      isExpanded
                        ? t.collapseModule
                        : t.expandModule
                    }: ${localized(module.title, locale)}`}
                  >
                    <span className="behar-curriculum__module-number">
                      {String(moduleIndex + 1).padStart(2, "0")}
                    </span>

                    <span className="behar-curriculum__module-info">
                      <strong>
                        {localized(module.title, locale)}
                      </strong>

                      <small>
                        {formatNumber(
                          module.lessons.length,
                          locale
                        )}{" "}
                        {t.lessons}
                      </small>
                    </span>

                    <ChevronDown
                      size={17}
                      aria-hidden="true"
                      className={`behar-curriculum__chevron ${
                        isExpanded
                          ? "behar-curriculum__chevron--open"
                          : ""
                      }`}
                    />
                  </button>

                  {/* MODULE LESSONS */}
                  {isExpanded && (
                    <div
                      id={modulePanelId}
                      className="behar-curriculum__lessons"
                    >
                      {module.lessons.map(
                        (lesson, lessonIndex) => {
                          const active =
                            lesson.id === currentLessonId;

                          const completed =
                            lesson.isCompleted === true;

                          const locked =
                            lesson.isLocked === true;

                          const lessonTitle = localized(
                            lesson.title,
                            locale
                          );

                          const lessonStatus = locked
                            ? t.locked
                            : active
                              ? t.current
                              : completed
                                ? t.completed
                                : "";

                          const content = (
                            <>
                              <span className="behar-curriculum__lesson-icon">
                                {completed ? (
                                  <Check
                                    size={15}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                  />
                                ) : locked ? (
                                  <LockKeyhole
                                    size={14}
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <LessonTypeIcon
                                    type={lesson.type}
                                  />
                                )}
                              </span>

                              <span className="behar-curriculum__lesson-info">
                                <strong>
                                  {lessonTitle}
                                </strong>

                                <small>
                                  {formatNumber(
                                    lesson.durationMinutes || 0,
                                    locale
                                  )}{" "}
                                  {t.minutes}
                                </small>
                              </span>

                              <span className="behar-curriculum__lesson-index">
                                {String(
                                  lessonIndex + 1
                                ).padStart(2, "0")}
                              </span>
                            </>
                          );

                          if (locked) {
                            return (
                              <div
                                key={lesson.id}
                                className="behar-curriculum__lesson behar-curriculum__lesson--locked"
                                aria-label={`${lessonTitle} — ${t.locked}`}
                              >
                                {content}
                              </div>
                            );
                          }

                          return (
                            <Link
                              key={lesson.id}
                              to={lessonPath(
                                course.slug,
                                lesson.id
                              )}
                              onClick={handleLessonClick}
                              aria-current={
                                active ? "page" : undefined
                              }
                              aria-label={
                                lessonStatus
                                  ? `${lessonTitle} — ${lessonStatus}`
                                  : lessonTitle
                              }
                              className={`behar-curriculum__lesson ${
                                active
                                  ? "behar-curriculum__lesson--active"
                                  : ""
                              } ${
                                completed
                                  ? "behar-curriculum__lesson--completed"
                                  : ""
                              }`}
                            >
                              {content}
                            </Link>
                          );
                        }
                      )}
                    </div>
                  )}
                </section>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="behar-curriculum__footer">
          <span>BEHAR EDUCATION</span>
          <span>LEARNING / 2026</span>
        </div>
      </aside>
    </div>
  );
}
