import React, { useEffect, useState } from "react";
import novel from "../../novels.json";
import Hbooklisting from "./Hbooklisting.jsx";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaArrowLeft,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HostedBooks = ({ isHome = false }) => {
  const [hbooks, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch books from the API
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/hbooks"); // Adjust the endpoint to your API
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

  const skeletons = Array.from({ length: isHome ? 3 : 6 }); // Adjust skeleton count

  const hostedbook = isHome ? hbooks.slice(0, 3) : hbooks;

  return (
    <section className="px-4 py-10 h-[100vh]">
      <div className="container-xl lg:container m-auto">
        <div className="flex justify-between px-6">
          <h2 className="text-3xl font-bold text-[#E0E0E0] mb-6">
            {isHome ? "Hosted Books" : "All Hosted Books"}
          </h2>
          <div className="flex">
            <Link to="/hnovels" className="text-white text-lg">
              <span>
                <FaArrowRight color="white" />{" "}
              </span>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? skeletons.map((_, index) => (
                <div key={index} className="p-4 bg-gray-800 rounded-md">
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
              ))
            : hostedbook.map((hnovel) => (
                <Hbooklisting hnovel={hnovel} key={hnovel.$id} />
              ))}
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </section>
  );
};

export default HostedBooks;
