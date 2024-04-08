import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="bg-transparent text-gray-600 w-screen top-0 z-1 flex justify-between items-center p-4">
      <div className="flex items-center">
        <img
          src="/IconPage.jpg"
          alt="Site Icon"
          className="h-12 w-12 rounded-full mr-4"
        />
        <NavLink to="/" className="text-xl font-bold">
          <h1>
            Academy<span className="text-green-500">Vista</span>{" "}
          </h1>
        </NavLink>
      </div>
      <ul className="space-x-4 mr-4 flex items-center justify-center">
        {user ? (
          <li className=" p-2 border-r-2 capitalize">{user.role}</li>
        ) : null}
        <li>
          <button
            className=" bg-white text-green-500 hover:text-white hover:bg-green-400 font-bold mr-4 px-5 py-3 border  border-green-400 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
