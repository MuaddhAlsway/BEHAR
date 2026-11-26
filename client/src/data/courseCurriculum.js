
const localized = (en, ar) => ({ en, ar });

export const courseCurriculum = {
  "modern-react-development": {
    overview: localized(
      "A carefully structured journey from React fundamentals to building complete, maintainable applications.",
      "رحلة تعليمية منظمة تبدأ بأساسيات React وتنتهي ببناء تطبيقات متكاملة وقابلة للصيانة."
    ),
    chapters: [
      {
        id: "react-chapter-01",
        title: localized(
          "The React Mindset",
          "طريقة التفكير باستخدام React"
        ),
        description: localized(
          "Understand how React changes the way we build interfaces.",
          "افهم كيف يغير React طريقة بناء واجهات المستخدم."
        ),
        lessons: [
          {
            id: "react-lesson-01",
            title: localized(
              "Welcome to Modern React",
              "مرحبًا بك في React الحديث"
            ),
            type: "video",
            duration: 8,
            preview: true,
          },
          {
            id: "react-lesson-02",
            title: localized(
              "How React Applications Work",
              "كيف تعمل تطبيقات React"
            ),
            type: "video",
            duration: 16,
            preview: true,
          },
          {
            id: "react-lesson-03",
            title: localized(
              "Your First React Component",
              "أول مكون باستخدام React"
            ),
            type: "video",
            duration: 22,
            preview: false,
          },
          {
            id: "react-lesson-04",
            title: localized(
              "React Fundamentals Check",
              "اختبار أساسيات React"
            ),
            type: "quiz",
            duration: 10,
            preview: false,
          },
        ],
      },
      {
        id: "react-chapter-02",
        title: localized(
          "Components & Composition",
          "المكونات وتركيب الواجهات"
        ),
        description: localized(
          "Build reusable interfaces through component architecture.",
          "ابنِ واجهات قابلة لإعادة الاستخدام باستخدام بنية المكونات."
        ),
        lessons: [
          {
            id: "react-lesson-05",
            title: localized(
              "Understanding JSX",
              "فهم JSX"
            ),
            type: "video",
            duration: 25,
            preview: false,
          },
          {
            id: "react-lesson-06",
            title: localized(
              "Props and Component Communication",
              "الخصائص والتواصل بين المكونات"
            ),
            type: "video",
            duration: 30,
            preview: false,
          },
          {
            id: "react-lesson-07",
            title: localized(
              "Reusable Component Patterns",
              "أنماط المكونات القابلة لإعادة الاستخدام"
            ),
            type: "video",
            duration: 28,
            preview: false,
          },
          {
            id: "react-lesson-08",
            title: localized(
              "Build a Component Library",
              "بناء مكتبة مكونات"
            ),
            type: "assignment",
            assignmentId: "assignment-001",
            duration: 45,
            preview: false,
          },
        ],
      },
      {
        id: "react-chapter-03",
        title: localized(
          "State & Interactivity",
          "الحالة والتفاعل"
        ),
        description: localized(
          "Bring your interfaces to life with React state and hooks.",
          "اجعل واجهاتك تفاعلية باستخدام الحالة والخطافات."
        ),
        lessons: [
          {
            id: "react-lesson-09",
            title: localized(
              "Understanding useState",
              "فهم useState"
            ),
            type: "video",
            duration: 32,
            preview: false,
          },
          {
            id: "react-lesson-10",
            title: localized(
              "Events and User Interactions",
              "الأحداث وتفاعلات المستخدم"
            ),
            type: "video",
            duration: 25,
            preview: false,
          },
          {
            id: "react-lesson-11",
            title: localized(
              "Effects and Lifecycle",
              "التأثيرات ودورة حياة المكون"
            ),
            type: "video",
            duration: 38,
            preview: false,
          },
          {
            id: "react-lesson-12",
            title: localized(
              "Interactive UI Challenge",
              "تحدي الواجهات التفاعلية"
            ),
            type: "assignment",
            assignmentId: "assignment-005",
            duration: 50,
            preview: false,
          },
        ],
      },
      {
        id: "react-chapter-04",
        title: localized(
          "Data, APIs & Routing",
          "البيانات وواجهات API والمسارات"
        ),
        description: localized(
          "Connect your application to real data and multiple pages.",
          "اربط تطبيقك بالبيانات الحقيقية والصفحات المتعددة."
        ),
        lessons: [
          {
            id: "react-lesson-13",
            title: localized(
              "Fetching Data from APIs",
              "جلب البيانات من واجهات API"
            ),
            type: "video",
            duration: 35,
            preview: false,
          },
          {
            id: "react-lesson-14",
            title: localized(
              "Loading and Error States",
              "حالات التحميل والأخطاء"
            ),
            type: "video",
            duration: 25,
            preview: false,
          },
          {
            id: "react-lesson-15",
            title: localized(
              "React Router Fundamentals",
              "أساسيات React Router"
            ),
            type: "video",
            duration: 32,
            preview: false,
          },
          {
            id: "react-lesson-16",
            title: localized(
              "API Integration Quiz",
              "اختبار ربط واجهات API"
            ),
            type: "quiz",
            duration: 15,
            preview: false,
          },
        ],
      },
      {
        id: "react-chapter-05",
        title: localized(
          "The Final Build",
          "المشروع النهائي"
        ),
        description: localized(
          "Apply everything you've learned to a complete project.",
          "طبّق كل ما تعلمته في مشروع متكامل."
        ),
        lessons: [
          {
            id: "react-lesson-17",
            title: localized(
              "Planning Your Application",
              "تخطيط تطبيقك"
            ),
            type: "video",
            duration: 25,
            preview: false,
          },
          {
            id: "react-lesson-18",
            title: localized(
              "Building the Application",
              "بناء التطبيق"
            ),
            type: "video",
            duration: 65,
            preview: false,
          },
          {
            id: "react-lesson-19",
            title: localized(
              "Final Project Submission",
              "تسليم المشروع النهائي"
            ),
            type: "assignment",
            assignmentId: "assignment-006",
            duration: 90,
            preview: false,
          },
        ],
      },
    ],
  },
};

const defaultCurriculum = {
  overview: localized(
    "Explore the course curriculum through structured chapters and practical lessons.",
    "استكشف منهج الدورة من خلال فصول منظمة ودروس تطبيقية."
  ),
  chapters: [],
};

export function getCourseCurriculum(slug) {
  return courseCurriculum[slug] || defaultCurriculum;
}

export function getCurriculumStats(chapters = []) {
  const lessons = chapters.flatMap(
    (chapter) => chapter.lessons || []
  );

  const totalMinutes = lessons.reduce(
    (total, lesson) => total + (lesson.duration || 0),
    0
  );

  return {
    chapters: chapters.length,
    lessons: lessons.length,
    totalMinutes,
    previews: lessons.filter(
      (lesson) => lesson.preview
    ).length,
  };
}
