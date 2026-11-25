
import { useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useGamification } from "../../../context/GamificationContext";

import LevelProgressCard from "./LevelProgressCard";
import LearningStreakCard from "./LearningStreakCard";
import WeeklyLearningGoals from "./WeeklyLearningGoals";
import BadgeCollection from "./BadgeCollection";

import {
  GAMIFICATION_BADGES,
} from "../../../data/student/gamification";

import "../../../styles/student/achievements/achievements.css";

const translations = {
  en: {
    back: "Back to dashboard",
    eyebrow: "YOUR LEARNING LEGACY",
    title: "Progress worth remembering.",
    description:
      "A home for your achievements, milestones, and the effort behind them.",
    totalXP: "Total XP",
    level: "Current level",
    badges: "Badges earned",
    lessons: "Lessons completed",
    sectionEyebrow: "YOUR MOMENTUM",
    sectionTitle: "Keep your progress moving.",
    collectionEyebrow: "THE COLLECTION",
    collectionTitle: "Milestones you can keep.",
    historyEyebrow: "THE JOURNEY SO FAR",
    historyTitle: "Achievement history",
    historyEmpty:
      "Your achievement history will appear here as you complete learning activities.",
    lesson: "Lesson completed",
    course: "Course completed",
    quiz: "Quiz passed",
    perfect: "Perfect quiz",
    xp: "XP reward",
    noDate: "Date unavailable",
  },
  ar: {
    back: "العودة إلى لوحة التحكم",
    eyebrow: "رحلتك التعليمية",
    title: "إنجازات تستحق التذكر.",
    description:
      "مساحة تجمع إنجازاتك ومراحل تقدمك والجهد الذي بذلته.",
    totalXP: "نقاط الخبرة",
    level: "المستوى الحالي",
    badges: "الشارات المكتسبة",
    lessons: "الدروس المكتملة",
    sectionEyebrow: "استمر في التقدم",
    sectionTitle: "واصل بناء إنجازاتك.",
    collectionEyebrow: "مجموعة الشارات",
    collectionTitle: "إنجازات تبقى معك.",
    historyEyebrow: "رحلتك حتى الآن",
    historyTitle: "سجل الإنجازات",
    historyEmpty:
      "ستظهر إنجازاتك هنا عند إكمال الأنشطة التعليمية.",
    lesson: "درس مكتمل",
    course: "دورة مكتملة",
    quiz: "اختبار ناجح",
    perfect: "اختبار بدرجة كاملة",
    xp: "مكافأة نقاط الخبرة",
    noDate: "التاريخ غير متوفر",
  },
};

function getBadgeList() {
  return Array.isArray(GAMIFICATION_BADGES)
    ? GAMIFICATION_BADGES
    : Object.values(GAMIFICATION_BADGES ?? {});
}

function getUnlockedCount(progress) {
  const unlocked = new Set(
    (progress?.unlockedBadges ?? [])
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.badgeId ?? item?.id
      )
      .filter(Boolean)
  );

  return getBadgeList().filter((badge) =>
    unlocked.has(badge.id)
  ).length;
}

function formatNumber(value, language) {
  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US"
  ).format(value ?? 0);
}

function formatDate(value, language) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

function getHistory(progress) {
  const transactions = Array.isArray(
    progress?.xpTransactions
  )
    ? progress.xpTransactions
    : [];

  return transactions
    .map((transaction, index) => ({
      id:
        transaction.id ??
        transaction.eventKey ??
        `transaction-${index}`,
      type:
        transaction.eventType ??
        transaction.type ??
        "xp",
      xp:
        transaction.xp ??
        transaction.amount ??
        0,
      date:
        transaction.awardedAt ??
        transaction.createdAt ??
        null,
    }))
    .sort((a, b) => {
      const first = a.date
        ? new Date(a.date).getTime()
        : 0;

      const second = b.date
        ? new Date(b.date).getTime()
        : 0;

      return second - first;
    })
    .slice(0, 8);
}

function getHistoryIcon(type) {
  switch (type) {
    case "lesson_completed":
      return BookOpen;

    case "course_completed":
      return GraduationCap;

    case "quiz_passed":
    case "quiz_perfect":
      return CheckCircle2;

    default:
      return Zap;
  }
}

function getHistoryLabel(type, t) {
  switch (type) {
    case "lesson_completed":
      return t.lesson;

    case "course_completed":
      return t.course;

    case "quiz_passed":
      return t.quiz;

    case "quiz_perfect":
      return t.perfect;

    default:
      return t.xp;
  }
}

