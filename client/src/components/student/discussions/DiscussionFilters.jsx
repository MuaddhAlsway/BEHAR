
import { Search, SlidersHorizontal } from "lucide-react";
import {
  discussionCourses,
  getDiscussionText,
} from "../../../data/discussions";

const copy = {
  en: {
    search: "Search discussions...",
    course: "Course",
    allCourses: "All courses",
    status: "Status",
    all: "All discussions",
    open: "Open",
    solved: "Solved",
    mine: "My discussions",
    sort: "Sort by",
    newest: "Newest first",
    oldest: "Oldest first",
    popular: "Most upvoted",
    active: "Most replies",
    filters: "Discussion filters",
  },
  ar: {
    search: "ابحث في المناقشات...",
    course: "الدورة",
    allCourses: "جميع الدورات",
    status: "الحالة",
    all: "جميع المناقشات",
    open: "مفتوحة",
    solved: "محلولة",
    mine: "مناقشاتي",
    sort: "ترتيب حسب",
    newest: "الأحدث أولًا",
    oldest: "الأقدم أولًا",
    popular: "الأكثر تصويتًا",
    active: "الأكثر ردودًا",
    filters: "تصفية المناقشات",
  },
};

export default function DiscussionFilters({
  search,
  onSearchChange,
  course,
  onCourseChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  language = "en",
}) {
  const t = copy[language] ?? copy.en;

  return (
    <section
      className="behar-discussion-filters"
      aria-label={t.filters}
    >
      <div className="behar-discussion-search">
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder={t.search}
          aria-label={t.search}
        />
      </div>

      <div className="behar-discussion-filter-row">
        <SlidersHorizontal
          className="behar-discussion-filter-symbol"
          size={18}
          aria-hidden="true"
        />

        <label className="behar-discussion-select">
          <span>{t.course}</span>
          <select
            value={course}
            onChange={(event) =>
              onCourseChange(event.target.value)
            }
          >
            <option value="all">{t.allCourses}</option>
            {discussionCourses.map((item) => (
              <option key={item.id} value={item.id}>
                {getDiscussionText(item.title, language)}
              </option>
            ))}
          </select>
        </label>

        <label className="behar-discussion-select">
          <span>{t.status}</span>
          <select
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value)
            }
          >
            <option value="all">{t.all}</option>
            <option value="open">{t.open}</option>
            <option value="solved">{t.solved}</option>
            <option value="mine">{t.mine}</option>
          </select>
        </label>

        <label className="behar-discussion-select">
          <span>{t.sort}</span>
          <select
            value={sort}
            onChange={(event) =>
              onSortChange(event.target.value)
            }
          >
            <option value="newest">{t.newest}</option>
            <option value="oldest">{t.oldest}</option>
            <option value="popular">{t.popular}</option>
            <option value="active">{t.active}</option>
          </select>
        </label>
      </div>
    </section>
  );
}
