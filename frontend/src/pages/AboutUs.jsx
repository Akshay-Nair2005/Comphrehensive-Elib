import React from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "../components/Book/Experience";
import { UI } from "../components/Book/UI";

const AboutUs = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-brown-900 text-beige-200 p-10">
      {/* UI Overlay */}
      <UI />

      {/* Left Side: 3D Book */}
      <div className="w-1/2 h-full flex items-center justify-center relative">
        <Canvas
          className="w-full h-3/4"
          shadows
          camera={{ position: [-0.5, 1, 4], fov: 45 }}
        >
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
      </div>

      {/* Right Side: About Us Content */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="p-6 bg-opacity-80 bg-brown-800 rounded-lg text-center w-4/5">
          <h1 className="text-4xl font-bold mb-4">About NovelSync</h1>
          <p className="text-lg">
            Welcome to <strong>NovelSync</strong>, a revolutionary platform
            designed for book lovers, aspiring authors, and literary
            enthusiasts. We provide a dynamic space where readers can discover
            new books, authors can publish their novels, and communities can
            engage in rich literary discussions.
          </p>
          <p className="mt-4">
            Whether you're here to read, write, or collaborate,{" "}
            <strong>NovelSync</strong> ensures a seamless and immersive
            experience with features like live novel hosting, collaborative
            storytelling, audiobook integration, and real-time co-authoring.
          </p>
          <p className="mt-4 font-semibold">
            Join us in shaping the future of storytelling!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
