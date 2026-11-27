
import { useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Bug,
  Check,
  CheckCircle2,
  ClipboardCopy,
  FileText,
  Info,
  Link2,
  RotateCcw,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react'

import '../../../styles/student/help/help-report-problem.css'

const ISSUE_TYPES = [
  {
    value: 'video',
    en: 'Video or lesson playback',
    ar: 'تشغيل الفيديو أو الدرس',
  },
  {
    value: 'course',
    en: 'Course access or enrollment',
    ar: 'الوصول للدورات أو التسجيل',
  },
  {
    value: 'payment',
    en: 'Payment or billing',
    ar: 'الدفع أو الفواتير',
  },
  {
    value: 'account',
    en: 'Account or login',
    ar: 'الحساب أو تسجيل الدخول',
  },
  {
    value: 'assignment',
    en: 'Assignments or quizzes',
    ar: 'الواجبات أو الاختبارات',
  },
  {
    value: 'other',
    en: 'Other technical issue',
    ar: 'مشكلة تقنية أخرى',
  },
]

const SEVERITY_OPTIONS = [
  {
    value: 'low',
    en: 'Low',
    ar: 'منخفضة',
  },
  {
    value: 'medium',
    en: 'Medium',
    ar: 'متوسطة',
  },
  {
    value: 'high',
    en: 'High',
    ar: 'مرتفعة',
  },
]

const translations = {
  en: {
    eyebrow: 'TECHNICAL ASSISTANCE',
    title: 'Report a problem',
    description:
      'Tell us what went wrong. A clear report helps our team understand the issue and investigate it faster.',
    step: 'ISSUE REPORT',
    formTitle: 'Describe your issue',
    formDescription:
      'Complete the details below to prepare your support report.',
    issueType: 'Issue category',
    issueTypePlaceholder: 'Select an issue category',
    severity: 'Issue severity',
    severityHint: 'How much does this issue affect your learning?',
    subject: 'Issue title',
    subjectPlaceholder: 'A short summary of the problem',
    pageUrl: 'Affected page URL',
    pageUrlPlaceholder: 'https://example.com/page',
    optional: 'Optional',
    descriptionLabel: 'Describe the problem',
    descriptionPlaceholder:
      'What were you trying to do? What happened instead? Include any error messages or steps to reproduce the issue.',
    descriptionHint: 'Minimum 20 characters',
    characters: 'characters',
    privacy:
      'Do not include passwords, payment card details, or other sensitive information.',
    prepare: 'Prepare report',
    reset: 'Reset form',
    required: 'This field is required.',
    invalidUrl: 'Enter a valid HTTP or HTTPS URL.',
    shortDescription:
      'Please provide at least 20 characters.',
    longDescription:
      'The description must not exceed 2000 characters.',
    longTitle: 'The title must not exceed 120 characters.',
    previewTitle: 'Your report is ready',
    previewDescription:
      'Review the information below and copy it to share with the support team.',
    copy: 'Copy report',
    copied: 'Report copied',
    copyFailed: 'Could not copy automatically. Please copy the report manually.',
    edit: 'Edit report',
    newReport: 'New report',
    reportCategory: 'Category',
    reportSeverity: 'Severity',
    reportTitle: 'Title',
    reportUrl: 'Page URL',
    reportDescription: 'Description',
    demoNotice:
      'Demo mode: preparing a report does not send it to BEHAR support.',
    securityTitle: 'A secure way to report issues',
    securityDescription:
      'Only include information necessary to explain the problem.',
  },
  ar: {
    eyebrow: 'المساعدة التقنية',
    title: 'الإبلاغ عن مشكلة',
    description:
      'أخبرنا بما حدث. يساعد وصف المشكلة بوضوح على فهمها والتحقيق فيها بشكل أسرع.',
    step: 'بلاغ تقني',
    formTitle: 'صف المشكلة التي تواجهك',
    formDescription:
      'أكمل التفاصيل التالية لإعداد بلاغ الدعم.',
    issueType: 'تصنيف المشكلة',
    issueTypePlaceholder: 'اختر تصنيف المشكلة',
    severity: 'مستوى خطورة المشكلة',
    severityHint: 'ما مدى تأثير المشكلة على تجربتك التعليمية؟',
    subject: 'عنوان المشكلة',
    subjectPlaceholder: 'ملخص قصير للمشكلة',
    pageUrl: 'رابط الصفحة المتأثرة',
    pageUrlPlaceholder: 'https://example.com/page',
    optional: 'اختياري',
    descriptionLabel: 'وصف المشكلة',
    descriptionPlaceholder:
      'ماذا كنت تحاول أن تفعل؟ وماذا حدث بدلًا من ذلك؟ أضف رسائل الخطأ أو خطوات تكرار المشكلة.',
    descriptionHint: '20 حرفًا على الأقل',
    characters: 'حرفًا',
    privacy:
      'لا تشارك كلمات المرور أو بيانات البطاقات البنكية أو أي معلومات حساسة.',
    prepare: 'إعداد البلاغ',
    reset: 'إعادة تعيين',
    required: 'هذا الحقل مطلوب.',
    invalidUrl: 'أدخل رابطًا صحيحًا يبدأ بـ HTTP أو HTTPS.',
    shortDescription:
      'يرجى كتابة 20 حرفًا على الأقل.',
    longDescription:
      'يجب ألا يتجاوز الوصف 2000 حرف.',
    longTitle: 'يجب ألا يتجاوز العنوان 120 حرفًا.',
    previewTitle: 'بلاغك جاهز',
    previewDescription:
      'راجع المعلومات التالية وانسخها لمشاركتها مع فريق الدعم.',
    copy: 'نسخ البلاغ',
    copied: 'تم نسخ البلاغ',
    copyFailed: 'تعذر النسخ تلقائيًا. يرجى نسخ البلاغ يدويًا.',
    edit: 'تعديل البلاغ',
    newReport: 'بلاغ جديد',
    reportCategory: 'التصنيف',
    reportSeverity: 'الخطورة',
    reportTitle: 'العنوان',
    reportUrl: 'رابط الصفحة',
    reportDescription: 'الوصف',
    demoNotice:
      'الوضع التجريبي: إعداد البلاغ لا يعني إرساله إلى دعم بحار.',
    securityTitle: 'طريقة آمنة للإبلاغ عن المشاكل',
    securityDescription:
      'شارك فقط المعلومات اللازمة لتوضيح المشكلة.',
  },
}

const INITIAL_FORM = {
  issueType: '',
  severity: 'medium',
  subject: '',
  pageUrl: '',
  description: '',
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value)

    return (
      url.protocol === 'http:' ||
      url.protocol === 'https:'
    )
  } catch {
    return false
  }
}

