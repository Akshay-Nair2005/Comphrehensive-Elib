import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaMoon,
  FaSun,
  FaPlus,
  FaMinus,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { account } from "../../appwritee/appwrite";

export const AuthorTextViewer = () => {
  const { ahbookId } = useParams();
  const [contributions, setContributions] = useState([]);
  const [currentContribution, setCurrentContribution] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const user = await account.get();
        const userid = user.$id;
        const response = await fetch(`http://localhost:5000/user/${userid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();

        const matchedBook = data.createdhostedbooks?.find(
          (book) => book.$id === ahbookId
        );

        if (matchedBook) {
          setContributions(matchedBook.contributions || []);
        } else {
          setContributions([]);
        }
      } catch (error) {
        console.error("Error fetching contributions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [ahbookId]);

  if (loading)
    return <div className="text-center p-6 text-black">Loading...</div>;
  if (!contributions.length)
    return (
      <div className="text-center p-6 text-black">
        No contributions available.
      </div>
    );

  return (
    <div
      className={`flex flex-col min-h-screen ${
        darkMode ? "bg-black text-beige" : "bg-[#FFF6EF] text-black"
      }`}
    >
      {/* Top Bar */}
      <div className="flex items-center h-16 justify-between px-4 py-2 border-b border-gray-300 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="px-3 py-2 bg-[#5E3023] text-white rounded"
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1 className="text-lg font-bold">
            {currentContribution?.chaptertitle}
          </h1>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar for Contributions */}
        <div
          className={`w-64 border-r border-gray-300 dark:border-gray-700 ${
            isSidebarOpen ? "block" : "hidden"
          } sticky top-0 h-screen p-4`}
        >
          <h2 className="text-lg font-bold mb-4">Contributions</h2>
          <ul className="space-y-2">
            {contributions.map((contribution, index) => (
              <li
                key={index}
                onClick={() => setCurrentContribution(contribution)}
                className="cursor-pointer p-2 rounded hover:bg-gray-300"
              >
                {contribution.chaptertitle} - {contribution.username}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Viewer */}
        <div
          className="flex-1 p-6 overflow-y-auto"
          style={{ fontSize: `${fontSize}px` }}
        >
          {currentContribution ? (
            <>
              {/* <h2 className="text-xl font-bold mb-2">
                {currentContribution.chaptertitle}
              </h2>
              <p className="italic text-sm mb-4">
                By {currentContribution.author_name}
              </p> */}
              {currentContribution.chapter_content
                .split("\n")
                .map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph.trim()}
                  </p>
                ))}
            </>
          ) : (
            <p>Select a chapter to view</p>
          )}
        </div>
      </div>
    </div>
  );
};
