import { Download, CircleHelp, WalletCards } from 'lucide-react'
import '../../../styles/student/payments/payments-header.css'

export default function PaymentsHeader({
  onViewReceipts,
  onBillingSupport,
}) {
  return (
    <header className="payments-header">
      <div className="payments-header__content">
        <div className="payments-header__eyebrow">
          Student Dashboard / Billing
        </div>

        <h1>Payments & Billing</h1>

        <p>
          Manage your course purchases, payment history,
          and receipts in one place.
        </p>

        <div className="payments-header__actions">
          <button
            type="button"
            className="payments-header__primary"
            onClick={onViewReceipts}
          >
            <Download size={16} />
            View receipts
          </button>

          <button
            type="button"
            className="payments-header__secondary"
            onClick={onBillingSupport}
          >
            <CircleHelp size={16} />
            Billing support
          </button>
        </div>
      </div>

      <div className="payments-header__visual" aria-hidden="true">
        <WalletCards size={32} strokeWidth={1.5} />
      </div>
    </header>
  )
}