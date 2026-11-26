
export const certificates = [
  {
    id: "cert-001",
    courseId: "course-001",
    courseSlug: "modern-react-development",
    title: {
      en: "Modern React Development",
      ar: "تطوير تطبيقات React الحديثة",
    },
    instructor: {
      en: "Omar Khalid",
      ar: "عمر خالد",
    },
    category: {
      en: "Development",
      ar: "البرمجة",
    },
    image: "",
    status: "in-progress",
    progress: 68,
    issuedAt: null,
    certificateId: null,
  },
  {
    id: "cert-002",
    courseId: "course-003",
    courseSlug: "ui-ux-design-foundations",
    title: {
      en: "UI/UX Design Foundations",
      ar: "أساسيات تصميم تجربة المستخدم",
    },
    instructor: {
      en: "Nora Alharbi",
      ar: "نورة الحربي",
    },
    category: {
      en: "Design",
      ar: "التصميم",
    },
    image: "",
    status: "earned",
    progress: 100,
    issuedAt: "2026-11-12",
    certificateId: "BEHAR-DEMO-2026-0002",
  },
  {
    id: "cert-003",
    courseId: "course-006",
    courseSlug: "ai-for-creative-professionals",
    title: {
      en: "AI for Creative Professionals",
      ar: "الذكاء الاصطناعي للمبدعين",
    },
    instructor: {
      en: "Omar Khalid",
      ar: "عمر خالد",
    },
    category: {
      en: "Artificial Intelligence",
      ar: "الذكاء الاصطناعي",
    },
    image: "",
    status: "locked",
    progress: 0,
    issuedAt: null,
    certificateId: null,
  },
  {
    id: "cert-004",
    courseId: "course-008",
    courseSlug: "digital-marketing-essentials",
    title: {
      en: "Digital Marketing Essentials",
      ar: "أساسيات التسويق الرقمي",
    },
    instructor: {
      en: "Nora Alharbi",
      ar: "نورة الحربي",
    },
    category: {
      en: "Marketing",
      ar: "التسويق",
    },
    image: "",
    status: "earned",
    progress: 100,
    issuedAt: "2026-10-20",
    certificateId: "BEHAR-DEMO-2026-0004",
  },
];

export function getCertificateText(value, language = "en") {
  if (typeof value === "string") return value;
  return value?.[language] ?? value?.en ?? "";
}

export function getCertificateStats(items = certificates) {
  return {
    total: items.length,
    earned: items.filter((item) => item.status === "earned").length,
    inProgress: items.filter(
      (item) => item.status === "in-progress"
    ).length,
    locked: items.filter((item) => item.status === "locked").length,
  };
}
