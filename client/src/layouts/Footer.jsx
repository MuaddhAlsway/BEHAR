
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowUpLeft,
  ArrowUp,
  Asterisk,
  Globe2,
  Waves,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../styles/footer.css";

const CURRENT_YEAR = new Date().getFullYear();

gsap.registerPlugin(ScrollTrigger);

const footerContent = {
  en: {
    eyebrow: "BEHAR / THE FINAL CHAPTER",
    manifestoLabel: "THERE IS ALWAYS MORE TO DISCOVER",
    heading: ["THE END", "IS JUST THE", "BEGINNING."],
    horizonLabel: "BEYOND THE HORIZON",
    horizonNumber: "01 — ∞",
    explore: "EXPLORE THE UNKNOWN",
    directory: "THE DIRECTORY",
    directoryDescription:
      "Every great journey begins with curiosity.",
    navigation: [
      { number: "01", label: "Explore Courses", path: "/courses" },
      { number: "02", label: "Our Story", path: "/about" },
      {
        number: "03",
        label: "Become an Instructor",
        path: "/become-an-instructor",
      },
      { number: "04", label: "Contact", path: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", path: "/privacy-policy" },
      { label: "Terms of Service", path: "/terms-of-service" },
    ],
    signature: "LEARNING WITHOUT BORDERS",
    copyright: "ALL RIGHTS RESERVED",
    backToTop: "BACK TO TOP",
    language: "LANGUAGE",
    imageAlt: "A peaceful ocean stretching toward the horizon",
  },

  ar: {
    eyebrow: "بحار / الفصل الأخير",
    manifestoLabel: "هناك دائمًا المزيد لاكتشافه",
    heading: ["النهاية", "ليست سوى", "البداية."],
    horizonLabel: "ما وراء الأفق",
    horizonNumber: "٠١ — ∞",
    explore: "اكتشف ما وراء المألوف",
    directory: "دليل المنصة",
    directoryDescription:
      "كل رحلة عظيمة تبدأ بالفضول.",
    navigation: [
      { number: "٠١", label: "استكشف الدورات", path: "/courses" },
      { number: "٠٢", label: "قصتنا", path: "/about" },
      {
        number: "٠٣",
        label: "كن مدربًا",
        path: "/become-an-instructor",
      },
      { number: "٠٤", label: "تواصل معنا", path: "/contact" },
    ],
    legal: [
      { label: "سياسة الخصوصية", path: "/privacy-policy" },
      { label: "الشروط والأحكام", path: "/terms-of-service" },
    ],
    signature: "تعلّم بلا حدود",
    copyright: "جميع الحقوق محفوظة",
    backToTop: "العودة للأعلى",
    language: "اللغة",
    imageAlt: "محيط هادئ يمتد حتى الأفق",
  },
};

function getLanguage() {
  if (typeof document === "undefined") return "en";

  return document.documentElement.lang === "ar"
    ? "ar"
    : "en";
}

export default function Footer() {
  const footerRef = useRef(null);
  const imageRef = useRef(null);

  const [language, setLanguage] = useState(getLanguage);

  const isArabic = language === "ar";
  const t = footerContent[language];

  const DiagonalArrow = isArabic
    ? ArrowUpLeft
    : ArrowUpRight;

  // Sync with the existing BEHAR language switcher.
  useEffect(() => {
    const syncLanguage = () => {
      setLanguage(getLanguage());
    };

    syncLanguage();

    const observer = new MutationObserver(syncLanguage);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  // Scroll-driven editorial animations.
  useEffect(() => {
    const footer = footerRef.current;

    if (!footer) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      // Oversized manifesto entrance.
      gsap.fromTo(
        ".behar-footer__heading-line > span",
        {
          yPercent: 110,
          autoAlpha: 0,
        },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.15,
          stagger: 0.13,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".behar-footer__manifesto",
            start: "top 82%",
            once: true,
          },
        }
      );

      // Cinematic image mask.
      gsap.fromTo(
        ".behar-footer__horizon",
        {
          clipPath: "inset(15% 0% 15% 0%)",
          autoAlpha: 0,
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          autoAlpha: 1,
          duration: 1.4,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: ".behar-footer__horizon",
            start: "top 85%",
            once: true,
          },
        }
      );

      // Slow horizon parallax.
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          {
            yPercent: -9,
            scale: 1.14,
          },
          {
            yPercent: 9,
            scale: 1.14,
            ease: "none",
            scrollTrigger: {
              trigger: ".behar-footer__horizon",
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          }
        );
      }

      // Numbered navigation reveal.
      gsap.fromTo(
        ".behar-footer__nav-item",
        {
          y: 45,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".behar-footer__directory",
            start: "top 80%",
            once: true,
          },
        }
      );

      // Monumental wordmark reveal.
      gsap.fromTo(
        ".behar-footer__wordmark",
        {
          yPercent: 45,
          autoAlpha: 0,
        },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".behar-footer__signature",
            start: "top 92%",
            once: true,
          },
        }
      );
    }, footer);

    return () => ctx.revert();
  }, [language]);

  const scrollToTop = () => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  };

  const switchLanguage = () => {
    const nextLanguage = isArabic ? "en" : "ar";

    document.documentElement.lang = nextLanguage;
    document.documentElement.dir =
      nextLanguage === "ar" ? "rtl" : "ltr";

    localStorage.setItem("behar-language", nextLanguage);
    setLanguage(nextLanguage);
  };

  return (
    <footer
      ref={footerRef}
      className="behar-footer"
      dir={isArabic ? "rtl" : "ltr"}
      lang={language}
      aria-label={isArabic ? "تذييل الموقع" : "Site footer"}
    >
      <div className="behar-footer__container">
        {/* TOP INDEX */}
        <div className="behar-footer__topline">
          <span>{t.eyebrow}</span>
          <Asterisk
            size={22}
            strokeWidth={1.4}
            aria-hidden="true"
          />
        </div>

        {/* MANIFESTO */}
        <div className="behar-footer__manifesto">
          <div className="behar-footer__eyebrow">
            <span className="behar-footer__eyebrow-dot" />
            {t.manifestoLabel}
          </div>

          <h2 className="behar-footer__heading">
            {t.heading.map((line, index) => (
              <span
                key={index}
                className={`behar-footer__heading-line ${
                  index === 1
                    ? "behar-footer__heading-line--accent"
                    : ""
                }`}
              >
                <span>{line}</span>
              </span>
            ))}
          </h2>
        </div>

        {/* LIVING HORIZON */}
        <div className="behar-footer__horizon">
          <span
            ref={imageRef}
            className="behar-footer__horizon-image"
            aria-hidden="true"
          >
            <Waves size={170} strokeWidth={1.05} />
          </span>

          <div className="behar-footer__horizon-overlay" />

          <div className="behar-footer__horizon-top">
            <span>{t.horizonLabel}</span>
            <span>{t.horizonNumber}</span>
          </div>

          <Link
            to="/courses"
            className="behar-footer__horizon-link"
          >
            <span>{t.explore}</span>

            <span className="behar-footer__horizon-link-icon">
              <DiagonalArrow
                size={22}
                strokeWidth={1.6}
                aria-hidden="true"
              />
            </span>
          </Link>
        </div>

        {/* EDITORIAL DIRECTORY */}
        <div className="behar-footer__directory">
          <div className="behar-footer__directory-intro">
            <span className="behar-footer__section-index">
              02 / 04
            </span>

            <h3>{t.directory}</h3>
            <p>{t.directoryDescription}</p>

            <div className="behar-footer__language">
              <Globe2
                size={18}
                strokeWidth={1.6}
                aria-hidden="true"
              />

              <span>{t.language}</span>

              <button
                type="button"
                onClick={switchLanguage}
                className="behar-footer__language-button"
                aria-label={
                  isArabic
                    ? "Switch to English"
                    : "التبديل إلى العربية"
                }
              >
                {isArabic ? "ENGLISH" : "العربية"}
                <DiagonalArrow
                  size={14}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          <nav
            className="behar-footer__navigation"
            aria-label={
              isArabic
                ? "روابط تذييل الموقع"
                : "Footer navigation"
            }
          >
            {t.navigation.map((item) => (
              <Link
                key={item.number}
                to={item.path}
                className="behar-footer__nav-item"
              >
                <span className="behar-footer__nav-number">
                  {item.number}
                </span>

                <span className="behar-footer__nav-label">
                  {item.label}
                </span>

                <span className="behar-footer__nav-arrow">
                  <DiagonalArrow
                    size={27}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* LEGAL / TOP */}
        <div className="behar-footer__utility">
          <div className="behar-footer__legal">
            {t.legal.map((item) => (
              <Link key={item.path} to={item.path}>
                {item.label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="behar-footer__back-top"
            onClick={scrollToTop}
          >
            <span>{t.backToTop}</span>
            <span className="behar-footer__back-top-icon">
              <ArrowUp
                size={20}
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </span>
          </button>
        </div>

        {/* MONUMENTAL WORDMARK */}
        <div className="behar-footer__signature">
          <div
            className="behar-footer__wordmark"
            aria-label="BEHAR"
          >
            BEHAR
            <sup>®</sup>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="behar-footer__bottom">
          <span>{t.signature}</span>

          <span>
            © {CURRENT_YEAR} BEHAR.
            {" "}
            {t.copyright}
          </span>
        </div>
      </div>
    </footer>
  );
}
