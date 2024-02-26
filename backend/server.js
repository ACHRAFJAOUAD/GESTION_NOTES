const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./Routes/users");

// Load environment variables
dotenv.config();

// Connect to MongoDB
require("./config/dbConnect")();

// Create Express app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running up on port ${PORT}`);
});
