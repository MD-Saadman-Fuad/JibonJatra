// Navbar.jsx
import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = ({ role, onLogout }) => {
  const [open, setOpen] = useState(false);

  // Base links for all users
  const BASE_LINKS = [
    
    
    { to: "/feed", label: "Feed" },
    { to: "/posts", label: "Posts" },
    { to: "/market", label: "Market" },
    // { to: "/shop", label: "Shop" },
    { to: "/services", label: "Service" },
    { to: "/lostfound", label: "Lost & Found" },
    { to: "/home-rent", label: "Home Rent" },
    { to: "/profile", label: "Profile" },
    // { to: "/announcements", label: "Announcements" },
    // { to: "/sponsored-posts", label: "Sponsored Posts" },
  ];
  
  const SHARED_LINKS = [
    { to: "/posts", label: "Posts" },
    { to: "/profile", label: "Profile" },
    { to: "/feed", label: "Feed" },
    { to: "/market", label: "Market" },
    // { to: "/shop", label: "Shop" },
    { to: "/services", label: "Service" },
    { to: "/lostfound", label: "Lost & Found" },
    { to: "/home-rent", label: "Home Rent" },
  ];

  // Extra links for admins
  const ADMIN_LINKS = [
    { to: "/admin", label: "Dashboard" },

  ];

  // Combine base links with admin links if role is admin
  const links = role === "admin" ? [...SHARED_LINKS, ...ADMIN_LINKS] : BASE_LINKS;

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        
        {/* Logo + Brand Name */}
        <Link to="/posts" className="flex items-center gap-2">
          <img src={logo} alt="App Logo" className="h-10 w-10 rounded-lg object-cover" />
          <span className="text-xl font-bold">JibonJatra</span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-2 py-1 rounded hover:bg-gray-800 transition-colors duration-200 ${
                  isActive ? "bg-gray-800" : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* Logout button */}
          <button
            onClick={onLogout}
            className="px-3 py-1 rounded hover:bg-red-600 transition-colors duration-200 bg-red-500"
          >
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded hover:bg-gray-800"
          onClick={() => setOpen(!open)}
          type="button"
        >
          ☰
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-1">
          {links.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded hover:bg-gray-800 transition-colors duration-200 ${
                  isActive ? "bg-gray-800" : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {/* Mobile logout button */}
          <button
            onClick={onLogout}
            className="w-full text-left px-3 py-2 rounded hover:bg-red-600 transition-colors duration-200 bg-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;