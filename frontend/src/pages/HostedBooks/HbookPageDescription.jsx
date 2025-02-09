import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../assets/css/page.css";
import { Link } from "react-router-dom";
import Review from "../../components/Book/Review";
import { account } from "../../appwritee/appwrite"; // Ensure correct import

export const HbookPageDescription = () => {
  const { hbookId } = useParams(); // Fetch the bookId from the URL params
  const [hbook, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullNovelDesc, setShowFullNovelDesc] = useState(false);
  const [showFullAuthorDesc, setShowFullAuthorDesc] = useState(false);

  const NOVEL_DESC_LIMIT = 800; // Character limit for novel description
  const AUTHOR_DESC_LIMIT = 800; // Character limit for author description

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/hbooks/${hbookId}`);
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
  }, [hbookId]);

  const saveBook = async () => {
    try {
      // 🔹 Get the user details from Appwrite
      const userDetails = await account.get();
      const userrId = userDetails.$id;

      // 🔹 Fetch user details from backend
      const userResponse = await fetch(
        `http://localhost:5000/user/${userrId}/`
      );

      if (!userResponse.ok) {
        throw new Error("User not found");
      }

      const userData = await userResponse.json();

      // 🔹 Ensure `custombooks` exists
      const updatedBooks = userData.hostedbooks || [];

      // 🔹 Check if book already exists
      if (updatedBooks.includes(hbookId)) {
        alert("Book already saved!");
        return;
      }

      updatedBooks.push(hbookId); // Append new book

      const response = await fetch(
        `http://localhost:5000/user/${userrId}/hostedbooks`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hostedbooks: updatedBooks }), // ✅ Fix key name
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the user’s saved books");
      }

      alert("Book saved successfully!");
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving the book");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen ">
        {/* Loader Animation */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#5E3023]"></div>
        {/* Loader Text */}
        <p className="mt-4 text-lg font-medium text-black">
          Loading your book...
        </p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-black py-20">{error}</div>;
  }

  if (!hbook) {
    return <div className="text-center text-black py-20">Book not found</div>;
  }

  const renderDescription = (text, limit, isExpanded, toggleExpand) => {
    if (text.length <= limit) {
      return <p>{text}</p>;
    }
    return (
      <p>
        {isExpanded ? text : `${text.substring(0, limit)}...`}
        <button onClick={toggleExpand} className="text-black ml-2 underline">
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
            src={hbook.hbook_novelimg}
            alt={hbook.hbook_name}
            className="w-full   object-cover rounded-lg"
          />
        </div>

        {/* Book Information Section */}
        <div className="w-full lg:w-2/3 text-black space-y-6">
          <h1 className="text-4xl font-bold text-color">{hbook.hbook_name}</h1>
          {renderDescription(
            hbook.hbook_desc,
            NOVEL_DESC_LIMIT,
            showFullNovelDesc,
            () => setShowFullNovelDesc(!showFullNovelDesc)
          )}
          <h2 className="text-xl font-semibold mt-4">{hbook.hbook_author}</h2>
          {renderDescription(
            hbook.hbook_authdesc,
            AUTHOR_DESC_LIMIT,
            showFullAuthorDesc,
            () => setShowFullAuthorDesc(!showFullAuthorDesc)
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 mt-6">
            <Link
              to={`/text/${hbook.$id}`}
              className="btn rounded-full bg-beige"
            >
              Read
            </Link>
            <button onClick={saveBook} className="btn rounded-full bg-beige">
              Save
            </button>
            <button className="btn rounded-full bg-beige">Audio Book</button>
          </div>
        </div>
      </div>
      <Review />
    </section>
  );
};
