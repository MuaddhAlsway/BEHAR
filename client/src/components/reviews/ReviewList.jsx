import ReviewCard from "./ReviewCard";
export default function ReviewList({ reviews = [], language = "en" }) { return <div className="review-list">{reviews.map((review) => <ReviewCard key={review.id} review={review} language={language} />)}</div>; }
