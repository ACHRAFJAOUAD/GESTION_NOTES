import React, { useState } from "react";
import Lottie from "lottie-react";
import axios from "axios";

import LoginData from "../../animation/login.json";
import { useAuth } from "../../contexts/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const handleLoginClick = async () => {
    try {
      // Validate email and password
      if (!email || !password) {
        setError("Please enter both email and password");
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          email,
          password,
        }
      );

      const { token } = response.data;
      console.log(token);
      localStorage.setItem("token", token);

      // Fetch user details
      const userDetailsResponse = await axios.get(
        "http://localhost:3001/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(userDetailsResponse.data);
      const { role, name } = userDetailsResponse.data;

      login({ email, role, name });

      // Redirect based on role
      if (role === "teacher") {
        window.location.href = "/teacher-dashboard";
      } else if (role === "student") {
        window.location.href = "/student-dashboard";
      } else if (role === "admin") {
        window.location.href = "/admin-dashboard";
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.log(err);
      setError("Invalid email or password");
    }
  };

  const handleForgotPasswordClick = () => {
    // Handle forgot password
    alert("Forgot password clicked!");
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="bg-white shadow-md rounded-md p-6 md:p-12 md:flex md:space-x-6">
        {/* Left Box */}
        <div className=" w-96 bg-green-500 text-white rounded-md p-6 flex flex-col items-center justify-center">
          <div className="mb-3">
            <Lottie animationData={LoginData} />
          </div>
          <p className="text-3xl font-semibold">Be Verified</p>
          <p className="text-sm md:text-base">
            Join experienced Educators on this platform.
          </p>
        </div>
        {/* Right Box */}
        <div className=" w-1/2 justify-center items-center   flex flex-col">
          <div className="mb-6 flex flex-col justify-center items-center">
            <h2 className="text-3xl font-semibold mb-2">Welcome</h2>
            <p>We are happy to have you Here.</p>
          </div>
          <div className="mb-4">
            <input
              name="email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className=" bg-gray-100 w-full  py-3 px-4 rounded-lg mb-3"
              placeholder="Email address"
              required
            />
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" bg-gray-100 w-full md:text-lg py-3 px-4 rounded-lg"
              placeholder="Password"
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex space-x- space-x-48   mb-6">
            <label htmlFor="remember" className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className=" border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-600">Remember Me</span>
            </label>
            <a
              href="#"
              className="text-green-500 text-sm border-b border-green-500"
              onClick={handleForgotPasswordClick}
            >
              Forgot Password?
            </a>
          </div>

          <button
            onClick={handleLoginClick}
            className="text-green-500 hover:bg-green-500 hover:text-white border-green-500 w-80 border py-3 rounded-lg mb-4"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
