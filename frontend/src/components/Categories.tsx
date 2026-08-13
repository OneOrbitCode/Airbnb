"use client";
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CategoryItem {
  label: string;
  icon: (isSelected: boolean) => React.ReactNode;
}

const categories: CategoryItem[] = [
  {
    label: "All",
    icon: (isSelected) => (
      <svg viewBox="0 0 32 32" className={`w-6 h-6 fill-none stroke-current stroke-[2.5px] ${isSelected ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-400"}`}>
        <path d="M16 2l3.5 9.5L29 15l-7.5 6.5L23.5 31 16 25.5 8.5 31l2-9.5L3 15l9.5-3.5L16 2z" />
      </svg>
    ),
  },
  {
    label: "Rooms",
    icon: (isSelected) => (
      <svg viewBox="0 0 32 32" className={`w-6 h-6 fill-none stroke-current stroke-[2px] ${isSelected ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-400"}`}>
        <path d="M2 18h28v10H2zM6 18V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10M6 14h20" />
        <circle cx="11" cy="11" r="2" fill="currentColor" />
        <circle cx="21" cy="11" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Amazing pools",
    icon: (isSelected) => (
      <svg viewBox="0 0 32 32" className={`w-6 h-6 fill-none stroke-current stroke-[2px] ${isSelected ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-400"}`}>
        <path d="M2 22c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 27c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
        <path d="M18 16V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v12M12 7h6M12 11h6" />
      </svg>
    ),
  },
  {
    label: "Cabins",
    icon: (isSelected) => (
      <svg viewBox="0 0 32 32" className={`w-6 h-6 fill-none stroke-current stroke-[2px] ${isSelected ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-400"}`}>
        <path d="M16 3L3 14v15h26V14L16 3zM12 29V19h8v10" />
        <path d="M2 15h28M6 22h6M20 22h6" />
      </svg>
    ),
  },
  {
    label: "Earth homes",
    icon: (isSelected) => (
      <svg viewBox="0 0 32 32" className={`w-6 h-6 fill-none stroke-current stroke-[2px] ${isSelected ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-400"}`}>
        <path d="M2 28c0-7.732 6.268-14 14-14s14 6.268 14 14H2z" />
        <path d="M12 28v-7a4 4 0 0 1 8 0v7" />
        <path d="M4 14c2-4 7-8 12-8s10 4 12 8" />
      </svg>
    ),
  },
  {
    label: "Farms",
    icon: (isSelected) => (
      <svg viewBox="0 0 32 32" className={`w-6 h-6 fill-none stroke-current stroke-[2px] ${isSelected ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-400"}`}>
        <path d="M16 4l12 7v17H4V11l12-7z" />
        <path d="M10 28V16h12v12M10 16l6 6 6-6M16 4v7" />
      </svg>
    ),
  },
  {
    label: "Tropical",
    icon: (isSelected) => (
      <svg viewBox="0 0 32 32" className={`w-6 h-6 fill-none stroke-current stroke-[2px] ${isSelected ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-400"}`}>
        <path d="M16 29c1-8 2-13 4-17" />
        <path d="M20 12c-5-2-12 1-15 5 4-6 10-7 15-5zM20 12c2-5 7-9 11-9-2 5-6 8-11 9zM20 12c-1-5 2-10 6-11-1 4-2 8-6 11zM20 12c-4-4-5-9-3-11 0 4 1 8 3 11z" />
        <path d="M2 29h28" />
      </svg>
    ),
  },
  {
    label: "Castles",
    icon: (isSelected) => (
      <svg viewBox="0 0 32 32" className={`w-6 h-6 fill-none stroke-current stroke-[2px] ${isSelected ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-400"}`}>
        <path d="M4 28V10h4V6h4v4h8V6h4v4h4v18H4z" />
        <path d="M13 28v-6a3 3 0 0 1 6 0v6M8 15h2M22 15h2M15 15h2" />
      </svg>
    ),
  },
  {
    label: "Treehouses",
    icon: (isSelected) => (
      <svg viewBox="0 0 32 32" className={`w-6 h-6 fill-none stroke-current stroke-[2px] ${isSelected ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-400"}`}>
        <path d="M16 29V17M11 29l3-12M21 29l-3-12" />
        <path d="M8 17h16V9L16 4 8 9v8z" />
        <path d="M13 17v-4h6v4M4 11c-2-3-1-7 2-9 4-1 7 2 7 5M28 11c2-3 1-7-2-9-4-1-7 2-7 5" />
      </svg>
    ),
  },
  {
    label: "Mansions",
    icon: (isSelected) => (
      <svg viewBox="0 0 32 32" className={`w-6 h-6 fill-none stroke-current stroke-[2px] ${isSelected ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-400"}`}>
        <path d="M2 28h28M4 28V12l12-8 12 8v16" />
        <path d="M8 28V15M14 28V15M18 28V15M24 28V15" />
        <path d="M13 28v-5h6v5M16 7l6 4H10l6-4z" />
      </svg>
    ),
  },
  {
    label: "Beachfront",
    icon: (isSelected) => (
      <svg viewBox="0 0 32 32" className={`w-6 h-6 fill-none stroke-current stroke-[2px] ${isSelected ? "text-black dark:text-white" : "text-neutral-500 dark:text-neutral-400"}`}>
        <path d="M16 20l5-14M16 20c-5-3-11-2-14 0 5-6 13-6 18 0M16 20c3 3 8 4 13 2-4-5-10-6-13-2" />
        <path d="M2 27c4 1 8 0 12-2s8-3 12-1 4 2 4 2" />
      </svg>
    ),
  }
];

function CategoriesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams?.get("category") || "All";
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Filter state
  const [minPrice, setMinPrice] = useState(searchParams?.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams?.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(searchParams?.get("minRating") || "");
  const [guestFavoriteOnly, setGuestFavoriteOnly] = useState(searchParams?.get("guestFavorite") === "true");

  const handleSelect = (categoryLabel: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    if (categoryLabel === "All") {
      params.delete("category");
    } else {
      params.set("category", categoryLabel);
    }
    router.push(`/?${params.toString()}`);
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    if (minRating) params.set("minRating", minRating);
    else params.delete("minRating");

    if (guestFavoriteOnly) params.set("guestFavorite", "true");
    else params.delete("guestFavorite");

    setIsFilterModalOpen(false);
    router.push(`/?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setGuestFavoriteOnly(false);
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("minRating");
    params.delete("guestFavorite");
    setIsFilterModalOpen(false);
    router.push(`/?${params.toString()}`);
  };

  const hasActiveFilters = Boolean(
    searchParams?.get("minPrice") ||
    searchParams?.get("maxPrice") ||
    searchParams?.get("minRating") ||
    searchParams?.get("guestFavorite")
  );

  return (
    <>
      <div className="border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#181818] sticky top-[64px] z-40 transition-colors shadow-xs">
        <div className="max-w-[2520px] mx-auto px-4 sm:px-6 md:px-10 xl:px-12 flex items-center justify-between gap-4">
          
          {/* Scrollable categories strip */}
          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar pt-2 pb-0">
            {categories.map((cat, index) => {
              const isSelected = cat.label === currentCategory;
              return (
                <button
                  key={index}
                  onClick={() => handleSelect(cat.label)}
                  className={`flex flex-col items-center gap-1.5 pb-2 border-b-2 transition group flex-shrink-0 cursor-pointer ${
                    isSelected
                      ? "border-black dark:border-white text-black dark:text-white font-bold opacity-100"
                      : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:border-gray-300 opacity-75 hover:opacity-100"
                  }`}
                >
                  <div className="transition-transform group-hover:scale-105">
                    {cat.icon(isSelected)}
                  </div>
                  <span className="text-[11px] tracking-tight whitespace-nowrap font-medium">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filters button */}
          <div className="flex items-center pl-2">
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className={`flex items-center gap-2 border rounded-xl px-4 py-2.5 text-xs font-semibold transition shadow-sm cursor-pointer ${
                hasActiveFilters
                  ? "border-black bg-neutral-900 text-white hover:bg-black dark:bg-white dark:text-black"
                  : "border-gray-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-white hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              <svg
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                className={`w-3.5 h-3.5 fill-none stroke-current stroke-[3px]`}
              >
                <path d="M7 16H3M29 16h-8M21 16a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM29 5h-8M7 5H3M21 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM29 27h-8M7 27H3M21 27a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
              </svg>
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-[#FF385C]" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Modern Airbnb Filters Modal Window */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#202020] rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-100 dark:border-neutral-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-neutral-700 flex items-center justify-between">
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer text-neutral-800 dark:text-neutral-200"
              >
                <svg viewBox="0 0 32 32" className="w-4 h-4 stroke-current stroke-[3px] fill-none">
                  <path d="M6 6l20 20M26 6L6 26" />
                </svg>
              </button>
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">Filters</h3>
              <div className="w-8" />
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6 text-neutral-900 dark:text-white">
              
              {/* Price Range Section */}
              <div>
                <h4 className="font-bold text-lg mb-1">Price range</h4>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4">Nightly prices before taxes and fees</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-300 dark:border-neutral-700 rounded-xl p-3 focus-within:border-black dark:focus-within:border-white">
                    <label className="text-xs text-neutral-500 dark:text-neutral-400 block font-medium">Minimum (₹)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full text-base font-semibold outline-none bg-transparent mt-1 text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div className="border border-gray-300 dark:border-neutral-700 rounded-xl p-3 focus-within:border-black dark:focus-within:border-white">
                    <label className="text-xs text-neutral-500 dark:text-neutral-400 block font-medium">Maximum (₹)</label>
                    <input
                      type="number"
                      placeholder="30000+"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full text-base font-semibold outline-none bg-transparent mt-1 text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-neutral-700" />

              {/* Minimum Rating */}
              <div>
                <h4 className="font-bold text-lg mb-2">Rating</h4>
                <div className="flex gap-3">
                  {["", "4.5", "4.8", "4.9", "5.0"].map((r, i) => (
                    <button
                      key={i}
                      onClick={() => setMinRating(r)}
                      className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold border transition cursor-pointer ${
                        minRating === r
                          ? "bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900 dark:border-white"
                          : "border-gray-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white"
                      }`}
                    >
                      {r === "" ? "Any" : `★ ${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200 dark:border-neutral-700" />

              {/* Standout Stays */}
              <div>
                <h4 className="font-bold text-lg mb-2">Standout stays</h4>
                <label className="flex items-center justify-between p-3 border border-gray-200 dark:border-neutral-700 rounded-xl cursor-pointer hover:border-black dark:hover:border-white transition">
                  <div>
                    <div className="font-semibold text-sm">Guest favourite</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">The most loved homes on Airbnb clone</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={guestFavoriteOnly}
                    onChange={(e) => setGuestFavoriteOnly(e.target.checked)}
                    className="w-5 h-5 accent-[#FF385C] cursor-pointer"
                  />
                </label>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-neutral-700 flex items-center justify-between bg-neutral-50 dark:bg-[#181818]">
              <button
                type="button"
                onClick={handleClearFilters}
                className="font-semibold text-sm underline hover:text-black dark:hover:text-white text-neutral-600 dark:text-neutral-400 cursor-pointer"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={handleApplyFilters}
                className="bg-neutral-900 dark:bg-white hover:bg-black dark:hover:bg-neutral-200 text-white dark:text-black font-semibold text-sm py-3 px-6 rounded-xl transition cursor-pointer"
              >
                Show places
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default function Categories() {
  return (
    <Suspense fallback={<div className="h-16 bg-white dark:bg-[#181818] border-b border-gray-200 dark:border-neutral-800" />}>
      <CategoriesContent />
    </Suspense>
  );
}
