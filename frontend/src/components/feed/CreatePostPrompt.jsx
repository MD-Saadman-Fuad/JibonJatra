import React from 'react';
import { Link } from 'react-router-dom';
import { Image, Store, Home, Wrench, Sparkles } from 'lucide-react';

export default function CreatePostPrompt() {
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  const userName = user?.name?.split(' ')[0] || 'Community Member';
  const userInitials = (user?.name || user?.email || 'User').slice(0, 2).toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs mb-4 space-y-3">
      {/* Top Input Bar Prompt */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 border border-white shadow-xs">
          {userInitials}
        </div>

        <Link
          to="/create-post"
          className="flex-1 bg-gray-100 hover:bg-gray-200/80 transition-colors duration-200 rounded-full px-4 py-2.5 text-sm text-gray-500 flex items-center justify-between cursor-pointer"
        >
          <span>What's on your mind, {userName}?</span>
          <Sparkles size={16} className="text-blue-500" />
        </Link>
      </div>

      {/* Action Shortcut Pills */}
      <div className="flex items-center justify-between gap-1 pt-2 border-t border-gray-50 overflow-x-auto no-scrollbar text-xs font-semibold">
        <Link
          to="/create-post"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors flex-shrink-0"
        >
          <Image size={16} className="text-emerald-500" />
          <span>Photo / Post</span>
        </Link>

        <Link
          to="/market/create"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors flex-shrink-0"
        >
          <Store size={16} className="text-blue-500" />
          <span>Sell Item</span>
        </Link>

        <Link
          to="/home-rent/create"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors flex-shrink-0"
        >
          <Home size={16} className="text-purple-500" />
          <span>List Rental</span>
        </Link>

        <Link
          to="/services/create"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors flex-shrink-0"
        >
          <Wrench size={16} className="text-amber-500" />
          <span>Service</span>
        </Link>
      </div>
    </div>
  );
}
