import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { account } from "../../appwritee/appwrite";

export const AuthorTextViewer = () => {
  const { ahbookId } = useParams();
  const [contributions, setContributions] = useState([]);
  const [currentContribution, setCurrentContribution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);

        const response = await fetch(`http://localhost:5000/user/${user.$id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();

        const matchedBook = data.createdhostedbooks?.find(
          (book) => book.$id === ahbookId
        );

        setContributions(matchedBook ? matchedBook.contributions || [] : []);
      } catch (error) {
        console.error("Error fetching contributions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [ahbookId]);

  const handlePublish = async () => {
    if (!currentContribution) {
      alert("Please select a chapter to publish.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/chapters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Chapter_title: currentContribution.chaptertitle,
          Chapter_content: currentContribution.chapter_content,
          hostedBookId: ahbookId,
        }),
      });

      if (!response.ok) throw new Error("Failed to publish chapter");
      alert("Chapter published successfully!");
    } catch (error) {
      console.error("Error publishing chapter:", error);
      alert("Failed to publish chapter.");
    }
  };

  // const handleUpdateStatus = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/user/${userId}`, {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ User_Status: "Writer" }),
  //     });

  //     if (!response.ok) throw new Error("Failed to update status");
  //     alert("User status updated to writer!");
  //   } catch (error) {
  //     console.error("Error updating status:", error);
  //     alert("Failed to update user status.");
  //   }
  // };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (!contributions.length)
    return <div className="text-center p-6">No contributions available.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-black">
      <div className="flex items-center h-16 justify-between px-4 border-b">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="px-3 py-2 bg-gray-700 text-white rounded"
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1 className="text-lg font-bold">
            {currentContribution?.chaptertitle}
          </h1>
        </div>
        {currentContribution && (
          <div className="space-x-4">
            <button
              onClick={handlePublish}
              className="px-4 py-2 bg-button text-white rounded"
            >
              Publish Chapter
            </button>
            {/* <button
              onClick={handleUpdateStatus}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Update to Writer
            </button> */}
          </div>
        )}
      </div>

      <div className="flex flex-1">
        <div
          className={`w-64 border-r p-4 ${isSidebarOpen ? "block" : "hidden"}`}
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

        <div className="flex-1 p-6 overflow-y-auto">
          {currentContribution ? (
            currentContribution.chapter_content
              .split("\n")
              .map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph.trim()}
                </p>
              ))
          ) : (
            <p>Select a chapter to view</p>
          )}
        </div>
      </div>
    </div>
  );
};
