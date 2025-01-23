import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  hbookName: "",
  hbookGenre: "",
  hbookDesc: "",
  hbookAuthor: "",
  hbookAuthDesc: "",
  hbookNovelImg: "",
  imagePreview: null,
};

const hostedBookSlice = createSlice({
  name: "hostedBook",
  initialState,
  reducers: {
    setHbookName: (state, action) => {
      state.hbookName = action.payload;
    },
    setHbookGenre: (state, action) => {
      state.hbookGenre = action.payload;
    },
    setHbookDesc: (state, action) => {
      state.hbookDesc = action.payload;
    },
    setHbookAuthor: (state, action) => {
      state.hbookAuthor = action.payload;
    },
    setHbookAuthDesc: (state, action) => {
      state.hbookAuthDesc = action.payload;
    },
    setHbookNovelImg: (state, action) => {
      state.hbookNovelImg = action.payload;
    },
    setImagePreview: (state, action) => {
      state.imagePreview = action.payload;
    },
  },
});

// Export actions
export const {
  setHbookName,
  setHbookGenre,
  setHbookDesc,
  setHbookAuthor,
  setHbookAuthDesc,
  setHbookNovelImg,
  setImagePreview,
} = hostedBookSlice.actions;

// Export reducer
export default hostedBookSlice.reducer;
