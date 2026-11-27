export default function ReviewEmptyState({ children = "No reviews yet." }) { return <div className="review-empty-state" role="status">{children}</div>; }
