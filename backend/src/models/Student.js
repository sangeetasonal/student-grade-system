import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    student_id: { type: String, required: true, index: true },
    student_name: { type: String, required: true },
    total_marks: { type: Number, required: true, min: 0 },
    marks_obtained: { type: Number, required: true, min: 0 },
    percentage: { type: Number, required: true },
    uploadId: { type: mongoose.Schema.Types.ObjectId, ref: "Upload" }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Ensure marks do not exceed total
StudentSchema.pre("validate", function (next) {
  if (this.marks_obtained > this.total_marks) {
    return next(new Error("marks_obtained cannot exceed total_marks"));
  }
  this.percentage =
    this.total_marks === 0 ? 0 : Number(((this.marks_obtained / this.total_marks) * 100).toFixed(2));
  next();
});

export default mongoose.model("Student", StudentSchema);
