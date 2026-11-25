
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
  Flame,
  Target,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import gsap from "gsap";

import "../../../styles/student/weekly-activity.css";

const translations = {
  en: {
    eyebrow: "YOUR LEARNING RHYTHM",
    heading: "A week of",
    headingAccent: "progress.",
    description:
      "A closer look at the time and consistency you're investing in your learning journey.",
    thisWeek: "THIS WEEK",
    totalTime: "TOTAL STUDY TIME",
    weeklyGoal: "WEEKLY GOAL",
    goalReached: "of your goal reached",
    remaining: "hours to go",
    goalComplete: "Weekly goal achieved",
    dailyActivity: "DAILY ACTIVITY",
    hours: "hours",
    hourShort: "h",
    lessons: "lessons",
    lesson: "lesson",
    noLessons: "No lessons completed",
    noActivity: "No study activity",
    previousWeek: "VS. PREVIOUS WEEK",
    moreThanLastWeek: "more than last week",
    lessThanLastWeek: "less than last week",
    sameAsLastWeek: "Same as last week",
    activeDays: "ACTIVE DAYS",
    streak: "DAY STREAK",
    bestDay: "MOST ACTIVE DAY",
    selectDay: "Select a day to see its activity",
    selectedDay: "SELECTED DAY",
    learningTime: "Study time",
    lessonsCompleted: "Lessons completed",
    dailyAverage: "DAILY AVERAGE",
    footer: "CONSISTENCY BUILDS MOMENTUM",
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun",
  },
  ar: {
    eyebrow: "إيقاع رحلتك التعليمية",
    heading: "أسبوع من",
    headingAccent: "التقدم.",
    description:
      "نظرة على الوقت والاستمرارية التي تستثمرها في رحلتك التعليمية.",
    thisWeek: "هذا الأسبوع",
    totalTime: "إجمالي وقت التعلّم",
    weeklyGoal: "الهدف الأسبوعي",
    goalReached: "من هدفك مكتمل",
    remaining: "ساعات متبقية",
    goalComplete: "تم تحقيق الهدف الأسبوعي",
    dailyActivity: "النشاط اليومي",
    hours: "ساعات",
    hourShort: "س",
    lessons: "دروس",
    lesson: "درس",
    noLessons: "لم تكتمل أي دروس",
    noActivity: "لا يوجد نشاط تعليمي",
    previousWeek: "مقارنة بالأسبوع السابق",
    moreThanLastWeek: "أكثر من الأسبوع السابق",
    lessThanLastWeek: "أقل من الأسبوع السابق",
    sameAsLastWeek: "نفس الأسبوع السابق",
    activeDays: "أيام النشاط",
    streak: "أيام متتالية",
    bestDay: "اليوم الأكثر نشاطًا",
    selectDay: "اختر يومًا لعرض نشاطه",
    selectedDay: "اليوم المحدد",
    learningTime: "وقت التعلّم",
    lessonsCompleted: "الدروس المكتملة",
    dailyAverage: "المتوسط اليومي",
    footer: "الاستمرارية تصنع الإنجاز",
    monday: "الإثنين",
    tuesday: "الثلاثاء",
    wednesday: "الأربعاء",
    thursday: "الخميس",
    friday: "الجمعة",
    saturday: "السبت",
    sunday: "الأحد",
  },
};

const weekdayKeys = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

function parseLocalDate(value) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatNumber(value, language, digits = 1) {
  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US",
    {
      maximumFractionDigits: digits,
    }
  ).format(value);
}

function formatDate(value, language) {
  const date = parseLocalDate(value);

  if (!date) return value || "";

  return new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-US",
    {
      month: "short",
      day: "numeric",
    }
  ).format(date);
}

function getDayName(value, language) {
  const date = parseLocalDate(value);

  if (!date) return "";

  return translations[language][weekdayKeys[date.getDay()]];
}

