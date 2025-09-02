import Upload from "../models/Upload.js";
import Student from "../models/Student.js";
import { parseBuffer } from "../utils/parseFile.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { buffer, originalname, mimetype, size } = req.file;

    const parsed = parseBuffer(buffer, originalname, mimetype);

    const upload = await Upload.create({
      filename: `${Date.now()}_${originalname}`,
      originalname,
      mimetype,
      size,
      rowsImported: parsed.length
    });

    // insertMany with uploadId
    const docs = parsed.map((r) => ({ ...r, uploadId: upload._id }));
    await Student.insertMany(docs);

    res.status(201).json({
      message: "File processed successfully",
      rowsImported: parsed.length,
      uploadId: upload._id
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Upload failed" });
  }
};

export const getUploads = async (req, res) => {
  const uploads = await Upload.find().sort({ uploaded_at: -1 }).lean();
  res.json(uploads);
};
