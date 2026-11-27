
import { useState } from 'react'
import {
  ArrowUpRight,
  ArrowUpLeft,
  ChevronDown,
  HelpCircle,
  SearchX,
  RotateCcw,
} from 'lucide-react'

import '../../../styles/student/help/help-faq.css'

export const HELP_FAQS = [
  {
    id: 'faq-01',
    category: 'courses',
    question: {
      en: 'How do I enroll in a course?',
      ar: 'كيف يمكنني التسجيل في دورة؟',
    },
    answer: {
      en: 'Browse the course catalog, select a course, and open its details page. If enrollment is available, follow the enrollment or checkout steps. Once enrolled, you can access the course from My Learning.',
      ar: 'تصفح قائمة الدورات، واختر الدورة المناسبة، ثم افتح صفحة تفاصيلها. إذا كان التسجيل متاحًا، اتبع خطوات التسجيل أو إتمام الدفع. بعد التسجيل، يمكنك الوصول إلى الدورة من قسم تعلمي.',
    },
  },
  {
    id: 'faq-02',
    category: 'courses',
    question: {
      en: 'Where can I find my enrolled courses?',
      ar: 'أين أجد الدورات التي سجلت فيها؟',
    },
    answer: {
      en: 'Open your Student Dashboard and navigate to My Learning. Your enrolled courses and available learning materials will appear there.',
      ar: 'افتح لوحة تحكم الطالب وانتقل إلى قسم تعلمي. ستظهر هناك الدورات المسجل فيها والمواد التعليمية المتاحة.',
    },
  },
  {
    id: 'faq-03',
    category: 'courses',
    question: {
      en: 'How can I track my learning progress?',
      ar: 'كيف يمكنني متابعة تقدمي التعليمي؟',
    },
    answer: {
      en: 'Visit the Progress section of your Student Dashboard to review your learning activity, course progress, and available achievement indicators.',
      ar: 'انتقل إلى قسم التقدم في لوحة تحكم الطالب لمراجعة نشاطك التعليمي وتقدمك في الدورات ومؤشرات الإنجاز المتاحة.',
    },
  },
  {
    id: 'faq-04',
    category: 'payments',
    question: {
      en: 'What should I do if my payment fails?',
      ar: 'ماذا أفعل إذا فشلت عملية الدفع؟',
    },
    answer: {
      en: 'Check your payment information and the transaction status before trying again. If a charge appears on your account but enrollment is not confirmed, contact support with the transaction reference. Avoid making repeated payments until the status is clarified.',
      ar: 'تحقق من معلومات الدفع وحالة العملية قبل المحاولة مجددًا. إذا ظهر خصم من حسابك دون تأكيد التسجيل، تواصل مع الدعم وأرفق مرجع العملية. تجنب تكرار الدفع حتى تتضح حالة العملية.',
    },
  },
  {
    id: 'faq-05',
    category: 'payments',
    question: {
      en: 'Where can I view my payment history?',
      ar: 'أين يمكنني عرض سجل المدفوعات؟',
    },
    answer: {
      en: 'Open the Payments & Billing section in your Student Dashboard. You can review the payment records currently available in your account.',
      ar: 'افتح قسم المدفوعات والفواتير في لوحة تحكم الطالب. يمكنك مراجعة سجلات الدفع المتاحة حاليًا في حسابك.',
    },
  },
  {
    id: 'faq-06',
    category: 'payments',
    question: {
      en: 'How do I request a refund?',
      ar: 'كيف يمكنني طلب استرداد المبلغ؟',
    },
    answer: {
      en: 'Go to Payments & Billing and review the relevant transaction. If the refund option is available, follow the displayed steps. Refund processing requires backend and payment-provider integration.',
      ar: 'انتقل إلى المدفوعات والفواتير وراجع العملية المعنية. إذا كان خيار الاسترداد متاحًا، اتبع الخطوات المعروضة. تتطلب معالجة الاسترداد ربط النظام بالخادم ومزود الدفع.',
    },
  },
  {
    id: 'faq-07',
    category: 'account',
    question: {
      en: 'How can I update my profile information?',
      ar: 'كيف يمكنني تحديث معلومات ملفي الشخصي؟',
    },
    answer: {
      en: 'Open Student Settings and select My Profile. Update the available fields and save your changes. During the frontend demonstration, profile changes are stored locally in your browser.',
      ar: 'افتح إعدادات الطالب واختر الملف الشخصي. عدّل الحقول المتاحة ثم احفظ التغييرات. خلال النسخة التجريبية للواجهة، تُحفظ تغييرات الملف الشخصي محليًا في المتصفح.',
    },
  },
  {
    id: 'faq-08',
    category: 'account',
    question: {
      en: 'How do I change my password?',
      ar: 'كيف يمكنني تغيير كلمة المرور؟',
    },
    answer: {
      en: 'Password management will be available through the authentication system when backend integration is complete. The current Security Settings section is for demonstration purposes only.',
      ar: 'ستتوفر إدارة كلمات المرور عبر نظام المصادقة بعد اكتمال ربط الخادم. قسم إعدادات الأمان الحالي مخصص للعرض التجريبي فقط.',
    },
  },
  {
    id: 'faq-09',
    category: 'certificates',
    question: {
      en: 'Where can I find my course certificates?',
      ar: 'أين يمكنني العثور على شهادات الدورات؟',
    },
    answer: {
      en: 'Visit the Certificates section of your Student Dashboard to view certificates currently available to your account. Certificate eligibility and issuance depend on the course requirements and completed platform integration.',
      ar: 'انتقل إلى قسم الشهادات في لوحة تحكم الطالب لعرض الشهادات المتاحة حاليًا لحسابك. تعتمد أهلية إصدار الشهادة على متطلبات الدورة واكتمال ربط المنصة.',
    },
  },
  {
    id: 'faq-10',
    category: 'certificates',
    question: {
      en: 'How do badges and achievements work?',
      ar: 'كيف تعمل الشارات والإنجازات؟',
    },
    answer: {
      en: 'BEHAR includes achievement concepts such as learning milestones, streaks, and badges. These help visualize your learning journey. Actual award rules will depend on the completed learning and progress systems.',
      ar: 'تتضمن BEHAR مفاهيم للإنجازات مثل المراحل التعليمية والاستمرارية والشارات. تساعد هذه العناصر في عرض رحلتك التعليمية. وتعتمد قواعد منح الإنجازات الفعلية على اكتمال أنظمة التعلم والتقدم.',
    },
  },
  {
    id: 'faq-11',
    category: 'technical',
    question: {
      en: 'What should I do if a lesson video does not play?',
      ar: 'ماذا أفعل إذا لم يعمل فيديو الدرس؟',
    },
    answer: {
      en: 'Check your internet connection, refresh the page, and try a supported browser. If the problem continues, report the issue with the course name, lesson title, and a description of the error.',
      ar: 'تحقق من اتصال الإنترنت، وحدّث الصفحة، وجرّب متصفحًا مدعومًا. إذا استمرت المشكلة، أبلغ عنها مع اسم الدورة وعنوان الدرس ووصف الخطأ.',
    },
  },
  {
    id: 'faq-12',
    category: 'technical',
    question: {
      en: 'How can I report a technical problem?',
      ar: 'كيف يمكنني الإبلاغ عن مشكلة تقنية؟',
    },
    answer: {
      en: 'Use the Report a Problem section of the Help Center. Include the page or feature affected, steps to reproduce the issue, and any relevant error details. In the current frontend version, report submission is not connected to a support backend.',
      ar: 'استخدم قسم الإبلاغ عن مشكلة في مركز المساعدة. أضف الصفحة أو الميزة المتأثرة وخطوات تكرار المشكلة وتفاصيل الخطأ. في نسخة الواجهة الحالية، لم يتم ربط إرسال البلاغات بخادم الدعم.',
    },
  },
  {
    id: 'faq-13',
    category: 'preferences',
    question: {
      en: 'How can I change the platform language?',
      ar: 'كيف يمكنني تغيير لغة المنصة؟',
    },
    answer: {
      en: 'BEHAR supports English and Arabic. Use the available language controls to switch between supported languages. The platform also adjusts text direction for Arabic.',
      ar: 'تدعم منصة BEHAR اللغتين العربية والإنجليزية. استخدم أدوات تغيير اللغة المتاحة للتبديل بين اللغتين، مع ضبط اتجاه النص تلقائيًا عند استخدام العربية.',
    },
  },
  {
    id: 'faq-14',
    category: 'preferences',
    question: {
      en: 'Where can I manage my notifications?',
      ar: 'أين يمكنني إدارة الإشعارات؟',
    },
    answer: {
      en: 'Open Student Settings and select Notifications. You can adjust the notification preferences currently supported by the frontend. Delivery of real notifications requires backend integration.',
      ar: 'افتح إعدادات الطالب واختر الإشعارات. يمكنك تعديل تفضيلات الإشعارات المدعومة حاليًا في الواجهة. يتطلب إرسال الإشعارات الفعلية ربط المنصة بالخادم.',
    },
  },
]

