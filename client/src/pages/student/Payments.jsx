
import {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useNavigate } from 'react-router-dom'

import {
  ArrowRight,
  CreditCard,
  FileText,
  LockKeyhole,
  ReceiptText,
} from 'lucide-react'

// ==========================================
// PAYMENT COMPONENTS
// ==========================================

import PaymentsHeader from '../../components/student/payments/PaymentsHeader'
import PaymentStats from '../../components/student/payments/PaymentStats'
import PaymentToolbar from '../../components/student/payments/PaymentToolbar'
import PaymentHistory from '../../components/student/payments/PaymentHistory'
import PaymentDetailsModal from '../../components/student/payments/PaymentDetailsModal'
import PaymentReceipt from '../../components/student/payments/PaymentReceipt'
import RefundRequestModal from '../../components/student/payments/RefundRequestModal'
import RefundHistory from '../../components/student/payments/RefundHistory'
import RefundDetailsModal from '../../components/student/payments/RefundDetailsModal'
import BillingSupportModal from '../../components/student/payments/BillingSupportModal'
import {
  getDemoPaymentOrders,
  paymentOrders,
} from '../../data/payments'

// ==========================================
// UTILITIES
// ==========================================

import { filterPayments } from '../../utils/filterPayments'

// ==========================================
// STYLES
// ==========================================

import '../../styles/student/payments/payments.css'

// ==========================================
// TEMPORARY FRONTEND DATA
// ==========================================

// Replace these with PaymentsContext / API data
// when backend integration is implemented.

const INITIAL_REFUNDS = []

// ==========================================
// PAYMENTS PAGE
// ==========================================

