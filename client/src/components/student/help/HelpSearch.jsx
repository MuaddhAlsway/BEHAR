
import { useState } from 'react'
import { Search, X, ArrowRight, ArrowLeft } from 'lucide-react'

import '../../../styles/student/help/help-search.css'

const translations = {
  en: {
    eyebrow: 'FIND YOUR ANSWER',
    title: 'What can we help you find?',
    description:
      'Search our help center for answers, guides, and solutions to common questions.',
    placeholder: 'Search for a question, topic, or keyword...',
    clear: 'Clear search',
    search: 'Search',
    hint: 'Try searching for',
    suggestions: [
      'Certificates',
      'Payments',
      'My courses',
      'Assignments',
    ],
    resultsFor: 'Searching for',
  },

  ar: {
    eyebrow: 'ابحث عن إجابتك',
    title: 'كيف يمكننا مساعدتك؟',
    description:
      'ابحث في مركز المساعدة عن الإجابات والإرشادات والحلول للأسئلة الشائعة.',
    placeholder: 'ابحث عن سؤال أو موضوع أو كلمة مفتاحية...',
    clear: 'مسح البحث',
    search: 'بحث',
    hint: 'جرّب البحث عن',
    suggestions: [
      'الشهادات',
      'المدفوعات',
      'دوراتي',
      'الواجبات',
    ],
    resultsFor: 'البحث عن',
  },
}

export default function HelpSearch({
  language = 'en',
  onSearchChange,
}) {
  const [query, setQuery] = useState('')

  const isArabic = language === 'ar'
  const t = translations[isArabic ? 'ar' : 'en']

  const updateQuery = (value) => {
    setQuery(value)
    onSearchChange?.(value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedQuery = query.trim()

    if (!trimmedQuery) return

    onSearchChange?.(trimmedQuery)

    document
      .getElementById('help-faq')
      ?.scrollIntoView({
        behavior: window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches
          ? 'auto'
          : 'smooth',
        block: 'start',
      })
  }

  const handleClear = () => {
    updateQuery('')
  }

  const handleSuggestion = (suggestion) => {
    updateQuery(suggestion)
  }

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight

  return (
    <section
      className="help-search"
      dir={isArabic ? 'rtl' : 'ltr'}
      lang={isArabic ? 'ar' : 'en'}
      aria-labelledby="help-search-title"
    >
      <div className="help-search__container">

        {/* Section introduction */}
        <div className="help-search__intro">
          <span className="help-search__eyebrow">
            <span
              className="help-search__eyebrow-line"
              aria-hidden="true"
            />
            {t.eyebrow}
          </span>

          <h2
            className="help-search__title"
            id="help-search-title"
          >
            {t.title}
          </h2>

          <p className="help-search__description">
            {t.description}
          </p>
        </div>

        {/* Search form */}
        <form
          className="help-search__form"
          role="search"
          onSubmit={handleSubmit}
        >
          <div className="help-search__field">
            <Search
              className="help-search__icon"
              size={21}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <input
              id="help-search-input"
              className="help-search__input"
              type="search"
              value={query}
              onChange={(event) =>
                updateQuery(event.target.value)
              }
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              autoComplete="off"
              enterKeyHint="search"
            />

            {query.length > 0 && (
              <button
                className="help-search__clear"
                type="button"
                onClick={handleClear}
                aria-label={t.clear}
                title={t.clear}
              >
                <X
                  size={17}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </button>
            )}

            <button
              className="help-search__submit"
              type="submit"
              disabled={!query.trim()}
            >
              <span>{t.search}</span>

              <ArrowIcon
                size={17}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>
          </div>
        </form>

        {/* Popular searches */}
        <div className="help-search__suggestions">
          <span className="help-search__suggestions-label">
            {t.hint}
          </span>

          <div className="help-search__suggestions-list">
            {t.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="help-search__suggestion"
                type="button"
                onClick={() =>
                  handleSuggestion(suggestion)
                }
              >
                {suggestion}

                <ArrowIcon
                  size={13}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Active query indicator */}
        {query.trim() && (
          <div
            className="help-search__active-query"
            role="status"
            aria-live="polite"
          >
            <Search
              size={14}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span>
              {t.resultsFor}:{' '}
              <strong>{query.trim()}</strong>
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
