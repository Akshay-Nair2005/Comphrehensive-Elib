import React from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "../components/Book/Experience";
import { UI } from "../components/Book/UI";

const AboutUs = () => {
  return (
    <div className="w-full h-screen flex flex-col md:flex-col lg:flex-row items-center justify-center bg-brown-900 text-beige-200 p-6 md:p-8 lg:p-10">
      {/* UI Overlay */}
      <UI />

      {/* Left Side: 3D Book */}
      <div className="w-full md:w-3/4 lg:w-1/2 h-1/2 md:h-2/3 lg:h-full flex items-center justify-center relative">
        <Canvas
          className="w-full h-full md:h-3/4"
          shadows
          camera={{ position: [-0.5, 1, 4], fov: 45 }}
        >
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
      </div>

      {/* Right Side: About Us Content */}
      <div className="w-full md:w-3/4 lg:w-1/2 flex items-center justify-center p-4 md:p-6 lg:p-8">
        <div className="p-4 md:p-6 bg-opacity-80 bg-brown-800 rounded-lg text-center w-full md:w-4/5 lg:w-4/5">
          <h1 className="text-xl md:text-2xl lg:text-4xl font-bold mb-4">
            About NovelSync
          </h1>
          <p className="text-xs md:text-sm lg:text-lg">
            Welcome to <strong>NovelSync</strong>, a revolutionary platform
            designed for book lovers, aspiring authors, and literary
            enthusiasts. We provide a dynamic space where readers can discover
            new books, authors can publish their novels, and communities can
            engage in rich literary discussions.
          </p>
          <p className="mt-4 text-xs md:text-sm lg:text-lg">
            Whether you're here to read, write, or collaborate,{" "}
            <strong>NovelSync</strong> ensures a seamless and immersive
            experience with features like live novel hosting, collaborative
            storytelling, audiobook integration, and real-time co-authoring.
          </p>
          <p className="mt-4 font-semibold text-xs md:text-sm lg:text-lg">
            Join us in shaping the future of storytelling!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
