
import {
  CheckCircle2,
  MessageCircle,
  MessagesSquare,
  GraduationCap,
} from "lucide-react";

const labels = {
  en: {
    total: "Total discussions",
    mine: "My discussions",
    solved: "Solved questions",
    instructorAnswered: "Instructor answered",
  },
  ar: {
    total: "إجمالي المناقشات",
    mine: "مناقشاتي",
    solved: "الأسئلة المحلولة",
    instructorAnswered: "ردود المدربين",
  },
};

export default function DiscussionStats({
  stats,
  language = "en",
}) {
  const t = labels[language] ?? labels.en;

  const items = [
    {
      key: "total",
      icon: MessagesSquare,
      value: stats.total,
    },
    {
      key: "mine",
      icon: MessageCircle,
      value: stats.mine,
    },
    {
      key: "solved",
      icon: CheckCircle2,
      value: stats.solved,
    },
    {
      key: "instructorAnswered",
      icon: GraduationCap,
      value: stats.instructorAnswered,
    },
  ];

  return (
    <section
      className="behar-discussion-stats"
      aria-label={
        language === "ar"
          ? "إحصائيات المناقشات"
          : "Discussion statistics"
      }
    >
      {items.map(({ key, icon: Icon, value }) => (
        <article
          key={key}
          className="behar-discussion-stat"
        >
          <div className="behar-discussion-stat-icon">
            <Icon size={19} strokeWidth={1.7} />
          </div>

          <strong>{value}</strong>
          <span>{t[key]}</span>
        </article>
      ))}
    </section>
  );
}
