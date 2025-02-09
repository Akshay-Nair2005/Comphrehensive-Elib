import React from "react";
import { Link } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";

const BookCard = ({ book, type, menuOpen, toggleMenu, deleteBook }) => {
  const bookName = type === "custom" ? book.Novel_Name : book.hbook_name;
  const bookGenre = type === "custom" ? book.Novel_genre : book.hbook_genre;
  const bookAuthor = type === "custom" ? book.Author_name : book.hbook_author;
  const bookImage =
    type === "custom"
      ? book.Novel_img
      : book.hbook_novelimg || "https://via.placeholder.com/200";

  return (
    <div className="relative bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all">
      {/* Book Image */}
      <img
        src={bookImage}
        alt={bookName}
        className="w-full h-60 object-cover rounded-lg"
      />

      {/* Book Info */}
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-gray-800">{bookName}</h3>
        <p className="text-gray-600 text-sm">Genre: {bookGenre}</p>
        <p className="text-gray-600 text-sm">Author: {bookAuthor}</p>

        {/* Read Button */}
        <Link
          to={type === "custom" ? `/pdf/${book.$id}` : `/text/${book.$id}`}
          className="mt-4 inline-block w-full bg-button text-white text-center py-2 px-4 rounded-lg shadow-md  transition"
        >
          Read
        </Link>
      </div>

      {/* Menu Icon */}
      <div className="absolute top-2 right-2">
        <button
          onClick={() => toggleMenu(book.$id)}
          className="p-2 bg-button rounded-full hover:bg-button transition"
        >
          <HiDotsVertical size={20} color="white" />
        </button>

        {/* Dropdown Menu */}
        {menuOpen === book.$id && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() =>
                (window.location.href =
                  type === "custom"
                    ? `/desc/${book.$id}`
                    : `/hdesc/${book.$id}`)
              }
            >
              Novel Info
            </button>
            <button
              className="block w-full text-left px-4 py-2 text-red-700 hover:bg-red-700 hover:text-white"
              onClick={() => deleteBook(book.$id, type)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
