const Class = require("../models/classModel");
const Field = require("../models/fieldModel");
const User = require("../models/userModel");
const Subject = require("../models/subjectModel");

const asyncHandler = require("express-async-handler");

exports.getAllClasses = asyncHandler(async (req, res) => {
  try {
    const classes = await Class.find();
    res.status(200).json(classes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.getClassById = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  try {
    const classItem = await Class.findById(classId);
    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.status(200).json(classItem);
  } catch (error) {
    console.error("Error fetching class:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.getClassesByField = asyncHandler(async (req, res) => {
  const fieldId = req.params.fieldId;
  if (!fieldId) {
    return res.status(400).json({ message: "Field ID is missing" });
  }

  try {
    const classes = await Class.find({ field: fieldId })
      .populate({
        path: "field",
        select: "name",
      })
      .populate("students");
    res.json(classes);
  } catch (error) {
    console.error("Error fetching classes by field:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.createClass = asyncHandler(async (req, res) => {
  const { name, fieldId } = req.body;

  try {
    const field = await Field.findById(fieldId);
    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }
    const newClass = await Class.create({ name, field: fieldId });
    field.classes.push(newClass._id);
    await field.save();
    res.status(201).json(newClass);
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.deleteClass = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const classItem = await Class.findByIdAndDelete(id);
    if (!classItem) {
      return res.status(404).json({ message: "Class not found" });
    }
    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.getStudentsOfClass = asyncHandler(async (req, res) => {
  const { classId } = req.params;

  try {
    const classDocument = await Class.findById(classId).populate("students");
    if (!classDocument) {
      return res.status(404).json({ error: "Class not found" });
    }
    const students = classDocument.students;
    return res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students of class:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
exports.addStudentsToClass = asyncHandler(async (req, res) => {
  const { classId } = req.params;
  const { students } = req.body;

  try {
    const classDocument = await Class.findById(classId);
    if (!classDocument) {
      return res.status(404).json({ error: "Class not found" });
    }
    classDocument.students.push(...students);
    await classDocument.save();
    const addedStudents = await User.find({ _id: { $in: students } });
    return res.status(200).json(addedStudents);
  } catch (error) {
    console.error("Error adding students to class:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

exports.deleteStudentFromClass = asyncHandler(async (req, res) => {
  const { classId, studentId } = req.params;
  try {
    const classToUpdate = await Class.findById(classId);
    if (!classToUpdate) {
      return res.status(404).json({ message: "Class not found" });
    }
    classToUpdate.students.pull(studentId);
    await classToUpdate.save();
    res.json({ message: "Student removed from class successfully" });
  } catch (error) {
    console.error("Error deleting student from class:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.getClassesBySubject = asyncHandler(async (req, res) => {
  try {
    const { subjectId } = req.params;
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    const classIds = subject.classIds.map((classId) => classId.toString()); // Convert ObjectIds to strings
    const classes = await Class.find({ _id: { $in: classIds } });
    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
