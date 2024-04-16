const asyncHandler = require("express-async-handler");
const Field = require("../models/fieldModel");
const Sector = require("../models/sectorModel");

exports.getFieldsBySector = asyncHandler(async (req, res) => {
  const sectorId = req.params.sectorId;
  const fields = await Field.find({ sector: sectorId }).populate("classes");

  res.json(fields);
});

exports.createField = asyncHandler(async (req, res) => {
  const { name, sectorId } = req.body;

  const sector = await Sector.findById(sectorId);
  if (!sector) {
    return res.status(404).json({ message: "Sector not found" });
  }

  const field = new Field({ name, sector: sectorId });
  const savedField = await field.save();

  sector.fields.push(savedField._id);
  await sector.save();

  res.status(201).json(savedField);
});

exports.deleteField = asyncHandler(async (req, res) => {
  try {
    const fieldId = req.params.fieldId;
    const deletedField = await Field.findByIdAndDelete(fieldId);

    if (!deletedField) {
      return res.status(404).json({ message: "Field not found" });
    }

    res.json({ message: "Field deleted successfully" });
  } catch (error) {
    console.error("Error deleting field:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
