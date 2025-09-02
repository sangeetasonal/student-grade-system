import React, { useEffect, useState } from "react";
import { api } from "../api";
import "./StudentList.css";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(25); // students per page
  const [loading, setLoading] = useState(false);

  // Fetch students whenever page changes
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/students?page=${page}&limit=${limit}`);
        setStudents(res.data.items || []);
        setTotal(res.data.total || 0);
        setPage(res.data.page || 1);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchStudents();
  }, [page, limit]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="table-container">
      <h2>Student Records</h2>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Total Marks</th>
                <th>Marks Obtained</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(students) && students.length > 0 ? (
                students.map((s) => (
                  <tr key={s._id}>
                    <td>{s.student_id}</td>
                    <td>{s.student_name}</td>
                    <td>{s.total_marks}</td>
                    <td>{s.marks_obtained}</td>
                    <td>{s.percentage}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={page <= 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
