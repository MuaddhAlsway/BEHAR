
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Layers3,
  Trophy,
  Zap,
} from "lucide-react";

import { useGamification } from "../../context/GamificationContext";
import { mockEnrolledCourses } from "../../data/student/myLearning";
import {
  getLearningCurriculum,
  getAllLearningLessons,
} from "../../data/student/learningPlayer";
import LevelProgressCard from "../../components/student/achievements/LevelProgressCard";
import LearningStreakCard from "../../components/student/achievements/LearningStreakCard";
import WeeklyLearningGoals from "../../components/student/achievements/WeeklyLearningGoals";

import "../../styles/student/student-progress.css";

const STORAGE_KEY = "behar:learning-progress:v1";

const translations = {
  en: {
    back: "Back to dashboard",
    eyebrow: "LEARNING PROGRESS",
    title: "The work behind your growth.",
    description:
      "Track your learning activity, completed lessons, and the milestones that move you forward.",
    coursesCompleted: "Courses completed",
    lessonsCompleted: "Lessons completed",
    learningTime: "Learning time",
    totalXP: "Total XP",
    hours: "h",
    minutes: "m",
    momentumEyebrow: "YOUR MOMENTUM",
    momentumTitle: "Build on your consistency.",
    coursesEyebrow: "COURSE PROGRESS",
    coursesTitle: "Every lesson counts.",
    coursesDescription:
      "Follow your progress across the courses you're learning.",
    completed: "Completed",
    inProgress: "In progress",
    notStarted: "Not started",
    lessons: "lessons",
    continue: "Continue learning",
    emptyTitle: "Your learning journey starts here.",
    emptyDescription:
      "Start a course to see your lesson completion and learning progress.",
    explore: "Explore courses",
    achievements: "View all achievements",
    note: "Learning activity is currently stored in this browser.",
  },
  ar: {
    back: "العودة إلى لوحة التحكم",
    eyebrow: "التقدم التعليمي",
    title: "كل خطوة تقرّبك من هدفك.",
    description:
      "تابع نشاطك التعليمي والدروس المكتملة والإنجازات التي تحققها.",
    coursesCompleted: "الدورات المكتملة",
    lessonsCompleted: "الدروس المكتملة",
    learningTime: "وقت التعلم",
    totalXP: "نقاط الخبرة",
    hours: "س",
    minutes: "د",
    momentumEyebrow: "استمراريتك",
    momentumTitle: "واصل تقدمك كل يوم.",
    coursesEyebrow: "تقدم الدورات",
    coursesTitle: "كل درس يصنع فرقاً.",
    coursesDescription:
      "تابع مستوى تقدمك في الدورات التي تتعلمها.",
    completed: "مكتملة",
    inProgress: "قيد التعلم",
    notStarted: "لم تبدأ",
    lessons: "دروس",
    continue: "متابعة التعلم",
    emptyTitle: "رحلتك التعليمية تبدأ هنا.",
    emptyDescription:
      "ابدأ دورة تعليمية لعرض الدروس المكتملة وتقدمك.",
    explore: "استكشف الدورات",
    achievements: "عرض جميع الإنجازات",
    note: "يتم حفظ نشاطك التعليمي حالياً في هذا المتصفح.",
  },
};

function readProgress() {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const data = JSON.parse(raw);

    return data &&
      typeof data === "object" &&
      !Array.isArray(data)
      ? data
      : {};
  } catch {
    return {};
  }
}

function useStoredLearningProgress() {
  const [stored, setStored] = useState(readProgress);

  useEffect(() => {
    const refresh = () => setStored(readProgress);

    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("pageshow", refresh);
    window.addEventListener(
      "behar:learning-progress-change",
      refresh
    );

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener(
        "behar:learning-progress-change",
        refresh
      );
    };
  }, []);

  return stored;
}

function number(value, locale) {
  return new Intl.NumberFormat(
    locale === "ar" ? "ar-SA" : "en-US"
  ).format(value ?? 0);
}

function duration(minutes, locale, t) {
  const total = Math.max(0, Number(minutes) || 0);
  const hours = Math.floor(total / 60);
  const remaining = Math.floor(total % 60);

  return hours
    ? `${number(hours, locale)}${t.hours} ${number(remaining, locale)}${t.minutes}`
    : `${number(remaining, locale)}${t.minutes}`;
}

