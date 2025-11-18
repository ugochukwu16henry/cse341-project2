const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");
const { validateBook, validateObjectId } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/is-authenticated");

// GET all books (Public - NO isAuthenticated middleware)
router.get("/", booksController.getAllBooks);

// GET single book by ID (Public - NO isAuthenticated middleware)
router.get("/:id", validateObjectId, booksController.getBookById);

// POST create new book (Protected - HAS isAuthenticated)
router.post("/", isAuthenticated, validateBook, booksController.createBook);

// PUT update book (Protected - HAS isAuthenticated)
router.put(
  "/:id",
  isAuthenticated,
  validateObjectId,
  validateBook,
  booksController.updateBook
);

// DELETE book (Protected - HAS isAuthenticated)
router.delete(
  "/:id",
  isAuthenticated,
  validateObjectId,
  booksController.deleteBook
);

module.exports = router;
