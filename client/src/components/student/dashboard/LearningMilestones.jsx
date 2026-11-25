
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Check,
  Clock3,
  Flame,
  GraduationCap,
  LockKeyhole,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import gsap from "gsap";

import "../../../styles/student/learning-milestones.css";

const translations = {
  en: {
    eyebrow: "SMALL WINS. BIG JOURNEYS.",
    heading: "Every step",
    headingAccent: "counts.",
    description:
      "A record of the moments that shape your learning journey. Celebrate what you've achieved and see what's next.",
    completed: "ACHIEVED",
    inProgress: "IN PROGRESS",
    locked: "UPCOMING",
    nextMilestone: "YOUR NEXT MILESTONE",
    journey: "YOUR ACHIEVEMENT JOURNEY",
    achievements: "achievements unlocked",
    progress: "MILESTONE PROGRESS",
    remaining: "remaining",
    complete: "Milestone achieved",
    earnedOn: "Earned",
    target: "Target",
    of: "of",
    unlocked: "Unlocked",
    keepGoing: "Keep the momentum going.",
    encouragement:
      "The next achievement is closer than you think.",
    emptyTitle: "Your journey starts here.",
    emptyDescription:
      "Your learning milestones will appear as you make progress.",
    footer: "PROGRESS IS BUILT ONE STEP AT A TIME",
    noUpcoming: "All milestones achieved",
    current: "Current",
  },
  ar: {
    eyebrow: "إنجازات صغيرة، رحلة عظيمة",
    heading: "كل خطوة",
    headingAccent: "تصنع فرقًا.",
    description:
      "سجل للحظات التي تشكل رحلتك التعليمية. احتفل بما حققته واكتشف إنجازك القادم.",
    completed: "تم الإنجاز",
    inProgress: "قيد التقدم",
    locked: "إنجاز قادم",
    nextMilestone: "إنجازك القادم",
    journey: "رحلة إنجازاتك",
    achievements: "إنجازات مكتسبة",
    progress: "تقدم الإنجاز",
    remaining: "متبقي",
    complete: "تم تحقيق الإنجاز",
    earnedOn: "تاريخ الإنجاز",
    target: "الهدف",
    of: "من",
    unlocked: "مكتسب",
    keepGoing: "واصل تقدمك بثبات.",
    encouragement:
      "إنجازك القادم أقرب مما تتصور.",
    emptyTitle: "رحلتك تبدأ من هنا.",
    emptyDescription:
      "ستظهر إنجازاتك التعليمية هنا مع تقدمك.",
    footer: "التقدم يُبنى خطوة بعد خطوة",
    noUpcoming: "تم تحقيق جميع الإنجازات",
    current: "الحالي",
  },
};

const milestoneIcons = {
  sparkles: Sparkles,
  book: BookOpen,
  graduation: GraduationCap,
  flame: Flame,
  clock: Clock3,
  award: Award,
  trophy: Trophy,
};

function localized(value, language) {
  if (typeof value === "string") return value;
  return value?.[language] || value?.en || "";
}

function formatNumber(value, language) {
  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US",
    { maximumFractionDigits: 1 }
  ).format(value);
}

function formatDate(value, language) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(date);
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

function getMilestoneProgress(milestone, student) {
  const current = Math.max(
    0,
    Number(student?.[milestone.metric]) || 0
  );

  const target = Math.max(
    1,
    Number(milestone.target) || 1
  );

  const progress = Math.min(
    100,
    (current / target) * 100
  );

  return {
    current,
    target,
    progress,
    completed: current >= target,
    remaining: Math.max(0, target - current),
  };
}

function MilestoneIcon({ icon, size = 22 }) {
  const Icon = milestoneIcons[icon] || Target;

  return (
    <Icon
      size={size}
      strokeWidth={1.5}
      aria-hidden="true"
    />
  );
}

function FeaturedMilestone({ milestone, language, t }) {
  const progress = milestone.progressData;

  return (
    <article className="behar-milestones__featured behar-milestones__reveal">
      <div className="behar-milestones__featured-top">
        <span className="behar-milestones__featured-eyebrow">
          <span className="behar-milestones__featured-dot" />
          {t.nextMilestone}
        </span>

        <span className="behar-milestones__featured-index">
          BEHAR / 07
        </span>
      </div>

      <div className="behar-milestones__featured-main">
        <div className="behar-milestones__featured-symbol">
          <MilestoneIcon
            icon={milestone.icon}
            size={47}
          />
          <span className="behar-milestones__symbol-ring" />
        </div>

        <div className="behar-milestones__featured-copy">
          <span className="behar-milestones__featured-status">
            {t.inProgress}
          </span>

          <h3>
            {localized(milestone.title, language)}
          </h3>

          <p>
            {localized(milestone.description, language)}
          </p>
        </div>
      </div>

      <div className="behar-milestones__featured-bottom">
        <div className="behar-milestones__featured-progress">
          <div className="behar-milestones__progress-header">
            <span>{t.progress}</span>
            <strong>
              {formatNumber(progress.current, language)}
              <small>
                {" / "}
                {formatNumber(progress.target, language)}
              </small>
            </strong>
          </div>

          <div
            className="behar-milestones__progress-track"
            role="progressbar"
            aria-label={t.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress.progress)}
          >
            <span
              style={{ width: `${progress.progress}%` }}
            />
          </div>

          <span className="behar-milestones__progress-note">
            {formatNumber(progress.remaining, language)}{" "}
            {t.remaining}
          </span>
        </div>

        <div className="behar-milestones__featured-percentage">
          {Math.round(progress.progress)}
          <span>%</span>
        </div>
      </div>

      <div
        className="behar-milestones__featured-decoration"
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
      </div>
    </article>
  );
}

