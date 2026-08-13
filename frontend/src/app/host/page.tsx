"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";

export default function HostDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    distance: "",
    dateRange: "",
    price: "",
    rating: 5.0,
    guestFavorite: false,
    imageSrc: "https://a0.muscache.com/im/pictures/miso/Hosting-1094771440597889199/original/396e39d5-12b4-4442-ae8b-3c09940b693b.jpeg?im_w=720"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Listing created successfully!");
        router.push("/");
      } else {
        alert("Failed to create listing");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pb-20 bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-3xl mx-auto px-4 pt-12">
        <h1 className="text-3xl font-semibold mb-2">Host Dashboard</h1>
        <p className="text-gray-500 mb-8">Add a new property to your Airbnb clone portfolio.</p>
        
        <div className="bg-white p-8 rounded-2xl airbnb-shadow">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm">Location (e.g., Paris, France)</label>
              <input 
                type="text" 
                required
                className="border border-gray-300 rounded-lg p-3 outline-none focus:border-airbnb-brand"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm">Distance / Description (e.g., 2 kilometers away)</label>
              <input 
                type="text" 
                required
                className="border border-gray-300 rounded-lg p-3 outline-none focus:border-airbnb-brand"
                value={formData.distance}
                onChange={e => setFormData({...formData, distance: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm">Date Range Availability (e.g., Nov 2 - 7)</label>
              <input 
                type="text" 
                required
                className="border border-gray-300 rounded-lg p-3 outline-none focus:border-airbnb-brand"
                value={formData.dateRange}
                onChange={e => setFormData({...formData, dateRange: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm">Price per night (₹)</label>
              <input 
                type="text" 
                required
                className="border border-gray-300 rounded-lg p-3 outline-none focus:border-airbnb-brand"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-sm">Image URL (Optional)</label>
              <input 
                type="text" 
                className="border border-gray-300 rounded-lg p-3 outline-none focus:border-airbnb-brand text-gray-500"
                value={formData.imageSrc}
                onChange={e => setFormData({...formData, imageSrc: e.target.value})}
              />
            </div>

            <div className="flex flex-row items-center gap-3">
              <input 
                type="checkbox" 
                className="w-5 h-5 accent-airbnb-brand"
                checked={formData.guestFavorite}
                onChange={e => setFormData({...formData, guestFavorite: e.target.checked})}
              />
              <label className="font-semibold text-sm">Mark as "Guest Favorite"</label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-4 bg-airbnb-brand hover:bg-airbnb-gradient-end text-white font-semibold py-4 rounded-lg transition duration-300"
            >
              {loading ? "Publishing..." : "Publish Listing"}
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}
