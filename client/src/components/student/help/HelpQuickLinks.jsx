
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  ArrowUpLeft,
  BookOpen,
  ChartNoAxesCombined,
  ClipboardList,
  Award,
  CreditCard,
  Settings2,
  Compass,
  ExternalLink,
} from 'lucide-react'

import '../../../styles/student/help/help-quick-links.css'

const QUICK_LINKS = [
  {
    id: 'learning',
    number: '01',
    icon: BookOpen,
    path: '/student/my-learning',
    title: {
      en: 'My Learning',
      ar: 'تعلمي',
    },
    description: {
      en: 'Continue your courses and access your learning materials.',
      ar: 'تابع دوراتك واطّلع على المواد التعليمية الخاصة بك.',
    },
    category: {
      en: 'LEARNING',
      ar: 'التعلم',
    },
  },
  {
    id: 'progress',
    number: '02',
    icon: ChartNoAxesCombined,
    path: '/student/progress',
    title: {
      en: 'Learning Progress',
      ar: 'التقدم التعليمي',
    },
    description: {
      en: 'Review your learning activity, milestones, and progress.',
      ar: 'راجع نشاطك التعليمي ومراحل الإنجاز ومستوى تقدمك.',
    },
    category: {
      en: 'PERFORMANCE',
      ar: 'الأداء',
    },
  },
  {
    id: 'assignments',
    number: '03',
    icon: ClipboardList,
    path: '/student/assignments',
    title: {
      en: 'Assignments',
      ar: 'الواجبات',
    },
    description: {
      en: 'View upcoming assignments, quizzes, and learning tasks.',
      ar: 'اطّلع على الواجبات والاختبارات والمهام التعليمية القادمة.',
    },
    category: {
      en: 'ACTIVITIES',
      ar: 'الأنشطة',
    },
  },
  {
    id: 'certificates',
    number: '04',
    icon: Award,
    path: '/student/certificates',
    title: {
      en: 'Certificates',
      ar: 'الشهادات',
    },
    description: {
      en: 'Explore your certificates and learning achievements.',
      ar: 'استعرض شهاداتك وإنجازاتك خلال رحلتك التعليمية.',
    },
    category: {
      en: 'ACHIEVEMENTS',
      ar: 'الإنجازات',
    },
  },
  {
    id: 'payments',
    number: '05',
    icon: CreditCard,
    path: '/student/payments',
    title: {
      en: 'Payments & Billing',
      ar: 'المدفوعات والفواتير',
    },
    description: {
      en: 'Review transactions, receipts, and available billing details.',
      ar: 'راجع عمليات الدفع والإيصالات وتفاصيل الفواتير المتاحة.',
    },
    category: {
      en: 'BILLING',
      ar: 'الفواتير',
    },
  },
  {
    id: 'settings',
    number: '06',
    icon: Settings2,
    path: '/student/settings',
    title: {
      en: 'Account Settings',
      ar: 'إعدادات الحساب',
    },
    description: {
      en: 'Manage your profile, notifications, and preferences.',
      ar: 'أدر ملفك الشخصي والإشعارات والتفضيلات الخاصة بك.',
    },
    category: {
      en: 'ACCOUNT',
      ar: 'الحساب',
    },
  },
]

const translations = {
  en: {
    eyebrow: 'QUICK NAVIGATION',
    title: 'Useful shortcuts',
    description:
      'Jump directly to the tools and sections you use most throughout your learning journey.',
    explore: 'Open section',
    badge: 'STUDENT WORKSPACE',
    footerTitle: 'Looking for something else?',
    footerDescription:
      'Explore the course catalog and discover more learning opportunities.',
    footerAction: 'Explore courses',
  },

  ar: {
    eyebrow: 'التنقل السريع',
    title: 'روابط قد تحتاجها',
    description:
      'انتقل مباشرة إلى الأدوات والأقسام التي تستخدمها خلال رحلتك التعليمية.',
    explore: 'فتح القسم',
    badge: 'مساحة الطالب',
    footerTitle: 'هل تبحث عن شيء آخر؟',
    footerDescription:
      'استكشف قائمة الدورات واكتشف المزيد من فرص التعلم.',
    footerAction: 'استكشف الدورات',
  },
}

export default function HelpQuickLinks({
  language = 'en',
}) {
  const isArabic = language === 'ar'
  const currentLanguage = isArabic ? 'ar' : 'en'
  const t = translations[currentLanguage]

  const ArrowIcon = isArabic ? ArrowUpLeft : ArrowUpRight

  const localizedPath = (path) =>
    isArabic ? `/ar${path}` : path

  return (
    <section
      className="help-quick-links"
      dir={isArabic ? 'rtl' : 'ltr'}
      lang={currentLanguage}
      aria-labelledby="help-quick-links-title"
    >
      <div className="help-quick-links__container">

        {/* Header */}
        <div className="help-quick-links__header">
          <div className="help-quick-links__heading">
            <span className="help-quick-links__eyebrow">
              <span
                className="help-quick-links__eyebrow-line"
                aria-hidden="true"
              />
              {t.eyebrow}
            </span>

            <h2
              className="help-quick-links__title"
              id="help-quick-links-title"
            >
              {t.title}
            </h2>

            <p className="help-quick-links__description">
              {t.description}
            </p>
          </div>

          <span className="help-quick-links__badge">
            <Compass
              size={15}
              strokeWidth={1.7}
              aria-hidden="true"
            />
            {t.badge}
          </span>
        </div>

        {/* Quick Links Grid */}
        <div className="help-quick-links__grid">
          {QUICK_LINKS.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.id}
                to={localizedPath(item.path)}
                className="help-quick-links__card"
                aria-label={`${t.explore}: ${item.title[currentLanguage]}`}
              >
                <div className="help-quick-links__card-top">
                  <span className="help-quick-links__icon">
                    <Icon
                      size={22}
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                  </span>

                  <span className="help-quick-links__number">
                    {item.number}
                  </span>
                </div>

                <div className="help-quick-links__card-body">
                  <span className="help-quick-links__category">
                    {item.category[currentLanguage]}
                  </span>

                  <h3 className="help-quick-links__card-title">
                    {item.title[currentLanguage]}
                  </h3>

                  <p className="help-quick-links__card-description">
                    {item.description[currentLanguage]}
                  </p>
                </div>

                <div className="help-quick-links__card-footer">
                  <span>{t.explore}</span>

                  <span
                    className="help-quick-links__arrow"
                    aria-hidden="true"
                  >
                    <ArrowIcon
                      size={17}
                      strokeWidth={1.7}
                    />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Explore Courses CTA */}
        <div className="help-quick-links__footer">
          <div className="help-quick-links__footer-content">
            <span className="help-quick-links__footer-icon">
              <BookOpen
                size={23}
                strokeWidth={1.6}
                aria-hidden="true"
              />
            </span>

            <div className="help-quick-links__footer-copy">
              <h3>{t.footerTitle}</h3>
              <p>{t.footerDescription}</p>
            </div>
          </div>

          <Link
            to={localizedPath('/courses')}
            className="help-quick-links__footer-action"
          >
            <span>{t.footerAction}</span>

            <ArrowIcon
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
