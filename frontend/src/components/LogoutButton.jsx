import React from "react";
import { account } from "../appwritee/appwrite";

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      alert("Logged out successfully!");
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
