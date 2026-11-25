
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  CirclePlay,
  Clock3,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";

import "../../../styles/student/my-learning/my-learning-hero.css";

const copy = {
  en: {
    eyebrow: "BEHAR / YOUR LEARNING SPACE",
    greeting: "Welcome back",
    headingStart: "A library of",
    headingAccent: "everything you're becoming.",
    description:
      "Every course is another chapter. Explore what you've started, recognize how far you've come, and keep building what's next.",
    enrolled: "Enrolled courses",
    inProgress: "In progress",
    completed: "Completed",
    notStarted: "Not started",
    momentum: "YOUR LEARNING MOMENTUM",
    progress: "Overall lesson progress",
    completedLessons: "lessons completed",
    totalLessons: "total lessons",
    studyHours: "Study hours",
    journey: "YOUR JOURNEY, IN MOTION",
    motivation: "Progress doesn't need to be perfect. Just keep moving.",
    explore: "Explore courses",
    chapter: "CHAPTER / 02",
    ariaProgress: "Overall lesson completion",
  },
  ar: {
    eyebrow: "بحار / مساحتك التعليمية",
    greeting: "أهلًا بعودتك",
    headingStart: "مكتبة لكل",
    headingAccent: "ما تطمح أن تصبح عليه.",
    description:
      "كل دورة فصل جديد في رحلتك. استكشف ما بدأت به، واحتفل بما أنجزته، وواصل بناء مستقبلك.",
    enrolled: "الدورات المسجلة",
    inProgress: "قيد التقدم",
    completed: "مكتملة",
    notStarted: "لم تبدأ",
    momentum: "زخم رحلتك التعليمية",
    progress: "التقدم العام في الدروس",
    completedLessons: "دروس مكتملة",
    totalLessons: "إجمالي الدروس",
    studyHours: "ساعات الدراسة",
    journey: "رحلتك مستمرة",
    motivation: "ليس المطلوب أن يكون تقدمك مثاليًا، المهم أن تستمر.",
    explore: "استكشف الدورات",
    chapter: "الفصل / ٠٢",
    ariaProgress: "نسبة إكمال الدروس",
  },
};

function getLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

function usePageLanguage() {
  const [language, setLanguage] = useState(getLanguage);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLanguage(getLanguage());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  return language;
}

function formatNumber(value, language, options = {}) {
  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US",
    options
  ).format(value);
}

function getLearningStats(courses) {
  const enrolled = courses.length;

  const inProgress = courses.filter(
    (course) => course.status === "in_progress"
  ).length;

  const completed = courses.filter(
    (course) => course.status === "completed"
  ).length;

  const notStarted = courses.filter(
    (course) => course.status === "not_started"
  ).length;

  const completedLessons = courses.reduce(
    (sum, course) =>
      sum + (Number(course.completedLessons) || 0),
    0
  );

  const totalLessons = courses.reduce(
    (sum, course) =>
      sum + (Number(course.totalLessons) || 0),
    0
  );

  const progress =
    totalLessons > 0
      ? Math.min(
          100,
          Math.round((completedLessons / totalLessons) * 100)
        )
      : 0;

  return {
    enrolled,
    inProgress,
    completed,
    notStarted,
    completedLessons,
    totalLessons,
    progress,
  };
}

function HeroStat({ icon: Icon, value, label }) {
  return (
    <div className="behar-ml-hero__stat">
      <div className="behar-ml-hero__stat-top">
        <Icon size={19} strokeWidth={1.5} aria-hidden="true" />
        <span className="behar-ml-hero__stat-rule" />
      </div>

      <strong>{value}</strong>
      <span className="behar-ml-hero__stat-label">{label}</span>
    </div>
  );
}

