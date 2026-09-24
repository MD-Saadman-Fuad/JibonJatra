import React, { useEffect, useState } from "react";
import { fetchPosts } from "../api/posts";
import { getImageUrl } from "../api/client";
import { Link } from "react-router-dom";
import { MapPin, User, Search, PlusCircle, Sparkles, X } from "lucide-react";
import Sidebar from "../components/Sidebar";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data || []);
        setFilteredPosts(data || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  useEffect(() => {
    let result = [...posts];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (post) =>
          post.title?.toLowerCase().includes(term) ||
          post.content?.toLowerCase().includes(term) ||
          post.location?.toLowerCase().includes(term)
      );
    }

    if (categoryFilter) {
      result = result.filter((post) => post.category?.toLowerCase() === categoryFilter.toLowerCase());
    }

    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredPosts(result);
  }, [searchTerm, categoryFilter, posts]);

  const categories = ["daily", "news", "community", "home_rental"];

  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Navigation Column */}
          <div className="hidden lg:block lg:col-span-3 sticky top-20">
            <Sidebar />
          </div>

          {/* Center Main Posts Feed Column */}
          <div className="lg:col-span-9 space-y-4">
            {/* Header Box */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>Community Discussions</span>
                  <Sparkles size={20} className="text-blue-500" />
                </h1>
                <p className="text-gray-500 text-xs mt-0.5">
                  Share news, stories, community announcements, and rental updates.
                </p>
              </div>

              <Link
                to="/create-post"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-4 py-2 rounded-full text-xs shadow-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 flex-shrink-0"
              >
                <PlusCircle size={16} />
                <span>Create New Post</span>
              </Link>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search posts or locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-gray-100 border border-transparent rounded-full text-xs focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
                  <button
                    onClick={() => setCategoryFilter("")}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      !categoryFilter ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all flex-shrink-0 ${
                        categoryFilter === cat ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {cat.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-3 shadow-2xs">
                <h3 className="font-bold text-gray-900 text-base">No discussions found</h3>
                <p className="text-gray-500 text-xs">Try clearing your filters or create a new community post.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPosts.map((post) => {
                  const authorName = post.user?.name || post.user?.email?.split("@")[0] || "Resident";
                  return (
                    <div
                      key={post._id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                    >
                      {post.images && post.images.length > 0 && (
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                          <img
                            src={getImageUrl(post.images[0])}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                          {post.images.length > 1 && (
                            <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              +{post.images.length - 1} photos
                            </span>
                          )}
                        </div>
                      )}

                      <div className="p-4 space-y-2 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full capitalize">
                            {post.category?.replace("_", " ") || "General"}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {new Date(post.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </span>
                        </div>

                        <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
                          {post.content}
                        </p>
                      </div>

                      <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50">
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-blue-500" />
                          <span className="font-medium text-gray-700 truncate max-w-[120px]">{authorName}</span>
                        </div>

                        {post.location && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <MapPin size={13} className="text-red-500" />
                            <span className="truncate max-w-[100px]">{post.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Posts;