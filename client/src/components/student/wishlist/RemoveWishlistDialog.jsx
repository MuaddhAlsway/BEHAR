
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Heart, X } from "lucide-react";

import "../../../styles/student/wishlist/wishlist-remove-dialog.css";

const translations = {
  en: {
    eyebrow: "MANAGE YOUR COLLECTION",
    title: "Remove this course?",
    description:
      "This course will be removed from your wishlist. You can save it again anytime.",
    cancel: "Keep course",
    confirm: "Remove course",
    close: "Close dialog",
  },
  ar: {
    eyebrow: "إدارة مجموعتك",
    title: "إزالة هذه الدورة؟",
    description:
      "ستتم إزالة هذه الدورة من قائمة رغباتك. يمكنك حفظها مجددًا في أي وقت.",
    cancel: "الاحتفاظ بالدورة",
    confirm: "إزالة الدورة",
    close: "إغلاق النافذة",
  },
};

export default function WishlistRemoveDialog({
  open = false,
  courseTitle = "",
  language = "en",
  onCancel,
  onConfirm,
  busy = false,
}) {
  const lang = language === "ar" ? "ar" : "en";
  const t = translations[lang];

  const dialogRef = useRef(null);
  const cancelRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previousFocusRef.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    cancelRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (!busy) {
          event.preventDefault();
          onCancel?.();
        }
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        ) ?? []
      );

      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = previousOverflow;

      const previous = previousFocusRef.current;

      if (previous?.isConnected) {
        previous.focus();
      }
    };
  }, [open, busy, onCancel]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="wishlist-remove-dialog__backdrop"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !busy
        ) {
          onCancel?.();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="wishlist-remove-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="wishlist-remove-title"
        aria-describedby="wishlist-remove-description"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <button
          type="button"
          className="wishlist-remove-dialog__close"
          onClick={onCancel}
          disabled={busy}
          aria-label={t.close}
        >
          <X size={19} />
        </button>

        <div className="wishlist-remove-dialog__icon">
          <Heart size={26} fill="currentColor" />
        </div>

        <span className="wishlist-remove-dialog__eyebrow">
          {t.eyebrow}
        </span>

        <h2 id="wishlist-remove-title">
          {t.title}
        </h2>

        {courseTitle && (
          <p className="wishlist-remove-dialog__course">
            {courseTitle}
          </p>
        )}

        <p
          id="wishlist-remove-description"
          className="wishlist-remove-dialog__description"
        >
          {t.description}
        </p>

        <div className="wishlist-remove-dialog__notice">
          <AlertTriangle size={16} />
          <span>
            {lang === "ar"
              ? "لن يتم حذف الدورة من المنصة."
              : "The course will remain available in the catalog."}
          </span>
        </div>

        <div className="wishlist-remove-dialog__actions">
          <button
            ref={cancelRef}
            type="button"
            className="wishlist-remove-dialog__cancel"
            onClick={onCancel}
            disabled={busy}
          >
            {t.cancel}
          </button>

          <button
            type="button"
            className="wishlist-remove-dialog__confirm"
            onClick={onConfirm}
            disabled={busy}
          >
            <Heart size={16} />
            {t.confirm}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
