import React, { useState, useEffect } from "react";
import axios from "axios";
import apiBaseUrl from "../server/server";

const TeacherCrud = () => {
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTeacherId, setEditTeacherId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = () => {
    setLoading(true);
    axios
      .get(`${apiBaseUrl}/api/users/teachers`)
      .then((response) => {
        setTeachers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
        setLoading(false);
      });
  };

  const handleAddTeacher = () => {
    setShowForm(true);
  };

  const handleEditTeacher = (teacherId) => {
    const teacherToEdit = teachers.find((teacher) => teacher._id === teacherId);

    setEditMode(true);
    setEditTeacherId(teacherId);

    setNewTeacher({
      name: teacherToEdit.name,
      email: teacherToEdit.email,
      password: "",
    });

    setShowForm(true);
  };

  const handleDeleteTeacher = (teacherId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (confirmDelete) {
      axios
        .delete(`${apiBaseUrl}/api/users/${teacherId}`)
        .then((response) => {
          console.log("Teacher deleted successfully");
          fetchTeachers();
        })
        .catch((error) => {
          console.error("Error deleting teacher:", error);
        });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setNewTeacher({ name: "", email: "", password: "" });
    setEditMode(false);
    setEditTeacherId("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (editMode) {
      axios
        .put(`${apiBaseUrl}/api/users/${editTeacherId}`, newTeacher)
        .then((response) => {
          console.log("Teacher updated successfully");
          fetchTeachers();

          setShowForm(false);
          setEditMode(false);
          setEditTeacherId("");
          setNewTeacher({ name: "", email: "", password: "" });
        })
        .catch((error) => {
          console.error("Error updating teacher:", error);
        });
    } else {
      axios
        .post(`${apiBaseUrl}/api/users`, {
          ...newTeacher,
          role: "teacher",
        })
        .then((response) => {
          console.log("Teacher added successfully");
          fetchTeachers();

          setShowForm(false);
          setNewTeacher({ name: "", email: "", password: "" });
        })
        .catch((error) => {
          console.error("Error adding teacher:", error);
        });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Teachers</h1>

      {/* Display "Add Teacher" button */}
      {!showForm && (
        <button
          onClick={handleAddTeacher}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Add Teacher
        </button>
      )}

      {/* Display form for adding/editing a teacher */}
      {showForm && (
        <form
          onSubmit={handleFormSubmit}
          className="mb-4 border rounded-md shadow-md p-6"
        >
          <div className="mb-2">
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              value={newTeacher.name}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, name: e.target.value })
              }
              placeholder="Enter name"
              className="px-3 py-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              value={newTeacher.email}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, email: e.target.value })
              }
              placeholder="Enter email"
              className="px-3 py-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Password:</label>
            <input
              type="password"
              value={newTeacher.password}
              onChange={(e) =>
                setNewTeacher({ ...newTeacher, password: e.target.value })
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
              {editMode ? "Update Teacher" : "Add Teacher"}
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

      {/* Display teachers table */}
      {!showForm && teachers.length > 0 ? (
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
            {teachers.map((teacher) => (
              <tr key={teacher._id}>
                <td className="border px-4 py-2">{teacher.name}</td>
                <td className="border px-4 py-2">{teacher.email}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEditTeacher(teacher._id)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDeleteTeacher(teacher._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !showForm && <div>No teachers available</div>
      )}
    </div>
  );
};

export default TeacherCrud;
