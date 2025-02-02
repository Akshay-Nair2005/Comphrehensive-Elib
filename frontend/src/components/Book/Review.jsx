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
    <div className="min-h-screen mt-4 w-full">
      <h1 className="text-3xl text-color text-center font-bold">Reviews</h1>
      <div className="mt-4 flex flex-wrap w-full justify-evenly">
        <div className="w-[40%] mt-4 p-4">
          <h2 className="text-xl font-bold text-color">Add Your Review</h2>
          <form className="flex flex-col mt-4" onSubmit={submitReview}>
            {/* Title Input */}
            <label className="mb-2 font-semibold text-color">Title</label>
            <input
              type="text"
              value={newReview.title}
              onChange={(e) =>
                setNewReview({ ...newReview, title: e.target.value })
              }
              placeholder="Enter review title"
              className="mb-4 p-2 border rounded-md"
              required
            />

            {/* Author Input */}
            <label className="mb-2 font-semibold text-color">Author</label>
            <input
              type="text"
              value={newReview.author}
              onChange={(e) =>
                setNewReview({ ...newReview, author: e.target.value })
              }
              placeholder="Enter your name"
              className="mb-4 p-2 border rounded-md"
              required
            />

            {/* Content Input */}
            <label className="mb-2 font-semibold text-color">Content</label>
            <textarea
              value={newReview.content}
              onChange={(e) =>
                setNewReview({ ...newReview, content: e.target.value })
              }
              placeholder="Write your review"
              className="mb-4 p-2 border rounded-md"
              rows="4"
              required
            ></textarea>

            {/* Submit Button */}
            <button
              type="submit"
              className="px-4 py-2 bg-button text-color rounded-md"
            >
              Submit Review
            </button>
          </form>
        </div>

        <div className="w-1/2 review-container overflow-y-auto h-[calc(100vh-100px)] mt-4 space-y-6 border-l border-l-[#5E3023]">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="review text-black rounded-md p-4 shadow-md"
            >
              <h2 className="text-xl text-black font-semibold">
                {review.title}
              </h2>
              <p className="mt-2">
                <strong>Review by {review.author}</strong>
              </p>
              <p className="mt-2">{review.content}</p>
              <div className="mt-4">
                <button
                  onClick={() => dispatch(toggleLike(index))}
                  className={`mr-2 px-3 py-2 rounded-lg ${
                    review.likeActive ? "bg-button text-white" : "border-small "
                  }`}
                >
                  👍🏻 {review.likes}
                </button>
                <button
                  onClick={() => dispatch(toggleDislike(index))}
                  className={`mr-2 px-3 py-2 rounded-lg ${
                    review.dislikeActive
                      ? "bg-button text-white"
                      : "border-small"
                  }`}
                >
                  👎🏻 {review.dislikes}
                </button>
                <button
                  onClick={() => dispatch(toggleCommentBox(index))}
                  className="ml-2 px-3 py-2 rounded-lg bg-hover bg-button"
                >
                  💬
                </button>
                {review.showCommentBox && (
                  <div className="mt-4">
                    <input
                      type="text"
                      value={newComments[index] || ""}
                      className="p-2 rounded-md w-full bg-[#E1CDBB] border-b-2 border-b-[#5E3023] focus:outline-none focus:ring-0"
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
                      className=" bg-[#5E3023] p-2 mt-3 rounded-lg text-white"
                    >
                      Add Comment
                    </button>
                  </div>
                )}
                <ul className="mt-3">
                  {review.comments.map((comment, idx) => (
                    <li key={idx}>{comment}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Review;
