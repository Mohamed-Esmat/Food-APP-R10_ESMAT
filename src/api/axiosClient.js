import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://upskilling-egypt.com:3006/api/v1",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  //   withCredentials: true,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response
  .use
  // Task 1: handle 401 errors by redirecting to login page
  ();

export default axiosClient;
