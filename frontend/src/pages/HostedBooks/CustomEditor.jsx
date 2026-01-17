import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { FaPenNib, FaSave, FaFeatherAlt, FaBookOpen } from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi";
import { IoBookOutline } from "react-icons/io5";

export const CustomEditor = () => {
  const { hbookIdd } = useParams();
  const editorRef = useRef(null);
  const [Chapter_title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      const text = editor.getValue();
      const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      setWordCount(words);
    });
  }

  async function saveValue() {
    const Chapter_content = editorRef.current.getValue();

    if (!Chapter_title.trim()) {
      alert("Title is required!");
      return;
    }
    if (!Chapter_content) {
      alert("No chapter content entered!");
      return;
    }
    setSaving(true);

    try {
      const chapterResponse = await fetch("http://localhost:5000/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Chapter_title,
          Chapter_content,
          hostedBookId: hbookIdd,
        }),
      });

      if (!chapterResponse.ok) {
        const errorData = await chapterResponse.json();
        return;
      }

      const chapterData = await chapterResponse.json();

      const updateHostedBookResponse = await fetch(
        `http://localhost:5000/hbooks/${hbookIdd}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chapters: [chapterData.Chapter_title, chapterData.Chapter_content],
          }),
        }
      );

      if (updateHostedBookResponse.ok) {
        alert("Chapter saved and linked to the hosted book successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Chapter Saved.");
      setTitle("");
      editorRef.current.setValue("");
      setWordCount(0);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#5E3023] via-[#6b3a2a] to-[#5E3023] shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Title Section */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FaPenNib className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-serif font-bold text-white">
                  Write Your Chapter
                </h1>
                <p className="text-white/70 text-sm italic">Let your creativity flow</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <FaFeatherAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5E3023]/50" />
                <input
                  type="text"
                  placeholder="Enter Chapter Title..."
                  value={Chapter_title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-gray-900 bg-white rounded-xl border-2 border-transparent focus:border-white/30 focus:outline-none transition-all shadow-lg"
                />
              </div>
              
              <button
                onClick={saveValue}
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
                    Save Chapter
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Editor Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <div className="flex items-center gap-3">
              <HiOutlineBookOpen className="text-[#5E3023] text-xl" />
              <span className="font-medium text-gray-700">Chapter Content</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                {wordCount} words
              </span>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="h-[calc(100vh-280px)] min-h-[500px]">
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

        {/* Tips Section */}
        <div className="mt-6 bg-gradient-to-r from-[#5E3023]/5 via-[#5E3023]/10 to-[#5E3023]/5 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <IoBookOutline className="text-[#5E3023] text-lg" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-gray-800 mb-2">Writing Tips</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li> Start with a compelling hook to grab your readers attention</li>
                <li> Use descriptive language to paint vivid scenes</li>
                <li> End chapters with cliffhangers to keep readers engaged</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
