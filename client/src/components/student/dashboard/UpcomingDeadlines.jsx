
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  Clock3,
  FileQuestion,
  GraduationCap,
  Radio,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import gsap from "gsap";

import "../../../styles/student/upcoming-deadlines.css";

const CURRENT_TIMESTAMP = Date.now();

const translations = {
  en: {
    eyebrow: "STAY ONE STEP AHEAD",
    heading: "What's coming",
    headingAccent: "next.",
    description:
      "Your assignments, assessments, and learning sessions — organized around what matters next.",
    viewAll: "View calendar",
    nextDeadline: "NEXT ON YOUR RADAR",
    upcoming: "UPCOMING SCHEDULE",
    deadline: "Deadline",
    scheduled: "Scheduled session",
    assignment: "Assignment",
    quiz: "Quiz",
    exam: "Exam",
    live_session: "Live session",
    high: "High priority",
    medium: "Medium priority",
    low: "Low priority",
    pending: "Pending",
    completed: "Completed",
    overdue: "Overdue",
    dueToday: "Due today",
    dueTomorrow: "Due tomorrow",
    daysLeft: "days left",
    hoursLeft: "hours left",
    minutesLeft: "minutes left",
    dueIn: "Due in",
    openDetails: "View details",
    schedule: "Your schedule",
    itemsAhead: "items ahead",
    allClear: "You're all caught up.",
    emptyDescription:
      "No upcoming deadlines right now. Enjoy the breathing room and keep learning.",
    emptyAction: "Explore courses",
    footer: "GOOD PLANNING MAKES ROOM FOR GREAT LEARNING",
    timezone: "Times shown in your local timezone",
    actionUnavailable: "Available when the learning workspace launches",
  },
  ar: {
    eyebrow: "كن دائمًا مستعدًا",
    heading: "ما الذي",
    headingAccent: "ينتظرك؟",
    description:
      "واجباتك واختباراتك وجلساتك التعليمية مرتبة حسب الأولوية والموعد.",
    viewAll: "عرض التقويم",
    nextDeadline: "أقرب موعد قادم",
    upcoming: "جدول المواعيد القادمة",
    deadline: "الموعد النهائي",
    scheduled: "جلسة مجدولة",
    assignment: "واجب",
    quiz: "اختبار قصير",
    exam: "اختبار نهائي",
    live_session: "جلسة مباشرة",
    high: "أولوية عالية",
    medium: "أولوية متوسطة",
    low: "أولوية منخفضة",
    pending: "قيد الانتظار",
    completed: "مكتمل",
    overdue: "متأخر",
    dueToday: "اليوم",
    dueTomorrow: "غدًا",
    daysLeft: "أيام متبقية",
    hoursLeft: "ساعات متبقية",
    minutesLeft: "دقائق متبقية",
    dueIn: "متبقي",
    openDetails: "عرض التفاصيل",
    schedule: "جدولك",
    itemsAhead: "مواعيد قادمة",
    allClear: "أنت على المسار الصحيح.",
    emptyDescription:
      "لا توجد مواعيد قادمة حاليًا. استمتع بوقتك وواصل التعلّم.",
    emptyAction: "استكشف الدورات",
    footer: "التخطيط الجيد يصنع مساحة للتعلّم المميز",
    timezone: "تُعرض المواعيد حسب توقيت جهازك",
    actionUnavailable: "ستتوفر عند إطلاق مساحة التعلّم",
  },
};

const typeIcons = {
  assignment: ClipboardList,
  quiz: FileQuestion,
  exam: GraduationCap,
  live_session: Radio,
};

function localized(value, language) {
  if (typeof value === "string") return value;
  return value?.[language] || value?.en || "";
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

function formatDate(value, language, options = {}) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-US",
    {
      day: "numeric",
      month: "short",
      ...options,
    }
  ).format(date);
}

function formatTime(value, language) {
  return formatDate(value, language, {
    hour: "numeric",
    minute: "2-digit",
    day: undefined,
    month: undefined,
  });
}

