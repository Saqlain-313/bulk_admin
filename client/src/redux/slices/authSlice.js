import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

// ✅ LOGIN
export const loginAdmin = createAsyncThunk(
  "auth/login",
  async (form, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", form, {
        withCredentials: true,
      });
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// ✅ LOGOUT
export const logoutAdmin = createAsyncThunk("auth/logout", async () => {
  await api.post("/auth/logout", { withCredentials: true });
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null, // ✅ yaha fix
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        // ✅ SAVE
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null;

        // ✅ REMOVE
        localStorage.removeItem("user");
      })
  },
});

export default authSlice.reducer;