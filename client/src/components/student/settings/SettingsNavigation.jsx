
import { useLocation } from 'react-router-dom'
import {
  UserRound,
  ShieldCheck,
  Bell,
  BookOpen,
  Palette,
  Settings2,
  LifeBuoy,
  ChevronRight,
} from 'lucide-react'

import '../../../styles/student/settings/settings-navigation.css'

export const SETTINGS_SECTIONS = [
  {
    id: 'profile',
    icon: UserRound,
    label: {
      en: 'My Profile',
      ar: 'الملف الشخصي',
    },
    description: {
      en: 'Personal information',
      ar: 'المعلومات الشخصية',
    },
  },
  {
    id: 'security',
    icon: ShieldCheck,
    label: {
      en: 'Security',
      ar: 'الأمان',
    },
    description: {
      en: 'Password and protection',
      ar: 'كلمة المرور والحماية',
    },
  },
  {
    id: 'notifications',
    icon: Bell,
    label: {
      en: 'Notifications',
      ar: 'الإشعارات',
    },
    description: {
      en: 'Manage your alerts',
      ar: 'إدارة التنبيهات',
    },
  },
  {
    id: 'learning',
    icon: BookOpen,
    label: {
      en: 'Learning Preferences',
      ar: 'تفضيلات التعلم',
    },
    description: {
      en: 'Personalize your learning',
      ar: 'تخصيص تجربة التعلم',
    },
  },
  {
    id: 'appearance',
    icon: Palette,
    label: {
      en: 'Language & Appearance',
      ar: 'اللغة والمظهر',
    },
    description: {
      en: 'Language and display',
      ar: 'اللغة وإعدادات العرض',
    },
  },
  {
    id: 'account',
    icon: Settings2,
    label: {
      en: 'Account',
      ar: 'الحساب',
    },
    description: {
      en: 'Account management',
      ar: 'إدارة الحساب',
    },
  },
  {
    id: 'support',
    icon: LifeBuoy,
    label: {
      en: 'Help & Support',
      ar: 'المساعدة والدعم',
    },
    description: {
      en: 'Find help and answers',
      ar: 'المساعدة والإجابات',
    },
  },
]

export default function SettingsNavigation({
  activeSection = 'profile',
  onSectionChange,
  language,
  className = '',
}) {
  const { pathname } = useLocation()

  const currentLanguage =
    language === 'ar' || language === 'en'
      ? language
      : pathname.split('/')[1] === 'ar'
        ? 'ar'
        : 'en'

  const isArabic = currentLanguage === 'ar'

  const text = {
    en: {
      title: 'SETTINGS MENU',
      description: 'Choose a section to manage',
      mobileLabel: 'Settings section',
    },
    ar: {
      title: 'قائمة الإعدادات',
      description: 'اختر القسم الذي تريد إدارته',
      mobileLabel: 'قسم الإعدادات',
    },
  }[currentLanguage]

  const handleChange = (sectionId) => {
    if (sectionId === activeSection) return

    onSectionChange?.(sectionId)
  }

  return (
    <nav
      className={`settings-navigation ${className}`.trim()}
      aria-label={text.mobileLabel}
      dir={isArabic ? 'rtl' : 'ltr'}
      lang={currentLanguage}
    >
      <div className="settings-navigation__heading">
        <span className="settings-navigation__eyebrow">
          {text.title}
        </span>

        <p className="settings-navigation__description">
          {text.description}
        </p>
      </div>

      <div className="settings-navigation__list">
        {SETTINGS_SECTIONS.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id

          return (
            <button
              key={section.id}
              type="button"
              className={[
                'settings-navigation__item',
                isActive
                  ? 'settings-navigation__item--active'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleChange(section.id)}
              aria-current={isActive ? 'true' : undefined}
            >
              <span className="settings-navigation__item-icon">
                <Icon
                  size={19}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>

              <span className="settings-navigation__item-content">
                <span className="settings-navigation__item-label">
                  {section.label[currentLanguage]}
                </span>

                <span className="settings-navigation__item-description">
                  {section.description[currentLanguage]}
                </span>
              </span>

              <ChevronRight
                size={16}
                strokeWidth={1.8}
                className="settings-navigation__item-arrow"
                aria-hidden="true"
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
