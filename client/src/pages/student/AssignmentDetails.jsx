
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  LockKeyhole,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";

import {
  certificates,
  getCertificateStats,
  getCertificateText,
} from "../../data/certificates";

import "../../styles/student/certificates.css";

const copy = {
  en: {
    eyebrow: "YOUR LEARNING MILESTONES",
    title: "Certificates & achievements",
    description:
      "A home for the skills you've built, the courses you've completed, and the milestones still ahead.",
    total: "Total certificates",
    earned: "Certificates earned",
    progress: "In progress",
    locked: "Locked",
    gallery: "Your certificates",
    galleryDescription:
      "Explore your earned credentials and track what comes next.",
    search: "Search certificates...",
    all: "All",
    earnedFilter: "Earned",
    progressFilter: "In progress",
    lockedFilter: "Locked",
    issued: "Issued",
    by: "By",
    view: "View certificate",
    continue: "Continue learning",
    unavailable: "Course unavailable",
    lockedLabel: "Not yet unlocked",
    completed: "Completed",
    emptyTitle: "No certificates found",
    emptyDescription:
      "Try another search or filter to explore your certificates.",
    footerTitle: "Every lesson brings you closer.",
    footerDescription:
      "Keep learning, complete your course requirements, and unlock your next certificate.",
    learning: "My learning",
    demo: "Demo certificate",
  },
  ar: {
    eyebrow: "إنجازاتك التعليمية",
    title: "الشهادات والإنجازات",
    description:
      "مساحتك لاستعراض المهارات التي اكتسبتها والدورات التي أكملتها والإنجازات القادمة.",
    total: "إجمالي الشهادات",
    earned: "الشهادات المكتسبة",
    progress: "قيد التقدم",
    locked: "مقفلة",
    gallery: "شهاداتك",
    galleryDescription:
      "استعرض شهاداتك وتابع تقدمك نحو الإنجازات القادمة.",
    search: "ابحث عن شهادة...",
    all: "الكل",
    earnedFilter: "مكتسبة",
    progressFilter: "قيد التقدم",
    lockedFilter: "مقفلة",
    issued: "تاريخ الإصدار",
    by: "بواسطة",
    view: "عرض الشهادة",
    continue: "متابعة التعلم",
    unavailable: "الدورة غير متاحة",
    lockedLabel: "لم يتم فتحها بعد",
    completed: "مكتملة",
    emptyTitle: "لا توجد شهادات",
    emptyDescription:
      "جرّب البحث أو اختيار تصنيف آخر.",
    footerTitle: "كل درس يقربك من هدفك.",
    footerDescription:
      "واصل التعلم وأكمل متطلبات الدورة للحصول على شهادتك القادمة.",
    learning: "تعلمي",
    demo: "شهادة تجريبية",
  },
};

const filters = [
  { id: "all", label: "all" },
  { id: "earned", label: "earnedFilter" },
  { id: "in-progress", label: "progressFilter" },
  { id: "locked", label: "lockedFilter" },
];

function useDocumentLanguage() {
  const read = () =>
    typeof document !== "undefined" &&
    document.documentElement.lang.toLowerCase().startsWith("ar")
      ? "ar"
      : "en";

  const [language, setLanguage] = useState(read);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLanguage(read());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  return language;
}

function CertificateArtwork({ certificate, language }) {
  const earned = certificate.status === "earned";
  const locked = certificate.status === "locked";

  return (
    <div
      className={`behar-cert-artwork ${
        earned ? "is-earned" : ""
      } ${locked ? "is-locked" : ""}`}
    >
      <div className="behar-cert-artwork-top">
        <span>BEHAR</span>
        <GraduationCap size={20} strokeWidth={1.5} />
      </div>

      <div className="behar-cert-artwork-center">
        <div className="behar-cert-artwork-seal">
          {locked ? (
            <LockKeyhole size={25} strokeWidth={1.5} />
          ) : (
            <Award size={29} strokeWidth={1.4} />
          )}
        </div>

        <span className="behar-cert-artwork-kicker">
          {earned
            ? "CERTIFICATE OF COMPLETION"
            : "LEARNING MILESTONE"}
        </span>

        <h3>
          {getCertificateText(certificate.title, language)}
        </h3>

        <div className="behar-cert-artwork-rule" />
      </div>

      <div className="behar-cert-artwork-bottom">
        <span>
          {getCertificateText(certificate.category, language)}
        </span>
        <span>BEHAR ACADEMY</span>
      </div>
    </div>
  );
}

