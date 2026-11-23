
const localized = (en, ar) => ({ en, ar });

export const courseReviews = {
  "modern-react-development": [
    {
      id: "react-review-01",
      student: "Ahmed Hassan",
      initials: "AH",
      rating: 5,
      date: "2026-10-18",
      title: localized(
        "A completely different way to understand React",
        "طريقة مختلفة تمامًا لفهم React"
      ),
      content: localized(
        "The course helped me understand why React applications are structured the way they are. The component architecture lessons were especially useful.",
        "ساعدتني الدورة على فهم أسباب تنظيم تطبيقات React بهذه الطريقة، وكانت دروس هندسة المكونات مفيدة بشكل خاص."
      ),
      helpful: 24,
      verified: false,
    },
    {
      id: "react-review-02",
      student: "Sarah Mohammed",
      initials: "SM",
      rating: 5,
      date: "2026-10-12",
      title: localized(
        "Practical and well organized",
        "عملية ومنظمة بشكل ممتاز"
      ),
      content: localized(
        "I enjoyed how the lessons connected fundamentals to practical examples. The final application brought everything together.",
        "أعجبني الربط بين المفاهيم الأساسية والأمثلة العملية، وساعدني المشروع النهائي على جمع كل ما تعلمته."
      ),
      helpful: 18,
      verified: false,
    },
    {
      id: "react-review-03",
      student: "Khalid Omar",
      initials: "KO",
      rating: 4,
      date: "2026-09-28",
      title: localized(
        "Strong introduction to modern development",
        "مقدمة قوية للتطوير الحديث"
      ),
      content: localized(
        "The content is clear and useful. I would have liked a few more advanced examples of API integration.",
        "المحتوى واضح ومفيد، وكنت أتمنى وجود أمثلة متقدمة إضافية لربط واجهات API."
      ),
      helpful: 11,
      verified: false,
    },
    {
      id: "react-review-04",
      student: "Fatima Ali",
      initials: "FA",
      rating: 5,
      date: "2026-09-15",
      title: localized(
        "Helped me build with confidence",
        "ساعدتني على البرمجة بثقة"
      ),
      content: localized(
        "I finally feel comfortable breaking large interfaces into smaller reusable components.",
        "أصبحت الآن أكثر ثقة في تقسيم الواجهات الكبيرة إلى مكونات صغيرة قابلة لإعادة الاستخدام."
      ),
      helpful: 32,
      verified: false,
    },
    {
      id: "react-review-05",
      student: "Yousef Ibrahim",
      initials: "YI",
      rating: 3,
      date: "2026-08-21",
      title: localized(
        "Good fundamentals",
        "أساسيات جيدة"
      ),
      content: localized(
        "The foundational material is helpful, although I expected more coverage of testing and deployment.",
        "المحتوى التأسيسي مفيد، لكنني توقعت تغطية أوسع للاختبارات ونشر التطبيقات."
      ),
      helpful: 7,
      verified: false,
    },
    {
      id: "react-review-06",
      student: "Noura Saleh",
      initials: "NS",
      rating: 5,
      date: "2026-08-10",
      title: localized(
        "Excellent learning experience",
        "تجربة تعليمية ممتازة"
      ),
      content: localized(
        "The explanations are easy to follow and the exercises helped reinforce each topic.",
        "الشرح سهل المتابعة وساعدتني التمارين على تثبيت فهم كل موضوع."
      ),
      helpful: 16,
      verified: false,
    },
  ],

  "ui-ux-design-foundations": [
    {
      id: "design-review-01",
      student: "Lina Ahmed",
      initials: "LA",
      rating: 5,
      date: "2026-10-05",
      title: localized(
        "A thoughtful introduction to design",
        "مقدمة مدروسة لعالم التصميم"
      ),
      content: localized(
        "The user research and journey mapping lessons changed how I approach interface design.",
        "غيّرت دروس أبحاث المستخدم ورحلة المستخدم الطريقة التي أتعامل بها مع تصميم الواجهات."
      ),
      helpful: 21,
      verified: false,
    },
    {
      id: "design-review-02",
      student: "Mariam Khalid",
      initials: "MK",
      rating: 4,
      date: "2026-09-19",
      title: localized(
        "Clear and useful",
        "واضحة ومفيدة"
      ),
      content: localized(
        "A solid foundation with practical examples. More prototype exercises would make it even better.",
        "أساس قوي مع أمثلة عملية، وستكون أفضل مع المزيد من تمارين النماذج التفاعلية."
      ),
      helpful: 13,
      verified: false,
    },
  ],

  "ai-for-creative-professionals": [
    {
      id: "ai-review-01",
      student: "Omar Nasser",
      initials: "ON",
      rating: 5,
      date: "2026-10-20",
      title: localized(
        "Creative and practical",
        "إبداعية وعملية"
      ),
      content: localized(
        "The course gave me a more structured approach to using AI tools in my creative process.",
        "ساعدتني الدورة على استخدام أدوات الذكاء الاصطناعي بطريقة أكثر تنظيمًا في عملي الإبداعي."
      ),
      helpful: 27,
      verified: false,
    },
    {
      id: "ai-review-02",
      student: "Reem Abdullah",
      initials: "RA",
      rating: 4,
      date: "2026-09-30",
      title: localized(
        "Great creative workflow ideas",
        "أفكار رائعة لسير العمل الإبداعي"
      ),
      content: localized(
        "The workflow examples were particularly useful for exploring visual concepts.",
        "كانت أمثلة سير العمل مفيدة جدًا في استكشاف المفاهيم البصرية."
      ),
      helpful: 15,
      verified: false,
    },
  ],
};

export function getCourseReviews(slug) {
  return courseReviews[slug] || [];
}

export function getReviewStatistics(reviews = []) {
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter(
      (review) => review.rating === stars
    ).length;

    return {
      stars,
      count,
      percentage: reviews.length
        ? (count / reviews.length) * 100
        : 0,
    };
  });

  const average = reviews.length
    ? reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      ) / reviews.length
    : 0;

  return {
    average,
    total: reviews.length,
    distribution,
  };
}
