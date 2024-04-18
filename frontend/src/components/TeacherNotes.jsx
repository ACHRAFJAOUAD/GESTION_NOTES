import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleLeft,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";

const TeacherNotes = () => {
  const { user } = useAuth();

  const [teacherId, setTeacherId] = useState(user.id);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [notes, setNotes] = useState([]);
  const [addingNote, setAddingNote] = useState(false);
  const [normalNotes, setNormalNotes] = useState([]);
  const [specialNote, setSpecialNote] = useState("");
  const [noteType, setNoteType] = useState("Normal");
  const [isAddingNoteInProgress, setIsAddingNoteInProgress] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/subjects/teacher/${teacherId}`)
      .then((response) => {
        console.log("subject data:", response.data);
        setSubjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }, [teacherId]);

  useEffect(() => {
    if (selectedStudent && selectedSubject) {
      console.log(
        "the selected student and the  selected subject :",
        selectedStudent,
        selectedSubject
      );
      fetchNotesForStudent(selectedStudent, selectedSubject._id);
    }
  }, [selectedStudent, selectedSubject]);

  const handleLessonClick = (subject) => {
    setSelectedSubject(subject);
    const subjectId = subject._id;
    setLoading(true);

    setNotes([]);

    setSelectedClass(null);
    setStudents([]);

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
      // If addingNote is true, reset states related to adding a note
      setAddingNote(false);
      setNormalNotes([]);
      setSpecialNote("");
      setNoteType("Normal");
      if (selectedStudent) {
        fetchNotesForStudent(selectedStudent);
      }
    } else if (editMode) {
      // If editMode is true, reset states related to editing a note
      setEditMode(false);
      setEditNoteId(null);
      setNormalNotes([]);
      setSpecialNote("");
      setNoteType("Normal");
      fetchNotesForStudent(selectedStudent);
    } else if (selectedStudent) {
      // If a student is selected, reset states related to the selected student
      fetchNotesForStudent(selectedStudent);
      setSelectedStudent(null);
    } else if (selectedClass) {
      // If a class is selected, reset states related to the selected class
      setSelectedClass(null);
      setStudents([]);
      setNotes([]);
    } else if (selectedSubject) {
      // If a subject is selected, reset states related to the selected subject
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

  const fetchNotesForStudent = (studentId, subjectId) => {
    console.log("id subject selected :", subjectId);

    axios
      .get(
        `http://localhost:3001/api/notes/student/${studentId}/subject/${subjectId}`
      )
      .then((response) => {
        console.log("Notes students :", response.data);

        setNotes(response.data);
        // Set the noteType and specialNote if they exist in the response
        if (response.data.length > 0) {
          const firstNote = response.data[0];
          const initialNoteType = firstNote.noteType;
          setNoteType(initialNoteType);
          console.log("special note stuff", firstNote.specialNote);

          // Check if specialNote exists and set it if it does
          if (initialNoteType === "Special" && firstNote.specialNote) {
            setSpecialNote(firstNote.specialNote);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching notes:", error);
      });
  };

  const handleViewNotes = (studentId) => {
    console.log("view notes Id students:", studentId);

    setSelectedStudent(studentId);
    if (selectedSubject) {
      const subjectId = selectedSubject._id;
      fetchNotesForStudent(studentId, subjectId);
      setAddingNote(false);
    } else {
      console.error("No subject selected");
    }
  };

  const handleAddNote = () => {
    setAddingNote(true);
    setEditMode(false);
    setEditNoteId(null);
    setNormalNotes(Array(4).fill(""));
    setSpecialNote("");
    setNoteType("Normal");
  };

  const handleCancelAddNote = () => {
    setAddingNote(false);
    setEditMode(false);
    setEditNoteId(null);
    setNormalNotes([]);
    setSpecialNote("");
    setNoteType("Normal");

    if (selectedStudent) {
      setSelectedStudent(null);
    }
  };

  const handleSaveNote = () => {
    if (!selectedStudent || !selectedSubject || !noteType) {
      console.error("Invalid input data");
      return;
    }

    console.log("Note type before sending request:", noteType);
    console.log("Score before sending request:", notes);

    const apiUrl = editMode
      ? `http://localhost:3001/api/notes/${editNoteId}`
      : "http://localhost:3001/api/notes";

    axios({
      method: editMode ? "put" : "post",
      url: apiUrl,
      data: {
        id: editMode ? editNoteId : null,
        studentId: selectedStudent,
        subjectId: selectedSubject._id,

        normalNotes: normalNotes,
        specialNote: specialNote,
      },
    })
      .then((response) => {
        console.log(
          editMode
            ? "Note updated successfully:"
            : "Note created successfully:",
          response.data
        );
        setAddingNote(false);
        setEditMode(false);
        setEditNoteId(null);
        setNormalNotes(Array(4).fill(""));
        setSpecialNote("");
        setNoteType("Normal");

        fetchNotesForStudent(selectedStudent);
      })
      .catch((error) => {
        console.error(
          editMode ? "Error updating note:" : "Error creating note:",
          error
        );
      });
  };

  const handleEditNote = (noteId) => {
    const noteToEdit = notes.find((note) => note._id === noteId);

    if (!noteToEdit) {
      console.error(`Note with ID ${noteId} not found.`);
      return;
    }

    console.log("Editing note:", noteToEdit);
    console.log("Special note to edit:", noteToEdit.specialNote);

    // Set noteType based on the presence of specialNote and normalNotes
    let noteType = "Normal";
    if (noteToEdit.specialNote) {
      noteType = "Special";
    }
    //  else if (noteToEdit.normalNotes && noteToEdit.normalNotes.length > 0) {
    //   noteType = "Normal";
    // }

    console.log("Note type:", noteType);

    // Set specialNote state if it exists
    if (noteToEdit.specialNote) {
      setSpecialNote(noteToEdit.specialNote);
    } else {
      // Set specialNote state to empty string if it doesn't exist
      setSpecialNote();
    }

    // Set normalNotes state
    setNormalNotes(noteToEdit.normalNotes || []);

    // Set edit mode and edit note ID
    setEditMode(true);
    setEditNoteId(noteId);
    setAddingNote(false);
  };

  const handleDeleteNote = (noteId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (confirmDelete) {
      axios
        .delete(`http://localhost:3001/api/notes/${noteId}`)
        .then((response) => {
          console.log("Note deleted successfully");
          fetchNotesForStudent(selectedStudent);
        })
        .catch((error) => {
          console.error("Error deleting note:", error);
        });
    }
  };
  useEffect(() => {
    console.log("Special note after setting:", specialNote);
  }, [specialNote]);

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
      {selectedStudent && !addingNote && !editMode && (
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
              disabled={
                isAddingNoteInProgress ||
                (selectedStudent &&
                  selectedSubject &&
                  notes.some(
                    (note) =>
                      note.studentId === selectedStudent &&
                      note.subjectId === selectedSubject._id
                  ))
              }
              onClick={handleAddNote}
              className={`bg-${
                notes.some(
                  (note) =>
                    note.studentId === selectedStudent &&
                    note.subjectId === selectedSubject._id
                )
                  ? "red"
                  : "blue"
              }-500 hover:bg-${
                notes.some(
                  (note) =>
                    note.studentId === selectedStudent &&
                    note.subjectId === selectedSubject._id
                )
                  ? "red"
                  : "blue"
              }-700 text-white font-bold py-2 px-4 rounded ${
                isAddingNoteInProgress
                  ? "opacity-50 cursor-not-allowed"
                  : notes.some(
                      (note) =>
                        note.studentId === selectedStudent &&
                        note.subjectId === selectedSubject._id
                    )
                  ? "cursor-not-allowed"
                  : ""
              }`}
            >
              {notes.some(
                (note) =>
                  note.studentId === selectedStudent &&
                  note.subjectId === selectedSubject._id
              )
                ? "Already Added"
                : "Add Note"}
            </button>
          </div>
          {/* Notes table */}
          {notes.length > 0 ? (
            <div>
              <table className="w-full border rounded-sm shadow-md mt-4">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Note 1</th>
                    <th className="px-4 py-2">Note 2</th>
                    <th className="px-4 py-2">Note 3</th>
                    <th className="px-4 py-2">Note 4</th>

                    <td className="px-4 py-2">EFM</td>

                    <th className="px-4 py-2">Edit</th>
                    <th className="px-4 py-2">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map((note, index) => (
                    <tr key={note._id} className="text-center">
                      {[...Array(4)].map((_, i) => (
                        <td key={i} className="border px-4 py-2">
                          {i < note.normalNotes.length
                            ? note.normalNotes[i]
                            : ""}
                        </td>
                      ))}
                      {/* Render EFM (special note) */}
                      <td className="border px-4 py-2">{note.specialNote}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleEditNote(note._id)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleDeleteNote(note._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {/* Display average note */}
                  <tr>
                    <td className="border px-4 py-2">Average Note</td>
                    <td className="border px-4 py-2">
                      {/* Calculate and display the average note */}
                      {notes.reduce((acc, note) => {
                        if (note.noteType === "Special") {
                          return acc + note.specialNote;
                        } else {
                          return (
                            acc +
                            note.normalNotes.reduce((sum, val) => sum + val, 0)
                          );
                        }
                      }, 0) / notes.length}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p>No notes available for this student</p>
          )}
        </div>
      )}
      {/* add form displaying */}

      {addingNote && !editMode && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Add Note</h2>
          <div className="mt-4 shadow-md p-6">
            {/* Check if there are already four normal notes and one special note */}
            {notes.filter((note) => note.noteType === "Normal").length === 4 &&
            notes.some((note) => note.noteType === "Special") ? (
              <p className="text-red-500 mb-4">
                You have already added enough notes.
              </p>
            ) : (
              <>
                <div className="flex mb-4">
                  <label className="mr-2">Note Type:</label>
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    {/* Render options based on existing notes */}
                    {!notes.some((note) => note.noteType === "Special") && (
                      <option value="Special">Special (EFM)</option>
                    )}
                    {/* Only render Normal option if less than 4 normal notes */}
                    {notes.filter((note) => note.noteType === "Normal").length <
                      4 && <option value="Normal">Normal</option>}
                  </select>
                </div>
                {/* Render input for normal notes */}
                {noteType === "Normal" && (
                  <>
                    {[...Array(4)].map((_, index) => (
                      <div className="flex mb-4" key={index}>
                        <label className="mr-2">Note {index + 1}:</label>
                        <input
                          type="number"
                          value={normalNotes[index] || ""}
                          max={20}
                          min={0}
                          step="0.25"
                          onChange={(e) => {
                            const newNotes = [...normalNotes];
                            newNotes[index] = parseFloat(e.target.value);
                            setNormalNotes(newNotes);
                          }}
                          className="border border-gray-300 rounded px-2 py-1"
                        />
                      </div>
                    ))}
                  </>
                )}
                {/* Render input for special note (EFM) */}
                {noteType === "Special" && (
                  <div className="flex mb-4">
                    <label className="mr-2">EFM:</label>
                    <input
                      type="number"
                      value={specialNote}
                      max={40}
                      min={0}
                      step="0.25"
                      onChange={(e) =>
                        setSpecialNote(parseFloat(e.target.value))
                      }
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
                )}
                {/* Save Note and Cancel buttons */}
                <div className="flex justify-between">
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
              </>
            )}
          </div>
        </div>
      )}
      {/* edit form displaying */}
      {editMode && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Edit Note</h2>
          <div className="mt-4 shadow-md p-6">
            <div className="flex mb-4">
              <label className="mr-2">Note Type:</label>
              <select
                value={noteType}
                onChange={(e) => {
                  setNoteType(e.target.value);
                  console.log("Selected note type:", e.target.value);
                }}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option>Pick a type ...</option>

                {/* Render options based on existing notes */}
                {!notes.some((note) => note.noteType === "Special") && (
                  <option value="Special">Special (EFM)</option>
                )}
                {/* Only render Normal option if less than 4 normal notes */}
                {notes.filter((note) => note.noteType === "Normal").length <
                  4 && <option value="Normal">Normal</option>}
              </select>
            </div>
            {/* Render input for normal notes */}
            {noteType === "Normal" && (
              <>
                {[...Array(4)].map((_, index) => (
                  <div className="flex mb-4" key={index}>
                    <label className="mr-2">Note {index + 1}:</label>
                    <input
                      type="number"
                      value={normalNotes[index] || ""}
                      max={20}
                      min={0}
                      step="0.25"
                      onChange={(e) =>
                        setNormalNotes([
                          ...normalNotes.slice(0, index),
                          parseFloat(e.target.value),
                          ...normalNotes.slice(index + 1),
                        ])
                      }
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
                ))}
              </>
            )}
            {/* Render input for special note (EFM) */}
            {noteType === "Special" && (
              <div className="flex mb-4">
                <label className="mr-2">EFM:</label>
                <input
                  type="number"
                  value={specialNote}
                  max={40}
                  min={0}
                  step="0.25"
                  onChange={(e) => {
                    console.log("Before setting special note:", specialNote);
                    setSpecialNote(parseFloat(e.target.value)),
                      console.log("After setting special note:", specialNote);
                  }}
                  className="border border-gray-300 rounded px-2 py-1"
                />
              </div>
            )}
            {/* Save Note and Cancel buttons */}
            <div className="flex justify-between">
              <button
                onClick={handleSaveNote}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Save Note
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setEditNoteId(null);
                  setNormalNotes([]);
                  setSpecialNote("");
                  setNoteType("Normal");
                }}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherNotes;
