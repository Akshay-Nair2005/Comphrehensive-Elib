import React, { useState } from "react";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    title: "",
    author: "",
    content: "",
  });
  const [newComments, setNewComments] = useState({});

  const submitReview = (e) => {
    e.preventDefault();
    if (!newReview.title || !newReview.author || !newReview.content) {
      alert("Please fill in all fields.");
      return;
    }
    setReviews([
      ...reviews,
      {
        ...newReview,
        likes: 0,
        dislikes: 0,
        likeActive: false,
        dislikeActive: false,
        comments: [],
        showCommentBox: false,
      },
    ]);
    setNewReview({ title: "", author: "", content: "" });
  };

  const toggleLike = (index) => {
    setReviews(
      reviews.map((review, i) =>
        i === index
          ? {
              ...review,
              likeActive: !review.likeActive,
              likes: review.likeActive ? review.likes - 1 : review.likes + 1,
              dislikeActive: review.dislikeActive
                ? false
                : review.dislikeActive,
              dislikes: review.dislikeActive
                ? review.dislikes - 1
                : review.dislikes,
            }
          : review
      )
    );
  };

  const toggleDislike = (index) => {
    setReviews(
      reviews.map((review, i) =>
        i === index
          ? {
              ...review,
              dislikeActive: !review.dislikeActive,
              dislikes: review.dislikeActive
                ? review.dislikes - 1
                : review.dislikes + 1,
              likeActive: review.likeActive ? false : review.likeActive,
              likes: review.likeActive ? review.likes - 1 : review.likes,
            }
          : review
      )
    );
  };

  const toggleCommentBox = (index) => {
    setReviews(
      reviews.map((review, i) =>
        i === index
          ? { ...review, showCommentBox: !review.showCommentBox }
          : review
      )
    );
  };

  const handleAddComment = (index) => {
    if (!newComments[index] || newComments[index].trim() === "") {
      alert("Please enter a valid comment.");
      return;
    }
    setReviews(
      reviews.map((review, i) =>
        i === index
          ? {
              ...review,
              comments: [...review.comments, newComments[index]],
              showCommentBox: false,
            }
          : review
      )
    );
    setNewComments({ ...newComments, [index]: "" });
  };

  return (
    <div className="min-h-screen w-full px-4 py-6">
      <h1 className="text-3xl text-center font-bold">Reviews</h1>

      <div className="mt-6 flex flex-col md:flex-row w-full space-y-6 md:space-y-0 md:space-x-6">
        {/* Left Panel - Add Review */}
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-xl font-bold mb-4">Add Your Review</h2>
          <form className="flex flex-col space-y-3" onSubmit={submitReview}>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) =>
                setNewReview({ ...newReview, title: e.target.value })
              }
              placeholder="Enter review title"
              className="w-full p-2 border rounded-md"
              required
            />
            <input
              type="text"
              value={newReview.author}
              onChange={(e) =>
                setNewReview({ ...newReview, author: e.target.value })
              }
              placeholder="Enter your name"
              className="w-full p-2 border rounded-md"
              required
            />
            <input
              type="text"
              value={newReview.content}
              onChange={(e) =>
                setNewReview({ ...newReview, content: e.target.value })
              }
              placeholder="Write your review"
              className="w-full h-[210px] p-2 border rounded-md"
              required
            />
            <button
              type="submit"
              className="bg-[#5E3023] text-white px-4 py-2 rounded-md"
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Right Panel - Show Reviews or "No reviews" */}
        <div className="w-full md:w-1/2 p-4 border-l-4 border-[#5E3023]  rounded-sm  h-[60vh] overflow-y-auto">
          {reviews.length === 0 ? (
            <div className="h-full flex items-center justify-center text-[#5E3023] font-bold font-serif text-3xl">
              No reviews currently.
            </div>
          ) : (
            reviews.map((review, index) => (
              <div
                key={index}
                className="mb-6 p-4 border rounded-md shadow-sm bg-white"
              >
                <h2 className="text-lg font-semibold">{review.title}</h2>
                <p className="text-sm text-gray-600">
                  Review by <strong>{review.author}</strong>
                </p>
                <p className="mt-2">{review.content}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleLike(index)}
                    className={`px-3 py-1 text-sm rounded ${
                      review.likeActive
                        ? "bg-[#5E3023] text-white"
                        : "border border-gray-400"
                    }`}
                  >
                    👍 {review.likes}
                  </button>
                  <button
                    onClick={() => toggleDislike(index)}
                    className={`px-3 py-1 text-sm rounded ${
                      review.dislikeActive
                        ? "bg-[#5E3023] text-white"
                        : "border border-gray-400"
                    }`}
                  >
                    👎 {review.dislikes}
                  </button>
                  <button
                    onClick={() => toggleCommentBox(index)}
                    className="px-3 py-1 text-sm rounded bg-green-600 text-white"
                  >
                    💬
                  </button>
                </div>

                {/* Comment Box */}
                {review.showCommentBox && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={newComments[index] || ""}
                      className="w-full p-2 border-b-2 focus:outline-none"
                      placeholder="Add a comment..."
                      onChange={(e) =>
                        setNewComments({
                          ...newComments,
                          [index]: e.target.value,
                        })
                      }
                    />
                    <button
                      onClick={() => handleAddComment(index)}
                      className="bg-[#5E3023] text-white px-4 py-1 mt-2 rounded w-full"
                    >
                      Add Comment
                    </button>
                  </div>
                )}

                {/* Comments */}
                {review.comments.length > 0 && (
                  <ul className="mt-3 space-y-1">
                    {review.comments.map((comment, idx) => (
                      <li key={idx} className="bg-gray-100 p-2 rounded text-sm">
                        {comment}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
