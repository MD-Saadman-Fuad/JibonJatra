import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "https://jibonjatra.onrender.com/api",
});
