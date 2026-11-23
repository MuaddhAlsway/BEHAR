
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowUpLeft,
  Asterisk,
  Compass,
  UserRoundCog,
  PenTool,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../../styles/final-cta.css";

gsap.registerPlugin(ScrollTrigger);

const copy = {
  en: {
    index: "010 / THE UNFINISHED CANVAS",
    label: "A NOTE TO YOUR FUTURE SELF",
    line1: "YOU ARE NOT",
    line2: "THE FINISHED",
    line3: "VERSION.",
    unfinished: "UNFINISHED",
    unlimited: "UNLIMITED",
    preface: "THE NEXT CHAPTER IS YOURS TO WRITE",
    description:
      "There is more to learn. More to create. More to become. Your next chapter begins with a single decision.",
    cta: "Make Your Next Move",
    secondary: "Explore the possibilities",
    stamp: "ALWAYS BECOMING",
    footer: "BEHAR / LEARNING WITHOUT BORDERS",
    scroll: "KEEP EXPLORING",
    imageAlt: [
      "Creative professional exploring ideas",
      "Portrait of a creative learner",
      "Workspace with a laptop",
    ],
  },
  ar: {
    index: "010 / اللوحة غير المكتملة",
    label: "رسالة إلى نفسك في المستقبل",
    line1: "أنت لست",
    line2: "نسختك",
    line3: "الأخيرة.",
    unfinished: "لم تكتمل بعد",
    unlimited: "بلا حدود",
    preface: "الفصل القادم أنت من يكتبه",
    description:
      "ما زال أمامك الكثير لتتعلمه، والكثير لتبدعه، والكثير لتصبحه. فصل جديد يبدأ بقرار واحد.",
    cta: "ابدأ خطوتك القادمة",
    secondary: "اكتشف الفرص",
    stamp: "في تطور مستمر",
    footer: "بحار / تعلّم بلا حدود",
    scroll: "واصل الاكتشاف",
    imageAlt: [
      "شخص مبدع يستكشف أفكارًا جديدة",
      "صورة شخصية لمتعلم مبدع",
      "مساحة عمل مع حاسوب محمول",
    ],
  },
};

function getLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

