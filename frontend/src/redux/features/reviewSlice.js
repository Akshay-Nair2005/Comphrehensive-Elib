// reviewSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviews: [
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
  ],
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    addReview: (state, action) => {
      state.reviews.push({
        ...action.payload,
        likes: 0,
        dislikes: 0,
        likeActive: false,
        dislikeActive: false,
        comments: [],
        showCommentBox: false,
      });
    },
    toggleLike: (state, action) => {
      const review = state.reviews[action.payload];
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
    },
    toggleDislike: (state, action) => {
      const review = state.reviews[action.payload];
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
    },
    toggleCommentBox: (state, action) => {
      state.reviews[action.payload].showCommentBox =
        !state.reviews[action.payload].showCommentBox;
    },
    addComment: (state, action) => {
      const { index, comment } = action.payload;
      if (comment.trim()) {
        state.reviews[index].comments.push(comment);
        state.reviews[index].showCommentBox = false;
      }
    },
  },
});

export const {
  addReview,
  toggleLike,
  toggleDislike,
  toggleCommentBox,
  addComment,
} = reviewSlice.actions;

export default reviewSlice.reducer;
