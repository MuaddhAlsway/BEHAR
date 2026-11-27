
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowDownLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  Hash,
  LockKeyhole,
  ReceiptText,
  RotateCcw,
  X,
} from 'lucide-react'

import '../../../styles/student/payments/payment-details-modal.css'

const STATUS_CONFIG = {
  paid: { label: 'Paid', tone: 'success' },
  pending: { label: 'Pending', tone: 'warning' },
  processing: { label: 'Processing', tone: 'info' },
  failed: { label: 'Failed', tone: 'danger' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
  refunded: { label: 'Refunded', tone: 'info' },
  partially_refunded: {
    label: 'Partially refunded',
    tone: 'warning',
  },
}

const PAYMENT_METHODS = {
  mada: 'Mada',
  visa: 'Visa',
  mastercard: 'Mastercard',
  apple_pay: 'Apple Pay',
  tabby: 'Tabby',
  tamara: 'Tamara',
  card: 'Card payment',
}

function normalize(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
}

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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return '—'
  }
}

function getMethod(order) {
  const method = order.paymentMethod

  if (!method) return 'Not specified'

  const raw =
    typeof method === 'string'
      ? method
      : method.brand || method.type || 'Online payment'

  return PAYMENT_METHODS[normalize(raw)] || String(raw)
}

function getItems(order) {
  if (Array.isArray(order.items)) return order.items
  return []
}

function getItemTitle(item) {
  return item.courseTitle || item.title || 'Course'
}

function getItemPrice(item) {
  return item.price ?? item.amount ?? item.total ?? null
}