export default function FinalCTA() {
  const sectionRef = useRef(null);
  const wordRef = useRef(null);
  const collageRef = useRef(null);
  const [language, setLanguage] = useState(getLanguage);
  const [transformed, setTransformed] = useState(false);

  const isArabic = language === "ar";
  const t = copy[language];
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;

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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      setTransformed(true);
      return;
    }

    setTransformed(false);

    const ctx = gsap.context(() => {
      // Opening typography
      gsap.fromTo(
        ".behar-final__headline-line",
        { yPercent: 115, rotate: 4, autoAlpha: 0 },
        {
          yPercent: 0,
          rotate: 0,
          autoAlpha: 1,
          duration: 1.15,
          stagger: 0.13,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".behar-final__intro",
            start: "top 80%",
            once: true,
          },
        }
      );

      // Collage assembles as user scrolls
      const collageTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: collageRef.current,
          start: "top 85%",
          end: "center 42%",
          scrub: 1.1,
        },
      });

      collageTimeline
        .fromTo(
          ".behar-final__photo--one",
          { x: -150, y: 120, rotate: -25, autoAlpha: 0 },
          { x: 0, y: 0, rotate: -9, autoAlpha: 1, ease: "none" },
          0
        )
        .fromTo(
          ".behar-final__photo--two",
          { y: 210, scale: 0.65, rotate: 15, autoAlpha: 0 },
          { y: 0, scale: 1, rotate: 5, autoAlpha: 1, ease: "none" },
          0.08
        )
        .fromTo(
          ".behar-final__photo--three",
          { x: 150, y: -100, rotate: 24, autoAlpha: 0 },
          { x: 0, y: 0, rotate: 11, autoAlpha: 1, ease: "none" },
          0.16
        )
        .fromTo(
          ".behar-final__collage-note",
          { scale: 0.5, rotate: -35, autoAlpha: 0 },
          { scale: 1, rotate: -12, autoAlpha: 1, ease: "none" },
          0.25
        );

      // Final message transition
      ScrollTrigger.create({
        trigger: ".behar-final__transformation",
        start: "top 75%",
        onEnter: () => setTransformed(true),
        onLeaveBack: () => setTransformed(false),
      });

      // CTA reveal
      gsap.fromTo(
        ".behar-final__action",
        { y: 65, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-final__action",
            start: "top 90%",
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [language]);

  useEffect(() => {
    const word = wordRef.current;
    if (!word) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    gsap.fromTo(
      word,
      { y: 18, opacity: 0, filter: "blur(8px)" },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.65,
        ease: "power3.out",
        overwrite: true,
      }
    );
  }, [transformed, language]);

  return (
    <section
      ref={sectionRef}
      className="behar-final"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-final-heading"
    >
      <div className="behar-final__container">
        <div className="behar-final__topline">
          <span>{t.index}</span>
          <Asterisk size={20} strokeWidth={1.5} />
        </div>

        {/* OVERSIZED TYPOGRAPHY */}
        <header className="behar-final__intro">
          <div className="behar-final__eyebrow">
            <span className="behar-final__dot" />
            {t.label}
          </div>

          <h2
            id="behar-final-heading"
            className="behar-final__headline"
          >
            <span className="behar-final__line-mask">
              <span className="behar-final__headline-line">
                {t.line1}
              </span>
            </span>

            <span className="behar-final__line-mask">
              <span className="behar-final__headline-line">
                {t.line2}
              </span>
            </span>

            <span className="behar-final__line-mask">
              <span className="behar-final__headline-line behar-final__headline-line--accent">
                {t.line3}
              </span>
            </span>
          </h2>

          <div className="behar-final__intro-bottom">
            <span>BEHAR®</span>
            <span>{t.preface}</span>
          </div>
        </header>

        {/* EXPERIMENTAL PHOTO COLLAGE */}
        <div
          ref={collageRef}
          className="behar-final__collage"
        >
          <span
            className="behar-final__collage-outline"
            aria-hidden="true"
          >
            B
          </span>

          <div className="behar-final__photo behar-final__photo--one">
            <span className="behar-final__photo-icon" aria-hidden="true">
              <Compass size={112} strokeWidth={1.05} />
            </span>
            <span className="behar-final__photo-index">
              01 / DISCOVER
            </span>
          </div>

          <div className="behar-final__photo behar-final__photo--two">
            <span className="behar-final__photo-icon" aria-hidden="true">
              <UserRoundCog size={112} strokeWidth={1.05} />
            </span>
            <span className="behar-final__photo-index">
              02 / BECOME
            </span>
          </div>

          <div className="behar-final__photo behar-final__photo--three">
            <span className="behar-final__photo-icon" aria-hidden="true">
              <PenTool size={112} strokeWidth={1.05} />
            </span>
            <span className="behar-final__photo-index">
              03 / CREATE
            </span>
          </div>

          <div className="behar-final__collage-note">
            <Asterisk size={31} strokeWidth={1.3} />
            <span>{t.stamp}</span>
          </div>

          <div
            className="behar-final__collage-cross"
            aria-hidden="true"
          >
            +
          </div>
        </div>

        {/* WORD TRANSFORMATION */}
        <div className="behar-final__transformation">
          <span className="behar-final__transform-label">
            {t.preface}
          </span>

          <div
            className="behar-final__transform-word"
            aria-live="off"
          >
            <span ref={wordRef} key={`${language}-${transformed}`}>
              {transformed ? t.unlimited : t.unfinished}
            </span>
          </div>

          <div className="behar-final__transform-rule">
            <span />
            <Asterisk size={21} strokeWidth={1.4} />
          </div>
        </div>

        {/* CTA */}
        <div className="behar-final__action">
          <p>{t.description}</p>

          <Link
            to="/courses"
            className="behar-final__cta"
          >
            <span className="behar-final__cta-text">
              {t.cta}
            </span>

            <span className="behar-final__cta-arrow">
              <Arrow size={27} strokeWidth={1.7} />
            </span>
          </Link>

          <Link
            to="/courses"
            className="behar-final__secondary"
          >
            {t.secondary}
            <Arrow size={16} strokeWidth={1.6} />
          </Link>
        </div>

        <footer className="behar-final__footer">
          <span>{t.footer}</span>
          <span>{t.scroll}</span>
        </footer>
      </div>
    </section>
  );
}
