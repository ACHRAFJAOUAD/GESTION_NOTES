import React from "react";

function Home() {
  return (
    <>
      <nav className="bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold">Logo</h2>
        <ul className="flex space-x-4">
          <li className="hover:text-gray-300">Home</li>
          <li className="hover:text-gray-300">Login</li>
          <li className="hover:text-gray-300">About us</li>
        </ul>
      </nav>
    </>
  );
}

export default Home;
