
import { useState } from "react";
import {
  BookOpen,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import useLessonNotes from "../../../hooks/useLessonNotes";

const translations = {
  en: {
    eyebrow: "PERSONAL LEARNING JOURNAL",
    title: "Your thinking space.",
    description:
      "Capture important ideas, questions, and insights while studying.",
    placeholder: "Write something worth remembering...",
    add: "Save note",
    save: "Save changes",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    empty: "Your notebook is waiting.",
    emptyDescription:
      "Start writing to build your own collection of learning insights.",
    saved: "Saved notes",
  },
  ar: {
    eyebrow: "دفتر التعلم الشخصي",
    title: "مساحتك للتفكير.",
    description:
      "دوّن الأفكار والأسئلة والملاحظات المهمة أثناء التعلم.",
    placeholder: "اكتب فكرة تستحق التذكر...",
    add: "حفظ الملاحظة",
    save: "حفظ التعديلات",
    cancel: "إلغاء",
    edit: "تعديل",
    delete: "حذف",
    empty: "دفتر ملاحظاتك بانتظارك.",
    emptyDescription:
      "ابدأ الكتابة لإنشاء مجموعتك الخاصة من الأفكار التعليمية.",
    saved: "الملاحظات المحفوظة",
  },
};

export function LessonNotes({
  courseId,
  lessonId,
  language = "en",
}) {
  const locale = language === "ar" ? "ar" : "en";
  const t = translations[locale];

  const {
    lessonNotes,
    addNote,
    updateNote,
    deleteNote,
  } = useLessonNotes(courseId, lessonId);

  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  function handleAdd(event) {
    event.preventDefault();

    if (addNote(draft)) {
      setDraft("");
    }
  }

  function handleSaveEdit(noteId) {
    if (updateNote(noteId, editingText)) {
      setEditingId(null);
      setEditingText("");
    }
  }

  function startEditing(note) {
    setEditingId(note.id);
    setEditingText(note.content);
  }

  return (
    <section className="behar-tabs__notes">
      <div className="behar-tabs__editorial-heading">
        <span className="behar-tabs__eyebrow">
          {t.eyebrow}
        </span>
        <h2>{t.title}</h2>
        <p>{t.description}</p>
      </div>

      <form
        className="behar-tabs__note-composer"
        onSubmit={handleAdd}
      >
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={t.placeholder}
          rows={5}
          maxLength={5000}
          aria-label={t.placeholder}
        />

        <div className="behar-tabs__composer-footer">
          <span>{draft.length} / 5000</span>

          <button type="submit" disabled={!draft.trim()}>
            <Plus size={17} />
            {t.add}
          </button>
        </div>
      </form>

      <div className="behar-tabs__notes-heading">
        <h3>{t.saved}</h3>
        <span>{lessonNotes.length}</span>
      </div>

      {lessonNotes.length === 0 ? (
        <div className="behar-tabs__empty">
          <BookOpen size={28} strokeWidth={1.4} />
          <h3>{t.empty}</h3>
          <p>{t.emptyDescription}</p>
        </div>
      ) : (
        <div className="behar-tabs__notes-list">
          {[...lessonNotes].reverse().map((note) => (
            <article
              className="behar-tabs__note-item"
              key={note.id}
            >
              {editingId === note.id ? (
                <>
                  <textarea
                    value={editingText}
                    onChange={(event) =>
                      setEditingText(event.target.value)
                    }
                    rows={4}
                    maxLength={5000}
                    aria-label={t.edit}
                  />

                  <div className="behar-tabs__note-actions">
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(note.id)}
                      disabled={!editingText.trim()}
                    >
                      <Save size={15} />
                      {t.save}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                    >
                      <X size={15} />
                      {t.cancel}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p>{note.content}</p>

                  <div className="behar-tabs__note-footer">
                    <time dateTime={note.updatedAt}>
                      {new Intl.DateTimeFormat(
                        locale === "ar" ? "ar-SA" : "en-US",
                        { dateStyle: "medium" }
                      ).format(new Date(note.updatedAt))}
                    </time>

                    <div className="behar-tabs__note-actions">
                      <button
                        type="button"
                        onClick={() => startEditing(note)}
                        aria-label={t.edit}
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteNote(note.id)}
                        aria-label={t.delete}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default LessonNotes;
