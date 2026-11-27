
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Languages,
  LayoutGrid,
  Accessibility,
  MoveHorizontal,
  Type,
  Contrast,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  Info,
  GraduationCap,
} from 'lucide-react'

import '../../../styles/student/settings/appearance-settings.css'

export const DEFAULT_APPEARANCE = {
  theme: 'light',
  interfaceLanguage: 'en',
  density: 'default',
  reducedMotion: false,
  largerText: false,
  highContrast: false,
}

const VALID_THEMES = ['light', 'dark', 'system']
const VALID_DENSITIES = ['comfortable', 'default', 'compact']

const translations = {
  en: {
    eyebrow: 'MAKE IT YOURS',
    title: 'Appearance & accessibility',
    description:
      'Personalize how BEHAR looks and feels while you learn.',
    notice:
      'Your choices are saved locally. Global appearance changes require the application-level integration.',
    themeTitle: 'Color theme',
    themeDesc: 'Choose your preferred visual environment.',
    light: 'Light',
    lightDesc: 'Clean and bright',
    dark: 'Dark',
    darkDesc: 'Soft on the eyes',
    system: 'System',
    systemDesc: 'Follow your device',
    languageTitle: 'Interface language',
    languageDesc: 'Choose the language used throughout BEHAR.',
    english: 'English',
    arabic: 'العربية',
    densityTitle: 'Display density',
    densityDesc: 'Adjust the spacing between interface elements.',
    comfortable: 'Comfortable',
    comfortableDesc: 'More breathing room',
    default: 'Default',
    defaultDesc: 'Balanced spacing',
    compact: 'Compact',
    compactDesc: 'More content at once',
    accessibilityTitle: 'Accessibility preferences',
    accessibilityDesc:
      'Make the interface easier and more comfortable to use.',
    reducedMotion: 'Reduce motion',
    reducedMotionDesc:
      'Minimize decorative animations and transitions.',
    largerText: 'Larger interface text',
    largerTextDesc:
      'Increase the size of text across the interface.',
    highContrast: 'Enhanced contrast',
    highContrastDesc:
      'Increase contrast for improved readability.',
    previewTitle: 'Live preview',
    previewDesc: 'A quick look at your selected appearance.',
    previewEyebrow: 'YOUR LEARNING SPACE',
    previewHeading: 'Learn at your own pace.',
    previewBody:
      'Your next lesson is waiting. Keep building your knowledge.',
    previewButton: 'Continue learning',
    previewCourse: 'Modern React Development',
    reset: 'Reset defaults',
    discard: 'Discard changes',
    save: 'Save changes',
    unsaved: 'You have unsaved changes',
    allSaved: 'All changes saved',
    saved: 'Appearance preferences saved.',
    discarded: 'Unsaved changes discarded.',
    resetDone: 'Defaults restored. Save to keep them.',
    saveError: 'Unable to save appearance preferences.',
    noIdentity: 'A student identity is required to save.',
    storageNote:
      'These preferences are stored in this browser. They do not sync between devices.',
  },
  ar: {
    eyebrow: 'اجعلها تناسبك',
    title: 'المظهر وإمكانية الوصول',
    description:
      'خصص شكل منصة بحار وتجربتها بما يناسب أسلوب تعلمك.',
    notice:
      'تُحفظ اختياراتك محليًا. يتطلب تطبيقها على جميع صفحات المنصة ربطًا على مستوى التطبيق.',
    themeTitle: 'المظهر العام',
    themeDesc: 'اختر البيئة البصرية المفضلة لديك.',
    light: 'فاتح',
    lightDesc: 'واضح ومشرق',
    dark: 'داكن',
    darkDesc: 'مريح للعين',
    system: 'حسب الجهاز',
    systemDesc: 'يتبع إعدادات جهازك',
    languageTitle: 'لغة الواجهة',
    languageDesc: 'اختر اللغة المستخدمة في منصة بحار.',
    english: 'English',
    arabic: 'العربية',
    densityTitle: 'كثافة العرض',
    densityDesc: 'اضبط المسافات بين عناصر الواجهة.',
    comfortable: 'مريح',
    comfortableDesc: 'مساحات أكبر',
    default: 'افتراضي',
    defaultDesc: 'مسافات متوازنة',
    compact: 'مضغوط',
    compactDesc: 'محتوى أكثر',
    accessibilityTitle: 'إعدادات إمكانية الوصول',
    accessibilityDesc:
      'اجعل استخدام المنصة أكثر راحة وسهولة.',
    reducedMotion: 'تقليل الحركة',
    reducedMotionDesc:
      'تقليل الحركات والانتقالات البصرية غير الضرورية.',
    largerText: 'تكبير النصوص',
    largerTextDesc:
      'زيادة حجم النصوص في الواجهة.',
    highContrast: 'تحسين التباين',
    highContrastDesc:
      'زيادة التباين لتحسين وضوح القراءة.',
    previewTitle: 'معاينة مباشرة',
    previewDesc: 'شاهد تأثير اختياراتك على الواجهة.',
    previewEyebrow: 'مساحتك التعليمية',
    previewHeading: 'تعلم بالسرعة التي تناسبك.',
    previewBody:
      'درسك القادم بانتظارك. واصل تطوير معرفتك.',
    previewButton: 'متابعة التعلم',
    previewCourse: 'تطوير React الحديث',
    reset: 'استعادة الافتراضي',
    discard: 'تجاهل التغييرات',
    save: 'حفظ التغييرات',
    unsaved: 'لديك تغييرات غير محفوظة',
    allSaved: 'جميع التغييرات محفوظة',
    saved: 'تم حفظ تفضيلات المظهر.',
    discarded: 'تم تجاهل التغييرات غير المحفوظة.',
    resetDone:
      'تمت استعادة الإعدادات الافتراضية. احفظ للاحتفاظ بها.',
    saveError: 'تعذر حفظ تفضيلات المظهر.',
    noIdentity: 'يلزم توفر هوية الطالب للحفظ.',
    storageNote:
      'تُحفظ هذه التفضيلات في هذا المتصفح ولا تتم مزامنتها بين الأجهزة.',
  },
}

