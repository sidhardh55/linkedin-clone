import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllPosts = createAsyncThunk(
  "post/getAllposts",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/posts");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Failed to load posts" });
    }
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (formData, thunkAPI) => {
    try {
      const response = await clientServer.post("/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      thunkAPI.dispatch(getAllPosts());
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Failed to create post" });
    }
  }
);

export const incrementLikes = createAsyncThunk(
  "post/incrementLikes",
  async (post_id, thunkAPI) => {
    try {
      const response = await clientServer.post("/increment_post_like", { post_id });
      thunkAPI.dispatch(getAllPosts());
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Failed to like post" });
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async ({ token, post_id }, thunkAPI) => {
    try {
      const response = await clientServer.post("/delete_post", { token, post_id });
      thunkAPI.dispatch(getAllPosts());
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Failed to delete post" });
    }
  }
);

export const addComment = createAsyncThunk(
  "post/addComment",
  async ({ token, post_id, commentBody }, thunkAPI) => {
    try {
      const response = await clientServer.post("/comment", { token, post_id, commentBody });
      thunkAPI.dispatch(getComments(post_id));
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Failed to add comment" });
    }
  }
);

export const getComments = createAsyncThunk(
  "post/getComments",
  async (post_id, thunkAPI) => {
    try {
      const response = await clientServer.get(`/get_comments?post_id=${post_id}`);
      return { post_id, comments: response.data.comments };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Failed to fetch comments" });
    }
  }
);

export const deleteComment = createAsyncThunk(
  "post/deleteComment",
  async ({ token, comment_id, post_id }, thunkAPI) => {
    try {
      const response = await clientServer.delete("/delete_comment", {
        data: { token, comment_id }
      });
      if (post_id) {
        thunkAPI.dispatch(getComments(post_id));
      }
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Failed to delete comment" });
    }
  }
);