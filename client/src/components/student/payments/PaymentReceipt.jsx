
import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  CreditCard,
  Download,
  FileText,
  Printer,
  ReceiptText,
  ShieldCheck,
  X,
} from 'lucide-react'

import '../../../styles/student/payments/payment-receipt.css'

const PAYMENT_METHODS = {
  mada: 'Mada',
  visa: 'Visa',
  mastercard: 'Mastercard',
  apple_pay: 'Apple Pay',
  card: 'Card payment',
  tabby: 'Tabby',
  tamara: 'Tamara',
}

const RECEIPT_STATUSES = {
  paid: 'Paid',
  refunded: 'Refunded',
  partially_refunded: 'Partially refunded',
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

function getPaymentMethod(order) {
  const method = order.paymentMethod

  if (!method) return 'Not specified'

  const raw =
    typeof method === 'string'
      ? method
      : method.brand || method.type || 'Online payment'

  const normalized = String(raw)
    .toLowerCase()
    .replace(/[\s-]+/g, '_')

  return PAYMENT_METHODS[normalized] || String(raw)
}

function getCourseTitle(item) {
  return item.courseTitle || item.title || 'Course'
}

function getCoursePrice(item) {
  return item.price ?? item.amount ?? item.total
}

function ReceiptField({ label, value }) {
  return (
    <div className="payment-receipt__field">
      <span>{label}</span>
      <strong>{value || '—'}</strong>
    </div>
  )
}

export default function PaymentReceipt({
  order,
  isOpen = false,
  onClose,
  currency = 'SAR',
  locale = 'en-SA',
  isPreview = false,
}) {
  const titleId = useId()
  const dialogRef = useRef(null)
  const closeRef = useRef(null)

  const items = Array.isArray(order?.items)
    ? order.items
    : []

  const receiptNumber =
    order?.receiptNumber || null

  const orderNumber =
    order?.orderNumber || order?.id || '—'

  const receiptCurrency =
    order?.currency || currency

  const status = String(order?.status || '')
    .toLowerCase()
    .replace(/[\s-]+/g, '_')

  const isReceiptStatus =
    Object.prototype.hasOwnProperty.call(
      RECEIPT_STATUSES,
      status
    )

  const hasReceiptReference = Boolean(receiptNumber)

  const canShowOfficialReceipt =
    isReceiptStatus &&
    hasReceiptReference &&
    !isPreview &&
    order?.paymentVerified === true

  const isPreviewReceipt = !canShowOfficialReceipt

  const handlePrint = () => {
    window.print()
  }

  useEffect(() => {
    if (!isOpen || !order) return

    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose?.()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        ) || []
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
    closeRef.current?.focus()

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
      className="payment-receipt-overlay"
      onMouseDown={handleBackdropClick}
    >
      <section
        ref={dialogRef}
        className="payment-receipt"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        dir={locale.startsWith('ar') ? 'rtl' : 'ltr'}
      >
        {/* Toolbar */}

        <header className="payment-receipt__toolbar">
          <div className="payment-receipt__toolbar-heading">
            <button
              type="button"
              className="payment-receipt__back"
              onClick={onClose}
              aria-label="Close receipt"
              ref={closeRef}
            >
              <ArrowLeft size={19} />
            </button>

            <div>
              <h2 id={titleId}>Payment receipt</h2>
              <p>Order #{orderNumber}</p>
            </div>
          </div>

          <div className="payment-receipt__toolbar-actions">
            <button
              type="button"
              className="payment-receipt__print"
              onClick={handlePrint}
            >
              <Printer size={16} />
              Print
            </button>

            <button
              type="button"
              className="payment-receipt__download"
              onClick={handlePrint}
            >
              <Download size={16} />
              Save as PDF
            </button>

            <button
              type="button"
              className="payment-receipt__close"
              onClick={onClose}
              aria-label="Close receipt"
            >
              <X size={19} />
            </button>
          </div>
        </header>

        {/* Printable document */}

        <div className="payment-receipt__scroll">
          <article className="payment-receipt__paper">

            {/* Brand */}

            <div className="payment-receipt__brand">
              <div className="payment-receipt__brand-identity">
                <div className="payment-receipt__logo">
                  <BookOpen size={25} strokeWidth={1.8} />
                </div>

                <div>
                  <strong>BEHAR</strong>
                  <span>Learning platform</span>
                </div>
              </div>

              <div className="payment-receipt__document-label">
                <ReceiptText size={17} />
                <span>PAYMENT RECEIPT</span>
              </div>
            </div>

            {/* Preview warning */}

            {isPreviewReceipt && (
              <div className="payment-receipt__preview">
                <FileText size={17} />
                <div>
                  <strong>UNVERIFIED RECEIPT PREVIEW</strong>
                  <p>
                    This document is for interface preview only.
                    It is not proof of payment or an official tax invoice.
                  </p>
                </div>
              </div>
            )}

            {/* Status */}

            <div className="payment-receipt__hero">
              <div className="payment-receipt__hero-icon">
                {canShowOfficialReceipt ? (
                  <CheckCircle2 size={25} />
                ) : (
                  <FileText size={25} />
                )}
              </div>

              <span className="payment-receipt__hero-label">
                {canShowOfficialReceipt
                  ? RECEIPT_STATUSES[status]
                  : 'Receipt preview'}
              </span>

              <strong>
                {formatMoney(
                  order.total ?? order.totalAmount,
                  receiptCurrency,
                  locale
                )}
              </strong>

              <p>
                {canShowOfficialReceipt
                  ? 'Recorded payment transaction'
                  : 'Payment details have not been verified'}
              </p>
            </div>

            {/* Receipt details */}

            <section className="payment-receipt__section">
              <h3>
                <ReceiptText size={16} />
                Receipt information
              </h3>

              <div className="payment-receipt__fields">
                <ReceiptField
                  label="Receipt number"
                  value={receiptNumber}
                />

                <ReceiptField
                  label="Order number"
                  value={orderNumber}
                />

                <ReceiptField
                  label="Transaction date"
                  value={formatDate(
                    order.paidAt || order.createdAt,
                    locale
                  )}
                />

                <ReceiptField
                  label="Transaction reference"
                  value={
                    order.transactionReference ||
                    order.paymentReference
                  }
                />
              </div>
            </section>

            {/* Billing information */}

            <section className="payment-receipt__section">
              <h3>
                <CreditCard size={16} />
                Billing information
              </h3>

              <div className="payment-receipt__fields">
                <ReceiptField
                  label="Student name"
                  value={order.billing?.name}
                />

                <ReceiptField
                  label="Email address"
                  value={order.billing?.email}
                />

                <ReceiptField
                  label="Payment method"
                  value={getPaymentMethod(order)}
                />

                <ReceiptField
                  label="Currency"
                  value={receiptCurrency}
                />
              </div>
            </section>

            {/* Purchased courses */}

            <section className="payment-receipt__section">
              <h3>
                <BookOpen size={16} />
                Purchased courses
              </h3>

              <div className="payment-receipt__items">
                <div className="payment-receipt__items-head">
                  <span>Course</span>
                  <span>Amount</span>
                </div>

                {items.length ? (
                  items.map((item, index) => (
                    <div
                      className="payment-receipt__item"
                      key={`${item.courseId || item.id || 'course'}-${index}`}
                    >
                      <div>
                        <strong>{getCourseTitle(item)}</strong>
                        <span>
                          {item.instructorName || 'BEHAR course'}
                        </span>
                      </div>

                      <strong>
                        {formatMoney(
                          getCoursePrice(item),
                          receiptCurrency,
                          locale
                        )}
                      </strong>
                    </div>
                  ))
                ) : (
                  <p className="payment-receipt__no-items">
                    Course details unavailable.
                  </p>
                )}
              </div>
            </section>

            {/* Payment summary */}

            <section className="payment-receipt__section">
              <h3>
                <FileText size={16} />
                Payment summary
              </h3>

              <div className="payment-receipt__summary">
                {order.subtotal != null && (
                  <div>
                    <span>Subtotal</span>
                    <strong>
                      {formatMoney(
                        order.subtotal,
                        receiptCurrency,
                        locale
                      )}
                    </strong>
                  </div>
                )}

                {order.discount != null && (
                  <div>
                    <span>Discount</span>
                    <strong className="payment-receipt__discount">
                      −{formatMoney(
                        Math.abs(Number(order.discount)),
                        receiptCurrency,
                        locale
                      )}
                    </strong>
                  </div>
                )}

                {order.tax != null && (
                  <div>
                    <span>VAT / Tax</span>
                    <strong>
                      {formatMoney(
                        order.tax,
                        receiptCurrency,
                        locale
                      )}
                    </strong>
                  </div>
                )}

                <div className="payment-receipt__grand-total">
                  <span>Total</span>
                  <strong>
                    {formatMoney(
                      order.total ?? order.totalAmount,
                      receiptCurrency,
                      locale
                    )}
                  </strong>
                </div>
              </div>
            </section>

            {/* Footer */}

            <footer className="payment-receipt__footer">
              <div className="payment-receipt__footer-icon">
                <ShieldCheck size={20} />
              </div>

              <h3>Thank you for learning with BEHAR</h3>

              <p>
                Keep this document for your personal records.
                For billing questions, contact BEHAR support.
              </p>

              <div className="payment-receipt__footer-bottom">
                <span>BEHAR Learning Platform</span>
                <span>
                  {canShowOfficialReceipt
                    ? 'Payment receipt'
                    : 'Unverified preview'}
                </span>
              </div>
            </footer>

          </article>
        </div>
      </section>
    </div>,
    document.body
  )
}
