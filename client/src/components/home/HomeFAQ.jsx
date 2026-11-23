
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowUpLeft,
  Plus,
  Minus,
  Asterisk,
  MessageCircle,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  faqCategories,
  faqItems,
  faqCopy,
} from "../../data/homeFaq";

import "../../styles/home-faq.css";

gsap.registerPlugin(ScrollTrigger);

function getLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar"
    ? "ar"
    : "en";
}

export default function HomeFAQ() {
  const sectionRef = useRef(null);
  const [language, setLanguage] = useState(getLanguage);
  const [activeCategory, setActiveCategory] = useState("all");
  const [openQuestion, setOpenQuestion] = useState("faq-01");

  const isArabic = language === "ar";
  const t = faqCopy[language];
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;

  const visibleQuestions =
    activeCategory === "all"
      ? faqItems
      : faqItems.filter(
          (item) => item.category === activeCategory
        );

  // Sync with existing navbar language switcher.
  useEffect(() => {
    const syncLanguage = () => setLanguage(getLanguage());

    syncLanguage();

    const observer = new MutationObserver(syncLanguage);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  // Scroll reveal.
  useEffect(() => {
    if (!sectionRef.current) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".behar-faq__eyebrow, .behar-faq__title > span, .behar-faq__description",
        {
          y: 45,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-faq__intro",
            start: "top 82%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".behar-faq__questions",
        {
          y: 50,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-faq__questions",
            start: "top 87%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".behar-faq__contact",
        {
          y: 35,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-faq__contact",
            start: "top 90%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  function handleCategoryChange(category) {
    setActiveCategory(category);

    const nextItems =
      category === "all"
        ? faqItems
        : faqItems.filter((item) => item.category === category);

    setOpenQuestion(nextItems[0]?.id ?? null);
  }

  function handleToggle(id) {
    setOpenQuestion((current) =>
      current === id ? null : id
    );
  }

  return (
    <section
      ref={sectionRef}
      className="behar-faq"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-faq-title"
    >
      <div className="behar-faq__container">
        {/* SECTION INDEX */}
        <div className="behar-faq__topline">
          <span>{t.eyebrow}</span>
          <Asterisk size={21} strokeWidth={1.5} />
        </div>

        {/* EDITORIAL GRID */}
        <div className="behar-faq__layout">
          {/* LEFT — STICKY HEADING */}
          <div className="behar-faq__intro">
            <div className="behar-faq__intro-inner">
              <span className="behar-faq__eyebrow">
                <span className="behar-faq__eyebrow-dot" />
                {t.index}
              </span>

              <h2
                id="behar-faq-title"
                className="behar-faq__title"
              >
                <span>{t.titleFirst}</span>
                <span className="behar-faq__title-accent">
                  {t.titleSecond}
                </span>
              </h2>

              <p className="behar-faq__description">
                {t.description}
              </p>

              <div
                className="behar-faq__decoration"
                aria-hidden="true"
              >
                <span>?</span>
                <span className="behar-faq__decoration-orbit" />
                <span className="behar-faq__decoration-star">
                  ✳
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — FILTERS + ACCORDION */}
          <div className="behar-faq__questions">
            <div className="behar-faq__questions-header">
              <span>{t.questionLabel}</span>
              <span>
                {String(visibleQuestions.length).padStart(2, "0")}
                {" "}
                {t.showing}
              </span>
            </div>

            <div
              className="behar-faq__categories"
              role="group"
              aria-label={t.questionLabel}
            >
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`behar-faq__category ${
                    activeCategory === category.id
                      ? "is-active"
                      : ""
                  }`}
                  onClick={() =>
                    handleCategoryChange(category.id)
                  }
                  aria-pressed={
                    activeCategory === category.id
                  }
                >
                  {category[language]}
                </button>
              ))}
            </div>

            <div className="behar-faq__accordion">
              {visibleQuestions.length === 0 && (
                <p className="behar-faq__empty">
                  {t.empty}
                </p>
              )}

              {visibleQuestions.map((item, index) => {
                const isOpen = openQuestion === item.id;
                const answerId = `behar-answer-${item.id}`;

                return (
                  <article
                    key={item.id}
                    className={`behar-faq__item ${
                      isOpen ? "is-open" : ""
                    }`}
                  >
                    <h3 className="behar-faq__item-heading">
                      <button
                        type="button"
                        className="behar-faq__trigger"
                        onClick={() =>
                          handleToggle(item.id)
                        }
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                      >
                        <span className="behar-faq__number">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="behar-faq__question">
                          {item.question[language]}
                        </span>

                        <span
                          className="behar-faq__toggle"
                          aria-hidden="true"
                        >
                          {isOpen ? (
                            <Minus
                              size={21}
                              strokeWidth={1.7}
                            />
                          ) : (
                            <Plus
                              size={21}
                              strokeWidth={1.7}
                            />
                          )}
                        </span>
                      </button>
                    </h3>

                    <div
                      id={answerId}
                      className="behar-faq__answer"
                      inert={!isOpen}
                      aria-hidden={!isOpen}
                    >
                      <div className="behar-faq__answer-inner">
                        <p>{item.answer[language]}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* CONTACT CTA */}
            <div className="behar-faq__contact">
              <div className="behar-faq__contact-icon">
                <MessageCircle
                  size={24}
                  strokeWidth={1.5}
                />
              </div>

              <div className="behar-faq__contact-copy">
                <span>{t.contactEyebrow}</span>
                <h3>{t.contactTitle}</h3>
                <p>{t.contactDescription}</p>
              </div>

              <Link
                to="/contact"
                className="behar-faq__contact-link"
                aria-label={t.contactButton}
              >
                <Arrow
                  size={23}
                  strokeWidth={1.7}
                />
              </Link>
            </div>
          </div>
        </div>

        <footer className="behar-faq__footer">
          <span>{t.footer}</span>
          <span>009 / 011</span>
        </footer>
      </div>
    </section>
  );
}
