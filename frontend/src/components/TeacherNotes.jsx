import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowCircleLeft,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const TeacherNotes = ({ teacherId }) => {
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
      .get(`http://localhost:3001/api/subjects/teacher/${teacherId}`)
      .then((response) => {
        console.log("subject data:", response.data);
        setSubjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error);
      });
  }, [teacherId]);

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
      setAddingNote(false);
      setNoteContent("");
      setNoteType("Normal");
    } else if (selectedStudent) {
      setSelectedStudent(null);
      setNotes([]);
    } else if (selectedClass) {
      setSelectedClass(null);
      setStudents([]);
      setNotes([]);
    } else if (selectedSubject) {
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
      {/* Other sections remain the same */}
    </div>
  );
};

export default TeacherNotes;
