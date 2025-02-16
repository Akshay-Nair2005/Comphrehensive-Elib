import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";

export const PdfReader = () => {
  const [fileUrl, setFileUrl] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [error, setError] = useState(null);

  const fetchFile = async () => {
    if (!fileUrl) return;
    setError(null);
    setFileContent("");
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Failed to fetch file");

      // Get the PDF as a blob
      const blob = await response.blob();
      const pdf = await pdfjsLib.getDocument(URL.createObjectURL(blob)).promise;

      // Extract text from the PDF
      const numPages = pdf.numPages;
      let content = "";
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        textContent.items.forEach((item) => {
          content += item.str + " ";
        });
      }
      setFileContent(content);
    } catch (err) {
      setError(err.message);
    }
  };

  const narrateText = () => {
    if (!fileContent) return;
    const speech = new SpeechSynthesisUtterance(fileContent);
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-4">
      <h1 className="text-xl font-bold">File Reader</h1>
      <input
        type="text"
        placeholder="Enter file URL"
        value={fileUrl}
        onChange={(e) => setFileUrl(e.target.value)}
        className="w-full max-w-md p-2 border rounded"
      />
      <button
        onClick={fetchFile}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Read File
      </button>
      {fileContent && (
        <button
          onClick={narrateText}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Narrate
        </button>
      )}
      {error && <p className="text-red-500">Error: {error}</p>}
      <div className="w-full max-w-md p-4 border rounded bg-gray-100">
        <pre className="whitespace-pre-wrap text-sm">
          {fileContent || "File content will appear here..."}
        </pre>
      </div>
    </div>
  );
};
