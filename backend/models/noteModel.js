const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  noteNumber: {
    type: Number,
    required: true,
  },
  isSpecialNote: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    required: true,
  },
  totalScore: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Note", noteSchema);
