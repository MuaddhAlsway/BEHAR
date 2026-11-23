
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ArrowUpLeft, ArrowUpRight, X } from "lucide-react";
import gsap from "gsap";

export default function StudentStoryModal({
  story,
  language,
  copy,
  onClose,
}) {
  const backdropRef = useRef(null);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const openerRef = useRef(null);
  const closingRef = useRef(false);
  const onCloseRef = useRef(onClose);
  const [isClosing, setIsClosing] = useState(false);

  const isArabic = language === "ar";
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    openerRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const backdrop = backdropRef.current;
    const dialog = dialogRef.current;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.fromTo(
          backdrop,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.3 }
        );

        gsap.fromTo(
          dialog,
          { autoAlpha: 0, y: 55, scale: 0.97 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            ease: "power3.out",
          }
        );
      }
    });

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialog.querySelectorAll(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.getClientRects().length);

      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }

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
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      ctx.revert();

      if (openerRef.current?.isConnected) {
        openerRef.current.focus();
      }
    };
    // Modal lifecycle is intentionally tied to mount/unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function requestClose() {
    if (closingRef.current) return;
    closingRef.current = true;
    setIsClosing(true);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) {
      onCloseRef.current();
      return;
    }

    gsap.timeline({
      onComplete: () => onCloseRef.current(),
    })
      .to(dialogRef.current, {
        y: 35,
        scale: 0.98,
        autoAlpha: 0,
        duration: 0.25,
        ease: "power2.in",
      })
      .to(
        backdropRef.current,
        { autoAlpha: 0, duration: 0.2 },
        "<"
      );
  }

  return createPortal(
    <div
      ref={backdropRef}
      className="behar-story-modal"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="behar-story-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="behar-story-modal-title"
        tabIndex={-1}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="behar-story-modal__close"
          onClick={requestClose}
          disabled={isClosing}
          aria-label={copy.close}
        >
          <X size={22} />
        </button>

        <div className="behar-story-modal__image">
          <img
            src={story.image}
            alt={story.name}
            style={{ objectPosition: story.position }}
          />
          <span>BEHAR / LEARNER JOURNAL</span>
        </div>

        <div className="behar-story-modal__content">
          <span className="behar-story-modal__eyebrow">
            ✳ {copy.journey}
          </span>

          <h2 id="behar-story-modal-title">
            {story.name}
          </h2>

          <span className="behar-story-modal__field">
            {story.field[language]}
          </span>

          <blockquote>
            “{story.quote[language]}”
          </blockquote>

          <div className="behar-story-modal__body">
            <span>{copy.about}</span>
            <p>{story.story[language]}</p>
          </div>

          <div className="behar-story-modal__chapters">
            <div>
              <span>01 / {copy.before}</span>
              <p>{story.before[language]}</p>
            </div>
            <div>
              <span>02 / {copy.after}</span>
              <p>{story.after[language]}</p>
            </div>
          </div>

          <Link
            to={`/courses/${story.course.slug}`}
            className="behar-story-modal__cta"
            onClick={onClose}
          >
            <span>
              <small>{copy.course}</small>
              <strong>{story.course.title[language]}</strong>
            </span>
            <Arrow size={21} />
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
