import Student from "../models/Student.js";

export const listStudents = async (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Student.find().sort({ created_at: -1 }).skip(skip).limit(Number(limit)).lean(),
    Student.countDocuments()
  ]);
  res.json({ total, count: items.length, page: Number(page), limit: Number(limit), items });
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = {};
    const allowed = ["student_id", "student_name", "total_marks", "marks_obtained"];
    for (const k of allowed) if (k in req.body) payload[k] = req.body[k];

    const doc = await Student.findById(id);
    if (!doc) return res.status(404).json({ error: "Student not found" });

    Object.assign(doc, payload);
    await doc.save(); // triggers percentage recompute

    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  const { id } = req.params;
  const deleted = await Student.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: "Student not found" });
  res.json({ message: "Deleted", id });
};
