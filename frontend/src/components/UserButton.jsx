import React, { useEffect, useState } from "react";
import { account } from "../appwritee/appwrite";

const UserButton = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await account.get();
        setUser(userData);
      } catch (error) {
        console.error("No user logged in:", error);
      }
    };
    fetchUser();
  }, []);

  const getInitial = (nameOrEmail) => {
    return nameOrEmail ? nameOrEmail.charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="flex items-center space-x-3">
      {user ? (
        <>
          <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white font-bold rounded-full">
            {getInitial(user.name || user.email)}
          </div>
          <p className="text-sm font-medium">
            Welcome, {user.name || user.email}!
          </p>
        </>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  );
};

export default UserButton;
