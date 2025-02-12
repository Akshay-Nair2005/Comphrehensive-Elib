import React, { useState } from "react";
import { account } from "../../appwritee/appwrite";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handlePasswordReset = async () => {
    setIsSubmitting(true);
    setMessage("");
    try {
      // Update the redirect URL to point to the reset password page
      await account.createRecovery(email, "http://localhost:5173/resetpass"); // Pointing to /resetpass
      setMessage("Password reset email sent! Check your inbox.");
      setIsSubmitting(false);
      //   navigate("/login"); // Optionally, redirect to login page after sending email
    } catch (error) {
      setMessage("Error: " + error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex w-full max-w-5xl bg-opacity-90 rounded-lg shadow-2xl border border-gray-300 p-6">
        <div className="flex w-full gap-x-6 m-16">
          <div className="flex-1 flex flex-col justify-center p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
              Forgot Password
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePasswordReset();
              }}
            >
              <div className="mb-4 flex items-center border rounded-lg px-3 py-2 border-[brown]">
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-gray-800"
                  required
                />
              </div>
              {message && <p className="text-center text-red-500">{message}</p>}
              <button
                type="submit"
                className="w-full bg-[#5E3023] text-white py-2 px-4 rounded-lg hover:bg-[#4d2419] transition duration-300 font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Reset Password"}
              </button>
            </form>
            <p className="text-sm text-gray-600 text-center mt-4">
              Remember your password?{" "}
              <a
                href="/login"
                className="text-[#5E3023] hover:underline font-medium"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
