const Review = require('../models/Review');

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();
    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// Get review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json(review);
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
};

// Get reviews by trainer ID
exports.getTrainerReviews = async (req, res) => {
  try {
    const reviews = await Review.findByTrainer(req.params.trainerId);
    res.json(reviews);
  } catch (error) {
    console.error('Get trainer reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch trainer reviews' });
  }
};

// Get trainer rating (average)
exports.getTrainerRating = async (req, res) => {
  try {
    const rating = await Review.getAverageRating(req.params.trainerId);
    res.json(rating);
  } catch (error) {
    console.error('Get trainer rating error:', error);
    res.status(500).json({ error: 'Failed to fetch trainer rating' });
  }
};

// Create review
exports.createReview = async (req, res) => {
  try {
    const { trainerId, workoutPlansId, rating, reviewText } = req.body;
    const clientId = req.user.userId;
    
    const reviewId = await Review.create({
      clientId,
      trainerId,
      workoutPlansId,
      rating,
      reviewText
    });
    
    const review = await Review.findById(reviewId);
    
    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    
    const updated = await Review.update(req.params.id, {
      rating,
      reviewText
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Review not found or no changes made' });
    }
    
    const review = await Review.findById(req.params.id);
    
    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const deleted = await Review.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
