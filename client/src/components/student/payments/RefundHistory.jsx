
import { useEffect, useMemo, useState } from 'react'
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  FileClock,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import '../../../styles/student/payments/refund-history.css'

const PAGE_SIZE = 5

const STATUS_CONFIG = {
  pending: { label: 'Pending', tone: 'warning' },
  under_review: { label: 'Under review', tone: 'info' },
  approved: { label: 'Approved', tone: 'success' },
  rejected: { label: 'Rejected', tone: 'danger' },
  processing: { label: 'Processing', tone: 'info' },
  refunded: { label: 'Refunded', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
}

const REASON_LABELS = {
  accidental_purchase: 'Purchased by mistake',
  course_expectations: 'Course did not meet expectations',
  technical_issues: 'Technical issues',
  duplicate_purchase: 'Duplicate purchase',
  content_quality: 'Course content quality',
  other: 'Other reason',
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'highest', label: 'Highest amount' },
  { value: 'lowest', label: 'Lowest amount' },
]

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
      month: 'short',
      year: 'numeric',
    }).format(date)
  } catch {
    return '—'
  }
}

function getRefundId(refund) {
  return refund.refundNumber || refund.id || '—'
}

function getOrderId(refund) {
  return refund.orderNumber || refund.orderId || '—'
}

function getRefundAmount(refund) {
  return refund.requestedAmount ?? refund.amount ?? null
}

function getRefundDate(refund) {
  return refund.createdAt || refund.requestedAt || null
}

function getStatus(refund) {
  const key = normalize(refund.status)

  return (
    STATUS_CONFIG[key] || {
      label: 'Unknown',
      tone: 'neutral',
    }
  )
}

function getReason(refund) {
  const key = normalize(refund.reason)
  return REASON_LABELS[key] || refund.reason || 'Not specified'
}

function RefundStatus({ refund }) {
  const status = getStatus(refund)

  return (
    <span
      className={`refund-history__status refund-history__status--${status.tone}`}
    >
      <span aria-hidden="true" />
      {status.label}
    </span>
  )
}

function RefundRow({
  refund,
  currency,
  locale,
  onViewDetails,
  variant = 'desktop',
}) {
  const refundId = getRefundId(refund)
  const orderId = getOrderId(refund)

  const amount = formatMoney(
    getRefundAmount(refund),
    refund.currency || currency,
    locale
  )

  const date = formatDate(getRefundDate(refund), locale)
  const reason = getReason(refund)

  const canView = typeof onViewDetails === 'function'

  if (variant === 'mobile') {
    return (
      <article className="refund-history__mobile-card">
        <div className="refund-history__mobile-top">
          <div className="refund-history__identity">
            <span className="refund-history__identity-icon">
              <RotateCcw size={17} />
            </span>

            <div>
              <strong>{refundId}</strong>
              <span>Order {orderId}</span>
            </div>
          </div>

          <RefundStatus refund={refund} />
        </div>

        <div className="refund-history__mobile-details">
          <div>
            <span>Requested amount</span>
            <strong>{amount}</strong>
          </div>

          <div>
            <span>Submitted</span>
            <strong>{date}</strong>
          </div>

          <div className="refund-history__mobile-reason">
            <span>Reason</span>
            <strong>{reason}</strong>
          </div>
        </div>

        <button
          type="button"
          className="refund-history__details-button"
          onClick={() => onViewDetails?.(refund)}
          disabled={!canView}
        >
          <Eye size={15} />
          View details
        </button>
      </article>
    )
  }

  return (
    <tr className="refund-history__row">
      <td>
        <div className="refund-history__identity">
          <span className="refund-history__identity-icon">
            <RotateCcw size={17} />
          </span>

          <div>
            <strong>{refundId}</strong>
            <span>Order {orderId}</span>
          </div>
        </div>
      </td>

      <td>
        <span className="refund-history__reason">{reason}</span>
      </td>

      <td>
        <span className="refund-history__date">{date}</span>
      </td>

      <td>
        <strong className="refund-history__amount">{amount}</strong>
      </td>

      <td>
        <RefundStatus refund={refund} />
      </td>

      <td>
        <button
          type="button"
          className="refund-history__details-button"
          onClick={() => onViewDetails?.(refund)}
          disabled={!canView}
        >
          <Eye size={15} />
          Details
        </button>
      </td>
    </tr>
  )
}

