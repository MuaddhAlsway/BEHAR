
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Eye,
  ReceiptText,
} from 'lucide-react'

import '../../../styles/student/payments/payment-row.css'
import { getPaymentCopy } from '../../../utils/paymentCopy'
import { courses } from '../../../data/courses'

const STATUS_CONFIG = {
  paid: {
    label: 'Paid',
    className: 'paid',
  },
  pending: {
    label: 'Pending',
    className: 'pending',
  },
  processing: {
    label: 'Processing',
    className: 'processing',
  },
  failed: {
    label: 'Failed',
    className: 'failed',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'cancelled',
  },
  refunded: {
    label: 'Refunded',
    className: 'refunded',
  },
  partially_refunded: {
    label: 'Partially refunded',
    className: 'partially-refunded',
  },
}

function normalizeStatus(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
}

function formatCurrency(amount, currency, locale) {
  if (amount === null || amount === undefined || amount === '') {
    return '—'
  }

  const value = Number(amount)

  if (!Number.isFinite(value)) return '—'

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    return `${value.toFixed(2)} ${currency}`
  }
}

function formatDate(value, locale) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '—'

  try {
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date)
  } catch {
    return '—'
  }
}

function getCourseTitle(order, locale) {
  const isArabic = locale.toLowerCase().startsWith('ar')
  const catalogCourse = courses.find(
    (course) =>
      course.slug === order.courseSlug ||
      course.id === order.courseId ||
      course.id === order.items?.[0]?.courseId
  )

  if (isArabic) {
    const arabicTitle =
      order.courseTitleAr ||
      order.items?.[0]?.courseTitleAr ||
      catalogCourse?.title?.ar

    if (arabicTitle) return arabicTitle
  }

  if (order.courseTitle) return order.courseTitle

  if (Array.isArray(order.items) && order.items.length > 0) {
    const first = order.items[0]

    const title =
      first?.courseTitle ||
      first?.title ||
      'Course purchase'

    return order.items.length > 1
      ? `${title} +${order.items.length - 1} more`
      : title
  }

  return 'Course purchase'
}

function getPaymentMethod(order) {
  const method = order.paymentMethod

  if (!method) return 'Online payment'

  const raw =
    typeof method === 'string'
      ? method
      : method.brand || method.type || 'Online payment'

  const labels = {
    mada: 'Mada',
    visa: 'Visa',
    mastercard: 'Mastercard',
    apple_pay: 'Apple Pay',
    tabby: 'Tabby',
    tamara: 'Tamara',
    card: 'Card payment',
  }

  const normalized = String(raw)
    .toLowerCase()
    .replace(/[\s-]+/g, '_')

  return labels[normalized] || String(raw)
}

export default function PaymentRow({
  order,
  currency = 'SAR',
  locale = 'en-SA',
  onViewDetails,
  variant = 'desktop',
}) {
  if (!order) return null

  const orderId = String(
    order.orderNumber || order.id || '—'
  )

  const title = getCourseTitle(order, locale)
  const date = formatDate(order.createdAt, locale)

  const amount = formatCurrency(
    order.total ?? order.totalAmount,
    order.currency || currency,
    locale
  )

  const paymentMethod = getPaymentMethod(order)

  const status = normalizeStatus(order.status)
  const copy = getPaymentCopy(locale)

  const statusConfig = STATUS_CONFIG[status] || {
    label: locale.startsWith('ar') ? 'غير معروف' : 'Unknown',
    className: 'unknown',
  }
  const statusLabels = {
    paid: copy.paid,
    pending: copy.pending,
    processing: copy.processing,
    failed: copy.failed,
    cancelled: copy.cancelled,
    refunded: copy.refundedStatus,
    partially_refunded: copy.partialRefunded,
  }

  const isRefund =
    status === 'refunded' ||
    status === 'partially_refunded'

  const canViewDetails =
    typeof onViewDetails === 'function'

  const handleViewDetails = () => {
    if (canViewDetails) {
      onViewDetails(order)
    }
  }

  const statusBadge = (
    <span
      className={`payment-row__status payment-row__status--${statusConfig.className}`}
    >
      <span
        className="payment-row__status-dot"
        aria-hidden="true"
      />

      {statusLabels[status] || statusConfig.label}
    </span>
  )

  /* ========================================
     MOBILE CARD
  ======================================== */

  if (variant === 'mobile') {
    return (
      <article className="payment-row-mobile">
        <div className="payment-row-mobile__top">
          <div className="payment-row-mobile__icon">
            <ReceiptText
              size={19}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          {statusBadge}
        </div>

        <div className="payment-row-mobile__content">
          <h3>{title}</h3>

          <p className="payment-row-mobile__order-id">
            {copy.order} #{orderId}
          </p>
        </div>

        <div className="payment-row-mobile__meta">
          <div className="payment-row-mobile__meta-item">
            <span>{copy.purchaseDate}</span>
            <strong>{date}</strong>
          </div>

          <div className="payment-row-mobile__meta-item">
            <span>{copy.amount}</span>
            <strong>{amount}</strong>
          </div>
        </div>

        <div className="payment-row-mobile__payment-method">
          <CreditCard
            size={15}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <span>{paymentMethod}</span>
        </div>

        <button
          type="button"
          className="payment-row-mobile__action"
          onClick={handleViewDetails}
          disabled={!canViewDetails}
        >
          {copy.details}

          <ArrowUpRight
            size={16}
            aria-hidden="true"
          />
        </button>
      </article>
    )
  }

  /* ========================================
     DESKTOP TABLE ROW
  ======================================== */

  return (
    <tr className="payment-row">
      <td>
        <div className="payment-row__transaction">
          <div
            className={`payment-row__icon ${
              isRefund ? 'payment-row__icon--refund' : ''
            }`}
          >
            {isRefund ? (
              <ArrowDownLeft
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            ) : (
              <ArrowUpRight
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            )}
          </div>

          <div className="payment-row__transaction-info">
            <span
              className="payment-row__course"
              title={title}
            >
              {title}
            </span>

            <span className="payment-row__order-id">
              {copy.order} #{orderId}
            </span>
          </div>
        </div>
      </td>

      <td>
        <span className="payment-row__date">
          {date}
        </span>
      </td>

      <td>
        <div className="payment-row__amount">
          <strong>{amount}</strong>

          <span>
            <CreditCard
              size={12}
              aria-hidden="true"
            />

            {paymentMethod}
          </span>
        </div>
      </td>

      <td>{statusBadge}</td>

      <td>
        <button
          type="button"
          className="payment-row__view"
          onClick={handleViewDetails}
          disabled={!canViewDetails}
          aria-label={`${copy.details} ${copy.order} ${orderId}`}
        >
          <Eye
            size={16}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <span>{copy.details}</span>
        </button>
      </td>
    </tr>
  )
}
