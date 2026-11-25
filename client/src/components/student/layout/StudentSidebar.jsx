
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ChartNoAxesColumn,
  ClipboardList,
  Award,
  MessagesSquare,
  Mail,
  CalendarDays,
  Bookmark,
  Wallet,
  Settings,
  CircleHelp,
  ArrowUpRight,
} from "lucide-react";

const mainLinks = [
  { label: "Overview", path: "/student", icon: LayoutDashboard, end: true },
  { label: "My Learning", path: "/student/my-learning", icon: BookOpen },
  { label: "Progress", path: "/student/progress", icon: ChartNoAxesColumn },
  { label: "Assignments", path: "/student/assignments", icon: ClipboardList },
  { label: "Certificates", path: "/student/certificates", icon: Award },
  { label: "Discussions", path: "/student/discussions", icon: MessagesSquare },
  { label: "Messages", path: "/student/messages", icon: Mail },
  { label: "Calendar", path: "/student/calendar", icon: CalendarDays },
  { label: "Wishlist", path: "/student/wishlist", icon: Bookmark },
  { label: "Payments", path: "/student/orders", icon: Wallet },
];

const secondaryLinks = [
  { label: "Settings", path: "/student/settings", icon: Settings },
  { label: "Help & Support", path: "/student/help", icon: CircleHelp },
];

export { mainLinks, secondaryLinks };

export default function StudentSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="behar-student-sidebar">
      <div className="behar-student-sidebar__brand">
        <NavLink to="/student" className="behar-student-sidebar__logo">
          BEHAR<span>.</span>
        </NavLink>

        <span className="behar-student-sidebar__brand-caption">
          STUDENT WORKSPACE
        </span>
      </div>

      <nav
        className="behar-student-sidebar__nav"
        aria-label="Student navigation"
      >
        <span className="behar-student-sidebar__group-label">
          YOUR WORKSPACE
        </span>

        {mainLinks.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={
              path === "/student"
                ? {
                    pathname: path,
                    state: { openOverview: true },
                  }
                : path
            }
            end={end}
            onClick={() => {
              if (path === "/student") {
                sessionStorage.setItem(
                  "behar:open-overview-popup",
                  "true"
                );
                navigate(path, {
                  state: { openOverview: true },
                });
              } else if (path === "/student/my-learning") {
                sessionStorage.setItem(
                  "behar:open-my-learning-popup",
                  "true"
                );
              }
            }}
            className={({ isActive }) =>
              `behar-student-sidebar__link ${
                isActive ? "is-active" : ""
              }`
            }
          >
            <Icon size={19} strokeWidth={1.7} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="behar-student-sidebar__bottom">
        <span className="behar-student-sidebar__group-label">
          ACCOUNT
        </span>

        {secondaryLinks.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `behar-student-sidebar__link ${
                isActive ? "is-active" : ""
              }`
            }
          >
            <Icon size={19} strokeWidth={1.7} />
            <span>{label}</span>
          </NavLink>
        ))}

        <div className="behar-student-sidebar__explore">
          <span>KEEP EXPLORING</span>
          <p>Your next skill is waiting.</p>

          <NavLink to="/courses">
            Explore Courses
            <ArrowUpRight size={17} />
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
