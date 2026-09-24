import React from 'react';
import { getImageUrl } from '../../api/client';
import { Wrench, MapPin, Phone, Star } from 'lucide-react';

const ServiceCard = ({ service }) => {
  const authorName = service.createdBy?.name || service.createdBy?.email?.split('@')[0] || service.providerName || 'Service Provider';
  const postDate = service.createdAt ? new Date(service.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recently';

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden mb-4">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
            <Wrench size={18} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs">{service.providerName || authorName}</h4>
            <p className="text-[11px] text-gray-400">Professional Service • {postDate}</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-[11px] font-bold rounded-full uppercase tracking-wider">
          Service Listing
        </span>
      </div>

      {/* Picture */}
      {service.servicePicture && (
        <div className="relative">
          <img
            src={getImageUrl(service.servicePicture)}
            alt={service.serviceName}
            className="w-full h-56 sm:h-64 object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full font-extrabold text-sm shadow-md">
            ৳{service.servicePrice?.toLocaleString()}
          </div>
        </div>
      )}

      {/* Service Details */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{service.serviceName}</h3>
          {!service.servicePicture && (
            <span className="text-xl font-extrabold text-amber-600">
              ৳{service.servicePrice?.toLocaleString()}
            </span>
          )}
        </div>

        {service.serviceDetail && (
          <p className="text-gray-600 text-sm leading-relaxed">{service.serviceDetail}</p>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100">
          <div className="flex items-center gap-1.5 text-gray-600">
            <MapPin size={14} className="text-red-500 flex-shrink-0" />
            <span className="truncate">{service.location || 'Local Provider'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Phone size={14} className="text-blue-500 flex-shrink-0" />
            <span className="truncate">{service.providerContact || 'Contact for Quote'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            <span>{service.ratingAverage ? Number(service.ratingAverage).toFixed(1) : '5.0'}</span>
            <span className="text-gray-400 font-normal">({service.ratingCount || 1} reviews)</span>
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors shadow-xs text-xs">
            <Phone size={13} />
            <span>Call Service</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;