
import { useMemo } from "react";
import {
  ArrowUpRight,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

import {
  getLevelProgress,
} from "../../../utils/levelEngine";

import "../../../styles/student/achievements/level-progress-card.css";

const copy = {
  en: {
    eyebrow: "YOUR LEARNING JOURNEY",
    level: "Level",
    totalXP: "Total XP earned",
    nextLevel: "Next level",
    remaining: "XP to unlock",
    completed: "Maximum level reached",
    progress: "Level progress",
    legend: "You've reached the highest level.",
  },
  ar: {
    eyebrow: "رحلتك التعليمية",
    level: "المستوى",
    totalXP: "إجمالي نقاط الخبرة",
    nextLevel: "المستوى التالي",
    remaining: "نقطة للمستوى التالي",
    completed: "وصلت إلى أعلى مستوى",
    progress: "تقدم المستوى",
    legend: "لقد وصلت إلى أعلى مستوى.",
  },
};

const formatNumber = (value, language) =>
  new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US"
  ).format(value);

export default function LevelProgressCard({
  totalXP = 0,
  language = "en",
  className = "",
}) {
  const locale = language === "ar" ? "ar" : "en";
  const t = copy[locale];

  const level = useMemo(
    () => getLevelProgress(totalXP),
    [totalXP]
  );

  const currentTitle = level.title[locale];

  const progress = Math.min(
    100,
    Math.max(0, level.progressPercentage)
  );

  return (
    <section
      className={`behar-level-card ${className}`}
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-label={t.progress}
    >
      <div className="behar-level-card__glow" />

      <header className="behar-level-card__header">
        <div className="behar-level-card__eyebrow">
          <Sparkles size={15} aria-hidden="true" />
          <span>{t.eyebrow}</span>
        </div>

        <span className="behar-level-card__symbol">
          <Trophy size={19} aria-hidden="true" />
        </span>
      </header>

      <div className="behar-level-card__main">
        <div className="behar-level-card__identity">
          <div className="behar-level-card__level-number">
            <span>{t.level}</span>
            <strong>{level.level.toString().padStart(2, "0")}</strong>
          </div>

          <div className="behar-level-card__identity-info">
            <h2>{currentTitle}</h2>
            <p>
              <Zap size={16} aria-hidden="true" />
              {formatNumber(level.totalXP, locale)} {t.totalXP}
            </p>
          </div>
        </div>

        <div className="behar-level-card__orb" aria-hidden="true">
          <div className="behar-level-card__orb-inner">
            <span>{level.level.toString().padStart(2, "0")}</span>
          </div>
          <div className="behar-level-card__orb-ring" />
        </div>
      </div>

      <div className="behar-level-card__progress-section">
        <div className="behar-level-card__progress-heading">
          <span>{t.progress}</span>
          <strong>{Math.round(progress)}%</strong>
        </div>

        <div
          className="behar-level-card__progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label={t.progress}
        >
          <div
            className="behar-level-card__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="behar-level-card__progress-footer">
          <span>
            {formatNumber(level.currentLevelMinXP, locale)} XP
          </span>
          <span>
            {level.isMaxLevel
              ? t.completed
              : `${formatNumber(
                  level.nextLevelMinXP,
                  locale
                )} XP`}
          </span>
        </div>
      </div>

      <footer className="behar-level-card__footer">
        <div className="behar-level-card__next-icon">
          {level.isMaxLevel ? (
            <Trophy size={20} aria-hidden="true" />
          ) : (
            <Zap size={20} aria-hidden="true" />
          )}
        </div>

        <div className="behar-level-card__next-copy">
          <span>
            {level.isMaxLevel ? t.completed : t.nextLevel}
          </span>
          <strong>
            {level.isMaxLevel
              ? t.legend
              : `${t.level} ${level.nextLevel} · ${formatNumber(
                  level.xpToNextLevel,
                  locale
                )} ${t.remaining}`}
          </strong>
        </div>

        {!level.isMaxLevel && (
          <ArrowUpRight
            className="behar-level-card__footer-arrow"
            size={20}
            aria-hidden="true"
          />
        )}
      </footer>
    </section>
  );
}
