import React, { useState } from "react";
import Lottie from "lottie-react";
import axios from "axios";
import apiBaseUrl from "../../server/server.js";
import LoginData from "../../animation/login.json";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const nav = useNavigate();
  const { login } = useAuth();

  console.log(apiBaseUrl);

  const handleLoginClick = async () => {
    try {
      // Validate email and password
      if (!email || !password) {
        setError("Please enter both email and password");
        return;
      }

      const response = await axios.post(`${apiBaseUrl}/api/auth/login`, {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);

      // Fetch user details
      const userDetailsResponse = await axios.get(`${apiBaseUrl}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { id, role, name } = userDetailsResponse.data;
      login({ id, email, role, name });

      // Redirect based on role
      if (role === "teacher") {
        nav("/teacher-dashboard");
      } else if (role === "student") {
        nav("/student-dashboard");
      } else if (role === "admin") {
        nav("/admin-dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const handleForgotPasswordClick = () => {
    nav("/reset-password");
  };

  const handleBackClick = () => {
    nav("/");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-md p-6 md:p-12 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        {/* Left Box */}
        <div className="w-full md:w-1/2 bg-green-500 text-white rounded-md p-6 flex flex-col items-center justify-center">
          <div className="mb-3  md:w-auto">
            <Lottie animationData={LoginData} />
          </div>

          <p className="text-3xl font-semibold">Be Verified</p>
          <p className="text-sm md:text-base text-center">
            Join experienced Educators on this platform.
          </p>
        </div>
        {/* Right Box */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="mb-6 flex flex-col justify-center items-center">
            <h2 className="text-3xl font-semibold mb-2 ">Welcome</h2>
            <p className="text-center">We are happy to have you Here.</p>
          </div>
          <div className="mb-4">
            <input
              name="email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-100 w-full py-3 px-4 rounded-lg mb-3"
              placeholder="Email address"
              required
            />
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-100 w-full py-3 px-4 rounded-lg"
              placeholder="Password"
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex justify-between items-center mb-6">
            <label htmlFor="remember" className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="border-gray-300"
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
            className=" mb-4 text-green-500 hover:bg-green-500 hover:text-white border-green-500 w-full py-3 border rounded-lg"
          >
            Login
          </button>
          <button
            onClick={handleBackClick}
            className=" bg-gray-400 text-white hover:text-gray-400 hover:bg-white border-gray-500 py-3 border rounded-lg w-full"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
