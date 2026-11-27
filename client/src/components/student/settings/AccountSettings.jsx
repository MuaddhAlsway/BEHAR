
import { useMemo, useState } from 'react'
import {
  UserRoundCog,
  ShieldCheck,
  Fingerprint,
  CalendarDays,
  Download,
  FileJson,
  PauseCircle,
  Trash2,
  LockKeyhole,
  Info,
  CheckCircle2,
  AlertCircle,
  Database,
} from 'lucide-react'

import '../../../styles/student/settings/account-settings.css'

const translations = {
  en: {
    eyebrow: 'ACCOUNT MANAGEMENT',
    title: 'Account settings',
    description:
      'Manage your account information, personal data, and account lifecycle.',
    demoNotice:
      'This is a frontend demonstration. Account status, deactivation, and deletion require authenticated backend integration.',
    overview: 'Account overview',
    overviewDesc: 'Information associated with your student account.',
    accountType: 'Account type',
    studentRole: 'Student',
    accountId: 'Account ID',
    accountStatus: 'Account status',
    demoActive: 'Demo active',
    memberSince: 'Member since',
    unavailable: 'Not available',
    email: 'Email address',
    dataTitle: 'Your data',
    dataDesc:
      'Review and export information stored locally in this browser.',
    exportTitle: 'Export local account data',
    exportDesc:
      'Download your locally stored profile and settings as a JSON file.',
    exportButton: 'Export local data',
    exportNote:
      'This export does not include server-side courses, purchases, certificates, or learning history.',
    dangerTitle: 'Account lifecycle',
    dangerDesc:
      'Actions that affect your account and access to BEHAR.',
    deactivate: 'Deactivate account',
    deactivateDesc:
      'Temporarily disable account access while preserving account data.',
    delete: 'Delete account',
    deleteDesc:
      'Permanently request removal of your account and associated data.',
    comingSoon: 'Backend required',
    securityNote:
      'Account deactivation and deletion are disabled until secure authentication, identity verification, and backend workflows are implemented.',
    exportSuccess: 'Your local data export is ready.',
    exportError: 'Unable to export local data.',
    missingId: 'A valid student identity is required.',
    privacyNote:
      'Your locally stored preferences remain in this browser unless you clear them. Exporting does not delete any information.',
  },
  ar: {
    eyebrow: 'إدارة الحساب',
    title: 'إعدادات الحساب',
    description:
      'إدارة معلومات حسابك وبياناتك الشخصية والإجراءات المتعلقة بالحساب.',
    demoNotice:
      'هذه واجهة تجريبية. تتطلب حالة الحساب وتعطيله وحذفه ربطًا آمنًا بالواجهة الخلفية.',
    overview: 'نظرة عامة على الحساب',
    overviewDesc: 'المعلومات المرتبطة بحساب الطالب.',
    accountType: 'نوع الحساب',
    studentRole: 'طالب',
    accountId: 'معرّف الحساب',
    accountStatus: 'حالة الحساب',
    demoActive: 'نشط تجريبيًا',
    memberSince: 'تاريخ الانضمام',
    unavailable: 'غير متوفر',
    email: 'البريد الإلكتروني',
    dataTitle: 'بياناتك',
    dataDesc:
      'استعرض البيانات المخزنة محليًا في هذا المتصفح وصدّرها.',
    exportTitle: 'تصدير بيانات الحساب المحلية',
    exportDesc:
      'تنزيل الملف الشخصي والإعدادات المخزنة محليًا بصيغة JSON.',
    exportButton: 'تصدير البيانات المحلية',
    exportNote:
      'لا يشمل التصدير الدورات أو المشتريات أو الشهادات أو سجل التعلم المخزن على الخادم.',
    dangerTitle: 'إدارة حالة الحساب',
    dangerDesc:
      'الإجراءات التي تؤثر في حسابك وإمكانية الوصول إلى بحار.',
    deactivate: 'تعطيل الحساب',
    deactivateDesc:
      'إيقاف الوصول إلى الحساب مؤقتًا مع الاحتفاظ ببياناته.',
    delete: 'حذف الحساب',
    deleteDesc:
      'طلب إزالة الحساب والبيانات المرتبطة به بشكل دائم.',
    comingSoon: 'يتطلب الباكند',
    securityNote:
      'تم تعطيل إجراءات إيقاف الحساب وحذفه حتى تنفيذ المصادقة والتحقق من الهوية والإجراءات الآمنة في الخادم.',
    exportSuccess: 'تم تجهيز ملف تصدير البيانات المحلية.',
    exportError: 'تعذر تصدير البيانات المحلية.',
    missingId: 'يلزم توفر معرّف طالب صالح.',
    privacyNote:
      'تظل تفضيلاتك المحلية محفوظة في هذا المتصفح حتى تقوم بمسحها. تصدير البيانات لا يؤدي إلى حذفها.',
  },
}

