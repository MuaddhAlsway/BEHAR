import { GAMIFICATION_LEVELS } from "../data/student/gamification";

/**
 * Derive the learner's current level from cumulative XP.
 * This is intentionally pure so dashboard cards and future backend data
 * can use the same calculation.
 */
export function getLevelProgress(totalXP = 0) {
  const safeXP = Number.isFinite(Number(totalXP))
    ? Math.max(0, Math.floor(Number(totalXP)))
    : 0;

  const currentIndex = GAMIFICATION_LEVELS.reduce(
    (index, level, candidateIndex) =>
      level.minTotalXP <= safeXP ? candidateIndex : index,
    0
  );

  const current = GAMIFICATION_LEVELS[currentIndex];
  const next = GAMIFICATION_LEVELS[currentIndex + 1] || null;
  const currentLevelMinXP = current.minTotalXP;
  const nextLevelMinXP = next?.minTotalXP ?? current.minTotalXP;
  const levelRange = nextLevelMinXP - currentLevelMinXP;
  const earnedInLevel = safeXP - currentLevelMinXP;
  const isMaxLevel = !next;

  return {
    level: current.level,
    title: current.title,
    totalXP: safeXP,
    currentLevelMinXP,
    nextLevelMinXP,
    nextLevel: next?.level ?? current.level,
    xpToNextLevel: isMaxLevel
      ? 0
      : Math.max(0, nextLevelMinXP - safeXP),
    progressPercentage: isMaxLevel
      ? 100
      : Math.min(100, (earnedInLevel / levelRange) * 100),
    isMaxLevel,
  };
}

/**
 * Return the configured level record for a given XP total.
 * Kept as a small compatibility API for gamification processing.
 */
export function getLevelForXP(totalXP = 0) {
  const progress = getLevelProgress(totalXP);

  return {
    level: progress.level,
    name: progress.title,
    title: progress.title,
    minTotalXP: progress.currentLevelMinXP,
  };
}
