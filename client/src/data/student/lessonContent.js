
const bilingual = (en, ar) => ({ en, ar });

export const mockLessonContent = {
  course_001: {
    lesson_001: {
      description: bilingual(
        "Begin your React journey by understanding the course structure, the tools you'll use, and how modern component-based applications are built.",
        "ابدأ رحلتك مع React بالتعرف على هيكل الدورة والأدوات المستخدمة وكيفية بناء التطبيقات الحديثة باستخدام المكونات."
      ),

      objectives: [
        bilingual(
          "Understand the structure of the course and its learning outcomes.",
          "فهم هيكل الدورة ومخرجات التعلم."
        ),
        bilingual(
          "Identify the tools required for React development.",
          "تحديد الأدوات المطلوبة لتطوير تطبيقات React."
        ),
        bilingual(
          "Understand how component-based interfaces work.",
          "فهم آلية عمل الواجهات المبنية على المكونات."
        ),
      ],

      resources: [
        {
          id: "react-documentation",
          title: bilingual(
            "Official React Documentation",
            "التوثيق الرسمي لـ React"
          ),
          type: "link",
          url: "https://react.dev/learn",
          format: "Website",
        },
        {
          id: "vite-documentation",
          title: bilingual(
            "Vite Getting Started Guide",
            "دليل البدء باستخدام Vite"
          ),
          type: "link",
          url: "https://vite.dev/guide/",
          format: "Website",
        },
      ],

      instructorNote: bilingual(
        "Before continuing, make sure Node.js is installed and that you can run a React project locally. Focus on understanding the component model before memorizing syntax.",
        "قبل المتابعة، تأكد من تثبيت Node.js وقدرتك على تشغيل مشروع React محلياً. ركز على فهم نموذج المكونات قبل حفظ الصياغة البرمجية."
      ),

      exercise: bilingual(
        "Create a new React project with Vite, start the development server, and identify the main application component.",
        "أنشئ مشروع React جديداً باستخدام Vite، وشغّل خادم التطوير، وحدد المكون الرئيسي للتطبيق."
      ),
    },

    lesson_002: {
      description: bilingual(
        "Explore the fundamentals of React, including declarative rendering, reusable components, and the relationship between data and user interfaces.",
        "تعرّف على أساسيات React، بما في ذلك العرض التصريحي والمكونات القابلة لإعادة الاستخدام والعلاقة بين البيانات وواجهات المستخدم."
      ),

      objectives: [
        bilingual(
          "Explain what React is and when to use it.",
          "شرح ماهية React ومتى تستخدم."
        ),
        bilingual(
          "Understand declarative UI rendering.",
          "فهم العرض التصريحي لواجهات المستخدم."
        ),
        bilingual(
          "Recognize reusable component patterns.",
          "التعرف على أنماط المكونات القابلة لإعادة الاستخدام."
        ),
      ],

      resources: [
        {
          id: "react-quick-start",
          title: bilingual(
            "React Quick Start",
            "البدء السريع مع React"
          ),
          type: "link",
          url: "https://react.dev/learn",
          format: "Website",
        },
      ],

      instructorNote: bilingual(
        "Think about React as a way to describe what the interface should look like for a given state.",
        "فكر في React كوسيلة لوصف الشكل الذي يجب أن تظهر عليه الواجهة بناءً على حالة معينة."
      ),

      exercise: bilingual(
        "Build a reusable profile card component that accepts a name, role, and description as props.",
        "أنشئ مكون بطاقة ملف شخصي قابل لإعادة الاستخدام يستقبل الاسم والدور والوصف عبر الخصائص."
      ),
    },
  },
};

export function getLessonContent(courseId, lessonId) {
  return mockLessonContent[courseId]?.[lessonId] || null;
}
