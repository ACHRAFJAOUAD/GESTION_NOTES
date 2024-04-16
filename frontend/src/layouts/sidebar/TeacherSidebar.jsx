import React from "react";
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUser,
  faMarker,
  faChampagneGlasses,
} from "@fortawesome/free-solid-svg-icons";

const TeacherSidebar = () => {
  return (
    <div className="sidebar bg-gray-100 text-gray-600 w-1/4 px-6 h-screen left-0 z-1 flex flex-col justify-between shadow-2xl">
      <div>
        <div className="p-4 flex justify-center  items-center">
          <img
            src="/IconPage.jpg"
            alt="User Avatar"
            className="h-12 w-12 rounded-full "
          />
        </div>
        <ul className="space-y-6 pt-16 ">
          <li>
            <NavLink
              to="/teacher-dashboard"
              end
              className={({ isActive }) =>
                isActive
                  ? " rounded-xl text-white bg-green-500 nav-link flex items-center px-4 py-3"
                  : " rounded-xl nav-link flex items-center px-8 py-3 hover:bg-green-200 hover:text-green-600 "
              }
            >
              <FontAwesomeIcon icon={faUser} />
              <span className="ml-3">Profile</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/teacher-dashboard/notes"
              className={({ isActive }) =>
                isActive
                  ? " rounded-xl text-white  bg-green-500 nav-link flex items-center px-4 py-3"
                  : " rounded-xl nav-link flex items-center px-8 py-3 hover:bg-green-200 hover:text-green-600 "
              }
            >
              <FontAwesomeIcon icon={faMarker} />
              <span className="ml-3">Notes</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherSidebar;