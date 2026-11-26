
import { useEffect, useMemo, useState } from "react";
import {
  MessageSquarePlus,
  MessagesSquare,
  RotateCcw,
} from "lucide-react";

import {
  getDiscussionCourse,
  getDiscussionStats,
  getDiscussionText,
} from "../../data/discussions";
import { useDiscussions } from "../../context/DiscussionsContext";

import DiscussionStats from "../../components/student/discussions/DiscussionStats";
import DiscussionFilters from "../../components/student/discussions/DiscussionFilters";
import DiscussionCard from "../../components/student/discussions/DiscussionCard";
import CreateDiscussionModal from "../../components/student/discussions/CreateDiscussionModal";
import DiscussionStorageReset from "../../components/student/discussions/DiscussionStorageReset";

import "../../styles/student/discussions/discussions.css";

/* ==========================================
   TRANSLATIONS
========================================== */

const copy = {
  en: {
    eyebrow: "STUDENT COMMUNITY",
    title: "Discussions",
    subtitle:
      "Learn together, exchange ideas, and explore questions from your learning community.",
    newDiscussion: "Start a discussion",
    heading: "Community conversations",
    results: "discussions found",
    emptyTitle: "No discussions found",
    emptyDescription:
      "Try another search term or adjust your filters.",
    reset: "Clear filters",
    published: "Your discussion has been published.",
  },

  ar: {
    eyebrow: "مجتمع الطلاب",
    title: "المناقشات",
    subtitle:
      "تعلم مع الآخرين، وتبادل الأفكار، واستكشف أسئلة مجتمع التعلم.",
    newDiscussion: "بدء مناقشة",
    heading: "محادثات المجتمع",
    results: "مناقشة",
    emptyTitle: "لم يتم العثور على مناقشات",
    emptyDescription:
      "جرّب عبارة بحث أخرى أو غيّر خيارات التصفية.",
    reset: "إعادة ضبط الفلاتر",
    published: "تم نشر مناقشتك بنجاح.",
  },
};

/* ==========================================
   DOCUMENT LANGUAGE
========================================== */

function getDocumentLanguage() {
  if (typeof document === "undefined") {
    return "en";
  }

  return document.documentElement.lang
    ?.toLowerCase()
    .startsWith("ar")
    ? "ar"
    : "en";
}

function useDocumentLanguage() {
  const [language, setLanguage] = useState(
    getDocumentLanguage
  );

  useEffect(() => {
    const root = document.documentElement;

    const updateLanguage = () => {
      setLanguage(getDocumentLanguage());
    };

    updateLanguage();

    const observer = new MutationObserver(
      updateLanguage
    );

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => observer.disconnect();
  }, []);

  return language;
}

/* ==========================================
   STUDENT DISCUSSIONS PAGE
========================================== */

