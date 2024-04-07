import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import NotFound from "./pages/NotFound.jsx";
import Login from "./components/auth/Login.jsx";
import Home from "./pages/Home.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import TeacherDashboard from "./components/TeacherDashboard.jsx";
import StudentDashboard from "./components/StudentDashboard.jsx";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
