import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { 
  User, Mail, Lock, Users, UserPlus,
  ShoppingBag, Wrench, Hammer, Zap, Car, Package, Heart, Phone, MapPin,
  Coffee, Scissors, Laptop, Camera, Gift, Star, Shield, Truck,
  Clock, Globe, Lightbulb, Key, Handshake, Building, Briefcase,
  Music, Home, Store, 
  Crown, ArrowRight, Sparkles, Target, Award
} from "lucide-react";

export default function Register({ setUser }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: ""
  });
  const navigate = useNavigate();

  // Clean, organized icon configuration
  const floatingIcons = [
    // Essential service icons
    { Icon: ShoppingBag, color: "text-blue-400", size: 32 },
    { Icon: Coffee, color: "text-amber-400", size: 28 },
    { Icon: Wrench, color: "text-gray-400", size: 30 },
    { Icon: Car, color: "text-blue-500", size: 34 },
    { Icon: Heart, color: "text-red-400", size: 26 },
    { Icon: Camera, color: "text-purple-400", size: 29 },
    { Icon: Scissors, color: "text-pink-400", size: 27 },
    { Icon: Laptop, color: "text-teal-400", size: 33 },
    { Icon: Music, color: "text-indigo-400", size: 31 },
    { Icon: Gift, color: "text-red-500", size: 28 },
    
    // Professional tools
    { Icon: Hammer, color: "text-orange-400", size: 30 },
    { Icon: Package, color: "text-brown-400", size: 32 },
    { Icon: Truck, color: "text-gray-500", size: 35 },
    { Icon: Building, color: "text-slate-400", size: 36 },
    { Icon: Briefcase, color: "text-blue-600", size: 29 },
    
    // Lifestyle & services
    { Icon: Phone, color: "text-green-400", size: 26 },
    { Icon: MapPin, color: "text-red-500", size: 25 },
    { Icon: Clock, color: "text-orange-500", size: 28 },
    { Icon: Key, color: "text-yellow-500", size: 27 },
    { Icon: Shield, color: "text-blue-500", size: 31 },
    
    // Tech & modern
    { Icon: Zap, color: "text-yellow-400", size: 24 },
    { Icon: Globe, color: "text-blue-400", size: 33 },
    { Icon: Lightbulb, color: "text-yellow-500", size: 29 },
    { Icon: Star, color: "text-amber-400", size: 26 },
    { Icon: Target, color: "text-red-400", size: 30 },
    
    // Community & social
    { Icon: Users, color: "text-teal-400", size: 32 },
    { Icon: Handshake, color: "text-green-500", size: 34 },
    { Icon: Award, color: "text-yellow-600", size: 28 },
    { Icon: Crown, color: "text-yellow-500", size: 31 },
    { Icon: Sparkles, color: "text-purple-400", size: 25 }
  ];

  const generateRandomPosition = (index) => {
    const positions = [
      "top-10 left-10", "top-20 right-20", "top-32 left-1/4", "bottom-32 right-1/4",
      "top-1/4 right-10", "bottom-1/4 left-10", "top-1/2 left-20", "bottom-1/2 right-20",
      "top-16 left-1/3", "bottom-16 right-1/3", "top-40 left-2/3", "bottom-40 right-2/3",
      "top-8 right-1/2", "bottom-8 left-1/2", "top-1/3 left-16", "bottom-1/3 right-16",
      "top-2/3 left-8", "bottom-2/3 right-8", "top-12 right-1/4", "bottom-12 left-1/4",
      "top-24 left-3/4", "bottom-24 right-3/4", "top-48 left-12", "bottom-48 right-12",
      "top-6 left-1/2", "bottom-6 right-1/2", "top-1/2 left-6", "bottom-1/2 right-6"
    ];
    return positions[index % positions.length];
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register", formData);
      const { token, user: registeredUser } = response.data;
      
      localStorage.setItem("token", token);
      
      let loggedInUser = registeredUser;
      if (!loggedInUser) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        loggedInUser = {
          id: payload.id,
          role: payload.role || formData.role,
          name: payload.name || formData.name,
          email: payload.email || formData.email
        };
      }

      localStorage.setItem("user", JSON.stringify(loggedInUser));
      if (typeof setUser === 'function') {
        setUser(loggedInUser);
      }
      navigate("/feed");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  const getRoleIcon = (role) => {
    const roleIcons = {
      resident: { Icon: Home, color: "text-blue-500" },
      shopkeeper: { Icon: Store, color: "text-green-500" },
      "service provider": { Icon: Wrench, color: "text-orange-500" },
      homeowner: { Icon: Building, color: "text-purple-500" },
      admin: { Icon: Crown, color: "text-red-500" }
    };
    return roleIcons[role] || { Icon: Users, color: "text-gray-500" };
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
          const delay = `${(index * 0.5)}s`;
          
          return (
            <div
              key={index}
              className={`absolute ${generateRandomPosition(index)} ${color} opacity-30 ${animation} hover:opacity-50 transition-opacity duration-300`}
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

      {/* Main Form Container */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-8 text-center relative">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <UserPlus className="text-green-600" size={28} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Join Us Today!</h1>
              <p className="text-blue-100">Create your marketplace account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Name Input */}
            <div className="relative group">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Email Input */}
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
              <input
                type="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Phone Input */}
            <div className="relative group">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Address Input */}
            <div className="relative group">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Your address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
              />
            </div>

            {/* Role Selection */}
            <div className="relative group">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors z-10" size={20} />
              <select
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white appearance-none cursor-pointer"
              >
                <option value="">Select your role</option>
                <option value="resident">🏠 Resident</option>
                <option value="shopkeeper">🏪 Shopkeeper</option>
                <option value="service provider">🔧 Service Provider</option>
                <option value="homeowner">🏡 Home Owner</option>
                <option value="market_head">🛒 Market Head</option>
                <option value="admin">👑 Admin</option>
              </select>
              {formData.role && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {(() => {
                    const { Icon, color } = getRoleIcon(formData.role);
                    return <Icon className={color} size={16} />;
                  })()}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white text-lg transition-all duration-300 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              Create Account
              <ArrowRight size={20} />
            </button>

            {/* Login Link */}
            <div className="text-center">
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-4 text-gray-500 text-sm">Already have an account?</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Key size={18} />
                Sign In Instead
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}