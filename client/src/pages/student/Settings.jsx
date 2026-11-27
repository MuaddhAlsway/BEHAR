
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import SettingsHeader from '../../components/student/settings/SettingsHeader'

import SettingsNavigation, {
  SETTINGS_SECTIONS,
} from '../../components/student/settings/SettingsNavigation'

// P14.17.03 — Profile Settings
import ProfileSettings from '../../components/student/settings/ProfileSettings'

// P14.17.04 — Security Settings
import SecuritySettings from '../../components/student/settings/SecuritySettings'

// P14.17.05 — Notification Settings
import NotificationSettings from '../../components/student/settings/NotificationSettings'

// P14.17.06 — Learning Preferences
import LearningPreferences from '../../components/student/settings/LearningPreferences'

// P14.17.07 — Appearance Settings
import AppearanceSettings from '../../components/student/settings/AppearanceSettings'

// P14.17.08 — Account Settings
import AccountSettings from '../../components/student/settings/AccountSettings'

// P14.17.09 — Settings Support
import SettingsSupport from '../../components/student/settings/SettingsSupport'

// P14.17.04 — Demo security data
import { securityDummyData } from '../../data/student/securityDummyData'

import '../../styles/student/settings.css'

const DEMO_STUDENT = {
  id: 'dev-student-001',
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile')
  const { pathname } = useLocation()

  // Detect language from the existing BEHAR route.
  const language =
    pathname.split('/')[1] === 'ar' ? 'ar' : 'en'

  const activeItem =
    SETTINGS_SECTIONS.find(
      (section) => section.id === activeSection
    ) || SETTINGS_SECTIONS[0]

  const ActiveIcon = activeItem.icon

  const renderActiveSection = () => {
    switch (activeSection) {
      // P14.17.03 — Profile Settings
      case 'profile':
        return (
          <ProfileSettings
            language={language}
            student={DEMO_STUDENT}
          />
        )

      // P14.17.04 — Security Settings
      case 'security':
        return (
          <SecuritySettings
            language={language}
            securityData={securityDummyData}
          />
        )

      // P14.17.05 — Notification Settings
      case 'notifications':
        return (
          <NotificationSettings
            language={language}
            student={DEMO_STUDENT}
          />
        )

      // P14.17.06 — Learning Preferences
      case 'learning':
        return (
          <LearningPreferences
            language={language}
            student={DEMO_STUDENT}
          />
        )

      // P14.17.07 — Appearance Settings
      case 'appearance':
        return (
          <AppearanceSettings
            language={language}
            student={DEMO_STUDENT}
          />
        )

      // P14.17.08 — Account Settings
      case 'account':
        return (
          <AccountSettings
            language={language}
            student={DEMO_STUDENT}
          />
        )

      // P14.17.09 — Settings Support
      case 'support':
        return (
          <SettingsSupport
            language={language}
            student={DEMO_STUDENT}
          />
        )

      default:
        return (
          <div className="student-settings-page__placeholder">
            <span className="student-settings-page__placeholder-icon">
              <ActiveIcon
                size={24}
                strokeWidth={1.6}
                aria-hidden="true"
              />
            </span>

            <h2>{activeItem.label[language]}</h2>

            <p>
              {language === 'ar'
                ? 'سيتم عرض إعدادات هذا القسم هنا.'
                : 'Settings for this section will appear here.'}
            </p>
          </div>
        )
    }
  }

  return (
    <div
      className="student-settings-page"
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      lang={language}
    >
      {/* P14.17.01 — Settings Header */}
      <SettingsHeader />

      <div className="student-settings-page__layout">
        {/* P14.17.02 — Settings Navigation */}
        <SettingsNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          language={language}
        />

        {/* Settings Content */}
        <section
          className="student-settings-page__content"
          id="student-settings-content"
          aria-live="polite"
          aria-label={
            language === 'ar'
              ? 'محتوى الإعدادات'
              : 'Settings content'
          }
        >
          {renderActiveSection()}
        </section>
      </div>
    </div>
  )
}