export default function PaymentDetailsModal({
  order,
  isOpen = false,
  onClose,
  onDownloadReceipt,
  onRequestRefund,
  currency = 'SAR',
  locale = 'en-SA',
}) {
  const titleId = useId()
  const descriptionId = useId()
  const closeButtonRef = useRef(null)
  const dialogRef = useRef(null)

  const orderId = order?.orderNumber || order?.id || '—'
  const status = normalize(order?.status)
  const statusConfig = STATUS_CONFIG[status] || {
    label: 'Unknown',
    tone: 'neutral',
  }

  const items = order ? getItems(order) : []
  const orderCurrency = order?.currency || currency

  const subtotal = order?.subtotal
  const discount = order?.discount
  const tax = order?.tax
  const total = order?.total ?? order?.totalAmount

  const transactionReference =
    order?.transactionReference ||
    order?.paymentReference ||
    null

  const canDownloadReceipt =
    status === 'paid' ||
    status === 'partially_refunded' ||
    status === 'refunded'

  const receiptAvailable =
    canDownloadReceipt &&
    typeof onDownloadReceipt === 'function'

  const refundAvailable =
    Boolean(order?.refundEligible) &&
    ['paid', 'partially_refunded'].includes(status) &&
    typeof onRequestRefund === 'function'

  useEffect(() => {
    if (!isOpen || !order) return

    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const focusableSelector = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ')

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose?.()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll(focusableSelector) || []
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
  }, [isOpen, order, onClose])

  if (!isOpen || !order) return null

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.()
    }
  }

  return createPortal(
    <div
      className="payment-details-overlay"
      onMouseDown={handleBackdropClick}
    >
      <section
        ref={dialogRef}
        className="payment-details-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        {/* Header */}

        <header className="payment-details-modal__header">
          <div className="payment-details-modal__heading">
            <span className="payment-details-modal__eyebrow">
              <ReceiptText size={14} />
              Transaction overview
            </span>

            <h2 id={titleId}>Payment details</h2>

            <p id={descriptionId}>
              Review your order and billing information.
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="payment-details-modal__close"
            onClick={onClose}
            aria-label="Close payment details"
          >
            <X size={20} />
          </button>
        </header>

        <div className="payment-details-modal__body">
          {/* Order overview */}

          <div className="payment-details-modal__overview">
            <div className="payment-details-modal__overview-top">
              <div className="payment-details-modal__overview-icon">
                {status === 'refunded' ? (
                  <ArrowDownLeft size={22} />
                ) : (
                  <ArrowUpRight size={22} />
                )}
              </div>

              <span
                className={`payment-details-modal__status payment-details-modal__status--${statusConfig.tone}`}
              >
                <span aria-hidden="true" />
                {statusConfig.label}
              </span>
            </div>

            <span className="payment-details-modal__overview-label">
              Total order amount
            </span>

            <strong className="payment-details-modal__total">
              {formatMoney(total, orderCurrency, locale)}
            </strong>

            <div className="payment-details-modal__overview-meta">
              <span>
                <Hash size={14} />
                {orderId}
              </span>

              <span>
                <CalendarDays size={14} />
                {formatDate(order.createdAt, locale)}
              </span>
            </div>
          </div>

          {/* Purchased courses */}

          <section className="payment-details-modal__section">
            <div className="payment-details-modal__section-title">
              <BookOpen size={17} />
              <h3>Purchased courses</h3>
              <span>{items.length}</span>
            </div>

            <div className="payment-details-modal__courses">
              {items.length ? (
                items.map((item, index) => (
                  <div
                    className="payment-details-modal__course"
                    key={`${item.courseId || item.id || 'course'}-${index}`}
                  >
                    <div className="payment-details-modal__course-icon">
                      <BookOpen size={19} />
                    </div>

                    <div className="payment-details-modal__course-info">
                      <strong>{getItemTitle(item)}</strong>

                      <span>
                        {item.instructorName || 'BEHAR course'}
                      </span>
                    </div>

                    <strong className="payment-details-modal__course-price">
                      {formatMoney(
                        getItemPrice(item),
                        orderCurrency,
                        locale
                      )}
                    </strong>
                  </div>
                ))
              ) : (
                <p className="payment-details-modal__unavailable">
                  Course information is not available.
                </p>
              )}
            </div>
          </section>

          {/* Payment breakdown */}

          <section className="payment-details-modal__section">
            <div className="payment-details-modal__section-title">
              <ReceiptText size={17} />
              <h3>Payment breakdown</h3>
            </div>

            <div className="payment-details-modal__breakdown">
              {subtotal != null && (
                <div>
                  <span>Subtotal</span>
                  <strong>
                    {formatMoney(subtotal, orderCurrency, locale)}
                  </strong>
                </div>
              )}

              {discount != null && (
                <div>
                  <span>Discount</span>
                  <strong className="payment-details-modal__discount">
                    −{formatMoney(
                      Math.abs(Number(discount)),
                      orderCurrency,
                      locale
                    )}
                  </strong>
                </div>
              )}

              {tax != null && (
                <div>
                  <span>Tax</span>
                  <strong>
                    {formatMoney(tax, orderCurrency, locale)}
                  </strong>
                </div>
              )}

              <div className="payment-details-modal__breakdown-total">
                <span>Total</span>
                <strong>
                  {formatMoney(total, orderCurrency, locale)}
                </strong>
              </div>
            </div>
          </section>

          {/* Payment method */}

          <section className="payment-details-modal__section">
            <div className="payment-details-modal__section-title">
              <CreditCard size={17} />
              <h3>Payment information</h3>
            </div>

            <div className="payment-details-modal__information">
              <div>
                <span>Payment method</span>
                <strong>{getMethod(order)}</strong>
              </div>

              {transactionReference && (
                <div>
                  <span>Transaction reference</span>
                  <strong className="payment-details-modal__reference">
                    {transactionReference}
                  </strong>
                </div>
              )}

              <div>
                <span>Currency</span>
                <strong>{orderCurrency}</strong>
              </div>
            </div>
          </section>

          {/* Security note */}

          <div className="payment-details-modal__security">
            <LockKeyhole size={16} />

            <p>
              Your payment information is processed securely.
              Sensitive card details are not displayed.
            </p>
          </div>
        </div>

        {/* Footer */}

        <footer className="payment-details-modal__footer">
          <div className="payment-details-modal__footer-note">
            <CheckCircle2 size={16} />
            <span>Order information</span>
          </div>

          <div className="payment-details-modal__actions">
            {refundAvailable && (
              <button
                type="button"
                className="payment-details-modal__refund"
                onClick={() => onRequestRefund(order)}
              >
                <RotateCcw size={16} />
                Request refund
              </button>
            )}

            {receiptAvailable && (
              <button
                type="button"
                className="payment-details-modal__receipt"
                onClick={() => onDownloadReceipt(order)}
              >
                <Download size={16} />
                Download receipt
              </button>
            )}

            <button
              type="button"
              className="payment-details-modal__done"
              onClick={onClose}
            >
              <FileText size={16} />
              Done
            </button>
          </div>
        </footer>
      </section>
    </div>,
    document.body
  )
}
