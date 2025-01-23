// store.js
import { configureStore } from "@reduxjs/toolkit";
import reviewReducer from "./features/reviewSlice";
import hostedBookReducer from "./features/hostedBookSlice";

const store = configureStore({
  reducer: {
    reviews: reviewReducer,
    hostedBook: hostedBookReducer,

  },
});

export default store;
