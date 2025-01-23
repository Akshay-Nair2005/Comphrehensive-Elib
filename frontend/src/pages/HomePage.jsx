import React from "react";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "../components/Book/Experience";
import { UI } from "../components/Book/UI";
import FeaturedBook from "../components/Book/FeaturedBook";
import ContactUs from "../components/Contact/ContactUs";
import HostedBooks from "../components/Book/HostedBooks";

export const HomePage = () => {
  return (
    <>
      <UI />
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
      <div style={{ width: "100vw", height: "100vh" }}>
        {" "}
        {/* Full-screen container */}
        <Canvas shadows camera={{ position: [-0.5, 1, 4], fov: 45 }}>
          <group position-y={0}>
            <Suspense fallback={null}>
              <Experience />
            </Suspense>
          </group>
        </Canvas>
      </div>
      <FeaturedBook isHome={true} />
      <HostedBooks isHome={true} />
      <ContactUs />
    </>
  );
};
