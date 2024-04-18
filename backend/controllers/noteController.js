const Note = require("../models/noteModel");
const asyncHandler = require("express-async-handler");

// Create a note
exports.createNote = asyncHandler(async (req, res) => {
  try {
    const { subjectId, studentId, normalNotes, specialNote } = req.body;

    const note = new Note({
      subjectId,
      studentId,
      normalNotes,
      specialNote,
    });

    const savedNote = await note.save();

    res.status(201).json({ message: "Note created successfully", savedNote });
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
  try {
    const { normalNotes, specialNote } = req.body;

    const note = await Note.findById(req.params.id);

    if (note === null) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Update the note fields
    note.normalNotes = normalNotes;
    note.specialNote = specialNote;

    const updatedNote = await note.save();

    res.status(200).json({ message: "Note updated successfully", updatedNote });
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
