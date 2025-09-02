import React, { useEffect, useState, useCallback } from "react";
import { api } from "../api";
import "./StudentList.css";
import editIcon from "../assets/pencil.png";
import deleteIcon from "../assets/trash.png";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(25); 
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    student_id: "",
    student_name: "",
    total_marks: 0,
    marks_obtained: 0
  });

  const fetchStudents = useCallback(async () => {
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
  }, [page, limit]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const totalPages = Math.ceil(total / limit);

  const handleEditClick = (student) => {
    setEditingId(student._id);
    setEditForm({
      student_id: student.student_id,
      student_name: student.student_name,
      total_marks: student.total_marks,
      marks_obtained: student.marks_obtained
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/students/${editingId}`, editForm);
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(students) && students.length > 0 ? (
                students.map((s) => (
                  <tr key={s._id}>
                    <td>{editingId === s._id ? <input name="student_id" value={editForm.student_id} onChange={handleEditChange} /> : s.student_id}</td>
                    <td>{editingId === s._id ? <input name="student_name" value={editForm.student_name} onChange={handleEditChange} /> : s.student_name}</td>
                    <td>{editingId === s._id ? <input type="number" name="total_marks" value={editForm.total_marks} onChange={handleEditChange} /> : s.total_marks}</td>
                    <td>{editingId === s._id ? <input type="number" name="marks_obtained" value={editForm.marks_obtained} onChange={handleEditChange} /> : s.marks_obtained}</td>
                    <td>{s.percentage}%</td>
                   <td>
  {editingId === s._id ? (
    <>
      <button  className="edit" onClick={handleUpdate}>
        <img src={editIcon} alt="Save" width={15}/>
      </button>
      <button className="delete"  onClick={() => setEditingId(null)}>
        <img src={deleteIcon} alt="Cancel" width={20} />
      </button>
    </>
  ) : (
    <>
      <button onClick={() => handleEditClick(s)}>
        <img src={editIcon} alt="Edit" width={15} />
      </button>
      <button onClick={() => handleDelete(s._id)}>
        <img src={deleteIcon} alt="Delete" width={20} />
      </button>
    </>
  )}
</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>No students found.</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>Prev</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}
