/** Frontend-only payment order schema. Keep this empty by default. */
export const paymentOrders = [];

export const DEMO_PAYMENT_STORAGE_KEY = "behar:demo-payment-orders";

export function getDemoPaymentOrders() {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(DEMO_PAYMENT_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function createDemoPaymentOrder(course) {
  if (!course?.id || !course?.slug) return null;

  const existing = getDemoPaymentOrders().find(
    (order) => order.courseSlug === course.slug
  );

  if (existing) return existing;

  const title =
    typeof course.title === "string"
      ? course.title
      : course.title?.en || course.slug;

  const order = {
    id: `DEMO-ORD-${Date.now()}`,
    orderNumber: `BH-DEMO-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "pending",
    total: Number(course.price) || 0,
    currency: "SAR",
    paymentMethod: { type: "demo", brand: "frontend" },
    items: [
      {
        courseId: course.id,
        courseTitle: title,
        courseTitleAr: course.title?.ar || title,
        courseSlug: course.slug,
      },
    ],
    courseSlug: course.slug,
    isDemo: true,
    paymentVerified: false,
    refundEligible: false,
  };

  const next = [...getDemoPaymentOrders(), order];
  window.localStorage.setItem(
    DEMO_PAYMENT_STORAGE_KEY,
    JSON.stringify(next)
  );

  return order;
}

/** Optional QA/demo records; never presented as real purchases. */
export const mockPaymentOrders = [
  { id: "ORD-1001", orderNumber: "BH-2026-1001", createdAt: "2026-11-20T10:30:00Z", status: "paid", total: 299, currency: "SAR", paymentMethod: { type: "card", brand: "mada" }, items: [{ courseId: "course-001", courseTitle: "Modern React Development" }] },
  { id: "ORD-1002", orderNumber: "BH-2026-1002", createdAt: "2026-11-18T12:00:00Z", status: "pending", total: 149, currency: "SAR", paymentMethod: { type: "card", brand: "visa" }, items: [{ courseId: "course-004", courseTitle: "Visual Identity Masterclass" }] },
];

export const PAYMENT_STATUSES = ["paid", "pending", "processing", "failed", "cancelled", "refunded", "partially_refunded"];
