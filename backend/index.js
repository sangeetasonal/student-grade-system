import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import uploadsRoute from "./src/routes/uploads.js";
import studentsRoute from "./src/routes/students.js";

dotenv.config();

const app = express();

// Allow only your deployed frontend (Vercel)
const allowedOrigin = process.env.CORS_ORIGIN;

app.use(cors({
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/uploads", uploadsRoute);
app.use("/api/students", studentsRoute);

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Not found" }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server listening on :${PORT}`));
});
