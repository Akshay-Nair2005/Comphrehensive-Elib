import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";

export const CustomEditor = () => {
  const editorRef = useRef(null);
  const [Chapter_title, setTitle] = useState(""); // State for chapter title

  // Store editor instance in ref
  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  // Save editor value and title to Appwrite database
  async function saveValue() {
    const Chapter_content = editorRef.current.getValue();

    if (!Chapter_title.trim()) {
      alert("Title is required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/chapters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Chapter_title, Chapter_content }),
      });

      if (response.ok) {
        alert("Chapter saved successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to save chapter: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving the chapter.");
    }
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-gray-900 to-gray-800 flex flex-col">
      {/* Header Section */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-800 shadow-lg">
        <div>
          <h1 className="text-2xl font-title text-white">
            Write Your Own Novel
          </h1>
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter Chapter Title"
            value={Chapter_title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-grow max-w-lg px-4 py-2 text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={saveValue}
            className="ml-4 px-6 py-2 font-semibold text-white bg-button rounded-lg shadow-md"
          >
            Save Chapter
          </button>
        </div>
      </header>

      {/* Editor Section */}
      <div className="flex-grow p-6">
        <div className="h-full rounded-lg shadow-lg bg-gray-900 border border-gray-700">
          <Editor
            height="100%"
            defaultLanguage="plaintext"
            defaultValue=""
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
            theme="vs-dark"
          />
        </div>
      </div>
    </div>
  );
};
