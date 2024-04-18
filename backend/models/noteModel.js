const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  normalNotes: [
    {
      type: Number,
      min: 0,
      max: 20,
    },
  ],
  specialNote: {
    type: Number,
    min: 0,
    max: 40,
  },
});

module.exports = mongoose.model("Note", noteSchema);
