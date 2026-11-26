
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";
import { useRef } from "react";

export default function StoryWall({
  stories,
  activeIndex,
  language,
  onSelect,
  onOpen,
}) {
  const isArabic = language === "ar";
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;
  const wallRef = useRef(null);
  const getStoryName = (story) =>
    isArabic ? story.nameAr || story.name : story.name;

  const selectAndScroll = (index) => {
    onSelect(index);
    wallRef.current
      ?.querySelector(`[data-story-index="${index}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const moveStory = (direction) => {
    const nextIndex =
      (activeIndex + direction + stories.length) % stories.length;
    selectAndScroll(nextIndex);
  };

  return (
    <div className="behar-stories__wall-shell">
      <button
        type="button"
        className="behar-stories__wall-control behar-stories__wall-control--prev"
        onClick={() => moveStory(-1)}
        aria-label={isArabic ? "القصص السابقة" : "Previous student stories"}
      >
        <ArrowLeft size={19} />
      </button>

      <div ref={wallRef} className="behar-stories__wall" aria-label="Student stories">
        {stories.map((story, index) => {
        const active = index === activeIndex;
          const storyName = getStoryName(story);

          return (
          <button
            key={story.id}
            type="button"
            data-story-index={index}
            className={`behar-stories__portrait behar-stories__portrait--${index + 1} ${
              active ? "is-active" : ""
            }`}
            onClick={() =>
              active ? onOpen(story) : selectAndScroll(index)
            }
            aria-label={`${storyName}, ${story.field[language]}`}
            aria-pressed={active}
          >
            <span className="behar-stories__portrait-inner">
              <span className="behar-stories__portrait-face behar-stories__portrait-front">
                <span className="behar-stories__portrait-student-icon" aria-hidden="true">
                  <GraduationCap size={92} strokeWidth={1.1} />
                </span>

                <span className="behar-stories__portrait-shade" />

                <span className="behar-stories__portrait-caption">
                  <strong>{storyName}</strong>
                  <small>{story.field[language]}</small>
                </span>

                <span className="behar-stories__portrait-arrow">
                  <Arrow size={19} strokeWidth={1.7} />
                </span>
              </span>

              <span className="behar-stories__portrait-face behar-stories__portrait-back">
                <span className="behar-stories__portrait-back-label">
                  STUDENT JOURNAL / {String(index + 1).padStart(2, "0")}
                </span>
                <span className="behar-stories__portrait-back-quote">
                  “{story.quote[language]}”
                </span>
                <span className="behar-stories__portrait-back-name">
                  {storyName}
                </span>
              </span>
            </span>
          </button>
          );
        })}
      </div>

      <div className="behar-stories__progress" aria-label="Student story progress">
        {stories.map((story, index) => (
          <button
            key={story.id}
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            onClick={() => selectAndScroll(index)}
            aria-label={getStoryName(story)}
            aria-current={index === activeIndex ? "true" : undefined}
          >
            <span />
          </button>
        ))}
      </div>

      <button
        type="button"
        className="behar-stories__wall-control behar-stories__wall-control--next"
        onClick={() => moveStory(1)}
        aria-label={isArabic ? "القصص التالية" : "Next student stories"}
      >
        <ArrowRight size={19} />
      </button>
    </div>
  );
}
