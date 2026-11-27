
import { useEffect, useMemo, useState } from 'react'
import {
  GraduationCap,
  Languages,
  Gauge,
  PlayCircle,
  Captions,
  Target,
  Clock3,
  CalendarDays,
  Focus,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react'

import '../../../styles/student/settings/learning-preferences.css'

const DEFAULT_PREFERENCES = {
  courseLanguage: 'both',
  playbackSpeed: '1',
  autoplay: false,
  captions: true,
  captionLanguage: 'auto',
  dailyGoal: 30,
  studyTime: 'evening',
  studyDays: ['sun', 'mon', 'tue', 'wed', 'thu'],
  focusMode: false,
}

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const SPEEDS = ['0.75', '1', '1.25', '1.5', '1.75', '2']
const GOALS = [15, 30, 45, 60, 90]

const translations = {
  en: {
    eyebrow: 'PERSONALIZE YOUR JOURNEY',
    title: 'Learning preferences',
    description:
      'Shape your learning experience around your goals, pace, and routine.',
    notice:
      'These preferences are stored on this device. Connecting them to the course player, recommendations, and reminders requires further integration.',
    content: 'Course experience',
    contentDesc:
      'Choose how you prefer to discover and watch lessons.',
    courseLanguage: 'Preferred course language',
    courseLanguageDesc:
      'Your preferred language for course discovery.',
    english: 'English',
    arabic: 'Arabic',
    both: 'Both languages',
    playbackSpeed: 'Default playback speed',
    playbackSpeedDesc:
      'Your preferred starting speed for video lessons.',
    autoplay: 'Autoplay next lesson',
    autoplayDesc:
      'Automatically continue to the next lesson when available.',
    captions: 'Enable captions',
    captionsDesc:
      'Show subtitles when supported by the lesson.',
    captionLanguage: 'Caption language',
    captionLanguageDesc:
      'Preferred subtitle language when available.',
    automatic: 'Automatic',
    goals: 'Learning goals',
    goalsDesc:
      'Create a realistic routine that fits your schedule.',
    dailyGoal: 'Daily learning target',
    dailyGoalDesc:
      'How much time would you like to study each day?',
    minutes: 'min',
    minutesPerDay: 'minutes per day',
    studyTime: 'Preferred study time',
    studyTimeDesc:
      'When do you usually feel ready to learn?',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    flexible: 'Flexible',
    studyDays: 'Study days',
    studyDaysDesc:
      'Select the days you plan to dedicate to learning.',
    sun: 'Sun',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    focus: 'Study environment',
    focusDesc:
      'Configure preferences for a distraction-free experience.',
    focusMode: 'Focus mode',
    focusModeDesc:
      'Prefer a simplified lesson player with fewer distractions.',
    reset: 'Reset defaults',
    save: 'Save changes',
    discard: 'Discard changes',
    unsaved: 'You have unsaved changes',
    savedStatus: 'All changes saved',
    saved: 'Learning preferences saved on this device.',
    discarded: 'Unsaved changes discarded.',
    resetDone: 'Defaults restored. Save to keep them.',
    saveError: 'Unable to save preferences on this device.',
    noIdentity: 'A student identity is required to save preferences.',
    storageNote:
      'Saved preferences are specific to this browser and demo student. They do not yet control real course playback or notifications.',
  },
  ar: {
    eyebrow: 'خصص رحلتك التعليمية',
    title: 'تفضيلات التعلم',
    description:
      'خصص تجربتك التعليمية وفق أهدافك وسرعتك وروتينك اليومي.',
    notice:
      'تُحفظ هذه التفضيلات على هذا الجهاز. يتطلب تطبيقها على مشغل الدروس والتوصيات والتذكيرات ربطًا إضافيًا.',
    content: 'تجربة الدورات',
    contentDesc:
      'اختر الطريقة التي تفضل بها اكتشاف الدروس ومشاهدتها.',
    courseLanguage: 'لغة الدورات المفضلة',
    courseLanguageDesc:
      'اللغة المفضلة لديك عند استكشاف الدورات.',
    english: 'الإنجليزية',
    arabic: 'العربية',
    both: 'كلتا اللغتين',
    playbackSpeed: 'سرعة تشغيل الفيديو',
    playbackSpeedDesc:
      'سرعة التشغيل الافتراضية المفضلة للدروس.',
    autoplay: 'تشغيل الدرس التالي تلقائيًا',
    autoplayDesc:
      'الانتقال تلقائيًا إلى الدرس التالي عند توفره.',
    captions: 'تفعيل الترجمة النصية',
    captionsDesc:
      'إظهار الترجمة النصية عندما يدعمها الدرس.',
    captionLanguage: 'لغة الترجمة النصية',
    captionLanguageDesc:
      'لغة الترجمة المفضلة عند توفرها.',
    automatic: 'تلقائي',
    goals: 'أهداف التعلم',
    goalsDesc:
      'أنشئ روتينًا تعليميًا واقعيًا يناسب جدولك.',
    dailyGoal: 'الهدف التعليمي اليومي',
    dailyGoalDesc:
      'كم دقيقة ترغب في تخصيصها للتعلم يوميًا؟',
    minutes: 'دقيقة',
    minutesPerDay: 'دقيقة يوميًا',
    studyTime: 'وقت الدراسة المفضل',
    studyTimeDesc:
      'متى تفضل تخصيص وقتك للتعلم؟',
    morning: 'الصباح',
    afternoon: 'بعد الظهر',
    evening: 'المساء',
    flexible: 'وقت مرن',
    studyDays: 'أيام الدراسة',
    studyDaysDesc:
      'اختر الأيام التي تخطط لتخصيصها للتعلم.',
    focus: 'بيئة الدراسة',
    focusDesc:
      'اضبط تفضيلاتك للحصول على تجربة أقل تشتيتًا.',
    focusMode: 'وضع التركيز',
    focusModeDesc:
      'تفضيل واجهة مبسطة لمشغل الدروس مع تقليل المشتتات.',
    reset: 'استعادة الافتراضي',
    save: 'حفظ التغييرات',
    discard: 'تجاهل التغييرات',
    unsaved: 'لديك تغييرات غير محفوظة',
    savedStatus: 'جميع التغييرات محفوظة',
    saved: 'تم حفظ تفضيلات التعلم على هذا الجهاز.',
    discarded: 'تم تجاهل التغييرات غير المحفوظة.',
    resetDone:
      'تمت استعادة الإعدادات الافتراضية. احفظ للاحتفاظ بها.',
    saveError: 'تعذر حفظ التفضيلات على هذا الجهاز.',
    noIdentity: 'يلزم توفر هوية الطالب لحفظ التفضيلات.',
    storageNote:
      'التفضيلات خاصة بهذا المتصفح والطالب التجريبي، ولا تتحكم حاليًا في تشغيل الدروس أو إرسال الإشعارات.',
    sun: 'الأحد',
    mon: 'الإثنين',
    tue: 'الثلاثاء',
    wed: 'الأربعاء',
    thu: 'الخميس',
    fri: 'الجمعة',
    sat: 'السبت',
  },
}

function normalizePreferences(value) {
  const result = {
    ...DEFAULT_PREFERENCES,
    studyDays: [...DEFAULT_PREFERENCES.studyDays],
  }

  if (!value || typeof value !== 'object') return result

  const allowed = {
    courseLanguage: ['en', 'ar', 'both'],
    playbackSpeed: SPEEDS,
    captionLanguage: ['auto', 'en', 'ar'],
    studyTime: ['morning', 'afternoon', 'evening', 'flexible'],
  }

  for (const [key, options] of Object.entries(allowed)) {
    if (options.includes(value[key])) {
      result[key] = value[key]
    }
  }

  for (const key of ['autoplay', 'captions', 'focusMode']) {
    if (typeof value[key] === 'boolean') {
      result[key] = value[key]
    }
  }

  if (GOALS.includes(value.dailyGoal)) {
    result.dailyGoal = value.dailyGoal
  }

  if (Array.isArray(value.studyDays)) {
    result.studyDays = DAYS.filter((day) =>
      value.studyDays.includes(day)
    )
  }

  return result
}

function equalPreferences(a, b) {
  return (
    a.courseLanguage === b.courseLanguage &&
    a.playbackSpeed === b.playbackSpeed &&
    a.autoplay === b.autoplay &&
    a.captions === b.captions &&
    a.captionLanguage === b.captionLanguage &&
    a.dailyGoal === b.dailyGoal &&
    a.studyTime === b.studyTime &&
    a.focusMode === b.focusMode &&
    DAYS.every(
      (day) =>
        a.studyDays.includes(day) === b.studyDays.includes(day)
    )
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

  return `behar:student:${id}:learning-preferences:v1`
}

function readPreferences(key) {
  if (!key || typeof window === 'undefined') {
    return normalizePreferences(null)
  }

  try {
    const raw = window.localStorage.getItem(key)

    return raw
      ? normalizePreferences(JSON.parse(raw))
      : normalizePreferences(null)
  } catch {
    return normalizePreferences(null)
  }
}

function SettingRow({ icon: Icon, title, description, children }) {
  return (
    <div className="learning-preferences__row">
      <span className="learning-preferences__row-icon">
        <Icon size={19} strokeWidth={1.7} aria-hidden="true" />
      </span>

      <div className="learning-preferences__row-copy">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>

      <div className="learning-preferences__row-control">
        {children}
      </div>
    </div>
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`learning-preferences__toggle ${
        checked ? 'learning-preferences__toggle--on' : ''
      }`}
      onClick={() => onChange(!checked)}
    >
      <span />
    </button>
  )
}

export default function LearningPreferences({
  language = 'en',
  student = null,
  className = '',
}) {
  const lang = language === 'ar' ? 'ar' : 'en'
  const t = translations[lang]

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
    const loaded = readPreferences(storageKey)
    setPreferences(loaded)
    setSavedPreferences(loaded)
    setFeedback(null)
  }, [storageKey])

  const isDirty = !equalPreferences(preferences, savedPreferences)

  const update = (key, value) => {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }))
    setFeedback(null)
  }

  const toggleDay = (day) => {
    setPreferences((current) => ({
      ...current,
      studyDays: current.studyDays.includes(day)
        ? current.studyDays.filter((item) => item !== day)
        : DAYS.filter(
            (item) =>
              item === day || current.studyDays.includes(item)
          ),
    }))
    setFeedback(null)
  }

  const save = () => {
    if (!storageKey) {
      setFeedback({ type: 'error', key: 'noIdentity' })
      return
    }

    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify(preferences)
      )
      setSavedPreferences(normalizePreferences(preferences))
      setFeedback({ type: 'success', key: 'saved' })
    } catch {
      setFeedback({ type: 'error', key: 'saveError' })
    }
  }

  const discard = () => {
    setPreferences(normalizePreferences(savedPreferences))
    setFeedback({ type: 'info', key: 'discarded' })
  }

  const reset = () => {
    setPreferences(normalizePreferences(null))
    setFeedback({ type: 'info', key: 'resetDone' })
  }

  return (
    <section
      className={`learning-preferences ${className}`.trim()}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      lang={lang}
      aria-labelledby="learning-preferences-title"
    >
      <header className="learning-preferences__header">
        <div>
          <span className="learning-preferences__eyebrow">
            {t.eyebrow}
          </span>
          <h2 id="learning-preferences-title">{t.title}</h2>
          <p>{t.description}</p>
        </div>

        <span className="learning-preferences__header-icon">
          <GraduationCap size={24} strokeWidth={1.7} />
        </span>
      </header>

      <div className="learning-preferences__notice">
        <Info size={18} aria-hidden="true" />
        <p>{t.notice}</p>
      </div>

      {/* COURSE EXPERIENCE */}

      <section className="learning-preferences__section">
        <div className="learning-preferences__section-heading">
          <h3>{t.content}</h3>
          <p>{t.contentDesc}</p>
        </div>

        <div className="learning-preferences__panel">
          <SettingRow
            icon={Languages}
            title={t.courseLanguage}
            description={t.courseLanguageDesc}
          >
            <select
              aria-label={t.courseLanguage}
              value={preferences.courseLanguage}
              onChange={(event) =>
                update('courseLanguage', event.target.value)
              }
            >
              <option value="both">{t.both}</option>
              <option value="en">{t.english}</option>
              <option value="ar">{t.arabic}</option>
            </select>
          </SettingRow>

          <SettingRow
            icon={Gauge}
            title={t.playbackSpeed}
            description={t.playbackSpeedDesc}
          >
            <select
              aria-label={t.playbackSpeed}
              value={preferences.playbackSpeed}
              onChange={(event) =>
                update('playbackSpeed', event.target.value)
              }
            >
              {SPEEDS.map((speed) => (
                <option key={speed} value={speed}>
                  {speed}×
                </option>
              ))}
            </select>
          </SettingRow>

          <SettingRow
            icon={PlayCircle}
            title={t.autoplay}
            description={t.autoplayDesc}
          >
            <Toggle
              checked={preferences.autoplay}
              onChange={(value) => update('autoplay', value)}
              label={t.autoplay}
            />
          </SettingRow>

          <SettingRow
            icon={Captions}
            title={t.captions}
            description={t.captionsDesc}
          >
            <Toggle
              checked={preferences.captions}
              onChange={(value) => update('captions', value)}
              label={t.captions}
            />
          </SettingRow>

          {preferences.captions && (
            <SettingRow
              icon={Languages}
              title={t.captionLanguage}
              description={t.captionLanguageDesc}
            >
              <select
                aria-label={t.captionLanguage}
                value={preferences.captionLanguage}
                onChange={(event) =>
                  update('captionLanguage', event.target.value)
                }
              >
                <option value="auto">{t.automatic}</option>
                <option value="en">{t.english}</option>
                <option value="ar">{t.arabic}</option>
              </select>
            </SettingRow>
          )}
        </div>
      </section>

      {/* LEARNING GOALS */}

      <section className="learning-preferences__section">
        <div className="learning-preferences__section-heading">
          <h3>{t.goals}</h3>
          <p>{t.goalsDesc}</p>
        </div>

        <div className="learning-preferences__panel">
          <div className="learning-preferences__block">
            <div className="learning-preferences__block-heading">
              <span className="learning-preferences__row-icon">
                <Target size={19} strokeWidth={1.7} />
              </span>
              <div>
                <h4>{t.dailyGoal}</h4>
                <p>{t.dailyGoalDesc}</p>
              </div>
            </div>

            <div
              className="learning-preferences__goal-options"
              role="group"
              aria-label={t.dailyGoal}
            >
              {GOALS.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  className={
                    preferences.dailyGoal === minutes
                      ? 'is-selected'
                      : ''
                  }
                  aria-pressed={preferences.dailyGoal === minutes}
                  onClick={() => update('dailyGoal', minutes)}
                >
                  {minutes} <small>{t.minutes}</small>
                </button>
              ))}
            </div>

            <div className="learning-preferences__goal-summary">
              <Target size={15} aria-hidden="true" />
              <strong>
                {preferences.dailyGoal} {t.minutesPerDay}
              </strong>
            </div>
          </div>

          <SettingRow
            icon={Clock3}
            title={t.studyTime}
            description={t.studyTimeDesc}
          >
            <select
              aria-label={t.studyTime}
              value={preferences.studyTime}
              onChange={(event) =>
                update('studyTime', event.target.value)
              }
            >
              {['morning', 'afternoon', 'evening', 'flexible'].map(
                (value) => (
                  <option key={value} value={value}>
                    {t[value]}
                  </option>
                )
              )}
            </select>
          </SettingRow>

          <div className="learning-preferences__block">
            <div className="learning-preferences__block-heading">
              <span className="learning-preferences__row-icon">
                <CalendarDays size={19} strokeWidth={1.7} />
              </span>
              <div>
                <h4>{t.studyDays}</h4>
                <p>{t.studyDaysDesc}</p>
              </div>
            </div>

            <div className="learning-preferences__days">
              {DAYS.map((day) => {
                const selected = preferences.studyDays.includes(day)

                return (
                  <button
                    key={day}
                    type="button"
                    aria-pressed={selected}
                    className={selected ? 'is-selected' : ''}
                    onClick={() => toggleDay(day)}
                  >
                    {t[day]}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* STUDY ENVIRONMENT */}

      <section className="learning-preferences__section">
        <div className="learning-preferences__section-heading">
          <h3>{t.focus}</h3>
          <p>{t.focusDesc}</p>
        </div>

        <div className="learning-preferences__panel">
          <SettingRow
            icon={Focus}
            title={t.focusMode}
            description={t.focusModeDesc}
          >
            <Toggle
              checked={preferences.focusMode}
              onChange={(value) => update('focusMode', value)}
              label={t.focusMode}
            />
          </SettingRow>
        </div>
      </section>

      <button
        type="button"
        className="learning-preferences__reset"
        onClick={reset}
      >
        <RotateCcw size={15} aria-hidden="true" />
        {t.reset}
      </button>

      {feedback && (
        <div
          className={`learning-preferences__feedback learning-preferences__feedback--${feedback.type}`}
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

      <div className="learning-preferences__save-bar">
        <div className="learning-preferences__save-status">
          {isDirty ? (
            <span className="learning-preferences__unsaved-dot" />
          ) : (
            <CheckCircle2 size={16} />
          )}
          <span>{isDirty ? t.unsaved : t.savedStatus}</span>
        </div>

        <div className="learning-preferences__actions">
          <button
            type="button"
            className="learning-preferences__discard"
            disabled={!isDirty}
            onClick={discard}
          >
            {t.discard}
          </button>

          <button
            type="button"
            className="learning-preferences__save"
            disabled={!isDirty || !storageKey}
            onClick={save}
          >
            <Save size={16} />
            {t.save}
          </button>
        </div>
      </div>

      <p className="learning-preferences__storage-note">
        <Info size={14} aria-hidden="true" />
        {t.storageNote}
      </p>
    </section>
  )
}
