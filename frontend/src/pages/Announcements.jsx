import React, { useEffect, useState } from "react";
import { getAnnouncements, markAnnouncementViewed } from "../api/announcements";

const UserAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const res = await getAnnouncements();
        setAnnouncements(res.data || []);
      } catch (err) {
        console.error("Failed to fetch announcements", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900">Announcements</h1>

      {loading && <p className="text-center text-gray-500">Loading announcements...</p>}

      {announcements.length === 0 && !loading && (
        <p className="text-center text-gray-500 text-lg">No announcements yet.</p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {announcements.map((a) => (
          <div
            key={a._id}
            className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-blue-600 mb-2">{a.title}</h3>
            <button
              type="button"
              className="w-1/4 py-3 rounded-xl font-semibold text-white text-lg transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              onClick={async () => {
                try {
                  await markAnnouncementViewed(a._id);
                } catch (err) {
                  console.error("Failed to mark as viewed", err);
                }
              }}
            >
              Viewed
            </button>

            </div>
            <p className="text-gray-700 mb-4">{a.message}</p>
            <div className="flex flex-wrap gap-2 text-sm text-gray-500">
              {a.publishedDate && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1">
                  Publish: {new Date(a.publishedDate).toLocaleDateString()}
                </span>
              )}
              {a.eventDate && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                  Event Date: {new Date(a.eventDate).toLocaleDateString()}
                </span>
              )}
              {a.location && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center gap-1">
                  📍 {a.location}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserAnnouncements;
