
import { ArrowUpLeft, ArrowUpRight } from "lucide-react";

export default function StoryWall({
  stories,
  activeIndex,
  language,
  onSelect,
  onOpen,
}) {
  const isArabic = language === "ar";
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;

  return (
    <div className="behar-stories__wall" aria-label="Student stories">
      {stories.map((story, index) => {
        const active = index === activeIndex;

        return (
          <button
            key={story.id}
            type="button"
            className={`behar-stories__portrait behar-stories__portrait--${index + 1} ${
              active ? "is-active" : ""
            }`}
            onClick={() =>
              active ? onOpen(story) : onSelect(index)
            }
            aria-label={`${story.name}, ${story.field[language]}`}
            aria-pressed={active}
          >
            <span className="behar-stories__portrait-inner">
              <span className="behar-stories__portrait-face behar-stories__portrait-front">
                <img
                  src={story.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: story.position }}
                />

                <span className="behar-stories__portrait-shade" />

                <span className="behar-stories__portrait-caption">
                  <strong>{story.name}</strong>
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
                  {story.name}
                </span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
