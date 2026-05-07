import axios from "axios";

const API = axios.create({
  baseURL: "https://expense-tracker-1qg4.onrender.com/api",
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // 🔥 GET USER FROM LOCAL STORAGE
    const user = JSON.parse(localStorage.getItem("user"));

    // ✅ attach token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ attach userId (CRITICAL FIX)
    // ❗ DON'T attach userId for auth routes
if (user?._id && !config.url.includes("/auth")) {
  config.params = {
    ...(config.params || {}),
    userId: user._id,
  };
}

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message || "Something went wrong";

    console.error("API Error:", message);

    // 🔐 auto logout on invalid token
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default API;