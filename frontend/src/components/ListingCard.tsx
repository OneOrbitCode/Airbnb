"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface ListingCardProps {
  id?: number;
  imageSrc: string;
  location: string;
  distance?: string;
  dateRange?: string;
  price: string | number;
  rating?: number;
  guestFavorite?: boolean;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80";

export default function ListingCard({
  id,
  imageSrc,
  location,
  distance,
  dateRange,
  price,
  rating = 4.95,
  guestFavorite = false,
}: ListingCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imgUrl, setImgUrl] = useState(imageSrc || FALLBACK_IMAGE);

  const checkWishlistStatus = () => {
    if (id) {
      const saved = localStorage.getItem("airbnb_wishlist");
      if (saved) {
        try {
          const list = JSON.parse(saved);
          if (Array.isArray(list)) {
            setIsLiked(list.includes(id));
          }
        } catch {}
      }
    }
  };

  useEffect(() => {
    checkWishlistStatus();
    window.addEventListener("wishlist-updated", checkWishlistStatus);
    return () => window.removeEventListener("wishlist-updated", checkWishlistStatus);
  }, [id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isLiked;
    setIsLiked(nextState);

    if (id) {
      const saved = localStorage.getItem("airbnb_wishlist");
      let list: number[] = [];
      try {
        list = saved ? JSON.parse(saved) : [];
      } catch {}
      if (!Array.isArray(list)) list = [];

      if (nextState) {
        if (!list.includes(id)) list.push(id);
      } else {
        list = list.filter((item) => item !== id);
      }

      localStorage.setItem("airbnb_wishlist", JSON.stringify(list));
      window.dispatchEvent(new Event("wishlist-updated"));
    }
  };

  const formattedPrice = typeof price === "number" ? price.toLocaleString("en-IN") : String(price).replace(/₹/g, "");

  return (
    <div className="group flex flex-col gap-1.5 cursor-pointer w-full select-none">
      
      {/* Square Rounded Photo with Badges and Wishlist */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800 shadow-xs">
        
        {id ? (
          <Link href={`/listings/${id}`} className="w-full h-full block">
            <img
              src={imgUrl}
              alt={location}
              referrerPolicy="no-referrer"
              onError={() => setImgUrl(FALLBACK_IMAGE)}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </Link>
        ) : (
          <img
            src={imgUrl}
            alt={location}
            referrerPolicy="no-referrer"
            onError={() => setImgUrl(FALLBACK_IMAGE)}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        )}

        {/* Guest Favorite Badge */}
        {guestFavorite && (
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10">
            <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 rounded-full text-[9px] sm:text-[10px] font-semibold text-neutral-900 dark:text-white shadow-xs border border-black/5 dark:border-white/10 whitespace-nowrap">
              Guest favourite
            </div>
          </div>
        )}

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={toggleWishlist}
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1.5 transition duration-200 hover:scale-115 active:scale-90 z-10 cursor-pointer"
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          title={isLiked ? "Saved in wishlist" : "Save to wishlist"}
        >
          <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200"
            style={{
              fill: isLiked ? "#FF385C" : "rgba(0, 0, 0, 0.4)",
              stroke: "#ffffff",
              strokeWidth: 2,
              filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.4))"
            }}
          >
            <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z" />
          </svg>
        </button>
      </div>

      {/* Info Details matching Airbnb screenshot: Line 1 Title, Line 2 Price for 2 nights · ★ rating */}
      <div className="flex flex-col text-xs leading-tight">
        <div className="font-semibold text-neutral-900 dark:text-white truncate text-[11px] sm:text-xs">
          {location.startsWith("Flat") || location.startsWith("Home") || location.startsWith("Room") ? location : `Flat in ${location.split(",")[0]}`}
        </div>
        
        <div className="text-[10px] sm:text-[11px] text-neutral-600 dark:text-neutral-400 font-normal truncate mt-0.5 flex items-center gap-1">
          <span>₹{formattedPrice} for 2 nights</span>
          <span>·</span>
          <span className="flex items-center gap-0.5">
            ★ {typeof rating === "number" ? rating.toFixed(typeof rating === "number" && Number.isInteger(rating) ? 1 : 2) : "4.95"}
          </span>
        </div>
      </div>

    </div>
  );
}
