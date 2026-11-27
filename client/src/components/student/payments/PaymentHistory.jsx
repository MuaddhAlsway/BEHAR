
import { useEffect, useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ReceiptText,
  SearchX,
} from 'lucide-react'

import '../../../styles/student/payments/payment-history.css'
import PaymentRow from './PaymentRow'

const PAGE_SIZE = 5

export default function PaymentHistory({
  orders = [],
  currency = 'SAR',
  locale = 'en-SA',
  onViewDetails,
  onResetFilters,
  hasActiveFilters = false,
}) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(
    1,
    Math.ceil(orders.length / PAGE_SIZE)
  )

  const currentPage = Math.min(page, totalPages)

  useEffect(() => {
    setPage((previous) => Math.min(previous, totalPages))
  }, [totalPages])

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE

    return orders.slice(start, start + PAGE_SIZE)
  }, [orders, currentPage])

  const startItem =
    orders.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1

  const endItem = Math.min(
    currentPage * PAGE_SIZE,
    orders.length
  )

  if (orders.length === 0) {
    return (
      <div className="payment-history__empty">
        <div className="payment-history__empty-icon">
          <SearchX size={27} strokeWidth={1.5} />
        </div>

        <h3>No matching transactions</h3>

        <p>
          We couldn't find any transactions matching your
          search or filters. Try adjusting your criteria.
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            className="payment-history__reset"
            onClick={onResetFilters}
          >
            Clear all filters
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="payment-history">

      {/* Table header */}

      <div className="payment-history__table-header">
        <div className="payment-history__table-heading">
          <ReceiptText size={17} strokeWidth={1.8} />

          <span>Payment records</span>
        </div>

        <span className="payment-history__total">
          {orders.length}{' '}
          {orders.length === 1
            ? 'transaction'
            : 'transactions'}
        </span>
      </div>

      {/* Desktop table */}

      <div className="payment-history__table-wrap">
        <table className="payment-history__table">
          <thead>
            <tr>
              <th scope="col">Transaction</th>
              <th scope="col">Date</th>
              <th scope="col">Amount</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedOrders.map((order) => (
              <PaymentRow
                key={order.id || order.orderNumber}
                order={order}
                currency={currency}
                locale={locale}
                onViewDetails={onViewDetails}
                variant="desktop"
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}

      <div className="payment-history__mobile">
        {paginatedOrders.map((order) => (
          <PaymentRow
            key={order.id || order.orderNumber}
            order={order}
            currency={currency}
            locale={locale}
            onViewDetails={onViewDetails}
            variant="mobile"
          />
        ))}
      </div>

      {/* Pagination */}

      <div className="payment-history__pagination">
        <p>
          Showing <strong>{startItem}–{endItem}</strong> of{' '}
          <strong>{orders.length}</strong> transactions
        </p>

        {totalPages > 1 && (
          <div className="payment-history__pagination-actions">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() =>
                setPage((previous) =>
                  Math.max(1, previous - 1)
                )
              }
              aria-label="Previous page"
            >
              <ChevronLeft size={17} />
            </button>

            <span>
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setPage((previous) =>
                  Math.min(totalPages, previous + 1)
                )
              }
              aria-label="Next page"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
