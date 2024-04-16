import React from "react";
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
  return (
    <div className="flex overflow-hidden h-screen">
      <AdminSidebar />
      <div className="flex flex-col w-full">
        <Navbar />
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
  );
};

export default AdminRouter;
