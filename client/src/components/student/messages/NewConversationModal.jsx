
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  X,
  Search,
  UserRound,
  Headphones,
  BookOpen,
  MessageCircle,
  Check,
  ArrowRight,
  ArrowLeft,
  Users,
} from "lucide-react";

import { useMessages } from "../../../hooks/useMessages";

import {
  messageParticipants,
} from "../../../data/messages";

import {
  formatParticipantName,
  formatCourseTitle,
} from "../../../utils/messageFormatters";

import "../../../styles/student/messages/message-modal.css";

const translations = {
  en: {
    title: "New conversation",
    subtitle: "Connect with your instructors or support team.",
    close: "Close new conversation",
    search: "Search instructors or support...",
    all: "All",
    instructors: "Instructors",
    support: "Support",
    available: "Available",
    offline: "Offline",
    instructor: "Instructor",
    supportRole: "Support team",
    selectParticipant: "Choose who you want to message",
    selectCourse: "Related course",
    optional: "Optional",
    noCourse: "General conversation",
    start: "Start conversation",
    starting: "Starting...",
    cancel: "Cancel",
    noResults: "No participants found",
    noResultsDescription:
      "Try another name or change the selected filter.",
    noParticipant: "Select a participant to continue.",
    existing: "An existing conversation will be opened if found.",
    failed: "Unable to start the conversation.",
  },

  ar: {
    title: "محادثة جديدة",
    subtitle: "تواصل مع المدربين أو فريق الدعم.",
    close: "إغلاق نافذة المحادثة الجديدة",
    search: "ابحث عن مدرب أو الدعم الفني...",
    all: "الكل",
    instructors: "المدربون",
    support: "الدعم",
    available: "متصل",
    offline: "غير متصل",
    instructor: "مدرب",
    supportRole: "فريق الدعم",
    selectParticipant: "اختر الشخص الذي تريد مراسلته",
    selectCourse: "الدورة المرتبطة",
    optional: "اختياري",
    noCourse: "محادثة عامة",
    start: "بدء المحادثة",
    starting: "جاري البدء...",
    cancel: "إلغاء",
    noResults: "لم يتم العثور على نتائج",
    noResultsDescription:
      "جرّب اسمًا آخر أو غيّر نوع التصفية.",
    noParticipant: "اختر مشاركًا للمتابعة.",
    existing: "سيتم فتح المحادثة الموجودة إذا كانت متاحة.",
    failed: "تعذر بدء المحادثة.",
  },
};

const FILTERS = ["all", "instructors", "support"];

