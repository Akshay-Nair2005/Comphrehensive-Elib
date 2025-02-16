import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { account } from "../../appwritee/appwrite";

const UserEditor = () => {
  const { uhbookId } = useParams(); // Extract hostedBookId (hbookIdd) from URL params
  const editorRef = useRef(null);
  const [chapterTitle, setChapterTitle] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [hostedBookName, setHostedBookName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
        const response = await fetch(
          `http://localhost:5000/hbooks/${uhbookId}`
        );
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
  };

  const handleSaveChapter = async () => {
    if (!chapterTitle.trim()) {
      alert("Chapter title cannot be empty!");
      return;
    }

    const chapterContent = editorRef.current.getValue();
    if (!chapterContent.trim()) {
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
      // Step 1: Create Contribution
      const response = await fetch("http://localhost:5000/contributions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contributionData),
      });

      if (!response.ok) {
        throw new Error("Failed to save contribution.");
      }

      const contribution = await response.json();

      // Step 2: Update Hosted Book with New Contribution ID
      const updateResponse = await fetch(
        `http://localhost:5000/hbooks/${uhbookId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            $push: { contributions: contribution.$id }, // Append new contribution
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update hosted book with contribution.");
      }

      alert("Contribution saved successfully!");
      setChapterTitle("");
      editorRef.current.setValue(""); // Clear editor after saving
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      alert("An error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#E1CDBB] flex flex-col">
      {/* Header Section */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#5E3023] shadow-lg">
        <h1 className="text-2xl font-title text-white">
          Add your contribution
        </h1>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Enter Chapter Title"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            className="px-4 py-2 text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSaveChapter}
            className="ml-4 px-6 py-2 font-semibold text-black bg-beige rounded-lg shadow-md"
          >
            Save Chapter
          </button>
        </div>
      </header>

      {/* Editor Section */}
      <div className="flex-grow p-6">
        <div className="h-full rounded-lg shadow-lg bg-gray-900 border border-gray-700">
          <Editor
            theme="vs"
            height="100%"
            defaultLanguage="plaintext"
            defaultValue=""
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserEditor;
