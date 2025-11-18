const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");
const { validateBook, validateObjectId } = require("../middleware/validation");
const { isAuthenticated } = require("../middleware/is-authenticated"); // <--- NEW

// GET all books (Public/Unprotected)
router.get("/", booksController.getAllBooks);

// GET single book by ID (Public/Unprotected)
router.get("/:id", validateObjectId, booksController.getBookById);

// POST create new book (Protected)
router.post("/", isAuthenticated, validateBook, booksController.createBook); // <--- PROTECTED

// PUT update book (Protected)
router.put(
  "/:id",
  isAuthenticated,
  validateObjectId,
  validateBook,
  booksController.updateBook
); // <--- PROTECTED

// DELETE book (Protected)
router.delete(
  "/:id",
  isAuthenticated,
  validateObjectId,
  booksController.deleteBook
); // <--- PROTECTED

module.exports = router;
