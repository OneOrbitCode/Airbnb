"use client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Categories from "@/components/Categories";
import ListingCard from "@/components/ListingCard";

export default function Home() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/listings")
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch listings:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Categories />
      
      <main id="site-content" className="flex-1 pb-20">
        <div className="max-w-[2520px] mx-auto px-4 sm:px-6 md:px-10 xl:px-12 pt-8">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-neutral-500">
              <h2 className="text-xl font-semibold text-neutral-800">No exact matches</h2>
              <p>Try changing or removing some of your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-6 gap-y-10">
              {listings.map((listing) => (
                <ListingCard 
                  key={listing.id}
                  id={listing.id}
                  imageSrc={listing.imageSrc}
                  location={listing.location}
                  distance={listing.distance}
                  dateRange={listing.dateRange}
                  price={listing.price}
                  rating={listing.rating}
                  guestFavorite={listing.guestFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
