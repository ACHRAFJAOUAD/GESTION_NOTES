const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./Routes/auth");
const userRoutes = require("./Routes/users");
const sectorRoutes = require("./Routes/sectors");
const fieldRoutes = require("./Routes/fields");
const classRoutes = require("./Routes/classes");
const subjectRoutes = require("./Routes/subjects");
const noteRoutes = require("./Routes/notes");
const fs = require("fs");

// Load environment variables
dotenv.config();

// Connect to MongoDB
require("./config/dbConnect")();

// Create Express app
const app = express();

// Create directory for profile pictures if it doesn't exist
const profilePicturesDir = "public/uploads/profile-pictures";
if (!fs.existsSync(profilePicturesDir)) {
  fs.mkdirSync(profilePicturesDir, { recursive: true });
  console.log(`Directory ${profilePicturesDir} created successfully.`);
} else {
  console.log(`Directory ${profilePicturesDir} already exists.`);
}

// Middleware
app.use(cors());

app.use(express.json());
app.use("/api/images", express.static("public/uploads/profile-pictures"));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sectors", sectorRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/notes", noteRoutes);

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ message: err.message });
});

app.use("/", (req, res) => {
  res.send("Welcome to the Gestion Notes Site Web!");
});
// Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running up on port ${PORT}`);
});
