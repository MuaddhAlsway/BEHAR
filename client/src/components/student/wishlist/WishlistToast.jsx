
import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

import "../../../styles/student/wishlist/wishlist-toast.css";

export default function WishlistToast({
  toast,
  onDismiss,
  language = "en",
}) {
  useEffect(() => {
    if (!toast) return undefined;

    const timeout = window.setTimeout(() => {
      onDismiss?.();
    }, 4500);

    return () => window.clearTimeout(timeout);
  }, [toast, onDismiss]);

  if (!toast || typeof document === "undefined") {
    return null;
  }

  const isError = toast.type === "error";

  return createPortal(
    <div
      className={`wishlist-toast ${
        isError
          ? "wishlist-toast--error"
          : "wishlist-toast--success"
      }`}
      dir={language === "ar" ? "rtl" : "ltr"}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
    >
      <div className="wishlist-toast__icon">
        {isError ? (
          <AlertCircle size={21} />
        ) : (
          <CheckCircle2 size={21} />
        )}
      </div>

      <div className="wishlist-toast__content">
        <strong>{toast.title}</strong>
        {toast.description && (
          <p>{toast.description}</p>
        )}
      </div>

      <button
        type="button"
        className="wishlist-toast__close"
        onClick={onDismiss}
        aria-label={
          language === "ar"
            ? "إغلاق الإشعار"
            : "Dismiss notification"
        }
      >
        <X size={17} />
      </button>
    </div>,
    document.body
  );
}
