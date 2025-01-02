import React, { useRef, useState } from "react";
import Editor from "@monaco-editor/react";

const CustomEditor = () => {
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
        <div style={{ height: "100vh", width: "100vw" }}>
            <div style={{ position: "absolute", zIndex: 1, bottom: "10px", left: "10px" }}>
                <input
                    type="text"
                    placeholder="Chapter Title"
                    value={Chapter_title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                        marginRight: "10px",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        outline: "none",
                    }}
                />
                <button
                    onClick={saveValue}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#FFF",
                        color: "#000",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Save Chapter
                </button>
            </div>
            <Editor
                height="80%"
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
    );
};

export default CustomEditor;
