import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { account } from "../../appwritee/appwrite";
import {
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaUserCircle,
  FaBook,
  FaBookOpen,
  FaComment,
} from "react-icons/fa";
import { AiOutlineRobot } from "react-icons/ai";

import { BsChatDots } from "react-icons/bs";

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const userDetails = await account.get();
        setUser(userDetails);
      } catch (err) {
        setUser(null);
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      const confirmation = confirm("Do you want to logout?");
      if (confirmation) {
        await account.deleteSession("current");
        setUser(null);
        navigate("/login");
      } else {
        console.log("Logout cancelled by the user.");
      }
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <div className="sticky top-0">
      <div className="flex flex-col bg-nav text-button w-20 hover:w-60 transition-all duration-300 h-screen group">
        <div className="flex justify-center items-center mt-8">
          <NavLink to="/">
            <img className="w-16" src="/images/logoo.svg" alt="Logo" />
          </NavLink>
        </div>

        <ul className="mt-10 space-y-6">
          <li className="relative group">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center space-x-4 pl-4 py-3 rounded-r-full transition-all duration-300 ${
                  isActive
                    ? "bg-beige text-black"
                    : "hover:bg-[#E1CDBB]  hover:text-black text-white"
                }`
              }
            >
              <FaHome />
              <span className="hidden group-hover:inline-block">Home</span>
            </NavLink>
          </li>
          <li className="relative group">
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center space-x-4 pl-4 py-3 rounded-r-full transition-all duration-300 ${
                  isActive
                    ? "bg-beige text-black"
                    : "hover:bg-[#E1CDBB] hover:text-black text-white"
                }`
              }
            >
              <FaInfoCircle />
              <span className="hidden group-hover:inline-block">About</span>
            </NavLink>
          </li>
          <li className="relative group">
            <NavLink
              to="/userbooks"
              className={({ isActive }) =>
                `flex items-center space-x-4 pl-4 py-3 rounded-r-full transition-all duration-300 ${
                  isActive
                    ? "bg-beige text-black"
                    : "hover:bg-[#E1CDBB] hover:text-black text-white"
                }`
              }
            >
              <FaBook />
              <span className="hidden group-hover:inline-block">
                Your Books
              </span>
            </NavLink>
          </li>
          <li className="relative group">
            <NavLink
              to="/saved"
              className={({ isActive }) =>
                `flex items-center space-x-4 pl-4 py-3 rounded-r-full transition-all duration-300 ${
                  isActive
                    ? "bg-beige text-black"
                    : "hover:bg-[#E1CDBB] hover:text-black text-white"
                }`
              }
            >
              <FaBookOpen />
              <span className="hidden group-hover:inline-block">
                Saved Books
              </span>
            </NavLink>
          </li>
          <li className="relative group">
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                `flex items-center space-x-4 pl-4 py-3 rounded-r-full transition-all duration-300 ${
                  isActive
                    ? "bg-beige text-black"
                    : "hover:bg-[#E1CDBB] hover:text-black text-white"
                }`
              }
            >
              <AiOutlineRobot size={18} />
              <span className="hidden group-hover:inline-block">NovelChat</span>
            </NavLink>
          </li>
          <li className="relative group">
            <NavLink
              to="/room"
              className={({ isActive }) =>
                `flex items-center space-x-4 pl-4 py-3 rounded-r-full transition-all duration-300 ${
                  isActive
                    ? "bg-beige text-black"
                    : "hover:bg-[#E1CDBB] hover:text-black text-white"
                }`
              }
            >
              <FaComment size={18} />
              <span className="hidden group-hover:inline-block">Chat Room</span>
            </NavLink>
          </li>
          {user ? (
            <>
              <li className="relative group">
                <NavLink
                  to="/user"
                  className={({ isActive }) =>
                    `flex items-center space-x-4 pl-4 py-3 rounded-r-full transition-all duration-300 ${
                      isActive
                        ? "bg-beige text-black"
                        : "hover:bg-[#E1CDBB] hover:text-black text-white"
                    }`
                  }
                >
                  <FaUserCircle className="text-lg" />
                  <span className="hidden group-hover:inline-block">
                    {user.name}
                  </span>
                </NavLink>
              </li>
              <li className="relative group">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-4 pl-4 py-3 rounded-r-full w-full transition-all duration-300 hover:bg-red-500 hover:text-black text-white"
                >
                  <FaSignOutAlt />
                  <span className="hidden group-hover:inline-block">
                    Logout
                  </span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="relative group">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `flex items-center space-x-4 pl-4 py-3 rounded-r-full transition-all duration-300 ${
                      isActive
                        ? "bg-beige text-black"
                        : "hover:bg-[#E1CDBB] hover:text-black text-white"
                    }`
                  }
                >
                  <FaSignInAlt />
                  <span className="hidden group-hover:inline-block">Login</span>
                </NavLink>
              </li>
              <li className="relative group">
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    `flex items-center space-x-4 pl-4 py-3 rounded-r-full transition-all duration-300 ${
                      isActive
                        ? "bg-beige text-black"
                        : "hover:bg-[#E1CDBB] hover:text-black text-white"
                    }`
                  }
                >
                  <FaUserPlus />
                  <span className="hidden group-hover:inline-block">
                    Sign Up
                  </span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
