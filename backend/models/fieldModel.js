const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sector",
    required: true,
  },
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }],
});

module.exports = mongoose.model("Field", FieldSchema);
