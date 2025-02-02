import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const NewDashboard = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("http://localhost:5000/books"); // Replace with your API
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  // Automatic slider logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3500); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images.length]);

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

  if (images.length === 0) {
    return <div>Loading...</div>;
  }

  const visibleImages = [];
  for (let i = 0; i < 7; i++) {
    visibleImages.push(images[(currentIndex + i) % images.length]);
  }

  const currentImage = images[currentIndex];

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 mt-8">
      {/* Left Side: Current Image */}
      <div className="w-full lg:w-[60vw] flex justify-center items-center">
        <img
          src={currentImage.Novel_img}
          alt={currentImage.Novel_Name}
          className="rounded-lg shadow-lg w-full max-h-screen object-contain"
        />
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-3/4">
        {/* Image Details with Animation */}
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
              <h2 className="text-xl lg:text-3xl font-bold text-orange-500">
                {currentImage.Novel_Name}
              </h2>
              <p className="text-white p-3">
                {currentImage.Novel_desc.length > 900 ? (
                  <>
                    {currentImage.Novel_desc.slice(0, 900)}...&nbsp;
                    <button
                      onClick={() => handleReadMore(currentImage.$id)}
                      className="text-blue-500 underline hover:text-blue-700"
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

        {/* Slider with Fixed Frame for 6 Images */}
        <div className="relative flex items-center gap-4 mt-8 lg:mt-24">
          <button
            onClick={handlePrev}
            className="p-2 bg-gray-200 rounded-full shadow hover:bg-gray-300 z-10"
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
                  className="h-32 w-24 lg:h-48 lg:w-32 rounded-lg shadow"
                  onClick={() =>
                    handleImageClick((currentIndex + index) % images.length)
                  }
                >
                  <img
                    src={image.Novel_img}
                    alt={image.Novel_Name}
                    className="h-full w-full object-cover rounded-lg cursor-pointer"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
          <button
            onClick={handleNext}
            className="p-2 bg-gray-200 rounded-full shadow hover:bg-gray-300 z-10"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};
