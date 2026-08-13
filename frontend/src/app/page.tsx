"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Categories from "@/components/Categories";
import ListingCard from "@/components/ListingCard";
import ListingMap from "@/components/ListingMap";

const FALLBACK_LISTINGS = [
  {
    id: 1,
    title: "Flat in Bhelupura",
    location: "Flat in Bhelupura",
    distance: "Varanasi",
    dateRange: "Available Nov 1 - 6",
    price: "8,151",
    price_per_night: 4075,
    rating: 5.0,
    guestFavorite: true,
    property_type: "Rooms",
    latitude: 25.3176,
    longitude: 82.9739,
    imageSrc: "https://a0.muscache.com/im/pictures/hosting/Hosting-1668996216152698055/original/6690a134-244b-402d-a2ec-cc86f2cba0b6.png?im_w=720"
  },
  {
    id: 2,
    title: "Flat in Varanasi",
    location: "Flat in Varanasi",
    distance: "Varanasi",
    dateRange: "Available Nov 10 - 15",
    price: "6,380",
    price_per_night: 3190,
    rating: 4.95,
    guestFavorite: true,
    property_type: "Rooms",
    latitude: 25.2980,
    longitude: 82.9930,
    imageSrc: "https://a0.muscache.com/im/pictures/hosting/Hosting-1712090595190060304/original/8d875a07-9a4c-4887-a40e-a01268b6ba67.jpeg?im_w=720"
  },
  {
    id: 3,
    title: "Flat in Bhelupura",
    location: "Flat in Bhelupura",
    distance: "Varanasi",
    dateRange: "Available Dec 2 - 7",
    price: "10,980",
    price_per_night: 5490,
    rating: 5.0,
    guestFavorite: true,
    property_type: "Rooms",
    latitude: 25.3050,
    longitude: 82.9850,
    imageSrc: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=720&q=80"
  },
  {
    id: 4,
    title: "Flat in Bhelupura",
    location: "Flat in Bhelupura",
    distance: "Varanasi",
    dateRange: "Available Nov 15 - 20",
    price: "5,631",
    price_per_night: 2815,
    rating: 5.0,
    guestFavorite: true,
    property_type: "Rooms",
    latitude: 25.3120,
    longitude: 82.9910,
    imageSrc: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=720&q=80"
  },
  {
    id: 5,
    title: "Flat in Varanasi",
    location: "Flat in Varanasi",
    distance: "Varanasi",
    dateRange: "Available Nov 25 - 30",
    price: "7,390",
    price_per_night: 3695,
    rating: 5.0,
    guestFavorite: true,
    property_type: "Rooms",
    latitude: 25.3200,
    longitude: 82.9700,
    imageSrc: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=720&q=80"
  },
  {
    id: 6,
    title: "Home in Bhelupura",
    location: "Home in Bhelupura",
    distance: "Varanasi",
    dateRange: "Available Dec 5 - 10",
    price: "9,586",
    price_per_night: 4793,
    rating: 4.97,
    guestFavorite: true,
    property_type: "Rooms",
    latitude: 25.3010,
    longitude: 82.9810,
    imageSrc: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=720&q=80"
  },
  {
    id: 7,
    title: "Flat in Varanasi",
    location: "Flat in Varanasi",
    distance: "Varanasi",
    dateRange: "Available Nov 18 - 23",
    price: "6,720",
    price_per_night: 3360,
    rating: 4.85,
    guestFavorite: false,
    property_type: "Rooms",
    latitude: 25.3150,
    longitude: 82.9900,
    imageSrc: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=720&q=80"
  },
  {
    id: 8,
    title: "Flat in Noida",
    location: "Flat in Noida",
    distance: "Noida",
    dateRange: "Available Nov 22 - 27",
    price: "9,504",
    price_per_night: 4752,
    rating: 4.92,
    guestFavorite: true,
    property_type: "Rooms",
    latitude: 28.5355,
    longitude: 77.3910,
    imageSrc: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=720&q=80"
  },
  {
    id: 9,
    title: "Room in Noida",
    location: "Room in Noida",
    distance: "Noida",
    dateRange: "Available Nov 20 - 25",
    price: "4,180",
    price_per_night: 2090,
    rating: 5.0,
    guestFavorite: true,
    property_type: "Rooms",
    latitude: 28.5700,
    longitude: 77.3200,
    imageSrc: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=720&q=80"
  },
  {
    id: 10,
    title: "Flat in Noida",
    location: "Flat in Noida",
    distance: "Noida",
    dateRange: "Available Dec 1 - 6",
    price: "8,899",
    price_per_night: 4449,
    rating: 4.84,
    guestFavorite: false,
    property_type: "Rooms",
    latitude: 28.5800,
    longitude: 77.3400,
    imageSrc: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=720&q=80"
  },
  {
    id: 11,
    title: "Flat in Noida",
    location: "Flat in Noida",
    distance: "Noida",
    dateRange: "Available Nov 28 - Dec 3",
    price: "6,336",
    price_per_night: 3168,
    rating: 4.77,
    guestFavorite: true,
    property_type: "Rooms",
    latitude: 28.5400,
    longitude: 77.3800,
    imageSrc: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=720&q=80"
  },
  {
    id: 12,
    title: "Apartment in Noida",
    location: "Apartment in Noida",
    distance: "Noida",
    dateRange: "Available Dec 2 - 7",
    price: "5,701",
    price_per_night: 2850,
    rating: 4.96,
    guestFavorite: true,
    property_type: "Rooms",
    latitude: 28.5200,
    longitude: 77.3700,
    imageSrc: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=720&q=80"
  },
  {
    id: 13,
    title: "Flat in Greater Noida",
    location: "Flat in Greater Noida",
    distance: "Noida",
    dateRange: "Available Dec 4 - 9",
    price: "4,771",
    price_per_night: 2385,
    rating: 4.9,
    guestFavorite: true,
    property_type: "Rooms",
    latitude: 28.4744,
    longitude: 77.5040,
    imageSrc: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=720&q=80"
  },
  {
    id: 14,
    title: "Apartment in Noida",
    location: "Apartment in Noida",
    distance: "Noida",
    dateRange: "Available Dec 10 - 15",
    price: "5,145",
    price_per_night: 2572,
    rating: 4.92,
    guestFavorite: true,
    property_type: "Rooms",
    latitude: 28.5300,
    longitude: 77.3600,
    imageSrc: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=720&q=80"
  }
];

