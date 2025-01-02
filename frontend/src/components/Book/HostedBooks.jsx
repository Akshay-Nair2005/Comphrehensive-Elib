import React, { useEffect, useState } from 'react'
import novel from '../../novels.json'
import Hbooklisting from './Hbooklisting.jsx';
import axios from "axios";
import { Link } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft, FaArrowUp, FaArrowDown } from 'react-icons/fa'

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
                // console.log(response)// Assuming the response is an array of book documents
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

    const hostedbook = isHome ? hbooks.slice(0, 3) : hbooks;
    return (
        <section className="px-4 py-10 h-[100vh]">
            <div className="container-xl lg:container m-auto">
                <div className='flex justify-between  px-6'>
                    <h2 className="text-3xl font-bold text-[#E0E0E0] mb-6">
                        {isHome ? "Hosted Books" : "All Hosted Books"}
                    </h2>
                    <div classname="flex">
                        <Link to='/hnovels' className="text-white text-lg "><span><FaArrowRight color='white' /> </span></Link>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {hostedbook.map((hnovel) => (
                        <Hbooklisting hnovel={hnovel} key={hnovel.$id} /> // Pass the document ID
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HostedBooks