import React, { useEffect, useState } from "react";
import BookListing from "./BookListing";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowRight, FaSearch, FaBookOpen, FaFeatherAlt } from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi";
import { IoBookOutline } from "react-icons/io5";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Skeleton from "react-loading-skeleton";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "react-loading-skeleton/dist/skeleton.css";

const FeaturedBook = ({ isHome }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  const genreList = [
    "Romance",
    "Adventure",
    "Mythology",
    "History",
    "Anime",
    "Thriller",
    "Fiction",
    "Fantasy",
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/books");
        setBooks(response.data);
        setFilteredBooks(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const filterBooks = () => {
      let filtered = books;

      if (searchTerm) {
        filtered = filtered.filter((book) =>
          book.Novel_Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedGenre) {
        filtered = filtered.filter(
          (book) =>
            book.Novel_genre.split(",")
              .map((genre) => genre.trim().toLowerCase())
              .includes(selectedGenre.toLowerCase())
        );
      }

      setFilteredBooks(filtered);
    };

    filterBooks();
  }, [searchTerm, selectedGenre, books]);

  const skeletonCount = isHome ? 6 : 8;

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div className="w-full flex flex-col items-center justify-center mt-6 px-2">
      <div className="w-full max-w-[220px] bg-white rounded-2xl overflow-hidden shadow-md">
        <Skeleton height={288} baseColor="#E1CDBB" highlightColor="#f5ebe0" />
        <div className="p-4">
          <Skeleton height={16} baseColor="#E1CDBB" highlightColor="#f5ebe0" />
          <Skeleton height={12} width="70%" className="mt-2" baseColor="#E1CDBB" highlightColor="#f5ebe0" />
        </div>
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#5E3023]/5 via-[#5E3023]/10 to-[#5E3023]/5 py-10 px-6">
        {/* Decorative Elements */}
        <div className="absolute top-4 left-10 opacity-10">
          <FaFeatherAlt className="text-5xl text-[#5E3023] transform -rotate-45" />
        </div>
        <div className="absolute bottom-4 right-10 opacity-10">
          <IoBookOutline className="text-5xl text-[#5E3023]" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-3 mb-2">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#5E3023]/40 hidden md:block"></div>
                <HiOutlineBookOpen className="text-2xl text-[#5E3023]" />
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#5E3023]/40 hidden md:block"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800">
                {isHome ? "Featured Books" : "Explore Our Library"}
              </h2>
              <p className="text-gray-500 mt-1 italic text-sm">
                {isHome ? "Handpicked stories for you" : "Discover your next favorite read"}
              </p>
            </div>

            {isHome && (
              <Link
                to="/novels"
                className="group flex items-center gap-2 bg-[#5E3023] text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#4a261c]"
              >
                <span className="font-medium">View All</span>
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          {/* Search & Filter - Only on All Books Page */}
          {!isHome && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto md:mx-0">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5E3023]/50" />
                <input
                  type="text"
                  placeholder="Search by book name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#5E3023]/20 focus:border-[#5E3023] focus:outline-none transition-colors bg-white/80 backdrop-blur-sm shadow-sm"
                />
              </div>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-5 py-3 rounded-xl bg-[#5E3023] text-white font-medium shadow-lg cursor-pointer hover:bg-[#4a261c] transition-colors"
              >
                <option value="">All Genres</option>
                {genreList.map((genre, index) => (
                  <option key={index} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Books Content */}
      <div className="px-6 py-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            isHome ? (
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                loop={true}
                navigation
                modules={[Navigation, Pagination]}
                speed={800}
                breakpoints={{
                  480: { slidesPerView: 2 },
                  640: { slidesPerView: 3 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 5 },
                  1280: { slidesPerView: 6 },
                }}
                className="w-full"
                style={{ "--swiper-navigation-color": "#5E3023" }}
              >
                {Array.from({ length: skeletonCount }).map((_, index) => (
                  <SwiperSlide key={index}>
                    <SkeletonCard />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: skeletonCount }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            )
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoBookOutline className="text-4xl text-red-400" />
              </div>
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-[#5E3023]/10 to-[#5E3023]/5 rounded-full flex items-center justify-center">
                  <FaBookOpen className="text-5xl text-[#5E3023]/40" />
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">No Books Found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : isHome ? (
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              loop={true}
              navigation
              modules={[Navigation, Pagination, Autoplay]}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              speed={800}
              breakpoints={{
                480: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
                1280: { slidesPerView: 6 },
              }}
              className="w-full"
              style={{ "--swiper-navigation-color": "#5E3023" }}
            >
              {filteredBooks.map((novel) => (
                <SwiperSlide key={novel.$id}>
                  <BookListing novel={novel} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredBooks.map((novel) => (
                <BookListing novel={novel} key={novel.$id} />
              ))}
            </div>
          )}

          {/* Results Count - Only on All Books Page */}
          {!isHome && !loading && filteredBooks.length > 0 && (
            <div className="mt-8 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm text-gray-600 text-sm">
                <FaBookOpen className="text-[#5E3023]" />
                Showing {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBook;
