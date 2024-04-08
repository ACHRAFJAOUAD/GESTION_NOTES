import React from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import Navbar from "../layouts/Navbar.jsx";

function TeacherDashboard() {
  const { user } = useAuth();
  console.log(user);

  return (
    <div>
      {user ? (
        <>
          <Navbar />
          <div>
            <p>Welcome, {user.name}</p>
            <p>Email, {user.email}</p>
            <p>Role, {user.role}</p>
          </div>
        </>
      ) : (
        <p>Something went wrong !!</p>
      )}
    </div>
  );
}

export default TeacherDashboard;
