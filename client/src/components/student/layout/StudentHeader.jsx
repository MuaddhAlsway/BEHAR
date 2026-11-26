
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  Search,
  ChevronRight,
  UserRound,
} from "lucide-react";
import NotificationBell from "../notifications/NotificationBell";
import { useStudentLanguage } from "../../../context/StudentLanguageContext";

const pageTitles = {
  "/student": "Overview",
  "/student/my-learning": "My Learning",
  "/student/progress": "Progress",
  "/student/assignments": "Assignments",
  "/student/notifications": "Notifications",
  "/student/certificates": "Certificates",
  "/student/discussions": "Discussions",
  "/student/messages": "Messages",
  "/student/calendar": "Calendar",
  "/student/wishlist": "Wishlist",
  "/student/orders": "Payments",
  "/student/settings": "Settings",
  "/student/help": "Help & Support",
};

const arabicPageTitles = {
  Overview: "نظرة عامة",
  "My Learning": "تعلمي",
  Progress: "التقدم",
  Assignments: "الواجبات",
  Notifications: "الإشعارات",
  Certificates: "الشهادات",
  Discussions: "النقاشات",
  Messages: "الرسائل",
  Calendar: "التقويم",
  Wishlist: "المفضلة",
  Payments: "المدفوعات",
  Settings: "الإعدادات",
  "Help & Support": "المساعدة والدعم",
};

export default function StudentHeader({ onMenuClick }) {
  const location = useLocation();
  const { language, isArabic, toggleLanguage } = useStudentLanguage();

  const pageTitle =
    pageTitles[location.pathname] ||
    location.pathname
      .split("/")
      .filter(Boolean)
      .at(-1)
      ?.replaceAll("-", " ") ||
    "Overview";
  const localizedPageTitle = isArabic
    ? arabicPageTitles[pageTitle] ?? pageTitle
    : pageTitle;

  return (
    <header className="behar-student-header">
      <div className="behar-student-header__left">
        <button
          type="button"
          className="behar-student-header__menu"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu size={23} />
        </button>

        <div className="behar-student-header__breadcrumb">
          <Link to="/student">{isArabic ? "مساحة التعلم" : "Workspace"}</Link>
          <ChevronRight size={15} />
          <span>{localizedPageTitle}</span>
        </div>
      </div>

      <div className="behar-student-header__actions">
        <button
          type="button"
          className="behar-student-header__language"
          onClick={toggleLanguage}
          aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}
        >
          {isArabic ? "ENGLISH" : "العربية"}
        </button>

        <Link
          to="/courses"
          className="behar-student-header__action"
          aria-label="Explore courses"
        >
          <Search size={20} strokeWidth={1.7} />
        </Link>

        <NotificationBell language={language} />

        <Link
          to="/student/profile"
          className="behar-student-header__avatar"
          aria-label="Student profile"
        >
          <UserRound size={20} strokeWidth={1.7} />
        </Link>
      </div>
    </header>
  );
}
