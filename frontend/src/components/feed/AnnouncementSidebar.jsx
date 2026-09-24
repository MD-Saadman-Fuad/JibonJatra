import React from 'react';
import { getImageUrl } from '../../api/client';
import { Megaphone, Calendar, MapPin } from 'lucide-react';

const AnnouncementSidebar = ({ announcements }) => {
  if (!announcements || announcements.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <Megaphone size={16} className="text-blue-600" />
            <span>Notice Board</span>
          </div>
        </div>
        <p className="text-gray-400 text-xs py-2">No official announcements right now.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Megaphone size={16} />
          </div>
          <span>Announcements</span>
        </div>
        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">
          {announcements.length} Active
        </span>
      </div>

      <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
        {announcements.map((item) => (
          <div
            key={item._id}
            className="p-3 bg-gradient-to-br from-blue-50/60 to-indigo-50/30 border border-blue-100/80 rounded-xl space-y-2 group hover:border-blue-200 transition-all"
          >
            <div className="flex items-start justify-between gap-1">
              <h4 className="font-bold text-gray-900 text-xs group-hover:text-blue-600 transition-colors">
                {item.title}
              </h4>
              {item.priority === 'high' && (
                <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-extrabold rounded-md flex-shrink-0">
                  URGENT
                </span>
              )}
            </div>

            <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
              {item.message}
            </p>

            {item.image && (
              <img
                src={getImageUrl(item.image)}
                alt={item.title}
                className="w-full h-28 object-cover rounded-lg border border-blue-100"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}

            <div className="pt-1 flex items-center justify-between text-[11px] text-gray-400 border-t border-blue-100/40">
              {item.eventDate ? (
                <span className="flex items-center gap-1 text-blue-700 font-medium">
                  <Calendar size={12} />
                  <span>{new Date(item.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </span>
              ) : (
                <span>By {item.createdBy?.name || 'Admin'}</span>
              )}
              {item.location && (
                <span className="flex items-center gap-1 text-gray-500">
                  <MapPin size={11} className="text-red-400" />
                  <span className="truncate max-w-[90px]">{item.location}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementSidebar;