
import { useMemo } from "react";

import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Flame,
  Trophy,
  Zap,
} from "lucide-react";

import {
  getLearningStreakSummary,
} from "../../../utils/streakEngine";

import "../../../styles/student/achievements/LearningStreakCard.css";

const translations = {
  en: {
    eyebrow: "BUILD YOUR MOMENTUM",
    title: "Learning streak",
    days: "days",
    day: "day",
    current: "Current streak",
    longest: "Longest streak",
    weekly: "YOUR LAST 7 DAYS",
    today: "Today",
    active: "Learning completed",
    inactive: "No activity recorded",
    milestone: "Next milestone",
    achieved: "All milestones achieved",
    remaining: "days to go",
    completed: "You learned today!",
    pending: "Complete a lesson to keep your streak alive.",
    start: "Start learning to build your streak.",
  },
  ar: {
    eyebrow: "واصل تقدمك",
    title: "سلسلة التعلم",
    days: "أيام",
    day: "يوم",
    current: "السلسلة الحالية",
    longest: "أطول سلسلة",
    weekly: "آخر 7 أيام",
    today: "اليوم",
    active: "تم التعلم",
    inactive: "لم يتم تسجيل نشاط",
    milestone: "الإنجاز القادم",
    achieved: "حققت جميع الإنجازات",
    remaining: "أيام متبقية",
    completed: "أنجزت التعلم اليوم!",
    pending: "أكمل درسًا للحفاظ على سلسلتك.",
    start: "ابدأ التعلم لبناء سلسلة إنجازاتك.",
  },
};

function formatNumber(value, language) {
  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US"
  ).format(value);
}

export default function LearningStreakCard({
  activityDates = [],
  timezone = "Asia/Riyadh",
  language = "en",
  now,
  className = "",
}) {
  const locale = language === "ar" ? "ar" : "en";
  const t = translations[locale];

  const summary = useMemo(
    () =>
      getLearningStreakSummary({
        activityDates,
        timezone,
        now,
      }),
    [activityDates, timezone, now]
  );

  const weekdayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(
        locale === "ar" ? "ar-SA" : "en-US",
        {
          weekday: "short",
          timeZone: "UTC",
        }
      ),
    [locale]
  );

  const dayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(
        locale === "ar" ? "ar-SA" : "en-US",
        {
          day: "numeric",
          timeZone: "UTC",
        }
      ),
    [locale]
  );

  const dayLabel = (date) => {
    const instant = new Date(`${date}T12:00:00Z`);

    return {
      weekday: weekdayFormatter.format(instant),
      day: dayFormatter.format(instant),
    };
  };

  const milestone = summary.milestones.next;

  const milestoneProgress = milestone
    ? Math.min(
        100,
        (summary.longestDays / milestone) * 100
      )
    : 100;

  const statusMessage = summary.learnedToday
    ? t.completed
    : summary.totalActiveDays === 0
      ? t.start
      : t.pending;

  return (
    <section
      className={`behar-streak-card ${className}`}
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-label={t.title}
    >
      <header className="behar-streak-card__header">
        <div>
          <div className="behar-streak-card__eyebrow">
            <Zap size={14} aria-hidden="true" />
            <span>{t.eyebrow}</span>
          </div>

          <h2>{t.title}</h2>
        </div>

        <div className="behar-streak-card__header-icon">
          <Flame size={22} aria-hidden="true" />
        </div>
      </header>

      <div className="behar-streak-card__hero">
        <div className="behar-streak-card__flame">
          <Flame
            size={52}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>

        <div className="behar-streak-card__hero-copy">
          <div className="behar-streak-card__count">
            <strong>
              {formatNumber(
                summary.currentDays,
                locale
              )}
            </strong>

            <span>
              {summary.currentDays === 1
                ? t.day
                : t.days}
            </span>
          </div>

          <p>{t.current}</p>
        </div>
      </div>

      <div className="behar-streak-card__status">
        <span
          className={`behar-streak-card__status-dot ${
            summary.learnedToday
              ? "is-complete"
              : ""
          }`}
        />

        <span>{statusMessage}</span>

        {summary.learnedToday && (
          <Check size={16} aria-hidden="true" />
        )}
      </div>

      <div className="behar-streak-card__week">
        <div className="behar-streak-card__section-title">
          <span>{t.weekly}</span>
          <CalendarDays size={16} aria-hidden="true" />
        </div>

        <div className="behar-streak-card__days">
          {summary.weeklyActivity.map((item) => {
            const label = dayLabel(item.date);

            return (
              <div
                className="behar-streak-card__day"
                key={item.date}
              >
                <span className="behar-streak-card__weekday">
                  {label.weekday}
                </span>

                <div
                  className={[
                    "behar-streak-card__day-circle",
                    item.active ? "is-active" : "",
                    item.isToday ? "is-today" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  title={`${item.date} — ${
                    item.active ? t.active : t.inactive
                  }`}
                  aria-label={`${item.date}: ${
                    item.active ? t.active : t.inactive
                  }`}
                >
                  {item.active ? (
                    <Check
                      size={17}
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  ) : (
                    <span>{label.day}</span>
                  )}
                </div>

                {item.isToday && (
                  <span className="behar-streak-card__today">
                    {t.today}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="behar-streak-card__bottom">
        <div className="behar-streak-card__record">
          <div className="behar-streak-card__record-icon">
            <Trophy size={20} aria-hidden="true" />
          </div>

          <div>
            <span>{t.longest}</span>
            <strong>
              {formatNumber(
                summary.longestDays,
                locale
              )}{" "}
              {t.days}
            </strong>
          </div>
        </div>

        <div className="behar-streak-card__milestone">
          <div className="behar-streak-card__milestone-top">
            <span>{t.milestone}</span>
            <ArrowUpRight
              size={16}
              aria-hidden="true"
            />
          </div>

          {milestone ? (
            <>
              <strong>
                {formatNumber(milestone, locale)}{" "}
                {t.days}
              </strong>

              <div className="behar-streak-card__milestone-track">
                <div
                  style={{
                    width: `${milestoneProgress}%`,
                  }}
                />
              </div>

              <small>
                {formatNumber(
                  milestone - summary.longestDays,
                  locale
                )}{" "}
                {t.remaining}
              </small>
            </>
          ) : (
            <strong>{t.achieved}</strong>
          )}
        </div>
      </div>
    </section>
  );
}
