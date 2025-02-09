import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "@react-three/drei";
import FeaturedBook from "../components/Book/FeaturedBook";
import ContactUs from "../components/Contact/ContactUs";
import HostedBooks from "../components/Book/HostedBooks";
import { Home } from "../components/Home/Home";
import { account } from "../appwritee/appwrite"; // Import Appwrite account

export const HomePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userDetails = await account.get();
        setUser(userDetails);
      } catch (error) {
        navigate("/login"); // Redirect to login if no user is found
      }
    };

    checkUser();
  }, [navigate]);

  if (!user) return null; // Prevent rendering until user check is done

  return (
    <>
      <Loader
        containerStyles={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      />
      <div className="min-h-screen">
        <Home />
      </div>
      <FeaturedBook isHome={true} />
      <HostedBooks isHome={true} />
      <ContactUs />
    </>
  );
};
