import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../appwritee/appwrite";
import { FaBookOpen, FaFeatherAlt, FaPenNib, FaPlus } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { AiOutlineDelete, AiOutlineInfoCircle } from "react-icons/ai";
import { IoBookOutline } from "react-icons/io5";
import { HiOutlineBookOpen } from "react-icons/hi";

const UserBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <IoBookOutline className="text-6xl text-[#5E3023] animate-pulse mx-auto" />
            <div className="absolute -top-1 -right-1">
              <FaFeatherAlt className="text-xl text-[#5E3023]/60 animate-bounce" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-serif text-lg italic">Loading your literary collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-red-100">
          <div className="text-red-400 text-5xl mb-4"></div>
          <p className="text-red-600 font-medium">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Decorative Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#5E3023]/5 via-[#5E3023]/10 to-[#5E3023]/5 py-12 px-6">
        {/* Decorative Elements */}
        <div className="absolute top-4 left-10 opacity-10">
          <FaFeatherAlt className="text-6xl text-[#5E3023] transform -rotate-45" />
        </div>
        <div className="absolute bottom-4 right-10 opacity-10">
          <FaPenNib className="text-5xl text-[#5E3023]" />
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#5E3023]/40"></div>
            <HiOutlineBookOpen className="text-3xl text-[#5E3023]" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#5E3023]/40"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 mb-2">
            Your Literary Collection
          </h1>
          <p className="text-gray-600 font-light italic">
            "A reader lives a thousand lives before he dies" — George R.R. Martin
          </p>
          <div className="mt-4 flex justify-center items-center gap-2 text-sm text-gray-500">
            <span className="px-3 py-1 bg-white/60 rounded-full shadow-sm">
              {books.length} {books.length === 1 ? "Novel" : "Novels"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-10">
        {books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {books.map((book) => (
              <div
                key={book.$id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Book Cover with Overlay */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={book.hbook_novelimg}
                    alt={book.hbook_name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  
                  {/* Genre Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#5E3023] text-xs font-semibold rounded-full shadow-sm">
                      {book.hbook_genre}
                    </span>
                  </div>

                  {/* Menu Icon */}
                  <div className="absolute top-4 right-4 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen((prev) => (prev === book.$id ? null : book.$id));
                      }}
                      className="text-white bg-[#5E3023]/80 hover:bg-[#5E3023] backdrop-blur-sm rounded-full p-2 transition-all duration-300 shadow-lg"
                    >
                      <FiMoreVertical size={18} />
                    </button>

                    {/* Dropdown Menu */}
                    {menuOpen === book.$id && (
                      <div className="absolute right-0 mt-2 w-44 bg-white/95 backdrop-blur-md shadow-xl rounded-xl overflow-hidden z-30 border border-gray-100">
                        <button
                          onClick={() => navigate(`/hdesc/${book.$id}`)}
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#5E3023]/10 w-full text-left transition-colors"
                        >
                          <AiOutlineInfoCircle className="mr-3 text-[#5E3023]" />
                          <span className="font-medium">Novel Info</span>
                        </button>
                        <button
                          onClick={() => navigate(`/uview/${book.$id}`)}
                          className="flex items-center px-4 py-3 text-gray-700 hover:bg-[#5E3023]/10 w-full text-left transition-colors"
                        >
                          <FaBookOpen className="mr-3 text-[#5E3023]" />
                          <span className="font-medium">Contributions</span>
                        </button>
                        <div className="border-t border-gray-100"></div>
                        <button
                          onClick={() => handleDelete(book.$id)}
                          className="flex items-center px-4 py-3 text-red-500 hover:bg-red-50 w-full text-left transition-colors"
                        >
                          <AiOutlineDelete className="mr-3" />
                          <span className="font-medium">Delete Book</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quick Action Buttons - Appear on Hover */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={() => navigate(`/text/${book.$id}`)}
                      className="flex-1 bg-white/95 backdrop-blur-sm text-[#5E3023] px-4 py-2.5 rounded-lg shadow-lg transition-all duration-300 hover:bg-white font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <FaBookOpen className="text-xs" />
                      Read
                    </button>
                    <button
                      onClick={() => navigate(`/edit/${book.$id}`)}
                      className="flex-1 bg-[#5E3023] text-white px-4 py-2.5 rounded-lg shadow-lg transition-all duration-300 hover:bg-[#4a261c] font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <FaPenNib className="text-xs" />
                      Edit
                    </button>
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-5">
                  <h2 className="text-lg font-serif font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-[#5E3023] transition-colors">
                    {book.hbook_name}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <FaFeatherAlt className="text-[#5E3023]/60 text-xs" />
                    <span className="italic">{book.hbook_author}</span>
                  </div>
                </div>

                {/* Decorative Bottom Border */}
                <div className="h-1 bg-gradient-to-r from-[#5E3023]/20 via-[#5E3023] to-[#5E3023]/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-[#5E3023]/10 to-[#5E3023]/5 rounded-full flex items-center justify-center">
                <IoBookOutline className="text-6xl text-[#5E3023]/40" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                <FaFeatherAlt className="text-xl text-[#5E3023]/60" />
              </div>
            </div>
            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-3">
              Your Bookshelf Awaits
            </h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Every great author started with a blank page. Begin your journey and create your first novel today.
            </p>
            <button
              onClick={() => navigate("/info")}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#5E3023] to-[#7a3f2e] text-white py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-medium"
            >
              <FaPenNib />
              Start Writing
            </button>
          </div>
        )}
      </div>

      {/* Floating Create Button (when books exist) */}
      {books.length > 0 && (
        <div className="fixed bottom-8 right-8 z-40">
          <button
            onClick={() => navigate("/info")}
            className="group flex items-center gap-3 bg-gradient-to-r from-[#5E3023] to-[#7a3f2e] text-white py-4 px-6 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <FaPlus className="text-lg" />
            <span className="font-medium pr-1">Create New Book</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserBooks;
