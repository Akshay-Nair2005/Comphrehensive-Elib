import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaMoon,
  FaSun,
  FaPlus,
  FaMinus,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export const TextViewer = () => {
  const { hbookTId } = useParams(); // Extract ID from the URL
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false); // Default to light mode
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/hbooks/${hbookTId}`
        ); // Fetch chapters using ID from URL
        if (!response.ok) {
          throw new Error("Failed to fetch chapters");
        }
        const data = await response.json();
        if (data?.chapters?.length) {
          setChapters(data.chapters);
          setCurrentChapter(data.chapters[0]);
        } else {
          setChapters([]);
        }
      } catch (error) {
        console.error("Error fetching chapters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [hbookTId]);

  const handleZoomIn = () => setFontSize((prev) => prev + 2);
  const handleZoomOut = () =>
    setFontSize((prev) => (prev > 10 ? prev - 2 : prev));
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  if (loading) {
    return (
      <div className="text-center p-6 text-black">Loading chapters...</div>
    );
  }

  if (!chapters.length) {
    return (
      <div className="text-center p-6 text-black">No chapters available.</div>
    );
  }

  return (
    <div
      className={`flex flex-col min-h-screen ${
        darkMode ? "bg-black text-beige" : "bg-[#FFF6EF] text-black"
      }`}
    >
      {/* Top Bar */}
      <div className="flex items-center h-16 justify-between px-4 py-2 border-b border-gray-300 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className={`px-3 py-2 ${
              darkMode
                ? "bg-beige hover:bg-[#E7D8CB] text-black"
                : "bg-[#5E3023] hover:bg-[#8A573A] text-white"
            } rounded focus:outline-none`}
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1 className="text-lg font-bold">{currentChapter?.Chapter_title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleZoomIn}
            className={`px-3 py-1 ${
              darkMode
                ? "bg-beige hover:bg-[#E7D8CB] text-black"
                : "bg-[#5E3023] hover:bg-[#8A573A] text-white"
            } rounded`}
          >
            <FaPlus />
          </button>
          <button
            onClick={handleZoomOut}
            className={`px-3 py-1 ${
              darkMode
                ? "bg-beige hover:bg-[#E7D8CB] text-black"
                : "bg-[#5E3023] hover:bg-[#8A573A] text-white"
            } rounded`}
          >
            <FaMinus />
          </button>
          <button
            onClick={toggleDarkMode}
            className={`px-3 py-1 ${
              darkMode
                ? "bg-beige hover:bg-[#E7D8CB] text-black"
                : "bg-[#5E3023] hover:bg-[#8A573A] text-white"
            } rounded`}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar for Chapters */}
        <div
          className={`w-64 border-r border-gray-300 dark:border-gray-700 ${
            isSidebarOpen ? "block" : "hidden"
          } sticky top-0 h-screen`}
        >
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Chapters</h2>
            <ul className="space-y-2">
              {chapters.map((chapter, index) => (
                <li
                  key={index}
                  onClick={() => setCurrentChapter(chapter)}
                  className={`cursor-pointer p-2 rounded ${
                    currentChapter &&
                    currentChapter.Chapter_title === chapter.Chapter_title
                      ? darkMode
                        ? "bg-[#E1CDBB] text-black "
                        : "bg-[#5E3023] text-white"
                      : darkMode
                      ? "hover:bg-[#E7D8CB] text-beige hover:text-black"
                      : "hover:bg-[#8A573A] text-black hover:text-white"
                  }`}
                >
                  {chapter.Chapter_title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Viewer */}
        <div
          className="flex-1 p-6 overflow-y-auto"
          style={{ fontSize: `${fontSize}px` }}
        >
          {currentChapter?.Chapter_content?.replace(/\r\n/g, "\n") // Normalize Windows-style line endings
            ?.replace(/\r/g, "\n") // Normalize old Mac-style line endings
            ?.split("\n") // Split into paragraphs
            .map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph.trim()}
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};
