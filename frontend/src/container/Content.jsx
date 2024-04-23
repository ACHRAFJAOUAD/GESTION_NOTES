import React from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../layouts/sidebar/AdminSidebar";
import TeacherSidebar from "../layouts/sidebar/TeacherSidebar";
import StudentSidebar from "../layouts/sidebar/StudentSidebar";

const Content = () => {
  let SidebarComponent;

  if (window.location.pathname.includes("/admin-dashboard")) {
    SidebarComponent = AdminSidebar;
  } else if (window.location.pathname.includes("/teacher-dashboard")) {
    SidebarComponent = TeacherSidebar;
  } else if (window.location.pathname.includes("/student-dashboard")) {
    SidebarComponent = StudentSidebar;
  } else {
    SidebarComponent = StudentSidebar;
  }

  return (
    <div className="p-10  md:px-20 lg:px-32 xl:px-40 overflow-x-scroll md:overflow-hidden lg:overflow-hidden">
      <Outlet />
    </div>
  );
};

export default Content;
