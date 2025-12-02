import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import image from "../assets/logo-transparant.png";
import {
  User, Mail, Lock, ShoppingBag, Wrench, Home, Search, Hammer, Zap, Car, Package,
  Recycle, Heart, Phone, MapPin, Coffee, Scissors, PaintBucket, Laptop, Camera,
  Gift, Star, Shield, Truck, CreditCard, Clock, Globe, Lightbulb, Key, Coins,
  Handshake, Building, Briefcase, Gamepad2, Music, Book, Utensils, Shirt, Watch,
  Headphones, Bike, UserPlus, ArrowRight, Sparkles
} from "lucide-react";

export default function Login({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  // Clean, organized icon configuration for floating background
  const floatingIcons = [
    // Professional & business
    { Icon: Building, color: "text-slate-400", size: 32 },
    { Icon: Briefcase, color: "text-blue-400", size: 30 },
    { Icon: Handshake, color: "text-green-400", size: 34 },
    { Icon: Key, color: "text-yellow-500", size: 28 },
    { Icon: Shield, color: "text-blue-500", size: 31 },

    // Shopping & commerce
    { Icon: ShoppingBag, color: "text-purple-400", size: 33 },
    { Icon: Gift, color: "text-red-400", size: 29 },
    { Icon: CreditCard, color: "text-indigo-400", size: 30 },
    { Icon: Coins, color: "text-yellow-400", size: 27 },
    { Icon: Truck, color: "text-gray-400", size: 35 },

    // Services & tools
    { Icon: Wrench, color: "text-orange-400", size: 31 },
    { Icon: Hammer, color: "text-stone-400", size: 29 },
    { Icon: Scissors, color: "text-pink-400", size: 26 },
    { Icon: PaintBucket, color: "text-purple-500", size: 32 },
    { Icon: Camera, color: "text-teal-400", size: 30 },

    // Tech & communication
    { Icon: Laptop, color: "text-blue-500", size: 34 },
    { Icon: Phone, color: "text-green-500", size: 27 },
    { Icon: Globe, color: "text-blue-400", size: 33 },
    { Icon: Zap, color: "text-yellow-400", size: 25 },
    { Icon: Lightbulb, color: "text-amber-400", size: 28 },

    // Lifestyle & community
    { Icon: Home, color: "text-emerald-400", size: 31 },
    { Icon: Car, color: "text-blue-600", size: 36 },
    { Icon: Coffee, color: "text-amber-500", size: 29 },
    { Icon: Heart, color: "text-red-500", size: 26 },
    { Icon: Star, color: "text-yellow-500", size: 28 },

    // Entertainment & hobbies
    { Icon: Music, color: "text-purple-400", size: 30 },
    { Icon: Gamepad2, color: "text-indigo-500", size: 32 },
    { Icon: Book, color: "text-blue-400", size: 28 },
    { Icon: Headphones, color: "text-slate-500", size: 33 },
    { Icon: Bike, color: "text-green-400", size: 31 }
  ];

  const generateRandomPosition = (index) => {
    const positions = [
      "top-12 left-12", "top-20 right-16", "top-32 left-1/4", "bottom-32 right-1/4",
      "top-1/4 right-12", "bottom-1/4 left-12", "top-1/2 left-16", "bottom-1/2 right-16",
      "top-16 left-1/3", "bottom-16 right-1/3", "top-40 left-2/3", "bottom-40 right-2/3",
      "top-8 right-1/2", "bottom-8 left-1/2", "top-1/3 left-20", "bottom-1/3 right-20",
      "top-2/3 left-10", "bottom-2/3 right-10", "top-24 right-1/4", "bottom-24 left-1/4",
      "top-48 left-3/4", "bottom-48 right-3/4", "top-6 left-1/2", "bottom-6 right-1/2"
    ];
    return positions[index % positions.length];
  };

  // Check for saved user and redirect
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const userObj = JSON.parse(savedUser);
      navigate(userObj.role === "admin" ? "/admin/users" : "/profile");
    }
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", formData);
      localStorage.setItem("token", response.data.token);

      // Decode JWT payload
      const payload = JSON.parse(atob(response.data.token.split(".")[1]));
      const loggedInUser = {
        email: payload.email,
        role: payload.role,
        id: payload.id
      };

      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);

      navigate(loggedInUser.role === "admin" ? "/feed" : "/feed");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Floating Background Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingIcons.map((item, index) => {
          const { Icon, color, size } = item;
          const animations = ['animate-bounce', 'animate-pulse', 'animate-spin'];
          const animation = animations[index % 3];
          const duration = `${2 + (index % 3)}s`;
          const delay = `${(index * 0.4)}s`;

          return (
            <div
              key={index}
              className={`absolute ${generateRandomPosition(index)} ${color} opacity-25 ${animation} hover:opacity-45 transition-opacity duration-300`}
              style={{
                animationDuration: duration,
                animationDelay: delay,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            >
              <Icon size={size} />
            </div>
          );
        })}
      </div>

      {/* Main Login Container */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 p-8 text-center relative">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <img className="w-12 h-12" src={image} alt="Logo" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <Star size={20} className="text-yellow-300" />
                Welcome Back!
                <Star size={20} className="text-yellow-300" />
              </h1>
              <p className="text-blue-100 flex items-center justify-center gap-2">
                <Globe size={16} />
                Your daily marketplace awaits
                <Sparkles size={16} />
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <h1 className="text-center text-xl font-semibold mb-4">Enter These Credentials</h1>

            {/* Email Input */}
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" size={20} />
              <input
                type="email"
                placeholder="admin@gmail.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Globe className="text-gray-300 group-focus-within:text-blue-400" size={16} />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-200" size={20} />
              <input
                type="password"
                placeholder="admin"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Shield className="text-gray-300 group-focus-within:text-purple-400" size={16} />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white text-lg transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <User size={20} />
              Sign In
              <ArrowRight size={20} />
            </button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors duration-200 flex items-center justify-center gap-1"
              >
                <Key size={14} />
                Forgot your password?
              </button>
            </div>
          </form>

          {/* Register Link */}
          <div className="px-8 pb-8">
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-gray-500 text-sm flex items-center gap-2">
                <Sparkles size={14} />
                New here?
                <UserPlus size={14} />
              </span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              Create Account
              <ArrowRight size={18} />
            </button>

            {/* Footer decorative elements */}
            <div className="mt-6 flex justify-center items-center gap-4 text-gray-300">
              <Shield size={16} />
              <Heart size={16} />
              <Star size={16} />
              <Globe size={16} />
              <Sparkles size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}