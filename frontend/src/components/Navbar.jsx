import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  Home,
  MessageSquare,
  ShoppingBag,
  Wrench,
  Building,
  Search,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  PlusCircle,
  ChevronDown,
  Bell
} from "lucide-react";

const Navbar = ({ role, onLogout, user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      const saved = localStorage.getItem("user");
      if (saved) {
        try {
          setCurrentUser(JSON.parse(saved));
        } catch (e) {
          // ignore
        }
      }
    } else {
      setCurrentUser(user);
    }
  }, [user]);

  const navItems = [
    { to: "/feed", label: "Feed", icon: Home },
    { to: "/posts", label: "Posts", icon: MessageSquare },
    { to: "/market", label: "Market", icon: ShoppingBag },
    { to: "/services", label: "Services", icon: Wrench },
    { to: "/home-rent", label: "Rentals", icon: Building },
    { to: "/lostfound", label: "Lost & Found", icon: Search },
  ];

  if (role === "admin" || currentUser?.role === "admin") {
    navItems.push({ to: "/admin", label: "Admin", icon: ShieldCheck });
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/feed?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const getUserInitials = () => {
    const name = currentUser?.name || currentUser?.email || "User";
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between h-14 sm:h-16 gap-2">
        
        {/* Left Section: Logo & Search Bar */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-xs sm:max-w-sm">
          <Link to="/feed" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
              <img src={logo} alt="Logo" className="w-7 h-7 object-contain rounded-lg" onError={(e) => e.target.style.display = 'none'} />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 bg-clip-text text-transparent hidden sm:inline-block tracking-tight">
              JibonJatra
            </span>
          </Link>

          {/* Facebook-style Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search JibonJatra..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-gray-100 border border-transparent rounded-full text-sm focus:bg-white focus:border-blue-500 focus:outline-none transition-all duration-200"
            />
          </form>
        </div>

        {/* Center Section: Facebook Icon Tabs */}
        <nav className="hidden lg:flex items-center justify-center gap-1 sm:gap-2 flex-1 max-w-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || (item.to !== "/feed" && location.pathname.startsWith(item.to));

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
                title={item.label}
              >
                <Icon size={22} className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-blue-600 stroke-[2.5]" : ""}`} />
                <span className="text-[11px] font-medium mt-0.5">{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-1 bg-blue-600 rounded-t-full shadow-xs" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Section: Quick Action + Notifications + User Avatar Menu */}
        <div className="flex items-center justify-end gap-2">
          {/* Quick Create Button */}
          <Link
            to="/create-post"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-xs sm:text-sm transition-all duration-200 border border-blue-100"
          >
            <PlusCircle size={16} />
            <span>Create</span>
          </Link>

          {/* Notification Icon */}
          <button
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors duration-200 relative"
            title="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>

          {/* User Profile Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs border border-white">
                {getUserInitials()}
              </div>
              <span className="hidden xl:inline-block text-xs font-semibold text-gray-700 max-w-[90px] truncate">
                {currentUser?.name || "Profile"}
              </span>
              <ChevronDown size={14} className="text-gray-500 hidden xl:inline-block" />
            </button>

            {/* Profile Menu Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {currentUser?.name || "Community Member"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
                  {currentUser?.role && (
                    <span className="inline-block mt-1.5 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {currentUser.role}
                    </span>
                  )}
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <User size={16} className="text-gray-400" />
                    <span>Your Profile</span>
                  </Link>

                  {(role === "admin" || currentUser?.role === "admin") && (
                    <Link
                      to="/admin"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <ShieldCheck size={16} className="text-indigo-500" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-1">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 font-medium"
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search JibonJatra..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border border-transparent rounded-full text-sm"
            />
          </form>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between items-center">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <User size={18} />
              <span>View Profile</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;