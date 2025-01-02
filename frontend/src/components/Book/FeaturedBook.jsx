import React, { useEffect, useState } from "react";
import BookListing from "./BookListing";
import axios from "axios";
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { Navigation, Pagination,Autoplay  } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const FeaturedBook = ({ isHome }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/books");
        setBooks(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const FeaturedBooks = books;

  return (
    <section className="px-4 py-10 h-[100vh]">
      <div className="container-xl lg:container m-auto">
        <div className="flex justify-between px-6">
          <h2 className="text-3xl font-bold text-[#E0E0E0] mb-6">
            {isHome ? "Featured Books" : "All Books"}
          </h2>
          <Link to="/novels" className="text-white text-lg flex items-center">
            <span className="mr-2">See All</span>
            <FaArrowRight color="white" />
          </Link>
        </div>

        {isHome ? (
          <Swiper
            spaceBetween={14}
            slidesPerView={1}
            loop={true}
            navigation
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]}
            autoplay
            speed= {800}
            autoplayDisableOnInteraction= {false}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            className="w-full"
            style={{
              '--swiper-navigation-color': '#ff5733',
            }}

          >
            {FeaturedBooks.map((novel) => (
              <SwiperSlide key={novel.$id}>
                <BookListing novel={novel} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FeaturedBooks.map((novel) => (
              <BookListing novel={novel} key={novel.$id} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedBook;
