
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ArrowUpLeft,
  Sparkles,
  GraduationCap,
  Layers3,
  TrendingUp,
  Code2,
  Palette,
  BriefcaseBusiness,
  BrainCircuit,
  Camera,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { instructors } from "../../data/instructors";
import InstructorProfileModal from "./InstructorProfileModal";
import "../../styles/meet-instructors.css";

gsap.registerPlugin(ScrollTrigger);

const facultyIconMap = {
  development: Code2,
  design: Palette,
  technology: BrainCircuit,
  business: BriefcaseBusiness,
  creative: Camera,
};

const copy = {
  en: {
    eyebrow: "006 / OUR INSTRUCTORS",
    title: "Meet the minds",
    accent: "that move you.",
    description:
      "Industry experts, creators, and practitioners turning real experience into learning that creates real progress.",
    all: "Explore all instructors",
    featured: "FEATURED INSTRUCTOR",
    view: "Meet instructor",
    previous: "Previous instructor",
    next: "Next instructor",
    explore: "EXPLORE THE FACULTY",
    benefits: [
      {
        title: "Real expertise",
        text: "Learn from people who do the work.",
      },
      {
        title: "Practical knowledge",
        text: "Industry-tested skills and insights.",
      },
      {
        title: "Diverse perspectives",
        text: "Different fields. Real-world experience.",
      },
      {
        title: "Meaningful progress",
        text: "Knowledge you can put into action.",
      },
    ],
  },
  ar: {
    eyebrow: "006 / مدربونا",
    title: "تعرّف على العقول",
    accent: "التي تلهمك.",
    description:
      "خبراء ومبدعون وممارسون يحوّلون تجاربهم الواقعية إلى معرفة تصنع فرقًا حقيقيًا.",
    all: "استكشف جميع المدربين",
    featured: "مدرب مميز",
    view: "تعرّف على المدرب",
    previous: "المدرب السابق",
    next: "المدرب التالي",
    explore: "اكتشف المدربين",
    benefits: [
      {
        title: "خبرة حقيقية",
        text: "تعلّم من أصحاب الخبرة العملية.",
      },
      {
        title: "معرفة تطبيقية",
        text: "مهارات وتجارب من سوق العمل.",
      },
      {
        title: "وجهات نظر متنوعة",
        text: "تخصصات مختلفة وخبرات واقعية.",
      },
      {
        title: "تقدّم ملموس",
        text: "معرفة يمكنك تحويلها إلى عمل.",
      },
    ],
  },
};

const benefitIcons = [
  GraduationCap,
  Layers3,
  Sparkles,
  TrendingUp,
];

function readLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

