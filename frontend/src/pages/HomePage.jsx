import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@react-three/drei";
import FeaturedBook from "../components/Book/FeaturedBook";
import ContactUs from "../components/Contact/ContactUs";
import HostedBooks from "../components/Book/HostedBooks";
import { Home } from "../components/Home/Home";
import { account } from "../appwritee/appwrite";
import { FaArrowUp } from "react-icons/fa";

export const HomePage = () => {
  const [user, setUser] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userDetails = await account.get();
        setUser(userDetails);
      } catch (error) {
        navigate("/login");
      }
    };

    checkUser();
  }, [navigate]);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!user) return null;

  return (
    <>
      <div className="min-h-screen">
        <Home />
      </div>
      <FeaturedBook isHome={true} />
      <HostedBooks isHome={true} />
      <ContactUs />

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-[#5E3023] text-white rounded-full shadow-lg hover:bg-[#4a261c] transition-all duration-300 hover:scale-110 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <FaArrowUp className="text-lg" />
      </button>
    </>
  );
};
