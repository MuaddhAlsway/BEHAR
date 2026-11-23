
import TheCompleteWebDevelopmentExperience from "../assets/TheCompleteWebDevelopmentExperience.png";
import VisualIdentityFromIdeatoIconic from "../assets/VisualIdentityFromIdeatoIconic.png";
import BusinessThinkingforaChangingWorld from "../assets/BusinessThinkingforaChangingWorld.png";
import TheNewRulesofDigitalMarketing from "../assets/TheNewRulesofDigitalMarketing.png";
import PhotographyBeyondtheOrdinary from "../assets/PhotographyBeyondtheOrdinary.png";
import discoveryWorkspace from "../assets/ArtificialIntelligence.png";

export const courseCategories = [
  {
    id: "development",
    number: "01",
    title: {
      en: "Development",
      ar: "البرمجة والتطوير",
    },
    description: {
      en: "Build the digital world.",
      ar: "اصنع العالم الرقمي.",
    },
    image: TheCompleteWebDevelopmentExperience,
    accent: "#D9EF74",
  },
  {
    id: "design",
    number: "02",
    title: {
      en: "Design",
      ar: "التصميم",
    },
    description: {
      en: "Give ideas a visual language.",
      ar: "امنح أفكارك لغة بصرية.",
    },
    image: VisualIdentityFromIdeatoIconic,
    accent: "#E8B99A",
  },
  {
    id: "business",
    number: "03",
    title: {
      en: "Business",
      ar: "الأعمال",
    },
    description: {
      en: "Turn ambition into impact.",
      ar: "حوّل الطموح إلى أثر.",
    },
    image: BusinessThinkingforaChangingWorld,
    accent: "#B6C7E3",
  },
  {
    id: "artificial-intelligence",
    number: "04",
    title: {
      en: "Artificial Intelligence",
      ar: "الذكاء الاصطناعي",
    },
    description: {
      en: "Explore what's possible next.",
      ar: "اكتشف إمكانيات المستقبل.",
    },
    image: discoveryWorkspace,
    accent: "#C5B9E8",
  },
  {
    id: "marketing",
    number: "05",
    title: {
      en: "Marketing",
      ar: "التسويق",
    },
    description: {
      en: "Make ideas impossible to ignore.",
      ar: "اجعل أفكارك محط الأنظار.",
    },
    image: TheNewRulesofDigitalMarketing,
    accent: "#F1C48C",
  },
  {
    id: "photography",
    number: "06",
    title: {
      en: "Photography",
      ar: "التصوير",
    },
    description: {
      en: "See the world differently.",
      ar: "شاهد العالم بمنظور مختلف.",
    },
    image: PhotographyBeyondtheOrdinary,
    accent: "#A5CFC2",
  },
];

export const getCourseCategory = (id) =>
  courseCategories.find((category) => category.id === id);

export const isValidCourseCategory = (id) =>
  courseCategories.some((category) => category.id === id);
