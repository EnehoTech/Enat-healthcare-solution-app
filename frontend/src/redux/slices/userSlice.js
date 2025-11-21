import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { protectedAxios } from "../../lib/apiSetup";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

// Thunk to fetch user details by ID
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (userId, thunkAPI) => {
    try {
      const { data } = await protectedAxios.get(
        `${API_BASE_URL}/users/${userId}`
      );
      return data?.data?.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState(state) {
      // Reset user state to initial
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload || "An error occurred while fetching user details.";
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
