
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import { ArrowUp } from "lucide-react";

// Public navigation
import Navbar from "./components/navigation/Navbar";
import Footer from "./layouts/Footer";

// Public pages
import Home from "./pages/public/Home";
import Courses from "./pages/public/Courses";
import CourseDetails from "./pages/public/CourseDetails";
import NotFound from "./pages/public/NotFound";

// Student layout
import StudentLayout from "./layouts/StudentLayout";

// Student pages
import Dashboard from "./pages/student/Dashboard";
import MyLearning from "./pages/student/MyLearning";
import LearningPlayer from "./pages/student/LearningPlayer";
import Assignments from "./pages/student/Assignments";
import StudentProgress from "./pages/student/Progress";

// P14.5.0.8 — Complete Achievements Dashboard
import Achievements from "./components/student/achievements/Achievements";

// P14.5.0.9 — Gamification Context
import {
  GamificationProvider,
} from "./context/GamificationContext";

// P14.5.0.9 — Global Achievement Celebrations
import GamificationCelebrationHost from "./components/student/achievements/GamificationCelebrationHost";

/* ==========================================
   SCROLL TO TOP BUTTON
========================================== */

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 520);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      className="behar-scroll-top"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      style={{
        opacity: visible ? 1 : 0,
        visibility: visible ? "visible" : "hidden",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <ArrowUp
        size={18}
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </button>
  );
}

/* ==========================================
   ROUTE SCROLL RESET
========================================== */

function RouteScrollReset() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}

/* ==========================================
   PUBLIC WEBSITE LAYOUT
========================================== */

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />

      <main id="main-content">
        {children || <Outlet />}
      </main>

      <Footer />

      <ScrollToTop />
    </>
  );
}

/* ==========================================
   MAIN APPLICATION
========================================== */

function App() {
  return (
    <GamificationProvider>
      {/* Route scroll reset */}
      <RouteScrollReset />

      <Routes>
        {/* ==================================
            PUBLIC WEBSITE
        ================================== */}

        <Route element={<PublicLayout />}>
          {/* Home */}
          <Route
            index
            element={<Home />}
          />

          {/* Course catalog */}
          <Route
            path="courses"
            element={<Courses />}
          />

          {/* Course details */}
          <Route
            path="courses/:slug"
            element={<CourseDetails />}
          />
        </Route>

        {/* ==================================
            STUDENT DASHBOARD
        ================================== */}

        <Route
          path="/student"
          element={<StudentLayout />}
        >
          {/* P14.1 — Dashboard Overview */}
          <Route
            index
            element={<Dashboard />}
          />

          {/* P14.2 — My Learning */}
          <Route
            path="my-learning"
            element={<MyLearning />}
          />

          <Route
            path="assignments"
            element={<Assignments />}
          />

          <Route
            path="progress"
            element={<StudentProgress />}
          />

          {/* P14.5.0.8 — Achievements Dashboard */}
          <Route
            path="achievements"
            element={<Achievements language="en" />}
          />

          {/* Invalid student pages */}
          <Route
            path="*"
            element={<NotFound />}
          />
        </Route>

        {/* ==================================
            P14.3 — STUDENT LEARNING PLAYER
            Focused learning workspace
            No dashboard sidebar
        ================================== */}

        <Route
          path="/student/learn/:courseSlug"
          element={<LearningPlayer />}
        />

        <Route
          path="/student/learn/:courseSlug/lessons/:lessonId"
          element={<LearningPlayer />}
        />

        {/* ==================================
            GLOBAL 404
        ================================== */}

        <Route
          path="*"
          element={
            <PublicLayout>
              <NotFound />
            </PublicLayout>
          }
        />
      </Routes>

      {/* P14.5.0.9 — Global Achievement Celebration */}
      <GamificationCelebrationHost language="en" />
    </GamificationProvider>
  );
}

export default App;
