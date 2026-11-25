
import { useMemo } from "react";
import {
  Award,
  BookOpenCheck,
  Flame,
  GraduationCap,
  Sparkles,
  Trophy,
} from "lucide-react";

import { useGamification } from "../../../context/GamificationContext";
import { GAMIFICATION_LEVELS } from "../../../data/student/gamification";

import '../../../styles/student/achievements/AchievementsOverview.css'
const translations = {
  en: {
    eyebrow: "YOUR LEARNING JOURNEY",
    title: "Every step counts.",
    description:
      "Your progress, achievements, and milestones in one place.",
    totalXP: "Total XP",
    currentLevel: "Current Level",
    streak: "Learning Streak",
    badges: "Badges Earned",
    lessons: "Lessons Completed",
    courses: "Courses Completed",
    days: "days",
    nextLevel: "Next level",
    maxLevel: "Highest level achieved",
    xpRemaining: "XP to go",
  },
  ar: {
    eyebrow: "رحلتك التعليمية",
    title: "كل خطوة تصنع فرقاً.",
    description:
      "تقدمك وإنجازاتك ومحطات رحلتك التعليمية في مكان واحد.",
    totalXP: "إجمالي نقاط الخبرة",
    currentLevel: "المستوى الحالي",
    streak: "سلسلة التعلم",
    badges: "الشارات المكتسبة",
    lessons: "الدروس المكتملة",
    courses: "الدورات المكتملة",
    days: "أيام",
    nextLevel: "المستوى التالي",
    maxLevel: "وصلت لأعلى مستوى",
    xpRemaining: "نقطة متبقية",
  },
};

export default function AchievementsOverview({
  language = "en",
}) {
  const { progress } = useGamification();
  const locale = language === "ar" ? "ar" : "en";
  const t = translations[locale];

  const totalXP = Math.max(0, Number(progress?.totalXP) || 0);

  const levelInfo = useMemo(() => {
    const levels = [...GAMIFICATION_LEVELS].sort(
      (a, b) => a.minXP - b.minXP
    );

    const currentIndex = levels.reduce(
      (index, level, i) =>
        totalXP >= level.minXP ? i : index,
      0
    );

    const current = levels[currentIndex];
    const next = levels[currentIndex + 1];

    if (!current) {
      return {
        level: 1,
        name: "",
        percentage: 0,
        remaining: 0,
        isMax: false,
      };
    }

    const requiredXP = next
      ? next.minXP - current.minXP
      : 0;

    const earnedXP = totalXP - current.minXP;

    return {
      level: current.level,
      name:
        typeof current.name === "object"
          ? current.name[locale] ?? current.name.en
          : current.name ?? "",
      percentage: next
        ? Math.min(
            100,
            Math.max(
              0,
              Math.round((earnedXP / requiredXP) * 100)
            )
          )
        : 100,
      remaining: next
        ? Math.max(0, next.minXP - totalXP)
        : 0,
      isMax: !next,
    };
  }, [totalXP, locale]);

  const stats = [
    {
      key: "xp",
      label: t.totalXP,
      value: totalXP.toLocaleString(locale),
      icon: Sparkles,
    },
    {
      key: "level",
      label: t.currentLevel,
      value: levelInfo.level,
      icon: Trophy,
    },
    {
      key: "streak",
      label: t.streak,
      value: `${progress?.streak?.currentDays ?? 0} ${t.days}`,
      icon: Flame,
    },
    {
      key: "badges",
      label: t.badges,
      value: progress?.unlockedBadges?.length ?? 0,
      icon: Award,
    },
    {
      key: "lessons",
      label: t.lessons,
      value: progress?.stats?.lessonsCompleted ?? 0,
      icon: BookOpenCheck,
    },
    {
      key: "courses",
      label: t.courses,
      value: progress?.stats?.coursesCompleted ?? 0,
      icon: GraduationCap,
    },
  ];

  return (
    <section
      className="behar-achievements-overview"
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-labelledby="achievements-overview-title"
    >
      <header className="behar-achievements-overview__header">
        <span className="behar-achievements-overview__eyebrow">
          <Sparkles size={15} />
          {t.eyebrow}
        </span>

        <h1 id="achievements-overview-title">
          {t.title}
        </h1>

        <p>{t.description}</p>
      </header>

      <div className="behar-achievements-overview__stats">
        {stats.map(({ key, label, value, icon: Icon }) => (
          <article
            className="behar-achievements-overview__stat"
            key={key}
          >
            <div className="behar-achievements-overview__stat-top">
              <span>{label}</span>
              <Icon size={19} aria-hidden="true" />
            </div>

            <strong>{value}</strong>
          </article>
        ))}
      </div>

      <div className="behar-achievements-overview__level">
        <div className="behar-achievements-overview__level-header">
          <div>
            <span>{t.currentLevel}</span>
            <h2>
              {levelInfo.level}
              {levelInfo.name
                ? ` — ${levelInfo.name}`
                : ""}
            </h2>
          </div>

          <strong>{levelInfo.percentage}%</strong>
        </div>

        <div
          className="behar-achievements-overview__progress"
          role="progressbar"
          aria-label={t.nextLevel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={levelInfo.percentage}
        >
          <span
            style={{
              width: `${levelInfo.percentage}%`,
            }}
          />
        </div>

        <p>
          {levelInfo.isMax
            ? t.maxLevel
            : `${levelInfo.remaining.toLocaleString(locale)} ${t.xpRemaining}`}
        </p>
      </div>
    </section>
  );
}
