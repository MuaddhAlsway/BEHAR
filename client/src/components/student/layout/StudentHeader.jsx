
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  ChevronRight,
  UserRound,
} from "lucide-react";

const pageTitles = {
  "/student": "Overview",
  "/student/my-learning": "My Learning",
  "/student/progress": "Progress",
  "/student/assignments": "Assignments",
  "/student/certificates": "Certificates",
  "/student/discussions": "Discussions",
  "/student/messages": "Messages",
  "/student/calendar": "Calendar",
  "/student/wishlist": "Wishlist",
  "/student/orders": "Payments",
  "/student/settings": "Settings",
  "/student/help": "Help & Support",
};

export default function StudentHeader({ onMenuClick }) {
  const location = useLocation();

  const pageTitle =
    pageTitles[location.pathname] ||
    location.pathname
      .split("/")
      .filter(Boolean)
      .at(-1)
      ?.replaceAll("-", " ") ||
    "Overview";

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
          <Link to="/student">Workspace</Link>
          <ChevronRight size={15} />
          <span>{pageTitle}</span>
        </div>
      </div>

      <div className="behar-student-header__actions">
        <Link
          to="/courses"
          className="behar-student-header__action"
          aria-label="Explore courses"
        >
          <Search size={20} strokeWidth={1.7} />
        </Link>

        <Link
          to="/student/notifications"
          className="behar-student-header__action"
          aria-label="Notifications"
        >
          <Bell size={20} strokeWidth={1.7} />
          <span className="behar-student-header__notification-dot" />
        </Link>

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
