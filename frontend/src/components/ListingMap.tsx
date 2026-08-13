"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

interface ListingPin {
  id: number;
  title: string;
  price: string | number;
  price_per_night?: number;
  location: string;
  imageSrc: string;
  rating?: number;
  latitude?: number;
  longitude?: number;
  property_type?: string;
}

interface ListingMapProps {
  listings: ListingPin[];
  categoryTitle?: string;
}

const LOCATION_COORDINATES: Record<string, [number, number]> = {
  varanasi: [25.3176, 82.9739],
  bhelupura: [25.2980, 82.9930],
  assi: [25.2890, 83.0060],
  noida: [28.5355, 77.3910],
  "greater noida": [28.4744, 77.5040],
  delhi: [28.6139, 77.2090],
  mumbai: [19.0760, 72.8777],
  jaipur: [26.9124, 75.7873],
  udaipur: [24.5764, 73.6800],
  jodhpur: [26.2978, 73.0185],
  lonavala: [18.7557, 73.4091],
  khandala: [18.7650, 73.4150],
  manali: [32.2432, 77.1892],
  solang: [32.3160, 77.1570],
  mukteshwar: [29.4722, 79.6478],
  kasauli: [30.9013, 76.9649],
  goa: [15.4989, 73.8278],
  anjuna: [15.5800, 73.7400],
  candolim: [15.5180, 73.7660],
  wayanad: [11.6854, 76.1320],
  munnar: [10.0889, 77.0595],
  alibaug: [18.6414, 72.8722],
  amritsar: [31.6340, 74.8723],
  coorg: [12.3375, 75.8069],
};

function getListingLatLng(listing: ListingPin, index: number): [number, number] {
  if (listing.latitude && listing.longitude) {
    return [listing.latitude, listing.longitude];
  }
  const loc = (listing.location || "").toLowerCase();
  for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
    if (loc.includes(key)) {
      return [coords[0] + (index % 3) * 0.006 - 0.003, coords[1] + (index % 2) * 0.006 - 0.003];
    }
  }
  return [20.5937 + (index % 4) * 1.5, 78.9629 + (index % 3) * 1.5];
}