export default function Achievements({
  language = "en",
}) {
  const { progress } = useGamification();

  const locale = language === "ar" ? "ar" : "en";
  const t = translations[locale];

  const BackIcon =
    locale === "ar" ? ArrowRight : ArrowLeft;

  const unlockedCount = useMemo(
    () => getUnlockedCount(progress),
    [progress]
  );

  const history = useMemo(
    () => getHistory(progress),
    [progress]
  );

  const stats = [
    {
      label: t.totalXP,
      value: progress?.totalXP ?? 0,
      icon: Zap,
      variant: "xp",
    },
    {
      label: t.level,
      value: progress?.level ?? 1,
      icon: Trophy,
      variant: "level",
    },
    {
      label: t.badges,
      value: unlockedCount,
      icon: Award,
      variant: "badges",
    },
    {
      label: t.lessons,
      value:
        progress?.stats?.lessonsCompleted ?? 0,
      icon: BookOpen,
      variant: "lessons",
    },
  ];

  return (
    <main
      className="behar-achievements-page"
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <Link
        to="/student"
        className="behar-achievements-page__back"
      >
        <BackIcon
          size={16}
          aria-hidden="true"
        />
        {t.back}
      </Link>

      <header className="behar-achievements-hero">
        <div className="behar-achievements-hero__decoration">
          <span />
          <span />
          <span />
        </div>

        <div className="behar-achievements-hero__content">
          <div className="behar-achievements-hero__eyebrow">
            <Sparkles
              size={15}
              aria-hidden="true"
            />
            {t.eyebrow}
          </div>

          <h1>{t.title}</h1>

          <p>{t.description}</p>

          <div className="behar-achievements-hero__stats">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  className="behar-achievements-hero__stat"
                  key={stat.variant}
                >
                  <div className="behar-achievements-hero__stat-top">
                    <Icon
                      size={17}
                      aria-hidden="true"
                    />

                    <span>{stat.label}</span>
                  </div>

                  <strong>
                    {formatNumber(
                      stat.value,
                      locale
                    )}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="behar-achievements-hero__emblem"
          aria-hidden="true"
        >
          <div className="behar-achievements-hero__emblem-inner">
            <Trophy
              size={75}
              strokeWidth={1}
            />
          </div>
        </div>
      </header>

      <section
        className="behar-achievements-page__section"
        aria-labelledby="achievements-momentum-heading"
      >
        <div className="behar-achievements-page__section-header">
          <span>{t.sectionEyebrow}</span>

          <h2 id="achievements-momentum-heading">
            {t.sectionTitle}
          </h2>
        </div>

        <div className="behar-achievements-page__momentum">
          <div className="behar-achievements-page__momentum-main">
            <LevelProgressCard
              totalXP={
                progress?.totalXP ?? 0
              }
              language={locale}
            />
          </div>

          <div className="behar-achievements-page__momentum-side">
            <LearningStreakCard
              activityDates={
                progress?.streak?.activityDates ??
                []
              }
              timezone={
                progress?.timezone ??
                "Asia/Riyadh"
              }
              language={locale}
            />
          </div>
        </div>

        <WeeklyLearningGoals
          goal={progress?.weeklyGoal}
          timezone={
            progress?.timezone ??
            "Asia/Riyadh"
          }
          language={locale}
        />
      </section>

      <section
        className="behar-achievements-page__section"
        aria-labelledby="achievements-collection-heading"
      >
        <div className="behar-achievements-page__section-header">
          <span>{t.collectionEyebrow}</span>

          <h2 id="achievements-collection-heading">
            {t.collectionTitle}
          </h2>
        </div>

        <BadgeCollection
          progress={progress ?? {}}
          language={locale}
        />
      </section>

      <section
        className="behar-achievements-page__section"
        aria-labelledby="achievements-history-heading"
      >
        <div className="behar-achievements-page__section-header">
          <span>{t.historyEyebrow}</span>

          <h2 id="achievements-history-heading">
            {t.historyTitle}
          </h2>
        </div>

        <div className="behar-achievements-history">
          {history.length === 0 ? (
            <div className="behar-achievements-history__empty">
              <div className="behar-achievements-history__empty-icon">
                <CalendarDays
                  size={27}
                  strokeWidth={1.5}
                />
              </div>

              <p>{t.historyEmpty}</p>
            </div>
          ) : (
            <ol className="behar-achievements-history__list">
              {history.map((item) => {
                const Icon = getHistoryIcon(
                  item.type
                );

                return (
                  <li
                    key={item.id}
                    className="behar-achievements-history__item"
                  >
                    <div className="behar-achievements-history__icon">
                      <Icon
                        size={19}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="behar-achievements-history__details">
                      <strong>
                        {getHistoryLabel(
                          item.type,
                          t
                        )}
                      </strong>

                      <span>
                        <Clock3
                          size={12}
                          aria-hidden="true"
                        />

                        {formatDate(
                          item.date,
                          locale
                        ) ?? t.noDate}
                      </span>
                    </div>

                    <div className="behar-achievements-history__reward">
                      <Zap
                        size={15}
                        aria-hidden="true"
                      />

                      +{formatNumber(
                        item.xp,
                        locale
                      )} XP
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>
    </main>
  );
}
