import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AdminSidebar from "../layouts/sidebar/AdminSidebar";
import Navbar from "../layouts/navbar/Navbar";
import Content from "../container/Content";
import Profile from "../components/Profile";
import Classes from "../components/Classes";
import Notes from "../components/Notes";
import Subjects from "../components/Subjects";
import StudentCrud from "../components/StudentCrud";
import TeacherCrud from "../components/TeacherCrud";

const AdminRouter = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex overflow-hidden h-screen">
      <AdminSidebar sidebarOpen={sidebarOpen} />

      <div
        className={`flex flex-col w-full ${
          sidebarOpen ? "ml-64" : "ml-0"
        } transition-all duration-300`}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <div
          className={`flex w-full justify-center ${
            sidebarOpen ? "ml-0" : "ml-0"
          }`}
        >
          <Routes>
            <Route path="/" element={<Content />}>
              <Route index element={<Profile />} />
              <Route path="notes" element={<Notes />} />
              <Route path="classes" element={<Classes />} />
              <Route path="subjects" element={<Subjects />} />
              <Route path="students/*" element={<StudentCrud />} />
              <Route path="teachers/*" element={<TeacherCrud />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminRouter;
