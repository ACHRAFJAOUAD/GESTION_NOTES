import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import NotFound from "./pages/NotFound.jsx";
import Login from "./components/auth/Login.jsx";
import Home from "./pages/Home.jsx";

import Content from "./container/Content.jsx";
import AdminRouter from "./router/AdminRouter.jsx";
import TeacherRouter from "./router/TeacherRouter.jsx";
import StudentRouter from "./router/StudentRouter.jsx";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin-dashboard/*" element={<AdminRouter />} />
        <Route path="/teacher-dashboard/*" element={<TeacherRouter />} />
        <Route path="/student-dashboard/*" element={<StudentRouter />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
