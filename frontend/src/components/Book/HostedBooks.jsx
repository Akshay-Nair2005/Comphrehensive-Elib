import React, { useEffect, useState } from "react";
import Hbooklisting from "./Hbooklisting.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowRight, FaSearch, FaBookOpen, FaFeatherAlt, FaPenNib } from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi";
import { IoBookOutline } from "react-icons/io5";
import Skeleton from "react-loading-skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "react-loading-skeleton/dist/skeleton.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HostedBooks = ({ isHome = false }) => {
  const [hbooks, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const genres = [
    "All",
    "Anime",
    "Non-Fiction",
    "Fantasy",
    "Sci-Fi",
    "Thriller",
    "Mystery",
    "Romance",
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/hbooks");
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
    let filtered = hbooks;

    if (searchQuery) {
      filtered = filtered.filter((book) =>
        book.hbook_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre !== "All") {
      filtered = filtered.filter((book) => {
        const bookGenres = book.hbook_genre.split(",").map((g) => g.trim());
        return bookGenres.includes(selectedGenre);
      });
    }

    setFilteredBooks(filtered);
  }, [searchQuery, selectedGenre, hbooks]);

  const skeletonCount = isHome ? 3 : 6;
  const hostedbook = isHome ? filteredBooks.slice(0, 5) : filteredBooks;

  // Skeleton Card Component
  const SkeletonCard = () => (
    <div className="w-full flex flex-col items-center justify-center mt-6 px-2">
      <div className="w-full max-w-[280px] bg-white rounded-2xl overflow-hidden shadow-md">
        <Skeleton height={320} baseColor="#E1CDBB" highlightColor="#f5ebe0" />
        <div className="p-5">
          <Skeleton height={18} baseColor="#E1CDBB" highlightColor="#f5ebe0" />
          <Skeleton height={14} width="70%" className="mt-2" baseColor="#E1CDBB" highlightColor="#f5ebe0" />
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
          <FaPenNib className="text-5xl text-[#5E3023] transform -rotate-12" />
        </div>
        <div className="absolute bottom-4 right-10 opacity-10">
          <FaFeatherAlt className="text-5xl text-[#5E3023] transform rotate-45" />
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
                {isHome ? "Community Novels" : "Community Library"}
              </h2>
              <p className="text-gray-500 mt-1 italic text-sm">
                {isHome ? "Stories crafted by our community" : "Explore community-written masterpieces"}
              </p>
            </div>

            {isHome && (
              <Link
                to="/hnovels"
                className="group flex items-center gap-2 bg-[#5E3023] text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#4a261c]"
              >
                <span className="font-medium">Explore All</span>
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          {/* Search & Filter - Only on All Hosted Books Page */}
          {!isHome && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto md:mx-0">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5E3023]/50" />
                <input
                  type="text"
                  placeholder="Search community novels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#5E3023]/20 focus:border-[#5E3023] focus:outline-none transition-colors bg-white/80 backdrop-blur-sm shadow-sm"
                />
              </div>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-5 py-3 rounded-xl bg-[#5E3023] text-white font-medium shadow-lg cursor-pointer hover:bg-[#4a261c] transition-colors"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre === "All" ? "All Genres" : genre}
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
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                modules={[Navigation, Pagination]}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          ) : hostedbook.length === 0 ? (
            <div className="text-center py-16">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-[#5E3023]/10 to-[#5E3023]/5 rounded-full flex items-center justify-center">
                  <FaPenNib className="text-5xl text-[#5E3023]/40" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <FaFeatherAlt className="text-xl text-[#5E3023]/60" />
                </div>
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">No Community Novels Found</h3>
              <p className="text-gray-500 mb-6">Be the first to share your story with the community!</p>
              <Link
                to="/info"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5E3023] to-[#7a3f2e] text-white py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FaPenNib />
                Start Writing
              </Link>
            </div>
          ) : isHome ? (
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              modules={[Navigation, Pagination, Autoplay]}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="w-full"
              style={{ "--swiper-navigation-color": "#5E3023" }}
            >
              {hostedbook.map((hnovel) => (
                <SwiperSlide key={hnovel.$id}>
                  <Hbooklisting hnovel={hnovel} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {hostedbook.map((hnovel) => (
                <Hbooklisting hnovel={hnovel} key={hnovel.$id} />
              ))}
            </div>
          )}

          {/* Results Count - Only on All Hosted Books Page */}
          {!isHome && !loading && hostedbook.length > 0 && (
            <div className="mt-8 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm text-gray-600 text-sm">
                <FaPenNib className="text-[#5E3023]" />
                Showing {hostedbook.length} community {hostedbook.length === 1 ? "novel" : "novels"}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HostedBooks;
