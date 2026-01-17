import React from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "../components/Book/Experience";
import { UI } from "../components/Book/UI";
import { FaFeatherAlt, FaPenNib, FaBookOpen, FaUsers, FaHeadphones, FaEdit } from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi";
import { IoBookOutline } from "react-icons/io5";

const AboutUs = () => {
  const features = [
    {
      icon: <FaBookOpen className="text-2xl" />,
      title: "Discover Books",
      description: "Explore a vast library of novels across all genres"
    },
    {
      icon: <FaPenNib className="text-2xl" />,
      title: "Publish Stories",
      description: "Share your creative works with the world"
    },
    {
      icon: <FaUsers className="text-2xl" />,
      title: "Collaborate",
      description: "Co-author stories with fellow writers"
    },
    {
      icon: <FaHeadphones className="text-2xl" />,
      title: "Audiobooks",
      description: "Listen to your favorite stories on the go"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <UI />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#5E3023]/5 via-[#5E3023]/10 to-[#5E3023]/5"></div>
        <div className="absolute top-10 left-10 opacity-10">
          <FaFeatherAlt className="text-8xl text-[#5E3023] transform -rotate-45" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-10">
          <HiOutlineBookOpen className="text-8xl text-[#5E3023]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* 3D Book Section */}
            <div className="w-full lg:w-1/2 h-[400px] lg:h-[500px]">
              <Canvas
                className="w-full h-full"
                shadows
                camera={{ position: [-0.5, 1, 4], fov: 45 }}
              >
                <Suspense fallback={null}>
                  <Experience />
                </Suspense>
              </Canvas>
            </div>

            {/* Content Section */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#5E3023]/40"></div>
                <IoBookOutline className="text-3xl text-[#5E3023]" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#5E3023]/40"></div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-800 mb-6">
                About <span className="text-[#5E3023]">NovelSync</span>
              </h1>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Welcome to <strong className="text-[#5E3023]">NovelSync</strong>, a revolutionary platform 
                designed for book lovers, aspiring authors, and literary enthusiasts. We provide a dynamic 
                space where readers can discover new books, authors can publish their novels, and communities 
                can engage in rich literary discussions.
              </p>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Whether you're here to read, write, or collaborate, <strong className="text-[#5E3023]">NovelSync</strong> ensures 
                a seamless and immersive experience with features like live novel hosting, collaborative 
                storytelling, audiobook integration, and real-time co-authoring.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <a 
                  href="/novels" 
                  className="flex items-center gap-2 bg-gradient-to-r from-[#5E3023] to-[#7a3f2e] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-medium"
                >
                  <FaBookOpen />
                  Explore Books
                </a>
                <a 
                  href="/info" 
                  className="flex items-center gap-2 bg-white text-[#5E3023] border-2 border-[#5E3023] px-6 py-3 rounded-full shadow-md hover:bg-[#5E3023] hover:text-white transition-all duration-300 font-medium"
                >
                  <FaPenNib />
                  Start Writing
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#5E3023]/40"></div>
              <FaFeatherAlt className="text-2xl text-[#5E3023]" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#5E3023]/40"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800">
              Why Choose NovelSync?
            </h2>
            <p className="text-gray-500 mt-2 italic">Everything you need for your literary journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#5E3023]/10 to-[#5E3023]/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#5E3023] group-hover:bg-[#5E3023] group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.description}</p>
                <div className="h-1 mt-4 bg-gradient-to-r from-[#5E3023]/20 via-[#5E3023] to-[#5E3023]/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="py-16 px-6 bg-gradient-to-r from-[#5E3023]/5 via-[#5E3023]/10 to-[#5E3023]/5">
        <div className="max-w-4xl mx-auto text-center">
          <FaFeatherAlt className="text-4xl text-[#5E3023]/30 mx-auto mb-6" />
          <blockquote className="text-2xl md:text-3xl font-serif italic text-gray-700 mb-6">
            "Join us in shaping the future of storytelling!"
          </blockquote>
          <div className="flex items-center justify-center gap-2 text-[#5E3023]">
            <div className="h-px w-16 bg-[#5E3023]/30"></div>
            <span className="font-medium">The NovelSync Team</span>
            <div className="h-px w-16 bg-[#5E3023]/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
