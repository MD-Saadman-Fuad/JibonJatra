import React, { useState, useEffect } from 'react';
import { sponsoredAPI } from '../api/sponsored';
import { getImageUrl } from '../api/client';
import { Star, Calendar, Eye } from 'lucide-react';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const SponsoredPostCard = ({ post, isInactive = false }) => {
  // Debug: log image info
  useEffect(() => {
    if (post.image) {
      console.log('Sponsored post image:', {
        storedPath: post.image,
        imageUrl: getImageUrl(post.image),
        postTitle: post.title
      });
    }
  }, [post.image, post.title]);

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${isInactive ? 'opacity-60' : 'border-2 border-yellow-300'
      }`}>
      {post.image && (
        <img
          src={getImageUrl(post.image)}
          alt={post.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            console.error('Image failed to load:', e.target.src);
            e.target.style.display = 'none';
          }}
        />
      )}

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Star className="text-yellow-500" size={20} fill="currentColor" />
          <span className="text-yellow-700 font-semibold text-sm">Sponsored</span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
        <p className="text-gray-700 mb-4">{post.content}</p>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>Ends: {formatDate(post.endDate)}</span>
          </div>
        </div>

        {isInactive && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            <p className="text-red-700 text-sm">This sponsorship has ended</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function SponsoredPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await sponsoredAPI.getSponsoredPosts();
      setPosts(res.data.data || []);

      // Debug: log all posts with image info
      if (res.data.data && res.data.data.length > 0) {
        console.log('All sponsored posts:', res.data.data.map(post => ({
          title: post.title,
          image: post.image,
          imageUrl: post.image ? getImageUrl(post.image) : 'No image'
        })));
      }
    } catch (err) {
      setError('Failed to load sponsored posts. Please try again.');
      console.error('Failed to load sponsored posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const isActive = (post) => {
    return new Date(post.endDate) >= new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading sponsored posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const activePosts = posts.filter(isActive);
  const inactivePosts = posts.filter(post => !isActive(post));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
            <Star className="text-white" size={32} fill="currentColor" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sponsored Posts</h1>
          <p className="text-gray-600">Featured content from our community partners</p>
        </div>

        {activePosts.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Active Sponsorships</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activePosts.map((post) => (
                <SponsoredPostCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center mb-8">
            <Eye className="mx-auto text-yellow-500 mb-2" size={24} />
            <p className="text-yellow-700">No active sponsored posts at the moment</p>
          </div>
        )}

        {inactivePosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Past Sponsorships</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-70">
              {inactivePosts.map((post) => (
                <SponsoredPostCard key={post._id} post={post} isInactive={true} />
              ))}
            </div>
          </div>
        )}

        {posts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Star className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Sponsored Posts</h3>
            <p className="text-gray-500">Check back later for featured content</p>
          </div>
        )}

      </div>
    </div>
  );
}