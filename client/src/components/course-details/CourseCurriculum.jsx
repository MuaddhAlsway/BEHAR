
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowUpLeft,
  ArrowRight,
  ArrowLeft,
  Play,
  FileText,
  ClipboardCheck,
  LockKeyhole,
  ChevronDown,
  Clock3,
  BookOpen,
  Asterisk,
  Check,
  Layers3,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  getCourseCurriculum,
  getCurriculumStats,
} from "../../data/courseCurriculum";

import "../../styles/course-details/course-curriculum.css";

gsap.registerPlugin(ScrollTrigger);

const copy = {
  en: {
    index: "P13.3 / THE CURRICULUM INDEX",
    eyebrow: "YOUR LEARNING JOURNEY",
    heading: ["THE PATH", "TO MASTERY."],
    chapters: "CHAPTERS",
    lessons: "LESSONS",
    duration: "LEARNING MINUTES",
    overview: "A JOURNEY BUILT WITH PURPOSE",
    syllabus: "THE COMPLETE SYLLABUS",
    chapter: "CHAPTER",
    lesson: "LESSONS",
    minutes: "MIN",
    preview: "FREE PREVIEW",
    locked: "ENROLL TO ACCESS",
    expand: "EXPAND ALL",
    collapse: "COLLAPSE ALL",
    video: "VIDEO LESSON",
    quiz: "KNOWLEDGE CHECK",
    assignment: "PRACTICAL ASSIGNMENT",
    empty: "The curriculum for this course is coming soon.",
    footer: "EVERY LESSON IS A STEP FORWARD.",
  },
  ar: {
    index: "P13.3 / فهرس المنهج",
    eyebrow: "رحلتك التعليمية",
    heading: ["طريقك", "نحو الإتقان."],
    chapters: "الفصول",
    lessons: "الدروس",
    duration: "دقائق التعلم",
    overview: "رحلة تعليمية هادفة",
    syllabus: "المنهج الكامل",
    chapter: "الفصل",
    lesson: "دروس",
    minutes: "دقيقة",
    preview: "معاينة مجانية",
    locked: "سجّل للوصول",
    expand: "توسيع الكل",
    collapse: "طي الكل",
    video: "درس فيديو",
    quiz: "اختبار معرفي",
    assignment: "واجب عملي",
    empty: "سيتم إضافة منهج هذه الدورة قريبًا.",
    footer: "كل درس خطوة نحو الأمام.",
  },
};

function getLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

function localize(value, language) {
  if (typeof value === "string") return value;
  return value?.[language] || value?.en || "";
}

function formatDuration(minutes, language) {
  if (minutes < 60) {
    return `${minutes} ${copy[language].minutes}`;
  }

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (language === "ar") {
    return remaining
      ? `${hours} س ${remaining} د`
      : `${hours} ساعة`;
  }

  return remaining
    ? `${hours}H ${remaining}M`
    : `${hours}H`;
}

function LessonIcon({ type }) {
  switch (type) {
    case "quiz":
      return <ClipboardCheck size={19} strokeWidth={1.5} />;
    case "assignment":
      return <FileText size={19} strokeWidth={1.5} />;
    default:
      return <Play size={18} strokeWidth={1.5} />;
  }
}

