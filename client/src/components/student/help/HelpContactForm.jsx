
import { useId, useState } from 'react'
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  ArrowUpLeft,
  Check,
  CheckCircle2,
  ClipboardCopy,
  Headphones,
  Mail,
  UserRound,
  MessageSquareText,
  ChevronDown,
  ShieldCheck,
  Info,
  AlertCircle,
  RotateCcw,
  Pencil,
} from 'lucide-react'

import '../../../styles/student/help/help-contact-form.css'

const SUBJECT_OPTIONS = [
  {
    value: 'courses',
    en: 'Courses & Learning',
    ar: 'الدورات والتعلم',
  },
  {
    value: 'payments',
    en: 'Payments & Billing',
    ar: 'المدفوعات والفواتير',
  },
  {
    value: 'account',
    en: 'Account & Security',
    ar: 'الحساب والأمان',
  },
  {
    value: 'certificates',
    en: 'Certificates & Achievements',
    ar: 'الشهادات والإنجازات',
  },
  {
    value: 'technical',
    en: 'Technical Support',
    ar: 'الدعم التقني',
  },
  {
    value: 'preferences',
    en: 'Settings & Preferences',
    ar: 'الإعدادات والتفضيلات',
  },
  {
    value: 'other',
    en: 'Other Inquiry',
    ar: 'استفسار آخر',
  },
]

const INITIAL_FORM = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

