const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authenticateUser");
const multer = require("multer");

router.get("/students", userController.getStudentsByRole);
router.put("/:id", userController.updateUser);
router.post("/", userController.createUser);
router.delete("/:id", userController.deleteUser);

router.get(
  "/teachers",
  // authMiddleware.verifyToken,
  userController.getTeachersByRole
);
router.get("/", authMiddleware.verifyToken, userController.getUserRole);
router.put("/", authMiddleware.verifyToken, userController.updateUserProfile);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/profile-pictures");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.put(
  "/:id/picture",
  authMiddleware.verifyToken,
  upload.single("picture"),
  userController.uploadProfilePicture
);

module.exports = router;
