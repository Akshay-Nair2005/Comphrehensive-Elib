import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { FaChevronLeft, FaChevronRight, FaBookOpen } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

export const Home = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("http://localhost:5000/books");
        let data = await response.json();
        data = data.sort(() => 0.5 - Math.random()).slice(0, 25);
        setImages(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, [images.length]);

  const startAutoSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 480) {
        setVisibleCount(2);
      } else if (window.innerWidth <= 768) {
        setVisibleCount(3);
      } else if (window.innerWidth <= 1024) {
        setVisibleCount(4);
      } else {
        setVisibleCount(6);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    startAutoSlide();
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    startAutoSlide();
  };

  const handleImageClick = (index) => {
    setCurrentIndex(index);
    startAutoSlide();
  };

  const handleReadMore = (id) => {
    navigate(`/desc/${id}`);
  };

  const visibleImages = images.slice(currentIndex, currentIndex + visibleCount);
  const currentImage = images[currentIndex];

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 p-4 sm:p-6 mt-4 sm:mt-8">
        <div className="w-full lg:w-[50vw] flex justify-center items-center">
          <Skeleton
            height={350}
            width={350}
            className="!rounded-2xl sm:!h-[450px] sm:!w-[450px] lg:!h-[500px] lg:!w-[500px]"
            baseColor="#E1CDBB"
            highlightColor="#5E3023"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <Skeleton
            height={36}
            baseColor="#E1CDBB"
            highlightColor="#5E3023"
            className="mb-4 w-3/4"
          />
          <Skeleton
            count={4}
            baseColor="#E1CDBB"
            highlightColor="#5E3023"
            className="mb-2"
          />
          <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8 overflow-hidden">
            {Array(visibleCount)
              .fill(0)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  height={120}
                  width={80}
                  baseColor="#E1CDBB"
                  highlightColor="#5E3023"
                  className="rounded-lg sm:!h-[150px] sm:!w-[100px]"
                />
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background Animation */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute top-0 right-0 h-full w-1/2 sm:w-2/5 bg-gradient-to-l from-[#E1CDBB] to-[#E1CDBB]/60 rounded-l-[100px] sm:rounded-l-full -z-10"
      />

      {/* Decorative Elements */}
      <div className="absolute top-8 left-4 sm:left-10 opacity-10 hidden sm:block">
        <FaBookOpen className="text-4xl sm:text-6xl text-[#5E3023]" />
      </div>
      <div className="absolute bottom-8 right-4 sm:right-10 opacity-10 hidden sm:block">
        <HiSparkles className="text-4xl sm:text-6xl text-[#5E3023]" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8 mt-2 sm:mt-4">
        {/* Main Image */}
        <div className="w-full lg:w-[50vw] flex justify-center items-center">
          <Link to={`/desc/${currentImage.$id}`} className="group relative">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <img
                src={currentImage.Novel_img}
                alt={currentImage.Novel_Name}
                className="w-[280px] h-[350px] sm:w-[400px] sm:h-[450px] lg:w-[450px] lg:h-[500px] rounded-2xl shadow-2xl object-cover border-2 border-[#5E3023]/20 group-hover:border-[#5E3023]/40 transition-all duration-300 group-hover:shadow-[0_20px_60px_rgba(94,48,35,0.3)]"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#5E3023]/80 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                <span className="text-white font-medium text-sm sm:text-base px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  View Details
                </span>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <div className="mt-2 sm:mt-4 lg:mt-16 min-h-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage.Novel_Name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#5E3023] font-serif mb-3">
                  {currentImage.Novel_Name}
                </h2>
                <p className="text-gray-700 text-sm sm:text-base text-justify leading-relaxed max-h-[180px] sm:max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {currentImage.Novel_desc.length > 500 ? (
                    <>
                      {currentImage.Novel_desc.slice(0, 400)}...&nbsp;
                      <button
                        onClick={() => handleReadMore(currentImage.$id)}
                        className="text-[#5E3023] underline hover:text-[#4a261c] font-medium inline"
                      >
                        Read More
                      </button>
                    </>
                  ) : (
                    currentImage.Novel_desc
                  )}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Controls */}
          <div className="relative flex items-center gap-3 sm:gap-4 mt-6 sm:mt-8 lg:mt-12">
            <button
              onClick={handlePrev}
              className="p-2.5 sm:p-3 bg-[#5E3023] text-white rounded-full shadow-lg hover:bg-[#4a261c] transition-all duration-300 hover:scale-110 z-10 flex-shrink-0"
              aria-label="Previous"
            >
              <FaChevronLeft className="text-sm sm:text-base" />
            </button>
            
            <div className="overflow-hidden flex-1">
              <motion.div
                className="flex gap-2 sm:gap-3 lg:gap-4"
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {visibleImages.map((image, index) => (
                  <motion.div
                    key={`${image.Novel_img}-${index}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className={`h-28 w-20 sm:h-36 sm:w-24 lg:h-44 lg:w-32 rounded-xl shadow-lg cursor-pointer transition-all duration-300 flex-shrink-0 overflow-hidden ${
                      index === 0 ? "ring-2 ring-[#5E3023] ring-offset-2" : ""
                    }`}
                    onClick={() =>
                      handleImageClick((currentIndex + index) % images.length)
                    }
                  >
                    <img
                      src={image.Novel_img}
                      alt={image.Novel_Name}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            <button
              onClick={handleNext}
              className="p-2.5 sm:p-3 bg-[#5E3023] text-white rounded-full shadow-lg hover:bg-[#4a261c] transition-all duration-300 hover:scale-110 z-10 flex-shrink-0"
              aria-label="Next"
            >
              <FaChevronRight className="text-sm sm:text-base" />
            </button>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-1.5 mt-4 sm:mt-6">
            {images.slice(0, Math.min(10, images.length)).map((_, index) => (
              <button
                key={index}
                onClick={() => handleImageClick(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex % Math.min(10, images.length)
                    ? "w-6 sm:w-8 h-2 bg-[#5E3023]"
                    : "w-2 h-2 bg-[#5E3023]/30 hover:bg-[#5E3023]/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #5E3023;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4a261c;
        }
      `}</style>
    </div>
  );
};
