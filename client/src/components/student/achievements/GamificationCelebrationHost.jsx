
import AchievementCelebration from "./AchievementCelebration";

import {
  useGamification,
} from "../../../context/GamificationContext";

export default function GamificationCelebrationHost({
  language = "en",
}) {
  const {
    activeCelebration,
    dismissCelebration,
  } = useGamification();

  return (
    <AchievementCelebration
      key={activeCelebration?.id ?? "empty"}
      event={activeCelebration}
      language={language}
      onClose={dismissCelebration}
    />
  );
}
