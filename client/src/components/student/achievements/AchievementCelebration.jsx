
import { useEffect, useRef } from "react";
import {
  Award,
  Check,
  Flame,
  Sparkles,
  Trophy,
  X,
  Zap,
} from "lucide-react";

import {
  CELEBRATION_TYPES,
} from "../../../utils/achievementCelebration";

import '../../../styles/student/achievements/AchievementCelebration.css'
const translations = {
  en: {
    levelEyebrow: "A NEW CHAPTER BEGINS",
    levelTitle: "Level unlocked",
    levelMessage:
      "Your dedication is taking you further.",
    badgeEyebrow: "AN ACHIEVEMENT TO REMEMBER",
    badgeTitle: "Badge unlocked",
    badgeMessage:
      "Another milestone added to your journey.",
    xpEyebrow: "LEARNING REWARDED",
    xpTitle: "XP earned",
    continue: "Continue learning",
    close: "Close celebration",
    xp: "XP",
    level: "Level",
  },
  ar: {
    levelEyebrow: "بداية مرحلة جديدة",
    levelTitle: "مستوى جديد",
    levelMessage:
      "اجتهادك يقودك إلى إنجازات أكبر.",
    badgeEyebrow: "إنجاز يستحق الاحتفال",
    badgeTitle: "شارة جديدة",
    badgeMessage:
      "إنجاز جديد يُضاف إلى رحلتك التعليمية.",
    xpEyebrow: "مكافأة التعلم",
    xpTitle: "نقاط خبرة مكتسبة",
    continue: "متابعة التعلم",
    close: "إغلاق الاحتفال",
    xp: "نقطة خبرة",
    level: "المستوى",
  },
};

function getCelebrationIcon(event) {
  if (event?.type === CELEBRATION_TYPES.LEVEL_UP) {
    return Trophy;
  }

  if (
    event?.type === CELEBRATION_TYPES.BADGE_UNLOCKED
  ) {
    return Award;
  }

  return Zap;
}

export default function AchievementCelebration({
  event,
  language = "en",
  onClose,
}) {
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);
  const dialogRef = useRef(null);

  const locale = language === "ar" ? "ar" : "en";
  const t = translations[locale];

  const isXP =
    event?.type === CELEBRATION_TYPES.XP_EARNED;

  useEffect(() => {
    if (!event) return;

    previousFocusRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    function handleKeyDown(keyEvent) {
      if (keyEvent.key === "Escape") {
        onClose?.();
      }

      if (keyEvent.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusable = Array.from(
          dialog.querySelectorAll(
            'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        );

        if (!focusable.length) {
          keyEvent.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (
          keyEvent.shiftKey &&
          document.activeElement === first
        ) {
          keyEvent.preventDefault();
          last.focus();
        } else if (
          !keyEvent.shiftKey &&
          document.activeElement === last
        ) {
          keyEvent.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
      previousFocusRef.current?.focus?.();
    };
  }, [event, onClose]);

  if (!event) return null;

  const Icon = getCelebrationIcon(event);

  const isLevel =
    event.type === CELEBRATION_TYPES.LEVEL_UP;

  const isBadge =
    event.type === CELEBRATION_TYPES.BADGE_UNLOCKED;

  const eyebrow = isLevel
    ? t.levelEyebrow
    : isBadge
      ? t.badgeEyebrow
      : t.xpEyebrow;

  const title = isLevel
    ? t.levelTitle
    : isBadge
      ? t.badgeTitle
      : t.xpTitle;

  const message = isLevel
    ? t.levelMessage
    : isBadge
      ? t.badgeMessage
      : event.reason || "";

  const achievementName = isLevel
    ? event.levelName
    : isBadge
      ? event.badgeName
      : "";

  return (
    <div
      className="behar-celebration-overlay"
      dir={locale === "ar" ? "rtl" : "ltr"}
      onMouseDown={(mouseEvent) => {
        if (
          mouseEvent.target ===
          mouseEvent.currentTarget
        ) {
          onClose?.();
        }
      }}
    >
      <div
        ref={dialogRef}
        className={[
          "behar-celebration",
          `behar-celebration--${event.type}`,
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div
          className="behar-celebration__particles"
          aria-hidden="true"
        >
          {Array.from({ length: 12 }, (_, index) => (
            <span
              key={index}
              style={{ "--particle-index": index }}
            />
          ))}
        </div>

        <button
          ref={closeButtonRef}
          type="button"
          className="behar-celebration__close"
          onClick={onClose}
          aria-label={t.close}
        >
          <X size={19} />
        </button>

        <div className="behar-celebration__content">
          <div className="behar-celebration__icon-wrap">
            <div className="behar-celebration__icon-ring">
              <Icon
                size={47}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="behar-celebration__eyebrow">
            <Sparkles size={14} aria-hidden="true" />
            <span>{eyebrow}</span>
          </div>

          <h2>{title}</h2>

          {isLevel && (
            <div className="behar-celebration__level">
              <span>{t.level}</span>
              <strong>{event.level}</strong>
            </div>
          )}

          {achievementName && (
            <h3>{achievementName}</h3>
          )}

          <p>{message}</p>

          {isBadge && event.description && (
            <p className="behar-celebration__description">
              {event.description}
            </p>
          )}

          {(isXP || (isLevel && event.xp > 0)) && (
            <div className="behar-celebration__xp">
              <Zap size={18} aria-hidden="true" />
              <strong>+{event.xp}</strong>
              <span>{t.xp}</span>
            </div>
          )}

          <button
            type="button"
            className="behar-celebration__continue"
            onClick={onClose}
          >
            <Check size={17} aria-hidden="true" />
            {t.continue}
          </button>
        </div>
      </div>
    </div>
  );
}
