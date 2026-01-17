import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaBars, FaTimes, FaTimesCircle, FaFeatherAlt, FaBookOpen, FaCheck, FaUser, FaPenNib } from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi";
import { IoBookOutline, IoCheckmarkCircle } from "react-icons/io5";
import { account, databases } from "../../appwritee/appwrite";

export const AuthorTextViewer = () => {
  const { ahbookId } = useParams();
  const [contributions, setContributions] = useState([]);
  const [currentContribution, setCurrentContribution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userId, setUserId] = useState(null);
  const [publishing, setPublishing] = useState(false);

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

    setPublishing(true);

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

      const databaseId = import.meta.env.VITE_DATABASE || "";
      const usersCollectionId = import.meta.env.VITE_COLLECTION_ID_USER || "";
      const userIdToUpdate = currentContribution.userid;

      await databases.updateDocument(
        databaseId,
        usersCollectionId,
        userIdToUpdate,
        {
          User_Status: "Writer",
          contributions: [ahbookId],
        }
      );

      alert("Chapter published successfully! User status updated to Writer.");
    } catch (error) {
      console.error("Error publishing chapter:", error);
      alert("Chapter Published");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#5E3023] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading contributions...</p>
        </div>
      </div>
    );
  }

  if (!contributions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FaTimesCircle className="text-red-400 text-4xl" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-gray-800 mb-3">
            No Contributions Yet
          </h2>
          <p className="text-gray-500 leading-relaxed">
            When readers contribute to your story, their submissions will appear here for your review.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
            <IoBookOutline />
            <span>Check back later</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#5E3023] via-[#6b3a2a] to-[#5E3023] shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                {isSidebarOpen ? <FaTimes /> : <FaBars />}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaFeatherAlt className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-serif font-bold text-white">
                    {currentContribution?.chaptertitle || "Review Contributions"}
                  </h1>
                  {currentContribution && (
                    <p className="text-white/70 text-xs flex items-center gap-1">
                      <FaUser className="text-xs" />
                      by {currentContribution.username}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {currentContribution && (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#5E3023] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70"
              >
                {publishing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#5E3023] border-t-transparent rounded-full animate-spin"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <IoCheckmarkCircle className="text-lg" />
                    Publish Chapter
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed md:sticky top-[72px] left-0 h-[calc(100vh-72px)] bg-white shadow-xl z-40 transition-all duration-300 ${
            isSidebarOpen ? "w-80 translate-x-0" : "w-0 -translate-x-full md:w-0"
          } overflow-hidden`}
        >
          <div className="w-80 h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-6 border-b bg-gradient-to-r from-[#5E3023]/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#5E3023]/10 to-[#5E3023]/5 rounded-xl flex items-center justify-center">
                  <HiOutlineBookOpen className="text-[#5E3023] text-lg" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-gray-800">Contributions</h2>
                  <p className="text-xs text-gray-500">{contributions.length} pending review</p>
                </div>
              </div>
            </div>

            {/* Contributions List */}
            <div className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {contributions.map((contribution, index) => (
                  <li
                    key={index}
                    onClick={() => setCurrentContribution(contribution)}
                    className={`group cursor-pointer p-4 rounded-xl transition-all duration-300 ${
                      currentContribution === contribution
                        ? "bg-gradient-to-r from-[#5E3023] to-[#7a4636] text-white shadow-lg"
                        : "bg-gray-50 hover:bg-gradient-to-r hover:from-[#5E3023]/10 hover:to-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        currentContribution === contribution
                          ? "bg-white/20"
                          : "bg-white shadow-sm group-hover:bg-[#5E3023]/10"
                      }`}>
                        <FaPenNib className={`text-sm ${
                          currentContribution === contribution ? "text-white" : "text-[#5E3023]"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium truncate ${
                          currentContribution === contribution ? "text-white" : "text-gray-800"
                        }`}>
                          {contribution.chaptertitle}
                        </h3>
                        <p className={`text-xs mt-1 flex items-center gap-1 ${
                          currentContribution === contribution ? "text-white/70" : "text-gray-500"
                        }`}>
                          <FaUser className="text-[10px]" />
                          {contribution.username}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "md:ml-0" : ""}`}>
          <div className="max-w-4xl mx-auto p-6 md:p-10">
            {currentContribution ? (
              <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Article Header */}
                <div className="bg-gradient-to-r from-[#5E3023]/5 via-[#5E3023]/10 to-[#5E3023]/5 p-6 md:p-8 border-b">
                  <div className="flex items-center gap-2 text-sm text-[#5E3023] mb-3">
                    <FaFeatherAlt />
                    <span>Contribution for Review</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-800">
                    {currentContribution.chaptertitle}
                  </h1>
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <FaUser />
                      <span>Submitted by {currentContribution.username}</span>
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6 md:p-10">
                  <div className="prose prose-lg max-w-none">
                    {currentContribution.chapter_content
                      .split("\n")
                      .map((paragraph, index) => (
                        paragraph.trim() && (
                          <p 
                            key={index} 
                            className="text-gray-700 leading-relaxed mb-6 text-lg"
                            style={{ fontFamily: "'Georgia', serif" }}
                          >
                            {paragraph.trim()}
                          </p>
                        )
                      ))}
                  </div>
                </div>

                {/* Article Footer */}
                <div className="bg-gray-50 p-6 border-t">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <p className="text-sm text-gray-500 italic flex items-center gap-2">
                      <IoBookOutline />
                      Review this contribution before publishing
                    </p>
                    <button
                      onClick={handlePublish}
                      disabled={publishing}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#5E3023] to-[#7a4636] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <FaCheck />
                      Approve & Publish
                    </button>
                  </div>
                </div>
              </article>
            ) : (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#5E3023]/10 to-[#5E3023]/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FaBookOpen className="text-[#5E3023] text-3xl" />
                </div>
                <h2 className="text-xl font-serif font-bold text-gray-800 mb-3">
                  Select a Contribution
                </h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  Choose a contribution from the sidebar to review the content and decide whether to publish it.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
