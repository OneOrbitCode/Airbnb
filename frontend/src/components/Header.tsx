"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthContext";
import AirbnbCalendar from "@/components/AirbnbCalendar";

const POPULAR_DESTINATIONS = [
  { name: "Varanasi", state: "Uttar Pradesh", icon: "🏛️" },
  { name: "Jaipur", state: "Rajasthan", icon: "🏰" },
  { name: "Goa", state: "West Coast", icon: "🏖️" },
  { name: "Manali", state: "Himachal Pradesh", icon: "🏔️" },
  { name: "Lonavala", state: "Maharashtra", icon: "🏊" },
  { name: "Wayanad", state: "Kerala", icon: "🌴" },
  { name: "Mukteshwar", state: "Uttarakhand", icon: "⛰️" },
  { name: "Amritsar", state: "Punjab", icon: "🌾" },
];

function HeaderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialLocation = searchParams?.get("location") || "";
  const [location, setLocation] = useState(initialLocation);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { currentUser, switchUser } = useAuth();

  // Desktop active individual dropdown tab: null | "where" | "time" | "guests"
  const [activeDropdown, setActiveDropdown] = useState<"where" | "time" | "guests" | null>(null);

  // Mobile full-screen search modal state
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mobileActiveStep, setMobileActiveStep] = useState<"where" | "when" | "who">("where");
  
  // Date states
  const [searchCheckIn, setSearchCheckIn] = useState(searchParams?.get("checkIn") || "");
  const [searchCheckOut, setSearchCheckOut] = useState(searchParams?.get("checkOut") || "");
  const [timeMode, setTimeMode] = useState<"dates" | "flexible">("dates");
  const [flexibleChoice, setFlexibleChoice] = useState<string>("Anytime");

  // Guest counters
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  const totalGuests = adults + childrenCount;
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Sync state if URL searchParams change
  useEffect(() => {
    setLocation(searchParams?.get("location") || "");
    setSearchCheckIn(searchParams?.get("checkIn") || "");
    setSearchCheckOut(searchParams?.get("checkOut") || "");
    const g = Number(searchParams?.get("guests"));
    if (g && g > 0) setAdults(g);
    const p = Number(searchParams?.get("pets"));
    if (p && p > 0) setPets(p);
  }, [searchParams]);

  // Close desktop dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (customLocation?: string) => {
    const loc = customLocation !== undefined ? customLocation : location;
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
    
    if (loc.trim()) {
      params.set("location", loc.trim());
    } else {
      params.delete("location");
    }

    if (searchCheckIn) params.set("checkIn", searchCheckIn);
    else params.delete("checkIn");

    if (searchCheckOut) params.set("checkOut", searchCheckOut);
    else params.delete("checkOut");

    if (totalGuests > 1) params.set("guests", totalGuests.toString());
    else params.delete("guests");

    if (pets > 0) params.set("pets", pets.toString());
    else params.delete("pets");

    setActiveDropdown(null);
    setIsMobileSearchOpen(false);
    router.push(`/?${params.toString()}`);
  };

  const handleClearAll = () => {
    setLocation("");
    setSearchCheckIn("");
    setSearchCheckOut("");
    setFlexibleChoice("Anytime");
    setAdults(1);
    setChildrenCount(0);
    setInfants(0);
    setPets(0);
  };

  const getGuestLabel = () => {
    if (totalGuests <= 1 && infants === 0 && pets === 0) return "Add guests";
    const parts = [];
    if (totalGuests > 0) parts.push(`${totalGuests} ${totalGuests === 1 ? "guest" : "guests"}`);
    if (infants > 0) parts.push(`${infants} ${infants === 1 ? "infant" : "infants"}`);
    if (pets > 0) parts.push(`${pets} ${pets === 1 ? "pet" : "pets"}`);
    return parts.join(", ");
  };

  const getTimeLabel = () => {
    if (timeMode === "flexible" && flexibleChoice !== "Anytime") {
      return flexibleChoice;
    }
    if (searchCheckIn && searchCheckOut) {
      return `${searchCheckIn.slice(5)} – ${searchCheckOut.slice(5)}`;
    }
    return "Add dates";
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-[#181818] border-b border-gray-200 dark:border-neutral-800 transition-colors shadow-xs h-[64px] flex items-center">
        <div className="max-w-[2520px] w-full mx-auto px-3 sm:px-6 md:px-10 xl:px-12 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Airbnb Transparent Logo (Hidden on mobile < sm, visible on desktop >= sm) */}
          <div className="hidden sm:flex flex-shrink-0 items-center overflow-visible">
            <Link href="/" className="flex items-center gap-1.5 group cursor-pointer" aria-label="Airbnb Home">
              <img 
                src="https://download.logo.wine/logo/Airbnb/Airbnb-Logo.wine.png" 
                alt="Airbnb" 
                className="h-14 sm:h-18 md:h-22 w-auto object-contain -my-4 sm:-my-6 transition-transform group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Center Search Bar: Mobile Full-Width View (< md) */}
          <div className="flex-1 flex md:hidden min-w-0 mr-1 sm:mx-2">
            <button
              type="button"
              onClick={() => {
                setMobileActiveStep("where");
                setIsMobileSearchOpen(true);
              }}
              className="w-full bg-white dark:bg-[#202020] border border-gray-300 dark:border-neutral-700 rounded-full py-2 px-3 shadow-xs hover:shadow-md transition-all flex items-center gap-2.5 text-left"
            >
              <div className="w-7 h-7 rounded-full bg-[#FF385C] text-white flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 32 32" className="w-3.5 h-3.5 fill-none stroke-current stroke-[4px]">
                  <path d="M20.666 20.666 30 30" />
                  <path d="M24.0002 12.6668c0 6.2593-5.0741 11.3334-11.3334 11.3334-6.2592 0-11.3333-5.0741-11.3333-11.3334 0-6.2592 5.0741-11.3333 11.3333-11.3333 6.2593 0 11.3334 5.0741 11.3334 11.3333z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                  {location || "Where to?"}
                </div>
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                  {location ? `${getTimeLabel()} · ${getGuestLabel()}` : "Anywhere · Any week · Add guests"}
                </div>
              </div>
            </button>
          </div>

          {/* Center Search Bar: Desktop Segmented View (>= md) */}
          <div ref={searchBarRef} className="hidden md:flex flex-1 justify-center max-w-2xl mx-auto relative">
            
            <div className="w-full max-w-xl bg-white dark:bg-[#202020] border border-gray-300 dark:border-neutral-700 rounded-full shadow-xs hover:shadow-md transition-all flex items-center divide-x divide-gray-200 dark:divide-neutral-700 p-0.5 sm:p-1">
              
              {/* 1. Where Segment */}
              <div
                onClick={() => setActiveDropdown(activeDropdown === "where" ? null : "where")}
                className={`flex-1 px-3 py-1 rounded-full cursor-pointer transition text-left ${
                  activeDropdown === "where" ? "bg-neutral-100 dark:bg-neutral-800" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                }`}
              >
                <div className="text-[10px] font-bold text-neutral-900 dark:text-white uppercase leading-none">Where</div>
                <div className="text-xs font-normal text-neutral-500 dark:text-neutral-300 truncate mt-0.5">
                  {location || "Search destinations"}
                </div>
              </div>

              {/* 2. When Segment */}
              <div
                onClick={() => setActiveDropdown(activeDropdown === "time" ? null : "time")}
                className={`flex-1 px-3 py-1 rounded-full cursor-pointer transition text-left ${
                  activeDropdown === "time" ? "bg-neutral-100 dark:bg-neutral-800" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                }`}
              >
                <div className="text-[10px] font-bold text-neutral-900 dark:text-white uppercase leading-none">When</div>
                <div className="text-xs font-normal text-neutral-500 dark:text-neutral-300 truncate mt-0.5">
                  {getTimeLabel()}
                </div>
              </div>

              {/* 3. Who Segment */}
              <div
                onClick={() => setActiveDropdown(activeDropdown === "guests" ? null : "guests")}
                className={`flex-1 px-3 py-1 rounded-full cursor-pointer transition text-left flex items-center justify-between ${
                  activeDropdown === "guests" ? "bg-neutral-100 dark:bg-neutral-800" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="text-[10px] font-bold text-neutral-900 dark:text-white uppercase leading-none">Who</div>
                  <div className="text-xs font-normal text-neutral-500 dark:text-neutral-300 truncate mt-0.5">
                    {getGuestLabel()}
                  </div>
                </div>

                {/* Red Search Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSearch();
                  }}
                  className="w-8 h-8 rounded-full bg-[#FF385C] hover:bg-[#E00B41] text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer ml-1.5 flex-shrink-0"
                  aria-label="Search stays"
                >
                  <svg
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5 fill-none stroke-current stroke-[4px]"
                  >
                    <path d="M20.666 20.666 30 30" />
                    <path d="M24.0002 12.6668c0 6.2593-5.0741 11.3334-11.3334 11.3334-6.2592 0-11.3333-5.0741-11.3333-11.3334 0-6.2592 5.0741-11.3333 11.3333-11.3333 6.2593 0 11.3334 5.0741 11.3334 11.3333z" />
                  </svg>
                </button>
              </div>

            </div>

            {/* Desktop 1. Destination Dropdown Window */}
            {activeDropdown === "where" && (
              <div className="absolute top-full left-0 mt-2 w-[400px] bg-white dark:bg-[#202020] rounded-2xl p-4 shadow-2xl border border-gray-200 dark:border-neutral-700 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase text-neutral-500 dark:text-neutral-400">Search by destination</span>
                  {location && (
                    <button onClick={() => setLocation("")} className="text-xs underline text-neutral-500 cursor-pointer">Clear</button>
                  )}
                </div>

                <div className="flex items-center gap-2 border border-gray-300 dark:border-neutral-700 rounded-xl px-3 py-2 mb-3 focus-within:border-black dark:focus-within:border-white">
                  <svg viewBox="0 0 32 32" className="w-3.5 h-3.5 fill-none stroke-current stroke-[3px] text-neutral-400">
                    <path d="M20.666 20.666 30 30" />
                    <path d="M24.0002 12.6668c0 6.2593-5.0741 11.3334-11.3334 11.3334-6.2592 0-11.3333-5.0741-11.3333-11.3334 0-6.2592 5.0741-11.3333 11.3333-11.3333 6.2593 0 11.3334 5.0741 11.3334 11.3333z" />
                  </svg>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Type city (e.g. Varanasi, Jaipur, Goa)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                    className="w-full text-xs font-semibold outline-none bg-transparent text-neutral-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto">
                  {POPULAR_DESTINATIONS.map((dest) => (
                    <button
                      key={dest.name}
                      type="button"
                      onClick={() => {
                        setLocation(dest.name);
                        handleSearch(dest.name);
                      }}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition cursor-pointer"
                    >
                      <span className="text-base">{dest.icon}</span>
                      <div className="overflow-hidden">
                        <div className="font-bold text-xs text-neutral-900 dark:text-white truncate">{dest.name}</div>
                        <div className="text-[10px] text-neutral-400 truncate">{dest.state}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Desktop 2. Time Dropdown Window with Airbnb Calendar */}
            {activeDropdown === "time" && (
              <div className="absolute top-full left-1/4 mt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-4 shadow-2xl border border-gray-200 dark:border-neutral-700 flex flex-col gap-3">
                  <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setTimeMode("dates")}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        timeMode === "dates"
                          ? "bg-white dark:bg-[#282828] text-neutral-900 dark:text-white shadow-xs"
                          : "text-neutral-500 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      Choose dates
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeMode("flexible")}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        timeMode === "flexible"
                          ? "bg-white dark:bg-[#282828] text-neutral-900 dark:text-white shadow-xs"
                          : "text-neutral-500 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      Flexible
                    </button>
                  </div>

                  {timeMode === "dates" ? (
                    <AirbnbCalendar
                      checkIn={searchCheckIn}
                      checkOut={searchCheckOut}
                      onChange={(inDate, outDate) => {
                        setSearchCheckIn(inDate);
                        setSearchCheckOut(outDate);
                        if (inDate && outDate) {
                          setActiveDropdown("guests");
                        }
                      }}
                      numberOfMonths={2}
                      onClose={() => setActiveDropdown("guests")}
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-2 p-2 w-[340px]">
                      {["Weekend", "One week", "One month", "Anytime"].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setFlexibleChoice(option);
                            setActiveDropdown("guests");
                          }}
                          className={`p-3 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                            flexibleChoice === option
                              ? "border-black dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-black"
                              : "border-gray-200 dark:border-neutral-700 hover:border-black text-neutral-800 dark:text-neutral-200"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Desktop 3. Guests Dropdown Window */}
            {activeDropdown === "guests" && (
              <div className="absolute top-full right-0 mt-2 w-[340px] bg-white dark:bg-[#202020] rounded-2xl p-4 shadow-2xl border border-gray-200 dark:border-neutral-700 z-50 flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150">
                {/* Adults */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-800">
                  <div>
                    <div className="font-semibold text-xs text-neutral-900 dark:text-white">Adults</div>
                    <div className="text-[10px] text-neutral-500">Age 13+</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={adults <= 1}
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-7 h-7 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                    >
                      –
                    </button>
                    <span className="w-4 text-center font-semibold text-xs">{adults}</span>
                    <button
                      type="button"
                      disabled={totalGuests >= 10}
                      onClick={() => setAdults(adults + 1)}
                      className="w-7 h-7 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-800">
                  <div>
                    <div className="font-semibold text-xs text-neutral-900 dark:text-white">Children</div>
                    <div className="text-[10px] text-neutral-500">Ages 2–12</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={childrenCount <= 0}
                      onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                      className="w-7 h-7 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                    >
                      –
                    </button>
                    <span className="w-4 text-center font-semibold text-xs">{childrenCount}</span>
                    <button
                      type="button"
                      disabled={totalGuests >= 10}
                      onClick={() => setChildrenCount(childrenCount + 1)}
                      className="w-7 h-7 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-800">
                  <div>
                    <div className="font-semibold text-xs text-neutral-900 dark:text-white">Infants</div>
                    <div className="text-[10px] text-neutral-500">Under 2</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={infants <= 0}
                      onClick={() => setInfants(Math.max(0, infants - 1))}
                      className="w-7 h-7 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                    >
                      –
                    </button>
                    <span className="w-4 text-center font-semibold text-xs text-neutral-900 dark:text-white">{infants}</span>
                    <button
                      type="button"
                      disabled={infants >= 5}
                      onClick={() => setInfants(infants + 1)}
                      className="w-7 h-7 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Pets */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-800">
                  <div>
                    <div className="font-semibold text-xs text-neutral-900 dark:text-white">Pets</div>
                    <div className="text-[10px] text-neutral-500">Bringing a service animal?</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={pets <= 0}
                      onClick={() => setPets(Math.max(0, pets - 1))}
                      className="w-7 h-7 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                    >
                      –
                    </button>
                    <span className="w-4 text-center font-semibold text-xs text-neutral-900 dark:text-white">{pets}</span>
                    <button
                      type="button"
                      disabled={pets >= 5}
                      onClick={() => setPets(pets + 1)}
                      className="w-7 h-7 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-xs disabled:opacity-30 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => handleSearch()}
                    className="bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Right Controls: Role Switcher + Dark Mode + Profile Menu */}
          <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => switchUser(currentUser.role === "host" ? "guest" : "host")}
              className="hidden lg:block text-xs font-semibold py-1.5 px-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition text-neutral-800 dark:text-neutral-200 cursor-pointer"
            >
              {currentUser.role === "host" ? "Host Mode" : "Become a host"}
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              title="Toggle Dark Mode"
              className="p-1.5 sm:p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition text-neutral-800 dark:text-neutral-200 cursor-pointer text-sm sm:text-base"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-1.5 sm:gap-2 border border-gray-300 dark:border-neutral-700 rounded-full py-1 px-2 hover:shadow-md transition cursor-pointer bg-white dark:bg-[#222]"
                aria-label="User navigation menu"
              >
                <svg
                  viewBox="0 0 32 32"
                  className="w-3.5 h-3.5 fill-none stroke-current stroke-[3px] text-neutral-700 dark:text-neutral-300"
                >
                  <path d="M2 16h28M2 6h28M2 26h28" />
                </svg>
                <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 dark:border-neutral-600 relative">
                  <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                </div>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-10 w-56 sm:w-60 bg-white dark:bg-[#222] rounded-2xl shadow-2xl border border-gray-100 dark:border-neutral-700 py-2 z-50 flex flex-col">
                  <div className="px-4 py-2.5 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">Active Role</span>
                    <div className="flex bg-neutral-200 dark:bg-neutral-700 rounded-lg p-0.5 text-[11px] font-bold">
                      <button
                        onClick={() => switchUser("guest")}
                        className={`px-2 py-0.5 rounded transition ${currentUser.role === "guest" ? "bg-white dark:bg-[#181818] text-black dark:text-white" : "text-neutral-500"}`}
                      >
                        Guest
                      </button>
                      <button
                        onClick={() => switchUser("host")}
                        className={`px-2 py-0.5 rounded transition ${currentUser.role === "host" ? "bg-[#FF385C] text-white" : "text-neutral-500"}`}
                      >
                        Host
                      </button>
                    </div>
                  </div>

                  <Link
                    href="/messages"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition"
                  >
                    Messages
                  </Link>

                  <Link
                    href="/wishlists"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition"
                  >
                    Wishlists
                  </Link>

                  <Link
                    href="/trips"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition"
                  >
                    My Trips
                  </Link>

                  {currentUser.role === "host" && (
                    <Link
                      href="/host"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition"
                    >
                      Manage Listings (Host)
                    </Link>
                  )}

                  <hr className="my-1 border-gray-100 dark:border-neutral-800" />

                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-[#FF385C] flex items-center justify-between transition cursor-pointer"
                  >
                    <span>Switch Account / Log in</span>
                    <span className="text-[10px] bg-[#FF385C]/10 text-[#FF385C] px-1.5 py-0.5 rounded font-bold">
                      ⚡ Demo
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* 📱 Full-Screen Mobile Search Modal (Airbnb Mobile App Style) */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-100 dark:bg-[#121212] flex flex-col md:hidden animate-in fade-in duration-200">
          
          {/* Top Bar with Close Button and Active Destination Pill */}
          <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#1c1c1c]">
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="w-8 h-8 rounded-full border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#252525] flex items-center justify-center text-neutral-800 dark:text-neutral-200 hover:scale-105 active:scale-95 transition cursor-pointer"
              aria-label="Close search"
            >
              <svg viewBox="0 0 32 32" className="w-3.5 h-3.5 stroke-current stroke-[3.5px] fill-none">
                <path d="M6 6l20 20M26 6L6 26" />
              </svg>
            </button>
            <div className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
              Search Stays
            </div>
            <button
              onClick={handleClearAll}
              className="text-xs font-semibold text-neutral-500 hover:text-black dark:hover:text-white underline cursor-pointer"
            >
              Clear
            </button>
          </div>

          {/* Body with Accordion Cards */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
            
            {/* Step 1: Where */}
            <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl p-4 shadow-xs border border-gray-200 dark:border-neutral-800">
              <div
                onClick={() => setMobileActiveStep(mobileActiveStep === "where" ? "where" : "where")}
                className="flex items-center justify-between cursor-pointer"
              >
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">Where to?</h3>
                  {mobileActiveStep !== "where" && location && (
                    <p className="text-xs text-[#FF385C] font-semibold mt-0.5">{location}</p>
                  )}
                </div>
              </div>

              {mobileActiveStep === "where" && (
                <div className="mt-3 flex flex-col gap-3 pt-2 border-t border-gray-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2 border border-gray-300 dark:border-neutral-700 rounded-xl px-3 py-2.5 focus-within:border-black dark:focus-within:border-white bg-neutral-50 dark:bg-[#252525]">
                    <svg viewBox="0 0 32 32" className="w-4 h-4 fill-none stroke-current stroke-[3px] text-neutral-400">
                      <path d="M20.666 20.666 30 30" />
                      <path d="M24.0002 12.6668c0 6.2593-5.0741 11.3334-11.3334 11.3334-6.2592 0-11.3333-5.0741-11.3333-11.3334 0-6.2592 5.0741-11.3333 11.3333-11.3333 6.2593 0 11.3334 5.0741 11.3334 11.3333z" />
                    </svg>
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search destinations (e.g. Varanasi, Goa)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full text-xs font-semibold outline-none bg-transparent text-neutral-900 dark:text-white"
                    />
                  </div>

                  {/* Popular City Grid */}
                  <div>
                    <div className="text-[11px] font-bold uppercase text-neutral-500 dark:text-neutral-400 mb-2">
                      Popular Destinations
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {POPULAR_DESTINATIONS.map((dest) => (
                        <button
                          key={dest.name}
                          type="button"
                          onClick={() => {
                            setLocation(dest.name);
                            setMobileActiveStep("when");
                          }}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition cursor-pointer ${
                            location === dest.name
                              ? "border-[#FF385C] bg-[#FF385C]/5 dark:bg-[#FF385C]/10"
                              : "border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#252525] hover:border-black"
                          }`}
                        >
                          <span className="text-xl">{dest.icon}</span>
                          <div className="overflow-hidden">
                            <div className="font-bold text-xs text-neutral-900 dark:text-white truncate">{dest.name}</div>
                            <div className="text-[10px] text-neutral-400 truncate">{dest.state}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: When */}
            <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl p-4 shadow-xs border border-gray-200 dark:border-neutral-800">
              <div
                onClick={() => setMobileActiveStep(mobileActiveStep === "when" ? "where" : "when")}
                className="flex items-center justify-between cursor-pointer"
              >
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">When's your trip?</h3>
                  {mobileActiveStep !== "when" && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{getTimeLabel()}</p>
                  )}
                </div>
                <span className="text-xs font-semibold text-neutral-400">
                  {mobileActiveStep === "when" ? "▲" : "▼"}
                </span>
              </div>

              {mobileActiveStep === "when" && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-neutral-800 flex flex-col gap-3">
                  <div className="flex bg-neutral-100 dark:bg-[#252525] rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => setTimeMode("dates")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                        timeMode === "dates"
                          ? "bg-white dark:bg-[#181818] text-black dark:text-white shadow-xs"
                          : "text-neutral-500"
                      }`}
                    >
                      Specific dates
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeMode("flexible")}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition ${
                        timeMode === "flexible"
                          ? "bg-white dark:bg-[#181818] text-black dark:text-white shadow-xs"
                          : "text-neutral-500"
                      }`}
                    >
                      I'm flexible
                    </button>
                  </div>

                  {timeMode === "dates" ? (
                    <AirbnbCalendar
                      checkIn={searchCheckIn}
                      checkOut={searchCheckOut}
                      onChange={(inDate, outDate) => {
                        setSearchCheckIn(inDate);
                        setSearchCheckOut(outDate);
                        if (inDate && outDate) {
                          setMobileActiveStep("who");
                        }
                      }}
                      numberOfMonths={1}
                      onClose={() => setMobileActiveStep("who")}
                    />
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {["Weekend", "One week", "One month", "Anytime"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setFlexibleChoice(opt);
                            setMobileActiveStep("who");
                          }}
                          className={`p-3 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                            flexibleChoice === opt
                              ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
                              : "border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#252525] text-neutral-800 dark:text-neutral-200"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 3: Who */}
            <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl p-4 shadow-xs border border-gray-200 dark:border-neutral-800">
              <div
                onClick={() => setMobileActiveStep(mobileActiveStep === "who" ? "where" : "who")}
                className="flex items-center justify-between cursor-pointer"
              >
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">Who's coming?</h3>
                  {mobileActiveStep !== "who" && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{getGuestLabel()}</p>
                  )}
                </div>
                <span className="text-xs font-semibold text-neutral-400">
                  {mobileActiveStep === "who" ? "▲" : "▼"}
                </span>
              </div>

              {mobileActiveStep === "who" && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-neutral-800 flex flex-col gap-3">
                  {/* Adults */}
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-800">
                    <div>
                      <div className="font-semibold text-xs text-neutral-900 dark:text-white">Adults</div>
                      <div className="text-[10px] text-neutral-500">Ages 13 or above</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={adults <= 1}
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-sm disabled:opacity-30"
                      >
                        –
                      </button>
                      <span className="w-5 text-center font-semibold text-xs">{adults}</span>
                      <button
                        type="button"
                        disabled={totalGuests >= 10}
                        onClick={() => setAdults(adults + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-800">
                    <div>
                      <div className="font-semibold text-xs text-neutral-900 dark:text-white">Children</div>
                      <div className="text-[10px] text-neutral-500">Ages 2–12</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={childrenCount <= 0}
                        onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-sm disabled:opacity-30"
                      >
                        –
                      </button>
                      <span className="w-5 text-center font-semibold text-xs text-neutral-900 dark:text-white">{childrenCount}</span>
                      <button
                        type="button"
                        disabled={totalGuests >= 10}
                        onClick={() => setChildrenCount(childrenCount + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-800">
                    <div>
                      <div className="font-semibold text-xs text-neutral-900 dark:text-white">Infants</div>
                      <div className="text-[10px] text-neutral-500">Under 2</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={infants <= 0}
                        onClick={() => setInfants(Math.max(0, infants - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-sm disabled:opacity-30"
                      >
                        –
                      </button>
                      <span className="w-5 text-center font-semibold text-xs text-neutral-900 dark:text-white">{infants}</span>
                      <button
                        type="button"
                        disabled={infants >= 5}
                        onClick={() => setInfants(infants + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Pets */}
                  <div className="flex items-center justify-between pb-1">
                    <div>
                      <div className="font-semibold text-xs text-neutral-900 dark:text-white">Pets</div>
                      <div className="text-[10px] text-neutral-500">Bringing a service animal?</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={pets <= 0}
                        onClick={() => setPets(Math.max(0, pets - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-sm disabled:opacity-30"
                      >
                        –
                      </button>
                      <span className="w-5 text-center font-semibold text-xs text-neutral-900 dark:text-white">{pets}</span>
                      <button
                        type="button"
                        disabled={pets >= 5}
                        onClick={() => setPets(pets + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 dark:border-neutral-600 flex items-center justify-center font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Bottom Fixed Action Bar */}
          <div className="p-4 bg-white dark:bg-[#1c1c1c] border-t border-gray-200 dark:border-neutral-800 flex items-center justify-between gap-4 shadow-lg">
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs font-bold underline text-neutral-700 dark:text-neutral-300 cursor-pointer"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={() => handleSearch()}
              className="flex-1 bg-[#FF385C] hover:bg-[#E00B41] active:scale-98 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <svg viewBox="0 0 32 32" className="w-4 h-4 fill-none stroke-current stroke-[3.5px]">
                <path d="M20.666 20.666 30 30" />
                <path d="M24.0002 12.6668c0 6.2593-5.0741 11.3334-11.3334 11.3334-6.2592 0-11.3333-5.0741-11.3333-11.3334 0-6.2592 5.0741-11.3333 11.3333-11.3333 6.2593 0 11.3334 5.0741 11.3334 11.3333z" />
              </svg>
              <span>Search Stays</span>
            </button>
          </div>

        </div>
      )}
    </>
  );
}

export default function Header() {
  return (
    <Suspense fallback={<div className="h-[64px] bg-white dark:bg-[#181818] border-b border-gray-200 dark:border-neutral-800" />}>
      <HeaderContent />
    </Suspense>
  );
}
