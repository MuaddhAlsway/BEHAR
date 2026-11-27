
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  FileText,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  X,
} from 'lucide-react'

import '../../../styles/student/payments/refund-request-modal.css'

const REFUND_REASONS = [
  { value: '', label: 'Select a reason' },
  { value: 'accidental_purchase', label: 'Purchased by mistake' },
  { value: 'course_expectations', label: 'Course did not meet expectations' },
  { value: 'technical_issues', label: 'Technical issues accessing the course' },
  { value: 'duplicate_purchase', label: 'Duplicate purchase' },
  { value: 'content_quality', label: 'Course content quality' },
  { value: 'other', label: 'Other reason' },
]

function formatMoney(value, currency, locale) {
  if (value === null || value === undefined || value === '') {
    return '—'
  }

  const amount = Number(value)

  if (!Number.isFinite(amount)) return '—'

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

function formatDate(value, locale) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  try {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  } catch {
    return '—'
  }
}

function getCourseTitle(item) {
  return item.courseTitle || item.title || 'Course'
}

export default function RefundRequestModal({
  order,
  isOpen = false,
  onClose,
  onSubmitRefund,
  currency = 'SAR',
  locale = 'en-SA',
  isSubmitting = false,
  submitError = '',
  refundPolicyText = '',
}) {
  const titleId = useId()
  const descriptionId = useId()
  const reasonId = useId()
  const detailsId = useId()
  const policyId = useId()
  const errorId = useId()

  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [acceptedPolicy, setAcceptedPolicy] = useState(false)
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)

  const orderCurrency = order?.currency || currency
  const orderNumber = order?.orderNumber || order?.id || '—'
  const items = Array.isArray(order?.items) ? order.items : []

  const orderStatus = String(order?.status || '')
    .toLowerCase()
    .replace(/[\s-]+/g, '_')

  const eligibleStatus = ['paid', 'partially_refunded'].includes(
    orderStatus
  )

  const isEligible =
    eligibleStatus && order?.refundEligible === true

  const refundAmount = order?.refundableAmount

  const validAmount =
    refundAmount !== null &&
    refundAmount !== undefined &&
    Number.isFinite(Number(refundAmount)) &&
    Number(refundAmount) > 0

  const hasSubmitHandler = typeof onSubmitRefund === 'function'

  const canSubmit =
    isEligible &&
    validAmount &&
    Boolean(reason) &&
    acceptedPolicy &&
    hasSubmitHandler &&
    !isSubmitting

  const reasonError = attemptedSubmit && !reason
  const policyError = attemptedSubmit && !acceptedPolicy

  useEffect(() => {
    if (!isOpen || !order) return

    setReason('')
    setDetails('')
    setAcceptedPolicy(false)
    setAttemptedSubmit(false)
  }, [isOpen, order?.id, order?.orderNumber])

  useEffect(() => {
    if (!isOpen || !order) return

    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const selector = [
      'button:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isSubmitting) {
        event.preventDefault()
        onClose?.()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll(selector) || []
      ).filter((element) => element.getClientRects().length > 0)

      if (!focusable.length) {
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
  }, [isOpen, order, onClose, isSubmitting])

  if (!isOpen || !order) return null

  const handleBackdropClick = (event) => {
    if (
      event.target === event.currentTarget &&
      !isSubmitting
    ) {
      onClose?.()
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setAttemptedSubmit(true)

    if (!canSubmit) return

    onSubmitRefund({
      orderId: order.id,
      orderNumber,
      reason,
      details: details.trim(),
      requestedAmount: Number(refundAmount),
      currency: orderCurrency,
      policyAccepted: true,
    })
  }

  return createPortal(
    <div
      className="refund-request-overlay"
      onMouseDown={handleBackdropClick}
    >
      <section
        ref={dialogRef}
        className="refund-request-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        dir={locale.startsWith('ar') ? 'rtl' : 'ltr'}
      >
        {/* Header */}

        <header className="refund-request-modal__header">
          <div className="refund-request-modal__heading">
            <span className="refund-request-modal__eyebrow">
              <RotateCcw size={14} />
              Billing assistance
            </span>

            <h2 id={titleId}>Request a refund</h2>

            <p id={descriptionId}>
              Tell us why you would like to request a refund.
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="refund-request-modal__close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close refund request"
          >
            <X size={20} />
          </button>
        </header>

        <form
          className="refund-request-modal__form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="refund-request-modal__body">

            {/* Order summary */}

            <div className="refund-request-modal__order">
              <div className="refund-request-modal__order-top">
                <span className="refund-request-modal__order-label">
                  <FileText size={14} />
                  Refund for order
                </span>

                <strong>{orderNumber}</strong>
              </div>

              <div className="refund-request-modal__order-content">
                <div className="refund-request-modal__order-icon">
                  <BookOpen size={21} />
                </div>

                <div className="refund-request-modal__order-info">
                  <strong>
                    {items.length === 1
                      ? getCourseTitle(items[0])
                      : `${items.length} purchased courses`}
                  </strong>

                  <span>
                    <CalendarDays size={13} />
                    Purchased {formatDate(
                      order.paidAt || order.createdAt,
                      locale
                    )}
                  </span>
                </div>
              </div>

              <div className="refund-request-modal__order-bottom">
                <div>
                  <span>Requested refund amount</span>
                  <strong>
                    {formatMoney(
                      refundAmount,
                      orderCurrency,
                      locale
                    )}
                  </strong>
                </div>

                <span className="refund-request-modal__amount-note">
                  <CreditCard size={14} />
                  Subject to review
                </span>
              </div>
            </div>

            {/* Eligibility */}

            <div
              className={`refund-request-modal__eligibility ${
                isEligible && validAmount
                  ? 'refund-request-modal__eligibility--eligible'
                  : 'refund-request-modal__eligibility--ineligible'
              }`}
            >
              {isEligible && validAmount ? (
                <CheckCircle2 size={18} />
              ) : (
                <AlertCircle size={18} />
              )}

              <div>
                <strong>
                  {isEligible && validAmount
                    ? 'Eligible to request a refund'
                    : 'Refund request unavailable'}
                </strong>

                <p>
                  {isEligible && validAmount
                    ? 'You can submit a request for review. Approval is not guaranteed.'
                    : 'This order is not currently eligible for a refund request, or the refundable amount is unavailable.'}
                </p>
              </div>
            </div>

            {/* Reason */}

            <div className="refund-request-modal__field">
              <label htmlFor={reasonId}>
                Reason for refund
                <span aria-hidden="true">*</span>
              </label>

              <div className="refund-request-modal__select-wrap">
                <select
                  id={reasonId}
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  disabled={!isEligible || isSubmitting}
                  aria-invalid={reasonError}
                  aria-describedby={
                    reasonError ? `${reasonId}-error` : undefined
                  }
                >
                  {REFUND_REASONS.map((option) => (
                    <option
                      key={option.value || 'placeholder'}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

                <ChevronDown size={17} aria-hidden="true" />
              </div>

              {reasonError && (
                <p
                  id={`${reasonId}-error`}
                  className="refund-request-modal__field-error"
                >
                  Please select a refund reason.
                </p>
              )}
            </div>

            {/* Additional details */}

            <div className="refund-request-modal__field">
              <div className="refund-request-modal__label-row">
                <label htmlFor={detailsId}>
                  Additional details
                </label>

                <span>Optional</span>
              </div>

              <textarea
                id={detailsId}
                value={details}
                onChange={(event) =>
                  setDetails(event.target.value.slice(0, 1000))
                }
                placeholder="Provide more details about your refund request..."
                rows={4}
                maxLength={1000}
                disabled={!isEligible || isSubmitting}
              />

              <div className="refund-request-modal__field-footer">
                <span>
                  This information helps our team review your request.
                </span>

                <span>{details.length}/1000</span>
              </div>
            </div>

            {/* Policy */}

            <div className="refund-request-modal__policy">
              <div className="refund-request-modal__policy-heading">
                <ShieldCheck size={18} />
                <strong>Refund policy</strong>
              </div>

              <p>
                {refundPolicyText ||
                  'Refund requests are reviewed according to the applicable BEHAR refund policy. Submitting a request does not guarantee approval or immediate repayment.'}
              </p>

              <div className="refund-request-modal__policy-note">
                <Clock3 size={15} />
                <span>
                  Review and repayment times depend on the
                  applicable policy and payment provider.
                </span>
              </div>
            </div>

            {/* Agreement */}

            <div className="refund-request-modal__agreement">
              <label htmlFor={policyId}>
                <input
                  id={policyId}
                  type="checkbox"
                  checked={acceptedPolicy}
                  onChange={(event) =>
                    setAcceptedPolicy(event.target.checked)
                  }
                  disabled={!isEligible || isSubmitting}
                  aria-invalid={policyError}
                  aria-describedby={
                    policyError ? `${policyId}-error` : undefined
                  }
                />

                <span className="refund-request-modal__checkbox">
                  <Check size={13} />
                </span>

                <span className="refund-request-modal__agreement-text">
                  I understand that my refund request is subject
                  to review and the applicable refund policy.
                </span>
              </label>

              {policyError && (
                <p
                  id={`${policyId}-error`}
                  className="refund-request-modal__field-error"
                >
                  Please acknowledge the refund policy.
                </p>
              )}
            </div>

            {/* Submission error */}

            {submitError && (
              <div
                id={errorId}
                className="refund-request-modal__submit-error"
                role="alert"
              >
                <AlertCircle size={17} />
                <span>{submitError}</span>
              </div>
            )}

            {/* Security */}

            <div className="refund-request-modal__security">
              <LockKeyhole size={15} />
              <span>
                Your request will be associated with this order.
                No payment credentials are required.
              </span>
            </div>
          </div>

          {/* Footer */}

          <footer className="refund-request-modal__footer">
            <button
              type="button"
              className="refund-request-modal__cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <ArrowLeft size={16} />
              Cancel
            </button>

            <button
              type="submit"
              className="refund-request-modal__submit"
              disabled={
                !isEligible ||
                !validAmount ||
                !hasSubmitHandler ||
                isSubmitting
              }
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="refund-request-modal__spinner" />
                  Submitting...
                </>
              ) : (
                <>
                  <RotateCcw size={16} />
                  Submit refund request
                </>
              )}
            </button>
          </footer>
        </form>
      </section>
    </div>,
    document.body
  )
}