function getTimeRemaining(value, now, t) {
  const difference = new Date(value).getTime() - now;

  if (!Number.isFinite(difference)) {
    return { label: "—", urgency: "normal" };
  }

  if (difference < 0) {
    return { label: t.overdue, urgency: "overdue" };
  }

  const minutes = Math.ceil(difference / 60000);
  const hours = Math.ceil(difference / 3600000);
  const days = Math.ceil(difference / 86400000);

  if (minutes <= 60) {
    return {
      label: `${minutes} ${t.minutesLeft}`,
      urgency: "urgent",
    };
  }

  if (hours <= 24) {
    return {
      label: `${hours} ${t.hoursLeft}`,
      urgency: "urgent",
    };
  }

  if (days <= 3) {
    return {
      label: `${days} ${t.daysLeft}`,
      urgency: "soon",
    };
  }

  return {
    label: `${days} ${t.daysLeft}`,
    urgency: "normal",
  };
}

function getDateParts(value, language) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { day: "—", month: "—" };
  }

  const locale = language === "ar" ? "ar-SA" : "en-US";

  return {
    day: new Intl.DateTimeFormat(locale, {
      day: "2-digit",
    }).format(date),
    month: new Intl.DateTimeFormat(locale, {
      month: "short",
    }).format(date),
  };
}

function DeadlineAction({
  item,
  t,
  enabled,
  className,
  children,
}) {
  if (!enabled) {
    return (
      <button
        type="button"
        className={className}
        disabled
        title={t.actionUnavailable}
      >
        {children}
      </button>
    );
  }

  return (
    <Link to={item.destination} className={className}>
      {children}
    </Link>
  );
}

function FeaturedDeadline({
  item,
  language,
  t,
  now,
  actionsEnabled,
}) {
  const Icon = typeIcons[item.type] || CalendarDays;
  const remaining = getTimeRemaining(item.dueAt, now, t);
  const date = getDateParts(item.dueAt, language);

  return (
    <article className="behar-deadlines__featured behar-deadlines__reveal">
      <div className="behar-deadlines__featured-top">
        <span className="behar-deadlines__featured-eyebrow">
          <span className="behar-deadlines__pulse" />
          {t.nextDeadline}
        </span>

        <span className="behar-deadlines__featured-count">
          01 / 01
        </span>
      </div>

      <div className="behar-deadlines__featured-main">
        <div className="behar-deadlines__featured-date">
          <strong>{date.day}</strong>
          <span>{date.month}</span>
        </div>

        <div className="behar-deadlines__featured-content">
          <span className="behar-deadlines__type">
            <Icon size={15} />
            {t[item.type] || item.type}
          </span>

          <h3>
            {localized(item.title, language)}
          </h3>

          <p>{localized(item.course?.title, language)}</p>
        </div>
      </div>

      <div className="behar-deadlines__featured-bottom">
        <div className="behar-deadlines__featured-info">
          <span>
            <Clock3 size={15} />
            {formatTime(item.dueAt, language)}
          </span>

          <span
            className={`behar-deadlines__remaining behar-deadlines__remaining--${remaining.urgency}`}
          >
            <AlertCircle size={15} />
            {remaining.label}
          </span>
        </div>

        <DeadlineAction
          item={item}
          t={t}
          enabled={actionsEnabled}
          className="behar-deadlines__featured-action"
        >
          <span>
            {actionsEnabled
              ? t.openDetails
              : t.actionUnavailable}
          </span>
          <ArrowUpRight size={18} />
        </DeadlineAction>
      </div>

      <div
        className="behar-deadlines__featured-decoration"
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
      </div>
    </article>
  );
}

function DeadlineRow({
  item,
  language,
  t,
  now,
  actionsEnabled,
}) {
  const Icon = typeIcons[item.type] || CalendarDays;
  const date = getDateParts(item.dueAt, language);
  const remaining = getTimeRemaining(item.dueAt, now, t);

  return (
    <article className="behar-deadlines__row behar-deadlines__reveal">
      <div className="behar-deadlines__row-date">
        <strong>{date.day}</strong>
        <span>{date.month}</span>
      </div>

      <div className="behar-deadlines__row-icon">
        <Icon size={20} strokeWidth={1.5} />
      </div>

      <div className="behar-deadlines__row-content">
        <div className="behar-deadlines__row-meta">
          <span>{t[item.type] || item.type}</span>
          <span className="behar-deadlines__meta-separator" />
          <span>{formatTime(item.dueAt, language)}</span>
        </div>

        <h3>{localized(item.title, language)}</h3>

        <p>{localized(item.course?.title, language)}</p>
      </div>

      <div className="behar-deadlines__row-end">
        <span
          className={`behar-deadlines__remaining behar-deadlines__remaining--${remaining.urgency}`}
        >
          {remaining.label}
        </span>

        <DeadlineAction
          item={item}
          t={t}
          enabled={actionsEnabled}
          className="behar-deadlines__row-action"
        >
          {language === "ar" ? (
            <ArrowLeft size={19} />
          ) : (
            <ArrowRight size={19} />
          )}
        </DeadlineAction>
      </div>
    </article>
  );
}

