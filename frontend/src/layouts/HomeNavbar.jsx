import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function HomeNavbar() {
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
      <ul className="space-x-2 mr-4">
        <li>
          <NavLink
            to="/Login"
            className=" bg-white text-green-500 hover:text-white hover:bg-green-400 font-bold mr-4 px-5 py-3 border  border-green-400 rounded"
          >
            Login
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default HomeNavbar;
