import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import uploadsRoute from "./src/routes/uploads.js";
import studentsRoute from "./src/routes/students.js";

dotenv.config();

const app = express();

// Enable CORS for your deployed frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || "*",
}));

app.use(express.json({ limit: "1mb" }));

// Routes
app.get("/", (_req, res) => res.send("✅ Student Grade API is running"));
app.use("/api/uploads", uploadsRoute);
app.use("/api/students", studentsRoute);

// 404 + error handler
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// Start server after DB connects
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server listening on :${PORT}`));
});