export function normalizeAppearance(value, fallbackLanguage = 'en') {
  const defaults = {
    ...DEFAULT_APPEARANCE,
    interfaceLanguage: fallbackLanguage === 'ar' ? 'ar' : 'en',
  }

  if (!value || typeof value !== 'object') return defaults

  return {
    theme: VALID_THEMES.includes(value.theme)
      ? value.theme
      : defaults.theme,
    interfaceLanguage: ['en', 'ar'].includes(value.interfaceLanguage)
      ? value.interfaceLanguage
      : defaults.interfaceLanguage,
    density: VALID_DENSITIES.includes(value.density)
      ? value.density
      : defaults.density,
    reducedMotion:
      typeof value.reducedMotion === 'boolean'
        ? value.reducedMotion
        : defaults.reducedMotion,
    largerText:
      typeof value.largerText === 'boolean'
        ? value.largerText
        : defaults.largerText,
    highContrast:
      typeof value.highContrast === 'boolean'
        ? value.highContrast
        : defaults.highContrast,
  }
}

export function getAppearanceStorageKey(student) {
  const id = student?.id

  if (
    typeof id !== 'string' ||
    !/^[a-zA-Z0-9_-]{1,128}$/.test(id)
  ) {
    return null
  }

  return `behar:student:${id}:appearance:v1`
}

export function readAppearance(key, language = 'en') {
  if (!key || typeof window === 'undefined') {
    return normalizeAppearance(null, language)
  }

  try {
    const raw = window.localStorage.getItem(key)

    return raw
      ? normalizeAppearance(JSON.parse(raw), language)
      : normalizeAppearance(null, language)
  } catch {
    return normalizeAppearance(null, language)
  }
}

function areEqual(a, b) {
  return Object.keys(DEFAULT_APPEARANCE).every(
    (key) => a[key] === b[key]
  )
}

function AppearanceSwitch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`appearance-settings__switch ${
        checked ? 'is-on' : ''
      }`}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  )
}

