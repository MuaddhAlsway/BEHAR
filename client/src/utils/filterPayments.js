
export function filterPayments(
  orders = [],
  {
    search = '',
    status = 'all',
    sort = 'newest',
  } = {}
) {
  const query = search.trim().toLowerCase()

  const normalizedStatus = (value) =>
    String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, '_')

  const filtered = orders.filter((order) => {
    const searchableText = [
      order.id,
      order.orderNumber,
      ...(Array.isArray(order.items)
        ? order.items.flatMap((item) => [
            item.title,
            item.courseTitle,
            item.courseId,
          ])
        : []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    const matchesSearch =
      !query || searchableText.includes(query)

    const matchesStatus =
      status === 'all' ||
      normalizedStatus(order.status) === status

    return matchesSearch && matchesStatus
  })

  const getDate = (order) => {
    const timestamp = new Date(order.createdAt).getTime()
    return Number.isFinite(timestamp) ? timestamp : 0
  }

  const getTotal = (order) => {
    const amount = Number(order.total)
    return Number.isFinite(amount) ? amount : 0
  }

  return [...filtered].sort((a, b) => {
    switch (sort) {
      case 'oldest':
        return getDate(a) - getDate(b)

      case 'highest':
        return getTotal(b) - getTotal(a)

      case 'lowest':
        return getTotal(a) - getTotal(b)

      case 'newest':
      default:
        return getDate(b) - getDate(a)
    }
  })
}
