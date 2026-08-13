"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function Trips() {
  const router = useRouter();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = 3; // Mock Guest User

  // Review Modal State
  const [reviewBooking, setReviewBooking] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/users/${userId}/bookings`)
      .then(res => res.json())
      .then(async data => {
        const populatedBookings = await Promise.all(data.map(async (b: any) => {
          try {
            const listRes = await fetch(`http://127.0.0.1:8000/api/listings/${b.listing_id}`);
            const listing = await listRes.json();
            return { ...b, listing };
          } catch {
            return b;
          }
        }));
        setBookings(populatedBookings);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking || !comment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/listings/${reviewBooking.listing_id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: reviewBooking.listing_id,
          user_id: userId,
          rating: rating,
          comment: comment.trim()
        })
      });

      if (res.ok) {
        setReviewSuccess(true);
        setTimeout(() => {
          setReviewBooking(null);
          setReviewSuccess(false);
          setComment("");
        }, 1200);
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <main className="pb-20 bg-gray-50 dark:bg-[#121212] min-h-screen transition-colors">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 xl:px-20 pt-10">
        <h1 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-white">Your Trips</h1>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-[#FF385C]"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800">
            <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-white">No trips booked... yet!</h2>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">Time to dust off your bags and start planning your next stay.</p>
            <button 
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:bg-black dark:hover:bg-neutral-200 transition cursor-pointer"
            >
              Explore destinations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map(booking => (
              <div 
                key={booking.id} 
                className="bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden flex flex-col hover:shadow-md transition duration-200"
              >
                <div 
                  className="h-52 w-full bg-neutral-200 dark:bg-neutral-800 cursor-pointer overflow-hidden relative group"
                  onClick={() => router.push(`/listings/${booking.listing_id}`)}
                >
                  {booking.listing?.imageSrc && (
                    <img 
                      referrerPolicy="no-referrer" 
                      src={booking.listing.imageSrc} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                      alt="" 
                    />
                  )}
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
                    Confirmed
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-xs font-bold text-[#FF385C] uppercase tracking-wider mb-1">
                    {booking.check_in} — {booking.check_out}
                  </p>
                  <h3 
                    onClick={() => router.push(`/listings/${booking.listing_id}`)}
                    className="font-bold text-lg text-neutral-900 dark:text-white hover:underline cursor-pointer line-clamp-1"
                  >
                    {booking.listing?.title || "Reserved Property"}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4 line-clamp-1">{booking.listing?.location}</p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-neutral-800 flex justify-between items-center">
                    <div>
                      <div className="text-xs text-neutral-500">{booking.guests} {booking.guests === 1 ? "guest" : "guests"}</div>
                      <div className="font-bold text-base text-neutral-900 dark:text-white">₹{booking.total_price}</div>
                    </div>
                    
                    <button
                      onClick={() => setReviewBooking(booking)}
                      className="px-3.5 py-2 border border-gray-300 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-white transition cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    >
                      Leave a Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leave a Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#202020] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-neutral-700 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-neutral-700 pb-3">
              <h3 className="font-bold text-lg text-neutral-900 dark:text-white">
                Review Your Stay
              </h3>
              <button 
                onClick={() => setReviewBooking(null)}
                className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <svg viewBox="0 0 32 32" className="w-4 h-4 stroke-current stroke-[3px] fill-none">
                  <path d="M6 6l20 20M26 6L6 26" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              How was your experience at <span className="font-semibold text-neutral-900 dark:text-white">{reviewBooking.listing?.title}</span>?
            </p>

            {/* Interactive 5-Star Rating Picker */}
            <div className="flex flex-col items-center gap-1.5 py-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Overall Rating</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-2xl transition-transform hover:scale-125 cursor-pointer"
                  >
                    <span className={star <= rating ? "text-amber-400" : "text-neutral-300 dark:text-neutral-600"}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{rating} out of 5 stars</span>
            </div>

            {/* Comment Area */}
            <div>
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                Your Feedback
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell future travelers what you loved about this stay..."
                className="w-full border border-gray-300 dark:border-neutral-700 rounded-xl p-3 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent text-neutral-900 dark:text-white"
              />
            </div>

            {reviewSuccess ? (
              <div className="bg-emerald-500 text-white font-bold text-center py-3 rounded-xl">
                ✓ Review Submitted Successfully!
              </div>
            ) : (
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewBooking(null)}
                  className="flex-1 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition cursor-pointer text-neutral-800 dark:text-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={submittingReview || !comment.trim()}
                  className="flex-1 py-3 bg-[#FF385C] hover:bg-[#E00B41] text-white rounded-xl font-bold text-sm transition cursor-pointer disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Post Review"}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </main>
  );
}
