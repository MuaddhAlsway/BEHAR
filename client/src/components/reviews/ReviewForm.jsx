import { useEffect, useState } from "react";
import StarRating from "./StarRating";
export default function ReviewForm({ initialReview, onSubmit, onCancel, courseTitle, instructor }) {
  const [rating, setRating] = useState(initialReview?.rating || 0);
  const [title, setTitle] = useState(initialReview?.title || "");
  const [comment, setComment] = useState(initialReview?.comment || "");
  const [error, setError] = useState("");
  useEffect(() => { setRating(initialReview?.rating || 0); setTitle(initialReview?.title || ""); setComment(initialReview?.comment || ""); setError(""); }, [initialReview]);
  const submit = (event) => { event.preventDefault(); if (!rating || !title.trim() || comment.trim().length < 10) { setError("Add a rating, title, and at least 10 characters."); return; } onSubmit?.({ rating, title: title.trim(), comment: comment.trim() }); };
  return <form className="review-form" onSubmit={submit}>
    <header className="review-form__header"><div><span>BEHAR / COURSE REVIEW</span><h3>{courseTitle || "Share your experience"}</h3>{instructor && <small>{instructor}</small>}</div>{onCancel && <button type="button" className="review-form__close" onClick={onCancel} aria-label="Close review form">×</button>}</header>
    <label className="review-form__rating">Your rating<StarRating value={rating} onChange={setRating}/></label>
    <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} /></label>
    <label>Comment<textarea value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1000} /><small>{comment.length}/1000</small></label>
    {error && <p role="alert">{error}</p>}
    <footer><button type="submit">{initialReview ? "Save changes" : "Publish review"}</button>{onCancel && <button type="button" onClick={onCancel}>Cancel</button>}</footer>
  </form>;
}
