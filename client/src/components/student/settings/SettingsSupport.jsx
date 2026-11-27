
import { useEffect, useMemo, useState } from 'react'
import {
  LifeBuoy,
  Search,
  BookOpen,
  CircleHelp,
  Mail,
  Bug,
  Info,
  ChevronDown,
  ChevronRight,
  Send,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Globe2,
  GraduationCap,
  MessageSquare,
  Monitor,
  Clock3,
  X,
} from 'lucide-react'

import '../../../styles/student/settings/settings-support.css'

const SUPPORT_VERSION = 'Demo / frontend'

const helpTopics = [
  {
    id: 'courses',
    icon: BookOpen,
    en: {
      title: 'Courses & learning',
      description: 'Enrollment, lessons, progress and certificates.',
    },
    ar: {
      title: 'الدورات والتعلم',
      description: 'التسجيل والدروس والتقدم والشهادات.',
    },
  },
  {
    id: 'account',
    icon: ShieldCheck,
    en: {
      title: 'Account & security',
      description: 'Profile settings, sign-in and account access.',
    },
    ar: {
      title: 'الحساب والأمان',
      description: 'الملف الشخصي وتسجيل الدخول والوصول للحساب.',
    },
  },
  {
    id: 'community',
    icon: MessageSquare,
    en: {
      title: 'Community & instructors',
      description: 'Discussions, questions and instructor interactions.',
    },
    ar: {
      title: 'المجتمع والمدربون',
      description: 'النقاشات والأسئلة والتواصل مع المدربين.',
    },
  },
  {
    id: 'technical',
    icon: Monitor,
    en: {
      title: 'Technical assistance',
      description: 'Playback, loading, browser and interface problems.',
    },
    ar: {
      title: 'المساعدة التقنية',
      description: 'تشغيل الفيديو والتحميل والمتصفح ومشكلات الواجهة.',
    },
  },
]

const faqs = [
  {
    id: 'enroll',
    category: 'courses',
    en: {
      question: 'How do I access my enrolled courses?',
      answer:
        'Open your Student Dashboard and select My Learning. Your available courses will appear there. Course access depends on your enrollment status.',
    },
    ar: {
      question: 'كيف أصل إلى الدورات التي سجلت فيها؟',
      answer:
        'افتح لوحة تحكم الطالب ثم اختر تعلمي. ستظهر الدورات المتاحة لك هناك، ويعتمد الوصول على حالة تسجيلك في الدورة.',
    },
  },
  {
    id: 'progress',
    category: 'courses',
    en: {
      question: 'Where can I track my learning progress?',
      answer:
        'Open the Progress section in your Student Dashboard to review learning activity, completion indicators and available achievements.',
    },
    ar: {
      question: 'أين يمكنني متابعة تقدمي التعليمي؟',
      answer:
        'افتح قسم التقدم في لوحة تحكم الطالب لمراجعة نشاط التعلم ومؤشرات الإنجاز والمكافآت المتاحة.',
    },
  },
  {
    id: 'certificate',
    category: 'courses',
    en: {
      question: 'How do I receive a course certificate?',
      answer:
        'Certificates are associated with course completion requirements. Availability depends on the course and its configured assessment criteria.',
    },
    ar: {
      question: 'كيف أحصل على شهادة الدورة؟',
      answer:
        'ترتبط الشهادات بمتطلبات إكمال الدورة. ويعتمد توفرها على الدورة ومعايير التقييم المحددة لها.',
    },
  },
  {
    id: 'profile',
    category: 'account',
    en: {
      question: 'Can I update my personal information?',
      answer:
        'Yes. Open Settings, then Profile Settings. In the current frontend demo, profile changes are stored locally in your browser.',
    },
    ar: {
      question: 'هل يمكنني تعديل معلوماتي الشخصية؟',
      answer:
        'نعم. افتح الإعدادات ثم الملف الشخصي. في النسخة التجريبية الحالية تُحفظ التعديلات محليًا في متصفحك.',
    },
  },
  {
    id: 'password',
    category: 'account',
    en: {
      question: 'How can I change my password?',
      answer:
        'Password management requires the authentication backend. The current Security Settings screen displays demonstration information only.',
    },
    ar: {
      question: 'كيف يمكنني تغيير كلمة المرور؟',
      answer:
        'تتطلب إدارة كلمة المرور ربط نظام المصادقة بالخادم. تعرض شاشة الأمان الحالية معلومات تجريبية فقط.',
    },
  },
  {
    id: 'instructor',
    category: 'community',
    en: {
      question: 'How can I ask an instructor a question?',
      answer:
        'Use the discussion or Q&A area of a course when that feature is available. Instructor responses depend on the course configuration.',
    },
    ar: {
      question: 'كيف يمكنني طرح سؤال على المدرب؟',
      answer:
        'استخدم قسم النقاش أو الأسئلة والأجوبة داخل الدورة عند توفره. وتعتمد ردود المدرب على إعدادات الدورة.',
    },
  },
  {
    id: 'video',
    category: 'technical',
    en: {
      question: 'What should I do if a video does not play?',
      answer:
        'Check your connection, reload the lesson and try an updated browser. If the issue continues, document the problem using the report form below.',
    },
    ar: {
      question: 'ماذا أفعل إذا لم يعمل الفيديو؟',
      answer:
        'تحقق من اتصال الإنترنت وأعد تحميل الدرس وجرب متصفحًا محدثًا. إذا استمرت المشكلة، وثقها باستخدام نموذج الإبلاغ أدناه.',
    },
  },
  {
    id: 'preferences',
    category: 'technical',
    en: {
      question: 'Why are my preferences not visible on another device?',
      answer:
        'The current frontend demo stores settings in browser localStorage. Cross-device synchronization requires backend integration.',
    },
    ar: {
      question: 'لماذا لا تظهر تفضيلاتي على جهاز آخر؟',
      answer:
        'تُحفظ إعدادات النسخة التجريبية الحالية في التخزين المحلي للمتصفح. وتتطلب المزامنة بين الأجهزة ربطًا بالخادم.',
    },
  },
]