function UpcomingDeadlines({
  deadlines = [],
  actionsEnabled = false,
}) {
  const sectionRef = useRef(null);
  const language = useDashboardLanguage();
  const t = translations[language];

  // Fixed at render time. A new render refreshes the
  // relative deadline labels.
  const now = CURRENT_TIMESTAMP;

  const sortedDeadlines = useMemo(
    () =>
      deadlines
        .filter(
          (item) =>
            item.status !== "completed" &&
            Number.isFinite(
              new Date(item.dueAt).getTime()
            )
        )
        .sort(
          (a, b) =>
            new Date(a.dueAt).getTime() -
            new Date(b.dueAt).getTime()
        ),
    [deadlines]
  );

  const featured = sortedDeadlines[0];
  const remaining = sortedDeadlines.slice(1, 4);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".behar-deadlines__reveal",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.07,
          ease: "power3.out",
          clearProps: "all",
        }
      );
    }, sectionRef);

    return () => context.revert();
  }, [language, deadlines]);

  return (
    <section
      ref={sectionRef}
      className="behar-deadlines"
      dir={language === "ar" ? "rtl" : "ltr"}
      aria-labelledby="behar-deadlines-heading"
    >
      <header className="behar-deadlines__header behar-deadlines__reveal">
        <div>
          <span className="behar-deadlines__eyebrow">
            <span className="behar-deadlines__eyebrow-line" />
            {t.eyebrow}
          </span>

          <h2
            id="behar-deadlines-heading"
            className="behar-deadlines__heading"
          >
            {t.heading} <span>{t.headingAccent}</span>
          </h2>

          <p className="behar-deadlines__description">
            {t.description}
          </p>
        </div>

        {actionsEnabled ? (
          <Link
            to="/student/calendar"
            className="behar-deadlines__view-all"
          >
            {t.viewAll}
            <ArrowUpRight size={18} />
          </Link>
        ) : (
          <span className="behar-deadlines__index">
            06 / BEHAR
          </span>
        )}
      </header>

      {sortedDeadlines.length === 0 ? (
        <div className="behar-deadlines__empty behar-deadlines__reveal">
          <span className="behar-deadlines__empty-icon">
            <CheckCircle2 size={40} strokeWidth={1.3} />
          </span>

          <h3>{t.allClear}</h3>
          <p>{t.emptyDescription}</p>

          <Link to="/courses">
            {t.emptyAction}
            <ArrowUpRight size={18} />
          </Link>
        </div>
      ) : (
        <>
          <FeaturedDeadline
            item={featured}
            language={language}
            t={t}
            now={now}
            actionsEnabled={actionsEnabled}
          />

          {remaining.length > 0 && (
            <div className="behar-deadlines__schedule">
              <div className="behar-deadlines__schedule-header behar-deadlines__reveal">
                <span>{t.upcoming}</span>
                <span>
                  {String(remaining.length).padStart(
                    2,
                    "0"
                  )}
                </span>
              </div>

              <div className="behar-deadlines__rows">
                {remaining.map((item) => (
                  <DeadlineRow
                    key={item.id}
                    item={item}
                    language={language}
                    t={t}
                    now={now}
                    actionsEnabled={actionsEnabled}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <footer className="behar-deadlines__footer behar-deadlines__reveal">
        <span>
          <span className="behar-deadlines__footer-dot" />
          {t.footer}
        </span>

        <span>
          <Clock3 size={14} />
          {t.timezone}
        </span>
      </footer>
    </section>
  );
}

export default UpcomingDeadlines;
