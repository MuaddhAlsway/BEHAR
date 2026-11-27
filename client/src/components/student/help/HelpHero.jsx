
import {
  ArrowUpRight,
  ArrowDown,
  LifeBuoy,
  Sparkles,
  MessageCircle,
} from 'lucide-react'

import '../../../styles/student/help/help-hero.css'

const content = {
  en: {
    eyebrow: 'BEHAR / STUDENT SUPPORT',
    lineOne: 'A little help',
    lineTwo: 'goes a long way.',
    description:
      'Questions, technical issues, or a little guidance? Find the answers you need and keep your learning journey moving forward.',
    contact: 'Contact support',
    explore: 'Explore answers below',
    decoration: 'HERE TO HELP',
    accessibility: 'Student help and support introduction',
  },
  ar: {
    eyebrow: 'بحار / دعم الطلاب',
    lineOne: 'كل سؤال',
    lineTwo: 'له إجابة.',
    description:
      'عندك استفسار أو تواجه مشكلة تقنية أو تحتاج مساعدة؟ اكتشف الإجابات التي تحتاجها وواصل رحلتك التعليمية بثقة.',
    contact: 'تواصل مع الدعم',
    explore: 'استكشف الإجابات أدناه',
    decoration: 'نحن هنا لمساعدتك',
    accessibility: 'مقدمة مركز المساعدة والدعم للطلاب',
  },
}

export default function HelpHero({
  language = 'en',
  onContactClick,
  className = '',
}) {
  const lang = language === 'ar' ? 'ar' : 'en'
  const t = content[lang]

  const handleContact = () => {
    if (typeof onContactClick === 'function') {
      onContactClick()
      return
    }

    const contactSection =
      document.getElementById('help-contact')

    if (!contactSection) return

    contactSection.scrollIntoView({
      behavior: window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches
        ? 'instant'
        : 'smooth',
      block: 'start',
    })

    contactSection.focus({ preventScroll: true })
  }

  return (
    <section
      className={`help-hero ${className}`.trim()}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      lang={lang}
      aria-label={t.accessibility}
    >
      {/* Decorative background */}
      <div
        className="help-hero__orb help-hero__orb--one"
        aria-hidden="true"
      />

      <div
        className="help-hero__orb help-hero__orb--two"
        aria-hidden="true"
      />

      <div
        className="help-hero__grid"
        aria-hidden="true"
      />

      <div className="help-hero__inner">
        {/* Top metadata */}
        <div className="help-hero__top">
          <span className="help-hero__eyebrow">
            <LifeBuoy size={15} strokeWidth={1.7} />
            {t.eyebrow}
          </span>

          <span
            className="help-hero__top-symbol"
            aria-hidden="true"
          >
            <Sparkles size={21} strokeWidth={1.2} />
          </span>
        </div>

        {/* Main content */}
        <div className="help-hero__content">
          <h1 className="help-hero__title">
            <span>{t.lineOne}</span>
            <span className="help-hero__title-accent">
              {t.lineTwo}
            </span>
          </h1>

          <p className="help-hero__description">
            {t.description}
          </p>

          <div className="help-hero__actions">
            <button
              type="button"
              className="help-hero__contact"
              onClick={handleContact}
            >
              <MessageCircle
                size={17}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span>{t.contact}</span>

              <ArrowUpRight
                size={17}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>

            <span className="help-hero__explore">
              <ArrowDown
                size={15}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              {t.explore}
            </span>
          </div>
        </div>

        {/* Decorative typography */}
        <div
          className="help-hero__watermark"
          aria-hidden="true"
        >
          {t.decoration}
        </div>

        {/* Bottom metadata */}
        <div className="help-hero__bottom">
          <span>BEHAR LMS</span>

          <span className="help-hero__bottom-line" />

          <span>
            {lang === 'ar'
              ? 'رحلتك التعليمية تهمنا'
              : 'YOUR LEARNING MATTERS'}
          </span>
        </div>
      </div>
    </section>
  )
}
