import React, { useState, useRef } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

const PdfReader = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderValue, setSliderValue] = useState(1);
  const intervalRef = useRef(null);

  const handleLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
    } else {
      intervalRef.current = setInterval(() => {
        setCurrentPage((prev) => (prev < numPages ? prev + 1 : prev));
      }, 3000); // 3 seconds per page
    }
    setIsPlaying(!isPlaying);
  };

  const handleForwardBackward = (step) => {
    const newPage = Math.min(Math.max(currentPage + step, 1), numPages);
    setCurrentPage(newPage);
    setSliderValue(newPage);
  };

  const handleSliderChange = (value) => {
    setCurrentPage(value);
    setSliderValue(value);
  };

  return (
    <div className="pdf-reader">
      <input
        type="text"
        placeholder="Enter PDF URL"
        value={pdfUrl}
        onChange={(e) => setPdfUrl(e.target.value)}
        className="url-input"
      />
      <div className="pdf-container">
        {pdfUrl && (
          <Document
            file={pdfUrl}
            onLoadSuccess={handleLoadSuccess}
            className="pdf-document"
          >
            <Page pageNumber={currentPage} />
          </Document>
        )}
      </div>
      <div className="controls">
        <button
          onClick={() => handleForwardBackward(-10)}
          className="text-white"
        >
          ⏪ -10 sec
        </button>
        <button onClick={handlePlayPause} className="text-white">
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
        <button
          onClick={() => handleForwardBackward(10)}
          className="text-white"
        >
          ⏩ +10 sec
        </button>
        <input
          type="range"
          min="1"
          max={numPages || 1}
          value={sliderValue}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="slider"
        />
        <span>
          Page {currentPage} of {numPages || 0}
        </span>
      </div>
    </div>
  );
};

export default PdfReader;
