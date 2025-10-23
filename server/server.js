require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Initialize app
const app = express();

// Connect to Database
connectDB();

// --- Middleware ---

// Enable CORS
// We must allow the CLIENT_URL to make requests
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5175",
  })
);

// Body Parser Middleware
// Allows us to accept JSON data in the body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- API Routes ---
app.get("/api", (req, res) => {
  res.json({ msg: "Welcome to the NoteMaker API" });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

// --- Production Deployment ---
// Serve static assets (React build) if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  // The client build will be in ../client/dist
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // All other routes (e.g., /dashboard) should load the React app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "dist", "index.html"));
  });
}

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  if (process.env.NODE_ENV !== "production") {
    // This is Vite's default port. Change if you configured it differently.
    console.log(`Access frontend at http://localhost:5175`);
  }
});
