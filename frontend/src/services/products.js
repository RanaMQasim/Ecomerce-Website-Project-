import axios from "axios";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const api = axios.create({
  baseURL: API_BASE + "/api",
  timeout: 10000,
});
export const getProducts = (params = {}) =>
  api.get("/products", { params }).then((r) => r.data);
export const getProduct = (id) =>
  api.get(`/products/${id}`).then((r) => r.data);
export const getPopularProducts = (params = {}) =>
  api.get("/products/popular", { params }).then((r) => r.data);
export const getExclusiveOffers = () =>
  api.get("/offers/active").then((r) => r.data);
export const createProduct = (formData) =>
  api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export default api;