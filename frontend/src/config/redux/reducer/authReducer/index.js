import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, loginUser, registerUser } from "@/config/redux/action/authAction";

const initialState = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  profileFetched: false,
  connections: [],
  connectionRequest: []
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    emptyMessage: (state) => {
      state.message = "";
      state.isError = false;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.loggedIn = false;
      state.user = null;
      state.profileFetched = false;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Signing in...";
        state.isError = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "Login successful!";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Login failed. Check your credentials.";
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Creating account...";
        state.isError = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.message = action.payload?.message || "Registration successful! Please sign in.";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Registration failed. Try a different username or email.";
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload;
      });
  }
});

export const { reset, emptyMessage, logout } = authSlice.actions;
export default authSlice.reducer;
