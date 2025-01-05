import { useState } from "react";

const HostedBookInfo = () => {
  const [hbookName, setHbookName] = useState("");
  const [hbookGenre, setHbookGenre] = useState("");
  const [hbookDesc, setHbookDesc] = useState("");
  const [hbookAuthor, setHbookAuthor] = useState("");
  const [hbookAuthDesc, setHbookAuthDesc] = useState("");
  const [hbookNovelImg, setHbookNovelImg] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/hbookks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hbook_name: hbookName,
          hbook_genre: hbookGenre,
          hbook_desc: hbookDesc,
          hbook_author: hbookAuthor,
          hbook_authdesc: hbookAuthDesc,
          hbook_novelimg: hbookNovelImg,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Hosted Book Created:", data);
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error creating hosted book:", error);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-xl w-full">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Create Hosted Book
        </h1>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Book Name"
            value={hbookName}
            onChange={(e) => setHbookName(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="text"
            placeholder="Genre"
            value={hbookGenre}
            onChange={(e) => setHbookGenre(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <textarea
            placeholder="Description"
            value={hbookDesc}
            onChange={(e) => setHbookDesc(e.target.value)}
            rows="4"
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="text"
            placeholder="Author Name"
            value={hbookAuthor}
            onChange={(e) => setHbookAuthor(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <textarea
            placeholder="Author Description"
            value={hbookAuthDesc}
            onChange={(e) => setHbookAuthDesc(e.target.value)}
            rows="4"
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            type="text"
            placeholder="Novel Image URL"
            value={hbookNovelImg}
            onChange={(e) => setHbookNovelImg(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full mt-6 py-3 bg-button text-white rounded-lg font-semibold bg-button:hover transition duration-300"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default HostedBookInfo;
