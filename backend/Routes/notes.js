const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController");

// Create a note
router.post("/", noteController.createNote);

// Get notes by student ID
router.get("/student/:studentId", noteController.getNotesByStudentId);

// Get notes for a student related to a subject
router.get("/subject/:subjectId", noteController.getNotesBySubject);

// Update a note
router.put("/:id", noteController.updateNote);

// Delete a note
router.delete("/:id", noteController.deleteNote);

module.exports = router;
