const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");

// GET all classes
router.get("/", classController.getAllClasses);

// GET classes by field ID
router.get("/field/:fieldId", classController.getClassesByField);

// GET a single class by ID
router.get("/:classId", classController.getClassById);

// GET classes by subject ID
router.get("/subject/:subjectId", classController.getClassesBySubject);

// GET students of a class by class ID
router.get("/:classId/students", classController.getStudentsOfClass);

// POST students to a class
router.post("/:classId/students", classController.addStudentsToClass);
// DELETE a student from a class
router.delete(
  "/:classId/students/:studentId",
  classController.deleteStudentFromClass
);

// POST create a new class in field
router.post("/:fieldId", classController.createClass);

// DELETE a class in field
router.delete("/:id", classController.deleteClass);

module.exports = router;
