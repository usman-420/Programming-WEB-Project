const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);
router.get('/trainer/:trainerId', reviewController.getTrainerReviews);
router.get('/trainer/:trainerId/rating', reviewController.getTrainerRating);

// Only members can create reviews
router.post('/', reviewController.createReview);

// Users can update/delete their own reviews
router.put('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
