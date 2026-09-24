import React from 'react';
import { getImageUrl } from '../../api/client';
import { Search, MapPin, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';

const ItemCard = ({ item }) => {
  const isLost = item.type === 'lost';
  const authorName = item.user?.name || item.user?.email?.split('@')[0] || 'Resident';
  const postDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recently';

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden mb-4">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
            isLost ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
            <Search size={18} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs">{authorName}</h4>
            <p className="text-[11px] text-gray-400">Notice • {postDate}</p>
          </div>
        </div>

        <span className={`px-3 py-1 text-xs font-extrabold rounded-full tracking-wider flex items-center gap-1 ${
          isLost ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
        }`}>
          {isLost ? <AlertCircle size={12} /> : <CheckCircle2 size={12} />}
          <span>{isLost ? 'LOST ITEM' : 'FOUND ITEM'}</span>
        </span>
      </div>

      {/* Media Image */}
      {item.image && (
        <img
          src={getImageUrl(item.image)}
          alt={item.title}
          className="w-full h-56 sm:h-64 object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}

      {/* Content Body */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.title}</h3>
        <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-50 text-xs">
          {item.location && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <MapPin size={14} className="text-red-500" />
              <span>{item.location}</span>
            </div>
          )}
          {item.contact && (
            <div className="flex items-center gap-1.5 text-gray-700 font-semibold bg-gray-100 px-2.5 py-1 rounded-full">
              <Phone size={13} className="text-blue-500" />
              <span>{item.contact}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ItemCard;