const translations = {
  en: {
    eyebrow: 'KNOWLEDGE BASE',
    title: 'Frequently asked questions',
    description:
      'Clear answers to the questions learners ask most often.',
    all: 'All questions',
    questions: 'questions',
    question: 'question',
    expandAll: 'Expand all',
    collapseAll: 'Collapse all',
    noResults: 'No matching questions found',
    noResultsDescription:
      'Try another keyword or clear your selected category.',
    reset: 'Clear filters',
    showing: 'Showing',
    of: 'of',
    needHelp: 'Still need assistance?',
    contact: 'Contact support',
  },
  ar: {
    eyebrow: 'قاعدة المعرفة',
    title: 'الأسئلة الشائعة',
    description:
      'إجابات واضحة عن الأسئلة الأكثر شيوعًا بين المتعلمين.',
    all: 'جميع الأسئلة',
    questions: 'أسئلة',
    question: 'سؤال',
    expandAll: 'توسيع الكل',
    collapseAll: 'طي الكل',
    noResults: 'لم يتم العثور على أسئلة مطابقة',
    noResultsDescription:
      'جرّب كلمة بحث أخرى أو أزل التصنيف المحدد.',
    reset: 'مسح التصفية',
    showing: 'عرض',
    of: 'من',
    needHelp: 'هل ما زلت بحاجة إلى مساعدة؟',
    contact: 'تواصل مع الدعم',
  },
}

