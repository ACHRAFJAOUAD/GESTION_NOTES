import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("users");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const login = (userData) => {
    try {
      setUser(userData);
      localStorage.setItem("users", JSON.stringify(userData));
    } catch (error) {
      console.error("Error storing user data in localStorage:", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("users");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
