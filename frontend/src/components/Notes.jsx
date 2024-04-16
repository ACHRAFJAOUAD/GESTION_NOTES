import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleLeft,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const Notes = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [notes, setNotes] = useState([]);
  const [addingNote, setAddingNote] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [noteType, setNoteType] = useState("Normal");

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/subjects")
      .then((response) => {
        console.log("subject data:", response.data);
        setSubjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }, []);

  const handleLessonClick = (subject) => {
    setSelectedSubject(subject);
    const subjectId = subject._id;
    setLoading(true);

    axios
      .get(`http://localhost:3001/api/classes/subject/${subjectId}`)
      .then((response) => {
        console.log("data classes:", response.data);
        setClasses(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
        setClasses([]);
        setLoading(false);
      });
  };
  const handleBackClick = () => {
    if (addingNote) {
      // If addingNote is true, go back to the previous interface
      setAddingNote(false);
      setNoteContent("");
      setNoteType("Normal");
    } else if (selectedStudent) {
      // If a student is selected, go back to the student list of the class
      setSelectedStudent(null);
      setNotes([]);
    } else if (selectedClass) {
      // If a class is selected, go back to the class list of the subject
      setSelectedClass(null);
      setStudents([]);
      setNotes([]);
    } else if (selectedSubject) {
      // If a subject is selected, go back to the subject list
      setSelectedSubject(null);
      setClasses([]);
      setStudents([]);
      setNotes([]);
    }
  };

  const fetchStudentsOfClass = (classId) => {
    axios
      .get(`http://localhost:3001/api/classes/${classId}/students`)
      .then((response) => {
        setStudents(response.data);
        setSelectedClass(classId);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  };

  const fetchNotesForStudent = (studentId) => {
    axios
      .get(`http://localhost:3001/api/notes/student/${studentId}`)
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  };

  const handleViewNotes = (studentId) => {
    setSelectedStudent(studentId);
    fetchNotesForStudent(studentId);
    setAddingNote(false);
  };

  const handleAddNote = () => {
    setAddingNote(true);
    setSelectedStudent(null);
  };

  const handleCancelAddNote = () => {
    setAddingNote(false);
    setNoteContent("");
    setNoteType("Normal");

    if (selectedStudent) {
      setSelectedStudent(null);
    }
  };

  const handleSaveNote = () => {
    // Implement logic to save the note
    // After saving, update the notes state and reset the form
  };

  return (
    <div className="container mx-auto p-4">
      {!selectedSubject && !selectedClass && (
        <>
          <h1 className="text-2xl font-bold mb-4 text-center">Subjects</h1>
          <div className="grid grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <div
                key={subject._id}
                className="border border-gray-300 p-4 cursor-pointer shadow-md"
                onClick={() => handleLessonClick(subject)}
              >
                <p className="text-lg font-semibold">{subject.name}</p>
              </div>
            ))}
          </div>
        </>
      )}
      {selectedSubject && !selectedClass && (
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBackClick}
              className="text-green-500 hover:text-green-300"
            >
              <FontAwesomeIcon icon={faArrowCircleLeft} /> Back
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">
            Classes of {selectedSubject.name} Subject
          </h2>
          {loading ? (
            <p>Loading classes...</p>
          ) : (
            <>
              {classes.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {classes.map((classItem) => (
                    <div
                      key={classItem._id}
                      className="border border-gray-300 p-4 cursor-pointer shadow-md"
                      onClick={() => fetchStudentsOfClass(classItem._id)}
                    >
                      <p className="text-lg font-semibold">{classItem.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No classes available for this subject</p>
              )}
            </>
          )}
        </div>
      )}
      {selectedSubject && selectedClass && !addingNote && !selectedStudent && (
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBackClick}
              className="text-green-500 hover:text-green-300"
            >
              <FontAwesomeIcon icon={faArrowCircleLeft} /> Back
            </button>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Students of Class
            </h2>
            {/* Display students table */}
            {students.length > 0 ? (
              <table className="w-full border rounded-sm shadow-md">
                <thead>
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td className="border px-4 py-2">{student._id}</td>
                      <td className="border px-4 py-2">{student.name}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleViewNotes(student._id)}
                          className="bg-blue-500 hover:bg-blue-300 text-white font-bold py-1 px-2 rounded mr-2"
                        >
                          View Notes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div>No students in this class</div>
            )}
          </div>
        </div>
      )}
      {selectedStudent && (
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBackClick}
              className="text-green-500 hover:text-green-300"
            >
              <FontAwesomeIcon icon={faArrowCircleLeft} /> Back
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">
            Notes for Student{" "}
            {students.find((student) => student._id === selectedStudent).name}
          </h2>
          <div className="mt-4 flex justify-between">
            <button
              onClick={handleAddNote}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Note
            </button>
          </div>
          {notes.length > 0 ? (
            <div>
              <table className="table-auto">
                <thead>
                  <tr>
                    <th>Note ID</th>
                    <th>Note</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map((note) => (
                    <tr key={note.id}>
                      <td>{note.id}</td>
                      <td>{note.text}</td>
                      <td>
                        <button className="text-blue-500 hover:text-blue-700 mr-2">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No notes available for this student</p>
          )}
        </div>
      )}
      {addingNote && (
        <div className="mt-8">
          <div className="flex items-center mb-4">
            <button
              onClick={handleBackClick}
              className="text-green-500 hover:text-green-300"
            >
              <FontAwesomeIcon icon={faArrowCircleLeft} /> Back
            </button>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">Add Note</h2>
          <div className="mt-4">
            <h3 className="text-xl font-bold mb-2">Add Note</h3>
            <div className="flex mb-4">
              <label className="mr-2">Note Type:</label>
              <select
                value={noteType}
                onChange={(e) => setNoteType(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="Normal">Normal</option>
                <option value="Special">Special (EFM)</option>
              </select>
            </div>
            <div className="flex mb-4">
              <label className="mr-2">Note Content:</label>
              <input
                value={noteContent}
                type="number"
                onChange={(e) => setNoteContent(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1"
              />
            </div>
            <button
              onClick={handleSaveNote}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Save Note
            </button>
            <button
              onClick={handleCancelAddNote}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
