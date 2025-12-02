

import { useEffect, useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, Heart, Laptop, ShoppingBag, Home } from "lucide-react";

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

      // If we already have user data from props, use it
      if (userProp && userProp.id) {
        setLocalUser(userProp);
        return;
      }

      try {
        const res = await api.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Profile API response:', res.data); // Debug log
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
  }, []); // Remove dependencies to prevent infinite loop


  if (!user) return <p className="p-4 text-center text-gray-600">Loading profile...</p>;


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6 relative overflow-hidden">

      {/* Floating background icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute animate-bounce top-10 left-12 opacity-20">
          <User size={40} className="text-blue-300" />
        </div>
        <div className="absolute animate-pulse top-1/4 right-16 opacity-20">
          <Shield size={50} className="text-green-300" />
        </div>
        <div className="absolute animate-bounce top-1/2 left-20 opacity-20">
          <Laptop size={35} className="text-yellow-300" />
        </div>
        <div className="absolute animate-pulse top-3/4 right-10 opacity-20">
          <Heart size={40} className="text-purple-300" />
        </div>
        <div className="absolute animate-bounce top-3/5 left-1/2 opacity-20">
          <ShoppingBag size={35} className="text-pink-300" />
        </div>
        <div className="absolute animate-pulse top-2/5 right-1/4 opacity-20">
          <Home size={40} className="text-teal-300" />
        </div>
      </div>

      {/* Main card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-8 text-center relative">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <User className="text-green-600" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
            <p className="text-blue-100">View your account details</p>
          </div>
        </div>

        {/* Profile info */}
        <div className="p-8 space-y-4">

          <div className="flex items-center bg-gray-50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <User className="text-blue-500 mr-4" size={24} />
            <div>
              <p className="text-gray-500 text-sm">Full Name</p>
              <p className="font-semibold text-gray-800">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center bg-gray-50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <Mail className="text-green-500 mr-4" size={24} />
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-semibold text-gray-800">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center bg-gray-50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <Shield className="text-purple-500 mr-4" size={24} />
            <div>
              <p className="text-gray-500 text-sm">Role</p>
              <p className="font-semibold text-gray-800">{user.role}</p>
            </div>
          </div>

          {/* <div className="flex items-center bg-gray-50 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
            <Laptop className="text-yellow-500 mr-4" size={24} />
            <div>
              <p className="text-gray-500 text-sm">Device</p>
              <p className="font-semibold text-gray-800">{navigator.userAgent}</p>
            </div>
          </div> */}

          {/* Buttons */}
          <button
            className="w-full py-3 rounded-xl font-semibold text-white text-lg transition-all duration-300 transform bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105"
            onClick={() => navigate("/profile/edit")}
          >
            Edit Profile
          </button>

          <button
            className="w-full py-3 rounded-xl font-semibold text-white text-lg transition-all duration-300 transform bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              setLocalUser(null);
              if (setUser) {
                setUser(null);
              }
              navigate("/login");
            }}
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}
