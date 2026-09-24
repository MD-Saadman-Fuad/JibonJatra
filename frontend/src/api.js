import api, { getBackendUrl, getImageUrl } from "./api/client";

export const getUsers = () => api.get("/admin/users");
export const updateUserRole = (userId, role) => api.put("/admin/role", { userId, role });
export const deleteUser = (userId) => api.delete(`/admin/user/${userId}`);

export { getBackendUrl, getImageUrl };
export default api;
