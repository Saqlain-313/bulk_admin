import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

// ✅ GET ANALYSIS
export const fetchImportAnalysis = createAsyncThunk(
  "importUsers/getAnalysis",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        "/import-users/analysis",
        { withCredentials: true }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ✅ UPDATE SINGLE STATUS
export const updateImportStatus = createAsyncThunk(
  "importUsers/updateStatus",
  async ({ id, status, errorMessage }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `/import-users/${id}/status`,
        { status, errorMessage },
        { withCredentials: true }
      );
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ✅ BULK UPDATE
export const bulkUpdateImportStatus = createAsyncThunk(
  "importUsers/bulkUpdate",
  async ({ ids, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        "/import-users/bulk/status",
        { ids, status },
        { withCredentials: true }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const importUserSlice = createSlice({
  name: "importUsers",
  initialState: {
    all: [],
    unique: [],
    duplicates: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchImportAnalysis.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchImportAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload.all;
        state.unique = action.payload.unique;
        state.duplicates = action.payload.duplicates;
      })
      .addCase(fetchImportAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default importUserSlice.reducer;