export default function RefundHistory({
  refunds = [],
  currency = 'SAR',
  locale = 'en-SA',
  onViewDetails,
}) {
  const isArabic = locale.toLowerCase().startsWith('ar')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)

  const filteredRefunds = useMemo(() => {
    const query = search.trim().toLowerCase()

    const result = refunds.filter((refund) => {
      const searchable = [
        getRefundId(refund),
        getOrderId(refund),
        getReason(refund),
        refund.status,
      ]
        .join(' ')
        .toLowerCase()

      const matchesSearch =
        !query || searchable.includes(query)

      const matchesStatus =
        status === 'all' ||
        normalize(refund.status) === status

      return matchesSearch && matchesStatus
    })

    return [...result].sort((a, b) => {
      if (sort === 'highest') {
        return (
          Number(getRefundAmount(b) || 0) -
          Number(getRefundAmount(a) || 0)
        )
      }

      if (sort === 'lowest') {
        return (
          Number(getRefundAmount(a) || 0) -
          Number(getRefundAmount(b) || 0)
        )
      }

      const dateA = new Date(getRefundDate(a) || 0).getTime()
      const dateB = new Date(getRefundDate(b) || 0).getTime()

      const safeA = Number.isFinite(dateA) ? dateA : 0
      const safeB = Number.isFinite(dateB) ? dateB : 0

      return sort === 'oldest'
        ? safeA - safeB
        : safeB - safeA
    })
  }, [refunds, search, status, sort])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRefunds.length / PAGE_SIZE)
  )

  const currentPage = Math.min(page, totalPages)

  const paginatedRefunds = filteredRefunds.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const hasActiveFilters =
    Boolean(search.trim()) ||
    status !== 'all' ||
    sort !== 'newest'

  const resetFilters = () => {
    setSearch('')
    setStatus('all')
    setSort('newest')
    setPage(1)
  }

  useEffect(() => {
    setPage(1)
  }, [search, status, sort])

  return (
    <section className="refund-history">
      {/* Header */}

      <div className="refund-history__header">
        <div>
          <span className="refund-history__eyebrow">
            <FileClock size={14} />
            {isArabic ? 'نشاط الاسترداد' : 'Refund activity'}
          </span>

          <h2>{isArabic ? 'سجل طلبات الاسترداد' : 'Refund history'}</h2>

          <p>
            {isArabic
              ? 'تابع طلبات استرداد المبالغ وحالة مراجعتها.'
              : 'Track your refund requests and their review status.'}
          </p>
        </div>

        <div className="refund-history__count">
          <RotateCcw size={16} />
          <span>
            {refunds.length}{' '}
            {isArabic
              ? 'طلبات'
              : refunds.length === 1
                ? 'request'
                : 'requests'}
          </span>
        </div>
      </div>

      {/* Empty state */}

      {refunds.length === 0 ? (
        <div className="refund-history__empty">
          <div className="refund-history__empty-icon">
            <Clock3 size={25} strokeWidth={1.6} />
          </div>

          <h3>{isArabic ? 'لا توجد طلبات استرداد بعد' : 'No refund requests yet'}</h3>

          <p>
            {isArabic
              ? 'ستظهر هنا أي طلبات استرداد تقدمها مع حالتها الحالية.'
              : 'Any refund requests you submit will appear here, along with their current status.'}
          </p>
        </div>
      ) : (
        <>
          {/* Toolbar */}

          <div className="refund-history__toolbar">
            <div className="refund-history__search">
              <Search size={17} />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search refunds or orders..."
                aria-label="Search refund requests"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="refund-history__toolbar-actions">
              <div className="refund-history__select">
                <SlidersHorizontal size={15} />

                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  aria-label="Filter refunds by status"
                >
                  <option value="all">All statuses</option>

                  {Object.entries(STATUS_CONFIG).map(
                    ([value, config]) => (
                      <option key={value} value={value}>
                        {config.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="refund-history__select">
                <ArrowUpDown size={15} />

                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  aria-label="Sort refund requests"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}

          <div className="refund-history__results">
            <span>
              Showing {filteredRefunds.length} of {refunds.length} requests
            </span>

            {hasActiveFilters && (
              <button type="button" onClick={resetFilters}>
                <X size={13} />
                Reset filters
              </button>
            )}
          </div>

          {filteredRefunds.length === 0 ? (
            <div className="refund-history__no-results">
              <Search size={22} />

              <h3>No matching refunds</h3>

              <p>Try adjusting your search or filters.</p>

              <button type="button" onClick={resetFilters}>
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* Desktop table */}

              <div className="refund-history__table-wrap">
                <table className="refund-history__table">
                  <thead>
                    <tr>
                      <th scope="col">Refund</th>
                      <th scope="col">Reason</th>
                      <th scope="col">Submitted</th>
                      <th scope="col">Amount</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedRefunds.map((refund) => (
                      <RefundRow
                        key={refund.id || refund.refundNumber}
                        refund={refund}
                        currency={currency}
                        locale={locale}
                        onViewDetails={onViewDetails}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}

              <div className="refund-history__mobile-list">
                {paginatedRefunds.map((refund) => (
                  <RefundRow
                    key={refund.id || refund.refundNumber}
                    refund={refund}
                    currency={currency}
                    locale={locale}
                    onViewDetails={onViewDetails}
                    variant="mobile"
                  />
                ))}
              </div>

              {/* Pagination */}

              {totalPages > 1 && (
                <div className="refund-history__pagination">
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>

                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setPage((previous) => Math.max(1, previous - 1))
                      }
                      disabled={currentPage === 1}
                      aria-label="Previous refund page"
                    >
                      <ChevronLeft size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setPage((previous) =>
                          Math.min(totalPages, previous + 1)
                        )
                      }
                      disabled={currentPage === totalPages}
                      aria-label="Next refund page"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  )
}
