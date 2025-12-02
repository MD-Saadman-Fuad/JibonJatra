import api from "./client";

// Get all market items
export const fetchMarketItems = (params) => api.get("/market", { params });

// Get single market item
export const fetchMarketItem = (id) => api.get(`/market/${id}`);

// Create market item (with FormData for image)
export const createMarketItemAPI = (data, token) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("price", data.price);
  formData.append("location", data.location);
  formData.append("source", data.source);
  if (data.image) formData.append("image", data.image);

  return api.post("/market", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// Update market item (with FormData)
export const updateMarketItemAPI = (id, data, token) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("price", data.price);
  formData.append("location", data.location);
  formData.append("source", data.source);
  if (data.image) formData.append("image", data.image);
  else if (data.imageUrl) formData.append("image", data.imageUrl); // optional

  return api.put(`/market/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

// Delete market item
export const deleteMarketItemAPI = (id, token) =>
  api.delete(`/market/${id}`, { headers: { Authorization: `Bearer ${token}` } });
