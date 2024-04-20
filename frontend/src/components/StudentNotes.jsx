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

  const apiBaseUrl =
    "https://gestion-notes-backend.vercel.app" || "http://localhost:3001";

  useEffect(() => {
    const fetchStudentSubjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiBaseUrl}/api/subjects`);
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
        `${apiBaseUrl}/api/notes/subject/${subjectId}`
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
            <div className="grid grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <div
                  key={subject._id}
                  className="border border-gray-300 p-4 cursor-pointer shadow-md overflow-hidden"
                  onClick={() => handleSubjectClick(subject._id)}
                >
                  <p className="text-lg font-semibold truncate">
                    {subject.name}
                  </p>
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
                    <th className="px-4 py-2">Average Note</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map((note) => (
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
                        {/* Calculate and display the average note */}
                        {notes.reduce((acc, note) => {
                          if (note.noteType === "Special") {
                            return acc + note.specialNote;
                          } else {
                            return (
                              acc +
                              note.normalNotes.reduce(
                                (sum, val) => sum + val,
                                0
                              )
                            );
                          }
                        }, 0) / notes.length}
                      </td>{" "}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Notes not available </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentNotes;
