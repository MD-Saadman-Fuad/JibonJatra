import React, { useEffect, useState } from "react";
import { fetchMarketItems, deleteMarketItemAPI } from "../api/market";
import { getImageUrl } from "../api/client";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Search, MapPin, PlusCircle, Trash2, Edit3 } from "lucide-react";
import Sidebar from "../components/Sidebar";

const MarketList = ({ user }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("all");
  const navigate = useNavigate();

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await fetchMarketItems();
      setItems(res.data || []);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteMarketItemAPI(id, user?.token);
      loadItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item");
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = filterLocation === "all" || item.location === filterLocation;
    return matchesSearch && matchesLocation;
  });

  const locations = [...new Set(items.map((item) => item.location).filter(Boolean))];

  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Navigation */}
          <div className="hidden lg:block lg:col-span-3 sticky top-20">
            <Sidebar />
          </div>

          {/* Center Main Market Grid */}
          <div className="lg:col-span-9 space-y-4">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>Local Marketplace</span>
                  <ShoppingBag size={20} className="text-emerald-500" />
                </h1>
                <p className="text-gray-500 text-xs mt-0.5">
                  Daily produce prices, essential market goods, and local vendor listings.
                </p>
              </div>

              {(user?.role === "market_head" || user?.role === "admin") && (
                <button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-full text-xs shadow-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 flex-shrink-0"
                  onClick={() => navigate("/market/create")}
                >
                  <PlusCircle size={16} />
                  <span>List New Item</span>
                </button>
              )}
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by product name or source..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-gray-100 border border-transparent rounded-full text-xs focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-gray-100 border border-transparent rounded-full text-xs focus:bg-white focus:border-emerald-500 focus:outline-none transition-all"
                  >
                    <option value="all">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Items Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-3 shadow-2xs">
                <h3 className="font-bold text-gray-900 text-base">No market products found</h3>
                <p className="text-gray-500 text-xs">Try clearing search filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                  >
                    {item.image && (
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                        <div className="absolute top-2 right-2 bg-emerald-600 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-md">
                          ৳{item.price?.toLocaleString()}
                        </div>
                      </div>
                    )}

                    <div className="p-4 space-y-2 flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-gray-900 text-base leading-snug">{item.name}</h3>
                        {!item.image && (
                          <span className="text-base font-extrabold text-emerald-600">৳{item.price?.toLocaleString()}</span>
                        )}
                      </div>

                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin size={13} className="text-red-500" />
                          <span>{item.location}</span>
                        </div>
                        <p className="text-[11px] text-gray-400">Source: {item.source}</p>
                      </div>
                    </div>

                    {(user?.role === "admin" ||
                      user?.role === "market_head" ||
                      (user?.id && user.id === item.createdBy)) && (
                      <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/50 flex gap-2">
                        <button
                          onClick={() => navigate(`/market/edit/${item._id}`)}
                          className="flex-1 py-1 px-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 flex items-center justify-center gap-1"
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="flex-1 py-1 px-2 rounded-xl bg-rose-50 text-rose-600 text-xs font-semibold hover:bg-rose-100 flex items-center justify-center gap-1"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketList;