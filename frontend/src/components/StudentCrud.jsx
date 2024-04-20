import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentCrud = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editStudentId, setEditStudentId] = useState("");
  const [loading, setLoading] = useState(true);

  const apiBaseUrl =
    "https://gestion-notes-backend.vercel.app" || "http://localhost:3001";

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    setLoading(true);
    axios
      .get(`${apiBaseUrl}/api/users/students`)
      .then((response) => {
        setStudents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        setLoading(false);
      });
  };

  const handleAddStudent = () => {
    setShowForm(true);
  };

  const handleEditStudent = (studentId) => {
    const studentToEdit = students.find((student) => student._id === studentId);

    setEditMode(true);
    setEditStudentId(studentId);

    setNewStudent({
      name: studentToEdit.name,
      email: studentToEdit.email,
      password: "",
    });

    setShowForm(true);
  };

  const handleDeleteStudent = (studentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (confirmDelete) {
      axios
        .delete(`${apiBaseUrl}/api/users/${studentId}`)
        .then((response) => {
          console.log("Student deleted successfully");
          fetchStudents();
        })
        .catch((error) => {
          console.error("Error deleting student:", error);
        });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setNewStudent({ name: "", email: "", password: "" });
    setEditMode(false);
    setEditStudentId("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (editMode) {
      axios
        .put(`${apiBaseUrl}/api/users/${editStudentId}`, newStudent)
        .then((response) => {
          console.log("Student updated successfully");
          fetchStudents();

          setShowForm(false);
          setEditMode(false);
          setEditStudentId("");
          setNewStudent({ name: "", email: "", password: "" });
        })
        .catch((error) => {
          console.error("Error updating student:", error);
        });
    } else {
      axios
        .post(`${apiBaseUrl}/api/users`, {
          ...newStudent,
          role: "student",
        })
        .then((response) => {
          console.log("Student added successfully");
          fetchStudents();

          setShowForm(false);
          setNewStudent({ name: "", email: "", password: "" });
        })
        .catch((error) => {
          console.error("Error adding student:", error);
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Students</h1>

      {/* Display "Add Student" button */}
      {!showForm && (
        <button
          onClick={handleAddStudent}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Add Student
        </button>
      )}

      {/* Display form for adding/editing a student */}
      {showForm && (
        <form
          onSubmit={handleFormSubmit}
          className="mb-4 border rounded-md shadow-md p-6"
        >
          <div className="mb-2">
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              value={newStudent.name}
              onChange={(e) =>
                setNewStudent({ ...newStudent, name: e.target.value })
              }
              placeholder="Enter name"
              className="px-3 py-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              value={newStudent.email}
              onChange={(e) =>
                setNewStudent({ ...newStudent, email: e.target.value })
              }
              placeholder="Enter email"
              className="px-3 py-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              value={newStudent.password}
              onChange={(e) =>
                setNewStudent({ ...newStudent, password: e.target.value })
              }
              placeholder="Enter password"
              className="px-3 py-2 border border-gray-300 rounded w-full"
            />
          </div>

          <div className="flex items-center">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {editMode ? "Update Student" : "Add Student"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-4"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Display students table */}
      {!showForm && students.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-sm">
            <thead>
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Edit</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="border px-4 py-2">{student.name}</td>
                  <td className="border px-4 py-2">{student.email}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEditStudent(student._id)}
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleDeleteStudent(student._id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !showForm && <div>No students available</div>
      )}
    </div>
  );
};

export default StudentCrud;
