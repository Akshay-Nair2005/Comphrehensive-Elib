import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addReview,
  toggleLike,
  toggleDislike,
  toggleCommentBox,
  addComment,
} from "../../redux/features/reviewSlice";

const Review = () => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.reviews);

  const [newReview, setNewReview] = useState({
    title: "",
    author: "",
    content: "",
  });
  const [newComments, setNewComments] = useState([]);

  const submitReview = (e) => {
    e.preventDefault();
    if (!newReview.title || !newReview.author || !newReview.content) {
      alert("Please fill in all fields.");
      return;
    }
    dispatch(addReview(newReview));
    setNewReview({ title: "", author: "", content: "" });
  };

  const handleAddComment = (index) => {
    if (!newComments[index] || newComments[index].trim() === "") {
      alert("Please enter a valid comment.");
      return;
    }
    dispatch(addComment({ index, comment: newComments[index] }));
    setNewComments((prev) => {
      const newState = [...prev];
      newState[index] = "";
      return newState;
    });
  };

  return (
    <div className="min-h-screen mt-4 w-full px-4">
      <h1 className="text-3xl text-color text-center font-bold">Reviews</h1>
      <div className="mt-4 flex flex-col md:flex-row w-full justify-between space-y-6 md:space-y-0">
        {/* Review Form */}
        <div className="w-full md:w-2/5 lg:w-1/3 p-4">
          <h2 className="text-xl font-bold text-color">Add Your Review</h2>
          <form className="flex flex-col mt-4" onSubmit={submitReview}>
            <label className="mb-2 font-semibold text-color">Title</label>
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

            <label className="mb-2 font-semibold text-color">Author</label>
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

            <label className="mb-2 font-semibold text-color">Content</label>
            <textarea
              value={newReview.content}
              onChange={(e) =>
                setNewReview({ ...newReview, content: e.target.value })
              }
              placeholder="Write your review"
              className="w-full p-2 border rounded-md"
              rows="4"
              required
            ></textarea>

            <button
              type="submit"
              className="w-full mt-4 px-4 py-2 bg-button text-white rounded-md"
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="w-full md:w-3/5 lg:w-2/3 review-container overflow-y-auto h-[50vh] md:h-[calc(100vh-100px)] space-y-6 border-l border-l-[#5E3023] px-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="review text-black rounded-md p-4 shadow-md"
            >
              <h2 className="text-lg sm:text-xl text-black font-semibold">
                {review.title}
              </h2>
              <p className="mt-2 text-sm sm:text-base">
                <strong>Review by {review.author}</strong>
              </p>
              <p className="mt-2 text-sm sm:text-base">{review.content}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => dispatch(toggleLike(index))}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    review.likeActive
                      ? "bg-button text-white"
                      : "border border-gray-400"
                  }`}
                >
                  👍🏻 {review.likes}
                </button>
                <button
                  onClick={() => dispatch(toggleDislike(index))}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    review.dislikeActive
                      ? "bg-button text-white"
                      : "border border-gray-400"
                  }`}
                >
                  👎🏻 {review.dislikes}
                </button>
                <button
                  onClick={() => dispatch(toggleCommentBox(index))}
                  className="px-3 py-2 text-sm rounded-lg bg-button text-white"
                >
                  💬
                </button>
              </div>
              {review.showCommentBox && (
                <div className="mt-4">
                  <input
                    type="text"
                    value={newComments[index] || ""}
                    className="w-full p-2 border-b-2 border-b-[#5E3023] focus:outline-none"
                    onChange={(e) =>
                      setNewComments((prev) => {
                        const newState = [...prev];
                        newState[index] = e.target.value;
                        return newState;
                      })
                    }
                  />
                  <button
                    onClick={() => handleAddComment(index)}
                    className="w-full md:w-auto bg-[#5E3023] p-2 mt-3 rounded-lg text-white"
                  >
                    Add Comment
                  </button>
                </div>
              )}
              <ul className="mt-3 text-sm">
                {review.comments.map((comment, idx) => (
                  <li key={idx} className="bg-gray-100 p-2 rounded-md">
                    {comment}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Review;
