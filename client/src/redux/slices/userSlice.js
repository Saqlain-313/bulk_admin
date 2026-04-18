import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

// ✅ GET USERS
export const fetchUsers = createAsyncThunk(
  "users/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/users", {
        withCredentials: true,
      });
      return data.users;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ✅ UPDATE CREDITS
export const updateCredits = createAsyncThunk(
  "users/updateCredits",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        "/auth/credits",
        payload,
        { withCredentials: true }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;