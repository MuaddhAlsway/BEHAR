
import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";

import {
  mainLinks,
  secondaryLinks,
} from "./StudentSidebar";
import { useStudentLanguage } from "../../../context/StudentLanguageContext";

const arabicLabels = {
  Overview: "نظرة عامة", "My Learning": "تعلمي", Progress: "التقدم",
  Assignments: "الواجبات", Notifications: "الإشعارات", Certificates: "الشهادات",
  Discussions: "النقاشات", Messages: "الرسائل", Calendar: "التقويم",
  Wishlist: "المفضلة", Payments: "المدفوعات", Settings: "الإعدادات",
  "Help & Support": "المساعدة والدعم",
};

export default function StudentMobileNav({
  isOpen,
  onClose,
}) {
  const closeButtonRef = useRef(null);
  const panelRef = useRef(null);
  const previousFocusRef = useRef(null);
  const { isArabic } = useStudentLanguage();

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    const handleTab = (event) => {
      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled])'
      );

      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTab);

    return () => {
      document.removeEventListener("keydown", handleTab);
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="behar-student-mobile">
      <button
        type="button"
        className="behar-student-mobile__backdrop"
        onClick={onClose}
        aria-label="Close navigation"
        tabIndex={-1}
      />

      <aside
        ref={panelRef}
        className="behar-student-mobile__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Student navigation"
      >
        <div className="behar-student-mobile__top">
          <span>BEHAR.</span>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={23} />
          </button>
        </div>

        <nav aria-label="Mobile student navigation">
          <span className="behar-student-sidebar__group-label">
            {isArabic ? "مساحة التعلم" : "YOUR WORKSPACE"}
          </span>

          {mainLinks.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `behar-student-sidebar__link ${
                  isActive ? "is-active" : ""
                }`
              }
            >
              <Icon size={19} strokeWidth={1.7} />
              <span>{isArabic ? arabicLabels[label] : label}</span>
            </NavLink>
          ))}

          <div className="behar-student-mobile__divider" />

          {secondaryLinks.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `behar-student-sidebar__link ${
                  isActive ? "is-active" : ""
                }`
              }
            >
              <Icon size={19} strokeWidth={1.7} />
              <span>{isArabic ? arabicLabels[label] : label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
}
