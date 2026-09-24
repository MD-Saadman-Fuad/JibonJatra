import React, { useState, useEffect, useCallback } from 'react';
import { sponsoredAPI } from '../../api/sponsored';
import { getImageUrl } from '../../api/client';
import { Sparkles, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SponsoredCarousel = () => {
  const [sponsoredPosts, setSponsoredPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const goToNext = useCallback(() => {
    if (sponsoredPosts.length === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === sponsoredPosts.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 250);
  }, [sponsoredPosts.length, isTransitioning]);

  const goToPrev = useCallback(() => {
    if (sponsoredPosts.length === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? sponsoredPosts.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 250);
  }, [sponsoredPosts.length, isTransitioning]);

  useEffect(() => {
    fetchSponsoredPosts();
  }, []);

  useEffect(() => {
    if (sponsoredPosts.length > 1) {
      const timer = setInterval(() => {
        goToNext();
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [sponsoredPosts.length, currentIndex, goToNext]);

  const fetchSponsoredPosts = async () => {
    try {
      setLoading(true);
      const res = await sponsoredAPI.getSponsoredPosts();
      setSponsoredPosts(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching sponsored posts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || sponsoredPosts.length === 0) {
    return null;
  }

  const current = sponsoredPosts[currentIndex];
  const imageUrl = getImageUrl(current.image);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider">
          <Sparkles size={14} className="text-amber-500 fill-amber-400" />
          <span>Featured Sponsor</span>
        </div>
        
        {sponsoredPosts.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={goToPrev}
              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={goToNext}
              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      <div className={`space-y-2.5 transition-opacity duration-250 ${isTransitioning ? 'opacity-20' : 'opacity-100'}`}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={current.title}
            className="w-full h-36 object-cover rounded-xl border border-gray-100"
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
        <h4 className="font-bold text-gray-900 text-xs leading-snug">{current.title}</h4>
        <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">{current.content}</p>

        <button
          onClick={() => navigate('/sponsored-posts')}
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors pt-1"
        >
          <span>View Promotion</span>
          <ExternalLink size={12} />
        </button>
      </div>
    </div>
  );
};

export default SponsoredCarousel;