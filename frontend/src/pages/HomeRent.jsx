import React, { useState, useEffect } from "react";
import { homeApi } from "../api/homes";
import HomeRentalCard from "../components/HomeRentalCard";
import { Building, PlusCircle, Search, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const HomeRent = ({ user }) => {
  const [homes, setHomes] = useState([]);
  const [filteredHomes, setFilteredHomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const navigate = useNavigate();
  const isHomeowner = user?.role === "homeowner";
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    fetchHomes();
  }, []);

  useEffect(() => {
    filterHomes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homes, searchTerm, locationFilter, statusFilter]);

  const fetchHomes = async () => {
    try {
      const response = await homeApi.getAll();
      setHomes(response.data || []);
    } catch (error) {
      console.error("Error fetching homes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterHomes = () => {
    let result = [...homes];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (home) =>
          home.title?.toLowerCase().includes(term) ||
          home.description?.toLowerCase().includes(term) ||
          home.location?.toLowerCase().includes(term)
      );
    }

    if (locationFilter) {
      result = result.filter((home) =>
        home.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (statusFilter) {
      result = result.filter((home) => home.status === statusFilter);
    }

    setFilteredHomes(result);
  };

  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Navigation Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-20">
            <Sidebar />
          </div>

          {/* Main Home Rentals Area */}
          <div className="lg:col-span-9 space-y-4">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>Home Rentals Portal</span>
                  <Building size={20} className="text-purple-500" />
                </h1>
                <p className="text-gray-500 text-xs mt-0.5">
                  Browse apartments, rooms, and family homes available for rent in your community.
                </p>
              </div>

              {(isHomeowner || isAdmin) && (
                <button
                  onClick={() => navigate("/home-rent/create")}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-full text-xs shadow-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 flex-shrink-0"
                >
                  <PlusCircle size={16} />
                  <span>Post Rental</span>
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title or details..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-gray-100 border border-transparent rounded-full text-xs focus:bg-white focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Filter by location..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-gray-100 border border-transparent rounded-full text-xs focus:bg-white focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-100 border border-transparent rounded-full text-xs focus:bg-white focus:border-purple-500 focus:outline-none transition-all"
                  >
                    <option value="">All Status (Available & Rented)</option>
                    <option value="available">Available Only</option>
                    <option value="rented">Rented Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Rentals Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600" />
              </div>
            ) : filteredHomes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-3 shadow-2xs">
                <h3 className="font-bold text-gray-900 text-base">No home rentals found</h3>
                <p className="text-gray-500 text-xs">
                  {homes.length === 0
                    ? "Be the first homeowner to post a rental in our community!"
                    : "Try adjusting your search criteria."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredHomes.map((home) => (
                  <HomeRentalCard key={home._id} home={home} user={user} onUpdate={fetchHomes} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeRent;