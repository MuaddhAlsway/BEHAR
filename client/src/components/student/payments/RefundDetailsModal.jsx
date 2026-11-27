
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react'

import '../../../styles/student/payments/refund-details-modal.css'

const STATUS_CONFIG = {
  pending: { label: 'Pending', tone: 'warning' },
  under_review: { label: 'Under review', tone: 'info' },
  approved: { label: 'Approved', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'danger' },
  processing: { label: 'Processing', tone: 'info' },
  refunded: { label: 'Refunded', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
}

const REASONS = {
  accidental_purchase: 'Purchased by mistake',
  course_expectations: 'Course did not meet expectations',
  technical_issues: 'Technical issues',
  duplicate_purchase: 'Duplicate purchase',
  content_quality: 'Course content quality',
  other: 'Other reason',
}

const STATUS_DESCRIPTIONS = {
  pending: 'Your refund request was submitted.',
  under_review: 'Your request is being reviewed.',
  approved: 'Your refund request was approved.',
  rejected: 'Your refund request was rejected.',
  processing: 'Your refund is being processed.',
  refunded: 'Your refund has been processed.',
  cancelled: 'Your refund request was cancelled.',
}

function normalize(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
}

function formatMoney(value, currency, locale) {
  if (value == null || value === '') return '—'

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
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date)
  } catch {
    return '—'
  }
}

function displayValue(value) {
  return value === null || value === undefined || value === ''
    ? '—'
    : String(value)
}

function StatusIcon({ status }) {
  if (status === 'rejected' || status === 'cancelled') {
    return <XCircle size={16} />
  }

  if (status === 'approved' || status === 'refunded') {
    return <CheckCircle2 size={16} />
  }

  if (status === 'processing' || status === 'under_review') {
    return <RotateCcw size={16} />
  }

  return <Clock3 size={16} />
}

