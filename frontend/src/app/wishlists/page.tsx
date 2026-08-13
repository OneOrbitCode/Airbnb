"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ListingCard from "@/components/ListingCard";
import { useRouter } from "next/navigation";

export default function WishlistsPage() {
  const router = useRouter();
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Read saved wishlist IDs from localStorage or seed initial
    const saved = localStorage.getItem("airbnb_wishlist");
    let ids: number[] = [];
    if (saved) {
      try {
        ids = JSON.parse(saved);
      } catch {
        ids = [1, 3];
      }
    } else {
      ids = [1, 3];
    }
    setWishlistIds(ids);

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/listings`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setListings(data.filter((l: any) => ids.includes(l.id)));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="pb-20 bg-white dark:bg-[#121212] min-h-screen transition-colors">
      <Header />
      <div className="max-w-[2520px] mx-auto px-4 sm:px-6 md:px-10 xl:px-12 pt-10">
        <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-white">Wishlists</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8">Your saved dream stays and favorites</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-[#FF385C]"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 dark:bg-[#1c1c1c] rounded-2xl border border-gray-200 dark:border-neutral-800">
            <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-white">Your wishlist is empty</h2>
            <p className="text-neutral-500 mb-6 text-sm">Tap the heart icon on any stay to save it to your wishlist.</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-bold hover:bg-black transition cursor-pointer"
            >
              Explore Stays
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                imageSrc={listing.imageSrc}
                location={listing.location}
                distance={listing.distance}
                dateRange={listing.dateRange}
                price={listing.price || listing.price_per_night}
                rating={listing.rating}
                guestFavorite={listing.guestFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
