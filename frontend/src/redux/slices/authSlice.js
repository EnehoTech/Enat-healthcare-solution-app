import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
// import a custom hook function to decode the payload from the access token
import { decodeAccessToken } from "../../hooks/useDecodeAccessToken.js";
const initialState = {
  isAuth: false,
  isLoading: true,
  userId: null,
  role: null,
  email: null,
  firstName: null,
  lastName: null,
  userName: null,
  error: null,
};
// Asynchronous thunk action to fetch user data from auth/verify-auth endpoints
export const fetchUserAuthData = createAsyncThunk(
  "auth/fetchUserAuthData",
  async (_, thunkAPI) => {
    try {
      // get access token stored in users local storage
      const getAccessToken = localStorage.getItem("_u_at_i"); // _u_at_i stands for user access token Id.
      if (getAccessToken) {
        // Decode token to check expiration
        const jwtDecodedToken = jwtDecode(getAccessToken);
        const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

        // If the token is expired, trigger logout
        if (jwtDecodedToken.exp < currentTime) {
          thunkAPI.dispatch(signOut());
          localStorage.removeItem("_u_at_i");
          return thunkAPI.rejectWithValue("Token expired. Logging out...");
        }

        // use the custom hooks to decode accessToken
        const decodedToken = await decodeAccessToken(getAccessToken);
        const decodedAuthData = {
          isAuth: true,
          user_id: decodedToken?.user_id,
          role_id: decodedToken?.role_id,
          email: decodedToken?.email,
          first_name: decodedToken?.first_name,
          last_name: decodedToken?.last_name,
          user_name: decodedToken?.user_name,
        };
        // return decoded user data
        return decodedAuthData;
      } else {
        throw new Error("Access token not found.");
      }
    } catch (error) {
      thunkAPI.dispatch(signOut());
      localStorage.removeItem("_u_at_i");
      // return the error for handling in extraReducers
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);
// user slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Reducer for login
    login(state, action) {
      const {user_id, role_id, email, first_name, last_name, user_name } =
        action.payload;
      state.isAuth = true;
      state.userId=user_id;
      state.role = role_id;
      state.email = email;
      state.firstName = first_name;
      state.lastName = last_name;
      state.userName = user_name;
    },
    // Reducer for logout (reset to initial state)
    signOut(state) {
      // Reset state to initial state
      const resetToInitialState = { ...initialState, isLoading: false };
      return resetToInitialState;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAuthData.pending, (state) => {
        state.isLoading = true;
        state.status = "loading...";
        state.error = null;
      })
      .addCase(fetchUserAuthData.fulfilled, (state, action) => {
        const AuthData = action.payload;
        if (AuthData?.isAuth) {
          state.isAuth = AuthData?.isAuth; 
          state.userId = AuthData?.user_id;
          state.role = AuthData?.role_id;
          state.email = AuthData?.email;
          state.firstName = AuthData?.first_name;
          state.lastName = AuthData?.last_name;
          state.userName = AuthData?.user_name;
        } else {
          state.isAuth = false;
          // Reset state if no user data found
          state.userId = null;
          state.role = null;
          state.email = null;
          state.firstName = null;
          state.lastName = null;
          state.userName = null;
        }
        state.status = "successful";
        state.isLoading = false;
      })
      .addCase(fetchUserAuthData.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error =
          action.payload || "An error occurred while fetching auth data";
      });
  },
});

export const { login, signOut, setIsLoading } = authSlice.actions;
export default authSlice.reducer;
