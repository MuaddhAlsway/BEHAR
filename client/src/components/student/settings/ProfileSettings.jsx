
import { useEffect, useRef, useState } from 'react'
import {
  UserRound,
  Camera,
  Trash2,
  Save,
  RotateCcw,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
} from 'lucide-react'

import '../../../styles/student/settings/profile-settings.css'

const STORAGE_KEY = 'behar-student-profile'
const MAX_AVATAR_SIZE = 2 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

const copy = {
  en: {
    eyebrow: 'PERSONAL DETAILS',
    title: 'Personal information',
    description:
      'Keep your profile up to date and make your learning experience more personal.',
    photoTitle: 'Profile photo',
    photoDescription: 'JPG, PNG or WebP. Maximum 2 MB.',
    changePhoto: 'Change photo',
    removePhoto: 'Remove',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email address',
    emailNote:
      'Email changes will require account verification.',
    phone: 'Phone number',
    phonePlaceholder: '+966 5X XXX XXXX',
    bio: 'About me',
    bioPlaceholder:
      'Tell us about yourself, your interests, and your learning goals...',
    bioHint: 'A short introduction visible on your profile.',
    save: 'Save changes',
    discard: 'Discard changes',
    saved: 'Profile preferences saved on this device.',
    unsaved: 'You have unsaved changes.',
    requiredName: 'Please enter your name.',
    invalidName: 'Name must be 50 characters or fewer.',
    invalidPhone: 'Please enter a valid phone number.',
    invalidBio: 'Bio must be 500 characters or fewer.',
    invalidImage: 'Choose a JPG, PNG or WebP image.',
    largeImage: 'Image must be smaller than 2 MB.',
    imageError: 'Unable to read the selected image.',
    storageError:
      'Unable to save your profile on this device.',
    saveError: 'Please correct the highlighted fields.',
    loading: 'Processing photo...',
    photoAlt: 'Student profile photo',
    previewNote:
      'Profile changes are stored locally until backend integration.',
  },
  ar: {
    eyebrow: 'البيانات الشخصية',
    title: 'المعلومات الشخصية',
    description:
      'حدّث بيانات ملفك الشخصي واجعل تجربتك التعليمية أكثر تخصيصًا.',
    photoTitle: 'الصورة الشخصية',
    photoDescription:
      'JPG أو PNG أو WebP. الحد الأقصى 2 ميجابايت.',
    changePhoto: 'تغيير الصورة',
    removePhoto: 'إزالة',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    email: 'البريد الإلكتروني',
    emailNote:
      'تغيير البريد الإلكتروني سيتطلب التحقق من الحساب.',
    phone: 'رقم الهاتف',
    phonePlaceholder: '+966 5X XXX XXXX',
    bio: 'نبذة عني',
    bioPlaceholder:
      'أخبرنا عن نفسك واهتماماتك وأهدافك التعليمية...',
    bioHint: 'نبذة مختصرة تظهر في ملفك الشخصي.',
    save: 'حفظ التغييرات',
    discard: 'تجاهل التغييرات',
    saved: 'تم حفظ بيانات الملف الشخصي على هذا الجهاز.',
    unsaved: 'لديك تغييرات لم يتم حفظها.',
    requiredName: 'يرجى إدخال الاسم.',
    invalidName: 'يجب ألا يتجاوز الاسم 50 حرفًا.',
    invalidPhone: 'يرجى إدخال رقم هاتف صحيح.',
    invalidBio: 'يجب ألا تتجاوز النبذة 500 حرف.',
    invalidImage: 'اختر صورة JPG أو PNG أو WebP.',
    largeImage: 'يجب أن يكون حجم الصورة أقل من 2 ميجابايت.',
    imageError: 'تعذرت قراءة الصورة المحددة.',
    storageError: 'تعذر حفظ بياناتك على هذا الجهاز.',
    saveError: 'يرجى تصحيح الحقول المحددة.',
    loading: 'جارٍ معالجة الصورة...',
    photoAlt: 'الصورة الشخصية للطالب',
    previewNote:
      'تُحفظ التغييرات محليًا حتى يتم ربط النظام بالخادم.',
  },
}

