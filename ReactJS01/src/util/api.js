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

export const getProductDetailApi = (slug) =>
  axios.get(`/v1/api/products/${slug}`);
