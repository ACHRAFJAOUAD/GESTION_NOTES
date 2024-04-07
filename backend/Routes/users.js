const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authenticateUser");

router.get("/", authMiddleware.verifyToken, userController.getUserRole);

module.exports = router;
