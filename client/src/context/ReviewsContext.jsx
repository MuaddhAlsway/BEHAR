import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { courses } from "../data/courses";
import { CURRENT_STUDENT_ID, createSeedReviews, normalizeReview } from "../data/reviews";
import { readReviews, writeReviews } from "../utils/reviewsStorage";

export const ReviewsContext = createContext(null);

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(createSeedReviews);

  useEffect(() => {
    const stored = readReviews();
    if (stored.items) setReviews([...createSeedReviews(), ...stored.items.filter((item) => !item.id.startsWith("seed-review-"))]);
    const sync = (event) => { if (event.key === "behar:reviews:v1") { const next = readReviews(); if (next.items) setReviews([...createSeedReviews(), ...next.items]); } };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const persist = useCallback((next) => { setReviews(next); writeReviews(next.filter((item) => !item.id.startsWith("react-review-") && !item.id.startsWith("design-review-") && !item.id.startsWith("ai-review-"))); return next; }, []);
  const getCourseReviews = useCallback((courseId) => reviews.filter((review) => (review.courseId === courseId || review.courseSlug === courseId) && review.status === "published"), [reviews]);
  const getStudentReview = useCallback((courseId, studentId = CURRENT_STUDENT_ID) => reviews.find((review) => review.courseId === courseId && review.studentId === studentId), [reviews]);
  const addReview = useCallback((payload) => { const existing = reviews.find((item) => item.courseId === payload.courseId && item.studentId === (payload.studentId || CURRENT_STUDENT_ID)); if (existing) return { success: false, error: "You already reviewed this course." }; const item = normalizeReview({ ...payload, id: `review-${Date.now()}`, studentId: payload.studentId || CURRENT_STUDENT_ID, status: "published", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); if (!item) return { success: false, error: "Please provide a valid rating and review." }; persist([...reviews, item]); return { success: true, review: item }; }, [reviews, persist]);
  const updateReview = useCallback((id, payload) => { const current = reviews.find((item) => item.id === id); if (!current || current.studentId !== CURRENT_STUDENT_ID) return { success: false, error: "You cannot edit this review." }; const next = reviews.map((item) => item.id === id ? { ...item, ...payload, updatedAt: new Date().toISOString() } : item); persist(next); return { success: true }; }, [reviews, persist]);
  const deleteReview = useCallback((id) => { const current = reviews.find((item) => item.id === id); if (!current || current.studentId !== CURRENT_STUDENT_ID) return { success: false, error: "You cannot delete this review." }; persist(reviews.filter((item) => item.id !== id)); return { success: true }; }, [reviews, persist]);
  const getCourseRatingSummary = useCallback((courseId) => { const published = getCourseReviews(courseId); const distribution = [5, 4, 3, 2, 1].map((stars) => { const count = published.filter((item) => item.rating === stars).length; return { stars, count, percentage: published.length ? count / published.length * 100 : 0 }; }); return { total: published.length, average: published.length ? published.reduce((sum, item) => sum + item.rating, 0) / published.length : 0, distribution }; }, [getCourseReviews]);
  const addInstructorReply = useCallback((id, reply) => { persist(reviews.map((item) => item.id === id ? { ...item, instructorReply: { ...reply, createdAt: new Date().toISOString() } } : item)); return { success: true }; }, [reviews, persist]);
  const moderateReview = useCallback((id, status) => { persist(reviews.map((item) => item.id === id ? { ...item, status } : item)); return { success: true }; }, [reviews, persist]);
  const value = useMemo(() => ({ reviews, courses, currentStudentId: CURRENT_STUDENT_ID, getCourseReviews, getStudentReview, addReview, updateReview, deleteReview, getCourseRatingSummary, addInstructorReply, moderateReview }), [reviews, getCourseReviews, getStudentReview, addReview, updateReview, deleteReview, getCourseRatingSummary, addInstructorReply, moderateReview]);
  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}
