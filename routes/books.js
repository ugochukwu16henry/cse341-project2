const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");
const { validateBook, validateObjectId } = require("../middleware/validation");

// GET all books
router.get("/", booksController.getAllBooks);

// GET single book by ID
router.get("/:id", validateObjectId, booksController.getBookById);

// POST create new book
router.post("/", validateBook, booksController.createBook);

// PUT update book
router.put("/:id", validateObjectId, validateBook, booksController.updateBook);

// DELETE book
router.delete("/:id", validateObjectId, booksController.deleteBook);

module.exports = router;
