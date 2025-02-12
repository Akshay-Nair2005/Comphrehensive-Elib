import React, { useState } from "react";
import { account } from "../../appwritee/appwrite";
import { ID } from "appwrite";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Track password match status
  const id = ID.unique();
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      setIsLoading(true); // Set loading state to true
      // Check if the user already exists
      const existingSession = await account
        .getSession("current")
        .catch(() => null);
      if (existingSession) {
        alert("You are already logged in!");
        navigate("/");
        return;
      }

      // Create user in Appwrite Authentication
      const user = await account.create(id, email, password, name);

      // Send user details to backend
      await fetch("http://localhost:5000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.$id,
          User_name: name,
          User_Status: "reader",
          User_desc: "New user",
          user_email: email,
        }),
      });

      alert("Signup successful!");
      navigate("/login");
    } catch (error) {
      alert("Signup failed: " + error.message);
    } finally {
      setIsLoading(false); // Reset loading state after request
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    checkPasswordMatch(e.target.value, confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    checkPasswordMatch(password, e.target.value);
  };

  const checkPasswordMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: "url('/images/bg1.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      <div className="flex w-full max-w-5xl bg-opacity-90 rounded-lg shadow-2xl border border-gray-300 p-6">
        <div className="flex w-full gap-x-6 m-10">
          <div className="flex-1 flex flex-col justify-center p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
              Sign Up
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSignup();
              }}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-[brown] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E3023] focus:border-transparent text-gray-800 bg-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-[brown] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E3023] focus:border-transparent text-gray-800 bg-transparent"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full mt-1 px-3 py-2 border border-[brown] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E3023] focus:border-transparent text-gray-800 bg-transparent"
                    required
                  />
                  <span
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="w-full mt-1 px-3 py-2 border border-[brown] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E3023] focus:border-transparent text-gray-800 bg-transparent"
                    required
                  />
                  <span
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {!passwordsMatch && (
                <p className="text-sm text-red-500 text-center">
                  Passwords do not match!
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-[#5E3023] text-white py-2 px-4 rounded-lg hover:bg-[#4d2419] transition duration-300 font-semibold"
                disabled={!passwordsMatch || isLoading} // Disable button if passwords don't match or if loading
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
            <p className="text-sm text-gray-600 text-center mt-4">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#5E3023] hover:underline font-medium"
              >
                Log In
              </a>
            </p>
          </div>
          <div className="flex-1">
            <img
              src="/images/libb.jpg"
              alt="Signup Illustration"
              className="w-full h-[90%] mt-4 object-cover shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
