import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getCartApi,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
} from "../util/api";

const initialState = {
  cart: null, // { _id, userId, items: [ { productId: { ... }, quantity, _id } ] }
  loading: false,
  error: "",
};

export const fetchCartThunk = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    const res = await getCartApi();
    if (res?.EC === 0) {
      return res;
    }
    return rejectWithValue(res?.EM || "Không thể lấy thông tin giỏ hàng.");
  }
);

export const addToCartThunk = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    const res = await addToCartApi(productId, quantity);
    if (res?.EC === 0) {
      return res;
    }
    return rejectWithValue(res?.EM || "Không thể thêm sản phẩm vào giỏ hàng.");
  }
);

export const updateCartItemThunk = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    const res = await updateCartItemApi(productId, quantity);
    if (res?.EC === 0) {
      return res;
    }
    return rejectWithValue(res?.EM || "Không thể cập nhật giỏ hàng.");
  }
);

export const removeCartItemThunk = createAsyncThunk(
  "cart/removeCartItem",
  async (productId, { rejectWithValue }) => {
    const res = await removeCartItemApi(productId);
    if (res?.EC === 0) {
      return res;
    }
    return rejectWithValue(res?.EM || "Không thể xóa sản phẩm khỏi giỏ hàng.");
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.cart = null;
      state.error = "";
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCartThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.data;
      })
      .addCase(fetchCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add To Cart
      .addCase(addToCartThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.data;
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Cart Item
      .addCase(updateCartItemThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateCartItemThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.data;
      })
      .addCase(updateCartItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Cart Item
      .addCase(removeCartItemThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(removeCartItemThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.data;
      })
      .addCase(removeCartItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
