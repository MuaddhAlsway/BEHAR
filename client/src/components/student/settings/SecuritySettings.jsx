
import { useState } from 'react'
import {
  ShieldCheck,
  LockKeyhole,
  Eye,
  EyeOff,
  KeyRound,
  MonitorSmartphone,
  History,
  BellRing,
  LogOut,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  X,
  LoaderCircle,
  Info,
} from 'lucide-react'

import '../../../styles/student/settings/security-settings.css'

const translations = {
  en: {
    eyebrow: 'ACCOUNT PROTECTION',
    title: 'Security & privacy',
    description:
      'Manage how your account is protected and accessed.',
    integrationNotice:
      'Security features require authentication integration. No account security changes are being made yet.',

    password: 'Password',
    passwordDesc: 'Manage your account password.',
    changePassword: 'Change password',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    passwordHint:
      'Use at least 12 characters for a stronger password.',
    passwordRequired: 'All password fields are required.',
    passwordLength:
      'Your new password must contain at least 12 characters.',
    passwordMismatch: 'New passwords do not match.',
    passwordSame:
      'Choose a password different from your current password.',
    passwordUnavailable:
      'Password changes are not connected to authentication yet.',
    passwordUpdated: 'Your password was updated.',
    passwordFailed:
      'Password update failed. Please try again.',
    savePassword: 'Update password',
    cancel: 'Cancel',

    twoFactor: 'Two-factor authentication',
    twoFactorDesc:
      'Add an extra verification step when signing in.',
    twoFactorEnabled: 'Enabled',
    twoFactorDisabled: 'Not configured',
    manage2FA: 'Manage 2FA',
    twoFactorUnavailable:
      'Two-factor authentication setup is not available yet.',

    sessions: 'Active sessions',
    sessionsDesc:
      'Review devices currently signed in to your account.',
    noSessions:
      'Session information is not available.',
    currentDevice: 'Current device',
    unknownDevice: 'Unknown device',
    lastActive: 'Last active',
    revokeSession: 'Sign out device',
    sessionsUnavailable:
      'Device management requires authentication integration.',

    activity: 'Login activity',
    activityDesc:
      'Review recent sign-in activity for your account.',
    noActivity:
      'Login activity is not available yet.',
    activityUnavailable:
      'Login activity requires authentication integration.',

    alerts: 'Security alerts',
    alertsDesc:
      'Receive important account security notifications.',
    alertsUnavailable:
      'Security alert preferences are not available yet.',
    alertsEnabled: 'Security alerts enabled',
    alertsDisabled: 'Security alerts disabled',

    signOut: 'Sign out everywhere',
    signOutDesc:
      'End your other active sessions across devices.',
    signOutButton: 'Sign out other devices',
    signOutUnavailable:
      'Session revocation requires authentication integration.',
    signOutConfirmTitle: 'Sign out other devices?',
    signOutConfirmDesc:
      'This will end other active sessions if your authentication provider supports this action.',
    confirmSignOut: 'Confirm sign out',
    signOutSuccess:
      'Other supported sessions have been signed out.',
    signOutFailed:
      'Unable to sign out other devices.',

    unavailable: 'Not connected',
    loading: 'Please wait...',
    close: 'Close',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    securityNote:
      'Account protection is managed by your authentication provider.',
  },

  ar: {
    eyebrow: 'حماية الحساب',
    title: 'الأمان والخصوصية',
    description:
      'تحكم في كيفية حماية حسابك وإدارة الوصول إليه.',
    integrationNotice:
      'تتطلب ميزات الأمان ربط نظام المصادقة. لا يتم إجراء أي تغييرات أمنية على الحساب حاليًا.',

    password: 'كلمة المرور',
    passwordDesc: 'إدارة كلمة المرور الخاصة بحسابك.',
    changePassword: 'تغيير كلمة المرور',
    currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة',
    confirmPassword: 'تأكيد كلمة المرور الجديدة',
    passwordHint:
      'استخدم 12 حرفًا على الأقل للحصول على كلمة مرور أقوى.',
    passwordRequired: 'جميع حقول كلمة المرور مطلوبة.',
    passwordLength:
      'يجب أن تتكون كلمة المرور الجديدة من 12 حرفًا على الأقل.',
    passwordMismatch: 'كلمتا المرور الجديدتان غير متطابقتين.',
    passwordSame:
      'اختر كلمة مرور مختلفة عن كلمة المرور الحالية.',
    passwordUnavailable:
      'تغيير كلمة المرور غير مرتبط بنظام المصادقة حاليًا.',
    passwordUpdated: 'تم تحديث كلمة المرور.',
    passwordFailed:
      'تعذر تحديث كلمة المرور. حاول مرة أخرى.',
    savePassword: 'تحديث كلمة المرور',
    cancel: 'إلغاء',

    twoFactor: 'المصادقة الثنائية',
    twoFactorDesc:
      'أضف خطوة تحقق إضافية عند تسجيل الدخول.',
    twoFactorEnabled: 'مفعّلة',
    twoFactorDisabled: 'غير مهيأة',
    manage2FA: 'إدارة المصادقة الثنائية',
    twoFactorUnavailable:
      'إعداد المصادقة الثنائية غير متاح حاليًا.',

    sessions: 'الجلسات النشطة',
    sessionsDesc:
      'راجع الأجهزة المسجّل دخولها إلى حسابك.',
    noSessions:
      'معلومات الجلسات غير متاحة حاليًا.',
    currentDevice: 'الجهاز الحالي',
    unknownDevice: 'جهاز غير معروف',
    lastActive: 'آخر نشاط',
    revokeSession: 'تسجيل خروج الجهاز',
    sessionsUnavailable:
      'تتطلب إدارة الأجهزة ربط نظام المصادقة.',

    activity: 'سجل تسجيل الدخول',
    activityDesc:
      'راجع عمليات تسجيل الدخول الأخيرة إلى حسابك.',
    noActivity:
      'سجل تسجيل الدخول غير متاح حاليًا.',
    activityUnavailable:
      'يتطلب سجل تسجيل الدخول ربط نظام المصادقة.',

    alerts: 'تنبيهات الأمان',
    alertsDesc:
      'استقبل إشعارات مهمة تتعلق بأمان حسابك.',
    alertsUnavailable:
      'تفضيلات تنبيهات الأمان غير متاحة حاليًا.',
    alertsEnabled: 'تنبيهات الأمان مفعّلة',
    alertsDisabled: 'تنبيهات الأمان معطّلة',

    signOut: 'تسجيل الخروج من جميع الأجهزة',
    signOutDesc:
      'إنهاء جلسات تسجيل الدخول الأخرى على الأجهزة المختلفة.',
    signOutButton: 'تسجيل خروج الأجهزة الأخرى',
    signOutUnavailable:
      'يتطلب إنهاء الجلسات ربط نظام المصادقة.',
    signOutConfirmTitle:
      'هل تريد تسجيل خروج الأجهزة الأخرى؟',
    signOutConfirmDesc:
      'سيؤدي هذا الإجراء إلى إنهاء الجلسات الأخرى إذا كان نظام المصادقة يدعم ذلك.',
    confirmSignOut: 'تأكيد تسجيل الخروج',
    signOutSuccess:
      'تم تسجيل خروج الجلسات الأخرى المدعومة.',
    signOutFailed:
      'تعذر تسجيل خروج الأجهزة الأخرى.',

    unavailable: 'غير مرتبط',
    loading: 'يرجى الانتظار...',
    close: 'إغلاق',
    showPassword: 'إظهار كلمة المرور',
    hidePassword: 'إخفاء كلمة المرور',
    securityNote:
      'تتم إدارة حماية الحساب من خلال مزود المصادقة.',
  },
}

