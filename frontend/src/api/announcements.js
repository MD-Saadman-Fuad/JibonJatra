import api from "../api";

export const getAnnouncements = () => api.get("/api/announcements");
export const createAnnouncement = (data) => api.post("/api/announcements", data);
export const updateAnnouncement = (id, data) => api.put(`/api/announcements/${id}`, data);
export const deleteAnnouncement = (id) => api.delete(`/api/announcements/${id}`);

// Mark announcement as viewed by user
export const markAnnouncementViewed = (id) => api.post(`/api/announcements/${id}/viewed`);
