import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "../../components/Book/Experience";
import { UI } from "../../components/Book/UI";
import { FaPaperPlane, FaUser, FaEnvelope, FaComment, FaCheckCircle, FaTimesCircle, FaBookOpen } from "react-icons/fa";
import { HiOutlineMailOpen } from "react-icons/hi";

const api = import.meta.env.VITE_APIKEY_CONTACT;

const ContactUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.target);
    formData.append("access_key", api);

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      }).then((res) => res.json());

      if (res.success) {
        showToast("Your message has been submitted successfully!", "success");
        event.target.reset();
      } else {
        showToast("Something went wrong. Please try again.", "error");
      }
    } catch (error) {
      showToast("Failed to submit. Please check your connection.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-[#f5ebe0] via-white to-[#f5ebe0] py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl transition-all duration-500 animate-slide-in ${
            toast.type === "success"
              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
              : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <FaCheckCircle className="text-xl flex-shrink-0" />
          ) : (
            <FaTimesCircle className="text-xl flex-shrink-0" />
          )}
          <span className="font-medium text-sm sm:text-base">{toast.message}</span>
        </div>
      )}

      {/* Background Decorations */}
      <div className="absolute top-10 left-10 opacity-5">
        <FaBookOpen className="text-[120px] text-[#5E3023] transform -rotate-12" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-5">
        <HiOutlineMailOpen className="text-[120px] text-[#5E3023] transform rotate-12" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#5E3023]/40"></div>
            <HiOutlineMailOpen className="text-3xl text-[#5E3023]" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#5E3023]/40"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-800 mb-3">
            Get in Touch
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Form Section */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 border border-[#5E3023]/10">
              <form className="space-y-6" onSubmit={onSubmit}>
                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaUser className="text-[#5E3023]" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#5E3023]/20 focus:border-[#5E3023] focus:outline-none transition-all duration-300 bg-white/50 placeholder-gray-400"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaEnvelope className="text-[#5E3023]" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#5E3023]/20 focus:border-[#5E3023] focus:outline-none transition-all duration-300 bg-white/50 placeholder-gray-400"
                  />
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label htmlFor="message" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FaComment className="text-[#5E3023]" />
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#5E3023]/20 focus:border-[#5E3023] focus:outline-none transition-all duration-300 bg-white/50 placeholder-gray-400 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#5E3023] to-[#7a4030] text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-[#4a261c] hover:to-[#5E3023] disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* 3D Canvas Section */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2 flex flex-col items-center justify-center">
            <UI />
            <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px]">
              <Canvas shadows camera={{ position: [-0.5, 1, 4], fov: 45 }}>
                <group position-y={0}>
                  <Suspense fallback={null}>
                    <Experience />
                  </Suspense>
                </group>
              </Canvas>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out;
        }
      `}</style>
    </section>
  );
};

export default ContactUs;
