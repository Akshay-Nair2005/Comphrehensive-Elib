import React, { useState } from "react";

const Review = () => {
  const [reviews, setReviews] = useState([
    {
      title: "Amazing Book",
      author: "WanderlustExplorer",
      content:
        "Its a Amazing book. I love it. I have read it 3 times and still I am not bored of it. I would recommend it to everyone.",
      likes: 0,
      dislikes: 0,
      likeActive: false,
      dislikeActive: false,
      comments: [],
      showCommentBox: false,
    },
    {
      title: "Just Fabulous !!!",
      author: "CultureVulture",
      content:
        "This book is just fabulous! The storytelling is captivating and the characters are well-developed. I couldn't put it down and finished it in one sitting. Highly recommended!",
      likes: 0,
      dislikes: 0,
      likeActive: false,
      dislikeActive: false,
      comments: [],
      showCommentBox: false,
    },
  ]);

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
    const updatedReviews = [...reviews];
    const review = updatedReviews[index];
    if (!review.likeActive) {
      review.likes++;
      review.likeActive = true;
      if (review.dislikeActive) {
        review.dislikes--;
        review.dislikeActive = false;
      }
    } else {
      review.likes--;
      review.likeActive = false;
    }
    setReviews(updatedReviews);
  };

  const toggleDislike = (index) => {
    const updatedReviews = [...reviews];
    const review = updatedReviews[index];
    if (!review.dislikeActive) {
      review.dislikes++;
      review.dislikeActive = true;
      if (review.likeActive) {
        review.likes--;
        review.likeActive = false;
      }
    } else {
      review.dislikes--;
      review.dislikeActive = false;
    }
    setReviews(updatedReviews);
  };

  const toggleCommentBox = (index) => {
    const updatedReviews = [...reviews];
    updatedReviews[index].showCommentBox =
      !updatedReviews[index].showCommentBox;
    setReviews(updatedReviews);
  };

  const addComment = (index) => {
    if (!newComments[index] || newComments[index].trim() === "") {
      alert("Please enter a valid comment.");
      return;
    }
    const updatedReviews = [...reviews];
    updatedReviews[index].comments.push(newComments[index]);
    updatedReviews[index].showCommentBox = false;
    setNewComments((prev) => {
      const newState = [...prev];
      newState[index] = "";
      return newState;
    });
    setReviews(updatedReviews);
  };

  return (
    <div className="min-h-screen mt-4 w-full">
      <h1 className="text-3xl text-button text-center font-bold">Reviews</h1>
      <div className=" mt-4 flex flex-wrap w-full justify-evenly">
        {/* Add Review Section */}
        <div className="w-[40%] mt-4  p-4">
          <h2 className="text-xl font-bold text-button">Add Your Review</h2>
          <form className="flex flex-col mt-4" onSubmit={submitReview}>
            <label htmlFor="reviewTitle" className="text-button mb-1">
              Title:
            </label>
            <input
              type="text"
              id="reviewTitle"
              value={newReview.title}
              onChange={(e) =>
                setNewReview({ ...newReview, title: e.target.value })
              }
              className="p-2 bg-white/90 rounded-md text-button mb-3"
              required
            />
            <label htmlFor="reviewAuthor" className="text-button mb-1">
              Your Name:
            </label>
            <input
              type="text"
              id="reviewAuthor"
              value={newReview.author}
              onChange={(e) =>
                setNewReview({ ...newReview, author: e.target.value })
              }
              className="p-2 bg-white/90 rounded-lg text-button mb-3"
              required
            />
            <label htmlFor="reviewContent" className="text-button mb-1">
              Review:
            </label>
            <textarea
              id="reviewContent"
              value={newReview.content}
              onChange={(e) =>
                setNewReview({ ...newReview, content: e.target.value })
              }
              className="p-2 bg-white/90 rounded-lg text-black mb-3"
              rows="4"
              required
            ></textarea>
            <button
              type="submit"
              className="px-4 py-2 bg-button text-button rounded-md"
            >
              Submit Review
            </button>
          </form>
        </div>

        {/* Review List Section */}
        <div className="w-1/2 review-container overflow-y-auto h-[calc(100vh-100px)] mt-4 space-y-6 border-l border-l-[#F87871]">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="review text-button rounded-md p-4 shadow-md"
            >
              <h2 className="text-xl font-semibold">{review.title}</h2>
              <p className="mt-2">
                <strong>Review by {review.author}</strong>
              </p>
              <p className="mt-2">{review.content}</p>
              <div className="mt-4">
                <button
                  className={`mr-2 px-3 py-2 rounded-lg text-button  ${
                    review.likeActive
                      ? "bg-button"
                      : "border border-card text-button"
                  }`}
                  onClick={() => toggleLike(index)}
                >
                  👍🏻 {review.likes}
                </button>
                <button
                  className={`mr-2 px-3 py-2 rounded-lg  text-button ${
                    review.dislikeActive
                      ? "bg-button"
                      : "border border-card text-button"
                  }`}
                  onClick={() => toggleDislike(index)}
                >
                  👎🏻 {review.dislikes}
                </button>
                <button
                  className="ml-2 px-3 py-2 rounded-lg border border-card text-button"
                  onClick={() => toggleCommentBox(index)}
                >
                  💬
                </button>
                {review.showCommentBox && (
                  <div className="mt-4 w-[85%] rounded-md">
                    <input
                      type="text"
                      value={newComments[index] || ""}
                      onChange={(e) =>
                        setNewComments((prev) => {
                          const newState = [...prev];
                          newState[index] = e.target.value;
                          return newState;
                        })
                      }
                      className="w-full bg-[#383838] border-b border-b-[#F87871]  p-2 text-button placeholder-gray-500"
                      placeholder="Write a comment..."
                    />
                    <button
                      onClick={() => addComment(index)}
                      className="mt-3 px-4 py-1 bg-button text-button rounded-md "
                    >
                      Add Comment
                    </button>
                  </div>
                )}
                <ul className="mt-2 space-y-2">
                  {review.comments.map((comment, idx) => (
                    <li
                      key={idx}
                      className="border-b border-white/80 pb-1 text-button"
                    >
                      {comment}
                    </li>
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