export default function CourseCurriculum({
  course,
  onPreviewLesson,
}) {
  const rootRef = useRef(null);
  const [language, setLanguage] = useState(getLanguage);

  const curriculum = getCourseCurriculum(course.slug);
  const chapters = curriculum.chapters || [];
  const stats = getCurriculumStats(chapters);

  const [expandedChapters, setExpandedChapters] = useState(
    () => new Set(chapters[0] ? [chapters[0].id] : [])
  );

  const isArabic = language === "ar";
  const t = copy[language];
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;

  const allExpanded =
    chapters.length > 0 &&
    expandedChapters.size === chapters.length;

  useEffect(() => {
    const sync = () => setLanguage(getLanguage());
    sync();

    const observer = new MutationObserver(sync);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setExpandedChapters(
      new Set(chapters[0] ? [chapters[0].id] : [])
    );
  }, [course.slug]);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".behar-curriculum__heading-line > span",
        { yPercent: 110, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".behar-curriculum__intro",
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".behar-curriculum__chapter",
        { y: 35, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-curriculum__chapters",
            start: "top 85%",
            once: true,
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [course.slug, language]);

  const toggleChapter = (chapterId) => {
    setExpandedChapters((previous) => {
      const next = new Set(previous);

      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }

      return next;
    });
  };

  const toggleAll = () => {
    setExpandedChapters(
      allExpanded
        ? new Set()
        : new Set(chapters.map((chapter) => chapter.id))
    );
  };

  return (
    <section
      ref={rootRef}
      id="course-curriculum"
      className="behar-curriculum"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-curriculum-heading"
    >
      <div className="behar-curriculum__container">
        {/* TOPLINE */}
        <div className="behar-curriculum__topline">
          <span>{t.index}</span>
          <Asterisk size={20} strokeWidth={1.4} />
        </div>

        {/* INTRO */}
        <header className="behar-curriculum__intro">
          <div className="behar-curriculum__eyebrow">
            <span className="behar-curriculum__dot" />
            {t.eyebrow}
          </div>

          <h2
            id="behar-curriculum-heading"
            className="behar-curriculum__heading"
          >
            {t.heading.map((line, index) => (
              <span
                key={index}
                className={`behar-curriculum__heading-line ${
                  index === 1
                    ? "behar-curriculum__heading-line--accent"
                    : ""
                }`}
              >
                <span>{line}</span>
              </span>
            ))}
          </h2>

          <div className="behar-curriculum__intro-bottom">
            <div>
              <span className="behar-curriculum__intro-label">
                {t.overview}
              </span>

              <p>
                {localize(curriculum.overview, language)}
              </p>
            </div>

            <div className="behar-curriculum__intro-symbol">
              <Layers3 size={35} strokeWidth={1} />
            </div>
          </div>
        </header>

        {/* STATS */}
        <div className="behar-curriculum__stats">
          <div>
            <strong>{String(stats.chapters).padStart(2, "0")}</strong>
            <span>{t.chapters}</span>
          </div>

          <div>
            <strong>{String(stats.lessons).padStart(2, "0")}</strong>
            <span>{t.lessons}</span>
          </div>

          <div>
            <strong>{stats.totalMinutes}</strong>
            <span>{t.duration}</span>
          </div>
        </div>

        {/* SYLLABUS HEADER */}
        <div className="behar-curriculum__syllabus-header">
          <span>{t.syllabus}</span>

          {chapters.length > 0 && (
            <button type="button" onClick={toggleAll}>
              {allExpanded ? t.collapse : t.expand}
              <ChevronDown
                size={17}
                className={allExpanded ? "is-rotated" : ""}
              />
            </button>
          )}
        </div>

        {/* CHAPTERS */}
        <div className="behar-curriculum__chapters">
          {chapters.length === 0 ? (
            <div className="behar-curriculum__empty">
              <BookOpen size={34} strokeWidth={1.2} />
              <p>{t.empty}</p>
            </div>
          ) : (
            chapters.map((chapter, index) => {
              const isOpen = expandedChapters.has(chapter.id);

              const chapterMinutes = chapter.lessons.reduce(
                (total, lesson) =>
                  total + (lesson.duration || 0),
                0
              );

              return (
                <article
                  key={chapter.id}
                  className={`behar-curriculum__chapter ${
                    isOpen ? "is-open" : ""
                  }`}
                >
                  <h3 className="behar-curriculum__chapter-heading">
                    <button
                      type="button"
                      className="behar-curriculum__chapter-trigger"
                      onClick={() => toggleChapter(chapter.id)}
                      aria-expanded={isOpen}
                      aria-controls={`chapter-panel-${chapter.id}`}
                    >
                      <span className="behar-curriculum__chapter-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="behar-curriculum__chapter-main">
                        <span className="behar-curriculum__chapter-label">
                          {t.chapter} {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="behar-curriculum__chapter-title">
                          {localize(chapter.title, language)}
                        </span>

                        <span className="behar-curriculum__chapter-description">
                          {localize(chapter.description, language)}
                        </span>
                      </span>

                      <span className="behar-curriculum__chapter-meta">
                        <span>
                          {chapter.lessons.length} {t.lesson}
                        </span>
                        <span>
                          {formatDuration(chapterMinutes, language)}
                        </span>
                      </span>

                      <span className="behar-curriculum__chapter-chevron">
                        <ChevronDown
                          size={25}
                          strokeWidth={1.4}
                        />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`chapter-panel-${chapter.id}`}
                    className="behar-curriculum__chapter-panel"
                    hidden={!isOpen}
                  >
                    <div className="behar-curriculum__lesson-list">
                      {chapter.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="behar-curriculum__lesson"
                        >
                          <span className="behar-curriculum__lesson-number">
                            {String(lessonIndex + 1).padStart(2, "0")}
                          </span>

                          <span className="behar-curriculum__lesson-icon">
                            <LessonIcon type={lesson.type} />
                          </span>

                          <div className="behar-curriculum__lesson-content">
                            <span className="behar-curriculum__lesson-type">
                              {t[lesson.type] || t.video}
                            </span>

                            <strong>
                              {localize(lesson.title, language)}
                            </strong>
                          </div>

                          <div className="behar-curriculum__lesson-right">
                            <span className="behar-curriculum__lesson-duration">
                              <Clock3 size={14} />
                              {lesson.duration} {t.minutes}
                            </span>

                            {lesson.preview ? (
                              <button
                                type="button"
                                className="behar-curriculum__preview"
                                onClick={() =>
                                  onPreviewLesson?.(lesson, course)
                                }
                              >
                                <Play size={14} fill="currentColor" />
                                {t.preview}
                              </button>
                            ) : (
                              <span className="behar-curriculum__locked">
                                <LockKeyhole size={14} />
                                {t.locked}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* BOTTOMLINE */}
        <div className="behar-curriculum__bottomline">
          <span>{t.footer}</span>
          <span>03 — 07</span>
        </div>
      </div>
    </section>
  );
}
