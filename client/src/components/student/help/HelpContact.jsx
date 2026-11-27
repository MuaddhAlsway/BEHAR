
import {
  ArrowUpRight,
  ArrowUpLeft,
  Headphones,
  Bug,
  MessageCircleQuestion,
  Clock3,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import '../../../styles/student/help/help-contact.css'

const translations = {
  en: {
    eyebrow: 'PERSONAL SUPPORT',
    titleStart: 'Need a little',
    titleAccent: 'extra help?',
    description:
      'Some questions need more than a quick answer. Find the right way to get assistance with your BEHAR learning experience.',
    availability: 'Support center',
    availabilityNote: 'Choose the option that fits your question.',
    options: [
      {
        id: 'contact',
        number: '01',
        title: 'Contact our team',
        description:
          'Have a question about your courses, account, or learning experience? Reach out to our support team.',
        action: 'Contact support',
        meta: 'General inquiries',
      },
      {
        id: 'report',
        number: '02',
        title: 'Report a problem',
        description:
          'Something not working as expected? Share the issue so our team can investigate it.',
        action: 'Report an issue',
        meta: 'Technical assistance',
      },
      {
        id: 'faq',
        number: '03',
        title: 'Explore common answers',
        description:
          'Browse helpful answers about payments, certificates, courses, and account settings.',
        action: 'Browse FAQs',
        meta: 'Self-service support',
      },
    ],
    footerTitle: 'Your learning journey matters.',
    footerDescription:
      'We are building a better support experience for every learner.',
    demoNotice:
      'Support requests are not yet connected to a live backend.',
  },

  ar: {
    eyebrow: 'دعم مخصص لك',
    titleStart: 'هل تحتاج إلى',
    titleAccent: 'مساعدة إضافية؟',
    description:
      'بعض الأسئلة تحتاج إلى أكثر من إجابة سريعة. اختر الطريقة المناسبة للحصول على المساعدة خلال رحلتك التعليمية في بحار.',
    availability: 'مركز الدعم',
    availabilityNote: 'اختر الخيار المناسب لاستفسارك.',
    options: [
      {
        id: 'contact',
        number: '01',
        title: 'تواصل مع فريقنا',
        description:
          'هل لديك استفسار عن دوراتك أو حسابك أو تجربتك التعليمية؟ يمكنك التواصل مع فريق الدعم.',
        action: 'تواصل مع الدعم',
        meta: 'الاستفسارات العامة',
      },
      {
        id: 'report',
        number: '02',
        title: 'الإبلاغ عن مشكلة',
        description:
          'هل هناك شيء لا يعمل بالشكل المتوقع؟ شارك تفاصيل المشكلة لمساعدة الفريق في مراجعتها.',
        action: 'أبلغ عن مشكلة',
        meta: 'المساعدة التقنية',
      },
      {
        id: 'faq',
        number: '03',
        title: 'استكشف الإجابات الشائعة',
        description:
          'تصفح الإجابات المتعلقة بالمدفوعات والشهادات والدورات وإعدادات الحساب.',
        action: 'تصفح الأسئلة',
        meta: 'المساعدة الذاتية',
      },
    ],
    footerTitle: 'رحلتك التعليمية تهمنا.',
    footerDescription:
      'نعمل على بناء تجربة دعم أفضل لكل متعلم.',
    demoNotice:
      'طلبات الدعم غير مرتبطة حاليًا بخادم فعلي.',
  },
}

const supportOptions = [
  {
    id: 'contact',
    icon: Headphones,
    href: '#help-contact-form',
  },
  {
    id: 'report',
    icon: Bug,
    href: '#help-report-problem',
  },
  {
    id: 'faq',
    icon: MessageCircleQuestion,
    href: '#help-faq',
  },
]

export default function HelpContact({ language = 'en' }) {
  const isArabic = language === 'ar'
  const currentLanguage = isArabic ? 'ar' : 'en'
  const t = translations[currentLanguage]

  const ArrowIcon = isArabic ? ArrowUpLeft : ArrowUpRight

  return (
    <section
      className="help-contact"
      id="help-contact"
      dir={isArabic ? 'rtl' : 'ltr'}
      lang={currentLanguage}
      aria-labelledby="help-contact-title"
    >
      <div className="help-contact__container">

        {/* Introduction */}
        <div className="help-contact__header">
          <div className="help-contact__heading">
            <span className="help-contact__eyebrow">
              <Sparkles
                size={14}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              {t.eyebrow}
            </span>

            <h2
              className="help-contact__title"
              id="help-contact-title"
            >
              {t.titleStart}
              <span className="help-contact__title-accent">
                {t.titleAccent}
              </span>
            </h2>

            <p className="help-contact__description">
              {t.description}
            </p>
          </div>

          <div className="help-contact__availability">
            <span className="help-contact__availability-icon">
              <Clock3
                size={18}
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </span>

            <div className="help-contact__availability-content">
              <strong>{t.availability}</strong>
              <span>{t.availabilityNote}</span>
            </div>
          </div>
        </div>

        {/* Support Options */}
        <div className="help-contact__grid">
          {supportOptions.map((option, index) => {
            const Icon = option.icon
            const content = t.options[index]

            return (
              <article
                key={option.id}
                className={`help-contact__card help-contact__card--${option.id}`}
              >
                <div className="help-contact__card-top">
                  <span className="help-contact__card-icon">
                    <Icon
                      size={24}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                  </span>

                  <span className="help-contact__card-number">
                    {content.number}
                  </span>
                </div>

                <div className="help-contact__card-body">
                  <span className="help-contact__card-meta">
                    {content.meta}
                  </span>

                  <h3 className="help-contact__card-title">
                    {content.title}
                  </h3>

                  <p className="help-contact__card-description">
                    {content.description}
                  </p>
                </div>

                <a
                  href={option.href}
                  className="help-contact__card-action"
                >
                  <span>{content.action}</span>

                  <ArrowIcon
                    size={17}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </a>
              </article>
            )
          })}
        </div>

        {/* Footer */}
        <div className="help-contact__footer">
          <div className="help-contact__footer-message">
            <span className="help-contact__footer-icon">
              <ShieldCheck
                size={20}
                strokeWidth={1.6}
                aria-hidden="true"
              />
            </span>

            <div>
              <strong>{t.footerTitle}</strong>
              <p>{t.footerDescription}</p>
            </div>
          </div>

          <span className="help-contact__demo-note">
            {t.demoNotice}
          </span>
        </div>
      </div>
    </section>
  )
}
