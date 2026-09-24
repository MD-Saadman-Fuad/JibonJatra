import React from 'react';
import { getImageUrl } from '../api/client';

export default function ItemCard({ item, onDelete, currentUserId }) {
  const isLost = item.type === 'lost';

  return (
    <div className="bg-white p-4 rounded shadow flex gap-4 items-center">
      {item.image && (
        <img
          src={getImageUrl(item.image)}
          className="w-24 h-24 object-cover rounded"
          alt={item.title}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}
      <div className="flex-1">
        <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${isLost ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {item.type.toUpperCase()}
        </span>
        <p className="font-semibold text-gray-900 mt-1">{item.title}</p>
        <p className="text-sm text-gray-600">{item.description}</p>
        {item.location && <p className="text-xs text-gray-500 mt-1">📍 {item.location}</p>}
        {item.contact && <p className="text-xs text-gray-500">☎ {item.contact}</p>}
      </div>
      {currentUserId && currentUserId === (item.user?._id || item.user) && (
        <button
          onClick={() => onDelete?.(item._id)}
          className="text-red-600 text-sm hover:underline font-medium"
        >
          Delete
        </button>
      )}
    </div>
  );
}