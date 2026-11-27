
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  FileText,
  Headphones,
  LoaderCircle,
  LockKeyhole,
  Paperclip,
  RotateCcw,
  Send,
  ShieldCheck,
  UploadCloud,
  X,
} from 'lucide-react'

import '../../../styles/student/payments/billing-support-modal.css'

const CATEGORIES = [
  { value: 'payment_issue', label: 'Payment issue' },
  { value: 'refund_inquiry', label: 'Refund inquiry' },
  { value: 'receipt_request', label: 'Receipt request' },
  { value: 'duplicate_charge', label: 'Duplicate charge' },
  { value: 'other', label: 'Other billing question' },
]

const MAX_FILES = 3
const MAX_FILE_SIZE = 5 * 1024 * 1024

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]

const MIN_MESSAGE_LENGTH = 20
const MAX_MESSAGE_LENGTH = 2000
const MAX_SUBJECT_LENGTH = 120

function getCategory(value) {
  return CATEGORIES.some((item) => item.value === value)
    ? value
    : 'payment_issue'
}

function getInitialCategory(refund, order, initialCategory) {
  if (refund) return 'refund_inquiry'
  if (initialCategory) return getCategory(initialCategory)
  if (order) return 'payment_issue'
  return 'payment_issue'
}

function formatFileSize(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function createInitialForm(refund, order, initialCategory) {
  return {
    category: getInitialCategory(refund, order, initialCategory),
    subject: '',
    message: '',
    attachments: [],
  }
}

export default function BillingSupportModal({
  isOpen = false,
  onClose,
  onSubmit,
  order = null,
  refund = null,
  initialCategory = 'payment_issue',
  student = null,
  isSubmitting = false,
  submitError = '',
  submitSuccess = false,
}) {
  const titleId = useId()
  const descriptionId = useId()
  const fileInputId = useId()

  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const fileInputRef = useRef(null)
  const subjectRef = useRef(null)

  const [form, setForm] = useState(() =>
    createInitialForm(refund, order, initialCategory)
  )
  const [errors, setErrors] = useState({})
  const [attachmentError, setAttachmentError] = useState('')

  const orderId = order?.id || refund?.orderId || null
  const orderNumber =
    order?.orderNumber || refund?.orderNumber || null

  const refundId = refund?.id || null
  const refundNumber =
    refund?.refundNumber || refund?.id || null

  const canSubmit = typeof onSubmit === 'function'

  const isSuccess = submitSuccess === true

  // Reset form when opening a new support request.
  useEffect(() => {
    if (!isOpen) return

    setForm(createInitialForm(refund, order, initialCategory))
    setErrors({})
    setAttachmentError('')
  }, [isOpen, refund, order, initialCategory])

  // Modal focus management and background scroll lock.
  useEffect(() => {
    if (!isOpen) return

    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        if (!isSubmitting) {
          event.preventDefault()
          onClose?.()
        }
        return
      }

      if (event.key !== 'Tab') return

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll(selector) || []
      ).filter((element) => element.getClientRects().length > 0)

      if (focusable.length === 0) {
        event.preventDefault()
        dialogRef.current?.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !dialogRef.current?.contains(document.activeElement))
      ) {
        event.preventDefault()
        last.focus()
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !dialogRef.current?.contains(document.activeElement))
      ) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow

      if (previousFocus instanceof HTMLElement) {
        previousFocus.focus()
      }
    }
  }, [isOpen, isSubmitting, onClose])

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [field]: '',
    }))
  }

  function handleFiles(event) {
    const incoming = Array.from(event.target.files || [])

    if (!incoming.length) return

    const nextFiles = [...form.attachments]
    let error = ''

    for (const file of incoming) {
      if (nextFiles.length >= MAX_FILES) {
        error = `You can attach up to ${MAX_FILES} files.`
        break
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        error = 'Only JPG, PNG, WebP, and PDF files are supported.'
        continue
      }

      if (file.size > MAX_FILE_SIZE) {
        error = `${file.name} exceeds the 5 MB file limit.`
        continue
      }

      const duplicate = nextFiles.some(
        (existing) =>
          existing.name === file.name &&
          existing.size === file.size &&
          existing.lastModified === file.lastModified
      )

      if (!duplicate) nextFiles.push(file)
    }

    setForm((previous) => ({
      ...previous,
      attachments: nextFiles,
    }))

    setAttachmentError(error)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function removeAttachment(index) {
    setForm((previous) => ({
      ...previous,
      attachments: previous.attachments.filter(
        (_, fileIndex) => fileIndex !== index
      ),
    }))

    setAttachmentError('')
  }

  function validateForm() {
    const nextErrors = {}

    const subject = form.subject.trim()
    const message = form.message.trim()

    if (!CATEGORIES.some((item) => item.value === form.category)) {
      nextErrors.category = 'Please select a valid category.'
    }

    if (!subject) {
      nextErrors.subject = 'Please enter a subject.'
    } else if (subject.length > MAX_SUBJECT_LENGTH) {
      nextErrors.subject = 'The subject is too long.'
    }

    if (!message) {
      nextErrors.message = 'Please describe your issue.'
    } else if (message.length < MIN_MESSAGE_LENGTH) {
      nextErrors.message = 'Please enter at least 20 characters.'
    } else if (message.length > MAX_MESSAGE_LENGTH) {
      nextErrors.message = 'The message is too long.'
    }

    setErrors(nextErrors)

    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (isSubmitting || isSuccess || !canSubmit) return
    if (!validateForm()) return

    onSubmit({
      category: form.category,
      subject: form.subject.trim(),
      message: form.message.trim(),
      orderId,
      refundId,
      attachments: [...form.attachments],
    })
  }

  function handleBackdrop(event) {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose?.()
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className="billing-support-overlay"
      onMouseDown={handleBackdrop}
    >
      <section
        ref={dialogRef}
        className="billing-support-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        <header className="billing-support-modal__header">
          <div className="billing-support-modal__heading">
            <span className="billing-support-modal__heading-icon">
              <Headphones size={20} />
            </span>

            <div>
              <span className="billing-support-modal__eyebrow">
                BEHAR SUPPORT
              </span>
              <h2 id={titleId}>Billing support</h2>
              <p id={descriptionId}>
                Tell us about your billing question or issue.
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="billing-support-modal__close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close billing support"
          >
            <X size={19} />
          </button>
        </header>

        {isSuccess ? (
          <div className="billing-support-modal__success" role="status">
            <span className="billing-support-modal__success-icon">
              <CheckCircle2 size={31} />
            </span>

            <h3>Support request submitted</h3>

            <p>
              Your request has been received. You can close this
              window.
            </p>

            <button type="button" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form
            className="billing-support-modal__form"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="billing-support-modal__body">
              {/* Related transaction */}

              {(orderId || refundId) && (
                <div className="billing-support-modal__related">
                  <div className="billing-support-modal__related-title">
                    <FileText size={15} />
                    <span>Related transaction</span>
                  </div>

                  <div className="billing-support-modal__related-items">
                    {orderId && (
                      <div>
                        <CreditCard size={15} />
                        <span>Order</span>
                        <strong>{orderNumber || orderId}</strong>
                      </div>
                    )}

                    {refundId && (
                      <div>
                        <RotateCcw size={15} />
                        <span>Refund</span>
                        <strong>{refundNumber}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Category */}

              <div className="billing-support-modal__field">
                <label htmlFor={`${fileInputId}-category`}>
                  Support category <span>*</span>
                </label>

                <div className="billing-support-modal__select-wrap">
                  <select
                    id={`${fileInputId}-category`}
                    value={form.category}
                    onChange={(event) =>
                      updateField('category', event.target.value)
                    }
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.category)}
                  >
                    {CATEGORIES.map((category) => (
                      <option
                        key={category.value}
                        value={category.value}
                      >
                        {category.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDown size={16} />
                </div>

                {errors.category && (
                  <span className="billing-support-modal__error">
                    {errors.category}
                  </span>
                )}
              </div>

              {/* Subject */}

              <div className="billing-support-modal__field">
                <label htmlFor={`${fileInputId}-subject`}>
                  Subject <span>*</span>
                </label>

                <input
                  ref={subjectRef}
                  id={`${fileInputId}-subject`}
                  type="text"
                  value={form.subject}
                  onChange={(event) =>
                    updateField('subject', event.target.value)
                  }
                  maxLength={MAX_SUBJECT_LENGTH}
                  placeholder="Briefly describe your issue"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.subject)}
                />

                {errors.subject && (
                  <span className="billing-support-modal__error">
                    {errors.subject}
                  </span>
                )}
              </div>

              {/* Message */}

              <div className="billing-support-modal__field">
                <div className="billing-support-modal__label-row">
                  <label htmlFor={`${fileInputId}-message`}>
                    Message <span>*</span>
                  </label>

                  <span>
                    {form.message.length}/{MAX_MESSAGE_LENGTH}
                  </span>
                </div>

                <textarea
                  id={`${fileInputId}-message`}
                  value={form.message}
                  onChange={(event) =>
                    updateField('message', event.target.value)
                  }
                  placeholder="Explain what happened and how we can help..."
                  rows={5}
                  maxLength={MAX_MESSAGE_LENGTH}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.message)}
                />

                {errors.message && (
                  <span className="billing-support-modal__error">
                    {errors.message}
                  </span>
                )}
              </div>

              {/* Attachments */}

              <div className="billing-support-modal__field">
                <label htmlFor={fileInputId}>
                  Attachments <em>Optional</em>
                </label>

                <input
                  ref={fileInputRef}
                  id={fileInputId}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.pdf"
                  multiple
                  onChange={handleFiles}
                  disabled={
                    isSubmitting ||
                    form.attachments.length >= MAX_FILES
                  }
                  className="billing-support-modal__file-input"
                />

                <label
                  htmlFor={fileInputId}
                  className={`billing-support-modal__upload ${
                    form.attachments.length >= MAX_FILES
                      ? 'billing-support-modal__upload--disabled'
                      : ''
                  }`}
                >
                  <UploadCloud size={23} />
                  <strong>Choose files to attach</strong>
                  <span>JPG, PNG, WebP or PDF · Max 5 MB each</span>
                </label>

                {attachmentError && (
                  <span
                    className="billing-support-modal__error"
                    role="alert"
                  >
                    {attachmentError}
                  </span>
                )}

                {form.attachments.length > 0 && (
                  <div className="billing-support-modal__attachments">
                    {form.attachments.map((file, index) => (
                      <div
                        className="billing-support-modal__attachment"
                        key={`${file.name}-${file.lastModified}-${index}`}
                      >
                        <Paperclip size={15} />

                        <div>
                          <strong>{file.name}</strong>
                          <span>{formatFileSize(file.size)}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          disabled={isSubmitting}
                          aria-label={`Remove ${file.name}`}
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Student identity */}

              {student && (
                <div className="billing-support-modal__identity">
                  <LockKeyhole size={16} />

                  <div>
                    <strong>Submitting as</strong>
                    <span>
                      {student.fullName ||
                        student.name ||
                        student.email ||
                        'Authenticated student'}
                    </span>

                    {student.email &&
                      (student.fullName || student.name) && (
                        <span>{student.email}</span>
                      )}
                  </div>
                </div>
              )}

              {/* Privacy */}

              <div className="billing-support-modal__privacy">
                <ShieldCheck size={17} />

                <p>
                  Do not include passwords, card numbers, CVV codes,
                  or other sensitive payment credentials in your
                  message or attachments.
                </p>
              </div>

              {/* Submission error */}

              {submitError && (
                <div
                  className="billing-support-modal__submit-error"
                  role="alert"
                >
                  <AlertCircle size={17} />
                  <span>{submitError}</span>
                </div>
              )}
            </div>

            <footer className="billing-support-modal__footer">
              <button
                type="button"
                className="billing-support-modal__cancel"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="billing-support-modal__submit"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle
                      size={16}
                      className="billing-support-modal__spinner"
                    />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit request
                  </>
                )}
              </button>
            </footer>
          </form>
        )}
      </section>
    </div>,
    document.body
  )
}
