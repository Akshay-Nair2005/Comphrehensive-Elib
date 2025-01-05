import PdfView from "../../components/Book/PdfView";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const PdfViewer = () => {
  const [bookUrl, setBookUrl] = useState("");
  const { BookId } = useParams();

  useEffect(() => {
    const fetchBookUrl = async () => {
      try {
        console.log(BookId);
        const response = await fetch(`http://localhost:5000/books/${BookId}`);
        const data = await response.json();
        console.log(data);
        setBookUrl(data.Novel_url);
      } catch (error) {
        console.error("Error fetching book URL:", error);
      }
    };

    fetchBookUrl();
  }, []);
  return (
    <>
      {bookUrl ? (
        <PdfView pdfUrl={bookUrl} />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          {/* Loader Animation */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E94F2C]"></div>
          {/* Loader Text */}
          <p className="mt-4 text-lg font-medium text-white">
            Loading your book...
          </p>
        </div>
      )}
    </>
  );
};
