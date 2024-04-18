import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { NavLink } from "react-router-dom";
import animationData from "../animation/landing_animation.json";
import PreloadScene from "../animation/PreloadScene";
import HomeNavbar from "../layouts/navbar/HomeNavbar";

function Home() {
  const [isLoading, setIsLoading] = useState(true);

  //  loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden flex flex-col">
      {isLoading ? (
        <PreloadScene />
      ) : (
        <div className="flex flex-grow flex-col">
          <HomeNavbar />
          <div className="flex-grow flex items-center justify-center mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:ml-10">
              <div className="md:w-1/2 mt-8 md:mt-16 md:ml-10">
                <h1 className="text-4xl font-bold">School Management System</h1>
                <div>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    AcademyVista is Management System for schools, colleges, and
                    universities, optimizing operations and enhancing
                    educational outcomes. Empowering administrators with
                    comprehensive tools to streamline operations.
                  </p>
                </div>
                <div className="flex justify-center mt-4 md:mt-8">
                  <NavLink
                    to="/Login"
                    className="inline-block px-6 py-3 text-lg font-bold text-green-500 bg-white border border-green-500 rounded-full hover:text-white hover:bg-green-500 transition duration-300 ease-in-out"
                  >
                    Explore More
                  </NavLink>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <Lottie animationData={animationData} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
