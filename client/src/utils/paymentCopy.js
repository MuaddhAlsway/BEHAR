export const PAYMENT_COPY = {
  en: {
    billing: 'Student Dashboard / Billing', title: 'Payments & Billing',
    intro: 'Manage your course purchases, payment history, and receipts in one place.',
    receipts: 'View receipts', support: 'Billing support', overview: 'Payment overview',
    allTime: 'All-time summary', totalSpent: 'Total spent', netPurchases: 'Net completed purchases',
    totalOrders: 'Total orders', allOrders: 'All purchase orders', successful: 'Successful payments',
    paidPartial: 'Paid and partially refunded', refunded: 'Refunded amount', completedRefunds: 'Completed refunds',
    manage: 'Manage transactions', manageDescription: 'Search, filter and organize your payments.',
    allStatuses: 'All statuses', paid: 'Paid', pending: 'Pending', processing: 'Processing', failed: 'Payment failed', cancelled: 'Cancelled', refundedStatus: 'Refunded', partialRefunded: 'Partially refunded',
    newest: 'Newest first', oldest: 'Oldest first', highest: 'Highest amount', lowest: 'Lowest amount',
    search: 'Search orders or courses...', searchLabel: 'Search payment transactions', filterLabel: 'Filter by payment status', sortLabel: 'Sort payment transactions',
    orders: 'orders', matching: 'Showing matching transactions', clear: 'Clear filters', purchaseDate: 'Purchase date', amount: 'Amount', paymentMethod: 'Payment method', details: 'View transaction details', order: 'Order',
    noTransactions: 'No transactions yet', journey: 'Your learning journey starts here', noTransactionsText: 'Once you purchase a course, your payment history, order details, and available receipts will appear in this space.', explore: 'Explore courses', paymentInfo: 'Payment information',
  },
  ar: {
    billing: 'لوحة الطالب / الفواتير', title: 'المدفوعات والفواتير',
    intro: 'أدر مشتريات دوراتك وسجل المدفوعات والإيصالات في مكان واحد.', receipts: 'عرض الإيصالات', support: 'دعم المدفوعات', overview: 'نظرة عامة على المدفوعات', allTime: 'ملخص شامل',
    totalSpent: 'إجمالي الإنفاق', netPurchases: 'صافي المشتريات المكتملة', totalOrders: 'إجمالي الطلبات', allOrders: 'جميع طلبات الشراء', successful: 'المدفوعات الناجحة', paidPartial: 'مدفوع ومدفوع مسترد جزئياً', refunded: 'المبالغ المستردة', completedRefunds: 'المبالغ المستردة المكتملة',
    manage: 'إدارة المعاملات', manageDescription: 'ابحث عن مدفوعاتك وصفّها ونظّمها.', allStatuses: 'كل الحالات', paid: 'مدفوع', pending: 'قيد الانتظار', processing: 'قيد المعالجة', failed: 'فشل الدفع', cancelled: 'ملغي', refundedStatus: 'تم الاسترداد', partialRefunded: 'تم الاسترداد جزئياً',
    newest: 'الأحدث أولاً', oldest: 'الأقدم أولاً', highest: 'الأعلى قيمة', lowest: 'الأقل قيمة', search: 'ابحث عن الطلبات أو الدورات...', searchLabel: 'البحث في معاملات الدفع', filterLabel: 'التصفية حسب حالة الدفع', sortLabel: 'ترتيب معاملات الدفع', orders: 'طلبات', matching: 'عرض المعاملات المطابقة', clear: 'مسح الفلاتر', purchaseDate: 'تاريخ الشراء', amount: 'المبلغ', paymentMethod: 'طريقة الدفع', details: 'عرض تفاصيل المعاملة', order: 'الطلب',
    noTransactions: 'لا توجد معاملات بعد', journey: 'رحلتك التعليمية تبدأ من هنا', noTransactionsText: 'بعد شراء دورة، سيظهر سجل مدفوعاتك وتفاصيل الطلب والإيصالات المتاحة في هذا المكان.', explore: 'استكشف الدورات', paymentInfo: 'معلومات الدفع',
  },
}

export function getPaymentCopy(locale = 'en-SA') {
  return locale.toLowerCase().startsWith('ar') ? PAYMENT_COPY.ar : PAYMENT_COPY.en
}
