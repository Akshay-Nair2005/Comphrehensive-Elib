import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { account } from "../../appwritee/appwrite";

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
      ? "text-white bg-button px-4 py-3 rounded-full "
      : "text-white/80 hover:text-black px-4 py-2 rounded-full hover:bg-[#E1CDBB] transition duration-300";

  return (
    <nav className=" text-white bg-[#5E3023]">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Brand Logo */}
        <div className="flex justify-between ">
          <NavLink className="pointer-events-auto" to="/">
            <img className="w-24 " src="/images/logoo.svg" alt="Logo" />
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
            <NavLink to="/contact" className={linkClass}>
              Contact
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
                  onClick={handleLogout}
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
  );
};

export default Navv;
