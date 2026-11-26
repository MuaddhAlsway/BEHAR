
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import { ArrowUp } from "lucide-react";

// ==========================================
// PUBLIC NAVIGATION
// ==========================================

import Navbar from "./components/navigation/Navbar";
import Footer from "./layouts/Footer";

// ==========================================
// PUBLIC PAGES
// ==========================================

import Home from "./pages/public/Home";
import Courses from "./pages/public/Courses";
import CourseDetails from "./pages/public/CourseDetails";
import NotFound from "./pages/public/NotFound";
import VerifyCertificate from "./pages/public/VerifyCertificate";

// ==========================================
// STUDENT LAYOUT
// ==========================================

import StudentLayout from "./layouts/StudentLayout";

// ==========================================
// STUDENT PAGES
// ==========================================

import Dashboard from "./pages/student/Dashboard";
import MyLearning from "./pages/student/MyLearning";
import LearningPlayer from "./pages/student/LearningPlayer";
import Assignments from "./pages/student/Assignments";
import StudentProgress from "./pages/student/Progress";
import Messages from "./pages/student/Messages";
import Notifications from "./pages/student/Notifications";
import Certificates from "./pages/student/Certificates";

// P14.11 — Student Discussions
import Discussions from "./pages/student/Discussions";

// P14.11.4 — Discussion Details & Threaded Replies
import DiscussionDetails from "./pages/student/DiscussionDetails";

// P14.5.0.8 — Complete Achievements Dashboard
import Achievements from "./components/student/achievements/Achievements";

// ==========================================
// APPLICATION CONTEXT PROVIDERS
// ==========================================

// P14.5.0.9 — Gamification Context
import {
  GamificationProvider,
} from "./context/GamificationContext";

// P14.9 — Student Notifications Context
import {
  StudentNotificationsProvider,
} from "./context/StudentNotificationsContext";
import { DiscussionsProvider } from "./context/DiscussionsContext";

// ==========================================
// GLOBAL ACHIEVEMENT CELEBRATIONS
// ==========================================

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
      <StudentNotificationsProvider>
        <DiscussionsProvider>
        {/* ==================================
            ROUTE SCROLL RESET
        ================================== */}

        <RouteScrollReset />

        <Routes>
          {/* ==================================
              PUBLIC WEBSITE
          ================================== */}

          <Route element={<PublicLayout />}>
            {/* P01 — Home */}
            <Route
              index
              element={<Home />}
            />

            {/* P02 — Course Catalog */}
            <Route
              path="courses"
              element={<Courses />}
            />

            {/* P03 — Course Details */}
            <Route
              path="courses/:slug"
              element={<CourseDetails />}
            />

            {/* P14.10.6 — Certificate Verification */}
            <Route
              path="verify-certificate"
              element={<VerifyCertificate />}
            />
          </Route>

          {/* ==================================
              STUDENT DASHBOARD
          ================================== */}

          <Route
            path="/student"
            element={<StudentLayout />}
          >
            {/* ==================================
                P14.1 — DASHBOARD OVERVIEW
            ================================== */}

            <Route
              index
              element={<Dashboard />}
            />

            {/* ==================================
                P14.2 — MY LEARNING
            ================================== */}

            <Route
              path="my-learning"
              element={<MyLearning />}
            />

            {/* ==================================
                P14.4 — STUDENT PROGRESS
            ================================== */}

            <Route
              path="progress"
              element={<StudentProgress />}
            />

            <Route path="messages" element={<Messages />} />

            {/* ==================================
                P14.5 — ACHIEVEMENTS
            ================================== */}

            <Route
              path="achievements"
              element={
                <Achievements language="en" />
              }
            />

            {/* ==================================
                P14.8 — ASSIGNMENTS
            ================================== */}

            <Route
              path="assignments"
              element={<Assignments />}
            />

            {/* ==================================
                P14.9 — NOTIFICATIONS
            ================================== */}

            <Route
              path="notifications"
              element={<Notifications />}
            />

            {/* ==================================
                P14.10 — CERTIFICATES
            ================================== */}

            <Route
              path="certificates"
              element={<Certificates />}
            />

            {/* ==================================
                P14.11.1 — DISCUSSIONS OVERVIEW
                P14.11.3 — CREATE DISCUSSION
            ================================== */}

            <Route
              path="discussions"
              element={<Discussions />}
            />

            {/* ==================================
                P14.11.4 — DISCUSSION DETAILS
                & THREADED REPLIES
            ================================== */}

            <Route
              path="discussions/:discussionId"
              element={<DiscussionDetails />}
            />

            {/* ==================================
                INVALID STUDENT ROUTES
            ================================== */}

            <Route
              path="*"
              element={<NotFound />}
            />
          </Route>

          {/* ==================================
              P14.3 — STUDENT LEARNING PLAYER

              Focused learning workspace
              Without Student Dashboard sidebar
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

        {/* ==================================
            P14.5.0.9 — GLOBAL ACHIEVEMENT
            CELEBRATION HOST
        ================================== */}

        <GamificationCelebrationHost language="en" />
        </DiscussionsProvider>
      </StudentNotificationsProvider>
    </GamificationProvider>
  );
}

export default App;
