import { useEffect, useState } from "react";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../api/announcements";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({ title: "", message: "", eventDate: "", location: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAnnouncements();
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error("Failed to load announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        publishedDate: editingId ? undefined : new Date().toISOString(),
      };
      if (editingId) {
        await updateAnnouncement(editingId, payload);
      } else {
        await createAnnouncement(payload);
      }
      setForm({ title: "", message: "", eventDate: "", location: "" });
      setEditingId(null);
      await loadData();
    } catch (err) {
      console.error("Failed to save announcement:", err);
    }
  };

  const handleEdit = (a) => {
    setForm({
      title: a.title,
      message: a.message,
      eventDate: a.eventDate ? a.eventDate.split("T")[0] : "",
      location: a.location || "",
    });
    setEditingId(a._id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteAnnouncement(id);
      await loadData();
    } catch (err) {
      console.error("Failed to delete announcement:", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Manage Announcements</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-10 bg-gradient-to-r from-white to-gray-50 shadow-xl rounded-2xl p-6 space-y-5 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-700">{editingId ? "Edit Announcement" : "Create New Announcement"}</h2>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-600">Title</label>
          <input
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Enter title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium text-gray-600">Description / Message</label>
          <textarea
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
            placeholder="Enter announcement details"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1 flex flex-col">
            <label className="mb-1 font-medium text-gray-600">Event Date</label>
            <input
              type="date"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            />
          </div>
          <div className="flex-1 flex flex-col mt-4 md:mt-0">
            <label className="mb-1 font-medium text-gray-600">Location</label>
            <input
              className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Event location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition w-full"
          disabled={loading}
        >
          {editingId ? "Update Announcement" : "Create Announcement"}
        </button>
      </form>

      {/* Announcements List */}
      {loading && <p className="text-center text-gray-500">Loading announcements...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((a) => (
          <div
            key={a._id}
            className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition flex flex-col justify-between"
          >
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{a.title}</h3>
              <p className="text-gray-600 mt-2">{a.message}</p>
              {a.publishedDate && (
                <p className="text-gray-500 mt-2 text-sm">
                  📰 Published: {new Date(a.publishedDate).toLocaleString()}
                </p>
              )}
              {a.eventDate && (
                <p className="text-gray-500 mt-1 text-sm">
                  📅 Event Date: {new Date(a.eventDate).toLocaleDateString()}
                </p>
              )}
              {a.location && (
                <p className="text-gray-500 mt-1 text-sm">
                  📍 Location: {a.location}
                </p>
              )}


                {Array.isArray(a.viewedBy) && a.viewedBy.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-blue-700 mb-2">Viewed By:</h4>
                    <ul className="list-disc pl-5">
                      {a.viewedBy.map((user) => (
                        <li key={user._id || user.name} className="text-gray-700">
                          {user.name || "Unknown User"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>

            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => handleEdit(a)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl shadow-md transition flex-1"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(a._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-md transition flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
