
import {
  CheckCircle2,
  CircleDashed,
  MinusCircle,
} from "lucide-react";

const translations = {
  en: {
    lessons: "Complete required lessons",
    quizzes: "Pass required quizzes",
    assignments: "Pass graded assignments",
    finalAssessment: "Pass final assessment",
    completed: "Completed",
    pending: "Not completed",
    notRequired: "Not required",
    of: "of",
    passed: "passed",
  },
  ar: {
    lessons: "إكمال الدروس المطلوبة",
    quizzes: "اجتياز الاختبارات القصيرة",
    assignments: "اجتياز الواجبات المصححة",
    finalAssessment: "اجتياز التقييم النهائي",
    completed: "مكتمل",
    pending: "غير مكتمل",
    notRequired: "غير مطلوب",
    of: "من",
    passed: "تم اجتيازها",
  },
};

export default function RequirementItem({
  requirement,
  language = "en",
}) {
  const t = translations[language] ?? translations.en;

  const notRequired = requirement.notRequired ||
    requirement.required === 0;

  const done = requirement.done;

  const Icon = notRequired
    ? MinusCircle
    : done
      ? CheckCircle2
      : CircleDashed;

  return (
    <div
      className={[
        "behar-cert-requirement-item",
        done ? "is-complete" : "is-pending",
        notRequired ? "is-optional" : "",
      ].join(" ")}
    >
      <span
        className="behar-cert-requirement-icon"
        aria-hidden="true"
      >
        <Icon size={21} strokeWidth={1.7} />
      </span>

      <div className="behar-cert-requirement-content">
        <strong>
          {t[requirement.type] ?? requirement.type}
        </strong>

        <span>
          {notRequired
            ? t.notRequired
            : `${requirement.completed} ${t.of} ${requirement.required} ${t.passed}`}
        </span>
      </div>

      <span
        className={`behar-cert-requirement-state ${
          done ? "is-complete" : ""
        }`}
      >
        {notRequired
          ? t.notRequired
          : done
            ? t.completed
            : t.pending}
      </span>
    </div>
  );
}
