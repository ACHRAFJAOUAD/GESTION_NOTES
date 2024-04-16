const mongoose = require("mongoose");

const SectorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fields: [{ type: mongoose.Schema.Types.ObjectId, ref: "Field" }],
});

module.exports = mongoose.model("Sector", SectorSchema);
