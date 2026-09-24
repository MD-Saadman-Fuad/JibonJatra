import api from "./client";

// Get all posts (Public)
export const fetchPosts = async () => {
  const res = await api.get("/posts");
  return res.data;
};

// Create a new post (Requires token)
export const createPost = async (postData) => {
  const res = await api.post("/posts", postData);
  return res.data;
};
