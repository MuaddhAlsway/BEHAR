
import { useEffect, useMemo, useState } from "react";

import {
  ArrowUpRight,
  BookOpen,
  Check,
  Clock3,
  Pencil,
  Target,
  Trophy,
  X,
} from "lucide-react";

import {
  GAMIFICATION_GOAL_METRICS,
} from "../../../data/student/gamification";

import {
  createWeeklyGoal,
  getWeeklyGoalSummary,
  getWeekStart,
  rollWeeklyGoal,
} from "../../../utils/weeklyGoalEngine";

import {
  getStudentLocalDate,
} from "../../../utils/streakEngine";

import "../../../styles/student/achievements/WeeklyLearningGoals.css";

const DEFAULT_TARGETS = {
  [GAMIFICATION_GOAL_METRICS.LESSONS_COMPLETED]: 5,
  [GAMIFICATION_GOAL_METRICS.LEARNING_MINUTES]: 120,
  [GAMIFICATION_GOAL_METRICS.QUIZZES_PASSED]: 3,
};

const translations = {
  en: {
    eyebrow: "STAY ON TRACK",
    title: "Weekly learning goal",
    edit: "Edit goal",
    save: "Save goal",
    cancel: "Cancel",
    goal: "Your weekly target",
    completed: "Goal completed!",
    remaining: "remaining",
    progress: "Weekly progress",
    week: "This week",
    daysLeft: "days left",
    dayLeft: "day left",
    today: "Last day",
    lessons: "Lessons completed",
    minutes: "Learning minutes",
    quizzes: "Quizzes passed",
    target: "Weekly target",
    motivation: "Every learning session moves you forward.",
    success: "Excellent work. You've reached your weekly goal.",
    resetInfo: "Progress resets at the start of each week.",
    configure: "Configure your goal",
  },
  ar: {
    eyebrow: "استمر في التقدم",
    title: "هدف التعلم الأسبوعي",
    edit: "تعديل الهدف",
    save: "حفظ الهدف",
    cancel: "إلغاء",
    goal: "هدفك الأسبوعي",
    completed: "اكتمل الهدف!",
    remaining: "متبقي",
    progress: "التقدم الأسبوعي",
    week: "هذا الأسبوع",
    daysLeft: "أيام متبقية",
    dayLeft: "يوم متبقٍ",
    today: "اليوم الأخير",
    lessons: "الدروس المكتملة",
    minutes: "دقائق التعلم",
    quizzes: "الاختبارات المجتازة",
    target: "الهدف الأسبوعي",
    motivation: "كل جلسة تعلم تقربك من هدفك.",
    success: "عمل رائع! لقد حققت هدفك الأسبوعي.",
    resetInfo: "يُعاد ضبط التقدم مع بداية كل أسبوع.",
    configure: "تخصيص الهدف",
  },
};

const formatNumber = (value, language) =>
  new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US"
  ).format(value);

