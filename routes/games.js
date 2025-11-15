const express = require("express");
const router = express.Router();
const {
  getAllGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
} = require("../controllers/games");
const { validateGame, validateObjectId } = require("../middleware/validate");

// GET all games
router.get("/", getAllGames);

// GET single game by ID
router.get("/:id", validateObjectId, getGameById);

// POST create new game
router.post("/", validateGame, createGame);

// PUT update game
router.put("/:id", validateObjectId, validateGame, updateGame);

// DELETE game
router.delete("/:id", validateObjectId, deleteGame);

module.exports = router;
