const { ObjectId } = require("mongodb");
const { getDB } = require("../db/connection");
const { validationResult } = require("express-validator");

// GET all authors
const getAllAuthors = async (req, res) => {
  try {
    const db = getDB();
    const authors = await db.collection("authors").find().toArray();
    res.status(200).json(authors);
  } catch (error) {
    console.error("Error fetching authors:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch authors", message: error.message });
  }
};

// GET single author by ID
const getAuthorById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = getDB();
    const author = await db
      .collection("authors")
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    res.status(200).json(author);
  } catch (error) {
    console.error("Error fetching author:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch author", message: error.message });
  }
};

// POST create new author
const createAuthor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = getDB();
    const newAuthor = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthYear: req.body.birthYear,
      nationality: req.body.nationality,
      biography: req.body.biography,
      createdAt: new Date(),
    };

    const result = await db.collection("authors").insertOne(newAuthor);

    if (result.acknowledged) {
      const createdAuthor = await db
        .collection("authors")
        .findOne({ _id: result.insertedId });
      res.status(201).json(createdAuthor);
    } else {
      throw new Error("Failed to create author");
    }
  } catch (error) {
    console.error("Error creating author:", error);
    res
      .status(500)
      .json({ error: "Failed to create author", message: error.message });
  }
};

// PUT update author
const updateAuthor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = getDB();
    const updateData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      birthYear: req.body.birthYear,
      nationality: req.body.nationality,
      biography: req.body.biography,
      updatedAt: new Date(),
    };

    const result = await db
      .collection("authors")
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: updateData },
        { returnDocument: "after" }
      );

    if (!result) {
      return res.status(404).json({ error: "Author not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error updating author:", error);
    res
      .status(500)
      .json({ error: "Failed to update author", message: error.message });
  }
};

// DELETE author
const deleteAuthor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const db = getDB();
    const result = await db
      .collection("authors")
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Author not found" });
    }

    res
      .status(200)
      .json({
        message: "Author deleted successfully",
        deletedCount: result.deletedCount,
      });
  } catch (error) {
    console.error("Error deleting author:", error);
    res
      .status(500)
      .json({ error: "Failed to delete author", message: error.message });
  }
};

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};
