import React, { useEffect, useState } from "react";
import { account } from "../../appwritee/appwrite";
import BookCard from "../../components/Book/BookCard";
import { Link } from "react-router-dom";
import { 
  FaBookmark, 
  FaBook, 
  FaUsers, 
  FaExclamationCircle,
  FaArrowLeft,
  FaSearch
} from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { HiSparkles } from "react-icons/hi";
import { BsStars, BsBookshelf } from "react-icons/bs";

const SavedBooks = () => {
  const [customBooks, setCustomBooks] = useState([]);
  const [hostedBooks, setHostedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

      const response = await fetch(`http://localhost:5000/user/${user.$id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, type }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete book. Status: ${response.status}`);
      }

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

  // Filter books based on search query
  const filterBooks = (books, type) => {
    if (!searchQuery) return books;
    return books.filter((book) => {
      const name = type === "custom" ? book.Novel_Name : book.hbook_name;
      const author = type === "custom" ? book.Author_name : book.hbook_author;
      return (
        name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        author?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };

  const filteredCustomBooks = filterBooks(customBooks, "custom");
  const filteredHostedBooks = filterBooks(hostedBooks, "hosted");

  const totalBooks = customBooks.length + hostedBooks.length;

  const renderBooks = (books, type) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

  const EmptyState = ({ title, description, icon: Icon }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-[#5E3023]/10 rounded-full flex items-center justify-center mb-4">
        <Icon className="text-3xl text-[#5E3023]" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>
      <Link
        to="/allnovels"
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#5E3023] text-white rounded-full hover:bg-[#4a261c] transition-all duration-300 hover:-translate-y-0.5 shadow-lg"
      >
        <FaSearch className="text-sm" />
        Browse Books
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-[#5E3023]/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#5E3023] border-t-transparent rounded-full animate-spin"></div>
          <BsBookshelf className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-[#5E3023]" />
        </div>
        <p className="mt-6 text-lg font-medium text-[#5E3023] animate-pulse">
          Loading your library...
        </p>
        <div className="mt-2 flex gap-1">
          <span className="w-2 h-2 bg-[#5E3023] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
          <span className="w-2 h-2 bg-[#5E3023] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
          <span className="w-2 h-2 bg-[#5E3023] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationCircle className="text-3xl text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5E3023] text-white rounded-full hover:bg-[#4a261c] transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#5E3023] via-[#6b3a2a] to-[#5E3023] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FaBookmark className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold flex items-center gap-2">
                  My Library
                  <HiSparkles className="text-amber-300 text-xl" />
                </h1>
                <p className="text-white/70 text-sm mt-1">
                  {totalBooks} {totalBooks === 1 ? "book" : "books"} saved
                </p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search your books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <BsStars className="text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#5E3023]">{totalBooks}</p>
                <p className="text-xs text-gray-500">Total Books</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5E3023]/10 rounded-lg flex items-center justify-center">
                <FaBook className="text-[#5E3023]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#5E3023]">{customBooks.length}</p>
                <p className="text-xs text-gray-500">Classic Books</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaUsers className="text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#5E3023]">{hostedBooks.length}</p>
                <p className="text-xs text-gray-500">Community Books</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <IoBookOutline className="text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#5E3023]">
                  {filteredCustomBooks.length + filteredHostedBooks.length}
                </p>
                <p className="text-xs text-gray-500">Matching Search</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className="flex gap-2 p-1 bg-white rounded-xl shadow-md w-fit">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${
              activeTab === "all"
                ? "bg-[#5E3023] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            All Books
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
              activeTab === "custom"
                ? "bg-[#5E3023] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaBook className="text-xs" />
            Renowned Authors
          </button>
          <button
            onClick={() => setActiveTab("hosted")}
            className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
              activeTab === "hosted"
                ? "bg-[#5E3023] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaUsers className="text-xs" />
            Upcoming Authors
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {totalBooks === 0 ? (
          <EmptyState
            title="Your library is empty"
            description="Start building your collection! Browse our catalog and save books you love to read them anytime."
            icon={BsBookshelf}
          />
        ) : (
          <>
            {/* All Books Tab */}
            {activeTab === "all" && (
              <div className="space-y-10">
                {/* Custom Books Section */}
                {filteredCustomBooks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-[#5E3023]/10 rounded-lg flex items-center justify-center">
                        <FaBook className="text-[#5E3023]" />
                      </div>
                      <div>
                        <h2 className="text-xl font-serif font-bold text-[#5E3023]">
                          Books by Renowned Authors
                        </h2>
                        <p className="text-sm text-gray-500">
                          {filteredCustomBooks.length} {filteredCustomBooks.length === 1 ? "book" : "books"}
                        </p>
                      </div>
                    </div>
                    {renderBooks(filteredCustomBooks, "custom")}
                  </div>
                )}

                {/* Hosted Books Section */}
                {filteredHostedBooks.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <FaUsers className="text-orange-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-serif font-bold text-[#5E3023]">
                          Books by Upcoming Authors
                        </h2>
                        <p className="text-sm text-gray-500">
                          {filteredHostedBooks.length} {filteredHostedBooks.length === 1 ? "book" : "books"}
                        </p>
                      </div>
                    </div>
                    {renderBooks(filteredHostedBooks, "hosted")}
                  </div>
                )}

                {filteredCustomBooks.length === 0 && filteredHostedBooks.length === 0 && searchQuery && (
                  <EmptyState
                    title="No books found"
                    description={`No books matching "${searchQuery}" in your library. Try a different search term.`}
                    icon={FaSearch}
                  />
                )}
              </div>
            )}

            {/* Custom Books Tab */}
            {activeTab === "custom" && (
              <div>
                {filteredCustomBooks.length > 0 ? (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-[#5E3023]/10 rounded-lg flex items-center justify-center">
                        <FaBook className="text-[#5E3023]" />
                      </div>
                      <div>
                        <h2 className="text-xl font-serif font-bold text-[#5E3023]">
                          Books by Renowned Authors
                        </h2>
                        <p className="text-sm text-gray-500">
                          {filteredCustomBooks.length} {filteredCustomBooks.length === 1 ? "book" : "books"}
                        </p>
                      </div>
                    </div>
                    {renderBooks(filteredCustomBooks, "custom")}
                  </>
                ) : (
                  <EmptyState
                    title={searchQuery ? "No books found" : "No classic books saved"}
                    description={searchQuery 
                      ? `No books matching "${searchQuery}" in this category.`
                      : "Explore our collection of books by renowned authors and save your favorites!"
                    }
                    icon={FaBook}
                  />
                )}
              </div>
            )}

            {/* Hosted Books Tab */}
            {activeTab === "hosted" && (
              <div>
                {filteredHostedBooks.length > 0 ? (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <FaUsers className="text-orange-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-serif font-bold text-[#5E3023]">
                          Books by Upcoming Authors
                        </h2>
                        <p className="text-sm text-gray-500">
                          {filteredHostedBooks.length} {filteredHostedBooks.length === 1 ? "book" : "books"}
                        </p>
                      </div>
                    </div>
                    {renderBooks(filteredHostedBooks, "hosted")}
                  </>
                ) : (
                  <EmptyState
                    title={searchQuery ? "No books found" : "No community books saved"}
                    description={searchQuery 
                      ? `No books matching "${searchQuery}" in this category.`
                      : "Discover amazing stories from upcoming authors in our community!"
                    }
                    icon={FaUsers}
                  />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SavedBooks;