function getInitials(name) {
  if (!name) return "?";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getCourses(conversations) {
  const courseMap = new Map();

  for (const conversation of conversations) {
    const course = conversation.course;

    if (!course?.id) continue;

    if (!courseMap.has(course.id)) {
      courseMap.set(course.id, course);
    }
  }

  return [...courseMap.values()];
}

export default function NewConversationModal({
  language = "en",
  onConversationCreated,
}) {
  const {
    conversations,
    isNewConversationOpen,
    setIsNewConversationOpen,
    createConversation,
  } = useMessages();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedParticipantId, setSelectedParticipantId] =
    useState(null);
  const [selectedCourseId, setSelectedCourseId] =
    useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  const titleId = useId();
  const descriptionId = useId();
  const courseInputId = useId();

  const currentLanguage =
    language === "ar" ? "ar" : "en";

  const t = translations[currentLanguage];

  const isOpen = Boolean(isNewConversationOpen);

  const courses = useMemo(
    () => getCourses(conversations),
    [conversations]
  );

  const visibleParticipants = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return messageParticipants.filter((participant) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "instructors" &&
          participant.role === "instructor") ||
        (filter === "support" &&
          participant.role === "support");

      const searchableName = [
        participant.name,
        participant.nameAr,
        participant.role,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();

      return (
        matchesFilter &&
        (!query || searchableName.includes(query))
      );
    });
  }, [search, filter]);

  const selectedParticipant = messageParticipants.find(
    (participant) => participant.id === selectedParticipantId
  );

  const selectedCourse = courses.find(
    (course) => String(course.id) === selectedCourseId
  );

  function closeModal() {
    if (isSubmitting) return;

    setIsNewConversationOpen(false);
  }

  function resetForm() {
    setSearch("");
    setFilter("all");
    setSelectedParticipantId(null);
    setSelectedCourseId("");
    setError("");
    setIsSubmitting(false);
  }

  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }

    previousFocusRef.current = document.activeElement;

    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsNewConversationOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;

      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll(
          'button:not([disabled]), ' +
          'input:not([disabled]), ' +
          'select:not([disabled]), ' +
          'a[href], ' +
          '[tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (element) => element.getClientRects().length > 0
      );

      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, setIsNewConversationOpen]);

  if (!isOpen) return null;

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedParticipantId) {
      setError(t.noParticipant);
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const course = selectedCourse || null;

      const result = createConversation(
        selectedParticipantId,
        course
      );

      if (!result) {
        setError(t.failed);
        return;
      }

      setIsNewConversationOpen(false);

      if (typeof onConversationCreated === "function") {
        onConversationCreated(result);
      }
    } catch (submitError) {
      console.error(
        "Failed to create conversation:",
        submitError
      );

      setError(t.failed);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="new-conversation-modal__overlay"
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
    >
      <button
        type="button"
        className="new-conversation-modal__backdrop"
        onClick={closeModal}
        tabIndex={-1}
        aria-label={t.close}
      />

      <section
        ref={dialogRef}
        className="new-conversation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        {/* Header */}

        <header className="new-conversation-modal__header">
          <div className="new-conversation-modal__heading">
            <span className="new-conversation-modal__eyebrow">
              BEHAR / MESSAGES
            </span>

            <h2 id={titleId}>{t.title}</h2>

            <p id={descriptionId}>
              {t.subtitle}
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="new-conversation-modal__close"
            onClick={closeModal}
            aria-label={t.close}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <form
          className="new-conversation-modal__form"
          onSubmit={handleSubmit}
        >
          <div className="new-conversation-modal__scroll">
            {/* Search */}

            <div className="new-conversation-modal__search">
              <Search
                size={18}
                aria-hidden="true"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder={t.search}
                aria-label={t.search}
              />
            </div>

            {/* Filters */}

            <div
              className="new-conversation-modal__filters"
              role="group"
              aria-label={t.selectParticipant}
            >
              {FILTERS.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={[
                    "new-conversation-modal__filter",
                    filter === item
                      ? "new-conversation-modal__filter--active"
                      : "",
                  ].join(" ")}
                  onClick={() => setFilter(item)}
                  aria-pressed={filter === item}
                >
                  {item === "all" && (
                    <Users size={15} aria-hidden="true" />
                  )}

                  {item === "instructors" && (
                    <UserRound
                      size={15}
                      aria-hidden="true"
                    />
                  )}

                  {item === "support" && (
                    <Headphones
                      size={15}
                      aria-hidden="true"
                    />
                  )}

                  <span>{t[item]}</span>
                </button>
              ))}
            </div>

            {/* Participant selection */}

            <div className="new-conversation-modal__section">
              <h3 className="new-conversation-modal__section-title">
                {t.selectParticipant}
              </h3>

              {visibleParticipants.length === 0 ? (
                <div className="new-conversation-modal__empty">
                  <Search
                    size={24}
                    aria-hidden="true"
                  />

                  <h4>{t.noResults}</h4>
                  <p>{t.noResultsDescription}</p>
                </div>
              ) : (
                <div className="new-conversation-modal__participants">
                  {visibleParticipants.map((participant) => {
                    const name = formatParticipantName(
                      participant,
                      currentLanguage
                    );

                    const isSelected =
                      selectedParticipantId === participant.id;

                    const isSupport =
                      participant.role === "support";

                    return (
                      <button
                        key={participant.id}
                        type="button"
                        className={[
                          "new-conversation-modal__participant",
                          isSelected
                            ? "new-conversation-modal__participant--selected"
                            : "",
                        ].join(" ")}
                        onClick={() => {
                          setSelectedParticipantId(
                            participant.id
                          );
                          setError("");
                        }}
                        aria-pressed={isSelected}
                      >
                        <div className="new-conversation-modal__avatar-wrap">
                          {participant.avatar ? (
                            <img
                              src={participant.avatar}
                              alt=""
                              className="new-conversation-modal__avatar-image"
                            />
                          ) : (
                            <span className="new-conversation-modal__avatar">
                              {isSupport ? (
                                <Headphones
                                  size={19}
                                  aria-hidden="true"
                                />
                              ) : (
                                getInitials(name)
                              )}
                            </span>
                          )}

                          {participant.online && (
                            <span
                              className="new-conversation-modal__online-dot"
                              aria-hidden="true"
                            />
                          )}
                        </div>

                        <span className="new-conversation-modal__participant-info">
                          <span className="new-conversation-modal__participant-name">
                            {name}
                          </span>

                          <span className="new-conversation-modal__participant-role">
                            {isSupport
                              ? t.supportRole
                              : t.instructor}

                            <span aria-hidden="true">
                              {" · "}
                            </span>

                            {participant.online
                              ? t.available
                              : t.offline}
                          </span>
                        </span>

                        <span className="new-conversation-modal__selection">
                          {isSelected && (
                            <Check
                              size={17}
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Optional course */}

            <div className="new-conversation-modal__section">
              <div className="new-conversation-modal__section-heading">
                <label
                  htmlFor={courseInputId}
                  className="new-conversation-modal__section-title"
                >
                  <BookOpen
                    size={17}
                    aria-hidden="true"
                  />

                  {t.selectCourse}
                </label>

                <span className="new-conversation-modal__optional">
                  {t.optional}
                </span>
              </div>

              <select
                id={courseInputId}
                className="new-conversation-modal__course-select"
                value={selectedCourseId}
                onChange={(event) =>
                  setSelectedCourseId(event.target.value)
                }
              >
                <option value="">
                  {t.noCourse}
                </option>

                {courses.map((course) => (
                  <option
                    key={course.id}
                    value={String(course.id)}
                  >
                    {formatCourseTitle(
                      course,
                      currentLanguage
                    )}
                  </option>
                ))}
              </select>

              <p className="new-conversation-modal__hint">
                {t.existing}
              </p>
            </div>

            {error && (
              <p
                className="new-conversation-modal__error"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>

          {/* Footer */}

          <footer className="new-conversation-modal__footer">
            <button
              type="button"
              className="new-conversation-modal__cancel"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              className="new-conversation-modal__submit"
              disabled={
                !selectedParticipant ||
                isSubmitting
              }
            >
              <MessageCircle
                size={17}
                aria-hidden="true"
              />

              <span>
                {isSubmitting ? t.starting : t.start}
              </span>

              {currentLanguage === "ar" ? (
                <ArrowLeft
                  size={16}
                  aria-hidden="true"
                />
              ) : (
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                />
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
