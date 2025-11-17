const { ObjectId } = require("mongodb");
const { getDB } = require("../db/connection");
const { validationResult } = require("express-validator");

// GET all books
const getAllBooks = async (req, res) => {
  try {
    const db = getDB();
    const books = await db.collection("books").find().toArray();
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch books", message: error.message });
  }
};

// GET single book by ID
const getBookById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = getDB();
    const book = await db
      .collection("books")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch book", message: error.message });
  }
};

// POST create new book
const createBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = getDB();
    const newBook = {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      publishedYear: req.body.publishedYear,
      genre: req.body.genre,
      pages: req.body.pages,
      language: req.body.language,
      available: req.body.available !== undefined ? req.body.available : true,
      createdAt: new Date(),
    };

    const result = await db.collection("books").insertOne(newBook);

    if (result.acknowledged) {
      const createdBook = await db
        .collection("books")
        .findOne({ _id: result.insertedId });
      res.status(201).json(createdBook);
    } else {
      throw new Error("Failed to create book");
    }
  } catch (error) {
    console.error("Error creating book:", error);
    res
      .status(500)
      .json({ error: "Failed to create book", message: error.message });
  }
};

// PUT update book
const updateBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = getDB();
    const updateData = {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      publishedYear: req.body.publishedYear,
      genre: req.body.genre,
      pages: req.body.pages,
      language: req.body.language,
      available: req.body.available,
      updatedAt: new Date(),
    };

    const result = await db
      .collection("books")
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: updateData },
        { returnDocument: "after" }
      );

    if (!result) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating book:", error);
    res
      .status(500)
      .json({ error: "Failed to update book", message: error.message });
  }
};

// DELETE book
const deleteBook = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = getDB();
    const result = await db
      .collection("books")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res
      .status(200)
      .json({
        message: "Book deleted successfully",
        deletedCount: result.deletedCount,
      });
  } catch (error) {
    console.error("Error deleting book:", error);
    res
      .status(500)
      .json({ error: "Failed to delete book", message: error.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
