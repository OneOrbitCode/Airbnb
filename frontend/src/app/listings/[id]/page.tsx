"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success">("idle");
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/listings/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch listing:", err);
        setLoading(false);
      });
  }, [id]);

  const handleReserve = async () => {
    if (!dates.checkIn || !dates.checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }
    setBookingStatus("loading");
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing_id: Number(id),
          user_id: 1, // Mock user id from seed
          check_in: dates.checkIn,
          check_out: dates.checkOut,
        }),
      });
      
      if (response.ok) {
        setBookingStatus("success");
      }
    } catch (error) {
      console.error("Booking failed:", error);
      setBookingStatus("idle");
    }
  };

  if (loading) {
    return (
      <main className="pb-20">
        <Header />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-airbnb-brand"></div>
        </div>
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="pb-20">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 xl:px-20 pt-8 text-center text-2xl font-semibold">
          Listing not found.
        </div>
      </main>
    );
  }

  return (
    <main className="pb-20">
      <Header />
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 md:px-10 xl:px-20 pt-8">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-4">{listing.location} - Amazing getaway</h1>
        
        {/* Image Gallery Mock */}
        <div className="w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden mb-8">
          <img src={listing.imageSrc} alt="Listing cover" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Details Section */}
          <div className="md:col-span-2 flex flex-col gap-6 border-b border-gray-200 pb-8">
            <div>
              <h2 className="text-xl font-semibold">Hosted by Airbnb Clone</h2>
              <p className="text-gray-500 font-light text-sm">{listing.distance}</p>
            </div>
            
            <hr className="border-gray-200" />
            
            <div className="flex flex-row items-start gap-4">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '24px', width: '24px', fill: 'currentcolor' }}><path d="m21.996 11c0-5.522-4.478-10-10-10s-10 4.478-10 10c0 5.485 5.569 13.916 9.421 19.539.263.383.743.535 1.157.382a.998.998 0 0 0 .579-.921v-12.756a5.5 5.5 0 0 1 8.843-6.244zm-14.996 0c0-2.761 2.239-5 5-5s5 2.239 5 5-2.239 5-5 5-5-2.239-5-5z"></path></svg>
              <div>
                <h3 className="font-semibold text-lg">Great location</h3>
                <p className="text-gray-500 font-light">100% of recent guests gave the location a 5-star rating.</p>
              </div>
            </div>

            <hr className="border-gray-200" />
            
            <div className="text-gray-800 font-light leading-relaxed">
              This beautiful property offers a serene getaway with all the modern amenities you need. Experience a perfect blend of comfort and style in our carefully curated space. Relax, unwind, and enjoy the stunning views and peaceful surroundings. Ideal for couples, families, or solo travelers looking for a memorable stay.
            </div>
          </div>

          {/* Booking Widget */}
          <div className="md:col-span-1 relative">
            <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl p-6 airbnb-shadow flex flex-col gap-4">
              <div className="flex flex-row items-baseline gap-1">
                <span className="text-2xl font-bold">₹{listing.price}</span>
                <span className="text-gray-500 font-light">night</span>
              </div>
              
              <div className="border border-gray-400 rounded-lg overflow-hidden flex flex-col">
                <div className="flex flex-row border-b border-gray-400">
                  <div className="flex-1 p-3 border-r border-gray-400 flex flex-col">
                    <label className="text-[10px] font-bold uppercase tracking-wider">Check-in</label>
                    <input 
                      type="date" 
                      className="outline-none text-sm font-light w-full"
                      value={dates.checkIn}
                      onChange={(e) => setDates({ ...dates, checkIn: e.target.value })}
                    />
                  </div>
                  <div className="flex-1 p-3 flex flex-col">
                    <label className="text-[10px] font-bold uppercase tracking-wider">Checkout</label>
                    <input 
                      type="date" 
                      className="outline-none text-sm font-light w-full"
                      value={dates.checkOut}
                      onChange={(e) => setDates({ ...dates, checkOut: e.target.value })}
                    />
                  </div>
                </div>
                <div className="p-3 flex flex-col">
                  <label className="text-[10px] font-bold uppercase tracking-wider">Guests</label>
                  <select className="outline-none text-sm font-light bg-transparent w-full">
                    <option>1 guest</option>
                    <option>2 guests</option>
                  </select>
                </div>
              </div>

              {bookingStatus === "success" ? (
                <div className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg text-center">
                  Booking Confirmed!
                </div>
              ) : (
                <button 
                  onClick={handleReserve}
                  disabled={bookingStatus === "loading"}
                  className="w-full bg-airbnb-brand hover:bg-airbnb-gradient-end text-white font-semibold py-3 rounded-lg transition duration-300"
                >
                  {bookingStatus === "loading" ? "Reserving..." : "Reserve"}
                </button>
              )}
              
              <div className="text-center text-sm text-gray-500 font-light mt-2">
                You won't be charged yet
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