// Helper to extract city group key
function extractCityGroup(locationStr: string): string {
  const loc = (locationStr || "").toLowerCase();
  if (loc.includes("varanasi") || loc.includes("bhelupura") || loc.includes("assi")) return "Popular homes in Varanasi";
  if (loc.includes("noida")) return "Available in Noida this weekend";
  if (loc.includes("jaipur") || loc.includes("udaipur") || loc.includes("rajasthan")) return "Popular homes in Jaipur & Rajasthan";
  if (loc.includes("goa")) return "Available in Goa this weekend";
  if (loc.includes("manali") || loc.includes("himachal")) return "Popular stays in Manali";
  if (loc.includes("lonavala") || loc.includes("maharashtra")) return "Pool villas in Lonavala";
  if (loc.includes("wayanad") || loc.includes("kerala")) return "Treehouses & nature stays in Wayanad";
  if (loc.includes("mukteshwar") || loc.includes("uttarakhand")) return "Himalayan retreats in Uttarakhand";
  return "Popular homes worldwide";
}

// Compact City Carousel Row Component matching Airbnb screenshot
function CityCarouselRow({ title, listings }: { title: string; listings: any[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -420 : 420;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-2 py-1">
      
      {/* City Section Header matching screenshot (Title + Right Arrow + Carousel Nav) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 group cursor-pointer">
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white group-hover:underline">
            {title}
          </h2>
          <svg viewBox="0 0 32 32" className="w-3.5 h-3.5 fill-none stroke-current stroke-[3.5px] text-neutral-900 dark:text-white transition-transform group-hover:translate-x-0.5">
            <path d="M12 4l12 12-12 12" />
          </svg>
        </div>

        {/* Carousel Nav Arrows */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => scroll("left")}
            aria-label="Previous"
            className="w-6 h-6 rounded-full border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center hover:shadow-xs transition cursor-pointer text-neutral-700 dark:text-neutral-300 text-xs"
          >
            &larr;
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Next"
            className="w-6 h-6 rounded-full border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 flex items-center justify-center hover:shadow-xs transition cursor-pointer text-neutral-700 dark:text-neutral-300 text-xs"
          >
            &rarr;
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Row (Small compact cards matching screenshot) */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x pb-2 pt-0.5"
      >
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="w-[165px] sm:w-[185px] md:w-[200px] lg:w-[205px] flex-shrink-0 snap-start"
          >
            <ListingCard
              id={listing.id}
              imageSrc={listing.imageSrc}
              location={listing.location}
              distance={listing.distance}
              dateRange={listing.dateRange}
              price={listing.price || listing.price_per_night}
              rating={listing.rating}
              guestFavorite={listing.guestFavorite}
            />
          </div>
        ))}
      </div>

    </div>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const location = searchParams?.get("location");
  const category = searchParams?.get("category");
  const minPrice = searchParams?.get("minPrice");
  const maxPrice = searchParams?.get("maxPrice");
  const minRating = searchParams?.get("minRating");
  const guestFavorite = searchParams?.get("guestFavorite");
  
  const [allListings, setAllListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    setLoading(true);
    let url = "http://127.0.0.1:8000/api/listings?";
    if (location) url += `location=${encodeURIComponent(location)}&`;
    if (category && category !== "All") url += `category=${encodeURIComponent(category)}&`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        const rawList = Array.isArray(data) && data.length > 0 ? data : FALLBACK_LISTINGS;
        let filtered = rawList;

        if (category && category !== "All") {
          filtered = filtered.filter((l: any) => 
            String(l.property_type || "").toLowerCase().includes(category.toLowerCase())
          );
        }

        if (location) {
          filtered = filtered.filter((l: any) => 
            String(l.location || "").toLowerCase().includes(location.toLowerCase()) ||
            String(l.title || "").toLowerCase().includes(location.toLowerCase())
          );
        }

        if (minPrice) {
          filtered = filtered.filter((l: any) => {
            const num = Number(l.price_per_night) || Number(String(l.price || "").replace(/[^0-9.]/g, "")) || 0;
            return num >= Number(minPrice);
          });
        }

        if (maxPrice) {
          filtered = filtered.filter((l: any) => {
            const num = Number(l.price_per_night) || Number(String(l.price || "").replace(/[^0-9.]/g, "")) || 0;
            return num <= Number(maxPrice);
          });
        }

        if (minRating) {
          filtered = filtered.filter((l: any) => Number(l.rating || 0) >= Number(minRating));
        }

        if (guestFavorite === "true") {
          filtered = filtered.filter((l: any) => Boolean(l.guestFavorite));
        }

        setAllListings(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Backend fetch failed, using fallback listings:", err);
        let filtered = FALLBACK_LISTINGS;
        if (category && category !== "All") {
          filtered = filtered.filter((l: any) => 
            String(l.property_type || "").toLowerCase().includes(category.toLowerCase())
          );
        }
        setAllListings(filtered);
        setLoading(false);
      });
  }, [location, category, minPrice, maxPrice, minRating, guestFavorite]);

  // Group listings citywise for horizontal display
  const cityGroups: Record<string, any[]> = {};
  allListings.forEach((item) => {
    const city = extractCityGroup(item.location);
    if (!cityGroups[city]) {
      cityGroups[city] = [];
    }
    cityGroups[city].push(item);
  });

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#121212] transition-colors">
      <Header />
      <Categories />
      
      <main id="site-content" className="flex-1 pb-20">
        <div className="max-w-[2520px] mx-auto px-4 sm:px-6 md:px-10 xl:px-12 pt-3">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF385C]"></div>
            </div>
          ) : showMap ? (
            /* Interactive Map View */
            <div className="animate-in fade-in duration-300">
              <ListingMap listings={allListings} />
            </div>
          ) : allListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-neutral-500 dark:text-neutral-400 gap-2">
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">No exact matches</h2>
              <p className="text-sm">Try changing or removing some of your filters or searching for another destination.</p>
            </div>
          ) : (
            /* Horizontal Citywise Rows Layout */
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              {Object.entries(cityGroups).map(([cityName, items]) => (
                <CityCarouselRow key={cityName} title={cityName} listings={items} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating "Show map" / "Show list" Toggle Button (Airbnb Style) */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
        <button
          onClick={() => setShowMap(!showMap)}
          className="flex items-center gap-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-5 py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 font-semibold text-sm cursor-pointer border border-neutral-700/20"
        >
          {showMap ? (
            <>
              <span>Show list</span>
              <svg viewBox="0 0 32 32" className="w-4 h-4 fill-none stroke-current stroke-[3px]">
                <path d="M4 8h24M4 16h24M4 24h24" />
              </svg>
            </>
          ) : (
            <>
              <span>Show map</span>
              <svg viewBox="0 0 32 32" className="w-4 h-4 fill-none stroke-current stroke-[2.5px]">
                <path d="M16 2l9 4.5v20l-9-4.5-9 4.5V6.5L16 2zM7 6.5v20M25 6.5v20M16 2v20" />
              </svg>
            </>
          )}
        </button>
      </div>

    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-9 w-9 border-b-2 border-[#FF385C]"></div></div>}>
      <HomeContent />
    </Suspense>
  );
}
