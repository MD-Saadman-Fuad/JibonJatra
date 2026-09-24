

// import React, { useEffect, useState } from "react";
// import api from "../api";
// import { useNavigate, useParams } from "react-router-dom";
// import { Pencil, Image, MapPin, Tag } from "lucide-react";

// const EditPost = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     title: "",
//     content: "",
//     category: "daily",
//     location: "",
//     images: "",
//   });

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const { data } = await api.get(`/posts/${id}`);
//         setForm({
//           title: data.title,
//           content: data.content,
//           category: data.category,
//           location: data.location || "",
//           images: data.images.join(","),
//         });
//       } catch (error) {
//         console.error("Error loading post:", error);
//       }
//     };
//     fetchPost();
//   }, [id]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       await api.put(
//         `/posts/${id}`,
//         {
//           ...form,
//           images: form.images ? form.images.split(",") : [],
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       navigate("/posts");
//     } catch (error) {
//       console.error("Error updating post:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center p-6 relative overflow-hidden">
      
//       {/* Floating icons */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-10 left-12 opacity-20 animate-bounce">
//           <Pencil size={40} className="text-yellow-300" />
//         </div>
//         <div className="absolute top-1/4 right-16 opacity-20 animate-pulse">
//           <Image size={50} className="text-orange-300" />
//         </div>
//         <div className="absolute top-1/2 left-20 opacity-20 animate-bounce">
//           <MapPin size={35} className="text-green-300" />
//         </div>
//         <div className="absolute top-3/4 right-10 opacity-20 animate-pulse">
//           <Tag size={40} className="text-pink-300" />
//         </div>
//       </div>

//       {/* Main card */}
//       <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300">
//         <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Edit Post</h1>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             name="title"
//             value={form.title}
//             onChange={handleChange}
//             placeholder="Title"
//             className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition"
//             required
//           />
//           <textarea
//             name="content"
//             value={form.content}
//             onChange={handleChange}
//             placeholder="Content"
//             className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition"
//             rows="5"
//             required
//           />
//           <select
//             name="category"
//             value={form.category}
//             onChange={handleChange}
//             className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition"
//           >
//             <option value="daily">Daily</option>
//             <option value="news">News</option>
//             <option value="community">Community</option>
//           </select>
//           <input
//             name="location"
//             value={form.location}
//             onChange={handleChange}
//             placeholder="Location"
//             className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition"
//           />
//           <input
//             name="images"
//             value={form.images}
//             onChange={handleChange}
//             placeholder="Image URLs (comma separated) or n/a"
//             className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none transition"
//           />
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
//           >
//             Update Post
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditPost;


import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Tag, X, Camera, ArrowLeft } from "lucide-react";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "daily",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [maxSizeMB] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/posts/${id}`);
        
        setForm({
          title: data.title,
          content: data.content,
          category: data.category,
          location: data.location || "",
        });
        
        // Handle existing images
        if (data.images && data.images.length > 0) {
          setExistingImages(data.images);
        }
      } catch (error) {
        console.error("Error loading post:", error);
        alert("Failed to load post. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Validate file types and size
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file. Please select PNG, JPG, or JPEG files.`);
        return false;
      }
      
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`${file.name} is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed is ${maxSizeMB}MB.`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    // Check total number of images
    if (existingImages.length + selectedImages.length + validFiles.length > 10) {
      alert(`You can upload a maximum of 10 images. You already have ${existingImages.length + selectedImages.length} images.`);
      return;
    }
    
    // Add to selected images
    setSelectedImages(prev => [...prev, ...validFiles]);
    
    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleImageRemove = (index, type) => {
    if (type === 'new') {
      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(imagePreviews[index]);
      
      const newImages = selectedImages.filter((_, i) => i !== index);
      const newPreviews = imagePreviews.filter((_, i) => i !== index);
      
      setSelectedImages(newImages);
      setImagePreviews(newPreviews);
    } else if (type === 'existing') {
      // Remove existing image
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.content.trim()) newErrors.content = "Content is required";
    if (form.content.length < 10) newErrors.content = "Content should be at least 10 characters";
    if (!form.location.trim()) newErrors.location = "Location is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to edit a post.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('category', form.category);
      formData.append('location', form.location);
      
      // Add existing images (as string array)
      existingImages.forEach(image => {
        formData.append('existingImages', image);
      });
      
      // Add new image files
      selectedImages.forEach((image, index) => {
        formData.append(`newImages`, image);
      });

      await api.put(
        `/api/posts/${id}`,
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      navigate("/posts");
    } catch (error) {
      console.error("Error updating post:", error);
      alert(error.response?.data?.message || "Failed to update post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
        </div>

        {/* Main form card */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="What's your post about?"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Share your thoughts, ideas, or news..."
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                  errors.content ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
              <p className="mt-1 text-sm text-gray-500">
                {form.content.length} characters (minimum 10 required)
              </p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="daily">Daily Life</option>
                  <option value="news">News & Updates</option>
                  <option value="community">Community Events</option>
                  <option value="questions">Questions</option>
                  <option value="announcements">Announcements</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Where is this relevant? (e.g., New York, Online, Campus)"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                    errors.location ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
              </div>
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images (Optional)
              </label>
              
              {/* File input (hidden) */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                multiple
                className="hidden"
              />
              
              {/* Upload button */}
              <button
                type="button"
                onClick={triggerFileInput}
                className="w-full bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center transition-colors mb-4"
              >
                <Camera className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-600 font-medium">Add more images</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG up to {maxSizeMB}MB each</p>
              </button>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Existing preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageRemove(index, 'existing')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          aria-label="Remove image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">New Images to Add:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`New item preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageRemove(index, 'new')}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          aria-label="Remove image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                          {selectedImages[index].name}
                        </div>
                        <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          {(selectedImages[index].size / (1024 * 1024)).toFixed(1)}MB
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/posts")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Update Post"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;