import React, { useState, useEffect } from 'react';
import { sponsoredAPI } from '../api/sponsored';
import { getImageUrl } from '../api/client';
import { Plus, Edit, Trash2, Image, Calendar, Star, Search } from 'lucide-react';

export default function AdminSponsoredPosts() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    title: '',
    content: '',
    endDate: '',
    priority: '1',
    image: null
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await sponsoredAPI.getAllSponsoredPosts();
      setPosts(res.data.data || []);
      setFilteredPosts(res.data.data || []);

      // Debug: log all posts with image info
      if (res.data.data && res.data.data.length > 0) {
        console.log('Admin - All sponsored posts:', res.data.data.map(post => ({
          title: post.title,
          image: post.image,
          imageUrl: post.image ? getImageUrl(post.image) : 'No image'
        })));
      }
    } catch (err) {
      console.error('Failed to load sponsored posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredPosts(posts);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = posts.filter(post =>
      post.title?.toLowerCase().includes(term) ||
      post.content?.toLowerCase().includes(term)
    );

    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('endDate', form.endDate);
      formData.append('priority', form.priority);
      if (form.image) formData.append('images', form.image);

      if (editingId) {
        await sponsoredAPI.updateSponsoredPost(editingId, formData);
      } else {
        await sponsoredAPI.createSponsoredPost(formData);
      }

      resetForm();
      await fetchPosts();
    } catch (err) {
      console.error('Failed to save sponsored post:', err);
    }
  };

  const handleEdit = (post) => {
    setForm({
      title: post.title,
      content: post.content,
      endDate: post.endDate ? post.endDate.split('T')[0] : '',
      priority: post.priority.toString(),
      image: null
    });
    setEditingId(post._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sponsored post?')) return;
    try {
      await sponsoredAPI.deleteSponsoredPost(id);
      await fetchPosts();
    } catch (err) {
      console.error('Failed to delete sponsored post:', err);
    }
  };

  const resetForm = () => {
    setForm({ title: '', content: '', endDate: '', priority: '1', image: null });
    setEditingId(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = (endDate) => {
    return new Date(endDate) < new Date();
  };

  if (loading) return <p className="p-4 text-center text-gray-600">Loading sponsored posts...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col items-center justify-start p-6 relative overflow-hidden">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute animate-bounce top-10 left-10 opacity-20">
          <Star size={40} className="text-purple-300" />
        </div>
        <div className="absolute animate-pulse top-1/4 right-16 opacity-20">
          <Image size={50} className="text-blue-300" />
        </div>
        <div className="absolute animate-bounce top-1/2 left-20 opacity-20">
          <Calendar size={35} className="text-pink-300" />
        </div>
      </div>

      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">

        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-8 text-center relative">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Star className="text-purple-600" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Sponsored Posts</h1>
            <p className="text-blue-100">Manage featured content (Admin Only)</p>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search sponsored posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200"
          >
            <Plus size={20} />
            {showForm ? 'Cancel' : 'New Sponsored Post'}
          </button>
        </div>

        <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600 border-b">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
          {searchTerm && ` matching "${searchTerm}"`}
        </div>

        {showForm && (
          <div className="p-6 bg-blue-50 border-b">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority (1-10)</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter content"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                <input
                  type="date"
                  required
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  {editingId ? 'Update Post' : 'Create Post'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 text-lg">
                  {searchTerm ? "No sponsored posts match your search" : "No sponsored posts yet"}
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post._id} className={`bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${isExpired(post.endDate) ? 'opacity-70' : ''
                  }`}>
                  {post.image && (
                    <img
                      src={getImageUrl(post.image)}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-lg mb-3"
                      onError={(e) => {
                        console.error('Image failed to load:', e.target.src);
                        e.target.style.display = 'none';
                      }}
                    />
                  )}

                  <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>

                  <div className="space-y-1 text-xs text-gray-500">
                    <p>Priority: <span className="font-medium">{post.priority}</span></p>
                    <p>Ends: <span className="font-medium">{formatDate(post.endDate)}</span></p>
                    <p>Status:
                      <span className={`font-medium ml-1 ${!isExpired(post.endDate)
                          ? 'text-green-600'
                          : 'text-red-600'
                        }`}>
                        {!isExpired(post.endDate) ? 'Active' : 'Expired'}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4 flex-wrap">
                    <button
                      onClick={() => handleEdit(post)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Edit size={14} /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(post._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}