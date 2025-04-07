import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../../assets/css/page.css";
import Review from "../../components/Book/Review";
import { account } from "../../appwritee/appwrite"; // Ensure correct import

export const PageDescription = () => {
  const { bookId } = useParams(); // Fetch the bookId from the URL params
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // 🔹 New state for button loading
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
        setError(err.message || "Failed to fetch book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const saveBook = async () => {
    setSaving(true); // 🔹 Start saving state

    try {
      // 🔹 Get the user details from Appwrite
      const userDetails = await account.get();
      const userId = userDetails.$id;

      // 🔹 Fetch user details from backend
      const userResponse = await fetch(`http://localhost:5000/user/${userId}`);
      if (!userResponse.ok) {
        throw new Error("User not found");
      }

      const userData = await userResponse.json();

      // 🔹 Ensure custombooks exists
      const updatedBooks = userData.custombooks || [];

      const bookExists = updatedBooks.some((book) => book.$id === bookId);
      if (bookExists) {
        alert("Book already saved!");
        setSaving(false); // 🔹 Reset saving state
        return;
      }

      updatedBooks.push(bookId); // Append new book

      const response = await fetch(`http://localhost:5000/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ custombooks: updatedBooks }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the user’s saved books");
      }

      alert("Book saved successfully!");
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving the book");
    } finally {
      setSaving(false); // 🔹 Stop saving state
    }
  };

  // Handle description rendering logic
  const renderDescription = (text, limit, isExpanded, toggleExpand) => {
    if (text.length <= limit) {
      return <p>{text}</p>;
    }
    return (
      <p>
        {isExpanded ? text : `${text.substring(0, limit)}...`}
        <button onClick={toggleExpand} className="text-color ml-2 underline">
          {isExpanded ? "Show Less" : "Read More"}
        </button>
      </p>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        {/* Loader Animation */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#5E3023]"></div>
        {/* Loader Text */}
        <p className="mt-4 text-lg font-medium text-color">
          Loading your book...
        </p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-color py-20">{error}</div>;
  }

  if (!book) {
    return <div className="text-center text-color py-20">Book not found</div>;
  }

  return (
    <section>
      <div className="flex flex-col lg:flex-row items-center justify-between p-6 space-y-6 lg:space-y-0 lg:space-x-10">
        {/* Image Section */}
        <div className="w-full lg:w-1/3 rounded-xl">
          <img
            src={book.Novel_img}
            alt={book.Novel_Name}
            className="w-full object-cover rounded-lg"
          />
        </div>

        {/* Book Information Section */}
        <div className="w-full lg:w-2/3 text-black space-y-6">
          <h1 className="text-4xl font-bold text-color">{book.Novel_Name}</h1>
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
            <button onClick={saveBook} className="btn rounded-full">
              {saving ? "Saving..." : "Save"} {/* 🔹 Button text updates */}
            </button>
            {/* <Link to="/read" className="btn rounded-full">
              Audio Book
            </Link> */}
          </div>
        </div>
      </div>
      <Review />
    </section>
  );
};
