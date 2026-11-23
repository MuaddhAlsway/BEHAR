
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowUpLeft,
  ArrowRight,
  ArrowLeft,
  Asterisk,
  BookOpen,
  GraduationCap,
  Star,
  Users,
  Globe2,
  Share2,
  Quote,
  UserRoundCog,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { courses } from "../../data/courses";
import { getInstructorByName } from "../../data/instructors";

import "../../styles/course-details/instructor-profile.css";

gsap.registerPlugin(ScrollTrigger);

const copy = {
  en: {
    index: "P13.4 / THE EDUCATOR'S STORY",
    eyebrow: "MEET YOUR INSTRUCTOR",
    heading: ["BEHIND EVERY", "GREAT LESSON."],
    label: "THE PERSON BEHIND THE KNOWLEDGE",
    biography: "THE STORY",
    expertise: "AREAS OF EXPERTISE",
    experience: "YEARS EXPERIENCE",
    students: "STUDENTS REACHED",
    courses: "COURSES CREATED",
    rating: "INSTRUCTOR RATING",
    moreCourses: "MORE FROM THIS INSTRUCTOR",
    explore: "EXPLORE COURSE",
    website: "WEBSITE",
    linkedin: "LINKEDIN",
    footer: "GREAT LEARNING BEGINS WITH GREAT TEACHERS.",
  },
  ar: {
    index: "P13.4 / قصة المدرب",
    eyebrow: "تعرّف على مدربك",
    heading: ["وراء كل درس", "ملهم قصة."],
    label: "الشخص وراء المعرفة",
    biography: "القصة",
    expertise: "مجالات الخبرة",
    experience: "سنوات الخبرة",
    students: "عدد الطلاب",
    courses: "الدورات المقدمة",
    rating: "تقييم المدرب",
    moreCourses: "المزيد من دورات المدرب",
    explore: "استكشف الدورة",
    website: "الموقع الإلكتروني",
    linkedin: "لينكدإن",
    footer: "التعلم الرائع يبدأ بمدربين رائعين.",
  },
};