function localized(value, locale) {
  if (typeof value === "string") return value;

  if (value && typeof value === "object") {
    return value[locale] || value.en || "";
  }

  return "";
}

function buildCourseProgress(stored, courses) {
  if (!Array.isArray(courses)) return [];

  return courses
    .filter((course) => course?.courseId || course?.id)
    .map((course) => {
      const id = String(course.courseId ?? course.id);
      const saved = stored[id];

      const completedIds = Array.isArray(saved)
        ? saved
        : Array.isArray(saved?.completedLessonIds)
          ? saved.completedLessonIds
          : [];

      const curriculum = getLearningCurriculum(id);
      const lessons = getAllLearningLessons(curriculum);
      const totalLessons = lessons.length;

      const completedCount = Math.min(
        totalLessons,
        new Set(completedIds).size
      );

      const percentage = totalLessons
        ? Math.round((completedCount / totalLessons) * 100)
        : 0;

      return {
        id,
        slug: course.slug ?? id,
        title: course.title ?? course.name ?? "",
        instructor:
          course.instructorName ?? course.instructor ?? "",
        totalLessons,
        completedCount,
        percentage,
      };
    });
}

function CourseCard({ course, locale, t }) {
  const completed =
    course.totalLessons > 0 && course.percentage === 100;

  const status = completed
    ? t.completed
    : course.completedCount > 0
      ? t.inProgress
      : t.notStarted;

  return (
    <article className="behar-progress-course">
      <div className="behar-progress-course__top">
        <div className="behar-progress-course__symbol">
          {completed ? (
            <CheckCircle2 size={22} />
          ) : (
            <BookOpen size={22} />
          )}
        </div>

        <span
          className={`behar-progress-course__status ${
            completed ? "is-completed" : ""
          }`}
        >
          {status}
        </span>
      </div>

      <h3>{localized(course.title, locale)}</h3>

      {course.instructor && (
        <p className="behar-progress-course__instructor">
          {localized(course.instructor, locale)}
        </p>
      )}

      <div className="behar-progress-course__progress">
        <div className="behar-progress-course__progress-label">
          <span>
            {number(course.completedCount, locale)} /{" "}
            {number(course.totalLessons, locale)} {t.lessons}
          </span>

          <strong>
            {number(course.percentage, locale)}%
          </strong>
        </div>

        <div
          className="behar-progress-course__track"
          role="progressbar"
          aria-label={localized(course.title, locale)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={course.percentage}
        >
          <span style={{ width: `${course.percentage}%` }} />
        </div>
      </div>

      <Link
        className="behar-progress-course__link"
        to={`/student/learn/${encodeURIComponent(course.slug)}`}
      >
        {t.continue}
        <ArrowUpRight size={17} />
      </Link>
    </article>
  );
}

export default function Progress({
  language = "en",
  courses = mockEnrolledCourses,
}) {
  const { progress } = useGamification();

  const [documentLanguage, setDocumentLanguage] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.lang === "ar"
        ? "ar"
        : language
  );

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const observer = new MutationObserver(() => {
      setDocumentLanguage(
        document.documentElement.lang === "ar"
          ? "ar"
          : "en"
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  const locale = documentLanguage === "ar" ? "ar" : "en";
  const t = translations[locale];

  const stored = useStoredLearningProgress();

  const courseProgress = useMemo(
    () => buildCourseProgress(stored, courses),
    [stored, courses]
  );

  const completedCourses = courseProgress.length
    ? courseProgress.filter(
        (course) =>
          course.totalLessons > 0 && course.percentage === 100
      ).length
    : progress?.stats?.coursesCompleted ?? 0;

  const completedLessons = courseProgress.reduce(
    (total, course) => total + course.completedCount,
    0
  );

  const stats = [
    {
      label: t.coursesCompleted,
      value: number(completedCourses, locale),
      icon: GraduationCap,
    },
    {
      label: t.lessonsCompleted,
      value: number(
        completedLessons,
        locale
      ),
      icon: BookOpen,
    },
    {
      label: t.learningTime,
      value: duration(
        progress?.stats?.learningMinutes ?? 0,
        locale,
        t
      ),
      icon: Clock3,
    },
    {
      label: t.totalXP,
      value: number(progress?.totalXP ?? 0, locale),
      icon: Zap,
    },
  ];

  const BackIcon =
    locale === "ar" ? ArrowRight : ArrowLeft;

  return (
    <main
      className="behar-student-progress"
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <Link
        to="/student"
        className="behar-student-progress__back"
      >
        <BackIcon size={16} />
        {t.back}
      </Link>

      <header className="behar-student-progress__hero">
        <div className="behar-student-progress__hero-content">
          <span className="behar-student-progress__eyebrow">
            <Layers3 size={15} />
            {t.eyebrow}
          </span>

          <h1>{t.title}</h1>
          <p>{t.description}</p>
        </div>

        <div
          className="behar-student-progress__hero-icon"
          aria-hidden="true"
        >
          <GraduationCap size={92} strokeWidth={1} />
        </div>
      </header>

      <section className="behar-student-progress__stats">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            className="behar-student-progress__stat"
            key={label}
          >
            <div className="behar-student-progress__stat-icon">
              <Icon size={20} />
            </div>

            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="behar-student-progress__section">
        <div className="behar-student-progress__section-heading">
          <span>{t.coursesEyebrow}</span>
          <h2>{t.coursesTitle}</h2>
          <p>{t.coursesDescription}</p>
        </div>

        {courseProgress.length ? (
          <div className="behar-student-progress__courses">
            {courseProgress.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                locale={locale}
                t={t}
              />
            ))}
          </div>
        ) : (
          <div className="behar-student-progress__empty">
            <BookOpen size={35} strokeWidth={1.4} />
            <h3>{t.emptyTitle}</h3>
            <p>{t.emptyDescription}</p>

            <Link to="/courses">
              {t.explore}
              <ArrowUpRight size={17} />
            </Link>
          </div>
        )}
      </section>

      <section className="behar-student-progress__section">
        <div className="behar-student-progress__section-heading">
          <span>{t.momentumEyebrow}</span>
          <h2>{t.momentumTitle}</h2>
        </div>

        <div className="behar-student-progress__momentum">
          <LevelProgressCard
            totalXP={progress?.totalXP ?? 0}
            language={locale}
          />

          <LearningStreakCard
            activityDates={
              progress?.streak?.activityDates ?? []
            }
            timezone={
              progress?.timezone ?? "Asia/Riyadh"
            }
            language={locale}
          />
        </div>

        <div className="behar-student-progress__weekly-goal">
          <WeeklyLearningGoals
            goal={progress?.weeklyGoal}
            timezone={
              progress?.timezone ?? "Asia/Riyadh"
            }
            language={locale}
          />
        </div>
      </section>

      <section className="behar-student-progress__section">
        <div className="behar-student-progress__section-heading">
          <span>YOUR ACHIEVEMENTS</span>
          <h2>
            {locale === "ar"
              ? "إنجازاتك التعليمية."
              : "Your milestones."}
          </h2>
        </div>

        <div className="behar-student-progress__milestones">
          <div className="behar-student-progress__milestone">
            <Trophy size={23} />
            <strong>
              {number(progress?.level ?? 1, locale)}
            </strong>
            <span>
              {locale === "ar" ? "المستوى الحالي" : "Current level"}
            </span>
          </div>

          <div className="behar-student-progress__milestone">
            <Zap size={23} />
            <strong>
              {number(progress?.totalXP ?? 0, locale)}
            </strong>
            <span>{t.totalXP}</span>
          </div>

          <div className="behar-student-progress__milestone">
            <Trophy size={23} />
            <strong>
              {number(
                progress?.unlockedBadges?.length ?? 0,
                locale
              )}
            </strong>
            <span>
              {locale === "ar"
                ? "الشارات المكتسبة"
                : "Badges earned"}
            </span>
          </div>
        </div>

        <Link
          to="/student/achievements"
          className="behar-student-progress__achievements-link"
        >
          {t.achievements}
          {locale === "ar" ? (
            <ArrowLeft size={17} />
          ) : (
            <ArrowRight size={17} />
          )}
        </Link>
      </section>

      <p className="behar-student-progress__note">
        {t.note}
      </p>
    </main>
  );
}
