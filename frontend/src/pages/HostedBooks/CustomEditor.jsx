import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
("use client");

import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "react-router-dom";

export const CustomEditor = () => {
  const { hbookIdd } = useParams(); // Extract hostedBookId (hbookIdd) from URL params
  const editorRef = useRef(null);
  const [Chapter_title, setTitle] = useState(""); // State for chapter title
  const [saving, setSaving] = useState(false);

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
    setSaving(true);

    try {
      // First, save the chapter to the chapters collection
      const chapterResponse = await fetch("http://localhost:5000/chapters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Chapter_title,
          Chapter_content,
          hostedBookId: hbookIdd,
        }),
      });

      if (!chapterResponse.ok) {
        const errorData = await chapterResponse.json();
        // alert(`Failed to save chapter: ${errorData.error}`);
        return;
      }

      const chapterData = await chapterResponse.json();
      console.log(chapterData);

      // Once the chapter is saved, update the hosted book with the new chapter
      const updateHostedBookResponse = await fetch(
        `http://localhost:5000/hbooks/${hbookIdd}`,
        {
          method: "PATCH", // Assuming PATCH is used to update a document
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chapters: [
              chapterData.Chapter_title, // Add chapter title to the hosted book's list
              chapterData.Chapter_content, // Add the chapter to the hosted book's chapters list
            ],
          }),
        }
      );

      if (updateHostedBookResponse.ok) {
        alert("Chapter saved and linked to the hosted book successfully!");
      } else {
        const errorData = await updateHostedBookResponse.json();
        // alert(`Failed to update hosted book: ${errorData.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Chapter Saved.");
      setTitle("");
      editorRef.current.setValue("");
    } finally {
      setSaving(false); // Stop showing "Saving..."
    }
  }

  return (
    <div className="h-screen w-screen bg-[#E1CDBB] flex flex-col">
      {/* Header Section */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#5E3023] shadow-lg">
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
            className="ml-4 px-6 py-2 font-semibold text-black bg-beige rounded-lg shadow-md"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Chapter"}
          </button>
        </div>
      </header>

      {/* Editor Section */}
      <div className="flex-grow p-6">
        <div className="h-full rounded-lg shadow-lg bg-gray-900 border border-gray-700">
          {/* <LiveblocksProvider
            publicApiKey={
              "pk_dev_Qz2atFlSFAL8PXJQv3V0EwsIrkZ3vmV1uwnDpR3fzPt2_0sVKO8Kt-e2Wric2PcO"
            }
          >
            <RoomProvider id="my-room">
              <ClientSideSuspense fallback={<div>Loading…</div>}> */}
          <Editor
            height="100%"
            defaultLanguage="plaintext"
            defaultValue=""
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
          {/* </ClientSideSuspense>
            </RoomProvider>
          </LiveblocksProvider> */}
        </div>
      </div>
    </div>
  );
};