function OptionCard({
  icon: Icon,
  title,
  description,
  selected,
  onClick,
  name,
  value,
}) {
  return (
    <label
      className={`appearance-settings__option ${
        selected ? 'is-selected' : ''
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={onClick}
      />

      <span className="appearance-settings__option-icon">
        <Icon size={20} strokeWidth={1.7} />
      </span>

      <strong>{title}</strong>
      <small>{description}</small>

      <span className="appearance-settings__option-check">
        {selected && <CheckCircle2 size={15} />}
      </span>
    </label>
  )
}

function SettingRow({ icon: Icon, title, description, children }) {
  return (
    <div className="appearance-settings__row">
      <span className="appearance-settings__row-icon">
        <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
      </span>

      <div className="appearance-settings__row-copy">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>

      <div className="appearance-settings__row-control">
        {children}
      </div>
    </div>
  )
}

export default function AppearanceSettings({
  language = 'en',
  student = null,
  className = '',
}) {
  const lang = language === 'ar' ? 'ar' : 'en'
  const t = translations[lang]

  const location = useLocation()
  const navigate = useNavigate()

  const storageKey = useMemo(
    () => getAppearanceStorageKey(student),
    [student?.id]
  )

  const [preferences, setPreferences] = useState(
    () => readAppearance(storageKey, lang)
  )

  const [savedPreferences, setSavedPreferences] = useState(
    () => readAppearance(storageKey, lang)
  )

  const [feedback, setFeedback] = useState(null)

  const [systemDark, setSystemDark] = useState(() =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  )

  useEffect(() => {
    const loaded = readAppearance(storageKey, lang)

    setPreferences(loaded)
    setSavedPreferences(loaded)
    setFeedback(null)
  }, [storageKey])

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event) => setSystemDark(event.matches)

    setSystemDark(media.matches)
    media.addEventListener('change', onChange)

    return () => media.removeEventListener('change', onChange)
  }, [])

  const isDirty = !areEqual(preferences, savedPreferences)

  const previewTheme =
    preferences.theme === 'system'
      ? systemDark
        ? 'dark'
        : 'light'
      : preferences.theme

  const update = (key, value) => {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }))
    setFeedback(null)
  }

  const handleSave = () => {
    if (!storageKey) {
      setFeedback({ type: 'error', key: 'noIdentity' })
      return
    }

    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(preferences)
      )

      setSavedPreferences({ ...preferences })
      setFeedback({ type: 'success', key: 'saved' })

      // Keep BEHAR's existing route-based localization.
      if (preferences.interfaceLanguage !== lang) {
        const segments = location.pathname.split('/')

        if (segments[1] === 'en' || segments[1] === 'ar') {
          segments[1] = preferences.interfaceLanguage

          navigate(
            {
              pathname: segments.join('/'),
              search: location.search,
              hash: location.hash,
            },
            { replace: true }
          )
        }
      }

      // Notify a future global appearance provider.
      window.dispatchEvent(
        new CustomEvent('behar:appearance-changed', {
          detail: {
            studentId: student.id,
            preferences: { ...preferences },
          },
        })
      )
    } catch {
      setFeedback({ type: 'error', key: 'saveError' })
    }
  }

  const handleDiscard = () => {
    setPreferences({ ...savedPreferences })
    setFeedback({ type: 'info', key: 'discarded' })
  }

  const handleReset = () => {
    setPreferences(
      normalizeAppearance(null, lang)
    )
    setFeedback({ type: 'info', key: 'resetDone' })
  }

  return (
    <section
      className={`appearance-settings ${className}`.trim()}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      lang={lang}
      aria-labelledby="appearance-settings-title"
    >
      {/* HEADER */}

      <header className="appearance-settings__header">
        <div>
          <span className="appearance-settings__eyebrow">
            {t.eyebrow}
          </span>
          <h2 id="appearance-settings-title">{t.title}</h2>
          <p>{t.description}</p>
        </div>

        <span className="appearance-settings__header-icon">
          <Palette size={23} strokeWidth={1.7} />
        </span>
      </header>

      <div className="appearance-settings__notice">
        <Info size={18} aria-hidden="true" />
        <p>{t.notice}</p>
      </div>

      {/* THEME */}

      <section className="appearance-settings__section">
        <div className="appearance-settings__section-heading">
          <h3>{t.themeTitle}</h3>
          <p>{t.themeDesc}</p>
        </div>

        <div className="appearance-settings__options">
          <OptionCard
            icon={Sun}
            title={t.light}
            description={t.lightDesc}
            selected={preferences.theme === 'light'}
            onClick={() => update('theme', 'light')}
            name="appearance-theme"
            value="light"
          />

          <OptionCard
            icon={Moon}
            title={t.dark}
            description={t.darkDesc}
            selected={preferences.theme === 'dark'}
            onClick={() => update('theme', 'dark')}
            name="appearance-theme"
            value="dark"
          />

          <OptionCard
            icon={Monitor}
            title={t.system}
            description={t.systemDesc}
            selected={preferences.theme === 'system'}
            onClick={() => update('theme', 'system')}
            name="appearance-theme"
            value="system"
          />
        </div>
      </section>

      {/* LANGUAGE */}

      <section className="appearance-settings__section">
        <div className="appearance-settings__section-heading">
          <h3>{t.languageTitle}</h3>
          <p>{t.languageDesc}</p>
        </div>

        <div className="appearance-settings__panel">
          <SettingRow
            icon={Languages}
            title={t.languageTitle}
            description={t.languageDesc}
          >
            <select
              aria-label={t.languageTitle}
              value={preferences.interfaceLanguage}
              onChange={(event) =>
                update('interfaceLanguage', event.target.value)
              }
            >
              <option value="en">{t.english}</option>
              <option value="ar">{t.arabic}</option>
            </select>
          </SettingRow>
        </div>
      </section>

      {/* DENSITY */}

      <section className="appearance-settings__section">
        <div className="appearance-settings__section-heading">
          <h3>{t.densityTitle}</h3>
          <p>{t.densityDesc}</p>
        </div>

        <div className="appearance-settings__options">
          {[
            {
              value: 'comfortable',
              title: t.comfortable,
              description: t.comfortableDesc,
            },
            {
              value: 'default',
              title: t.default,
              description: t.defaultDesc,
            },
            {
              value: 'compact',
              title: t.compact,
              description: t.compactDesc,
            },
          ].map((option) => (
            <OptionCard
              key={option.value}
              icon={LayoutGrid}
              title={option.title}
              description={option.description}
              selected={preferences.density === option.value}
              onClick={() => update('density', option.value)}
              name="appearance-density"
              value={option.value}
            />
          ))}
        </div>
      </section>

      {/* ACCESSIBILITY */}

      <section className="appearance-settings__section">
        <div className="appearance-settings__section-heading">
          <h3>{t.accessibilityTitle}</h3>
          <p>{t.accessibilityDesc}</p>
        </div>

        <div className="appearance-settings__panel">
          <SettingRow
            icon={MoveHorizontal}
            title={t.reducedMotion}
            description={t.reducedMotionDesc}
          >
            <AppearanceSwitch
              checked={preferences.reducedMotion}
              onChange={(value) => update('reducedMotion', value)}
              label={t.reducedMotion}
            />
          </SettingRow>

          <SettingRow
            icon={Type}
            title={t.largerText}
            description={t.largerTextDesc}
          >
            <AppearanceSwitch
              checked={preferences.largerText}
              onChange={(value) => update('largerText', value)}
              label={t.largerText}
            />
          </SettingRow>

          <SettingRow
            icon={Contrast}
            title={t.highContrast}
            description={t.highContrastDesc}
          >
            <AppearanceSwitch
              checked={preferences.highContrast}
              onChange={(value) => update('highContrast', value)}
              label={t.highContrast}
            />
          </SettingRow>
        </div>
      </section>

      {/* LIVE PREVIEW */}

      <section className="appearance-settings__section">
        <div className="appearance-settings__section-heading">
          <h3>{t.previewTitle}</h3>
          <p>{t.previewDesc}</p>
        </div>

        <div
          className={`appearance-settings__preview appearance-settings__preview--${previewTheme} appearance-settings__preview--${preferences.density} ${
            preferences.largerText ? 'is-large-text' : ''
          } ${
            preferences.highContrast ? 'is-high-contrast' : ''
          } ${
            preferences.reducedMotion ? 'is-reduced-motion' : ''
          }`}
        >
          <div className="appearance-settings__preview-top">
            <span className="appearance-settings__preview-logo">
              BEHAR
            </span>
            <span className="appearance-settings__preview-dot" />
          </div>

          <div className="appearance-settings__preview-body">
            <span className="appearance-settings__preview-eyebrow">
              {t.previewEyebrow}
            </span>

            <h4>{t.previewHeading}</h4>
            <p>{t.previewBody}</p>

            <div className="appearance-settings__preview-course">
              <span className="appearance-settings__preview-course-icon">
                <GraduationCap size={18} />
              </span>
              <span>{t.previewCourse}</span>
            </div>

            <span className="appearance-settings__preview-button">
              {t.previewButton}
            </span>
          </div>
        </div>
      </section>

      {/* ACTIONS */}

      <button
        type="button"
        className="appearance-settings__reset"
        onClick={handleReset}
      >
        <RotateCcw size={15} aria-hidden="true" />
        {t.reset}
      </button>

      {feedback && (
        <div
          className={`appearance-settings__feedback appearance-settings__feedback--${feedback.type}`}
          role={feedback.type === 'error' ? 'alert' : 'status'}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 size={17} />
          ) : feedback.type === 'error' ? (
            <AlertCircle size={17} />
          ) : (
            <Info size={17} />
          )}
          <span>{t[feedback.key]}</span>
        </div>
      )}

      <div className="appearance-settings__save-bar">
        <div className="appearance-settings__save-status">
          {isDirty ? (
            <span className="appearance-settings__unsaved-dot" />
          ) : (
            <CheckCircle2 size={16} />
          )}
          <span>{isDirty ? t.unsaved : t.allSaved}</span>
        </div>

        <div className="appearance-settings__actions">
          <button
            type="button"
            className="appearance-settings__discard"
            onClick={handleDiscard}
            disabled={!isDirty}
          >
            {t.discard}
          </button>

          <button
            type="button"
            className="appearance-settings__save"
            onClick={handleSave}
            disabled={!isDirty || !storageKey}
          >
            <Save size={16} />
            {t.save}
          </button>
        </div>
      </div>

      <p className="appearance-settings__storage-note">
        <Info size={14} aria-hidden="true" />
        {t.storageNote}
      </p>
    </section>
  )
}
