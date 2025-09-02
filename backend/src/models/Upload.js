import mongoose from "mongoose";

const UploadSchema = new mongoose.Schema(
  {
    filename: String,
    originalname: String,
    mimetype: String,
    size: Number,
    rowsImported: Number
  },
  { timestamps: { createdAt: "uploaded_at", updatedAt: false } }
);

export default mongoose.model("Upload", UploadSchema);