export default function MeetInstructors() {
  const sectionRef = useRef(null);
  const galleryRef = useRef(null);
  const [language, setLanguage] = useState(readLanguage);
  const [activeIndex, setActiveIndex] = useState(2);
  const [skillsVisibleIndex, setSkillsVisibleIndex] = useState(null);
  const [modalInstructor, setModalInstructor] = useState(null);

  const isArabic = language === "ar";
  const t = copy[language];
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;
  const Next = isArabic ? ArrowLeft : ArrowRight;
  const Previous = isArabic ? ArrowRight : ArrowLeft;

  const closeModal = useCallback(() => {
    setModalInstructor(null);
  }, []);

  useEffect(() => {
    const sync = () => {
      setLanguage(
        document.documentElement.lang === "ar" ? "ar" : "en"
      );
    };

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduced) return;

      gsap.fromTo(
        ".behar-faculty__heading > *",
        { y: 35, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-faculty__heading",
            start: "top 85%",
            once: false,
            toggleActions: "restart none restart none",
          },
        }
      );

      gsap.fromTo(
        ".behar-faculty__gallery",
        { y: 55, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-faculty__gallery",
            start: "top 85%",
            once: false,
            toggleActions: "restart none restart none",
          },
        }
      );

      gsap.fromTo(
        ".behar-faculty__benefit",
        { y: 25, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-faculty__benefits",
            start: "top 90%",
            once: false,
            toggleActions: "restart none restart none",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const cards = Array.from(
      gallery.querySelectorAll(".behar-faculty__card")
    );

    if (reduced) return;

    gsap.to(cards, {
      flexGrow: (index) => (index === activeIndex ? 3.4 : 1),
      duration: 0.75,
      ease: "power3.inOut",
      overwrite: "auto",
    });

    const cleanup = cards.map((card, index) => {
      const image = card.querySelector(".behar-faculty__card-image");
      const overlay = card.querySelector(".behar-faculty__card-overlay");
      const arrow = card.querySelector(".behar-faculty__card-arrow");
      const onEnter = () => {
        gsap.to(cards, {
          flexGrow: (cardIndex) => (cardIndex === index ? 3.4 : 1),
          duration: 0.55,
          ease: "power3.inOut",
          overwrite: "auto",
        });
        gsap.to(image, { scale: 1.06, duration: 0.7, ease: "power3.out", overwrite: "auto" });
        gsap.to(overlay, { opacity: 0.82, duration: 0.35, overwrite: "auto" });
        gsap.to(arrow, { y: 0, rotate: 45, autoAlpha: 1, duration: 0.4, ease: "power3.out", overwrite: "auto" });
      };
      const onLeave = () => {
        gsap.to(cards, {
          flexGrow: (cardIndex) => (cardIndex === activeIndex ? 3.4 : 1),
          duration: 0.55,
          ease: "power3.inOut",
          overwrite: "auto",
        });
        gsap.to(image, { scale: 1, duration: 0.8, ease: "power3.out", overwrite: "auto" });
        gsap.to(overlay, { opacity: 1, duration: 0.35, overwrite: "auto" });
        if (!card.classList.contains("is-active")) {
          gsap.to(arrow, { y: 8, rotate: 0, autoAlpha: 0, duration: 0.3, overwrite: "auto" });
        }
      };
      card.addEventListener("pointerenter", onEnter);
      card.addEventListener("pointerleave", onLeave);
      return () => {
        card.removeEventListener("pointerenter", onEnter);
        card.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => {
      cleanup.forEach((remove) => remove());
      gsap.killTweensOf(cards);
    };
  }, [activeIndex]);

  const changeInstructor = (index) => {
    const nextIndex = (index + instructors.length) % instructors.length;
    setActiveIndex(nextIndex);
    galleryRef.current
      ?.querySelector(`[data-instructor-index="${nextIndex}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  const handleCardClick = (index) => {
    setSkillsVisibleIndex(index);

    if (index === activeIndex) {
      setModalInstructor(instructors[index]);
    } else {
      changeInstructor(index);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="behar-faculty"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-faculty-title"
    >
      <div className="behar-faculty__container">
        <header className="behar-faculty__heading">
          <div className="behar-faculty__eyebrow">
            <Sparkles size={17} />
            <span>{t.eyebrow}</span>
          </div>

          <div className="behar-faculty__heading-grid">
            <h2 id="behar-faculty-title">
              <span>{t.title}</span>
              <em>{t.accent}</em>
            </h2>

            <div className="behar-faculty__heading-aside">
              <p>{t.description}</p>

              <Link
                to="/instructors"
                className="behar-faculty__all-link"
              >
                <span>{t.all}</span>
                <Arrow size={19} />
              </Link>
            </div>
          </div>
        </header>

        <div className="behar-faculty__gallery-wrap">
          <div className="behar-faculty__gallery" ref={galleryRef}>
            {instructors.map((instructor, index) => {
              const active = index === activeIndex;
              const instructorName = language === "ar"
                ? instructor.nameAr || instructor.name
                : instructor.name;

              return (
                <button
                  key={instructor.id}
                  type="button"
                  className={`behar-faculty__card ${
                    active ? "is-active" : ""
                  }`}
                  data-instructor-index={index}
                  style={{
                    flexGrow: active ? 3.4 : 1,
                  }}
                  onClick={() => handleCardClick(index)}
                  aria-label={`${instructorName} — ${
                    active ? t.view : instructor.specialty[language]
                  }`}
                >
                  {(() => {
                    const FacultyIcon = facultyIconMap[instructor.category] || GraduationCap;

                    return (
                      <span className="behar-faculty__card-image" aria-hidden="true">
                        <FacultyIcon size={88} strokeWidth={1.15} />
                      </span>
                    );
                  })()}

                  <span className="behar-faculty__card-overlay" />

                  {active && (
                    <span className="behar-faculty__featured">
                      ✳ {t.featured}
                    </span>
                  )}

                  <span className="behar-faculty__card-info">
                    <span className="behar-faculty__card-name">
                      {instructorName}
                    </span>

                    <span className="behar-faculty__card-role">
                      {instructor.role[language]}
                    </span>

                    <span
                      className={`behar-faculty__card-skills ${
                        skillsVisibleIndex === index ? "is-skills-visible" : ""
                      }`}
                    >
                      {instructor.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </span>
                  </span>

                  <span className="behar-faculty__card-arrow">
                    <Arrow size={19} />
                  </span>
                </button>
              );
            })}
          </div>

          <div className="behar-faculty__gallery-footer">
            <div className="behar-faculty__counter">
              <strong>
                {String(activeIndex + 1).padStart(2, "0")}
              </strong>
              <span>/</span>
              <span>
                {String(instructors.length).padStart(2, "0")}
              </span>
            </div>

            <div className="behar-faculty__progress">
              {instructors.map((instructor, index) => (
                <button
                  key={instructor.id}
                  type="button"
                  className={
                    index === activeIndex ? "is-active" : ""
                  }
                  onClick={() => changeInstructor(index)}
                  aria-label={language === "ar" ? instructor.nameAr || instructor.name : instructor.name}
                  aria-current={
                    index === activeIndex ? "true" : undefined
                  }
                >
                  <span />
                </button>
              ))}
            </div>

            <div className="behar-faculty__controls">
              <button
                type="button"
                onClick={() => changeInstructor(activeIndex - 1)}
                aria-label={t.previous}
              >
                <Previous size={20} />
              </button>

              <button
                type="button"
                onClick={() => changeInstructor(activeIndex + 1)}
                aria-label={t.next}
              >
                <Next size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="behar-faculty__benefits">
          {t.benefits.map((benefit, index) => {
            const Icon = benefitIcons[index];

            return (
              <div
                key={benefit.title}
                className="behar-faculty__benefit"
              >
                <span className="behar-faculty__benefit-icon">
                  <Icon size={25} strokeWidth={1.5} />
                </span>

                <div>
                  <strong>{benefit.title}</strong>
                  <p>{benefit.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modalInstructor && (
        <InstructorProfileModal
          instructor={modalInstructor}
          language={language}
          onClose={closeModal}
        />
      )}
    </section>
  );
}
