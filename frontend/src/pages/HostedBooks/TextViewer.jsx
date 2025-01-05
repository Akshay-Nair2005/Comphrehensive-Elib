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
  const [darkMode, setDarkMode] = useState(true);
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
      <div className="text-center p-6 text-white">Loading chapters...</div>
    );
  }

  if (!chapters.length) {
    return (
      <div className="text-center p-6 text-white ">No chapters available.</div>
    );
  }

  return (
    <div
      className={`flex flex-col min-h-screen ${
        darkMode ? "bg-[#021331] text-white" : "bg-white text-black"
      }`}
    >
      {/* Top Bar */}
      <div className="flex items-center h-16 justify-between px-4 py-2 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="px-3 py-2 bg-button text-white rounded focus:outline-none"
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1 className="text-lg font-bold">{currentChapter?.Chapter_title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleZoomIn}
            className="px-3 py-1 bg-button text-white rounded"
          >
            <FaPlus />
          </button>
          <button
            onClick={handleZoomOut}
            className="px-3 py-1 bg-button text-white rounded"
          >
            <FaMinus />
          </button>
          <button
            onClick={toggleDarkMode}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
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
                      ? "bg-button text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
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
