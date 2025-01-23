import React, { useEffect, useState } from "react";
import BookListing from "./BookListing";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
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

  // Define a fixed genre list
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
            book.Novel_genre.split(",") // Split genres from the API
              .map((genre) => genre.trim().toLowerCase()) // Trim and convert to lowercase
              .includes(selectedGenre.toLowerCase()) // Match with the selected genre
        );
      }

      setFilteredBooks(filtered);
    };

    filterBooks();
  }, [searchTerm, selectedGenre, books]);

  const skeletonCount = isHome ? 5 : 6;

  return (
    <section className="px-4 py-10 h-[100vh]">
      <div className="container-xl lg:container m-auto">
        <div className="flex justify-between items-center px-6 mb-4">
          <h2 className="text-3xl font-bold text-[#E0E0E0]">
            {isHome ? "Featured Books" : "All Books"}
          </h2>
          <Link to="/novels" className="text-white text-lg flex items-center">
            <span className="mr-2">See All</span>
            <FaArrowRight color="white" />
          </Link>
        </div>

        {!isHome && (
          <div className="flex flex-col md:flex-row gap-4 mb-6 px-6">
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-md w-1/3 md:w-1/2 bg-gray-800 text-white"
            />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2 rounded-md w-1/4 md:w-1/2 bg-gray-800 text-white"
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

        {loading ? (
          isHome ? (
            <Swiper
              spaceBetween={14}
              slidesPerView={1}
              loop={true}
              navigation
              modules={[Navigation, Pagination]}
              autoplay
              speed={800}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
              }}
              className="w-full"
              style={{
                "--swiper-navigation-color": "#ff5733",
              }}
            >
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <SwiperSlide key={index}>
                  <div className="p-4 bg-gray-800 rounded-md">
                    <Skeleton
                      height={200}
                      baseColor="#2d3748"
                      highlightColor="#4a5568"
                    />
                    <Skeleton
                      height={24}
                      className="mt-4"
                      baseColor="#2d3748"
                      highlightColor="#4a5568"
                    />
                    <Skeleton
                      height={16}
                      width="80%"
                      className="mt-2"
                      baseColor="#2d3748"
                      highlightColor="#4a5568"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <div
                  key={index}
                  className="p-4 bg-[#110726] rounded-md animate-pulse"
                >
                  <Skeleton
                    height={200}
                    baseColor="#2d3748"
                    highlightColor="#4a5568"
                  />
                  <Skeleton
                    height={24}
                    className="mt-4"
                    baseColor="#2d3748"
                    highlightColor="#4a5568"
                  />
                  <Skeleton
                    height={16}
                    width="80%"
                    className="mt-2"
                    baseColor="#2d3748"
                    highlightColor="#4a5568"
                  />
                </div>
              ))}
            </div>
          )
        ) : error ? (
          <p>{error}</p>
        ) : isHome ? (
          <Swiper
            spaceBetween={14}
            slidesPerView={1}
            loop={true}
            navigation
            modules={[Navigation, Pagination]}
            autoplay
            speed={800}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 6 },
            }}
            className="w-full"
            style={{
              "--swiper-navigation-color": "#ff5733",
            }}
          >
            {filteredBooks.map((novel) => (
              <SwiperSlide key={novel.$id}>
                <BookListing novel={novel} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {filteredBooks.map((novel) => (
              <BookListing novel={novel} key={novel.$id} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedBook;