function useDashboardLanguage() {
  const [language, setLanguage] = useState(() =>
    document.documentElement.lang === "ar" ? "ar" : "en"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLanguage(
        document.documentElement.lang === "ar" ? "ar" : "en"
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  return language;
}

function WeeklyActivity({ activity }) {
  const sectionRef = useRef(null);
  const language = useDashboardLanguage();

  const [selectedDate, setSelectedDate] = useState(null);

  const t = translations[language];
  const isArabic = language === "ar";

  const days = useMemo(
    () =>
      (activity?.days || []).map((day) => ({
        ...day,
        hours: Math.max(0, Number(day.hours) || 0),
        lessonsCompleted: Math.max(
          0,
          Number(day.lessonsCompleted) || 0
        ),
      })),
    [activity?.days]
  );

  const totalHours = days.reduce(
    (sum, day) => sum + day.hours,
    0
  );

  const goalHours = Math.max(
    0,
    Number(activity?.goalHours) || 0
  );

  const previousWeekHours = Math.max(
    0,
    Number(activity?.previousWeekHours) || 0
  );

  const goalProgress =
    goalHours > 0
      ? Math.min(100, (totalHours / goalHours) * 100)
      : 0;

  const remainingHours = Math.max(0, goalHours - totalHours);

  const activeDays = days.filter((day) => day.hours > 0).length;

  const dailyAverage =
    days.length > 0 ? totalHours / days.length : 0;

  const _bestDay = days.reduce(
    (best, day) =>
      !best || day.hours > best.hours ? day : best,
    null
  );

  const maxHours = Math.max(
    1,
    ...days.map((day) => day.hours)
  );

  const comparison =
    previousWeekHours > 0
      ? ((totalHours - previousWeekHours) /
          previousWeekHours) *
        100
      : null;

  const selectedDay =
    days.find((day) => day.date === selectedDate) ||
    days[0] ||
    null;

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".behar-weekly__reveal",
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "all",
        }
      );

      gsap.fromTo(
        ".behar-weekly__bar-fill",
        {
          scaleY: 0,
          transformOrigin: "bottom center",
        },
        {
          scaleY: 1,
          duration: 0.9,
          stagger: 0.07,
          delay: 0.2,
          ease: "power3.out",
        }
      );
    }, sectionRef);

    return () => context.revert();
  }, [language, activity]);

  return (
    <section
      ref={sectionRef}
      className="behar-weekly"
      dir={isArabic ? "rtl" : "ltr"}
      aria-labelledby="behar-weekly-heading"
    >
      {/* SECTION HEADER */}

      <header className="behar-weekly__header behar-weekly__reveal">
        <div>
          <span className="behar-weekly__eyebrow">
            <span className="behar-weekly__eyebrow-line" />
            {t.eyebrow}
          </span>

          <h2
            id="behar-weekly-heading"
            className="behar-weekly__heading"
          >
            {t.heading} <span>{t.headingAccent}</span>
          </h2>

          <p className="behar-weekly__description">
            {t.description}
          </p>
        </div>

        <span className="behar-weekly__index">
          05 / BEHAR
        </span>
      </header>

      <div className="behar-weekly__layout">
        {/* MAIN CHART */}

        <div className="behar-weekly__chart-panel behar-weekly__reveal">
          <div className="behar-weekly__chart-top">
            <div>
              <span className="behar-weekly__label">
                {t.totalTime}
              </span>

              <div className="behar-weekly__total">
                <strong>
                  {formatNumber(totalHours, language)}
                </strong>
                <span>{t.hours}</span>
              </div>
            </div>

            <div className="behar-weekly__date-range">
              <Activity size={16} />
              <span>
                {formatDate(activity?.weekStart, language)}
                {" — "}
                {formatDate(activity?.weekEnd, language)}
              </span>
            </div>
          </div>

          <div className="behar-weekly__chart-meta">
            <span className="behar-weekly__legend">
              <span />
              {t.dailyActivity}
            </span>

            <span className="behar-weekly__chart-unit">
              {t.hours}
            </span>
          </div>

          <div className="behar-weekly__chart">
            <div
              className="behar-weekly__chart-grid"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="behar-weekly__bars">
              {days.map((day) => {
                const height =
                  day.hours > 0
                    ? Math.max(
                        7,
                        (day.hours / maxHours) * 100
                      )
                    : 0;

                const isSelected =
                  selectedDay?.date === day.date;

                return (
                  <button
                    key={day.date}
                    type="button"
                    className={[
                      "behar-weekly__day",
                      isSelected
                        ? "behar-weekly__day--selected"
                        : "",
                      day.hours === 0
                        ? "behar-weekly__day--empty"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => setSelectedDate(day.date)}
                    aria-pressed={isSelected}
                    aria-label={`${getDayName(
                      day.date,
                      language
                    )}, ${formatDate(
                      day.date,
                      language
                    )}: ${formatNumber(
                      day.hours,
                      language
                    )} ${t.hours}`}
                  >
                    <span className="behar-weekly__bar-area">
                      <span
                        className="behar-weekly__bar-fill"
                        style={{
                          height: `${height}%`,
                        }}
                      >
                        {day.hours > 0 && (
                          <span className="behar-weekly__bar-value">
                            {formatNumber(
                              day.hours,
                              language
                            )}
                            {t.hourShort}
                          </span>
                        )}
                      </span>
                    </span>

                    <span className="behar-weekly__day-label">
                      {getDayName(day.date, language)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SELECTED DAY DETAILS */}

          {selectedDay && (
            <div
              className="behar-weekly__selected"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="behar-weekly__selected-heading">
                <span>{t.selectedDay}</span>
                <strong>
                  {getDayName(selectedDay.date, language)}
                  {" · "}
                  {formatDate(selectedDay.date, language)}
                </strong>
              </div>

              <div className="behar-weekly__selected-stats">
                <span>
                  <Clock3 size={15} />
                  {t.learningTime}:{" "}
                  <strong>
                    {formatNumber(
                      selectedDay.hours,
                      language
                    )}{" "}
                    {t.hours}
                  </strong>
                </span>

                <span>
                  <BookOpen size={15} />
                  {t.lessonsCompleted}:{" "}
                  <strong>
                    {formatNumber(
                      selectedDay.lessonsCompleted,
                      language,
                      0
                    )}
                  </strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* WEEKLY GOAL PANEL */}

        <aside className="behar-weekly__goal-panel behar-weekly__reveal">
          <div className="behar-weekly__goal-top">
            <span className="behar-weekly__goal-icon">
              <Target size={22} strokeWidth={1.5} />
            </span>

            <span className="behar-weekly__goal-index">
              01 / GOAL
            </span>
          </div>

          <div className="behar-weekly__goal-content">
            <span className="behar-weekly__goal-label">
              {t.weeklyGoal}
            </span>

            <div className="behar-weekly__goal-numbers">
              <strong>
                {formatNumber(totalHours, language)}
              </strong>

              <span>
                / {formatNumber(goalHours, language)}{" "}
                {t.hours}
              </span>
            </div>

            <div
              className="behar-weekly__goal-track"
              role="progressbar"
              aria-label={t.weeklyGoal}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(goalProgress)}
            >
              <span
                style={{ width: `${goalProgress}%` }}
              />
            </div>

            <p className="behar-weekly__goal-progress">
              {Math.round(goalProgress)}% {t.goalReached}
            </p>
          </div>

          <div className="behar-weekly__goal-bottom">
            <TrendingUp size={18} />

            <span>
              {remainingHours > 0
                ? `${formatNumber(
                    remainingHours,
                    language
                  )} ${t.remaining}`
                : t.goalComplete}
            </span>
          </div>
        </aside>
      </div>

      {/* SECONDARY STATISTICS */}

      <div className="behar-weekly__insights">
        <div className="behar-weekly__insight behar-weekly__reveal">
          <div className="behar-weekly__insight-top">
            <span>{t.activeDays}</span>
            <Activity size={18} />
          </div>

          <strong>
            {formatNumber(activeDays, language, 0)}
            <small> / {days.length}</small>
          </strong>
        </div>

        <div className="behar-weekly__insight behar-weekly__reveal">
          <div className="behar-weekly__insight-top">
            <span>{t.streak}</span>
            <Flame size={18} />
          </div>

          <strong>
            {formatNumber(
              activity?.currentStreak || 0,
              language,
              0
            )}
            <small> {t.days}</small>
          </strong>
        </div>

        <div className="behar-weekly__insight behar-weekly__reveal">
          <div className="behar-weekly__insight-top">
            <span>{t.dailyAverage}</span>
            <Clock3 size={18} />
          </div>

          <strong>
            {formatNumber(dailyAverage, language)}
            <small> {t.hourShort}</small>
          </strong>
        </div>

        <div className="behar-weekly__insight behar-weekly__reveal">
          <div className="behar-weekly__insight-top">
            <span>{t.previousWeek}</span>

            {comparison !== null && comparison < 0 ? (
              <ArrowDownRight size={18} />
            ) : (
              <ArrowUpRight size={18} />
            )}
          </div>

          <strong>
            {comparison === null
              ? "—"
              : `${comparison > 0 ? "+" : ""}${formatNumber(
                  comparison,
                  language,
                  0
                )}%`}
          </strong>
        </div>
      </div>

      <footer className="behar-weekly__footer behar-weekly__reveal">
        <span className="behar-weekly__footer-dot" />
        {t.footer}
      </footer>
    </section>
  );
}

export default WeeklyActivity;