const EMPTY_PROFILE = {
  firstName: '',
  lastName: '',
  phone: '',
  bio: '',
  avatar: '',
}

function normalizeProfile(value) {
  if (!value || typeof value !== 'object') {
    return { ...EMPTY_PROFILE }
  }

  return {
    firstName:
      typeof value.firstName === 'string'
        ? value.firstName
        : '',
    lastName:
      typeof value.lastName === 'string'
        ? value.lastName
        : '',
    phone:
      typeof value.phone === 'string'
        ? value.phone
        : '',
    bio:
      typeof value.bio === 'string'
        ? value.bio
        : '',
    avatar:
      typeof value.avatar === 'string' &&
      value.avatar.startsWith('data:image/')
        ? value.avatar
        : '',
  }
}

function readStoredProfile(storageKey) {
  try {
    const stored = localStorage.getItem(storageKey)

    if (stored) {
      return normalizeProfile(JSON.parse(stored))
    }
  } catch {
    // Storage may be unavailable or invalid.
  }

  return { ...EMPTY_PROFILE }
}

function validateProfile(profile, t) {
  const errors = {}

  for (const field of ['firstName', 'lastName']) {
    const value = profile[field].trim()

    if (!value) {
      errors[field] = t.requiredName
    } else if (value.length > 50) {
      errors[field] = t.invalidName
    }
  }

  const phone = profile.phone.trim()

  if (
    phone &&
    !/^\+?[0-9\s()-]{7,20}$/.test(phone)
  ) {
    errors.phone = t.invalidPhone
  }

  if (profile.bio.length > 500) {
    errors.bio = t.invalidBio
  }

  return errors
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Invalid image result'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Image reading failed'))
    }

    reader.readAsDataURL(file)
  })
}

