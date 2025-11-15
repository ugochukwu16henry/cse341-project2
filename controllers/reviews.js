const { ObjectId } = require("mongodb");
const { getDB } = require("../db/connect");

// GET all reviews
const getAllReviews = async (req, res) => {
  try {
    const db = getDB();
    const reviews = await db
      .collection("reviews")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

// GET reviews by game ID
const getReviewsByGameId = async (req, res) => {
  try {
    const db = getDB();
    const reviews = await db
      .collection("reviews")
      .find({ gameId: req.params.gameId })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

// GET single review by ID
const getReviewById = async (req, res) => {
  try {
    const db = getDB();
    const review = await db.collection("reviews").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching review",
      error: error.message,
    });
  }
};

// POST create new review
const createReview = async (req, res) => {
  try {
    const db = getDB();
    const { gameId, reviewerName, rating, comment } = req.body;

    // Check if game exists
    const game = await db.collection("games").findOne({
      _id: new ObjectId(gameId),
    });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    const newReview = {
      gameId: gameId.trim(),
      reviewerName: reviewerName.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("reviews").insertOne(newReview);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: {
        _id: result.insertedId,
        ...newReview,
      },
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      message: "Error creating review",
      error: error.message,
    });
  }
};

// PUT update review
const updateReview = async (req, res) => {
  try {
    const db = getDB();
    const { gameId, reviewerName, rating, comment } = req.body;

    const updateData = {
      gameId: gameId.trim(),
      reviewerName: reviewerName.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("reviews")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updateData,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      message: "Error updating review",
      error: error.message,
    });
  }
};

// DELETE review
const deleteReview = async (req, res) => {
  try {
    const db = getDB();

    const result = await db.collection("reviews").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
};

module.exports = {
  getAllReviews,
  getReviewsByGameId,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
