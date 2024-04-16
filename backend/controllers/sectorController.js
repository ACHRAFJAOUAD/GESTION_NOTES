const express = require("express");
const asyncHandler = require("express-async-handler");
const Sector = require("../models/sectorModel");

exports.getAllSectors = asyncHandler(async (req, res) => {
  const sectors = await Sector.find().populate("fields");
  res.json(sectors);
});

exports.createSector = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const sector = new Sector({ name });
  const savedSector = await sector.save();

  res.status(201).json(savedSector);
});

exports.deleteSector = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const sector = await Sector.findByIdAndDelete(id);
  if (!sector) {
    return res.status(404).json({ message: "Sector not found" });
  }

  res.json({ message: "Sector deleted successfully" });
});
