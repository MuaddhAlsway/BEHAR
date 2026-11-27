
import { Settings2, ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { useLocation } from 'react-router-dom'

import '../../../styles/student/settings/settings-header.css'

const copy = {
  en: {
    title: 'Your settings',
    description:
      'A space to make BEHAR yours. Manage your profile, learning preferences, notifications, and account experience.',
    eyebrow: 'STUDENT WORKSPACE / ACCOUNT',
    badge: 'Account settings',
    footer: 'Personalize your learning journey',
  },
  ar: {
    title: 'إعداداتك',
    description:
      'مساحتك الخاصة لتخصيص تجربتك في بحار. يمكنك إدارة ملفك الشخصي وتفضيلات التعلم والإشعارات وتجربة حسابك.',
    eyebrow: 'مساحة الطالب / الحساب',
    badge: 'إعدادات الحساب',
    footer: 'خصّص رحلتك التعليمية',
  },
}

export default function SettingsHeader({
  title,
  description,
  eyebrow,
  badge,
  footer,
  showBadge = true,
  className = '',
}) {
  const { pathname } = useLocation()
  const language = pathname.split('/')[1] === 'ar' ? 'ar' : 'en'
  const t = copy[language]

  return (
    <header
      className={`settings-header ${className}`.trim()}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      lang={language}
    >
      <div className="settings-header__top">
        <div className="settings-header__eyebrow">
          <span className="settings-header__eyebrow-icon">
            <Settings2 size={18} strokeWidth={1.8} />
          </span>

         <span>{eyebrow ?? t.eyebrow}</span>
        </div>

        {showBadge && (
          <div className="settings-header__badge">
            <ShieldCheck size={15} strokeWidth={1.8} />
           <span>{badge ?? t.badge}</span>
          </div>
        )}
      </div>

      <div className="settings-header__content">
        <h1 className="settings-header__title">
         {title ?? t.title}
          <span className="settings-header__title-dot" aria-hidden="true">
            .
          </span>
        </h1>

        <p className="settings-header__description">
         {description ?? t.description}
        </p>
      </div>

      <div className="settings-header__footer">
        <SlidersHorizontal size={16} strokeWidth={1.8} />
       <span>{footer ?? t.footer}</span>
      </div>
    </header>
  )
}
