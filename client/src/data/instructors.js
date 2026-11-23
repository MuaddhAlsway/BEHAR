import OmarKhalid from '../assets/OmarKhalid.png'
import Nora from '../assets/Nora.png'
export const instructors = [
  {
    id: "omar",
    slug: "omar-khalid",
    name: "Omar Khalid",
    category: "development",
    image:
      OmarKhalid,
    position: "center 35%",
    experience: "12+",
    learners: "28K",
    rating: "4.9",
    role: {
      en: "Full-Stack Engineer",
      ar: "مهندس برمجيات متكامل",
    },
    specialty: {
      en: "Web Development",
      ar: "تطوير الويب",
    },
    bio: {
      en: "Omar turns complex engineering concepts into practical learning experiences. His teaching focuses on building real applications, understanding architecture, and developing confidence through practice.",
      ar: "يحوّل عمر المفاهيم البرمجية المعقدة إلى تجارب تعليمية عملية، ويركز على بناء تطبيقات حقيقية وفهم هندسة الأنظمة وتطوير المهارات بالممارسة.",
    },
    quote: {
      en: "Don't just learn how technology works. Build something that matters.",
      ar: "لا تتعلّم كيف تعمل التقنية فقط، بل اصنع بها شيئًا له قيمة.",
    },
    skills: ["React", "Node.js", "System Design"],
    courses: [
      {
        title: {
          en: "Modern Full-Stack Development",
          ar: "تطوير تطبيقات الويب المتكاملة",
        },
        slug: "complete-web-development",
        duration: "8h 24m",
        level: "Intermediate",
      },
      {
        title: {
          en: "System Design for Web Apps",
          ar: "هندسة أنظمة تطبيقات الويب",
        },
        slug: "system-design",
        duration: "6h 10m",
        level: "Advanced",
      },
      {
        title: {
          en: "Performance & Scalability",
          ar: "الأداء وقابلية التوسع",
        },
        slug: "performance-scalability",
        duration: "4h 58m",
        level: "Intermediate",
      },
    ],
  },
  {
    id: "nora",
    slug: "nora-alharbi",
    name: "Nora Alharbi",
    category: "design",
    image:
     Nora,
    position: "center 30%",
    experience: "9+",
    learners: "19K",
    rating: "4.9",
    role: {
      en: "Product Designer",
      ar: "مصممة منتجات رقمية",
    },
    specialty: {
      en: "Product & UX Design",
      ar: "تصميم المنتجات وتجربة المستخدم",
    },
    bio: {
      en: "Nora helps emerging designers connect human needs with thoughtful digital experiences. Her lessons turn research, visual thinking, and prototyping into practical design skills.",
      ar: "تساعد نورة المصممين على ربط احتياجات المستخدمين بتجارب رقمية مدروسة، وتحويل البحث والتفكير البصري والنماذج الأولية إلى مهارات عملية.",
    },
    quote: {
      en: "Great design begins with understanding people.",
      ar: "التصميم العظيم يبدأ بفهم الناس.",
    },
    skills: ["UX Research", "UI Design", "Prototyping"],
    courses: [
      {
        title: {
          en: "Designing Digital Experiences",
          ar: "تصميم التجارب الرقمية",
        },
        slug: "digital-experiences",
        duration: "7h 15m",
        level: "Beginner",
      },
    ],
  },
  {
    id: "youssef",
    slug: "youssef-salem",
    name: "Youssef Salem",
    category: "technology",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1000&auto=format&fit=crop&q=85",
    position: "center 30%",
    experience: "11+",
    learners: "24K",
    rating: "4.8",
    role: {
      en: "Data & AI Educator",
      ar: "مدرب بيانات وذكاء اصطناعي",
    },
    specialty: {
      en: "Data Science & AI",
      ar: "علوم البيانات والذكاء الاصطناعي",
    },
    bio: {
      en: "Youssef makes data science approachable through clear explanations, practical experiments, and real-world problem solving.",
      ar: "يقدّم يوسف علوم البيانات بأسلوب واضح من خلال التجارب العملية وحل المشكلات الواقعية.",
    },
    quote: {
      en: "Data becomes powerful when it helps us ask better questions.",
      ar: "تصبح البيانات قوية عندما تساعدنا على طرح أسئلة أفضل.",
    },
    skills: ["Python", "Analytics", "AI"],
    courses: [
      {
        title: {
          en: "Data Science Foundations",
          ar: "أساسيات علوم البيانات",
        },
        slug: "data-science",
        duration: "9h 30m",
        level: "Beginner",
      },
    ],
  },
  {
    id: "layla",
    slug: "layla-haddad",
    name: "Layla Haddad",
    category: "business",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1000&auto=format&fit=crop&q=85",
    position: "center 30%",
    experience: "14+",
    learners: "32K",
    rating: "5.0",
    role: {
      en: "Business Strategist",
      ar: "مستشارة استراتيجية أعمال",
    },
    specialty: {
      en: "Business & Growth",
      ar: "الأعمال والنمو",
    },
    bio: {
      en: "Layla teaches practical business thinking, helping learners turn ideas into clear decisions, sustainable strategies, and measurable outcomes.",
      ar: "تعلّم ليلى التفكير التجاري العملي وتساعد المتعلمين على تحويل الأفكار إلى قرارات واضحة واستراتيجيات مستدامة.",
    },
    quote: {
      en: "Progress starts when you challenge the obvious.",
      ar: "يبدأ التقدّم عندما تتحدى ما يبدو بديهيًا.",
    },
    skills: ["Strategy", "Leadership", "Growth"],
    courses: [
      {
        title: {
          en: "Business Thinking for a Changing World",
          ar: "التفكير التجاري في عالم متغير",
        },
        slug: "business-thinking",
        duration: "5h 45m",
        level: "Intermediate",
      },
    ],
  },
  {
    id: "rami",
    slug: "rami-fares",
    name: "Rami Fares",
    category: "creative",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1000&auto=format&fit=crop&q=85",
    position: "center 30%",
    experience: "10+",
    learners: "16K",
    rating: "4.9",
    role: {
      en: "Creative Director",
      ar: "مدير إبداعي",
    },
    specialty: {
      en: "Branding & Visual Identity",
      ar: "العلامات التجارية والهوية البصرية",
    },
    bio: {
      en: "Rami explores the relationship between storytelling, visual identity, and memorable brands. His courses focus on creative thinking and meaningful execution.",
      ar: "يستكشف رامي العلاقة بين سرد القصص والهوية البصرية وبناء علامات تجارية مميزة، ويركز على التفكير الإبداعي والتنفيذ المتقن.",
    },
    quote: {
      en: "A memorable brand begins with a meaningful idea.",
      ar: "العلامة التجارية التي لا تُنسى تبدأ بفكرة ذات معنى.",
    },
    skills: ["Branding", "Art Direction", "Typography"],
    courses: [
      {
        title: {
          en: "Visual Identity: From Idea to Iconic",
          ar: "الهوية البصرية من الفكرة إلى التميز",
        },
        slug: "visual-identity",
        duration: "6h 20m",
        level: "Intermediate",
      },
    ],
  },
];
