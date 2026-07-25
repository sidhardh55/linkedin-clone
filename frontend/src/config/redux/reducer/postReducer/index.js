import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts, getComments, createPost } from "../../action/postAction";

const initialState = {
  posts: [],
  isError: false,
  postFetched: false,
  isLoading: false,
  message: "",
  commentsMap: {}, // Map of post_id -> array of comments
  postId: "",
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: () => initialState,
    resetPostId: (state) => {
      state.postId = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
        state.message = "Fetching all posts...";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.postFetched = true;
        state.posts = action.payload.posts || [];
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to fetch posts";
      })
      .addCase(getComments.fulfilled, (state, action) => {
        const { post_id, comments } = action.payload;
        state.commentsMap[post_id] = comments || [];
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Error creating post";
      });
  }
});

export const { reset, resetPostId } = postSlice.actions;
export default postSlice.reducer;