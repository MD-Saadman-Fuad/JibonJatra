import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchServices, deleteServiceAPI } from "../api/services";
import { getImageUrl } from "../api/client";
import { Wrench, Search, MapPin, PlusCircle, Star, Phone, Edit3, Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function ServiceList({ token, user }) {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const navigate = useNavigate();

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await fetchServices();
      const servicesData = Array.isArray(res.data) ? res.data : res.data?.items || res.data?.services || [];
      setServices(servicesData);
      setFilteredServices(servicesData);
    } catch (err) {
      console.error("Error loading services:", err);
      setServices([]);
      setFilteredServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteServiceAPI(id, token);
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Failed to delete service.");
    }
  };

  useEffect(() => {
    if (!Array.isArray(services)) {
      setFilteredServices([]);
      return;
    }

    let result = [...services];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.serviceName?.toLowerCase().includes(term) ||
          s.serviceDetail?.toLowerCase().includes(term) ||
          s.providerName?.toLowerCase().includes(term) ||
          s.location?.toLowerCase().includes(term)
      );
    }

    if (serviceTypeFilter) {
      result = result.filter((s) => s.serviceType?.toLowerCase().includes(serviceTypeFilter.toLowerCase()));
    }

    setFilteredServices(result);
  }, [searchTerm, serviceTypeFilter, services]);

  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Navigation */}
          <div className="hidden lg:block lg:col-span-3 sticky top-20">
            <Sidebar />
          </div>

          {/* Center Main Content */}
          <div className="lg:col-span-9 space-y-4">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>Local Services & Experts</span>
                  <Wrench size={20} className="text-amber-500" />
                </h1>
                <p className="text-gray-500 text-xs mt-0.5">
                  Hire verified electricians, plumbers, tutors, repairers, and neighborhood specialists.
                </p>
              </div>

              {(user?.role === "service provider" || user?.role === "admin") && (
                <button
                  onClick={() => navigate("/services/create")}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-full text-xs shadow-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 flex-shrink-0"
                >
                  <PlusCircle size={16} />
                  <span>Register Service</span>
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
                    placeholder="Search by service name, provider, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-gray-100 border border-transparent rounded-full text-xs focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="relative">
                  <Wrench size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Filter by service category..."
                    value={serviceTypeFilter}
                    onChange={(e) => setServiceTypeFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-gray-100 border border-transparent rounded-full text-xs focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Services Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500" />
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-3 shadow-2xs">
                <h3 className="font-bold text-gray-900 text-base">No services found</h3>
                <p className="text-gray-500 text-xs">Try adjusting your filter keyword.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredServices.map((s) => (
                  <div
                    key={s._id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer"
                    onClick={() => navigate(`/services/${s._id}`)}
                  >
                    {s.servicePicture && (
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        <img
                          src={getImageUrl(s.servicePicture)}
                          alt={s.serviceName}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                        <div className="absolute top-2 right-2 bg-amber-500 text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full shadow-md">
                          ৳{s.servicePrice?.toLocaleString()}
                        </div>
                      </div>
                    )}

                    <div className="p-4 space-y-2 flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-gray-900 text-base leading-snug">{s.serviceName}</h3>
                        {!s.servicePicture && (
                          <span className="text-base font-extrabold text-amber-600">৳{s.servicePrice?.toLocaleString()}</span>
                        )}
                      </div>

                      <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">{s.serviceDetail}</p>

                      <div className="space-y-1 text-xs text-gray-500 pt-1">
                        <div className="flex items-center gap-1">
                          <MapPin size={13} className="text-red-500" />
                          <span>{s.location}</span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-gray-700">
                          <Phone size={13} className="text-blue-500" />
                          <span>{s.providerContact}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-gray-800 pt-2 border-t border-gray-50">
                        <Star size={15} className="fill-amber-400 text-amber-400" />
                        <span>{s.ratingAverage ? Number(s.ratingAverage).toFixed(1) : "5.0"}</span>
                        <span className="text-gray-400 font-normal">({s.ratingCount || 1} reviews)</span>
                      </div>
                    </div>

                    {user &&
                      (user.role === "admin" ||
                        (user.role === "service provider" &&
                          (user.id === s.createdBy?._id || user.id === s.createdBy))) && (
                        <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50/50 flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/services/edit/${s._id}`);
                            }}
                            className="flex-1 py-1 px-2 rounded-xl bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 flex items-center justify-center gap-1"
                          >
                            <Edit3 size={13} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(s._id);
                            }}
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
}
