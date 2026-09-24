import React, { useState } from 'react';
import { getImageUrl } from '../../api/client';
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Home,
  MoreHorizontal
} from 'lucide-react';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 8) + 1);

  const authorName = post.user?.name || post.user?.email?.split('@')[0] || 'Community Resident';
  const authorRole = post.user?.role || 'Resident';
  const postDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recently';

  const getAuthorInitials = () => {
    return authorName.slice(0, 2).toUpperCase();
  };

  const handleLikeToggle = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden mb-4">
      {/* Header: Author Info & Category Badge */}
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs border border-white">
            {getAuthorInitials()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm hover:text-blue-600 transition-colors">
                {authorName}
              </h3>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full capitalize">
                {authorRole}
              </span>
            </div>
            <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
              <span>{postDate}</span>
              <span>•</span>
              <span className="capitalize text-gray-500">{post.category || 'General'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {post.category === 'home_rental' && (
            <span className="px-2.5 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full flex items-center gap-1 border border-purple-100">
              <Home size={12} />
              <span>Rental</span>
            </span>
          )}
          <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Body: Title & Content */}
      <div className="px-4 pb-3 space-y-2">
        <h2 className="text-lg font-bold text-gray-900 leading-snug">
          {post.title}
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
          {post.content}
        </p>

        {/* Extra Rental Details if Category is home_rental */}
        {post.category === 'home_rental' && (post.rent || post.status) && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {post.rent && (
              <span className="text-lg font-extrabold text-emerald-600 flex items-center gap-0.5">
                <span>৳</span>
                <span>{post.rent.toLocaleString()}</span>
                <span className="text-xs font-normal text-gray-500">/month</span>
              </span>
            )}
            {post.status && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                post.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {post.status}
              </span>
            )}
          </div>
        )}

        {/* Location Badge */}
        {post.location && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mt-1">
            <MapPin size={13} className="text-red-500" />
            <span>{post.location}</span>
          </div>
        )}
      </div>

      {/* Media Attachments */}
      {post.images && post.images.length > 0 && (
        <div className={`grid gap-1 px-4 mb-3 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {post.images.slice(0, 4).map((image, index) => (
            <img
              key={index}
              src={getImageUrl(image)}
              alt={`${post.title} attachment ${index + 1}`}
              className="w-full h-56 sm:h-64 object-cover rounded-xl border border-gray-100 hover:opacity-95 transition-opacity"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ))}
        </div>
      )}

      {/* Footer: Interaction Bar */}
      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500">
        <button
          onClick={handleLikeToggle}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-colors ${
            liked ? 'text-red-500 bg-red-50 font-bold' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <Heart size={16} className={liked ? 'fill-red-500 text-red-500' : ''} />
          <span>{likeCount} {liked ? 'Liked' : 'Like'}</span>
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 text-gray-600 font-medium transition-colors">
          <MessageCircle size={16} />
          <span>Comment</span>
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 text-gray-600 font-medium transition-colors">
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>
    </article>
  );
};

export default PostCard;