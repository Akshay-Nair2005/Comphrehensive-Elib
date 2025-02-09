import React, { useEffect, useState } from "react";
import Hbooklisting from "./Hbooklisting.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
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

  // Predefined list of genres
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

  const skeletons = Array.from({ length: isHome ? 3 : 6 });
  const hostedbook = isHome ? filteredBooks.slice(0, 5) : filteredBooks;

  return (
    <section className="px-4 py-10 h-[100vh]">
      <div className="container-xl lg:container m-auto">
        <div className="flex justify-between px-6 items-center">
          <h2 className="text-3xl font-bold text-color mb-6">
            {isHome ? "Hosted Books" : "All Hosted Books"}
          </h2>
          {isHome && (
            <Link
              to="/hnovels"
              className="text-[#5E3023] text-lg flex items-center"
            >
              <span className="mr-2">See All</span>
              <FaArrowRight color="brown" />
            </Link>
          )}
        </div>

        {/* Filters */}
        {!isHome && (
          <div className="flex flex-col md:flex-row gap-4 mb-6 px-6">
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 rounded-md bg-[#5E3023] text-white placeholder-slate-100 w-1/3"
            />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="p-2 rounded-md bg-[#5E3023] text-white w-1/4"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
        )}

        {isHome ? (
          loading ? (
            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              modules={[Navigation, Pagination, Autoplay]}
              className="w-full"
            >
              {skeletons.map((_, index) => (
                <SwiperSlide key={index}>
                  <div className="p-4 rounded-md">
                    <Skeleton
                      height={200}
                      baseColor="#E1CDBB"
                      highlightColor="#5E3023"
                    />
                    <Skeleton
                      height={24}
                      className="mt-4"
                      baseColor="#E1CDBB"
                      highlightColor="#5E3023"
                    />
                    <Skeleton
                      height={16}
                      width="80%"
                      className="mt-2"
                      baseColor="#E1CDBB"
                      highlightColor="#5E3023"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <Swiper
              spaceBetween={20}
              slidesPerView={2}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000 }}
              modules={[Navigation, Pagination, Autoplay]}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="w-full"
            >
              {hostedbook.map((hnovel) => (
                <SwiperSlide key={hnovel.$id}>
                  <Hbooklisting hnovel={hnovel} />
                </SwiperSlide>
              ))}
            </Swiper>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {loading
              ? skeletons.map((_, index) => (
                  <div key={index} className="p-4 rounded-md">
                    <Skeleton
                      height={200}
                      baseColor="#E1CDBB"
                      highlightColor="#5E3023"
                    />
                    <Skeleton
                      height={24}
                      className="mt-4"
                      baseColor="#E1CDBB"
                      highlightColor="#5E3023"
                    />
                    <Skeleton
                      height={16}
                      width="80%"
                      className="mt-2"
                      baseColor="#E1CDBB"
                      highlightColor="#5E3023"
                    />
                  </div>
                ))
              : hostedbook.map((hnovel) => (
                  <Hbooklisting hnovel={hnovel} key={hnovel.$id} />
                ))}
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}
      </div>
    </section>
  );
};

export default HostedBooks;
