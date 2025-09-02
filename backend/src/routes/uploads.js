import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { uploadFile, getUploads } from "../controllers/uploadsController.js";

const router = Router();

router.post("/", upload.single("file"), uploadFile);
router.get("/", getUploads);

export default router;
