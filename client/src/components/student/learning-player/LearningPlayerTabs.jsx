
import { useId, useRef, useState } from "react";
import {
  BookOpen,
  FileText,
  MessageCircle,
  NotebookPen,
} from "lucide-react";

import LessonContent, { LessonNotes } from "./LessonContent";
import LessonDiscussion from "./LessonDiscussion";

import "../../../styles/student/learning-player/learning-player-tabs.css";

const translations = {
  en: {
    overview: "Overview",
    resources: "Resources",
    notes: "My Notes",
    discussion: "Discussion",
    resourcesTitle: "Learning resources.",
    resourcesDescription:
      "Reference materials and supporting files for this lesson.",
    noResources: "No resources published for this lesson yet.",
    open: "Open resource",
    download: "Download",
  },
  ar: {
    overview: "نظرة عامة",
    resources: "الموارد",
    notes: "ملاحظاتي",
    discussion: "النقاش",
    resourcesTitle: "الموارد التعليمية.",
    resourcesDescription:
      "المراجع والملفات المساعدة الخاصة بهذا الدرس.",
    noResources: "لم تُنشر موارد لهذا الدرس بعد.",
    open: "فتح المورد",
    download: "تحميل",
  },
};

function localized(value, language) {
  if (typeof value === "string") return value;
  return value?.[language] || value?.en || "";
}

function safeUrl(url) {
  if (typeof url !== "string") return false;

  if (url.startsWith("/") && !url.startsWith("//")) {
    return true;
  }

  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

const tabDefinitions = [
  { id: "overview", icon: BookOpen },
  { id: "resources", icon: FileText },
  { id: "notes", icon: NotebookPen },
  { id: "discussion", icon: MessageCircle },
];

function LessonResources({ content, language }) {
  const t = translations[language];

  const resources = Array.isArray(content?.resources)
    ? content.resources.filter((item) => safeUrl(item.url))
    : [];

  return (
    <section className="behar-tabs__resources-panel">
      <div className="behar-tabs__editorial-heading">
        <span className="behar-tabs__eyebrow">
          BEHAR / RESOURCES
        </span>
        <h2>{t.resourcesTitle}</h2>
        <p>{t.resourcesDescription}</p>
      </div>

      {resources.length === 0 ? (
        <div className="behar-tabs__empty">
          <FileText size={27} strokeWidth={1.4} />
          <p>{t.noResources}</p>
        </div>
      ) : (
        <div className="behar-tabs__resource-list">
          {resources.map((resource) => {
            const external = /^https?:\/\//i.test(
              resource.url
            );

            const downloadable =
              resource.type === "download" && !external;

            return (
              <a
                key={resource.id}
                href={resource.url}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                download={downloadable || undefined}
                className="behar-tabs__resource-link"
              >
                <span className="behar-tabs__resource-symbol">
                  <FileText size={20} />
                </span>

                <span>
                  <strong>
                    {localized(resource.title, language)}
                  </strong>
                  <small>
                    {resource.format || "Resource"}
                  </small>
                </span>

                <span className="behar-tabs__resource-action">
                  {downloadable ? t.download : t.open}
                </span>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function LearningPlayerTabs({
  course,
  lesson,
  content,
  language = "en",
}) {
  const locale = language === "ar" ? "ar" : "en";
  const t = translations[locale];

  const [activeTab, setActiveTab] = useState("overview");
  const tabRefs = useRef({});
  const baseId = useId();

  if (!course || !lesson) return null;

  function handleKeyDown(event, index) {
    const isRTL = locale === "ar";

    let nextIndex = null;

    if (event.key === "ArrowRight") {
      nextIndex = isRTL ? index - 1 : index + 1;
    } else if (event.key === "ArrowLeft") {
      nextIndex = isRTL ? index + 1 : index - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabDefinitions.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();

    const wrappedIndex =
      (nextIndex + tabDefinitions.length) %
      tabDefinitions.length;

    const nextTab = tabDefinitions[wrappedIndex].id;

    setActiveTab(nextTab);
    tabRefs.current[nextTab]?.focus();
  }

  return (
    <div
      className="behar-tabs"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div
        className="behar-tabs__navigation"
        role="tablist"
        aria-label={
          locale === "ar"
            ? "أقسام الدرس"
            : "Lesson sections"
        }
      >
        {tabDefinitions.map((tab, index) => {
          const Icon = tab.icon;
          const selected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[tab.id] = element;
              }}
              type="button"
              role="tab"
              id={`${baseId}-${tab.id}-tab`}
              aria-selected={selected}
              aria-controls={`${baseId}-${tab.id}-panel`}
              tabIndex={selected ? 0 : -1}
              className={`behar-tabs__tab ${
                selected ? "behar-tabs__tab--active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) =>
                handleKeyDown(event, index)
              }
            >
              <Icon size={18} strokeWidth={1.7} />
              <span>{t[tab.id]}</span>
            </button>
          );
        })}
      </div>

      <div
        className="behar-tabs__panel"
        role="tabpanel"
        id={`${baseId}-${activeTab}-panel`}
        aria-labelledby={`${baseId}-${activeTab}-tab`}
        tabIndex={0}
      >
        {activeTab === "overview" && (
          <LessonContent
            lesson={lesson}
            content={
              content
                ? { ...content, resources: [] }
                : null
            }
            language={locale}
          />
        )}

        {activeTab === "resources" && (
          <LessonResources
            content={content}
            language={locale}
          />
        )}

        {activeTab === "notes" && (
          <LessonNotes
            key={`${course.courseId}-${lesson.id}`}
            courseId={course.courseId}
            lessonId={lesson.id}
            language={locale}
          />
        )}

        {activeTab === "discussion" && (
          <LessonDiscussion
            courseId={course.courseId}
            lessonId={lesson.id}
            language={locale}
          />
        )}
      </div>
    </div>
  );
}
