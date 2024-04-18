import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "../layouts/navbar/Navbar";
import StudentSidebar from "../layouts/sidebar/StudentSidebar";
import Content from "../container/Content";
import Profile from "../components/Profile";
import StudentNotes from "../components/StudentNotes";

const StudentRouter = () => {
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
      <StudentSidebar sidebarOpen={sidebarOpen} />
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
              <Route path="notes" element={<StudentNotes />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default StudentRouter;
