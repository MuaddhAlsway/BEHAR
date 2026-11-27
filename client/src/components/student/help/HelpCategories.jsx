
import { useState } from 'react'
import {
  BookOpen,
  CreditCard,
  UserRound,
  Award,
  MonitorPlay,
  Settings2,
  ArrowUpRight,
  ArrowUpLeft,
  LayoutGrid,
} from 'lucide-react'

import '../../../styles/student/help/help-categories.css'

export const HELP_CATEGORIES = [
  {
    id: 'courses',
    icon: BookOpen,
    number: '01',
    title: {
      en: 'Courses & Learning',
      ar: 'الدورات والتعلم',
    },
    description: {
      en: 'Enrollment, lessons, learning progress, and course access.',
      ar: 'التسجيل في الدورات والدروس والتقدم التعليمي والوصول إلى المحتوى.',
    },
    topics: {
      en: 'Course enrollment · Learning progress',
      ar: 'التسجيل في الدورات · التقدم التعليمي',
    },
  },
  {
    id: 'payments',
    icon: CreditCard,
    number: '02',
    title: {
      en: 'Payments & Billing',
      ar: 'المدفوعات والفواتير',
    },
    description: {
      en: 'Payment methods, receipts, refunds, and billing questions.',
      ar: 'طرق الدفع والإيصالات والاسترداد والاستفسارات المالية.',
    },
    topics: {
      en: 'Payment issues · Refunds',
      ar: 'مشاكل الدفع · الاسترداد',
    },
  },
  {
    id: 'account',
    icon: UserRound,
    number: '03',
    title: {
      en: 'Account & Security',
      ar: 'الحساب والأمان',
    },
    description: {
      en: 'Profile settings, account access, passwords, and privacy.',
      ar: 'إعدادات الملف الشخصي والوصول للحساب وكلمات المرور والخصوصية.',
    },
    topics: {
      en: 'Profile settings · Account access',
      ar: 'إعدادات الملف الشخصي · الوصول للحساب',
    },
  },
  {
    id: 'certificates',
    icon: Award,
    number: '04',
    title: {
      en: 'Certificates & Achievements',
      ar: 'الشهادات والإنجازات',
    },
    description: {
      en: 'Course certificates, badges, milestones, and achievements.',
      ar: 'شهادات الدورات والشارات والمراحل التعليمية والإنجازات.',
    },
    topics: {
      en: 'Certificates · Badges',
      ar: 'الشهادات · الشارات',
    },
  },
  {
    id: 'technical',
    icon: MonitorPlay,
    number: '05',
    title: {
      en: 'Technical Support',
      ar: 'الدعم التقني',
    },
    description: {
      en: 'Video playback, platform errors, and technical difficulties.',
      ar: 'تشغيل الفيديو وأخطاء المنصة والمشاكل التقنية.',
    },
    topics: {
      en: 'Video playback · Platform issues',
      ar: 'تشغيل الفيديو · مشاكل المنصة',
    },
  },
  {
    id: 'preferences',
    icon: Settings2,
    number: '06',
    title: {
      en: 'Settings & Preferences',
      ar: 'الإعدادات والتفضيلات',
    },
    description: {
      en: 'Notifications, language, appearance, and learning preferences.',
      ar: 'الإشعارات واللغة والمظهر وتفضيلات التعلم.',
    },
    topics: {
      en: 'Notifications · Language',
      ar: 'الإشعارات · اللغة',
    },
  },
]

const translations = {
  en: {
    eyebrow: 'EXPLORE SUPPORT',
    title: 'Browse by category',
    description:
      'Find the right guidance for every part of your learning experience.',
    browse: 'Explore topic',
    all: 'All topics',
    selected: 'Selected category',
  },
  ar: {
    eyebrow: 'استكشف المساعدة',
    title: 'تصفح حسب التصنيف',
    description:
      'اعثر على الإرشادات المناسبة لكل جزء من رحلتك التعليمية.',
    browse: 'استكشف الموضوع',
    all: 'جميع المواضيع',
    selected: 'التصنيف المحدد',
  },
}

export default function HelpCategories({
  language = 'en',
  selectedCategory,
  onCategoryChange,
}) {
  const [internalCategory, setInternalCategory] = useState(null)

  const isArabic = language === 'ar'
  const t = translations[isArabic ? 'ar' : 'en']

  const activeCategory =
    selectedCategory !== undefined
      ? selectedCategory
      : internalCategory

  const ArrowIcon = isArabic ? ArrowUpLeft : ArrowUpRight

  const handleCategoryChange = (categoryId) => {
    const nextCategory =
      activeCategory === categoryId ? null : categoryId

    if (selectedCategory === undefined) {
      setInternalCategory(nextCategory)
    }

    onCategoryChange?.(nextCategory)
  }

  return (
    <section
      className="help-categories"
      dir={isArabic ? 'rtl' : 'ltr'}
      lang={isArabic ? 'ar' : 'en'}
      aria-labelledby="help-categories-title"
    >
      <div className="help-categories__container">

        {/* Section Header */}
        <div className="help-categories__header">
          <div className="help-categories__heading">
            <span className="help-categories__eyebrow">
              <span
                className="help-categories__eyebrow-line"
                aria-hidden="true"
              />
              {t.eyebrow}
            </span>

            <h2
              className="help-categories__title"
              id="help-categories-title"
            >
              {t.title}
            </h2>

            <p className="help-categories__description">
              {t.description}
            </p>
          </div>

          <div
            className="help-categories__count"
            aria-label={`${HELP_CATEGORIES.length} ${t.all}`}
          >
            <LayoutGrid
              size={16}
              strokeWidth={1.7}
              aria-hidden="true"
            />
            <span>
              {String(HELP_CATEGORIES.length).padStart(2, '0')}
              {' '}
              {t.all}
            </span>
          </div>
        </div>

        {/* Category Grid */}
        <div className="help-categories__grid">
          {HELP_CATEGORIES.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id

            return (
              <button
                key={category.id}
                type="button"
                className={[
                  'help-categories__card',
                  isActive
                    ? 'help-categories__card--active'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() =>
                  handleCategoryChange(category.id)
                }
                aria-pressed={isActive}
                aria-label={`${category.title[language]}${
                  isActive ? ` — ${t.selected}` : ''
                }`}
              >
                <div className="help-categories__card-top">
                  <span className="help-categories__icon">
                    <Icon
                      size={23}
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                  </span>

                  <span className="help-categories__number">
                    {category.number}
                  </span>
                </div>

                <div className="help-categories__card-content">
                  <h3 className="help-categories__card-title">
                    {category.title[language]}
                  </h3>

                  <p className="help-categories__card-description">
                    {category.description[language]}
                  </p>
                </div>

                <div className="help-categories__card-footer">
                  <span className="help-categories__topics">
                    {category.topics[language]}
                  </span>

                  <span
                    className="help-categories__arrow"
                    aria-hidden="true"
                  >
                    <ArrowIcon
                      size={17}
                      strokeWidth={1.7}
                    />
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected Category */}
        {activeCategory && (
          <div
            className="help-categories__selection"
            role="status"
            aria-live="polite"
          >
            <span className="help-categories__selection-dot" />

            <span>
              {t.selected}:{' '}
              <strong>
                {
                  HELP_CATEGORIES.find(
                    (category) =>
                      category.id === activeCategory
                  )?.title[language]
                }
              </strong>
            </span>

            <button
              type="button"
              className="help-categories__reset"
              onClick={() => handleCategoryChange(activeCategory)}
            >
              {t.all}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
