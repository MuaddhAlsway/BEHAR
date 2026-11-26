
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  BookOpen,
  ChevronRight,
  GraduationCap,
  LockKeyhole,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";

import {
  certificates,
  getCertificateStats,
} from "../../data/certificates";
import { evaluateCertificateEligibility } from "../../utils/certificateEligibility";

import CertificateCard from "../../components/student/certificates/CertificateCard";
import CertificatePreview from "../../components/student/certificates/CertificatePreview";
import CertificateRequirements from "../../components/student/certificates/CertificateRequirements";
import { useStudentLanguage } from "../../context/StudentLanguageContext";

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
    emptyTitle: "No certificates found",
    emptyDescription:
      "Try another search or filter to explore your certificates.",
    footerTitle: "Every lesson brings you closer.",
    footerDescription:
      "Keep learning, complete your course requirements, and unlock your next certificate.",
    learning: "My learning",
    requirements: "View certificate requirements",
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
    emptyTitle: "لا توجد شهادات",
    emptyDescription: "جرّب البحث أو اختيار تصنيف آخر.",
    footerTitle: "كل درس يقربك من هدفك.",
    footerDescription:
      "واصل التعلم وأكمل متطلبات الدورة للحصول على شهادتك القادمة.",
    learning: "تعلمي",
    requirements: "عرض متطلبات الشهادة",
  },
};

const filters = [
  { id: "all", label: "all" },
  { id: "earned", label: "earnedFilter" },
  { id: "in-progress", label: "progressFilter" },
  { id: "locked", label: "lockedFilter" },
];

export default function Certificates() {
  const { language } = useStudentLanguage();
  const t = copy[language];

  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedCertificate, setSelectedCertificate] =
    useState(null);
  const [requirementsCertificate, setRequirementsCertificate] =
    useState(null);

  const closePreview = useCallback(() => {
    setSelectedCertificate(null);
  }, []);

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
        certificate.title?.en,
        certificate.title?.ar,
        certificate.instructor?.en,
        certificate.instructor?.ar,
        certificate.category?.en,
        certificate.category?.ar,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();

      return searchable.includes(query);
    });
  }, [activeFilter, search]);

  const selectedEligibility = useMemo(() => {
    if (!requirementsCertificate) return null;

    return evaluateCertificateEligibility(
      requirementsCertificate.courseId
    );
  }, [requirementsCertificate]);

  useEffect(() => {
    if (
      requirementsCertificate &&
      !filtered.some(
        (certificate) => certificate.id === requirementsCertificate.id
      )
    ) {
      setRequirementsCertificate(null);
    }
  }, [filtered, requirementsCertificate]);

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
        {statCards.map(
          ({ id, label, value, icon: Icon }) => (
            <div
              key={id}
              className={`behar-cert-stat stat-${id}`}
            >
              <div className="behar-cert-stat-icon">
                <Icon size={20} strokeWidth={1.7} />
              </div>

              <strong>
                {String(value).padStart(2, "0")}
              </strong>

              <span>{label}</span>
            </div>
          )
        )}
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
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </label>
        </div>

        {filtered.length > 0 ? (
          <div className="behar-certificates-grid">
            {filtered.map((certificate) => (
              <div
                key={certificate.id}
                className="behar-certificates-grid-item"
              >
                <CertificateCard
                  certificate={certificate}
                  language={language}
                  onPreview={setSelectedCertificate}
                />

                <button
                  type="button"
                  className="behar-cert-requirements-trigger"
                  aria-expanded={
                    requirementsCertificate?.id === certificate.id
                  }
                  aria-controls="behar-certificate-requirements"
                  onClick={() =>
                    setRequirementsCertificate((current) =>
                      current?.id === certificate.id
                        ? null
                        : certificate
                    )
                  }
                >
                  {t.requirements}
                </button>
              </div>
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

      {requirementsCertificate && (
        <div
          id="behar-certificate-requirements"
          className="behar-certificates-requirements-section"
        >
          <CertificateRequirements
            certificate={requirementsCertificate}
            eligibility={selectedEligibility}
            language={language}
          />
        </div>
      )}

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

      <CertificatePreview
        certificate={selectedCertificate}
        language={language}
        studentName="BEHAR Student"
        onClose={closePreview}
      />
    </main>
  );
}
