
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MessageSquarePlus, X } from "lucide-react";

import {
  discussionCourses,
  getDiscussionText,
} from "../../../data/discussions";

import {
  DISCUSSION_LIMITS,
  validateDiscussion,
} from "../../../utils/discussionValidation";

import "../../../styles/student/discussions/create-discussion-modal.css";

const initialValues = {
  courseId: "",
  title: "",
  body: "",
  tags: "",
};

const copy = {
  en: {
    eyebrow: "BEHAR COMMUNITY",
    title: "Start a discussion",
    subtitle:
      "Ask a thoughtful question and learn together with your community.",
    course: "Course",
    coursePlaceholder: "Select a course",
    titleLabel: "Discussion title",
    titlePlaceholder: "What would you like to discuss?",
    body: "Description",
    bodyPlaceholder:
      "Explain your question, what you've tried, and where you need help...",
    tags: "Tags",
    tagsPlaceholder: "React, Hooks, Performance",
    tagsHint: "Optional. Separate tags with commas. Maximum 5.",
    cancel: "Cancel",
    publish: "Publish discussion",
    close: "Close dialog",
    required: "Required",
  },
  ar: {
    eyebrow: "مجتمع بحار",
    title: "بدء مناقشة",
    subtitle:
      "اطرح سؤالًا مفيدًا وتعلم مع أفراد مجتمعك.",
    course: "الدورة",
    coursePlaceholder: "اختر الدورة",
    titleLabel: "عنوان المناقشة",
    titlePlaceholder: "ما الموضوع الذي ترغب في مناقشته؟",
    body: "الوصف",
    bodyPlaceholder:
      "اشرح سؤالك وما الذي جربته وأين تحتاج المساعدة...",
    tags: "الوسوم",
    tagsPlaceholder: "React, Hooks, Performance",
    tagsHint: "اختياري. افصل الوسوم بفواصل. الحد الأقصى 5.",
    cancel: "إلغاء",
    publish: "نشر المناقشة",
    close: "إغلاق النافذة",
    required: "مطلوب",
  },
};

export default function CreateDiscussionModal({
  open,
  onClose,
  onPublish,
  language = "en",
}) {
  const t = copy[language] ?? copy.en;
  const titleId = useId();
  const formId = useId();

  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);
  const previousFocusRef = useRef(null);

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    firstFieldRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
      previousFocusRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  function updateField(field, value) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const result = validateDiscussion(values, language);

    if (!result.valid) {
      setErrors(result.errors);

      const firstError = Object.keys(result.errors)[0];

      const field = document.getElementById(
        `${formId}-${firstError}`
      );

      field?.focus();
      return;
    }

    onPublish(result.normalized);
    setValues(initialValues);
    setErrors({});
    onClose();
  }

  return createPortal(
    <div
      className="behar-create-discussion-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        ref={dialogRef}
        className="behar-create-discussion-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <header className="behar-create-discussion-header">
          <div>
            <span>{t.eyebrow}</span>
            <h2 id={titleId}>{t.title}</h2>
            <p>{t.subtitle}</p>
          </div>

          <button
            type="button"
            className="behar-create-discussion-close"
            onClick={onClose}
            aria-label={t.close}
          >
            <X size={20} />
          </button>
        </header>

        <form
          className="behar-create-discussion-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="behar-create-discussion-field">
            <label htmlFor={`${formId}-courseId`}>
              {t.course} <span>*</span>
            </label>

            <select
              ref={firstFieldRef}
              id={`${formId}-courseId`}
              value={values.courseId}
              onChange={(event) =>
                updateField("courseId", event.target.value)
              }
              aria-invalid={Boolean(errors.courseId)}
              aria-describedby={
                errors.courseId
                  ? `${formId}-course-error`
                  : undefined
              }
            >
              <option value="">
                {t.coursePlaceholder}
              </option>

              {discussionCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {getDiscussionText(course.title, language)}
                </option>
              ))}
            </select>

            {errors.courseId && (
              <small
                id={`${formId}-course-error`}
                role="alert"
              >
                {errors.courseId}
              </small>
            )}
          </div>

          <div className="behar-create-discussion-field">
            <label htmlFor={`${formId}-title`}>
              {t.titleLabel} <span>*</span>
            </label>

            <input
              id={`${formId}-title`}
              type="text"
              value={values.title}
              maxLength={DISCUSSION_LIMITS.titleMax + 1}
              placeholder={t.titlePlaceholder}
              onChange={(event) =>
                updateField("title", event.target.value)
              }
              aria-invalid={Boolean(errors.title)}
              aria-describedby={
                errors.title
                  ? `${formId}-title-error`
                  : undefined
              }
            />

            <div className="behar-create-discussion-field-meta">
              {errors.title ? (
                <small
                  id={`${formId}-title-error`}
                  role="alert"
                >
                  {errors.title}
                </small>
              ) : (
                <span />
              )}

              <span>
                {values.title.length}/
                {DISCUSSION_LIMITS.titleMax}
              </span>
            </div>
          </div>

          <div className="behar-create-discussion-field">
            <label htmlFor={`${formId}-body`}>
              {t.body} <span>*</span>
            </label>

            <textarea
              id={`${formId}-body`}
              rows={7}
              value={values.body}
              maxLength={DISCUSSION_LIMITS.bodyMax + 1}
              placeholder={t.bodyPlaceholder}
              onChange={(event) =>
                updateField("body", event.target.value)
              }
              aria-invalid={Boolean(errors.body)}
              aria-describedby={
                errors.body
                  ? `${formId}-body-error`
                  : undefined
              }
            />

            <div className="behar-create-discussion-field-meta">
              {errors.body ? (
                <small
                  id={`${formId}-body-error`}
                  role="alert"
                >
                  {errors.body}
                </small>
              ) : (
                <span />
              )}

              <span>
                {values.body.length}/
                {DISCUSSION_LIMITS.bodyMax}
              </span>
            </div>
          </div>

          <div className="behar-create-discussion-field">
            <label htmlFor={`${formId}-tags`}>
              {t.tags}
            </label>

            <input
              id={`${formId}-tags`}
              type="text"
              value={values.tags}
              placeholder={t.tagsPlaceholder}
              onChange={(event) =>
                updateField("tags", event.target.value)
              }
              aria-invalid={Boolean(errors.tags)}
              aria-describedby={
                errors.tags
                  ? `${formId}-tags-error`
                  : `${formId}-tags-hint`
              }
            />

            {errors.tags ? (
              <small
                id={`${formId}-tags-error`}
                role="alert"
              >
                {errors.tags}
              </small>
            ) : (
              <small
                id={`${formId}-tags-hint`}
                className="behar-create-discussion-hint"
              >
                {t.tagsHint}
              </small>
            )}
          </div>

          <footer className="behar-create-discussion-actions">
            <button
              type="button"
              className="behar-create-discussion-cancel"
              onClick={onClose}
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              className="behar-create-discussion-publish"
            >
              <MessageSquarePlus
                size={17}
                aria-hidden="true"
              />
              {t.publish}
            </button>
          </footer>
        </form>
      </section>
    </div>,
    document.body
  );
}
