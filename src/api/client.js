// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api",
// });

// export default api;
// 

// src/api/client.js
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export default api;

