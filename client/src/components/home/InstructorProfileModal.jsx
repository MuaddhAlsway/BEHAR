
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  X,
  ArrowUpRight,
  ArrowUpLeft,
  BookOpen,
  Star,
  Clock3,
  Code2,
  Palette,
  BriefcaseBusiness,
  BrainCircuit,
  Camera,
  GraduationCap,
} from "lucide-react";
import gsap from "gsap";

const facultyIconMap = {
  development: Code2,
  design: Palette,
  technology: BrainCircuit,
  business: BriefcaseBusiness,
  creative: Camera,
};

const copy = {
  en: {
    eyebrow: "BEHAR / THE FACULTY",
    about: "Meet your instructor",
    experience: "Years of experience",
    learners: "Learners",
    rating: "Rating",
    courses: "Explore their courses",
    view: "View course",
    close: "Close instructor profile",
    quote: "A NOTE FROM YOUR INSTRUCTOR",
    profile: "Explore full profile",
  },
  ar: {
    eyebrow: "بحار / المدربون",
    about: "تعرّف على مدربك",
    experience: "سنوات الخبرة",
    learners: "المتعلمون",
    rating: "التقييم",
    courses: "استكشف دورات المدرب",
    view: "عرض الدورة",
    close: "إغلاق ملف المدرب",
    quote: "رسالة من مدربك",
    profile: "عرض الملف الكامل",
  },
};

export default function InstructorProfileModal({
  instructor,
  language,
  onClose,
}) {
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const openerRef = useRef(null);
  const closingRef = useRef(false);
  const closeHandlerRef = useRef(() => {});

  const isArabic = language === "ar";
  const t = copy[language];
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;

  useEffect(() => {
    if (!instructor) return;

    openerRef.current = document.activeElement;
    closingRef.current = false;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    const overlay = overlayRef.current;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.fromTo(
          overlay,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.3,
            ease: "power2.out",
          }
        );

        gsap.fromTo(
          dialog,
          { y: 55, scale: 0.96, autoAlpha: 0 },
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.55,
            ease: "power3.out",
          }
        );
      }
    });

    closeRef.current?.focus();

    const handleClose = () => {
      if (closingRef.current) return;
      closingRef.current = true;

      if (reduced) {
        onClose();
        return;
      }

      gsap.timeline({
        defaults: { ease: "power2.in" },
        onComplete: onClose,
      })
        .to(dialog, { y: 28, scale: 0.97, autoAlpha: 0, duration: 0.28 }, 0)
        .to(overlay, { autoAlpha: 0, duration: 0.22 }, 0.06);
    };

    closeHandlerRef.current = handleClose;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialog.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (element) =>
          element.getClientRects().length > 0
      );

      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
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
      ctx.revert();

      if (openerRef.current?.isConnected) {
        openerRef.current.focus();
      }
      closeHandlerRef.current = () => {};
    };
  }, [instructor, onClose]);

  if (!instructor) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="behar-faculty-modal"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeHandlerRef.current();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="behar-faculty-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="behar-faculty-modal-title"
        tabIndex={-1}
      >
        <button
          ref={closeRef}
          type="button"
          className="behar-faculty-modal__close"
          onClick={() => closeHandlerRef.current()}
          aria-label={t.close}
        >
          <X size={22} />
        </button>

        <div className="behar-faculty-modal__portrait">
          {(() => {
            const FacultyIcon = facultyIconMap[instructor.category] || GraduationCap;

            return (
              <span className="behar-faculty-modal__portrait-icon" aria-hidden="true">
                <FacultyIcon size={150} strokeWidth={1} />
              </span>
            );
          })()}

          <div className="behar-faculty-modal__portrait-label">
            <span>{t.eyebrow}</span>
            <strong>{instructor.name}</strong>
          </div>
        </div>

        <div className="behar-faculty-modal__content">
          <div className="behar-faculty-modal__top">
            <span className="behar-faculty-modal__tag">
              ✳ {t.about}
            </span>
            <span>BEHAR / 006</span>
          </div>

          <div className="behar-faculty-modal__identity">
            <span>{instructor.specialty[language]}</span>
            <h2 id="behar-faculty-modal-title">
              {instructor.name}
            </h2>
            <p className="behar-faculty-modal__role">
              {instructor.role[language]}
            </p>
          </div>

          <p className="behar-faculty-modal__bio">
            {instructor.bio[language]}
          </p>

          <div className="behar-faculty-modal__skills">
            {instructor.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>

          <div className="behar-faculty-modal__stats">
            <div>
              <strong>{instructor.experience}</strong>
              <span>{t.experience}</span>
            </div>
            <div>
              <strong>{instructor.learners}</strong>
              <span>{t.learners}</span>
            </div>
            <div>
              <strong>
                {instructor.rating}
                <Star size={16} fill="currentColor" />
              </strong>
              <span>{t.rating}</span>
            </div>
          </div>

          <div className="behar-faculty-modal__quote">
            <span>{t.quote}</span>
            <blockquote>
              “{instructor.quote[language]}”
            </blockquote>
          </div>

          <div className="behar-faculty-modal__courses">
            <div className="behar-faculty-modal__courses-heading">
              <h3>{t.courses}</h3>
              <span>
                {String(instructor.courses.length).padStart(
                  2,
                  "0"
                )}
              </span>
            </div>

            {instructor.courses.map((course) => (
              <Link
                key={course.slug}
                to={`/courses/${course.slug}`}
                className="behar-faculty-modal__course"
              >
                <span className="behar-faculty-modal__course-icon">
                  <BookOpen size={20} />
                </span>

                <span className="behar-faculty-modal__course-info">
                  <strong>{course.title[language]}</strong>
                  <small>
                    <Clock3 size={12} />
                    {course.duration} · {course.level}
                  </small>
                </span>

                <Arrow size={19} />
              </Link>
            ))}
          </div>

          <Link
            to={`/instructors/${instructor.slug}`}
            className="behar-faculty-modal__profile"
          >
            <span>{t.profile}</span>
            <Arrow size={20} />
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
