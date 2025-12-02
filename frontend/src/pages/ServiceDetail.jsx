import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchService, getUserReviewForService, getServiceReviews } from '../api/services';
import { getBackendUrl } from '../api/client';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import Rating from '../components/Rating';

const ServiceDetail = ({ token, user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshReviews, setRefreshReviews] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const calculateRatingDistribution = (reviews) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating]++;
      }
    });
    return distribution;
  };

  //   const fetchServiceData = useCallback(async () => {
  //     setIsLoading(true);
  //     setError('');

  //     try {
  //       const [serviceResponse, reviewResponse] = await Promise.all([
  //         fetchService(id),
  //         token ? getUserReviewForService(id, token).catch(() => ({ data: { review: null } })) : { data: { review: null } }
  //       ]);

  //       setService(serviceResponse.data);
  //       setUserReview(reviewResponse.data.review);
  //     } catch (err) {
  //       setError('Failed to load service details');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }, [id, token]);
  const fetchServiceData = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const [serviceResponse, reviewResponse] = await Promise.all([
        fetchService(id),
        token ? getUserReviewForService(id, token).catch(() => ({ data: { review: null } })) : { data: { review: null } }
      ]);

      setService(serviceResponse.data);
      setUserReview(reviewResponse.data.review);

      // ADD THIS: FETCH ALL REVIEWS TO CALCULATE DISTRIBUTION
      if (serviceResponse.data.ratingCount > 0) {
        try {
          const reviewsResponse = await getServiceReviews(id, 1, 100); // Get first 100 reviews
          const distribution = calculateRatingDistribution(reviewsResponse.data.reviews);
          setRatingDistribution(distribution);
        } catch (err) {
          console.error('Error fetching reviews for distribution:', err);
          // If error, set default distribution
          setRatingDistribution({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
        }
      } else {
        setRatingDistribution({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
      }
    } catch (err) {
      setError('Failed to load service details');
    } finally {
      setIsLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchServiceData();
  }, [fetchServiceData]);

  //   const handleReviewSubmitted = () => {
  //     setRefreshReviews(prev => prev + 1);
  //     fetchServiceData(); // Refresh to get updated user review
  //   };

  //   const handleReviewDeleted = () => {
  //     setRefreshReviews(prev => prev + 1);
  //     setUserReview(null); // Clear user review
  //   };
  const handleReviewSubmitted = () => {
    setRefreshReviews(prev => prev + 1);
    fetchServiceData(); // This will also refresh the distribution
  };

  const handleReviewDeleted = () => {
    setRefreshReviews(prev => prev + 1);
    setUserReview(null);
    fetchServiceData(); // This will also refresh the distribution
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
          <button
            onClick={() => navigate('/services')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const isServiceProvider = user && service.provider && (user.id === service.provider._id || user.id === service.provider);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/services')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Services
        </button>

        {/* Service Details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={service.servicePicture ? `${getBackendUrl()}${service.servicePicture}` : "/logo.png"}
              alt={service.serviceName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{service.serviceName}</h1>
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                {service.serviceType}
              </span>
            </div>

            <p className="text-gray-600 mb-6">{service.serviceDetail}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-lg text-blue-700">${service.servicePrice}</span>
                </div>

                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-600">{service.location}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-600">{service.providerName}</span>
                </div>

                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-600">{service.providerContact}</span>
                </div>
              </div>
            </div>

            {/* Rating Summary
            <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center mr-6">
                <div className="text-3xl font-bold text-gray-900">{service.ratingAverage || 0}</div>
                <Rating rating={service.ratingAverage || 0} size={16} />
                <div className="text-sm text-gray-600 mt-1">
                  {service.ratingCount || 0} {service.ratingCount === 1 ? 'review' : 'reviews'}
                </div>
              </div>
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center mb-1">
                    <span className="text-sm text-gray-600 w-8">{star}</span>
                    <div className="flex-1 bg-gray-200 rounded h-2 mx-2">
                      <div
                        className="bg-yellow-400 h-2 rounded"
                        style={{ width: '0%' }} // You would need backend support for this
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
            {/* Rating Summary */}
            <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center mr-6">
                <div className="text-3xl font-bold text-gray-900">{service.ratingAverage || 0}</div>
                <Rating rating={service.ratingAverage || 0} size={16} />
                <div className="text-sm text-gray-600 mt-1">
                  {service.ratingCount || 0} {service.ratingCount === 1 ? 'review' : 'reviews'}
                </div>
              </div>
              <div className="flex-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const percentage = service.ratingCount > 0
                    ? (ratingDistribution[star] / service.ratingCount) * 100
                    : 0;

                  return (
                    <div key={star} className="flex items-center mb-1">
                      <span className="text-sm text-gray-600 w-8">{star}</span>
                      <div className="flex-1 bg-gray-200 rounded h-2 mx-2">
                        <div
                          className="bg-yellow-400 h-2 rounded transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-8">
                        ({ratingDistribution[star]})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Review Form (only for authenticated users who are not the provider) */}
        {token && user && !isServiceProvider && (
          <ReviewForm
            serviceId={id}
            existingReview={userReview}
            onReviewSubmitted={handleReviewSubmitted}
            token={token}
          />
        )}

        {/* Review List */}
        <ReviewList
          serviceId={id}
          token={token}
          user={user}
          onReviewDeleted={handleReviewDeleted}
          key={refreshReviews}
        />
      </div>
    </div>
  );
};

export default ServiceDetail;