
import { useEffect, useMemo, useState } from 'react'
import {
  BellRing,
  BookOpen,
  ClipboardCheck,
  MessagesSquare,
  Users,
  Trophy,
  Mail,
  Smartphone,
  Info,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react'

import '../../../styles/student/settings/notification-settings.css'

const DEFAULT_PREFERENCES = {
  courses: true,
  assignments: true,
  instructors: true,
  community: false,
  achievements: true,
  email: true,
  push: false,
}

const translations = {
  en: {
    eyebrow: 'STAY IN THE LOOP',
    title: 'Notification preferences',
    description:
      'Choose what matters to your learning journey.',
    demoNotice:
      'These preferences are saved on this device only. Email and push delivery require backend integration.',
    learningTitle: 'Learning notifications',
    learningDescription:
      'Control the updates you receive about your courses and progress.',
    deliveryTitle: 'Delivery channels',
    deliveryDescription:
      'Choose how you would like to receive notifications.',
    courses: 'Course updates',
    coursesDesc:
      'New lessons, course materials, and announcements.',
    assignments: 'Assignments & deadlines',
    assignmentsDesc:
      'Upcoming due dates, submissions, and feedback.',
    instructors: 'Instructor messages',
    instructorsDesc:
      'Replies and important messages from instructors.',
    community: 'Community activity',
    communityDesc:
      'Discussion replies, mentions, and community updates.',
    achievements: 'Achievements & rewards',
    achievementsDesc:
      'New badges, milestones, and certificates.',
    email: 'Email notifications',
    emailDesc:
      'Save your preference for receiving updates by email.',
    push: 'Push notifications',
    pushDesc:
      'Save your preference for browser or device notifications.',
    save: 'Save changes',
    discard: 'Discard changes',
    reset: 'Reset defaults',
    saved: 'Notification preferences saved on this device.',
    discarded: 'Unsaved changes discarded.',
    resetDone: 'Default preferences restored. Save to keep them.',
    saveError: 'Unable to save preferences on this device.',
    unavailable:
      'A student identity is required to save preferences.',
    unsaved: 'You have unsaved changes.',
    allSaved: 'All changes saved',
    storageNote:
      'Preferences are local to this browser and do not update your account on other devices.',
  },
  ar: {
    eyebrow: 'ابقَ على اطلاع',
    title: 'تفضيلات الإشعارات',
    description:
      'اختر الإشعارات التي تهمك خلال رحلتك التعليمية.',
    demoNotice:
      'يتم حفظ هذه التفضيلات على هذا الجهاز فقط. يتطلب إرسال البريد الإلكتروني والإشعارات الفورية ربط النظام الخلفي.',
    learningTitle: 'الإشعارات التعليمية',
    learningDescription:
      'تحكم في التحديثات المتعلقة بدوراتك وتقدمك التعليمي.',
    deliveryTitle: 'قنوات الإشعارات',
    deliveryDescription:
      'اختر الطريقة التي تفضل استقبال الإشعارات بها.',
    courses: 'تحديثات الدورات',
    coursesDesc:
      'الدروس الجديدة والمواد التعليمية والإعلانات.',
    assignments: 'الواجبات والمواعيد النهائية',
    assignmentsDesc:
      'مواعيد التسليم القادمة والواجبات والتقييمات.',
    instructors: 'رسائل المدربين',
    instructorsDesc:
      'الردود والرسائل المهمة من المدربين.',
    community: 'نشاط المجتمع',
    communityDesc:
      'الردود والإشارات والتحديثات داخل المجتمع.',
    achievements: 'الإنجازات والمكافآت',
    achievementsDesc:
      'الشارات الجديدة والمراحل المكتملة والشهادات.',
    email: 'إشعارات البريد الإلكتروني',
    emailDesc:
      'حفظ تفضيل استقبال التحديثات عبر البريد الإلكتروني.',
    push: 'الإشعارات الفورية',
    pushDesc:
      'حفظ تفضيل إشعارات المتصفح أو الجهاز.',
    save: 'حفظ التغييرات',
    discard: 'تجاهل التغييرات',
    reset: 'استعادة الافتراضي',
    saved: 'تم حفظ تفضيلات الإشعارات على هذا الجهاز.',
    discarded: 'تم تجاهل التغييرات غير المحفوظة.',
    resetDone:
      'تمت استعادة الإعدادات الافتراضية. احفظ للاحتفاظ بها.',
    saveError: 'تعذر حفظ التفضيلات على هذا الجهاز.',
    unavailable:
      'يلزم توفر هوية الطالب لحفظ التفضيلات.',
    unsaved: 'لديك تغييرات غير محفوظة.',
    allSaved: 'جميع التغييرات محفوظة',
    storageNote:
      'هذه التفضيلات محلية لهذا المتصفح ولا تُحدّث حسابك على الأجهزة الأخرى.',
  },
}

const NOTIFICATION_GROUPS = [
  {
    id: 'learning',
    items: [
      { id: 'courses', icon: BookOpen },
      { id: 'assignments', icon: ClipboardCheck },
      { id: 'instructors', icon: MessagesSquare },
      { id: 'community', icon: Users },
      { id: 'achievements', icon: Trophy },
    ],
  },
  {
    id: 'delivery',
    items: [
      { id: 'email', icon: Mail },
      { id: 'push', icon: Smartphone },
    ],
  },
]

const PREFERENCE_KEYS = Object.keys(DEFAULT_PREFERENCES)

function normalizePreferences(value) {
  const result = { ...DEFAULT_PREFERENCES }

  if (!value || typeof value !== 'object') {
    return result
  }

  for (const key of PREFERENCE_KEYS) {
    if (typeof value[key] === 'boolean') {
      result[key] = value[key]
    }
  }

  return result
}

function areEqual(first, second) {
  return PREFERENCE_KEYS.every(
    (key) => first[key] === second[key]
  )
}

function getStorageKey(student) {
  const id = student?.id

  if (
    typeof id !== 'string' ||
    !/^[a-zA-Z0-9_-]{1,128}$/.test(id)
  ) {
    return null
  }

  return `behar:student:${id}:notification-preferences:v1`
}

function readPreferences(storageKey) {
  if (!storageKey) return { ...DEFAULT_PREFERENCES }

  try {
    const stored = window.localStorage.getItem(storageKey)

    return stored
      ? normalizePreferences(JSON.parse(stored))
      : { ...DEFAULT_PREFERENCES }
  } catch {
    return { ...DEFAULT_PREFERENCES }
  }
}

function PreferenceSwitch({
  id,
  checked,
  onChange,
  label,
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`notification-settings__switch ${
        checked
          ? 'notification-settings__switch--active'
          : ''
      }`}
      onClick={() => onChange(!checked)}
    >
      <span className="notification-settings__switch-thumb" />
    </button>
  )
}

