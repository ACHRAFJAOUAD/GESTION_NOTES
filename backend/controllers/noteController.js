const Note = require("../models/noteModel");
const asyncHandler = require("express-async-handler");

// Create a note
exports.createNote = asyncHandler(async (req, res) => {
  const { studentId, subjectId, noteNumber, isSpecialNote, score, totalScore } =
    req.body;

  try {
    const newNote = await Note.create({
      studentId,
      subjectId,
      noteNumber,
      isSpecialNote,
      score,
      totalScore,
    });
    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get notes by student ID
exports.getNotesByStudentId = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  try {
    const notes = await Note.find({ studentId });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get notes for a student related to a subject
exports.getNotesBySubject = asyncHandler(async (req, res) => {
  try {
    const notes = await Note.find({
      studentId: req.params.studentId,
      subjectId: req.params.subjectId,
    });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update a note
exports.updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { score, totalScore } = req.body;

  try {
    const note = await Note.findByIdAndUpdate(
      id,
      { score, totalScore },
      { new: true }
    );
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a note
exports.deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
