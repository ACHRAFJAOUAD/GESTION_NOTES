const Subject = require("../models/subjectModel");
const User = require("../models/userModel");
const Class = require("../models/classModel");
const asyncHandler = require("express-async-handler");

exports.getAllSubjects = asyncHandler(async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate("classIds")
      .populate("teacherId");
    res.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

exports.createSubject = asyncHandler(async (req, res) => {
  try {
    const { name, duration, classes, teacherId } = req.body;
    console.log("Received request body:", req.body);
    const newSubject = new Subject({
      name,
      duration,
      classIds: classes,
      teacherId,
    });
    const createdSubject = await newSubject.save();

    res.status(201).json(createdSubject);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      console.error("Validation error creating subject:", errors);
      res.status(400).json({ errors });
    } else {
      console.error("Error creating subject:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

exports.deleteSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await Subject.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

exports.updateSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    let subject = await Subject.findById(id);

    subject.name = req.body.name;
    subject.duration = req.body.duration;
    subject.teacherId = req.body.teacherId;

    const classObjects = await Class.find({ _id: { $in: req.body.classes } });
    subject.classIds = classObjects;

    const updatedSubject = await subject.save();

    res.json(updatedSubject);
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(400).json({ error: "Bad request" });
  }
});
