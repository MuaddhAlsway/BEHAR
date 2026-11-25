
import { useId, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Layers3,
  Play,
} from "lucide-react";

import "../../../styles/student/my-learning/learning-collections.css";

const translations = {
  en: {
    eyebrow: "ORGANIZE YOUR LEARNING",
    title: "Your learning, organized.",
    description:
      "Find your next lesson, explore your subjects, and revisit what you've accomplished.",
    continue: "Continue learning",
    continueDescription:
      "Pick up where you left off.",
    subjects: "Explore by subject",
    subjectsDescription:
      "Your courses, grouped by discipline.",
    completed: "Completed learning",
    completedDescription:
      "A record of what you've achieved.",
    courses: "courses",
    course: "course",
    lessons: "lessons",
    resume: "View course",
    viewAll: "View courses",
    emptyProgress: "No courses in progress yet.",
    emptyCompleted:
      "Completed courses will appear here.",
    progress: "Complete",
    learning: "LEARNING PATH",
  },

  ar: {
    eyebrow: "نظّم رحلتك التعليمية",
    title: "تعلّمك، بطريقة منظّمة.",
    description:
      "تابع دروسك، واستكشف مجالاتك، وراجع إنجازاتك التعليمية.",
    continue: "متابعة التعلّم",
    continueDescription:
      "أكمل من حيث توقفت.",
    subjects: "استكشف حسب المجال",
    subjectsDescription:
      "دوراتك مرتبة حسب التخصص.",
    completed: "التعلّم المكتمل",
    completedDescription:
      "سجل إنجازاتك التعليمية.",
    courses: "دورات",
    course: "دورة",
    lessons: "دروس",
    resume: "عرض الدورة",
    viewAll: "عرض الدورات",
    emptyProgress:
      "لا توجد دورات قيد التقدم حالياً.",
    emptyCompleted:
      "ستظهر الدورات المكتملة هنا.",
    progress: "مكتمل",
    learning: "مسار التعلّم",
  },
};

function formatNumber(value, language) {
  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US"
  ).format(value);
}

function getCoursePath(course) {
  return `/courses/${encodeURIComponent(course.slug)}`;
}

function getCourseTitle(course, language) {
  return (
    course.title?.[language] ||
    course.title?.en ||
    ""
  );
}

function CollectionHeading({
  icon: Icon,
  title,
  description,
  count,
  language,
}) {
  const t = translations[language];

  return (
    <div className="behar-collections__group-heading">
      <div className="behar-collections__group-icon">
        <Icon size={20} strokeWidth={1.6} />
      </div>

      <div className="behar-collections__group-copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <span className="behar-collections__group-count">
        {formatNumber(count, language)}
        <span> {t.courses}</span>
      </span>
    </div>
  );
}