function CertificateCard({ certificate, language, t }) {
  const earned = certificate.status === "earned";
  const inProgress = certificate.status === "in-progress";
  const locked = certificate.status === "locked";

  const statusLabel = earned
    ? t.earnedFilter
    : inProgress
      ? t.progressFilter
      : t.lockedFilter;

  const date =
    certificate.issuedAt &&
    new Intl.DateTimeFormat(
      language === "ar" ? "ar-SA" : "en-US",
      { year: "numeric", month: "short", day: "numeric" }
    ).format(new Date(`${certificate.issuedAt}T12:00:00`));

  return (
    <article className="behar-cert-card">
      <CertificateArtwork
        certificate={certificate}
        language={language}
      />

      <div className="behar-cert-card-body">
        <div className="behar-cert-card-meta">
          <span>{getCertificateText(certificate.category, language)}</span>

          <span
            className={`behar-cert-status status-${certificate.status}`}
          >
            {earned ? (
              <CheckCircle2 size={13} />
            ) : locked ? (
              <LockKeyhole size={13} />
            ) : (
              <Clock3 size={13} />
            )}
            {statusLabel}
          </span>
        </div>

        <h3>{getCertificateText(certificate.title, language)}</h3>

        <p className="behar-cert-instructor">
          {t.by}{" "}
          {getCertificateText(certificate.instructor, language)}
        </p>

        {inProgress && (
          <div className="behar-cert-progress">
            <div className="behar-cert-progress-label">
              <span>{t.progressFilter}</span>
              <strong>{certificate.progress}%</strong>
            </div>
            <div
              className="behar-cert-progress-track"
              role="progressbar"
              aria-valuenow={certificate.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t.progressFilter}
            >
              <span style={{ width: `${certificate.progress}%` }} />
            </div>
          </div>
        )}

        {earned && date && (
          <p className="behar-cert-issued">
            <CheckCircle2 size={14} />
            {t.issued}: {date}
            <span className="behar-cert-demo">{t.demo}</span>
          </p>
        )}

        {locked && (
          <p className="behar-cert-locked-message">
            <LockKeyhole size={14} />
            {t.lockedLabel}
          </p>
        )}

        <div className="behar-cert-card-footer">
          {earned ? (
            <span className="behar-cert-action-disabled">
              {t.view}
              <ChevronRight size={16} />
            </span>
          ) : certificate.courseSlug ? (
            <Link
              to={`/courses/${certificate.courseSlug}`}
              className="behar-cert-card-action"
            >
              {t.continue}
              <ChevronRight size={16} />
            </Link>
          ) : (
            <span className="behar-cert-action-disabled">
              {t.unavailable}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Certificates() {
  const language = useDocumentLanguage();
  const t = copy[language];

  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const stats = useMemo(
    () => getCertificateStats(certificates),
    []
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return certificates.filter((certificate) => {
      if (
        activeFilter !== "all" &&
        certificate.status !== activeFilter
      ) {
        return false;
      }

      const searchable = [
        certificate.title.en,
        certificate.title.ar,
        certificate.instructor.en,
        certificate.instructor.ar,
        certificate.category.en,
        certificate.category.ar,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return searchable.includes(query);
    });
  }, [activeFilter, search]);

  const statCards = [
    {
      id: "total",
      label: t.total,
      value: stats.total,
      icon: GraduationCap,
    },
    {
      id: "earned",
      label: t.earned,
      value: stats.earned,
      icon: Award,
    },
    {
      id: "progress",
      label: t.progress,
      value: stats.inProgress,
      icon: BookOpen,
    },
    {
      id: "locked",
      label: t.locked,
      value: stats.locked,
      icon: LockKeyhole,
    },
  ];

  return (
    <main
      className="behar-certificates-page"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <header className="behar-certificates-header">
        <div>
          <div className="behar-certificates-eyebrow">
            <Sparkles size={15} />
            <span>{t.eyebrow}</span>
          </div>

          <h1>{t.title}</h1>
          <p>{t.description}</p>
        </div>

        <div className="behar-certificates-header-mark">
          <Trophy size={38} strokeWidth={1.3} />
        </div>
      </header>

      <section
        className="behar-cert-stats"
        aria-label={t.total}
      >
        {statCards.map(({ id, label, value, icon: Icon }) => (
          <div key={id} className={`behar-cert-stat stat-${id}`}>
            <div className="behar-cert-stat-icon">
              <Icon size={20} strokeWidth={1.7} />
            </div>
            <strong>{String(value).padStart(2, "0")}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="behar-certificates-gallery">
        <div className="behar-certificates-gallery-heading">
          <div>
            <h2>{t.gallery}</h2>
            <p>{t.galleryDescription}</p>
          </div>

          <span className="behar-cert-gallery-count">
            {filtered.length} / {certificates.length}
          </span>
        </div>

        <div className="behar-certificates-toolbar">
          <div
            className="behar-certificates-filters"
            role="group"
            aria-label={t.gallery}
          >
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={
                  activeFilter === filter.id ? "active" : ""
                }
                aria-pressed={activeFilter === filter.id}
                onClick={() => setActiveFilter(filter.id)}
              >
                {t[filter.label]}
              </button>
            ))}
          </div>

          <label className="behar-certificates-search">
            <Search size={17} />
            <input
              type="search"
              placeholder={t.search}
              aria-label={t.search}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>

        {filtered.length > 0 ? (
          <div className="behar-certificates-grid">
            {filtered.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                language={language}
                t={t}
              />
            ))}
          </div>
        ) : (
          <div className="behar-certificates-empty">
            <Search size={30} strokeWidth={1.5} />
            <h3>{t.emptyTitle}</h3>
            <p>{t.emptyDescription}</p>
          </div>
        )}
      </section>

      <section className="behar-certificates-bottom-banner">
        <div className="behar-certificates-banner-icon">
          <Trophy size={24} strokeWidth={1.6} />
        </div>

        <div>
          <h2>{t.footerTitle}</h2>
          <p>{t.footerDescription}</p>
        </div>

        <Link to="/student/my-learning">
          {t.learning}
          <ChevronRight size={17} />
        </Link>
      </section>
    </main>
  );
}
