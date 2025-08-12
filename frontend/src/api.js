import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // change to backend URL if deployed
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
//
// export const updateUserRole = (userId, role) => {
//   return api.put("/admin/role", { userId, role });
// };
//
export const getUsers = () => api.get("/admin/users"); // you'll need this route in backend
export const updateUserRole = (userId, role) => api.put("/admin/role", { userId, role });
export const deleteUser = (userId) => api.delete(`/admin/user/${userId}`);
//
export default api;