const translations = {
  en: {
    eyebrow: 'WE ARE HERE TO HELP',
    title: 'Help & support',
    description:
      'Find answers, explore support topics and document issues with your learning experience.',
    demoNotice:
      'Support forms currently save drafts locally. No messages or bug reports are sent to a support team.',
    helpTitle: 'Help Center',
    helpDesc: 'Explore support topics and frequently asked questions.',
    searchPlaceholder: 'Search for answers...',
    faqTitle: 'Frequently asked questions',
    faqDesc: 'Answers to common questions about BEHAR.',
    noResults: 'No matching questions found.',
    clearSearch: 'Clear search',
    allTopics: 'All topics',
    contactTitle: 'Contact support',
    contactDesc:
      'Prepare a support request with the details needed to investigate your issue.',
    subject: 'Subject',
    subjectPlaceholder: 'What do you need help with?',
    category: 'Category',
    selectCategory: 'Select a category',
    message: 'Message',
    messagePlaceholder:
      'Describe your question or request in detail...',
    saveDraft: 'Save support draft',
    reportTitle: 'Report a problem',
    reportDesc:
      'Document a technical issue to share with the support team when backend integration becomes available.',
    issueTitle: 'Issue title',
    issuePlaceholder: 'Briefly describe the problem',
    severity: 'Severity',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    issueDescription: 'Problem description',
    issueDescriptionPlaceholder:
      'What happened? What did you expect? How can the issue be reproduced?',
    pageUrl: 'Affected page (optional)',
    pageUrlPlaceholder: 'https://...',
    saveReport: 'Save problem report',
    localOnly: 'Stored in this browser only — not submitted.',
    savedSupport: 'Support draft saved locally.',
    savedReport: 'Problem report saved locally.',
    saveError: 'Unable to save the draft.',
    validationError:
      'Complete the required fields. Use at least 3 characters for the title and 10 for the description.',
    invalidUrl: 'Enter a valid http:// or https:// URL.',
    missingIdentity: 'A valid student identity is required.',
    platformTitle: 'Platform information',
    platformDesc: 'Details about the current BEHAR environment.',
    platformName: 'Platform',
    version: 'Version',
    environment: 'Environment',
    environmentValue: 'Frontend demonstration',
    language: 'Current language',
    supportStatus: 'Support integration',
    supportStatusValue: 'Not connected',
    privacyNote:
      'Avoid including passwords, payment card details or other sensitive information in support drafts.',
  },
  ar: {
    eyebrow: 'نحن هنا لمساعدتك',
    title: 'المساعدة والدعم',
    description:
      'اعثر على الإجابات واستكشف مواضيع المساعدة ووثق المشكلات المتعلقة بتجربتك التعليمية.',
    demoNotice:
      'تحفظ نماذج الدعم حاليًا كمسودات محلية فقط، ولا يتم إرسال الرسائل أو البلاغات إلى فريق الدعم.',
    helpTitle: 'مركز المساعدة',
    helpDesc: 'استكشف مواضيع الدعم والأسئلة الشائعة.',
    searchPlaceholder: 'ابحث عن إجابة...',
    faqTitle: 'الأسئلة الشائعة',
    faqDesc: 'إجابات عن الأسئلة المتكررة حول بحار.',
    noResults: 'لم يتم العثور على أسئلة مطابقة.',
    clearSearch: 'مسح البحث',
    allTopics: 'جميع المواضيع',
    contactTitle: 'التواصل مع الدعم',
    contactDesc:
      'جهز طلب دعم بالمعلومات اللازمة لفهم المشكلة ومتابعتها.',
    subject: 'الموضوع',
    subjectPlaceholder: 'بماذا يمكننا مساعدتك؟',
    category: 'التصنيف',
    selectCategory: 'اختر التصنيف',
    message: 'الرسالة',
    messagePlaceholder:
      'اشرح استفسارك أو طلبك بالتفصيل...',
    saveDraft: 'حفظ مسودة الدعم',
    reportTitle: 'الإبلاغ عن مشكلة',
    reportDesc:
      'وثق مشكلة تقنية لمشاركتها مع فريق الدعم عند توفر الربط بالخادم.',
    issueTitle: 'عنوان المشكلة',
    issuePlaceholder: 'صف المشكلة باختصار',
    severity: 'درجة الخطورة',
    low: 'منخفضة',
    medium: 'متوسطة',
    high: 'مرتفعة',
    issueDescription: 'وصف المشكلة',
    issueDescriptionPlaceholder:
      'ماذا حدث؟ وما المتوقع حدوثه؟ وكيف يمكن تكرار المشكلة؟',
    pageUrl: 'الصفحة المتأثرة (اختياري)',
    pageUrlPlaceholder: 'https://...',
    saveReport: 'حفظ بلاغ المشكلة',
    localOnly: 'محفوظ في هذا المتصفح فقط — لم يتم الإرسال.',
    savedSupport: 'تم حفظ مسودة الدعم محليًا.',
    savedReport: 'تم حفظ بلاغ المشكلة محليًا.',
    saveError: 'تعذر حفظ المسودة.',
    validationError:
      'أكمل الحقول المطلوبة. يجب أن يكون العنوان 3 أحرف على الأقل والوصف 10 أحرف على الأقل.',
    invalidUrl: 'أدخل رابطًا صالحًا يبدأ بـ http:// أو https://.',
    missingIdentity: 'يلزم توفر معرّف طالب صالح.',
    platformTitle: 'معلومات المنصة',
    platformDesc: 'تفاصيل بيئة بحار الحالية.',
    platformName: 'المنصة',
    version: 'الإصدار',
    environment: 'البيئة',
    environmentValue: 'نسخة تجريبية للواجهة الأمامية',
    language: 'اللغة الحالية',
    supportStatus: 'ربط الدعم',
    supportStatusValue: 'غير متصل',
    privacyNote:
      'تجنب إدخال كلمات المرور أو بيانات بطاقات الدفع أو المعلومات الحساسة في مسودات الدعم.',
  },
}