export default function HelpFAQ({
  language = 'en',
  searchQuery = '',
  selectedCategory = null,
  onClearFilters,
}) {
  const [openIds, setOpenIds] = useState([])

  const isArabic = language === 'ar'
  const currentLanguage = isArabic ? 'ar' : 'en'
  const t = translations[currentLanguage]

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase()

  const filteredFAQs = HELP_FAQS.filter((faq) => {
    const matchesCategory =
      !selectedCategory ||
      faq.category === selectedCategory

    const searchableText = [
      faq.question[currentLanguage],
      faq.answer[currentLanguage],
      faq.question.en,
      faq.answer.en,
      faq.question.ar,
      faq.answer.ar,
    ]
      .join(' ')
      .toLocaleLowerCase()

    const matchesSearch =
      !normalizedQuery ||
      searchableText.includes(normalizedQuery)

    return matchesCategory && matchesSearch
  })

  const visibleIds = filteredFAQs.map((faq) => faq.id)

  const allExpanded =
    visibleIds.length > 0 &&
    visibleIds.every((id) => openIds.includes(id))

  const toggleFAQ = (id) => {
    setOpenIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    )
  }

  const toggleAll = () => {
    setOpenIds((previous) =>
      allExpanded
        ? previous.filter((id) => !visibleIds.includes(id))
        : [...new Set([...previous, ...visibleIds])]
    )
  }

  const handleClearFilters = () => {
    onClearFilters?.()
  }

  const ArrowIcon = isArabic ? ArrowUpLeft : ArrowUpRight

  return (
    <section
      className="help-faq"
      id="help-faq"
      dir={isArabic ? 'rtl' : 'ltr'}
      lang={currentLanguage}
      aria-labelledby="help-faq-title"
    >
      <div className="help-faq__container">
        {/* Header */}
        <div className="help-faq__header">
          <div className="help-faq__heading">
            <span className="help-faq__eyebrow">
              <span
                className="help-faq__eyebrow-line"
                aria-hidden="true"
              />
              {t.eyebrow}
            </span>

            <h2
              className="help-faq__title"
              id="help-faq-title"
            >
              {t.title}
            </h2>

            <p className="help-faq__description">
              {t.description}
            </p>
          </div>

          <div className="help-faq__header-icon" aria-hidden="true">
            <HelpCircle size={26} strokeWidth={1.4} />
          </div>
        </div>

        {/* Toolbar */}
        <div className="help-faq__toolbar">
          <div className="help-faq__result-count" role="status">
            <span className="help-faq__result-dot" />
            {t.showing}{' '}
            <strong>{filteredFAQs.length}</strong>
            {' '}{t.of}{' '}
            <strong>{HELP_FAQS.length}</strong>
            {' '}{t.questions}
          </div>

          {filteredFAQs.length > 0 && (
            <button
              type="button"
              className="help-faq__expand-all"
              onClick={toggleAll}
            >
              {allExpanded ? t.collapseAll : t.expandAll}

              <ChevronDown
                size={15}
                strokeWidth={1.8}
                className={
                  allExpanded
                    ? 'help-faq__expand-icon--open'
                    : ''
                }
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        {/* FAQ List */}
        {filteredFAQs.length > 0 ? (
          <div className="help-faq__list">
            {filteredFAQs.map((faq, index) => {
              const isOpen = openIds.includes(faq.id)
              const answerId = `${faq.id}-answer`
              const buttonId = `${faq.id}-question`

              return (
                <article
                  key={faq.id}
                  className={[
                    'help-faq__item',
                    isOpen ? 'help-faq__item--open' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <h3 className="help-faq__question-heading">
                    <button
                      type="button"
                      id={buttonId}
                      className="help-faq__question"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => toggleFAQ(faq.id)}
                    >
                      <span className="help-faq__number">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <span className="help-faq__question-text">
                        {faq.question[currentLanguage]}
                      </span>

                      <span
                        className="help-faq__chevron"
                        aria-hidden="true"
                      >
                        <ChevronDown
                          size={19}
                          strokeWidth={1.7}
                        />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={answerId}
                    className="help-faq__answer"
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                  >
                    <div className="help-faq__answer-inner">
                      <p>
                        {faq.answer[currentLanguage]}
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="help-faq__empty">
            <span className="help-faq__empty-icon">
              <SearchX
                size={28}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </span>

            <h3>{t.noResults}</h3>
            <p>{t.noResultsDescription}</p>

            {onClearFilters && (
              <button
                type="button"
                className="help-faq__reset"
                onClick={handleClearFilters}
              >
                <RotateCcw
                  size={15}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                {t.reset}
              </button>
            )}
          </div>
        )}

        {/* Contact CTA */}
        <div className="help-faq__footer">
          <div className="help-faq__footer-content">
            <span className="help-faq__footer-icon">
              <HelpCircle
                size={19}
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </span>

            <span>{t.needHelp}</span>
          </div>

          <a
            className="help-faq__contact-link"
            href="#help-contact"
          >
            {t.contact}

            <ArrowIcon
              size={16}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  )
}
