
import {
  Search,
  SlidersHorizontal,
  ArrowDownUp,
  X,
} from 'lucide-react'

import '../../../styles/student/payments/payment-toolbar.css'
import { getPaymentCopy } from '../../../utils/paymentCopy'

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
  locale = 'en-SA',
}) {
  const copy = getPaymentCopy(locale)
  const statusOptions = [
    { value: 'all', label: copy.allStatuses },
    { value: 'paid', label: copy.paid },
    { value: 'pending', label: copy.pending },
    { value: 'processing', label: copy.processing },
    { value: 'failed', label: copy.failed },
    { value: 'cancelled', label: copy.cancelled },
    { value: 'refunded', label: copy.refundedStatus },
    { value: 'partially_refunded', label: copy.partialRefunded },
  ]
  const sortOptions = [
    { value: 'newest', label: copy.newest },
    { value: 'oldest', label: copy.oldest },
    { value: 'highest', label: copy.highest },
    { value: 'lowest', label: copy.lowest },
  ]
  const hasActiveFilters =
    search.trim() !== '' ||
    status !== 'all' ||
    sort !== 'newest'

  return (
    <div className="payment-toolbar">
      <div className="payment-toolbar__header">
        <div className="payment-toolbar__heading">
          <h3>{copy.manage}</h3>
          <p>{copy.manageDescription}</p>
        </div>

        <span className="payment-toolbar__count">
          {resultCount} / {totalCount} {copy.orders}
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
            placeholder={copy.search}
            aria-label={copy.searchLabel}
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
            aria-label={copy.filterLabel}
          >
            {statusOptions.map((option) => (
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
            aria-label={copy.sortLabel}
          >
            {sortOptions.map((option) => (
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
            {copy.matching}: {resultCount}
          </span>

          <button
            type="button"
            className="payment-toolbar__reset"
            onClick={onReset}
          >
            <X size={14} aria-hidden="true" />
            {copy.clear}
          </button>
        </div>
      )}
    </div>
  )
}
