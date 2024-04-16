import React from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "../layouts/navbar/Navbar";
import StudentSidebar from "../layouts/sidebar/StudentSidebar";
import Content from "../container/Content";
import Profile from "../components/Profile";
import StudentNotes from "../components/StudentNotes";

const StudentRouter = () => {
  return (
    <div className="flex  overflow-hidden h-screen">
      <StudentSidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <Routes>
          <Route path="/" element={<Content />}>
            <Route index element={<Profile />} />
            <Route path="notes" element={<StudentNotes />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default StudentRouter;
