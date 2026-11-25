
import { MessageCircle, ShieldCheck } from "lucide-react";

import { getLessonDiscussions } from "../../../data/student/lessonDiscussions";

const translations = {
  en: {
    eyebrow: "LEARN TOGETHER",
    title: "The conversation.",
    description:
      "Explore questions and insights shared by learners and instructors.",
    instructor: "Instructor",
    student: "Student",
    empty: "No discussions yet",
    emptyDescription:
      "Questions and instructor replies will appear here.",
    readOnly:
      "Discussion posting will be available when the community backend is connected.",
  },
  ar: {
    eyebrow: "نتعلم معاً",
    title: "مساحة النقاش.",
    description:
      "استكشف أسئلة الطلاب وإجابات المدربين وأفكار مجتمع التعلم.",
    instructor: "المدرب",
    student: "طالب",
    empty: "لا توجد نقاشات بعد",
    emptyDescription:
      "ستظهر هنا أسئلة الطلاب وردود المدربين.",
    readOnly:
      "ستتاح إضافة المشاركات عند ربط نظام المجتمع بالواجهة الخلفية.",
  },
};

function localized(value, language) {
  if (typeof value === "string") return value;
  return value?.[language] || value?.en || "";
}

export default function LessonDiscussion({
  courseId,
  lessonId,
  language = "en",
}) {
  const locale = language === "ar" ? "ar" : "en";
  const t = translations[locale];

  const discussions = getLessonDiscussions(
    courseId,
    lessonId
  );

  return (
    <section className="behar-tabs__discussion">
      <div className="behar-tabs__editorial-heading">
        <span className="behar-tabs__eyebrow">
          {t.eyebrow}
        </span>

        <h2>{t.title}</h2>
        <p>{t.description}</p>
      </div>

      <div className="behar-tabs__discussion-notice">
        <MessageCircle size={18} />
        <p>{t.readOnly}</p>
      </div>

      {discussions.length === 0 ? (
        <div className="behar-tabs__empty">
          <MessageCircle size={29} strokeWidth={1.4} />
          <h3>{t.empty}</h3>
          <p>{t.emptyDescription}</p>
        </div>
      ) : (
        <div className="behar-tabs__discussion-list">
          {discussions.map((discussion) => (
            <article
              key={discussion.id}
              className="behar-tabs__discussion-thread"
            >
              <div className="behar-tabs__discussion-author">
                <span className="behar-tabs__avatar">
                  {discussion.author.charAt(0)}
                </span>

                <div>
                  <strong>{discussion.author}</strong>
                  <small>{t.student}</small>
                </div>
              </div>

              <p>{localized(discussion.message, locale)}</p>

              {discussion.replies?.map((reply) => (
                <div
                  key={reply.id}
                  className="behar-tabs__discussion-reply"
                >
                  <div className="behar-tabs__discussion-author">
                    <span className="behar-tabs__avatar behar-tabs__avatar--instructor">
                      {reply.author.charAt(0)}
                    </span>

                    <div>
                      <strong>{reply.author}</strong>
                      <small>
                        <ShieldCheck size={12} />
                        {t.instructor}
                      </small>
                    </div>
                  </div>

                  <p>{localized(reply.message, locale)}</p>
                </div>
              ))}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
