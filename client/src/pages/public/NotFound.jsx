
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Compass, MoveLeft, MoveRight } from "lucide-react";
import gsap from "gsap";

import "../../styles/public/not-found.css";

const CURRENT_YEAR = new Date().getFullYear();

const content = {
  en: {
    eyebrow: "BEHAR / LOST IN THE CURRENT",
    title: "A LITTLE",
    titleAccent: "OFF COURSE.",
    description:
      "Looks like this page drifted beyond the horizon. No worries — there's always another direction worth exploring.",
    home: "Back to home",
    courses: "Explore courses",
    code: "ERROR 404",
    status: "PAGE NOT FOUND",
    bottom: "EVERY DETOUR IS A NEW DISCOVERY.",
    coordinates: "UNKNOWN DESTINATION",
  },
  ar: {
    eyebrow: "بحار / خارج المسار",
    title: "يبدو أنك",
    titleAccent: "ضللت الطريق.",
    description:
      "يبدو أن هذه الصفحة ابتعدت عن مسارها. لا تقلق، هناك دائمًا طريق جديد يستحق الاستكشاف.",
    home: "العودة للرئيسية",
    courses: "استكشف الدورات",
    code: "خطأ 404",
    status: "الصفحة غير موجودة",
    bottom: "كل طريق مختلف يحمل فرصة جديدة.",
    coordinates: "وجهة غير معروفة",
  },
};

export default function NotFound() {
  const rootRef = useRef(null);

  const [language, setLanguage] = useState(() =>
    document.documentElement.lang === "ar" ? "ar" : "en"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLanguage(
        document.documentElement.lang === "ar" ? "ar" : "en"
      );
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        ".behar-404__reveal",
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          clearProps: "transform",
        }
      );

      gsap.fromTo(
        ".behar-404__orbit",
        { rotation: -20, opacity: 0 },
        {
          rotation: 0,
          opacity: 1,
          duration: 1.4,
          ease: "power3.out",
        }
      );
    }, rootRef);

    return () => context.revert();
  }, [language]);

  const t = content[language];
  const DirectionIcon = language === "ar" ? MoveRight : MoveLeft;

  return (
    <section
      className="behar-404"
      ref={rootRef}
      dir={language === "ar" ? "rtl" : "ltr"}
      aria-labelledby="behar-404-title"
    >
      <div className="behar-404__topline">
        <span>{t.eyebrow}</span>
        <span>{t.code}</span>
      </div>

      <div className="behar-404__content">
        <div className="behar-404__copy">
          <div className="behar-404__label behar-404__reveal">
            <span className="behar-404__label-line" />
            {t.status}
          </div>

          <h1
            id="behar-404-title"
            className="behar-404__title behar-404__reveal"
          >
            <span>{t.title}</span>
            <span className="behar-404__title-accent">
              {t.titleAccent}
            </span>
          </h1>

          <p className="behar-404__description behar-404__reveal">
            {t.description}
          </p>

          <div className="behar-404__actions behar-404__reveal">
            <Link to="/" className="behar-404__primary">
              <DirectionIcon size={18} strokeWidth={1.8} />
              {t.home}
            </Link>

            <Link to="/courses" className="behar-404__secondary">
              {t.courses}
              <ArrowUpRight size={18} strokeWidth={1.8} />
            </Link>
          </div>
        </div>

        <div className="behar-404__visual" aria-hidden="true">
          <div className="behar-404__orbit">
            <div className="behar-404__orbit-outer">
              <div className="behar-404__orbit-middle">
                <div className="behar-404__orbit-inner">
                  <Compass size={70} strokeWidth={0.7} />
                </div>
              </div>
            </div>
            <span className="behar-404__orbit-marker" />
          </div>

          <span className="behar-404__giant-number">404</span>
          <span className="behar-404__visual-caption">
            {t.coordinates}
          </span>
        </div>
      </div>

      <div className="behar-404__bottomline">
        <span>{t.bottom}</span>
        <span>BEHAR © {CURRENT_YEAR}</span>
      </div>
    </section>
  );
}
