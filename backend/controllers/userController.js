const mongoose = require("mongoose");

const User = require("../models/userModel");
const fs = require("fs");
const asyncHandler = require("express-async-handler");

exports.getUserRole = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { id, role, name, email, phone, pictureUrl } = user;

    res.status(200).json({ id, role, name, email, phone, pictureUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const { name, phone, pictureUrl } = req.body;
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, { name, phone });
    // If pictureUrl is provided, update it separately
    if (pictureUrl) {
      await User.findByIdAndUpdate(userId, { pictureUrl });
    }
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.uploadProfilePicture = asyncHandler(async (req, res) => {
  try {
    console.log(
      `Received request to upload profile picture for user ${req.params.id}`
    );

    const { id } = req.params;
    const { filename } = req.file;

    if (!filename) {
      return res.status(400).json({ message: "No picture uploaded" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(`User ${id} found, updating profile picture`);

    user.pictureUrl = filename;
    await user.save();
    console.log(`Profile picture uploaded successfully for user ${id}`);

    res
      .status(200)
      .json({ message: "Profile picture uploaded successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.getTeachersByRole = asyncHandler(async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" });

    res.status(200).json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.getStudentsByRole = async (req, res) => {
  try {
    const students = await User.find({ role: "student" });
    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = new User({ name, email, password, role });
    const createdUser = await newUser.save();
    res.status(201).json(createdUser);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Email already exists" });
    } else {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = name;
    user.email = email;
    user.password = password;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
