"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

export default function HostDashboard() {
  const router = useRouter();
  const { currentUser, switchUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"listings" | "bookings">("listings");
  const [view, setView] = useState<"dashboard" | "create" | "edit">("dashboard");
  const [listings, setListings] = useState<any[]>([]);
  const [hostBookings, setHostBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const hostId = 1; // John Doe from seed

  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    description: "",
    property_type: "Rooms",
    location: "",
    distance: "0 kilometers away",
    dateRange: "Available now",
    price_per_night: 3500,
    price: "3500",
    rating: 5.0,
    guestFavorite: true,
    imageSrc: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80",
    images: "[]",
    amenities: '["Wifi", "Kitchen", "Air conditioning"]',
    host_id: hostId
  });

  const fetchListings = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/users/${hostId}/listings`)
      .then(res => res.json())
      .then(data => {
        setListings(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchHostBookings = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/hosts/${hostId}/bookings`)
      .then(res => res.json())
      .then(data => {
        setHostBookings(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (view === "dashboard" && currentUser.role === "host") {
      fetchListings();
      fetchHostBookings();
    }
  }, [view, currentUser.role]);

  // Handle real file upload to backend
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/upload`, {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const uploadRes = await res.json();
        setFormData(prev => ({
          ...prev,
          imageSrc: uploadRes.url,
          images: JSON.stringify([uploadRes.url])
        }));
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          setFormData(prev => ({
            ...prev,
            imageSrc: url,
            images: JSON.stringify([url])
          }));
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          imageSrc: url,
          images: JSON.stringify([url])
        }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const dataToSubmit = { 
        ...formData, 
        price: formData.price_per_night.toString(), 
        host_id: hostId 
      };
      const url = view === "edit" ? `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/listings/${formData.id}` : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/listings`;
      const method = view === "edit" ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });

      if (response.ok) {
        setNoticeMessage(`Listing ${view === "edit" ? "updated" : "published"} successfully!`);
        setTimeout(() => {
          setNoticeMessage(null);
          setView("dashboard");
        }, 1200);
      } else {
        setNoticeMessage("Failed to save listing. Please check inputs.");
      }
    } catch {
      setNoticeMessage("Error connecting to server. Ensure backend is running.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/listings/${id}`, { method: "DELETE" });
      if (res.ok) {
        setListings(listings.filter(l => l.id !== id));
        setNoticeMessage("Listing removed.");
        setTimeout(() => setNoticeMessage(null), 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      id: 0,
      title: "",
      description: "",
      property_type: "Rooms",
      location: "",
      distance: "0 kilometers away",
      dateRange: "Available now",
      price_per_night: 3500,
      price: "3500",
      rating: 5.0,
      guestFavorite: true,
      imageSrc: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80",
      images: "[]",
      amenities: '["Wifi", "Kitchen", "Air conditioning"]',
      host_id: hostId
    });
  };

  const totalEarnings = hostBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);

  // If currently in Guest / User Mode, restrict editing and provide switch option
  if (currentUser.role !== "host") {
    return (
      <main className="pb-20 bg-gray-50 dark:bg-[#121212] min-h-screen transition-colors">
        <Header />
        <div className="max-w-xl mx-auto px-4 pt-20 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-[#FF385C]">
            <svg viewBox="0 0 32 32" className="w-8 h-8 fill-current">
              <path d="M16 2l3.5 9.5L29 15l-7.5 6.5L23.5 31 16 25.5 8.5 31l2-9.5L3 15l9.5-3.5L16 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Host Controls Restricted</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
            You are currently signed in as a <span className="font-semibold text-neutral-800 dark:text-neutral-200">Guest ({currentUser.name})</span>. Listing creation and editing permissions are reserved for Host accounts.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => router.push("/")}
              className="px-5 py-2.5 border border-gray-300 dark:border-neutral-700 rounded-xl text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
            >
              Explore Homes
            </button>
            <button
              onClick={() => switchUser("host")}
              className="px-6 py-2.5 bg-[#FF385C] hover:bg-[#E00B41] text-white rounded-xl text-sm font-bold shadow-md transition cursor-pointer"
            >
              Switch to Host Mode
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-20 bg-gray-50 dark:bg-[#121212] min-h-screen transition-colors">
      <Header />
      
      {noticeMessage && (
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <div className="bg-neutral-900 dark:bg-white text-white dark:text-black py-3 px-5 rounded-xl font-semibold text-sm flex justify-between items-center shadow-lg">
            <span>{noticeMessage}</span>
            <button onClick={() => setNoticeMessage(null)} className="text-xs underline cursor-pointer">Dismiss</button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 xl:px-20 pt-8">
        
        {/* Host Header & Superhost Badge */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Host Dashboard</h1>
              <span className="bg-[#FF385C] text-white text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                ★ Superhost
              </span>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              {listings.length} properties · ₹{totalEarnings} lifetime bookings revenue
            </p>
          </div>
          
          {view === "dashboard" && (
            <button
              onClick={() => { resetForm(); setView("create"); }}
              className="bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-sm px-6 py-3 rounded-xl transition shadow-md cursor-pointer"
            >
              + Create New Listing
            </button>
          )}
        </div>

        {/* Tab Navigation (My Listings vs Reservations Received) */}
        {view === "dashboard" && (
          <div className="flex border-b border-gray-200 dark:border-neutral-800 mb-8 gap-8">
            <button
              onClick={() => setActiveTab("listings")}
              className={`pb-3 font-semibold text-sm transition cursor-pointer border-b-2 ${
                activeTab === "listings"
                  ? "border-black dark:border-white text-neutral-900 dark:text-white"
                  : "border-transparent text-neutral-500 hover:text-black dark:hover:text-white"
              }`}
            >
              My Listings ({listings.length})
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`pb-3 font-semibold text-sm transition cursor-pointer border-b-2 ${
                activeTab === "bookings"
                  ? "border-black dark:border-white text-neutral-900 dark:text-white"
                  : "border-transparent text-neutral-500 hover:text-black dark:hover:text-white"
              }`}
            >
              Reservations Received ({hostBookings.length})
            </button>
          </div>
        )}

        {view === "dashboard" ? (
          activeTab === "listings" ? (
            <div>
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-[#FF385C]"></div>
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800">
                  <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-white">You don't have any listings yet</h2>
                  <p className="text-neutral-500 dark:text-neutral-400 mb-6">Start hosting and earning income on your properties today.</p>
                  <button
                    onClick={() => { resetForm(); setView("create"); }}
                    className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-bold hover:bg-black dark:hover:bg-neutral-200 transition cursor-pointer"
                  >
                    Create your first listing
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map(listing => (
                    <div key={listing.id} className="bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden flex flex-col hover:shadow-md transition">
                      <div className="h-48 w-full bg-neutral-200 dark:bg-neutral-800 relative">
                        <img referrerPolicy="no-referrer" src={listing.imageSrc} className="w-full h-full object-cover" alt="" />
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                          {listing.property_type}
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-lg text-neutral-900 dark:text-white line-clamp-1">{listing.title}</h3>
                        <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-3 line-clamp-1">{listing.location}</p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-neutral-800">
                          <div>
                            <span className="font-bold text-base text-neutral-900 dark:text-white">₹{listing.price_per_night}</span>
                            <span className="text-xs text-neutral-500 font-light"> / night</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setFormData({
                                  id: listing.id,
                                  title: listing.title,
                                  description: listing.description,
                                  property_type: listing.property_type,
                                  location: listing.location,
                                  distance: listing.distance,
                                  dateRange: listing.dateRange,
                                  price_per_night: listing.price_per_night,
                                  price: listing.price,
                                  rating: listing.rating,
                                  guestFavorite: listing.guestFavorite,
                                  imageSrc: listing.imageSrc,
                                  images: listing.images || "[]",
                                  amenities: listing.amenities || "[]",
                                  host_id: hostId
                                });
                                setView("edit");
                              }}
                              className="px-3 py-1.5 border border-gray-300 dark:border-neutral-700 rounded-lg text-xs font-semibold hover:border-black dark:hover:border-white transition cursor-pointer text-neutral-800 dark:text-neutral-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(listing.id)}
                              className="px-3 py-1.5 border border-rose-200 text-rose-600 rounded-lg text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950 transition cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Reservations Received View */
            <div>
              {hostBookings.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-[#1c1c1c] rounded-2xl border border-gray-200 dark:border-neutral-800">
                  <h3 className="font-bold text-xl mb-2 text-neutral-900 dark:text-white">No guest bookings yet</h3>
                  <p className="text-neutral-500 text-sm">When travelers reserve stays at your properties, they will appear here.</p>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-neutral-50 dark:bg-[#252525] border-b border-gray-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs uppercase font-bold">
                        <tr>
                          <th className="p-4">Booking ID</th>
                          <th className="p-4">Stay Dates</th>
                          <th className="p-4">Guests</th>
                          <th className="p-4">Payout</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                        {hostBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-neutral-50 dark:hover:bg-[#202020] transition">
                            <td className="p-4 font-mono font-semibold text-xs text-neutral-800 dark:text-neutral-200">#RES-{b.id}</td>
                            <td className="p-4 font-medium text-neutral-900 dark:text-white">{b.check_in} &rarr; {b.check_out}</td>
                            <td className="p-4 text-neutral-600 dark:text-neutral-400">{b.guests} guests</td>
                            <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">₹{b.total_price}</td>
                            <td className="p-4">
                              <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full">
                                Paid & Confirmed
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          /* Create / Edit Form */
          <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800 p-6 sm:p-8 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                {view === "create" ? "Create New Listing" : "Edit Listing"}
              </h2>
              <button 
                onClick={() => setView("dashboard")}
                className="text-sm font-semibold text-neutral-500 hover:text-black dark:hover:text-white underline cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 dark:border-neutral-700 rounded-xl p-3 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent text-neutral-900 dark:text-white"
                  placeholder="e.g. Modern Himalayan Cottage"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">Category</label>
                  <select
                    value={formData.property_type}
                    onChange={e => setFormData({ ...formData, property_type: e.target.value })}
                    className="w-full border border-gray-300 dark:border-neutral-700 rounded-xl p-3 text-sm outline-none bg-transparent text-neutral-900 dark:text-white"
                  >
                    <option value="Rooms" className="dark:bg-[#222]">Rooms</option>
                    <option value="Amazing pools" className="dark:bg-[#222]">Amazing pools</option>
                    <option value="Cabins" className="dark:bg-[#222]">Cabins</option>
                    <option value="Castles" className="dark:bg-[#222]">Castles</option>
                    <option value="Earth homes" className="dark:bg-[#222]">Earth homes</option>
                    <option value="Tropical" className="dark:bg-[#222]">Tropical</option>
                    <option value="Treehouses" className="dark:bg-[#222]">Treehouses</option>
                    <option value="Mansions" className="dark:bg-[#222]">Mansions</option>
                    <option value="Farms" className="dark:bg-[#222]">Farms</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">Nightly Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price_per_night}
                    onChange={e => setFormData({ ...formData, price_per_night: Number(e.target.value) })}
                    className="w-full border border-gray-300 dark:border-neutral-700 rounded-xl p-3 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border border-gray-300 dark:border-neutral-700 rounded-xl p-3 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent text-neutral-900 dark:text-white"
                  placeholder="e.g. Manali, Himachal Pradesh"
                />
              </div>

              {/* Photo Upload & Preview */}
              <div>
                <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">Listing Photo</label>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-32 h-24 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 flex-shrink-0">
                    <img referrerPolicy="no-referrer" src={formData.imageSrc} alt="Preview" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col gap-2 w-full">
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-neutral-700 hover:border-black dark:hover:border-white rounded-xl p-4 cursor-pointer transition">
                      <svg viewBox="0 0 32 32" className="w-5 h-5 fill-none stroke-current stroke-[2.5px]">
                        <path d="M16 4v18M8 12l8-8 8 8M4 26h24" />
                      </svg>
                      <span className="text-xs font-bold">{uploadingImage ? "Uploading..." : "Upload photo from device"}</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                    
                    <input
                      type="url"
                      value={formData.imageSrc}
                      onChange={e => setFormData({ ...formData, imageSrc: e.target.value })}
                      placeholder="Or paste external image URL..."
                      className="w-full border border-gray-300 dark:border-neutral-700 rounded-xl p-2.5 text-xs outline-none bg-transparent text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-neutral-700 dark:text-neutral-300 block mb-1">Description</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 dark:border-neutral-700 rounded-xl p-3 text-sm outline-none focus:border-black dark:focus:border-white bg-transparent text-neutral-900 dark:text-white"
                  placeholder="Describe the architectural uniqueness, amenities, and surroundings..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setView("dashboard")}
                  className="px-6 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800 transition cursor-pointer text-neutral-800 dark:text-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : view === "create" ? "Publish Listing" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </main>
  );
}
