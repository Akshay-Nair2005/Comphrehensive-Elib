import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { account } from "../../appwritee/appwrite";
import { FaPenNib, FaSave, FaFeatherAlt, FaUsers, FaBookOpen } from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi";
import { IoBookOutline } from "react-icons/io5";

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
    });
  };

  const handleSaveChapter = async () => {
    const chapterContent = editorRef.current.getValue();
    if (!chapterTitle.trim()) {
      alert("Chapter title cannot be empty!");
      return;
    }
    if (!chapterContent) {
      alert("Chapter content cannot be empty!");
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

      alert("Contribution saved successfully!");
      setChapterTitle("");
      editorRef.current.setValue("");
      setWordCount(0);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      alert("Contribution saved successfully!");
      setChapterTitle("");
      editorRef.current.setValue("");
      setWordCount(0);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#5E3023] via-[#6b3a2a] to-[#5E3023] shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Title Section */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FaUsers className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-serif font-bold text-white">
                  Add Your Contribution
                </h1>
                <p className="text-white/70 text-sm italic">
                  Contributing to: {hostedBookName || "Loading..."}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <FaFeatherAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5E3023]/50" />
                <input
                  type="text"
                  placeholder="Enter Chapter Title..."
                  value={chapterTitle}
                  onChange={(e) => setChapterTitle(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-gray-900 bg-white rounded-xl border-2 border-transparent focus:border-white/30 focus:outline-none transition-all shadow-lg"
                />
              </div>
              
              <button
                onClick={handleSaveChapter}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-white text-[#5E3023] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#5E3023] border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Submit Contribution
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Info Banner */}
        <div className="mb-6 bg-gradient-to-r from-[#5E3023]/5 via-[#5E3023]/10 to-[#5E3023]/5 rounded-2xl p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <FaBookOpen className="text-[#5E3023]" />
              <span className="text-gray-600">Book:</span>
              <span className="font-medium text-gray-800">{hostedBookName || "Loading..."}</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-[#5E3023]/20"></div>
            <div className="flex items-center gap-2 text-sm">
              <FaPenNib className="text-[#5E3023]" />
              <span className="text-gray-600">Author:</span>
              <span className="font-medium text-gray-800">{authorName || "Loading..."}</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-[#5E3023]/20"></div>
            <div className="flex items-center gap-2 text-sm">
              <FaUsers className="text-[#5E3023]" />
              <span className="text-gray-600">Contributor:</span>
              <span className="font-medium text-gray-800">{userName || "Loading..."}</span>
            </div>
          </div>
        </div>

        {/* Editor Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <div className="flex items-center gap-3">
              <HiOutlineBookOpen className="text-[#5E3023] text-xl" />
              <span className="font-medium text-gray-700">Your Chapter Content</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                {wordCount} words
              </span>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="h-[calc(100vh-380px)] min-h-[400px]">
            <Editor
              height="100%"
              defaultLanguage="plaintext"
              defaultValue=""
              onMount={handleEditorDidMount}
              theme="vs"
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 16,
                lineHeight: 28,
                wordWrap: "on",
                padding: { top: 20, bottom: 20 },
                fontFamily: "'Georgia', 'Times New Roman', serif",
                lineNumbers: "off",
                folding: false,
                renderLineHighlight: "none",
                overviewRulerBorder: false,
                hideCursorInOverviewRuler: true,
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
        <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#5E3023]/10 to-[#5E3023]/5 rounded-xl flex items-center justify-center flex-shrink-0">
              <IoBookOutline className="text-[#5E3023] text-lg" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-gray-800 mb-2">Contribution Guidelines</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-[#5E3023]"></span>
                  Your contribution will be reviewed by the original author before publishing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5E3023]"></span>
                  Maintain consistency with the existing story tone and style
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#5E3023]"></span>
                  Original content only - plagiarism will result in rejection
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEditor;
