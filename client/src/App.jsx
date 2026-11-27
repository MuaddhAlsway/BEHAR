
import { useEffect, useState } from "react";

import {
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
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

// P14.14 — Student Calendar
import Calendar from "./pages/student/Calendar";

// P14.15 — Student Wishlist
import Wishlist from "./pages/student/Wishlist";

// P14.16 — Student Payments & Billing
import Payments from "./pages/student/Payments";

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

// P14.11 — Discussions Context
import {
  DiscussionsProvider,
} from "./context/DiscussionsContext";

// P14.15 — Wishlist Context
import {
  WishlistProvider,
} from "./context/WishlistContext";

// P14.17 — Reviews & Ratings Context
import {
  ReviewsProvider,
} from "./context/ReviewsContext";

// ==========================================
// GLOBAL ACHIEVEMENT CELEBRATIONS
// ==========================================

import GamificationCelebrationHost from "./components/student/achievements/GamificationCelebrationHost";

// ==========================================
// LOCALE ROUTING
// ==========================================

import {
  getLocaleFromPath,
  withLocale,
} from "./utils/localeRouting";

// ==========================================
// SCROLL TO TOP BUTTON
// ==========================================

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

// ==========================================
// ROUTE SCROLL RESET
// ==========================================

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

// ==========================================
// LOCALE URL SYNCHRONIZATION
// ==========================================

function LocaleUrlSync() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const locale = getLocaleFromPath(pathname);

    if (!locale) {
      let stored = "en";

      try {
        stored =
          localStorage.getItem("behar-language") || "en";
      } catch {
        // Storage may be unavailable.
      }

      const safeLocale = stored === "ar" ? "ar" : "en";

      navigate(withLocale(pathname, safeLocale), {
        replace: true,
      });

      return;
    }

    document.documentElement.lang = locale;
    document.documentElement.dir =
      locale === "ar" ? "rtl" : "ltr";

    try {
      localStorage.setItem("behar-language", locale);
    } catch {
      // Language remains synchronized with the URL.
    }
  }, [navigate, pathname]);

  return null;
}

// ==========================================
// PUBLIC WEBSITE LAYOUT
// ==========================================

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

// ==========================================
// MAIN APPLICATION
// ==========================================

function App() {
  return (
    <GamificationProvider>
      <StudentNotificationsProvider>
        <DiscussionsProvider>
          <WishlistProvider>
            <ReviewsProvider>

              {/* ==================================
                  ROUTE SCROLL RESET
              ================================== */}

              <RouteScrollReset />
              <LocaleUrlSync />

              <Routes>

                {/* ==================================
                    PUBLIC WEBSITE
                ================================== */}

                <Route
                  path=":lang?"
                  element={<PublicLayout />}
                >

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
                  path=":lang?/student"
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

                  {/* P14.4 — Student Progress */}
                  <Route
                    path="progress"
                    element={<StudentProgress />}
                  />

                  {/* Student Messages */}
                  <Route
                    path="messages"
                    element={<Messages />}
                  />

                  {/* P14.5 — Achievements */}
                  <Route
                    path="achievements"
                    element={
                      <Achievements language="en" />
                    }
                  />

                  {/* P14.8 — Assignments */}
                  <Route
                    path="assignments"
                    element={<Assignments />}
                  />

                  {/* P14.9 — Notifications */}
                  <Route
                    path="notifications"
                    element={<Notifications />}
                  />

                  {/* P14.10 — Certificates */}
                  <Route
                    path="certificates"
                    element={<Certificates />}
                  />

                  {/* ==================================
                      P14.11 — STUDENT DISCUSSIONS
                  ================================== */}

                  <Route
                    path="discussions"
                    element={<Discussions />}
                  />

                  <Route
                    path="discussions/:discussionId"
                    element={<DiscussionDetails />}
                  />

                  {/* ==================================
                      P14.14 — STUDENT CALENDAR
                  ================================== */}

                  <Route
                    path="calendar"
                    element={<Calendar />}
                  />

                  {/* ==================================
                      P14.15 — STUDENT WISHLIST
                  ================================== */}

                  <Route
                    path="wishlist"
                    element={<Wishlist />}
                  />

                  {/* ==================================
                      P14.16 — STUDENT PAYMENTS
                      & BILLING

                      Features:
                      - Payment overview
                      - Total spent
                      - Order statistics
                      - Transaction history
                      - Payment status
                      - Receipts
                      - Order details
                      - Refund requests
                      - Future payment gateway integration
                  ================================== */}

                  <Route
                    path="orders"
                    element={<Payments />}
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
                  path=":lang?/student/learn/:courseSlug"
                  element={<LearningPlayer />}
                />

                <Route
                  path=":lang?/student/learn/:courseSlug/lessons/:lessonId"
                  element={<LearningPlayer />}
                />

                {/* ==================================
                    GLOBAL 404
                ================================== */}

                <Route
                  path=":lang?/*"
                  element={
                    <PublicLayout>
                      <NotFound />
                    </PublicLayout>
                  }
                />

              </Routes>

              {/* ==================================
                  GLOBAL ACHIEVEMENT CELEBRATIONS
              ================================== */}

              <GamificationCelebrationHost language="en" />

            </ReviewsProvider>
          </WishlistProvider>
        </DiscussionsProvider>
      </StudentNotificationsProvider>
    </GamificationProvider>
  );
}

export default App;
