
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  CheckCircle2,
  Clock3,
  Award,
  Flame,
  ArrowUpRight,
} from "lucide-react";
import gsap from "gsap";

import "../../../styles/student/learning-stats.css";

const translations = {
  en: {
    eyebrow: "YOUR LEARNING IN NUMBERS",
    heading: "Progress at",
    headingAccent: "a glance.",
    description:
      "Every hour invested, every lesson completed, every milestone reached.",
    enrolled: "Enrolled courses",
    enrolledDetail: "Courses in your library",
    completed: "Completed courses",
    completedDetail: "Learning paths finished",
    lessons: "Lessons completed",
    lessonsDetail: "Steps taken forward",
    hours: "Total study hours",
    hoursDetail: "Time invested in learning",
    certificates: "Certificates earned",
    certificatesDetail: "Achievements unlocked",
    streak: "Learning streak",
    streakDetail: "Consecutive active days",
    days: "days",
    explore: "Explore courses",
    footer: "YOUR JOURNEY, MEASURED IN PROGRESS",
  },
  ar: {
    eyebrow: "رحلتك التعليمية بالأرقام",
    heading: "تقدمك",
    headingAccent: "في لمحة.",
    description:
      "كل ساعة تعلّم، وكل درس مكتمل، وكل إنجاز يقرّبك من هدفك.",
    enrolled: "الدورات المسجّلة",
    enrolledDetail: "الدورات في مكتبتك",
    completed: "الدورات المكتملة",
    completedDetail: "مسارات تعليمية أنهيتها",
    lessons: "الدروس المكتملة",
    lessonsDetail: "خطوات نحو هدفك",
    hours: "إجمالي ساعات التعلّم",
    hoursDetail: "الوقت المستثمر في التعلّم",
    certificates: "الشهادات المكتسبة",
    certificatesDetail: "إنجازات حققتها",
    streak: "سلسلة التعلّم",
    streakDetail: "أيام متتالية من النشاط",
    days: "أيام",
    explore: "استكشف الدورات",
    footer: "رحلتك تُقاس بالتقدم",
  },
};

const statDefinitions = [
  {
    key: "enrolled",
    field: "enrolledCourses",
    Icon: BookOpen,
  },
  {
    key: "completed",
    field: "completedCourses",
    Icon: GraduationCap,
  },
  {
    key: "lessons",
    field: "completedLessons",
    Icon: CheckCircle2,
  },
  {
    key: "hours",
    field: "totalStudyHours",
    Icon: Clock3,
  },
  {
    key: "certificates",
    field: "certificatesEarned",
    Icon: Award,
  },
  {
    key: "streak",
    field: "currentStreak",
    Icon: Flame,
  },
];

function formatStat(value, language) {
  const safeValue = Math.max(0, Number(value) || 0);

  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US",
    { maximumFractionDigits: 1 }
  ).format(safeValue);
}

function LearningStats({ student = {} }) {
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

    const context = gsap.context(() => {
      gsap.fromTo(
        ".behar-stats__reveal",
        {
          opacity: 0,
          y: 24,
        },
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
  }, [language]);

  const t = translations[language];
  const isArabic = language === "ar";

  return (
    <section
      ref={sectionRef}
      className="behar-stats"
      dir={isArabic ? "rtl" : "ltr"}
      aria-labelledby="behar-stats-heading"
    >
      <div className="behar-stats__header behar-stats__reveal">
        <div className="behar-stats__heading-group">
          <span className="behar-stats__eyebrow">
            <span className="behar-stats__eyebrow-line" />
            {t.eyebrow}
          </span>

          <h2
            id="behar-stats-heading"
            className="behar-stats__heading"
          >
            {t.heading}{" "}
            <span>{t.headingAccent}</span>
          </h2>

          <p className="behar-stats__description">
            {t.description}
          </p>
        </div>

        <span className="behar-stats__index">
          03 / BEHAR
        </span>
      </div>

      <div className="behar-stats__grid">
        {statDefinitions.map(
          ({ key, field, Icon }, index) => {
            const isFeatured = index === 0;
            const value = formatStat(
              student?.[field],
              language
            );

            return (
              <article
                key={key}
                className={[
                  "behar-stats__item",
                  "behar-stats__reveal",
                  isFeatured
                    ? "behar-stats__item--featured"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-label={`${t[key]}: ${value}`}
              >
                <div className="behar-stats__item-top">
                  <span className="behar-stats__icon">
                    <Icon
                      size={isFeatured ? 24 : 21}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </span>

                  <span className="behar-stats__item-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="behar-stats__item-content">
                  <div className="behar-stats__number-row">
                    <strong className="behar-stats__number">
                      {value}
                    </strong>

                    {key === "streak" && (
                      <span className="behar-stats__number-unit">
                        {t.days}
                      </span>
                    )}
                  </div>

                  <h3 className="behar-stats__label">
                    {t[key]}
                  </h3>

                  <p className="behar-stats__detail">
                    {t[`${key}Detail`]}
                  </p>
                </div>

                {isFeatured && (
                  <div
                    className="behar-stats__featured-decoration"
                    aria-hidden="true"
                  >
                    <span />
                    <span />
                    <span />
                  </div>
                )}
              </article>
            );
          }
        )}
      </div>

      <div className="behar-stats__footer behar-stats__reveal">
        <span className="behar-stats__footer-label">
          <span className="behar-stats__footer-dot" />
          {t.footer}
        </span>

        <a href="/courses" className="behar-stats__footer-link">
          {t.explore}
          <ArrowUpRight size={17} strokeWidth={1.7} />
        </a>
      </div>
    </section>
  );
}

export default LearningStats;