const EMPTY_SUPPORT = {
  subject: '',
  category: '',
  message: '',
}

const EMPTY_REPORT = {
  title: '',
  severity: 'medium',
  description: '',
  pageUrl: '',
}

function getStorageKey(student, type) {
  const id = student?.id

  if (
    typeof id !== 'string' ||
    !/^[a-zA-Z0-9_-]{1,128}$/.test(id)
  ) {
    return null
  }

  return `behar:student:${id}:support-${type}:v1`
}

function readDraft(key, defaults) {
  if (!key || typeof window === 'undefined') {
    return { ...defaults }
  }

  try {
    const raw = window.localStorage.getItem(key)

    if (!raw) return { ...defaults }

    const parsed = JSON.parse(raw)

    if (!parsed || typeof parsed !== 'object') {
      return { ...defaults }
    }

    return Object.fromEntries(
      Object.entries(defaults).map(([field, fallback]) => [
        field,
        typeof parsed[field] === 'string'
          ? parsed[field]
          : fallback,
      ])
    )
  } catch {
    return { ...defaults }
  }
}

function SectionHeading({ title, description }) {
  return (
    <div className="settings-support__section-heading">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

function Feedback({ feedback, t }) {
  if (!feedback) return null

  return (
    <div
      className={`settings-support__feedback settings-support__feedback--${feedback.type}`}
      role={feedback.type === 'error' ? 'alert' : 'status'}
    >
      {feedback.type === 'success' ? (
        <CheckCircle2 size={17} />
      ) : (
        <AlertCircle size={17} />
      )}

      <span>{t[feedback.key]}</span>
    </div>
  )
}

export default function SettingsSupport({
  language = 'en',
  student = null,
  className = '',
}) {
  const lang = language === 'ar' ? 'ar' : 'en'
  const t = translations[lang]

  const supportKey = useMemo(
    () => getStorageKey(student, 'contact'),
    [student?.id]
  )

  const reportKey = useMemo(
    () => getStorageKey(student, 'report'),
    [student?.id]
  )

  const [search, setSearch] = useState('')
  const [activeTopic, setActiveTopic] = useState('all')
  const [openFaq, setOpenFaq] = useState(null)

  const [supportForm, setSupportForm] = useState(
    () => readDraft(supportKey, EMPTY_SUPPORT)
  )

  const [reportForm, setReportForm] = useState(
    () => readDraft(reportKey, EMPTY_REPORT)
  )

  const [supportFeedback, setSupportFeedback] = useState(null)
  const [reportFeedback, setReportFeedback] = useState(null)

  useEffect(() => {
    setSupportForm(readDraft(supportKey, EMPTY_SUPPORT))
    setSupportFeedback(null)
  }, [supportKey])

  useEffect(() => {
    setReportForm(readDraft(reportKey, EMPTY_REPORT))
    setReportFeedback(null)
  }, [reportKey])

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()

    return faqs.filter((faq) => {
      const matchesTopic =
        activeTopic === 'all' || faq.category === activeTopic

      const content = [
        faq[lang].question,
        faq[lang].answer,
      ].join(' ').toLocaleLowerCase()

      return matchesTopic && (!query || content.includes(query))
    })
  }, [search, activeTopic, lang])

  const updateSupport = (field, value) => {
    setSupportForm((current) => ({
      ...current,
      [field]: value,
    }))
    setSupportFeedback(null)
  }

  const updateReport = (field, value) => {
    setReportForm((current) => ({
      ...current,
      [field]: value,
    }))
    setReportFeedback(null)
  }

  const saveSupportDraft = (event) => {
    event.preventDefault()

    if (!supportKey) {
      setSupportFeedback({
        type: 'error',
        key: 'missingIdentity',
      })
      return
    }

    if (
      supportForm.subject.trim().length < 3 ||
      supportForm.message.trim().length < 10 ||
      !helpTopics.some(
        (topic) => topic.id === supportForm.category
      )
    ) {
      setSupportFeedback({
        type: 'error',
        key: 'validationError',
      })
      return
    }

    try {
      window.localStorage.setItem(
        supportKey,
        JSON.stringify({
          ...supportForm,
          subject: supportForm.subject.trim(),
          message: supportForm.message.trim(),
        })
      )

      setSupportFeedback({
        type: 'success',
        key: 'savedSupport',
      })
    } catch {
      setSupportFeedback({
        type: 'error',
        key: 'saveError',
      })
    }
  }

  const saveReportDraft = (event) => {
    event.preventDefault()

    if (!reportKey) {
      setReportFeedback({
        type: 'error',
        key: 'missingIdentity',
      })
      return
    }

    if (
      reportForm.title.trim().length < 3 ||
      reportForm.description.trim().length < 10 ||
      !['low', 'medium', 'high'].includes(reportForm.severity)
    ) {
      setReportFeedback({
        type: 'error',
        key: 'validationError',
      })
      return
    }

    if (reportForm.pageUrl.trim()) {
      try {
        const url = new URL(reportForm.pageUrl.trim())

        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error('Invalid protocol')
        }
      } catch {
        setReportFeedback({
          type: 'error',
          key: 'invalidUrl',
        })
        return
      }
    }

    try {
      window.localStorage.setItem(
        reportKey,
        JSON.stringify({
          ...reportForm,
          title: reportForm.title.trim(),
          description: reportForm.description.trim(),
          pageUrl: reportForm.pageUrl.trim(),
        })
      )

      setReportFeedback({
        type: 'success',
        key: 'savedReport',
      })
    } catch {
      setReportFeedback({
        type: 'error',
        key: 'saveError',
      })
    }
  }

  return (
    <section
      className={`settings-support ${className}`.trim()}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      lang={lang}
      aria-labelledby="settings-support-title"
    >
      {/* HEADER */}

      <header className="settings-support__header">
        <div>
          <span className="settings-support__eyebrow">
            {t.eyebrow}
          </span>

          <h2 id="settings-support-title">{t.title}</h2>
          <p>{t.description}</p>
        </div>

        <span className="settings-support__header-icon">
          <LifeBuoy size={23} strokeWidth={1.7} />
        </span>
      </header>

      <div className="settings-support__notice">
        <Info size={18} aria-hidden="true" />
        <p>{t.demoNotice}</p>
      </div>

      {/* HELP CENTER */}

      <section className="settings-support__section">
        <SectionHeading
          title={t.helpTitle}
          description={t.helpDesc}
        />

        <div className="settings-support__search">
          <Search size={18} aria-hidden="true" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
          />
        </div>

        <div className="settings-support__topics">
          {helpTopics.map((topic) => {
            const Icon = topic.icon

            return (
              <button
                key={topic.id}
                type="button"
                className={`settings-support__topic ${
                  activeTopic === topic.id ? 'is-active' : ''
                }`}
                onClick={() => {
                  setActiveTopic(
                    activeTopic === topic.id ? 'all' : topic.id
                  )
                  setOpenFaq(null)
                }}
                aria-pressed={activeTopic === topic.id}
              >
                <span className="settings-support__topic-icon">
                  <Icon size={19} strokeWidth={1.7} />
                </span>

                <strong>{topic[lang].title}</strong>
                <small>{topic[lang].description}</small>

                <ChevronRight
                  size={16}
                  className="settings-support__topic-arrow"
                />
              </button>
            )
          })}
        </div>
      </section>

      {/* FAQ */}

      <section className="settings-support__section">
        <div className="settings-support__faq-header">
          <SectionHeading
            title={t.faqTitle}
            description={t.faqDesc}
          />

          {activeTopic !== 'all' && (
            <button
              type="button"
              className="settings-support__clear"
              onClick={() => {
                setActiveTopic('all')
                setOpenFaq(null)
              }}
            >
              <X size={14} />
              {t.allTopics}
            </button>
          )}
        </div>

        <div className="settings-support__faq-list">
          {filteredFaqs.length ? (
            filteredFaqs.map((faq) => {
              const isOpen = openFaq === faq.id

              return (
                <div
                  key={faq.id}
                  className={`settings-support__faq ${
                    isOpen ? 'is-open' : ''
                  }`}
                >
                  <button
                    type="button"
                    className="settings-support__faq-question"
                    onClick={() =>
                      setOpenFaq(isOpen ? null : faq.id)
                    }
                    aria-expanded={isOpen}
                    aria-controls={`support-answer-${faq.id}`}
                  >
                    <span>{faq[lang].question}</span>

                    <ChevronDown
                      size={18}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    id={`support-answer-${faq.id}`}
                    className="settings-support__faq-answer"
                    hidden={!isOpen}
                  >
                    <p>{faq[lang].answer}</p>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="settings-support__empty">
              <CircleHelp size={25} />
              <p>{t.noResults}</p>
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setActiveTopic('all')
                }}
              >
                {t.clearSearch}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CONTACT SUPPORT */}

      <section className="settings-support__section">
        <SectionHeading
          title={t.contactTitle}
          description={t.contactDesc}
        />

        <form
          className="settings-support__form"
          onSubmit={saveSupportDraft}
          noValidate
        >
          <div className="settings-support__form-top">
            <span className="settings-support__form-icon">
              <Mail size={21} />
            </span>

            <span className="settings-support__form-label">
              <Save size={13} />
              {t.localOnly}
            </span>
          </div>

          <div className="settings-support__field-grid">
            <label className="settings-support__field">
              <span>{t.subject}</span>

              <input
                type="text"
                maxLength={120}
                value={supportForm.subject}
                onChange={(event) =>
                  updateSupport('subject', event.target.value)
                }
                placeholder={t.subjectPlaceholder}
                required
              />
            </label>

            <label className="settings-support__field">
              <span>{t.category}</span>

              <select
                value={supportForm.category}
                onChange={(event) =>
                  updateSupport('category', event.target.value)
                }
                required
              >
                <option value="">{t.selectCategory}</option>

                {helpTopics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic[lang].title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="settings-support__field">
            <span>{t.message}</span>

            <textarea
              rows={5}
              maxLength={4000}
              value={supportForm.message}
              onChange={(event) =>
                updateSupport('message', event.target.value)
              }
              placeholder={t.messagePlaceholder}
              required
            />
          </label>

          <Feedback feedback={supportFeedback} t={t} />

          <div className="settings-support__form-actions">
            <button type="submit">
              <Save size={16} />
              {t.saveDraft}
            </button>
          </div>
        </form>
      </section>

      {/* REPORT PROBLEM */}

      <section className="settings-support__section">
        <SectionHeading
          title={t.reportTitle}
          description={t.reportDesc}
        />

        <form
          className="settings-support__form"
          onSubmit={saveReportDraft}
          noValidate
        >
          <div className="settings-support__form-top">
            <span className="settings-support__form-icon settings-support__form-icon--bug">
              <Bug size={21} />
            </span>

            <span className="settings-support__form-label">
              <Save size={13} />
              {t.localOnly}
            </span>
          </div>

          <div className="settings-support__field-grid">
            <label className="settings-support__field">
              <span>{t.issueTitle}</span>

              <input
                type="text"
                maxLength={120}
                value={reportForm.title}
                onChange={(event) =>
                  updateReport('title', event.target.value)
                }
                placeholder={t.issuePlaceholder}
                required
              />
            </label>

            <label className="settings-support__field">
              <span>{t.severity}</span>

              <select
                value={reportForm.severity}
                onChange={(event) =>
                  updateReport('severity', event.target.value)
                }
              >
                <option value="low">{t.low}</option>
                <option value="medium">{t.medium}</option>
                <option value="high">{t.high}</option>
              </select>
            </label>
          </div>

          <label className="settings-support__field">
            <span>{t.issueDescription}</span>

            <textarea
              rows={5}
              maxLength={4000}
              value={reportForm.description}
              onChange={(event) =>
                updateReport('description', event.target.value)
              }
              placeholder={t.issueDescriptionPlaceholder}
              required
            />
          </label>

          <label className="settings-support__field">
            <span>{t.pageUrl}</span>

            <input
              type="url"
              maxLength={1000}
              value={reportForm.pageUrl}
              onChange={(event) =>
                updateReport('pageUrl', event.target.value)
              }
              placeholder={t.pageUrlPlaceholder}
            />
          </label>

          <Feedback feedback={reportFeedback} t={t} />

          <div className="settings-support__form-actions">
            <button type="submit">
              <Save size={16} />
              {t.saveReport}
            </button>
          </div>
        </form>
      </section>

      {/* PLATFORM INFORMATION */}

      <section className="settings-support__section">
        <SectionHeading
          title={t.platformTitle}
          description={t.platformDesc}
        />

        <div className="settings-support__platform">
          {[
            {
              icon: GraduationCap,
              label: t.platformName,
              value: 'BEHAR LMS',
            },
            {
              icon: Clock3,
              label: t.version,
              value: SUPPORT_VERSION,
            },
            {
              icon: Monitor,
              label: t.environment,
              value: t.environmentValue,
            },
            {
              icon: Globe2,
              label: t.language,
              value: lang === 'ar' ? 'العربية' : 'English',
            },
            {
              icon: LifeBuoy,
              label: t.supportStatus,
              value: t.supportStatusValue,
            },
          ].map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.label}
                className="settings-support__platform-row"
              >
                <span className="settings-support__platform-icon">
                  <Icon size={17} />
                </span>

                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            )
          })}
        </div>
      </section>

      <div className="settings-support__privacy-note">
        <ShieldCheck size={17} aria-hidden="true" />
        <p>{t.privacyNote}</p>
      </div>
    </section>
  )
}
