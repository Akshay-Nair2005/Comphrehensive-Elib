import React, { createContext, useState, useEffect } from "react";
import { account } from "../appwrite/appwrite";

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await account.get();
        setUser(response);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

// Default export
export default AuthProvider;
