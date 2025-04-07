import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { account } from "../../appwritee/appwrite";
import { FiMenu, FiX } from "react-icons/fi";

const Navv = () => {
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
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
      await account.deleteSession("current");
      setUser(null);
      alert("You have been logged out!");
      navigate("/login");
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
      <nav className="text-white bg-[#5E3023] p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/">
            <img className="w-24" src="/images/logoo1.svg" alt="Logo" />
          </NavLink>

          {/* Hamburger Menu (Mobile) */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white text-2xl"
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex space-x-6 items-center">
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
                <li>
                  <NavLink to="/user">Hello, {user.name}</NavLink>
                </li>
                <li>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="text-white bg-red-500 px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden flex flex-col items-center bg-[#5E3023] p-4 space-y-4">
            <NavLink
              to="/"
              className={linkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={linkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </NavLink>
            <NavLink
              to="/userbooks"
              className={linkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Your Books
            </NavLink>
            <NavLink
              to="/saved"
              className={linkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Saved Books
            </NavLink>
            <NavLink
              to="/chat"
              className={linkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Ai Bot
            </NavLink>
            <NavLink
              to="/room"
              className={linkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Chat Room
            </NavLink>
            {user ? (
              <>
                <NavLink
                  to="/user"
                  className={linkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hello, {user.name}
                </NavLink>
                <button
                  onClick={() => {
                    setShowLogoutModal(true);
                    setIsMenuOpen(false);
                  }}
                  className="text-white bg-red-500 px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={linkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className={linkClass}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        )}
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
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
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
