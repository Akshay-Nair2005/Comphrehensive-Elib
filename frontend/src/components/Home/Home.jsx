import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const Home = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6); // Default to 6 visible images
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("http://localhost:5000/books"); // Replace with your API
        const data = await response.json();
        setImages(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    // Adjust visible count for mobile screens
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setVisibleCount(3); // Show 3 images on mobile
      } else {
        setVisibleCount(6); // Show 6 images on larger screens
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleImageClick = (index) => {
    setCurrentIndex(index);
  };

  const handleReadMore = (id) => {
    navigate(`/desc/${id}`);
  };

  const visibleImages = [];
  for (let i = 0; i < visibleCount; i++) {
    visibleImages.push(images[(currentIndex + i) % images.length]);
  }

  const currentImage = images[currentIndex];

  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-8 p-6 mt-8">
        {/* Left Side Skeleton */}
        <div className="w-full lg:w-[64vw] flex justify-center items-center">
          <Skeleton
            height={500}
            width={500}
            baseColor="#E1CDBB"
            highlightColor="#5E3023"
            // className="rounded-2xl shadow-xl border-2"
          />
        </div>

        {/* Right Side Skeleton */}
        <div className="w-full lg:w-3/4">
          <Skeleton
            height={40}
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
          <div className="flex gap-4 mt-8">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  height={150}
                  width={100}
                  baseColor="#E1CDBB"
                  highlightColor="#5E3023"
                  className="rounded-lg"
                />
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div
        initial={{ x: "100%" }} // Start off-screen
        animate={{ x: 0 }} // Slide into position
        transition={{ duration: 3, ease: "easeOut" }} // Adjust duration and easing
        className="absolute top--16 right-0 h-full w-1/2 bg-[#E1CDBB] rounded-l-full -z-10"
      ></motion.div>
      <div
        className="flex flex-col lg:flex-row gap-8 p-6 mt-4"
        // style={{
        //   backgroundImage: `url(${currentImage.Novel_img})`,
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        // }}
      >
        {/* Left Side: Current Image */}
        <div className="w-full lg:w-[64vw] flex justify-center items-center">
          <img
            src={currentImage.Novel_img}
            alt={currentImage.Novel_Name}
            className="rounded-2xl shadow-xl w-full max-h-screen object-contain border-2 border-card"
          />
        </div>

        {/* Right Side */}
        <div className="w-full lg:w-3/4">
          <div className="mt-4 lg:mt-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage.Novel_Name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                <h2 className="text-3xl lg:text-4xl font-bold text-color font-montserrat">
                  {currentImage.Novel_Name}
                </h2>
                <p className="text-black p-4 text-justify font-roboto leading-7">
                  {currentImage.Novel_desc.length > 900 ? (
                    <>
                      {currentImage.Novel_desc.slice(0, 700)}...&nbsp;
                      <button
                        onClick={() => handleReadMore(currentImage.$id)}
                        className="text-black underline hover:text-black font-medium"
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

          {/* Slider with Fixed Frame for 3 Images on Mobile, 6 on Desktop */}
          <div className="relative flex items-center gap-4 mt-8 lg:mt-24">
            <button
              onClick={handlePrev}
              className="p-3 bg-gray-900 text-white rounded-full shadow hover:bg-gray-700 z-10"
            >
              &lt;
            </button>
            <div className="overflow-hidden w-full">
              <motion.div
                className="flex gap-4"
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: "100%" }}
              >
                {visibleImages.map((image, index) => (
                  <motion.div
                    key={`${image.Novel_img}-${index}`}
                    className="h-40 w-28 lg:h-56 lg:w-40 rounded-lg shadow-lg transform hover:scale-105 cursor-pointer transition-transform duration-300"
                    onClick={() =>
                      handleImageClick((currentIndex + index) % images.length)
                    }
                  >
                    <img
                      src={image.Novel_img}
                      alt={image.Novel_Name}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <button
              onClick={handleNext}
              className="p-3 bg-gray-900 text-white rounded-full shadow hover:bg-gray-700 z-10"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
