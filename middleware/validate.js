const validator = require("validator");

// Validation for Game data
const validateGame = (req, res, next) => {
  const {
    title,
    genre,
    platform,
    releaseYear,
    publisher,
    rating,
    description,
  } = req.body;
  const errors = [];

  // Required fields validation
  if (!title || validator.isEmpty(title.trim())) {
    errors.push("Title is required");
  } else if (title.length > 200) {
    errors.push("Title must be less than 200 characters");
  }

  if (!genre || validator.isEmpty(genre.trim())) {
    errors.push("Genre is required");
  }

  if (!platform || validator.isEmpty(platform.trim())) {
    errors.push("Platform is required");
  }

  if (!releaseYear) {
    errors.push("Release year is required");
  } else if (
    !Number.isInteger(Number(releaseYear)) ||
    releaseYear < 1950 ||
    releaseYear > new Date().getFullYear() + 2
  ) {
    errors.push(
      `Release year must be between 1950 and ${new Date().getFullYear() + 2}`
    );
  }

  if (!publisher || validator.isEmpty(publisher.trim())) {
    errors.push("Publisher is required");
  }

  if (rating !== undefined) {
    if (typeof rating !== "number" || rating < 0 || rating > 10) {
      errors.push("Rating must be a number between 0 and 10");
    }
  }

  if (description && description.length > 1000) {
    errors.push("Description must be less than 1000 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors,
    });
  }

  next();
};

// Validation for Review data
const validateReview = (req, res, next) => {
  const { gameId, reviewerName, rating, comment } = req.body;
  const errors = [];

  if (!gameId || validator.isEmpty(gameId.trim())) {
    errors.push("Game ID is required");
  } else if (!validator.isHexadecimal(gameId) || gameId.length !== 24) {
    errors.push("Invalid Game ID format");
  }

  if (!reviewerName || validator.isEmpty(reviewerName.trim())) {
    errors.push("Reviewer name is required");
  } else if (reviewerName.length > 100) {
    errors.push("Reviewer name must be less than 100 characters");
  }

  if (rating === undefined || rating === null) {
    errors.push("Rating is required");
  } else if (typeof rating !== "number" || rating < 1 || rating > 5) {
    errors.push("Rating must be a number between 1 and 5");
  }

  if (!comment || validator.isEmpty(comment.trim())) {
    errors.push("Comment is required");
  } else if (comment.length < 10) {
    errors.push("Comment must be at least 10 characters");
  } else if (comment.length > 500) {
    errors.push("Comment must be less than 500 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors,
    });
  }

  next();
};

// Validation for MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!id || !validator.isHexadecimal(id) || id.length !== 24) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  next();
};

module.exports = {
  validateGame,
  validateReview,
  validateObjectId,
};