function localize(value, language) {
  if (typeof value === 'string') return value

  if (value && typeof value === 'object') {
    return value[language] || value.en || value.ar || ''
  }

  return ''
}

function SecurityItem({
  icon: Icon,
  title,
  description,
  children,
  danger = false,
}) {
  return (
    <div
      className={[
        'security-settings__item',
        danger ? 'security-settings__item--danger' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="security-settings__item-icon">
        <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
      </div>

      <div className="security-settings__item-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className="security-settings__item-action">
        {children}
      </div>
    </div>
  )
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  t,
  autoComplete,
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="security-settings__field">
      <label htmlFor={id}>{label}</label>

      <div className="security-settings__password-input">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          required
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={
            visible ? t.hidePassword : t.showPassword
          }
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOff size={17} aria-hidden="true" />
          ) : (
            <Eye size={17} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  )
}

export default function SecuritySettings({
  language = 'en',
  securityData = null,
  onChangePassword,
  onSignOutOtherSessions,
  onManageTwoFactor,
  className = '',
}) {
  const currentLanguage = language === 'ar' ? 'ar' : 'en'
  const isArabic = currentLanguage === 'ar'
  const t = translations[currentLanguage]

  const [passwordModalOpen, setPasswordModalOpen] =
    useState(false)

  const [signOutModalOpen, setSignOutModalOpen] =
    useState(false)

  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  })

  const [passwordError, setPasswordError] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [busy, setBusy] = useState(false)

  const canChangePassword =
    typeof onChangePassword === 'function'

  const canManageTwoFactor =
    typeof onManageTwoFactor === 'function'

  const canSignOutOtherSessions =
    typeof onSignOutOtherSessions === 'function'

  const twoFactorEnabled =
    securityData?.twoFactorEnabled === true

  const sessions = Array.isArray(securityData?.sessions)
    ? securityData.sessions
    : []

  const activity = Array.isArray(securityData?.loginActivity)
    ? securityData.loginActivity
    : []

  const closePasswordModal = () => {
    if (busy) return

    setPasswordModalOpen(false)
    setPasswordError('')
    setPasswords({
      current: '',
      next: '',
      confirm: '',
    })
  }

  const handlePasswordSubmit = async (event) => {
    event.preventDefault()

    if (!canChangePassword || busy) return

    const { current, next, confirm } = passwords

    if (!current || !next || !confirm) {
      setPasswordError(t.passwordRequired)
      return
    }

    if (next.length < 12) {
      setPasswordError(t.passwordLength)
      return
    }

    if (next !== confirm) {
      setPasswordError(t.passwordMismatch)
      return
    }

    if (current === next) {
      setPasswordError(t.passwordSame)
      return
    }

    setBusy(true)
    setPasswordError('')

    try {
      await onChangePassword({
        currentPassword: current,
        newPassword: next,
      })

      setFeedback({
        type: 'success',
        message: t.passwordUpdated,
      })

      setPasswordModalOpen(false)
      setPasswords({
        current: '',
        next: '',
        confirm: '',
      })
    } catch {
      setPasswordError(t.passwordFailed)
    } finally {
      setBusy(false)
    }
  }

  const handleSignOutOtherSessions = async () => {
    if (!canSignOutOtherSessions || busy) return

    setBusy(true)

    try {
      await onSignOutOtherSessions()

      setFeedback({
        type: 'success',
        message: t.signOutSuccess,
      })

      setSignOutModalOpen(false)
    } catch {
      setFeedback({
        type: 'error',
        message: t.signOutFailed,
      })
    } finally {
      setBusy(false)
    }
  }

  const handleTwoFactor = async () => {
    if (!canManageTwoFactor || busy) return

    setBusy(true)

    try {
      await onManageTwoFactor()
    } finally {
      setBusy(false)
    }
  }

  return (
    <section
      className={`security-settings ${className}`.trim()}
      dir={isArabic ? 'rtl' : 'ltr'}
      lang={currentLanguage}
      aria-labelledby="security-settings-title"
    >
      {/* HEADER */}

      <div className="security-settings__heading">
        <div>
          <span className="security-settings__eyebrow">
            {t.eyebrow}
          </span>

          <h2 id="security-settings-title">
            {t.title}
          </h2>

          <p>{t.description}</p>
        </div>

        <span className="security-settings__heading-icon">
          <ShieldCheck size={23} aria-hidden="true" />
        </span>
      </div>

      {/* INTEGRATION NOTICE */}

      <div className="security-settings__notice">
        <Info size={18} aria-hidden="true" />
        <p>{t.integrationNotice}</p>
      </div>

      {/* PASSWORD */}

      <SecurityItem
        icon={LockKeyhole}
        title={t.password}
        description={t.passwordDesc}
      >
        <button
          type="button"
          className="security-settings__action-button"
          disabled={!canChangePassword || busy}
          onClick={() => setPasswordModalOpen(true)}
          title={
            !canChangePassword
              ? t.passwordUnavailable
              : undefined
          }
        >
          {t.changePassword}
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </SecurityItem>

      {/* TWO-FACTOR AUTHENTICATION */}

      <SecurityItem
        icon={KeyRound}
        title={t.twoFactor}
        description={t.twoFactorDesc}
      >
        <span
          className={`security-settings__status ${
            twoFactorEnabled
              ? 'security-settings__status--enabled'
              : ''
          }`}
        >
          {twoFactorEnabled
            ? t.twoFactorEnabled
            : t.twoFactorDisabled}
        </span>

        <button
          type="button"
          className="security-settings__icon-button"
          disabled={!canManageTwoFactor || busy}
          onClick={handleTwoFactor}
          aria-label={t.manage2FA}
          title={
            !canManageTwoFactor
              ? t.twoFactorUnavailable
              : t.manage2FA
          }
        >
          <ChevronRight size={17} aria-hidden="true" />
        </button>
      </SecurityItem>

      {/* ACTIVE SESSIONS */}

      <div className="security-settings__section">
        <div className="security-settings__section-heading">
          <MonitorSmartphone
            size={19}
            aria-hidden="true"
          />

          <div>
            <h3>{t.sessions}</h3>
            <p>{t.sessionsDesc}</p>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="security-settings__empty">
            <MonitorSmartphone
              size={24}
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <p>{t.noSessions}</p>
          </div>
        ) : (
          <div className="security-settings__data-list">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="security-settings__data-row"
              >
                <MonitorSmartphone
                  size={19}
                  aria-hidden="true"
                />

                <div>
                  <strong>
                    {session.device || t.unknownDevice}
                  </strong>

                  {session.lastActive && (
                    <span>
                      {t.lastActive}: {session.lastActive}
                    </span>
                  )}
                </div>

                {session.isCurrent && (
                  <span className="security-settings__status">
                    {t.currentDevice}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOGIN ACTIVITY */}

      <div className="security-settings__section">
        <div className="security-settings__section-heading">
          <History size={19} aria-hidden="true" />

          <div>
            <h3>{t.activity}</h3>
            <p>{t.activityDesc}</p>
          </div>
        </div>

        {activity.length === 0 ? (
          <div className="security-settings__empty">
            <History
              size={24}
              strokeWidth={1.5}
              aria-hidden="true"
            />

            <p>{t.noActivity}</p>
          </div>
        ) : (
          <div className="security-settings__data-list">
            {activity.map((entry) => (
              <div
                key={entry.id}
                className="security-settings__data-row"
              >
                <History size={18} aria-hidden="true" />

                <div>
                  <strong>
                    {localize(entry.description, currentLanguage)}
                  </strong>
                  <span>{entry.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECURITY ALERTS */}

      <SecurityItem
        icon={BellRing}
        title={t.alerts}
        description={t.alertsDesc}
      >
        <span className="security-settings__status">
          {t.unavailable}
        </span>
      </SecurityItem>

      {/* SIGN OUT EVERYWHERE */}

      <div className="security-settings__danger-zone">
        <SecurityItem
          icon={LogOut}
          title={t.signOut}
          description={t.signOutDesc}
          danger
        >
          <button
            type="button"
            className="security-settings__danger-button"
            disabled={!canSignOutOtherSessions || busy}
            onClick={() => setSignOutModalOpen(true)}
            title={
              !canSignOutOtherSessions
                ? t.signOutUnavailable
                : undefined
            }
          >
            {t.signOutButton}
          </button>
        </SecurityItem>
      </div>

      {/* FEEDBACK */}

      {feedback && (
        <div
          className={`security-settings__feedback security-settings__feedback--${feedback.type}`}
          role={
            feedback.type === 'error'
              ? 'alert'
              : 'status'
          }
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 size={18} aria-hidden="true" />
          ) : (
            <AlertCircle size={18} aria-hidden="true" />
          )}

          <span>{feedback.message}</span>

          <button
            type="button"
            onClick={() => setFeedback(null)}
            aria-label={t.close}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <p className="security-settings__footer-note">
        <ShieldCheck size={15} aria-hidden="true" />
        {t.securityNote}
      </p>

      {/* PASSWORD MODAL */}

      {passwordModalOpen && (
        <div
          className="security-settings__modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePasswordModal()
            }
          }}
        >
          <div
            className="security-settings__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="security-password-modal-title"
          >
            <div className="security-settings__modal-heading">
              <h3 id="security-password-modal-title">
                {t.changePassword}
              </h3>

              <button
                type="button"
                onClick={closePasswordModal}
                disabled={busy}
                aria-label={t.close}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <PasswordField
                id="security-current-password"
                label={t.currentPassword}
                value={passwords.current}
                t={t}
                autoComplete="current-password"
                onChange={(value) =>
                  setPasswords((current) => ({
                    ...current,
                    current: value,
                  }))
                }
              />

              <PasswordField
                id="security-new-password"
                label={t.newPassword}
                value={passwords.next}
                t={t}
                autoComplete="new-password"
                onChange={(value) =>
                  setPasswords((current) => ({
                    ...current,
                    next: value,
                  }))
                }
              />

              <PasswordField
                id="security-confirm-password"
                label={t.confirmPassword}
                value={passwords.confirm}
                t={t}
                autoComplete="new-password"
                onChange={(value) =>
                  setPasswords((current) => ({
                    ...current,
                    confirm: value,
                  }))
                }
              />

              <p className="security-settings__password-hint">
                {t.passwordHint}
              </p>

              {passwordError && (
                <p
                  className="security-settings__form-error"
                  role="alert"
                >
                  <AlertCircle size={16} />
                  {passwordError}
                </p>
              )}

              <div className="security-settings__modal-actions">
                <button
                  type="button"
                  className="security-settings__secondary-button"
                  onClick={closePasswordModal}
                  disabled={busy}
                >
                  {t.cancel}
                </button>

                <button
                  type="submit"
                  className="security-settings__primary-button"
                  disabled={busy}
                >
                  {busy && (
                    <LoaderCircle
                      size={16}
                      className="security-settings__spinner"
                    />
                  )}

                  {busy ? t.loading : t.savePassword}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SIGN OUT CONFIRMATION */}

      {signOutModalOpen && (
        <div className="security-settings__modal-backdrop">
          <div
            className="security-settings__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="security-signout-modal-title"
          >
            <div className="security-settings__modal-heading">
              <h3 id="security-signout-modal-title">
                {t.signOutConfirmTitle}
              </h3>

              <button
                type="button"
                disabled={busy}
                onClick={() => setSignOutModalOpen(false)}
                aria-label={t.close}
              >
                <X size={20} />
              </button>
            </div>

            <p className="security-settings__modal-description">
              {t.signOutConfirmDesc}
            </p>

            <div className="security-settings__modal-actions">
              <button
                type="button"
                className="security-settings__secondary-button"
                disabled={busy}
                onClick={() => setSignOutModalOpen(false)}
              >
                {t.cancel}
              </button>

              <button
                type="button"
                className="security-settings__confirm-danger"
                disabled={busy}
                onClick={handleSignOutOtherSessions}
              >
                {busy ? t.loading : t.confirmSignOut}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