export default function HelpReportProblem({
  language = 'en',
}) {
  const isArabic = language === 'ar'
  const currentLanguage = isArabic ? 'ar' : 'en'
  const t = translations[currentLanguage]

  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [report, setReport] = useState(null)
  const [copyStatus, setCopyStatus] = useState('')

  const ArrowIcon = isArabic ? ArrowLeft : ArrowRight

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }))
  }

  const validateForm = () => {
    const nextErrors = {}

    if (!form.issueType) {
      nextErrors.issueType = t.required
    }

    if (!form.subject.trim()) {
      nextErrors.subject = t.required
    } else if (form.subject.trim().length > 120) {
      nextErrors.subject = t.longTitle
    }

    if (
      form.pageUrl.trim() &&
      !isValidHttpUrl(form.pageUrl.trim())
    ) {
      nextErrors.pageUrl = t.invalidUrl
    }

    if (form.description.trim().length < 20) {
      nextErrors.description = t.shortDescription
    } else if (form.description.trim().length > 2000) {
      nextErrors.description = t.longDescription
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validateForm()) return

    setReport({
      issueType: form.issueType,
      severity: form.severity,
      subject: form.subject.trim(),
      pageUrl: form.pageUrl.trim(),
      description: form.description.trim(),
    })

    setCopyStatus('')
  }

  const handleReset = () => {
    setForm({ ...INITIAL_FORM })
    setErrors({})
    setReport(null)
    setCopyStatus('')
  }

  const handleEdit = () => {
    setReport(null)
    setCopyStatus('')
  }

  const getIssueLabel = (value) =>
    ISSUE_TYPES.find((item) => item.value === value)?.[
      currentLanguage
    ] || value

  const getSeverityLabel = (value) =>
    SEVERITY_OPTIONS.find(
      (item) => item.value === value
    )?.[currentLanguage] || value

  const buildReportText = () => {
    if (!report) return ''

    return [
      'BEHAR LMS — Technical Issue Report',
      '',
      `${t.reportCategory}: ${getIssueLabel(report.issueType)}`,
      `${t.reportSeverity}: ${getSeverityLabel(report.severity)}`,
      `${t.reportTitle}: ${report.subject}`,
      ...(report.pageUrl
        ? [`${t.reportUrl}: ${report.pageUrl}`]
        : []),
      '',
      `${t.reportDescription}:`,
      report.description,
    ].join('\n')
  }

  const handleCopy = async () => {
    const text = buildReportText()

    if (!text) return

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard unavailable')
      }

      await navigator.clipboard.writeText(text)
      setCopyStatus('success')
    } catch {
      setCopyStatus('error')
    }
  }

  return (
    <section
      className="help-report-problem"
      id="help-report-problem"
      dir={isArabic ? 'rtl' : 'ltr'}
      lang={currentLanguage}
      aria-labelledby="help-report-problem-title"
    >
      <div className="help-report-problem__container">

        {/* Section header */}
        <div className="help-report-problem__header">
          <div className="help-report-problem__heading">
            <span className="help-report-problem__eyebrow">
              <span
                className="help-report-problem__eyebrow-line"
                aria-hidden="true"
              />
              {t.eyebrow}
            </span>

            <h2
              className="help-report-problem__title"
              id="help-report-problem-title"
            >
              {t.title}
            </h2>

            <p className="help-report-problem__description">
              {t.description}
            </p>
          </div>

          <div
            className="help-report-problem__header-icon"
            aria-hidden="true"
          >
            <Bug size={25} strokeWidth={1.5} />
          </div>
        </div>

        <div className="help-report-problem__layout">

          {/* Main form / report preview */}
          <div className="help-report-problem__main">
            {!report ? (
              <form
                className="help-report-problem__form"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="help-report-problem__form-header">
                  <span className="help-report-problem__step">
                    {t.step}
                  </span>

                  <h3>{t.formTitle}</h3>
                  <p>{t.formDescription}</p>
                </div>

                <div className="help-report-problem__fields">

                  {/* Issue type */}
                  <div className="help-report-problem__field">
                    <label htmlFor="help-issue-type">
                      {t.issueType}
                      <span aria-hidden="true">*</span>
                    </label>

                    <div className="help-report-problem__select-wrap">
                      <select
                        id="help-issue-type"
                        value={form.issueType}
                        onChange={(event) =>
                          updateField(
                            'issueType',
                            event.target.value
                          )
                        }
                        aria-invalid={Boolean(errors.issueType)}
                        aria-describedby={
                          errors.issueType
                            ? 'help-issue-type-error'
                            : undefined
                        }
                      >
                        <option value="">
                          {t.issueTypePlaceholder}
                        </option>

                        {ISSUE_TYPES.map((issue) => (
                          <option
                            key={issue.value}
                            value={issue.value}
                          >
                            {issue[currentLanguage]}
                          </option>
                        ))}
                      </select>

                      <ChevronIndicator />
                    </div>

                    {errors.issueType && (
                      <span
                        className="help-report-problem__error"
                        id="help-issue-type-error"
                        role="alert"
                      >
                        <AlertCircle size={13} />
                        {errors.issueType}
                      </span>
                    )}
                  </div>

                  {/* Severity */}
                  <fieldset className="help-report-problem__severity">
                    <legend>{t.severity}</legend>

                    <p className="help-report-problem__hint">
                      {t.severityHint}
                    </p>

                    <div className="help-report-problem__severity-options">
                      {SEVERITY_OPTIONS.map((option) => (
                        <label
                          key={option.value}
                          className={[
                            'help-report-problem__severity-option',
                            `help-report-problem__severity-option--${option.value}`,
                            form.severity === option.value
                              ? 'help-report-problem__severity-option--active'
                              : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <input
                            type="radio"
                            name="help-issue-severity"
                            value={option.value}
                            checked={
                              form.severity === option.value
                            }
                            onChange={() =>
                              updateField(
                                'severity',
                                option.value
                              )
                            }
                          />

                          <span className="help-report-problem__severity-dot" />
                          <span>{option[currentLanguage]}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* Issue title */}
                  <div className="help-report-problem__field">
                    <label htmlFor="help-issue-subject">
                      {t.subject}
                      <span aria-hidden="true">*</span>
                    </label>

                    <div className="help-report-problem__input-wrap">
                      <FileText
                        size={17}
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />

                      <input
                        id="help-issue-subject"
                        type="text"
                        value={form.subject}
                        onChange={(event) =>
                          updateField(
                            'subject',
                            event.target.value
                          )
                        }
                        placeholder={t.subjectPlaceholder}
                        maxLength={121}
                        aria-invalid={Boolean(errors.subject)}
                        aria-describedby={
                          errors.subject
                            ? 'help-issue-subject-error'
                            : undefined
                        }
                      />
                    </div>

                    {errors.subject && (
                      <span
                        className="help-report-problem__error"
                        id="help-issue-subject-error"
                        role="alert"
                      >
                        <AlertCircle size={13} />
                        {errors.subject}
                      </span>
                    )}
                  </div>

                  {/* Page URL */}
                  <div className="help-report-problem__field">
                    <label htmlFor="help-issue-url">
                      {t.pageUrl}

                      <span className="help-report-problem__optional">
                        {t.optional}
                      </span>
                    </label>

                    <div className="help-report-problem__input-wrap">
                      <Link2
                        size={17}
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />

                      <input
                        id="help-issue-url"
                        type="url"
                        value={form.pageUrl}
                        onChange={(event) =>
                          updateField(
                            'pageUrl',
                            event.target.value
                          )
                        }
                        placeholder={t.pageUrlPlaceholder}
                        dir="ltr"
                        aria-invalid={Boolean(errors.pageUrl)}
                        aria-describedby={
                          errors.pageUrl
                            ? 'help-issue-url-error'
                            : undefined
                        }
                      />
                    </div>

                    {errors.pageUrl && (
                      <span
                        className="help-report-problem__error"
                        id="help-issue-url-error"
                        role="alert"
                      >
                        <AlertCircle size={13} />
                        {errors.pageUrl}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div className="help-report-problem__field">
                    <label htmlFor="help-issue-description">
                      {t.descriptionLabel}
                      <span aria-hidden="true">*</span>
                    </label>

                    <textarea
                      id="help-issue-description"
                      value={form.description}
                      onChange={(event) =>
                        updateField(
                          'description',
                          event.target.value
                        )
                      }
                      placeholder={t.descriptionPlaceholder}
                      rows={6}
                      maxLength={2001}
                      aria-invalid={Boolean(errors.description)}
                      aria-describedby={
                        errors.description
                          ? 'help-issue-description-error'
                          : 'help-issue-description-hint'
                      }
                    />

                    <div className="help-report-problem__textarea-footer">
                      <span id="help-issue-description-hint">
                        {t.descriptionHint}
                      </span>

                      <span>
                        {form.description.length} / 2000
                      </span>
                    </div>

                    {errors.description && (
                      <span
                        className="help-report-problem__error"
                        id="help-issue-description-error"
                        role="alert"
                      >
                        <AlertCircle size={13} />
                        {errors.description}
                      </span>
                    )}
                  </div>
                </div>

                {/* Privacy notice */}
                <div className="help-report-problem__privacy">
                  <Info
                    size={17}
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                  <span>{t.privacy}</span>
                </div>

                {/* Form actions */}
                <div className="help-report-problem__actions">
                  <button
                    type="submit"
                    className="help-report-problem__submit"
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
                    className="help-report-problem__reset"
                    onClick={handleReset}
                  >
                    <RotateCcw
                      size={15}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                    {t.reset}
                  </button>
                </div>
              </form>
            ) : (
              <div className="help-report-problem__preview">
                <div className="help-report-problem__preview-heading">
                  <span className="help-report-problem__success-icon">
                    <CheckCircle2
                      size={25}
                      strokeWidth={1.6}
                      aria-hidden="true"
                    />
                  </span>

                  <h3>{t.previewTitle}</h3>
                  <p>{t.previewDescription}</p>
                </div>

                <dl className="help-report-problem__summary">
                  <div>
                    <dt>{t.reportCategory}</dt>
                    <dd>{getIssueLabel(report.issueType)}</dd>
                  </div>

                  <div>
                    <dt>{t.reportSeverity}</dt>
                    <dd>{getSeverityLabel(report.severity)}</dd>
                  </div>

                  <div>
                    <dt>{t.reportTitle}</dt>
                    <dd>{report.subject}</dd>
                  </div>

                  {report.pageUrl && (
                    <div>
                      <dt>{t.reportUrl}</dt>
                      <dd className="help-report-problem__url">
                        {report.pageUrl}
                      </dd>
                    </div>
                  )}

                  <div className="help-report-problem__summary-description">
                    <dt>{t.reportDescription}</dt>
                    <dd>{report.description}</dd>
                  </div>
                </dl>

                <div className="help-report-problem__actions">
                  <button
                    type="button"
                    className="help-report-problem__submit"
                    onClick={handleCopy}
                  >
                    {copyStatus === 'success' ? (
                      <Check size={17} />
                    ) : (
                      <ClipboardCopy size={17} />
                    )}

                    {copyStatus === 'success'
                      ? t.copied
                      : t.copy}
                  </button>

                  <button
                    type="button"
                    className="help-report-problem__reset"
                    onClick={handleEdit}
                  >
                    {t.edit}
                  </button>

                  <button
                    type="button"
                    className="help-report-problem__reset"
                    onClick={handleReset}
                  >
                    {t.newReport}
                  </button>
                </div>

                {copyStatus === 'error' && (
                  <p
                    className="help-report-problem__error"
                    role="alert"
                  >
                    {t.copyFailed}
                  </p>
                )}

                <textarea
                  className="help-report-problem__copy-fallback"
                  readOnly
                  value={buildReportText()}
                  aria-label={t.previewTitle}
                />
              </div>
            )}
          </div>

          {/* Side information */}
          <aside className="help-report-problem__aside">
            <div className="help-report-problem__aside-card">
              <span className="help-report-problem__aside-icon">
                <ShieldCheck
                  size={24}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </span>

              <h3>{t.securityTitle}</h3>

              <p>{t.securityDescription}</p>

              <div className="help-report-problem__aside-divider" />

              <div className="help-report-problem__aside-note">
                <Info
                  size={16}
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
                <span>{t.demoNotice}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function ChevronIndicator() {
  return (
    <svg
      className="help-report-problem__select-chevron"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
