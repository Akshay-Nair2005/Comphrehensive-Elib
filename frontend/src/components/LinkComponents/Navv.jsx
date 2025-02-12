import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { account } from "../../appwritee/appwrite";

const Navv = () => {
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout modal
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
      ? "text-white bg-button px-4 py-3 rounded-full "
      : "text-white/80 hover:text-black px-4 py-2 rounded-full hover:bg-[#E1CDBB] transition duration-300";

  return (
    <>
      <nav className="text-white bg-[#5E3023]">
        <div className="container mx-auto flex justify-between items-center p-4">
          {/* Brand Logo */}
          <div className="flex justify-between">
            <NavLink className="pointer-events-auto" to="/">
              <img className="w-24" src="/images/logoo.svg" alt="Logo" />
            </NavLink>
          </div>

          {/* Nav Links */}
          <ul className="flex space-x-6 items-center">
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
              <NavLink to="/userbooks" className={linkClass}>
                Your Books
              </NavLink>
            </li>
            <li>
              <NavLink to="/saved" className={linkClass}>
                Saved Books
              </NavLink>
            </li>
            <li>
              <NavLink to="/chat" className={linkClass}>
                Ai Bot
              </NavLink>
            </li>
            <li>
              <NavLink to="/room" className={linkClass}>
                Chat Room
              </NavLink>
            </li>
            {user ? (
              <>
                {/* If user is logged in */}
                <li className={linkClass}>
                  <NavLink to="/user">Hello, {user.name}</NavLink>
                </li>
                <li>
                  <button
                    onClick={() => setShowLogoutModal(true)} // Show logout modal
                    className="text-white bg-red-500 px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* If no user is logged in */}
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
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)} // Close modal
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false); // Close modal
                  handleLogout(); // Proceed with logout
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navv;
