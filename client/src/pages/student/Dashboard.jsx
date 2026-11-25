
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import DashboardWelcome from "../../components/student/dashboard/DashboardWelcome";
import ContinueLearning from "../../components/student/dashboard/ContinueLearning";
import LearningStats from "../../components/student/dashboard/LearningStats";
import ActiveCourses from "../../components/student/dashboard/ActiveCourses";
import WeeklyActivity from "../../components/student/dashboard/WeeklyActivity";
import UpcomingDeadlines from "../../components/student/dashboard/UpcomingDeadlines";
import LearningMilestones from "../../components/student/dashboard/LearningMilestones";
import RecommendedCourses from "../../components/student/dashboard/RecommendedCourses";

// P14.4 — Assessments
import AssessmentOverview from "../../components/student/assessments/AssessmentOverview";
import AssessmentResultPreview from "../../components/student/assessments/AssessmentResultPreview";
import AssessmentStoragePreview from "../../components/student/assessments/AssessmentStoragePreview";
import AssessmentHookPreview from "../../components/student/assessments/AssessmentHookPreview";
import AssessmentStatusPreview from "../../components/student/assessments/AssessmentStatusPreview";

// P14.5 — Gamification
import LevelProgressCard from "../../components/student/achievements/LevelProgressCard";
import LearningStreakCard from "../../components/student/achievements/LearningStreakCard";
import WeeklyLearningGoals from "../../components/student/achievements/WeeklyLearningGoals";
import BadgeCollection from "../../components/student/achievements/BadgeCollection";
import AchievementCelebrationDemo from "../../components/student/achievements/AchievementCelebrationDemo";

// P14.5.0.9 — Shared Gamification Context
import { useGamification } from "../../context/GamificationContext";
import DashboardPopup, {
  DashboardPopupTrigger,
} from "../../components/student/dashboard/DashboardPopup";
import { mockEnrolledCourses } from "../../data/student/myLearning";

import {
  mockStudent,
  mockContinueLearning,
  mockActiveCourses,
  mockWeeklyActivity,
  mockUpcomingDeadlines,
  mockLearningMilestones,
  mockRecommendedCourses,
} from "../../data/student/dashboard";