export default function WeeklyLearningGoals({
  goal,
  timezone = "Asia/Riyadh",
  language = "en",
  now,
  onGoalChange,
  className = "",
}) {
  const locale = language === "ar" ? "ar" : "en";
  const t = translations[locale];

  const today = getStudentLocalDate(timezone, now);

  const initialGoal = useMemo(
    () =>
      createWeeklyGoal({
        metric:
          goal?.metric ??
          GAMIFICATION_GOAL_METRICS.LESSONS_COMPLETED,
        target: goal?.target ?? 5,
        progress: goal?.progress ?? 0,
        weekStartDate:
          goal?.weekStartDate ?? getWeekStart(today),
      }),
    [
      goal?.metric,
      goal?.target,
      goal?.progress,
      goal?.weekStartDate,
      today,
    ]
  );

  const [currentGoal, setCurrentGoal] = useState(
    () => rollWeeklyGoal(initialGoal, today)
  );

  const [editing, setEditing] = useState(false);
  const [draftMetric, setDraftMetric] = useState(
    currentGoal.metric
  );
  const [draftTarget, setDraftTarget] = useState(
    String(currentGoal.target)
  );

  useEffect(() => {
    setCurrentGoal(rollWeeklyGoal(initialGoal, today));
  }, [initialGoal, today]);

  const summary = useMemo(
    () =>
      getWeeklyGoalSummary(currentGoal, {
        timezone,
        now,
      }),
    [currentGoal, timezone, now]
  );

  const metricOptions = [
    {
      value: GAMIFICATION_GOAL_METRICS.LESSONS_COMPLETED,
      label: t.lessons,
      icon: BookOpen,
    },
    {
      value: GAMIFICATION_GOAL_METRICS.LEARNING_MINUTES,
      label: t.minutes,
      icon: Clock3,
    },
    {
      value: GAMIFICATION_GOAL_METRICS.QUIZZES_PASSED,
      label: t.quizzes,
      icon: Trophy,
    },
  ];

  const activeMetric = metricOptions.find(
    (item) => item.value === summary.metric
  );

  const MetricIcon = activeMetric?.icon ?? BookOpen;

  function openEditor() {
    setDraftMetric(summary.metric);
    setDraftTarget(String(summary.target));
    setEditing(true);
  }

  function handleMetricChange(event) {
    const metric = event.target.value;

    setDraftMetric(metric);
    setDraftTarget(String(DEFAULT_TARGETS[metric]));
  }

  function saveGoal(event) {
    event.preventDefault();

    const target = Number(draftTarget);

    if (
      !Number.isSafeInteger(target) ||
      target < 1 ||
      target > 10000
    ) {
      return;
    }

    const metricChanged =
      draftMetric !== summary.metric;

    const nextGoal = createWeeklyGoal({
      metric: draftMetric,
      target,
      weekStartDate: summary.weekStartDate,
      progress: metricChanged ? 0 : summary.progress,
    });

    setCurrentGoal(nextGoal);
    setEditing(false);

    onGoalChange?.(nextGoal);
  }

  return (
    <section
      className={`behar-weekly-goal ${className}`}
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-label={t.title}
    >
      <header className="behar-weekly-goal__header">
        <div>
          <div className="behar-weekly-goal__eyebrow">
            <Target size={14} aria-hidden="true" />
            <span>{t.eyebrow}</span>
          </div>

          <h2>{t.title}</h2>
        </div>

        <button
          type="button"
          className="behar-weekly-goal__edit"
          onClick={editing ? () => setEditing(false) : openEditor}
          aria-label={editing ? t.cancel : t.edit}
        >
          {editing ? <X size={18} /> : <Pencil size={18} />}
        </button>
      </header>

      {editing ? (
        <form
          className="behar-weekly-goal__form"
          onSubmit={saveGoal}
        >
          <h3>{t.configure}</h3>

          <label htmlFor="behar-weekly-metric">
            {t.goal}
          </label>

          <select
            id="behar-weekly-metric"
            value={draftMetric}
            onChange={handleMetricChange}
          >
            {metricOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>

          <label htmlFor="behar-weekly-target">
            {t.target}
          </label>

          <input
            id="behar-weekly-target"
            type="number"
            min="1"
            max="10000"
            step="1"
            required
            value={draftTarget}
            onChange={(event) =>
              setDraftTarget(event.target.value)
            }
          />

          <div className="behar-weekly-goal__form-actions">
            <button type="submit">
              <Check size={16} />
              {t.save}
            </button>

            <button
              type="button"
              onClick={() => setEditing(false)}
            >
              {t.cancel}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="behar-weekly-goal__hero">
            <div className="behar-weekly-goal__metric">
              <span className="behar-weekly-goal__metric-icon">
                <MetricIcon
                  size={22}
                  aria-hidden="true"
                />
              </span>

              <span>{activeMetric?.label}</span>
            </div>

            <div className="behar-weekly-goal__numbers">
              <strong>
                {formatNumber(summary.progress, locale)}
              </strong>

              <span>
                / {formatNumber(summary.target, locale)}
              </span>
            </div>

            <div className="behar-weekly-goal__progress-label">
              <span>{t.progress}</span>
              <strong>
                {Math.round(summary.percentage)}%
              </strong>
            </div>

            <div
              className="behar-weekly-goal__track"
              role="progressbar"
              aria-label={t.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(
                summary.percentage
              )}
            >
              <div
                style={{
                  width: `${summary.percentage}%`,
                }}
              />
            </div>

            <div className="behar-weekly-goal__remaining">
              <span>
                {summary.completed
                  ? t.completed
                  : `${formatNumber(
                      summary.remaining,
                      locale
                    )} ${t.remaining}`}
              </span>

              <span>
                {summary.daysRemaining === 0
                  ? t.today
                  : `${formatNumber(
                      summary.daysRemaining,
                      locale
                    )} ${
                      summary.daysRemaining === 1
                        ? t.dayLeft
                        : t.daysLeft
                    }`}
              </span>
            </div>
          </div>

          <footer className="behar-weekly-goal__footer">
            <div className="behar-weekly-goal__footer-icon">
              {summary.completed ? (
                <Trophy size={21} />
              ) : (
                <ArrowUpRight size={21} />
              )}
            </div>

            <div>
              <strong>
                {summary.completed
                  ? t.success
                  : t.motivation}
              </strong>

              <p>{t.resetInfo}</p>
            </div>
          </footer>
        </>
      )}
    </section>
  );
}
