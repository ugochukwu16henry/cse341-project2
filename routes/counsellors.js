const express = require("express");
const router = express.Router();
const {
  getAllReviews,
  getReviewsByGameId,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} = require("../config/oauth");
const { validateReview, validateObjectId } = require("../middleware/auth");

// GET all reviews
router.get("/", getAllReviews);

// GET reviews by game ID
router.get("/game/:gameId", validateObjectId, getReviewsByGameId);

// GET single review by ID
router.get("/:id", validateObjectId, getReviewById);

// POST create new review
router.post("/", validateReview, createReview);

// PUT update review
router.put("/:id", validateObjectId, validateReview, updateReview);

// DELETE review
router.delete("/:id", validateObjectId, deleteReview);

module.exports = router;
