import React from "react";
import { Loader } from "@react-three/drei";
import FeaturedBook from "../components/Book/FeaturedBook";
import ContactUs from "../components/Contact/ContactUs";
import HostedBooks from "../components/Book/HostedBooks";
import { Home } from "../components/Home/Home";

export const HomePage = () => {
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
