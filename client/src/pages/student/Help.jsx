
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import HelpHero from '../../components/student/help/HelpHero'
import HelpSearch from '../../components/student/help/HelpSearch'
import HelpCategories from '../../components/student/help/HelpCategories'
import HelpFAQ from '../../components/student/help/HelpFAQ'
import HelpContact from '../../components/student/help/HelpContact'
import HelpContactForm from '../../components/student/help/HelpContactForm'
import HelpReportProblem from '../../components/student/help/HelpReportProblem'
import HelpQuickLinks from '../../components/student/help/HelpQuickLinks'

function Help() {
  const { pathname } = useLocation()

  const language =
    pathname.split('/')[1] === 'ar' ? 'ar' : 'en'

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)

  const scrollToFAQ = () => {
    const section = document.getElementById('help-faq')

    if (!section) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    section.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)

    requestAnimationFrame(() => {
      scrollToFAQ()
    })
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCategory(null)
  }

  return (
    <div
      className="student-help-page"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      lang={language}
    >
      <HelpHero language={language} />

      <HelpSearch
        language={language}
        value={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <HelpCategories
        language={language}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <HelpFAQ
        language={language}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onClearFilters={handleClearFilters}
      />

      <HelpContact language={language} />

      <HelpContactForm language={language} />

      <HelpReportProblem language={language} />

      <HelpQuickLinks language={language} />
    </div>
  )
}

export default Help
