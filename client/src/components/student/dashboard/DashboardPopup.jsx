import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { Link } from "react-router-dom";

import useFocusTrap from "../../../hooks/useFocusTrap";
import "../../../styles/student/dashboard-popup.css";

const copy = {
  en: {
    overview: { label: "YOUR WORKSPACE", title: "Your overview", description: "A complete snapshot of your learning workspace, momentum, deadlines, and achievements.", action: "Open progress", route: "/student/progress" },
    courses: { label: "MY COURSES", title: "Your learning library", description: "Pick up where you left off and keep your next lesson moving.", action: "Continue learning", route: "/student/my-learning" },
    progress: { label: "LEARNING PROGRESS", title: "Progress at a glance", description: "Your completed lessons, course momentum, and learning activity in one view.", action: "View progress", route: "/student/progress" },
    assignments: { label: "ASSIGNMENTS", title: "Work waiting for you", description: "Review pending submissions and keep upcoming deadlines visible.", action: "View all assignments", route: "/student/assignments" },
    certificates: { label: "CERTIFICATES", title: "Your issued certificates", description: "Certificates appear here after a course has been completed and issued.", action: "View certificates", route: "/student/certificates" },
    achievements: { label: "ACHIEVEMENTS", title: "Momentum worth keeping", description: "Your XP, level, streak, badges, and weekly goal live in the achievements space.", action: "View achievements", route: "/student/achievements" },
    deadlines: { label: "UPCOMING DEADLINES", title: "What is coming next", description: "Stay ahead of upcoming assignment and learning deadlines.", action: "View assignments", route: "/student/assignments" },
    activity: { label: "LEARNING ACTIVITY", title: "Your recent movement", description: "See the learning sessions and milestones that are supported by your current data.", action: "View progress", route: "/student/progress" },
  },
  ar: {
    overview: { label: "مساحة عملك", title: "نظرة عامة", description: "ملخص شامل لمساحتك التعليمية وتقدمك ومواعيدك وإنجازاتك.", action: "فتح التقدم", route: "/student/progress" },
    courses: { label: "دوراتي", title: "مكتبتك التعليمية", description: "تابع من حيث توقفت وواصل درسك القادم.", action: "متابعة التعلم", route: "/student/my-learning" },
    progress: { label: "التقدم التعليمي", title: "تقدمك في لمحة", description: "دروسك المكتملة وزخم دوراتك ونشاطك التعليمي في مساحة واحدة.", action: "عرض التقدم", route: "/student/progress" },
    assignments: { label: "الواجبات", title: "مهام بانتظارك", description: "راجع التسليمات والمواعيد القادمة.", action: "عرض كل الواجبات", route: "/student/assignments" },
    certificates: { label: "الشهادات", title: "شهاداتك الصادرة", description: "تظهر الشهادة بعد إكمال الدورة وإصدارها فعلياً.", action: "عرض الشهادات", route: "/student/certificates" },
    achievements: { label: "الإنجازات", title: "زخم يستحق الاستمرار", description: "نقاط الخبرة والمستوى والسلسلة والشارات والأهداف الأسبوعية.", action: "عرض الإنجازات", route: "/student/achievements" },
    deadlines: { label: "المواعيد القادمة", title: "ما ينتظرك تالياً", description: "ابق على اطلاع بمواعيد الواجبات والتعلم القادمة.", action: "عرض الواجبات", route: "/student/assignments" },
    activity: { label: "النشاط التعليمي", title: "حركتك الأخيرة", description: "راجع الجلسات والإنجازات المدعومة ببياناتك الحالية.", action: "عرض التقدم", route: "/student/progress" },
  },
};

function valueFromData(type, data, locale) {
  if (type === "overview") return data || [];
  if (type === "achievements") return [`${data?.totalXP ?? 0} XP`, `Level ${data?.level ?? 1}`, `${data?.badges ?? 0} badges`];
  if (type === "progress") return [`${data?.completedLessons ?? 0} lessons completed`, `${data?.completedCourses ?? 0} courses completed`, `${data?.percentage ?? 0}% overall completion`];
  if (type === "assignments") return [`${data?.total ?? 0} total`, `${data?.pending ?? 0} pending`, `${data?.graded ?? 0} graded`];
  if (type === "certificates") return [`${data?.earned ?? 0} issued`, data?.earned ? "Certificate available" : "No issued certificates yet"];
  if (type === "deadlines") return (data || []).slice(0, 4).map((item) => `${item.title || item.assignment || "Assignment"} · ${item.dueDate || "Upcoming"}`);
  if (type === "activity") return (data || []).slice(0, 4).map((item) => item.title || item.label || String(item));
  return (data || []).slice(0, 4).map((item) => typeof item === "string" ? item : item.title?.[locale] || item.title || item.name || "Course");
}

export default function DashboardPopup({ type, data, language = "en", onClose }) {
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);
  const locale = language === "ar" ? "ar" : "en";
  const content = copy[locale][type] || copy[locale].progress;
  const details = valueFromData(type, data, locale);

  useEffect(() => {
    returnFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  useFocusTrap({ active: true, containerRef: dialogRef, onEscape: onClose, returnFocusRef });

  return <div className="behar-dashboard-popup" dir={locale === "ar" ? "rtl" : "ltr"}><button className="behar-dashboard-popup__backdrop" type="button" aria-label="Close dialog" onClick={onClose} /><section ref={dialogRef} className="behar-dashboard-popup__dialog" role="dialog" aria-modal="true" aria-labelledby="dashboard-popup-title"><button className="behar-dashboard-popup__close" type="button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button><span className="behar-dashboard-popup__label">{content.label}</span><h2 id="dashboard-popup-title">{content.title}</h2><p>{content.description}</p><div className="behar-dashboard-popup__details" aria-label={content.title}>{details.length ? details.map((item, index) => <div key={`${item}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>) : <span>No activity recorded yet.</span>}</div><Link className="behar-dashboard-popup__action" to={content.route} onClick={onClose}>{content.action}<ArrowUpRight size={17} /></Link></section></div>;
}

export function DashboardPopupTrigger({ type, data, language = "en", onOpen, children }) {
  const handleClick = (event) => {
    if (event.target.closest("a,button,input,select,textarea")) return;
    onOpen(type, data, event.currentTarget);
  };

  return <div className="behar-dashboard-popup-trigger" role="button" tabIndex={0} onClick={handleClick} onKeyDown={(event) => { if ((event.key === "Enter" || event.key === " ") && !event.target.closest("a,button,input,select,textarea")) { event.preventDefault(); onOpen(type, data, event.currentTarget); } }}>{children}</div>;
}