export default function Payments() {
  const navigate = useNavigate()
  const historyRef = useRef(null)

  // ========================================
  // PAYMENT STATE
  // ========================================

  const [orders] = useState(() => [
    ...paymentOrders,
    ...getDemoPaymentOrders(),
  ])
  const [refunds] = useState(INITIAL_REFUNDS)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [receiptOrder, setReceiptOrder] = useState(null)
  const [refundOrder, setRefundOrder] = useState(null)
  const [selectedRefund, setSelectedRefund] = useState(null)
  const [supportContext, setSupportContext] = useState(null)
  const [refundSubmitting] = useState(false)
  const [refundError, setRefundError] = useState('')

  // ========================================
  // TOOLBAR STATE
  // ========================================

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('newest')

  // ========================================
  // CURRENCY SETTINGS
  // ========================================

  const currency = 'SAR'
  const locale = 'en-SA'

  // ========================================
  // PAYMENT SUMMARY
  // ========================================

  const paymentSummary = useMemo(() => {
    const totalOrders = orders.length

    return {
      totalOrders,
      hasOrders: totalOrders > 0,
    }
  }, [orders])

  // ========================================
  // FILTERED TRANSACTIONS
  // ========================================

  const filteredOrders = useMemo(() => {
    return filterPayments(orders, {
      search,
      status,
      sort,
    })
  }, [orders, search, status, sort])

  // ========================================
  // ACTIVE FILTERS
  // ========================================

  const hasActiveFilters = useMemo(() => {
    return (
      search.trim() !== '' ||
      status !== 'all' ||
      sort !== 'newest'
    )
  }, [search, status, sort])

  // ========================================
  // RESET FILTERS
  // ========================================

  const resetFilters = useCallback(() => {
    setSearch('')
    setStatus('all')
    setSort('newest')
  }, [])

  // ========================================
  // VIEW RECEIPTS
  // ========================================

  const handleViewReceipts = useCallback(() => {
    historyRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [])

  // ========================================
  // BILLING SUPPORT
  // ========================================

  const handleBillingSupport = useCallback(() => {
    setSupportContext({
      category: 'payment_issue',
      order: null,
      refund: null,
    })
  }, [])

  // ========================================
  // EXPLORE COURSES
  // ========================================

  const handleExploreCourses = useCallback(() => {
    navigate('/courses')
  }, [navigate])

  const handleViewDetails = useCallback((order) => {
    setSelectedOrder(order)
  }, [])

  const handleCloseDetails = useCallback(() => {
    setSelectedOrder(null)
  }, [])

  const handleDownloadReceipt = useCallback((order) => {
    setSelectedOrder(null)
    setReceiptOrder(order)
  }, [])

  const handleCloseReceipt = useCallback(() => {
    setReceiptOrder(null)
  }, [])

  const handleRequestRefund = useCallback((order) => {
    if (!order) return
    setSelectedOrder(null)
    setRefundError('')
    setRefundOrder(order)
  }, [])

  const handleCloseRefund = useCallback(() => {
    if (refundSubmitting) return
    setRefundOrder(null)
    setRefundError('')
  }, [refundSubmitting])

  const handleViewRefundDetails = useCallback((refund) => {
    if (!refund) return
    setSelectedRefund(refund)
  }, [])

  const handleCloseRefundDetails = useCallback(() => {
    setSelectedRefund(null)
  }, [])

  const handleRefundSupport = useCallback((refund) => {
    if (!refund) return

    const relatedOrder =
      orders.find((order) => order.id === refund.orderId) || null

    setSelectedRefund(null)
    setSupportContext({
      category: 'refund_inquiry',
      order: relatedOrder,
      refund,
    })
  }, [orders])

  const handleCloseBillingSupport = useCallback(() => {
    setSupportContext(null)

    requestAnimationFrame(() => {
      document
        .querySelector('.payments-header__secondary')
        ?.focus()
    })
  }, [])

  const selectedRefundOrder = useMemo(() => {
    if (!selectedRefund) return null

    return (
      orders.find((order) => order.id === selectedRefund.orderId) || null
    )
  }, [orders, selectedRefund])

  // ========================================
  // RENDER
  // ========================================

  return (
    <main className="student-payments">

      {/* ====================================
          01 — PAYMENTS HEADER
      ==================================== */}

      <PaymentsHeader
        onViewReceipts={handleViewReceipts}
        onBillingSupport={handleBillingSupport}
      />

      {/* ====================================
          02 — PAYMENT STATISTICS
      ==================================== */}

      <PaymentStats
        orders={orders}
        refunds={refunds}
        currency={currency}
        locale={locale}
      />

      {/* ====================================
          03 — TRANSACTION HISTORY
      ==================================== */}

      <section
        ref={historyRef}
        id="payment-history"
        className="student-payments__history"
        aria-labelledby="payment-history-heading"
      >

        {/* Section heading */}

        <div className="student-payments__section-header">
          <div className="student-payments__section-heading">

            <span className="student-payments__eyebrow">
              Your activity
            </span>

            <h2 id="payment-history-heading">
              Transaction history
            </h2>

            <p>
              Review your course purchases,
              payment statuses, and available receipts.
            </p>

          </div>

          {paymentSummary.hasOrders && (
            <span className="student-payments__order-count">
              {paymentSummary.totalOrders}{' '}
              {paymentSummary.totalOrders === 1
                ? 'order'
                : 'orders'}
            </span>
          )}
        </div>

        {/* ==================================
            TRANSACTION CONTENT
        ================================== */}

        {paymentSummary.hasOrders ? (

          <div className="student-payments__history-content">

            {/* P14.16.03 — PAYMENT TOOLBAR */}

            <PaymentToolbar
              search={search}
              onSearchChange={setSearch}
              status={status}
              onStatusChange={setStatus}
              sort={sort}
              onSortChange={setSort}
              onReset={resetFilters}
              totalCount={orders.length}
              resultCount={filteredOrders.length}
            />

            <PaymentHistory
              orders={filteredOrders}
              currency={currency}
              locale={locale}
              hasActiveFilters={hasActiveFilters}
              onResetFilters={resetFilters}
              onViewDetails={handleViewDetails}
            />

          </div>

        ) : (

          /* ==================================
              EMPTY PAYMENT HISTORY
          ================================== */

          <div className="student-payments__empty">

            {/* Illustration */}

            <div
              className="student-payments__empty-visual"
              aria-hidden="true"
            >

              <div className="student-payments__empty-icon">
                <ReceiptText
                  size={30}
                  strokeWidth={1.5}
                />
              </div>

              <span className="student-payments__empty-decoration student-payments__empty-decoration--one">
                <FileText size={16} />
              </span>

              <span className="student-payments__empty-decoration student-payments__empty-decoration--two">
                <CreditCard size={16} />
              </span>

            </div>

            {/* Content */}

            <div className="student-payments__empty-content">

              <span className="student-payments__empty-label">
                No transactions yet
              </span>

              <h3>
                Your learning journey starts here
              </h3>

              <p>
                Once you purchase a course,
                your payment history, order details,
                and available receipts will appear
                in this space.
              </p>

              <button
                type="button"
                className="student-payments__explore"
                onClick={handleExploreCourses}
              >
                Explore courses

                <ArrowRight
                  size={16}
                  aria-hidden="true"
                />
              </button>

            </div>

          </div>

        )}

      </section>

      {/* ====================================
          04 — REFUND HISTORY
      ==================================== */}

      <RefundHistory
        refunds={refunds}
        currency={currency}
        locale={locale}
        onViewDetails={handleViewRefundDetails}
      />

      {/* ====================================
          05 — PAYMENT INFORMATION
      ==================================== */}

      <section
        className="student-payments__info"
        aria-label="Payment information"
      >

        <div className="student-payments__info-icon">
          <LockKeyhole
            size={19}
            aria-hidden="true"
          />
        </div>

        <div className="student-payments__info-content">

          <h3>
            Payment information
          </h3>

          <p>
            This page displays your recorded course
            purchases and billing activity.
            Payment processing and sensitive card
            details are handled separately.
          </p>

        </div>

      </section>

      <PaymentDetailsModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={handleCloseDetails}
        onDownloadReceipt={handleDownloadReceipt}
        onRequestRefund={handleRequestRefund}
        currency={currency}
        locale={locale}
      />

      <PaymentReceipt
        order={receiptOrder}
        isOpen={Boolean(receiptOrder)}
        onClose={handleCloseReceipt}
        currency={currency}
        locale={locale}
      />

      <RefundRequestModal
        order={refundOrder}
        isOpen={Boolean(refundOrder)}
        onClose={handleCloseRefund}
        isSubmitting={refundSubmitting}
        submitError={refundError}
        currency={currency}
        locale={locale}
      />

      <RefundDetailsModal
        refund={selectedRefund}
        order={selectedRefundOrder}
        isOpen={Boolean(selectedRefund)}
        onClose={handleCloseRefundDetails}
        onContactSupport={handleRefundSupport}
        currency={currency}
        locale={locale}
      />

      <BillingSupportModal
        isOpen={Boolean(supportContext)}
        onClose={handleCloseBillingSupport}
        initialCategory={supportContext?.category || 'payment_issue'}
        order={supportContext?.order || null}
        refund={supportContext?.refund || null}
      />

    </main>
  )
}
