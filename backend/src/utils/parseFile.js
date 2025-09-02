import XLSX from "xlsx";
import { parse } from "csv-parse/sync";

// Normalize header like "SSttuuddeenntt__IIDD" -> "student_id"
const normalize = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/_/g, "")
    .replace(/\s+/g, "")
    .replace(/([a-z])\1+/g, "$1"); // collapse repeated letters

export const parseBuffer = (buffer, originalname, mimetype) => {
  const isExcel =
    mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    originalname.toLowerCase().endsWith(".xlsx");
  const isCsv = mimetype === "text/csv" || originalname.toLowerCase().endsWith(".csv");

  let rows = [];
  if (isExcel) {
    const wb = XLSX.read(buffer, { type: "buffer" });
    const sheetName = wb.SheetNames[0];
    const json = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: "" });
    rows = json;
  } else if (isCsv) {
    const text = buffer.toString("utf8");
    rows = parse(text, { columns: true, skip_empty_lines: true });
  } else {
    throw new Error("Unsupported file type");
  }

  // Map headers
  return rows.map((row) => {
    // try multiple header variants
    const map = {};
    for (const [k, v] of Object.entries(row)) {
      map[normalize(k)] = v;
    }

    const student_id =
      map["studentid"] || map["student_id"] || map["sid"] || map["id"] || map["sstudentiid"];
    const student_name =
      map["studentname"] || map["student_name"] || map["name"] || map["sstudenttnnaammee"];
    const total_marks = map["totalmarks"] || map["total_marks"] || map["total"] || map["ttoottaallmmaarrkkss"];
    const marks_obtained =
      map["marksobtained"] ||
      map["marks_obtained"] ||
      map["marks"] ||
      map["mmaarrkkssoo b bttaaiinneedd".replace(/\s/g, "")]; // ultra defensive

    if (!student_id || !student_name || total_marks == null || marks_obtained == null) {
      throw new Error(
        "Missing required columns. Expected headers like: Student_ID, Student_Name, Total_Marks, Marks_Obtained"
      );
    }

    const t = Number(total_marks);
    const m = Number(marks_obtained);
    if (Number.isNaN(t) || Number.isNaN(m)) {
      throw new Error("Total_Marks and Marks_Obtained must be numbers");
    }

    return {
      student_id: String(student_id).trim(),
      student_name: String(student_name).trim(),
      total_marks: t,
      marks_obtained: m
    };
  });
};
