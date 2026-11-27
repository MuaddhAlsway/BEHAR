
import {
  Search,
  SlidersHorizontal,
  ArrowDownUp,
  X,
} from 'lucide-react'

import '../../../styles/student/payments/payment-toolbar.css'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'failed', label: 'Failed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
  {
    value: 'partially_refunded',
    label: 'Partially refunded',
  },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'highest', label: 'Highest amount' },
  { value: 'lowest', label: 'Lowest amount' },
]

export default function PaymentToolbar({
  search = '',
  onSearchChange,
  status = 'all',
  onStatusChange,
  sort = 'newest',
  onSortChange,
  onReset,
  totalCount = 0,
  resultCount = 0,
}) {
  const hasActiveFilters =
    search.trim() !== '' ||
    status !== 'all' ||
    sort !== 'newest'

  return (
    <div className="payment-toolbar">
      <div className="payment-toolbar__header">
        <div className="payment-toolbar__heading">
          <h3>Manage transactions</h3>
          <p>
            Search, filter and organize your payments.
          </p>
        </div>

        <span className="payment-toolbar__count">
          {resultCount} of {totalCount} orders
        </span>
      </div>

      <div className="payment-toolbar__controls">
        {/* Search */}

        <div className="payment-toolbar__search">
          <Search
            size={18}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              onSearchChange?.(event.target.value)
            }
            placeholder="Search orders or courses..."
            aria-label="Search payment transactions"
          />

          {search && (
            <button
              type="button"
              className="payment-toolbar__clear-search"
              onClick={() => onSearchChange?.('')}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Status filter */}

        <div className="payment-toolbar__select">
          <SlidersHorizontal
            size={17}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <select
            value={status}
            onChange={(event) =>
              onStatusChange?.(event.target.value)
            }
            aria-label="Filter by payment status"
          >
            {STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting */}

        <div className="payment-toolbar__select">
          <ArrowDownUp
            size={17}
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <select
            value={sort}
            onChange={(event) =>
              onSortChange?.(event.target.value)
            }
            aria-label="Sort payment transactions"
          >
            {SORT_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="payment-toolbar__footer">
          <span>
            Showing {resultCount} matching transactions
          </span>

          <button
            type="button"
            className="payment-toolbar__reset"
            onClick={onReset}
          >
            <X size={14} aria-hidden="true" />
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
