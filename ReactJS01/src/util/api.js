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
