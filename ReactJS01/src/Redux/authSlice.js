import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  forgotPasswordApi,
  getAccountApi,
  loginApi,
  registerApi,
} from "../util/api";

const initialState = {
  isAuthenticated: false,
  user: null,
  accessToken: localStorage.getItem("access_token") || "",
  loading: false,
  appLoading: true,
  error: "",
  message: "",
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    const res = await loginApi(email, password);
    if (res?.EC === 0) {
      localStorage.setItem("access_token", res.access_token);
      return res;
    }
    return rejectWithValue(res?.EM || "Đăng nhập thất bại.");
  },
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    const res = await registerApi(name, email, password);
    if (res?.EC === 0) {
      return res;
    }
    return rejectWithValue(res?.EM || "Đăng ký thất bại.");
  },
);

export const fetchAccountThunk = createAsyncThunk(
  "auth/fetchAccount",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return rejectWithValue("No token");
    }

    const res = await getAccountApi();
    if (res?.email) {
      return res;
    }
    return rejectWithValue(res?.EM || res?.message || "Không thể lấy thông tin tài khoản.");
  },
);

export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    const res = await forgotPasswordApi(email);
    if (res?.EC === 0) {
      return res;
    }
    return rejectWithValue(res?.EM || "Không thể xử lý yêu cầu.");
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("access_token");
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = "";
      state.error = "";
      state.message = "";
    },
    clearFeedback: (state) => {
      state.error = "";
      state.message = "";
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.access_token;
        state.user = action.payload.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.message = "";
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.EM;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAccountThunk.pending, (state) => {
        state.appLoading = true;
      })
      .addCase(fetchAccountThunk.fulfilled, (state, action) => {
        state.appLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchAccountThunk.rejected, (state) => {
        state.appLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem("access_token");
      })
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.message = "";
      })
      .addCase(forgotPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.EM;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearFeedback, setUser } = authSlice.actions;
export default authSlice.reducer;