const LOCAL_DATA_KEYS = [
  'profile:v1',
  'notification-preferences:v1',
  'learning-preferences:v1',
  'appearance:v1',
]

function getValidStudentId(student) {
  const id = student?.id

  return typeof id === 'string' &&
    /^[a-zA-Z0-9_-]{1,128}$/.test(id)
    ? id
    : null
}

function getStoredProfile(id) {
  if (!id || typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(`behar-student-profile:${id}`)

    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function AccountDetail({ icon: Icon, label, value, badge = false }) {
  return (
    <div className="account-settings__detail">
      <span className="account-settings__detail-icon">
        <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
      </span>

      <div className="account-settings__detail-copy">
        <span>{label}</span>

        {badge ? (
          <strong className="account-settings__status-badge">
            <span />
            {value}
          </strong>
        ) : (
          <strong>{value}</strong>
        )}
      </div>
    </div>
  )
}

export default function AccountSettings({
  language = 'en',
  student = null,
  className = '',
}) {
  const lang = language === 'ar' ? 'ar' : 'en'
  const t = translations[lang]

  const studentId = useMemo(
    () => getValidStudentId(student),
    [student?.id]
  )

  const [feedback, setFeedback] = useState(null)

  const profile = getStoredProfile(studentId)

  const email =
    profile?.email ||
    student?.email ||
    t.unavailable

  const joinedAt = student?.createdAt
    ? new Date(student.createdAt)
    : null

  const memberSince =
    joinedAt && !Number.isNaN(joinedAt.getTime())
      ? new Intl.DateTimeFormat(
          lang === 'ar' ? 'ar-SA' : 'en-US',
          { year: 'numeric', month: 'long', day: 'numeric' }
        ).format(joinedAt)
      : t.unavailable

  const handleExport = () => {
    if (!studentId) {
      setFeedback({ type: 'error', key: 'missingId' })
      return
    }

    try {
      const prefix = `behar:student:${studentId}:`

      const localData = {}

      for (const suffix of LOCAL_DATA_KEYS) {
        const raw = window.localStorage.getItem(
          `${prefix}${suffix}`
        )

        if (raw === null) continue

        try {
          localData[suffix] = JSON.parse(raw)
        } catch {
          localData[suffix] = raw
        }
      }

      const exportData = {
        application: 'BEHAR LMS',
        exportType: 'local-browser-data',
        schemaVersion: 1,
        exportedAt: new Date().toISOString(),
        account: {
          id: studentId,
          role: 'student',
          email:
            typeof email === 'string' &&
            email !== t.unavailable
              ? email
              : null,
          createdAt: student?.createdAt || null,
        },
        localData,
        note:
          'This export contains only the supported local browser data keys. It is not a complete account export.',
      }

      const blob = new Blob(
        [JSON.stringify(exportData, null, 2)],
        { type: 'application/json;charset=utf-8' }
      )

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = `behar-local-data-${studentId}.json`

      document.body.appendChild(link)
      link.click()
      link.remove()

      URL.revokeObjectURL(url)

      setFeedback({ type: 'success', key: 'exportSuccess' })
    } catch {
      setFeedback({ type: 'error', key: 'exportError' })
    }
  }

  return (
    <section
      className={`account-settings ${className}`.trim()}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      lang={lang}
      aria-labelledby="account-settings-title"
    >
      {/* HEADER */}

      <header className="account-settings__header">
        <div>
          <span className="account-settings__eyebrow">
            {t.eyebrow}
          </span>

          <h2 id="account-settings-title">
            {t.title}
          </h2>

          <p>{t.description}</p>
        </div>

        <span className="account-settings__header-icon">
          <UserRoundCog size={23} strokeWidth={1.7} />
        </span>
      </header>

      <div className="account-settings__notice">
        <Info size={18} aria-hidden="true" />
        <p>{t.demoNotice}</p>
      </div>

      {/* ACCOUNT OVERVIEW */}

      <section className="account-settings__section">
        <div className="account-settings__section-heading">
          <h3>{t.overview}</h3>
          <p>{t.overviewDesc}</p>
        </div>

        <div className="account-settings__overview">
          <div className="account-settings__overview-top">
            <span className="account-settings__overview-avatar">
              <UserRoundCog size={24} strokeWidth={1.6} />
            </span>

            <div>
              <strong>{t.studentRole}</strong>
              <p>{studentId || t.unavailable}</p>
            </div>

            <span className="account-settings__overview-badge">
              <span />
              {t.demoActive}
            </span>
          </div>

          <div className="account-settings__details">
            <AccountDetail
              icon={Fingerprint}
              label={t.accountId}
              value={studentId || t.unavailable}
            />

            <AccountDetail
              icon={ShieldCheck}
              label={t.accountStatus}
              value={t.demoActive}
              badge
            />

            <AccountDetail
              icon={UserRoundCog}
              label={t.accountType}
              value={t.studentRole}
            />

            <AccountDetail
              icon={CalendarDays}
              label={t.memberSince}
              value={memberSince}
            />

            <AccountDetail
              icon={Database}
              label={t.email}
              value={email}
            />
          </div>
        </div>
      </section>

      {/* DATA EXPORT */}

      <section className="account-settings__section">
        <div className="account-settings__section-heading">
          <h3>{t.dataTitle}</h3>
          <p>{t.dataDesc}</p>
        </div>

        <div className="account-settings__action-card">
          <span className="account-settings__action-icon">
            <FileJson size={21} strokeWidth={1.7} />
          </span>

          <div className="account-settings__action-copy">
            <h4>{t.exportTitle}</h4>
            <p>{t.exportDesc}</p>

            <button
              type="button"
              className="account-settings__export-button"
              onClick={handleExport}
              disabled={!studentId}
            >
              <Download size={16} aria-hidden="true" />
              {t.exportButton}
            </button>
          </div>
        </div>

        <p className="account-settings__helper">
          <Info size={14} aria-hidden="true" />
          {t.exportNote}
        </p>
      </section>

      {/* ACCOUNT LIFECYCLE */}

      <section className="account-settings__section">
        <div className="account-settings__section-heading">
          <h3>{t.dangerTitle}</h3>
          <p>{t.dangerDesc}</p>
        </div>

        <div className="account-settings__danger-panel">
          <div className="account-settings__danger-row">
            <span className="account-settings__danger-icon">
              <PauseCircle size={20} strokeWidth={1.7} />
            </span>

            <div className="account-settings__danger-copy">
              <h4>{t.deactivate}</h4>
              <p>{t.deactivateDesc}</p>
            </div>

            <button
              type="button"
              disabled
              title={t.comingSoon}
              className="account-settings__danger-button"
            >
              {t.comingSoon}
            </button>
          </div>

          <div className="account-settings__danger-row">
            <span className="account-settings__danger-icon account-settings__danger-icon--delete">
              <Trash2 size={20} strokeWidth={1.7} />
            </span>

            <div className="account-settings__danger-copy">
              <h4>{t.delete}</h4>
              <p>{t.deleteDesc}</p>
            </div>

            <button
              type="button"
              disabled
              title={t.comingSoon}
              className="account-settings__danger-button account-settings__danger-button--delete"
            >
              {t.comingSoon}
            </button>
          </div>
        </div>

        <div className="account-settings__security-note">
          <LockKeyhole size={17} aria-hidden="true" />
          <p>{t.securityNote}</p>
        </div>
      </section>

      {/* FEEDBACK */}

      {feedback && (
        <div
          className={`account-settings__feedback account-settings__feedback--${feedback.type}`}
          role={feedback.type === 'error' ? 'alert' : 'status'}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}

          <span>{t[feedback.key]}</span>
        </div>
      )}

      <p className="account-settings__privacy-note">
        <Info size={14} aria-hidden="true" />
        {t.privacyNote}
      </p>
    </section>
  )
}