function MilestoneItem({
  milestone,
  index,
  language,
  t,
  isCurrent,
}) {
  const { progressData } = milestone;
  const completed = progressData.completed;
  const Icon = milestoneIcons[milestone.icon] || Target;

  const statusLabel = completed
    ? t.completed
    : isCurrent
      ? t.inProgress
      : t.locked;

  return (
    <li
      className={[
        "behar-milestones__item",
        "behar-milestones__reveal",
        completed
          ? "behar-milestones__item--completed"
          : "",
        isCurrent
          ? "behar-milestones__item--current"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="behar-milestones__timeline-marker">
        <span className="behar-milestones__timeline-node">
          {completed ? (
            <Check size={17} strokeWidth={2.3} />
          ) : isCurrent ? (
            <Icon size={19} strokeWidth={1.6} />
          ) : (
            <LockKeyhole size={16} strokeWidth={1.5} />
          )}
        </span>
      </div>

      <div className="behar-milestones__item-content">
        <div className="behar-milestones__item-top">
          <span className="behar-milestones__item-number">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="behar-milestones__item-status">
            {statusLabel}
          </span>
        </div>

        <h3>
          {localized(milestone.title, language)}
        </h3>

        <p>
          {localized(milestone.description, language)}
        </p>

        <div className="behar-milestones__item-bottom">
          {completed ? (
            <span className="behar-milestones__earned">
              <Check size={14} />
              {t.unlocked}
              {milestone.completedAt &&
                ` · ${formatDate(
                  milestone.completedAt,
                  language
                )}`}
            </span>
          ) : (
            <div className="behar-milestones__mini-progress">
              <span className="behar-milestones__mini-track">
                <span
                  style={{
                    width: `${progressData.progress}%`,
                  }}
                />
              </span>

              <span>
                {formatNumber(
                  progressData.current,
                  language
                )}
                {" / "}
                {formatNumber(
                  progressData.target,
                  language
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

function LearningMilestones({
  student = {},
  data = {},
}) {
  const sectionRef = useRef(null);
  const language = useDashboardLanguage();
  const t = translations[language];

  const milestones = useMemo(
    () =>
      (data.milestones || []).map((milestone) => ({
        ...milestone,
        progressData: getMilestoneProgress(
          milestone,
          student
        ),
      })),
    [data.milestones, student]
  );

  const completedCount = milestones.filter(
    (milestone) => milestone.progressData.completed
  ).length;

  const upcomingMilestones = milestones.filter(
    (milestone) => !milestone.progressData.completed
  );

  const featuredMilestone =
    upcomingMilestones.find(
      (milestone) =>
        milestone.id === data.featuredMilestoneId
    ) ||
    [...upcomingMilestones].sort(
      (a, b) =>
        b.progressData.progress -
        a.progressData.progress
    )[0];

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".behar-milestones__reveal",
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
  }, [language, data, student]);

  return (
    <section
      ref={sectionRef}
      className="behar-milestones"
      dir={language === "ar" ? "rtl" : "ltr"}
      aria-labelledby="behar-milestones-heading"
    >
      <header className="behar-milestones__header behar-milestones__reveal">
        <div>
          <span className="behar-milestones__eyebrow">
            <span className="behar-milestones__eyebrow-line" />
            {t.eyebrow}
          </span>

          <h2
            id="behar-milestones-heading"
            className="behar-milestones__heading"
          >
            {t.heading}{" "}
            <span>{t.headingAccent}</span>
          </h2>

          <p className="behar-milestones__description">
            {t.description}
          </p>
        </div>

        <span className="behar-milestones__index">
          07 / BEHAR
        </span>
      </header>

      {milestones.length === 0 ? (
        <div className="behar-milestones__empty">
          <Award size={36} strokeWidth={1.4} />
          <h3>{t.emptyTitle}</h3>
          <p>{t.emptyDescription}</p>
        </div>
      ) : (
        <>
          {featuredMilestone ? (
            <FeaturedMilestone
              milestone={featuredMilestone}
              language={language}
              t={t}
            />
          ) : (
            <div className="behar-milestones__all-complete behar-milestones__reveal">
              <Trophy size={32} strokeWidth={1.4} />
              <span>{t.noUpcoming}</span>
            </div>
          )}

          <div className="behar-milestones__journey">
            <div className="behar-milestones__journey-header behar-milestones__reveal">
              <span>{t.journey}</span>

              <span>
                {formatNumber(completedCount, language)}
                {" / "}
                {formatNumber(
                  milestones.length,
                  language
                )}
                {" "}
                {t.achievements}
              </span>
            </div>

            <ol className="behar-milestones__timeline">
              {milestones.map((milestone, index) => (
                <MilestoneItem
                  key={milestone.id}
                  milestone={milestone}
                  index={index}
                  language={language}
                  t={t}
                  isCurrent={
                    milestone.id === featuredMilestone?.id
                  }
                />
              ))}
            </ol>
          </div>

          <div className="behar-milestones__closing behar-milestones__reveal">
            <span className="behar-milestones__closing-icon">
              <Sparkles size={22} strokeWidth={1.5} />
            </span>

            <div>
              <strong>{t.keepGoing}</strong>
              <p>{t.encouragement}</p>
            </div>

            <ArrowUpRight
              size={23}
              className="behar-milestones__closing-arrow"
              aria-hidden="true"
            />
          </div>
        </>
      )}

      <footer className="behar-milestones__footer behar-milestones__reveal">
        <span className="behar-milestones__footer-dot" />
        {t.footer}
      </footer>
    </section>
  );
}

export default LearningMilestones;
