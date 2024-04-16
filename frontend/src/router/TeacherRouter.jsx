import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "../layouts/navbar/Navbar";
import TeacherSidebar from "../layouts/sidebar/TeacherSidebar";
import Content from "../container/Content";
import Profile from "../components/Profile";
import Notes from "../components/Notes";

const TeacherRouter = () => {
  return (
    <div className="flex  overflow-hidden h-screen">
      <TeacherSidebar />
      <div className="flex flex-col w-full">
        <Navbar />
        <Routes>
          <Route path="/" element={<Content />}>
            <Route index element={<Profile />} />
            <Route path="notes" element={<Notes />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default TeacherRouter;
