import { useEffect, useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, Phone, Edit3, LogOut } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function Profile({ user: userProp, setUser }) {
  const [user, setLocalUser] = useState(userProp);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      if (userProp && userProp.id) {
        setLocalUser(userProp);
        return;
      }

      try {
        const res = await api.get("/profile");
        setLocalUser(res.data);
        if (setUser) {
          setUser(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        navigate("/posts");
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  const getUserInitials = () => {
    const name = user.name || user.email || "User";
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Navigation */}
          <div className="hidden lg:block lg:col-span-3 sticky top-20">
            <Sidebar user={user} />
          </div>

          {/* Profile Content */}
          <div className="lg:col-span-9 max-w-2xl mx-auto w-full space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
              {/* Cover Banner */}
              <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
                <div className="absolute -bottom-10 left-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 text-white font-black text-2xl flex items-center justify-center border-4 border-white shadow-md">
                    {getUserInitials()}
                  </div>
                </div>
              </div>

              {/* Header Info */}
              <div className="pt-12 px-6 pb-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{user.name || "Community Member"}</h1>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <span className="inline-block mt-1.5 px-3 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                      {user.role || "Resident"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate("/profile/edit")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Edit3 size={14} />
                      <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        setLocalUser(null);
                        if (setUser) setUser(null);
                        navigate("/login");
                      }}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-full transition-all flex items-center gap-1.5"
                    >
                      <LogOut size={14} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Full Name</p>
                      <p className="font-bold text-gray-800">{user.name || "N/A"}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      <Mail size={16} />
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Email Address</p>
                      <p className="font-bold text-gray-800">{user.email || "N/A"}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                      <Shield size={16} />
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Account Role</p>
                      <p className="font-bold text-gray-800 capitalize">{user.role || "Resident"}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Phone Contact</p>
                      <p className="font-bold text-gray-800">{user.phone || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
