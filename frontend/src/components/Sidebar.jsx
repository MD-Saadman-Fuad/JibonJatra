import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  Home,
  MessageSquare,
  ShoppingBag,
  Wrench,
  Building,
  Search,
  ShieldCheck,
  PlusCircle,
  Sparkles,
  Store
} from "lucide-react";

export default function Sidebar({ user }) {
  const currentUser = user || (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const getUserInitials = () => {
    const name = currentUser?.name || currentUser?.email || "User";
    return name.slice(0, 2).toUpperCase();
  };

  const navLinks = [
    { to: "/feed", label: "Community Feed", icon: Home, color: "text-blue-500", bg: "bg-blue-50" },
    { to: "/posts", label: "Discussions & Posts", icon: MessageSquare, color: "text-indigo-500", bg: "bg-indigo-50" },
    { to: "/market", label: "Local Marketplace", icon: ShoppingBag, color: "text-emerald-500", bg: "bg-emerald-50" },
    { to: "/services", label: "Local Services", icon: Wrench, color: "text-amber-500", bg: "bg-amber-50" },
    { to: "/home-rent", label: "Home Rentals", icon: Building, color: "text-purple-500", bg: "bg-purple-50" },
    { to: "/lostfound", label: "Lost & Found Notice", icon: Search, color: "text-rose-500", bg: "bg-rose-50" },
  ];

  if (currentUser?.role === "admin") {
    navLinks.push({ to: "/admin", label: "Admin Control Center", icon: ShieldCheck, color: "text-red-500", bg: "bg-red-50" });
  }

  return (
    <aside className="w-full space-y-4">
      {/* User Quick Profile Snippet */}
      <Link
        to="/profile"
        className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 shadow-2xs transition-all duration-200 group"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs border border-white group-hover:scale-105 transition-transform duration-200">
          {getUserInitials()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {currentUser?.name || "Community Resident"}
          </h4>
          <span className="inline-block text-[11px] text-gray-500 capitalize">
            {currentUser?.role ? `${currentUser.role} Account` : "View Profile"}
          </span>
        </div>
      </Link>

      {/* Main Navigation Links */}
      <div className="bg-white rounded-2xl border border-gray-100 p-2 shadow-2xs space-y-1">
        <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
          Shortcuts
        </p>

        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-blue-50/80 text-blue-700 font-bold shadow-2xs"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center ${item.color}`}>
                <Icon size={18} />
              </div>
              <span className="flex-1 truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-yellow-300 animate-pulse" />
            <h5 className="font-bold text-sm">Post to Community</h5>
          </div>
          <p className="text-xs text-blue-100 leading-relaxed">
            Share updates, list products, or post home rentals with neighborhood residents.
          </p>

          <div className="pt-2 flex flex-col gap-1.5">
            <Link
              to="/create-post"
              className="flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <PlusCircle size={14} />
              <span>Create New Post</span>
            </Link>
            <Link
              to="/market/create"
              className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium transition-all"
            >
              <Store size={14} />
              <span>List Market Item</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
