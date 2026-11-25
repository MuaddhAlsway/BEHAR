
import { useCallback, useState } from "react";

import {
  Award,
  ArrowUpRight,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

import AchievementCelebration from "./AchievementCelebration";

import {
  createBadgeCelebration,
  createLevelUpCelebration,
  createXPCelebration,
  enqueueCelebration,
} from "../../../utils/achievementCelebration";

const copy = {
  en: {
    eyebrow: "P14.5.0.7 · INTERACTION PREVIEW",
    title: "Achievement celebrations",
    description:
      "Preview how students are rewarded for their progress.",
    xp: "Preview XP reward",
    level: "Preview level up",
    badge: "Preview badge unlock",
    all: "Preview full sequence",
  },
  ar: {
    eyebrow: "P14.5.0.7 · معاينة التفاعل",
    title: "الاحتفال بالإنجازات",
    description:
      "معاينة طريقة الاحتفال بتقدم الطلاب وإنجازاتهم.",
    xp: "معاينة نقاط الخبرة",
    level: "معاينة مستوى جديد",
    badge: "معاينة شارة جديدة",
    all: "معاينة جميع الاحتفالات",
  },
};

export default function AchievementCelebrationDemo({
  language = "en",
}) {
  const [queue, setQueue] = useState([]);

  const locale = language === "ar" ? "ar" : "en";
  const t = copy[locale];

  const activeEvent = queue[0] ?? null;

  const closeCelebration = useCallback(() => {
    setQueue((current) => current.slice(1));
  }, []);

  function addEvents(events) {
    setQueue((current) =>
      events.reduce(
        (next, event) =>
          enqueueCelebration(next, event),
        current
      )
    );
  }

  function previewXP() {
    addEvents([
      createXPCelebration({
        xp: 25,
        reason:
          locale === "ar"
            ? "إكمال درس جديد"
            : "Lesson completed",
      }),
    ]);
  }

  function previewLevel() {
    addEvents([
      createLevelUpCelebration({
        level: 5,
        levelName:
          locale === "ar"
            ? "متعلم ملتزم"
            : "Dedicated Learner",
        xp: 200,
      }),
    ]);
  }

  function previewBadge() {
    addEvents([
      createBadgeCelebration({
        badgeId: "first-step",
        badgeName:
          locale === "ar"
            ? "الخطوة الأولى"
            : "First Step",
        description:
          locale === "ar"
            ? "أكملت أول درس لك."
            : "You've completed your first lesson.",
      }),
    ]);
  }

  function previewAll() {
    addEvents([
      createXPCelebration({
        xp: 200,
        reason:
          locale === "ar"
            ? "إكمال الدورة"
            : "Course completed",
      }),
      createLevelUpCelebration({
        level: 5,
        levelName:
          locale === "ar"
            ? "متعلم ملتزم"
            : "Dedicated Learner",
        xp: 200,
      }),
      createBadgeCelebration({
        badgeId: "first-step",
        badgeName:
          locale === "ar"
            ? "الخطوة الأولى"
            : "First Step",
      }),
    ]);
  }

  return (
    <>
      <section
        className="behar-celebration-demo"
        dir={locale === "ar" ? "rtl" : "ltr"}
        style={{
          padding: "28px",
          border: "1px solid #e6e8e1",
          borderRadius: "22px",
          background: "#f8faf6",
          fontFamily: "Outfit, sans-serif",
        }}
      >
        <span
          style={{
            color: "#668472",
            fontSize: "11px",
            letterSpacing:
              locale === "ar" ? 0 : "0.1em",
          }}
        >
          {t.eyebrow}
        </span>

        <h2
          style={{
            margin: "12px 0 8px",
            fontSize: "25px",
            fontWeight: 500,
          }}
        >
          {t.title}
        </h2>

        <p
          style={{
            margin: "0 0 24px",
            color: "#78847b",
            fontSize: "13px",
          }}
        >
          {t.description}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {[
            {
              label: t.xp,
              icon: Zap,
              action: previewXP,
            },
            {
              label: t.level,
              icon: Trophy,
              action: previewLevel,
            },
            {
              label: t.badge,
              icon: Award,
              action: previewBadge,
            },
            {
              label: t.all,
              icon: Sparkles,
              action: previewAll,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "9px",
                  padding: "12px 16px",
                  border: "1px solid #dce5db",
                  borderRadius: "12px",
                  background: "#fff",
                  color: "#284b37",
                  font: "inherit",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                <Icon size={16} />
                {item.label}
                <ArrowUpRight size={14} />
              </button>
            );
          })}
        </div>
      </section>

      <AchievementCelebration
        key={activeEvent?.id ?? "empty"}
        event={activeEvent}
        language={locale}
        onClose={closeCelebration}
      />
    </>
  );
}
