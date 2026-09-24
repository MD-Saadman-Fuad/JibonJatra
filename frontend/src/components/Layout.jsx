import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-900 font-sans antialiased selection:bg-blue-500 selection:text-white">
      <Navbar role={user?.role} onLogout={onLogout} user={user} />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}
