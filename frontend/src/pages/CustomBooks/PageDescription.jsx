import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../../assets/css/page.css";
import Review from "../../components/Book/Review";
import { account } from "../../appwritee/appwrite";
import { 
  FaBookOpen, 
  FaBookmark, 
  FaUser, 
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowLeft,
  FaHeart,
  FaShare,
  FaRegBookmark,
  FaBook
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { IoBookOutline } from "react-icons/io5";
import { BsStars, BsBookHalf } from "react-icons/bs";

export const PageDescription = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showFullNovelDesc, setShowFullNovelDesc] = useState(false);
  const [showFullAuthorDesc, setShowFullAuthorDesc] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: "", type: "" });
  const [isSaved, setIsSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const NOVEL_DESC_LIMIT = 400;
  const AUTHOR_DESC_LIMIT = 300;

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

  const showNotification = (message, type) => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: "", type: "" }), 3000);
  };

  const saveBook = async () => {
    setSaving(true);

    try {
      const userDetails = await account.get();
      const userId = userDetails.$id;

      const userResponse = await fetch(`http://localhost:5000/user/${userId}`);
      if (!userResponse.ok) {
        throw new Error("User not found");
      }

      const userData = await userResponse.json();
      const updatedBooks = userData.custombooks || [];

      const bookExists = updatedBooks.some((b) => b.$id === bookId);
      if (bookExists) {
        showNotification("Book already in your library!", "info");
        setSaving(false);
        return;
      }

      updatedBooks.push(bookId);

      const response = await fetch(`http://localhost:5000/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ custombooks: updatedBooks }),
      });

      if (!response.ok) {
        throw new Error("Failed to update the user's saved books");
      }

      setIsSaved(true);
      showNotification("Book saved to your library!", "success");
    } catch (error) {
      console.error(error);
      showNotification("An error occurred while saving", "error");
    } finally {
      setSaving(false);
    }
  };

  const renderDescription = (text, limit, isExpanded, toggleExpand) => {
    if (!text) return <p className="text-gray-500 italic">No description available</p>;
    if (text.length <= limit) {
      return <p className="leading-relaxed">{text}</p>;
    }
    return (
      <p className="leading-relaxed">
        {isExpanded ? text : `${text.substring(0, limit)}...`}
        <button 
          onClick={toggleExpand} 
          className="ml-2 text-[#5E3023] font-medium hover:text-[#8B4513] transition-colors underline decoration-dotted underline-offset-2"
        >
          {isExpanded ? "Show Less" : "Read More"}
        </button>
      </p>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-[#5E3023]/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#5E3023] border-t-transparent rounded-full animate-spin"></div>
          <IoBookOutline className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-[#5E3023]" />
        </div>
        <p className="mt-6 text-lg font-medium text-[#5E3023] animate-pulse">
          Loading your book...
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
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5E3023] text-white rounded-full hover:bg-[#4a261c] transition-all"
          >
            <FaArrowLeft />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IoBookOutline className="text-3xl text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Book Not Found</h2>
          <p className="text-gray-600 mb-6">The book you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5E3023] text-white rounded-full hover:bg-[#4a261c] transition-all"
          >
            <FaArrowLeft />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30">
      {/* Toast Notification */}
      <div className={`fixed top-4 right-4 z-[100] transition-all duration-500 transform ${
        showToast.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl ${
          showToast.type === 'success' ? 'bg-green-500 text-white' :
          showToast.type === 'error' ? 'bg-red-500 text-white' :
          'bg-amber-500 text-white'
        }`}>
          {showToast.type === 'success' && <FaCheckCircle className="text-xl" />}
          {showToast.type === 'error' && <FaExclamationCircle className="text-xl" />}
          {showToast.type === 'info' && <FaBookmark className="text-xl" />}
          <span className="font-medium">{showToast.message}</span>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[#5E3023] hover:text-[#4a261c] transition-colors group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="w-full lg:w-2/5 xl:w-1/3">
            <div className="sticky top-8">
              <div className="relative group">
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-[#5E3023]/10 to-[#5E3023]/5">
                  <div className={`absolute inset-0 bg-gray-200 animate-pulse ${imageLoaded ? 'hidden' : ''}`}></div>
                  <img
                    src={book.Novel_img}
                    alt={book.Novel_Name}
                    onLoad={() => setImageLoaded(true)}
                    className={`w-full aspect-[3/4] object-cover transition-all duration-700 group-hover:scale-105 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Quick Actions on hover */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
                      <FaHeart className="text-[#5E3023]" />
                    </button>
                    <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
                      <FaShare className="text-[#5E3023]" />
                    </button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-3 -right-3 w-full h-full bg-[#5E3023]/10 rounded-2xl -z-10"></div>
                <div className="absolute -bottom-6 -right-6 w-full h-full bg-[#5E3023]/5 rounded-2xl -z-20"></div>
              </div>

              {/* Book Stats */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-3 text-center shadow-md hover:shadow-lg transition-shadow">
                  <BsStars className="text-xl text-amber-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Format</p>
                  <p className="font-bold text-[#5E3023]">PDF</p>
                </div>
                <div className="bg-white rounded-xl p-3 text-center shadow-md hover:shadow-lg transition-shadow">
                  <FaBook className="text-xl text-[#5E3023] mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="font-bold text-[#5E3023]">Novel</p>
                </div>
                <div className="bg-white rounded-xl p-3 text-center shadow-md hover:shadow-lg transition-shadow">
                  <HiSparkles className="text-xl text-amber-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-bold text-[#5E3023]">Available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Book Information Section */}
          <div className="w-full lg:w-3/5 xl:w-2/3 space-y-6">
            {/* Title & Author */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#5E3023] leading-tight">
                  {book.Novel_Name}
                </h1>
                <button 
                  onClick={saveBook}
                  disabled={saving}
                  className={`p-3 rounded-full transition-all duration-300 flex-shrink-0 ${
                    isSaved 
                      ? 'bg-[#5E3023] text-white' 
                      : 'bg-[#5E3023]/10 text-[#5E3023] hover:bg-[#5E3023] hover:text-white'
                  }`}
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : isSaved ? (
                    <FaBookmark />
                  ) : (
                    <FaRegBookmark />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaUser className="text-[#5E3023]" />
                <span className="text-lg">by <span className="font-semibold text-[#5E3023]">{book.Author_name}</span></span>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border border-gray-100">
              <div className="flex items-center gap-2 text-[#5E3023]">
                <FaBookOpen />
                <h3 className="font-semibold">About This Book</h3>
              </div>
              <div className="text-gray-700">
                {renderDescription(
                  book.Novel_desc,
                  NOVEL_DESC_LIMIT,
                  showFullNovelDesc,
                  () => setShowFullNovelDesc(!showFullNovelDesc)
                )}
              </div>
            </div>

            {/* Author Card */}
            <div className="bg-gradient-to-r from-[#5E3023]/5 to-[#5E3023]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#5E3023] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {book.Author_name?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div>
                  <p className="text-sm text-gray-500">About the Author</p>
                  <h3 className="font-semibold text-[#5E3023] text-lg">{book.Author_name}</h3>
                </div>
              </div>
              <div className="text-gray-700">
                {renderDescription(
                  book.Author_Decription,
                  AUTHOR_DESC_LIMIT,
                  showFullAuthorDesc,
                  () => setShowFullAuthorDesc(!showFullAuthorDesc)
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Link
                to={`/pdf/${book.$id}`}
                className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#5E3023] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-[#4a261c] transition-all duration-300 hover:-translate-y-0.5"
              >
                <FaBookOpen />
                Start Reading
              </Link>
              <button 
                onClick={saveBook} 
                disabled={saving}
                className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-[#5E3023] border-2 border-[#5E3023] rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-[#5E3023]/5 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#5E3023] border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : isSaved ? (
                  <>
                    <FaCheckCircle />
                    Saved
                  </>
                ) : (
                  <>
                    <FaBookmark />
                    Save Book
                  </>
                )}
              </button>
            </div>

            {/* PDF Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <BsBookHalf className="text-xl text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">PDF Book</p>
                <p className="text-sm text-amber-700">This book is available in PDF format. Click "Start Reading" to open the PDF viewer and enjoy your reading experience!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        <Review />
      </div>
    </section>
  );
};
