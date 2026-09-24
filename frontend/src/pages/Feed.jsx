import React, { useState, useEffect } from 'react';
import { feedAPI } from '../api/feed';
import PostCard from '../components/feed/PostCard';
import MarketCard from '../components/feed/MarketCard';
import ProductCard from '../components/feed/ProductCard';
import ItemCard from '../components/feed/ItemCard';
import ServiceCard from '../components/feed/ServiceCard';
import AnnouncementSidebar from '../components/feed/AnnouncementSidebar';
import FilterTabs from '../components/feed/FilterTabs';
import SponsoredCarousel from '../components/feed/SponsoredCarousel';
import CreatePostPrompt from '../components/feed/CreatePostPrompt';
import Sidebar from '../components/Sidebar';
import { Sparkles, Loader2 } from 'lucide-react';

const Feed = () => {
  const [feed, setFeed] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchFeed = async (filter = 'all', pageNum = 1, shouldAppend = false) => {
    try {
      setLoading(true);
      const response = filter === 'all' 
        ? await feedAPI.getFeed(pageNum)
        : await feedAPI.getFilteredFeed(filter, pageNum);

      if (response.data?.success) {
        const feedData = response.data.feed || [];
        if (shouldAppend) {
          setFeed(prev => [...prev, ...feedData]);
        } else {
          setFeed(feedData);
        }
        setAnnouncements(response.data.announcements || []);
        setHasMore(response.data.pagination?.hasNext || false);
        setError('');
      }
    } catch (err) {
      setError('Failed to load community feed. Please refresh or try again.');
      console.error('Feed error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(activeFilter, 1, false);
  }, [activeFilter]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeed(activeFilter, nextPage, true);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const renderContent = (item) => {
    switch (item.contentType) {
      case 'posts':
        return <PostCard key={`post-${item._id}`} post={item} />;
      case 'market':
        return <MarketCard key={`market-${item._id}`} item={item} />;
      case 'products':
        return <ProductCard key={`product-${item._id}`} product={item} />;
      case 'lost-found':
        return <ItemCard key={`item-${item._id}`} item={item} />;
      case 'services':
        return <ServiceCard key={`service-${item._id}`} service={item} />;
      default:
        return <PostCard key={`generic-${item._id}`} post={item} />;
    }
  };

  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Navigation Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-20">
            <Sidebar />
          </div>

          {/* Center Column: Feed Timeline */}
          <div className="lg:col-span-6 space-y-4">
            {/* Create Post Prompt Box */}
            <CreatePostPrompt />

            {/* Filter Tabs Navigation */}
            <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-2xs">
              <FilterTabs 
                activeFilter={activeFilter} 
                onFilterChange={handleFilterChange} 
              />
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl p-4 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Feed Cards Stream */}
            <div className="space-y-4">
              {feed.length === 0 && !loading ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center space-y-3 shadow-2xs">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 mx-auto flex items-center justify-center">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">No posts found in this category</h3>
                  <p className="text-gray-500 text-xs max-w-sm mx-auto">
                    Be the first in your community to post an update, list a product, or offer a service!
                  </p>
                </div>
              ) : (
                feed.map(renderContent)
              )}
            </div>

            {/* Loading Spinner Skeleton */}
            {loading && (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin text-blue-600" size={28} />
              </div>
            )}

            {/* Load More Button */}
            {hasMore && !loading && (
              <div className="pt-2 text-center">
                <button
                  onClick={handleLoadMore}
                  className="bg-white hover:bg-gray-50 text-blue-600 font-bold px-6 py-2.5 rounded-full text-xs border border-gray-200 shadow-2xs transition-all active:scale-95"
                >
                  Load More Updates
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Noticeboard & Sponsored Posts */}
          <div className="hidden lg:block lg:col-span-3 sticky top-20 space-y-4">
            <AnnouncementSidebar announcements={announcements} />
            <SponsoredCarousel />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Feed;