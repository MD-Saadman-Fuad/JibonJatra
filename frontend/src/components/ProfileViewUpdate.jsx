import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileViewUpdate({ user, onUpdate }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', address: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Not logged in');
      return;
    }

    if (form.password.trim() && form.password !== form.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);

    const updateData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address
    };
    if (form.password.trim()) updateData.password = form.password;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE || "https://jibonjatra.onrender.com/api"}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        const errData = await res.json();
        setMessage(errData.message || 'Update failed');
        setLoading(false);
        return;
      }

      const updatedUser = await res.json();
      setMessage('Profile updated successfully');
      setForm((f) => ({ ...f, password: '', confirmPassword: '' }));

      if (updateData.password) {
        localStorage.removeItem('token');
        alert('Password changed successfully. Please log in again.');
        navigate('/');
      } else {
        if (onUpdate) onUpdate(updatedUser);
      }
    } catch {
      setMessage('Error updating profile');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      {message && <p className="text-red-600">{message}</p>}
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="w-full p-2 border rounded" />
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded" />
      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="New password (leave blank to keep)" className="w-full p-2 border rounded" />
      <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter new password" className="w-full p-2 border rounded" />
      <input name="phone" type="text" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded" />
      <input name="address" type="text" value={form.address} onChange={handleChange} placeholder="Address" className="w-full p-2 border rounded" />
      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50">
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
