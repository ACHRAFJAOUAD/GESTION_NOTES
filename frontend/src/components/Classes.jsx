import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import apiBaseUrl from "../server/server.js";

const Classes = () => {
  const [sectors, setSectors] = useState([]);
  const [fields, setFields] = useState([]);
  const [classes, setClasses] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [classStudentList, setClassStudentList] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [newSectorName, setNewSectorName] = useState("");
  const [newFieldName, setNewFieldName] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [addingStudent, setAddingStudent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSectors();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedField) {
      fetchClasses(selectedField._id);
    }
  }, [selectedField]);

  useEffect(() => {
    if (selectedClass) {
      fetchClassStudents(selectedClass._id);
    }
  }, [selectedClass]);

  const fetchSectors = () => {
    setLoading(true);

    axios
      .get(`${apiBaseUrl}/api/sectors`)
      .then((response) => {
        console.log("Sectors from backend:", response.data);
        if (Array.isArray(response.data)) {
          setSectors(response.data);
        } else {
          console.error("Data received is not an array:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching sectors:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchClasses = (fieldId) => {
    setLoading(true);
    axios
      .get(`${apiBaseUrl}/api/classes/field/${fieldId}`)
      .then((response) => {
        setClasses(response.data);
        console.log("classes of this field :", response.data);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchStudents = () => {
    setLoading(true);
    console.log("Fetching students...");

    axios
      .get(`${apiBaseUrl}/api/users/students`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("All Students details :", response.data);
        setStudentList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchClassStudents = (classId) => {
    setLoading(true);
    if (classId) {
      axios
        .get(`${apiBaseUrl}/api/classes/${classId}/students`, {
          params: { cacheBuster: new Date().getTime() },
        })
        .then((response) => {
          console.log("Students of selected class details:", response.data);
          setClassStudentList(response.data);
        })
        .catch((error) => {
          console.error("Error fetching students of selected class:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleSectorClick = (sector) => {
    setSelectedSector(sector);
    setSelectedField(null);
    setSelectedClass(null);
  };

  const handleFieldClick = (field) => {
    setSelectedField(field);
    setSelectedClass(null);
  };

  const handleClassClick = (classItem) => {
    setSelectedClass(classItem);
    fetchClassStudents();
  };

  const handleAddSector = () => {
    if (newSectorName.trim() !== "") {
      axios
        .post(`${apiBaseUrl}/api/sectors`, { name: newSectorName })
        .then((response) => {
          setNewSectorName("");
          fetchSectors();
        })
        .catch((error) => {
          console.error("Error adding sector:", error);
        });
    }
  };

  const handleAddField = () => {
    if (selectedSector && newFieldName.trim() !== "") {
      axios
        .post(`${apiBaseUrl}/api/fields/${selectedSector._id}`, {
          name: newFieldName,
          sectorId: selectedSector._id,
        })
        .then((response) => {
          setNewFieldName("");
          setFields((prevFields) => [...prevFields, response.data]);
          setSelectedSector((prevSector) => ({
            ...prevSector,
            fields: [...prevSector.fields, response.data],
          }));
        })
        .catch((error) => {
          console.error("Error adding field:", error);
        });
    }
  };

  const handleAddClass = () => {
    if (selectedField && newClassName.trim() !== "") {
      axios
        .post(`${apiBaseUrl}/api/classes/${selectedField._id}`, {
          name: newClassName,
          fieldId: selectedField._id,
        })
        .then((response) => {
          console.log("Class added successfully:", response.data);
          setNewClassName("");
          setSelectedField((prevField) => ({
            ...prevField,
            classes: [...prevField.classes, response.data],
          }));
        })
        .catch((error) => {
          console.error("Error adding class:", error);
        });
    }
  };

  const handleAddStudent = () => {
    setAddingStudent(true);
    setShowForm(true);
  };

  const handleCancelAddStudent = () => {
    setAddingStudent(false);
    setShowForm(false);
    setSelectedStudents([]);
  };

  const handleDeleteSector = (sectorId) => {
    axios
      .delete(`${apiBaseUrl}/api/sectors/${sectorId}`)
      .then(() => {
        setSectors(sectors.filter((sector) => sector._id !== sectorId));
      })
      .catch((error) => {
        console.error("Error deleting sector:", error);
      });
  };

  const handleDeleteField = (fieldId) => {
    axios
      .delete(`${apiBaseUrl}/api/fields/${fieldId}`)
      .then(() => {
        console.log("Field deleted successfully");
        setFields(fields.filter((field) => field._id !== fieldId));
      })
      .catch((error) => {
        console.error("Error deleting field:", error);
      });
  };

  const handleDeleteClass = (classId) => {
    axios
      .delete(`${apiBaseUrl}/api/classes/${classId}`)
      .then(() => {
        setClasses(classes.filter((classItem) => classItem._id !== classId));
      })
      .catch((error) => {
        console.error("Error deleting class:", error);
      });
  };

  const handleBackToSectors = () => {
    setSelectedSector(null);
    setSelectedField(null);
    setSelectedClass(null);
  };
  const handleBackToFields = () => {
    setSelectedField(null);
    setSelectedClass(null);
  };
  const handleBackToClasses = () => {
    setSelectedClass(null);
  };

  const handleAddSelectedStudents = () => {
    if (!selectedClass || !selectedClass._id) {
      console.error("Selected class is undefined or has no ID");
      return;
    }

    if (selectedStudents.length === 0) {
      console.error("No students selected");
      return;
    }

    const studentIds = selectedStudents.map(
      (studentId) =>
        studentList.find((student) => student._id === studentId)._id
    );

    axios
      .post(`${apiBaseUrl}/api/classes/${selectedClass._id}/students`, {
        students: studentIds,
      })
      .then((response) => {
        console.log("Students added successfully:", response.data);

        // Update the selected class with the newly added students
        setSelectedClass((prevClass) => ({
          ...prevClass,
          students: [...prevClass.students, ...response.data],
        }));

        // Update the studentList state with the newly added students
        setStudentList((prevStudentList) => [
          ...prevStudentList,
          ...response.data,
        ]);

        // Reset selected students and form visibility
        setSelectedStudents([]);
        setAddingStudent(false);
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Error adding students:", error);
      });
  };

  const handleDeleteStudentFromClass = (studentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student from the class?"
    );

    if (confirmDelete) {
      axios
        .delete(
          `${apiBaseUrl}/api/classes/${selectedClass._id}/students/${studentId}`
        )
        .then(() => {
          console.log("Student removed from class successfully");

          // Remove the deleted student from the selected class
          setSelectedClass((prevClass) => ({
            ...prevClass,
            students: prevClass.students.filter(
              (student) => student._id !== studentId
            ),
          }));
        })
        .catch((error) => {
          console.error("Error deleting student from class:", error);
        });
    }
  };

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prevSelectedStudents) => {
      if (prevSelectedStudents.includes(studentId)) {
        return prevSelectedStudents.filter((id) => id !== studentId);
      } else {
        return [...prevSelectedStudents, studentId];
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      key={selectedSector?._id || selectedField?.fieldId || selectedClass?._id}
      className="container mx-auto p-4"
    >
      {/* Sector */}
      {selectedSector === null && (
        <div>
          <div className="flex justify-between items-center flex-col mb-4">
            <h1 className="text-2xl font-bold">Sectors</h1>
            <div className="flex items-center  flex-col">
              <input
                type="text"
                placeholder="Enter sector name"
                value={newSectorName}
                onChange={(e) => setNewSectorName(e.target.value)}
                className="mr-2 m-3 px-2 py-1 border border-gray-300 rounded"
              />
              <button
                onClick={handleAddSector}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Sector
              </button>
            </div>
          </div>
          {/* List of Sectors */}
          {sectors.length > 0 &&
            sectors.map((sector) => (
              <div
                key={sector._id}
                className="border border-gray-300 p-4 cursor-pointer shadow-md mb-4 relative"
                onClick={() => handleSectorClick(sector)}
              >
                <p className="text-lg font-semibold">{sector.name}</p>
                <FontAwesomeIcon
                  icon={faTrash}
                  className="absolute top-2 right-2 text-red-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSector(sector._id);
                  }}
                />
              </div>
            ))}
        </div>
      )}
      {/* Selected Sector */}
      {selectedSector && selectedField === null && (
        <div>
          <div className="flex items-center mb-4">
            <button
              onClick={handleBackToSectors}
              className="text-green-500 hover:text-green-300"
            >
              <FontAwesomeIcon icon={faArrowCircleLeft} /> Back
            </button>
          </div>
          <div className="flex justify-between items-center flex-col mb-4">
            <h1 className="text-2xl font-bold">Fields</h1>
            <div className="flex items-center  flex-col">
              <input
                type="text"
                placeholder="Enter field name"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                className="mr-2 m-3 px-2 py-1 border border-gray-300 rounded"
              />
              <button
                onClick={handleAddField}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Field
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fields */}
      {selectedSector &&
        !selectedField &&
        selectedSector.fields.map((field) => (
          <div
            key={field._id}
            className="border border-gray-300 p-4 cursor-pointer shadow-md mb-4 relative"
            onClick={() => handleFieldClick(field)}
          >
            <p className="text-lg font-semibold">{field.name}</p>
            <FontAwesomeIcon
              icon={faTrash}
              className="absolute top-2 right-2 text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                console.log(field._id);
                handleDeleteField(field._id);
              }}
            />
          </div>
        ))}
      {/* Selected Field */}
      {selectedField && selectedClass === null && (
        <div>
          <div className="flex items-center mb-4">
            <button
              onClick={handleBackToFields}
              className="text-green-500 hover:text-green-300"
            >
              <FontAwesomeIcon icon={faArrowCircleLeft} /> Back
            </button>
          </div>
          <div className="flex justify-between items-center flex-col mb-4">
            <h1 className="text-2xl font-bold">Classes</h1>
            <div className="flex items-center  flex-col">
              <input
                type="text"
                placeholder="Enter class name"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="mr-2 m-3 px-2 py-1 border border-gray-300 rounded"
              />
              <button
                onClick={handleAddClass}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Class
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Classes */}
      {selectedField &&
        !selectedClass &&
        classes.map((classItem) => (
          <div
            key={classItem._id}
            className="border border-gray-300 p-4 cursor-pointer shadow-md mb-4 relative"
            onClick={() => handleClassClick(classItem)}
          >
            <p className="text-lg font-semibold">{classItem.name}</p>
            <FontAwesomeIcon
              icon={faTrash}
              className="absolute top-2 right-2 text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClass(classItem._id);
              }}
            />
          </div>
        ))}
      {/* Selected class */}
      {selectedClass && (
        <div>
          <div className="flex items-center mb-4">
            <button
              onClick={handleBackToClasses}
              className="text-green-500 hover:text-green-300"
            >
              <FontAwesomeIcon icon={faArrowCircleLeft} /> Back
            </button>
          </div>

          {/* Add Student Form */}

          {showForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddSelectedStudents();
              }}
              className="mb-4 border rounded-md shadow-md p-6"
            >
              <label className="block text-gray-700">Students:</label>

              <div className="mb-2 overflow-y-auto max-h-40">
                {studentList.map((student) => (
                  <div key={student._id} className="mb-2">
                    {selectedClass.students.some(
                      (s) => s._id === student._id
                    ) ? (
                      // If the student is already in the class, show a message
                      <span>{student.name} - Already in class</span>
                    ) : (
                      // If the student is not in the class, show a checkbox
                      <label>
                        <input
                          type="checkbox"
                          value={student._id}
                          checked={selectedStudents.includes(student._id)}
                          onChange={() => handleCheckboxChange(student._id)}
                          className="mr-2"
                        />
                        {student.name} ({student.email})
                      </label>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add student
                </button>
                <button
                  onClick={handleCancelAddStudent}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-4"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {!showForm && selectedClass && (
            <button
              onClick={handleAddStudent}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
              Add Student
            </button>
          )}
          {/* Student table */}
          {!addingStudent && selectedClass && (
            <div>
              <h2 className="text-lg font-bold mb-2">Student List</h2>
              {Array.isArray(selectedClass.students) &&
              selectedClass.students.length > 0 ? (
                <table className="table-auto border-collapse border border-gray-400">
                  <thead>
                    <tr>
                      <th className="border border-gray-400 px-4 py-2">ID</th>
                      <th className="border border-gray-400 px-4 py-2">Name</th>
                      <th className="border border-gray-400 px-4 py-2">
                        Email
                      </th>
                      <th className="border border-gray-400 px-4 py-2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedClass.students.map((student) => {
                      console.log("Student ID:", student._id);

                      return (
                        <tr key={student._id}>
                          <td className="border border-gray-400 px-4 py-2">
                            {student._id}
                          </td>
                          <td className="border border-gray-400 px-4 py-2">
                            {student.name}
                          </td>
                          <td className="border border-gray-400 px-4 py-2">
                            {student.email}
                          </td>
                          <td className="border border-gray-400 px-4 py-2">
                            <button
                              onClick={() =>
                                handleDeleteStudentFromClass(student._id)
                              }
                              className="text-red-500 hover:text-red-300"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p>No students in this class</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Classes;
