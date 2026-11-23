
import {
  ArrowUpRight,
  ArrowUpLeft,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export default function FeaturedStory({
  story,
  language,
  copy,
  activeIndex,
  total,
  onPrevious,
  onNext,
  onOpen,
}) {
  const isArabic = language === "ar";
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;
  const Next = isArabic ? ArrowLeft : ArrowRight;
  const Previous = isArabic ? ArrowRight : ArrowLeft;

  return (
    <article
      className="behar-stories__feature"
      data-story-index={String(activeIndex + 1).padStart(2, "0")}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="behar-stories__feature-watermark" aria-hidden="true">
        {String(activeIndex + 1).padStart(2, "0")}
      </span>

      <div className="behar-stories__feature-top">
        <span>
          <span className="behar-stories__live-dot" />
          {copy.selected}
        </span>
        <span>
          {String(activeIndex + 1).padStart(2, "0")}
          {" / "}
          {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="behar-stories__feature-grid">
        <div className="behar-stories__feature-main">
          <span className="behar-stories__quote-mark" aria-hidden="true">
            “
          </span>

          <blockquote key={`${story.id}-${language}`}>
            {story.quote[language]}
          </blockquote>

          <div className="behar-stories__author">
            <span className="behar-stories__author-line" />
            <div>
              <strong>{story.name}</strong>
              <span>{story.field[language]}</span>
            </div>
          </div>

          <button
            type="button"
            className="behar-stories__read"
            onClick={() => onOpen(story)}
          >
            <span>{copy.read}</span>
            <span className="behar-stories__read-icon">
              <Arrow size={19} />
            </span>
          </button>
        </div>

        <div className="behar-stories__journey">
          <div className="behar-stories__journey-item">
            <span className="behar-stories__journey-number">01</span>
            <div>
              <span className="behar-stories__journey-label">
                {copy.before}
              </span>
              <p>{story.before[language]}</p>
            </div>
          </div>

          <div className="behar-stories__journey-connector">
            <span />
          </div>

          <div className="behar-stories__journey-item">
            <span className="behar-stories__journey-number is-final">
              02
            </span>
            <div>
              <span className="behar-stories__journey-label">
                {copy.after}
              </span>
              <p>{story.after[language]}</p>
            </div>
          </div>

          <a
            className="behar-stories__course-link"
            href={`/courses/${story.course.slug}`}
          >
            <span>{copy.course}</span>
            <Arrow size={17} />
          </a>
        </div>
      </div>

      <div className="behar-stories__feature-footer">
        <div className="behar-stories__feature-track">
          <span
            style={{
              width: `${((activeIndex + 1) / total) * 100}%`,
            }}
          />
        </div>

        <div className="behar-stories__navigation">
          <button
            type="button"
            onClick={onPrevious}
            aria-label={copy.previous}
          >
            <Previous size={19} />
          </button>

          <button
            type="button"
            onClick={onNext}
            aria-label={copy.next}
          >
            <Next size={19} />
          </button>
        </div>
      </div>
    </article>
  );
}
