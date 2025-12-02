import React, { useState, useEffect, useCallback } from 'react';
import { sponsoredAPI } from '../../api/sponsored';
import { getImageUrl } from '../../api/client';
import { useNavigate } from 'react-router-dom';

const SponsoredCarousel = () => {
  const [sponsoredPosts, setSponsoredPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const goToNext = useCallback(() => {
    if (sponsoredPosts.length === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === sponsoredPosts.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsTransitioning(false), 300);
  }, [sponsoredPosts.length, isTransitioning]);

  const goToPrev = useCallback(() => {
    if (sponsoredPosts.length === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sponsoredPosts.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsTransitioning(false), 300);
  }, [sponsoredPosts.length, isTransitioning]);

  useEffect(() => {
    fetchSponsoredPosts();
  }, []);

  useEffect(() => {
    if (sponsoredPosts.length > 1) {
      const interval = setInterval(() => {
        goToNext();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [sponsoredPosts.length, currentIndex, goToNext]);

  const fetchSponsoredPosts = async () => {
    try {
      setLoading(true);
      const response = await sponsoredAPI.getSponsoredPosts();
      console.log('SponsoredCarousel - Posts:', response.data.data);
      setSponsoredPosts(response.data.data || []);
    } catch (err) {
      setError('Failed to load sponsored content');
      console.error('Error fetching sponsored posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3 h-40 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex items-center justify-center py-4">
          <div className="text-red-500 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (sponsoredPosts.length === 0) {
    return null;
  }

  const currentPost = sponsoredPosts[currentIndex];
  const imageUrl = getImageUrl(currentPost.image);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
            Sponsored
          </span>
          <span className="ml-2 text-xs text-gray-500">{currentIndex + 1} of {sponsoredPosts.length}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={goToPrev}
            className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow duration-200 text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={sponsoredPosts.length <= 1 || isTransitioning}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow duration-200 text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={sponsoredPosts.length <= 1 || isTransitioning}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className={`sponsored-card flex flex-col md:flex-row gap-6 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {imageUrl && (
            <div className="md:w-2/3">
              <div className="relative overflow-hidden rounded-xl shadow-md">
                <img
                  src={imageUrl}
                  alt={currentPost.title}
                  className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    console.error('SponsoredCarousel - Image failed to load:', imageUrl);
                    e.target.style.display = 'none';
                  }}
                  onLoad={(e) => {
                    console.log('SponsoredCarousel - Image loaded successfully:', imageUrl);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          )}
          <div className="flex-1 flex flex-col justify-center">
            <h4 className="font-bold text-gray-900 mb-2 text-lg">{currentPost.title}</h4>
            <p className="text-gray-600 mb-3 line-clamp-3 leading-relaxed">{currentPost.content}</p>
            <div className="mt-auto pt-2">
              <button onClick={() => navigate(`/sponsored-posts`)} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200 flex items-center">
                Learn more
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {sponsoredPosts.length > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          {sponsoredPosts.map((_, index) => (
            <button
              key={index}
              className={`w-8 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-indigo-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SponsoredCarousel;