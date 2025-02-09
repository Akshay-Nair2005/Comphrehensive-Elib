import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../appwritee/appwrite";
import { FiMoreVertical } from "react-icons/fi"; // Menu Icon
import { AiOutlineDelete, AiOutlineInfoCircle } from "react-icons/ai"; // Info & Delete Icons

const UserBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(null); // Track open menu
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        const user = await account.get();
        const response = await fetch(`http://localhost:5000/user/${user.$id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        const userData = await response.json();
        setBooks(userData.createdhostedbooks || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBooks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      const response = await fetch(`http://localhost:5000/hbooks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      setBooks((prevBooks) => prevBooks.filter((book) => book.$id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4 text-lg text-gray-500">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Books</h1>

      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {books.map((book) => (
            <div
              key={book.$id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition relative"
            >
              {/* Book Cover */}
              <img
                src={book.hbook_novelimg}
                alt={book.hbook_name}
                className="w-full h-60 object-cover rounded-md mb-4"
              />

              {/* Book Title & Genre */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {book.hbook_name}
              </h2>
              <p className="text-gray-600 mb-2 font-medium">
                {book.hbook_genre}
              </p>
              <p className="text-gray-600 text-sm mb-2">{book.hbook_desc}</p>
              <p className="text-gray-600 text-sm font-medium">
                Author: {book.hbook_author}
              </p>

              {/* Read & Edit Buttons */}
              <button
                onClick={() => navigate(`/text/${book.$id}`)}
                className="absolute bottom-16 right-4 bg-button text-white px-4 py-2 rounded-md shadow transition"
              >
                Read Book
              </button>
              <button
                onClick={() => navigate(`/edit/${book.$id}`)}
                className="absolute bottom-4 right-4 bg-button text-white px-4 py-2 rounded-md shadow transition"
              >
                Edit Book
              </button>

              {/* Menu Icon */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() =>
                    setMenuOpen((prev) => (prev === book.$id ? null : book.$id))
                  }
                  className="text-white hover:bg-gray-900 bg-gray-600 border rounded-full p-2"
                >
                  <FiMoreVertical size={20} />
                </button>

                {/* Dropdown Menu */}
                {menuOpen === book.$id && (
                  <div className="absolute right-0 mt-2 w-36 bg-white shadow-md rounded-lg overflow-hidden z-10">
                    <button
                      onClick={() => navigate(`/hdesc/${book.$id}`)}
                      className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                    >
                      <AiOutlineInfoCircle className="mr-2" />
                      Novel Info
                    </button>
                    <button
                      onClick={() => handleDelete(book.$id)}
                      className="flex items-center px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                    >
                      <AiOutlineDelete className="mr-2" />
                      Delete Book
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-lg">
          You don’t seem to have any books.
        </p>
      )}

      <button
        onClick={() => navigate("/info")}
        className="mt-8 bg-button text-white py-3 px-6 rounded-lg shadow-lg transition text-lg"
      >
        Create a Book
      </button>
    </div>
  );
};

export default UserBooks;
