
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Target, Sparkles } from "lucide-react";
import gsap from "gsap";

import "../../../styles/student/dashboard-welcome.css";

const CURRENT_DATE = new Date();

const translations = {
  en: {
    eyebrow: "YOUR LEARNING SPACE",
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
    headline: "Keep your",
    headlineAccent: "curiosity alive.",
    description:
      "Every lesson is a step forward. Pick up where you left off and make today count.",
    weeklyGoal: "THIS WEEK'S GOAL",
    hours: "hours",
    completed: "completed",
    goal: "YOUR NORTH STAR",
    streak: "DAY STREAK",
    explore: "Explore courses",
    progressLabel: "Weekly learning goal progress",
  },
  ar: {
    eyebrow: "مساحتك للتعلّم",
    morning: "صباح الخير",
    afternoon: "مساء الخير",
    evening: "مساء الخير",
    headline: "واصل رحلتك",
    headlineAccent: "بشغف وفضول.",
    description:
      "كل درس هو خطوة إلى الأمام. أكمل من حيث توقفت واجعل يومك مليئًا بالإنجاز.",
    weeklyGoal: "هدف هذا الأسبوع",
    hours: "ساعات",
    completed: "مكتمل",
    goal: "هدفك التعليمي",
    streak: "أيام متتالية",
    explore: "استكشف الدورات",
    progressLabel: "التقدم نحو هدف التعلّم الأسبوعي",
  },
};

function getGreeting(language) {
  const hour = new Date().getHours();

  if (hour < 12) return translations[language].morning;
  if (hour < 18) return translations[language].afternoon;

  return translations[language].evening;
}

function DashboardWelcome({ student }) {
  const sectionRef = useRef(null);
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

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".behar-welcome__animate",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "all",
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [language]);

  const t = translations[language];
  const isArabic = language === "ar";

  const completed = Number(student?.weeklyCompletedHours) || 0;
  const goal = Number(student?.weeklyGoalHours) || 0;
  const progress =
    goal > 0
      ? Math.min(100, Math.max(0, (completed / goal) * 100))
      : 0;

  const firstName = student?.firstName || (isArabic ? "المتعلم" : "Learner");
  const learningGoal =
    student?.learningGoal?.[language] || "";

  const currentDate = CURRENT_DATE;
  const formattedDate = new Intl.DateTimeFormat(
    isArabic ? "ar-SA" : "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    }
  ).format(currentDate);

  return (
    <section
      ref={sectionRef}
      className="behar-welcome"
      dir={isArabic ? "rtl" : "ltr"}
      aria-labelledby="behar-welcome-heading"
    >
      <div className="behar-welcome__texture" aria-hidden="true" />

      <div className="behar-welcome__main">
        <div className="behar-welcome__top behar-welcome__animate">
          <span className="behar-welcome__eyebrow">
            <span className="behar-welcome__eyebrow-dot" />
            {t.eyebrow}
          </span>

          <span className="behar-welcome__date">
            {formattedDate}
          </span>
        </div>

        <div className="behar-welcome__body">
          <div className="behar-welcome__intro">
            <p className="behar-welcome__greeting behar-welcome__animate">
              {getGreeting(language)}, {firstName}.
            </p>

            <h1
              id="behar-welcome-heading"
              className="behar-welcome__heading behar-welcome__animate"
            >
              <span>{t.headline}</span>
              <span className="behar-welcome__heading-accent">
                {t.headlineAccent}
              </span>
            </h1>

            <p className="behar-welcome__description behar-welcome__animate">
              {t.description}
            </p>
          </div>

          <div className="behar-welcome__symbol" aria-hidden="true">
            <div className="behar-welcome__symbol-ring">
              <div className="behar-welcome__symbol-ring-inner">
                <Sparkles size={42} strokeWidth={1} />
              </div>
            </div>
            <span className="behar-welcome__symbol-dot" />
          </div>
        </div>
      </div>

      <div className="behar-welcome__bottom">
        <div className="behar-welcome__goal behar-welcome__animate">
          <div className="behar-welcome__goal-heading">
            <Target size={17} strokeWidth={1.7} />
            <span>{t.goal}</span>
          </div>

          <p>{learningGoal}</p>
        </div>

        <div className="behar-welcome__weekly behar-welcome__animate">
          <div className="behar-welcome__weekly-top">
            <span>{t.weeklyGoal}</span>

            <strong>
              {completed} / {goal} {t.hours}
            </strong>
          </div>

          <div
            className="behar-welcome__progress"
            role="progressbar"
            aria-label={t.progressLabel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="behar-welcome__streak behar-welcome__animate">
          <strong>{student?.currentStreak ?? 0}</strong>
          <span>{t.streak}</span>
        </div>

        <a
          href="/courses"
          className="behar-welcome__explore behar-welcome__animate"
        >
          <span>{t.explore}</span>
          <ArrowUpRight size={19} strokeWidth={1.7} />
        </a>
      </div>
    </section>
  );
}

export default DashboardWelcome;
