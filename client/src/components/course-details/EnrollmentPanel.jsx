
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowUpLeft,
  Asterisk,
  BookOpen,
  Clock3,
  GraduationCap,
  Check,
  ShieldCheck,
  Play,
  LoaderCircle,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../../styles/course-details/enrollment-panel.css";

gsap.registerPlugin(ScrollTrigger);

const copy = {
  en: {
    index: "P13.6 / THE DECISION POINT",
    eyebrow: "YOUR NEXT CHAPTER STARTS HERE",
    heading: ["INVEST IN", "WHAT'S NEXT."],
    intro:
      "The skills you build today shape the opportunities you create tomorrow. Your next step begins here.",
    enrollment: "YOUR ENROLLMENT",
    investment: "YOUR INVESTMENT",
    free: "FREE",
    currency: "SAR",
    oneTime: "ONE-TIME PAYMENT",
    noPayment: "NO PAYMENT REQUIRED",
    included: "WHAT'S INCLUDED",
    benefits: [
      "Access to course learning materials",
      "Structured video lessons",
      "Quizzes and practical assignments",
      "Learn at your own pace",
    ],
    course: "SELECTED COURSE",
    instructor: "INSTRUCTOR",
    level: "LEVEL",
    duration: "DURATION",
    hours: "HOURS",
    language: "LANGUAGE",
    enroll: "ENROLL NOW",
    start: "START LEARNING",
    continue: "CONTINUE LEARNING",
    processing: "PROCESSING...",
    enrolled: "YOU'RE ENROLLED",
    secure: "SECURE ENROLLMENT",
    note:
      "Your enrollment will be linked to your student account.",
    mobileLabel: "COURSE ENROLLMENT",
    footer: "YOUR FUTURE IS BUILT ONE SKILL AT A TIME.",
  },
  ar: {
    index: "P13.6 / نقطة القرار",
    eyebrow: "فصلك القادم يبدأ من هنا",
    heading: ["استثمر في", "مستقبلك."],
    intro:
      "المهارات التي تكتسبها اليوم تصنع الفرص التي تحققها غدًا. خطوتك القادمة تبدأ من هنا.",
    enrollment: "التسجيل في الدورة",
    investment: "قيمة الاستثمار",
    free: "مجانًا",
    currency: "ر.س",
    oneTime: "دفعة واحدة",
    noPayment: "لا يتطلب الدفع",
    included: "ماذا يشمل التسجيل",
    benefits: [
      "الوصول إلى المواد التعليمية للدورة",
      "دروس فيديو منظمة",
      "اختبارات وواجبات عملية",
      "التعلم بالسرعة التي تناسبك",
    ],
    course: "الدورة المختارة",
    instructor: "المدرب",
    level: "المستوى",
    duration: "المدة",
    hours: "ساعة",
    language: "اللغة",
    enroll: "سجّل الآن",
    start: "ابدأ التعلم",
    continue: "متابعة التعلم",
    processing: "جاري المعالجة...",
    enrolled: "أنت مسجل بالفعل",
    secure: "تسجيل آمن",
    note:
      "سيتم ربط تسجيلك بحساب الطالب الخاص بك.",
    mobileLabel: "التسجيل في الدورة",
    footer: "مستقبلك يُبنى مهارة بعد أخرى.",
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

function formatPrice(price, language) {
  const amount = Number(price);

  if (!Number.isFinite(amount)) return "—";
  if (amount === 0) return copy[language].free;

  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US",
    { maximumFractionDigits: 2 }
  ).format(amount);
}

export default function EnrollmentPanel({
  course,
  onEnroll,
  isEnrolled = false,
  isLoading = false,
  onContinue,
}) {
  const rootRef = useRef(null);
  const [language, setLanguage] = useState(getLanguage);
  const [showMobileBar, setShowMobileBar] = useState(false);

  const t = copy[language];
  const isArabic = language === "ar";
  const Arrow = isArabic ? ArrowUpLeft : ArrowUpRight;

  const price = Number(course.price);
  const isFree = Number.isFinite(price) && price === 0;

  const courseTitle = localize(course.title, language);
  const instructorName =
    typeof course.instructor === "string"
      ? course.instructor
      : localize(course.instructor?.name, language);

  const courseLevel = localize(course.level, language);
  const courseLanguage = localize(course.language, language);

  const priceLabel = formatPrice(course.price, language);

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
    const target = rootRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isBelowSection =
          entry.boundingClientRect.top < 0;

        setShowMobileBar(
          !entry.isIntersecting && isBelowSection
        );
      },
      { threshold: 0 }
    );

    observer.observe(target);

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
        ".behar-enroll__heading-line > span",
        { yPercent: 110, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".behar-enroll__intro",
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".behar-enroll__ticket",
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-enroll__ticket",
            start: "top 90%",
            once: true,
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [course.slug, language]);

  const handleEnrollment = () => {
    if (isLoading) return;

    if (isEnrolled) {
      onContinue?.(course);
      return;
    }

    onEnroll?.(course);
  };

  const buttonText = isLoading
    ? t.processing
    : isEnrolled
      ? t.continue
      : isFree
        ? t.start
        : t.enroll;

  return (
    <>
      <section
        ref={rootRef}
        id="course-enrollment"
        className="behar-enroll"
        dir={isArabic ? "rtl" : "ltr"}
        lang={language}
        aria-labelledby="behar-enroll-heading"
      >
        <div className="behar-enroll__container">
          {/* TOPLINE */}
          <div className="behar-enroll__topline">
            <span>{t.index}</span>
            <Asterisk size={20} strokeWidth={1.4} />
          </div>

          {/* INTRO */}
          <header className="behar-enroll__intro">
            <div className="behar-enroll__eyebrow">
              <span className="behar-enroll__dot" />
              {t.eyebrow}
            </div>

            <h2
              id="behar-enroll-heading"
              className="behar-enroll__heading"
            >
              {t.heading.map((line, index) => (
                <span
                  key={index}
                  className={`behar-enroll__heading-line ${
                    index === 1
                      ? "behar-enroll__heading-line--accent"
                      : ""
                  }`}
                >
                  <span>{line}</span>
                </span>
              ))}
            </h2>

            <div className="behar-enroll__intro-bottom">
              <p>{t.intro}</p>

              <div className="behar-enroll__intro-symbol">
                <Sparkles size={35} strokeWidth={1} />
              </div>
            </div>
          </header>

          {/* ENROLLMENT EXPERIENCE */}
          <div className="behar-enroll__experience">
            {/* LEFT EDITORIAL PANEL */}
            <div className="behar-enroll__editorial">
              <div className="behar-enroll__editorial-top">
                <span>BEHAR / LEARNING ACCESS</span>
                <span>001</span>
              </div>

              <div className="behar-enroll__editorial-content">
                <span className="behar-enroll__editorial-eyebrow">
                  {t.course}
                </span>

                <h3>{courseTitle}</h3>

                <div className="behar-enroll__course-details">
                  <div>
                    <span>{t.instructor}</span>
                    <strong>{instructorName || "—"}</strong>
                  </div>

                  <div>
                    <span>{t.level}</span>
                    <strong>{courseLevel || "—"}</strong>
                  </div>

                  <div>
                    <span>{t.duration}</span>
                    <strong>
                      {course.durationHours ?? "—"} {t.hours}
                    </strong>
                  </div>

                  <div>
                    <span>{t.language}</span>
                    <strong>{courseLanguage || "—"}</strong>
                  </div>
                </div>
              </div>

              <div className="behar-enroll__editorial-bottom">
                <span>BEHAR® EDUCATION PLATFORM</span>
                <GraduationCap size={34} strokeWidth={1} />
              </div>

              <span className="behar-enroll__editorial-watermark">
                B.
              </span>
            </div>

            {/* RIGHT ENROLLMENT TICKET */}
            <div className="behar-enroll__ticket">
              <div className="behar-enroll__ticket-top">
                <span>{t.enrollment}</span>
                <Asterisk size={25} strokeWidth={1.2} />
              </div>

              <div className="behar-enroll__price-block">
                <span className="behar-enroll__price-label">
                  {t.investment}
                </span>

                <div className="behar-enroll__price">
                  <strong>{priceLabel}</strong>
                  {!isFree && Number.isFinite(price) && (
                    <span>{t.currency}</span>
                  )}
                </div>

                <p>
                  {isFree ? t.noPayment : t.oneTime}
                </p>
              </div>

              <div className="behar-enroll__ticket-divider">
                <span />
                <span />
              </div>

              <div className="behar-enroll__benefits">
                <h4>{t.included}</h4>

                {t.benefits.map((benefit, index) => {
                  const icons = [
                    BookOpen,
                    Play,
                    GraduationCap,
                    Clock3,
                  ];
                  const Icon = icons[index];

                  return (
                    <div
                      key={index}
                      className="behar-enroll__benefit"
                    >
                      <span className="behar-enroll__benefit-icon">
                        <Icon size={18} strokeWidth={1.4} />
                      </span>

                      <span>{benefit}</span>

                      <Check size={17} strokeWidth={1.5} />
                    </div>
                  );
                })}
              </div>

              <div className="behar-enroll__action">
                <button
                  type="button"
                  className="behar-enroll__button"
                  onClick={handleEnrollment}
                  disabled={isLoading}
                >
                  <span>{buttonText}</span>

                  {isLoading ? (
                    <LoaderCircle
                      size={21}
                      className="behar-enroll__spinner"
                    />
                  ) : (
                    <Arrow size={23} strokeWidth={1.6} />
                  )}
                </button>

                {isEnrolled && (
                  <div className="behar-enroll__enrolled">
                    <ShieldCheck size={18} />
                    {t.enrolled}
                  </div>
                )}

                <div className="behar-enroll__security">
                  <LockKeyhole size={15} strokeWidth={1.5} />
                  <span>{t.secure}</span>
                </div>

                <p className="behar-enroll__note">
                  {t.note}
                </p>
              </div>
            </div>
          </div>

          {/* BOTTOMLINE */}
          <div className="behar-enroll__bottomline">
            <span>{t.footer}</span>
            <span>06 — 07</span>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY ENROLLMENT BAR */}
      <div
        className={`behar-enroll__mobile-bar ${
          showMobileBar ? "is-visible" : ""
        }`}
        dir={isArabic ? "rtl" : "ltr"}
        lang={language}
        aria-hidden={!showMobileBar}
      >
        <div className="behar-enroll__mobile-info">
          <span>{t.mobileLabel}</span>

          <strong>
            {priceLabel}
            {!isFree && Number.isFinite(price)
              ? ` ${t.currency}`
              : ""}
          </strong>
        </div>

        <button
          type="button"
          onClick={handleEnrollment}
          disabled={isLoading || !showMobileBar}
          tabIndex={showMobileBar ? 0 : -1}
        >
          {buttonText}

          {isLoading ? (
            <LoaderCircle
              size={17}
              className="behar-enroll__spinner"
            />
          ) : (
            <Arrow size={18} />
          )}
        </button>
      </div>
    </>
  );
}
