import axios from "axios";
const api = axios.create({
baseURL: "http://localhost:4000",
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function getPopularProducts() {
  try {
    const res = await api.get("/api/products/popular");
    return res.data;
  } catch (error) {
    console.error("Error fetching popular products:", error);
    throw error;
  }
}

export async function getExclusiveOffers() {
  try {
    const res = await api.get("/api/products/offers");
    return res.data;
  } catch (error) {
    console.error("Error fetching exclusive offers:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const res = await api.get("/api/auth/me");
    return res.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

export async function subscribeNewsletter(email) {
  try {
    const res = await api.post("/api/newsletter/subscribe", { email });
    return res.data;
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    throw error;
  }
}
export default api;