import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

// Pages
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import LostFound from "./pages/LostFound";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminRoleUpdate from "./pages/AdminRoleUpdate";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Announcements from "./pages/Announcements";
import AdminAnnouncements from "./pages/AdminAnnouncements";
import ServiceList from "./pages/ServiceList";
import ServiceCreate from "./pages/ServiceCreate";
import ServiceEdit from "./pages/ServiceEdit";
import Products from "./pages/Products";
import ProductNew from "./pages/ProductNew";
import ProductEdit from "./pages/ProductEdit";
import Shop from "./pages/Shop";
import MarketList from "./pages/MarketList";
import MarketCreate from "./pages/MarketCreate";
import MarketEdit from "./pages/MarketEdit";
import Feed from './pages/Feed';
import ServiceDetail from "./pages/ServiceDetail";
import AdminDashboard from "./pages/AdminDashboard";
// 🔽 ADD THESE TWO IMPORTS
import SponsoredPosts from './pages/SponsoredPosts';
import AdminSponsoredPosts from './pages/AdminSponsoredPosts';

import HomeRent from './pages/HomeRent';
import CreateHomeRent from './pages/CreateHomeRental';

// Protected Route Component
const ProtectedRoute = ({ children, user, adminOnly = false }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/posts" replace />;
  return children;
};

function App() {
  const [token] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes inside Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Layout user={user} setUser={setUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/posts" replace />} />

          {/* Main Routes */}
          <Route path="posts" element={<Posts />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="edit/:id" element={<EditPost />} />
          <Route path="profile" element={<Profile user={user} setUser={setUser} />} />
          <Route path="profile/edit" element={<ProfileEdit setUser={setUser} />} />
          <Route path="lostfound" element={<LostFound user={user} />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="shop" element={<Shop user={user} />} />
          <Route path="services" element={<ServiceList token={user?.token} user={user} />} />
          <Route path="services/create" element={<ServiceCreate token={user?.token} user={user} />} />
          <Route path="services/edit/:id" element={<ServiceEdit token={user?.token} user={user} />} />
          <Route path="market" element={<MarketList user={user} />} />
          <Route path="market/create" element={<MarketCreate user={user} />} />
          <Route path="market/edit/:id" element={<MarketEdit user={user} />} />
          <Route path="/services/:id" element={<ServiceDetail token={token} user={user} />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/home-rent" element={<HomeRent />} />
          <Route path="/home-rent/create" element={<CreateHomeRent />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute user={user} adminOnly={true}>
                <AdminDashboard role={user?.role} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />

          {/* 🔽 ADD THESE TWO ROUTES */}
          <Route path="sponsored-posts" element={<SponsoredPosts />} />
          <Route
            path="admin/sponsored-posts"
            element={
              <ProtectedRoute user={user} adminOnly={true}>
                <AdminSponsoredPosts />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="admin/users"
            element={
              <ProtectedRoute user={user} adminOnly={true}>
                <AdminUserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/roles"
            element={
              <ProtectedRoute user={user} adminOnly={true}>
                <AdminRoleUpdate />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/announcements"
            element={
              <ProtectedRoute user={user} adminOnly={true}>
                <AdminAnnouncements />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Products */}
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductNew />} />
        <Route path="products/:id/edit" element={<ProductEdit />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;