export default function Discussions() {
  const language = useDocumentLanguage();

  const t = copy[language] ?? copy.en;

  /* ========================================
     DISCUSSION STATE
  ======================================== */

  const { discussions, createDiscussion } = useDiscussions();

  /* ========================================
     FILTER STATE
  ======================================== */

  const [search, setSearch] = useState("");

  const [course, setCourse] = useState("all");

  const [status, setStatus] = useState("all");

  const [sort, setSort] = useState("newest");

  /* ========================================
     CREATE DISCUSSION MODAL
  ======================================== */

  const [isCreateOpen, setIsCreateOpen] =
    useState(false);

  /* ========================================
     PUBLISH FEEDBACK
  ======================================== */

  const [publishMessage, setPublishMessage] =
    useState("");

  /* ========================================
     DISCUSSION STATISTICS
  ======================================== */

  const stats = useMemo(() => {
    return getDiscussionStats(discussions);
  }, [discussions]);

  /* ========================================
     SEARCH, FILTERING & SORTING
  ======================================== */

  const filteredDiscussions = useMemo(() => {
    const query = search
      .trim()
      .toLocaleLowerCase();

    const filtered = discussions.filter(
      (item) => {
        /* Course filter */

        const matchesCourse =
          course === "all" ||
          item.courseId === course;

        /* Status filter */

        const matchesStatus =
          status === "all" ||
          (status === "mine"
            ? item.isMine
            : item.status === status);

        /* Get course information */

        const courseRecord =
          getDiscussionCourse(item.courseId);

        /* Searchable content */

        const searchableText = [
          getDiscussionText(
            item.title,
            "en"
          ),
          getDiscussionText(
            item.title,
            "ar"
          ),
          getDiscussionText(
            item.excerpt,
            "en"
          ),
          getDiscussionText(
            item.excerpt,
            "ar"
          ),
          getDiscussionText(
            courseRecord?.title,
            "en"
          ),
          getDiscussionText(
            courseRecord?.title,
            "ar"
          ),
          item.author,
          ...(item.tags ?? []),
        ]
          .join(" ")
          .toLocaleLowerCase();

        const matchesSearch =
          !query ||
          searchableText.includes(query);

        return (
          matchesCourse &&
          matchesStatus &&
          matchesSearch
        );
      }
    );

    /* Sorting */

    return filtered.sort((a, b) => {
      if (sort === "popular") {
        return b.upvotes - a.upvotes;
      }

      if (sort === "active") {
        return b.replies - a.replies;
      }

      const timeA = Date.parse(
        a.createdAt
      );

      const timeB = Date.parse(
        b.createdAt
      );

      if (sort === "oldest") {
        return timeA - timeB;
      }

      return timeB - timeA;
    });
  }, [
    discussions,
    search,
    course,
    status,
    sort,
  ]);

  /* ========================================
     RESET FILTERS
  ======================================== */

  function resetFilters() {
    setSearch("");
    setCourse("all");
    setStatus("all");
    setSort("newest");
  }

  /* ========================================
     OPEN CREATE MODAL
  ======================================== */

  function openCreateModal() {
    setPublishMessage("");
    setIsCreateOpen(true);
  }

  /* ========================================
     CLOSE CREATE MODAL
  ======================================== */

  function closeCreateModal() {
    setIsCreateOpen(false);
  }

  /* ========================================
     PUBLISH NEW DISCUSSION
  ======================================== */

  function handlePublishDiscussion(values) {
    createDiscussion(values);

    /* Reset filters to show new discussion */

    resetFilters();

    /* Display feedback */

    setPublishMessage(t.published);

    /* Close modal */

    setIsCreateOpen(false);
  }

  /* ========================================
     RENDER
  ======================================== */

  return (
    <div
      className="behar-discussions-page"
      dir={
        language === "ar"
          ? "rtl"
          : "ltr"
      }
    >
      {/* ====================================
          PAGE HEADER
      ==================================== */}

      <header className="behar-discussions-header">
        <div>
          <span className="behar-discussions-eyebrow">
            {t.eyebrow}
          </span>

          <h1>{t.title}</h1>

          <p>{t.subtitle}</p>
        </div>

        <button
          type="button"
          className="behar-discussions-create"
          onClick={openCreateModal}
        >
          <MessageSquarePlus
            size={18}
            aria-hidden="true"
          />

          {t.newDiscussion}
        </button>
      </header>

      {/* ====================================
          PUBLISH SUCCESS FEEDBACK
      ==================================== */}

      {publishMessage && (
        <div
          className="behar-discussions-success"
          role="status"
          aria-live="polite"
        >
          <span>{publishMessage}</span>

          <button
            type="button"
            onClick={() =>
              setPublishMessage("")
            }
            aria-label={
              language === "ar"
                ? "إغلاق الإشعار"
                : "Dismiss notification"
            }
          >
            ×
          </button>
        </div>
      )}

      {/* ====================================
          DISCUSSION STATISTICS
      ==================================== */}

      <DiscussionStats
        stats={stats}
        language={language}
      />

      {/* ====================================
          DISCUSSION FEED
      ==================================== */}

      <section className="behar-discussions-feed">
        <div className="behar-discussions-feed-heading">
          <div>
            <span className="behar-discussions-section-label">
              {t.eyebrow}
            </span>

            <h2>{t.heading}</h2>
          </div>

          <span className="behar-discussions-count">
            {filteredDiscussions.length}{" "}
            {t.results}
          </span>
        </div>

        {/* ==================================
            SEARCH & FILTERS
        ================================== */}

        <DiscussionFilters
          search={search}
          onSearchChange={setSearch}
          course={course}
          onCourseChange={setCourse}
          status={status}
          onStatusChange={setStatus}
          sort={sort}
          onSortChange={setSort}
          language={language}
        />

        {/* ==================================
            DISCUSSION LIST
        ================================== */}

        {filteredDiscussions.length > 0 ? (
          <div className="behar-discussions-list">
            {filteredDiscussions.map(
              (discussion) => (
                <DiscussionCard
                  key={discussion.id}
                  discussion={discussion}
                  language={language}
                />
              )
            )}
          </div>
        ) : (
          /* ================================
             EMPTY STATE
          ================================ */

          <div className="behar-discussions-empty">
            <div className="behar-discussions-empty-icon">
              <MessagesSquare
                size={29}
                aria-hidden="true"
              />
            </div>

            <h3>{t.emptyTitle}</h3>

            <p>{t.emptyDescription}</p>

            <button
              type="button"
              onClick={resetFilters}
            >
              <RotateCcw
                size={16}
                aria-hidden="true"
              />

              {t.reset}
            </button>
          </div>
        )}
      </section>

      <DiscussionStorageReset language={language} />

      {/* ====================================
          CREATE DISCUSSION MODAL
      ==================================== */}

      <CreateDiscussionModal
        open={isCreateOpen}
        onClose={closeCreateModal}
        onPublish={handlePublishDiscussion}
        language={language}
      />
    </div>
  );
}
