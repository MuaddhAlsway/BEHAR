import { Download, CircleHelp, WalletCards } from 'lucide-react'
import '../../../styles/student/payments/payments-header.css'
import { getPaymentCopy } from '../../../utils/paymentCopy'

export default function PaymentsHeader({
  onViewReceipts,
  onBillingSupport,
  locale = 'en-SA',
}) {
  const copy = getPaymentCopy(locale)
  return (
    <header className="payments-header">
      <div className="payments-header__content">
        <div className="payments-header__eyebrow">
          {copy.billing}
        </div>

        <h1>{copy.title}</h1>

        <p>
          {copy.intro}
        </p>

        <div className="payments-header__actions">
          <button
            type="button"
            className="payments-header__primary"
            onClick={onViewReceipts}
          >
            <Download size={16} />
            {copy.receipts}
          </button>

          <button
            type="button"
            className="payments-header__secondary"
            onClick={onBillingSupport}
          >
            <CircleHelp size={16} />
            {copy.support}
          </button>
        </div>
      </div>

      <div className="payments-header__visual" aria-hidden="true">
        <WalletCards size={32} strokeWidth={1.5} />
      </div>
    </header>
  )
}
