import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaMoon,
  FaSun,
  FaPlus,
  FaMinus,
  FaBars,
  FaTimes,
  FaVolumeUp,
  FaVolumeMute,
  FaBookOpen,
  FaFeatherAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi";
import { IoBookOutline } from "react-icons/io5";
import Navv from "../../components/LinkComponents/Navv";

export const TextViewer = () => {
  const { hbookTId } = useParams();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(`http://localhost:5000/hbooks/${hbookTId}`);
        if (!response.ok) throw new Error("Failed to fetch chapters");
        const data = await response.json();
        if (data?.chapters?.length) {
          setChapters(data.chapters);
          setCurrentChapter(data.chapters[0]);
          setCurrentIndex(0);
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

  useEffect(() => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    }
  }, [currentChapter]);

  useEffect(() => {
    const handleBackButton = () => {
      window.speechSynthesis.cancel();
      setIsReading(false);
    };
    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, []);

  const handleZoomIn = () => setFontSize((prev) => Math.min(prev + 2, 32));
  const handleZoomOut = () => setFontSize((prev) => Math.max(prev - 2, 12));
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleReadAloud = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else if (currentChapter?.Chapter_content) {
      const utterance = new SpeechSynthesisUtterance(currentChapter.Chapter_content);
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
      setSpeechUtterance(utterance);
      setIsReading(true);
    }
  };

  const goToChapter = (index) => {
    if (index >= 0 && index < chapters.length) {
      setCurrentChapter(chapters[index]);
      setCurrentIndex(index);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <IoBookOutline className="text-6xl text-[#5E3023] animate-pulse mx-auto" />
            <div className="absolute -top-1 -right-1">
              <FaFeatherAlt className="text-xl text-[#5E3023]/60 animate-bounce" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-serif text-lg italic">Loading chapters...</p>
        </div>
      </div>
    );
  }

  if (!chapters.length) {
    return (
      <div className={darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-100"}>
        <Navv />
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className={`w-32 h-32 ${darkMode ? "bg-gray-800" : "bg-gradient-to-br from-[#5E3023]/10 to-[#5E3023]/5"} rounded-full flex items-center justify-center`}>
                <FaBookOpen className={`text-5xl ${darkMode ? "text-[#E1CDBB]/40" : "text-[#5E3023]/40"}`} />
              </div>
              <div className={`absolute -bottom-2 -right-2 w-12 h-12 ${darkMode ? "bg-gray-700" : "bg-white"} rounded-full shadow-lg flex items-center justify-center`}>
                <FaFeatherAlt className={`text-xl ${darkMode ? "text-[#E1CDBB]/60" : "text-[#5E3023]/60"}`} />
              </div>
            </div>
            <h1 className={`text-3xl font-serif font-bold mb-3 ${darkMode ? "text-[#E1CDBB]" : "text-gray-800"}`}>
              No Chapters Available
            </h1>
            <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Please check back later or explore another book.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-[#E1CDBB]" : "bg-[#FFF8F3] text-gray-800"}`}>
      {/* Top Bar */}
      <div className={`sticky top-0 z-50 backdrop-blur-md ${darkMode ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-200"} border-b shadow-sm`}>
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className={`p-2.5 rounded-xl transition-all duration-300 ${darkMode ? "bg-[#E1CDBB] text-gray-900 hover:bg-[#d4c0ae]" : "bg-[#5E3023] text-white hover:bg-[#4a261c]"}`}
            >
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
            <div className="hidden sm:block">
              <h1 className="font-serif font-bold text-lg line-clamp-1">{currentChapter?.Chapter_title}</h1>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Chapter {currentIndex + 1} of {chapters.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              <button onClick={handleZoomOut} className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
                <FaMinus className="text-sm" />
              </button>
              <span className="text-sm font-medium w-8 text-center">{fontSize}</span>
              <button onClick={handleZoomIn} className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
                <FaPlus className="text-sm" />
              </button>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl transition-all duration-300 ${darkMode ? "bg-[#E1CDBB] text-gray-900" : "bg-[#5E3023] text-white"}`}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            
            <button
              onClick={handleReadAloud}
              className={`p-2.5 rounded-xl transition-all duration-300 ${isReading ? "bg-red-500 text-white" : darkMode ? "bg-[#E1CDBB] text-gray-900" : "bg-[#5E3023] text-white"}`}
            >
              {isReading ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className={`fixed lg:sticky top-0 left-0 h-screen z-40 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:opacity-0"} ${darkMode ? "bg-gray-800" : "bg-white"} shadow-xl lg:shadow-none w-72`}>
          <div className="p-6 h-full overflow-y-auto">
            <div className="flex items-center gap-2 mb-6">
              <HiOutlineBookOpen className={`text-2xl ${darkMode ? "text-[#E1CDBB]" : "text-[#5E3023]"}`} />
              <h2 className="font-serif font-bold text-xl">Chapters</h2>
            </div>
            <ul className="space-y-2">
              {chapters.map((chapter, index) => (
                <li
                  key={index}
                  onClick={() => {
                    goToChapter(index);
                    setIsSidebarOpen(false);
                  }}
                  className={`cursor-pointer p-3 rounded-xl transition-all duration-300 ${
                    currentIndex === index
                      ? darkMode ? "bg-[#E1CDBB] text-gray-900" : "bg-[#5E3023] text-white"
                      : darkMode ? "hover:bg-gray-700" : "hover:bg-[#5E3023]/10"
                  }`}
                >
                  <span className="font-medium line-clamp-1">{chapter.Chapter_title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
            <article className="prose prose-lg max-w-none" style={{ fontSize: `${fontSize}px` }}>
              {currentChapter?.Chapter_content?.replace(/\r\n/g, "\n")?.replace(/\r/g, "\n")?.split("\n").map((paragraph, index) => (
                <p key={index} className={`mb-6 leading-relaxed ${darkMode ? "text-[#E1CDBB]" : "text-gray-700"}`} style={{ textIndent: "2em" }}>
                  {paragraph.trim()}
                </p>
              ))}
            </article>
          </div>

          {/* Bottom Navigation */}
          <div className={`sticky bottom-0 ${darkMode ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-200"} border-t backdrop-blur-md`}>
            <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => goToChapter(currentIndex - 1)}
                disabled={currentIndex === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  currentIndex === 0
                    ? "opacity-50 cursor-not-allowed"
                    : darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <FaChevronLeft className="text-sm" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              
              <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {currentIndex + 1} / {chapters.length}
              </span>
              
              <button
                onClick={() => goToChapter(currentIndex + 1)}
                disabled={currentIndex === chapters.length - 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  currentIndex === chapters.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : darkMode ? "bg-[#E1CDBB] text-gray-900 hover:bg-[#d4c0ae]" : "bg-[#5E3023] text-white hover:bg-[#4a261c]"
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