const translations = {
  en: {
    eyebrow: 'GET IN TOUCH',
    title: 'Talk to our support team.',
    description:
      'Have a question that needs a personal answer? Tell us what you need help with and prepare a message for our team.',

    formEyebrow: 'SUPPORT REQUEST',
    formTitle: 'Send us a message',
    formDescription:
      'Share a few details so we can better understand your question.',

    name: 'Full name',
    namePlaceholder: 'Enter your full name',

    email: 'Email address',
    emailPlaceholder: 'you@example.com',

    subject: 'What can we help with?',
    subjectPlaceholder: 'Select a topic',

    message: 'Your message',
    messagePlaceholder:
      'Tell us more about your question. Include any relevant course or account details, but never share sensitive information.',

    required: 'Required',
    optional: 'Optional',
    characters: 'characters',
    minimumCharacters: 'Minimum 20 characters',

    privacyTitle: 'Your privacy matters',
    privacyDescription:
      'Never include passwords, payment card numbers, or other sensitive information.',

    prepare: 'Review message',
    clear: 'Clear form',

    errors: {
      nameRequired: 'Please enter your full name.',
      nameShort: 'Your name must contain at least 2 characters.',
      nameLong: 'Your name must not exceed 80 characters.',
      emailRequired: 'Please enter your email address.',
      emailInvalid: 'Enter a valid email address.',
      subjectRequired: 'Please select a support topic.',
      messageRequired: 'Please describe your question.',
      messageShort: 'Please enter at least 20 characters.',
      messageLong: 'Your message must not exceed 2000 characters.',
    },

    previewEyebrow: 'MESSAGE PREVIEW',
    previewTitle: 'Your message is ready.',
    previewDescription:
      'Review your details below. Copy the message to share it through an available support channel.',

    previewName: 'Name',
    previewEmail: 'Email',
    previewSubject: 'Subject',
    previewMessage: 'Message',

    copy: 'Copy message',
    copied: 'Copied successfully',
    copyError:
      'Automatic copying is unavailable. Select and copy the message below.',
    edit: 'Edit message',
    newMessage: 'New message',

    noticeTitle: 'Frontend demonstration',
    noticeDescription:
      'Reviewing or copying this message does not submit a support request. Live submission will be enabled after backend integration.',

    asideEyebrow: 'HERE TO HELP',
    asideTitle: 'Every question deserves attention.',
    asideDescription:
      'Whether you need help with a course, payment, or account setting, start by sharing a clear description of your question.',

    asidePointOne: 'Choose the most relevant topic.',
    asidePointTwo: 'Explain your question clearly.',
    asidePointThree: 'Keep sensitive information private.',

    asideFooter: 'BEHAR STUDENT SUPPORT',
  },

  ar: {
    eyebrow: 'تواصل معنا',
    title: 'تحدث مع فريق الدعم.',
    description:
      'هل لديك سؤال يحتاج إلى إجابة مخصصة؟ أخبرنا بما تحتاج إليه وجهّز رسالتك للتواصل مع فريقنا.',

    formEyebrow: 'طلب دعم',
    formTitle: 'أرسل لنا رسالة',
    formDescription:
      'شارك بعض التفاصيل حتى نتمكن من فهم استفسارك بشكل أفضل.',

    name: 'الاسم الكامل',
    namePlaceholder: 'أدخل اسمك الكامل',

    email: 'البريد الإلكتروني',
    emailPlaceholder: 'you@example.com',

    subject: 'كيف يمكننا مساعدتك؟',
    subjectPlaceholder: 'اختر موضوع الاستفسار',

    message: 'رسالتك',
    messagePlaceholder:
      'اشرح استفسارك بالتفصيل. يمكنك إضافة معلومات عن الدورة أو الحساب دون مشاركة بيانات حساسة.',

    required: 'مطلوب',
    optional: 'اختياري',
    characters: 'حرفًا',
    minimumCharacters: '20 حرفًا على الأقل',

    privacyTitle: 'خصوصيتك تهمنا',
    privacyDescription:
      'لا تشارك كلمات المرور أو أرقام البطاقات البنكية أو أي معلومات حساسة.',

    prepare: 'مراجعة الرسالة',
    clear: 'مسح النموذج',

    errors: {
      nameRequired: 'يرجى إدخال اسمك الكامل.',
      nameShort: 'يجب أن يتكون الاسم من حرفين على الأقل.',
      nameLong: 'يجب ألا يتجاوز الاسم 80 حرفًا.',
      emailRequired: 'يرجى إدخال بريدك الإلكتروني.',
      emailInvalid: 'أدخل بريدًا إلكترونيًا صحيحًا.',
      subjectRequired: 'يرجى اختيار موضوع الاستفسار.',
      messageRequired: 'يرجى كتابة تفاصيل استفسارك.',
      messageShort: 'يرجى كتابة 20 حرفًا على الأقل.',
      messageLong: 'يجب ألا تتجاوز الرسالة 2000 حرف.',
    },

    previewEyebrow: 'معاينة الرسالة',
    previewTitle: 'رسالتك جاهزة.',
    previewDescription:
      'راجع التفاصيل أدناه وانسخ الرسالة لمشاركتها عبر إحدى قنوات الدعم المتاحة.',

    previewName: 'الاسم',
    previewEmail: 'البريد الإلكتروني',
    previewSubject: 'الموضوع',
    previewMessage: 'الرسالة',

    copy: 'نسخ الرسالة',
    copied: 'تم النسخ بنجاح',
    copyError:
      'النسخ التلقائي غير متاح. يمكنك تحديد النص أدناه ونسخه يدويًا.',
    edit: 'تعديل الرسالة',
    newMessage: 'رسالة جديدة',

    noticeTitle: 'نسخة تجريبية للواجهة',
    noticeDescription:
      'مراجعة الرسالة أو نسخها لا يعني إرسال طلب دعم. ستتوفر ميزة الإرسال بعد ربط النظام بالخادم.',

    asideEyebrow: 'نحن هنا للمساعدة',
    asideTitle: 'كل استفسار يستحق الاهتمام.',
    asideDescription:
      'سواء كنت تحتاج إلى مساعدة في دورة أو عملية دفع أو إعدادات الحساب، ابدأ بشرح استفسارك بوضوح.',

    asidePointOne: 'اختر الموضوع الأقرب لاستفسارك.',
    asidePointTwo: 'اشرح سؤالك بطريقة واضحة.',
    asidePointThree: 'حافظ على خصوصية معلوماتك.',

    asideFooter: 'دعم طلاب بحار',
  },
}

