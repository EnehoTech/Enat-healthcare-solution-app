import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { protectedAxios } from "../../lib/apiSetup";
// Import from the env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  isLoading: true, // Loading state for onboarding stage
  isOnboardingCompleted: false,
  stage: null, // Onboarding stage
  name: null,
  description: null,
  error: null, // Error state for onboarding stage
};

// Thunk to fetch onboarding stage
export const fetchOnboardingStage = createAsyncThunk(
  "onboarding/fetchOnboardingStage",
  async (_, thunkAPI) => {
    try {
      const { data } = await protectedAxios.get(
        `${API_BASE_URL}/users/onboarding/stage`
      );
      return data?.data?.onboarding_stage;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    resetOnboardingStage(state) {
      // Reset state to initial state
      const resetToInitialState = { ...initialState, isLoading: false };
      return resetToInitialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOnboardingStage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOnboardingStage.fulfilled, (state, action) => {
        const onboardingStageData = action.payload;
        if (onboardingStageData) {
          state.stage = onboardingStageData.stage_id;
          state.name = onboardingStageData.stage_name;
          state.description = onboardingStageData.description;
        }else {
          state.stage = null;
          state.name = null;
          state.description = null;
        }
        if (onboardingStageData.stage_name==="completed") {
          state.isOnboardingCompleted=true
        }
         state.status = "successful";
         state.isLoading = false;
      })
      .addCase(fetchOnboardingStage.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error =
          action.payload ||
          "An error occurred while fetching onboarding stage.";
      });
  },
});

export const { resetOnboardingStage } = onboardingSlice.actions;
export default onboardingSlice.reducer;