export default function ProfileSettings({
  language = 'en',
  student = null,
  className = '',
}) {
  const currentLanguage = language === 'ar' ? 'ar' : 'en'
  const isArabic = currentLanguage === 'ar'
  const t = copy[currentLanguage]

  const inputRef = useRef(null)
  const feedbackTimerRef = useRef(null)

  // Use a stable identity if available to separate local profiles.
  const studentId =
    typeof student?.id === 'string' &&
    /^[a-zA-Z0-9_-]{1,128}$/.test(student.id)
      ? student.id
      : null

  const storageKey = studentId
    ? `${STORAGE_KEY}:${studentId}`
    : null

  const [savedProfile, setSavedProfile] = useState(
    () => normalizeProfile(student)
  )

  const [profile, setProfile] = useState(
    () => normalizeProfile(student)
  )

  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState(null)
  const [processingImage, setProcessingImage] = useState(false)

  const email =
    typeof student?.email === 'string'
      ? student.email
      : ''

  useEffect(() => {
    // Without a stable student identity, do not share
    // personal profile data across anonymous accounts.
    const nextProfile = storageKey
      ? readStoredProfile(storageKey)
      : normalizeProfile(student)

    setSavedProfile(nextProfile)
    setProfile(nextProfile)
    setErrors({})
    setFeedback(null)
  }, [storageKey, student])

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current)
      }
    }
  }, [])

  const isDirty =
    JSON.stringify(profile) !==
    JSON.stringify(savedProfile)

  const showFeedback = (type, message) => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current)
    }

    setFeedback({ type, message })

    feedbackTimerRef.current = setTimeout(() => {
      setFeedback(null)
    }, 4500)
  }

  const updateField = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }))

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }))

    setFeedback(null)
  }

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0]

    event.target.value = ''

    if (!file) return

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      showFeedback('error', t.invalidImage)
      return
    }

    if (file.size > MAX_AVATAR_SIZE) {
      showFeedback('error', t.largeImage)
      return
    }

    setProcessingImage(true)

    try {
      const image = await readImage(file)

      setProfile((current) => ({
        ...current,
        avatar: image,
      }))

      setFeedback(null)
    } catch {
      showFeedback('error', t.imageError)
    } finally {
      setProcessingImage(false)
    }
  }

  const handleRemovePhoto = () => {
    updateField('avatar', '')

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleDiscard = () => {
    setProfile({ ...savedProfile })
    setErrors({})
    setFeedback(null)

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (processingImage) return

    const nextErrors = validateProfile(profile, t)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      showFeedback('error', t.saveError)
      return
    }

    const nextProfile = {
      ...profile,
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      phone: profile.phone.trim(),
      bio: profile.bio.trim(),
    }

    if (!storageKey) {
      showFeedback('error', t.storageError)
      return
    }

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(nextProfile)
      )

      setSavedProfile(nextProfile)
      setProfile(nextProfile)
      setErrors({})

      showFeedback('success', t.saved)
    } catch {
      showFeedback('error', t.storageError)
    }
  }

  return (
    <section
      className={`profile-settings ${className}`.trim()}
      dir={isArabic ? 'rtl' : 'ltr'}
      lang={currentLanguage}
      aria-labelledby="profile-settings-title"
    >
      <div className="profile-settings__heading">
        <div>
          <span className="profile-settings__eyebrow">
            {t.eyebrow}
          </span>

          <h2 id="profile-settings-title">
            {t.title}
          </h2>

          <p>{t.description}</p>
        </div>

        <span className="profile-settings__heading-icon">
          <UserRound
            size={22}
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </span>
      </div>

      <form
        className="profile-settings__form"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* PROFILE PHOTO */}

        <div className="profile-settings__photo-section">
          <div className="profile-settings__avatar">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={t.photoAlt}
              />
            ) : (
              <UserRound
                size={32}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            )}

            <span
              className="profile-settings__avatar-camera"
              aria-hidden="true"
            >
              <Camera size={13} />
            </span>
          </div>

          <div className="profile-settings__photo-info">
            <h3>{t.photoTitle}</h3>
            <p>{t.photoDescription}</p>

            <div className="profile-settings__photo-actions">
              <input
                ref={inputRef}
                id="behar-profile-photo"
                className="profile-settings__file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                disabled={processingImage}
              />

              <button
                type="button"
                className="profile-settings__photo-button"
                onClick={() => inputRef.current?.click()}
                disabled={processingImage}
              >
                {processingImage ? (
                  <LoaderCircle
                    size={15}
                    className="profile-settings__spinner"
                    aria-hidden="true"
                  />
                ) : (
                  <Camera size={15} aria-hidden="true" />
                )}

                <span>
                  {processingImage
                    ? t.loading
                    : t.changePhoto}
                </span>
              </button>

              {profile.avatar && (
                <button
                  type="button"
                  className="profile-settings__remove-button"
                  onClick={handleRemovePhoto}
                  disabled={processingImage}
                >
                  <Trash2 size={15} aria-hidden="true" />
                  {t.removePhoto}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="profile-settings__divider" />

        {/* PERSONAL FIELDS */}

        <div className="profile-settings__fields">
          <div className="profile-settings__field">
            <label htmlFor="profile-first-name">
              {t.firstName}
              <span aria-hidden="true"> *</span>
            </label>

            <input
              id="profile-first-name"
              type="text"
              value={profile.firstName}
              maxLength={51}
              autoComplete="given-name"
              onChange={(event) =>
                updateField('firstName', event.target.value)
              }
              aria-required="true"
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={
                errors.firstName
                  ? 'profile-first-name-error'
                  : undefined
              }
            />

            {errors.firstName && (
              <span
                id="profile-first-name-error"
                className="profile-settings__error"
                role="alert"
              >
                {errors.firstName}
              </span>
            )}
          </div>

          <div className="profile-settings__field">
            <label htmlFor="profile-last-name">
              {t.lastName}
              <span aria-hidden="true"> *</span>
            </label>

            <input
              id="profile-last-name"
              type="text"
              value={profile.lastName}
              maxLength={51}
              autoComplete="family-name"
              onChange={(event) =>
                updateField('lastName', event.target.value)
              }
              aria-required="true"
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={
                errors.lastName
                  ? 'profile-last-name-error'
                  : undefined
              }
            />

            {errors.lastName && (
              <span
                id="profile-last-name-error"
                className="profile-settings__error"
                role="alert"
              >
                {errors.lastName}
              </span>
            )}
          </div>

          <div className="profile-settings__field profile-settings__field--full">
            <label htmlFor="profile-email">
              <Mail size={15} aria-hidden="true" />
              {t.email}
            </label>

            <input
              id="profile-email"
              type="email"
              value={email}
              readOnly
              dir="ltr"
              autoComplete="email"
            />

            <span className="profile-settings__hint">
              {t.emailNote}
            </span>
          </div>

          <div className="profile-settings__field profile-settings__field--full">
            <label htmlFor="profile-phone">
              <Phone size={15} aria-hidden="true" />
              {t.phone}
            </label>

            <input
              id="profile-phone"
              type="tel"
              value={profile.phone}
              placeholder={t.phonePlaceholder}
              autoComplete="tel"
              dir="ltr"
              onChange={(event) =>
                updateField('phone', event.target.value)
              }
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={
                errors.phone
                  ? 'profile-phone-error'
                  : undefined
              }
            />

            {errors.phone && (
              <span
                id="profile-phone-error"
                className="profile-settings__error"
                role="alert"
              >
                {errors.phone}
              </span>
            )}
          </div>

          <div className="profile-settings__field profile-settings__field--full">
            <label htmlFor="profile-bio">
              <FileText size={15} aria-hidden="true" />
              {t.bio}
            </label>

            <textarea
              id="profile-bio"
              rows={5}
              value={profile.bio}
              maxLength={501}
              placeholder={t.bioPlaceholder}
              onChange={(event) =>
                updateField('bio', event.target.value)
              }
              aria-invalid={Boolean(errors.bio)}
              aria-describedby={
                errors.bio
                  ? 'profile-bio-error'
                  : 'profile-bio-hint'
              }
            />

            <div className="profile-settings__bio-meta">
              <span id="profile-bio-hint">
                {t.bioHint}
              </span>

              <span dir="ltr">
                {profile.bio.length}/500
              </span>
            </div>

            {errors.bio && (
              <span
                id="profile-bio-error"
                className="profile-settings__error"
                role="alert"
              >
                {errors.bio}
              </span>
            )}
          </div>
        </div>

        {/* FEEDBACK */}

        {feedback && (
          <div
            className={`profile-settings__feedback profile-settings__feedback--${feedback.type}`}
            role={feedback.type === 'error' ? 'alert' : 'status'}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 size={17} aria-hidden="true" />
            ) : (
              <AlertCircle size={17} aria-hidden="true" />
            )}

            <span>{feedback.message}</span>
          </div>
        )}

        {/* FOOTER */}

        <div className="profile-settings__footer">
          <div className="profile-settings__footer-info">
            {isDirty && (
              <span className="profile-settings__unsaved">
                <span aria-hidden="true" />
                {t.unsaved}
              </span>
            )}

            <p>{t.previewNote}</p>
          </div>

          <div className="profile-settings__actions">
            <button
              type="button"
              className="profile-settings__discard"
              onClick={handleDiscard}
              disabled={!isDirty || processingImage}
            >
              <RotateCcw size={16} aria-hidden="true" />
              {t.discard}
            </button>

            <button
              type="submit"
              className="profile-settings__save"
              disabled={!isDirty || processingImage || !storageKey}
            >
              <Save size={16} aria-hidden="true" />
              {t.save}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
