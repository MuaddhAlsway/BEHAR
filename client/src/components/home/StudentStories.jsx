
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles } from "lucide-react";

import {
  studentStories,
  studentStoriesCopy,
} from "../../data/studentStories";

import StoryWall from "./StoryWall";
import StudentStoryModal from "./StudentStoryModal";

import "../../styles/student-stories.css";

gsap.registerPlugin(ScrollTrigger);

function getLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

export default function StudentStories() {
  const sectionRef = useRef(null);

  const [language, setLanguage] = useState(getLanguage);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalStory, setModalStory] = useState(null);

  const isArabic = language === "ar";
  const copy = studentStoriesCopy[language];

  const selectStory = useCallback((index) => {
    setActiveIndex(
      (index + studentStories.length) % studentStories.length
    );
  }, []);

  const closeModal = useCallback(() => {
    setModalStory(null);
  }, []);

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

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".behar-stories__heading > *",
        { y: 38, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-stories__heading",
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".behar-stories__portrait",
        { y: 65, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: {
            each: 0.09,
            from: "center",
          },
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-stories__wall",
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".behar-stories__feature",
        { y: 45, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-stories__feature",
            start: "top 90%",
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="behar-stories"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-stories-title"
    >
      <div className="behar-stories__container">
        <header className="behar-stories__heading">
          <div className="behar-stories__eyebrow">
            <Sparkles size={17} />
            <span>{copy.eyebrow}</span>
          </div>

          <h2 id="behar-stories-title">
            <span>{copy.headingOne}</span>
            <em>{copy.headingTwo}</em>
          </h2>

          <p>{copy.intro}</p>
        </header>

        <div className="behar-stories__gallery-heading">
          <span>{copy.explore}</span>
          <span>
            01 — {String(studentStories.length).padStart(2, "0")}
          </span>
        </div>

        <StoryWall
          stories={studentStories}
          activeIndex={activeIndex}
          language={language}
          onSelect={selectStory}
          onOpen={setModalStory}
        />

        <div className="behar-stories__bottom">
          <span>BEHAR / LEARNING WITHOUT BORDERS</span>
          <span>{copy.demo}</span>
        </div>
      </div>

      {modalStory && (
        <StudentStoryModal
          story={modalStory}
          language={language}
          copy={copy}
          onClose={closeModal}
        />
      )}
    </section>
  );
}