export default function RefundDetailsModal({
  refund,
  order = null,
  isOpen = false,
  onClose,
  onContactSupport,
  currency = 'SAR',
  locale = 'en-SA',
  refundPolicyText = '',
}) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)

  const isRTL = locale.toLowerCase().startsWith('ar')
  const statusKey = normalize(refund?.status)
  const status = STATUS_CONFIG[statusKey] || {
    label: 'Unknown',
    tone: 'neutral',
  }

  const refundCurrency = refund?.currency || currency
  const refundNumber = refund?.refundNumber || refund?.id
  const orderNumber =
    refund?.orderNumber || order?.orderNumber || refund?.orderId

  const reasonKey = normalize(refund?.reason)
  const reason = REASONS[reasonKey] || refund?.reason || '—'

  const amount = refund?.requestedAmount ?? refund?.amount
  const paidAmount = refund?.refundedAmount

  const history = Array.isArray(refund?.statusHistory)
    ? refund.statusHistory
        .filter(
          (entry) =>
            entry &&
            STATUS_CONFIG[normalize(entry.status)] &&
            entry.timestamp &&
            !Number.isNaN(new Date(entry.timestamp).getTime())
        )
        .map((entry, index) => ({
          ...entry,
          key: `${normalize(entry.status)}-${entry.timestamp}-${index}`,
          normalizedStatus: normalize(entry.status),
        }))
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() -
            new Date(b.timestamp).getTime()
        )
    : []

  const canContactSupport =
    typeof onContactSupport === 'function'

  useEffect(() => {
    if (!isOpen || !refund) return

    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const focusSelector = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose?.()
        return
      }

      if (event.key !== 'Tab') return

      const elements = Array.from(
        dialogRef.current?.querySelectorAll(focusSelector) || []
      ).filter((element) => element.getClientRects().length > 0)

      if (elements.length === 0) {
        event.preventDefault()
        dialogRef.current?.focus()
        return
      }

      const first = elements[0]
      const last = elements[elements.length - 1]

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
  }, [isOpen, refund, onClose])

  if (!isOpen || !refund) return null

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose?.()
    }
  }

  return createPortal(
    <div
      className="refund-details-overlay"
      onMouseDown={handleBackdropClick}
    >
      <section
        ref={dialogRef}
        className="refund-details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <header className="refund-details-modal__header">
          <div>
            <span className="refund-details-modal__eyebrow">
              <RotateCcw size={14} />
              Refund request
            </span>

            <h2 id={titleId}>Refund details</h2>

            <p id={descriptionId}>
              Review your refund request and its current status.
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="refund-details-modal__close"
            onClick={onClose}
            aria-label="Close refund details"
          >
            <X size={19} />
          </button>
        </header>

        <div className="refund-details-modal__body">
          {/* Reference and status */}

          <div className="refund-details-modal__reference">
            <div>
              <span>Refund reference</span>
              <strong>{displayValue(refundNumber)}</strong>
            </div>

            <span
              className={`refund-details-modal__status refund-details-modal__status--${status.tone}`}
            >
              <StatusIcon status={statusKey} />
              {status.label}
            </span>
          </div>

          {/* Refund amount */}

          <div className="refund-details-modal__amount-card">
            <div className="refund-details-modal__amount-icon">
              <RotateCcw size={21} />
            </div>

            <span>Requested refund amount</span>

            <strong>
              {formatMoney(amount, refundCurrency, locale)}
            </strong>

            <p>
              {statusKey === 'refunded'
                ? 'Refund processing is recorded as completed.'
                : 'Your request is subject to the applicable refund policy.'}
            </p>
          </div>

          {/* Request information */}

          <section className="refund-details-modal__section">
            <div className="refund-details-modal__section-title">
              <FileText size={17} />
              <h3>Request information</h3>
            </div>

            <div className="refund-details-modal__info-grid">
              <div>
                <span>Order number</span>
                <strong>{displayValue(orderNumber)}</strong>
              </div>

              <div>
                <span>Submitted on</span>
                <strong>
                  {formatDate(
                    refund.createdAt || refund.requestedAt,
                    locale
                  )}
                </strong>
              </div>

              <div>
                <span>Reason</span>
                <strong>{reason}</strong>
              </div>

              <div>
                <span>Purchase date</span>
                <strong>
                  {formatDate(
                    order?.paidAt || order?.createdAt,
                    locale
                  )}
                </strong>
              </div>
            </div>

            {refund.details && (
              <div className="refund-details-modal__description">
                <span>Additional explanation</span>
                <p>{refund.details}</p>
              </div>
            )}
          </section>

          {/* Associated courses */}

          {Array.isArray(order?.items) && order.items.length > 0 && (
            <section className="refund-details-modal__section">
              <div className="refund-details-modal__section-title">
                <BookOpen size={17} />
                <h3>Associated courses</h3>
              </div>

              <div className="refund-details-modal__courses">
                {order.items.map((item, index) => (
                  <div
                    className="refund-details-modal__course"
                    key={item.courseId || item.id || index}
                  >
                    <span className="refund-details-modal__course-icon">
                      <BookOpen size={17} />
                    </span>

                    <div>
                      <strong>
                        {item.courseTitle || item.title || 'Course'}
                      </strong>
                      {item.instructorName && (
                        <span>{item.instructorName}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Status timeline */}

          <section className="refund-details-modal__section">
            <div className="refund-details-modal__section-title">
              <Clock3 size={17} />
              <h3>Request timeline</h3>
            </div>

            {history.length > 0 ? (
              <ol className="refund-details-modal__timeline">
                {history.map((entry) => {
                  const entryStatus =
                    STATUS_CONFIG[entry.normalizedStatus]

                  return (
                    <li
                      key={entry.key}
                      className="refund-details-modal__timeline-item"
                    >
                      <span
                        className={`refund-details-modal__timeline-icon refund-details-modal__timeline-icon--${entryStatus.tone}`}
                      >
                        <StatusIcon
                          status={entry.normalizedStatus}
                        />
                      </span>

                      <div>
                        <strong>{entryStatus.label}</strong>
                        <span>
                          {formatDate(entry.timestamp, locale)}
                        </span>
                        <p>
                          {entry.description ||
                            STATUS_DESCRIPTIONS[
                              entry.normalizedStatus
                            ]}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ol>
            ) : (
              <div className="refund-details-modal__timeline-empty">
                <Clock3 size={17} />
                <span>
                  No detailed status history is available yet.
                  Current status: {status.label}.
                </span>
              </div>
            )}
          </section>

          {/* Decision */}

          {(statusKey === 'rejected' ||
            refund.reviewedAt ||
            refund.reviewMessage) && (
            <section className="refund-details-modal__section">
              <div className="refund-details-modal__section-title">
                <ShieldCheck size={17} />
                <h3>Review information</h3>
              </div>

              <div className="refund-details-modal__review">
                {refund.reviewedAt && (
                  <div>
                    <CalendarDays size={15} />
                    <span>
                      Reviewed {formatDate(refund.reviewedAt, locale)}
                    </span>
                  </div>
                )}

                {statusKey === 'rejected' && (
                  <div className="refund-details-modal__rejection">
                    <AlertCircle size={17} />
                    <div>
                      <strong>Request rejected</strong>
                      <p>
                        {refund.rejectionReason ||
                          'No rejection explanation has been provided.'}
                      </p>
                    </div>
                  </div>
                )}

                {refund.reviewMessage && (
                  <p className="refund-details-modal__review-message">
                    {refund.reviewMessage}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Repayment */}

          {(refund.refundedAt ||
            refund.refundedAmount != null ||
            refund.refundTransactionReference) && (
            <section className="refund-details-modal__section">
              <div className="refund-details-modal__section-title">
                <CreditCard size={17} />
                <h3>Repayment information</h3>
              </div>

              <div className="refund-details-modal__info-grid">
                <div>
                  <span>Refunded amount</span>
                  <strong>
                    {formatMoney(
                      paidAmount,
                      refundCurrency,
                      locale
                    )}
                  </strong>
                </div>

                <div>
                  <span>Processed on</span>
                  <strong>
                    {formatDate(refund.refundedAt, locale)}
                  </strong>
                </div>

                <div className="refund-details-modal__wide">
                  <span>Transaction reference</span>
                  <strong>
                    {displayValue(
                      refund.refundTransactionReference
                    )}
                  </strong>
                </div>
              </div>
            </section>
          )}

          {/* Policy */}

          <div className="refund-details-modal__policy">
            <HelpCircle size={17} />
            <div>
              <strong>Refund policy</strong>
              <p>
                {refundPolicyText ||
                  'Refund requests are subject to the applicable BEHAR refund policy. Approval and processing depend on the review outcome and payment provider.'}
              </p>
            </div>
          </div>
        </div>

        <footer className="refund-details-modal__footer">
          <button
            type="button"
            className="refund-details-modal__dismiss"
            onClick={onClose}
          >
            Close
          </button>

          <button
            type="button"
            className="refund-details-modal__support"
            onClick={() => onContactSupport?.(refund)}
            disabled={!canContactSupport}
          >
            Contact support
            <ArrowRight size={15} />
          </button>
        </footer>
      </section>
    </div>,
    document.body
  )
}
