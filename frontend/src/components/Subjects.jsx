import React, { useState, useEffect } from "react";
import axios from "axios";
import apiBaseUrl from "../server/server";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({
    name: "",
    duration: "",
    classes: [],
    teacherId: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editSubjectId, setEditSubjectId] = useState("");
  const [loading, setLoading] = useState(true);
  const [classList, setClassList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchSubjects = () => {
    setLoading(true);
    axios
      .get(`${apiBaseUrl}/api/subjects`)
      .then((response) => {
        if (response.data) {
          console.log("Data received:", response.data);
          setSubjects(response.data);
        } else {
          console.error("No data received from server");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
        setLoading(false);
      });
  };

  const fetchClasses = () => {
    axios
      .get(`${apiBaseUrl}/api/classes`)
      .then((response) => {
        setClassList(response.data);
        console.log("Class List:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      });
  };

  const fetchTeachers = () => {
    axios
      .get(`${apiBaseUrl}/api/users/teachers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("Teachers:", response.data);
        setTeacherList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
      });
  };

  const handleAddSubject = () => {
    if (
      newSubject.name.trim() !== "" &&
      newSubject.duration.trim() !== "" &&
      newSubject.classes.length > 0 &&
      newSubject.teacherId !== ""
    ) {
      console.log("Submitting new subject:", newSubject);

      axios
        .post(`${apiBaseUrl}/api/subjects`, newSubject)
        .then((response) => {
          fetchSubjects();
          setShowForm(false);
          setNewSubject({
            name: "",
            duration: "",
            classes: [],
            teacherId: "",
          });
        })
        .catch((error) => {
          console.error("Error adding subject:", error);
        });
    }
  };

  const handleEditSubject = (subjectId) => {
    const subjectToEdit = subjects.find((subject) => subject._id === subjectId);

    setEditMode(true);
    setEditSubjectId(subjectId);

    setNewSubject({
      name: subjectToEdit.name,
      duration: subjectToEdit.duration,
      classes: subjectToEdit.classIds.map((classItem) => classItem._id),
      teacherId: subjectToEdit.teacherId,
    });

    setShowForm(true);
  };

  const handleUpdateSubject = () => {
    axios
      .put(`${apiBaseUrl}/api/subjects/${editSubjectId}`, newSubject)
      .then((response) => {
        console.log("Subject updated successfully");
        fetchSubjects();

        setShowForm(false);
        setEditMode(false);
        setEditSubjectId("");
        setNewSubject({
          ...newSubject,
          name: "",
          duration: "",
          classes: [],
          teacherId: "",
        });
      })
      .catch((error) => {
        console.error("Error updating subject:", error);
      });
  };

  const handleDeleteSubject = (subjectId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (confirmDelete) {
      axios
        .delete(`${apiBaseUrl}/api/subjects/${subjectId}`)
        .then((response) => {
          console.log("Subject deleted successfully");
          fetchSubjects();
        })
        .catch((error) => {
          console.error("Error deleting subject:", error);
        });
    }
  };

  const handleCheckboxChange = (classId) => {
    setNewSubject((prevSubject) => {
      const isClassChecked = prevSubject.classes.includes(classId);

      if (isClassChecked) {
        return {
          ...prevSubject,
          classes: prevSubject.classes.filter((id) => id !== classId),
        };
      } else {
        return {
          ...prevSubject,
          classes: [...prevSubject.classes, classId],
        };
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Subjects</h1>

      {/* Display create form */}
      {showForm ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (editMode) {
              handleUpdateSubject();
            } else {
              handleAddSubject();
            }
          }}
          className="mb-4 border rounded-md shadow-md p-6"
        >
          <div className="mb-2">
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              placeholder="Enter subject name"
              value={newSubject.name}
              onChange={(e) =>
                setNewSubject({ ...newSubject, name: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Duration:</label>
            <input
              type="number"
              placeholder="Enter subject duration"
              value={newSubject.duration}
              onChange={(e) =>
                setNewSubject({ ...newSubject, duration: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded w-full"
            />
          </div>
          <label className="block text-gray-700">Class:</label>

          <div className="mb-2 overflow-y-auto max-h-40 ">
            {classList.map((classItem) => (
              <div key={classItem._id} className="mb-2">
                <label>
                  <input
                    type="checkbox"
                    value={classItem._id}
                    checked={newSubject.classes.includes(classItem._id)}
                    onChange={(e) => handleCheckboxChange(classItem._id)}
                    className="mr-2"
                  />
                  {classItem.name}
                </label>
              </div>
            ))}
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Teacher:</label>
            <select
              value={newSubject.teacherId}
              onChange={(e) =>
                setNewSubject({ ...newSubject, teacherId: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded w-full"
            >
              <option value="">Select Teacher</option>
              {teacherList.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {editMode ? "Update Subject" : "Add Subject"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditMode(false);
              }}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-4"
            >
              Back
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Add Subject
        </button>
      )}

      {/* Display subjects table */}
      {!showForm && subjects.length > 0 ? (
        <table className="w-full border rounded-sm shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Duration</th>
              <th className="px-4 py-2">Classes</th>
              <th className="px-4 py-2">Teacher</th>
              <th className="px-4 py-2">Edit</th>
              <th className="px-4 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject) => (
              <tr key={subject._id}>
                <td className="border px-4 py-2">{subject.name}</td>
                <td className="border px-4 py-2">{subject.duration}</td>
                <td className="border px-4 py-2">
                  {subject.classIds.map((classItem) => (
                    <div key={classItem._id}>{classItem.name}</div>
                  ))}
                </td>
                <td className="border px-4 py-2">{subject.teacherId.name}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEditSubject(subject._id)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDeleteSubject(subject._id)}
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
        !showForm && <div>No subjects available</div>
      )}
    </div>
  );
};

export default Subjects;