function validateContactForm(form, t) {
  const errors = {}

  const name = form.name.trim()
  const email = form.email.trim()
  const message = form.message.trim()

  if (!name) {
    errors.name = t.errors.nameRequired
  } else if (name.length < 2) {
    errors.name = t.errors.nameShort
  } else if (name.length > 80) {
    errors.name = t.errors.nameLong
  }

  if (!email) {
    errors.email = t.errors.emailRequired
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.email = t.errors.emailInvalid
  }

  if (!SUBJECT_OPTIONS.some(
    (option) => option.value === form.subject
  )) {
    errors.subject = t.errors.subjectRequired
  }

  if (!message) {
    errors.message = t.errors.messageRequired
  } else if (message.length < 20) {
    errors.message = t.errors.messageShort
  } else if (message.length > 2000) {
    errors.message = t.errors.messageLong
  }

  return errors
}

export default function HelpContactForm({
  language = 'en',
}) {
  const isArabic = language === 'ar'
  const locale = isArabic ? 'ar' : 'en'
  const t = translations[locale]

  const formId = useId().replace(/:/g, '')

  const [form, setForm] = useState({ ...INITIAL_FORM })
  const [errors, setErrors] = useState({})
  const [preview, setPreview] = useState(null)
  const [copyStatus, setCopyStatus] = useState('idle')

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight
  const ExternalArrow = isArabic ? ArrowUpLeft : ArrowUpRight

  const fieldId = (field) => `${formId}-${field}`
  const errorId = (field) => `${formId}-${field}-error`

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))

    setErrors((previous) => {
      if (!previous[field]) return previous

      const next = { ...previous }
      delete next[field]
      return next
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validateContactForm(form, t)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidField = Object.keys(nextErrors)[0]

      document.getElementById(
        fieldId(firstInvalidField)
      )?.focus()

      return
    }

    setPreview({
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject,
      message: form.message.trim(),
    })

    setCopyStatus('idle')
  }

  const handleReset = () => {
    setForm({ ...INITIAL_FORM })
    setErrors({})
    setPreview(null)
    setCopyStatus('idle')
  }

  const handleEdit = () => {
    setPreview(null)
    setCopyStatus('idle')
  }

  const subjectLabel = (value) =>
    SUBJECT_OPTIONS.find(
      (option) => option.value === value
    )?.[locale] || value

  const buildMessageText = () => {
    if (!preview) return ''

    return [
      'BEHAR LMS — Student Support',
      '',
      `${t.previewName}: ${preview.name}`,
      `${t.previewEmail}: ${preview.email}`,
      `${t.previewSubject}: ${subjectLabel(preview.subject)}`,
      '',
      `${t.previewMessage}:`,
      preview.message,
    ].join('\n')
  }

  const handleCopy = async () => {
    const text = buildMessageText()

    if (!text) return

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable')
      }

      await navigator.clipboard.writeText(text)
      setCopyStatus('success')
    } catch {
      setCopyStatus('error')
    }
  }

  return (
    <section
      className="help-contact-form"
      id="help-contact-form"
      dir={isArabic ? 'rtl' : 'ltr'}
      lang={locale}
      aria-labelledby={`${formId}-title`}
    >
      <div className="help-contact-form__container">

        {/* Section header */}
        <header className="help-contact-form__header">
          <div className="help-contact-form__heading">
            <span className="help-contact-form__eyebrow">
              <span
                className="help-contact-form__eyebrow-line"
                aria-hidden="true"
              />
              {t.eyebrow}
            </span>

            <h2
              className="help-contact-form__title"
              id={`${formId}-title`}
            >
              {t.title}
            </h2>

            <p className="help-contact-form__description">
              {t.description}
            </p>
          </div>

          <div
            className="help-contact-form__header-icon"
            aria-hidden="true"
          >
            <Headphones size={26} strokeWidth={1.5} />
          </div>
        </header>

        <div className="help-contact-form__layout">

          {/* Form or preview */}
          <div className="help-contact-form__main">
            {!preview ? (
              <form
                className="help-contact-form__form"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="help-contact-form__form-header">
                  <span className="help-contact-form__form-eyebrow">
                    <MessageSquareText
                      size={14}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                    {t.formEyebrow}
                  </span>

                  <h3>{t.formTitle}</h3>
                  <p>{t.formDescription}</p>
                </div>

                <div className="help-contact-form__fields">

                  {/* Name and email */}
                  <div className="help-contact-form__field-row">

                    <div className="help-contact-form__field">
                      <label htmlFor={fieldId('name')}>
                        {t.name}
                        <span
                          className="help-contact-form__required"
                          aria-hidden="true"
                        >
                          *
                        </span>
                      </label>

                      <div
                        className={[
                          'help-contact-form__input-wrap',
                          errors.name
                            ? 'help-contact-form__input-wrap--error'
                            : '',
                        ].filter(Boolean).join(' ')}
                      >
                        <UserRound
                          size={17}
                          strokeWidth={1.7}
                          aria-hidden="true"
                        />

                        <input
                          id={fieldId('name')}
                          name="name"
                          type="text"
                          autoComplete="name"
                          value={form.name}
                          onChange={(event) =>
                            updateField('name', event.target.value)
                          }
                          placeholder={t.namePlaceholder}
                          maxLength={81}
                          aria-required="true"
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={
                            errors.name ? errorId('name') : undefined
                          }
                        />
                      </div>

                      {errors.name && (
                        <span
                          className="help-contact-form__error"
                          id={errorId('name')}
                          role="alert"
                        >
                          <AlertCircle size={13} />
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div className="help-contact-form__field">
                      <label htmlFor={fieldId('email')}>
                        {t.email}
                        <span
                          className="help-contact-form__required"
                          aria-hidden="true"
                        >
                          *
                        </span>
                      </label>

                      <div
                        className={[
                          'help-contact-form__input-wrap',
                          errors.email
                            ? 'help-contact-form__input-wrap--error'
                            : '',
                        ].filter(Boolean).join(' ')}
                      >
                        <Mail
                          size={17}
                          strokeWidth={1.7}
                          aria-hidden="true"
                        />

                        <input
                          id={fieldId('email')}
                          name="email"
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          dir="ltr"
                          value={form.email}
                          onChange={(event) =>
                            updateField('email', event.target.value)
                          }
                          placeholder={t.emailPlaceholder}
                          aria-required="true"
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={
                            errors.email ? errorId('email') : undefined
                          }
                        />
                      </div>

                      {errors.email && (
                        <span
                          className="help-contact-form__error"
                          id={errorId('email')}
                          role="alert"
                        >
                          <AlertCircle size={13} />
                          {errors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="help-contact-form__field">
                    <label htmlFor={fieldId('subject')}>
                      {t.subject}
                      <span
                        className="help-contact-form__required"
                        aria-hidden="true"
                      >
                        *
                      </span>
                    </label>

                    <div
                      className={[
                        'help-contact-form__select-wrap',
                        errors.subject
                          ? 'help-contact-form__select-wrap--error'
                          : '',
                      ].filter(Boolean).join(' ')}
                    >
                      <select
                        id={fieldId('subject')}
                        name="subject"
                        value={form.subject}
                        onChange={(event) =>
                          updateField('subject', event.target.value)
                        }
                        aria-required="true"
                        aria-invalid={Boolean(errors.subject)}
                        aria-describedby={
                          errors.subject ? errorId('subject') : undefined
                        }
                      >
                        <option value="">
                          {t.subjectPlaceholder}
                        </option>

                        {SUBJECT_OPTIONS.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option[locale]}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={17}
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                    </div>

                    {errors.subject && (
                      <span
                        className="help-contact-form__error"
                        id={errorId('subject')}
                        role="alert"
                      >
                        <AlertCircle size={13} />
                        {errors.subject}
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  <div className="help-contact-form__field">
                    <label htmlFor={fieldId('message')}>
                      {t.message}
                      <span
                        className="help-contact-form__required"
                        aria-hidden="true"
                      >
                        *
                      </span>
                    </label>

                    <textarea
                      id={fieldId('message')}
                      name="message"
                      rows={7}
                      maxLength={2001}
                      value={form.message}
                      onChange={(event) =>
                        updateField('message', event.target.value)
                      }
                      placeholder={t.messagePlaceholder}
                      aria-required="true"
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={
                        errors.message
                          ? errorId('message')
                          : `${formId}-message-hint`
                      }
                    />

                    <div className="help-contact-form__textarea-meta">
                      <span id={`${formId}-message-hint`}>
                        {t.minimumCharacters}
                      </span>

                      <span>
                        {form.message.length} / 2000
                      </span>
                    </div>

                    {errors.message && (
                      <span
                        className="help-contact-form__error"
                        id={errorId('message')}
                        role="alert"
                      >
                        <AlertCircle size={13} />
                        {errors.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Privacy */}
                <div className="help-contact-form__privacy">
                  <ShieldCheck
                    size={19}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />

                  <div>
                    <strong>{t.privacyTitle}</strong>
                    <p>{t.privacyDescription}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="help-contact-form__actions">
                  <button
                    type="submit"
                    className="help-contact-form__primary-button"
                  >
                    <span>{t.prepare}</span>

                    <ArrowIcon
                      size={17}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </button>

                  <button
                    type="button"
                    className="help-contact-form__secondary-button"
                    onClick={handleReset}
                  >
                    <RotateCcw
                      size={15}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                    {t.clear}
                  </button>
                </div>
              </form>
            ) : (
              <div className="help-contact-form__preview">
                <div className="help-contact-form__preview-header">
                  <span className="help-contact-form__success-icon">
                    <CheckCircle2
                      size={28}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </span>

                  <span className="help-contact-form__form-eyebrow">
                    {t.previewEyebrow}
                  </span>

                  <h3>{t.previewTitle}</h3>
                  <p>{t.previewDescription}</p>
                </div>

                <dl className="help-contact-form__summary">
                  <div>
                    <dt>{t.previewName}</dt>
                    <dd>{preview.name}</dd>
                  </div>

                  <div>
                    <dt>{t.previewEmail}</dt>
                    <dd dir="ltr">{preview.email}</dd>
                  </div>

                  <div>
                    <dt>{t.previewSubject}</dt>
                    <dd>{subjectLabel(preview.subject)}</dd>
                  </div>

                  <div className="help-contact-form__summary-message">
                    <dt>{t.previewMessage}</dt>
                    <dd>{preview.message}</dd>
                  </div>
                </dl>

                <div className="help-contact-form__actions">
                  <button
                    type="button"
                    className="help-contact-form__primary-button"
                    onClick={handleCopy}
                  >
                    {copyStatus === 'success' ? (
                      <Check size={17} aria-hidden="true" />
                    ) : (
                      <ClipboardCopy
                        size={17}
                        aria-hidden="true"
                      />
                    )}

                    {copyStatus === 'success'
                      ? t.copied
                      : t.copy}
                  </button>

                  <button
                    type="button"
                    className="help-contact-form__secondary-button"
                    onClick={handleEdit}
                  >
                    <Pencil size={15} aria-hidden="true" />
                    {t.edit}
                  </button>

                  <button
                    type="button"
                    className="help-contact-form__secondary-button"
                    onClick={handleReset}
                  >
                    <RotateCcw size={15} aria-hidden="true" />
                    {t.newMessage}
                  </button>
                </div>

                {copyStatus === 'error' && (
                  <p
                    className="help-contact-form__error"
                    role="alert"
                  >
                    <AlertCircle size={14} />
                    {t.copyError}
                  </p>
                )}

                <textarea
                  className="help-contact-form__copy-fallback"
                  value={buildMessageText()}
                  readOnly
                  aria-label={t.previewTitle}
                />
              </div>
            )}
          </div>

          {/* Support information */}
          <aside className="help-contact-form__aside">
            <div className="help-contact-form__aside-card">
              <span className="help-contact-form__aside-icon">
                <Headphones
                  size={25}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>

              <span className="help-contact-form__aside-eyebrow">
                {t.asideEyebrow}
              </span>

              <h3>{t.asideTitle}</h3>

              <p className="help-contact-form__aside-description">
                {t.asideDescription}
              </p>

              <div className="help-contact-form__aside-divider" />

              <ul className="help-contact-form__tips">
                {[
                  t.asidePointOne,
                  t.asidePointTwo,
                  t.asidePointThree,
                ].map((tip) => (
                  <li key={tip}>
                    <CheckCircle2
                      size={16}
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>

              <div className="help-contact-form__aside-footer">
                <span>{t.asideFooter}</span>
                <ExternalArrow
                  size={17}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="help-contact-form__notice">
              <Info
                size={18}
                strokeWidth={1.7}
                aria-hidden="true"
              />

              <div>
                <strong>{t.noticeTitle}</strong>
                <p>{t.noticeDescription}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