function ContinueLearningCollection({
  courses,
  language,
}) {
  const t = translations[language];

  return (
    <div className="behar-collections__panel behar-collections__panel--continue">
      <CollectionHeading
        icon={Play}
        title={t.continue}
        description={t.continueDescription}
        count={courses.length}
        language={language}
      />

      {courses.length > 0 ? (
        <div className="behar-collections__course-list">
          {courses.slice(0, 3).map((course, index) => {
            const progress = Math.max(
              0,
              Math.min(100, Number(course.progress) || 0)
            );

            return (
              <Link
                key={course.id}
                to={getCoursePath(course)}
                className="behar-collections__course"
              >
                <span className="behar-collections__course-index">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="behar-collections__course-main">
                  <h4>
                    {getCourseTitle(course, language)}
                  </h4>

                  <div className="behar-collections__course-meta">
                    <span>
                      <BookOpen size={13} />
                      {formatNumber(
                        course.completedLessons || 0,
                        language
                      )}
                      /
                      {formatNumber(
                        course.totalLessons || 0,
                        language
                      )}{" "}
                      {t.lessons}
                    </span>
                  </div>

                  <div className="behar-collections__progress">
                    <span
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <span className="behar-collections__course-percent">
                  {formatNumber(progress, language)}%
                </span>

                <ArrowUpRight
                  size={17}
                  strokeWidth={1.7}
                  className="behar-collections__course-arrow"
                />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="behar-collections__empty">
          <Clock3 size={19} />
          <p>{t.emptyProgress}</p>
        </div>
      )}
    </div>
  );
}

function SubjectCollection({
  categories,
  language,
}) {
  const t = translations[language];

  return (
    <div className="behar-collections__panel behar-collections__panel--subjects">
      <CollectionHeading
        icon={Layers3}
        title={t.subjects}
        description={t.subjectsDescription}
        count={categories.length}
        language={language}
      />

      <div className="behar-collections__subjects">
        {categories.map((category, index) => (
          <div
            key={category.key}
            className="behar-collections__subject"
          >
            <span className="behar-collections__subject-index">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="behar-collections__subject-copy">
              <strong>
                {category.label[language] ||
                  category.label.en}
              </strong>

              <span>
                {formatNumber(
                  category.count,
                  language
                )}{" "}
                {category.count === 1 && language === "en"
                  ? t.course
                  : t.courses}
              </span>
            </div>

            <div className="behar-collections__subject-bar">
              <span
                style={{
                  width: `${category.percentage}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompletedCollection({
  courses,
  language,
}) {
  const t = translations[language];

  return (
    <div className="behar-collections__panel behar-collections__panel--completed">
      <CollectionHeading
        icon={CheckCircle2}
        title={t.completed}
        description={t.completedDescription}
        count={courses.length}
        language={language}
      />

      {courses.length > 0 ? (
        <div className="behar-collections__completed-list">
          {courses.slice(0, 3).map((course) => (
            <Link
              key={course.id}
              to={getCoursePath(course)}
              className="behar-collections__completed-course"
            >
              <span className="behar-collections__completed-check">
                <CheckCircle2
                  size={19}
                  strokeWidth={1.6}
                />
              </span>

              <span>
                {getCourseTitle(course, language)}
              </span>

              <ArrowUpRight
                size={17}
                strokeWidth={1.6}
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="behar-collections__empty behar-collections__empty--completed">
          <div className="behar-collections__empty-symbol">
            <CheckCircle2
              size={28}
              strokeWidth={1.2}
            />
          </div>

          <p>{t.emptyCompleted}</p>
        </div>
      )}
    </div>
  );
}

export default function LearningCollections({
  courses = [],
  language = "en",
}) {
  const locale = language === "ar" ? "ar" : "en";
  const t = translations[locale];
  const headingId = useId();

  const {
    inProgress,
    completed,
    categories,
  } = useMemo(() => {
    const active = courses
      .filter((course) => course.status === "in_progress")
      .sort(
        (a, b) =>
          new Date(
            b.lastAccessedAt || b.enrolledAt
          ).getTime() -
          new Date(
            a.lastAccessedAt || a.enrolledAt
          ).getTime()
      );

    const finished = courses.filter(
      (course) => course.status === "completed"
    );

    const categoryMap = new Map();

    courses.forEach((course) => {
      const key =
        course.category?.en || "Other";

      if (!categoryMap.has(key)) {
        categoryMap.set(key, {
          key,
          label: course.category || {
            en: "Other",
            ar: "أخرى",
          },
          count: 0,
        });
      }

      categoryMap.get(key).count += 1;
    });

    const groupedCategories = Array.from(
      categoryMap.values()
    )
      .sort((a, b) => b.count - a.count)
      .map((category) => ({
        ...category,
        percentage: courses.length
          ? (category.count / courses.length) * 100
          : 0,
      }));

    return {
      inProgress: active,
      completed: finished,
      categories: groupedCategories,
    };
  }, [courses]);

  return (
    <section
      className="behar-collections"
      dir={locale === "ar" ? "rtl" : "ltr"}
      aria-labelledby={headingId}
    >
      <div className="behar-collections__header">
        <div>
          <span className="behar-collections__eyebrow">
            <span />
            {t.eyebrow}
          </span>

          <h2 id={headingId}>{t.title}</h2>
          <p>{t.description}</p>
        </div>

        <span className="behar-collections__header-mark">
          BEHAR / 05
        </span>
      </div>

      <div className="behar-collections__layout">
        <ContinueLearningCollection
          courses={inProgress}
          language={locale}
        />

        <SubjectCollection
          categories={categories}
          language={locale}
        />

        <CompletedCollection
          courses={completed}
          language={locale}
        />
      </div>
    </section>
  );
}
