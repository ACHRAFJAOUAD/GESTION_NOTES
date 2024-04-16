import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const StudentNotes = () => {
  const { user } = useAuth();

  const [studentId, setStudentId] = useState(user.id);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [noNotes, setNoNotes] = useState(false);

  useEffect(() => {
    const fetchStudentSubjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3001/api/subjects");
        const subjectsData = response.data;
        const studentSubjects = subjectsData.filter((subject) =>
          subject.classIds.some((classId) =>
            classId.students.includes(studentId)
          )
        );
        setSubjects(studentSubjects);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setLoading(false);
      }
    };

    fetchStudentSubjects();
  }, [studentId]);

  const fetchNotesForSubject = async (subjectId) => {
    try {
      setLoadingNotes(true);
      const response = await axios.get(
        `http://localhost:3001/api/notes/subject/${subjectId}`
      );
      const notesData = response.data;
      setNotes(notesData);
      setLoadingNotes(false);
      setNoNotes(notesData.length === 0);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setLoadingNotes(false);
    }
  };

  const handleSubjectClick = (subjectId) => {
    setSelectedSubject(subjectId);
    fetchNotesForSubject(subjectId);
  };

  const handleBackClick = () => {
    setSelectedSubject(null);
    setNotes([]);
    setNoNotes(false);
  };

  return (
    <div className="container mx-auto p-4">
      {!selectedSubject ? (
        <div>
          <h1 className="text-2xl font-bold mb-4 text-center">Subjects</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <div
                  key={subject._id}
                  className="border border-gray-300 p-4 cursor-pointer shadow-md"
                  onClick={() => handleSubjectClick(subject._id)}
                >
                  <p className="text-lg font-semibold">{subject.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={handleBackClick}
            className="text-green-500 hover:text-green-300"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </button>
          <h2 className="text-xl text-center  my-5 ">
            Notes of {subjects.find((sub) => sub._id === selectedSubject)?.name}
          </h2>

          {noNotes ? (
            <p className="text-center">There are no notes available.</p>
          ) : loadingNotes ? (
            <p>Loading notes...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th>Note 1</th>
                  <th>Note 2</th>
                  <th>Note 3</th>
                  <th>Note 4</th>
                  <th>EFM</th>
                  <th>Final Note</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => (
                  <tr key={note._id}>
                    <td>{note.noteNumber === 1 ? note.content : ""}</td>
                    <td>{note.noteNumber === 2 ? note.content : ""}</td>
                    <td>{note.noteNumber === 3 ? note.content : ""}</td>
                    <td>{note.noteNumber === 4 ? note.content : ""}</td>
                    <td>{note.isSpecialNote ? note.content : ""}</td>
                    <td>{note.noteNumber === 5 ? note.content : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentNotes;
