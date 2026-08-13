"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useAuth } from "@/components/AuthContext";

export default function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const { currentUser } = useAuth();
  
  // Format today and tomorrow for pre-fed date values
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success">("idle");
  const [dates, setDates] = useState({ checkIn: getTodayDate(), checkOut: getTomorrowDate() });
  
  // Interactive guest counter states
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);

  const totalGuests = adults + childrenCount;
  const maxGuests = 5;

  const [nights, setNights] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Mock Payment & Checkout Modal State
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "netbanking">("card");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("888");

  // Review state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem("airbnb_wishlist");
      if (saved) {
        try {
          const list = JSON.parse(saved);
          if (Array.isArray(list)) setIsWishlisted(list.includes(Number(id)));
        } catch {}
      }
    }
  }, [id]);

  const toggleWishlist = () => {
    const next = !isWishlisted;
    setIsWishlisted(next);
    if (id) {
      const saved = localStorage.getItem("airbnb_wishlist");
      let list: number[] = [];
      try { list = saved ? JSON.parse(saved) : []; } catch {}
      if (!Array.isArray(list)) list = [];
      if (next) {
        if (!list.includes(Number(id))) list.push(Number(id));
      } else {
        list = list.filter(item => item !== Number(id));
      }
      localStorage.setItem("airbnb_wishlist", JSON.stringify(list));
      window.dispatchEvent(new Event("wishlist-updated"));
    }
  };

  const fetchListingData = () => {
    fetch(`http://127.0.0.1:8000/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        try {
          data.parsedImages = JSON.parse(data.images || "[]");
        } catch {
          data.parsedImages = [data.imageSrc];
        }
        try {
          data.parsedAmenities = JSON.parse(data.amenities || "[]");
        } catch {
          data.parsedAmenities = ["Wifi", "Air conditioning", "Kitchen", "Dedicated workspace"];
        }
        setListing(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch listing:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchListingData();
  }, [id]);

  useEffect(() => {
    if (dates.checkIn && dates.checkOut) {
      const inDate = new Date(dates.checkIn);
      const outDate = new Date(dates.checkOut);
      const diffTime = outDate.getTime() - inDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays > 0 ? diffDays : 0);
    } else {
      setNights(0);
    }
  }, [dates]);

  const handleOpenCheckout = () => {
    if (!dates.checkIn || !dates.checkOut) {
      setErrorMessage("Please select both check-in and checkout dates.");
      return;
    }
    if (nights <= 0) {
      setErrorMessage("Checkout date must be after check-in date.");
      return;
    }
    setErrorMessage(null);
    setIsMobileDrawerOpen(false);
    setIsGuestDropdownOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmAndPay = async () => {
    setBookingStatus("loading");
    setErrorMessage(null);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing_id: Number(id),
          user_id: currentUser.id || 3,
          check_in: dates.checkIn,
          check_out: dates.checkOut,
          guests: totalGuests,
          total_price: (listing.price_per_night || 3000) * nights,
        }),
      });
      
      if (response.ok) {
        setBookingStatus("success");
        setTimeout(() => {
          setIsCheckoutModalOpen(false);
          router.push("/trips");
        }, 1500);
      } else {
        const errorData = await response.json();
        setIsCheckoutModalOpen(false);
        setErrorMessage(errorData.detail || "Unable to complete reservation. The property may already be booked for these dates.");
        setBookingStatus("idle");
      }
    } catch (error) {
      console.error("Booking failed:", error);
      setIsCheckoutModalOpen(false);
      setErrorMessage("Server connection error. Please ensure the backend server is running.");
      setBookingStatus("idle");
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/listings/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: Number(id),
          user_id: currentUser.id || 3,
          rating: reviewRating,
          comment: reviewComment.trim()
        })
      });

      if (res.ok) {
        setIsReviewModalOpen(false);
        setReviewComment("");
        fetchListingData();
      }
    } catch (err) {
      console.error("Failed to post review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col bg-white dark:bg-[#121212] pb-20">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF385C]"></div>
        </div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="min-h-screen flex flex-col bg-white dark:bg-[#121212] pb-20">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">Listing not found</h2>
          <p className="text-neutral-500 mb-6">The property you are looking for does not exist or has been removed.</p>
          <button 
            onClick={() => router.push("/")}
            className="px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-semibold hover:bg-black transition cursor-pointer"
          >
            Return to Homepage
          </button>
        </div>
      </main>
    );
  }

  const pricePerNight = listing.price_per_night || 3000;
  const basePrice = pricePerNight * (nights > 0 ? nights : 1);
  const serviceFee = nights > 0 ? Math.round(basePrice * 0.14) : 0;
  const totalPrice = basePrice + serviceFee;

  const getGuestSummaryLabel = () => {
    let text = `${totalGuests} ${totalGuests === 1 ? "guest" : "guests"}`;
    if (infants > 0) {
      text += `, ${infants} ${infants === 1 ? "infant" : "infants"}`;
    }
    return text;
  };

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-[#121212] pb-28 md:pb-20 relative transition-colors">
      <Header />

      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 md:px-10 xl:px-12 pt-6 sm:pt-8 w-full">
        
        {/* Title & Header info */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-end gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-white mb-2">
              {listing.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
              <span className="font-semibold flex items-center gap-1">
                ★ {listing.rating ? listing.rating.toFixed(2) : "5.00"}
              </span>
              <span>·</span>
              <span className="underline font-medium cursor-pointer">
                {listing.reviews?.length || 4} reviews
              </span>
              <span>·</span>
              <span className="bg-rose-50 dark:bg-rose-950/60 text-[#FF385C] font-semibold text-xs px-2 py-0.5 rounded-full">
                ★ Superhost
              </span>
              <span>·</span>
              <span className="text-neutral-600 dark:text-neutral-400">
                {listing.location}
              </span>
            </div>
          </div>

          <button
            onClick={toggleWishlist}
            className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition cursor-pointer text-sm font-semibold text-neutral-800 dark:text-neutral-200 self-start sm:self-auto"
          >
            <svg
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 transition-transform active:scale-75 duration-150"
              style={{
                fill: isWishlisted ? "#FF385C" : "none",
                stroke: isWishlisted ? "#FF385C" : "currentColor",
                strokeWidth: 2.5
              }}
            >
              <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z" />
            </svg>
            <span className="underline">{isWishlisted ? "Saved" : "Save"}</span>
          </button>
        </div>
        
        {/* 5-Image Gallery */}
        <div className="w-full h-[280px] sm:h-[380px] md:h-[450px] rounded-2xl overflow-hidden mb-8 grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-2 bg-neutral-100 dark:bg-neutral-800">
          {listing.parsedImages && listing.parsedImages.length > 0 ? (
            <>
              <div className="col-span-2 row-span-2 relative group overflow-hidden">
                <img 
                  referrerPolicy="no-referrer" 
                  src={listing.parsedImages[0]} 
                  alt="Listing cover" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer" 
                />
              </div>
              <div className="hidden md:block col-span-1 row-span-1 relative group overflow-hidden">
                <img 
                  referrerPolicy="no-referrer" 
                  src={listing.parsedImages[1] || listing.parsedImages[0]} 
                  alt="Listing photo 2" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer" 
                />
              </div>
              <div className="hidden md:block col-span-1 row-span-1 relative group overflow-hidden">
                <img 
                  referrerPolicy="no-referrer" 
                  src={listing.parsedImages[2] || listing.parsedImages[0]} 
                  alt="Listing photo 3" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer" 
                />
              </div>
              <div className="hidden md:block col-span-1 row-span-1 relative group overflow-hidden">
                <img 
                  referrerPolicy="no-referrer" 
                  src={listing.parsedImages[3] || listing.parsedImages[0]} 
                  alt="Listing photo 4" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer" 
                />
              </div>
              <div className="hidden md:block col-span-1 row-span-1 relative group overflow-hidden">
                <img 
                  referrerPolicy="no-referrer" 
                  src={listing.parsedImages[4] || listing.parsedImages[0]} 
                  alt="Listing photo 5" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer" 
                />
              </div>
            </>
          ) : (
             <div className="col-span-4 row-span-2">
               <img 
                 referrerPolicy="no-referrer" 
                 src={listing.imageSrc} 
                 alt="Listing cover" 
                 className="w-full h-full object-cover hover:scale-105 transition duration-500" 
               />
             </div>
          )}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* Left / Center Details Section */}
          <div className="lg:col-span-2 flex flex-col gap-6 pb-8">
            <div className="flex justify-between items-center pb-6 border-b border-gray-200 dark:border-neutral-800">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white">
                  Entire {listing.property_type?.toLowerCase() || "home"} hosted by {listing.host?.name || "Airbnb Superhost"}
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                  2 guests · 1 bedroom · 1 bed · 1 private bath · <span className="text-[#FF385C] font-semibold">Superhost</span> · <span className="text-emerald-600 dark:text-emerald-400">Govt ID Verified</span>
                </p>
              </div>
              <div className="w-14 h-14 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700 flex-shrink-0 border border-gray-200 dark:border-neutral-600">
                {listing.host?.avatar_url ? (
                  <img src={listing.host.avatar_url} alt="host" className="w-full h-full object-cover"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-200 text-lg">
                    {listing.host?.name ? listing.host.name[0] : "H"}
                  </div>
                )}
              </div>
            </div>
            
            {/* Highlights */}
            <div className="flex flex-col gap-4 py-2 border-b border-gray-200 dark:border-neutral-800 text-sm text-neutral-800 dark:text-neutral-200">
              <div className="flex items-start gap-4">
                <svg viewBox="0 0 32 32" className="w-6 h-6 flex-shrink-0 fill-current text-neutral-800 dark:text-neutral-200">
                  <path d="M16 1a15 15 0 1 0 15 15A15 15 0 0 0 16 1zm0 28a13 13 0 1 1 13-13 13 13 0 0 1-13 13zm1-20h-2v9h8v-2h-6z" />
                </svg>
                <div>
                  <div className="font-semibold text-base">Self check-in</div>
                  <div className="text-neutral-500 dark:text-neutral-400 font-light">Check yourself in with the keypad or smart lock.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <svg viewBox="0 0 32 32" className="w-6 h-6 flex-shrink-0 fill-current text-[#FF385C]">
                  <path d="M16 2l3.5 9.5L29 15l-7.5 6.5L23.5 31 16 25.5 8.5 31l2-9.5L3 15l9.5-3.5L16 2z" />
                </svg>
                <div>
                  <div className="font-semibold text-base">Superhost status</div>
                  <div className="text-neutral-500 dark:text-neutral-400 font-light">Superhosts are experienced, highly rated hosts committed to great stays.</div>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="py-2 border-b border-gray-200 dark:border-neutral-800">
              <h3 className="font-semibold text-lg mb-3 text-neutral-900 dark:text-white">About this place</h3>
              <div className="flex flex-col gap-3 text-neutral-700 dark:text-neutral-300 leading-relaxed font-light text-base">
                {listing.description?.split("\n").map((para: string, idx: number) => (
                   <p key={idx}>{para}</p>
                )) || <p>A wonderful stay curated with great attention to comfort and luxury.</p>}
              </div>

              {/* Contact Host Button */}
              <div className="mt-4">
                <button
                  onClick={() => router.push("/messages")}
                  className="px-5 py-2.5 border border-black dark:border-white rounded-xl text-xs font-bold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition cursor-pointer"
                >
                  Contact Host ({listing.host?.name || "Host"})
                </button>
              </div>
            </div>

            {/* Amenities */}
            <div className="py-2 border-b border-gray-200 dark:border-neutral-800">
              <h3 className="text-lg font-semibold mb-4 text-neutral-900 dark:text-white">What this place offers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {listing.parsedAmenities?.map((amenity: string, idx: number) => (
                   <div key={idx} className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300 font-light">
                     <svg viewBox="0 0 32 32" className="w-5 h-5 fill-current text-neutral-800 dark:text-neutral-200">
                       <path d="M16 1c8.284 0 15 6.716 15 15 0 8.284-6.716 15-15 15-8.284 0-15-6.716-15-15C1 7.716 7.716 1 16 1zm0 2c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13zm4.24 9.05l1.42 1.42L13.7 21.43l-5.65-5.65 1.42-1.42 4.23 4.23z" />
                     </svg>
                     <span>{amenity}</span>
                   </div>
                ))}
              </div>
            </div>

            {/* Reviews Section with Leave Review Trigger */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-neutral-900 dark:text-white">
                    ★ {listing.rating ? listing.rating.toFixed(2) : "5.00"}
                  </span>
                  <span className="text-neutral-400">·</span>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    {listing.reviews?.length || 4} reviews
                  </h3>
                </div>

                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-xl text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-white transition cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800"
                >
                  + Write a Review
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {listing.reviews && listing.reviews.length > 0 ? (
                  listing.reviews.map((rev: any) => (
                    <div key={rev.id} className="flex flex-col gap-2 p-4 rounded-xl border border-gray-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#1a1a1a]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden flex-shrink-0">
                          {rev.user?.avatar_url ? (
                            <img src={rev.user.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-300 text-sm">
                              {rev.user?.name ? rev.user.name[0] : "G"}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">{rev.user?.name || "Guest Traveler"}</h4>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">{rev.created_at || "Recent stay"}</p>
                        </div>
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300 font-light text-sm mt-1">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-neutral-500 font-light">No reviews yet. Be the first to review!</div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Responsive Reserve Widget */}
          <div id="booking-widget-container" className="lg:col-span-1 relative">
            <div className="sticky top-28 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              
              {/* Pricing Header */}
              <div className="flex justify-between items-baseline">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-neutral-900 dark:text-white">₹{pricePerNight}</span>
                  <span className="text-neutral-500 dark:text-neutral-400 font-light text-sm">night</span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  <span>★</span>
                  <span>{listing.rating ? listing.rating.toFixed(2) : "5.00"}</span>
                </div>
              </div>
              
              {/* Date & Interactive Guest Selector Box */}
              <div className="border border-gray-300 dark:border-neutral-700 rounded-xl flex flex-col mt-1 bg-white dark:bg-[#252525] shadow-xs relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-300 dark:divide-neutral-700 border-b border-gray-300 dark:border-neutral-700 rounded-t-xl overflow-hidden">
                  
                  {/* Check-In Input */}
                  <div 
                    onClick={(e) => {
                      const inp = e.currentTarget.querySelector('input');
                      if (inp && 'showPicker' in inp) {
                        try { (inp as any).showPicker(); } catch {}
                      }
                    }}
                    className="p-3 flex flex-col justify-center bg-white dark:bg-[#252525] hover:bg-neutral-50 dark:hover:bg-[#2d2d2d] transition cursor-pointer relative focus-within:ring-2 focus-within:ring-black"
                  >
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-300 mb-0.5">Check-in</label>
                    <input 
                      type="date"
                      min={getTodayDate()}
                      className="outline-none text-sm font-semibold w-full text-neutral-800 dark:text-white cursor-pointer bg-transparent"
                      value={dates.checkIn}
                      onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
                    />
                  </div>

                  {/* Checkout Input */}
                  <div 
                    onClick={(e) => {
                      const inp = e.currentTarget.querySelector('input');
                      if (inp && 'showPicker' in inp) {
                        try { (inp as any).showPicker(); } catch {}
                      }
                    }}
                    className="p-3 flex flex-col justify-center bg-white dark:bg-[#252525] hover:bg-neutral-50 dark:hover:bg-[#2d2d2d] transition cursor-pointer relative focus-within:ring-2 focus-within:ring-black"
                  >
                    <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-300 mb-0.5">Checkout</label>
                    <input 
                      type="date"
                      min={dates.checkIn || getTodayDate()}
                      className="outline-none text-sm font-semibold w-full text-neutral-800 dark:text-white cursor-pointer bg-transparent"
                      value={dates.checkOut}
                      onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
                    />
                  </div>
                </div>

                {/* Interactive Guests Trigger */}
                <div 
                  onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                  className="p-3 flex items-center justify-between bg-white dark:bg-[#252525] hover:bg-neutral-50 dark:hover:bg-[#2d2d2d] transition cursor-pointer rounded-b-xl"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-300 mb-0.5">Guests</span>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-white">{getGuestSummaryLabel()}</span>
                  </div>
                  <svg 
                    viewBox="0 0 32 32" 
                    className={`w-4 h-4 stroke-current stroke-[3px] fill-none text-neutral-600 dark:text-neutral-400 transition-transform duration-200 ${isGuestDropdownOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M28 12L16 24 4 12" />
                  </svg>
                </div>

                {/* Airbnb Interactive Stepper Menu Dropdown */}
                {isGuestDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#222] rounded-2xl border border-gray-200 dark:border-neutral-700 p-5 shadow-2xl z-50 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
                    
                    {/* Adults */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-700">
                      <div>
                        <div className="font-semibold text-sm text-neutral-900 dark:text-white">Adults</div>
                        <div className="text-xs text-neutral-500 font-light">Age 13+</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={adults <= 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            setAdults(Math.max(1, adults - 1));
                          }}
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-base text-neutral-700 dark:text-neutral-200 hover:border-black dark:hover:border-white disabled:opacity-30 cursor-pointer"
                        >
                          –
                        </button>
                        <span className="w-5 text-center font-semibold text-sm text-neutral-900 dark:text-white">{adults}</span>
                        <button
                          type="button"
                          disabled={totalGuests >= maxGuests}
                          onClick={(e) => {
                            e.stopPropagation();
                            setAdults(adults + 1);
                          }}
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-base text-neutral-700 dark:text-neutral-200 hover:border-black dark:hover:border-white disabled:opacity-30 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-700">
                      <div>
                        <div className="font-semibold text-sm text-neutral-900 dark:text-white">Children</div>
                        <div className="text-xs text-neutral-500 font-light">Ages 2–12</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={childrenCount <= 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setChildrenCount(Math.max(0, childrenCount - 1));
                          }}
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-base text-neutral-700 dark:text-neutral-200 hover:border-black dark:hover:border-white disabled:opacity-30 cursor-pointer"
                        >
                          –
                        </button>
                        <span className="w-5 text-center font-semibold text-sm text-neutral-900 dark:text-white">{childrenCount}</span>
                        <button
                          type="button"
                          disabled={totalGuests >= maxGuests}
                          onClick={(e) => {
                            e.stopPropagation();
                            setChildrenCount(childrenCount + 1);
                          }}
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-base text-neutral-700 dark:text-neutral-200 hover:border-black dark:hover:border-white disabled:opacity-30 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between pb-2">
                      <div>
                        <div className="font-semibold text-sm text-neutral-900 dark:text-white">Infants</div>
                        <div className="text-xs text-neutral-500 font-light">Under 2</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={infants <= 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setInfants(Math.max(0, infants - 1));
                          }}
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-base text-neutral-700 dark:text-neutral-200 hover:border-black dark:hover:border-white disabled:opacity-30 cursor-pointer"
                        >
                          –
                        </button>
                        <span className="w-5 text-center font-semibold text-sm text-neutral-900 dark:text-white">{infants}</span>
                        <button
                          type="button"
                          disabled={infants >= 3}
                          onClick={(e) => {
                            e.stopPropagation();
                            setInfants(infants + 1);
                          }}
                          className="w-8 h-8 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-base text-neutral-700 dark:text-neutral-200 hover:border-black dark:hover:border-white disabled:opacity-30 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light">
                      This place has a maximum of {maxGuests} guests, not including infants.
                    </p>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsGuestDropdownOpen(false);
                        }}
                        className="font-semibold text-sm underline text-neutral-900 dark:text-white hover:opacity-80 cursor-pointer py-1 px-2"
                      >
                        Close
                      </button>
                    </div>

                  </div>
                )}
              </div>

              {/* Reserve Button */}
              <button 
                onClick={handleOpenCheckout}
                className="w-full bg-[#FF385C] hover:bg-[#E00B41] active:scale-[0.98] text-white font-bold text-base py-3.5 rounded-xl transition duration-200 shadow-md cursor-pointer"
              >
                Reserve
              </button>
              
              <div className="text-center text-xs text-neutral-500 dark:text-neutral-400 font-light">
                You won't be charged until final review
              </div>

              {/* Price Calculation Breakdown */}
              {nights > 0 && (
                <div className="flex flex-col gap-3 mt-3 text-neutral-700 dark:text-neutral-300 text-sm font-light">
                  <div className="flex justify-between">
                    <span className="underline">₹{pricePerNight} x {nights} {nights === 1 ? "night" : "nights"}</span>
                    <span>₹{basePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="underline">Airbnb service fee</span>
                    <span>₹{serviceFee}</span>
                  </div>
                  <hr className="border-gray-200 dark:border-neutral-800 my-1" />
                  <div className="flex justify-between font-bold text-neutral-900 dark:text-white text-base">
                    <span>Total before taxes</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* Mobile / Small-screen Fixed Bottom Reserve Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1c1c1c] border-t border-gray-200 dark:border-neutral-800 px-5 py-3 flex items-center justify-between z-40 shadow-2xl">
        <div 
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex flex-col cursor-pointer"
        >
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-neutral-900 dark:text-white">₹{pricePerNight}</span>
            <span className="text-neutral-500 dark:text-neutral-400 text-xs font-light">night</span>
          </div>
          <span className="text-xs underline text-neutral-700 dark:text-neutral-300 font-medium">
            {dates.checkIn && dates.checkOut ? `${dates.checkIn.slice(5)} – ${dates.checkOut.slice(5)} · ${getGuestSummaryLabel()}` : "Select dates"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="p-2.5 border border-gray-300 dark:border-neutral-700 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
            aria-label="Edit dates"
          >
            <svg viewBox="0 0 32 32" className="w-4 h-4 fill-none stroke-current stroke-[2.5px] text-neutral-700 dark:text-neutral-300">
              <path d="M4 8h24v20H4zM4 14h24M9 4v4M23 4v4" />
            </svg>
          </button>
          
          <button
            onClick={handleOpenCheckout}
            className="bg-[#FF385C] hover:bg-[#E00B41] active:scale-95 text-white font-bold text-sm px-6 py-3 rounded-xl transition shadow-md cursor-pointer"
          >
            Reserve
          </button>
        </div>
      </div>

      {/* Mocked Airbnb Checkout & Payment Processing Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#202020] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-neutral-700 flex flex-col gap-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-neutral-700 pb-3">
              <h3 className="font-bold text-xl text-neutral-900 dark:text-white">Confirm and Pay</h3>
              <button onClick={() => setIsCheckoutModalOpen(false)} className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer">
                <svg viewBox="0 0 32 32" className="w-4 h-4 stroke-current stroke-[3px] fill-none">
                  <path d="M6 6l20 20M26 6L6 26" />
                </svg>
              </button>
            </div>

            {/* Stay Summary Card */}
            <div className="flex gap-4 p-4 rounded-2xl bg-neutral-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-neutral-800">
              <img src={listing.imageSrc} alt="" className="w-24 h-20 rounded-xl object-cover" />
              <div className="flex flex-col justify-between overflow-hidden">
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1">{listing.title}</h4>
                <p className="text-xs text-neutral-500">{dates.checkIn} &rarr; {dates.checkOut} ({nights} nights)</p>
                <div className="font-bold text-base text-neutral-900 dark:text-white">Total: ₹{totalPrice}</div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-2">Pay With</label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    paymentMethod === "card"
                      ? "border-black dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-black"
                      : "border-gray-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  💳 Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    paymentMethod === "upi"
                      ? "border-black dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-black"
                      : "border-gray-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  📱 UPI / GPay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    paymentMethod === "netbanking"
                      ? "border-black dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-black"
                      : "border-gray-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  🏦 Net Banking
                </button>
              </div>

              {paymentMethod === "card" ? (
                <div className="flex flex-col gap-3 border border-gray-300 dark:border-neutral-700 rounded-2xl p-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-sm font-semibold outline-none bg-transparent text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-neutral-700">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">Expiration</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full text-sm font-semibold outline-none bg-transparent text-neutral-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-neutral-500 block mb-1">CVV</label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full text-sm font-semibold outline-none bg-transparent text-neutral-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-dashed border-gray-300 dark:border-neutral-700 text-center text-sm text-neutral-600 dark:text-neutral-300">
                  Instant Mocked Payment Gateway Ready (Zero transaction charges)
                </div>
              )}
            </div>

            {/* Cancellation Policy */}
            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              Free cancellation before 48 hours of check-in. By clicking Confirm, you agree to the Airbnb Clone Terms of Service.
            </div>

            {/* Action Button */}
            {bookingStatus === "success" ? (
              <div className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl text-center shadow-lg animate-in fade-in">
                ✓ Payment Successful & Confirmed!
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConfirmAndPay}
                disabled={bookingStatus === "loading"}
                className="w-full bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-base py-4 rounded-2xl transition shadow-xl cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {bookingStatus === "loading" ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <span>Confirm & Pay ₹{totalPrice}</span>
                )}
              </button>
            )}

          </div>
        </div>
      )}

      {/* Write a Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#202020] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-neutral-700 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-neutral-700 pb-3">
              <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Leave a Review</h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <svg viewBox="0 0 32 32" className="w-4 h-4 stroke-current stroke-[3px] fill-none">
                  <path d="M6 6l20 20M26 6L6 26" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center gap-1 py-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase">Rate your stay</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setReviewRating(star)} className="text-2xl hover:scale-125 transition">
                    <span className={star <= reviewRating ? "text-amber-400" : "text-neutral-300 dark:text-neutral-600"}>★</span>
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{reviewRating} out of 5</span>
            </div>

            <textarea
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="What did you think of the amenities, host hospitality, and cleanliness?"
              className="w-full border border-gray-300 dark:border-neutral-700 rounded-xl p-3 text-sm outline-none bg-transparent text-neutral-900 dark:text-white"
            />

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddReview}
                disabled={submittingReview || !reviewComment.trim()}
                className="flex-1 py-3 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-sm rounded-xl transition disabled:opacity-50"
              >
                {submittingReview ? "Posting..." : "Post Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-Page Error Modal Window */}
      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#202020] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-neutral-700 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-neutral-700 pb-3">
              <div className="flex items-center gap-2.5 text-rose-600 font-bold text-lg">
                <svg viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                  <path d="M16 2a14 14 0 1 0 14 14A14 14 0 0 0 16 2zm1 21h-2v-2h2zm0-6h-2V7h2z" />
                </svg>
                <span>Reservation Notice</span>
              </div>
              <button 
                onClick={() => setErrorMessage(null)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                <svg viewBox="0 0 32 32" className="w-4 h-4 stroke-current stroke-[3px] fill-none">
                  <path d="M6 6l20 20M26 6L6 26" />
                </svg>
              </button>
            </div>
            
            <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
              {errorMessage}
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setErrorMessage(null)}
                className="w-full py-3 bg-neutral-900 dark:bg-white hover:bg-black dark:hover:bg-neutral-200 text-white dark:text-black font-semibold text-sm rounded-xl transition cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
