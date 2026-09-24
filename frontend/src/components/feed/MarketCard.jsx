import React from 'react';
import { getImageUrl } from '../../api/client';
import { ShoppingBag, MapPin, Tag } from 'lucide-react';

const MarketCard = ({ item }) => {
  const authorName = item.createdBy?.name || item.createdBy?.email?.split('@')[0] || 'Market Head';
  const postDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recently';

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden mb-4">
      {/* Category Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
            <ShoppingBag size={18} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs">{authorName}</h4>
            <p className="text-[11px] text-gray-400">Market Price Update • {postDate}</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full uppercase tracking-wider">
          Market Item
        </span>
      </div>

      {/* Main Image */}
      {item.image && (
        <div className="relative">
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            className="w-full h-56 sm:h-64 object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full font-extrabold text-sm shadow-md">
            ৳{item.price?.toLocaleString()}
          </div>
        </div>
      )}

      {/* Body Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.name}</h3>
          {!item.image && (
            <span className="text-xl font-extrabold text-emerald-600">
              ৳{item.price?.toLocaleString()}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-600">
            <MapPin size={14} className="text-red-500 flex-shrink-0" />
            <span className="truncate">{item.location || 'Local Market'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Tag size={14} className="text-blue-500 flex-shrink-0" />
            <span className="truncate">Source: {item.source || 'Verified Vendor'}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default MarketCard;