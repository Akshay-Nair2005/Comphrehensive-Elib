import React, { useEffect, useState } from "react";
import { account } from "../../appwritee/appwrite";
import { FaEnvelope, FaKey } from "react-icons/fa"; // Importing icons
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focusedInput, setFocusedInput] = useState(""); // Tracks focused input
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Track if login is in progress
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // 🔹 Check if user is already logged in
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        await account.get();
        navigate("/"); // Redirect to home if user exists
      } catch (error) {
        console.log("No active session found.");
      }
    };
    checkUserSession();
  }, [navigate]);

  const handleLogin = async () => {
    setIsLoggingIn(true); // Set login state to true when login is triggered
    try {
      await account.createEmailPasswordSession(email, password);
      alert("Logged in successfully!");
      navigate("/");
    } catch (error) {
      alert("Login failed: " + error.message);
    } finally {
      setIsLoggingIn(false); // Reset login state after the request is complete
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: "url('/images/bg1.jpg')", // Update the path if necessary
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      <div className="flex w-full max-w-5xl bg-opacity-90 rounded-lg shadow-2xl border border-gray-300 p-6">
        {/* Content Wrapper with Gap */}
        <div className="flex w-full gap-x-6 m-16">
          {/* Login Container */}
          <div className="flex-1 flex flex-col justify-center p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
              {/* {isLoggingIn ? "Logging In..." : "Login"} */}
              Login
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              <div
                className={`mb-4 flex items-center border rounded-lg px-3 py-2 ${
                  focusedInput === "email"
                    ? "border-[#5E3023]"
                    : "border-[brown]"
                }`}
              >
                <FaEnvelope className="text-[brown] mr-2" />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput("")}
                  className="w-full bg-transparent focus:outline-none text-gray-800"
                  required
                />
              </div>

              <div
                className={`mb-6 flex items-center border rounded-lg px-3 py-2 ${
                  focusedInput === "password"
                    ? "border-[#5E3023]"
                    : "border-[brown]"
                }`}
              >
                <FaKey className="text-[brown] mr-2" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput("")}
                  className="w-full bg-transparent focus:outline-none text-gray-800"
                  required
                />
                <span
                  className=""
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#5E3023] text-white py-2 px-4 rounded-lg hover:bg-[#4d2419] transition duration-300 font-semibold"
                disabled={isLoggingIn} // Disable button during login
              >
                {isLoggingIn ? "Logging In..." : "Login"}
              </button>
              <p className="text-sm text-gray-600 text-center mt-4">
                <a
                  href="/forgetpass"
                  className="text-[#5E3023] hover:underline font-medium"
                >
                  Forgot Password?
                </a>
              </p>
            </form>
            <p className="text-sm text-gray-600 text-center mt-4">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-[#5E3023] hover:underline font-medium"
              >
                Sign Up
              </a>
            </p>
          </div>

          {/* Image Container */}
          <div className="flex-1">
            <img
              src="/images/libb.jpg" // Ensure the path is correct
              alt="Login Illustration"
              className="w-full h-full object-cover shadow-lg "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
