import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../assets/css/page.css";
import Review from "../../components/Book/Review";
import { Link } from "react-router-dom";

export const PageDescription = () => {
  const { bookId } = useParams(); // Fetch the bookId from the URL params
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullNovelDesc, setShowFullNovelDesc] = useState(false);
  const [showFullAuthorDesc, setShowFullAuthorDesc] = useState(false);

  const NOVEL_DESC_LIMIT = 800; // Character limit for novel description
  const AUTHOR_DESC_LIMIT = 800; // Character limit for author description

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/books/${bookId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setBook(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen ">
        {/* Loader Animation */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E94F2C]"></div>
        {/* Loader Text */}
        <p className="mt-4 text-lg font-medium text-white">
          Loading your book...
        </p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-white py-20">{error}</div>;
  }

  if (!book) {
    return <div className="text-center text-white py-20">Book not found</div>;
  }

  const renderDescription = (text, limit, isExpanded, toggleExpand) => {
    if (text.length <= limit) {
      return <p>{text}</p>;
    }
    return (
      <p>
        {isExpanded ? text : `${text.substring(0, limit)}...`}
        <button onClick={toggleExpand} className="text-white ml-2 underline">
          {isExpanded ? "Show Less" : "Read More"}
        </button>
      </p>
    );
  };

  return (
    <section>
      <div className="flex flex-col lg:flex-row items-center justify-between p-6 space-y-6 lg:space-y-0 lg:space-x-10">
        {/* Image Section */}
        <div className="w-full lg:w-1/3 rounded-xl ">
          <img
            src={book.Novel_img}
            alt={book.Novel_Name}
            className="w-full   object-cover rounded-lg"
          />
        </div>

        {/* Book Information Section */}
        <div className="w-full lg:w-2/3 text-[#FFf] space-y-6">
          <h1 className="text-4xl font-bold text-[#F87871]">
            {book.Novel_Name}
          </h1>
          {renderDescription(
            book.Novel_desc,
            NOVEL_DESC_LIMIT,
            showFullNovelDesc,
            () => setShowFullNovelDesc(!showFullNovelDesc)
          )}
          <h2 className="text-xl font-semibold mt-4">{book.Author_name}</h2>
          {renderDescription(
            book.Author_Decription,
            AUTHOR_DESC_LIMIT,
            showFullAuthorDesc,
            () => setShowFullAuthorDesc(!showFullAuthorDesc)
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <Link to={`/pdf/${book.$id}`} className="btn rounded-full">
              Read
            </Link>
            <button className="btn rounded-full">Save</button>
            <button className="btn rounded-full">Audio Book</button>
          </div>
        </div>
      </div>
      <Review />
    </section>
  );
};
