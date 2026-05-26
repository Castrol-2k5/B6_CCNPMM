import axios from "./axios.customize";

export const registerApi = (name, email, password) =>
  axios.post("/v1/api/register", { name, email, password });

export const loginApi = (email, password) =>
  axios.post("/v1/api/login", { email, password });

export const getAccountApi = () => axios.get("/v1/api/account");

export const forgotPasswordApi = (email) =>
  axios.post("/v1/api/forgot-password", { email });

export const getProductsApi = (params) =>
  axios.get("/v1/api/products", { params });

export const getProductHighlightsApi = (params) =>
  axios.get("/v1/api/products/highlights", { params });

export const getProductDetailApi = (slug) =>
  axios.get(`/v1/api/products/${slug}`);

export const getProfileApi = () => axios.get("/v1/api/profile");

export const updateProfileApi = (payload) =>
  axios.put("/v1/api/profile", payload);

export const getAdminUsersApi = () => axios.get("/v1/api/admin/users");
export const updateAdminUserApi = (id, payload) =>
  axios.put(`/v1/api/admin/users/${id}`, payload);
export const deleteAdminUserApi = (id) => axios.delete(`/v1/api/admin/users/${id}`);

export const createAdminProductApi = (payload) =>
  axios.post("/v1/api/admin/products", payload);
export const updateAdminProductApi = (id, payload) =>
  axios.put(`/v1/api/admin/products/${id}`, payload);
export const deleteAdminProductApi = (id) => axios.delete(`/v1/api/admin/products/${id}`);

// Cart APIs
export const getCartApi = () => axios.get("/v1/api/cart");
export const addToCartApi = (productId, quantity) =>
  axios.post("/v1/api/cart", { productId, quantity });
export const updateCartItemApi = (productId, quantity) =>
  axios.put(`/v1/api/cart/items/${productId}`, { quantity });
export const removeCartItemApi = (productId) =>
  axios.delete(`/v1/api/cart/items/${productId}`);

// Order APIs
export const createOrderApi = (shippingAddress, paymentMethod) =>
  axios.post("/v1/api/orders", { shippingAddress, paymentMethod });
export const getOrdersHistoryApi = () => axios.get("/v1/api/orders");
export const getOrderDetailApi = (id) => axios.get(`/v1/api/orders/${id}`);
export const cancelOrderApi = (id, reason) =>
  axios.post(`/v1/api/orders/${id}/cancel`, { reason });

// Admin Order APIs
export const getAdminOrdersApi = () => axios.get("/v1/api/admin/orders");
export const updateOrderStatusByAdminApi = (id, status) =>
  axios.put(`/v1/api/admin/orders/${id}/status`, { status });
export const handleCancelRequestByAdminApi = (id, action) =>
  axios.put(`/v1/api/admin/orders/${id}/cancel-request`, { action });

