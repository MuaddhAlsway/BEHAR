import { courseReviews as seededReviews } from "./courseReviews";

export const REVIEWS_STORAGE_KEY = "behar:reviews:v1";
export const REVIEW_STATUSES = ["published", "pending", "hidden", "rejected"];
export const CURRENT_STUDENT_ID = "student_001";

function localized(value) {
  return typeof value === "object" && value
    ? value.en || value.ar || ""
    : String(value || "");
}

export function createSeedReviews() {
  return Object.entries(seededReviews).flatMap(([slug, reviews]) =>
    reviews.map((review, index) => ({
      ...review,
      id: review.id || `seed-review-${slug}-${index}`,
      courseSlug: slug,
      courseId: slug,
      studentId: `demo-student-${review.id}`,
      title: review.title,
      comment: review.content,
      status: "published",
      createdAt: `${review.date}T12:00:00.000Z`,
      updatedAt: `${review.date}T12:00:00.000Z`,
      instructorReply: review.instructorReply || null,
      studentName: review.student,
    }))
  );
}

export function normalizeReview(value) {
  if (!value || typeof value !== "object") return null;
  const rating = Number(value.rating);
  if (!value.id || !value.courseId || !value.studentId || rating < 1 || rating > 5) return null;
  return {
    ...value,
    rating: Math.round(rating),
    title: value.title || "",
    comment: value.comment || value.content || "",
    status: REVIEW_STATUSES.includes(value.status) ? value.status : "pending",
    createdAt: value.createdAt || new Date().toISOString(),
    updatedAt: value.updatedAt || value.createdAt || new Date().toISOString(),
  };
}

export function getReviewText(value, language = "en") {
  if (typeof value === "string") return value;
  return value?.[language] || value?.en || value?.ar || "";
}
