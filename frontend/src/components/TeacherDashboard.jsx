import React from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

function TeacherDashboard() {
  const { user, logout } = useAuth();
  console.log(user);
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };
  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}</p>
          <p>Email, {user.email}</p>
          <p>Role, {user.role}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}

export default TeacherDashboard;
