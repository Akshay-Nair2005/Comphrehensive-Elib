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
        );
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
      <div className="text-center p-6 text-white">No chapters available.</div>
    );
  }

  return (
    <div
      className={`flex flex-col min-h-screen transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* Top Bar */}
      <div className="flex items-center h-16 justify-between px-4 py-2 border-b transition-all duration-300 border-gray-300 dark:border-gray-700 shadow-md bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 bg-purple-700 hover:bg-purple-800 rounded focus:outline-none"
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1 className="text-lg font-bold">{currentChapter?.Chapter_title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleZoomIn}
            className="p-2 bg-green-600 hover:bg-green-700 text-white rounded shadow-md focus:outline-none"
          >
            <FaPlus />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded shadow-md focus:outline-none"
          >
            <FaMinus />
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded shadow-md focus:outline-none"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar for Chapters */}
        <div
          className={`transition-transform duration-300 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 h-screen fixed md:static z-10 shadow-lg`}
        >
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Chapters</h2>
            <ul className="space-y-2">
              {chapters.map((chapter, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setCurrentChapter(chapter);
                    setIsSidebarOpen(false);
                  }}
                  className={`cursor-pointer p-3 rounded-md text-sm transition-all ${
                    currentChapter &&
                    currentChapter.Chapter_title === chapter.Chapter_title
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-300 dark:hover:bg-gray-700"
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
          className="flex-1 p-6 overflow-y-auto text-justify"
          style={{ fontSize: `${fontSize}px` }}
        >
          {currentChapter?.Chapter_content?.replace(/\r\n/g, "\n")
            ?.replace(/\r/g, "\n")
            ?.split("\n")
            .map((paragraph, index) => (
              <p
                key={index}
                className="mb-4 leading-relaxed tracking-wide first-letter:text-2xl first-letter:font-bold first-letter:text-indigo-500"
              >
                {paragraph.trim()}
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

import React from "react";

/* Don't forget to download the CSS file too 
OR remove the following line if you're already using Tailwind */

// import "./style.css";

export const NewDashboard = () => {
  return (
    <div id="webcrumbs">
      <div className="w-[1200px] min-h-[700px] bg-neutral-800 text-primary-50 rounded-lg shadow-lg p-6 flex flex-col gap-6">
        {" "}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-[40px] h-[40px] bg-neutral-50 rounded-full"></div>
            <h1 className="text-xl font-title">Library</h1>
            <nav className="flex gap-6 text-neutral-400">
              <a href="#" className="hover:text-primary-500">
                Books
              </a>
              <a href="#" className="hover:text-primary-500">
                Authors
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search here"
              className="px-4 py-2 rounded-md bg-neutral-900 text-primary-50"
            />
            <button className="w-[40px] h-[40px] bg-neutral-700 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-neutral-400">
                search
              </span>
            </button>
          </div>
        </header>
        <main className="flex flex-col gap-6">
          <section>
            <h2 className="text-lg font-title mb-4">Previous Reading</h2>
            <div className="grid grid-cols-4 gap-4">
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-title mb-4">Subjects section</h2>
            <div className="grid grid-cols-5 gap-4">
              <div className="p-4 bg-neutral-700 rounded-md text-center">
                <p>Design</p>
                <p className="text-primary-500 font-bold">1.2k</p>
              </div>
              <div className="p-4 bg-neutral-700 rounded-md text-center">
                <p>Cooking</p>
                <p className="text-primary-500 font-bold">180</p>
              </div>
              <div className="p-4 bg-neutral-700 rounded-md text-center">
                <p>Arts</p>
                <p className="text-primary-500 font-bold">1.8k</p>
              </div>
              <div className="p-4 bg-neutral-700 rounded-md text-center">
                <p>Science</p>
                <p className="text-primary-500 font-bold">230</p>
              </div>
              <div className="p-4 bg-neutral-700 rounded-md text-center">
                <p>Others</p>
                <p className="text-primary-500 font-bold">900</p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-title mb-4">Popular books</h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
                <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
                <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
                <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-title mb-4">Writers and Authors</h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
                <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
                <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
                <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-title mb-4">New books</h2>
            <div className="grid grid-cols-6 gap-4">
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
              <div className="w-[90px] h-[140px] bg-neutral-700 rounded-md"></div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