export default function NotificationSettings({
  language = 'en',
  student = null,
  className = '',
}) {
  const currentLanguage = language === 'ar' ? 'ar' : 'en'
  const isArabic = currentLanguage === 'ar'
  const t = translations[currentLanguage]

  const storageKey = useMemo(
    () => getStorageKey(student),
    [student?.id]
  )

  const [preferences, setPreferences] = useState(
    () => readPreferences(storageKey)
  )

  const [savedPreferences, setSavedPreferences] = useState(
    () => readPreferences(storageKey)
  )

  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    const next = readPreferences(storageKey)

    setPreferences(next)
    setSavedPreferences(next)
    setFeedback(null)
  }, [storageKey])

  const isDirty = !areEqual(
    preferences,
    savedPreferences
  )

  const updatePreference = (key, value) => {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }))

    setFeedback(null)
  }

  const handleSave = () => {
    if (!storageKey) {
      setFeedback({
        type: 'error',
        message: t.unavailable,
      })
      return
    }

    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(preferences)
      )

      setSavedPreferences({ ...preferences })

      setFeedback({
        type: 'success',
        message: t.saved,
      })
    } catch {
      setFeedback({
        type: 'error',
        message: t.saveError,
      })
    }
  }

  const handleDiscard = () => {
    setPreferences({ ...savedPreferences })

    setFeedback({
      type: 'info',
      message: t.discarded,
    })
  }

  const handleReset = () => {
    setPreferences({ ...DEFAULT_PREFERENCES })

    setFeedback({
      type: 'info',
      message: t.resetDone,
    })
  }

  return (
    <section
      className={`notification-settings ${className}`.trim()}
      dir={isArabic ? 'rtl' : 'ltr'}
      lang={currentLanguage}
      aria-labelledby="notification-settings-title"
    >
      {/* HEADER */}

      <header className="notification-settings__header">
        <div>
          <span className="notification-settings__eyebrow">
            {t.eyebrow}
          </span>

          <h2 id="notification-settings-title">
            {t.title}
          </h2>

          <p>{t.description}</p>
        </div>

        <span className="notification-settings__header-icon">
          <BellRing size={23} strokeWidth={1.7} />
        </span>
      </header>

      {/* FRONTEND NOTICE */}

      <div className="notification-settings__notice">
        <Info size={18} aria-hidden="true" />
        <p>{t.demoNotice}</p>
      </div>

      {/* PREFERENCE GROUPS */}

      {NOTIFICATION_GROUPS.map((group) => {
        const isLearning = group.id === 'learning'

        return (
          <section
            key={group.id}
            className="notification-settings__group"
            aria-labelledby={`notification-group-${group.id}`}
          >
            <div className="notification-settings__group-heading">
              <div>
                <h3 id={`notification-group-${group.id}`}>
                  {isLearning
                    ? t.learningTitle
                    : t.deliveryTitle}
                </h3>

                <p>
                  {isLearning
                    ? t.learningDescription
                    : t.deliveryDescription}
                </p>
              </div>
            </div>

            <div className="notification-settings__items">
              {group.items.map((item) => {
                const Icon = item.icon
                const switchId = `notification-${item.id}`

                return (
                  <div
                    key={item.id}
                    className="notification-settings__item"
                  >
                    <span className="notification-settings__item-icon">
                      <Icon
                        size={19}
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                    </span>

                    <div className="notification-settings__item-copy">
                      <h4>{t[item.id]}</h4>
                      <p>{t[`${item.id}Desc`]}</p>
                    </div>

                    <PreferenceSwitch
                      id={switchId}
                      checked={preferences[item.id]}
                      onChange={(value) =>
                        updatePreference(item.id, value)
                      }
                      label={t[item.id]}
                    />
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}

      {/* RESET */}

      <button
        type="button"
        className="notification-settings__reset"
        onClick={handleReset}
      >
        <RotateCcw size={15} aria-hidden="true" />
        {t.reset}
      </button>

      {/* FEEDBACK */}

      {feedback && (
        <div
          className={`notification-settings__feedback notification-settings__feedback--${feedback.type}`}
          role={
            feedback.type === 'error'
              ? 'alert'
              : 'status'
          }
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 size={17} aria-hidden="true" />
          ) : feedback.type === 'error' ? (
            <AlertCircle size={17} aria-hidden="true" />
          ) : (
            <Info size={17} aria-hidden="true" />
          )}

          <span>{feedback.message}</span>
        </div>
      )}

      {/* SAVE BAR */}

      <div className="notification-settings__save-bar">
        <div className="notification-settings__save-status">
          {isDirty ? (
            <span className="notification-settings__unsaved-dot" />
          ) : (
            <CheckCircle2 size={16} aria-hidden="true" />
          )}

          <span>
            {isDirty ? t.unsaved : t.allSaved}
          </span>
        </div>

        <div className="notification-settings__actions">
          <button
            type="button"
            className="notification-settings__discard"
            onClick={handleDiscard}
            disabled={!isDirty}
          >
            {t.discard}
          </button>

          <button
            type="button"
            className="notification-settings__save"
            onClick={handleSave}
            disabled={!isDirty || !storageKey}
          >
            <Save size={16} aria-hidden="true" />
            {t.save}
          </button>
        </div>
      </div>

      <p className="notification-settings__storage-note">
        <Info size={14} aria-hidden="true" />
        {t.storageNote}
      </p>
    </section>
  )
}
