import { Router } from "express";
import { listStudents, updateStudent, deleteStudent } from "../controllers/studentsController.js";

const router = Router();

router.get("/", listStudents);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
