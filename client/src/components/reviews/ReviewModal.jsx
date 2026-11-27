import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import useFocusTrap from "../../hooks/useFocusTrap";
import ReviewForm from "./ReviewForm";
import "../../styles/reviews/review-modal.css";

export default function ReviewModal({ open, course, review, language = "en", onSubmit, onClose }) {
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  useFocusTrap({ active: open, containerRef: dialogRef, onEscape: onClose, returnFocusRef: triggerRef });
  useEffect(() => { if (!open) return undefined; const previous = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = previous; }; }, [open]);
  if (!open || !course || typeof document === "undefined") return null;
  const title = course.title?.[language] || course.title?.en || "Course review";
  const image = course.image || course.thumbnail;
  return createPortal(<div className="review-modal__backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialogRef} className="review-modal" role="dialog" aria-modal="true" aria-labelledby="review-modal-title" dir={language === "ar" ? "rtl" : "ltr"}>
      <header className="review-modal__identity">{image ? <img src={image} alt="" /> : <span className="review-modal__placeholder">BEHAR</span>}<div><span>BEHAR / COURSE REVIEW</span><h2 id="review-modal-title">{title}</h2><small>{course.instructor?.name || course.instructor || ""}</small></div><button type="button" onClick={onClose} aria-label="Close review"><X size={20} /></button></header>
      <div className="review-modal__body"><h3>How was your learning experience?</h3><ReviewForm key={`${course.courseId || course.id}-${review?.id || "new"}`} initialReview={review} courseTitle={title} instructor={course.instructor?.name || course.instructor} onSubmit={onSubmit} onCancel={onClose} /></div>
    </section>
  </div>, document.body);
}
