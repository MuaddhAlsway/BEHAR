
import { useId, useMemo, useState } from "react";

import {
  Award,
  BookOpen,
  Check,
  ChevronRight,
  Flame,
  Footprints,
  GraduationCap,
  LockKeyhole,
  Medal,
  Search,
  Sparkles,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";

import {
  GAMIFICATION_BADGES,
  GAMIFICATION_BADGE_CATEGORIES,
  GAMIFICATION_BADGE_CRITERIA,
  getGamificationText,
} from "../../../data/student/gamification";

import "../../../styles/student/achievements/BadgeCollection.css";

const copy = {
  en: {
    eyebrow: "THE ACHIEVEMENT ARCHIVE",
    title: "Your badge collection",
    subtitle:
      "A record of every milestone earned along your learning journey.",
    collected: "Collected",
    total: "Total badges",
    completion: "Collection progress",
    all: "All badges",
    learning: "Learning",
    assessment: "Assessment",
    consistency: "Consistency",
    mastery: "Mastery",
    unlocked: "Unlocked",
    locked: "Locked",
    earned: "Earned",
    progress: "Progress",
    requirement: "How to unlock",
    close: "Close details",
    empty: "No badges match this category.",
    noBadges: "Your collection starts here.",
    keepGoing: "Keep learning to unlock your first badge.",
    completed: "Requirement completed",
    remaining: "remaining",
    of: "of",
    first: "Your first achievement is waiting.",
    rarity: {
      common: "Common",
      rare: "Rare",
      epic: "Epic",
      legendary: "Legendary",
    },
    units: {
      lessons_completed: "lessons",
      courses_completed: "courses",
      quizzes_passed: "quizzes",
      perfect_quizzes: "perfect quizzes",
      streak_days: "days",
      total_xp: "XP",
    },
  },
  ar: {
    eyebrow: "سجل الإنجازات",
    title: "مجموعة الشارات",
    subtitle:
      "سجل لجميع الإنجازات التي حققتها خلال رحلتك التعليمية.",
    collected: "الشارات المكتسبة",
    total: "إجمالي الشارات",
    completion: "تقدم المجموعة",
    all: "جميع الشارات",
    learning: "التعلم",
    assessment: "التقييمات",
    consistency: "الاستمرارية",
    mastery: "الإتقان",
    unlocked: "مكتسبة",
    locked: "مقفلة",
    earned: "تاريخ الإنجاز",
    progress: "التقدم",
    requirement: "كيفية الحصول عليها",
    close: "إغلاق التفاصيل",
    empty: "لا توجد شارات في هذا التصنيف.",
    noBadges: "رحلتك مع الشارات تبدأ هنا.",
    keepGoing: "واصل التعلم للحصول على أول شارة.",
    completed: "تم استيفاء المتطلبات",
    remaining: "متبقي",
    of: "من",
    first: "إنجازك الأول بانتظارك.",
    rarity: {
      common: "شائعة",
      rare: "نادرة",
      epic: "ملحمية",
      legendary: "أسطورية",
    },
    units: {
      lessons_completed: "دروس",
      courses_completed: "دورات",
      quizzes_passed: "اختبارات",
      perfect_quizzes: "اختبارات كاملة",
      streak_days: "أيام",
      total_xp: "نقطة خبرة",
    },
  },
};

const ICONS = {
  "first-step": Footprints,
  "lesson-explorer": BookOpen,
  "course-finisher": GraduationCap,
  "quiz-starter": Target,
  "perfect-mind": Sparkles,
  "three-day-streak": Flame,
  "seven-day-streak": Flame,
  "xp-champion": Trophy,
};

const CATEGORY_ICONS = {
  all: Award,
  learning: BookOpen,
  assessment: Target,
  consistency: Flame,
  mastery: Trophy,
};

const METRIC_STATS = {
  [GAMIFICATION_BADGE_CRITERIA.LESSONS_COMPLETED]:
    "lessonsCompleted",
  [GAMIFICATION_BADGE_CRITERIA.COURSES_COMPLETED]:
    "coursesCompleted",
  [GAMIFICATION_BADGE_CRITERIA.QUIZZES_PASSED]:
    "quizzesPassed",
  [GAMIFICATION_BADGE_CRITERIA.PERFECT_QUIZZES]:
    "perfectQuizzes",
};

const CATEGORIES = [
  "all",
  ...Object.values(GAMIFICATION_BADGE_CATEGORIES),
];

function getBadgeProgress(badge, progress) {
  const criteria = badge.criteria ?? {};

  const metric =
    criteria.metric ??
    criteria.type ??
    criteria.key;

  const target =
    criteria.target ??
    criteria.value ??
    criteria.threshold;

  if (
    !metric ||
    !Number.isFinite(target) ||
    target <= 0
  ) {
    return null;
  }

  let current = 0;

  if (metric === GAMIFICATION_BADGE_CRITERIA.TOTAL_XP) {
    current = progress?.totalXP ?? 0;
  } else if (
    metric === GAMIFICATION_BADGE_CRITERIA.STREAK_DAYS
  ) {
    current = progress?.streak?.longestDays ?? 0;
  } else {
    const statKey = METRIC_STATS[metric];
    current = statKey
      ? (progress?.stats?.[statKey] ?? 0)
      : 0;
  }

  return {
    current,
    target,
    percentage: Math.min(
      100,
      Math.max(0, (current / target) * 100)
    ),
    metric,
  };
}

function normalizeUnlockedBadges(unlockedBadges) {
  const map = new Map();

  for (const entry of unlockedBadges ?? []) {
    if (typeof entry === "string") {
      map.set(entry, { id: entry, unlockedAt: null });
      continue;
    }

    if (!entry || typeof entry !== "object") continue;

    const id = entry.badgeId ?? entry.id;
    if (!id) continue;

    map.set(id, {
      id,
      unlockedAt:
        entry.unlockedAt ??
        entry.earnedAt ??
        null,
    });
  }

  return map;
}

function formatNumber(number, language) {
  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US"
  ).format(number);
}

