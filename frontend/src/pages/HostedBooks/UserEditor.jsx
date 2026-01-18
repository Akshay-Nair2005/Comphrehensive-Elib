import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { account } from "../../appwritee/appwrite";
import { 
  FaPenNib, 
  FaSave, 
  FaFeatherAlt, 
  FaUsers, 
  FaBookOpen,
  FaExpand,
  FaCompress,
  FaLightbulb,
  FaMoon,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";
import { HiOutlineBookOpen, HiSparkles } from "react-icons/hi";
import { IoBookOutline, IoClose } from "react-icons/io5";
import { BsStars } from "react-icons/bs";

const UserEditor = () => {
  const { uhbookId } = useParams();
  const editorRef = useRef(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [hostedBookName, setHostedBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await account.get();
        setUserId(userDetails.$id);
        setUserName(userDetails.name);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchHostedBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/hbooks/${uhbookId}`);
        const bookData = await response.json();
        setHostedBookName(bookData.hbook_name);
        setAuthorName(bookData.hbook_author);
      } catch (error) {
        console.error("Error fetching hosted book details:", error);
      }
    };

    fetchUserDetails();
    fetchHostedBookDetails();
  }, [uhbookId]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      const text = editor.getValue();
      const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      setWordCount(words);
      setCharCount(text.length);
    });
  };

  const handleSaveChapter = async () => {
    const chapterContent = editorRef.current.getValue();
    if (!chapterTitle.trim()) {
      setError("Chapter title cannot be empty!");
      setTimeout(() => setError(""), 3000);
      return;
    }
    if (!chapterContent) {
      setError("Chapter content cannot be empty!");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setSaving(true);
    setError("");

    const contributionData = {
      userid: userId,
      hostedBooksId: uhbookId,
      userName,
      hostedBookName,
      authorName,
      chaptertitle: chapterTitle,
      chaptercontent: chapterContent,
    };

    try {
      const response = await fetch("http://localhost:5000/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contributionData),
      });

      if (!response.ok) {
        throw new Error("Failed to save contribution.");
      }

      const contribution = await response.json();

      const updateResponse = await fetch(`http://localhost:5000/hbooks/${uhbookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          $push: { contributions: contribution.$id },
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update hosted book with contribution.");
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setChapterTitle("");
      editorRef.current.setValue("");
      setWordCount(0);
      setCharCount(0);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setChapterTitle("");
      editorRef.current.setValue("");
      setWordCount(0);
      setCharCount(0);
    } finally {
      setSaving(false);
    }
  };

  const getWordCountColor = () => {
    if (wordCount < 100) return "text-orange-500";
    if (wordCount < 500) return "text-yellow-500";
    return "text-green-500";
  };

  const getProgressWidth = () => {
    const target = 1000;
    const percentage = Math.min((wordCount / target) * 100, 100);
    return `${percentage}%`;
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' 
        : 'bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30'
    }`}>
      {/* Success Toast */}
      <div className={`fixed top-4 right-4 z-[100] transition-all duration-500 transform ${
        showSuccess ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl">
          <FaCheckCircle className="text-xl" />
          <span className="font-medium">Contribution saved successfully!</span>
        </div>
      </div>

      {/* Error Toast */}
      <div className={`fixed top-4 right-4 z-[100] transition-all duration-500 transform ${
        error ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="flex items-center gap-3 bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl">
          <FaExclamationCircle className="text-xl" />
          <span className="font-medium">{error}</span>
        </div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-500 ${
        focusMode ? 'opacity-0 pointer-events-none h-0 overflow-hidden' : ''
      } ${darkMode 
        ? 'bg-gradient-to-r from-slate-800/95 via-slate-800/95 to-slate-800/95 border-b border-slate-700' 
        : 'bg-gradient-to-r from-[#5E3023]/95 via-[#6b3a2a]/95 to-[#5E3023]/95 shadow-xl'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title Section */}
            <div className="flex items-center gap-4">
              <Link 
                to={`/hpage/${uhbookId}`}
                className="group w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300"
              >
                <FaArrowLeft className="text-white text-sm sm:text-base group-hover:-translate-x-1 transition-transform" />
              </Link>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center animate-pulse">
                <BsStars className="text-white text-lg sm:text-xl" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-white flex items-center gap-2">
                  Add Your Contribution
                  <HiSparkles className="text-amber-300 text-sm" />
                </h1>
                <p className="text-white/70 text-xs sm:text-sm italic truncate max-w-[200px] sm:max-w-none">
                  Contributing to: <span className="text-amber-200">{hostedBookName || "Loading..."}</span>
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[180px] sm:min-w-[220px] group">
                <FaFeatherAlt className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 transition-colors ${
                  darkMode ? 'text-slate-400' : 'text-[#5E3023]/50'
                } group-focus-within:text-[#5E3023]`} />
                <input
                  type="text"
                  placeholder="Enter Chapter Title..."
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  className={`w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border-2 border-transparent focus:outline-none transition-all shadow-lg ${
                    darkMode 
                      ? 'bg-slate-700 text-white placeholder-slate-400 focus:border-amber-500/50' 
                      : 'bg-white text-gray-900 focus:border-[#5E3023]/30'
                  }`}
                />
              </div>
              
              <button
                onClick={handleSaveChapter}
                disabled={saving}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm sm:text-base ${
                  darkMode 
                    ? 'bg-amber-500 text-slate-900 hover:bg-amber-400' 
                    : 'bg-white text-[#5E3023] hover:bg-amber-50'
                }`}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[#5E3023] border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Saving...</span>
                  </>
                ) : (
                  <>
                    <FaSave />
                    <span className="hidden sm:inline">Submit Contribution</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-500 ${
        focusMode ? 'py-4' : 'py-6 sm:py-8'
      }`}>
        {/* Info Banner */}
        <div className={`mb-4 sm:mb-6 rounded-2xl p-3 sm:p-4 transition-all duration-500 ${
          focusMode ? 'opacity-0 h-0 overflow-hidden mb-0 p-0' : ''
        } ${darkMode 
          ? 'bg-gradient-to-r from-slate-800/50 via-slate-800/80 to-slate-800/50 border border-slate-700' 
          : 'bg-gradient-to-r from-[#5E3023]/5 via-[#5E3023]/10 to-[#5E3023]/5'
        }`}>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <FaBookOpen className={darkMode ? 'text-amber-400' : 'text-[#5E3023]'} />
              <span className={darkMode ? 'text-slate-400' : 'text-gray-600'}>Book:</span>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {hostedBookName || "Loading..."}
              </span>
            </div>
            <div className={`hidden md:block w-px h-4 ${darkMode ? 'bg-slate-600' : 'bg-[#5E3023]/20'}`}></div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <FaPenNib className={darkMode ? 'text-amber-400' : 'text-[#5E3023]'} />
              <span className={darkMode ? 'text-slate-400' : 'text-gray-600'}>Author:</span>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {authorName || "Loading..."}
              </span>
            </div>
            <div className={`hidden md:block w-px h-4 ${darkMode ? 'bg-slate-600' : 'bg-[#5E3023]/20'}`}></div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <FaUsers className={darkMode ? 'text-amber-400' : 'text-[#5E3023]'} />
              <span className={darkMode ? 'text-slate-400' : 'text-gray-600'}>Contributor:</span>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {userName || "Loading..."}
              </span>
            </div>
          </div>
        </div>

        {/* Editor Card */}
        <div className={`rounded-2xl shadow-xl overflow-hidden transition-all duration-500 ${
          darkMode 
            ? 'bg-slate-800 border border-slate-700' 
            : 'bg-white'
        } ${focusMode ? 'shadow-2xl' : ''}`}>
          {/* Editor Header */}
          <div className={`flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b transition-colors ${
            darkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
          }`}>
            <div className="flex items-center gap-2 sm:gap-3">
              <HiOutlineBookOpen className={`text-lg sm:text-xl ${darkMode ? 'text-amber-400' : 'text-[#5E3023]'}`} />
              <span className={`font-medium text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Your Chapter Content
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Word Count Progress */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Progress</span>
                    <span className={`text-sm font-bold ${getWordCountColor()}`}>{wordCount}</span>
                    <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>/ 1000 words</span>
                  </div>
                  <div className={`w-32 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-green-500 transition-all duration-500 rounded-full"
                      style={{ width: getProgressWidth() }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Stats Pills */}
              <div className="flex items-center gap-1 sm:gap-2">
                <span className={`text-xs px-2 sm:px-3 py-1 rounded-full shadow-sm ${
                  darkMode ? 'bg-slate-700 text-amber-400' : 'bg-white text-[#5E3023]'
                }`}>
                  <span className="sm:hidden">{wordCount}w</span>
                  <span className="hidden sm:inline">{wordCount} words</span>
                </span>
                <span className={`text-xs px-2 sm:px-3 py-1 rounded-full shadow-sm ${
                  darkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-gray-600'
                }`}>
                  <span className="sm:hidden">{charCount}c</span>
                  <span className="hidden sm:inline">{charCount} chars</span>
                </span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${
                    darkMode 
                      ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={darkMode ? "Light Mode" : "Dark Mode"}
                >
                  {darkMode ? <FaLightbulb className="text-sm" /> : <FaMoon className="text-sm" />}
                </button>
                <button
                  onClick={() => setFocusMode(!focusMode)}
                  className={`p-2 rounded-lg transition-all hover:scale-105 ${
                    focusMode 
                      ? (darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-[#5E3023]/10 text-[#5E3023]')
                      : (darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                  }`}
                  title={focusMode ? "Exit Focus Mode" : "Focus Mode"}
                >
                  {focusMode ? <FaCompress className="text-sm" /> : <FaExpand className="text-sm" />}
                </button>
              </div>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className={`transition-all duration-500 ${
            focusMode ? 'h-[calc(100vh-120px)]' : 'h-[calc(100vh-380px)] min-h-[400px]'
          }`}>
            <Editor
              height="100%"
              defaultLanguage="plaintext"
              defaultValue=""
              onMount={handleEditorDidMount}
              theme={darkMode ? "vs-dark" : "vs"}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: focusMode ? 18 : 16,
                lineHeight: focusMode ? 32 : 28,
                wordWrap: "on",
                padding: { top: 24, bottom: 24 },
                fontFamily: "'Georgia', 'Merriweather', 'Times New Roman', serif",
                lineNumbers: "off",
                folding: false,
                renderLineHighlight: "none",
                overviewRulerBorder: false,
                hideCursorInOverviewRuler: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
                scrollbar: {
                  vertical: "auto",
                  horizontal: "hidden",
                  verticalScrollbarSize: 8,
                },
              }}
            />
          </div>
        </div>

        {/* Guidelines */}
        <div className={`mt-4 sm:mt-6 rounded-2xl shadow-lg p-4 sm:p-6 transition-all duration-500 ${
          focusMode || !showGuidelines ? 'opacity-0 h-0 overflow-hidden mt-0 p-0' : ''
        } ${darkMode 
          ? 'bg-slate-800 border border-slate-700' 
          : 'bg-white'
        }`}>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              darkMode 
                ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10' 
                : 'bg-gradient-to-br from-[#5E3023]/10 to-[#5E3023]/5'
            }`}>
              <IoBookOutline className={`text-base sm:text-lg ${darkMode ? 'text-amber-400' : 'text-[#5E3023]'}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-serif font-bold text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Contribution Guidelines
                </h3>
                <button 
                  onClick={() => setShowGuidelines(false)}
                  className={`p-1 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-400'
                  }`}
                >
                  <IoClose />
                </button>
              </div>
              <ul className={`text-xs sm:text-sm space-y-2 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                <li className="flex items-start gap-2">
                  <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${darkMode ? 'bg-amber-400' : 'bg-[#5E3023]'}`}></span>
                  Your contribution will be reviewed by the original author before publishing
                </li>
                <li className="flex items-start gap-2">
                  <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${darkMode ? 'bg-amber-400' : 'bg-[#5E3023]'}`}></span>
                  Maintain consistency with the existing story tone and style
                </li>
                <li className="flex items-start gap-2">
                  <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${darkMode ? 'bg-amber-400' : 'bg-[#5E3023]'}`}></span>
                  Original content only - plagiarism will result in rejection
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Focus Mode Exit Button */}
        {focusMode && (
          <button
            onClick={() => setFocusMode(false)}
            className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 text-sm font-medium text-gray-700 dark:text-white border border-gray-200 dark:border-slate-700"
          >
            <FaCompress className="text-xs" />
            Exit Focus Mode
          </button>
        )}
      </div>
    </div>
  );
};

export default UserEditor;