export default function MyLearningHero({
  student = {},
  courses = [],
}) {
  const sectionRef = useRef(null);
  const language = usePageLanguage();
  const t = copy[language];

  const stats = useMemo(
    () => getLearningStats(courses),
    [courses]
  );

  const firstName = student.firstName?.trim() || "";

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        ".behar-ml-hero__animate",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "all",
        }
      );
    }, sectionRef);

    return () => context.revert();
  }, [language]);

  return (
    <section
      ref={sectionRef}
      className="behar-ml-hero"
      dir={language === "ar" ? "rtl" : "ltr"}
      aria-labelledby="behar-ml-hero-heading"
    >
      <div className="behar-ml-hero__top behar-ml-hero__animate">
        <span className="behar-ml-hero__eyebrow">
          <span className="behar-ml-hero__eyebrow-dot" />
          {t.eyebrow}
        </span>

        <span className="behar-ml-hero__chapter">
          {t.chapter}
        </span>
      </div>

      <div className="behar-ml-hero__main">
        <div className="behar-ml-hero__editorial">
          <div className="behar-ml-hero__intro behar-ml-hero__animate">
            <span className="behar-ml-hero__greeting">
              <Sparkles size={15} strokeWidth={1.6} />
              {t.greeting}
              {firstName ? `, ${firstName}` : ""}
            </span>

            <h2 id="behar-ml-hero-heading">
              {t.headingStart}
              <span>{t.headingAccent}</span>
            </h2>

            <p>{t.description}</p>
          </div>

          <div className="behar-ml-hero__quote behar-ml-hero__animate">
            <span className="behar-ml-hero__quote-line" />
            <div>
              <span>{t.journey}</span>
              <p>{t.motivation}</p>
            </div>
          </div>
        </div>

        <div className="behar-ml-hero__momentum behar-ml-hero__animate">
          <div className="behar-ml-hero__momentum-header">
            <span>{t.momentum}</span>
            <ArrowUpRight size={18} strokeWidth={1.5} />
          </div>

          <div className="behar-ml-hero__progress-visual">
            <svg
              viewBox="0 0 220 220"
              className="behar-ml-hero__ring"
              role="img"
              aria-label={`${t.ariaProgress}: ${stats.progress}%`}
            >
              <circle
                cx="110"
                cy="110"
                r="88"
                fill="none"
                stroke="rgba(217,239,116,0.12)"
                strokeWidth="5"
              />

              <circle
                cx="110"
                cy="110"
                r="88"
                fill="none"
                stroke="#D9EF74"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 88}
                strokeDashoffset={
                  2 * Math.PI * 88 *
                  (1 - stats.progress / 100)
                }
                transform="rotate(-90 110 110)"
                className="behar-ml-hero__ring-progress"
              />
            </svg>

            <div className="behar-ml-hero__ring-content">
              <strong>
                {formatNumber(stats.progress, language)}
                <small>%</small>
              </strong>
              <span>{t.progress}</span>
            </div>
          </div>

          <div className="behar-ml-hero__lesson-summary">
            <span>
              <CheckCircle2 size={15} strokeWidth={1.6} />
              {formatNumber(stats.completedLessons, language)}
              {" "}
              {t.completedLessons}
            </span>

            <span>
              <BookOpen size={15} strokeWidth={1.6} />
              {formatNumber(stats.totalLessons, language)}
              {" "}
              {t.totalLessons}
            </span>
          </div>
        </div>
      </div>

      <div className="behar-ml-hero__stats behar-ml-hero__animate">
        <HeroStat
          icon={BookOpen}
          value={formatNumber(stats.enrolled, language)}
          label={t.enrolled}
        />

        <HeroStat
          icon={CirclePlay}
          value={formatNumber(stats.inProgress, language)}
          label={t.inProgress}
        />

        <HeroStat
          icon={CheckCircle2}
          value={formatNumber(stats.completed, language)}
          label={t.completed}
        />

        <HeroStat
          icon={GraduationCap}
          value={formatNumber(stats.notStarted, language)}
          label={t.notStarted}
        />
      </div>

      <div className="behar-ml-hero__bottom behar-ml-hero__animate">
        <span>BEHAR EDUCATION © 2026</span>
        <span>
          <Clock3 size={13} strokeWidth={1.5} />
          {t.journey}
        </span>
      </div>
    </section>
  );
}