function formatDate(value, language) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }
  ).format(date);
}

function BadgeCard({
  badge,
  unlocked,
  unlockedAt,
  progress,
  language,
  t,
  onSelect,
}) {
  const Icon = ICONS[badge.id] ?? Medal;

  const title = getGamificationText(
    badge.title,
    language
  );

  const description = getGamificationText(
    badge.description,
    language
  );

  const rarity = badge.rarity ?? "common";

  return (
    <button
      type="button"
      className={[
        "behar-badge-card",
        unlocked ? "is-unlocked" : "is-locked",
        `rarity-${rarity}`,
      ].join(" ")}
      onClick={onSelect}
      aria-label={`${title} — ${
        unlocked ? t.unlocked : t.locked
      }`}
    >
      <div className="behar-badge-card__top">
        <span className="behar-badge-card__rarity">
          <span className="behar-badge-card__rarity-dot" />
          {t.rarity[rarity] ?? rarity}
        </span>

        <span className="behar-badge-card__state">
          {unlocked ? (
            <Check size={15} aria-hidden="true" />
          ) : (
            <LockKeyhole size={14} aria-hidden="true" />
          )}
        </span>
      </div>

      <div className="behar-badge-card__medallion">
        <div className="behar-badge-card__medallion-inner">
          <Icon
            size={34}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="behar-badge-card__content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className="behar-badge-card__footer">
        {unlocked ? (
          <span className="behar-badge-card__earned">
            <Check size={14} aria-hidden="true" />
            {formatDate(unlockedAt, language) ??
              t.unlocked}
          </span>
        ) : progress ? (
          <div className="behar-badge-card__progress">
            <div className="behar-badge-card__progress-copy">
              <span>{t.progress}</span>
              <strong>
                {formatNumber(
                  Math.min(progress.current, progress.target),
                  language
                )}
                /{formatNumber(progress.target, language)}
              </strong>
            </div>

            <div className="behar-badge-card__track">
              <span
                style={{
                  width: `${progress.percentage}%`,
                }}
              />
            </div>
          </div>
        ) : (
          <span className="behar-badge-card__locked">
            <LockKeyhole size={13} />
            {t.locked}
          </span>
        )}

        <ChevronRight
          size={16}
          className="behar-badge-card__arrow"
          aria-hidden="true"
        />
      </div>
    </button>
  );
}

