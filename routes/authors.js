const express = require("express");
const router = express.Router();
const authorsController = require("../controllers/authorsController");
const {
  validateAuthor,
  validateObjectId,
} = require("../middleware/validation");

// GET all authors
router.get("/", authorsController.getAllAuthors);

// GET single author by ID
router.get("/:id", validateObjectId, authorsController.getAuthorById);

// POST create new author
router.post("/", validateAuthor, authorsController.createAuthor);

// PUT update author
router.put(
  "/:id",
  validateObjectId,
  validateAuthor,
  authorsController.updateAuthor
);

// DELETE author
router.delete("/:id", validateObjectId, authorsController.deleteAuthor);

module.exports = router;
