import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="bg-transparent text-gray-600 w-full p-4 shadow-md flex justify-between items-center">
      {/* Menu Icon */}

      <button className="focus:outline-none md:hidden" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faBars} className="h-6 w-6 text-gray-700" />
      </button>
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/IconPage.jpg"
          alt="Site Icon"
          className="h-12 w-12 rounded-full mr-4 hidden md:block"
        />
        <NavLink to="/" className="text-xl font-bold hidden md:block">
          <h1>
            Academy<span className="text-green-500">Vista</span>{" "}
          </h1>
        </NavLink>
      </div>
      <ul className="flex items-center  ml-auto">
        {user ? (
          <li className="p-3 border-r-4  capitalize">{user.role}</li>
        ) : null}
        <li className=" pl-2">
          <button
            className="bg-white text-green-500 hover:text-white hover:bg-green-400 font-bold mr-4 px-5 py-3 border border-green-400 rounded"
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