export default function Dashboard() {
  const language = "en";
  const [popup, setPopup] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Shared progress from Learning Player events
  const { progress } = useGamification();

  useEffect(() => {
    const openOverview = () => {
      setPopup({
        type: "overview",
        data: [
          "Learning progress and completed lessons",
          "Current level, XP, streak, and weekly goal",
          "Enrolled courses and continue-learning actions",
          "Upcoming deadlines and weekly activity",
          "Badges and achievement milestones",
        ],
      });
    };

    window.addEventListener(
      "behar:open-overview-popup",
      openOverview
    );

    const shouldOpenFromSession =
      sessionStorage.getItem(
        "behar:open-overview-popup"
      ) === "true";

    if (
      !location.state?.openOverview &&
      !shouldOpenFromSession
    ) {
      return () =>
        window.removeEventListener(
          "behar:open-overview-popup",
          openOverview
        );
    }

    sessionStorage.removeItem(
      "behar:open-overview-popup"
    );
    openOverview();

    navigate(location.pathname, { replace: true, state: {} });

    return () =>
      window.removeEventListener(
        "behar:open-overview-popup",
        openOverview
      );
  }, [location.pathname, location.state, navigate]);

  return (
    <div className="behar-student-dashboard">
      {/* P14.1.1 — Dashboard Welcome */}
      <DashboardWelcome student={mockStudent} />

      {/* P14.5.0.8 — Achievements Navigation */}
      <Link
        to="/student/achievements"
        className="behar-dashboard-achievements-link"
      >
        <span>Explore all achievements</span>
        <ArrowUpRight size={18} aria-hidden="true" />
      </Link>

      {/* P14.5.0.3 — Level Progress */}
      <DashboardPopupTrigger
        type="achievements"
        data={{
          totalXP: progress.totalXP,
          level: progress.level,
          badges: progress.unlockedBadges?.length,
        }}
        language={language}
        onOpen={(type, data, trigger) =>
          setPopup({ type, data, trigger })
        }
      >
        <LevelProgressCard
          totalXP={progress.totalXP}
          language={language}
        />
      </DashboardPopupTrigger>

      {/* P14.5.0.4 — Learning Streak */}
      <DashboardPopupTrigger
        type="achievements"
        data={{
          totalXP: progress.totalXP,
          level: progress.level,
          badges: progress.unlockedBadges?.length,
        }}
        language={language}
        onOpen={(type, data, trigger) =>
          setPopup({ type, data, trigger })
        }
      >
        <LearningStreakCard
          activityDates={progress.streak?.activityDates ?? []}
          timezone={progress.timezone ?? "Asia/Riyadh"}
          language={language}
        />
      </DashboardPopupTrigger>

      {/* P14.5.0.5 — Weekly Learning Goals */}
      <DashboardPopupTrigger
        type="achievements"
        data={{
          totalXP: progress.totalXP,
          level: progress.level,
          badges: progress.unlockedBadges?.length,
        }}
        language={language}
        onOpen={(type, data, trigger) =>
          setPopup({ type, data, trigger })
        }
      >
        <WeeklyLearningGoals
          goal={progress.weeklyGoal}
          timezone={progress.timezone ?? "Asia/Riyadh"}
          language={language}
        />
      </DashboardPopupTrigger>

      {/* P14.5.0.6 — Badge Collection */}
      <DashboardPopupTrigger
        type="achievements"
        data={{
          totalXP: progress.totalXP,
          level: progress.level,
          badges: progress.unlockedBadges?.length,
        }}
        language={language}
        onOpen={(type, data, trigger) =>
          setPopup({ type, data, trigger })
        }
      >
        <BadgeCollection
          progress={progress}
          language={language}
        />
      </DashboardPopupTrigger>

      {/* P14.5.0.7 — Development Preview */}
      {import.meta.env.DEV && (
        <AchievementCelebrationDemo
          language={language}
        />
      )}

      {/* P14.1.2 — Continue Learning */}
      <DashboardPopupTrigger
        type="courses"
        data={mockEnrolledCourses}
        language={language}
        onOpen={(type, data, trigger) =>
          setPopup({ type, data, trigger })
        }
      >
        <ContinueLearning
          course={mockContinueLearning}
          resumeEnabled={false}
        />
      </DashboardPopupTrigger>

      {/* P14.1.3 — Learning Statistics */}
      <DashboardPopupTrigger
        type="progress"
        data={{
          completedLessons: progress.stats?.lessonsCompleted,
          completedCourses: progress.stats?.coursesCompleted,
          percentage: 0,
        }}
        language={language}
        onOpen={(type, data, trigger) =>
          setPopup({ type, data, trigger })
        }
      >
        <LearningStats student={mockStudent} />
      </DashboardPopupTrigger>

      {/* P14.1.4 — Active Courses */}
      <DashboardPopupTrigger
        type="courses"
        data={mockActiveCourses}
        language={language}
        onOpen={(type, data, trigger) =>
          setPopup({ type, data, trigger })
        }
      >
        <ActiveCourses
          courses={mockActiveCourses}
          learningRoutesEnabled={false}
        />
      </DashboardPopupTrigger>

      {/* P14.1.5 — Weekly Activity */}
      <DashboardPopupTrigger
        type="activity"
        data={mockWeeklyActivity}
        language={language}
        onOpen={(type, data, trigger) =>
          setPopup({ type, data, trigger })
        }
      >
        <WeeklyActivity activity={mockWeeklyActivity} />
      </DashboardPopupTrigger>

      {/* P14.1.6 — Upcoming Deadlines */}
      <DashboardPopupTrigger
        type="deadlines"
        data={mockUpcomingDeadlines}
        language={language}
        onOpen={(type, data, trigger) =>
          setPopup({ type, data, trigger })
        }
      >
        <UpcomingDeadlines
          deadlines={mockUpcomingDeadlines}
          actionsEnabled={false}
        />
      </DashboardPopupTrigger>

      {/* P14.1.7 — Learning Milestones */}
      <LearningMilestones
        student={mockStudent}
        data={mockLearningMilestones}
      />

      {/* P14.1.8 — Recommended Courses */}
      <RecommendedCourses
        courses={mockRecommendedCourses}
      />

      {/* P14.4.0.2 — Assessment Overview */}
      <AssessmentOverview
        assessmentId="react-basics-quiz"
      />

      {/* P14.4.0.3 — Scoring Preview */}
      <AssessmentResultPreview
        assessmentId="react-basics-quiz"
      />

      {/* P14.4.0.4 — Attempt Storage */}
      <AssessmentStoragePreview
        assessmentId="react-basics-quiz"
        studentId="dev-student-001"
        language={language}
      />

      {/* P14.4.0.5 — Assessment Hook */}
      <AssessmentHookPreview
        assessmentId="react-basics-quiz"
        studentId="dev-student-001"
        language={language}
      />

      {/* P14.4.0.6 — Assessment Status */}
      <AssessmentStatusPreview
        assessmentId="react-basics-quiz"
        studentId="dev-student-001"
        language={language}
      />

      {popup && (
        <DashboardPopup
          type={popup.type}
          data={popup.data}
          language={language}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
}
