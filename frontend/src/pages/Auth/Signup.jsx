import React, { useState } from "react";
import { account } from "../../appwritee/appwrite";
import { ID } from "appwrite";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const id = ID.unique();

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await account.create(id, email, password, name);
      alert("Signup successful!");
      navigate("/login");
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: "url('/images/bg1.jpg')", // Update path as needed
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}
    >
      <div className="flex w-full max-w-5xl bg-opacity-90 rounded-lg shadow-2xl border border-gray-300 p-6">
        {/* Content Wrapper with Gap */}
        <div className="flex w-full gap-x-6 m-10">
          {/* Signup Form */}
          <div className="flex-1 flex flex-col justify-center p-8  rounded-lg">
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
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-[brown] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E3023] focus:border-transparent text-gray-800 bg-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-[brown] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E3023] focus:border-transparent text-gray-800 bg-transparent"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-[brown] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E3023] focus:border-transparent text-gray-800 bg-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#5E3023] text-white py-2 px-4 rounded-lg hover:bg-[#4d2419] transition duration-300 font-semibold"
              >
                Sign Up
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

          {/* Image Container */}
          <div className="flex-1">
            <img
              src="/images/libb.jpg" // Ensure the path is correct
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
