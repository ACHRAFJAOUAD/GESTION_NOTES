const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authenticateUser");
const multer = require("multer");

// Route to retrieve students based on their role
router.get("/students", userController.getStudentsByRole);

// Route to update user information based on their ID
router.put("/:id", userController.updateUser);

// Route to create a new user
router.post("/", userController.createUser);

// Route to delete a user based on their ID
router.delete("/:id", userController.deleteUser);

// Route to retrieve teachers based on their role
router.get("/teachers", userController.getTeachersByRole);

// Route to retrieve user role information (protected route using authentication middleware)
router.get("/", authMiddleware.verifyToken, userController.getUserRole);

// Route to update user profile information (protected route using authentication middleware)
router.put("/", authMiddleware.verifyToken, userController.updateUserProfile);

// Multer storage configuration for handling profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/profile-pictures");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Multer middleware for handling file uploads
const upload = multer({ storage: storage });

// Route to handle profile picture upload for a user with the specified ID
router.put(
  "/:id/picture",
  authMiddleware.verifyToken,
  upload.single("picture"),
  userController.uploadProfilePicture
);

module.exports = router;
