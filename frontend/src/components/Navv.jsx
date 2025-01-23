import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { account } from "../appwritee/appwrite";

const Navv = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const userDetails = await account.get(); // Get the current user from Appwrite
        setUser(userDetails); // Set user info
      } catch (err) {
        setUser(null); // If not logged in, set user to null
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current"); // Logout the current session
      setUser(null);
      alert("You have been logged out!");
      navigate("/login"); // Redirect to the login page
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-button text-[#fff] px-6 py-3 rounded-full shadow-md"
      : "border-[#E0E0E0] hover:border-[#F87871] transition-all duration-300 px-4 py-3 rounded-full px-6 border text-white/90";

  return (
    <nav className="p-4">
      <ul className="flex space-x-6 justify-end mt-3">
        <li>
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
        </li>
        {user ? (
          <>
            {/* If the user is logged in, show username and Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
            <li className="text-white  px-6 py-3 font-semibold">
              Hello, {user.name}
            </li>
          </>
        ) : (
          <>
            {/* If no user is logged in, show Login and Sign Up */}
            <li>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/signup" className={linkClass}>
                Sign Up
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navv;
