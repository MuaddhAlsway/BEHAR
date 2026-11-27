
import {
  Wallet,
  ShoppingBag,
  CircleCheck,
  RotateCcw,
} from 'lucide-react'

import '../../../styles/student/payments/payment-stats.css'
import { getPaymentCopy } from '../../../utils/paymentCopy'

const COMPLETED_STATUSES = new Set([
  'paid',
  'partially_refunded',
  'refunded',
])

const SUCCESSFUL_STATUSES = new Set([
  'paid',
  'partially_refunded',
])

function normalizeStatus(status) {
  return String(status ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
}

function getAmount(value) {
  const amount = Number(value)
  return Number.isFinite(amount) && amount > 0 ? amount : 0
}

function calculatePaymentStats(orders, refunds) {
  const validOrders = Array.isArray(orders) ? orders : []
  const validRefunds = Array.isArray(refunds) ? refunds : []

  const completedOrders = validOrders.filter((order) =>
    COMPLETED_STATUSES.has(normalizeStatus(order.status))
  )

  const successfulPayments = validOrders.filter((order) =>
    SUCCESSFUL_STATUSES.has(normalizeStatus(order.status))
  ).length

  // Only completed refunds affect financial totals.
  // A refund request alone is not a completed refund.
  const refundedAmount = validRefunds
    .filter((refund) =>
      ['completed', 'succeeded', 'refunded'].includes(
        normalizeStatus(refund.status)
      )
    )
    .reduce((total, refund) => {
      return total + getAmount(refund.amount)
    }, 0)

  const grossSpent = completedOrders.reduce((total, order) => {
    return total + getAmount(order.total)
  }, 0)

  return {
    totalSpent: Math.max(0, grossSpent - refundedAmount),
    totalOrders: validOrders.length,
    successfulPayments,
    refundedAmount,
  }
}

function formatCurrency(amount, currency, locale) {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

export default function PaymentStats({
  orders = [],
  refunds = [],
  currency = 'SAR',
  locale = 'en-SA',
}) {
  const copy = getPaymentCopy(locale)
  const stats = calculatePaymentStats(orders, refunds)

  const cards = [
    {
      id: 'total-spent',
      label: copy.totalSpent,
      value: formatCurrency(stats.totalSpent, currency, locale),
      description: copy.netPurchases,
      icon: Wallet,
      tone: 'primary',
    },
    {
      id: 'total-orders',
      label: copy.totalOrders,
      value: String(stats.totalOrders).padStart(2, '0'),
      description: copy.allOrders,
      icon: ShoppingBag,
      tone: 'neutral',
    },
    {
      id: 'successful-payments',
      label: copy.successful,
      value: String(stats.successfulPayments).padStart(2, '0'),
      description: copy.paidPartial,
      icon: CircleCheck,
      tone: 'success',
    },
    {
      id: 'refunded-amount',
      label: copy.refunded,
      value: formatCurrency(stats.refundedAmount, currency, locale),
      description: copy.completedRefunds,
      icon: RotateCcw,
      tone: 'neutral',
    },
  ]

  return (
    <section
      className="payment-stats"
      aria-labelledby="payment-stats-heading"
    >
      <div className="payment-stats__heading">
        <h2 id="payment-stats-heading">
          {copy.overview}
        </h2>

        <span className="payment-stats__period">
          {copy.allTime}
        </span>
      </div>

      <div className="payment-stats__grid">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <article
              className={`payment-stat-card payment-stat-card--${card.tone}`}
              key={card.id}
            >
              <div className="payment-stat-card__top">
                <span className="payment-stat-card__label">
                  {card.label}
                </span>

                <span
                  className="payment-stat-card__icon"
                  aria-hidden="true"
                >
                  <Icon size={19} strokeWidth={1.8} />
                </span>
              </div>

              <div className="payment-stat-card__value">
                {card.value}
              </div>

              <p className="payment-stat-card__description">
                {card.description}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
