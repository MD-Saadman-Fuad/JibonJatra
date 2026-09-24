import express from 'express';
import {
  createReview,
  getServiceReviews,
  updateReview,
  deleteReview,
  getUserReviewForService
} from '../controllers/reviewController.js';
import authMiddleware from '../middleware/auth.js'; // Import the default export

const router = express.Router();

// Public route to view service reviews
router.get('/service/:serviceId', getServiceReviews);

// Protected routes (require auth)
router.post('/', authMiddleware(), createReview);
router.get('/user-review/:serviceId', authMiddleware(), getUserReviewForService);
router.put('/:id', authMiddleware(), updateReview);
router.delete('/:id', authMiddleware(), deleteReview);

export default router;