export default function BadgeCollection({
  badges = GAMIFICATION_BADGES,
  progress = {},
  language = "en",
  className = "",
}) {
  const locale = language === "ar" ? "ar" : "en";
  const t = copy[locale];
  const dialogTitleId = useId();

  const [category, setCategory] = useState("all");
  const [selectedBadgeId, setSelectedBadgeId] =
    useState(null);

  const badgeList = useMemo(
    () =>
      Array.isArray(badges)
        ? badges
        : Object.values(badges ?? {}),
    [badges]
  );

  const unlockedMap = useMemo(
    () =>
      normalizeUnlockedBadges(
        progress?.unlockedBadges
      ),
    [progress?.unlockedBadges]
  );

  const unlockedCount = badgeList.filter(
    (badge) => unlockedMap.has(badge.id)
  ).length;

  const completion = badgeList.length
    ? (unlockedCount / badgeList.length) * 100
    : 0;

  const filteredBadges = badgeList.filter(
    (badge) =>
      category === "all" ||
      badge.category === category
  );

  const selectedBadge = badgeList.find(
    (badge) => badge.id === selectedBadgeId
  );

  const selectedUnlock = selectedBadge
    ? unlockedMap.get(selectedBadge.id)
    : null;

  const selectedProgress = selectedBadge
    ? getBadgeProgress(selectedBadge, progress)
    : null;

  const SelectedIcon = selectedBadge
    ? ICONS[selectedBadge.id] ?? Medal
    : Medal;

  return (
    <section
      className={`behar-badge-collection ${className}`}
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-label={t.title}
    >
      <header className="behar-badge-collection__header">
        <div className="behar-badge-collection__heading">
          <div className="behar-badge-collection__eyebrow">
            <Sparkles size={14} aria-hidden="true" />
            {t.eyebrow}
          </div>

          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>

        <div className="behar-badge-collection__count">
          <span>{t.collected}</span>
          <strong>
            {formatNumber(unlockedCount, locale)}
            <small>
              / {formatNumber(badgeList.length, locale)}
            </small>
          </strong>
        </div>
      </header>

      <div className="behar-badge-collection__summary">
        <div className="behar-badge-collection__summary-copy">
          <span>{t.completion}</span>
          <strong>
            {Math.round(completion)}%
          </strong>
        </div>

        <div
          className="behar-badge-collection__summary-track"
          role="progressbar"
          aria-label={t.completion}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(completion)}
        >
          <span style={{ width: `${completion}%` }} />
        </div>
      </div>

      <div
        className="behar-badge-collection__filters"
        role="group"
        aria-label={t.title}
      >
        {CATEGORIES.map((item) => {
          const Icon = CATEGORY_ICONS[item] ?? Award;

          return (
            <button
              type="button"
              key={item}
              className={
                category === item ? "is-active" : ""
              }
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              <Icon size={15} aria-hidden="true" />
              {t[item]}
            </button>
          );
        })}
      </div>

      {filteredBadges.length > 0 ? (
        <div className="behar-badge-collection__grid">
          {filteredBadges.map((badge) => {
            const unlocked = unlockedMap.get(
              badge.id
            );

            return (
              <BadgeCard
                key={badge.id}
                badge={badge}
                unlocked={Boolean(unlocked)}
                unlockedAt={unlocked?.unlockedAt}
                progress={getBadgeProgress(
                  badge,
                  progress
                )}
                language={locale}
                t={t}
                onSelect={() =>
                  setSelectedBadgeId(badge.id)
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="behar-badge-collection__empty">
          <Search size={24} />
          <p>{t.empty}</p>
        </div>
      )}

      {selectedBadge && (
        <div
          className="behar-badge-collection__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedBadgeId(null);
            }
          }}
        >
          <div
            className="behar-badge-collection__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
          >
            <button
              type="button"
              className="behar-badge-collection__close"
              onClick={() => setSelectedBadgeId(null)}
              aria-label={t.close}
            >
              <X size={19} />
            </button>

            <div
              className={[
                "behar-badge-collection__dialog-icon",
                `rarity-${selectedBadge.rarity ?? "common"}`,
              ].join(" ")}
            >
              <SelectedIcon
                size={45}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>

            <span className="behar-badge-collection__dialog-rarity">
              {t.rarity[selectedBadge.rarity] ??
                selectedBadge.rarity}
            </span>

            <h3 id={dialogTitleId}>
              {getGamificationText(
                selectedBadge.title,
                locale
              )}
            </h3>

            <p>
              {getGamificationText(
                selectedBadge.description,
                locale
              )}
            </p>

            <div className="behar-badge-collection__dialog-detail">
              <span>
                {selectedUnlock
                  ? t.unlocked
                  : t.requirement}
              </span>

              {selectedUnlock ? (
                <strong>
                  {formatDate(
                    selectedUnlock.unlockedAt,
                    locale
                  ) ?? t.completed}
                </strong>
              ) : selectedProgress ? (
                <>
                  <strong>
                    {formatNumber(
                      selectedProgress.current,
                      locale
                    )}{" "}
                    {t.of}{" "}
                    {formatNumber(
                      selectedProgress.target,
                      locale
                    )}{" "}
                    {t.units[selectedProgress.metric] ??
                      ""}
                  </strong>

                  <div className="behar-badge-card__track">
                    <span
                      style={{
                        width: `${selectedProgress.percentage}%`,
                      }}
                    />
                  </div>
                </>
              ) : (
                <strong>{t.keepGoing}</strong>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
