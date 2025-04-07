import React, { useEffect, useState } from "react";
import { account } from "../../appwritee/appwrite";
import BookCard from "../../components/Book/BookCard";

const SavedBooks = () => {
  const [customBooks, setCustomBooks] = useState([]);
  const [hostedBooks, setHostedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(null); // Track menu for each book

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        const user = await account.get();
        const response = await fetch(`http://localhost:5000/user/${user.$id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }

        const userData = await response.json();
        setCustomBooks(userData.custombooks || []);
        setHostedBooks(userData.hostedbooks || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBooks();
  }, []);

  const deleteBook = async (bookId, type) => {
    try {
      const user = await account.get();

      // Delete book from backend
      const response = await fetch(`http://localhost:5000/user/${user.$id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, type }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete book. Status: ${response.status}`);
      }

      // Update state
      if (type === "custom") {
        setCustomBooks(customBooks.filter((book) => book.$id !== bookId));
      } else {
        setHostedBooks(hostedBooks.filter((book) => book.$id !== bookId));
      }

      setMenuOpen(null);
    } catch (err) {
      setError(err.message || "Failed to delete book");
    }
  };

  const toggleMenu = (bookId) => {
    setMenuOpen(menuOpen === bookId ? null : bookId);
  };

  const renderBooks = (books, type) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.$id}
          book={book}
          type={type}
          menuOpen={menuOpen}
          toggleMenu={toggleMenu}
          deleteBook={deleteBook}
        />
      ))}
    </div>
  );

  if (loading)
    return <div className="flex justify-center p-10">Loading...</div>;
  if (error) return <div className="text-red-500 p-10">Error: {error}</div>;

  return (
    <section className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Saved Books
      </h1>

      {/* Custom Books Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Books by Renowned authors
        </h2>
        {customBooks.length > 0 ? (
          renderBooks(customBooks, "custom")
        ) : (
          <p className="text-gray-600">No custom books saved.</p>
        )}
      </div>

      {/* Hosted Books Section */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Books by Upcoming Authors
        </h2>
        {hostedBooks.length > 0 ? (
          renderBooks(hostedBooks, "hosted")
        ) : (
          <p className="text-gray-600">No hosted books saved.</p>
        )}
      </div>
    </section>
  );
};

export default SavedBooks;