export default function ListingMap({ listings, categoryTitle }: ListingMapProps) {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const { theme } = useTheme();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Expose navigation to window for Leaflet DOM clicks
  useEffect(() => {
    (window as any).__navigateToHotel = (id: number) => {
      router.push(`/listings/${id}`);
    };
  }, [router]);

  // Load Leaflet assets
  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (!(window as any).L) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => {
        setMapLoaded(true);
      };
      document.body.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  // Initialize base Leaflet map once only
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || !(window as any).L) return;
    const L = (window as any).L;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([22.5937, 78.9629], 5);

      const isDark = theme === "dark";
      const tileUrl = isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

      const tileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      markersLayerRef.current = L.featureGroup().addTo(map);
      mapInstanceRef.current = map;

      // Force instant resize calculation
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          setMapReady(true);
        }
      }, 150);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        tileLayerRef.current = null;
        setMapReady(false);
      }
    };
  }, [mapLoaded, theme]);

  // Seamless Tile Theme Switcher (Light <-> Dark mode)
  useEffect(() => {
    if (!mapInstanceRef.current || !(window as any).L || !tileLayerRef.current) return;
    
    const isDark = theme === "dark";
    const newTileUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    tileLayerRef.current.setUrl(newTileUrl);

    // Invalidate size immediately so no tiles stay blank or grey
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 50);
  }, [theme]);

  // Update Markers & Auto-fit Bounds whenever listings or theme changes
  useEffect(() => {
    if (!mapInstanceRef.current || !(window as any).L || !markersLayerRef.current) return;

    const L = (window as any).L;
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    const isDark = theme === "dark";

    // Clear previous markers
    layer.clearLayers();

    if (!listings || listings.length === 0) return;

    // Plot listings
    listings.forEach((listing, index) => {
      const [lat, lng] = getListingLatLng(listing, index);
      const priceText = listing.price_per_night ? `₹${listing.price_per_night.toLocaleString("en-IN")}` : `₹${listing.price}`;
      const title = listing.title || listing.location;
      const shortTitle = title.length > 20 ? title.slice(0, 18) + "..." : title;

      const customIcon = L.divIcon({
        className: "custom-airbnb-marker",
        html: `
          <div 
            style="
              background: ${isDark ? '#1e1e1e' : '#ffffff'};
              color: ${isDark ? '#ffffff' : '#222222'};
              border: 1px solid ${isDark ? '#444444' : '#dddddd'};
              border-radius: 24px;
              padding: 5px 12px;
              font-weight: 700;
              font-size: 12px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              box-shadow: 0 4px 12px rgba(0,0,0,0.18);
              cursor: pointer;
              white-space: nowrap;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              transform: translate(-50%, -50%);
              transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
            "
            onmouseover="this.style.transform='translate(-50%, -50%) scale(1.1)'; this.style.zIndex='9999'; this.style.background='${isDark ? '#2a2a2a' : '#f0f0f0'}';"
            onmouseout="this.style.transform='translate(-50%, -50%) scale(1)'; this.style.zIndex='1'; this.style.background='${isDark ? '#1e1e1e' : '#ffffff'}';"
          >
            <span style="color: #FF385C; font-weight: 800;">${priceText}</span>
            <span style="color: ${isDark ? '#cccccc' : '#555555'}; font-weight: 600; font-size: 11px;">
              ${shortTitle}
            </span>
          </div>
        `,
        iconSize: [150, 32],
        iconAnchor: [75, 16],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Interactive Hotel Preview Card Popup on Hover
      const popupContent = `
        <div 
          onclick="window.__navigateToHotel(${listing.id})"
          style="
            width: 250px; 
            cursor: pointer; 
            border-radius: 16px; 
            overflow: hidden; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            background: ${isDark ? '#202020' : '#ffffff'}; 
            color: ${isDark ? '#ffffff' : '#222222'}; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.25);
          "
        >
          <div style="width: 100%; height: 140px; position: relative; overflow: hidden; background: #eee;">
            <img 
              referrerpolicy="no-referrer"
              src="${listing.imageSrc}" 
              alt="${title}"
              style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" 
              onmouseover="this.style.transform='scale(1.06)'"
              onmouseout="this.style.transform='scale(1)'"
            />
            <div style="position: absolute; top: 8px; left: 8px; background: rgba(255,255,255,0.92); color: #222; font-weight: 800; font-size: 11px; padding: 3px 8px; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
              ★ ${listing.rating ? Number(listing.rating).toFixed(2) : "4.95"}
            </div>
          </div>
          <div style="padding: 10px 12px 10px 12px;">
            <div style="font-weight: 700; font-size: 13px; line-height: 1.3; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${title}
            </div>
            <div style="font-size: 11px; color: ${isDark ? '#aaaaaa' : '#717171'}; margin-bottom: 6px;">
              ${listing.location}
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid ${isDark ? '#333333' : '#eeeeee'}; padding-top: 6px;">
              <span style="font-weight: 700; font-size: 13px;">
                ${priceText} <span style="font-weight: 400; font-size: 11px; color: #717171;">night</span>
              </span>
              <span style="color: #FF385C; font-weight: 700; font-size: 12px; display: inline-flex; align-items: center; gap: 2px;">
                View Stay &rarr;
              </span>
            </div>
          </div>
        </div>
      `;

      const popup = L.popup({
        offset: [0, -18],
        closeButton: false,
        className: "airbnb-hover-popup",
        autoPan: true,
      }).setContent(popupContent);

      marker.bindPopup(popup);

      // Open on hover
      marker.on("mouseover", function (this: any) {
        this.openPopup();
      });

      // Direct click opens hotel page
      marker.on("click", () => {
        router.push(`/listings/${listing.id}`);
      });

      layer.addLayer(marker);
    });

    // Auto-fit bounds so ALL hotels of this section/category are visible
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: listings.length === 1 ? 13 : 14,
        animate: true,
      });
    }

    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);

  }, [listings, theme, router, mapReady]);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[520px] rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-neutral-800">
      
      {/* Category / Section Floating Banner */}
      <div className="absolute top-4 left-4 z-20 bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-gray-200 dark:border-neutral-700 flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-white">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF385C] animate-pulse" />
        <span>
          Showing {listings.length} {listings.length === 1 ? "stay" : "stays"} on Map {categoryTitle ? `(${categoryTitle})` : ""}
        </span>
      </div>

      <style jsx global>{`
        .airbnb-hover-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          padding: 0 !important;
          border-radius: 16px !important;
          box-shadow: none !important;
          overflow: hidden !important;
        }
        .airbnb-hover-popup .leaflet-popup-content {
          margin: 0 !important;
          line-height: 1 !important;
        }
        .airbnb-hover-popup .leaflet-popup-tip {
          background: ${theme === "dark" ? "#202020" : "#ffffff"} !important;
        }
      `}</style>
      
      <div 
        ref={mapContainerRef} 
        className="w-full h-full z-10" 
        style={{ minHeight: "520px" }}
      />
      
      {!mapLoaded && (
        <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF385C]"></div>
            <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">Loading Map...</span>
          </div>
        </div>
      )}
    </div>
  );
}
