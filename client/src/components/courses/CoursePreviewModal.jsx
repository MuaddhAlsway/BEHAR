import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

import useFocusTrap from "../../hooks/useFocusTrap";
import LessonVideoPlayer from "../student/learning-player/LessonVideoPlayer";
import "../../styles/course-details/course-preview-modal.css";

function getLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

function localize(value, language) {
  if (typeof value === "string") return value;
  return value?.[language] || value?.en || value?.ar || "Lesson preview";
}

export default function CoursePreviewModal({
  lesson,
  course,
  isOpen,
  onClose,
  onEnroll,
}) {
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);
  const [language, setLanguage] = useState(getLanguage);

  const isArabic = language === "ar";
  const title = localize(lesson?.title, language);
  const courseTitle = localize(course?.title, language);
  const description = localize(course?.description, language);
  const videoLesson = lesson
    ? {
        ...lesson,
        videoUrl: lesson.videoUrl || lesson.video?.url || "/Video.mp4",
      }
    : lesson;

  useEffect(() => {
    const syncLanguage = () => setLanguage(getLanguage());
    window.addEventListener("languagechange", syncLanguage);
    window.addEventListener("storage", syncLanguage);
    return () => {
      window.removeEventListener("languagechange", syncLanguage);
      window.removeEventListener("storage", syncLanguage);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    returnFocusRef.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, lesson]);

  useFocusTrap({
    active: isOpen,
    containerRef: dialogRef,
    onEscape: onClose,
    returnFocusRef,
  });

  if (!isOpen || !lesson || lesson.preview !== true) return null;

  return (
    <div
      className="behar-course-preview"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      role="presentation"
    >
      <button
        type="button"
        className="behar-course-preview__backdrop"
        aria-label={isArabic ? "إغلاق المعاينة" : "Close preview"}
        onClick={onClose}
      />

      <section
        ref={dialogRef}
        className="behar-course-preview__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="behar-course-preview-title"
      >
        <button
          type="button"
          className="behar-course-preview__close"
          onClick={onClose}
          aria-label={isArabic ? "إغلاق المعاينة" : "Close preview"}
        >
          <X size={20} />
        </button>

        <div className="behar-course-preview__header">
          <span className="behar-course-preview__eyebrow">
            {isArabic ? "معاينة مجانية" : "FREE PREVIEW"}
          </span>
          <span className="behar-course-preview__course">{courseTitle}</span>
          <h2 id="behar-course-preview-title">{title}</h2>
        </div>

        <div className="behar-course-preview__video-wrap">
          <LessonVideoPlayer
            lesson={videoLesson}
            language={language}
            mode="preview"
            autoPlay
          />
        </div>

        <div className="behar-course-preview__footer">
          <p>{description}</p>
          <div className="behar-course-preview__actions">
            <Link
              className="behar-course-preview__course-link"
              to={`/courses/${course?.slug || ""}`}
              onClick={onClose}
            >
              {isArabic ? "تفاصيل الدورة" : "Course details"}
            </Link>
            <button
              type="button"
              className="behar-course-preview__enroll"
              onClick={() => onEnroll?.(course)}
            >
              {isArabic ? "سجّل الآن" : "Enroll now"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
