import axios from "axios";

// Base URL comes from .env
const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // if you’re using cookies/auth
});

export default api;
