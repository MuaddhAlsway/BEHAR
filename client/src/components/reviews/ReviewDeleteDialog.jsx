import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, X } from "lucide-react";
import useFocusTrap from "../../hooks/useFocusTrap";
import "../../styles/reviews/review-delete-dialog.css";

export default function ReviewDeleteDialog({ open, onCancel, onConfirm }) {
  const dialogRef = useRef(null);
  useFocusTrap({ active: open, containerRef: dialogRef, onEscape: onCancel });
  useEffect(() => { if (!open) return undefined; const previous = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = previous; }; }, [open]);
  if (!open || typeof document === "undefined") return null;
  return createPortal(<div className="review-delete-dialog__backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}><section ref={dialogRef} className="review-delete-dialog" role="dialog" aria-modal="true" aria-labelledby="review-delete-title" tabIndex="-1"><button type="button" className="review-delete-dialog__close" onClick={onCancel} aria-label="Close delete dialog"><X size={18} /></button><div className="review-delete-dialog__icon"><AlertTriangle size={25} /></div><span className="review-delete-dialog__eyebrow">BEHAR / REVIEW MANAGEMENT</span><h2 id="review-delete-title">Delete this review?</h2><p>This action cannot be undone. Your rating and written feedback will be removed.</p><div className="review-delete-dialog__actions"><button type="button" onClick={onCancel}>Cancel</button><button type="button" onClick={onConfirm}>Delete review</button></div></section></div>, document.body);
}
