
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import StudentSidebar from "../components/student/layout/StudentSidebar";
import StudentHeader from "../components/student/layout/StudentHeader";
import StudentMobileNav from "../components/student/layout/StudentMobileNav";

import "../styles/student/student-layout.css";
import "../styles/student/notifications.css";
import { StudentNotificationsProvider } from "../context/StudentNotificationsContext";
import { StudentLanguageProvider } from "../context/StudentLanguageContext";

const CURRENT_YEAR = new Date().getFullYear();

function StudentLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileOpen]);

  return (
    <StudentLanguageProvider>
      <StudentNotificationsProvider>
      <div className="behar-student-layout">
      <StudentSidebar />

      <div className="behar-student-layout__workspace">
        <StudentHeader
          onMenuClick={() => setIsMobileOpen(true)}
        />

        <main
          id="student-main-content"
          className="behar-student-layout__main"
        >
          <Outlet />
        </main>

        <footer className="behar-student-layout__footer">
          <span>© {CURRENT_YEAR} BEHAR.</span>
          <span>LEARN WITHOUT LIMITS.</span>
        </footer>
      </div>

      <StudentMobileNav
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />
      </div>
      </StudentNotificationsProvider>
    </StudentLanguageProvider>
  );
}

export default StudentLayout;
