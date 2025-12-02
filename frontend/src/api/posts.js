const API_URL = `${process.env.REACT_APP_API_BASE || "https://jibonjatra.onrender.com/api"}/posts`;

// Get all posts (Public)
export const fetchPosts = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
};

// Create a new post (Requires token)
export const createPost = async (postData, token) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(postData)
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
};
