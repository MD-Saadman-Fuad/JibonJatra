import React, { useEffect, useState, useCallback } from "react";
import { api } from "../apiClient";
import ItemFrom from "../components/ItemFrom";
import ItemCard from "../components/ItemCard";
import { Search, AlertCircle } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function LostFound() {
  const [items, setItems] = useState([]);
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const currentUserId = currentUser?.id || localStorage.getItem("userId");

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/items", { params: { type, search } });
      setItems(data.items || []);
    } catch (err) {
      console.error("Failed to fetch items:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [type, search]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreated = (doc) => setItems((prev) => [doc, ...prev]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Navigation */}
          <div className="hidden lg:block lg:col-span-3 sticky top-20">
            <Sidebar />
          </div>

          {/* Main Content Column */}
          <div className="lg:col-span-9 space-y-4">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>Lost & Found Noticeboard</span>
                  <AlertCircle size={20} className="text-rose-500" />
                </h1>
                <p className="text-gray-500 text-xs mt-0.5">
                  Report missing belongings or help neighbors recover found items.
                </p>
              </div>
            </div>

            {/* Item Creation Form Component */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs">
              <ItemFrom onCreated={handleCreated} />
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs flex flex-col sm:flex-row items-center gap-3 justify-between">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setType("")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    !type ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setType("lost")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    type === "lost" ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Lost
                </button>
                <button
                  onClick={() => setType("found")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    type === "found" ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Found
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search lost or found items..."
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-100 border border-transparent rounded-full text-xs focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500" />
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-3 shadow-2xs">
                <h3 className="font-bold text-gray-900 text-base">No items listed</h3>
                <p className="text-gray-500 text-xs">Use the form above to post a lost or found notice.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {items.map((it) => (
                  <ItemCard
                    key={it._id}
                    item={it}
                    onDelete={handleDelete}
                    currentUserId={currentUserId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
