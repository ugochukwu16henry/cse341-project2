const { ObjectId } = require("mongodb");
const { getDB } = require("../db/connect");

// GET all games
const getAllGames = async (req, res) => {
  try {
    const db = getDB();
    const games = await db
      .collection("games")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: games.length,
      data: games,
    });
  } catch (error) {
    console.error("Error fetching games:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching games",
      error: error.message,
    });
  }
};

// GET single game by ID
const getGameById = async (req, res) => {
  try {
    const db = getDB();
    const game = await db.collection("games").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    res.status(200).json({
      success: true,
      data: game,
    });
  } catch (error) {
    console.error("Error fetching game:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching game",
      error: error.message,
    });
  }
};

// POST create new game
const createGame = async (req, res) => {
  try {
    const db = getDB();
    const {
      title,
      genre,
      platform,
      releaseYear,
      publisher,
      rating,
      description,
    } = req.body;

    const newGame = {
      title: title.trim(),
      genre: genre.trim(),
      platform: platform.trim(),
      releaseYear: Number(releaseYear),
      publisher: publisher.trim(),
      rating: rating ? Number(rating) : 0,
      description: description ? description.trim() : "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("games").insertOne(newGame);

    res.status(201).json({
      success: true,
      message: "Game created successfully",
      data: {
        _id: result.insertedId,
        ...newGame,
      },
    });
  } catch (error) {
    console.error("Error creating game:", error);
    res.status(500).json({
      success: false,
      message: "Error creating game",
      error: error.message,
    });
  }
};

// PUT update game
const updateGame = async (req, res) => {
  try {
    const db = getDB();
    const {
      title,
      genre,
      platform,
      releaseYear,
      publisher,
      rating,
      description,
    } = req.body;

    const updateData = {
      title: title.trim(),
      genre: genre.trim(),
      platform: platform.trim(),
      releaseYear: Number(releaseYear),
      publisher: publisher.trim(),
      rating: rating ? Number(rating) : 0,
      description: description ? description.trim() : "",
      updatedAt: new Date(),
    };

    const result = await db
      .collection("games")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Game updated successfully",
      data: updateData,
    });
  } catch (error) {
    console.error("Error updating game:", error);
    res.status(500).json({
      success: false,
      message: "Error updating game",
      error: error.message,
    });
  }
};

// DELETE game
const deleteGame = async (req, res) => {
  try {
    const db = getDB();

    // Delete the game
    const result = await db.collection("games").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    // Also delete all reviews for this game
    await db.collection("reviews").deleteMany({
      gameId: req.params.id,
    });

    res.status(200).json({
      success: true,
      message: "Game and associated reviews deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting game",
      error: error.message,
    });
  }
};

module.exports = {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
};
