import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { account } from "../../appwritee/appwrite";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Extract userId and secret from the URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");
  const secret = queryParams.get("secret");

  useEffect(() => {
    if (!userId || !secret) {
      setMessage("Invalid request. Please check the reset link.");
    }
  }, [userId, secret]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    setMessage("");
    try {
      await account.updateRecovery(userId, secret, password); // Update password
      setMessage("Password updated successfully!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex w-full max-w-5xl bg-opacity-90 rounded-lg shadow-2xl border border-gray-300 p-6">
        <div className="flex w-full gap-x-6 m-16">
          <div className="flex-1 flex flex-col justify-center p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
              Reset Password
            </h2>
            {message && <p className="text-center text-red-500">{message}</p>}
            <form onSubmit={handleResetPassword}>
              <div className="mb-4 flex items-center border rounded-lg px-3 py-2 border-[brown]">
                <input
                  type="password"
                  id="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-gray-800"
                  required
                />
              </div>
              <div className="mb-6 flex items-center border rounded-lg px-3 py-2 border-[brown]">
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-gray-800"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#5E3023] text-white py-2 px-4 rounded-lg hover:bg-[#4d2419] transition duration-300 font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