function getLanguage() {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

function localize(value, language) {
  if (typeof value === "string") return value;
  return value?.[language] || value?.en || "";
}

export default function InstructorProfile({ course }) {
  const rootRef = useRef(null);

  const [language, setLanguage] = useState(getLanguage);

  const instructor = getInstructorByName(course.instructor);
  const expertise = instructor.expertise || instructor.skills || [];

  const isArabic = language === "ar";
  const t = copy[language];

  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;

  const otherCourses = courses
    .filter(
      (item) =>
        item.instructor === course.instructor &&
        item.slug !== course.slug
    )
    .slice(0, 2);

  useEffect(() => {
    const sync = () => setLanguage(getLanguage());

    sync();

    const observer = new MutationObserver(sync);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".behar-instructor__heading-line > span",
        { yPercent: 110, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.14,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".behar-instructor__intro",
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".behar-instructor__bio-content > *",
        { y: 35, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-instructor__bio-content",
            start: "top 85%",
            once: true,
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [course.slug, language]);

  const stats = [
    {
      icon: GraduationCap,
      value: instructor.experienceYears
        ? `${instructor.experienceYears}+`
        : null,
      label: t.experience,
    },
    {
      icon: Users,
      value: instructor.totalStudents?.toLocaleString(),
      label: t.students,
    },
    {
      icon: BookOpen,
      value: instructor.totalCourses
        ? String(instructor.totalCourses).padStart(2, "0")
        : null,
      label: t.courses,
    },
    {
      icon: Star,
      value:
        instructor.rating != null
          ? Number(instructor.rating).toFixed(1)
          : null,
      label: t.rating,
    },
  ].filter((stat) => stat.value != null);

  return (
    <section
      ref={rootRef}
      id="course-instructor"
      className="behar-instructor"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-labelledby="behar-instructor-heading"
    >
      <div className="behar-instructor__container">
        {/* TOPLINE */}
        <div className="behar-instructor__topline">
          <span>{t.index}</span>
          <Asterisk size={20} strokeWidth={1.4} />
        </div>

        {/* INTRO */}
        <header className="behar-instructor__intro">
          <div className="behar-instructor__eyebrow">
            <span className="behar-instructor__dot" />
            {t.eyebrow}
          </div>

          <h2
            id="behar-instructor-heading"
            className="behar-instructor__heading"
          >
            {t.heading.map((line, index) => (
              <span
                key={index}
                className={`behar-instructor__heading-line ${
                  index === 1
                    ? "behar-instructor__heading-line--accent"
                    : ""
                }`}
              >
                <span>{line}</span>
              </span>
            ))}
          </h2>
        </header>

        {/* MAIN PROFILE */}
        <div className="behar-instructor__profile">
          {/* PORTRAIT */}
          <div className="behar-instructor__portrait">
            <div className="behar-instructor__portrait-top">
              <span>BEHAR / EDUCATOR PROFILE</span>
              <span>001</span>
            </div>

            <div className="behar-instructor__portrait-frame">
              <span
                className="behar-instructor__portrait-icon"
                aria-hidden="true"
              >
                <UserRoundCog size={180} strokeWidth={1.05} />
              </span>
              <span className="behar-instructor__portrait-orbit" aria-hidden="true" />
            </div>

            <div className="behar-instructor__portrait-bottom">
              <span>{instructor.name}</span>
              <span>BEHAR®</span>
            </div>

            <div className="behar-instructor__portrait-number">
              04
            </div>
          </div>

          {/* BIOGRAPHY */}
          <div className="behar-instructor__bio">
            <div className="behar-instructor__bio-top">
              <span>{t.label}</span>
              <Quote size={26} strokeWidth={1.2} />
            </div>

            <div className="behar-instructor__bio-content">
              <span className="behar-instructor__bio-eyebrow">
                {t.biography} / 001
              </span>

              <h3>{instructor.name}</h3>

              <p className="behar-instructor__role">
                {localize(instructor.role, language)}
              </p>

              <blockquote className="behar-instructor__quote">
                “{localize(instructor.headline, language)}”
              </blockquote>

              <p className="behar-instructor__description">
                {localize(instructor.biography, language)}
              </p>

              <div className="behar-instructor__socials">
                {instructor.social?.website && (
                  <a
                    href={instructor.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe2 size={17} />
                    {t.website}
                    <Arrow size={16} />
                  </a>
                )}

                {instructor.social?.linkedin && (
                  <a
                    href={instructor.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Share2 size={17} />
                    {t.linkedin}
                    <Arrow size={16} />
                  </a>
                )}
              </div>
            </div>

            <div className="behar-instructor__bio-bottom">
              <span>BEHAR / THE PEOPLE WHO TEACH</span>
              <Arrow size={27} strokeWidth={1} />
            </div>
          </div>
        </div>

        {/* STATS */}
        {stats.length > 0 && (
          <div className="behar-instructor__stats">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="behar-instructor__stat"
                >
                  <Icon size={19} strokeWidth={1.4} />
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* EXPERTISE */}
        {expertise.length > 0 && (
          <div className="behar-instructor__expertise">
            <div className="behar-instructor__expertise-intro">
              <span>EXPERTISE / 001</span>

              <h3>{t.expertise}</h3>

              <div className="behar-instructor__expertise-symbol">
                <Asterisk size={40} strokeWidth={1} />
              </div>
            </div>

            <div className="behar-instructor__expertise-list">
              {expertise.map((item, index) => (
                <div
                  key={index}
                  className="behar-instructor__expertise-item"
                >
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <p>{localize(item, language)}</p>

                  <Arrow size={23} strokeWidth={1.2} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MORE COURSES */}
        {otherCourses.length > 0 && (
          <div className="behar-instructor__more">
            <div className="behar-instructor__more-heading">
              <span>BEHAR / CONTINUE LEARNING</span>
              <h3>{t.moreCourses}</h3>
            </div>

            <div className="behar-instructor__more-list">
              {otherCourses.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/courses/${item.slug}`}
                  className="behar-instructor__more-course"
                >
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <strong>
                    {localize(item.title, language)}
                  </strong>

                  <span className="behar-instructor__more-link">
                    {t.explore}
                    <Arrow size={18} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOMLINE */}
        <div className="behar-instructor__bottomline">
          <span>{t.footer}</span>
          <span>04 — 07</span>
        </div>
      </div>
    </section>
  );
}
