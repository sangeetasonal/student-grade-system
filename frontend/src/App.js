import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import StudentList from "./components/StudentList";
import "./App.css";

function App() {
  const [reload, setReload] = useState(false);

  return (
    <div className="app-container">
      <h1>Student Grade Management System</h1>
      <FileUpload onUploadSuccess={() => setReload(!reload)} />
      <StudentList key={reload} />
    </div>
  );
}

export default App;
