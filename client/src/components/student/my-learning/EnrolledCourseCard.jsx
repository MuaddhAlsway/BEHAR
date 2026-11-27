
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  CirclePlay,
  Clock3,
  GraduationCap,
  Play,
  Pencil,
  Trash2,
  PenLine,
} from "lucide-react";

import "../../../styles/student/my-learning/enrolled-course-card.css";
import { useReviews } from "../../../hooks/useReviews";
import ReviewDeleteDialog from "../../reviews/ReviewDeleteDialog";
import ReviewModal from "../../reviews/ReviewModal";

const translations = {
  en: {
    in_progress: "In progress",
    completed: "Completed",
    not_started: "Not started",
    lessons: "lessons",
    of: "of",
    hours: "hours",
    progress: "Course progress",
    instructor: "Instructor",
    continue: "Continue learning",
    start: "Start learning",
    review: "Review course",
    details: "View course details",
    imageFallback: "Course artwork",
  },

  ar: {
    in_progress: "قيد التقدم",
    completed: "مكتملة",
    not_started: "لم تبدأ",
    lessons: "دروس",
    of: "من",
    hours: "ساعة",
    progress: "تقدم الدورة",
    instructor: "المدرب",
    continue: "متابعة التعلّم",
    start: "ابدأ التعلّم",
    review: "مراجعة الدورة",
    details: "عرض تفاصيل الدورة",
    imageFallback: "صورة الدورة",
  },
};

function formatNumber(value, language) {
  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US"
  ).format(value);
}

function getStatusIcon(status) {
  if (status === "completed") return CheckCircle2;
  if (status === "not_started") return GraduationCap;
  return CirclePlay;
}

export default function EnrolledCourseCard({
  course,
  language = "en",
  onOpenCourse,
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { getStudentReview, addReview, updateReview, deleteReview, currentStudentId } = useReviews();

  if (!course) return null;

  const locale = language === "ar" ? "ar" : "en";
  const t = translations[locale];

  const title =
    course.title?.[locale] ||
    course.title?.en ||
    "Untitled course";

  const category =
    course.category?.[locale] ||
    course.category?.en ||
    "";

  const status = course.status || "not_started";
  const StatusIcon = getStatusIcon(status);

  const completedLessons = Math.max(
    0,
    Number(course.completedLessons) || 0
  );

  const totalLessons = Math.max(
    0,
    Number(course.totalLessons) || 0
  );

  const progress = Math.max(
    0,
    Math.min(100, Number(course.progress) || 0)
  );

  const durationHours = Math.max(
    0,
    Number(course.durationHours) || 0
  );

  const instructorName =
    course.instructor?.name || "";

  const detailsPath = `/courses/${encodeURIComponent(
    course.slug
  )}`;

  const actionLabel =
    status === "completed"
      ? t.review
      : status === "not_started"
        ? t.start
        : t.continue;

  const handleOpen = () => {
    onOpenCourse?.(course);
  };

  const hasLearningAction =
    typeof onOpenCourse === "function";
  const courseId = course.courseId || course.id;
  const studentReview = getStudentReview(courseId, currentStudentId);

  const saveReview = (payload) => {
    const result = studentReview
      ? updateReview(studentReview.id, payload)
      : addReview({ ...payload, courseId });
    if (result.success) setReviewOpen(false);
  };

  return (
    <article
      className={`behar-enrolled-card behar-enrolled-card--${status}`}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* COURSE IMAGE */}
      <div className="behar-enrolled-card__media">
        {!imageFailed && course.image ? (
          <img
            src={course.image}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="behar-enrolled-card__media-fallback"
            aria-label={t.imageFallback}
          >
            <BookOpen
              size={44}
              strokeWidth={1.1}
              aria-hidden="true"
            />
            <span>BEHAR / EDUCATION</span>
          </div>
        )}

        <span className="behar-enrolled-card__media-index">
          BEHAR / LEARNING
        </span>

        <span className="behar-enrolled-card__status">
          <StatusIcon
            size={13}
            strokeWidth={1.8}
            aria-hidden="true"
          />
          {t[status] || t.not_started}
        </span>
      </div>

      {/* CARD CONTENT */}
      <div className="behar-enrolled-card__content">
        <div className="behar-enrolled-card__category">
          <span className="behar-enrolled-card__category-dot" />
          {category}
        </div>

        <h3 className="behar-enrolled-card__title">
          <Link to={detailsPath}>
            {title}
          </Link>
        </h3>

        <div className="behar-enrolled-card__instructor">
          <div className="behar-enrolled-card__avatar">
            {instructorName
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase()}
          </div>

          <div className="behar-enrolled-card__instructor-copy">
            <span>{t.instructor}</span>
            <strong>{instructorName}</strong>
          </div>
        </div>

        <div className="behar-enrolled-card__meta">
          <span>
            <BookOpen
              size={15}
              strokeWidth={1.6}
              aria-hidden="true"
            />
            {formatNumber(totalLessons, locale)}{" "}
            {t.lessons}
          </span>

          <span>
            <Clock3
              size={15}
              strokeWidth={1.6}
              aria-hidden="true"
            />
            {formatNumber(durationHours, locale)}{" "}
            {t.hours}
          </span>
        </div>

        {/* PROGRESS */}
        <div className="behar-enrolled-card__progress">
          <div className="behar-enrolled-card__progress-top">
            <span>{t.progress}</span>

            <strong>
              {formatNumber(progress, locale)}%
            </strong>
          </div>

          <div
            className="behar-enrolled-card__progress-track"
            role="progressbar"
            aria-label={`${title} — ${t.progress}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <span
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="behar-enrolled-card__lesson-count">
            {formatNumber(completedLessons, locale)}{" "}
            {t.of}{" "}
            {formatNumber(totalLessons, locale)}{" "}
            {t.lessons}
          </span>
        </div>

        {/* ACTION */}
        {hasLearningAction ? (
          <button
            type="button"
            className="behar-enrolled-card__action"
            onClick={handleOpen}
          >
            <span className="behar-enrolled-card__action-copy">
              {status === "completed" ? (
                <CheckCircle2
                  size={17}
                  strokeWidth={1.7}
                />
              ) : (
                <Play
                  size={16}
                  strokeWidth={1.8}
                />
              )}

              {actionLabel}
            </span>

            <ArrowUpRight
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>
        ) : (
          <Link
            to={detailsPath}
            className="behar-enrolled-card__action"
          >
            <span className="behar-enrolled-card__action-copy">
              <BookOpen
                size={17}
                strokeWidth={1.7}
                aria-hidden="true"
              />
              {t.details}
            </span>

            <ArrowUpRight
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </Link>
        )}

        <div className="behar-enrolled-card__review-tools">
          <button type="button" onClick={(event) => { event.stopPropagation(); setReviewOpen((open) => !open); }}>
            {studentReview ? <><Pencil size={14} /> Edit review</> : <><PenLine size={14} /> Write a review</>}
          </button>
          {studentReview && <button type="button" onClick={(event) => { event.stopPropagation(); setDeleteOpen(true); }}><Trash2 size={14} /> Delete review</button>}
          {studentReview && <span aria-label={`Your rating: ${studentReview.rating} out of 5`}>{"★".repeat(studentReview.rating)}</span>}
        </div>
        <ReviewModal open={reviewOpen} course={course} review={studentReview} language={locale} onSubmit={saveReview} onClose={() => setReviewOpen(false)} />
        <ReviewDeleteDialog open={deleteOpen} onCancel={() => setDeleteOpen(false)} onConfirm={() => { deleteReview(studentReview.id); setDeleteOpen(false); }} />
      </div>
    </article>
  );
}
